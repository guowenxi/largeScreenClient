import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Icon} from "antd";
import axios from "axios";
import {arcGisUrl, emergencyUrl} from "../../config";
import {loadModules} from "esri-loader";
import HlsVideo from "./hlsVideo";
import mapPoint from "./images/point.svg";
import cameraPoint from "./images/camera.svg";

export default class Situation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.id = (new Date()).getTime();
        this.hlsUrl = [
            'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            'https://test-streams.mux.dev/test_001/stream.m3u8',
            'https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8',
            // 'https://test-streams.mux.dev/issue666/playlists/cisq0gim60007xzvi505emlxx.m3u8',
            // 'https://test-streams.mux.dev/bbbAES/playlists/sample_aes/index.m3u8',
            // 'https://test-streams.mux.dev/pts_shift/master.m3u8'
        ];
        this.hlsList = [];
        this.nowPlayIndex = 0;
        this.nowPlayHlsUrlIndex = 0;
        this.videoNum = 4;
    }

    //组件加载触发函数
    componentDidMount() {
        this.initMap();
        for(let i = 0;i < this.videoNum;i++){
            this.hlsList.push({});
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props detailId变更时更新事件及监控点
    componentDidUpdate(prevProps){
        if(prevProps.detailId !== this.props.detailId && prevProps.detailId && this.props.detailId){
            this.loadEventPoint();
        }
    }

    //初始化地图
    initMap(){
        const mapURL = {
            url : arcGisUrl + "/arcgis_js_api/init.js",
            css : arcGisUrl + "/arcgis_js_api/esri/css/esri.css"
        };
        loadModules([
            "esri/map",
            "esri/SpatialReference",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/geometry/Extent",
            "esri/geometry/Circle",
            "tdlib/TDTAnnoLayer",
            "tdlib/TDTLayer",
            "tdlib/ZTLayer",
            "esri/layers/VectorTileLayer",
            "esri/dijit/Popup",
            "dojo/dom-construct",
            "dojo/domReady!"
        ], mapURL).then(([Map,SpatialReference,ArcGISTiledMapServiceLayer,Extent,Circle,TDTAnnoLayer,TDTLayer,ZTLayer,VectorTileLayer,Popup,domConstruct])=>{
            //定义地图
            this.map = new Map('mapDiv_'+this.id, {
                logo: false,
                slider: false,
                showLabels: true,
                // eslint-disable-next-line no-undef
                center: new esri.geometry.Point(120.64838041, 27.78176691),//瑞安
                // eslint-disable-next-line no-undef
                // center: new esri.geometry.Point(120.98185659, 28.11547046),//乐清
                zoom: 11,
                infoWindow: new Popup({ anchor:"top"},domConstruct.create("div"))
            });
            // let baseMap = new TDTLayer();
            // this.map.addLayer(baseMap);
            // let annolayer = new TDTAnnoLayer();
            // this.map.addLayer(annolayer);
            let vtlayer = new VectorTileLayer("https://services.wzmap.gov.cn/server/rest/services/Hosted/DSJ/VectorTileServer");
            this.map.addLayer(vtlayer);
            // eslint-disable-next-line no-undef
            this.graphicsLayer = new esri.layers.GraphicsLayer();
            this.graphicsLayer.on('click',this.cameraClick.bind(this));
            this.map.addLayer(this.graphicsLayer,1);
            //加载事件点
            this.loadEventPoint();
        });
    }

    loadEventPoint(){
        this.graphicsLayer.clear();
        const {handingStudy} = this.props;
        //加载事件点位信息
        if(handingStudy.studyLng && handingStudy.studyLat){
            // eslint-disable-next-line no-undef
            const geometry = new esri.geometry.Point(handingStudy.studyLng,handingStudy.studyLat);
            // eslint-disable-next-line no-undef
            const symbol = new esri.symbol.PictureMarkerSymbol(mapPoint, 40, 50);
            symbol.setOffset(0,25);
            // eslint-disable-next-line no-undef
            this.graphicsLayer.add(new esri.Graphic(geometry,symbol));
            this.map.centerAndZoom(geometry,this.map.getMaxZoom());
            //加载事件周围监控点位
            this.loadCamera();
        }
    }

    loadCamera(){
        const {handingStudy} = this.props;
        const sendData = {
            rbacToken:this.props.token,
            x:handingStudy.studyLng,
            y:handingStudy.studyLat,
            distance:0.01
        };
        const cameraUrl = emergencyUrl + "/socialGovernance/hikVideo/getVideoNearbySqrt";
        // const cameraUrl = "./json/ruian/camera.json";
        axios.get(cameraUrl,{params:sendData}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                result.forEach((point)=>{
                    // eslint-disable-next-line no-undef
                    const geometry = new esri.geometry.Point(point.x,point.y);
                    // eslint-disable-next-line no-undef
                    const symbol = new esri.symbol.PictureMarkerSymbol(cameraPoint, 40, 50);
                    symbol.setOffset(0,25);
                    // eslint-disable-next-line no-undef
                    this.graphicsLayer.add(new esri.Graphic(geometry,symbol,point));
                });
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    cameraClick(e){
        const { attributes } = e.graphic;
        if(attributes && attributes.id){
            let hasFind = false;
            //查找所点监控是否已有在播放
            for(let i = 0;i < this.hlsList.length;i ++){
                if(this.hlsList[i].id === attributes.id){
                    hasFind = true;
                    this.nowPlayIndex = i;
                    this.setState({});
                    break;
                }
            }
            if(!hasFind){
                //获取hls流
                const hlsUrl = emergencyUrl + "/socialGovernance/hikVideo/getVideoStreamById";
                // const hlsUrl = "./json/ruian/hls.json";
                axios.get(hlsUrl,{params:{rbacToken:this.props.token,id:attributes.id}}).then((response) => {
                    // 在这儿实现 setState
                    const result = response.data.data;
                    if(result){
                        this.playCamera(attributes.id,result);
                    }
                }).catch(function(error){
                    // 处理请求出错的情况
                });
            }
        }
    }

    playCamera(id,hlsUrl){
        this.hlsList[this.nowPlayIndex] = {id,hlsUrl};
        // this.hlsList[this.nowPlayIndex] = {id:this.nowPlayHlsUrlIndex,hlsUrl:this.hlsUrl[this.nowPlayHlsUrlIndex%this.hlsUrl.length]};
        // this.nowPlayHlsUrlIndex ++;
        this.nowPlayIndex ++;
        if(this.nowPlayIndex >= this.videoNum){
            this.nowPlayIndex = 0;
        }
        this.setState({});
    }

    closeSituation(){
        this.hlsList = [{},{},{},{}];
        this.nowPlayIndex = 0;
        this.props.hideSituation();
    }

    changePlayIndex(index){
        this.nowPlayIndex = index;
        this.setState({});
    }

    render() {
        const {show} = this.props;
        return (
            <Motion style={{opacity:spring(show ? 1 : 0)}}>
                {({opacity}) =>
                    <div style={{opacity,zIndex:show?1:-1}} className={cssStyle.situationBox}>
                        <div className={cssStyle.editHeadBox}>
                            <div>现场情况</div>
                            <Icon type="close" className={cssStyle.closeIcon} onClick={this.closeSituation.bind(this)}/>
                        </div>
                        <div className={cssStyle.situationMap} id={'mapDiv_'+this.id} />
                        <div className={cssStyle.cameraBox}>
                            {this.hlsList.map((hls,index)=>
                                <HlsVideo
                                    key={hls.id+'_'+index}
                                    id={hls.id+'_'+index}
                                    hlsUrl={hls.hlsUrl}
                                    className={cssStyle.cameraVideo}
                                    style={{borderWidth:index === this.nowPlayIndex ? '1px':'0px'}}
                                    changePlayIndex={this.changePlayIndex.bind(this,index)}
                                />
                            )}
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}