// import React from "react";
// import ComponentBox from "../component_box";
// import cssStyle from './arc_gis_map4.module.css';
// import { Motion, spring } from "react-motion";
//
// // import Map from "http://localhost:8080/arcgis4/arcgis_js_api/@arcgis/core/Map.js";
// // import SceneView from "@arcgis/core/views/SceneView";
// // import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
//
// import {getCompatibleSize, interactData} from "../../common/util";
// import {getData} from "../../common/getDataUtil";
//
// export default class ArcGisMap4 extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { opacity: 0, resultData: [] };
//         this.getData = getData.bind(this);
//         this.interactData = interactData.bind(this);
//         this.keyParams = {};
//     }
//
//     //组件加载触发函数
//     componentDidMount() {
//         this.initMap();
//         if (this.props.firstLoad === false) {
//             this.animateOn();
//         }
//     }
//
//     //组件删除时触发函数
//     componentWillUnmount() {
//     }
//
//     //接收事件消息
//     receiveMessage(data) {
//         switch (data.type) {
//             case "animateOn":
//                 //初始化加载动画
//                 this.animateOn();
//                 break;
//             case "showComponent":
//                 //显示当前组件
//                 break;
//             case "changeKey":
//                 //修改条件
//                 break;
//             case "cancelSelect":
//                 //取消选择
//                 break;
//             case "resultDataInterchange":
//                 //接收结果数据
//                 break;
//             case "returnDefault":
//                 //还原默认
//                 break;
//             case "changeSelected":
//                 //切换选中
//                 break;
//             default:
//                 break;
//         }
//     }
//
//     //运行加载动画
//     animateOn() {
//         this.setState({ opacity: 1 });
//     }
//
//     initMap(){
//         // this.map = new Map();
//         // this.view = new SceneView({
//         //     container : 'arcGisMap4_'+this.props.thisData.id,
//         //     map : this.map,
//         //     camera : {
//         //         // position : [ 121.0347, 28.2748, 707 ],
//         //         position : [ 120.7825894, 27.930717, 707 ],
//         //         tilt : 50,
//         //         heading : 10
//         //     }
//         // });
//         // this.baseLayer = new VectorTileLayer("https://services.wzmap.gov.cn/server/rest/services/Hosted/DSJ/VectorTileServer");
//         // this.map.add(this.baseLayer);
//     }
//
//     render() {
//         const { style } = this.props.thisData;
//         const fontSize = getCompatibleSize(style.fontSize);
//         return (
//             <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
//                 <Motion style={{ opacity: spring(this.state.opacity) }}>
//                     {({ opacity }) =>
//                         <div className={`${cssStyle.box}`} style={{ opacity,fontSize }}>
//                             <div className={cssStyle.mapBox} id={'arcGisMap4_'+this.props.thisData.id} />
//                         </div>
//                     }
//                 </Motion>
//             </ComponentBox>
//         );
//     }
// }