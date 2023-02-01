import React, { Component } from 'react';


import { getData } from "../../common/getDataUtil";
import ComponentBox from "../component_box";

import * as echarts from 'echarts';
import 'echarts-liquidfill';

import { Motion, spring } from "react-motion";

export default class EchartsWaveChart extends Component {

    constructor(props) {
        super(props);
        this.state = { data: {}, opacity: 0, nums: [], names: [], };
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
        this.refreshChartsTimer = setInterval(()=>{
            this.refreshCharts();
        },60000);
    }
    componentDidUpdate() {
        if (this.chart && this.props.editType) {
            this.refreshOption();
        }
    }
    componentWillUnmount() {
        // this.chart.dispose();
        if(this.refreshChartsTimer){
            clearInterval(this.refreshChartsTimer);
        }
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
        if (result) {
            let resultData;
            if(Array.isArray(result)){
                if(result.length > 0){
                    resultData = result;
                }else{
                    return;
                }
            }else{
                resultData = [result];
            }
            const nums = resultData.map(item => item.num != null ? item.num : 0.8);
            const names = resultData.map(item => item.name);
            this.setState({ data: resultData[0], nums, names }, () => {
                this.setOption();
            });
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }
    getOption() {
        const { nums, } = this.state;
        const { style } = this.props.thisData;
        let color;
        if (style.colorType === 'monochrome') {
            color = style.monochromeColors;
        } else {
            const endPoint = style.gradientDirection === 'transverse' ? { x2: 1, y2: 0 } : { x2: 0, y2: 1 };
            color = style.gradientColors.map(item => {
                return {
                    colorStops: item,
                    x: 0, y: 0, ...endPoint,
                }
            })
        }
        const options = {
            series: {
                type: 'liquidFill',
                data: nums,
                radius: style.radius,
                color,
                direction: style.direction || 'right',
                waveAnimation: style.waveAnimation,
                period: style.period || 'auto',
                shape: style.shape || 'circle',
                outline: {
                    show: style.showOutLine,
                    borderDistance: style.borderDistance,
                    itemStyle: {
                        borderColor: style.borderColor,
                        borderWidth: style.borderWidth,
                        shadowBlur: style.shadowBlur,
                        shadowColor: style.shadowColor,
                    }
                },
                backgroundStyle: {
                    color: style.backgroundColor || '#E3F7FF',
                },
                label: {
                    show: style.showLabel,
                    color: style.labelColor || '#294D99',
                    fontSize: style.labelFontSize,
                    position: style.labelPosition,
                }
            },
            tooltip: {
                show: style.showTooltip,
            }
        };
        if (style.formatter) {
            try {
                // eslint-disable-next-line no-eval
                options.series.label.formatter = eval(style.formatter).bind(this);
            } catch (e) {}
            try {
                // eslint-disable-next-line no-eval
                options.series.label.rich = JSON.parse(style.rich);
            } catch (e) {}
        }
        return options;
    }
    refreshOption() {
        const options = this.getOption();
        this.chart.setOption(options);
    }
    // 配置图表
    setOption() {
        if(this.chart == null){
            this.chart = echarts.init(this.chartRef.current);
        }
        const options = this.getOption();
        this.chart.setOption(options);
    }

    refreshCharts(){
        if(this.chart){
            this.chart.dispose();
            this.chart = echarts.init(this.chartRef.current);
            const options = this.getOption();
            this.chart.setOption(options);
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

