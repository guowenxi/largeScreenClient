import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./iframe_content.module.css";
import {Motion, spring} from "react-motion";
import {getCompatibleSize, interactData} from "../../common/util";
import {fileUrl} from "../../config";
import axios from "axios";
import {Modal} from "antd";
import Emitter from "../../common/eventBus";

export default class IframeContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newSrc:'',show:false,opacity:0,token:''};
        this.interactData = interactData.bind(this);
        this.keyParams = {};
        this.iframeChildMessage = this.childMessage.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        window.addEventListener('message',this.iframeChildMessage);
        this.login();
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        window.removeEventListener('message',this.iframeChildMessage);
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
                const {style} = this.props.thisData;
                if(style.clearParams){
                    this.keyParams = {};
                }
                let newSrc = this.state.newSrc;
                for (let key in data.data) {
                    if(key === 'newSrc'){
                        newSrc = data.data.newSrc;
                    }else{
                        this.keyParams[key] = data.data[key];
                    }
                }
                this.setState({newSrc});
                break;
            case "showComponent":
                //显示当前组件
                Emitter.emit('app_box', {
                    type: 'changeComponentShowStatus',
                    data: { showStatus: true, id: this.props.thisData.id }
                });
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    //iframe消息发送
    childMessage(e){
        // console.log(e.data);
        const data = e.data;
        switch (data.type) {
            case "closeSend":
                Emitter.emit('app_box', {
                    type: 'changeComponentShowStatus',
                    data: { showStatus: false, id: this.props.thisData.id }
                });
                break;
            case "other":
                break;
            default:
                break;
        }
    }

    //
    login(){
        const {style} = this.props.thisData;
        if(style.needLogin){
            // let sendData = {};
            // sendData[style.userNameKey] = style.userName;
            // sendData[style.passwordKey] = style.password;
            let fd = new FormData();
            fd.append(style.userNameKey,style.userName);
            fd.append(style.passwordKey,style.password);
            axios.post(style.loginUrl, fd).then((response) => {
                if(response.data.success){
                    const result = response.data.data;
                    this.setState({token:result[style.tokenDataKey]});
                }else{
                    Modal.error({
                        content: response.data.msg,
                    });
                }
            }).catch(function (error) {
            });
        }
    }

    addToken(url,key,token){
        let returnUrl;
        if(url.indexOf('?') >= 0){
            returnUrl = url  + '&'+key+'='+(token ? token : this.props.token);
        }else{
            returnUrl = url + '?'+key+'='+(token ? token : this.props.token);
        }
        for(let key in this.keyParams){
            returnUrl += '&'+key+'='+this.keyParams[key];
        }
        return returnUrl;
    }

    iconClick(){
        const {iconInteract} = this.props.thisData.style;
        this.interactData(iconInteract);
    }

    render() {
        const {style,showStatus} = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        let {src,tokenKey} = style;
        if(this.state.newSrc){
            src = this.state.newSrc;
        }
        if(style.needLogin){
            const {token} = this.state;
            if(token){
                src = this.addToken(src,tokenKey,token);
            }
        }else{
            if(style.token){
                if(style.tokenType === 1){
                    if(src.indexOf('#') >= 0){
                        const urlPart = src.split('#');
                        src = this.addToken(urlPart[0],tokenKey) + '#' + urlPart[1];
                    }else{
                        src = this.addToken(src,tokenKey);
                    }
                }else{
                    src += '/'+this.props.token;
                }
            }
        }
        const iconStyle = {};
        if(style.iconShow && style.icon){
            style.iconWidth != null && (iconStyle.width = style.iconWidth + 'em');
            style.iconHeight != null && (iconStyle.height = style.iconHeight + 'em');
            style.iconLeft != null && (iconStyle.left = style.iconLeft + 'em');
            style.iconRight != null && (iconStyle.right = style.iconRight + 'em');
            style.iconTop != null && (iconStyle.top = style.iconTop + 'em');
            style.iconBottom != null && (iconStyle.bottom = style.iconBottom + 'em');
        }
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.iframeContent} style={{fontSize,opacity,zIndex:this.props.editType ? 0 : ''}}>
                            <iframe className={cssStyle.iframeContent} title="navigation" src={style.hideLoad ? src:(showStatus ? src:'')} />
                            {style.iconShow && style.icon && <img style={iconStyle} alt='' src={fileUrl + '/download/' + style.icon} className={cssStyle.icon} onClick={this.iconClick.bind(this)} />}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}