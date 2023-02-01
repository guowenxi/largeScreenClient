import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./iframe_jhwh.module.css";
import {Motion, spring} from "react-motion";
import {getCompatibleSize, interactData} from "../../common/util";

export default class IframeJhwh extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newSrc:'',show:false,opacity:0,token:''};
        this.interactData = interactData.bind(this);
        this.keyParams = {};
        this.childMessage = this.childMessage.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        window.addEventListener('message',this.childMessage);
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        window.removeEventListener('message',this.childMessage);
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "dataInterchange":
            case "changeKey" :
                if(data.data && data.data.actionType){
                    if(data.data.actionType === 'closeWarehouseDetail'){
                        this.warehouseDetailShow = false;
                    }
                    this.sendMessage({type:data.data.actionType,data:data.data});
                }else{
                    this.sendMessage(data.data);
                }
                break;
            case "showComponent":
                //显示当前组件
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    //iframe消息接收
    childMessage(e){
        // console.log(e.data);
        const data = e.data;
        switch (data.type) {
            case "closebackWarehouse":
                this.warehouseDetailShow = false;
                this.closeWarehouse(data.data);
                break;
            case "warehouseDetail":
                this.warehouseDetailShow = true;
                this.warehouseDetail(data.data);
                break;
            case "warehouseClick":
                this.warehouseClick(data.data);
                break;
            case "peopleClick":
                this.peopleClick(data.data);
                break;
            case "visitorClick":
                this.visitorClick(data.data);
                break;
            case "carClick":
                this.carClick(data.data);
                break;
            case "cameraClick":
                this.cameraClick(data.data);
                break;
            case "paperClick":
                this.paperClick(data.data);
                break;
            case "newEmergency":
                global.nowShowPage = 15;    //切换应急页
                this.newEmergency(data.data);
                break;
            case "showEmergency":
                global.nowShowPage = 15;    //切换应急页
                this.showEmergency(data.data);
                break;
            case "smokeDetectorClick":
            case "mephitisClick":
            case "gasClick":
            case "fireHydrantClick":
            case "extinguisherClick":
            case "thermalImageryClick":
            case "pressureGageClick":
                this.equipmentClick(data.data);
                break;
            default:
                break;
        }
    }

    closeWarehouse(){
        const { closeWarehouseInteract } = this.props.thisData.style;
        this.interactData(closeWarehouseInteract);
    }

    //仓库建筑详情
    warehouseDetail(data){
        const { warehouseDetailInteract } = this.props.thisData.style;
        this.interactData(warehouseDetailInteract,data);
    }

    //仓库片区详情
    warehouseClick(data){
        const { warehouseInteract } = this.props.thisData.style;
        this.interactData(warehouseInteract,data);
    }

    //人员详情
    peopleClick(data){
        if(global.nowShowPage !== 0 || this.warehouseDetailShow){
            return;
        }
        const { peopleInteract } = this.props.thisData.style;
        this.interactData(peopleInteract,data);
    }
    //访客详情
    visitorClick(data){
        if(global.nowShowPage !== 0 || this.warehouseDetailShow){
            return;
        }
        const { visitorInteract } = this.props.thisData.style;
        this.interactData(visitorInteract,data);
    }
    //车辆详情
    carClick(data){
        if(global.nowShowPage !== 0 || this.warehouseDetailShow){
            return;
        }
        const { carInteract } = this.props.thisData.style;
        this.interactData(carInteract,data);
    }
    //播放监控
    cameraClick(data){
        if(global.nowShowPage === 0 || this.warehouseDetailShow || global.nowShowPage === 2){
            const { cameraInteractTwo } = this.props.thisData.style;
            this.interactData(cameraInteractTwo,data);
            this.equipmentClick(data);
        }else{
            if(Array.isArray(data)){
                this.cameraIndex = data.length - 1;
                data.forEach((item,index)=>{
                    if(index < 3){
                        const { cameraInteract } = this.props.thisData.style;
                        this.interactData(cameraInteract,item);
                    }else{
                        const { cameraInteractThree } = this.props.thisData.style;
                        this.interactData(cameraInteractThree,item);
                    }
                });
            }else{
                if(global.nowShowPage === 8){
                    this.cameraIndex ++;
                }
                if(global.nowShowPage === 8 && this.cameraIndex%6 >= 3){
                    const { cameraInteractThree } = this.props.thisData.style;
                    this.interactData(cameraInteractThree,data);
                }else{
                    const { cameraInteract } = this.props.thisData.style;
                    this.interactData(cameraInteract,data);
                }
            }
        }
    }
    //作业票点击
    paperClick(data){
        const { paperInteract } = this.props.thisData.style;
        this.interactData(paperInteract,data);
    }
    //设备详情点击
    equipmentClick(data){
        const { equipmentInteract } = this.props.thisData.style;
        this.interactData(equipmentInteract,data);
    }

    //应急启动
    newEmergency(data){
        const { newEmergencyInteract } = this.props.thisData.style;
        this.interactData(newEmergencyInteract,data);
    }
    //应急详情
    showEmergency(data){
        const { showEmergencyInteract } = this.props.thisData.style;
        this.interactData(showEmergencyInteract,data);
    }

    //向iframe发送消息
    sendMessage(data){
        const iframe = document.getElementById('iframe_'+this.props.thisData.id);
        iframe.contentWindow.postMessage(data,'*');
    }

    render() {
        const {style,showStatus} = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.iframeContent} style={{fontSize,opacity,zIndex:this.props.editType ? 0 : ''}}>
                            <iframe id={'iframe_'+this.props.thisData.id} className={cssStyle.iframeContent} title="navigation" src={showStatus ? style.src:''} />
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}