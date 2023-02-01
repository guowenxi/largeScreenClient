import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Button, Icon, Input, Modal} from "antd";
import {GPS} from "../arc_gis_map/locationChange";
import {loadModules} from "esri-loader";
import {arcGisUrl} from "../../config";
import mapPoint from "./images/point.svg";

export default class AddressSet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {address:'',x:0,y:0};
        this.id = (new Date()).getTime();
    }

    //组件加载触发函数
    componentDidMount() {
        //初始化搜索服务
        this.initMap();
        // eslint-disable-next-line no-undef
        this.geocoder = new AMap.Geocoder({
            city: "温州",
        });
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.show !== this.props.show){
            const {detail} = this.props;
            this.x = detail.x ? detail.x : 0;
            this.y = detail.y ? detail.y : 0;
            if((!this.x || !this.y) && this.graphicsLayer){
                this.graphicsLayer.clear();
            }
            this.setState({address:detail.address});
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
            this.map.addLayer(this.graphicsLayer,1);
            this.map.on("click",(e)=>{
                this.addPoint([e.mapPoint.x,e.mapPoint.y])
            })
        });
    }

    addPoint(point,move){
        this.graphicsLayer.clear();
        // eslint-disable-next-line no-undef
        const geometry = new esri.geometry.Point(point);
        // eslint-disable-next-line no-undef
        const symbol = new esri.symbol.PictureMarkerSymbol(mapPoint, 40, 50);
        symbol.setOffset(0,25);
        // eslint-disable-next-line no-undef
        this.graphicsLayer.add(new esri.Graphic(geometry,symbol));
        if(move){
            this.map.centerAndZoom(geometry,15);
        }else{
            const pointNew = GPS.gcj_encrypt(parseFloat(point[1]),parseFloat(point[0]));
            this.geocoder.getAddress([pointNew.lon,pointNew.lat],(status, result) => {
                if (status === 'complete' && result.info === 'OK' && result.regeocode) {
                    // result为对应的地理位置详细信息
                    this.setState({address:result.regeocode.formattedAddress})
                }
            })
        }
        this.x = point[0];
        this.y = point[1];
    }

    setAddress(){
        if(this.x && this.y){
            this.props.setAddress({address:this.state.address,x:this.x,y:this.y});
        }else{
            Modal.info({
                content: '请在地图上点选事件发生地点！',
            });
        }
    }

    dataEdit(event){
        this.setState({address:event.target.value});
    }

    search(){
        if(this.geocoder){
            this.geocoder.getLocation(this.state.address, (status, result) => {
                if (status === 'complete'&&result.geocodes.length) {
                    const position = result.geocodes[0].location;
                    const centerNew = GPS.gcj_decrypt_exact(position.lat,position.lng);
                    this.addPoint([centerNew.lon,centerNew.lat],true);
                }else{
                    Modal.error({
                        content: '根据地址查询位置失败！',
                    });
                }
            });
        }
    }

    render() {
        const {show,changeMapShow,className} = this.props;
        const {address} = this.state;
        return (
            <Motion style={{opacity:spring(show ? 1 : 0)}}>
                {({opacity}) =>
                    <div style={{opacity,zIndex:show?1:-1}} className={className ? className :cssStyle.mapBox}>
                        <div className={cssStyle.editHeadBox}>
                            <div className={cssStyle.headName}>地址选择</div>
                            <Icon type="close" className={cssStyle.closeIcon} onClick={changeMapShow}/>
                        </div>
                        <div className={cssStyle.mapContent} id={'mapDiv_'+this.id} />
                        <div className={cssStyle.addressSearchBox}>
                            <Input value={address} onChange={this.dataEdit.bind(this)} className={cssStyle.addressSearchInput}/>
                            <Button type="primary" onClick={this.search.bind(this)} >搜索</Button>
                        </div>
                        <div className={cssStyle.editFootBox}>
                            <Button onClick={changeMapShow}>取消</Button>
                            <Button type="primary" onClick={this.setAddress.bind(this)} >确定</Button>
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}