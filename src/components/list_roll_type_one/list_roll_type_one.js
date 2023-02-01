import React from "react";

import ComponentBox from "../component_box";
import {Motion, spring} from 'react-motion';
import cssStyle from './list_roll_type_one.module.css';
import {getData} from "../../common/getDataUtil";
import {interactData} from "../../common/util";

export default class ListRollTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {resultData: [], showNewsItemIndex: 0,opacity:0};
        this.keyParams = {startTime: null, endTime: null};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.intervalTimer){
            clearInterval(this.intervalTimer);
        }
        if(this.refreshTimer){
            clearTimeout(this.refreshTimer);
        }
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then((data) => {
            this.setState({resultData:data,opacity:1});
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey" :
                this.keyParams[data.keyName] = data.data;
                this.reGetData();
                break;
            case "animateOn":
                this.animateOn();
                break;
            default:
                break;
        }
    }

    //重新获取数据
    reGetData(){
        if(this.intervalTimer){
            clearInterval(this.intervalTimer);
        }
        this.setState({resultData:[],showNewsItemIndex:0});
        this.getData(this.callBack.bind(this,''));
    }

    //切换自动滚动开始暂停
    changeIntervalStart(flag){
        if(this.intervalTimer){
            clearInterval(this.intervalTimer);
        }
        if(flag){
            const {style} = this.props.thisData;
            const interval = style.interval ? style.interval : 5000;
            this.intervalTimer = setInterval(() => this.changeNewsShow(), interval);
        }
    }

    //获取数据后回调
    callBack(resolve,result){
        if(result){
            this.setState({resultData:result});
            this.changeIntervalStart(true);
            if(resolve){
                resolve(result);
            }
        }
    }

    //点击响应
    itemClick(item) {
        const { interact } = this.props.thisData.dataSources;
        if(interact){
            this.interactData(interact, item);
        }
    }

    // 展现消息
    changeNewsShow() {
        const {resultData} = this.state;
        if (resultData.length > 0) {
            if ((this.state.showNewsItemIndex + 2) > resultData.length) {
                this.setState({showNewsItemIndex: 0});
            } else {
                this.setState({showNewsItemIndex: this.state.showNewsItemIndex + 1});
            }
        }
    }

    getRollList(){
        const {resultData,showNewsItemIndex} = this.state;
        const lastIndex = showNewsItemIndex === 0 ? resultData.length - 1 : showNewsItemIndex - 1;
        const {style} = this.props.thisData;
        const contentType = style.contentType ? style.contentType:'contentOne';
        const Content = require(`./content/${contentType}`).default;
        return resultData.map((outerItem, outerIndex) => {
            return (
                <Motion style={{
                    offset: spring(outerIndex === showNewsItemIndex ? 0 : 100)
                }} key={outerIndex} >
                    {({offset}) =>
                        <div key={outerIndex} onClick={this.itemClick.bind(this,outerItem,outerIndex)}>
                            <Content style={style.direction === 2 ? {left: (lastIndex === outerIndex ? -offset:offset) + '%',top:'0px'}:{left:'0px',top: (lastIndex === outerIndex ? -offset:offset) + '%'}} detail={outerItem} styleData={style}/>
                        </div>
                    }
                </Motion>
            );
        })
    }

    getContent(){
        const {resultData,showNewsItemIndex} = this.state;
        const {style} = this.props.thisData;
        if(style.theme === 2){
            return (
                <div className={cssStyle.themeOneBox}>
                    <div className={cssStyle.themeOneContent}>
                        {this.getRollList()}
                    </div>
                    <div className={cssStyle.themeOneButtonBox}>
                        {resultData.map((item,index) =>
                            <div className={`${cssStyle.themeOneButton} ${index === showNewsItemIndex ? cssStyle.themeOneButtonSelected:''}`} key={index}/>
                        )}
                    </div>
                </div>
            );
        }else{
            return this.getRollList();
        }
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox id={this.props.thisData.id} thisData={this.props.thisData} style={this.props.style}
                          receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div style={{fontSize: fontSize,color:style.color,opacity}} className={cssStyle.box} onMouseOver={this.changeIntervalStart.bind(this,false)} onMouseOut={this.changeIntervalStart.bind(this,true)} >
                            {this.getContent()}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}