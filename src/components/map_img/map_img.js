import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./map_img.module.css";
import {Motion, spring} from "react-motion";
import {interactData} from "../../common/util";

import Emitter from "../../common/eventBus";

import dataPosition from "./position";
import {getData} from "../../common/getDataUtil";

export default class MapImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false, opacity:0,resultData:[]};
        this.getData = getData.bind(this);
        this.selectedIndex = -1;
        this.dataPosition = dataPosition;
        this.keyParams = {};
        this.interactData = interactData.bind(this);
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

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "showComponent":
                //显示当前组件
                break;
            case "changeKey" :
                for(let key in data.data){
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
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

    //点击响应
    selItem(selectedItem,index) {
        const {interact} = this.props.thisData.dataSources;
        if(index === this.selectedIndex){
            this.selectedIndex = -1;
            interact.forEach((item)=>{
                Emitter.emit(item.receiveId,{type:'deleteKey'});
            });
        }else{
            this.interactData(interact,selectedItem);
            this.selectedIndex = index;
        }
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const titleKey = style.titleKey ? style.titleKey : 'name';
        const numKey = style.numKey ? style.numKey : 'num';
        const mapImg = style.area && require(`./images/${style.area}.${style.area === 'yueqingTwo' ? 'png':'svg'}`);
        const position = this.dataPosition[style.area] ? this.dataPosition[style.area] : {};
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} reGetData={this.reGetData.bind(this)}>
                {style.area && (
                    <Motion style={{opacity:spring(this.state.opacity)}}>
                        {({opacity}) =>
                            <div style={{opacity:opacity,fontSize,color:style.color}} className={cssStyle.box} >
                                <img alt='' src={mapImg} className={cssStyle.map}/>
                                {this.state.resultData.map((item,index) => {
                                    if(position[item[titleKey]]){
                                        if(style.area === 'yueqingTwo'){
                                            return (
                                                <div key={index} style={position[item[titleKey]]} className={`${cssStyle.dataItem} ${cssStyle.flex}`} onClick={this.selItem.bind(this,item,index)}>
                                                    <div className={cssStyle.name}>{item[titleKey]}</div>
                                                    <div>{item[numKey]}</div>
                                                </div>
                                            );
                                        }else{
                                            return (
                                                <div key={index} style={position[item[titleKey]]} className={cssStyle.dataItem} onClick={this.selItem.bind(this,item,index)}>
                                                    {item[numKey]}
                                                </div>
                                            );
                                        }
                                    }else{
                                        return null;
                                    }
                                })}
                            </div>
                        }
                    </Motion>
                )}
            </ComponentBox>
        );
    }
}