/* eslint-disable no-eval */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';


import { getData } from "../../common/getDataUtil";
import ComponentBox from "../component_box";

import cssStyle from './echarts_diagram_one.module.css';

import * as echarts from 'echarts';

import { Motion, spring } from "react-motion";

export default class EchartsDiagram extends Component {

    constructor(props) {
        super(props);
        this.state = { data: [], opacity: 0, };
        this.keyParams = {};
        this.interactParams = {};
        this.getData = getData.bind(this);
        this.chartRef = React.createRef();
    }


    componentDidMount() {
        this.p = new Promise((resolve) => {
            if (this.props.thisData.firstLoad) {
                this.getData(this.callBack.bind(this, resolve));
            } else {
                this.callBack(resolve);
            }
        });
    }
    componentDidUpdate() {
        const { style } = this.props.thisData;
        // console.log({ options: this.getOption(), chartOption: this.chart && this.chart.getOption() });
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
    getOption() {
        const { dataList } = this.state;
        const { nodeList, lineList, showTooltip, headerType, footerType, layout } = this.props.thisData.style;
        const data = dataList.map((item, index) => {
            const node = nodeList[index];
            const image = item.imageDataSource === 'custom' ? 'image://' + node.image : item.imgSrc;
            return {
                name: item.name,
                x: node ? (node.x ? node.x : 0) : 0,
                y: node ? (node.y ? node.y : 0) : 0,
                symbol: node ? (node.appearance === 'shape' ? node.shape : image) : 'circle',
                symbolSize: node ? node.symbolSize : 10,
                itemStyle: {
                    color: node ? node.backgroundColor : '',
                    borderColor: node ? node.borderColor : '',
                    borderWidth: node ? node.borderWidth : 0,
                    borderType: node ? node.borderType : '',
                    shadowBlur: node ? node.shadowBlur : 0,
                    shadowColor: node ? node.shadowColor : '',
                    shadowOffsetX: node ? node.shadowOffsetX : 0,
                    shadowOffsetY: node ? node.shadowOffsetY : 0,
                },
                label: {
                    show: node ? (node.showLabel ? node.showLabel : false) : false,
                    position: [node ? node.labelLeft : '', node ? node.labelTop : ''],
                    color: node ? node.labelColor : '#ccc',
                    fontSize: node ? node.labelFontSize : 12,
                    rotate: node ? node.labelRotate : '',
                },

            }
        });
        const links = [];
        dataList.forEach((item, index) => {
            if (item && Array.isArray(item.target)) {
                const nodeLink = item.target.map((targetItem, targetIndex) => {
                    return {
                        source: index,
                        target: dataList.findIndex((findItem) => targetItem.targetId === findItem.id),
                        label: targetItem.label,
                    }
                });
                links.push(...nodeLink);
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
                const line = lineList[index];
                item.lineStyle = {
                    width: line ? line.width : 1,
                    color: line ? line.color : '#fff',
                    type: line ? line.type : 'solid',
                    curveness: line ? line.curveness : 0,
                }
                item.label = {
                    show: line ? (line.showLabel ? line.showLabel : false) : false,
                    position: line ? line.labelPosition : 'middle',
                    color: line ? line.labelColor : '#ccc',
                    fontSize: line ? line.labelFontSize : 12,
                    rotate: line ? line.labelRotate : '',
                }
                if (line && line.labelFormatter) {
                    item.label.formatter = eval(line.labelFormatter);
                }
            })
        }
        const options = {
            tooltip: {
                show: showTooltip,
            },
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    type: 'graph',
                    layout,
                    symbolSize: 50,
                    roam: true,
                    label: {
                        show: true
                    },
                    edgeSymbol: [headerType, footerType],
                    edgeSymbolSize: [4, 10],
                    edgeLabel: {
                        fontSize: 20
                    },
                    data,
                    links: newLinks,
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
        this.chart = echarts.init(this.chartRef.current);
        const options = this.getOption();
        this.chart.setOption(options);
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
                                style={{ width: '100%', height: '100%', position: 'absolute', opacity }}
                                ref={this.chartRef}
                                id="echarts-diagram-one"
                            ></div>
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}

