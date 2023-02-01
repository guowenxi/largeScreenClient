import React from "react";
import ComponentBox from "../component_box";
import { getData } from "../../common/getDataUtil";

import EchartsWordCloud from "./echarts_word_cloud";
import {interactData} from "../../common/util";

export default class worldCloud extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {}, show: true ,resultData:[{"name":"","value":0}]};
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.getDataTime = 0;
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if(this.props.thisData.firstLoad){
                this.getData(this.callBack.bind(this, resolve))
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
        this.p.then((resultData) => {
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
        if(resolve){
            resolve(result);
        }
        if (result) {
            this.getDataTime = (new Date()).getTime();
            result.forEach((item)=>{
                item.nameKey = item.name;
            });
            this.setState({ resultData: result });
            if(this.props.thisData.firstSend && result[0]){
                const { interact } = this.props.thisData.dataSources;
                this.interactData(interact, result[0]);
            }
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    render() {
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <EchartsWordCloud keyParams={this.keyParams} getDataTime={this.getDataTime} thisData={this.props.thisData} styleData={this.props.thisData.style} resultData={this.state.resultData}/>
            </ComponentBox>
        );
    }
}