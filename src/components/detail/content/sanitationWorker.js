import React from "react";
import cssStyle from "./sanitationWorker.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {getCompatibleData} from "../../../common/detailUtil";

import pointIcon from "../images/pointIcon.png";
import {interactData} from "../../../common/util";
import {arcGisUrl} from "../../../config";
import {loadModules} from "esri-loader";
import {GPS} from "../../arc_gis_map/locationChange";

export default class SanitationWorker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.initMap();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime && this.mapLoadFinish){
            //组件数据源变更时刷新数据
            this.drawTrail();
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
            const { lon,lat,zoom } = this.props.thisData.style;
            this.map = new Map(this.props.thisData.id + 'map', {
                logo: false,
                slider: false,
                showLabels: true,
                // eslint-disable-next-line no-undef
                center: new esri.geometry.Point(lon ? lon : 111.02,lat ? lat : 33.09),
                zoom: zoom ? zoom : 3,
                infoWindow: new Popup({ anchor:"top"},domConstruct.create("div"))
            });
            let baseMap = new TDTLayer();
            this.map.addLayer(baseMap);
            let annolayer = new TDTAnnoLayer();
            this.map.addLayer(annolayer);
            this.mapLoadFinish = true;
            this.drawTrail();
        });
    }

    drawTrail(){
        if(this.trailLayer == null){
            // eslint-disable-next-line no-undef
            this.trailLayer = new esri.layers.GraphicsLayer();
            this.map.addLayer(this.trailLayer,1);
            // eslint-disable-next-line no-undef
            this.trailErrorLayer = new esri.layers.GraphicsLayer();
            this.map.addLayer(this.trailErrorLayer,2);
        }else{
            this.trailLayer.clear();
            this.trailErrorLayer.clear();
        }
        const { detail } = this.props;
        const {repeatList,peopleList} = detail;
        if(peopleList){
            const trailPoints = [];
            peopleList.forEach((point)=>{
                const changePoint = GPS.gcj_decrypt_exact(parseFloat(point.y),parseFloat(point.x));
                trailPoints.push([changePoint.lon,changePoint.lat]);
            });
            //画轨迹
            // eslint-disable-next-line no-undef
            const polyline = new esri.geometry.Polyline();
            polyline.addPath(trailPoints);
            // eslint-disable-next-line no-undef
            const SymbolLineBlackTrail = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0, 255, 0]), 3);
            // eslint-disable-next-line no-undef
            const line = new esri.Graphic(polyline,SymbolLineBlackTrail);
            this.trailLayer.add(line);
            this.map.setExtent(polyline.getExtent());
        }
        if(repeatList){
            repeatList.forEach((pointList)=>{
                const trailPoints = [];
                pointList.forEach((point)=>{
                    const changePoint = GPS.gcj_decrypt_exact(parseFloat(point.y),parseFloat(point.x));
                    trailPoints.push([changePoint.lon,changePoint.lat]);
                });
                //画轨迹
                // eslint-disable-next-line no-undef
                const polyline = new esri.geometry.Polyline();
                polyline.addPath(trailPoints);
                // eslint-disable-next-line no-undef
                const SymbolLineBlackTrail = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([247,49,49]), 3);
                // eslint-disable-next-line no-undef
                const line = new esri.Graphic(polyline,SymbolLineBlackTrail);
                this.trailErrorLayer.add(line);
            });
        }
    }



    render() {
        const { detail } = this.props;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        if(detail){
            const {userMap,illList} = detail;
            return (
                <div
                    className={`${cssStyle.detailBox}`}
                    style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding }}
                >
                    <div className={cssStyle.mapBox} id={this.props.thisData.id + 'map'}>
                    </div>
                    {userMap && (
                        <React.Fragment>
                            <div className={cssStyle.head}>
                                <img alt={''} src={pointIcon} className={cssStyle.headIcon} />
                                <div>基本信息</div>
                            </div>
                            <table>
                                <tbody>
                                <tr>
                                    <td className={cssStyle.title}>姓　　名：</td>
                                    <td className={cssStyle.content}>{userMap.name}</td>
                                    <td className={cssStyle.title}>人员类型：</td>
                                    <td className={cssStyle.content}>{userMap.workType}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.title}>所属网格：</td>
                                    <td className={cssStyle.content}>{userMap.wgname}</td>
                                    <td className={cssStyle.title}>联系方式：</td>
                                    <td className={cssStyle.content}>{userMap.phone}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.title}>所属分区：</td>
                                    <td className={cssStyle.content} colSpan={3}>{userMap.streetName}</td>
                                </tr>
                                </tbody>
                            </table>
                        </React.Fragment>
                    )}
                    {illList && (
                        <React.Fragment>
                            <div className={cssStyle.head}>
                                <img alt={''} src={pointIcon} className={cssStyle.headIcon} />
                                <div>违规信息</div>
                            </div>
                            <div className={cssStyle.timeLine}>
                                <Scrollbars >
                                    <div className={cssStyle.timeLineBox}>
                                        <div className={cssStyle.line}/>
                                        {illList.map((ill,illIndex)=>{
                                            return (
                                                <div key={illIndex} className={cssStyle.timeLineItem}>
                                                    <div className={`${cssStyle.timeLineContent} ${illIndex%2 === 0 ? cssStyle.alignRight:cssStyle.alignLeft}`}>{ill.illName}</div>
                                                    <div className={cssStyle.centerPoint}/>
                                                    <div className={`${cssStyle.timeLineContent} ${illIndex%2 === 0 ? cssStyle.alignLeft:cssStyle.alignRight}`}>{ill.illTime}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Scrollbars>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            );
        }else{
            return '';
        }
    }
}