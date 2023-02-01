import React, {Component} from 'react';
import styles from './high_charts_pie.module.css';

import dizuo_yuan from './dizuo_yuan.svg';
import guang from './guang.svg';
import Highcharts from 'highcharts/highstock';
import Highcharts3D from 'highcharts/highcharts-3d';
import ComponentBox from "../component_box";
import {getData} from "../../common/getDataUtil";
import Util, {getColumnNum, getCompatibleSize, interactData} from "../../common/util";
import {Motion, spring} from "react-motion";

Highcharts3D(Highcharts);

export default class HighChartsPie extends Component {

    constructor(props) {
        super(props);
        this.state = {data: {},opacity:0};
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.color_0 = ["rgb(134,174,59)","rgb(56,144,36)","rgb(59,187,147)","#3afbed", "#38f2ce", "#0dd3b2", "#04a5a5", "#40c0ed", "#2071d3", "#0245a7"];
        this.color = ["rgb(134,174,59)","rgb(56,144,36)","rgb(59,187,147)","#3afbed", "#38f2ce", "#0dd3b2", "#04a5a5", "#40c0ed", "#2071d3", "#0245a7"];
        this.interactData = interactData.bind(this);
        // this.color_0 = ["#3afbed", "#38f2ce", "#0dd3b2", "#04a5a5", "#40c0ed", "#2071d3", "#0245a7"];
        // this.color = ["#3afbed", "#38f2ce", "#0dd3b2", "#04a5a5", "#40c0ed", "#2071d3", "#0245a7"];
    }


    componentDidMount() {
        this.p = new Promise((resolve) => {
            this.getData(this.callBack.bind(this, resolve))
        });
        // setTimeout(() => {
        //     this.setOption(data);
        // }, 100);
    }

    componentWillUnmount() {

    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then((data) => {
            this.setState({opacity:1});
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "dataInterchange":
            case "changeKey" :
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "changeUrl" :

                break;
            case "deleteKey" :
                this.keyParams = {};
                this.reGetData();
                break;
            default:
                break;
        }
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            this.setState({data: result});
            setTimeout(()=>{
                this.setOption(result);
            });
            if (resolve) {
                resolve(result);
            }
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    setOption(data) {
        if(data.xAxis == null || data.xAxis.length === 0){
            return;
        }
        const {style} = this.props.thisData;
        const colorList = style.colorList && style.colorList.length > 0 ? style.colorList : this.color;
        let _data = [];
        let series = [];
        if(data.legends && data.legends.length > 0){
            series = data.series[0]
        }else{
            series = data.series;
        }
        // 初始化设置颜色
        data.xAxis.forEach( (item, idx) => {
            _data.push({
                name: item,
                y: Number(series[idx]),
                color: {
                    linearGradient: {x1: 0, y1: 1, x2: 0, y2: 0},
                    stops: [
                        [0, colorList[idx] ? colorList[idx] : '#000'],
                        [1, colorList[idx] ? colorList[idx] : '#000']
                    ],
                },
            })
        });

        Highcharts.chart('high_charts_pie'+this.props.thisData.id, {
            credits: {
                enabled: false
            },
            // legend:{
            //   layout:"horizontal",

            //   align:"left"
            // },
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 55,
                    beta: 0
                }
            },
            title: {
                text: ''
            },
            tooltip: {
                // headerFormat:'',
                // pointFormat: '<span>占比: {point.percentage:.1f}%</span><span>{point.x}: {point.y}</span>'
                formatter:function(){
                    // console.log(this)
                    return this.point.name + ': ' + this.point.y+'<br>占比: '+this.point.percentage.toFixed(2)+'%';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 45,
                    // showInLegend: true,
                    dataLabels: {
                        enabled: false,
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '',
                data: _data
            }]
        });
    }

    getLegend(){
        const {data} = this.state;
        if(data.xAxis == null || data.xAxis.length === 0){
            return;
        }
        const sum = Util.getSum(data.series);
        const resultData = data.xAxis.slice();
        const {style} = this.props.thisData;
        const fontSizeName = getCompatibleSize(style.fontSizeName);
        const fontSizeNum = getCompatibleSize(style.fontSizeNum);
        const fontSizePer = getCompatibleSize(style.fontSizePer);
        const itemStyle = getColumnNum(style,resultData);
        const colorList = style.colorList && style.colorList.length > 0 ? style.colorList : this.color;
        const fitNum = style.fitNum ? style.fitNum : 2;
        return resultData.map((item, idx) => {
            if(item){
                const thisNum = Number(data.series[idx]);
                return (
                    <li className={styles.item} key={idx} style={{...itemStyle,fontSize:fontSizeName,paddingLeft:(style.textIndent+1)+'em'}} onClick={this.itemClick.bind(this,data,item,idx)}>
                        <div className={styles.cir} style={{background: colorList[idx],width:fontSizeName,height:fontSizeName}}/>
                        <div className={styles.textBox}>
                            <div className={styles.text} style={{width:style.nameWidth,color:style.colorName,fontSize:item.length > style.maxFontNum ? (style.maxFontNum/item.length).toFixed(2)+'em':'1em'}}>{`${item}`}</div>
                            <div className={`${styles.text} ${styles.text2}`} style={{width:style.numWidth,fontSize:fontSizeNum,color:style.colorNum,textAlign:style.numAlign}}>{thisNum}</div>
                            {style.perShow && <div className={`${styles.text} ${styles.text2}`} style={{width:style.perWidth,fontSize:fontSizePer,color:style.colorPer,textAlign:style.perAlign}}>{thisNum?(thisNum*100/sum).toFixed(fitNum)+'%':'0%'}</div>}
                        </div>
                    </li>
                );
            }else{
                return (
                    <li className={styles.item} key={idx} style={itemStyle}/>
                );
            }
        });
    }

    //点击响应
    itemClick(data,item,index) {
        const { interact } = this.props.thisData.dataSources;
        if(interact){
            this.interactData(interact, {name:item,dataIndex:index,id:data.ids&&data.ids[index]},'charts');
        }
    }

    render() {
        const { style} = this.props.thisData;
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)}
                          reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={styles.box} style={{display: 'flex',opacity}}>
                            <div className={styles.charts} style={{width:style.pieWidth+'%',height:style.pieHeight+'%',top:style.pieTop+'%',left:style.pieLeft+'%'}}>
                                <div className={styles.bg}>
                                    <img alt='' className={styles.bgInner} src={dizuo_yuan}/>
                                </div>
                                <div className={styles.chartsInner} id={'high_charts_pie'+this.props.thisData.id}/>
                                <img alt='' className={styles.guang} src={guang}/>
                            </div>

                            <ul className={styles.legend} style={{width:style.legendWidth+'%',height:style.legendHeight+'%',top:style.legendTop+'%',left:style.legendLeft+'%',display:style.legendShow===2?'none':'',flexDirection:style.flexDirection}}>
                                {this.getLegend()}
                            </ul>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}


