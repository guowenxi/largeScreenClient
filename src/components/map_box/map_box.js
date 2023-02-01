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

    //组件加载触发函数
    componentDidMount() {
        // this.p = new Promise((resolve) => {this.initMap(resolve)});
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件数据更新时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.updateTime !== this.props.thisData.updateTime){
            //组件数据源变更时刷新数据
            // this.loadGrid();
            this.loadMapPoint();
        }
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus && this.props.thisData.showStatus && !this.props.firstLoad){
            //组件显示时刷新数据
            this.refreshMapPoint(true);
        }
    }

    //挂载数据到页面显示
    animateOn(){
        this.setState({opacity:1});
        this.initMap();
        // this.p.then(() => {
        //     this.loadMapPoint();
        // });
    }

    //接收事件消息
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

    //2D地图初始化
    initMap(resolve){
        // this.initBlackMap();
        this.init2DMap();
        // this.init3DMap();
        // this.initGoogleMap();
        this.loadGrid();
        this.loadMapPoint();
    }

    //初始化其他地图
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

    //初始化高德2d地图
    init2DMap(){
        const { lon,lat,zoom } = this.props.thisData.style;
        // eslint-disable-next-line no-undef
        this.map2D = new AMap.Map(this.props.thisData.id + 'map2D', {
            showLabel:true,
            zoom: zoom ? zoom : 3, //初始地图级别
            center: [lon ? lon : 111.02,lat ? lat : 33.09], //初始地图中心点
        });
        this.map2D.on('moveend',this.mapMoveEnd.bind(this,'map2D'));
        //初始化搜索服务
        // eslint-disable-next-line no-undef
        this.geocoder = new AMap.Geocoder({
            city: "温州", //城市设为北京，默认：“全国”
        });
    }

    //初始化高德3d地图
    init3DMap(){
        const { lon,lat,zoom } = this.props.thisData.style;
        // eslint-disable-next-line no-undef
        this.map3D = new AMap.Map(this.props.thisData.id + 'map3D', {
            showLabel:true,
            zoom: zoom ? zoom : 3, //初始地图级别
            center: [lon ? lon : 111.02,lat ? lat : 33.09], //初始地图中心点
            viewMode:'3D',
            resizeEnable: true,
            rotateEnable:true,
            pitchEnable:true,
            pitch:60,
            buildingAnimation:true,//楼块出现是否带动画
            expandZoomRange:true,
        });
        this.map3D.on('moveend',this.mapMoveEnd.bind(this,'map3D'));
        this.map3DHasInit = true;
    }

    //初始化高德地图，加载温州天地图2.5D图层
    init25DMap(){
        const { lon,lat,zoom } = this.props.thisData.style;
        const changePoint = GPS.gcj_decrypt_exact(parseFloat(lat ? lat : 33.09),parseFloat(lon ? lon : 111.02));
        // eslint-disable-next-line no-undef
        const view = new AMap.View2D({
            // crs:'EPSG3395',
            crs:'EPSG4326',
            // crs:'EPSG3857',
            zoom: zoom ? zoom : 3, //初始地图级别
            center: [changePoint.lon,changePoint.lat], //初始地图中心点
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

    //初始化高德地图，加载谷歌地球历史影像图层
    initGoogleMap(){
        const { lon,lat,zoom } = this.props.thisData.style;
        const changePoint = GPS.gcj_decrypt_exact(parseFloat(lat ? lat : 33.09),parseFloat(lon ? lon : 111.02));
        // eslint-disable-next-line no-undef
        const view = new AMap.View2D({
            crs:'EPSG4326',
            zoom: zoom ? zoom : 3, //初始地图级别
            center: [changePoint.lon,changePoint.lat], //初始地图中心点
        });
        // eslint-disable-next-line no-undef
        this.googleLayer = new AMap.TileLayer({
            zIndex:2,
            getTileUrl: this.oldMapUrl[this.state.year],
            // getTileUrl: "/oldGE/2016/瓦片_谷歌/[z]/[x]/[y].png",
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

    //初始化高德大数据风格3d地图
    initBlackMap(){
        const { lon,lat,zoom } = this.props.thisData.style;
        // eslint-disable-next-line no-undef
        this.mapBlack = new AMap.Map(this.props.thisData.id + 'black', {
            showLabel:true,
            zoom: zoom ? zoom : 3, //初始地图级别
            center: [lon ? lon : 111.02,lat ? lat : 33.09], //初始地图中心点
            viewMode:'3D',
            resizeEnable: true,
            rotateEnable:true,
            pitchEnable:true,
            pitch:60,
            buildingAnimation:true,//楼块出现是否带动画
            expandZoomRange:true,
            mapStyle:'amap://styles/5d632376cf76b66f0fb8e40ce57eccbf',
        });
        this.mapBlackHasInit = true;
    }

    //地图中心点变更触发函数
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

    //地图显示范围更改时刷新聚合点位数据
    refreshMapPoint(freshData){
        const { layer } = this.props.thisData.style;
        layer.forEach((layerItem,index) => {
            if(this.dataList[index] != null && (layerItem.cluster || freshData)){
                this.getPointData(layerItem,this.dataList[index],index,freshData);
            }
        });
    }

    //图层内数据过滤显示
    changeMapPointShow(index,freshData){
        const { layer } = this.props.thisData.style;
        this.getPointData(layer[index],this.dataList[index],index,freshData);
    }

    //加载地图点
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
                    //若该图层不存在则初始化
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
                    //加载数据筛选控件
                    this.initSelectList(layerItem.category,index,layerItem.selectOpen,layerItem.firstShow);
                    //获取点位数据
                    this.getPointData(layerItem,this.dataList[index],index);
                }else{
                    //该图层配置若有修改则更新图层
                    if(this.dataList[index].updateTime !== layerItem.updateTime){
                        this.dataList[index].updateTime = layerItem.updateTime;
                        //加载数据筛选控件
                        this.initSelectList(layerItem.category,index,layerItem.selectOpen,layerItem.firstShow);
                        //获取点位数据
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

    ///////////////////////////打点相关
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
            const { selectList,searchText } = this.state;
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
                    axios.get(layer.url,{params:{...params,...gridParams,...indexParams,...layerParams,rbacToken:this.props.token,searchText:searchText}}).then((response) => {
                        // 在这儿实现 setState
                        const result = response.data;
                        if(result.success){
                            this.mapParams[layer.id] = {changeKey:false};
                            dataPart.url = layer.url;
                            dataPart.params = layer.params;
                            //坐标转换
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
                            //清空该图层
                            this.clearMapLayer(dataPart);
                            //重新打点
                            this.addPoint(layer,dataPart,selectList[layerIndex]);
                        }
                    }).catch(function(error){
                        // 处理请求出错的情况
                    });
                }else{
                    //清空该图层
                    this.clearMapLayer(dataPart);
                    //若请求数据地址未发生更改则直接打点
                    this.addPoint(layer,dataPart,selectList[layerIndex]);
                }
            }else{
                //清空该图层
                this.clearMapLayer(dataPart);
            }
        }
    }

    //清空图层
    clearMapLayer(dataPart){
        dataPart.group2D.clearOverlays();
        dataPart.group3D.clearOverlays();
        dataPart.groupGoogle.clearOverlays();
        dataPart.groupBlack.clearOverlays();
    }


    //将点打到地图上
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
                        //84坐标点//历史影像图点
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
                        //高德坐标点//2D地图点
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
                        //高德坐标点//3D地图点
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
                        //高德坐标点//3D地图点
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

    //获取匹配图标
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

    //点位样式设置
    getMarkerStyle(thisIcon,whole,id,clusterCount){
        if(clusterCount){
            //聚合点位样式
            const img = thisIcon.img ? thisIcon.img : whole.clusterImg;
            const width = thisIcon.width ? thisIcon.width : whole.clusterWidth;
            const height = thisIcon.height ? thisIcon.height : whole.clusterHeight;
            const left = thisIcon.left ? thisIcon.left : whole.clusterLeft;
            const top = thisIcon.top ? thisIcon.top : whole.clusterTop;
            // eslint-disable-next-line no-undef
            return {img:fileUrl + '/download/' + img,width,height,left,top};
        }else{
            //单独点位样式
            const img = whole.selectedImg && this.selectedId === id ? whole.selectedImg : (thisIcon.img ? thisIcon.img : whole.img);
            const width = thisIcon.width ? thisIcon.width : whole.width;
            const height = thisIcon.height ? thisIcon.height : whole.height;
            const left = thisIcon.left ? thisIcon.left : whole.left;
            const top = thisIcon.top ? thisIcon.top : whole.top;
            return {img:fileUrl + '/download/' + img,width,height,left,top};
        }
    }

    //点击事件
    markerClick(){

    }

    //////////////////////////////////////////网格相关
    //网格清空
    clearGrid(){
        this.gridGroup.clearOverlays();
        this.gridGroup3D.clearOverlays();
        this.gridGroupGD.clearOverlays();
    }

    //加载网格
    loadGrid(){
        const { open,treeOpen,url,urlParams,treeUrl,updateTime } = this.props.thisData.style.grid;
        if(open){
            //加载网格
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
            //若关闭网格功能且加载过网格数据则清空数据
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

    //获取地图网格数据
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
                // 在这儿实现 setState
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
                // 处理请求出错的情况
            });
        }
    }

    //获取网格颜色匹配数据
    getGridColorData(){
        //停止旧的定时器
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
            // 处理请求出错的情况
        });
    }

    //颜色切割
    colorChange(color){
        const numList = color.match(/(\d(\.\d+)?)+/g);
        return {
            color:`rgb(${numList[0]},${numList[1]},${numList[2]})`,
            opacity: numList[3]
        }
    }

    //画网格
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
                //高德坐标系网格
                const pathGD = [];
                ring.forEach((point)=>{
                    const pointGD = GPS.gcj_encrypt(point[1],point[0]);
                    pathGD.push([pointGD.lon,pointGD.lat]);
                });
                // eslint-disable-next-line no-undef
                const polygonGD = new AMap.Polygon({
                    path: pathGD.slice(),
                    fillColor: fillBackground.color, // 多边形填充颜色
                    fillOpacity: fillBackground.opacity,// 多边形填充颜色透明度
                    borderWeight: thisSymbolFill.lineWidth, // 线条宽度，默认为 1
                    strokeColor: thisSymbolFill.lineColor, // 线条颜色
                });
                this.gridGroupGD.addOverlay(polygonGD);
                //高德坐标系网格(用于3d地图
                // eslint-disable-next-line no-undef
                const polygonGD3D = new AMap.Polygon({
                    path: pathGD.slice(),
                    fillColor: fillBackground.color, // 多边形填充颜色
                    fillOpacity: fillBackground.opacity,// 多边形填充颜色透明度
                    borderWeight: thisSymbolFill.lineWidth, // 线条宽度，默认为 1
                    strokeColor: thisSymbolFill.lineColor, // 线条颜色
                });
                this.gridGroup3D.addOverlay(polygonGD3D);
                //84坐标系网格
                // eslint-disable-next-line no-undef
                const polygon = new AMap.Polygon({
                    path: ring.slice(),
                    fillColor: fillBackground.color, // 多边形填充颜色
                    fillOpacity: fillBackground.opacity,// 多边形填充颜色透明度
                    borderWeight: thisSymbolFill.lineWidth, // 线条宽度，默认为 1
                    strokeColor: thisSymbolFill.lineColor, // 线条颜色
                });
                this.gridGroup.addOverlay(polygon);
            });

            if(index === this.gridData.data.length - 1 && grid.allLine){
                //外围网格圈
            }else{
                //网格内容

                //网格名称
                if(grid.showName){
                }
            }
        });
    }

    //获取网格区域颜色
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

    //网格点击响应
    gridClick(){

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

    /////////////////////////////////////////筛选相关
    //初始化选择列表内容
    initSelectList(category,index,selectOpen,firstShow){
        let { selectList } = this.state;
        selectList[index] = {selectTab:0,indeterminate:false,checkAll:firstShow != null ? firstShow : true,showSelect:false,checkedList:[],typeData:[],showItem:selectOpen};
        if(selectOpen){
            category.forEach((item,categoryIndex) => {
                let checkedList = [];
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

    //加载数据筛选列表
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
                    <span style={{paddingRight:'8px'}}>行政区划</span>
                    <Icon type={gridTree.showSelect ? "up":"down"} onClick={this.changeSelectShow.bind(this,gridTree,true)} />
                </div>
            );
        }
        return selectListDom;
    }

    //获取数据筛选类型内容
    getSelectContent(category,selectData,index){
        if(category.length > 1){
            //图层数据划分方式为复数时
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
            //图层数据未划分 或 划分方式为单个时
            return selectData.typeData.length === 0 ? null : this.getCheckboxGroup(selectData,selectData.typeData[0].data,index);
        }
    }

    //获取筛选标签列表
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
    }

    //数据筛选全选触发函数
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

    //数据筛选单独选择触发函数
    onChangeCheck(index,checkedList){
        let { selectList } = this.state;
        const { data } = selectList[index].typeData[selectList[index].selectTab];
        selectList[index].checkedList = checkedList;
        selectList[index].indeterminate = !!checkedList.length && checkedList.length < data.length;
        selectList[index].checkAll = checkedList.length === data.length;
        this.setState({ selectList });
        this.changeMapPointShow(index);
    }

    //切换地图底图
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
    //切换地图显示模式
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
    //切换历年影像年份
    changeYear(value){
        // this.googleLayer.setTileUrl('/oldGE/'+value+'/瓦片_谷歌/[z]/[x]/[y].png');
        this.googleLayer.setTileUrl(this.oldMapUrl[value]);
        this.googleLayer.reload();
        this.setState({year:value});
    }
    //搜索内容修改
    changeSearchText(event){
        this.setState({searchText:event.target.value});
    }
    //搜索地图数据
    searchList(){
        this.refreshMapPoint(true);
    }
    //搜索地址
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
                // log.error('根据地址查询位置失败');
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
                                    <Radio.Button value={1}>普通模式</Radio.Button>
                                    <Radio.Button value={2}>对比模式</Radio.Button>
                                </Radio.Group>
                                <Radio.Group value={mapShowType} onChange={this.changeMapShowType.bind(this)} className={cssStyle.mapTypeButton} style={mapMode===2?{display:'none'}:{}}>
                                    <Radio.Button value="map2D">2维地图</Radio.Button>
                                    <Radio.Button value="map3D">3维地图</Radio.Button>
                                    <Radio.Button value="map25D">2.5维地图</Radio.Button>
                                    <Radio.Button value="mapGoogle">历史影像</Radio.Button>
                                    <Radio.Button value="mapBlack">大数据风格</Radio.Button>
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