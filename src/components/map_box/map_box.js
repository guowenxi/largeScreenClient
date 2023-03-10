import React from "react";
import {Motion, spring} from "react-motion";
import ComponentBox from "../component_box";
import cssStyle from './map_box.module.css';
import './arc_gis_map.css';
import {GPS} from "../arc_gis_map/locationChange";
import {Checkbox, Col, Icon, Radio, Row, Tabs, Tree, Select, Input, Button} from "antd";
import {Scrollbars} from "react-custom-scrollbars";
import {fileUrl} from "../../config";
import axios from "axios";

const { TabPane } = Tabs;

export default class MapBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectList:[],gridTree:{},windowContent:null,opacity:0,windowTheme:0,mapShowType:'map2D',mapMode:1,year:2019,searchText:''};
        this.dataList = [];
        this.keyParams = {};
        this.mapParams = {};
        this.mapParamsIndex = [];
        this.layerParams = [];
        this.groupList = {
            'map3D':'group3D',
            'mapGoogle':'groupGoogle',
            'map25D':'groupGoogle',
            'mapBlack':'groupBlack'
        };
        this.gridParams = {};
        this.oldMapUrl = {
            '2019':'https://services.wzmap.gov.cn/server/rest/services/TDT/YX_2019/MapServer/tile/[z]/[y]/[x]?blankTile=false',
            '2018':'https://services.wzmap.gov.cn/server/rest/services/TDT/YX_2018/MapServer/tile/[z]/[y]/[x]?blankTile=false',
            '2017':'https://services.wzmap.gov.cn/server/rest/services/TDT/YX2017/MapServer/tile/[z]/[y]/[x]?blankTile=false',
            '2016':'https://services.wzmap.gov.cn/server/rest/services/TDT/YX_2016/MapServer/tile/[z]/[y]/[x]?blankTile=false',
            '2014':'http://61.175.211.102/arcgis/rest/services/cgcs2000tmbxh/wzimg20142015/MapServer/WMTS?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cgcs2000tmbxh_wzimg20142015&STYLE=default&TILEMATRIXSET=default028mm&TILEMATRIX=[z]&TILEROW=[y]&TILECOL=[x]&FORMAT=image%2Fjpgpng',
            '2012':'https://services.wzmap.gov.cn/server/rest/services/TDT/YX_2012/MapServer/tile/[z]/[y]/[x]?blankTile=false',
            '2010':'https://services.wzmap.gov.cn/server/rest/services/TDT/YX_2010/MapServer/tile/[z]/[y]/[x]?blankTile=false',
            '2005':'https://services.wzmap.gov.cn/server/rest/services/TDT/YX_2005/MapServer/tile/[z]/[y]/[x]?blankTile=false',
        };
    }

    //????????????????????????
    componentDidMount() {
        // this.p = new Promise((resolve) => {this.initMap(resolve)});
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //???????????????????????????
    componentWillUnmount() {
    }

    //?????????????????????????????????
    componentDidUpdate(prevProps){
        if(prevProps.thisData.updateTime !== this.props.thisData.updateTime){
            //????????????????????????????????????
            // this.loadGrid();
            this.loadMapPoint();
        }
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus && this.props.thisData.showStatus && !this.props.firstLoad){
            //???????????????????????????
            this.refreshMapPoint(true);
        }
    }

    //???????????????????????????
    animateOn(){
        this.setState({opacity:1});
        this.initMap();
        // this.p.then(() => {
        //     this.loadMapPoint();
        // });
    }

    //??????????????????
    receiveMessage(data) {
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
                this.refreshMapPoint(true);
                this.getGridColorData();
                break;
            case "reFreshAll":
                this.refreshMapPoint(true);
                this.getGridColorData();
                break;
            default:
                break;
        }
    }

    //2D???????????????
    initMap(resolve){
        // this.initBlackMap();
        this.init2DMap();
        // this.init3DMap();
        // this.initGoogleMap();
        this.loadGrid();
        this.loadMapPoint();
    }

    //?????????????????????
    initOtherMap(mapName){
        let hasInit = false;
        if(mapName === 'map3D' && !this.map3DHasInit){
            this.init3DMap();
            this.gridGroup3D.setMap(this.map3D);
            hasInit = true;
        }
        if(mapName === 'map25D' && !this.map25DHasInit){
            this.init25DMap();
            this.gridGroup.setMap(this.map25D);
            hasInit = true;
        }
        if(mapName === 'mapGoogle' && !this.mapGoogleHasInit){
            this.initGoogleMap();
            hasInit = true;
            this.gridGroup.setMap(this.mapGoogle);
        }
        if(mapName === 'mapBlack' && !this.mapBlackHasInit){
            this.initBlackMap();
            hasInit = true;
            this.gridGroupGD.setMap(this.mapBlack);
        }
        if(hasInit){
            const { layer } = this.props.thisData.style;
            layer.forEach((layerItem,index) => {
                this[mapName].add(this.dataList[index][this.groupList[mapName]]);
            });
        }
    }

    //???????????????2d??????
    init2DMap(){
        const { lon,lat,zoom } = this.props.thisData.style;
        // eslint-disable-next-line no-undef
        this.map2D = new AMap.Map(this.props.thisData.id + 'map2D', {
            showLabel:true,
            zoom: zoom ? zoom : 3, //??????????????????
            center: [lon ? lon : 111.02,lat ? lat : 33.09], //?????????????????????
        });
        this.map2D.on('moveend',this.mapMoveEnd.bind(this,'map2D'));
        //?????????????????????
        // eslint-disable-next-line no-undef
        this.geocoder = new AMap.Geocoder({
            city: "??????", //??????????????????????????????????????????
        });
    }

    //???????????????3d??????
    init3DMap(){
        const { lon,lat,zoom } = this.props.thisData.style;
        // eslint-disable-next-line no-undef
        this.map3D = new AMap.Map(this.props.thisData.id + 'map3D', {
            showLabel:true,
            zoom: zoom ? zoom : 3, //??????????????????
            center: [lon ? lon : 111.02,lat ? lat : 33.09], //?????????????????????
            viewMode:'3D',
            resizeEnable: true,
            rotateEnable:true,
            pitchEnable:true,
            pitch:60,
            buildingAnimation:true,//???????????????????????????
            expandZoomRange:true,
        });
        this.map3D.on('moveend',this.mapMoveEnd.bind(this,'map3D'));
        this.map3DHasInit = true;
    }

    //?????????????????????????????????????????????2.5D??????
    init25DMap(){
        const { lon,lat,zoom } = this.props.thisData.style;
        const changePoint = GPS.gcj_decrypt_exact(parseFloat(lat ? lat : 33.09),parseFloat(lon ? lon : 111.02));
        // eslint-disable-next-line no-undef
        const view = new AMap.View2D({
            // crs:'EPSG3395',
            crs:'EPSG4326',
            // crs:'EPSG3857',
            zoom: zoom ? zoom : 3, //??????????????????
            center: [changePoint.lon,changePoint.lat], //?????????????????????
        });
        // eslint-disable-next-line no-undef
        const Layer25D = new AMap.TileLayer({
            zooms:[1,20],
            zIndex:2,
            // getTileUrl: "https://services.wzmap.gov.cn/server/rest/services/Hosted/DSJ/VectorTileServer/tile/[z]/[y]/[x].pbf",
            getTileUrl: "http://61.164.104.154/iserver/services/3dmap/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=3dmap&STYLE=default&TILEMATRIXSET=custom_3dmap&TILEMATRIX=[z]&TILEROW=[y]&TILECOL=[x]&FORMAT=image%2Fpng",
            // getTileUrl: "http://10.36.134.1:8081/giscenter/gwc/service/wmts?Service=WMTS&Request=GetTile&Version=1.0.0&layer=wz&style=&tilematrixset=EPSG:3857_wz&Format=image%2Fpng&TileMatrix=EPSG:3857_wz:[z]&TileCol=[x]&TileRow=[y]",
            // getTileUrl: "http://10.36.134.1:8081/giscenter/gwc/service/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=wz&STYLE=&TILEMATRIXSET=EPSG:3857_wz&FORMAT=image%2Fpng&TILEMATRIX=[z]&TILECOL=[x]&TILEROW=[y]",
        });
        // Layer25D.setMap(this.map25D);
        // eslint-disable-next-line no-undef
        this.map25D = new AMap.Map(this.props.thisData.id + 'map25D', {
            showIndoorMap:false,
            showLabel:false,
            animateEnable:false,
            expandZoomRange:true,
            zooms:[1,20],
            layers:[Layer25D],
            view
        });
        this.map25DHasInit = true;
    }

    //????????????????????????????????????????????????????????????
    initGoogleMap(){
        const { lon,lat,zoom } = this.props.thisData.style;
        const changePoint = GPS.gcj_decrypt_exact(parseFloat(lat ? lat : 33.09),parseFloat(lon ? lon : 111.02));
        // eslint-disable-next-line no-undef
        const view = new AMap.View2D({
            crs:'EPSG4326',
            zoom: zoom ? zoom : 3, //??????????????????
            center: [changePoint.lon,changePoint.lat], //?????????????????????
        });
        // eslint-disable-next-line no-undef
        this.googleLayer = new AMap.TileLayer({
            zIndex:2,
            getTileUrl: this.oldMapUrl[this.state.year],
            // getTileUrl: "/oldGE/2016/??????_??????/[z]/[x]/[y].png",
        });
        // this.googleLayer.setMap(this.mapGoogle);
        // eslint-disable-next-line no-undef
        this.mapGoogle = new AMap.Map(this.props.thisData.id + 'google', {
            showIndoorMap:false,
            showLabel:false,
            animateEnable:false,
            expandZoomRange:true,
            zooms:[1,20],
            layers:[this.googleLayer],
            view
        });
        this.mapGoogleHasInit = true;
    }

    //??????????????????????????????3d??????
    initBlackMap(){
        const { lon,lat,zoom } = this.props.thisData.style;
        // eslint-disable-next-line no-undef
        this.mapBlack = new AMap.Map(this.props.thisData.id + 'black', {
            showLabel:true,
            zoom: zoom ? zoom : 3, //??????????????????
            center: [lon ? lon : 111.02,lat ? lat : 33.09], //?????????????????????
            viewMode:'3D',
            resizeEnable: true,
            rotateEnable:true,
            pitchEnable:true,
            pitch:60,
            buildingAnimation:true,//???????????????????????????
            expandZoomRange:true,
            mapStyle:'amap://styles/5d632376cf76b66f0fb8e40ce57eccbf',
        });
        this.mapBlackHasInit = true;
    }

    //?????????????????????????????????
    mapMoveEnd(mapName){
        const zoom = this[mapName].getZoom();
        const center = this[mapName].getCenter();
        if(this.lastCenter !== center.toString()){
            if(mapName!=='map2D'){
                this.map2D.setZoomAndCenter(zoom,center);
            }
            if(mapName!=='map3D' && this.map3D != null){
                this.map3D.setZoomAndCenter(zoom,center);
            }
            this.lastCenter = center.toString();
        }
    }

    //???????????????????????????????????????????????????
    refreshMapPoint(freshData){
        const { layer } = this.props.thisData.style;
        layer.forEach((layerItem,index) => {
            if(this.dataList[index] != null && (layerItem.cluster || freshData)){
                this.getPointData(layerItem,this.dataList[index],index,freshData);
            }
        });
    }

    //???????????????????????????
    changeMapPointShow(index,freshData){
        const { layer } = this.props.thisData.style;
        this.getPointData(layer[index],this.dataList[index],index,freshData);
    }

    //???????????????
    loadMapPoint(){
        const { layer } = this.props.thisData.style;
        if(layer.length === 0){
            this.dataList.forEach((item) => {
                this.clearMapLayer(item);
            });
            this.dataList = [];
        }else{
            layer.forEach((layerItem,index) => {
                if(this.dataList[index] == null){
                    //?????????????????????????????????
                    this.dataList[index] = {updateTime:layerItem.updateTime,gridParams:{},layerIndex:index};
                    // eslint-disable-next-line no-undef
                    this.dataList[index].group2D = new AMap.OverlayGroup();
                    this.dataList[index].group2D.on('click',this.markerClick.bind(this,layerItem,'main'));
                    this.map2D.add(this.dataList[index].group2D);
                    // eslint-disable-next-line no-undef
                    this.dataList[index].group3D = new AMap.OverlayGroup();
                    this.dataList[index].group3D.on('click',this.markerClick.bind(this,layerItem,'main'));
                    // this.map3D.add(this.dataList[index].group3D);
                    // eslint-disable-next-line no-undef
                    this.dataList[index].groupGoogle = new AMap.OverlayGroup();
                    this.dataList[index].groupGoogle.on('click',this.markerClick.bind(this,layerItem,'main'));
                    // this.mapGoogle.add(this.dataList[index].groupGoogle);
                    // eslint-disable-next-line no-undef
                    this.dataList[index].groupBlack = new AMap.OverlayGroup();
                    this.dataList[index].groupBlack.on('click',this.markerClick.bind(this,layerItem,'main'));
                    // this.mapBlack.add(this.dataList[index].groupBlack);
                    //????????????????????????
                    this.initSelectList(layerItem.category,index,layerItem.selectOpen,layerItem.firstShow);
                    //??????????????????
                    this.getPointData(layerItem,this.dataList[index],index);
                }else{
                    //??????????????????????????????????????????
                    if(this.dataList[index].updateTime !== layerItem.updateTime){
                        this.dataList[index].updateTime = layerItem.updateTime;
                        //????????????????????????
                        this.initSelectList(layerItem.category,index,layerItem.selectOpen,layerItem.firstShow);
                        //??????????????????
                        this.getPointData(layerItem,this.dataList[index],index);
                    }
                }
            });
            if(this.dataList.length > layer.length){
                for(let i = layer.length;i < this.dataList.length;i ++){
                    this.clearMapLayer(this.dataList[i]);
                    this.map.removeLayer(this.dataList[i].layer);
                }
                this.dataList.length = layer.length;
            }
        }
    }

    ///////////////////////////????????????
    //??????????????????
    getPointData(layer,dataPart,layerIndex,freshData){
        if(layer.url){
            //?????????????????????
            if(dataPart.timerId){
                clearTimeout(dataPart.timerId);
            }
            //????????????????????????
            if(layer.freshTime){
                dataPart.timerId = setTimeout(() => this.getPointData(layer,dataPart,layerIndex,true),layer.freshTime);
            }
            const { selectList,searchText } = this.state;
            //????????????????????????????????????
            if(selectList[layerIndex].checkAll || selectList[layerIndex].indeterminate){
                let changeKey = false;
                let gridParams = {};
                let indexParams = {};
                let layerParams = {};
                //??????????????????
                if(this.mapParams[layer.id] != null && this.mapParams[layer.id].changeKey){
                    changeKey = true;
                    gridParams = this.mapParams[layer.id].data;
                }
                //????????????????????????
                if(this.mapParamsIndex[layerIndex] != null){
                    indexParams = this.mapParamsIndex[layerIndex];
                }
                //????????????????????????
                if(this.layerParams[layerIndex]){
                    layerParams = this.layerParams[layerIndex];
                }
                //?????????????????????????????????????????????????????????
                if(freshData || dataPart.url !== layer.url || dataPart.params !== layer.params || changeKey){
                    //???????????????????????????????????????????????????????????????
                    let params = {};
                    if(layer.params){
                        try {
                            params = JSON.parse(layer.params);
                        }catch (e) {}
                    }
                    axios.get(layer.url,{params:{...params,...gridParams,...indexParams,...layerParams,rbacToken:this.props.token,searchText:searchText}}).then((response) => {
                        // ??????????????? setState
                        const result = response.data;
                        if(result.success){
                            this.mapParams[layer.id] = {changeKey:false};
                            dataPart.url = layer.url;
                            dataPart.params = layer.params;
                            //????????????
                            const pointList = result.data;
                            let changePointList = [];
                            if(layer.wkid === 2){
                                pointList.forEach((point)=>{
                                    const changePoint = GPS.gcj_decrypt_exact(parseFloat(point.y),parseFloat(point.x));
                                    changePointList.push({
                                        x:changePoint.lon,
                                        y:changePoint.lat
                                    });
                                });
                                dataPart.data = changePointList;
                                dataPart.dataGD = pointList;
                            }else{
                                pointList.forEach((point)=>{
                                    const changePoint = GPS.gcj_encrypt(parseFloat(point.y),parseFloat(point.x));
                                    changePointList.push({
                                        x:changePoint.lon,
                                        y:changePoint.lat
                                    });
                                });
                                dataPart.data = pointList;
                                dataPart.dataGD = changePointList;
                            }
                            //???????????????
                            this.clearMapLayer(dataPart);
                            //????????????
                            this.addPoint(layer,dataPart,selectList[layerIndex]);
                        }
                    }).catch(function(error){
                        // ???????????????????????????
                    });
                }else{
                    //???????????????
                    this.clearMapLayer(dataPart);
                    //???????????????????????????????????????????????????
                    this.addPoint(layer,dataPart,selectList[layerIndex]);
                }
            }else{
                //???????????????
                this.clearMapLayer(dataPart);
            }
        }
    }

    //????????????
    clearMapLayer(dataPart){
        dataPart.group2D.clearOverlays();
        dataPart.group3D.clearOverlays();
        dataPart.groupGoogle.clearOverlays();
        dataPart.groupBlack.clearOverlays();
    }


    //?????????????????????
    addPoint(layer,dataPart,selectData){
        // if(!selectData.checkAll){
        //     return;
        // }
        let typeKey;
        let subType;
        if(selectData != null && layer.category.length > 0){
            typeKey = layer.category[selectData.selectTab].key;
            subType = layer.category[selectData.selectTab].subType;
        }
        if(layer.cluster && layer.type !== 2 && layer.type !== 3){

        }else{
            dataPart.data.forEach((point,pointIndex) => {
                const pointGD = dataPart.dataGD[pointIndex];
                let showThis = false;
                if(layer.category != null && layer.category.length > 0 && !selectData.checkAll){
                    if(subType === 2){
                        //??????????????????????????????
                        selectData.checkedList.forEach((item) => {
                            if(point[typeKey].toString().indexOf(item) >= 0){
                                showThis = true;
                            }
                        });
                    }else{
                        //????????????????????????
                        if(selectData.checkedList.indexOf(point[typeKey]) >= 0){
                            showThis = true;
                        }
                    }
                }else{
                    showThis = true;
                }
                //??????????????????????????????????????????
                if(showThis){
                    let symbol;
                    let label;
                    if(layer.type === 2){
                    }else if(layer.type === 3){
                    }else{
                        // eslint-disable-next-line no-undef
                        let thisIcon = this.getSubIcon(layer,point[layer.key]);
                        const text = layer.textKey ? point[layer.textKey] : 0;
                        const thisStyle = this.getMarkerStyle(thisIcon,layer.whole,point.id,false,text);
                        if(text){
                            symbol = thisStyle.symbol;
                            label = thisStyle.label;
                        }else{
                            symbol = thisStyle;
                        }
                    }
                    if(symbol){
                        //84?????????//??????????????????
                        // eslint-disable-next-line no-undef
                        const marker = new AMap.Marker({
                            // eslint-disable-next-line no-undef
                            icon: new AMap.Icon({
                                image:symbol.img,
                                // eslint-disable-next-line no-undef
                                size:new AMap.Size(symbol.width,symbol.height)
                            }),
                            position: [point.x,point.y],
                            // eslint-disable-next-line no-undef
                            offset: new AMap.Pixel(symbol.left, symbol.top)
                        });
                        dataPart.groupGoogle.addOverlay(marker);
                        //???????????????//2D?????????
                        // eslint-disable-next-line no-undef
                        const marker2D = new AMap.Marker({
                            // eslint-disable-next-line no-undef
                            icon: new AMap.Icon({
                                image:symbol.img,
                                // eslint-disable-next-line no-undef
                                size:new AMap.Size(symbol.width,symbol.height)
                            }),
                            position: [pointGD.x,pointGD.y],
                            // eslint-disable-next-line no-undef
                            offset: new AMap.Pixel(symbol.left, symbol.top)
                        });
                        dataPart.group2D.addOverlay(marker2D);
                        //???????????????//3D?????????
                        // eslint-disable-next-line no-undef
                        const marker3D = new AMap.Marker({
                            // eslint-disable-next-line no-undef
                            icon: new AMap.Icon({
                                image:symbol.img,
                                // eslint-disable-next-line no-undef
                                size:new AMap.Size(symbol.width,symbol.height)
                            }),
                            position: [pointGD.x,pointGD.y],
                            // eslint-disable-next-line no-undef
                            offset: new AMap.Pixel(symbol.left, symbol.top)
                        });
                        dataPart.group3D.addOverlay(marker3D);
                        //???????????????//3D?????????
                        // eslint-disable-next-line no-undef
                        const markerBlack = new AMap.Marker({
                            // eslint-disable-next-line no-undef
                            icon: new AMap.Icon({
                                image:symbol.img,
                                // eslint-disable-next-line no-undef
                                size:new AMap.Size(symbol.width,symbol.height)
                            }),
                            position: [pointGD.x,pointGD.y],
                            // eslint-disable-next-line no-undef
                            offset: new AMap.Pixel(symbol.left, symbol.top)
                        });
                        dataPart.groupBlack.addOverlay(markerBlack);
                    }
                    if(label){
                        // eslint-disable-next-line no-undef
                    }
                }
            });
        }
    }

    //??????????????????
    getSubIcon(layer,data){
        if(layer && layer.icon && data){
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

    //??????????????????
    getMarkerStyle(thisIcon,whole,id,clusterCount){
        if(clusterCount){
            //??????????????????
            const img = thisIcon.img ? thisIcon.img : whole.clusterImg;
            const width = thisIcon.width ? thisIcon.width : whole.clusterWidth;
            const height = thisIcon.height ? thisIcon.height : whole.clusterHeight;
            const left = thisIcon.left ? thisIcon.left : whole.clusterLeft;
            const top = thisIcon.top ? thisIcon.top : whole.clusterTop;
            // eslint-disable-next-line no-undef
            return {img:fileUrl + '/download/' + img,width,height,left,top};
        }else{
            //??????????????????
            const img = whole.selectedImg && this.selectedId === id ? whole.selectedImg : (thisIcon.img ? thisIcon.img : whole.img);
            const width = thisIcon.width ? thisIcon.width : whole.width;
            const height = thisIcon.height ? thisIcon.height : whole.height;
            const left = thisIcon.left ? thisIcon.left : whole.left;
            const top = thisIcon.top ? thisIcon.top : whole.top;
            return {img:fileUrl + '/download/' + img,width,height,left,top};
        }
    }

    //????????????
    markerClick(){

    }

    //////////////////////////////////////////????????????
    //????????????
    clearGrid(){
        this.gridGroup.clearOverlays();
        this.gridGroup3D.clearOverlays();
        this.gridGroupGD.clearOverlays();
    }

    //????????????
    loadGrid(){
        const { open,treeOpen,url,urlParams,treeUrl,updateTime } = this.props.thisData.style.grid;
        if(open){
            //????????????
            if(this.gridData == null){
                // eslint-disable-next-line no-undef
                this.gridGroup = new AMap.OverlayGroup();
                this.gridGroup.on('click',this.gridClick.bind(this));
                // eslint-disable-next-line no-undef
                this.gridGroup3D = new AMap.OverlayGroup();
                this.gridGroup3D.on('click',this.gridClick.bind(this));
                // eslint-disable-next-line no-undef
                this.gridGroupGD = new AMap.OverlayGroup();
                this.gridGroupGD.on('click',this.gridClick.bind(this));
                this.gridGroupGD.setMap(this.map2D);
                this.gridData = {url,treeUrl,data:[]};
                // this.gridData = {url,treeUrl,gridLayer,data:[]};
                this.loadGridData(url,urlParams);
            }else{
                if(updateTime !== this.gridData.updateTime){
                    this.gridData.updateTime = updateTime;
                    if(url !== this.gridData.url || urlParams !== this.gridData.urlParams){
                        this.loadGridData(url,urlParams);
                    }else{
                        this.drawGrid();
                    }
                }
            }
        }else if(this.gridData != null){
            //????????????????????????????????????????????????????????????
            this.clearGrid();
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

    //????????????????????????
    loadGridData(gridUrl,urlParams,key,extent){
        if(key){
            this.gridParams = key;
        }
        let params = {};
        if(urlParams){
            try {
                params = JSON.parse(urlParams);
            }catch (e) {}
        }
        if(gridUrl){
            axios.get(gridUrl,{params:{...params,...key,rbacToken:this.props.token}}).then((response) => {
                // ??????????????? setState
                const result = response.data;
                if(result.success){
                    this.gridData.url = gridUrl;
                    this.gridData.urlParams = urlParams;
                    this.gridData.data = result.data;
                    const { grid } = this.props.thisData.style;
                    if(grid.colorType === 2 && grid.colorUrl){
                        this.getGridColorData();
                    }else{
                        this.drawGrid();
                    }
                    if(extent){
                        let ext;
                        try{
                            ext = JSON.parse(extent);
                        }catch (e) {}
                        if(ext){

                        }
                    }
                }
            }).catch(function(error){
                // ???????????????????????????
            });
        }
    }

    //??????????????????????????????
    getGridColorData(){
        //?????????????????????
        if(this.gridTimer){
            clearTimeout(this.gridTimer);
        }
        const { grid } = this.props.thisData.style;
        axios.get(grid.colorUrl,{params:{rbacToken:this.props.token,...this.gridParams}}).then((responseColor) => {
            this.resultColor = responseColor.data.data;
            this.drawGrid();
            if(grid.freshTime){
                this.gridTimer = setTimeout(() => this.getGridColorData(),grid.freshTime)
            }
        }).catch(function(error){
            // ???????????????????????????
        });
    }

    //????????????
    colorChange(color){
        const numList = color.match(/(\d(\.\d+)?)+/g);
        return {
            color:`rgb(${numList[0]},${numList[1]},${numList[2]})`,
            opacity: numList[3]
        }
    }

    //?????????
    drawGrid(){
        this.clearGrid();
        const { grid } = this.props.thisData.style;
        const backgroundColor = grid.backgroundColor ? grid.backgroundColor : 'rgba(0,255,255,0.2)';
        const lineColor = grid.lineColor ? grid.lineColor : '#0ff';
        const lineWidth = grid.lineWidth ? grid.lineWidth : '6';
        // eslint-disable-next-line no-undef
        const symbolFill = {lineColor,lineWidth,backgroundColor};
        this.gridData.data.forEach((item,index) => {
            if(item.arcgisPoints==null){
                return;
            }
            let polygonData = [];
            try {
                polygonData = JSON.parse(item.arcgisPoints);
            }catch (e) {}
            if(polygonData.length===0){
                return;
            }
            let thisSymbolFill;
            if(index === this.gridData.data.length - 1 && grid.allLine){
                thisSymbolFill = {lineColor:grid.allLineColor,lineWidth:grid.allLineWidth,backgroundColor:'rgba(255,255,255,0)'};
            }else{
                if(grid.colorType === 2){
                    thisSymbolFill = {lineColor,lineWidth,backgroundColor:this.getSymbolFillColor(item,grid)};
                }else{
                    thisSymbolFill = symbolFill;
                }
            }
            const fillBackground = this.colorChange(thisSymbolFill.backgroundColor);
            polygonData.forEach((ring) => {
                //?????????????????????
                const pathGD = [];
                ring.forEach((point)=>{
                    const pointGD = GPS.gcj_encrypt(point[1],point[0]);
                    pathGD.push([pointGD.lon,pointGD.lat]);
                });
                // eslint-disable-next-line no-undef
                const polygonGD = new AMap.Polygon({
                    path: pathGD.slice(),
                    fillColor: fillBackground.color, // ?????????????????????
                    fillOpacity: fillBackground.opacity,// ??????????????????????????????
                    borderWeight: thisSymbolFill.lineWidth, // ???????????????????????? 1
                    strokeColor: thisSymbolFill.lineColor, // ????????????
                });
                this.gridGroupGD.addOverlay(polygonGD);
                //?????????????????????(??????3d??????
                // eslint-disable-next-line no-undef
                const polygonGD3D = new AMap.Polygon({
                    path: pathGD.slice(),
                    fillColor: fillBackground.color, // ?????????????????????
                    fillOpacity: fillBackground.opacity,// ??????????????????????????????
                    borderWeight: thisSymbolFill.lineWidth, // ???????????????????????? 1
                    strokeColor: thisSymbolFill.lineColor, // ????????????
                });
                this.gridGroup3D.addOverlay(polygonGD3D);
                //84???????????????
                // eslint-disable-next-line no-undef
                const polygon = new AMap.Polygon({
                    path: ring.slice(),
                    fillColor: fillBackground.color, // ?????????????????????
                    fillOpacity: fillBackground.opacity,// ??????????????????????????????
                    borderWeight: thisSymbolFill.lineWidth, // ???????????????????????? 1
                    strokeColor: thisSymbolFill.lineColor, // ????????????
                });
                this.gridGroup.addOverlay(polygon);
            });

            if(index === this.gridData.data.length - 1 && grid.allLine){
                //???????????????
            }else{
                //????????????

                //????????????
                if(grid.showName){
                }
            }
        });
    }

    //????????????????????????
    getSymbolFillColor(item,grid){
        if(grid.bgColorList == null){
            return;
        }
        for(let j = 0;j < this.resultColor.length;j ++){
            if(item.name === this.resultColor[j][grid.subKey]){
                if(grid.calculateType === 1){
                    for(let i = 0;i < grid.bgColorList.length;i ++){
                        if(grid.bgColorList[i].num == this.resultColor[j][grid.colorKey]){//eslint-disable-line
                            return grid.bgColorList[i].color;
                        }
                    }
                }else{
                    for(let i = 0;i < grid.bgColorList.length;i ++){
                        if(this.resultColor[j][grid.colorKey] >= grid.bgColorList[i].bottom && this.resultColor[j][grid.colorKey] < grid.bgColorList[i].top){
                            return grid.bgColorList[i].color;
                        }
                    }
                }
                break;
            }
        }
        return grid.backgroundColor;
    }

    //??????????????????
    gridClick(){

    }

    //????????????????????????
    loadGridTreeData(gridTreeUrl){
        if(gridTreeUrl){
            axios.get(gridTreeUrl,{params:{rbacToken:this.props.token}}).then((response) => {
                // ??????????????? setState
                const result = response.data;
                if(result.success){
                    this.gridTreeData.treeUrl = gridTreeUrl;
                    this.gridTreeData.treeData = result.data;
                    this.setState({gridTree:{data:result.data,showSelect:false}});
                }
            }).catch(function(error){
                // ???????????????????????????
            });
        }
    }

    //?????????????????????
    gridSelect(key,e){
        if(e.selectedNodes && e.selectedNodes.length > 0){
            const { url,urlParams,open,interact } = this.props.thisData.style.grid;
            if(interact && interact.length > 0){
                //????????????
                interact.forEach((item) => {
                    //????????????
                    let params = {};
                    params[item.keyName] = item.dataType === 1 ? key[0] : e.selectedNodes[0].props.title;
                    if(item.receiveId === 'grid'){
                        //?????????????????????
                        if(open){
                            //??????????????????
                            const extent = e.selectedNodes[0].props.extent;
                            this.loadGridData(url,urlParams,params,extent);
                        }
                    }else{
                        //?????????????????????
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

    /////////////////////////////////////////????????????
    //???????????????????????????
    initSelectList(category,index,selectOpen,firstShow){
        let { selectList } = this.state;
        selectList[index] = {selectTab:0,indeterminate:false,checkAll:firstShow != null ? firstShow : true,showSelect:false,checkedList:[],typeData:[],showItem:selectOpen};
        if(selectOpen){
            category.forEach((item,categoryIndex) => {
                let checkedList = [];
                if(item.dataType === 1){
                    //????????????
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
                    //????????????????????????????????????
                    if(selectList[index].typeData[categoryIndex].url !== item.url && item.url){
                        //??????????????????
                        axios.get(item.url,{params:{rbacToken:this.props.token}}).then((response) => {
                            // ??????????????? setState
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
                            // ???????????????????????????
                        });
                    }
                }
            });
        }
    }

    //????????????????????????????????????
    changeSelectShow(item,flag){
        item.showSelect = flag;
        let { selectList } = this.state;
        this.setState({ selectList });
    }

    //????????????????????????
    getSelectList(){
        const { layer } = this.props.thisData.style;
        let { selectList,gridTree } = this.state;
        let selectListDom = [];
        selectList.forEach((item,index) => {
            if(layer[index] != null && item.showItem){
                selectListDom.push(
                    <div className={cssStyle.selectItem} key={index} onMouseLeave={this.changeSelectShow.bind(this,item,false)}>
                        <Motion style={{top: spring(item.showSelect ? 100:-100),opacity:spring(item.showSelect ? 1 : 0)}} >
                            {({top,opacity}) =>
                                <div className={`${cssStyle.checkboxGroup} gridSelectBox`} style={opacity !== 0 ? {top:top+'%',opacity:opacity}:{display:'none'}}>
                                    {this.getSelectContent(layer[index].category,item,index)}
                                </div>
                            }
                        </Motion>
                        <Checkbox
                            indeterminate={item.indeterminate}
                            onChange={this.onCheckAllChange.bind(this,index)}
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
                    <span style={{paddingRight:'8px'}}>????????????</span>
                    <Icon type={gridTree.showSelect ? "up":"down"} onClick={this.changeSelectShow.bind(this,gridTree,true)} />
                </div>
            );
        }
        return selectListDom;
    }

    //??????????????????????????????
    getSelectContent(category,selectData,index){
        if(category.length > 1){
            //????????????????????????????????????
            return (
                <Tabs defaultActiveKey="0" onChange={this.changeTab.bind(this,index)}>
                    {selectData.typeData.map((item,itemIndex) =>
                        <TabPane tab={category[itemIndex].name} key={itemIndex}>
                            {this.getCheckboxGroup(selectData,item.data,index)}
                        </TabPane>
                    )}
                </Tabs>
            );
        }else{
            //????????????????????? ??? ????????????????????????
            return selectData.typeData.length === 0 ? null : this.getCheckboxGroup(selectData,selectData.typeData[0].data,index);
        }
    }

    //????????????????????????
    getCheckboxGroup(selectData,category,index){
        return (
            <Checkbox.Group
                style={{width:'100%'}}
                value={selectData.checkedList}
                onChange={this.onChangeCheck.bind(this,index)}
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

    //??????????????????????????????
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
    }

    //??????????????????????????????
    onCheckAllChange(index,e){
        let { selectList } = this.state;
        if(selectList[index].typeData.length > 0){
            const { data } = selectList[index].typeData[selectList[index].selectTab];
            selectList[index].checkedList = e.target.checked ? data.map((item) => item.value) : [];
        }
        selectList[index].indeterminate = false;
        selectList[index].checkAll = e.target.checked;
        this.setState({ selectList });
        this.changeMapPointShow(index);
    }

    //????????????????????????????????????
    onChangeCheck(index,checkedList){
        let { selectList } = this.state;
        const { data } = selectList[index].typeData[selectList[index].selectTab];
        selectList[index].checkedList = checkedList;
        selectList[index].indeterminate = !!checkedList.length && checkedList.length < data.length;
        selectList[index].checkAll = checkedList.length === data.length;
        this.setState({ selectList });
        this.changeMapPointShow(index);
    }

    //??????????????????
    changeMapShowType(event){
        const oldMap = this.state.mapShowType;
        const newMap = event.target.value;
        this.initOtherMap(newMap);
        const zoomOld = this[oldMap].getZoom();
        const centerOld = this[oldMap].getCenter();
        if((oldMap === 'mapGoogle' || oldMap === 'map25D') && newMap !== 'mapGoogle' && newMap !== 'map25D'){
            const centerGD = GPS.gcj_encrypt(centerOld.lat,centerOld.lng);
            this[newMap].setZoomAndCenter(zoomOld,[centerGD.lon,centerGD.lat]);
        }else if((newMap === 'mapGoogle' || newMap === 'map25D') && oldMap !== 'mapGoogle' && oldMap !== 'map25D'){
            const centerNew = GPS.gcj_decrypt_exact(centerOld.lat,centerOld.lng);
            this[newMap].setZoomAndCenter(zoomOld,[centerNew.lon,centerNew.lat]);
        }else{
            this[newMap].setZoomAndCenter(zoomOld,centerOld);
        }
        if(newMap === 'mapGoogle' || newMap === 'map25D'){
            const { layer } = this.props.thisData.style;
            layer.forEach((layerItem,index) => {
                this[newMap].add(this.dataList[index][this.groupList[newMap]]);
            });
            this.gridGroup.setMap(this[newMap]);
        }else if(newMap !== 'map3D'){
            this.gridGroupGD.setMap(this[newMap]);
        }
        setTimeout(()=>{
            this.setState({mapShowType:newMap});
        });
    }
    //????????????????????????
    changeMapMode(event){
        const mapMode = event.target.value;
        if(this.map3D == null){
            this.initOtherMap('map3D');
        }
        const {mapShowType} = this.state;
        if(mapMode === 1 && mapShowType !== 'map2D'){
            this.gridGroupGD.setMap(this[mapShowType]);
        }else if(mapMode === 2 && mapShowType !== 'map2D'){
            this.gridGroupGD.setMap(this.map2D);
        }
        this.setState({mapMode:mapMode});
    }
    //????????????????????????
    changeYear(value){
        // this.googleLayer.setTileUrl('/oldGE/'+value+'/??????_??????/[z]/[x]/[y].png');
        this.googleLayer.setTileUrl(this.oldMapUrl[value]);
        this.googleLayer.reload();
        this.setState({year:value});
    }
    //??????????????????
    changeSearchText(event){
        this.setState({searchText:event.target.value});
    }
    //??????????????????
    searchList(){
        this.refreshMapPoint(true);
    }
    //????????????
    searchAddress(){
        const {searchText,mapShowType} = this.state;
        this.geocoder.getLocation(searchText, (status, result) => {
            if (status === 'complete'&&result.geocodes.length) {
                const position = result.geocodes[0].location;
                if('map2D,map3D,mapBlack'.indexOf(mapShowType) >= 0){
                    this[mapShowType].setZoomAndCenter(18,position);
                }else{
                    const centerNew = GPS.gcj_decrypt_exact(position.lat,position.lng);
                    this[mapShowType].setZoomAndCenter(18,[centerNew.lon,centerNew.lat]);
                }
            }else{
                // log.error('??????????????????????????????');
            }
        });
    }

    render() {
        const {style} = this.props.thisData;
        const {mapShowType,mapMode,year,searchText} = this.state;
        const { legend,select } = style;
        let legendStyle;
        let selectStyle;
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
        if(select){
            selectStyle = {
                left: this.props.getCompatibleSize(select.left),
                top: this.props.getCompatibleSize(select.top),
                right: this.props.getCompatibleSize(select.right),
                height: this.props.getCompatibleSize(select.height),
            }
        }
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={`${cssStyle.box}`} style={{opacity}}>
                            <div id={this.props.thisData.id + 'map2D'} className={`${cssStyle.mapBox} ${mapMode === 2 ? cssStyle.specialMode:''}`} style={mapShowType !== 'map2D' && mapMode === 1 ? {opacity:0,zIndex:-1}:{}}/>
                            <div id={this.props.thisData.id + 'map3D'} className={`${cssStyle.mapBox} ${mapMode === 2 ? cssStyle.specialMode:''}`} style={mapShowType !== 'map3D' && mapMode === 1 ? {opacity:0,zIndex:-1}:{}}/>
                            <div id={this.props.thisData.id + 'map25D'} className={`${cssStyle.mapBox}`} style={mapShowType !== 'map25D' || mapMode === 2 ?{opacity:0,zIndex:-1}:{}}/>
                            <div id={this.props.thisData.id + 'google'} className={`${cssStyle.mapBox}`} style={mapShowType !== 'mapGoogle' || mapMode === 2 ?{opacity:0,zIndex:-1}:{}}/>
                            <div id={this.props.thisData.id + 'black'} className={`${cssStyle.mapBox}`} style={mapShowType !== 'mapBlack' || mapMode === 2 ?{opacity:0,zIndex:-1}:{}}/>
                            <div className={`${cssStyle.selectBox} arc-gis-map-select`} style={selectStyle}>
                                {this.getSelectList()}
                            </div>
                            { legendStyle != null ? (<img alt='' src={fileUrl + '/download/' + legend.img} style={legendStyle} className={cssStyle.legend}/>):''}
                            <div className={cssStyle.buttonBox}>
                                <Radio.Group value={mapMode} onChange={this.changeMapMode.bind(this)} className={cssStyle.mapModeButton}>
                                    <Radio.Button value={1}>????????????</Radio.Button>
                                    <Radio.Button value={2}>????????????</Radio.Button>
                                </Radio.Group>
                                <Radio.Group value={mapShowType} onChange={this.changeMapShowType.bind(this)} className={cssStyle.mapTypeButton} style={mapMode===2?{display:'none'}:{}}>
                                    <Radio.Button value="map2D">2?????????</Radio.Button>
                                    <Radio.Button value="map3D">3?????????</Radio.Button>
                                    <Radio.Button value="map25D">2.5?????????</Radio.Button>
                                    <Radio.Button value="mapGoogle">????????????</Radio.Button>
                                    <Radio.Button value="mapBlack">???????????????</Radio.Button>
                                </Radio.Group>
                                <Select value={year} onChange={this.changeYear.bind(this)} className={cssStyle.yearSelect} style={mapShowType!=='mapGoogle'?{display:'none'}:{}}>
                                    <Select.Option value={2019}>2019</Select.Option>
                                    <Select.Option value={2018}>2018</Select.Option>
                                    <Select.Option value={2017}>2017</Select.Option>
                                    <Select.Option value={2016}>2016</Select.Option>
                                    <Select.Option value={2014}>2014</Select.Option>
                                    <Select.Option value={2012}>2012</Select.Option>
                                    <Select.Option value={2010}>2010</Select.Option>
                                    <Select.Option value={2005}>2005</Select.Option>
                                </Select>
                                {/*<Slider max={2016} min={2009} value={year} onChange={this.changeYear.bind(this)} className={cssStyle.Slider} included={false} step={1} style={mapShowType!=='mapGoogle'?{display:'none'}:{}}/>*/}
                            </div>
                            <div className={cssStyle.searchBox}>
                                <Input value={searchText} onChange={this.changeSearchText.bind(this)} className={cssStyle.input}/>
                                <Button type="primary" shape="circle" icon="search" className={cssStyle.button} onClick={this.searchList.bind(this)}/>
                                <Button type="primary" shape="circle" icon="environment" className={cssStyle.button} onClick={this.searchAddress.bind(this)}/>
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}