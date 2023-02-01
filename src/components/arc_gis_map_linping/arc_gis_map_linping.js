import React from "react";
import 'echarts-for-react';
import ComponentBox from "../component_box";
import {getData} from "../../common/getDataUtil";
import {changeComponentShow, interactData} from "../../common/util";
import {Motion, spring} from "react-motion";
import {arcGisUrl} from "../../config";
import cssStyle from './arc_gis_map_linping.module.css';
import '../arc_gis_map/arc_gis_map.css';
import {loadModules} from "esri-loader";
import {DatePicker, Button} from "antd";
import ImgPoint from "./img_point.png";
import ImgStart from "./start.png";
import ImgEnd from "./end.png";
import ImgBack from "./back.png";
import {Modal} from "antd";

export default class ArcGisMapTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {},opacity:0, flag: false, name: '', correctAddress: '' };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.changeComponentShow = changeComponentShow.bind(this);
        this.interactData = interactData.bind(this);
        this.posList = []
        this.trailPoints = []
        this.map = {};
        // 暂停移动轨迹点的index
        this.suspendIndex = null
    }

    //组件加载触发函数
    componentDidMount() {
        // eslint-disable-next-line no-undef
        this.geocoder = new AMap.Geocoder({
            city: "杭州",
        });
        this.p = new Promise((resolve) => {
          this.initMap(resolve);
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        
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
      if (data && data.data ) {
        this.setState(()=>({
          name: data.data.name,
          correctAddress: data.data.correctAddress
        }), () => {
          
        })
      }
      switch (data.type) {
          case "animateOn":
              this.animateOn();
              break;
          case "dataInterchange":
          case "changeKey":
              for (let key in data.data) {
                  if (key === 'idCard') {
                    this.keyParams[key] = data.data[key];
                  }
              }
              this.reGetData()
              // if(data.reGetData !== 2){
              //     if(this.hasLoadMap){
              //         this.reGetData();
              //     }else{
              //         this.hasLoadMap = true;
              //         this.initMap(null,true);
              //     }
              // }
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
              this.lineLayer.clear();
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
        if (result && result.length === 0) {
          Modal.success({
            content: '没有查询到当天的轨迹哦！',
        });
        }
        this.trailPoints = []
        result.forEach(item => {
          this.trailPoints.push([item.x, item.y])
        });
        this.drawTrail()
      }
    }

    //重新获取数据
    reGetData() {
      this.getData(this.callBack.bind(this, ''));
    }

    // 关闭弹窗
    close() {
      this.trailLayer.clear();
      this.trailPointLayer.clear();
      // eslint-disable-next-line no-undef
      this.map.centerAndZoom(new esri.geometry.Point({
        x:119.7094117248535,
        y:30.23981396560669
      }),13);
      this.keyParams.time = null
      this.changeComponentShow(false);
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
            "tdlib/TDTAnnoLayer",
            "tdlib/TDTLayer",
            "dojo/dom-construct",
            "dojo/domReady!"
        ], mapURL).then(([Map,VectorTileLayer,Popup,TDTLayerTY, TDTAnnoLayerTY, domConstruct])=>{
            //定义地图
            this.map = new Map('arc_gis_map_linping_'+this.props.thisData.id, {
                logo: false,
                slider: false,
                showLabels: true,
                // eslint-disable-next-line no-undef
                center: new esri.geometry.Point(119.7094117248535, 30.23981396560669),//临安
                zoom: 13,
            });
            this.annolayer = new TDTAnnoLayerTY();
            this.map.addLayer(this.annolayer);
            this.basemap = new TDTLayerTY();
            this.map.addLayer(this.basemap);

            // this.map.centerAndZoom(new esri.geometry.Point({x:119.761195,y:30.326173}),13);

            // eslint-disable-next-line no-undef
            this.searchTrailSymbol = new esri.symbol.PictureMarkerSymbol(ImgPoint, 48, 45);
            // 起点
            // eslint-disable-next-line no-undef
            this.startSymbol = new esri.symbol.PictureMarkerSymbol(ImgStart, 80, 67.2);
            // 终点
            // eslint-disable-next-line no-undef
            this.endSymbol =  new esri.symbol.PictureMarkerSymbol(ImgEnd, 130, 80);

            this.searchTrailSymbol.setOffset(0, 15);
            this.startSymbol.setOffset(0, 21);
            this.endSymbol.setOffset(0, 0);

            // eslint-disable-next-line no-undef
            if(this.props.thisData.firstLoad){
                this.getData(this.callBack.bind(this, resolve));
            }else{
                this.callBack(resolve);
            }

            /**
             * HACK 默认创建图层
             */
            if(this.trailLayer == null){
              // eslint-disable-next-line no-undef
              this.trailLayer = new esri.layers.GraphicsLayer();
              this.trailLayer.on('click',(e)=>{
                  e.stopPropagation();
              });
              this.map.addLayer(this.trailLayer);
              // eslint-disable-next-line no-undef
              this.trailPointLayer = new esri.layers.GraphicsLayer();
              this.trailPointLayer.on('click',(e)=>{
                  e.stopPropagation();
              });
              this.map.addLayer(this.trailPointLayer);
          }
          /**
           * BUG 
           */
            // this.drawTrail()
        });
    }

    // 画轨迹
    drawTrail() {


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
      const SymbolLineBlackTrail = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([185, 19, 16]), 3);
      // eslint-disable-next-line no-undef
      this.beforeMove = new esri.Graphic(polyline,SymbolLineBlackTrail);
      this.trailLayer.add(this.beforeMove);
      this.map.setExtent(polyline.getExtent());
      //打点
      // eslint-disable-next-line no-undef
      const pointView = new esri.geometry.Point(this.trailPoints[0]);
      // eslint-disable-next-line no-undef
      this.trailPoint = new esri.Graphic(null, this.searchTrailSymbol);
      // 起点
      // eslint-disable-next-line no-undef
      this.startPoint = new esri.Graphic(pointView, this.startSymbol);
      // 终点
      // eslint-disable-next-line no-undef
      const endPointView = new esri.geometry.Point(this.trailPoints[this.trailPoints.length - 1]);
      // eslint-disable-next-line no-undef
      this.endPoint = new esri.Graphic(endPointView, this.endSymbol);
      this.trailPointLayer.add(this.trailPoint);
      this.trailPointLayer.add(this.startPoint);
      this.trailPointLayer.add(this.endPoint);


    }
    // 播放
    runStart() {
      //轨迹移动
      if (this.suspendIndex) {
        this.moveTrail(this.suspendIndex)
      } else {
        this.moveTrail(0);
      }
      // this.setState({ flag: false})
      this.setState(()=>({
        flag: true
      }))
    }
    // 暂停
    runEnd() {
      clearTimeout(this.trailTimer)
      // 如果暂停了 就把当前移动轨迹的index 保存一下
      this.suspendIndex = this.nowTrailIndex + 1
      this.setState((state)=>({
        flag: false
      }))

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
      // let {windowMessage} = this.state;
      // if(windowMessage && this.trailData[nowIndex]){
      //     windowMessage.thisTrailPointTime = this.trailData[nowIndex].time || this.trailData[nowIndex].createTime;
      // }
      // const trailTimeLineWidth = this.trailTimeLineRef.current.clientWidth;
      // this.setState({windowMessage,nowTrailTime:this.trailData[nowIndex].time,trailTimePointLeft:trailTimeLineWidth*nowIndex/(this.trailPoints.length-1)});
      //移动小弹框位置
      // this.map.infoWindow.show(nowPoint);
      this.trailTimer = setTimeout(()=>{
        if(nowIndex < this.trailPoints.length - 1){
            const geometryTempBe = this.beforeMove.geometry;
            geometryTempBe.removePoint(0,0);
            this.beforeMove.setGeometry(geometryTempBe);
            this.moveTrail(nowIndex+1);
        } else{
            this.suspendIndex = null
            this.setState(()=>({
              flag: false
            }))
            this.drawTrail();
        }
      },1000);
    }

    // 选择时间查看轨迹
    changeTime(date, dateString) {
      this.keyParams.time = dateString
      clearTimeout(this.trailTimer)
      this.trailLayer.clear();
      this.trailPointLayer.clear()
      this.setState(()=>({
        flag: false
      }))
      this.reGetData()
    }
    // 画线
    // drowPolyline() {
    //   // 清除画布
    //   this.lineLayer.clear()
    //   let path = []
    //   this.posList = [
    //     {
    //       "lng": 120.98195659,
    //       "lat": 28.11347046,
    //       "name": "15:19:36"
    //     },
    //     {
    //       "lng": 120.98295659,
    //       "lat": 28.11357046,
    //       "name": "15:19:37"
    //     },
    //     {
    //       "lng": 120.98395659,
    //       "lat": 28.11367046,
    //       "name": "15:19:36"
    //     },
    //     {
    //       "lng": 120.98495659,
    //       "lat": 28.11357046,
    //       "name": "15:19:37"
    //     },
    //   ]
    //   for (let i = 0; i < this.posList.length; i++) {
    //     const point = [this.posList[i].lng, this.posList[i].lat];
    //     path.push(point);
    //   }
    //   // 生成绘制的图形
    //   const polylineJson = {
    //     "paths": [path],
    //     "spatialReference": { "wkid": 4326 }
    //   };
     

    //   // eslint-disable-next-line no-undef
    //   const polyline = new esri.geometry.Polyline(polylineJson);
    //   // eslint-disable-next-line no-undef
    //   const graphic = new esri.Graphic({
    //     "geometry": polyline,
    //     "symbol": {
    //       "color": [0, 0, 0, 0],
    //       "outline": {
    //         "color": "#95f204",
    //         "width": 5,
    //         "type": "esriSLS",
    //         "style": "esriSLSSolid"
    //       },
    //       "type": "esriSFS",
    //       "style": "esriSFSSolid"
    //     }
    //   });
    //   this.lineLayer.add(graphic)
     
    // }

    render() {
      const { flag, correctAddress, name } = this.state
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) => {
                        return (
                          <div className={`${cssStyle.box} ${'blockMap'}`}>
                            <div className={cssStyle.top}>
                              {/* <div className={cssStyle.title_box}>
                                <div className={cssStyle.left}></div>
                                <div onClick={this.close.bind(this)} className={cssStyle.right}>返回</div>
                              </div> */}
                              <div className={cssStyle.search}>
                                <div className={cssStyle.name}>司法所：<div className={cssStyle.subName}>{correctAddress}</div></div>
                                <div className={cssStyle.name}>姓名：<div className={cssStyle.subName}>{name}</div></div>
                                <div className={cssStyle.name}>轨迹日期：
                                    <DatePicker placeholder="请选择日期" onChange={this.changeTime.bind(this)}/>
                                </div> 
                                <div className={cssStyle.btn}>
                                  {
                                    flag ? <Button className={cssStyle.button} type="primary" onClick={this.runEnd.bind(this)}>暂停</Button> : <Button className={cssStyle.button}  type="primary" onClick={this.runStart.bind(this)}>播放</Button>
                                  }
                                </div>
                              </div>
                              <div onClick={this.close.bind(this)} className={cssStyle.close}>
                                <span>返回</span>
                                <img className={cssStyle.back_img} src={ImgBack} alt="" srcset="" />
                              </div>
                              
                            </div>
                            <div className={cssStyle.bottom}>
                              <div
                                  style={{ width: '100%', height: '100%', position: 'absolute',opacity }}
                                  id={'arc_gis_map_linping_'+this.props.thisData.id}
                              />
                            </div>
                          </div>
                            
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}