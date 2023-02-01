/* eslint-disable no-eval */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';


import { getData } from "../../common/getDataUtil";
import ComponentBox from "../component_box";

import * as echarts from 'echarts';

import { Motion, spring } from "react-motion";
import {interactData} from "../../common/util";

export default class EchartsDiagramTwo extends Component {

    constructor(props) {
        super(props);
        this.state = { dataList: [], opacity: 0, };
        this.keyParams = {};
        this.interactParams = {};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.chartRef = React.createRef();
        this.imageList = {
            '家庭':'./images/fkzh/people.png',
            '同行':'./images/fkzh/people.png',
            '朋友':'./images/fkzh/people.png',
            '事件':'./images/fkzh/event.png',
            '属地':'./images/fkzh/address.png',
        };
    }


    componentDidMount() {
        this.p = new Promise((resolve) => {
            setTimeout(()=>{
                this.chart = echarts.init(this.chartRef.current);
                // this.chart.on('click',  (params) => {
                //     this.onChartClick(params);
                // });
                if (this.props.thisData.firstLoad) {
                    this.getData(this.callBack.bind(this, resolve));
                } else {
                    this.callBack(resolve);
                }
            });
        });
    }
    componentDidUpdate() {
        if (this.chart && this.props.editType) {
            this.refreshOption();
        }
    }
    componentWillUnmount() {
        // this.chart.dispose();
    }


    //挂载数据到页面显示
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity: 1 })
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "changeUrl":

                break;
            case "deleteKey":
                this.keyParams = {};
                this.reGetData();
                break;
            case 'messageSend':
                for (let key in data.data) {
                    this.interactParams[key] = data.data[key];
                }
                break;
            case 'reFresh':
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
        if (result && result.length > 0) {
            this.setState({ dataList: result }, () => {
                this.setOption();
            });
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }
    getXY(index, length,) {
        if (index === 0) {
            return {
                x: 200, y: 300,
            }
        } else {
            const { sin, cos, PI } = Math;
            const angle = (2 * PI / (length - 1)) * (index - 1);
            const x = 200 + 50 * sin(angle);
            const y = 300 + 50 * cos(angle);
            return { x, y, angle };
        }
    }
    getOption() {
        const { dataList } = this.state;
        const { style } = this.props.thisData;
        const data = dataList.map((item, index) => {
            return {
                name: item.name+'_'+index,
                // symbol: 'image://' + item.imgSrc,
                // symbol: 'image://' + (item.type && this.imageList[item.type] ? this.imageList[item.type] : './images/fkzh/people.png'),
                symbol: 'image://./images/fkzh/people.png',
                ...this.getXY(index, dataList.length>3?dataList.length:4),
                symbolSize: index > 0 ? style.branchSymbolSize : style.rootSymbolSize,
                label: {
                    show: style.nodeShowLabel,
                    position: style.nodeLabelPosition,
                    color: style.nodeLabelColor,
                    fontSize: style.nodeLabelFontSize,
                },
            }
        });
        const links = [];
        dataList.forEach((item, index) => {
            if (item.type) {
                links.push({
                    source: 0,
                    target: index,
                    label: item.type
                })
            }
        });
        const newLinks = links.map((item) => {
            const { source, target } = item;
            return {
                source, target
            }
        })
        if (newLinks.length > 0) {
            newLinks.forEach((item, index) => {
                const formatter = () => {
                    return Array.isArray(links) ? (links[index] ? links[index].label : null) : null;
                }
                item.lineStyle = {
                    width: style.lineWidth,
                    color: style.lineColor,
                    type: style.lineType,
                    curveness: style.lineCurveness,
                }
                item.label = {
                    show: style.lineShowLabel,
                    position: style.lineLabelPosition,
                    color: style.lineLabelColor,
                    fontSize: style.lineLabelFontSize,
                    rotate: 0,
                }
                item.label.formatter = formatter;
            })
        }
        const options = {
            tooltip: {
                show: style.showTooltip,
            },
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    type: 'graph',
                    layout: 'force',
                    symbolSize: 50,
                    roam: true,
                    label: {
                        show: true,
                        formatter:function(params){
                            if(params.name){
                                return params.name.split('_')[0];
                            }else {
                                return params.name;
                            }
                        }
                    },
                    edgeSymbol: ['none', 'none'],
                    edgeSymbolSize: [4, 10],
                    edgeLabel: {
                        fontSize: 20
                    },
                    data,
                    links: newLinks,
                    force: {
                        edgeLength: 40
                    },
                    draggable: false,
                    silent: true,
                }
            ],
        };
        return options;
    }
    refreshOption() {
        const options = this.getOption();
        this.chart.setOption(options);
    }
    // 配置图表
    setOption() {
        const options = this.getOption();
        this.chart.setOption(options);
        // this.chart.on('mouseup', (params) => {
        //     const option = this.chart.getOption();
        //     option.series[0].data[params.dataIndex].x = params.event.offsetX;
        //     option.series[0].data[params.dataIndex].y = params.event.offsetY;
        //     option.series[0].data[params.dataIndex].fixed = true;
        //     this.chart.setOption(option);
        // });
    }

    //点击响应
    onChartClick() {
        if(this.state.dataList && this.state.dataList[0]){
            const { interact } = this.props.thisData.dataSources;
            this.interactData(interact,this.state.dataList[0]);
        }
    }

    render() {
        return (
            <ComponentBox
                style={this.props.style}
                receiveMessage={this.receiveMessage.bind(this)}
                reGetData={this.reGetData.bind(this)}
                thisData={this.props.thisData}
            >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) => {
                        return (
                            <div
                                onClick={this.onChartClick.bind(this)}
                                style={{ width: '100%', height: '100%', position: 'absolute', opacity }}
                                ref={this.chartRef}
                            />
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}

