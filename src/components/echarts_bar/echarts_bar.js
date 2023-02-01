import React from "react";
import 'echarts-for-react';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pictorialBar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import Util, { interactData } from "../../common/util";
import ComponentBox from "../component_box";
import { getData } from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import cssStyle from "./echarts_bar.module.css";

export default class EchartsBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {}, show: true, getDataTime: 0, opacity: 0 };
        this.keyParams = {};
        this.onclick = {
            'click': this.onChartClick.bind(this)
        };
        this.getData = getData.bind(this);
        this.getDataTime = 0;
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

    //组件删除时触发函数
    componentWillUnmount() {
        window.removeEventListener('resize',this.windowResize);
        if(this.refreshTimer){
            clearTimeout(this.refreshTimer);
        }
        if(this.autoMovetimer){
            clearTimeout(this.autoMovetimer);
        }
        if(this.resizeTimer){
            clearTimeout(this.resizeTimer);
        }
    }

    //props变更时触发函数
    componentDidUpdate(){
        if(this.myChart && this.props.editType && this.props.isSelected){
            this.getOption();
        }
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
        const chartDom = document.getElementById('echarts_bar_'+this.props.thisData.id);
        this.myChart = echarts.init(chartDom);
        this.myChart.on('click',  (params) => {
            this.onChartClick(params);
        });
        if(resolve){
            if(this.props.thisData.firstLoad){
                this.getData(this.callBack.bind(this, resolve))
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
                if(data.reGetData !== 2){
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
    callBack(resolve, result, getDataType) {
        if (resolve) {
            resolve();
        }
        if (result) {
            this.setState({ data: result,getDataTime:(new Date()).getTime() });
            setTimeout(()=>{
                this.getOption(getDataType);
                this.autoMove();
            });
        }
    }

    stopAutoMove(){
        if(this.autoMovetimer){
            clearTimeout(this.autoMovetimer);
        }
    }

    autoMove(){
        const { style } = this.props.thisData;
        if(style.autoMove){
            if(this.autoMovetimer){
                clearTimeout(this.autoMovetimer);
            }
            this.autoMovetimer = setTimeout(()=>{
                if(this.myChart && this.state.data.xAxis && this.state.data.xAxis.length){
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

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    labelFormatter(data) {
        return data;
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
            if (label.rich && label.rich !== '{}') {
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

    getCalculateColor(series, item, orientations){
        let thisColor;
        if(series.calculateType === 1){
            for(let i = 0;i < series.barColorList.length;i ++){
                if(series.barColorList[i].num+'' === item+''){
                    thisColor = series.barColorList[i];
                    break;
                }
            }
        }else{
            for(let i = 0;i < series.barColorList.length;i ++){
                if(series.barColorList[i].bottom <= item && series.barColorList[i].top > item){
                    thisColor = series.barColorList[i];
                    break;
                }
            }
        }
        if(thisColor){
            if(series.colorType === 1){
                return thisColor.color;
            }else{
                if (orientations === 1) {
                    return {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: thisColor.start // 0% 处的颜色
                        }, {
                            offset: 1, color: thisColor.end // 100% 处的颜色
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
                            offset: 0, color: thisColor.start // 0% 处的颜色
                        }, {
                            offset: 1, color: thisColor.end // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    };
                }
            }
        }
        return null;
    }

    getSeriesData(data, series, thisStyle, max,multiple,dataType) {
        if (series.seriesColorType === 2) {
            let result = [];
            data.forEach((item, index) => {
                let newData = item;
                if (('' + item).indexOf('%') > 0) {
                    newData = parseInt(item) > 100 ? max : parseInt(item) * max / 100;
                }
                result.push({
                    value: dataType === 'time' ? new Date(newData) : newData,
                    itemStyle: {
                        color: this.getColor(series, index, thisStyle.orientations),
                        opacity: this.getOpacity(series,index,data.length)
                    }
                });
            });
            return result;
        }if (series.seriesColorType === 3){
            return data.map((item,index)=>{
                return {
                    value:dataType === 'time' ? new Date(item) : item,
                    itemStyle: {
                        color: this.getCalculateColor(series, item, thisStyle.orientations),
                        opacity: this.getOpacity(series,index,data.length)
                    }
                };
            });
        } else {
            return data.map((item,index)=>{
                return {
                    value:dataType === 'time' ? new Date(item) : item,
                    itemStyle: {
                        opacity: this.getOpacity(series,index,data.length)
                    }
                };
            });
        }
    }

    getOpacity(series,index,dataLength){
        let opacity = 1;
        if(series.opacityType !== 2){
            opacity = series.opacity != null ? series.opacity : 1;
        }else{
            if(series.opacityList && series.opacitySubType){
                if(series.opacitySubType === 1){
                    for(let i = 0;i < series.opacityList.length;i ++){
                        if(series.opacityList[i].value === index+1){
                            opacity = series.opacityList[i].opacity;
                            break;
                        }
                    }
                }else if(series.opacitySubType === 2){
                    for(let i = 0;i < series.opacityList.length;i ++){
                        if(series.opacityList[i].more <= index+1 && series.opacityList[i].less > index+1){
                            opacity = series.opacityList[i].opacity;
                            break;
                        }
                    }
                }else{
                    opacity = index === dataLength - 1 ? (series.LastOpacity != null ? series.LastOpacity : 1) : (series.otherOpacity != null ? series.otherOpacity : 1);
                }
            }
        }
        return opacity;
    }

    getAxisMax(axis,multiple,max){
        if(axis.maxType === 2){
            axis.max = Util.getSum(this.state.data.series)*multiple;
            return axis.max;
        }else if(axis.maxType === 3){
            axis.max = max;
            return axis.max;
        }else if(axis.maxType === 4){
            axis.max = axis.max*multiple;
            return axis.max;
        }else{
            return 0;
        }
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
            width:axis.rollWidth?axis.rollWidth:(axisName === 'xAxisIndex' ? null:'10'),
            height:axis.rollHeight?axis.rollHeight:(axisName === 'xAxisIndex' ? '10':null),
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

    getOption(getDataType) {
        const thisStyle = this.props.thisData.style;
        if (this.state.data.xAxis == null || this.state.data.xAxis.length === 0) {
            // return {};
            // this.myChart.setOption({series:[],xAxis:{}});
            this.myChart.clear();
            this.myChart.setOption({
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    show:false,
                    type: 'value'
                },
                series: [{
                    data: [],
                    type: 'bar',
                }]
            });
            return;
        }
        let dataZoom = [];
        let grid = JSON.parse(JSON.stringify(thisStyle.grid[0]));
        let legend = JSON.parse(JSON.stringify(thisStyle.legend));
        let xAxis = JSON.parse(JSON.stringify(thisStyle.xAxis));
        let yAxis = JSON.parse(JSON.stringify(thisStyle.yAxis));
        let series = JSON.parse(JSON.stringify(thisStyle.series[0]));
        let seriesBackground = JSON.parse(JSON.stringify(thisStyle.seriesBackground[0]));
        let tooltip = thisStyle.tooltip ? JSON.parse(JSON.stringify(thisStyle.tooltip)):{};
        //vh兼容处理
        xAxis[0].axisLabel.fontSize = this.props.getCompatibleSize(xAxis[0].axisLabel.fontSize, 'num');
        xAxis[0].axisLabel.lineHeight = this.props.getCompatibleSize(xAxis[0].axisLabel.lineHeight, 'num');
        if(typeof(xAxis[0].boundaryGap) === "boolean"){
            delete xAxis[0].boundaryGap;
        }
        yAxis[0].axisLabel.fontSize = this.props.getCompatibleSize(yAxis[0].axisLabel.fontSize, 'num');
        yAxis[0].axisLabel.lineHeight = this.props.getCompatibleSize(yAxis[0].axisLabel.lineHeight, 'num');
        if(typeof(yAxis[0].boundaryGap) === "boolean"){
            delete yAxis[0].boundaryGap;
        }
        legend.itemGap = this.props.getCompatibleSize(legend.itemGap, 'num');
        legend.itemWidth = this.props.getCompatibleSize(legend.itemWidth, 'num');
        legend.itemHeight = this.props.getCompatibleSize(legend.itemHeight, 'num');
        legend.textStyle.fontSize = this.props.getCompatibleSize(legend.textStyle.fontSize, 'num');
        legend.textStyle.lineHeight = this.props.getCompatibleSize(legend.textStyle.lineHeight, 'num');
        series.label.distance = this.props.getCompatibleSize(series.label.distance, 'num');
        series.label.fontSize = this.props.getCompatibleSize(series.label.fontSize, 'num');
        //数组处理
        series.itemStyle.barBorderRadius = this.changeArray(series.itemStyle.barBorderRadius);
        series.label.offset = this.changeArray(series.label.offset);
        seriesBackground.itemStyle.barBorderRadius = this.changeArray(seriesBackground.itemStyle.barBorderRadius);
        //图片尺寸处理
        if(series.symbolSize){
            try{
                series.symbolSize = JSON.parse(series.symbolSize);
            }catch (e) {

            }
        }
        // //更新动画时间设置
        // if(fresh){
        //     series.animationDurationUpdate = 0;
        // }else{
        //     series.animationDurationUpdate = 300;
        // }
        // 文本标签位置处理
        if (series.label.positionType === 'other') {
            series.label.position = this.changeArray(series.label.position);
        } else {
            series.label.position = series.label.positionType;
        }
        this.formatterChange(series.label);
        //轴最大值是否有特殊设定
        let multiple=1.2;
        if(thisStyle.multiple){
            if(thisStyle.multiple<1){
                multiple=1
            }else{
                multiple=thisStyle.multiple
            }
        }
        let axisMax = false;
        let dataType = 'value';
        //数据最大值
        let max;
        if(axisMax){
            max = axisMax;
        }else{
            if (thisStyle.stack) {
                //堆叠时获取堆叠的最大值
                max = Util.getStackMaxNum(this.state.data);
            } else {
                max = Util.getAllMaxNum(this.state.data);
            }
        }
        //柱图朝向
        if (thisStyle.orientations === 1) {
            xAxis[0].data = this.state.data.xAxis;
            xAxis[0].type = 'category';
            xAxis[0].triggerEvent = true;
            // xAxis[0].triggerEvent = true;
            if(yAxis[0].type === 'category'){
                yAxis[0].data = this.state.data.yAxis;
            }else if(yAxis[0].type === 'time'){
                dataType = 'time';
                yAxis[0].data = this.state.data.yAxis.map((item)=>{
                    return new Date(item);
                });
            }else{
                yAxis[0].type = 'value';
            }
            xAxis.push({ type: 'category', show: false, data: this.state.data.xAxis });
            //轴最大值处理
            axisMax = this.getAxisMax(yAxis[0],multiple,max);
            //缩放工具条处理
            if(xAxis[0].dataZoom){
                dataZoom.push(this.getZoomData(xAxis[0],'xAxisIndex',thisStyle));
            }
        } else {
            yAxis[0].type = 'category';
            yAxis[0].triggerEvent = true;
            yAxis[0].data = this.state.data.xAxis;
            if(xAxis[0].type === 'category'){
                xAxis[0].data = this.state.data.yAxis;
            }else if(xAxis[0].type === 'time'){
                dataType = 'time';
                xAxis[0].data = this.state.data.yAxis.map((item)=>{
                    return new Date(item);
                });
            }else{
                xAxis[0].type = 'value';
            }
            // yAxis[0].triggerEvent = true;
            yAxis.push({ type: 'category', show: false, data: this.state.data.xAxis });
            //轴最大值处理
            if(xAxis[0].type !== 'time'){
                axisMax = this.getAxisMax(xAxis[0],multiple,max);
            }
            if(yAxis[0].dataZoom){
                dataZoom.push(this.getZoomData(yAxis[0],'yAxisIndex',thisStyle));
            }
        }
        //内容格式器代码转化
        this.formatterChangeAxis(xAxis);
        this.formatterChangeAxis(yAxis);
        //柱数据
        let thisSeries = [];
        //柱背景
        if (seriesBackground.show && dataType !== 'time') {
            if (seriesBackground.label && seriesBackground.label.show) {
                seriesBackground.label.offset = this.changeArray(seriesBackground.label.offset);
                seriesBackground.label.distance = this.props.getCompatibleSize(seriesBackground.label.distance, 'num');
                seriesBackground.label.fontSize = this.props.getCompatibleSize(seriesBackground.label.fontSize, 'num');
                // 文本标签位置处理
                if (seriesBackground.label.positionType === 'other') {
                    seriesBackground.label.position = this.changeArray(seriesBackground.label.position);
                } else {
                    seriesBackground.label.position = seriesBackground.label.positionType;
                }
                if (seriesBackground.label.formatter) {
                    try {
                        // eslint-disable-next-line no-eval
                        seriesBackground.label.formatter = eval(seriesBackground.label.formatter).bind(this);
                    } catch (e) { }
                }
                // seriesBackground.label.formatter = (params) => {
                //     return this.labelFormatter(this.state.data.series[params.dataIndex]);
                // };
                // if (this.labelFormatter) {
                //     seriesBackground.label.formatter = this.labelFormatter.bind(this);
                // }
                // this.formatterChange(seriesBackground.label);
            }
            if (thisStyle.orientations === 1) {
                thisSeries.push({
                    ...seriesBackground,
                    data: this.state.data.xAxis.map(() => {
                        return max
                    }),
                    xAxisIndex: 1,
                    yAxisIndex: 0
                });
            } else {
                thisSeries.push({ ...seriesBackground, data: this.state.data.xAxis.map(() => { return max }), xAxisIndex: 0, yAxisIndex: 1 });
            }
        }
        //柱图
        if (this.state.data.legends && Array.isArray(this.state.data.legends) && this.state.data.legends.length > 0 && this.state.data.series && Array.isArray(this.state.data.series[0])) {
            this.state.data.legends.forEach((item, index) => {
                let stack;
                let barBorderRadius;
                if (thisStyle.stack) {
                    stack = 'bar';
                    barBorderRadius = index === this.state.data.legends.length - 1 ? series.itemStyle.barBorderRadius : 0;
                } else {
                    stack = 'bar' + index;
                    barBorderRadius = series.itemStyle.barBorderRadius;
                }
                thisSeries.push({
                    ...series,
                    data: this.getSeriesData(this.state.data.series[index], series, thisStyle, max,multiple,dataType),
                    itemStyle: { ...series.itemStyle, color: this.getColor(series, index, thisStyle.orientations), barBorderRadius },
                    stack: stack, name: item,
                    barWidth: dataType === 'time' && index > 0 ? (parseFloat(series.barWidth)+10)+'%':series.barWidth
                });
            });
        } else {
            thisSeries.push({ ...series, data: this.getSeriesData(this.state.data.series, series, thisStyle, max,multiple,dataType), itemStyle: { ...series.itemStyle, color: this.getColor(series, 0, thisStyle.orientations) } });
        }
        this.formatterChange(tooltip);
        if(tooltip.textStyle && tooltip.textStyle.fontSize){
            tooltip.textStyle.fontSize = this.props.getCompatibleSize(tooltip.textStyle.fontSize, 'num');
        }
        let option = {
            title: {
            },
            legend: legend,
            grid: grid,
            tooltip: {   //展示数据
                trigger: 'axis',
                ...tooltip,
                show: tooltip ? tooltip.show : true,
            },
            xAxis: xAxis,
            yAxis: yAxis,
            series: thisSeries,
            dataZoom
        };
        if(getDataType !== 'freshData' || !thisStyle.freshNotClear){
            this.myChart.clear();
        }
        // return option;
        this.myChart.setOption(option);
    }

    getColor(series, index, orientations) {
        if(series == null){
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

    //柱图点击响应
    onChartClick(e) {
        const { style } = this.props.thisData;
        if(style.actionClickType === 2 && e.dataIndex !== this.state.data.xAxis.length - 1){
            return;
        }
        const { interact } = this.props.thisData.dataSources;
        let selectItem = {};
        if(e.componentType === 'xAxis' || e.componentType === 'yAxis'){
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
        // console.log(selectItem);
        this.interactData(interact, selectItem);
    }

    render() {
        const {data} = this.state;
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
                        return (
                            <div className={cssStyle.box} style={{opacity}}>
                                <div
                                    style={{ width: '100%', height: '100%', position: 'absolute',opacity:data && data.xAxis && data.xAxis.length > 0 ? 1 : 0}}
                                    id={'echarts_bar_'+this.props.thisData.id}
                                    onMouseOver={this.stopAutoMove.bind(this)}
                                    onMouseLeave={this.autoMove.bind(this)}
                                />
                                {data && data.xAxis && data.xAxis.length === 0 && <div>暂无数据</div>}
                            </div>
                        );
                    }}
                </Motion>

            </ComponentBox>
        );
    }
}