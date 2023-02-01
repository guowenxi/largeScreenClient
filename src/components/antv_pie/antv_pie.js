import React from "react";
import axios from "axios";
import ComponentBox from "../component_box";
import {Chart} from '@antv/g2';

import style from './antv_pie.module.css'
import Emitter from "../../common/eventBus";

export default class AntvPie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, chart: null};
        this.keyParams = {};
        this.onclick = {
            'click': this.onChartClick.bind(this)
        };
        this.newUrl = '';    //新请求地址
    }

    componentDidMount() {
        this.p = new Promise((resolve) => {
            this.getData(resolve)
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    componentWillUnmount() {
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then((data) => {
            this.setState({data});
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

    //获取数据
    getData(resolve) {
        const {freshTime} = this.props.thisData.dataSources;
        if (freshTime) {
            setTimeout(() => {
                this.getData();
            }, freshTime)
        }
        if (this.props.thisData.dataSources.dataType === 1) {
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            } catch (e) {
            }
            if (resolve) {
                resolve(defaultData);
            } else {
                this.setState({data: defaultData});
            }
        } else if (this.props.thisData.dataSources.dataType === 2) {
            let params = {};
            try {
                params = JSON.parse(this.props.thisData.dataSources.dataParams);
            } catch (e) {
            }
            for (let key in this.keyParams) {
                params[key] = this.keyParams[key];
            }
            axios.get(this.props.thisData.dataSources.dataUrl, {params: params}).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                // let showData = Util.dataFormat(result);
                if (result) {
                    if (resolve) {
                        resolve(result);
                    } else {
                        this.setState({data: result});
                    }
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    //重新获取数据
    reGetData() {
        this.getData();
    }

    //内容格式器代码转化
    formatterChange(label) {
        if (label) {
            if (label.formatter) {
                try {
                    // eslint-disable-next-line no-eval
                    label.formatter = eval(label.formatter);
                } catch (e) {
                }
            }
            if (label.rich) {
                try {
                    label.rich = JSON.parse(label.rich);
                } catch (e) {
                }
            }
        }
    }

    getOption() {
        const thisStyle = this.props.thisData.style;
        if (this.state.data.xAxis == null) {
            return {};
        }
        let series = JSON.parse(JSON.stringify(thisStyle.series[0]));
        //vh兼容处理
        series.label.fontSize = this.props.getCompatibleSize(series.label.fontSize, 'num');
        series.labelLine.length = this.props.getCompatibleSize(series.labelLine.length, 'num');
        series.labelLine.length2 = this.props.getCompatibleSize(series.labelLine.length2, 'num');
        this.formatterChange(series.label);
        //饼图数据
        series.data = this.state.data.series.map((item, index) => {
            return {name: this.state.data.xAxis[index], value: item}
        });
        series.center = [series.centerX, series.centerY];
        series.radius = [series.radiusIn, series.radiusOut];
        //饼图
        let option = {
            title: {},
            tooltip: {   //展示数据
                formatter: "{b}: {c} ({d}%)"
            },
            xAxis: {show: false},
            yAxis: {show: false},
            series: series
        };
        //饼图图例
        let legend = JSON.parse(JSON.stringify(thisStyle.legend));
        if (legend.styleType === 1) {
            // legend.selectedMode = false;
            legend.itemGap = this.props.getCompatibleSize(legend.itemGap, 'num');
            legend.itemWidth = this.props.getCompatibleSize(legend.itemWidth, 'num');
            legend.itemHeight = this.props.getCompatibleSize(legend.itemHeight, 'num');
            legend.textStyle.fontSize = this.props.getCompatibleSize(legend.textStyle.fontSize, 'num');
            legend.textStyle.lineHeight = this.props.getCompatibleSize(legend.textStyle.lineHeight, 'num');
            this.formatterChange(legend);
            option.legend = legend;
        }
        return option;
    }

    getLegend() {
        const thisStyle = this.props.thisData.style;
        const legend = JSON.parse(JSON.stringify(thisStyle.legend));
        const fixNum = legend.fixNum ? legend.fixNum : 0;
        if (this.state.data.xAxis && legend.styleType === 2) {
            if (!legend.show) {
                return null;
            }
            this.formatterChange(legend);
            const columnNum = legend.columnNum ? legend.columnNum : 1;
            const columnGap = legend.columnGap ? legend.columnGap : 0;
            const {data} = this.state;
            let legendList = [];
            let count = 0;
            if (legend.percentage) {
                data.series.forEach((num) => {
                    count += num;
                });
                legendList = data.xAxis.map((item, index) => {
                    let itemNum = '';
                    if (legend.showNum) {
                        itemNum += '　' + data.series[index];
                    }
                    if (typeof (legend.formatter) === 'function') {
                        return {
                            name: legend.formatter(item) + itemNum,
                            percentage: count === 0 ? '0%' : (parseFloat(data.series[index]) * 100 / count).toFixed(fixNum) + '%'
                        };
                    } else {
                        return {
                            name: item + itemNum,
                            percentage: count === 0 ? '0%' : (parseFloat(data.series[index]) * 100 / count).toFixed(fixNum) + '%'
                        };
                    }
                });
            } else {
                if (typeof (legend.formatter) === 'function') {
                    legendList = data.xAxis.map((item, index) => {
                        return {name: legend.formatter(item) + (legend.showNum ? '　' + data.series[index] : '')}
                    });
                } else {
                    legendList = data.xAxis.map((item, index) => {
                        return {name: item + (legend.showNum ? '　' + data.series[index] : '')}
                    });
                }
            }
            const length = data.xAxis.length;
            const rowNum = Math.ceil(length / columnNum);
            //计算多余个数
            const subNum = rowNum * columnNum - length;
            for (let i = 0; i < subNum; i++) {
                legendList.push({});
            }
            const itemStyle = {
                width: (100 - columnGap * (columnNum - 1)) / columnNum + '%',
                height: 100 / rowNum + '%',
                alignItems: legend.verticalAlign,
                flexDirection: legend.align
            };
            const iconStyle = {
                width: this.props.getCompatibleSize(legend.itemWidth),
                height: this.props.getCompatibleSize(legend.itemHeight),
            };
            const distanceWidth = this.props.getCompatibleSize(legend.distance);
            const fontBoxStyle = {
                width: 'calc(100% - ' + distanceWidth + ' - ' + iconStyle.width + ')',
                flexDirection: legend.align
            };
            const nameStyle = {
                fontSize: this.props.getCompatibleSize(legend.textStyle.fontSize),
                color: legend.textStyle.color
            };
            const percentageStyle = {
                fontSize: this.props.getCompatibleSize(legend.percentageSize),
                color: legend.percentageColor,
            };
            return (
                <div className={style.legendBox} style={legend}>
                    {legendList.map((item, index) =>
                        <div className={style.itemBox} key={index} style={itemStyle}>
                            <div className={style.item}
                                 style={{...iconStyle, backgroundColor: thisStyle.series[0].color[index]}}/>
                            <div className={`${style.item} ${style.distance}`} style={{width: distanceWidth}}/>
                            <div className={style.fontBox} style={fontBoxStyle}>
                                <div className={style.item} style={nameStyle}>{item.name}</div>
                                {legend.percentage &&
                                <div className={style.item} style={percentageStyle}>{item.percentage}</div>}
                            </div>
                        </div>
                    )}
                </div>
            );

        } else {
            return null;
        }
    }

    getTitle() {
        const thisStyle = this.props.thisData.style;
        const {data} = this.state;
        if (!thisStyle.titleShow || data.series == null) {
            return null;
        }
        const titleSize = this.props.getCompatibleSize(thisStyle.titleSize);
        const numSize = this.props.getCompatibleSize(thisStyle.numSize);
        let count = 0;
        data.series.forEach((num) => {
            count += num;
        });
        let num = 0;
        if (thisStyle.numType === 'count') {
            num = count;
        } else {
            const numIndex = thisStyle.numIndex != null ? thisStyle.numIndex : 0;
            num = data.series[numIndex];
            if (thisStyle.percentage) {
                num = count === 0 ? '100%' : (parseFloat(num) * 100 / count).toFixed(1) + '%'
            }
        }
        return (
            <div className={style.titleBox} style={{left: thisStyle.titleLeft, top: thisStyle.titleTop}}>
                <div style={{
                    fontSize: titleSize,
                    lineHeight: thisStyle.titleHeight + 'em',
                    color: thisStyle.titleColor
                }}>{thisStyle.title}</div>
                <div style={{
                    fontSize: numSize,
                    lineHeight: thisStyle.numHeight + 'em',
                    color: thisStyle.numColor
                }}>{num}</div>
            </div>
        );
    }

    //折线图点击响应
    onChartClick(e) {
        if (this.props.thisData.dataSources.interact && this.props.thisData.dataSources.interact.length > 0) {
            this.props.thisData.dataSources.interact.forEach((item) => {
                switch (item.type) {
                    case 1:
                    case 3:
                        if (item.dataType !== 1 || this.state.data.ids) {
                            let sendData = {};
                            sendData[item.keyName] = item.dataType === 1 ? this.state.data.ids[e.dataIndex] : e.name;
                            Emitter.emit(item.receiveId, {
                                type: item.type === 1 ? 'changeKey' : 'showComponent',
                                data: sendData
                            });
                        }
                        break;
                    case 2:
                        break;
                    default:
                        break
                }
            });
        }
    }


    getChartData() {
        let data = [];
        //饼图数据
        data = this.state.data.series.map((item, index) => {
            return {type: this.state.data.xAxis[index], value: item}
        });
        return data;
    }

    initChart() {

        if (JSON.stringify(this.state.data) === "{}") {
            return
        }

        const thisStyle = this.props.thisData.style;

        //清除之前渲染的图表
        document.getElementById(this.props.thisData.id + '_charts').innerHTML = '';

        const chart = new Chart({
            container: this.props.thisData.id + '_charts',
            autoFit: true,
            padding: [20, 0, 0, 0]
        });

        chart.data(this.getChartData());

        chart.coordinate('polar', {
            startAngle: Math.PI, // 起始角度
            endAngle: Math.PI * (3 / 2), // 结束角度
        });

        chart.legend(false);

        chart.scale('value', {
            tickCount: 10,
        });

        chart.axis('value', {
            tickLine: null,
            grid: {
                line: {
                    type: 'circle',
                },
                closed: false
            },
            label: null
        });

        chart.axis('type', {
            tickLine: null,
            grid: null,
            label: {
                style: {
                    fill: '#fff',
                }
            }
        });

        chart.tooltip({
            show: false,
            showMarkers: false
        });
        if(!thisStyle.tooltip.show){
            chart.tooltip(false);
        }

        chart.interaction('element-highlight');

        chart
            .interval()
            .position('type*value')
            .color('type', 'rgb(252,143,72)-rgb(255,215,135)')
            .label('value', {
                show: false,
                offset: thisStyle.label.offset,
                style: {
                    textAlign: 'center',
                    fill: '#fff',
                },
            })
            .style({
                lineWidth: 1,
                stroke: '#fff',
            });

        chart.render();
    }

    render() {
        this.initChart();
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)}
                          reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <div id={this.props.thisData.id + '_charts'}
                     style={{width: '100%', height: '100%', position: 'absolute'}}></div>
            </ComponentBox>
        );
    }
}