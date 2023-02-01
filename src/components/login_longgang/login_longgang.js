import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./login_longgang.module.css";
import {Motion, spring} from "react-motion";
import {Button, Checkbox, Modal} from "antd";
import cookie from 'react-cookies';
import axios from "axios";
import {createHashHistory} from "history";

import nameDefault from "./images/name.svg";
// import nameSelected from "./images/name_selected.svg";
import passwordDefault from "./images/password.svg";
// import passwordSelected from "./images/password_selected.svg";
import loginBox from "./images/kuang.png";

export default class LoginLonggang extends React.Component {
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
        const userName = cookie.load('userName');
        const password = cookie.load('password');
        const checked = cookie.load('checked');
        let data = {};
        if(userName){
            data.userName = userName;
        }
        if(password){
            data.password = password;
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
                        cookie.save('userName',userName);
                        cookie.save('password',password);
                        cookie.save('checked',checked);
                    }else{
                        cookie.remove('userName');
                        cookie.remove('password');
                        cookie.remove('checked');
                    }
                    createHashHistory().push('/show/' + style.pageId +'/'+ response.data.data);
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
                                <div className={cssStyle.title}>龙港市矛调中心研判平台</div>
                                <div className={cssStyle.inputBox}>
                                    <img alt='' src={nameDefault} />
                                    <input value={this.state.userName} onChange={this.changeInput.bind(this,'userName')} onBlur={this.changeSelected.bind(this,'userNameSelected',false)} onFocus={this.changeSelected.bind(this,'userNameSelected',true)} placeholder={'请输入用户名'}/>
                                </div>
                                <div className={cssStyle.inputBox}>
                                    <img alt='' src={passwordDefault} />
                                    <input value={this.state.password} type='password' onChange={this.changeInput.bind(this,'password')} onBlur={this.changeSelected.bind(this,'passwordSelected',false)} onFocus={this.changeSelected.bind(this,'passwordSelected',true)} placeholder={'请输入密码'}/>
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