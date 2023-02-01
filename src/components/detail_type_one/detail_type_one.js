import React from "react";
import ComponentBox from "../component_box";

import {getData} from "../../common/getDataUtil";
import {getCompatibleSize} from "../../common/util";
import {Motion, spring} from "react-motion";
import cssStyle from "./detail_type_one.module.css";


export default class DetailTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:{},selectedIndex:0,show:false,showBox:false};
        this.keyParams = {};
        this.getData = getData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        // this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
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
        // this.p.then(() => {
            this.setState({opacity:1});
        // })
    }

    //重新获取数据
    reGetData(){
        this.setState({resultData:{}});
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
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const {resultData} = this.state;
        return (
            <ComponentBox style={{...this.props.style,overflow:'hidden'}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div style={{opacity,fontSize}} className={cssStyle.box} >
                            <img src={resultData.principalImg ? style.fileUrl + resultData.principalImg:''} alt='' className={cssStyle.headImg}/>
                            <div className={cssStyle.content}>
                                <div className={cssStyle.title}>负责人姓名：</div>
                                <div className={cssStyle.name}>{resultData.principal}</div>
                                <div className={cssStyle.title}>联系方式：</div>
                                <div className={cssStyle.name}>{resultData.principalPhone}</div>
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}