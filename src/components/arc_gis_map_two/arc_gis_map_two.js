import React from "react";
import 'echarts-for-react';
import ComponentBox from "../component_box";
import {getData} from "../../common/getDataUtil";
import {changeComponentShow, interactData} from "../../common/util";
import {Motion, spring} from "react-motion";
import {arcGisUrl} from "../../config";
import {loadModules} from "esri-loader";
import {GPS} from "../arc_gis_map/locationChange";
import {Modal} from "antd";

export default class ArcGisMapTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {},opacity:0 };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.changeComponentShow = changeComponentShow.bind(this);
        this.interactData = interactData.bind(this);
        this.gridResult = [];
    }

    //组件加载触发函数
    componentDidMount() {
        // eslint-disable-next-line no-undef
        this.geocoder = new AMap.Geocoder({
            city: "温州",
        });
        this.p = new Promise((resolve) => {
            if(this.props.thisData.showStatus){
                this.hasLoadMap = true;
                this.initMap(resolve);
            }else{
                resolve();
            }
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(this.props.thisData.showStatus !== prevProps.thisData.showStatus && this.props.thisData.showStatus && !this.hasLoadMap){
            this.hasLoadMap = true;
            this.initMap();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity:1 });
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "dataInterchange":
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                if(data.reGetData !== 2){
                    if(this.hasLoadMap){
                        this.reGetData();
                    }else{
                        this.hasLoadMap = true;
                        this.initMap(null,true);
                    }
                }
                break;
            case "deleteKey":
                this.keyParams = {};
                this.reGetData();
                break;
            case "showComponent":
                //显示当前组件
                this.changeComponentShow(true);
                break;
            case "hideComponent":
                //隐藏当前组件
                this.changeComponentShow(false);
                break;
            case "reFresh":
                //刷新数据
                this.reGetData();
                break;
            case "changeSelected":
                //切换选中
                this.selectedId = data.data.id;
                this.selectedAddress = data.data.address;
                this.graphicsLayer.clear();
                this.drawGrid();
                this.searchPoint();
                break;
            default:
                break;
        }
    }

    //获取数据后回调
    callBack(resolve,result) {
        if(resolve){
            resolve();
        }
        if (result) {
            result.forEach((item)=>{
                if(item.polygon){
                    item.polygonData = [item.polygon.split(',').map((point)=>{
                        return point.split(' ').map((part)=>{return part});
                    })];
                }
                const wkid = item.wkid ? item.wkid : '2';
                if(item.polygonData && wkid+'' === '2'){
                    let changePolygonData = [];
                    item.polygonData.forEach((oneGrid)=>{
                        let changeOneGrid = [];
                        oneGrid.forEach((point)=>{
                            const changePoint = GPS.gcj_decrypt_exact(parseFloat(point[1]),parseFloat(point[0]));
                            changeOneGrid.push([changePoint.lon,changePoint.lat]);
                        });
                        changePolygonData.push(changeOneGrid);
                        if(item.longitude && item.latitude){
                            const newPoint = GPS.gcj_decrypt_exact(parseFloat(item.latitude),parseFloat(item.longitude));
                            item.longitude = newPoint.lon;
                            item.latitude = newPoint.lat;
                        }
                    });
                    item.polygonData = changePolygonData;
                }
            });
            this.gridResult = result;
            this.graphicsLayer.clear();
            this.drawGrid();
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //加载地图
    initMap(resolve,getData){
        const mapURL = {
            url : arcGisUrl + "/arcgis_js_api/init.js",
            css : arcGisUrl + "/arcgis_js_api/esri/css/esri.css"
        };
        loadModules([
            "esri/map",
            "esri/layers/VectorTileLayer",
            "esri/dijit/Popup",
            "dojo/dom-construct",
            "dojo/domReady!"
        ], mapURL).then(([Map,VectorTileLayer,Popup,domConstruct])=>{
            //定义地图
            this.map = new Map('arc_gis_map_two_'+this.props.thisData.id, {
                logo: false,
                slider: false,
                showLabels: true,
                // eslint-disable-next-line no-undef
                center: new esri.geometry.Point(120.98185659, 28.11547046),//乐清
                zoom: 11,
                infoWindow: new Popup({ anchor:"top"},domConstruct.create("div"))
            });
            let vtlayer = new VectorTileLayer("https://services.wzmap.gov.cn/server/rest/services/Hosted/DSJ/VectorTileServer");
            this.map.addLayer(vtlayer);
            // eslint-disable-next-line no-undef
            this.graphicsLayer = new esri.layers.GraphicsLayer();
            this.map.addLayer(this.graphicsLayer,1);
            this.map.on('load',() => {
                if(this.props.thisData.firstLoad || getData){
                    this.getData(this.callBack.bind(this, resolve));
                }else{
                    this.callBack(resolve);
                }
            });
        });
    }

    //画网格
    drawGrid(){
        const { style } = this.props.thisData;
        let extent = {xmin: 360, ymin: 90, xmax: 0, ymax: -90};
        let hasExtent = false;
        const idKey = style.idKey ? style.idKey : 'areaId';
        this.gridResult.forEach((item)=>{
            if(item){
                // eslint-disable-next-line no-undef
                let polygon = new esri.geometry.Polygon();
                let polygonData = [];
                if(item.polygonData){
                    polygonData = item.polygonData;
                }else{
                    try {
                        polygonData = JSON.parse(item.arcgisPoints);
                    }catch (e) {}
                }
                if(!polygonData || polygonData.length === 0){
                    return;
                }
                polygonData.forEach((ring) => {
                    polygon.addRing(ring);
                });
                // eslint-disable-next-line no-undef
                const thisSymbolFill = new esri.symbol.SimpleFillSymbol(
                    // eslint-disable-next-line no-undef
                    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                    // eslint-disable-next-line no-undef
                    new esri.symbol.SimpleLineSymbol('solid', this.selectedId ? (this.selectedId === item[idKey] ? new esri.Color('rgba(74,144,266,1)'):new esri.Color('rgba(74,144,266,0.5)')):new esri.Color('rgba(74,144,266,1)'), 2),
                    // eslint-disable-next-line no-undef
                    this.selectedId ? (this.selectedId === item[idKey] ? new esri.Color('rgba(0,121,255,0.4)'):new esri.Color('rgba(0,121,255,0.1)')):new esri.Color('rgba(0,121,255,0.2)'));
                // eslint-disable-next-line no-undef
                let graphic = new esri.Graphic(polygon,thisSymbolFill);
                this.graphicsLayer.add(graphic);
                const nameKey = style.nameKey ? style.nameKey : 'areaName';
                if(item[nameKey]){
                    //网格名称
                    // eslint-disable-next-line no-undef
                    let label = new esri.symbol.TextSymbol(item[nameKey]);
                    // eslint-disable-next-line no-undef
                    label.setColor(new esri.Color('rgba(255,255,255,1)'));
                    // eslint-disable-next-line no-undef
                    let font  = new esri.symbol.Font();
                    // eslint-disable-next-line no-undef
                    font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
                    font.setSize(16);
                    label.setFont(font);
                    // eslint-disable-next-line no-undef
                    this.graphicsLayer.add(new esri.Graphic(item.longitude && item.latitude ? new esri.geometry.Point([item.longitude,item.latitude]):graphic._extent.getCenter(),label));
                }
                const numKey = style.numKey ? style.numKey : 'peopleNumber';
                if(item[numKey] != null){
                    //网格名称
                    // eslint-disable-next-line no-undef
                    let label = new esri.symbol.TextSymbol(item[numKey].toString());
                    // eslint-disable-next-line no-undef
                    label.setColor(new esri.Color('rgba(255,255,255,1)'));
                    // eslint-disable-next-line no-undef
                    let font  = new esri.symbol.Font();
                    // eslint-disable-next-line no-undef
                    font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
                    font.setSize(16);
                    label.setFont(font);
                    label.setOffset(0, -18);
                    // eslint-disable-next-line no-undef
                    this.graphicsLayer.add(new esri.Graphic(item.longitude && item.latitude ? new esri.geometry.Point([item.longitude,item.latitude]):graphic._extent.getCenter(),label));
                }
                if(graphic._extent && (!this.selectedId || this.selectedId === item[idKey])){
                    if(extent.xmin > graphic._extent.xmin){
                        extent.xmin = graphic._extent.xmin;
                    }
                    if(extent.ymin > graphic._extent.ymin){
                        extent.ymin = graphic._extent.ymin;
                    }
                    if(extent.xmax < graphic._extent.xmax){
                        extent.xmax = graphic._extent.xmax;
                    }
                    if(extent.ymax < graphic._extent.ymax){
                        extent.ymax = graphic._extent.ymax;
                    }
                    hasExtent = true;
                }
            }
        });
        if(hasExtent){
            // eslint-disable-next-line no-undef
            this.map.setExtent(new esri.geometry.Extent(extent));
        }
    }

    //搜索地址打点
    searchPoint(){
        if(this.selectedAddress && this.geocoder){
            this.geocoder.getLocation(this.selectedAddress, (status, result) => {
                if (status === 'complete'&&result.geocodes.length) {
                    const position = result.geocodes[0].location;
                    const centerNew = GPS.gcj_decrypt_exact(position.lat,position.lng);
                    // eslint-disable-next-line no-undef
                    const geometry = new esri.geometry.Point([centerNew.lon,centerNew.lat]);
                    // eslint-disable-next-line no-undef
                    const symbol = new esri.symbol.PictureMarkerSymbol('./images/arcGisMap/pointOne.svg', 40, 50);
                    symbol.setOffset(0,25);
                    // eslint-disable-next-line no-undef
                    this.graphicsLayer.add(new esri.Graphic(geometry,symbol));
                }else{
                    Modal.error({
                        content: '根据地址查询位置失败！',
                    });
                }
            });
        }
    }

    render() {
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) => {
                        return (
                            <div
                                style={{ width: '100%', height: '100%', position: 'absolute',opacity }}
                                id={'arc_gis_map_two_'+this.props.thisData.id}
                            />
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}