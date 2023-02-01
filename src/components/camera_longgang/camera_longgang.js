import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./camera_longgang.module.css";
import {Motion, spring} from "react-motion";
import {isChrome} from "../../config";
import EmptyDom from "../../common/emptyDom";

import Emitter from "../../common/eventBus";
import closeIcon from "./images/close.svg";
import axios from "axios";

export default class CameraLonggang extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false,opacity:0,size:4,isMax:false};
        this.hasInit = false;
    }

    //组件加载触发函数
    componentDidMount() {
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
                this.changeThisShow(true);
                if(!isChrome){
                    if(!this.hasInit){
                        setTimeout(()=>{
                            //初始化控件
                            this.initOcx();
                            //接收数据/播放监控
                            this.DoStartPlay(data.data.cameraId);
                        },250);
                    }else{
                        //接收数据/播放监控
                        this.DoStartPlay(data.data.cameraId);
                    }
                }
                break;
            case "dataInterchange":
                //接收数据/播放监控
                this.DoStartPlay(data.data.cameraId);
                break;
            default:
                break;
        }
    }

    //当前组件显示隐藏
    changeThisShow(type){
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: {showStatus: type, id: this.props.thisData.id}
        });
    }

    //运行加载动画
    animateOn(){
        // if(!isChrome){
        //     this.initOcx();
        // }
        this.setState({opacity:1});
    }

    //初始化控件
    initOcx(){
        const OCXobj = document.getElementById(`longgangOcx${this.props.thisData.id}`);
        OCXobj.ContainOCX_Init("ReqType:PlayReal;wndcount:4");
        this.hasInit = true;
        const {style} = this.props.thisData;
        if(style.defaultCamera){
            this.DoStartPlay(style.defaultCamera);
        }
    }

    //播放监控
    DoStartPlay(cameraId) {

        const {style} = this.props.thisData;
        axios.get(style.keyUrl).then((response) => {
            const result = response.data.data;
            if(result){
                try {
                    const message = JSON.parse(result);
                    if(message.msg === 'SUCCESS'){
                        const key = message.data;
                        const PalyType = "PlayReal";
                        const SvrIp = style.loginIp;
                        const SvrPort = style.loginPort;
                        const appkey = style.userName;
                        const appSecret = key.appSecret;
                        const time = key.time;
                        const timeSecret = key.timeSecret;
                        const httpsflag = 1;
                        const param = 'ReqType:' + PalyType + ';SvrIp:' + SvrIp + ';WndCount: 4;SvrPort:' + SvrPort + ';Appkey:' + appkey + ';AppSecret:' + appSecret + ';time:' + time + ';timesecret:' + timeSecret + ';httpsflag:' + httpsflag + ';CamList:' + cameraId + ';WndSelect:1';
                        const OCXobj = document.getElementById(`longgangOcx${this.props.thisData.id}`);
                        OCXobj.ContainOCX_Do(param);
                    }
                }catch (e) {}
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    render() {
        const { style } = this.props.thisData;
        const headHeight = this.props.getCompatibleSize(style.headHeight);
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,backgroundColor:style.backgroundColor,display:this.props.thisData.showStatus ? '':'none'}}>
                            {headHeight && (
                                <div className={cssStyle.head} style={{height:headHeight,fontSize:headHeight}}>
                                    {style.hasClose && <img alt='' src={closeIcon} className={cssStyle.button} onClick={this.changeThisShow.bind(this,false)}/>}
                                </div>
                            )}
                            <div className={cssStyle.content} style={{height:'calc(100% - '+headHeight+')'}}>
                                <object id={`longgangOcx${this.props.thisData.id}`} name={`longgangOcx${this.props.thisData.id}`} classID="CLSID:7E393848-7238-4CE3-82EE-44AF444B240A" className={cssStyle.webOcx} events="true">
                                </object>
                                {isChrome ? <EmptyDom description={<span style={{fontSize:'2.5vh'}}>请用ie浏览器打开</span>}/> : ''}
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}