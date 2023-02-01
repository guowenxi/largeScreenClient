import React from "react";
import {getColumnNum, getCompatibleSize, interactData} from "../../common/util";
import ComponentBox from "../component_box";
import { getData } from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import cssStyle from "./echarts_gauge_list.module.css";
import EchartsGauge from "./echarts_gauge";
import SpringScrollbars from "../../common/springScrollbars";

export default class EchartsGaugeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], show: true, getDataTime: 0, opacity: 0 };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.getDataTime = 0;
        this.interactData = interactData.bind(this);
        this.colorList = ['rgb(252,255,122)','rgb(117,255,225)','rgb(216,117,255)','rgb(255,141,117)','rgb(114,199,255)'];
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            // this.getData(this.callBack.bind(this, resolve))
            if(this.props.thisData.firstLoad){
                this.getData(this.callBack.bind(this, resolve));
            }else{
                this.callBack(resolve);
            }
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
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
                this.reGetData();
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
            const {style} = this.props.thisData;
            if(!style.freshAnimate){
                this.getDataTime = (new Date()).getTime();
            }
            if (resolve) {
                resolve(result);
            }
            this.setState({ data: result,getDataTime:(new Date()).getTime() });
            if(style.freshAnimate){
                setTimeout(()=>{
                    this.getDataTime = (new Date()).getTime();
                    this.setState({ });
                });
            }
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //点击响应
    itemClick(item) {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }

    getContentItem(data,index,opacity,fontSize,fixNum){
        if(data){
            return <EchartsGauge data={data} opacity={opacity} fontSize={fontSize*1.2} fixNum={fixNum} fontColor={this.colorList[index%5]} index={index} id={'gauge_'+this.props.thisData.id+index}/>
        }
    }

    render() {
        const {style} = this.props.thisData;
        const resultData = this.state.data.slice();
        const itemStyle = getColumnNum(style,resultData);
        const fontSize = getCompatibleSize(style.fontSize,'num');
        let boxWidth = "100%";
        let boxHeight = "100%";
        if(style.rowNum){
            const columnNum = style.columnNum ? style.columnNum : 1;
            if(style.scrollType === 'column'){
                boxHeight = Math.ceil(resultData.length*100/(style.rowNum*columnNum))+'%';
            }else{
                boxWidth = Math.ceil(resultData.length*100/(style.rowNum*columnNum))+'%';
            }
        }
        let lineHeight = 0;
        if(style.autoMove){
            if(style.scrollType === 'column'){
                lineHeight = (parseFloat(itemStyle.height)+(style.rowGap ? style.rowGap : 0))+'%';
            }else{
                lineHeight = (parseFloat(itemStyle.width)+(style.columnGap ? style.columnGap : 0))+'%';
            }
        }
        const fixNum = style.fixNum != null ? style.fixNum : 0;
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <SpringScrollbars style={{width:'100%',height:'100%'}} autoscrolltype={style.scrollType} autoMove={style.autoMove} lineHeight={lineHeight} interval={style.interval}>
                    <Motion style={{opacity:spring(this.state.opacity)}}>
                        {({opacity}) =>
                            <div style={{opacity,fontSize:fontSize,flexDirection:style.flexDirection,width:boxWidth,height:boxHeight}} className={cssStyle.box}>
                                {resultData && resultData.map((item,index)=>{
                                    if(item){
                                        return (
                                            <div key={index} style={itemStyle} className={cssStyle.itemBox} onClick={this.itemClick.bind(this,item)}>
                                                {this.getContentItem(item,index,opacity,fontSize,fixNum)}
                                                <div className={cssStyle.name} style={{fontSize:fontSize+'px',color:this.colorList[index%5]}}>{item.name}</div>
                                            </div>
                                        );
                                    }else{
                                        return (
                                            <div key={index} style={itemStyle} className={cssStyle.itemBox} />
                                        );
                                    }
                                })}
                            </div>
                        }
                    </Motion>
                </SpringScrollbars>
            </ComponentBox>
        );
    }
}