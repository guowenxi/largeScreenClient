import React from "react";
import 'echarts-for-react';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pictorialBar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import ComponentBox from "../component_box";
import {getData} from "../../common/getDataUtil";
import {changeComponentShow, interactData} from "../../common/util";
import {Motion, spring} from "react-motion";

export default class EchartsLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {},opacity:0 };
        this.keyParams = {};
        this.onclick = {
            'click': this.onChartClick.bind(this)
        };
        this.getData = getData.bind(this);
        this.getDataTime = 0;
        this.changeComponentShow = changeComponentShow.bind(this);
        this.interactData = interactData.bind(this);
        this.windowResize = this.windowResize.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            setTimeout(()=>{
                this.initEcharts(resolve);
            });
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
        window.addEventListener('resize',this.windowResize);
    }

    //props变更时触发函数
    componentDidUpdate(){
        if(this.myChart && this.props.editType && this.props.isSelected){
            this.getOption();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.refreshTimer){
            clearTimeout(this.refreshTimer);
        }
        if(this.autoMovetimer){
            clearTimeout(this.autoMovetimer);
        }
        if(this.resizeTimer){
            clearTimeout(this.resizeTimer);
        }
        window.removeEventListener('resize',this.windowResize);
    }

    windowResize(){
        if(this.resizeTimer){
            clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout(()=>{
            // console.log('pieResize');
            this.initEcharts();
        },200);
    }

    initEcharts(resolve){
        if(this.myChart){
            this.myChart.dispose();
        }
        const chartDom = document.getElementById('echarts_line_'+this.props.thisData.id);
        this.myChart = echarts.init(chartDom);
        this.myChart.on('click',  (params) => {
            this.onChartClick(params);
        });
        if(resolve){
            if(this.props.thisData.firstLoad){
                this.getData(this.callBack.bind(this, resolve));
            }else{
                this.callBack(resolve);
            }
        }else{
            this.getOption();
        }
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
                if(data.reGetData !== 2){
                    this.reGetData();
                }
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
            case "changeFreshMode":
                //切换数据定时刷新模式
                if(data.data){
                    this.freshMode = data.data;
                }
                break;
            default:
                break;
        }
    }

    //获取数据后回调
    callBack(resolve, result, getDataType) {
        if (resolve) {
            resolve(result);
        }
        if (result) {
            this.getDataTime = (new Date()).getTime();
            this.setState({ data: result });
            setTimeout(()=>{
                this.getOption(getDataType);
                this.autoMove();
            });
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    autoMove(){
        const { style } = this.props.thisData;
        if(style.autoMove){
            if(this.autoMovetimer){
                clearTimeout(this.autoMovetimer);
            }
            this.autoMovetimer = setTimeout(()=>{
                if(this.myChart && this.state.data.xAxis){
                    const {dataZoom} = this.myChart.getOption();
                    if(dataZoom[0].endValue + 1 < this.state.data.xAxis.length){
                        dataZoom[0].startValue += 1;
                        dataZoom[0].endValue += 1;
                    }else{
                        dataZoom[0].endValue = dataZoom[0].endValue - dataZoom[0].startValue;
                        dataZoom[0].startValue = 0;
                    }
                    delete dataZoom[0].start;
                    delete dataZoom[0].end;
                    this.myChart.setOption({dataZoom});
                    this.autoMove();
                }
            },style.autoMoveTime || 3000);
        }
    }

    stopAutoMove(){
        if(this.autoMovetimer){
            clearTimeout(this.autoMovetimer);
        }
    }

    //内容格式器代码转化
    formatterChange(label) {
        if (label) {
            if (label.formatter && label.formatter !== '{}') {
                try {
                    // eslint-disable-next-line no-eval
                    label.formatter = eval(label.formatter).bind(this);
                } catch (e) {}
            }else{
                label.formatter = null;
            }
            if (label.rich) {
                try {
                    label.rich = JSON.parse(label.rich);
                } catch (e) {
                    label.rich = null;
                }
            }else{
                label.rich = null;
            }
        }
    }

    formatterChangeAxis(axis) {
        axis.forEach((item) => {
            this.formatterChange(item.axisLabel);
        });
    }


    formatterLegend(label) {
        if (label) {
            if (label.formatter) {
                try {
                    // eslint-disable-next-line no-eval
                    label.formatter = eval(label.formatter).bind(this);
                } catch (e) {
                    label.formatter = null;
                }
            }
            if (label.textStyle.rich) {
                try {
                    label.textStyle.rich = JSON.parse(label.textStyle.rich);
                } catch (e) {
                    label.textStyle.rich = null;
                }
            }
        }
    }

    getBarSeriesData(data, series, thisStyle) {
        if (series.seriesColorType === 2) {
            let result = [];
            data.forEach((item, index) => {
                result.push({
                    value: item,
                    itemStyle: {
                        color: this.getColor(series, index, thisStyle.orientations)
                    }
                });
            });
            return result;
        } else if (series.seriesColorType === 3 && series.barColorList && series.barColorList.length > 0) {
            let result = [];
            data.forEach((item) => {
                let notFind = true;
                for(let i = 0;i < series.barColorList.length;i++){
                    if(item >= series.barColorList[i].more && item < series.barColorList[i].less){
                        result.push({
                            value:item,
                            itemStyle:{
                                color:this.getColor(series.barColorList[i])
                            }
                        });
                        notFind = false;
                        break;
                    }
                }
                if(notFind){
                    result.push({
                        value:item
                    });
                }
            });
            return result;
        } else {
            return data;
        }
    }

    getLineData(seriesData,series){
        if(series.type === 'line'){
            if(series.symbolColorType === 3){
                if(series.symbolColorList && series.symbolColorList.length > 0){
                    let returnData = [];
                    seriesData.forEach((item)=>{
                        let notFind = true;
                        for(let i = 0;i < series.symbolColorList.length;i++){
                            if(item >= series.symbolColorList[i].more && item < series.symbolColorList[i].less){
                                returnData.push({
                                    value:item,
                                    itemStyle:{
                                        color:series.symbolColorList[i].color
                                    }
                                });
                                notFind = false;
                                break;
                            }
                        }
                        if(notFind){
                            returnData.push({
                                value:item
                            });
                        }
                    });
                    return returnData;
                }
            }else if(series.symbolColorType === 2){

            }
        }
        return seriesData;
    }

    getLineColor(data,lineStyle,index){
        if(lineStyle.colorType === 2 && lineStyle.colorList && lineStyle.colorList.length > 0 && data){
            for(let i = 0;i < lineStyle.colorList.length;i ++){
                if(data[0] >= lineStyle.colorList[i].more && data[0] < lineStyle.colorList[i].less){
                    return lineStyle.colorList[i].color;
                }
            }
        }
        return this.getColor(lineStyle, index);
    }

    getEffectData(data){
        if(data && data.length > 0){
            return data.map((item,index)=>{
                return [index,item];
            });
        }else{
            return [];
        }
    }

    getEffectStyle(data){
        return {
            coordinateSystem:'cartesian2d',
            xAxisIndex:0,
            yAxisIndex:0,
            type: 'lines',
            zlevel: 1,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.8,
                color: 'rgb(255,255,255)',
                symbolSize: 5,
                constantSpeed:125
            },
            polyline:true,
            lineStyle: {
                normal: {
                    color: 'rgba(255,255,255,0)',
                    width: 0,
                }
            },
            data: [{"coords":this.getEffectData(data)}]
        };
    }

    getSeriesData(series, thisStyle, isSingle, seriesIndex) {
        const { legends } = this.state.data;
        const seriesData = this.state.data.series;
        series.label.distance = this.props.getCompatibleSize(series.label.distance, 'num');
        series.label.fontSize = this.props.getCompatibleSize(series.label.fontSize, 'num');
        if(series.label.show){
            series.label.opacity = 1;
        }
        //数组处理
        series.label.offset = this.changeArray(series.label.offset);
        // 文本标签位置处理
        if (series.label.positionType === 'other') {
            series.label.position = this.changeArray(series.label.position);
        } else {
            series.label.position = series.label.positionType;
        }
        this.formatterChange(series.label);
        //图片尺寸处理
        if(series.symbolSize){
            try{
                series.symbolSize = JSON.parse(series.symbolSize);
            }catch (e) {

            }
        }
        let thisSeries = [];
        if (series.type === 'line') {
            series.symbolSize = this.props.getCompatibleSize(series.symbolSize, 'num');
            //线数据
            //线图
            if (isSingle) {
                if (legends && legends.length > 0 && typeof(seriesData[0]) === 'object') {
                    legends.forEach((item, index) => {
                        thisSeries.push({
                            ...series,
                            data: this.getLineData(this.state.data.series[index],series),
                            lineStyle: { opacity: series.lineStyle.opacity, color: this.getLineColor(this.state.data.series[index],series.lineStyle, index) },
                            areaStyle: { opacity: series.areaStyle.opacity, color: this.getColor(series.areaStyle, index), origin: series.areaStyle.origin },
                            itemStyle: { opacity: series.itemStyle.opacity, color: this.getColor(series.itemStyle, index) },
                            name: item,
                            smooth:series.showEffect?0:series.smooth
                        });
                        //尾迹特效
                        if(series.showEffect && this.state.data.xAxis.length > 1){
                            thisSeries.push(this.getEffectStyle(this.state.data.series[index]));
                        }
                    });
                } else {
                    thisSeries.push({
                        ...series,
                        data: this.getLineData(this.state.data.series,series),
                        lineStyle: { opacity: series.lineStyle.opacity, color: this.getLineColor(this.state.data.series, series.lineStyle, 0) },
                        areaStyle: { opacity: series.areaStyle.opacity, color: this.getColor(series.areaStyle, 0), origin: series.areaStyle.origin },
                        itemStyle: { opacity: series.itemStyle.opacity, color: this.getColor(series.itemStyle, 0) },
                        smooth:series.showEffect?0:series.smooth
                    });
                    //尾迹特效
                    if(series.showEffect && this.state.data.xAxis && this.state.data.xAxis.length > 1){
                        thisSeries.push(this.getEffectStyle(this.state.data.series));
                    }
                }
            } else {
                thisSeries.push({
                    ...series,
                    data: this.getLineData(this.state.data.series[seriesIndex],series),
                    lineStyle: { opacity: series.lineStyle.opacity, color: this.getLineColor(this.state.data.series[seriesIndex], series.lineStyle, 0) },
                    areaStyle: { opacity: series.areaStyle.opacity, color: this.getColor(series.areaStyle, 0), origin: series.areaStyle.origin },
                    itemStyle: { opacity: series.itemStyle.opacity, color: this.getColor(series.itemStyle, 0) },
                    name: legends && legends[seriesIndex],
                    smooth:series.showEffect?0:series.smooth
                });
                //尾迹特效
                if(series.showEffect && this.state.data.xAxis.length > 1){
                    thisSeries.push(this.getEffectStyle(this.state.data.series[seriesIndex]));
                }
            }
        } else {
            series.itemStyle.opacity = 1;
            //数组处理
            series.itemStyle.barBorderRadius = this.changeArray(series.itemStyle.barBorderRadius);
            if (series.type === 'pictorialBar') {
                !series.symbolSize && delete series.symbolSize;
                !series.symbolRepeat && delete series.symbolRepeat;
                // if(!series.symbolSize){
                //     delete series.symbolSize;
                // }
            }
            if (isSingle) {
                if (legends && legends.length > 0 && typeof(seriesData[0]) === 'object') {
                    legends.forEach((item, index) => {
                        let stack;
                        let barBorderRadius;
                        if (series.stack) {
                            stack = 'bar';
                            barBorderRadius = index === legends.length - 1 ? series.itemStyle.barBorderRadius : 0;
                        } else {
                            stack = 'bar' + index;
                            barBorderRadius = series.itemStyle.barBorderRadius;
                        }

                        thisSeries.push({ ...series, data: this.getBarSeriesData(this.state.data.series[index], series, thisStyle), itemStyle: { ...series.itemStyle, color: this.getColor(series, index, thisStyle.orientations), barBorderRadius }, stack: stack, name: item });
                    });
                } else {
                    thisSeries.push({ ...series, data: this.getBarSeriesData(this.state.data.series, series, thisStyle), itemStyle: { ...series.itemStyle, color: this.getColor(series, 0, thisStyle.orientations) } });
                }
            } else {
                thisSeries.push({ ...series,stack:'bar'+(series.stack?'':seriesIndex), name: legends && legends[seriesIndex], data: this.getBarSeriesData(this.state.data.series[seriesIndex], series, thisStyle), itemStyle: { ...series.itemStyle, color: this.getColor(series, 0, thisStyle.orientations) } });
            }
        }
        return thisSeries;
    }

    getZoomData(axis,axisName,thisStyle){
        if(axis.dataZoomStyle == null){
            axis.dataZoomStyle = {};
        }
        const endValue = axis.endValue > 1 ? axis.endValue - 1 : 1;
        const returnData = {
            type: 'slider',
            show:true,
            startValue: axisName === 'xAxisIndex' ? 0 : this.state.data.xAxis.length - endValue - 1,
            endValue:axisName === 'xAxisIndex' ? endValue : this.state.data.xAxis.length - 1,
            width:axis.rollWidth,
            height:axis.rollHeight?axis.rollHeight:'10',
            left:axis.rollLeft,
            right:axis.rollRight,
            top:axis.rollUp,
            bottom:axis.rollBottom?axis.rollBottom:'0',
            borderColor:axis.rollBorderColor?axis.rollBorderColor:'rgba(255,255,255,0)',
            fillerColor:axis.rollFillerColor?axis.rollFillerColor:'rgb(6,67,107)',
            backgroundColor:axis.rollBackgroundColor,
            showDataShadow:!!axis.showDataShadow,
            showDetail:axis.showDetail,
            realtime:true,
            filterMode:'filter',
            zoomLock:true,
            brushSelect:false,
            dataBackground:{
                lineStyle:{
                    color:this.getColor(axis.dataZoomStyle.lineStyle, 0, thisStyle.orientations),
                    width:axis.rollWidth,
                    type:axis.rollLineStyle,
                    opacity:axis.rollOpacity
                },
                areaStyle:{
                    color:this.getColor(axis.dataZoomStyle.areaStyle, 0, thisStyle.orientations),
                    opacity:axis.rollFillerOpacity
                }
            },
            handleSize:axis.handleSize?axis.handleSize:'0%',
            handleStyle:{
                color:this.getColor(axis.dataZoomStyle.handleStyle, 0, thisStyle.orientations),
                borderColor:axis.handleBorderColor,
                borderWidth:axis.handleBorderWidth,
                borderType:axis.handleBorderType
            },
            textStyle:{
                color:axis.rollTextColor,
                fontSize:axis.rollFontSize,
                textBorderColor:axis.rollTextBorderColor,
                textBorderWidth:axis.rollTextBorderWidth
            }
        };
        returnData[axisName] = [0,1];
        return returnData;
    }

    setAxisMin(axis){
        if(axis.minType === 1){
            axis.min = axis.minNum;
        }else if(axis.minType === 2){
            axis.min = function (value) {
                return parseInt(value.min - axis.minSubNum);
            }
        }
    }

    getOption(getDataType) {
        const thisStyle = this.props.thisData.style;
        if (this.state.data.xAxis == null || this.state.data.xAxis.length === 0) {
            this.myChart.clear();
            this.myChart.setOption({});
            return;
        }
        let dataZoom = [];
        let grid = JSON.parse(JSON.stringify(thisStyle.grid[0]));
        let legend = JSON.parse(JSON.stringify(thisStyle.legend));
        let xAxis = JSON.parse(JSON.stringify(thisStyle.xAxis));
        let yAxis = JSON.parse(JSON.stringify(thisStyle.yAxis));
        let series = JSON.parse(JSON.stringify(thisStyle.series));
        //vh兼容处理
        xAxis.forEach((item) => {
            item.axisLabel.fontSize = this.props.getCompatibleSize(item.axisLabel.fontSize, 'num');
            item.axisLabel.lineHeight = this.props.getCompatibleSize(item.axisLabel.lineHeight, 'num');
            item.triggerEvent = true;
            this.setAxisMin(item);
        });
        yAxis.forEach((item) => {
            item.axisLabel.fontSize = this.props.getCompatibleSize(item.axisLabel.fontSize, 'num');
            item.axisLabel.lineHeight = this.props.getCompatibleSize(item.axisLabel.lineHeight, 'num');
            this.setAxisMin(item);
        });
        // xAxis[0].axisLabel.fontSize = this.props.getCompatibleSize(xAxis[0].axisLabel.fontSize, 'num');
        // yAxis[0].axisLabel.fontSize = this.props.getCompatibleSize(yAxis[0].axisLabel.fontSize, 'num');
        legend.itemGap = this.props.getCompatibleSize(legend.itemGap, 'num');
        legend.itemWidth = this.props.getCompatibleSize(legend.itemWidth, 'num');
        legend.itemHeight = this.props.getCompatibleSize(legend.itemHeight, 'num');
        legend.textStyle.fontSize = this.props.getCompatibleSize(legend.textStyle.fontSize, 'num');
        legend.textStyle.lineHeight = this.props.getCompatibleSize(legend.textStyle.lineHeight, 'num');
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
        //柱图朝向
        if (thisStyle.orientations === 1) {
            xAxis.forEach((item) => {
                item.data = this.state.data.xAxis;
                item.type = 'category';
            });
            yAxis.forEach((item) => {
                item.type = 'value';
                if(typeof(item.boundaryGap) === "boolean"){
                    delete item.boundaryGap;
                }
            });
            // yAxis[0].min = 0;
            //缩放工具条处理
            if(xAxis[0].dataZoom){
                dataZoom.push(this.getZoomData(xAxis[0],'xAxisIndex',thisStyle));
            }
        } else {
            yAxis.forEach((item) => {
                item.data = this.state.data.xAxis;
                item.type = 'category';
            });
            xAxis.forEach((item) => {
                item.type = 'value';
                if(typeof(item.boundaryGap) === "boolean"){
                    delete item.boundaryGap;
                }
            });
            // xAxis[0].min = 0;
            //缩放工具条处理
            if(yAxis[0].dataZoom){
                dataZoom.push(this.getZoomData(yAxis[0],'yAxisIndex',thisStyle));
            }
        }
        //内容格式器代码转化
        this.formatterChangeAxis(xAxis);
        this.formatterChangeAxis(yAxis);
        //图表数据
        let thisSeries = [];
        const isSingle = series.length <= 1;
        series.forEach((seriesItem, index) => {
            thisSeries = thisSeries.concat(this.getSeriesData(series[index], thisStyle, isSingle, index));
        });
        this.formatterLegend(legend);
        // const thisSeries = this.getSeriesData(series,thisStyle);
        let tooltip = thisStyle.tooltip ? JSON.parse(JSON.stringify(thisStyle.tooltip)):{};
        this.formatterChange(tooltip);
        if(tooltip.textStyle && tooltip.textStyle.fontSize){
            tooltip.textStyle.fontSize = this.props.getCompatibleSize(tooltip.textStyle.fontSize, 'num');
        }
        const option = {
            title: {},
            legend: legend,
            grid: grid,
            tooltip: {   //展示数据
                ...tooltip,
                show: thisStyle.tooltip ? thisStyle.tooltip.show : true,
                trigger: 'axis'
            },
            xAxis: xAxis,
            yAxis: yAxis,
            series: thisSeries,
            dataZoom
        };
        if(getDataType !== 'freshData' || !thisStyle.freshNotClear){
            this.myChart.clear();
        }
        this.myChart.setOption(option);
    }

    getColor(style, index) {
        if (style.colorType !== 2) {
            if (style.color) {
                return index != null ? style.color[index] : style.color;
            }
        } else {
            const linearColor = index != null ? (style.linearColor ? style.linearColor[index]:{}) : style;
            if(linearColor){
                return {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: linearColor.start?linearColor.start:'#000' // 0% 处的颜色
                    }, {
                        offset: 1, color: linearColor.end?linearColor.end:'#000' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                };
            }
        }
        return null;
    }

    //字符串转数组
    changeArray(data) {
        let returnData;
        if (data && data.indexOf('[') >= 0) {
            try {
                returnData = JSON.parse(data);
            } catch (e) {

            }
        } else {
            returnData = parseFloat(data);
        }
        return returnData;
    }

    //折线图点击响应
    onChartClick(e) {
        const { interact } = this.props.thisData.dataSources;
        let selectItem = {};
        if(e.componentType === 'xAxis'){
            selectItem.name = e.value;
            const {xAxis} = this.state.data;
            let clickIndex = -1;
            if(xAxis){
                clickIndex = xAxis.indexOf(e.value);
            }
            if(clickIndex >= 0){
                selectItem.id = this.state.data.ids?this.state.data.ids[clickIndex]:null;
            }
        }else{
            selectItem = {
                name:e.name,
                num:e.value,
                id:this.state.data.ids?this.state.data.ids[e.dataIndex]:null,
                legend:e.seriesName,
                legendId:this.state.data.legendsIds ? this.state.data.legendsIds[e.seriesIndex-1]:null
            };
        }
        this.interactData(interact, selectItem);
    }

    render() {
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) => {
                        // return <ReactECharts
                        //     key={this.getDataTime}
                        //     ref={(e) => { this.echartRef = e; }}
                        //     style={{ width: '100%', height: '100%', position: 'absolute', opacity }}
                        //     echarts={echarts}
                        //     option={this.getOption()}
                        //     theme={"theme_name"}
                        //     onEvents={this.onclick}
                        // />
                        return (
                            <div
                                style={{ width: '100%', height: '100%', position: 'absolute',opacity }}
                                id={'echarts_line_'+this.props.thisData.id}
                                onMouseOver={this.stopAutoMove.bind(this)}
                                onMouseLeave={this.autoMove.bind(this)}
                            />
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}