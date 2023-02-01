import React from "react";
import 'echarts-for-react';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/map';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import ComponentBox from "../component_box";
import {getData} from "../../common/getDataUtil";
import {changeComponentShow, interactData} from "../../common/util";
import {Motion, spring} from "react-motion";
import axios from "axios";

export default class EchartsMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [],opacity:0 };
        this.keyParams = {};
        this.onclick = {
            'click': this.onChartClick.bind(this)
        };
        this.getData = getData.bind(this);
        this.getDataTime = 0;
        this.changeComponentShow = changeComponentShow.bind(this);
        this.interactData = interactData.bind(this);
        this.centerData= [];
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            axios.get('./json/mapGeo/chinaCenter.json').then((response) => {
                this.centerData = response.data;
            }).catch(function(error){
                // 处理请求出错的情况
            });
            axios.get('./json/mapGeo/china.json').then((response) => {
                echarts.registerMap('china', response.data);
                const chartDom = document.getElementById('echarts_map_'+this.props.thisData.id);
                this.myChart = echarts.init(chartDom);
                this.myChart.on('click',  (params) => {
                    this.onChartClick(params);
                });
                if(this.props.thisData.firstLoad){
                    this.getData(this.callBack.bind(this, resolve));
                }else{
                    this.callBack(resolve);
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //props变更时触发函数
    componentDidUpdate(){
        if(this.myChart && this.props.editType && this.props.isSelected){
            this.getOption();
        }
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
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "dataInterchange":
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
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
            default:
                break;
        }
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve(result);
        }
        if (result) {
            this.getDataTime = (new Date()).getTime();
            this.setState({ data: result },()=>{
                this.getOption();
            });
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    getOption() {
        const {style} = this.props.thisData;
        if (this.state.data == null) {
            this.myChart.clear();
            this.myChart.setOption({});
            return;
        }
        let PointData = [];
        let lineData = [];
        this.state.data.forEach((item)=>{
            for(let i = 0;i < this.centerData.length;i ++){
                if(item.name && item.name.indexOf(this.centerData[i].name) >= 0){
                    PointData.push({id:item.id,name:item.name,value:this.centerData[i].coord.concat(item.number)});
                    lineData.push({
                        coords: style.directionType === 2 ? [[120.98094,28.11777],this.centerData[i].coord]:[this.centerData[i].coord,[120.98094,28.11777]],
                        value: item.number,id:item.id,name:item.name
                    });
                    break;
                }
            }
        });
        const option = {
            geo: {
                map: 'china',
                roam:true,
                itemStyle: {
                    areaColor: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(93,123,186,1)'
                },
                label: {
                    color: 'rgb(255,255,255)'
                },
                emphasis: {
                    itemStyle: {
                        areaColor: 'rgba(0,0,0,0)',
                        borderColor: 'rgba(93,123,186,1)'
                    },
                    label: {
                        color: 'rgb(255,255,255)'
                    }
                }
            },
            visualMap: [{
                left: 'right',
                min: 0,
                max: 99,
                inRange: {
                    color: [
                        '#313695',
                        '#4575b4',
                        '#74add1',
                        '#abd9e9',
                        '#fdae61',
                        '#f46d43',
                        '#d73027',
                        '#a50026'
                    ],
                    symbolSize: [10, 30]
                },
                text: ['高', '低'],
                textStyle:{
                    color:'#fff'
                },
                calculable: true
            }],
            series: [
                {
                    name: 'Top 5',
                    geoIndex: 0,
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: PointData,
                    itemStyle:{
                        opacity: 0.01
                    },
                    zlevel:1,
                    z:1
                },
                {
                    type: 'lines',
                    coordinateSystem: 'geo',
                    geoIndex: 0,
                    animation: false,
                    colorBy: 'data',
                    lineStyle: {
                        width: 1,
                        curveness: 0.5
                    },
                    effect: {
                        show: true,
                        color: 'rgb(255,255,255)',
                        constantSpeed: 50
                    },
                    data: lineData,
                    zlevel:2,
                    z:2
                }
            ]
        };
        this.myChart.clear();
        this.myChart.setOption(option);
    }


    //点击响应
    onChartClick(e) {
        if(e.data && e.seriesType === 'effectScatter'){
            // console.log(e.data);
            const { interact } = this.props.thisData.dataSources;
            this.interactData(interact, e.data);
        }else if(e.componentType === 'geo'){
            // console.log(e);
            const {data} = this.state;
            for(let i = 0;i < data.length;i ++){
                if(data[i].name === e.name){
                    const { interact } = this.props.thisData.dataSources;
                    this.interactData(interact, data[i]);
                    break;
                }
            }
        }
    }

    render() {
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) => {
                        return (
                            <div
                                style={{ width: '100%', height: '100%', position: 'absolute',opacity }}
                                id={'echarts_map_'+this.props.thisData.id}
                            />
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}