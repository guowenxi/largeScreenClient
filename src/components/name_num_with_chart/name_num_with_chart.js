import React from "react";
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import ComponentBox from "../component_box";
import axios from "axios";

import cssStyle from "./name_num_with_chart.module.css";
import {getColumnNum} from "../../common/util";
import {fileUrl} from "../../config";

export default class NameNumTypeEight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, list: [], allNum: 0};
    }

    componentDidMount() {
        this.p = new Promise((resolve) => {

            setTimeout(()=>{
                const chartDom = document.getElementById('echarts_line_'+this.props.thisData.id);
                this.myChart = echarts.init(chartDom);
                this.getData(resolve)
            });
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.thisData.updateTime !== this.props.thisData.updateTime) {
            //组件数据源变更时刷新数据
            this.getData();
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey" :
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "showComponent":
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.p.then((data) => {
            this.setState({data},()=>{
                this.getOption();
            });
            let stateData = this.state.data;
            let allNum = 0;
            if (stateData && stateData.series) {
                for (let i = 0; i < stateData.series.length; i++) {
                    allNum += stateData.series[i];
                }
                this.setState({allNum: allNum});
            }
        });
    }

    //重新获取数据
    reGetData() {
        this.setState({resultData: []});
        this.getData();
    }

    //获取数据
    getData(resolve) {
        if (this.props.thisData.dataSources.dataType === 1) {
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            } catch (e) {
            }
            if (resolve) {
                resolve(defaultData);
            } else {
                this.setState({data: defaultData},()=>{
                    this.getOption();
                });
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
                const result = response.data.data;
                if (result) {
                    if (resolve) {
                        resolve(result);
                    } else {
                        this.setState({data: result},()=>{
                            this.getOption();
                        });
                    }
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    disposeData(data) {
        let list = [];
        if (data && data.xAxis) {
            for(let i=0; i<data.xAxis.length; i++){
                list.push({
                    name: data.xAxis[i],
                    num: data.series[i]
                });
            }
        }
        return list;
    }

    getOption() {
        const thisStyle = this.props.thisData.style;
        if (this.state.data == null || this.state.data.xAxis == null) {
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
        // return option;
        this.myChart.setOption(option);
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

    render() {
        const resultData = this.state.data;
        const allNum = this.state.allNum;
        const {style} = this.props.thisData;
        const list = this.disposeData(resultData);
        return (
            <ComponentBox style={{...this.props.style, overflow: 'hidden'}}
                          receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)}
                          thisData={this.props.thisData}>
                <div className={cssStyle.chartBox}>
                    {/*{this.state.data && this.state.data.xAxis && (*/}
                    {/*    <ReactEchartsCore*/}
                    {/*        style={{width: '100%', height: '100%', position: 'absolute'}}*/}
                    {/*        echarts={echarts}*/}
                    {/*        option={this.getOption()}*/}
                    {/*        theme={"theme_name"}/>*/}
                    {/*)}*/}
                    <div
                        style={{ width: '100%', height: '100%', position: 'absolute' }}
                        id={'echarts_line_'+this.props.thisData.id}
                    />
                </div>
                <div className={cssStyle.listBox} style={{
                    color: style.fontColor,
                    fontSize: style.fontSize
                }}>
                    <div className={cssStyle.titleAll}>
                        <span className={cssStyle.iconText}>All</span>
                        <span className={cssStyle.name}>{style.titleText}</span>
                        <p className={cssStyle.num}>
                            <span>{allNum}</span>
                            <span>{style.unit}</span>
                        </p>
                    </div>
                    <div className={cssStyle.itemAll}>
                        {list.map((item, index) => {
                            const returnDom = [];
                            //计算项宽高
                            const itemStyle = getColumnNum(style, list);
                            returnDom.push(
                                <div className={cssStyle.contentItem} style={{
                                    width: itemStyle.width,
                                    height: itemStyle.height
                                }} key={index}>
                                    <div className={cssStyle.itemText}>
                                        <img className={cssStyle.icon} alt=''
                                             src={fileUrl + '/download/' + style.icon[index]}
                                             style={{
                                                 width: style.iconSize,
                                                 height: style.iconSize
                                             }}/>
                                        <span className={cssStyle.name}>{item.name}</span>
                                        <p className={cssStyle.num}>
                                            <span>{item.num}</span>
                                            <span>{style.unit}</span>
                                        </p>
                                    </div>
                                </div>
                            );
                            return returnDom;
                        })}
                    </div>
                </div>
            </ComponentBox>
        );
    }
}