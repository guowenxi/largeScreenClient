import React from "react";
import cssStyle from "./handleEditOne.module.css";
import {Motion, spring} from "react-motion";
import {Button, Icon, Modal, Select} from "antd";
import {loadModules} from "esri-loader";
import {arcGisUrl} from "../../../config";
import mapPoint from "../images/point.svg";
import ReactDOM from "react-dom";
import axios from "axios";

export default class HandleEditOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {detail:{firstId:'',secondId:'',roadId:''},roadList:[],typeOneList:[],typeTwoList:[],x:0,y:0};
        this.id = (new Date()).getTime();
        this.bodyId = global.editType ? 'canvas-view' : 'root';
    }

    //组件加载触发函数
    componentDidMount() {
        //初始化搜索服务
        this.initMap();
        //获取街道列表
        const roadListUrl = "/fyPeaceConstruct/peaceThreeRate/getRoadList";
        // const roadListUrl = "./json/lucheng/roadList.json";
        axios.get(roadListUrl,{params:{rbacToken:this.props.token}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({roadList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
        //获取大类
        const typeOneListUrl = "/fyPeaceConstruct/dataDocking/getFirstCategoryId";
        // const typeOneListUrl = "./json/lucheng/typeOneList.json";
        axios.get(typeOneListUrl,{params:{rbacToken:this.props.token}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({typeOneList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
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
            if(this.graphicsLayer){
                if(!this.x || !this.y){
                    this.graphicsLayer.clear();
                }else{
                    this.addPoint([this.x,this.y],true)
                }
            }
            this.setState({detail:{firstId:'',secondId:'',roadId:detail.roadId}});
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
                center: new esri.geometry.Point(120.6515058, 28.018011),//鹿城
                // eslint-disable-next-line no-undef
                // center: new esri.geometry.Point(120.98185659, 28.11547046),//乐清
                zoom: 11,
                infoWindow: new Popup({ anchor:"top"},domConstruct.create("div"))
            });
            let baseMap = new TDTLayer();
            this.map.addLayer(baseMap);
            let annolayer = new TDTAnnoLayer();
            this.map.addLayer(annolayer);
            // eslint-disable-next-line no-undef
            this.graphicsLayer = new esri.layers.GraphicsLayer();
            this.map.addLayer(this.graphicsLayer,1);
            this.map.on("click",(e)=>{
                this.addPoint([e.mapPoint.x,e.mapPoint.y])
            })
        });
    }

    //地图打点
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
        }
        this.x = point[0];
        this.y = point[1];
    }

    //根据大类获取小类
    getTypeTwoList(id){
        const typeTwoListUrl = "/fyPeaceConstruct/dataDocking/getSecondCategoryId";
        // const typeTwoListUrl = "./json/lucheng/typeTwoList.json";
        axios.get(typeTwoListUrl,{params:{rbacToken:this.props.token,firstId:id}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({typeTwoList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //内容编辑
    dataEdit(type,key,event){
        let {detail} = this.state;
        detail[key] = type === 1 ? event.target.value : event;
        if(key === 'firstId'){
            detail.secondId = '';
            this.getTypeTwoList(detail.firstId);
        }
        this.setState({detail});
    }

    //转入四平台
    turnTo(){
        const {detail} = this.state;
        if(!this.x || !this.y){
            Modal.info({
                content: '请在地图上点击选择事发地点！',
            });
            return;
        }
        if(!detail.firstId){
            Modal.info({
                content: '请选择大类！',
            });
            return;
        }
        if(!detail.secondId){
            Modal.info({
                content: '请选择小类！',
            });
            return;
        }
        if(!detail.roadId){
            Modal.info({
                content: '请选择所属镇街！',
            });
            return;
        }
        this.props.turnTo({...this.state.detail,x:this.x,y:this.y});
    }

    render() {
        const {show,hideHandleEdit} = this.props;
        const {detail,roadList,typeOneList,typeTwoList} = this.state;
        return ReactDOM.createPortal(
            (
                    <Motion style={{opacity:spring(show ? 1 : 0)}}>
                        {({opacity}) =>
                            <div className={`${cssStyle.box} ${show?'':cssStyle.hideBox}`}>
                                <div style={{opacity,zIndex:show?1:-1}} className={`${cssStyle.editBox} ${show?'':cssStyle.hideBox}`}>
                                    <div className={cssStyle.editHeadBox}>
                                        <div className={cssStyle.head}>转入四平台</div>
                                        <Icon type="close" className={cssStyle.closeIcon} onClick={hideHandleEdit}/>
                                    </div>
                                    <div className={cssStyle.mapContent} id={'mapDiv_'+this.id} />
                                    <div className={cssStyle.editRow}>
                                        <div className={cssStyle.rowTitle}>大类</div>
                                        <Select value={detail.firstId} onChange={this.dataEdit.bind(this, 2, 'firstId')} className={cssStyle.rowContent}>
                                            {typeOneList.map((road,index)=>
                                                <Select.Option value={road.firstId} key={index}>{road.firstName}</Select.Option>
                                            )}
                                        </Select>
                                        <div className={cssStyle.rowTitle}>小类</div>
                                        <Select value={detail.secondId} onChange={this.dataEdit.bind(this, 2, 'secondId')} className={cssStyle.rowContent}>
                                            {typeTwoList.map((road,index)=>
                                                <Select.Option value={road.secondId} key={index}>{road.secondName}</Select.Option>
                                            )}
                                        </Select>
                                        <div className={cssStyle.rowTitle}>所属街道</div>
                                        <Select value={detail.roadId} onChange={this.dataEdit.bind(this, 2, 'roadId')} className={cssStyle.rowContent}>
                                            {roadList.map((road,index)=>
                                                <Select.Option value={road.id} key={index}>{road.name}</Select.Option>
                                            )}
                                        </Select>
                                    </div>
                                    <div className={cssStyle.editFootBox}>
                                        <Button className={cssStyle.button} onClick={hideHandleEdit}>取消</Button>
                                        <Button className={cssStyle.button} type="primary" onClick={this.turnTo.bind(this)} >确定</Button>
                                    </div>
                                </div>
                            </div>
                        }
                    </Motion>
            ),
            document.getElementById(this.bodyId)
        );
    }
}