import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./camera_cangnan.module.css";
import {Motion, spring} from "react-motion";
import {Modal} from "antd";
import axios from "axios";
import {isChrome} from "../../config";
import EmptyDom from "../../common/emptyDom";

import one from "./images/1.svg";
import oneW from "./images/1白.svg";
import four from "./images/4.svg";
import fourW from "./images/4白.svg";
import nine from "./images/9.svg";
import nineW from "./images/9白.svg";
import maxIcon from "./images/Max.svg";
import resumeIcon from "./images/Resume.svg";
import closeIcon from "./images/close.svg";
import Emitter from "../../common/eventBus";

export default class CameraCangnan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false,opacity:0,size:4,isMax:false};
        this.sizeNum = [{size:1,icon:one,select:oneW},{size:4,icon:four,select:fourW},{size:9,icon:nine,select:nineW}];
        this.g_curFrameNum = 1;
    }

    //组件加载触发函数
    componentDidMount() {
        this.initFunction();
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
                //接收数据/播放监控
                this.DoStartPlay(data.data.cameraId);
                //显示当前组件
                this.changeThisShow(true);
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
        this.setState({opacity:1});
        // this.InitPage();
    }

    //初始化监控响应函数
    initFunction(){
        //窗口点击事件
        global.dealEventClickFrame = (ulFrameNum, pcFrameInfo) => {
            this.g_curFrameNum = ulFrameNum;
        };
    }

    //初始化控件
    InitPage() {
        this.g_imosActivePlayer = document.h3c_IMOS_ActiveX;
        if (!this.g_imosActivePlayer) {
            Modal.error({
                content: '未安装监控控件，请先安装后再使用！',
            });
        }

        try {
            // eslint-disable-next-line no-undef
            this.g_xmlActive = new ActiveXObject("Microsoft.XMLDOM");
            if (!this.g_xmlActive) {
                // eslint-disable-next-line no-undef
                this.g_xmlActive = new ActiveXObject("MSXML2.DOMDocument.3.0");
            }
        } catch (e) {}
        if (!this.g_xmlActive) {
            // Modal.error({
            //     content: 'xml解析器获取错误，将导致某些功能不可用！',
            // });
        } else {
            this.g_xmlActive.async = "false";
            this.DoLogin();
        }
    }

    //登录
    DoLogin(){
        const { style } = this.props.thisData;
        const g_isLogin = this.g_imosActivePlayer.IMOSAX_InitOCX(style.loginIp, style.loginPort, style.userName, style.userPassword, 1);
        if (0 !== g_isLogin) {
            Modal.error({
                content: "IMOSAX_InitOCX Error:" + g_isLogin,
            });
        }else {
            if(style.defaultCamera){
                this.DoStartPlay(style.defaultCamera,1);
            }
            if(style.loadData){
                this.DoGetCamList();
            }
        }
    }

    //获取监控列表
    DoGetCamList(){
        const { style } = this.props.thisData;
        const strXmlQueryCondition = '<?xml version="1.0" ?>'+
            '<data>' +
            '<ItemNum>3</ItemNum>' + //总共有三个查询条件(不限制摄像头子类型即查询所有类型的摄像头包括固定摄像头等)
            '<QueryConditionList count="3">' + //这边的查询条件数量要和ItemNum一样
            '<item>' + // 查询子域
            '<QueryType>257</QueryType> ' +
            '<LogicFlag>0</LogicFlag> ' +
            '<QueryData>1</QueryData> ' +
            '</item>' +
            '<item>' + //查询的资源类型是摄像头
            '<QueryType>256</QueryType>' +
            '<LogicFlag>0</LogicFlag>' +
            '<QueryData>1001</QueryData>' +
            '</item>' +
            '<item>' + // 查询结果按照名称的升序排序
            '<QueryType>1</QueryType> ' +
            '<LogicFlag>6</LogicFlag>' +
            '<QueryData /> ' +
            '</item>' +
            '</QueryConditionList>' +
            '</data>';
        const strXmlQueryPageInfo = '<?xml version="1.0" ?> '+
            '<data>'+
            '<PageRowNum>100</PageRowNum>'+                     //最多返回100个记录
            '<PageFirstRowNumber>0</PageFirstRowNumber>'+       //从第0个记录开始返回
            '<QueryCount>1</QueryCount>'+                       //还需要返回总记录数
            '</data>';
        const resultStr = this.g_imosActivePlayer.IMOSAX_QueryOrgResListEx('iccsid', strXmlQueryCondition, strXmlQueryPageInfo);
        const cameraListObj = this.loadXML(resultStr);
        const CameraStatus = cameraListObj.documentElement.selectNodes("//result/ResList/item/ResItemV1/ResStatus"); //参见文档xml结构进行解析
        const CameraCode = cameraListObj.documentElement.selectNodes("//result/ResList/item/ResItemV1/ResCode"); //参见文档xml结构进行解析
        const CameraName = cameraListObj.documentElement.selectNodes("//result/ResList/item/ResItemV1/ResName"); //参见文档xml结构进行解析
        const RowNum = cameraListObj.documentElement.selectNodes("//result/RespPageInfo/RowNum")[0].text;
        const intRowNum = parseInt(RowNum);
        for(let i = 0;i < intRowNum;i ++){
            const detailStr = this.g_imosActivePlayer.IMOSAX_QueryDevInst(21, CameraCode[i].text);
            const detailObj = this.loadXML(detailStr);
            const szPara1 = detailObj.documentElement.selectNodes("//result/QueryResult/szPara1")[0].text;
            const szPara2 = detailObj.documentElement.selectNodes("//result/QueryResult/szPara2")[0].text;
            const x = parseFloat(szPara2)/100;
            const y = (parseFloat(szPara1)-17500)*95/9500 - 5;
            const sendData = {
                x,y,
                mpId:CameraCode[i].text,
                mpName:CameraName[i].text,
                isLine:CameraStatus[i].text,
            };
            axios.post(style.reportUrl,sendData).then((response) =>{
                if(response.data.success){
                }else{
                    console.log(CameraCode[i].text+'保存失败');
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    //解析从控件返回的xml字符串
    loadXML(xmlString){
        if(!this.g_xmlActive){
            return;
        }
        this.g_xmlActive.loadXML(xmlString);
        if(0 === this.g_xmlActive.parseError.errorCode){
            return this.g_xmlActive;
        }
        else{
            Modal.error({
                content: "xml解析错误:" + this.g_xmlActive.parseError.reason,
            });
            return null;
        }
    }

    //播放监控
    DoStartPlay(cameraId,winNum) {
        if(isChrome){
            return;
        }
        if(!cameraId){
            return;
        }
        if (!this.g_imosActivePlayer) {
            Modal.error({
                content: '未安装监控控件，请先安装后再使用！',
            });
            return;
        }
        const frameNum = winNum ? winNum : parseInt(this.g_curFrameNum, 10);
        this.g_curFrameNum = frameNum;
        if (isNaN(frameNum) || frameNum < 1 || frameNum > 25) {
            Modal.error({
                content: '请先选择一个窗格',
            });
            return;
        }
        const flag = this.g_imosActivePlayer.IMOSAX_StartFrameLive(frameNum, cameraId);
        if (0 !== flag) {
            Modal.error({
                content: "播放实况失败，错误码：" + flag,
            });
        }
    }

    //修改尺寸布局
    changeSize(size){
        this.setState({size});
        if(isChrome){
            return;
        }
        this.g_imosActivePlayer.IMOSAX_ChangeLayout(size);
    }

    //最大化窗格/还原窗格
    changeMax(){
        if(isChrome){
            return;
        }
        if(this.state.isMax){
            this.g_imosActivePlayer.IMOSAX_ResumeFrame(this.g_curFrameNum);
        }else{
            this.g_imosActivePlayer.IMOSAX_MaxFrame(this.g_curFrameNum);
        }
        this.setState({isMax:!this.state.isMax});
    }

    //

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
                                    <img alt='' className={cssStyle.button} src={this.state.isMax ? resumeIcon : maxIcon} onClick={this.changeMax.bind(this)}/>
                                    {this.sizeNum.map((item,index) =>
                                        <img key={index} className={`${cssStyle.button} ${this.state.size === item.size ? cssStyle.select:''}`}
                                             onClick={this.changeSize.bind(this,item.size)} alt=''
                                             src={this.state.size === item.size ? item.select : item.icon}
                                        />
                                    )}
                                    {style.hasClose && <img alt='' src={closeIcon} className={cssStyle.button} onClick={this.changeThisShow.bind(this,false)}/>}
                                </div>
                            )}
                            <div className={cssStyle.content} style={{height:'calc(100% - '+headHeight+')'}}>
                                <object id="h3c_IMOS_ActiveX" name="h3c_IMOS_ActiveX" classID="clsid:067A4418-EBAC-4394-BFBE-8C533BA6503A" className={cssStyle.webOcx} events="true">
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