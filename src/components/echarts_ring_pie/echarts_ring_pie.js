import React from "react";
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import ComponentBox from "../component_box";
import { getData } from "../../common/getDataUtil";
import style from './echarts_ring_pie.module.css'
import Util from "../../common/util";

export default class EchartsRingPie extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {} };
        this.keyParams = {};
        this.getData = getData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => { this.getData(this.callBack.bind(this, resolve)) });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then((data) => {
            this.setState({ data })
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
            default:
                break;
        }
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            if (this.props.thisData.dataSources.dataType === 1) {
                if (result.legends && result.legends.length > 0) {
                    this.series = result.series[0];
                } else {
                    this.series = result.series;
                }
                if (resolve) {
                    resolve(result);
                } else {
                    this.setState({ data: result });
                }
            } else {
                //接口获得的数据
                if (result.legends && result.legends.length > 0) {
                    this.series = result[this.props.index].series[0];
                } else {
                    this.series = result[this.props.index].series;
                }
                if (resolve) {
                    this.setState({ data: result[this.props.index] });
                    resolve(result[this.props.index]);
                } else {
                    this.setState({ data: result[this.props.index] });
                }
            }

        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //内容格式器代码转化
    formatterChange(label) {
        if (label) {
            if (label.formatter) {
                try {
                    // eslint-disable-next-line no-eval
                    label.formatter = eval(label.formatter);
                } catch (e) { }
            }
            if (label.rich) {
                try {
                    label.rich = JSON.parse(label.rich);
                } catch (e) { }
            }
        }
    }

    getColor(series, index) {
        if (series.colorType === 1) {
            if (series.color && series.color[0]) {
                return series.color[0];
            } else {
                return null;
            }
        } else {
            if (series.linearColor && series.linearColor[0]) {
                return {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: series.linearColor[0].start // 0% 处的颜色
                    }, {
                        offset: 1, color: series.linearColor[0].end // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                };
            } else {
                return null;
            }
        }
    }

    getOption() {
        const thisStyle = this.props.thisData.style;
        if (this.state.data.length===0&&this.props.thisData.dataSources.defaultData.xAxis==null) {
            return {};
        }
        let allNum = '';
        if (thisStyle.maxType === 2) {
            let max = 0;
            if(this.state.data.series){
                this.state.data.series&&this.state.data.series.forEach((item) => {
                    max += parseInt(item)
                })
            }else{
                this.props.thisData.dataSources.defaultData&&this.props.thisData.dataSources.defaultData.series.forEach((item) => {
                    max += parseInt(item)
                })
            }
            allNum = max
        } else {
            allNum = parseInt(Util.getAllMaxNum(this.state.data)) * 1.2
        }
        let newSeries = []
        if(this.state.data.series){
            this.state.data.series.map((item, index) => {
                let series = JSON.parse(JSON.stringify(thisStyle.series[index]));
                series.labelLine = { show: false }
                //饼图数据
                // series.data = this.series.map((item, index) => { return { name: this.state.data.xAxis[index], value: item } });
                series.data = [{ value: item, itemStyle: { color: this.getColor(series, index) } }, { value: allNum - parseInt(item), itemStyle: { color: series.shadowColor ? series.shadowColor : 'rgb(33,44,95)' } }]
                series.center = [series.centerX, series.centerY];
                series.radius = [series.radiusIn, series.radiusOut];
                series.hoverAnimation = false;
                return newSeries.push(series)
            })
        }else{
          if (this.props.thisData.dataSources.defaultData && Array.isArray(this.props.thisData.dataSources.defaultData.series)) {
          console.log( this.props.thisData.dataSources.defaultData);

            this.props.thisData.dataSources.defaultData&&this.props.thisData.dataSources.defaultData.series.map((item, index) => {
              let series = JSON.parse(JSON.stringify(thisStyle.series[index]));
              series.labelLine = { show: false }
              //饼图数据
              // series.data = this.series.map((item, index) => { return { name: this.state.data.xAxis[index], value: item } });
              series.data = [{name:this.props.thisData.dataSources.defaultData.xAxis[index], value: item, itemStyle: { color: this.getColor(series, index) } }, {name:"", value: allNum - parseInt(item), itemStyle: { color: series.shadowColor ? series.shadowColor : 'rgb(33,44,95)' } }]
              series.center = [series.centerX, series.centerY];
              series.radius = [series.radiusIn, series.radiusOut];
              series.hoverAnimation = false;
              return newSeries.push(series)
            })
          }
            
        }
        //饼图
        let option = {
            title: {
            },
            tooltip: {
                formatter:function(params){
                    let listItem=''
                    if(params.name===""){
                        return <div style={{display:'none'}}></div>
                    }else{
                        listItem=
                        '<div style="display:inline-block;width:10px;height:10px;background:'+params.color.colorStops[0].color+';margin-right: 5px;border-radius: 50%;"></div><span style="display:inline-block;margin-right:5px">'+params.name+'</span><span>'+params.value+'</span>'
                        return '<div>'+listItem+'</div>'
                        // return(console.log(params))
                    }
                }
            },
            xAxis: { show: false },
            yAxis: { show: false },
            series: newSeries
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
        if ((this.state.data.length!==0||this.props.thisData.dataSources.defaultData.length!==0) && legend.styleType === 2) {
            if (legend.show===false) {
                return null;
            }
            this.formatterChange(legend);
            const columnNum = legend.columnNum ? legend.columnNum : 1;
            const columnGap = legend.columnGap ? legend.columnGap : 0;
            let legendData=''
            if(this.state.data.xAxis){
                legendData=this.state.data
            }else{
                legendData=this.props.thisData.dataSources.defaultData
            }
            let legendList = [];
            let count = 0;
            if (legend.percentage) {
                this.series.forEach((num) => {
                    count += num;
                });
                legendList = legendData&&legendData.xAxis.map((item, index) => {
                    if (typeof (legend.formatter) === 'function') {
                        return { name: legend.formatter(item), percentage: count === 0 ? '0%' : (parseFloat(this.series[index]) * 100 / count).toFixed(fixNum) + '%' };
                    } else {
                        return { name: item, percentage: count === 0 ? '0%' : (parseFloat(this.series[index]) * 100 / count).toFixed(fixNum) + '%' };
                    }
                });
            } else {
                if (typeof (legend.formatter) === 'function') {
                    legendList = legendData&&legendData.xAxis.map((item, index) => {
                        return { name: legend.formatter(item) }
                    });
                } else {
                    legendList = legendData&&legendData.xAxis.map((item, index) => {
                        return { name: item }
                    });
                }
            }
            const length = legendData&&legendData.xAxis.length;
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
                borderRadius: legend.radius
            };
            if (legend.icon === 'circle') {
                iconStyle.borderRadius = iconStyle.height;
            }
            const distanceWidth = this.props.getCompatibleSize(legend.distance);
            const fontBoxStyle = {
                width: 'calc(100% - ' + distanceWidth + ' - ' + iconStyle.width + ')',
                flexDirection: legend.numDirection
            };
            const nameStyle = {
                fontSize: this.props.getCompatibleSize(legend.textStyle.fontSize),
                color: legend.textStyle.color,
                width: 'calc(100%' + (legend.showNum ? ' - ' + legend.numWidth : '') + (legend.percentage ? ' - ' + legend.percentageWidth : '') + ')'
            };
            const numStyle = {
                fontSize: this.props.getCompatibleSize(legend.numSize),
                color: legend.numColor,
                width: legend.numWidth
            };
            const percentageStyle = {
                fontSize: this.props.getCompatibleSize(legend.percentageSize),
                color: legend.percentageColor,
                width: legend.percentageWidth
            };
            return (
                <div className={style.legendBox} style={legend}>
                    {legendList&&legendList.map((item, index) => {
                        if (item.name) {
                            return (
                                <div className={style.itemBox} key={index} style={itemStyle}>
                                    <div className={style.item} style={{ ...iconStyle, backgroundColor: thisStyle.series[index].color[0], top: legend.imgTop }} />
                                    <div className={`${style.item} ${style.distance}`} style={{ width: distanceWidth }} />
                                    <div className={style.fontBox} style={fontBoxStyle}>
                                        <div className={style.item} style={nameStyle}>{item.name}</div>
                                        {legend.showNum && this.series[index] && <div className={style.item} style={numStyle}>{this.series[index].toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")}</div>}
                                        {legend.percentage && <div className={style.item} style={percentageStyle}>{item.percentage}</div>}
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div className={style.itemBox} key={index} style={itemStyle} />
                            );
                        }
                    })}
                </div>
            );

        } else {
            return null;
        }
    }


    render() {
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <ReactECharts
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    echarts={echarts}
                    option={this.getOption()}
                    theme={"theme_name"} />
                {this.getLegend()}
            </ComponentBox>
        );
    }
}