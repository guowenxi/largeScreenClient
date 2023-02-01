import React from "react";
import { Modal } from "antd";
import ComponentBox from "../component_box";
import { isChrome } from "../../config";
import { getCurrentTime } from "../../common/util";
import EmptyDom from "../../common/emptyDom";

import cssStyle from "./camera_witness.module.css";

export default class CameraWitness extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.hwnd = null;//监控句柄
        this.videoList = [{},{},{},{}];
        this.defaultCamera = [];
    }

    //组件加载触发函数
    componentDidMount() {
        this.initConfig();
        if(!isChrome){
            this.initFunction();
        }
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {

    }

    //加载服务配置
    initConfig(){
        const { style } = this.props.thisData;
        this.loginIp = style.loginIp;	//服务ip
        this.loginPort = style.loginPort;	//服务端口
        this.userName = style.userName;	//账号
        this.userPassword = style.userPassword;	//密码
        this.picPath = style.picPath;   //截图存储路径
        this.recPath = style.recPath;   //录像存储路径
        try{
            this.defaultCamera = JSON.parse(style.defaultCamera);
        }catch (e) {}
        // this.picPath = "c:\\SURFINGEYE\\PIC\\"; //本地抓图路径
        // this.recPath = "c:\\SURFINGEYE\\RECORD\\"; //本地抓图路径
    }

    //初始化ocx回调函数
    initFunction(){
        //监控焦点更改事件
        global.changeCameraFocus = (hWndid) => {
            this.hwnd = hWndid;
        };
        //截图
        global.cacthPicture = (hWndid) => {
            const sFullID = document.CameraWitnessWebOcx.GetCameraIDEx(hWndid);
            let picfullpath;
            if (sFullID === "" || sFullID === "undefined") {
                Modal.error({
                    content: '获取监控点失败！',
                });
            } else {
                if(sFullID.length === 20){
                    picfullpath = this.picPath + sFullID + "_" + getCurrentTime() +".jpg";
                }else{
                    const sMpID = sFullID.substring(7,25) + sFullID.substring(33,35);
                    const fileName = sMpID + "_" + getCurrentTime() +".jpg";
                    picfullpath = this.picPath + fileName;
                }
                //alert(picfullpath);
                const rs = document.CameraWitnessWebOcx.CaptureImage(hWndid,picfullpath);
                if (rs === 0) {
                    Modal.success({
                        content: '抓图成功。',
                    });
                } else {
                    Modal.error({
                        content: '抓图失败！',
                    });
                }
            }
        };
        //开始录像
        global.startRec = (hWndid) => {
            const sFullID = document.CameraWitnessWebOcx.GetCameraIDEx(hWndid);
            let recfullpath;
            if (sFullID === "" || sFullID === "undefined") {
                Modal.error({
                    content: '获取监控点失败！',
                });
                return;
            }
            if(sFullID.length === 20){
                recfullpath = this.recPath + sFullID + "_" + getCurrentTime();
            }else{
                const sMpID = sFullID.substring(7,25) + sFullID.substring(33,35);
                const fileName = sMpID + "_" + getCurrentTime();
                recfullpath = this.recPath + fileName;
            }
            const rs = document.CameraWitnessWebOcx.StartRecordEx(hWndid, recfullpath);
            if (rs !== 0) {
                Modal.error({
                    content: '开启录像失败！',
                });
            }
        };
        //结束录像
        global.stopRec = function(hWndid) {
            const rs = document.CameraWitnessWebOcx.StopRecordEx(hWndid);
            if (rs === 0) {
                Modal.success({
                    content: '录像完成。',
                });
            } else {
                Modal.error({
                    content: '停止录像失败！',
                });
            }
        };
        this.initOcx();
    }

    //初始化ocx
    initOcx(){
        const boxView = document.getElementById(this.props.thisData.id);
        this.hwnd = document.CameraWitnessVideoOcx.Initial(0, 0, boxView.offsetWidth, boxView.offsetHeight, 0);
        document.CameraWitnessVideoOcx.SetWndBkColor(0,0,0);
        document.CameraWitnessVideoOcx.SetWindowsNumber(4);
        document.CameraWitnessWebOcx.Initial(0);
        document.CameraWitnessWebOcx.SetStreamTransferMode(0);
        // this.loginInit(0);
    }

    //ocx登录服务器
    loginInit(times){
        const loginStatus = document.CameraWitnessWebOcx.Login(this.loginIp,this.loginPort,"",this.userName,this.userPassword);
        if(loginStatus !== 0){
            if(times < 5){
                //若登录失败且重登次数少于5次则一秒后进行重新登录
                setTimeout(() => this.loginInit(times+1),1000);
            }
        }else{
            //记录窗口句柄列表
            this.videoList.forEach((item,index) => {
                item.hwnd = document.CameraWitnessVideoOcx.GetHwndbyNo(index);
            });
            //播放默认监控
            this.playDefaultCamera();
        }
    }

    //播放默认监控
    playDefaultCamera(){
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "dataInterchange" :
                this.handleData(data.data);
                break;
            default:
                break;
        }
    }

    //挂载数据到页面显示
    animateOn(){

    }

    //处理数据
    handleData(data){
        if(data.type === 'listPlay'){
            const list = data.data;
            let i;
            for(i = 0;i < (4-this.defaultCamera.length);i ++){
                this.playCamera(list[i],this.videoList[i].hwnd);
            }
            this.defaultCamera.forEach((item,index) => {
                this.playCamera(item,this.videoList[i+index].hwnd);
            });
        }else if(data.type === 'onePlay'){
            this.playCamera(data.data,this.hwnd);
        }
    }

    //播放监控
    playCamera(TwoID,hwnd){
        const status = document.CameraWitnessVideoOcx.GetWndStatus(hwnd);//获取窗口状态
        for(let i=0;i<this.videoList.length;i++){
            if(hwnd===this.videoList[i].hwnd){//根据句柄找到对应播放窗口序号
                if(TwoID===this.videoList[i].videoId&&status!==0){//如果与原先窗口播放相同且该窗口不是空闲状态，不进行播放操作
                    return;
                }else{
                    this.videoList[i].videoId = TwoID;
                    break;
                }
            }
        }
        const sCameraID = TwoID.substring(0,18);
        const sChannelID = TwoID.substring(18,24);
        document.CameraWitnessWebOcx.StopVideo(hwnd);
        document.CameraWitnessWebOcx.StopPlayRecord(hwnd);
        document.CameraWitnessWebOcx.PlayVideo(hwnd,sCameraID,sChannelID);
    }

    render() {
        return (
            <ComponentBox id={this.props.thisData.id} style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData}>
                <object id="CameraWitnessVideoOcx" name="CameraWitnessVideoOcx" classID="clsid:41574951-5BCE-4577-AAAB-70A8E3C2E891" className={cssStyle.videoOcx} >
                </object>
                <object id="CameraWitnessWebOcx" name="CameraWitnessWebOcx" classID="clsid:1ED44FB1-A30D-4172-80C6-A3558144B642" className={cssStyle.webOcx} >
                </object>
                {isChrome ? <EmptyDom description={<span style={{fontSize:'2.5vh'}}>请用ie浏览器打开</span>}/> : ''}
            </ComponentBox>
        );
    }
}