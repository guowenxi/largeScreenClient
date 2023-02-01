import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Button, Icon, Input, Modal} from "antd";
import axios from "axios";
import {arcGisUrl} from "../../config";
import {loadModules} from "esri-loader";
import HlsVideo from "./hlsVideo";
import mapPoint from "./images/point.svg";
import cameraPoint from "./images/camera.svg";
import {Scrollbars} from "react-custom-scrollbars";
import ImgList from "./imgList";
import {GPS} from "../arc_gis_map/locationChange";

export default class Situation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page:1,allPage:1,feedbackList:[],address:''};
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
        this.videoNum = 3;
        this.needResizeMap = true;
    }

    //组件加载触发函数
    componentDidMount() {
        this.initMap();
        // eslint-disable-next-line no-undef
        this.geocoder = new AMap.Geocoder({
            city: "温州",
        });
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
            this.hlsList = [{},{},{}];
            this.nowPlayIndex = 0;
            this.loadEventPoint();
            this.needResizeMap = true;
        }
        if(prevProps.show !== this.props.show && this.props.show){
            this.loadFeedback();
            if(this.needResizeMap && this.map){
                this.map.setZoom(this.map.getMaxZoom());
                this.needResizeMap = false;
            }
        }
    }

    loadFeedback(){
        const {handingStudy,emergencyUrl} = this.props;
        const sendData = {
            rbacToken:this.props.token,
            markRead:1
        };
        const feedbackUrl = emergencyUrl + "/socialGovernance/commandDispatch/queryEventHandleFeedbackList/"+handingStudy.eventId;
        axios.get(feedbackUrl,{params:sendData}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({feedbackList: result,allPage:Math.ceil(result.length/3)});
            }else{
                this.setState({feedbackList: [],allPage:1});
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
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
                center: new esri.geometry.Point(120.82128, 27.91794),//龙湾
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
        if(this.props.detail && this.props.detail.eventLocation){
            this.setState({address:this.props.detail.eventLocation});
        }else{
            this.setState({address:''});
        }
        const {handingStudy} = this.props;
        //加载事件点位信息
        if(handingStudy.longitude && handingStudy.latitude){
            this.addPoint(handingStudy.longitude,handingStudy.latitude);
        }else if(this.props.detail && this.props.detail.eventLocation){
            //若无点位信息则搜索
            this.searchAddress(this.props.detail.eventLocation);
        }
    }

    searchAddress(address){
        if(this.geocoder){
            this.geocoder.getLocation(address, (status, result) => {
                if (status === 'complete'&&result.geocodes.length) {
                    const position = result.geocodes[0].location;
                    const centerNew = GPS.gcj_decrypt_exact(position.lat,position.lng);
                    this.addPoint(centerNew.lon,centerNew.lat);
                }else{
                    Modal.error({
                        content: '根据地址查询位置失败！',
                    });
                }
            });
        }
    }

    addPoint(x,y){
        this.graphicsLayer.clear();
        // eslint-disable-next-line no-undef
        const geometry = new esri.geometry.Point(x,y);
        // eslint-disable-next-line no-undef
        const symbol = new esri.symbol.PictureMarkerSymbol(mapPoint, 40, 50);
        symbol.setOffset(0,25);
        // eslint-disable-next-line no-undef
        this.graphicsLayer.add(new esri.Graphic(geometry,symbol));
        this.map.centerAndZoom(geometry,this.map.getMaxZoom());
        //加载事件周围监控点位
        this.loadCamera(x,y);
    }

    loadCamera(x,y){
        const {emergencyUrl} = this.props;
        const sendData = {
            rbacToken:this.props.token,
            x,
            y,
            distance:500
        };
        const cameraUrl = emergencyUrl + "/socialGovernance/external/queryVideoGroupMemberInfoList";
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
                const hlsUrl = this.props.emergencyUrl + "/socialGovernance/external/getHLSVideo";
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
        this.hlsList = [{},{},{}];
        this.nowPlayIndex = 0;
        this.props.hideSituation();
    }

    changePlayIndex(index){
        this.nowPlayIndex = index;
        this.setState({});
    }

    changePage(sub){
        let {page,allPage} = this.state;
        const newPage = page+sub;
        if(newPage > 0 && newPage <= allPage){
            this.setState({page:newPage});
        }
    }

    dataEdit(event){
        this.setState({address:event.target.value});
    }

    search(){
        this.searchAddress(this.state.address);
    }

    render() {
        const {page,allPage,feedbackList,address} = this.state;
        const {show,emergencyFileUrl} = this.props;
        return (
            <Motion style={{opacity:spring(show ? 1 : 0)}}>
                {({opacity}) =>
                    <div style={{opacity,zIndex:show?1:-1}} className={cssStyle.situationBox}>
                        <div className={cssStyle.editHeadBox}>
                            <div className={cssStyle.headName}>现场情况</div>
                            <Icon type="close" className={cssStyle.closeIcon} onClick={this.closeSituation.bind(this)}/>
                        </div>
                        <div className={cssStyle.situationMap} id={'mapDiv_'+this.id} />
                        <div className={cssStyle.addressSearchBox}>
                            <Input value={address} onChange={this.dataEdit.bind(this)} className={cssStyle.addressSearchInput}/>
                            <Button type="primary" onClick={this.search.bind(this)} >搜索</Button>
                        </div>
                        <div className={cssStyle.cameraBox}>
                            {this.hlsList.map((hls,index)=>
                                <HlsVideo
                                    key={hls.id+'_'+index}
                                    id={hls.id+'_'+index}
                                    hlsUrl={hls.hlsUrl}
                                    className={cssStyle.cameraVideo}
                                    style={{borderColor:index === this.nowPlayIndex ? '#00bcd4':'#0D83D1'}}
                                    changePlayIndex={this.changePlayIndex.bind(this,index)}
                                />
                            )}
                        </div>
                        <div className={cssStyle.feedbackBox}>
                            <div className={cssStyle.feedbackTitle}>反馈情况</div>
                            <div className={cssStyle.feedbackContent}>
                                <div className={cssStyle.feedbackLeftIconBox}>
                                    <Icon type="left" className={`${cssStyle.feedbackIconOne} ${page === 1 ? cssStyle.noPage:''}`} onClick={this.changePage.bind(this,-1)} />
                                </div>
                                <div className={cssStyle.feedbackRightIconBox}>
                                    <Icon type="right" className={`${cssStyle.feedbackIconOne} ${page === allPage ? cssStyle.noPage:''}`} onClick={this.changePage.bind(this,1)}/>
                                </div>
                                <div className={cssStyle.feedbackListBox}>
                                    <Motion style={{page:spring(page)}}>
                                        {({page}) =>
                                            <div className={cssStyle.feedbackAll} style={{left:-100*(page-1)+'%',width:feedbackList.length*100/3+'%'}}>
                                                {feedbackList && feedbackList.map((feedback,index)=>
                                                    <div className={cssStyle.feedbackItemBox} key={index} style={{width:100/feedbackList.length+'%'}}>
                                                        <div className={cssStyle.feedbackFileBox}>
                                                            <ImgList id={feedback.assignId} pageList={feedback.feedbackFiles} emergencyFileUrl={emergencyFileUrl} />
                                                            {/*{feedback.feedbackFiles && feedback.feedbackFiles.length > 0 ? (*/}
                                                            {/*    <ImgList id={feedback.assignId} pageList={feedback.feedbackFiles} emergencyFileUrl={emergencyFileUrl} />*/}
                                                            {/*):(*/}
                                                            {/*    <div className={cssStyle.feedbackNoPic}>*/}
                                                            {/*        <Icon type="picture" className={cssStyle.noPicIcon}/>*/}
                                                            {/*        <div>暂无图片</div>*/}
                                                            {/*    </div>*/}
                                                            {/*)}*/}
                                                        </div>
                                                        <div className={cssStyle.feedbackText}>
                                                            <Scrollbars className={'blueScrollbars'} >
                                                                {feedback.userName+' '+feedback.userPhone}<br />
                                                                {feedback.feedbackTime}<br />
                                                                {feedback.feedbackContent}
                                                            </Scrollbars>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    </Motion>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}