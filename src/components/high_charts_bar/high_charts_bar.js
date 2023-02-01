import React, {Component} from 'react';

import styles from './high_charts_bar.module.css';

import Highcharts from 'highcharts/highstock';
import Highcharts3D from 'highcharts/highcharts-3d';
import {getData} from "../../common/getDataUtil";
import ComponentBox from "../component_box";
Highcharts3D(Highcharts);

export default class HightCharts extends Component {

    constructor(props) {
        super(props);
        this.state = {data: {}};
        this.keyParams = {};
        this.getData = getData.bind(this);
    }


    componentDidMount() {
        this.p = new Promise((resolve) => {
            this.getData(this.callBack.bind(this, resolve))
        });
    }

    componentWillUnmount() {

    }


    //挂载数据到页面显示
    animateOn() {
        this.p.then((data) => {
            this.setState({data});
            this.setOption(data);
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
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
            if (resolve) {
                resolve(result);
            } else {
                this.setState({data: result});
                this.setOption(result);
            }
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    setOption(data){
        let _data = [];
        const color_0 = ["#35bffb","#26eea1","#e2c309","#96581f","#58252d",];
        const color = ["#628dfe","#1abdc9","#c47b44","#dc9d2c","#db4f50",];
        // const color_0 = ["#26611f","#053468","#7d6213","#96581f","#58252d",];
        // const color = ["#1e9b29","#064e88","#dac60f","#dc9d2c","#db4f50",];
        // const color_0 = ["#58252d","#96581f","#7d6213","#053468","#26611f"];
        // const color = ["#db4f50","#dc9d2c","#dac60f","#064e88","#1e9b29"];

        // 初始化设置颜色
        data.legends.forEach(function(item,idx){
            _data.push({
                color:{
                    linearGradient: { x1: 0, y1: 1, x2: 0, y2: 0 },
                    stops: [
                        [0,color_0[idx]],
                        [1, color[idx]]
                    ],
                },
                name:data.legends[idx],
                data:data.series[idx],
            })
        });

        new Highcharts.Chart('high_charts_bar'+this.props.thisData.id,{
            legend:{
                enabled:false,
            },
            title:"",
            credits: {
                enabled: false
            },
            chart: {
                renderTo: 'container',
                type: 'column',
                options3d: {
                    enabled: true,
                    //内旋转角
                    alpha: 0,
                    //外旋转角
                    beta: 0,
                    //深度
                    depth: 100,
                    viewDistance: 25
                }
            },
            plotOptions: {
                column: {
                    depth: 55
                },
                series: {
                    stacking: null
                }
            },
            xAxis: {
                gridLineWidth:0,
                gridLineColor:"rgba(0,0,0,0)",
                labels:{
                    style:{
                        color:'#fff',
                        opacity:'1',
                        fontSize:'14px'
                    }
                },
                categories: data.xAxis
            },
            yAxis: {
                labels:{
                    style:{
                        color:'#fff',
                        opacity:'1',
                        fontSize:'14px'
                    }
                },
                lineColor:"#fff",
                lineWidth:1,
                gridLineColor:"rgba(255,255,255,0.1)",
                min: 0,
                title: {
                    text: ''
                }
            },
            series: _data
        });
    }


    render() {
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)}
                          reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <div className={styles.charts} id={'high_charts_bar'+this.props.thisData.id} />
            </ComponentBox>
        );
    }
}

