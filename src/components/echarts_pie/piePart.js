import React from "react";
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import {getCompatibleSize, getSum} from "../../common/util";

export default class PiePart extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.onclick = {
            'click': this.onChartClick.bind(this)
        };
        this.selectedIndex = -1;
        this.getDataTime = -1;
        this.windowResize = this.windowResize.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        setTimeout(()=>{
            this.initEcharts();
        });
        window.addEventListener('resize',this.windowResize);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        window.removeEventListener('resize',this.windowResize);
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime && this.myChart){
            this.getOption();
        }
        if(this.myChart && global.editType && this.props.isSelected){
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

    initEcharts(){
        if(this.myChart){
            this.myChart.dispose();
        }
        const chartDom = document.getElementById('echarts_pie_'+this.props.thisData.id);
        this.myChart = echarts.init(chartDom);
        this.myChart.on('click',  (params) => {
            this.onChartClick(params);
        });
        this.getOption();
    }

    //饼图点击响应
    onChartClick(e){
        this.props.onChartClick(e);
        // const { interact } = this.props.thisData.dataSources;
        // const selectItem = {name:e.name,num:e.value,id:this.props.data.ids?this.props.data.ids[e.dataIndex]:null,legend:e.seriesName};
        // this.interactData(interact, selectItem);
    }

    getOption(){
        this.keyParams = this.props.keyParams;
        const thisStyle = this.props.thisData.style;
        const {xAxis} = this.props.data;
        if(xAxis == null || xAxis.length === 0){
            this.myChart.clear();
            this.myChart.setOption({
                series: [{
                    data: [],
                    type: 'pie',
                }]
            });
            return;
        }
        let series = JSON.parse(JSON.stringify(thisStyle.series[0]));
        series.animationTypeUpdate = 'expansion';
        //vh兼容处理
        series.label.fontSize = getCompatibleSize(series.label.fontSize,'num');
        if(series.labelLine.length){
            series.labelLine.length = getCompatibleSize(series.labelLine.length,'num');
        }else{
            delete series.labelLine.length;
        }
        if(series.labelLine.length2){
            series.labelLine.length2 = getCompatibleSize(series.labelLine.length2,'num');
        }else{
            delete series.labelLine.length2;
        }
        this.props.formatterChange(series.label);
        //饼图数据
        series.data = this.props.series.map((item,index) => {
            return {name:xAxis[index],value:item,selected:thisStyle.selectedIndex > 0 && thisStyle.selectedIndex-1 === index}
        });
        series.center = [series.centerX,series.centerY];
        series.radius = [series.radiusIn,series.radiusOut];
        if(thisStyle.selectedIndex){
            series.selectedMode = true;
        }
        if(series.itemStyle.borderRadius){
            try{
                series.itemStyle.borderRadius = JSON.parse(series.itemStyle.borderRadius);
            }catch (e) {
            }
        }
        //起始角度
        if(series.startAngleType === 2 && series.startIndex !== null){
            let beforeCount = 0;
            let startNum;
            for(let i = 0;i < xAxis.length;i ++){
                if(i < series.startIndex - 1){
                    beforeCount += this.props.series[i];
                }else if(i === series.startIndex - 1){
                    startNum = this.props.series[i];
                    break;
                }
            }
            const allCount = getSum(this.props.series);
            if(startNum != null){
                if(allCount){
                    series.startAngle = (series.startAngle?series.startAngle:0) + (beforeCount+startNum/2)*360/allCount;
                }else{
                    series.startAngle = (series.startAngle?series.startAngle:0) + (series.startIndex-0.5)*360/this.props.series.length;
                }
            }
        }
        let tooltipFormatter = "{b}: {c} ({d}%)";
        if(thisStyle.tooltipFormatter && thisStyle.tooltipFormatter !== '{}'){
            try {
                // eslint-disable-next-line no-eval
                tooltipFormatter = eval(thisStyle.tooltipFormatter).bind(this);
            } catch (e) {}
        }
        //饼图
        let option = {
            title:{
            },
            tooltip:{   //展示数据
                show:!thisStyle.hideTooltip,
                formatter: tooltipFormatter,
                position:thisStyle.tooltipPosition
            },
            xAxis:{show:false},
            yAxis:{show:false},
            series:series
        };
        //饼图图例
        let legend = JSON.parse(JSON.stringify(thisStyle.legend));
        if(legend.styleType === 1){
            // legend.selectedMode = false;
            legend.itemGap = getCompatibleSize(legend.itemGap,'num');
            legend.itemWidth = getCompatibleSize(legend.itemWidth,'num');
            legend.itemHeight = getCompatibleSize(legend.itemHeight,'num');
            legend.textStyle.fontSize = getCompatibleSize(legend.textStyle.fontSize,'num');
            legend.textStyle.lineHeight = getCompatibleSize(legend.textStyle.lineHeight,'num');
            this.props.formatterChange(legend);
            option.legend = legend;
        }
        if(thisStyle.autoMove){
            this.props.selectedFirst();
        }
        // return option;
        this.myChart.clear();
        this.myChart.setOption(option);
    }

    render() {
        // const { style } = this.props.thisData;
        // return (
        //     <ReactECharts
        //         id={'echarts_pie_'+this.props.thisData.id}
        //         ref={this.props.saveRef}
        //         className={style.animateOne ? cssStyle.animateOne:''}
        //         style={{width:'100%',height:'100%',position:'absolute'}}
        //         echarts={echarts}
        //         option={this.getOption()}
        //         theme={"theme_name"}
        //         onEvents={this.onclick} />
        // );
        return <div id={'echarts_pie_'+this.props.thisData.id} style={{width:'100%',height:'100%',position:'absolute'}} />;
    }
}