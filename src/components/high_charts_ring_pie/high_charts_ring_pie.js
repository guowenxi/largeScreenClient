// import React, { Component } from 'react';
// import styles from './high_charts_ring_pie.module.css';
// import Highcharts, { color } from 'highcharts/highcharts';
// import Highcharts3D from 'highcharts/highcharts-3d';
// import { getData } from "../../common/getDataUtil";
// import ComponentBox from "../component_box";
// Highcharts3D(Highcharts);
// var high = {}
// export default class HighChartsRingPie extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { data: {} };
//         this.keyParams = {};
//         this.getData = getData.bind(this);
//     }
//
//     componentDidMount() {
//         this.p = new Promise((resolve) => {
//             this.getData(this.callBack.bind(this, resolve))
//         });
//     }
//
//     shouldComponentUpdate(nextProps) {
//         if (JSON.stringify(nextProps) == JSON.stringify(this.props)) {
//             // high.destroy()
//             this.setOption();
//             return false
//         } else {
//             return true
//         }
//     }
//     componentWillUnmount() {
//
//     }
//
//
//     //挂载数据到页面显示
//     animateOn() {
//         this.p.then((data) => {
//             this.setState({ data });
//             this.setOption(data);
//         });
//     }
//
//     //接收事件消息
//     receiveMessage(data) {
//         switch (data.type) {
//             case "animateOn":
//                 this.animateOn();
//                 break;
//             case "changeKey":
//                 for (let key in data.data) {
//                     this.keyParams[key] = data.data[key];
//                 }
//                 this.reGetData();
//                 break;
//             case "changeUrl":
//
//                 break;
//             case "deleteKey":
//                 this.keyParams = {};
//                 this.reGetData();
//                 break;
//             default:
//                 break;
//         }
//     }
//
//     //获取数据后回调
//     callBack(resolve, result) {
//         // new Highcharts.Chart('high_charts_ring_pie', this.props.thisData.style)
//
//         if (result) {
//             if (resolve) {
//                 resolve(result);
//             } else {
//                 this.setState({ data: result });
//                 this.setOption(result);
//             }
//         }
//
//     }
//
//     //重新获取数据
//     reGetData() {
//         this.getData(this.callBack.bind(this, ''));
//     }
//     setOption(data) {
//         var each = Highcharts.each;
//         // round = Math.round,
//         // cos = Math.cos,
//         // sin = Math.sin,
//         // deg2rad = Math.deg2rad;
//         Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'translate', function (proceed) {
//             proceed.apply(this, [].slice.call(arguments, 1));
//             if (!this.chart.is3d()) {
//                 return;
//             }
//             var series = this,
//                 chart = series.chart,
//                 // options = chart.options,
//                 seriesOptions = series.options,
//                 depth = seriesOptions.depth || 0;
//             // options3d = options.chart.options3d,
//             // alpha = options3d.alpha,
//             // beta = options3d.beta,
//             //     z = seriesOptions.stacking ? (seriesOptions.stack || 0) * depth : series._i * depth;
//             // z += depth / 2;
//             // if (seriesOptions.grouping !== false) {
//             //     z = 0;
//             // }
//             each(series.data, function (point) {
//                 var shapeArgs = point.shapeArgs;
//                 // angle;
//                 point.shapeType = 'arc3d';
//                 var ran = point.options.h;
//                 shapeArgs.depth = depth * 0.75 + ran;
//                 shapeArgs.ran = ran;
//                 // shapeArgs.z = z;
//                 // shapeArgs.alpha = alpha;
//                 // shapeArgs.beta = beta;
//                 // shapeArgs.center = series.center;
//                 // angle = (shapeArgs.end + shapeArgs.start) / 2;
//                 // point.slicedTranslation = {
//                 // 	translateX: round(cos(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)),
//                 // 	translateY: round(sin(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad))
//                 // };
//             });
//         });
//         // let data_ = [{ name: '企退人员', sum: 369, h: 40 }, { name: '党员', sum: 509, h: 60 }]
//         let data_ = []
//         let defaultData = JSON.parse(this.props.thisData.dataSources.defaultData)
//         defaultData.series.map((item, index) => {
//             data_.push({ sum: item, name: defaultData.xAxis[index] })
//         })
//         let style = this.props.thisData.style
//         let series_data = []
//         let max = data_[0].sum
//         data_.map((item, index) => {
//             if (item.sum > max) {
//                 max = item.sum
//             }
//         })
//         console.log(max)
//         data_.map((item, index) => {
//             series_data.push({
//                 name: item.name,
//                 y: item.sum,
//                 h: item.sum * 70 / max < 10 ? 10 : item.sum * 70 / max,
//                 sliced: true,
//                 selected: false,
//                 // color: "#2afadf",
//                 dataLabels: {
//                     // color: 'blue',
//                     style: { fontSize: '30px' },
//                     formatter: function () {
//                         return (
//                             '<p style="color:' + style.fontColor +
//                             ';font-size:' + style.fontSize + '">' +
//                             item.sum +
//                             '人</p><br><p style="color:' + style.fontColor2 +
//                             ';font-size:' + style.fontSize2 + '">' +
//                             item.name +
//                             "</p>"
//                         );
//                     }
//                 },
//             })
//         })
//         let json = {
//             credits: {
//                 enabled: false,
//             },
//             chart: {
//                 type: 'pie',
//                 options3d: {
//                     enabled: true,
//                     alpha: 45
//                 },
//                 events: {
//                     load: function () {
//                         var each = Highcharts.each,
//                             points = this.series[0].points;
//                         each(points, function (p, i) {
//                             p.graphic.attr({
//                                 translateY: -p.shapeArgs.ran
//                             });
//                             p.graphic.side1.attr({
//                                 translateY: -p.shapeArgs.ran
//                             });
//                             p.graphic.side2.attr({
//                                 translateY: -p.shapeArgs.ran
//                             });
//                         });
//                     }
//                 },
//             },
//             title: {
//                 text: '',
//             },
//             subtitle: {
//                 text: ''
//             },
//             plotOptions: {
//                 pie: {
//                     innerSize: 150,
//                     // depth: 100,
//                     dataLabels: {
//                         // color: 'red'
//                     }
//                 },
//             },
//             tooltip: {
//                 enabled: false,
//                 style: { color: 'black' },
//                 // headerFormat: '<span style="font-size: 20px">22</span><br/>'
//             },
//             series: [{
//                 type: 'pie',
//                 name: '人',
//                 // slicedOffset:10,
//                 data: series_data
//                 // [
//                 //     {
//                 //         name: data_[0].name,
//                 //         y: data_[0].sum,
//                 //         h: data_[0].sum === data_[1].sum ? 60 : data_[0].sum > data_[1].sum ? 60 : 40,
//                 //         sliced: true,
//                 //         selected: false,
//                 //         // color: "#2afadf",
//                 //         dataLabels: {
//                 //             // color: 'blue',
//                 //             style: { fontSize: '30px' },
//                 //             formatter: function () {
//                 //                 return (
//                 //                     '<p style="color:' + style.fontColor +
//                 //                     ';font-size:' + style.fontSize + '">' +
//                 //                     data_[0].sum +
//                 //                     '人</p><br><p style="color:' + style.fontColor2 +
//                 //                     ';font-size:' + style.fontSize2 + '">' +
//                 //                     data_[0].name +
//                 //                     "</p>"
//                 //                 );
//                 //             }
//                 //         },
//                 //     },
//                 //     {
//                 //         name: data_[1].name,
//                 //         y: data_[1].sum,
//                 //         h: data_[0].sum === data_[1].sum ? 60 : data_[0].sum > data_[1].sum ? 40 : 60,
//                 //         sliced: true,
//                 //         selected: false,
//                 //         // color: "#0098f4",
//                 //         dataLabels: {
//                 //             // color: 'blue',
//                 //             style: { fontSize: '30px' },
//                 //             formatter: function () {
//                 //                 return (
//                 //                     '<p style="color:' + style.fontColor +
//                 //                     ';font-size:' + style.fontSize + '">' +
//                 //                     data_[1].sum +
//                 //                     '人</p><br><p style="color:' + style.fontColor2 +
//                 //                     ';font-size:' + style.fontSize2 + '">' +
//                 //                     data_[1].name +
//                 //                     "</p>"
//                 //                 )
//                 //             }
//                 //         },
//                 //     },
//                 // ]
//             },]
//         }
//         let color_total = []
//         let color_i = []
//         if (style.colors && style.colors.length > 0) {
//             style.colors.map((item, index) => {
//                 if (item && item.colorList[0] && item.colorList[0].color) {
//                     color_total.push(item.colorList[0].color)
//                 } else {
//                     color_total.push('white')
//                 }
//                 if (item && item.colorList[1] && item.colorList[1].color) {
//                     color_i.push(item.colorList[1].color)
//                 } else {
//                     color_i.push('white')
//                 }
//             })
//         } else {
//             data_.map((item, index) => {
//                 color_total.push('blue')
//                 color_i.push('white')
//             })
//         }
//         console.log(color_total, color_i, '[][][][')
//         Highcharts.getOptions().colors = Highcharts.map(color_total, function (item, index) {
//             return {
//                 radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
//                 // linearGradient: { x1: 0.5, y1: 1, x2: 0, y2: 0 },
//                 stops: [
//                     [0, item],
//                     [1, color_i[index]],
//                     // [1, Highcharts.Color(color).brighten(-0.5).get('rgb')] // darken
//                 ]
//             };
//         });
//         var high = new Highcharts.Chart('high_charts_ring_pie', json)
//         // this.setState(state => ({
//         //     high: new Highcharts.Chart('high_charts_ring_pie', json)
//         // }));
//         // chart1 = new Highcharts.Chart('high_charts_ring_pie', json)
//         // data_ = [{ name: '企退人员', sum: 469 }, { name: '党员', sum: 309 }]
//         // // chartOptions.series[0].data= [10,5,2];
//         // chart1 = new Highcharts.Chart(data);
//         // chart1.series[0].data = [2,4,4];
//         // chart1.redraw();
//     }
//     setOption1(data) {
//         // Highcharts.setOptions(this.props.thisData.style)
//     }
//     render() {
//         return (
//             <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)}
//                 reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
//                 <div className={styles.charts} id='high_charts_ring_pie'></div>
//             </ComponentBox>
//         );
//     }
// }