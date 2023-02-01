import React from "react";
// import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import "echarts-wordcloud/dist/echarts-wordcloud";
import "echarts-wordcloud/dist/echarts-wordcloud.min";
import kuang from "../word_cloud/images/chinaMap.png"
import {interactData} from "../../common/util";

export default class EchartsWordCloud extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.type=['',kuang];
        this.onclick = {
            'click': this.onChartClick.bind(this)
        };
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        setTimeout(()=>{
            const chartDom = document.getElementById('echarts_bar_'+this.props.thisData.id);
            this.myChart = echarts.init(chartDom);
            this.myChart.on('click',  (params) => {
                this.onChartClick(params);
            });
            this.getOption();
        });
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime && this.myChart){
            this.getOption();
        }
    }

    getOption(){
        this.keyParams = this.props.keyParams;
        const thisStyle = this.props.styleData;
        if (this.props.resultData.length===0) {
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
        const {resultData} = this.props;
        let wordList = [];
        const nameKey = thisStyle.nameKey ? thisStyle.nameKey : 'name';
        const valueKey = thisStyle.valueKey ? thisStyle.valueKey : 'value';
        if(thisStyle.showNum){
            resultData.forEach((word,index)=>{
                wordList.push({...word,nameKey:word.name,name:word[nameKey]+' '+word[valueKey],value:word[valueKey] != null ? word[valueKey]:resultData.length-index});
            });
        }else{
            resultData.forEach((word,index)=>{
                wordList.push({...word,nameKey:word.name,name:word[nameKey],value:word[valueKey] != null ? word[valueKey]:resultData.length-index});
            });
        }
        var maskImage = new Image();
        if(thisStyle.frameType===2){
            maskImage.src=this.type[1]
        }else{
            maskImage=this.type[0]
        }
        const color = ['#5273a3','#105761','#fead47','#2a334c',"#105761","#acb5df","#653670"];
        const resultOrder = wordList.sort(function (a, b) {
            return b.value  - a.value;
        });
        const option = {
            backgroundColor: thisStyle.backgroundColor,
            tooltip: {
                show: false
            },
            series: [{
                type: 'wordCloud',
                width: '100%',
                height: '100%',
                left: 'center',
                top: 'center',
                sizeRange: [thisStyle.minSize || 11, thisStyle.maxSize || 40],
                rotationRange: [thisStyle.minRange || -90, thisStyle.maxRange || 90],
                rotationStep: 45,
                gridSize: 1,
                shape: 'pentagon',
                maskImage: maskImage,
                drawOutOfBound: true,
                textStyle: {
                    color: function (e) {
                        return color[e.dataIndex%7];
                    },
                    fontWeight:"bold"
                },
                data: resultOrder,
            }]
        };
        // return option;
        this.myChart.setOption(option);
    }

    onChartClick(e) {
        // console.log(e.data)
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, e.data);
    }

    render() {
        return (
            <div id={'echarts_bar_'+this.props.thisData.id} style={{ width: '100%', height: '100%', position: 'absolute' }}>
                {/*<ReactECharts*/}
                {/*    style={{ width: '100%', height: '100%', position: 'absolute' }}*/}
                {/*    echarts={echarts}*/}
                {/*    option={this.getOption()}*/}
                {/*    theme={"theme_name"}*/}
                {/*    onEvents={this.onclick}*/}
                {/*/>*/}
            </div>
        );
    }
}