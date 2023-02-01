import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./svg_map_longwan.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {roadPosition} from "./svg_data";
import {interactData,getCompatibleSize} from "../../common/util";

import ImgMap from "./images/map.png";
import ImgOrange from "./images/orange.png";
import ImgYellow from "./images/yellow.png";
import ImgBlue from "./images/blue.png";

export default class SvgMapLongwan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[]};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.keyParams = {};
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
        if(this.timer){
            clearTimeout(this.timer);
        }
        if(this.detailTimer){
            clearTimeout(this.detailTimer);
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
            this.setState({opacity:1});
        })
    }

    //重新获取数据
    reGetData(){
        this.setState({resultData:[]});
        this.getData(this.callBack.bind(this,''));
    }

    //获取数据后回调
    callBack(resolve,result){
        if(result){
            this.setState({resultData:result});
            if(resolve){
                resolve(result);
            }
        }
    }

    getPoint(num){
        if(num < 20){
            return ImgOrange;
        }else if(num < 60){
            return ImgYellow;
        }else{
            return ImgBlue;
        }
    }

    getColor(num){
        if(num < 20){
            return '#fc7337';
        }else if(num < 60){
            return '#fccc37';
        }else{
            return '#00fffc';
        }
    }

    roadClick(item){
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const {resultData} = this.state;
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize}} >
                            <img src={ImgMap} alt={''} className={cssStyle.box} />
                            {resultData && resultData.map((item,index)=>
                                <div key={index} className={cssStyle.roadBox} style={roadPosition[item.id]} onClick={this.roadClick.bind(this,item)}>
                                    <div className={cssStyle.nameBox}>
                                        <img alt={''} src={this.getPoint(item.number)} />
                                        <div>{item.name}</div>
                                    </div>
                                    <div className={cssStyle.num} style={{color:this.getColor(item.number)}}>{item.number}</div>
                                </div>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}