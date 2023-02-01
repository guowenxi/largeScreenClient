import React from "react";
import ComponentBox from "../component_box";
import NameNumTypeTenContent from "./name_num_type_ten_content";

import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import iconOne from "./images/sorrow.svg";

export default class NameNumTypeTen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],selectedIndex:0,show:false,showBox:false};
        this.keyParams = {};
        this.refreshTimer = [];
        this.iconList = [iconOne];
        this.getData = getData.bind(this);
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

    render() {
        return (
            <ComponentBox style={{...this.props.style,overflow:'hidden'}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <NameNumTypeTenContent style={{opacity}} thisData={this.props.thisData} resultData={this.state.resultData}/>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}