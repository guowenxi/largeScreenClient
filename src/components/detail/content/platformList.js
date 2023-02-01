import React from "react";
import cssStyle from "./platformList.module.css";
import {getCompatibleSize, interactData} from "../../../common/util";
import {Motion, spring} from "react-motion";

import backgroundImg from "../images/platformListBg.png";
import eventHandleOne from "../images/eventHandleOne.png";
import eventDetail from "../images/eventDetail.png";
import eventHandleTwo from "../images/eventHandleTwo.png";
import {Modal, Tooltip} from "antd";

import HandleEditOne from "./handleEditOne";
import axios from "axios";

const { confirm } = Modal;

export default class PlatformList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {small:false,smallType:0,showEdit:false,isReport:false};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.timer){
            clearTimeout(this.timer);
        }
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus && !this.props.showStatus){
            this.setState({small:false,isReport:false});
        }
    }

    platformClick(platform){
        if(platform && JSON.stringify(platform) !== '{}'){
            this.setState({small:true,smallType:platform.type});
            this.timer = setTimeout(()=>{
                const {interact} = this.props.thisData.dataSources;
                this.interactData(interact,platform);
            },300);
        }
    }

    getBoxSize(){
        const {small,smallType} = this.state;
        if(small){
            if(smallType === 3){
                return {scale:0.7,left:38,top:-4};
            }else{
                return {scale:0.7,left:42,top:-17};
            }
        }else{
            return {scale:1,left:0,top:0};
        }
    }

    eventHandle(){
        const {handleInteract} = this.props.thisData.style;
        this.interactData(handleInteract);
    }

    eventDetail(){
        const {detailInteract} = this.props.thisData.style;
        this.interactData(detailInteract);
    }

    //转入四平台按钮点击交互
    eventHandleTwo(isFourPlatform){
        if(!isFourPlatform){
            //非四平台事件显示编辑内容
            this.setState({showEdit:true});
        }else{
            this.turnTo();
        }
    }

    //隐藏转入编辑
    hideHandleEdit(){
        this.setState({showEdit:false});
    }

    //调用转入四平台接口
    turnTo(detail){
        confirm({
            title: '是否确定将该事件转入四平台？',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    ...detail,
                    id:this.props.keyParams.id,
                    rbacToken:this.props.token
                };
                // console.log(sendData);
                return new Promise((resolve) => {
                    axios.post("/fyPeaceConstruct/dataDocking/handleEventToPlatform",sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '已成功转入四平台。',
                            });
                            this.setState({showEdit:false,isReport:true});
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch( (error) => {
                        resolve();
                        Modal.error({
                            content: '转入四平台请求出错！',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    render() {
        const { detail } = this.props;
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const size = this.getBoxSize();
        return (
            <div
                className={`${cssStyle.box}`}
                style={{ ...this.props.style, backgroundColor: style.bgColor, fontSize }}
            >
                <Motion style={{scale: spring(size.scale),left: spring(size.left),top: spring(size.top)}}>
                    {({scale,left,top}) => {
                        return (
                            <div style={{transform: `scale(${scale})`,left:left+'%',top:top+'%'}} className={cssStyle.content}>
                                <img alt={''} src={backgroundImg} className={cssStyle.backgroundImg} />
                                {/*<div className={cssStyle.title}>*/}
                                {/*    {detail.title}*/}
                                {/*</div>*/}
                                <Tooltip title={detail.title} className={cssStyle.title}>
                                    {detail.title}
                                </Tooltip>
                                {detail.platformList && detail.platformList.map((platform,index)=>{
                                    if(index === 4){
                                        if(platform && platform.name){
                                            const platformName = platform.name.split('_');
                                            return (
                                                <div key={index} className={cssStyle.platform} onClick={this.platformClick.bind(this,platform)}>
                                                    <div>{platformName[0]}</div>
                                                    <div>{platformName[1]}</div>
                                                </div>
                                            );
                                        }else{
                                            return null;
                                        }
                                    }else{
                                        return (
                                            <div key={index} className={cssStyle.platform} onClick={this.platformClick.bind(this,platform)}>{platform.name}</div>
                                        );
                                    }
                                })}
                                {detail.isEmphase == null && <img alt={''} src={eventHandleOne} className={cssStyle.eventHandle} onClick={this.eventHandle.bind(this)}/>}
                                {detail.isEmphase === 1 && <img alt={''} src={eventDetail} className={cssStyle.eventHandle} onClick={this.eventDetail.bind(this)}/>}
                                {(!detail.isReport && !this.state.isReport) && <img alt={''} src={eventHandleTwo} className={cssStyle.eventHandleTwo} onClick={this.eventHandleTwo.bind(this,detail.isFourPlatform)}/>}
                                <HandleEditOne token={this.props.token} show={this.state.showEdit} detail={detail} turnTo={this.turnTo.bind(this)} hideHandleEdit={this.hideHandleEdit.bind(this)}  />
                            </div>
                        )
                    }}
                </Motion>
            </div>
        );
    }
}