import React from "react";
import axios from "axios";
import Emitter from '../../common/eventBus';
import {Motion, spring} from "react-motion";
import {Checkbox, Tree, Row, Col, Tabs, Icon, Modal} from 'antd';
import { Scrollbars } from "react-custom-scrollbars";
import { loadModules } from 'esri-loader';
import ComponentBox from "../component_box";
import cssStyle from './arc_gis_map.module.css';
import './arc_gis_map.css';

import {arcGisUrl, fileUrl} from '../../config';

import { _clusterLayer } from '../../common/clusterLayer';
import { loadGridOne } from "./map_util";
import { GPS } from "./locationChange";
import {getLinearBackground, getRadialBackground, interactData, getQueryString} from "../../common/util";
import {createHashHistory} from "history";
import {getAllGrid,changeAllGridShow} from "../../common/allGridUtil";

const { TabPane } = Tabs;

export default class ArcGisMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectList:[],mapSelectList:[],gridTree:{},windowContent:null,opacity:0,
            windowTheme:0,trailMoving:false,trailTimePointLeft:0,startTrailTime:'',
            endTrailTime:'',nowTrailTime:'',trailPause:false,selectedBoxShow:true,gridShow:true,bigMap:false
        };
        this.loadGridOne = loadGridOne.bind(this);
        this.interactData = interactData.bind(this);
        this.getAllGrid = getAllGrid.bind(this);
        this.changeAllGridShow = changeAllGridShow.bind(this);
        this.keyParams = {};
        this.mapParamsIndex = [];
        this.dataList = [];
        this.nearDataList = [];
        this.nearSelected = '';
        this.aboutDataList = [];
        this.aboutSelected = '';
        this.mapParams = {};
        this.layerParams = [];
        this.mapWindowRef = {
            'event_emergency':React.createRef(),
            'check_route':React.createRef(),
            'cloth_point':React.createRef(),
            'problem_point':React.createRef(),
            'micro_grid':React.createRef(),
            'check_task':React.createRef(),
        };
        this.clickLayerIndex = -1;
        this.mapWindowList = [];
        this.infoWindowContent = {};
        this.resultColor = [];
        this.mapWindowBoxRef = React.createRef();
        this.mapWindowfirstLoad = true;
        this.windowThemeList = ['themeOne','themeTwo','themeThree','themeFour'];
        this.mapSelectParams = {};
        this.trailParams = {};
        this.gridColorParams = {};
        this.gridDataParams = {};
        this.firstLoadGrid = true;
        this.trailTimeLineRef = React.createRef();
        this.needGetDataLayer = [];
        this.allGridParams = {};
        this.trailPointsLength = 0;
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.initMap(resolve)});
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        this.dataList.forEach((dataPart) => {
            //停止定时器
            if(dataPart.timerId){
                clearTimeout(dataPart.timerId);
            }
        });
        //停止网格刷新定时器
        if(this.gridTimer){
            clearTimeout(this.gridTimer);
        }
        if(this.changeKeyTimer){
            clearTimeout(this.changeKeyTimer);
        }
    }

    //组件数据更新时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.updateTime !== this.props.thisData.updateTime){
            //组件数据源变更时刷新数据
            this.loadGrid();
            this.loadMapPoint();
        }
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus && this.props.thisData.showStatus && !this.props.firstLoad){
            //组件显示时刷新数据
            this.refreshMapPoint(true);
        }
    }

    //挂载数据到页面显示
    animateOn(){
        this.p.then(() => {
            this.loadGrid();
            this.loadMapPoint();
            this.setState({opacity:1});
        });
    }

    //修改条件触发函数
    changeKey(message){
        if(this.map){
            const data = JSON.parse(JSON.stringify(message));
            const notReGetData = data.notReGetData;
            delete data.notReGetData;
            delete data.actionType;
            delete data.layerIds;
            switch (message.actionType) {
                case 'resetCenterZoom':
                    const { lon,lat,zoom } = this.props.thisData.style;
                    // eslint-disable-next-line no-undef
                    this.map.centerAndZoom(new esri.geometry.Point(lon ? lon : 111.02,lat ? lat : 33.09),zoom);
                    break;
                case 'changeGridOne':
                    //市监局用，切换某一网格并过滤显示网格点位数据
                    this.loadGridOne(message.id);
                    this.mapParamsIndex[message.layerId] = {id:message.id};
                    this.changeMapPointShow(message.layerId,true);
                    break;
                case 'changeGridColorParams':
                    for (let key in data) {
                        this.gridColorParams[key] = data[key];
                    }
                    if(this.gridData){
                        this.gridData.updateTime = 0;
                    }
                    if(!notReGetData){
                        this.loadGrid();
                    }
                    break;
                case 'changeKeyParams':
                    for (let key in data) {
                        this.keyParams[key] = data[key];
                    }
                    break;
                case 'changeGridParams':
                    for (let key in data) {
                        this.gridDataParams[key] = data[key];
                    }
                    if(this.gridData){
                        this.gridData.updateTime = 0;
                    }
                    if(this.map){
                        this.map.infoWindow.hide();
                    }
                    if(!notReGetData){
                        this.loadGrid(true);
                    }
                    break;
                case 'changeParams':
                    //修改指定图层数据请求条件
                    if(message.layerIds && Array.isArray(message.layerIds)){
                        message.layerIds.forEach((id) => {
                            if(this.layerParams[id] == null){
                                this.layerParams[id] = {};
                            }
                            for (let key in data) {
                                this.layerParams[id][key] = data[key];
                            }
                        });
                        if(!notReGetData){
                            this.refreshMapPoint(true);
                        }
                    }
                    break;
                case 'searchPointTrail':
                    this.searchPointTrail(message);
                    break;
                case 'changeMapSize':
                    this.setState({bigMap:data.bigMap,zIndex:data.zIndex});
                    break;
                case "changeLayerShow":
                    if(message.showLayers != null){
                        const showLayers = message.showLayers.split(',');
                        const { selectList } = this.state;
                        this.dataList.forEach((item,index)=>{
                            if(item.layer){
                                if(showLayers.indexOf(index+'') >= 0){
                                    selectList[index].checkAll = true;
                                    // item.layer.show();
                                }else{
                                    selectList[index].checkAll = false;
                                    selectList[index].indeterminate = false;
                                    // item.layer.hide();
                                }
                                this.changeMapPointShow(index,false);
                                // item.layer.refresh();
                            }
                        });
                    }
                    break;
                case "changeBaseLayerShow":
                    if(message.showLayers != null){
                        const showLayers = message.showLayers.split(',');
                        if(this.basemap){
                            if(showLayers.indexOf('baseMap') >= 0){
                                this.basemap.show();
                                if(this.annolayer){
                                    this.annolayer.show();
                                }
                            }else{
                                this.basemap.hide();
                                if(this.annolayer){
                                    this.annolayer.hide();
                                }
                            }
                        }
                        if(this.gridData){
                            if(showLayers.indexOf('grid') >= 0){
                                this.gridData.gridLayer.show();
                                this.gridData.gridNameLayer.show();
                                this.gridData.gridLayerBox.show();
                            }else{
                                this.gridData.gridLayer.hide();
                                this.gridData.gridNameLayer.hide();
                                this.gridData.gridLayerBox.hide();
                            }
                        }
                    }
                    break;
                case 'changeAllGridParams':
                    for (let key in data) {
                        this.allGridParams[key] = data[key];
                    }
                    const {style} = this.props.thisData;
                    if(style.firstLoadAllGrid && style.showAllGrid){
                        this.getAllGrid(this.map,this.props.thisData.style);
                    }
                    break;
                default:
            }
        }else{
            this.changeKeyTimer = setTimeout(()=>{
                this.changeKey(message);
            },200);
        }
    }

    //接收事件消息
    receiveMessage(data) {
      console.log('receiveMessage', data);
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "changeKey" :
                const message = data.data;
                this.changeKey(message);
                break;
            case "dataInterchange":
                this.receiveData(data.data);
                break;
            case "reFresh":
                // if(this.clickLayerIndex >= 0){
                //     this.changeMapPointShow(this.clickLayerIndex,true);
                // }
                this.refreshMapPoint(true);
                this.getGridColorData();
                break;
            case "reFreshAll":
                this.refreshMapPoint(true);
                this.getGridColorData();
                break;
            case "changeLayerShow":
                if(this.map){
                    this.map.infoWindow.hide();
                }
                const receiveData = data.data;
                let showList = [];
                let hideList = [];
                try{
                    showList = JSON.parse(receiveData.mapShow);
                    hideList = JSON.parse(receiveData.mapHide);
                }catch (e) {}
                const { selectList } = this.state;
                for(let i = 0;i < selectList.length;i ++){
                    if(showList.indexOf(i) >= 0){
                        selectList[i].checkAll = true;
                        this.changeMapPointShow(i,false);
                    }else if(hideList.indexOf(i) >= 0){
                        selectList[i].checkAll = false;
                        selectList[i].indeterminate = false;
                        this.changeMapPointShow(i,false);
                    }
                }
                this.setState({ selectList });
                break;
            case "changeSelected":
                this.changeSelected(data.data);
                this.map.infoWindow.hide();
                break;
            case "cancelSelect":
                if(this.map){
                    if(this.selectedGraphic){
                        this.changeClickImg(this.selectedGraphic);
                    }
                    // 点击重置 回到最原始的地图中心点
                    const { lon,lat,zoom } = this.props.thisData.style;
                    // eslint-disable-next-line no-undef
                    this.map.centerAndZoom(new esri.geometry.Point(lon ? lon : 111.02,lat ? lat : 33.09),zoom);
                    this.reSetSelectedGridColor();
                    this.map.infoWindow.hide();
                }
                break;
            default:
                break;
        }
    }

    changeSelected(data){
        const { layer } = this.props.thisData.style;
        for(let j = 0;j < this.dataList.length;j ++){
            let hasFind = false;
            if(layer[j].cluster){
                const points = this.dataList[j].data;
                for(let i = 0;i < points.length;i ++){
                    if(points[i].id+'' === data.id+''){
                        // eslint-disable-next-line no-undef
                        this.map.centerAndZoom(new esri.geometry.Point(points[i].x,points[i].y),layer[j].clickZoom ? layer[j].clickZoom:this.map.getMaxZoom());
                        // if(data.id !== this.selectedId){
                            setTimeout(()=>{
                                const graphics = this.dataList[j].layer.graphics;
                                if(data.id === graphics[i].attributes.id){
                                    this.markerClick(layer[j],'main',{graphic:graphics[i]},'analog');
                                }else{
                                    for(let k = 0;k < graphics.length;k ++){
                                        if(graphics[i].attributes.id === data.id){
                                            this.markerClick(layer[j],'main',{graphic:graphics[k]},'analog');
                                            break;
                                        }
                                    }
                                }
                            },500);
                        // }
                        hasFind = true;
                        break;
                    }
                }
            }else{
                const graphics = this.dataList[j].layer.graphics;
                for(let i = 0;i < graphics.length;i ++){
                    if(graphics[i].attributes.id+'' === data.id+''){
                        // eslint-disable-next-line no-undef
                        this.map.centerAndZoom(graphics[i].geometry,layer[j].clickZoom ? layer[j].clickZoom:this.map.getMaxZoom());
                        // this.map.centerAt(graphics[i].geometry);
                        // if(data.id !== this.selectedId){
                            setTimeout(()=>{
                                this.markerClick(layer[j],'main',{graphic:graphics[i]},'analog');
                            },500);
                        // }
                        hasFind = true;
                        break;
                    }
                }
            }
            if(hasFind){
                break;
            }
        }
    }

    //加载接收的数据
    receiveData(data){
        if(data.type === 'selectMaker'){
            if(data.layerIndex != null && this.dataList[data.layerIndex] && this.dataList[data.layerIndex].layer){
                const graphics = this.dataList[data.layerIndex].layer.graphics;
                for(let i = 0;i < graphics.length;i ++){
                    if(graphics[i].attributes.id === data.id){
                        this.map.centerAt(graphics[i].geometry);
                        setTimeout(()=>{
                            this.markerClick(this.props.thisData.style.layer[data.layerIndex],'main',{graphic:graphics[i]},'analog');
                        },500);
                        break;
                    }
                }
            }
        }else{
            const { layer } = this.props.thisData.style;
            for(let i = 0;i < layer.length;i ++){
                if(layer[i].name === data.layerName){
                    if(this.dataList[i] != null){
                        this.dataList[i].layer.clear();
                        this.dataList[i].data = data.data;
                        this.addPoint(layer[i],this.dataList[i]);
                    }
                    break;
                }
            }
        }
    }

    //加载空白图层用以阻止地图点击消息
    loadBlankLayer(){
        // eslint-disable-next-line no-undef
        const blankLayer = new esri.layers.GraphicsLayer();
        blankLayer.on('click',(e)=>{
            e.stopPropagation();
        });
        // eslint-disable-next-line no-undef
        const blankFill = new esri.symbol.SimpleFillSymbol(
            // eslint-disable-next-line no-undef
            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            // eslint-disable-next-line no-undef
            new esri.symbol.SimpleLineSymbol('SOLID', new esri.Color('rgba(0,0,0,0)'), 0),
            // eslint-disable-next-line no-undef
            new esri.Color('rgba(0,0,0,0)'));
        // eslint-disable-next-line no-undef
        let blankPolygon = new esri.geometry.Polygon();
        blankPolygon.addRing([[115,20],[115,40],[125,40],[125,20]]);
        // eslint-disable-next-line no-undef
        let blankGraphic = new esri.Graphic(blankPolygon,blankFill);
        blankLayer.add(blankGraphic);
        this.map.addLayer(blankLayer);
    }

    //初始化地图
    initMap(resolve){
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
            "tdlib/TDTAnnoLayerTY",
            "tdlib/TDTLayerTY",
            "tdlib/ZTLayer",
            "esri/layers/VectorTileLayer",
            "esri/dijit/Popup",
            "dojo/dom-construct",
            "dojo/domReady!"
        ], mapURL).then(([Map,SpatialReference,ArcGISTiledMapServiceLayer,Extent,Circle,TDTAnnoLayer,TDTLayer,TDTAnnoLayerTY,TDTLayerTY,ZTLayer,VectorTileLayer,Popup,domConstruct])=>{
            //定义地图
            const { lon,lat,zoom,mapBase,blurOpen,addressShow } = this.props.thisData.style;
            this.map = new Map(this.props.thisData.id + 'map', {
                logo: false,
                slider: false,
                showLabels: true,
                // eslint-disable-next-line no-undef
                center: new esri.geometry.Point(lon ? lon : 111.02,lat ? lat : 33.09),
                zoom: zoom ? zoom : 3,
                infoWindow: new Popup({ anchor:"top"},domConstruct.create("div"))
            });
            if(blurOpen){
                this.blurMap = new Map(this.props.thisData.id + 'blurMap', {
                    logo: false,
                    slider: false,
                    showLabels: true,
                    // eslint-disable-next-line no-undef
                    center: new esri.geometry.Point(lon ? lon : 111.02,lat ? lat : 33.09),
                    zoom: zoom ? zoom : 3,
                    infoWindow: new Popup({ anchor:"top"},domConstruct.create("div"))
                });
                // this.map.on('pan',(e,ev) => {
                //     console.log(this.map.getZoom());
                //     console.log(this.map.extent.getCenter());
                //     this.blurMap.centerAndZoom(this.map.extent.getCenter(),this.map.getZoom());
                // });
            }
            if(mapBase === 'ZT'){
                this.basemap = new ZTLayer();
                this.map.addLayer(this.basemap);
                // blurOpen && this.blurMap.addLayer(basemap);
            }else if(mapBase === 'TDTBlue'){
                this.basemap = new VectorTileLayer("https://services.wzmap.gov.cn/server/rest/services/Hosted/DSJ/VectorTileServer");
                this.map.addLayer(this.basemap);
                if(blurOpen){
                    this.annolayer = new VectorTileLayer("https://services.wzmap.gov.cn/server/rest/services/Hosted/DSJ/VectorTileServer");
                    this.blurMap.addLayer(this.annolayer);
                }
            }else if(mapBase === 'TDTTY'){
                this.basemap = new TDTLayerTY();
                this.map.addLayer(this.basemap);
                if(addressShow == null || addressShow === 1){
                    this.annolayer = new TDTAnnoLayerTY();
                    this.map.addLayer(this.annolayer);
                }
                let dom = document.createElement('div');
                dom.className = cssStyle.blueMask;
                document.getElementById(this.props.thisData.id + 'map_layers').insertBefore(dom,document.getElementById(this.props.thisData.id + 'map_gc'));
            }else{
                this.basemap = new TDTLayer();
                this.map.addLayer(this.basemap);
                if(addressShow == null || addressShow === 1){
                    this.annolayer = new TDTAnnoLayer();
                    this.map.addLayer(this.annolayer);
                }
                // blurOpen && this.blurMap.addLayer(basemap);
                // blurOpen && this.blurMap.addLayer(annolayer);
            }
            const {style} = this.props.thisData;
            if(style.maskType){
                let dom = document.createElement('div');
                dom.className = style.maskType;
                document.getElementById(this.props.thisData.id + 'map_layers').insertBefore(dom,document.getElementById(this.props.thisData.id + 'map_gc'));
            }
            // this.map.on('extent-change',this.refreshMapPoint.bind(this));
            this.map.on('click',(e,ev) => {
                console.log(e.mapPoint);
                console.log(this.map.extent.getCenter());
                // console.log(this.map.extent,this.map.extent.getWidth(),this.map.width);
                // e.stopPropagation();
                // return null;
                this.reSetSelectedGridColor();
                this.changeClickImgBack();
                this.map.infoWindow.hide();
            });
            this.map.on('zoom-end',() => {
                // console.log('zoom-end');
                this.refreshMapPoint();
                if(this.gridData && this.gridData.gridNameLayer){
                    // this.drawGrid(false);
                    this.drawGridName();
                }
                if(this.blurMap != null){
                    this.blurMap.centerAndZoom(this.map.extent.getCenter(),this.map.getZoom());
                }
            });
            this.map.on('pan-end',() => {
                // console.log('pan-end');
                const nowCenter = JSON.stringify(this.map.extent.getCenter());
                if(this.lastCenter !== nowCenter){
                    this.lastCenter = nowCenter;
                    this.refreshMapPoint();
                    if(this.blurMap != null){
                        this.blurMap.centerAndZoom(this.map.extent.getCenter(),this.map.getZoom());
                    }
                    // if(this.gridData.gridLayer){
                    //     this.drawGrid();
                    // }
                }
            });
            // this.map.on('click',() => {
            // });
            if(mapBase === 'TDTBlue'){
                this.map.on('load',() => {
                    this.afterMapLoad(resolve);
                });
            }else{
                this.afterMapLoad(resolve);
            }
            //加载全层级边界
            if(style.firstLoadAllGrid && style.showAllGrid){
                this.getAllGrid(this.map,style);
            }
        });
    }

    afterMapLoad(resolve){
        const { blankLayer } = this.props.thisData.style;
        if(blankLayer){
            this.loadBlankLayer();
        }
        // eslint-disable-next-line no-undef
        this.gridOneLayer = new esri.layers.GraphicsLayer();
        this.map.addLayer(this.gridOneLayer,3);
        resolve();
    }

    //加载网格
    loadGrid(changeParams){
        const { open,treeOpen,url,urlParams,treeUrl,updateTime,firstLoad,zoom } = this.props.thisData.style.grid;
        if(open){
            //加载网格
            if(this.gridData == null){
                const gridZoom = zoom ? zoom : 1;
                // eslint-disable-next-line no-undef
                const gridLayer = new esri.layers.GraphicsLayer();
                gridLayer.on('click',this.gridClick.bind(this));
                gridLayer.on('mouse-over',this.gridMouseOver.bind(this));
                gridLayer.on('mouse-out',this.gridMouseOut.bind(this));
                this.map.addLayer(gridLayer,gridZoom);
                // eslint-disable-next-line no-undef
                const gridNameLayer = new esri.layers.GraphicsLayer();
                gridNameLayer.on('click',this.gridClick.bind(this));
                gridNameLayer.on('mouse-over',this.gridMouseOver.bind(this));
                gridNameLayer.on('mouse-out',this.gridMouseOut.bind(this));
                this.map.addLayer(gridNameLayer,gridZoom+1);
                // eslint-disable-next-line no-undef
                const gridLayerBox = new esri.layers.GraphicsLayer();
                gridLayerBox.on('click',this.gridClick.bind(this));
                this.map.addLayer(gridLayerBox,gridZoom+2);
                this.gridData = {url,treeUrl,gridLayer,gridNameLayer,gridLayerBox,data:[]};
                // this.gridData = {url,treeUrl,gridLayer,data:[]};
                if(firstLoad !== 0){
                    this.loadGridData(url,urlParams);
                }
            }else{
                if(updateTime !== this.gridData.updateTime){
                    this.gridData.updateTime = updateTime;
                    if(url !== this.gridData.url || urlParams !== this.gridData.urlParams || changeParams){
                        this.loadGridData(url,urlParams,null,null,changeParams);
                    }else{
                        this.getGridColor();
                    }
                }
            }
        }else if(this.gridData != null){
            //若关闭网格功能且加载过网格数据则清空数据
            this.gridData.gridLayer.clear();
            this.gridData.gridNameLayer.clear();
        }
        if(treeOpen){
            if(this.gridTreeData == null){
                this.gridTreeData = {treeUrl};
                this.loadGridTreeData(treeUrl);
            }else{
                if(treeUrl !== this.gridTreeData.treeUrl){
                    this.loadGridTreeData(treeUrl);
                }else{
                    this.setState({gridTree:{data:this.gridTreeData.treeData,showSelect:false}});
                }
            }
        }else{
            this.setState({gridTree:{}});
        }
    }

    //获取地图网格数据
    loadGridData(gridUrl,urlParams,key,extent,changeParams){
        let params = {};
        if(urlParams){
            try {
                params = JSON.parse(urlParams);
            }catch (e) {}
        }
        if(this.gridDataParams.type == null && params.type != null){
            this.gridDataParams.type = params.type;
        }
        if(this.props.thisData.style.grid.sessionData){
            // params.roadId = sessionStorage.getItem("roadId");
            if(global.roadId){
                params.roadId = global.roadId
            }
        }
        if(gridUrl){
            axios.get(gridUrl,{params:{...params,...key,...this.gridDataParams,rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                const result = response.data;
                if(result.success && result.data){
                    let thisGridData = [];
                    result.data.forEach((item)=>{
                        if(item.arcgisPoints != null && item.arcgisPoints !== '[[[]]]'){
                            const { mergeOpen } = this.props.thisData.style.grid;
                            if(mergeOpen && item.mergeName){
                                item.name = item.mergeName;
                            }
                            let polygonData = [];
                            try {
                                polygonData = JSON.parse(item.arcgisPoints);
                            }catch (e) {}
                            if(polygonData.length > 0){
                                const wkid = item.wkid ? item.wkid : this.props.thisData.style.grid.wkid;
                                if(wkid+'' === '2'){
                                    let changePolygonData = [];
                                    polygonData.forEach((oneGrid)=>{
                                        let changeOneGrid = [];
                                        oneGrid.forEach((point)=>{
                                            const changePoint = GPS.gcj_decrypt_exact(parseFloat(point[1]),parseFloat(point[0]));
                                            changeOneGrid.push([changePoint.lon,changePoint.lat]);
                                        });
                                        changePolygonData.push(changeOneGrid);
                                    });
                                    polygonData = changePolygonData;
                                }else if(wkid+'' === '3'){
                                    let changePolygonData = [];
                                    polygonData.forEach((oneGrid)=>{
                                        let changeOneGrid = [];
                                        oneGrid.forEach((point)=>{
                                            const changePointOne = GPS.bd_decrypt(parseFloat(point[1]),parseFloat(point[0]));
                                            const changePointTwo = GPS.gcj_decrypt_exact(parseFloat(changePointOne.lat),parseFloat(changePointOne.lon));
                                            changeOneGrid.push([changePointTwo.lon,changePointTwo.lat]);
                                        });
                                        changePolygonData.push(changeOneGrid);
                                    });
                                    polygonData = changePolygonData;
                                }
                                let hasSame = false;
                                let sameIndex;
                                for(let i = 0;i < thisGridData.length;i ++){
                                    if(thisGridData[i].name === item.name){
                                        hasSame = true;
                                        sameIndex = i;
                                        break;
                                    }
                                }
                                if(hasSame){
                                    polygonData.forEach((oneGrid)=>{
                                        thisGridData[sameIndex].polygonData.push(oneGrid);
                                    });
                                }else{
                                    item.polygonData = polygonData;
                                    thisGridData.push(item);
                                }
                            }
                        }
                    });
                    this.gridData.url = gridUrl;
                    this.gridData.urlParams = urlParams;
                    // this.gridData.data = result.data;
                    this.gridData.data = thisGridData;
                    this.getGridColor(changeParams);
                    // if(extent){
                    //     let ext;
                    //     try{
                    //         ext = JSON.parse(extent);
                    //     }catch (e) {}
                    //     if(ext){
                    //         // eslint-disable-next-line no-undef
                    //         const extent = new esri.geometry.Extent(ext);
                    //         this.map.setExtent(extent);
                    //     }
                    // }
                }else{
                    this.gridData.gridLayer.clear();
                    this.gridData.gridNameLayer.clear();
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    getGridColor(changeParams){
        const { grid } = this.props.thisData.style;
        if(grid.colorType === 2 && grid.colorUrl){
            this.getGridColorData(changeParams);
        }else{
            this.drawGrid(changeParams);
        }
    }

    //获取网格颜色匹配数据
    getGridColorData(changeParams){
        //停止旧的定时器
        if(this.gridTimer){
            clearTimeout(this.gridTimer);
        }
        const { grid } = this.props.thisData.style;
        let params = {};
        try{
            params = JSON.parse(grid.colorParams);
        }catch (e) {}
        if(this.props.thisData.style.grid.sessionData){
            // params.roadId = sessionStorage.getItem("roadId");
            if(global.roadId){
                params.roadId = global.roadId
            }
        }
        let urlParams = {};
        if(grid.colorUrlParams){
            grid.colorUrlParams.forEach((item)=>{
                urlParams[item] = getQueryString(item);
            });
        }
        axios.get(grid.colorUrl,{params:{...params,...urlParams,...this.gridColorParams,rbacToken:this.props.token}}).then((responseColor) => {
            this.resultColor = responseColor.data.data;
            this.drawGrid(changeParams);
            if(grid.freshTime){
                this.gridTimer = setTimeout(() => this.getGridColorData(),grid.freshTime)
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //画网格
    drawGrid(moveMap){
        this.gridData.gridLayer.clear();
        this.gridData.gridNameLayer.clear();
        if(!this.gridData.data || this.gridData.data.length === 0){
            return;
        }
        const { grid } = this.props.thisData.style;
        const backgroundColor = grid.backgroundColor ? grid.backgroundColor : 'rgba(0,255,255,0.2)';
        const lineColor = grid.lineColor ? grid.lineColor : '#0ff';
        const lineWidth = grid.lineWidth ? grid.lineWidth : '6';
        const lineType = grid.lineType ? grid.lineType : 'solid';
        // eslint-disable-next-line no-undef
        const symbolFill = new esri.symbol.SimpleFillSymbol(
            // eslint-disable-next-line no-undef
            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            // eslint-disable-next-line no-undef
            new esri.symbol.SimpleLineSymbol(lineType, new esri.Color(lineColor), lineWidth),
            // eslint-disable-next-line no-undef
            new esri.Color(backgroundColor));
        let extent = {xmin: 360, ymin: 90, xmax: 0, ymax: -90};
        const symbolFillColorList = ['rgba(0,93,199,0.8)','rgba(65,170,251,0.8)','rgba(64,202,249,0.8)','rgba(1,106,234,0.8)'];
        this.gridData.data.forEach((item,index) => {
            if(item.arcgisPoints==null || item.arcgisPoints === '[[[]]]'){
                return;
            }
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
            polygonData.forEach((ring) => {
                polygon.addRing(ring);
            });
            let thisSymbolFill;
            if(index === this.gridData.data.length - 1 && grid.allLine){
                // eslint-disable-next-line no-undef
                thisSymbolFill = new esri.symbol.SimpleFillSymbol(
                    // eslint-disable-next-line no-undef
                    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                    // eslint-disable-next-line no-undef
                    new esri.symbol.SimpleLineSymbol(grid.allLineType, new esri.Color(grid.allLineColor), grid.allLineWidth),
                    // eslint-disable-next-line no-undef
                    new esri.Color('rgba(255,255,255,0)'));
            }else{
                if(grid.colorType === 2){
                    // eslint-disable-next-line no-undef
                    thisSymbolFill = new esri.symbol.SimpleFillSymbol(
                        // eslint-disable-next-line no-undef
                        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                        // eslint-disable-next-line no-undef
                        new esri.symbol.SimpleLineSymbol(lineType, new esri.Color(this.getSymbolFillColor(item,grid,'lineColorList')), lineWidth),
                        // eslint-disable-next-line no-undef
                        new esri.Color(this.getSymbolFillColor(item,grid,'bgColorList')));
                }else if(grid.colorType === 3){
                    // eslint-disable-next-line no-undef
                    thisSymbolFill = new esri.symbol.SimpleFillSymbol(
                        // eslint-disable-next-line no-undef
                        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                        // eslint-disable-next-line no-undef
                        new esri.symbol.SimpleLineSymbol(lineType, new esri.Color(lineColor), lineWidth),
                        // eslint-disable-next-line no-undef
                        new esri.Color(symbolFillColorList[index%4]));
                }else{
                    thisSymbolFill = symbolFill;
                }
            }
            // eslint-disable-next-line no-undef
            let graphic = new esri.Graphic(polygon,thisSymbolFill,item);

            if(index === this.gridData.data.length - 1 && grid.allLine){
                this.gridData.gridLayerBox.add(graphic);
            }else{
                this.gridData.gridLayer.add(graphic);
                let namePoint;
                if(item.namePoint){
                    try{
                        namePoint = JSON.parse(item.namePoint);
                    }catch (e) {}
                }
                // eslint-disable-next-line no-undef
                item.namePosition = namePoint ? new esri.geometry.Point(namePoint):graphic._extent.getCenter();
            }
            if(graphic._extent && (moveMap || (this.firstLoadGrid && grid.firstLoadMoveMap))){
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
            }
        });
        this.drawGridName();
        if(moveMap || (this.firstLoadGrid && grid.firstLoadMoveMap)){
            const { layer } = this.props.thisData.style;
            layer.forEach((layerItem,layerIndex)=>{
                if(layerItem.type === 4){
                    this.changeMapPointShow(layerIndex,true);
                }
            });
            if(!this.firstLoadGrid || grid.firstLoadMoveMap){
                // eslint-disable-next-line no-undef
                this.map.setExtent(new esri.geometry.Extent(extent));
            }
        }
        this.firstLoadGrid = false;
    }

    drawGridName(){
        this.gridData.gridNameLayer.clear();
        const { grid } = this.props.thisData.style;
        const { mergeOpen } = this.props.thisData.style.grid;
        this.gridData.data.forEach((item,index) => {
            if(item.arcgisPoints==null || item.arcgisPoints === '[[[]]]'){
                return;
            }
            if(index === this.gridData.data.length - 1 && grid.allLine){
            }else{
                const nowZoom = this.map.getZoom();
                if((grid.showName && nowZoom > 6) || grid.overShow){
                    //网格名称
                    // eslint-disable-next-line no-undef
                    let label = new esri.symbol.TextSymbol((mergeOpen && item.mergeName) ? item.mergeName:(item.nickName ? item.nickName:item.name));
                    // eslint-disable-next-line no-undef
                    label.setColor(new esri.Color(grid.overShow ? 'rgba(0,0,0,0)':grid.fontColor));
                    // eslint-disable-next-line no-undef
                    let font  = new esri.symbol.Font();
                    // eslint-disable-next-line no-undef
                    font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
                    const { zoom } = this.props.thisData.style;
                    font.setSize(grid.fontSize*(1 + (nowZoom-zoom)*0.4));
                    label.setFont(font);
                    // eslint-disable-next-line no-undef
                    this.gridData.gridNameLayer.add(new esri.Graphic(item.namePosition,label,item));
                }
                if(grid.showNum && nowZoom > 6){
                    //网格对应值
                    const valueText = this.getSymbolFillColor(item,grid,'bgColorList',grid.numKey);
                    if(valueText){
                        // eslint-disable-next-line no-undef
                        let labelNum = new esri.symbol.TextSymbol(valueText);
                        // eslint-disable-next-line no-undef
                        labelNum.setColor(new esri.Color(grid.numColor));
                        // eslint-disable-next-line no-undef
                        let font  = new esri.symbol.Font();
                        // eslint-disable-next-line no-undef
                        font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
                        const { zoom } = this.props.thisData.style;
                        const fontSize = grid.numFontSize*(1 + (nowZoom-zoom)*0.4);
                        font.setSize(fontSize);
                        labelNum.setFont(font);
                        labelNum.setOffset(0, -fontSize);
                        // eslint-disable-next-line no-undef
                        this.gridData.gridNameLayer.add(new esri.Graphic(item.namePosition,labelNum,item));
                    }
                }
            }
        });
    }

    getSymbolFillColor(item,grid,key,numKey){
        if(grid[key] == null){
            return;
        }
        const subAreaKey = grid.subAreaKey ? grid.subAreaKey : 'name';
        for(let j = 0;j < this.resultColor.length;j ++){
            if(item[subAreaKey]+'' === this.resultColor[j][grid.subKey]+''){
                if(grid.calculateType === 1){
                    for(let i = 0;i < grid[key].length;i ++){
                        if(grid[key][i].num == this.resultColor[j][grid.colorKey]){//eslint-disable-line
                            return numKey ? this.resultColor[j][numKey]:grid[key][i].color;
                        }
                    }
                }else{
                    for(let i = 0;i < grid[key].length;i ++){
                        if(this.resultColor[j][grid.colorKey] >= grid[key][i].bottom && this.resultColor[j][grid.colorKey] < grid[key][i].top){
                            return numKey ? this.resultColor[j][numKey]:grid[key][i].color;
                        }
                    }
                }
                break;
            }
        }
        if(key === 'bgColorList'){
            return numKey ? '':grid.backgroundColor;
        }else{
            return numKey ? '':grid.lineColor;
        }
    }

    //获取网格结构数据
    loadGridTreeData(gridTreeUrl){
        if(gridTreeUrl){
            axios.get(gridTreeUrl,{params:{rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                const result = response.data;
                if(result.success){
                    this.gridTreeData.treeUrl = gridTreeUrl;
                    this.gridTreeData.treeData = result.data;
                    this.setState({gridTree:{data:result.data,showSelect:false}});
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    //网格点击响应
    gridClick(e){
        this.reSetSelectedGridColor();
        // e.stopPropagation();
        // console.log(e.graphic.attributes.name);
        if(this.gridDataParams.type === 2){
            const {areaPartClickInteract} = this.props.thisData.style.grid;
            if(areaPartClickInteract){
                this.interactData(areaPartClickInteract, e.graphic.attributes,null,e);
            }
        }else if(this.gridDataParams.clickType === 3){
            const {areaClickInteractTwo} = this.props.thisData.style.grid;
            if(areaClickInteractTwo){
                this.interactData(areaClickInteractTwo, e.graphic.attributes,null,e);
            }
        }else{
            const {areaClickInteract} = this.props.thisData.style.grid;
            if(areaClickInteract){
                this.interactData(areaClickInteract, e.graphic.attributes,null,e);
            }
        }
        const { backgroundColorSelected } = this.props.thisData.style.grid;
        if(backgroundColorSelected){
            if(e.graphic.symbol.type === 'textsymbol'){
                const {graphics} = this.gridData.gridLayer;
                for(let i = 0;i < graphics.length;i ++){
                    if(graphics[i].attributes.name === e.graphic.attributes.name){
                        this.selectedGrid = graphics[i];
                        break;
                    }
                }

            }else{
                this.selectedGrid = e.graphic;
            }
            const symbol = this.selectedGrid.symbol;
            this.selectedGridColor = symbol.color;
            // eslint-disable-next-line no-undef
            symbol.setColor(new esri.Color(backgroundColorSelected));
            this.selectedGrid.setSymbol(symbol);
        }
    }

    reSetSelectedGridColor(){
        if(this.selectedGrid){
            const symbol = this.selectedGrid.symbol;
            // eslint-disable-next-line no-undef
            symbol.setColor(new esri.Color(this.selectedGridColor));
            this.selectedGrid.setSymbol(symbol);
            this.selectedGrid = null;
        }
    }

    //网格鼠标悬浮响应
    gridMouseOver(e){
        const {graphics} = this.gridData.gridNameLayer;
        const { grid } = this.props.thisData.style;
        //显示网格名称
        for(let i = 0;i < graphics.length;i ++){
            if(graphics[i].symbol.type === 'textsymbol' && graphics[i].attributes.name === e.graphic.attributes.name && grid.overShow){
                const { grid } = this.props.thisData.style;
                const {symbol} = graphics[i];
                symbol.setColor(grid.fontColor);
                graphics[i].setSymbol(symbol);
                break;
            }
        }
        const {areaMouseOverInteract} = this.props.thisData.style.grid;
        if(areaMouseOverInteract && areaMouseOverInteract.length > 0){
            this.reSetSelectedGridColor();
            this.interactData(areaMouseOverInteract, e.graphic.attributes,null,e);
        }
    }

    //网格鼠标移开响应
    gridMouseOut(e){
        const {graphics} = this.gridData.gridNameLayer;
        const { grid } = this.props.thisData.style;
        //隐藏网格名称
        for(let i = 0;i < graphics.length;i ++){
            if(graphics[i].symbol.type === 'textsymbol' && graphics[i].attributes.name === e.graphic.attributes.name && grid.overShow){
                const {symbol} = graphics[i];
                symbol.setColor('rgba(0,0,0,0)');
                graphics[i].setSymbol(symbol);
                break;
            }
        }
        const {areaMouseOverInteract} = this.props.thisData.style.grid;
        if(areaMouseOverInteract && areaMouseOverInteract.length > 0){
            this.map.infoWindow.hide();
        }
    }

    //初始化/更新图层
    initLayer(layerItem,index){
        let needNewLayer = false;
        if(this.dataList[index]){
            if((layerItem.type === 3 || this.dataList[index].layerType === 3) && layerItem.type !== this.dataList[index].layerType){
                needNewLayer = true;
                this.map.removeLayer(this.dataList[index].layer);
            }
            this.dataList[index].updateTime = layerItem.updateTime;
            this.dataList[index].layerType = layerItem.type;
        }else{
            this.dataList[index] = {updateTime:layerItem.updateTime,gridParams:{},layerIndex:index,layerType:layerItem.type};
            needNewLayer = true;
        }
        if(needNewLayer){
            if(layerItem.type === 3){
                const layerDefinition = {
                    "geometryType": "esriGeometryPoint",
                    "fields": []
                };
                const featureCollection = {
                    layerDefinition: layerDefinition,
                    featureSet:null
                };
                // eslint-disable-next-line no-undef
                this.dataList[index].layer = new esri.layers.FeatureLayer(featureCollection,{
                    // eslint-disable-next-line no-undef
                    mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                    opacity:1});
                this.map.addLayer(this.dataList[index].layer,layerItem.zoom ? layerItem.zoom : (index+3));
            }else{
                // eslint-disable-next-line no-undef
                this.dataList[index].layer = new esri.layers.GraphicsLayer();
                this.dataList[index].layer.on('click',this.markerClick.bind(this,layerItem,'main'));
                //判断该图层是否有悬浮窗显示交互
                let hasWindow = false;
                if(layerItem.interact){
                    for(let i = 0;i < layerItem.interact.length;i ++){
                        if(layerItem.interact[i].type === 5){
                            hasWindow = true;
                            break;
                        }
                    }
                }
                if(hasWindow){
                    //若有悬浮窗交互则绑定相关函数
                    this.dataList[index].layer.on('mouse-over',this.markerHover.bind(this,layerItem.interact));
                    this.dataList[index].layer.on('mouse-out',() => this.map.infoWindow.hide());
                }
                // console.log('图层：'+(index+3));
                this.map.addLayer(this.dataList[index].layer,layerItem.zoom ? layerItem.zoom : (index+3));
            }
        }
        if(layerItem.type === 3){
            // eslint-disable-next-line no-undef
            const heatmapRenderer = new esri.renderer.HeatmapRenderer({
                blurRadius: 10,
                maxPixelIntensity: 30,
                minPixelIntensity: 0
            });
            if(layerItem.heatColor && layerItem.heatColor.length > 0){
                heatmapRenderer.setColorStops(layerItem.heatColor);
            }else{
                heatmapRenderer.setColorStops([
                    { ratio: 0, color: "rgba(46,167,224,0)"},
                    { ratio: 0.1, color: "rgba(46,167,224,0.1)"},
                    { ratio: 0.11, color: "rgba(46,167,224,0.2)"},
                    { ratio: 0.2, color: "rgba(46,167,224,0.2)"},
                    { ratio: 0.21, color: "rgba(46,167,224,0.4)"},
                    { ratio: 0.4, color: "rgba(46,167,224,0.4)"},
                    { ratio: 0.41, color: "rgba(46,167,224,0.5)"},
                    { ratio: 0.5, color: "rgba(46,167,224,0.5)"},
                    { ratio: 0.51, color: "rgba(46,167,224,0.7)"},
                    { ratio: 0.95, color: "rgba(46,167,224,0.7)"} ,
                    { ratio: 0.951, color: "rgba(46,167,224,0.9)"} ,
                    { ratio: 1.0, color: "rgba(46,167,224,0.9)"}
                ]);
            }
            this.dataList[index].layer.setRenderer(heatmapRenderer);
        }

    }

    //加载地图点
    loadMapPoint(){
        this.initMapSelectList();
        const { layer } = this.props.thisData.style;
        if(layer.length === 0){
            this.dataList.forEach((item) => {
                item.layer.clear();
            });
            this.dataList = [];
        }else{
            layer.forEach((layerItem,index) => {
                if(this.dataList[index] == null || this.dataList[index].updateTime !== layerItem.updateTime){
                    this.initLayer(layerItem,index);
                    //加载数据筛选控件
                    this.initSelectList(layerItem.category,index,layerItem.selectOpen,layerItem.firstShow);
                    //获取点位数据
                    if((layerItem.firstLoad !== 0 && layerItem.type !== 4) || this.needGetDataLayer.indexOf(index) >= 0){
                        this.getPointData(layerItem,this.dataList[index],index);
                    }
                }
            });
            if(this.dataList.length > layer.length){
                for(let i = layer.length;i < this.dataList.length;i ++){
                    this.dataList[i].layer.clear();
                    this.map.removeLayer(this.dataList[i].layer);
                }
                this.dataList.length = layer.length;
            }
        }
    }

    //地图显示范围更改时刷新聚合点位数据
    refreshMapPoint(freshData){
        const { layer } = this.props.thisData.style;
        layer.forEach((layerItem,index) => {
            if(layerItem.cluster || freshData){
                if(this.dataList[index] != null){
                    this.getPointData(layerItem,this.dataList[index],index,freshData);
                }else{
                    // layerItem.needGetData = true;
                    this.needGetDataLayer.push(index);
                }
            }
        });
    }

    //图层内数据过滤显示
    changeMapPointShow(index,freshData){
        const { layer } = this.props.thisData.style;
        this.getPointData(layer[index],this.dataList[index],index,freshData);
    }

    //获取地图数据筛选条件
    getMapSelectParams(){
        let params = {};
        this.state.mapSelectList.forEach((item)=>{
            if(!item.checkAll){
                // params[item.key] = encodeURI(JSON.stringify(item.checkedList));
                if(item.sendType === 2){
                    let thisParams = [];
                    if(item.checkedList && item.typeList){
                        item.checkedList.forEach((value)=>{
                            for(let i = 0;i < item.typeList.length;i ++){
                                if(item.typeList[i].value+'' === value+''){
                                    let part = item.typeList[i].sendData;
                                    try {
                                        part = JSON.parse(item.typeList[i].sendData);
                                    }catch (e) {}
                                    if(typeof(part) === 'string'){
                                        thisParams.push(part);
                                    }else{
                                        thisParams.push(...part);
                                    }
                                    break;
                                }
                            }
                        })
                    }
                    params[item.key] = encodeURI(JSON.stringify(thisParams));
                }else{
                    params[item.key] = encodeURI(JSON.stringify(item.checkedList));
                }
            }
            // const { style } = this.props.thisData;
            // if(style.category[index] && style.category[index].interact){
            //     const {interact} = style.category[index];
            //     setTimeout(()=>{
            //         interact.forEach((interactItem)=>{
            //             let sendData = {};
            //             sendData[interactItem.keyName] = !item.checkAll ? item.checkedList:[];
            //             Emitter.emit(interactItem.receiveId,{type:'changeKey',data:sendData});
            //         })
            //     });
            // }
        });
        this.mapSelectParams = params;
    }

    //获取点位数据
    getPointData(layer,dataPart,layerIndex,freshData){
        if(layer.url){
            //停止旧的定时器
            if(dataPart.timerId){
                clearTimeout(dataPart.timerId);
            }
            //定时任务刷新数据
            if(layer.freshTime){
                dataPart.timerId = setTimeout(() => this.getPointData(layer,dataPart,layerIndex,true),layer.freshTime);
            }
            const { selectList } = this.state;
            //若有勾选类型才去请求数据
            if(selectList[layerIndex].checkAll || selectList[layerIndex].indeterminate){
                let changeKey = false;
                let gridParams = {};
                let indexParams = {};
                let layerParams = {};
                //网格筛选条件
                if(this.mapParams[layer.id] != null && this.mapParams[layer.id].changeKey){
                    changeKey = true;
                    gridParams = this.mapParams[layer.id].data;
                }
                //图层序号筛选条件
                if(this.mapParamsIndex[layerIndex] != null){
                    indexParams = this.mapParamsIndex[layerIndex];
                }
                //交互修改请求条件
                if(this.layerParams[layerIndex]){
                    layerParams = this.layerParams[layerIndex];
                }
                //若图层内有需要显示的内容则进行数据获取
                if(freshData || dataPart.url !== layer.url || dataPart.params !== layer.params || changeKey){
                    //若请求数据地址或条件发生更改则重新请求数据
                    let params = {};
                    if(layer.params){
                        try {
                            params = JSON.parse(layer.params);
                        }catch (e) {}
                    }
                    let layerUrl = layer.url;
                    if(this.mapSelectParams){
                        for(let paramsKey in this.mapSelectParams){
                            if(layerUrl.indexOf('?') > 0){
                                layerUrl += "&" + paramsKey + '=' + this.mapSelectParams[paramsKey];
                            }else{
                                layerUrl += "?" + paramsKey + '=' + this.mapSelectParams[paramsKey];
                            }
                        }
                    }
                    axios.get(layerUrl,{params:{...params,...gridParams,...indexParams,...layerParams,rbacToken:this.props.token}}).then((response) => {
                        // 在这儿实现 setState
                        const result = response.data;
                        if(result.success){
                            this.mapParams[layer.id] = {changeKey:false};
                            dataPart.url = layer.url;
                            dataPart.params = layer.params;
                            //坐标转换
                            const {style} = this.props.thisData;
                            const pointList = result.data;
                            if(layer.type === 4){
                                // console.log(this.gridData.gridLayer);
                                const {graphics} = this.gridData.gridLayer;
                                pointList.forEach((point)=>{
                                    for(let i = 0;i < graphics.length;i ++){
                                        if(graphics[i].symbol.type !== 'textsymbol' && point.name === graphics[i].attributes.name){
                                            const center = graphics[i]._extent.getCenter();
                                            point.x = center.x;
                                            point.y = center.y;
                                            break;
                                        }
                                    }
                                })
                            }else if(layer.type === 2){
                                if(layer.wkid === 2){
                                    pointList.forEach((point)=>{
                                        if(point.points){
                                            let newPoints = [];
                                            point.oldPoints = point.points;
                                            point.points.forEach((onePoint)=>{
                                                const changePoint = GPS.gcj_decrypt_exact(parseFloat(onePoint[1]),parseFloat(onePoint[0]));
                                                newPoints.push([changePoint.lon,changePoint.lat]);
                                            });
                                            point.points = newPoints;
                                        }
                                    });
                                }
                            }else{
                                if((layer.wkid === 2 || layer.wkid === 3 || layer.wkid === 4) && style.mapBase !== 'ZT'){
                                    if(layer.wkid === 2){
                                        pointList.forEach((point)=>{
                                            point.oldx = point.x;
                                            point.oldy = point.y;
                                            const changePoint = GPS.gcj_decrypt_exact(parseFloat(point.y),parseFloat(point.x));
                                            point.x = changePoint.lon;
                                            point.y = changePoint.lat;
                                        });
                                    }else if(layer.wkid === 3){
                                        pointList.forEach((point)=>{
                                            point.oldx = point.x;
                                            point.oldy = point.y;
                                            // const changePoint = GPS.gcj_decrypt_exact(parseFloat(point.y),parseFloat(point.x));
                                            const changePointOne = GPS.bd_decrypt(parseFloat(point.y),parseFloat(point.x));
                                            const changePointTwo = GPS.gcj_decrypt_exact(parseFloat(changePointOne.lat),parseFloat(changePointOne.lon));
                                            point.x = changePointTwo.lon;
                                            point.y = changePointTwo.lat;
                                        });
                                    }else if(layer.wkid === 4){
                                        pointList.forEach((point)=>{
                                            point.oldx = point.x;
                                            point.oldy = point.y;
                                            // const changePoint = GPS.gcj_decrypt_exact(parseFloat(point.y),parseFloat(point.x));
                                            const changePointOne = GPS.bd_decrypt(parseFloat(point.y),parseFloat(point.x));
                                            const changePointTwo = GPS.gcj_decrypt_exact(parseFloat(changePointOne.lat),parseFloat(changePointOne.lon));
                                            point.x = changePointTwo.lon;
                                            point.y = changePointTwo.lat;
                                        });
                                    }
                                }else if(style.mapBase === 'ZT' && layer.wkid !== 2){
                                    pointList.forEach((point)=>{
                                        point.oldx = point.x;
                                        point.oldy = point.y;
                                        const changePoint = GPS.gcj_encrypt(parseFloat(point.y),parseFloat(point.x));
                                        point.x = changePoint.lon;
                                        point.y = changePoint.lat;
                                    });
                                }else{
                                    pointList.forEach((point)=>{
                                        point.x = parseFloat(point.x);
                                        point.y = parseFloat(point.y);
                                    });
                                }
                            }
                            dataPart.data = pointList;
                            //清空该图层
                            dataPart.layer.clear();
                            //重新打点
                            this.addPoint(layer,dataPart,selectList[layerIndex]);
                        }
                    }).catch(function(error){
                        // 处理请求出错的情况
                    });
                }else{
                    //清空该图层
                    dataPart.layer.clear();
                    //若请求数据地址未发生更改则直接打点
                    this.addPoint(layer,dataPart,selectList[layerIndex]);
                }
            }else{
                //清空该图层
                dataPart.layer.clear();
                dataPart.layer.refresh();
            }
        }
    }

    //将点打到地图上
    addPoint(layer,dataPart,selectData){
        if(dataPart.data == null){
            return;
        }
        // if(!selectData.checkAll){
        //     return;
        // }
        let typeKey;
        let subType;
        if(selectData != null && layer.category.length > 0){
            typeKey = layer.category[selectData.selectTab].key;
            subType = layer.category[selectData.selectTab].subType;
        }
        if(layer.cluster && layer.type !== 2 && layer.type !== 3 && this.map.getZoom() < this.map.getMaxZoom()){
            //数据过滤设置
            if(layer.category == null || layer.category.length === 0 || selectData.checkAll){
                _clusterLayer._checkAll = true;
            }else{
                _clusterLayer._checkAll = false;
                _clusterLayer._checkedList = selectData.checkedList;
                _clusterLayer._checkedKey = typeKey;
                _clusterLayer._subType = subType;
            }
            //聚合方式
            if(layer.clusterType != null){
                _clusterLayer._clusterType = layer.clusterType;
            }
            //选中点独立显示设置
            _clusterLayer._selectedId = this.selectedId;
            //地图层级设置
            _clusterLayer._clusterResolution = this.map.extent.getWidth()/this.map.width;
            _clusterLayer._extent = this.map.extent;
            //数据设置
            _clusterLayer._clusterData = dataPart.data;
            _clusterLayer._clusters = [];
            //计算聚合
            _clusterLayer._clusterGraphics();
            //循环聚合结果打点
            _clusterLayer._clusters.forEach((point) => {
                const clusterCount = point.attributes.clusterCount;
                // eslint-disable-next-line no-undef
                let pointView = new esri.geometry.Point(point.x, point.y);
                let symbol;
                let label;
                if(clusterCount === 1){
                    //若为孤立点位
                    let thisIcon = this.getSubIcon(layer,point[layer.key]);
                    symbol = this.getMarkerStyle(thisIcon,layer.whole,point.id);
                }else{
                    //若为聚合点位
                    let thisIcon = {};
                    for(let i = 0;i < layer.renderer.length;i ++){
                        //根据聚合设置选择图标、大小、偏移量
                        if(point.attributes.clusterCount >= layer.renderer[i].min && point.attributes.clusterCount <= layer.renderer[i].max){
                            thisIcon = layer.renderer[i];
                            break;
                        }
                    }
                    const thisStyle = this.getMarkerStyle(thisIcon,layer.whole,point.id,clusterCount);
                    symbol = thisStyle.symbol;
                    label = thisStyle.label;
                }
                if(symbol){
                    // eslint-disable-next-line no-undef
                    let graphic = new esri.Graphic(pointView,symbol,{...point,clusterCount,selectedImg:layer.whole.selectedImg,layerIndex:dataPart.layerIndex});
                    if(this.selectedId === point.id && clusterCount === 1){
                        this.selectedGraphic = graphic;
                    }
                    dataPart.layer.add(graphic);
                }
                if(label){
                    // eslint-disable-next-line no-undef
                    dataPart.layer.add(new esri.Graphic(pointView,label,{...point,clusterCount}));
                }
            });
        }else{
            dataPart.data.forEach((point) => {
                if(layer.type !== 2 && (!point.x || !point.y)){
                    return;
                }
                let showThis = false;
                if(layer.category != null && layer.category.length > 0 && !selectData.checkAll){
                    if(subType === 2){
                        //匹配类型为模糊匹配时
                        selectData.checkedList.forEach((item) => {
                            if(point[typeKey].toString().indexOf(item) >= 0){
                                showThis = true;
                            }
                        });
                    }else{
                        //匹配类型为相等时
                        if(selectData.checkedList.indexOf(point[typeKey]) >= 0){
                            showThis = true;
                        }
                    }
                }else{
                    showThis = true;
                }
                //根据选择情况筛选数据是否显示
                if(showThis){
                    let geometryView;
                    let symbol;
                    let label;
                    if(layer.type === 2){
                        // eslint-disable-next-line no-undef
                        geometryView = new esri.geometry.Polyline(point.points);
                        symbol = this.getLineStyle(layer,point);
                    }else if(layer.type === 3){
                        // eslint-disable-next-line no-undef
                        geometryView = new esri.geometry.Point(point.x, point.y);
                        // eslint-disable-next-line no-undef
                        dataPart.layer.add(new esri.Graphic(geometryView));
                    }else{
                        // eslint-disable-next-line no-undef
                        geometryView = new esri.geometry.Point(point.x, point.y);
                        let thisIcon = this.getSubIcon(layer,point[layer.key]);
                        const text = layer.textKey ? point[layer.textKey] : null;
                        const thisStyle = this.getMarkerStyle(thisIcon,layer.whole,point.id,false,text != null ? text+'':text);
                        if(layer.textKey && text != null){
                            symbol = thisStyle.symbol;
                            label = thisStyle.label;
                        }else{
                            symbol = thisStyle;
                        }
                    }
                    if(symbol){
                        // eslint-disable-next-line no-undef
                        let graphic = new esri.Graphic(geometryView,symbol,{...point,selectedImg:layer.whole.selectedImg,layerIndex:dataPart.layerIndex});
                        if(this.selectedId === point.id){
                            this.selectedGraphic = graphic;
                        }
                        dataPart.layer.add(graphic);
                    }
                    if(label){
                        // eslint-disable-next-line no-undef
                        dataPart.layer.add(new esri.Graphic(geometryView,label,{...point,layerIndex:dataPart.layerIndex}));
                    }
                }
            });
        }
    }

    getSubIcon(layer,data){
        if(layer && layer.icon && data != null){
            if(layer.iconSubType === 2){
                for(let i = 0;i < layer.icon.length;i ++){
                    if(layer.icon[i].more <= data && layer.icon[i].less > data){
                        return layer.icon[i];
                    }
                }
            }else{
                for(let i = 0;i < layer.icon.length;i ++){
                    if(layer.icon[i].value+'' === data+''){
                        return layer.icon[i];
                    }
                }
            }
        }
        return {};
    }

    //点位样式设置
    getMarkerStyle(thisIcon,whole,id,clusterCount,text){
        let symbol;
        if(clusterCount){
            //聚合点位样式
            const img = thisIcon.img ? thisIcon.img : whole.clusterImg;
            const width = thisIcon.width ? thisIcon.width : whole.clusterWidth;
            const height = thisIcon.height ? thisIcon.height : whole.clusterHeight;
            const left = thisIcon.left ? thisIcon.left : whole.clusterLeft;
            const top = thisIcon.top ? thisIcon.top : whole.clusterTop;
            // eslint-disable-next-line no-undef
            symbol = new esri.symbol.PictureMarkerSymbol(fileUrl + '/download/' + img, width, height);
            symbol.setOffset(left, top);
        }else{
            //单独点位样式
            let img,width,height,left,top;
            if(whole.selectedImg && this.selectedId === id){
                img = whole.selectedImg;
                width = whole.selectedWidth ? whole.selectedWidth:(thisIcon.img ? thisIcon.img : whole.img);
                height = whole.selectedHeight ? whole.selectedHeight:(thisIcon.height ? thisIcon.height : whole.height);
                left = whole.selectedLeft || 0;
                top = whole.selectedTop || 0;
            }else{
                img = thisIcon.img ? thisIcon.img : whole.img;
                width = thisIcon.width ? thisIcon.width : whole.width;
                height = thisIcon.height ? thisIcon.height : whole.height;
                left = thisIcon.left ? thisIcon.left : whole.left;
                top = thisIcon.top ? thisIcon.top : whole.top;
            }
            // eslint-disable-next-line no-undef
            symbol = new esri.symbol.PictureMarkerSymbol(fileUrl + '/download/' + img, width, height);
            symbol.setOffset(left, top);
        }
        const labelText = clusterCount || text;
        if(labelText != null){
            //聚合数字标识样式
            const fontSize = thisIcon.fontSize ? thisIcon.fontSize : whole.fontSize;
            const fontTop = thisIcon.fontTop ? thisIcon.fontTop : whole.fontTop;
            const fontLeft = thisIcon.fontLeft ? thisIcon.fontLeft : whole.fontLeft;
            const fontColor = thisIcon.fontColor ? thisIcon.fontColor : whole.fontColor;
            // eslint-disable-next-line no-undef
            let label = new esri.symbol.TextSymbol(labelText);
            label.setOffset(fontLeft, fontTop);
            // eslint-disable-next-line no-undef
            label.setColor(new esri.Color(fontColor));
            // eslint-disable-next-line no-undef
            let font = new esri.symbol.Font();
            // eslint-disable-next-line no-undef
            font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
            font.setSize(fontSize);
            label.setFont(font);
            return {symbol,label};
        }else{
            return symbol;
        }
    }

    getLineStyle(layer,point){
        let thisLineStyle;
        if(layer.line){
            for(let i = 0;i < layer.line.length;i ++){
                if(point[layer.key] == layer.line[i].value){//eslint-disable-line
                    thisLineStyle = layer.line[i];
                    break;
                }
            }
        }
        if(thisLineStyle == null){
            thisLineStyle = layer.whole;
        }
        const lineColor = thisLineStyle.lineColor ? thisLineStyle.lineColor : '#0ff';
        const lineWidth = thisLineStyle.lineWidth ? thisLineStyle.lineWidth : '6';
        const lineType = thisLineStyle.lineType ? thisLineStyle.lineType : 'solid';
        // eslint-disable-next-line no-undef
        return new esri.symbol.SimpleLineSymbol(lineType, new esri.Color(lineColor), lineWidth);
    }

    //清空周边图层数据
    clearNearPoint(dataList){
        dataList.forEach((item) => {
            if(item.layer != null){
                item.layer.clear();
            }
        });
    }

    //加载周边图层数据
    loadNearPoint(nearLayer,graphic,distance){
        const { attributes,geometry } = graphic;
        this.clearNearPoint(this.nearDataList);
        nearLayer.forEach((layer,index) => {
            if(this.nearDataList[index] == null){
                this.nearDataList[index] = {layerIndex:index};
                // eslint-disable-next-line no-undef
                this.nearDataList[index].layer = new esri.layers.GraphicsLayer();
                this.nearDataList[index].layer.on('click',this.markerClick.bind(this,layer,'child'));
                this.map.addLayer(this.nearDataList[index].layer,(index+this.dataList.length+2));
            }
            // eslint-disable-next-line no-undef
            let circle = new esri.geometry.Circle(geometry,{
                radius: distance
            });
            const sendData = {
                x: attributes.oldx ? attributes.oldx : attributes.x,
                y: attributes.oldy ? attributes.oldy :attributes.y,
                distance: circle.rings[0][0][0] - geometry.x
            };
            axios.get(layer.url,{params:{...sendData,rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                const result = response.data;
                if(result.success){
                    this.nearDataList[index].data = result.data;
                    this.addPoint(layer,this.nearDataList[index]);
                    if(layer.needSend){
                        Emitter.emit(layer.receiveId,{type:'dataInterchange',data:result.data});
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        });
    }

    //加载关联图层数据
    loadAboutPoint(aboutLayer,geometry,id){
        this.clearNearPoint(this.aboutDataList);
        aboutLayer.forEach((layer,index) => {
            if(this.aboutDataList[index] == null){
                this.aboutDataList[index] = {layerIndex:index};
                // eslint-disable-next-line no-undef
                this.aboutDataList[index].layer = new esri.layers.GraphicsLayer();
                this.aboutDataList[index].layer.on('click',this.markerClick.bind(this,layer,'child'));
                this.map.addLayer(this.aboutDataList[index].layer,(index+this.dataList.length+2));
            }
            axios.get(layer.url,{params:{id,rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                const result = response.data;
                if(result.success){
                    this.aboutDataList[index].data = result.data;
                    this.addAboutLine(layer,this.aboutDataList[index],geometry);
                    this.addPoint(layer,this.aboutDataList[index]);
                    if(layer.needSend){
                        Emitter.emit(layer.receiveId,{type:'dataInterchange',data:result.data});
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        });
    }

    //添加关联线
    addAboutLine(layer,dataPart,center){
        const lineColor = layer.lineColor ? layer.lineColor : '#0ff';
        const lineWidth = layer.lineWidth ? layer.lineWidth : '6';
        const lineType = layer.lineType ? layer.lineType : 'solid';
        // eslint-disable-next-line no-undef
        const symbolLine = new esri.symbol.SimpleLineSymbol(lineType, new esri.Color(lineColor), lineWidth);
        dataPart.data.forEach((point) => {
            // eslint-disable-next-line no-undef
            const polyline = new esri.geometry.Polyline([[center.x,center.y],[point.x,point.y]]);
            // eslint-disable-next-line no-undef
            const graphic = new esri.Graphic(polyline,symbolLine);
            dataPart.layer.add(graphic);
        });
    }

    //还原上次点击的点位图标
    changeClickImgBack(){
        if(this.selectedGraphic != null && this.selectedImg){
            this.selectedGraphic.symbol.setUrl(this.selectedImg);
            if(this.selectedImgSize){
                this.selectedGraphic.symbol.setWidth(this.selectedImgSize.width);
                this.selectedGraphic.symbol.setHeight(this.selectedImgSize.height);
                this.selectedGraphic.symbol.setOffset(this.selectedImgSize.left || 0,this.selectedImgSize.top || 0);
            }
            this.selectedGraphic.setSymbol(this.selectedGraphic.symbol);
            this.selectedGraphic = null;
            this.selectedImg = null;
        }
    }

    //更改点击的点位图标
    changeClickImg(graphic){
        const { attributes } = graphic;
        this.changeClickImgBack();
        if(!attributes.selectedImg){
            this.selectedId = attributes.id;
            return;
        }
        if(this.selectedId === attributes.id){
            this.selectedGraphic = null;
            this.selectedId = null;
            this.selectedImg = null;
        }else{
            this.selectedGraphic = graphic;
            this.selectedId = attributes.id;
            if(attributes.selectedImg){
                const layer = graphic._graphicsLayer;
                layer.remove(graphic);
                this.selectedImg = graphic.symbol.url;
                graphic.symbol.setUrl(fileUrl + '/download/' + attributes.selectedImg);
                if(this.props.thisData.style.layer[attributes.layerIndex]){
                    this.selectedImgSize = {
                        width: graphic.symbol.width,
                        height: graphic.symbol.height,
                        left: graphic.symbol.xoffset,
                        top: graphic.symbol.yoffset
                    };
                    const {whole} = this.props.thisData.style.layer[attributes.layerIndex];
                    if(whole.selectedWidth){
                        graphic.symbol.setWidth(whole.selectedWidth);
                    }
                    if(whole.selectedHeight){
                        graphic.symbol.setHeight(whole.selectedHeight);
                    }
                    if(whole.selectedTop != null || whole.selectedLeft != null){
                        graphic.symbol.setOffset(whole.selectedLeft || 0,whole.selectedTop || 0);
                    }
                }else{
                    this.selectedImgSize = null;
                }
                graphic.setSymbol(graphic.symbol);
                layer.add(graphic);
            }
        }
    }

    //关闭地图内弹窗并刷新数据
    hideWindow(reFresh){
        this.map.infoWindow.hide();
        if(reFresh){
            this.changeMapPointShow(this.clickLayerIndex,true);
        }
    }

    //点位点击响应
    markerClick(layer,layerIndex,e,clickType){
        this.reSetSelectedGridColor()
        // console.log('markerClick');
        if(clickType !== 'analog'){
            e.stopPropagation();
        }
        const { attributes } = e.graphic;
        const { interact,clusterInteract } = layer;
        this.clickLayerIndex = attributes.layerIndex;
        if(attributes.clusterCount == null || attributes.clusterCount === 1){
            if(layerIndex === 'main'){
                if(this.aboutSelected && this.aboutSelected !== attributes.id){
                    this.aboutSelected = '';
                    this.clearNearPoint(this.aboutDataList);
                }
                if(this.nearSelected && this.nearSelected !== attributes.id){
                    this.nearSelected = '';
                    this.clearNearPoint(this.nearDataList);
                }
            }
            this.map.infoWindow.hide();
            this.changeClickImg(e.graphic);
            this.interactItem(interact,attributes,e,clickType);
        }else{
            if(clusterInteract != null && clusterInteract.length > 0){
                //若聚合点有交互设置则进行对应交互操作
                this.interactItem(clusterInteract,attributes,e);
            }else{
                //点击聚合点位时放大地图
                this.map.centerAndZoom(e.graphic.geometry,this.map.getZoom() + 1);
                // this.map.setZoom(this.map.getZoom() + 1);
                // console.log(e.graphic.geometry)
                // this.map.setCenter(e.graphic.geometry)
            }
        }
    }

    interactItem(interact,attributes,e,clickType){
        interact.forEach((item) => {
            if(item.actionType !== 2){
                this.interactAction(item,attributes,e,clickType);
            }else{
                //感觉某字段不同值进行不同的交互
                item.baseList && item.baseList.forEach((baseItem) => {
                    switch(baseItem.valueType){
                        case "1":
                            if(attributes[item.baseKey] == null){
                                this.interactAction(baseItem,attributes,e,clickType);
                            }
                            break;
                        case "2":
                            if(attributes[item.baseKey] != null){
                                this.interactAction(baseItem,attributes,e,clickType);
                            }
                            break;
                        case "other":
                            if(attributes[item.baseKey]+'' === baseItem.value+''){
                                this.interactAction(baseItem,attributes,e,clickType);
                            }
                            break;
                        default:
                    }
                });
            }
        });
    }

    interactAction(item,attributes,e,clickType){
        let sendData = {};
        try{
            sendData = JSON.parse(item.remark);
        }catch (e) {}
        switch (item.type) {
            // case 1:
            //     //显示详情
            //     // sendData[item.keyName] = item.keyContent ? attributes[item.keyContent]:attributes.id;
            //     // Emitter.emit(item.receiveId,{type:'showComponent',data:sendData});
            //     break;
            case 2:
                //显示/关闭周边
                if(this.nearSelected === attributes.id && clickType !== 'analog'){
                    this.nearSelected = '';
                    this.clearNearPoint(this.nearDataList);
                }else{
                    this.nearSelected = attributes.id;
                    this.loadNearPoint(item.nearLayer,e.graphic,item.distance);
                }
                break;
            case 3:
                //显示关联内容
                if(this.aboutSelected === attributes.id){
                    this.aboutSelected = '';
                    this.clearNearPoint(this.aboutDataList);
                }else{
                    this.aboutSelected = attributes.id;
                    this.loadAboutPoint(item.aboutLayer,e.graphic.geometry,attributes.id);
                }
                break;
            case 1:
            case 4:
            case 9:
            case 11:
                //发送数据
                item.message && item.message.forEach((messageItem)=>{
                    let data;
                    if(messageItem.dataSource === 2){
                        data = attributes.layerIndex != null && this.layerParams[attributes.layerIndex] ? this.layerParams[attributes.layerIndex][messageItem.dataKey]:null;
                    }else{
                        data = attributes == null || (item.respondType === 2 && this.selectedId == null) ? null : attributes[messageItem.dataKey];
                    }
                    sendData[messageItem.messageKey] = messageItem.dataStyle === 2 ? [data]:data;
                });
                if(item.mapSelect && item.mapSelectList && item.mapSelectList.length > 0){
                    this.state.mapSelectList.forEach((mapSelect,mapSelectIndex)=>{
                        if(item.mapSelectList[mapSelectIndex] && !mapSelect.checkAll){
                            const keyName = item.mapSelectList[mapSelectIndex].keyName;
                            if(keyName){
                                sendData[keyName] = mapSelect.checkedList;
                            }
                        }
                    });
                }
                if(item.keyName){
                    sendData[item.keyName] = item.keyContent ? attributes[item.keyContent]:attributes.id;
                }
                let actionName;
                if(item.type === 1){
                    actionName = 'showComponent';
                }else if(item.type === 4){
                    actionName = 'dataInterchange';
                }else if(item.type === 9){
                    actionName = 'changeKey';
                }else{
                    actionName = 'changeSelected';
                }
                Emitter.emit(item.receiveId,{type:actionName,data:sendData});
                break;
            case 6:
                //地图弹窗
                if(item.windowType && this.selectedId){
                    this.showMapWindow(item,e,attributes);
                }
                break;
            case 8:
                Emitter.emit('app_box', {
                    type: 'changeLayerShowStatus',
                    data: {showList: item.showList, hideList: item.hideList}
                });
                break;
            case 10:
                // this.map.setZoom(item.zoom ? item.zoom : 18);
                this.map.centerAndZoom(e.graphic.geometry,item.zoom ? item.zoom : 18);
                break;
            case 12:
                createHashHistory().push('/show/' + item.pageId +'/'+ this.props.token);
                break;
            default:
        }
    }

    showMapWindow(item,e,attributes){
        this.setState({windowContent:item.windowType,windowMessage:{...item,...attributes},windowTheme:item.windowTheme});
        if(item.windowType === 'sanitation_truck' || item.windowType === 'sanitation_worker'|| item.windowType === 'carNumber'|| item.windowType === 'car_use'){
            this.trailUrl = item.trailUrl;
            this.trailWkid = item.wkid;
            this.trailParams = {};
            if(item.message){
                item.message.forEach((messageItem)=>{
                    if(messageItem.messageKey){
                        this.trailParams[messageItem.messageKey] = attributes[messageItem.dataKey];
                    }
                });
            }
        }
        if(this.mapWindowfirstLoad){
            this.map.infoWindow.setContent(this.mapWindowBoxRef.current);
            this.mapWindowfirstLoad = false;
        }
        if(e.graphic.geometry && e.graphic.geometry.type === 'point'){
            // this.map.infoWindow.offsetY = e.graphic.symbol.height;
            this.map.infoWindow.offsetY = e.graphic.symbol.height/2+e.graphic.symbol.yoffset;
            this.map.infoWindow.show(e.graphic.geometry);
        }else{
            this.map.infoWindow.show(e.graphic._extent.getCenter());
        }
    }

    //鼠标移到点位上触发函数
    markerHover(interact,e){
        this.reSetSelectedGridColor();
        const { attributes } = e.graphic;
        if(attributes.clusterCount == null || attributes.clusterCount === 1){
            interact.forEach((item) => {
                if(item.type === 5){
                    if(item.windowType){
                        this.showMapWindow(item,e,attributes);
                    }else{
                        const content = `<div class="window">${attributes.name}</div>`;
                        this.map.infoWindow.setContent(content);
                        this.map.infoWindow.offsetY = e.graphic.symbol.height/2+e.graphic.symbol.yoffset;
                        this.map.infoWindow.show(e.graphic.geometry);
                    }
                }
            });
        }
    }

    //初始化地图全图层选择列表内容
    initMapSelectList(){
        const { style } = this.props.thisData;
        let { mapSelectList } = this.state;
        style.category && style.category.forEach((category,index)=>{
            mapSelectList[index] = {typeList:category.typeList,sendType:category.sendType,selectTab:0,indeterminate:category.defaultSelectType === 3,checkAll:category.defaultSelectType === 1,showSelect:false,checkedList:category.defaultSelectType === 3 ? JSON.parse(category.defaultSelected):[],typeData:[],showItem:true,name:category.name,key:category.key};
            if(category.dataType === 1){
                let checkedList = [];
                if(category.defaultSelectType === 1){
                    category.typeList && category.typeList.forEach((type) => {
                        checkedList.push(type.value);
                    });
                    mapSelectList[index].checkedList = checkedList;
                }
                mapSelectList[index].typeData[0] = {data:JSON.parse(JSON.stringify(category.typeList))};
                this.setState({ mapSelectList });
            }else{
                if(mapSelectList[index].typeData[0] == null){
                    mapSelectList[index].typeData[0] = {data:[]};
                }
                //若请求接口更改则更新数据
                if(mapSelectList[index].typeData[0].url !== category.url && category.url){
                    //接口获取类型
                    axios.get(category.url,{params:{rbacToken:this.props.token}}).then((response) => {
                        // 在这儿实现 setState
                        const result = response.data;
                        if(result.success){
                            let checkedList = [];
                            if(category.defaultSelectType === 1){
                                result.data.forEach((type) => {
                                    checkedList.push(type.value);
                                });
                                mapSelectList[index].checkedList = checkedList;
                            }
                            mapSelectList[index].typeData[0].url = category.url;
                            mapSelectList[index].typeData[0].data = result.data;
                            this.setState({ mapSelectList });
                        }
                    }).catch(function(error){
                        // 处理请求出错的情况
                    });
                }
            }
        });
        this.getMapSelectParams();
    }

    //初始化各图层选择列表内容
    initSelectList(category,index,selectOpen,firstShow){
        let { selectList } = this.state;
        selectList[index] = {selectTab:0,indeterminate:false,checkAll:firstShow != null ? firstShow : true,showSelect:false,checkedList:[],typeData:[],showItem:selectOpen,interactList:[]};
        if(selectOpen){
            category.forEach((item,categoryIndex) => {
                let checkedList = [];
                if(item.selectInteract){
                    selectList[index].interactList[categoryIndex] = {interact:item.selectInteract,sendDataFormat:item.sendDataFormat};
                }
                if(item.dataType === 1){
                    //固定类型
                    if(categoryIndex === 0){
                        item.typeList.forEach((type) => {
                            checkedList.push(type.value);
                        });
                        selectList[index].checkedList = checkedList;
                    }
                    selectList[index].typeData[categoryIndex] = {data:JSON.parse(JSON.stringify(item.typeList))};
                    this.setState({ selectList });
                }else{
                    if(selectList[index].typeData[categoryIndex] == null){
                        selectList[index].typeData[categoryIndex] = {data:[]};
                    }
                    //若请求接口更改则更新数据
                    if(selectList[index].typeData[categoryIndex].url !== item.url && item.url){
                        //接口获取类型
                        axios.get(item.url,{params:{rbacToken:this.props.token}}).then((response) => {
                            // 在这儿实现 setState
                            const result = response.data;
                            if(result.success){
                                if(categoryIndex === 0){
                                    result.data.forEach((type) => {
                                        checkedList.push(type.value);
                                    });
                                    selectList[index].checkedList = checkedList;
                                }
                                selectList[index].typeData[categoryIndex].url = item.url;
                                selectList[index].typeData[categoryIndex].data = result.data;
                                this.setState({ selectList });
                            }
                        }).catch(function(error){
                            // 处理请求出错的情况
                        });
                    }
                }
            });
        }
    }

    //切换下拉选择列表显示状态
    changeSelectShow(item,flag){
        item.showSelect = flag;
        let { selectList } = this.state;
        this.setState({ selectList });
    }

    //选择某行政区划
    gridSelect(key,e){
        if(e.selectedNodes && e.selectedNodes.length > 0){
            const { url,urlParams,open,interact } = this.props.thisData.style.grid;
            if(interact && interact.length > 0){
                //交互内容
                interact.forEach((item) => {
                    //交互条件
                    let params = {};
                    params[item.keyName] = item.dataType === 1 ? key[0] : e.selectedNodes[0].props.title;
                    if(item.receiveId === 'grid'){
                        //若交互方为网格
                        if(open){
                            //地图层级位置
                            const extent = e.selectedNodes[0].props.extent;
                            this.loadGridData(url,urlParams,params,extent);
                        }
                    }else{
                        //若交互方为图层
                        const { layer } = this.props.thisData.style;
                        this.mapParams[item.receiveId] = {data:params,changeKey:true};
                        for(let i = 0;i < layer.length;i ++){
                            if(layer[i].id === item.receiveId){
                                this.getPointData(layer[i],this.dataList[i],i);
                                break;
                            }
                        }
                    }
                });
            }
        }
    }

    //加载全图层数据筛选列表
    getMapSelectList(){
        let { mapSelectList } = this.state;
        let selectListDom = [];
        mapSelectList.forEach((item,index) => {
            selectListDom.push(
                <div className={cssStyle.selectItem} key={index} onMouseLeave={this.changeSelectShow.bind(this,item,false)}>
                    <Motion style={{top: spring(item.showSelect ? 100:-100),opacity:spring(item.showSelect ? 1 : 0)}} >
                        {({top,opacity}) =>
                            <div className={cssStyle.checkboxGroup} style={opacity !== 0 ? {top:top+'%',opacity:opacity}:{display:'none'}}>
                                {this.getCheckboxGroup(item,item.typeData[0].data,index,'map')}
                            </div>
                        }
                    </Motion>
                    <Checkbox
                        indeterminate={item.indeterminate}
                        onChange={this.onCheckAllChange.bind(this,index,'map')}
                        checked={item.checkAll}
                    >
                        {item.name}
                    </Checkbox>
                    <Icon type={item.showSelect ? "up":"down"} onClick={this.changeSelectShow.bind(this,item,true)} style={{display:item.typeData[0].data.length > 0 ? '':'none'}}/>
                </div>
            );
        });
        return selectListDom;
    }

    //加载各图层数据筛选列表
    getSelectList(){
        const { layer } = this.props.thisData.style;
        // const {style} = this.props.thisData;
        let { selectList,gridTree } = this.state;
        let selectListDom = [];
        selectList.forEach((item,index) => {
            if(layer[index] != null && item.showItem){
                selectListDom.push(
                    <div className={`${cssStyle.selectItem}`} key={index} onMouseLeave={this.changeSelectShow.bind(this,item,false)}>
                        <Motion style={{top: spring(item.showSelect ? 100:-100),opacity:spring(item.showSelect ? 1 : 0)}} >
                            {({top,opacity}) =>
                                <div className={cssStyle.checkboxGroup} style={opacity !== 0 ? {top:top+'%',opacity:opacity}:{display:'none'}}>
                                    {this.getSelectContent(layer[index].category,item,index)}
                                </div>
                            }
                        </Motion>
                        <Checkbox
                            indeterminate={item.indeterminate}
                            onChange={this.onCheckAllChange.bind(this,index,'layer')}
                            checked={item.checkAll}
                        >
                            {layer[index].name}
                        </Checkbox>
                        <Icon type={item.showSelect ? "up":"down"} onClick={this.changeSelectShow.bind(this,item,true)} style={{display:layer[index].category.length > 0 ? '':'none'}}/>
                    </div>
                );
            }
        });
        if(gridTree.data != null){
            selectListDom.push(
                <div className={cssStyle.selectItem} key='tree' onMouseLeave={this.changeSelectShow.bind(this,gridTree,false)}>
                    <Motion style={{top: spring(gridTree.showSelect ? 100:-100),opacity:spring(gridTree.showSelect ? 1 : 0)}} >
                        {({top,opacity}) =>
                            <div className={cssStyle.checkboxGroup} style={opacity !== 0 ? {top:top+'%',opacity:opacity,height:'37em'}:{display:'none'}}>
                                <Scrollbars>
                                    <Tree treeData={gridTree.data}
                                          defaultExpandedKeys={[gridTree.data[0].key.toString()]}
                                          defaultSelectedKeys={[gridTree.data[0].key.toString()]}
                                          onSelect={this.gridSelect.bind(this)}
                                    />
                                </Scrollbars>
                            </div>
                        }
                    </Motion>
                    <span style={{paddingRight:'8px'}}>行政区划</span>
                    <Icon type={gridTree.showSelect ? "up":"down"} onClick={this.changeSelectShow.bind(this,gridTree,true)} />
                </div>
            );
        }
        return selectListDom;
    }

    //样式二选择框内容
    getThemeTwoSelect(){
        const { layer } = this.props.thisData.style;
        // let { selectList,selectedBoxShow,gridShow } = this.state;
        let { selectList,selectedBoxShow } = this.state;
        let showLength = 0;
        const content = selectList.map((item,index) => {
            if(layer[index] != null && item.showItem){
                showLength ++;
                return (
                    <Checkbox
                        onChange={this.onCheckAllChange.bind(this,index,'layer')}
                        checked={item.checkAll}
                        key={index}
                        className={cssStyle.checkBoxThemeTwo}
                    >
                        <div className={cssStyle.checkContentBox}>
                            <div>{layer[index].name}</div>
                            <div className={cssStyle.point} />
                        </div>
                    </Checkbox>
                );
            }else{
                return '';
            }
        });
        return (
            <Motion style={{height: spring(selectedBoxShow ? (showLength-1)*2+3.5:0)}} >
                {({height}) =>
                    <div className={cssStyle.contentBox} style={{height:height+'em'}}>
                        {content}
                        {/*<Checkbox*/}
                        {/*    onChange={this.changeGridShow.bind(this,!gridShow)}*/}
                        {/*    checked={gridShow}*/}
                        {/*    className={cssStyle.checkBoxThemeTwo}*/}
                        {/*>*/}
                        {/*    <div className={cssStyle.checkContentBox}>*/}
                        {/*        <div>微网格边界</div>*/}
                        {/*        <div className={cssStyle.point}/>*/}
                        {/*    </div>*/}
                        {/*</Checkbox>*/}
                    </div>
                }
            </Motion>
        );
    }

    //切换网格显示隐藏
    changeGridShow(gridShow){
        this.setState({gridShow});
        if(gridShow){
            this.gridData.gridLayer && this.gridData.gridLayer.show();
            this.gridData.gridLayerBox && this.gridData.gridLayerBox.show();
        }else{
            this.gridData.gridLayer && this.gridData.gridLayer.hide();
            this.gridData.gridLayerBox && this.gridData.gridLayerBox.hide();
        }
    }

    //切换选择框展开收起
    changeSelectBoxShow(){
        const {selectedBoxShow} = this.state;
        this.setState({selectedBoxShow:!selectedBoxShow});
    }

    //获取数据筛选类型内容
    getSelectContent(category,selectData,index){
        if(category.length > 1){
            //图层数据划分方式为复数时
            return (
                <Tabs defaultActiveKey="0" onChange={this.changeTab.bind(this,index)}>
                    {selectData.typeData.map((item,itemIndex) =>
                        <TabPane tab={category[itemIndex].name} key={itemIndex}>
                            {this.getCheckboxGroup(selectData,item.data,index,'layer')}
                        </TabPane>
                    )}
                </Tabs>
            );
        }else{
            //图层数据未划分 或 划分方式为单个时
            return selectData.typeData.length === 0 ? null : this.getCheckboxGroup(selectData,selectData.typeData[0].data,index,'layer');
        }
    }

    //获取筛选标签列表
    getCheckboxGroup(selectData,category,index,type){
        return (
            <Checkbox.Group
                style={{width:'100%'}}
                value={selectData.checkedList}
                onChange={this.onChangeCheck.bind(this,index,type)}
            >
                <Row>
                    {category.map((item,categoryIndex) =>
                        <Col span={12} key={categoryIndex}>
                            <Checkbox value={item.value} style={{color:'#fff'}} className={cssStyle.checkbox}>{item.label}</Checkbox>
                        </Col>
                    )}
                </Row>
            </Checkbox.Group>
        );
    }

    selectInteract(interactData,checkedList){
        if(interactData){
            let sendData = {};
            if(interactData.sendDataFormat === 2){
                sendData.id = checkedList.join(',');
            }else{
                sendData.id = JSON.stringify(checkedList);
            }
            this.interactData(interactData.interact, sendData);
        }
    }

    //切换图层数据划分类型
    changeTab(index,key){
        let { selectList } = this.state;
        selectList[index].selectTab = key;
        let checkedList = [];
        selectList[index].typeData[key].data.forEach((type) => {
            checkedList.push(type.value);
        });
        selectList[index].checkedList = checkedList;
        selectList[index].indeterminate = false;
        selectList[index].checkAll = true;
        this.setState({ selectList });
        this.changeMapPointShow(index);
        this.selectInteract(selectList[index].interactList[key],checkedList);
    }

    //数据筛选全选触发函数
    onCheckAllChange(index,type,e){
        let selectList;
        if(type === 'map'){
            selectList = this.state.mapSelectList;
        }else{
            selectList = this.state.selectList;
        }
        if(selectList[index].typeData.length > 0){
            const { data } = selectList[index].typeData[selectList[index].selectTab];
            selectList[index].checkedList = e.target.checked ? data.map((item) => item.value) : [];
        }
        selectList[index].indeterminate = false;
        selectList[index].checkAll = e.target.checked;
        this.setState({});
        if(type === 'map'){
            this.getMapSelectParams();
            this.refreshMapPoint(true);
        }else{
            this.changeMapPointShow(index);
        }
        this.selectInteract(selectList[index].interactList[selectList[index].selectTab],selectList[index].checkedList);
    }

    //数据筛选单独选择触发函数
    onChangeCheck(index,type,checkedList){
        let selectList;
        if(type === 'map'){
            selectList = this.state.mapSelectList;
        }else{
            selectList = this.state.selectList;
        }
        const { data } = selectList[index].typeData[selectList[index].selectTab];
        selectList[index].checkedList = checkedList;
        selectList[index].indeterminate = !!checkedList.length && checkedList.length < data.length;
        selectList[index].checkAll = checkedList.length === data.length;
        this.setState({});
        if(type === 'map'){
            this.getMapSelectParams();
            this.refreshMapPoint(true);
        }else{
            this.changeMapPointShow(index);
        }
        this.selectInteract(selectList[index].interactList[selectList[index].selectTab],checkedList);
    }

    //搜索轨迹
    searchPointTrail(message){
        const {searchTrail} = this.props.thisData.style;
        if(searchTrail && searchTrail.url){
            axios.get(searchTrail.url,{params:{rbacToken:this.props.token,...message}}).then((response) => {
                // 在这儿实现 setState
                if(response.data.success && response.data.data){
                    if(this.trailTimer){
                        clearTimeout(this.trailTimer);
                    }
                    //清空轨迹图层
                    this.trailLayer && this.trailLayer.clear();
                    this.trailPointLayer && this.trailPointLayer.clear();
                    //显示轨迹
                    let result = response.data.data;
                    this.trailData = result.trail;
                    if(this.trailData && this.trailData.length > 0){
                        result.showTrail = true;
                        this.setState({windowContent:searchTrail.windowType,windowMessage:result,windowTheme:searchTrail.windowTheme});
                        // eslint-disable-next-line no-undef
                        this.searchTrailSymbol = new esri.symbol.PictureMarkerSymbol(fileUrl + '/download/' + searchTrail.img, searchTrail.width, searchTrail.height);
                        this.searchTrailSymbol.setOffset(searchTrail.left, searchTrail.top);
                        if(this.mapWindowfirstLoad){
                            this.map.infoWindow.setContent(this.mapWindowBoxRef.current);
                            this.mapWindowfirstLoad = false;
                        }
                        this.map.infoWindow.offsetY = this.searchTrailSymbol.height;
                        this.trailPoints = [];
                        if(searchTrail.wkid === 2){
                            this.trailData.forEach((point)=>{
                                const changePoint = GPS.gcj_decrypt_exact(parseFloat(point.y),parseFloat(point.x));
                                this.trailPoints.push([changePoint.lon,changePoint.lat]);
                            });
                        }else{
                            this.trailData.forEach((point)=>{
                                this.trailPoints.push([point.x,point.y]);
                            });
                        }
                        this.changeLayerShow();
                        this.searchTrail = true;
                        this.drawTrail(true);
                        console.log(this.trailData);
                        const startTrailTime = this.trailData[0] ? this.trailData[0].createTime:'';
                        const endTrailTime = this.trailData[this.trailData.length-1] ? this.trailData[this.trailData.length-1].createTime:'';
                        this.setState({startTrailTime,endTrailTime,trailMoving:true,nowTrailTime:startTrailTime,trailTimePointLeft:0,trailPause:false});
                    }else{
                        Modal.info({
                            content: '该人员暂无轨迹数据！',
                        });
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    //显示轨迹
    showTrail(){
        if(this.trailUrl){
            axios.get(this.trailUrl,{params:{rbacToken:this.props.token,...this.trailParams}}).then((response) => {
                // 在这儿实现 setState
                const result = response.data;
                if(result.success){
                    this.trailData = result.data;
                    if(this.trailData && this.trailData.length > 0){
                        this.trailPoints = [];
                        if(this.trailWkid === 2){
                            this.trailData.forEach((point)=>{
                                const changePoint = GPS.gcj_decrypt_exact(parseFloat(point.y),parseFloat(point.x));
                                this.trailPoints.push([changePoint.lon,changePoint.lat]);
                            });
                        }else{
                            this.trailData.forEach((point)=>{
                                this.trailPoints.push([point.x,point.y]);
                            });
                        }
                        this.changeLayerShow();
                        this.drawTrail(true);
                        const startTrailTime = this.trailData[0] ? this.trailData[0].time:'';
                        const endTrailTime = this.trailData[this.trailData.length-1] ? this.trailData[this.trailData.length-1].time:'';
                        this.setState({startTrailTime,endTrailTime,trailMoving:true,nowTrailTime:startTrailTime,trailTimePointLeft:0,trailPause:false});
                    }else{
                        Modal.info({
                            content: '该人员暂无轨迹数据！',
                        });
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    //画轨迹
    drawTrail(moveCenter){
        if(this.trailLayer == null){
            // eslint-disable-next-line no-undef
            this.trailLayer = new esri.layers.GraphicsLayer();
            this.trailLayer.on('click',(e)=>{
                e.stopPropagation();
            });
            this.map.addLayer(this.trailLayer,2);
            // eslint-disable-next-line no-undef
            this.trailPointLayer = new esri.layers.GraphicsLayer();
            this.trailPointLayer.on('click',(e)=>{
                e.stopPropagation();
            });
            this.map.addLayer(this.trailPointLayer,3);
        }else{
            this.trailLayer.clear();
            this.trailPointLayer.clear();
        }
        //已走过的轨迹
        // eslint-disable-next-line no-undef
        const polylineBlank = new esri.geometry.Polyline();
        polylineBlank.addPath([]);
        // eslint-disable-next-line no-undef
        const SymbolLineGreenTrail = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0, 255, 0]), 3);
        // eslint-disable-next-line no-undef
        this.affterMove = new esri.Graphic(polylineBlank,SymbolLineGreenTrail);
        this.trailLayer.add(this.affterMove);
        //画轨迹
        // eslint-disable-next-line no-undef
        const polyline = new esri.geometry.Polyline();
        polyline.addPath(this.trailPoints);
        // eslint-disable-next-line no-undef
        const SymbolLineBlackTrail = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([236, 143, 37]), 3);
        // eslint-disable-next-line no-undef
        this.beforeMove = new esri.Graphic(polyline,SymbolLineBlackTrail);
        this.trailLayer.add(this.beforeMove);
        if(moveCenter){
            this.map.setExtent(polyline.getExtent());
        }
        //打点
        // eslint-disable-next-line no-undef
        const pointView = new esri.geometry.Point(this.trailPoints[0]);
        // eslint-disable-next-line no-undef
        this.trailPoint = new esri.Graphic(pointView, this.searchTrail ? this.searchTrailSymbol : this.selectedGraphic.symbol);
        this.trailPointLayer.add(this.trailPoint);
        //移动小弹框位置
        this.map.infoWindow.show(pointView);
        //轨迹移动
        this.moveTrail(0);
    }

    //轨迹移动
    moveTrail(nowIndex){
        clearTimeout(this.trailTimer)
        this.nowTrailIndex = nowIndex;
        // eslint-disable-next-line no-undef
        const nowPoint = new esri.geometry.Point(this.trailPoints[nowIndex]);
        //更新点位置
        nowIndex !== 0 && this.trailPoint.setGeometry(nowPoint);
        //修改已走过轨迹
        const geometryTempAf = this.affterMove.geometry;
        geometryTempAf.insertPoint(0,nowIndex,nowPoint);
        this.affterMove.setGeometry(geometryTempAf);
        //修改当前节点时间
        let {windowMessage} = this.state;
        if(windowMessage && this.trailData[nowIndex]){
            windowMessage.thisTrailPointTime = this.trailData[nowIndex].time || this.trailData[nowIndex].createTime;
        }
        const trailTimeLineWidth = this.trailTimeLineRef.current.clientWidth;
        this.setState({windowMessage,nowTrailTime:this.trailData[nowIndex].time,trailTimePointLeft:trailTimeLineWidth*nowIndex/(this.trailPoints.length-1)});
        //移动小弹框位置
        this.map.infoWindow.show(nowPoint);
        if(!this.state.trailPause){
            this.trailTimer = setTimeout(()=>{
                if(nowIndex < this.trailPoints.length - 1){
                    const geometryTempBe = this.beforeMove.geometry;
                    geometryTempBe.removePoint(0,0);
                    this.beforeMove.setGeometry(geometryTempBe);
                    this.moveTrail(nowIndex+1);
                }else{
                    this.drawTrail();
                }
            },1000);
        }
    }

    //停止轨迹显示
    stopMoveTrail(){
        if(this.trailTimer){
            clearTimeout(this.trailTimer);
        }
        //清空轨迹图层
        this.trailLayer && this.trailLayer.clear();
        this.trailPointLayer && this.trailPointLayer.clear();
        //显示其他图层
        this.changeLayerShow(true);
        //隐藏当前节点时间
        let {windowMessage} = this.state;
        if(windowMessage){
            windowMessage.thisTrailPointTime = '';
        }
        this.setState({windowMessage,trailMoving:false,trailPause:false});
        //移动小弹框位置
        if(this.searchTrail){
            this.map.infoWindow.hide();
            this.searchTrail = false;
        }else{
            this.map.infoWindow.show(this.selectedGraphic.geometry);
        }
    }

    //切换图层显示隐藏
    changeLayerShow(flag){
        if(flag){
            if(this.dataList){
                this.dataList.forEach((dataPart)=>{
                    if(dataPart && dataPart.layer){
                        dataPart.layer.show();
                    }
                });
            }
            if(this.gridData){
                // this.gridData.gridLayer && this.gridData.gridLayer.show();
                // this.gridData.gridLayerBox && this.gridData.gridLayerBox.show();
            }
        }else{
            if(this.dataList){
                this.dataList.forEach((dataPart)=>{
                    if(dataPart && dataPart.layer){
                        dataPart.layer.hide();
                    }
                });
            }
            if(this.gridData){
                // this.gridData.gridLayer && this.gridData.gridLayer.hide();
                // this.gridData.gridLayerBox && this.gridData.gridLayerBox.hide();
            }
        }
    }

    //获取地图内小弹窗内容
    getWindowContent(){
        const {windowContent,windowMessage} = this.state;
        if(windowContent){
            const WindowBody = require(`./window/${windowContent}/${windowContent}`).default;
            const props = {
                attributes: windowMessage,
                token: this.props.token,
                hideWindow: this.hideWindow.bind(this)
            };
            if(windowContent === 'sanitation_truck' || windowContent === 'sanitation_worker'|| windowContent === 'carNumber'|| windowContent === 'car_use'){
                props.showTrail = this.showTrail.bind(this);
                props.stopMoveTrail = this.stopMoveTrail.bind(this);
            }
            return (
                <WindowBody
                    key={windowMessage.id}
                    mapId={this.props.thisData.id}
                    {...props}
                />
            );
        }else{
            return null;
        }
    }

    changeTrailTimePointMoveFlag(){
        window.addEventListener('mousemove', this.moveTrailTimePoint);
        window.addEventListener('mouseup', this.stopTrailTimePointMove);
        clearTimeout(this.trailTimer);
    }

    stopTrailTimePointMove = ()=>{
        window.removeEventListener('mousemove', this.moveTrailTimePoint);
        window.removeEventListener('mouseup', this.stopTrailTimePointMove);
        //更新线路
        const geometryTempBe = this.beforeMove.geometry;
        geometryTempBe.removePath(0);
        geometryTempBe.addPath(this.trailPoints.slice(this.nowTrailIndex>0?this.nowTrailIndex-1:0,this.trailData.length));
        this.beforeMove.setGeometry(geometryTempBe);
        const geometryTempAf = this.affterMove.geometry;
        geometryTempAf.removePath(0);
        geometryTempAf.addPath(this.trailPoints.slice(0,this.nowTrailIndex));
        this.affterMove.setGeometry(geometryTempAf);
        this.moveTrail(this.nowTrailIndex);
    };

    moveTrailTimePoint = (e)=>{
        let {trailTimePointLeft} = this.state;
        trailTimePointLeft += e.movementX;
        const lineWidth = this.trailTimeLineRef.current.clientWidth;
        if(trailTimePointLeft > lineWidth){
            trailTimePointLeft = lineWidth;
        }else if(trailTimePointLeft < 0){
            trailTimePointLeft = 0;
        }
        this.nowTrailIndex = Math.ceil(trailTimePointLeft/(lineWidth/(this.trailData.length-1)));
        this.setState({trailTimePointLeft,nowTrailTime:this.trailData[this.nowTrailIndex].time});
    };

    changeTrailPause(){
        const {trailPause} = this.state;
        this.setState({trailPause:!trailPause});
        if(trailPause){
            this.trailTimer = setTimeout(()=>{
                if(this.nowTrailIndex < this.trailPoints.length - 1){
                    const geometryTempBe = this.beforeMove.geometry;
                    geometryTempBe.removePoint(0,0);
                    this.beforeMove.setGeometry(geometryTempBe);
                    this.moveTrail(this.nowTrailIndex+1);
                }else{
                    this.drawTrail();
                }
            },1000);
        }else{
            clearTimeout(this.trailTimer);
        }
    }

    render() {
        const {style} = this.props.thisData;
        const { legend,select,trailTimeLine } = style;
        let legendStyle;
        let selectStyle;
        let trailTimeStyle;
        if(legend && legend.img){
            legendStyle = {
                position: 'absolute',
                width: this.props.getCompatibleSize(legend.width),
                height: this.props.getCompatibleSize(legend.height),
                left: this.props.getCompatibleSize(legend.left),
                top: this.props.getCompatibleSize(legend.top),
                right: this.props.getCompatibleSize(legend.right),
                bottom: this.props.getCompatibleSize(legend.bottom),
            }
        }
        if(trailTimeLine){
            trailTimeStyle = {
                width: this.props.getCompatibleSize(trailTimeLine.width),
                height: this.props.getCompatibleSize(trailTimeLine.height),
                left: this.props.getCompatibleSize(trailTimeLine.left),
                top: this.props.getCompatibleSize(trailTimeLine.top),
                right: this.props.getCompatibleSize(trailTimeLine.right),
                bottom: this.props.getCompatibleSize(trailTimeLine.bottom),
                fontSize: this.props.getCompatibleSize(trailTimeLine.fontSize),
            }
        }
        if(select){
            selectStyle = {
                left: this.props.getCompatibleSize(select.left),
                top: this.props.getCompatibleSize(select.top),
                right: this.props.getCompatibleSize(select.right),
                bottom: this.props.getCompatibleSize(select.bottom),
                height: this.props.getCompatibleSize(select.height),
            }
        }
        const shadeBackground = style.shadeGradientType !== 'linear' ? getRadialBackground(style.shadeColor) : getLinearBackground(style.shadeColor,style.shadeAngle);
        const distinctStyle = {
            width:'65%',
            height:'86%',
            left:'17.5%',
            top:'14%'
        };
        const blurStyle = {
            width:'100%',
            height:'114%',
            left:'0%',
            top:'0%'
        };
        const {trailMoving,trailTimePointLeft,startTrailTime,endTrailTime,nowTrailTime,trailPause,selectedBoxShow,bigMap,zIndex,allGridLevel} = this.state;
        let mapSize;
        if(bigMap){
            mapSize = {
                width:style.widthBig?style.widthBig:100,
                height:style.heightBig?style.heightBig:100,
                top:style.topBig?style.topBig:0,
                left:style.leftBig?style.leftBig:0,
            };
        }else{
            mapSize = {
                width:style.width?style.width:100,
                height:style.height?style.height:100,
                top:style.top?style.top:0,
                left:style.left?style.left:0,
            };
        }
        return (
            <ComponentBox style={{...this.props.style, pointerEvents: 'none',zIndex}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData}>
                <Motion style={{opacity:spring(this.state.opacity),left:spring(mapSize.left),top:spring(mapSize.top),width:spring(mapSize.width),height:spring(mapSize.height)}}>
                    {({opacity,left,top,width,height}) =>
                        <div className={`${cssStyle.box} ${select.theme} ${this.windowThemeList[this.state.windowTheme]}  ${style.layerColor === 2 ? 'blockMap':(style.layerColor === 3 ? 'grayMap':'')}`} style={{opacity,left:left+'%',top:top+'%',width:width+'%',height:height+'%',backgroundColor:style.backgroundColor}}>
                            <div id={this.props.thisData.id + 'blurMap'} className={`${cssStyle.mapBox} ${cssStyle.blurOpen} arc-gis-map-box`} style={blurStyle}/>
                            <div id={this.props.thisData.id + 'map'} className={`${cssStyle.mapBox} arc-gis-map-box`} style={style.blurOpen ? distinctStyle:{}}/>
                            <div className={cssStyle.shade} style={{background:shadeBackground,opacity:style.shadeOpacity}} />
                            {select.theme !== 'theme-two' && (
                                <div className={`${cssStyle.selectBox}   arc-gis-map-select`} style={selectStyle}>
                                    {this.getMapSelectList()}
                                    {this.getSelectList()}
                                </div>
                            )}
                            { legendStyle != null ? (<img alt='' src={fileUrl + '/download/' + legend.img} style={legendStyle} className={cssStyle.legend}/>):''}
                            <div className={cssStyle.windowBox}>
                                <div ref={this.mapWindowBoxRef}>
                                    {this.getWindowContent()}
                                </div>
                            </div>
                            <div className={cssStyle.borderLeft} style={{width:style.borderWidth,backgroundColor:style.borderColor}}/>
                            <div className={cssStyle.borderRight} style={{width:style.borderWidth,backgroundColor:style.borderColor}}/>
                            <div className={cssStyle.borderTop} style={{height:style.borderWidth,backgroundColor:style.borderColor}}/>
                            <div className={cssStyle.borderBottom} style={{height:style.borderWidth,backgroundColor:style.borderColor}}/>
                            {/*<div className={cssStyle.blur} />*/}
                            <div className={cssStyle.trailTimeBox} style={{...trailTimeStyle,opacity:trailMoving?1:0,zIndex:trailMoving?'':-1}}>
                                <div className={cssStyle.trailTimeLine} ref={this.trailTimeLineRef}>
                                    <div
                                        className={cssStyle.trailTimePoint}
                                        onMouseDown={this.changeTrailTimePointMoveFlag.bind(this,true)}
                                        style={{left:trailTimePointLeft+'px'}}
                                    >
                                        <div className={cssStyle.trailTimePointName}>{nowTrailTime}</div>
                                    </div>
                                </div>
                                <div className={cssStyle.startTime}>{startTrailTime}</div>
                                <div className={cssStyle.endTime}>{endTrailTime}</div>
                                <Icon type={trailPause ? "play-circle":"pause-circle"} className={cssStyle.iconPause} onClick={this.changeTrailPause.bind(this)}/>
                            </div>
                            {select.theme === 'theme-two' && (
                                <div className={cssStyle.selectBoxTwo} style={selectStyle}>
                                    <div className={cssStyle.headBox} style={selectedBoxShow ? {}:{border:'none'}}>
                                        <div className={cssStyle.head}>地图落点</div>
                                        <div className={cssStyle.changeShow} onClick={this.changeSelectBoxShow.bind(this)}>{selectedBoxShow ? '收起':'展开'}</div>
                                    </div>
                                    {this.getThemeTwoSelect()}
                                </div>
                            )}
                            {this.allGridLayerData && (
                                <div className={cssStyle.allGridSelectBox}>
                                    {this.allGridLayerData.map((item,index)=>{
                                        if(index === 3 || index >= allGridLevel){
                                            return (
                                                <Checkbox
                                                    key={index}
                                                    checked={item.checked}
                                                    className={cssStyle.allGridCheckBox}
                                                    onClick={this.changeAllGridShow.bind(this,item,index)}
                                                >
                                                    <span className={cssStyle.allGridType}>{item.name}边界</span>
                                                </Checkbox>
                                            );
                                        }else{
                                            return null;
                                        }
                                    })}
                                </div>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}