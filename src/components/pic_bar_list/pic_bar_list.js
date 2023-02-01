import React from "react";
import ComponentBox from "../component_box";
import { StaggeredMotion, spring } from 'react-motion';

import cssStyle from "./pic_bar_list.module.css";
import {getColumnNum,getAllMaxNum,getMaxNum,dataFormat} from "../../common/util";
import {getData} from "../../common/getDataUtil";

import barBack from './images/background.svg';
import barBackTwo from './images/backgroundTwo.svg';
import barBackThree from './images/backgroundThree.svg';
import barTypeOne from './images/barTypeOne.svg';
import barTypeTwo from './images/barTypeTwo.svg';
import barTypeThree from './images/barTypeThree.svg';
import barTypeFour from './images/barTypeFour.svg';
import {Scrollbars} from "react-custom-scrollbars";

export default class PicBarList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],barBackWidth:0};
        this.keyParams = {};
        this.refreshTimer = [];
        this.barTypes = [barTypeOne,barTypeTwo,barTypeThree,barTypeFour];
        this.backgroundTypes = [barBack,barBackTwo,barBackThree];
        this.getData = getData.bind(this);
        this.barBackDom = React.createRef();
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.updateTime !== this.props.thisData.updateTime){
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
                for(let key in data.data){
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
    animateOn(){
        this.p.then(() => {
            this.setState({opacity:1,barBackWidth:this.barBackDom.current.clientWidth});
        });
    }

    //重新获取数据
    reGetData(){
        this.setState({resultData:[]});
        this.getData(this.callBack.bind(this,''));
    }

    //获取数据后回调
    callBack(resolve,result){
        if(result){
            const {style} = this.props.thisData;
            if(style.dataType === 2){
                const data = result.map((item)=>{
                    return {name:item[style.nameKey],num:item[style.numKey]};
                });
                this.maxNum = getMaxNum(data);
                this.setState({resultData:data});
            }else{
                this.maxNum = getAllMaxNum(result);
                this.setState({resultData:dataFormat(result)});
            }
            if(resolve){
                resolve(result);
            }
        }
    }

    formatterName(value){
        return value;
    }

    render() {
        const {style} = this.props.thisData;
        const resultData = this.state.resultData.slice();
        const nameFontSize = this.props.getCompatibleSize(style.nameFontSize);
        const numFontSize = this.props.getCompatibleSize(style.numFontSize);
        const barHeight = this.props.getCompatibleSize(style.barHeight);
        const itemStyle = getColumnNum(style,resultData);
        let boxWidth = "100%";
        if(style.rowNum){
            const columnNum = style.columnNum ? style.columnNum : 1;
            boxWidth = Math.ceil(resultData.length*100/(style.rowNum*columnNum))+'%';
        }
        const barType = style.barType == null ? 0 : style.barType;
        const defaultStyle = resultData.map(() => ({opacity : 0}));
        if(style.formatter){
            try{
                // eslint-disable-next-line no-eval
                this.formatterName = eval(style.formatter);
            }catch (e) {}
        }
        const backgroundType = style.backgroundType == null ? 0 : style.backgroundType;
        return (
            <ComponentBox style={{...this.props.style,overflow:'hidden'}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                    <StaggeredMotion
                        key={defaultStyle.length}
                        defaultStyles={defaultStyle}
                        styles={prevStyles => prevStyles.map((item, i) => {
                            return i === 0
                                ? {opacity:this.state.opacity}
                                : {
                                    opacity: spring(prevStyles[i - 1].opacity)
                                };
                        })}>
                        {interpolatingStyles =>
                            <Scrollbars style={{width:'100%',height:'100%'}}>
                                <div className={`${cssStyle.box} ${cssStyle.flex}`} style={{flexDirection:style.flexDirection,backgroundColor:style.backgroundColor,width:boxWidth}} >
                                    {interpolatingStyles.map((styleItem,index) => {
                                        const item = resultData[index];
                                        if(item){
                                            return (
                                                <div className={`${cssStyle.item} ${cssStyle.flex}`} style={{...itemStyle,opacity: styleItem.opacity}} key={index}>
                                                    <div style={{width:style.nameWidth,textAlign:style.nameTextAlign,color:style.nameColor,fontSize:nameFontSize}} className={cssStyle.item}>
                                                        {this.formatterName(item.name)}
                                                    </div>
                                                    <div style={{width:style.barWidth,height:barHeight}} className={cssStyle.item}>
                                                        {index === 0 ? (
                                                            <img alt='' src={this.backgroundTypes[backgroundType]} className={cssStyle.barBack} ref={this.barBackDom}/>
                                                        ):(
                                                            <img alt='' src={this.backgroundTypes[backgroundType]} className={cssStyle.barBack}/>
                                                        )}
                                                        <div className={cssStyle.barContent} style={{width:(item.num*100/this.maxNum).toFixed(2)+'%'}}>
                                                            <img alt='' src={this.barTypes[barType]} style={{width:this.state.barBackWidth}} />
                                                        </div>
                                                    </div>
                                                    <div style={{width:style.numWidth,textAlign:style.numTextAlign,color:style.numColor,fontSize:numFontSize}} className={cssStyle.item}>{item.num}</div>
                                                </div>
                                            );
                                        }else{
                                            return <div className={`${cssStyle.item} ${cssStyle.flex}`} style={{...itemStyle,flexDirection:style.itemFlexDirection}} key={index} />;
                                        }
                                    })}
                                </div>
                            </Scrollbars>
                        }
                    </StaggeredMotion>
            </ComponentBox>
        );
    }
}