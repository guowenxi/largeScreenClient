import React from "react";
import ComponentBox from "../component_box";
import {Motion, spring} from "react-motion";

import cssStyle from "./name_list_type_one.module.css";
import {interactData} from "../../common/util";
import {getData} from "../../common/getDataUtil";

import backgroundImg from "./images/zhuiti.svg";

export default class NameNumTypeSix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],selectedIndex:0};
        this.keyParams = {};
        this.getData = getData.bind(this);
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
            this.setState({resultData:result.list});
            if(resolve){
                resolve(result);
            }
        }
    }

    itemClick(clickItem){
        const {interact} = this.props.thisData.dataSources;
        this.interactData(interact,clickItem);
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity}}>
                            <img alt={''} src={backgroundImg} className={cssStyle.backgroundImg}/>
                            <div className={`${cssStyle.itemBox} ${cssStyle.flex}`}>
                                {this.state.resultData.map((item,index) => {
                                    return (
                                        <div style={{fontSize,color:style.fontColor}} key={index} className={`${cssStyle.item} ${cssStyle.flex}`} onClick={this.itemClick.bind(this,item)}>{item[style.nameKey]}</div>
                                    );
                                })}
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}