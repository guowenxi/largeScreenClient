import React from "react";
import 'echarts-for-react';
// import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/radar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import ComponentBox from "../component_box";
import { getData } from "../../common/getDataUtil";
import Util, { interactData,getArrayMin,getArrayAllMin,getArrayPerMin,getArrayAllPerMin } from "../../common/util";
import {Motion, spring} from "react-motion";
import cssStyle from "./echarts_radar.module.css";

export default class EchartsRadar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {}, show: true , getDataTime: 0, opacity: 0 };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.getDataTime = 0;
        this.onclick = {
            'click': this.onChartClick.bind(this)
        };
        this.interactData = interactData.bind(this);
        this.mapTooltipBoxRef = React.createRef();
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            setTimeout(() => {
                const chartDom = document.getElementById('echarts_radar_' + this.props.thisData.id);
                this.myChart = echarts.init(chartDom);
                this.myChart.on('click', (params) => {
                    this.onChartClick(params);
                });
                if (this.props.thisData.firstLoad) {
                    this.getData(this.callBack.bind(this, resolve))
                } else {
                    this.callBack(resolve);
                }
            });
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
        // this.p = new Promise((resolve) => {
        //     if(this.props.thisData.firstLoad){
        //         this.getData(this.callBack.bind(this, resolve))
        //     }else{
        //         this.callBack(resolve);
        //     }
        // });
        // if (this.props.firstLoad === false) {
        //     this.animateOn();
        // }
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
            this.setState({ opacity:1 })
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
                if (data.reGetData !== 2) {
                    this.reGetData();
                }
                break;
            case "deleteKey":
                this.keyParams = {};
                this.reGetData();
                break;
            default:
                break;
        }
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve();
        }
        if (result) {
            const {style} = this.props.thisData;
            // if(!style.freshAnimate){
            //     this.getDataTime = (new Date()).getTime();
            // }
            // this.setState({ data:{},getDataTime:(new Date()).getTime() },()=>{
            //     this.setState({data: result,getDataTime:(new Date()).getTime()});
            // });
            this.setState({ data: result,getDataTime:(new Date()).getTime() });
            setTimeout(()=>{
                if(style.freshAnimate){
                    this.getOption(true);
                }
                this.getOption();
            });
            // if(style.freshAnimate){
            //     setTimeout(()=>{
            //         this.getDataTime = (new Date()).getTime();
            //         this.setState({ });
            //     });
            // }
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据，并配置
    getSeriesData(data, series, thisStyle, max, multiple) {
        if (series.seriesColorType === 2) {
            let result = [];
            data.forEach((item, index) => {
                if (('' + item).indexOf('%') > 0) {
                    if (parseInt(item) > 100) {
                        let newData = max
                        result.push({
                            value: newData,
                            itemStyle: {
                                color: this.getColor(series, index, thisStyle.orientations)
                            }
                        });
                    } else {
                        let newData = parseInt(item) / 100 * max
                        result.push({
                            value: newData,
                            itemStyle: {
                                color: this.getColor(series, index, thisStyle.orientations)
                            }
                        });
                    }
                } else {
                    result.push({
                        value: item,
                        itemStyle: {
                            color: this.getColor(series, index, thisStyle.orientations)
                        }
                    });
                }
            });
            return result;
        } else {
            let result = [{ value: data }]
            return result;
        }
    }

    //内容格式器代码转化
    formatterChange(label) {
        if (label) {
            if (label.formatter) {
                try {
                    // eslint-disable-next-line no-eval
                    label.formatter = eval(label.formatter).bind(this);
                } catch (e) {
                    label.formatter = null;
                }
            }
            if (label.rich) {
                try {
                    label.rich = JSON.parse(label.rich);
                } catch (e) {
                    label.rich = null;
                }
            }
        }
    }

    returnTooltip(){
        return this.mapTooltipBoxRef.current;
    }

    getOption() {
        const thisStyle = this.props.thisData.style;
        this.myChart.clear();
        if (this.state.data.xAxis == null || this.state.data.xAxis.length === 0) {
            return;
        }
        let names = this.state.data.xAxis;
        let maxList = this.state.data.max;
        let indicator = [];
        let radar = JSON.parse(JSON.stringify(thisStyle.radar));
        let series = JSON.parse(JSON.stringify(thisStyle.series[0]));
        let max = Util.getAllMaxNum(this.state.data);
        let min = 0;
        if(series.minType === 1 && series.minNum != null){
            min = series.minNum;
        }else if(series.minType === 2 && series.minSubNum != null){
            if(maxList){
                if (this.state.data.legends && this.state.data.legends.length > 0) {
                    min = getArrayAllPerMin(this.state.data.series,maxList);
                }else{
                    min = getArrayPerMin(this.state.data.series,maxList);
                }
            }else{
                if (this.state.data.legends && this.state.data.legends.length > 0) {
                    min = getArrayAllMin(this.state.data.series);
                }else{
                    min = getArrayMin(this.state.data.series);
                }
            }
            min -= series.minSubNum;
        }
        names.forEach((name, index) => {
            indicator.push({ name: name, min:maxList ? min*maxList[index]:min, max: maxList ? maxList[index]:max, index });
        });
        radar.center = [radar.centerX, radar.centerY];
        radar.radius = [radar.radiusIn, radar.radiusOut];
        radar.axisLine.symbolSize = [radar.axisLine.symbolSizeX, radar.axisLine.symbolSizeY];
        radar.axisLine.symbolOffset = [radar.axisLine.symbolOffsetStart, radar.axisLine.symbolOffsetEnd];
        radar.axisLine.lineStyle.color = this.getColor(radar.axisLine.lineStyle, 0, thisStyle.orientations);
        radar.indicator = indicator;
        series.label.position = [series.label.positionX, series.label.positionY];
        let legend = JSON.parse(JSON.stringify(thisStyle.legend));
        if (!legend.textStyle) {
            legend.textStyle = {
                color: "rgba(255,255,255,1)",
                fontSize: "1.2vh",
                lineHeight: "1.2vh"
            }
        }
        legend.itemGap = this.props.getCompatibleSize(legend.itemGap, 'num');
        legend.itemWidth = this.props.getCompatibleSize(legend.itemWidth, 'num');
        legend.itemHeight = this.props.getCompatibleSize(legend.itemHeight, 'num');
        legend.textStyle.fontSize = this.props.getCompatibleSize(legend.textStyle.fontSize, 'num');
        legend.textStyle.lineHeight = this.props.getCompatibleSize(legend.textStyle.lineHeight, 'num');
        let thisSeries = [];
        legend = {
            data: this.state.data.legends,
            ...legend
        }
        const { legends } = this.state.data;
        if(legend.defaultSelected && legends && legends.length > 0){
            try {
                const defaultSelected = JSON.parse(legend.defaultSelected);
                legend.selected = {};
                legends.forEach((item,index)=>{
                    legend.selected[item] = defaultSelected.indexOf(index+1) >= 0;
                });
            }catch (e) {}
        }
        if (this.state.data.legends && this.state.data.legends.length > 0) {
            this.state.data.legends.forEach((item, index) => {
                thisSeries.push({
                    ...series,
                    data: this.getSeriesData(this.state.data.series[index], series, thisStyle),
                    areaStyle: { color: this.getColor(series, index, thisStyle.orientations) },
                    lineStyle: { ...series.lineStyle, color: this.getColor(series.lineStyle, index, thisStyle.orientations) },
                    itemStyle: { ...series.itemStyle, color: this.getColor(series.itemStyle, index, thisStyle.orientations) },
                    name: item,
                    type: 'radar'
                });
            });
        } else {
            thisSeries.push({
                ...series,
                data: this.getSeriesData(this.state.data.series, series, thisStyle),
                areaStyle: { color: this.getColor(series, 0, thisStyle.orientations) },
                lineStyle: { ...series.lineStyle, color: this.getColor(series.lineStyle, 0, thisStyle.orientations) },
                name: this.state.data.title ? this.state.data.title : '',
                type: 'radar'
            });
        }
        this.formatterChange(radar.name);
        let tooltip = thisStyle.tooltip ? JSON.parse(JSON.stringify(thisStyle.tooltip)):{};
        if(tooltip.theme > 2){
            tooltip.padding = 0;
            tooltip.backgroundColor = 'rgba(0,0,0,0)';
            tooltip.borderColor = 'rgba(0,0,0,0)';
            tooltip.borderWidth = 0;
            tooltip.formatter = this.returnTooltip.bind(this);
        }else{
            this.formatterChange(tooltip);
        }
        if(tooltip.textStyle && tooltip.textStyle.fontSize){
            tooltip.textStyle.fontSize = this.props.getCompatibleSize(tooltip.textStyle.fontSize, 'num');
        }
        const option = {
            backgroundColor: thisStyle.backgroundColor,
            tooltip: {
                ...tooltip,
                show: thisStyle.tooltip ? thisStyle.tooltip.show : true
            },
            radar: radar,
            series: thisSeries,
            legend: legend
        };
        this.myChart.setOption(option);
        // return option
    }

    getColor(series, index, orientations) {
        if (series == null) {
            return null;
        }
        if (series.colorType === 1) {
            if (series.color && series.color[index]) {
                return series.color[index];
            } else {
                return null;
            }
        } else {
            if (series.linearColor && series.linearColor[index]) {
                if (orientations === 1) {
                    return {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: series.linearColor[index].start // 0% 处的颜色
                        }, {
                            offset: 1, color: series.linearColor[index].end // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    };
                } else {
                    return {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 0, color: series.linearColor[index].start // 0% 处的颜色
                        }, {
                            offset: 1, color: series.linearColor[index].end // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    };
                }
            } else {
                return null;
            }
        }
    }


    onChartClick(e) {
        const { interact } = this.props.thisData.dataSources;
        const selectItem = {name:e.name,num:e.value,id:this.state.data.ids?this.state.data.ids[e.seriesIndex]:null,legend:e.seriesName};
        this.interactData(interact, selectItem);
    }

    getTooltipContent(){
        const {style} = this.props.thisData;
        if(style.tooltip && this.state.data && this.state.data.xAxis && this.state.data.series){
            if(style.tooltip.theme === 3){
                let fontSize;
                if(style.tooltip.textStyle && style.tooltip.textStyle.fontSize){
                    fontSize = this.props.getCompatibleSize(style.tooltip.textStyle.fontSize);
                }
                return (
                    <div className={cssStyle.tooltipBoxOne} style={{fontSize}}>
                        {this.state.data.series.map((item,index)=>{
                            return (
                                <div key={index} className={cssStyle.row}>
                                    <div>{this.state.data.xAxis[index]}</div>
                                    <div className={cssStyle.num}>{item}</div>
                                </div>
                            );
                        })}
                    </div>
                );
            }
        }
        return null;
    }

    render() {
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>{
                        // return <ReactECharts
                        //     key={this.getDataTime}
                        //     style={{ width: '100%', height: '100%', position: 'absolute', opacity }}
                        //     echarts={echarts}
                        //     option={this.getOption()}
                        //     theme={"theme_name"}
                        //     onEvents={this.onclick} />
                        return <div style={{ width: '100%', height: '100%', position: 'absolute',opacity }} id={'echarts_radar_'+this.props.thisData.id} />;
                    }}
                </Motion>
                <div className={cssStyle.tooltipBox}>
                    <div ref={this.mapTooltipBoxRef}>
                        {this.getTooltipContent()}
                    </div>
                </div>
            </ComponentBox>
        );
    }
}