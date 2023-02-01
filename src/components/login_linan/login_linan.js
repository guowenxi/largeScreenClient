import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./login_linan.module.css";
import {Motion, spring} from "react-motion";
import {Button, Checkbox, Modal} from "antd";
import cookie from 'react-cookies';
import axios from "axios";
import {createHashHistory} from "history";

import nameDefault from "./images/name_defult.svg";
import nameSelected from "./images/name_selected.svg";
import passwordDefault from "./images/password_defult.svg";
import passwordSelected from "./images/password_selected.svg";
import loginBox from "./images/kuang.png";
import CryptoJS from "crypto-js";
import {aesIv, aesKey} from "../../config";

export default class LoginLinan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false, opacity:0,userName:'',password:'',userNameSelected:false,passwordSelected:false,checked:false};
    }

    //组件加载触发函数
    componentDidMount() {
        this.initData();
        if(this.props.firstLoad === false){
            this.animateOn();
        }
        // //监听键盘事件
        // window.addEventListener('keydown',e => {
        //     const keyCode = e.key;
        //     if(keyCode === 'Enter') {
        //         this.login();
        //         e.preventDefault();
        //     }
        // });
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    initData(){
        const dataChange = cookie.load('dataChange');
        const userName = cookie.load('userName');
        const password = cookie.load('password');
        const checked = cookie.load('checked');
        const key = CryptoJS.enc.Latin1.parse(aesKey);
        const iv = CryptoJS.enc.Latin1.parse(aesIv);
        let data = {};
        if(userName){
            data.userName = !dataChange ? userName : CryptoJS.AES.decrypt(userName, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            }).toString(CryptoJS.enc.Utf8);
        }
        if(password){
            data.password = !dataChange ? password : CryptoJS.AES.decrypt(password, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            }).toString(CryptoJS.enc.Utf8);
        }
        if(checked){
            data.checked = checked;
        }
        this.setState(data);
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
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    changeInput(key,e){
        let data = {};
        data[key] = e.target.value;
        this.setState(data);
    }

    changeSelected(key,value){
        let data = {};
        data[key] = value;
        this.setState(data);
    }

    changeRemember(){
        this.setState({checked:!this.state.checked});
    }

    login(){
        const {style} = this.props.thisData;
        const {userName,password,checked} = this.state;
        if(!userName){
            Modal.error({
                content: "请输入用户名！",
            });
            return;
        }
        if(!password){
            Modal.error({
                content: "请输入密码！",
            });
            return;
        }
        const sendData = {};
        sendData[style.userName] = userName;
        sendData[style.password] = password;
        if(style.reportUrl){
            axios.post(style.reportUrl,{},{params:sendData}).then((response) =>{
                if(response.data.success){
                    if(checked){
                        const key = CryptoJS.enc.Latin1.parse(aesKey);
                        const iv = CryptoJS.enc.Latin1.parse(aesIv);
                        const changeUserName = style.encryption === 1 ? userName : CryptoJS.AES.encrypt(userName, key, {
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.ZeroPadding
                        }).toString();
                        const changePassword = style.encryption === 1 ? password : CryptoJS.AES.encrypt(password, key, {
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.ZeroPadding
                        }).toString();
                        cookie.save('userName',changeUserName,{secure:true});
                        cookie.save('password',changePassword,{secure:true});
                        cookie.save('checked',checked,{secure:true});
                        cookie.save('dataChange',true,{secure:true});
                    }else{
                        cookie.remove('userName');
                        cookie.remove('password');
                        cookie.remove('checked');
                    }
                    if(style.withToken === 2){
                        sessionStorage.setItem("rbacToken",response.data.data);
                        createHashHistory().push('/show/' + style.pageId +'/1');
                    }else{
                        createHashHistory().push('/show/' + style.pageId +'/'+ response.data.data);
                    }
                }else{
                    Modal.error({
                        content: response.data.data,
                    });
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    render() {
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity:opacity}}>
                            <div className={cssStyle.loginBox} >
                                <img alt={'loginBox'} src={loginBox}/>
                                <div className={cssStyle.title}>平安天目</div>
                                <div className={cssStyle.inputBox}>
                                    <img alt='' src={this.state.userNameSelected ? nameSelected : nameDefault} />
                                    <input value={this.state.userName} onChange={this.changeInput.bind(this,'userName')} onBlur={this.changeSelected.bind(this,'userNameSelected',false)} onFocus={this.changeSelected.bind(this,'userNameSelected',true)}/>
                                </div>
                                <div className={cssStyle.inputBox}>
                                    <img alt='' src={this.state.passwordSelected ? passwordSelected : passwordDefault} />
                                    <input value={this.state.password} type='password' onChange={this.changeInput.bind(this,'password')} onBlur={this.changeSelected.bind(this,'passwordSelected',false)} onFocus={this.changeSelected.bind(this,'passwordSelected',true)}/>
                                </div>
                                <Checkbox
                                    checked={this.state.checked}
                                    onChange={this.changeRemember.bind(this)}
                                    className={cssStyle.remember}
                                >
                                    记住密码
                                </Checkbox>
                                <Button type="primary" onClick={this.login.bind(this)} className={cssStyle.login}>登录</Button>
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}