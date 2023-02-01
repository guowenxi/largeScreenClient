import React from "react";
import {getCompatibleSize} from "../../common/util";
import style from "./echarts_pie.module.css";

export default class PiePart extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //点击响应
    itemClick(item,index) {
        this.props.legendsClick(item,index);
    }

    render() {
        const thisStyle = this.props.thisData.style;
        const legend = JSON.parse(JSON.stringify(thisStyle.legend));
        const fixNum = legend.fixNum ? legend.fixNum : 0;
        if(this.props.data.xAxis && legend.styleType === 2){
            if(!legend.show){
                return null;
            }
            this.props.formatterChange(legend);
            const columnNum = legend.columnNum ? legend.columnNum : 1;
            const columnGap = legend.columnGap ? legend.columnGap : 0;
            const {data} = this.props;
            let legendList = [];
            let count = 0;
            if(legend.percentage){
                this.props.series.forEach((num) =>{
                    count += num;
                });
                legendList = data.xAxis.map((item,index) => {
                    if(typeof(legend.formatter) === 'function'){
                        return {name:legend.formatter(item),percentage:count === 0 ? '0%' : (parseFloat(this.props.series[index])*100/count).toFixed(fixNum)+'%'};
                    }else{
                        return {name:item,percentage:count === 0 ? '0%' : (parseFloat(this.props.series[index])*100/count).toFixed(fixNum)+'%'};
                    }
                });
            }else{
                if(typeof(legend.formatter) === 'function'){
                    legendList = data.xAxis.map((item,index) => {
                        return {name:legend.formatter(item)}
                    });
                }else{
                    legendList = data.xAxis.map((item,index) => {
                        return {name:item}
                    });
                }
            }
            const length = data.xAxis.length;
            const rowNum = Math.ceil(length/columnNum);
            //计算多余个数
            const subNum = rowNum*columnNum - length;
            for(let i = 0;i < subNum;i ++){
                legendList.push({});
            }
            const itemStyle = {
                width: (100 - columnGap*(columnNum - 1))/columnNum + '%',
                height: 100/rowNum + '%',
                alignItems: legend.verticalAlign,
                flexDirection: legend.align
            };
            const iconStyle = {
                width: getCompatibleSize(legend.itemWidth),
                height: getCompatibleSize(legend.itemHeight),
                borderRadius:legend.radius
            };
            if(legend.icon === 'circle'){
                iconStyle.borderRadius = iconStyle.height;
            }
            const distanceWidth = getCompatibleSize(legend.distance);
            const fontBoxStyle = {
                width: 'calc(100% - '+distanceWidth+' - '+iconStyle.width+')',
                flexDirection: legend.align
            };
            const nameStyle = {
                fontSize:getCompatibleSize(legend.textStyle.fontSize),
                color:legend.textStyle.color,
                width: 'calc(100%'+(legend.showNum ? ' - '+legend.numWidth:'')+(legend.percentage ? ' - '+legend.percentageWidth:'')+')'
            };
            const numStyle = {
                fontSize:getCompatibleSize(legend.numSize),
                color:legend.numColor,
                width:legend.numWidth,
                textAlign:legend.numAlign
            };
            const percentageStyle = {
                fontSize:getCompatibleSize(legend.percentageSize),
                color:legend.percentageColor,
                width:legend.percentageWidth,
                textAlign:legend.percentageAlign
            };
            return (
                <div className={style.legendBox} style={legend}>
                    {legendList.map((item,index) => {
                        if(item.name){
                            return (
                                <div className={style.itemBox} key={index} style={itemStyle} onClick={this.itemClick.bind(this,item,index)}>
                                    <div className={style.item} style={{...iconStyle,backgroundColor:thisStyle.series[0].color[index]}}/>
                                    <div className={`${style.item} ${style.distance}`} style={{width:distanceWidth}} />
                                    <div className={style.fontBox} style={fontBoxStyle}>
                                        <div className={`${style.item} ${style.name} ${legend.nameOverShowType === 2 ? style.overHide:''}`} style={nameStyle} title={item.name}>{item.name}</div>
                                        {legend.showNum && this.props.series[index] != null && <div className={style.item} style={numStyle}>{this.props.series[index].toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")}</div>}
                                        {legend.percentage && <div className={style.item} style={percentageStyle}>{item.percentage}</div>}
                                    </div>
                                </div>
                            );
                        }else{
                            return (
                                <div className={style.itemBox} key={index} style={itemStyle} />
                            );
                        }
                    })}
                </div>
            );

        }else{
            return null;
        }
    }
}