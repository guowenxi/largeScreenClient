import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./login_cangnan.module.css";
import {Motion, spring} from "react-motion";
import {Button, Checkbox, Modal} from "antd";
import cookie from 'react-cookies';
import axios from "axios";
import {createHashHistory} from "history";
import CryptoJS from "crypto-js";
import {aesKey,aesIv} from "../../config";

import nameDefault from "./images/name_defult.svg";
import nameSelected from "./images/name_selected.svg";
import nameLucheng from "./images/name_lucheng.png";
import nameTzmzx from "./images/name_tzmzx.png";
import passwordDefault from "./images/password_defult.svg";
import passwordSelected from "./images/password_selected.svg";
import passwordLucheng from "./images/password_lucheng.png";
import passwordTzmzx from "./images/password_tzmzx.png";
import loginBox from "./images/admin.png";
import kuangLucheng from "./images/kuang_lucheng.png";
import title from "./images/title.png";
import titleLonggang from "./images/title_longgang.png";
import titleYongjia from "./images/title_yongjia.png";
import titleRuian from "./images/title_ruian.png";
import titleLucheng from "./images/title_lucheng.png";
import titleYueqing from "./images/title_yueqing.png";
import titleWzjb from "./images/title_wzjb.png";
import titleLongwan from "./images/title_longwan.png";
import loginTypeOne from "./images/loginTypeOne.png";
import loginTypeTwo from "./images/loginTypeTwo.png";
import infoIcon from "./images/info.png";

import nameWencheng from './images/name_wencheng.png';
import passwordWencheng from './images/password_wencheng.png';
import kuangWencheng from './images/kuang_wencheng.png';

export default class LoginCangnan extends React.Component {
    constructor(props) {
        super(props);
        this.dingLogin = this.dingLogin.bind(this);
        this.state = {loginType:props.thisData.style.redirectUri?1:2,src:'',show:false, opacity:0,userName:'',password:'',userNameSelected:false,passwordSelected:false,checked:false};
        this.titleImg = {cangnan:title,longgang:titleLonggang,yongjia:titleYongjia,ruian:titleRuian,lucheng:titleLucheng,yueqing:titleYueqing,wzjb:titleWzjb,longwan:titleLongwan,tzmzx:null};
        this.titleClass = {yueqing:cssStyle.yueqingTitle,wzjb:cssStyle.wzjbTitle,wencheng: cssStyle.wenchengTitle,longwan:cssStyle.longwanTitle};
        this.bgClass = {yueqing:cssStyle.yueqingBg,tzmzx:cssStyle.tzmzxBg,wzjb:cssStyle.wzjbBg,wencheng: cssStyle.wenchengBg};
        this.boxCss = {cangnan:'',longgang:cssStyle.longgangBox,yongjia:cssStyle.yongjiaBox,ruian:cssStyle.ruianBox,lucheng:cssStyle.luchengBox,tzmzx:cssStyle.tzmzxBox,yueqing:cssStyle.luchengBox,wzjb:cssStyle.luchengBox, wencheng: cssStyle.wenchengBox, longwan: cssStyle.longwanBox};
        this.kuangImg={lucheng:kuangLucheng,tzmzx:'none',yueqing:kuangLucheng,wzjb:kuangLucheng,wencheng: kuangWencheng};
        this.nameIcon={lucheng:nameLucheng,tzmzx:nameTzmzx,yueqing:nameLucheng,wzjb:nameLucheng,wencheng: nameWencheng};
        this.passwordIcon={lucheng:passwordLucheng,tzmzx:passwordTzmzx,yueqing:passwordLucheng,wzjb:passwordLucheng,wencheng: passwordWencheng};
    }

    //组件加载触发函数
    componentDidMount() {
        const {style} = this.props.thisData;
        if(style.areaName === 'tzmzx'){
            window.addEventListener('message', this.dingLogin);
        }
        this.initData();
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        const {style} = this.props.thisData;
        if(style.areaName === 'tzmzx'){
            window.removeEventListener('message', this.dingLogin);
        }
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

    dingLogin(event){
        const {style} = this.props.thisData;
        if(style.redirectUri && event.data && event.data.code){
            const sendData = {
                corpid:style.corpid,
                // dingId:style.dingId,
                code:event.data.code
            };
            axios.get(style.redirectUri,{params:sendData}).then((response) =>{
                if(response.data.success){
                    if(style.areaName === 'wzjb'){
                        this.gotoPageWzjb(response.data.data);
                    }else{
                        if(style.gotoType === 2){
                            this.gotoPage(response.data.data,style.pageList,style.key);
                        }else{
                            this.changePage(style.pageId,response.data.data);
                        }
                    }
                }else{
                    Modal.error({
                        content: response.data.message,
                    });
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    login(){
        const {style} = this.props.thisData;
        let {userName,password,checked} = this.state;
        if(style.encryption === 1){
            const key = CryptoJS.enc.Latin1.parse(style.aesKey);
            const iv = CryptoJS.enc.Latin1.parse(style.aesIv);
            userName = CryptoJS.AES.encrypt(userName, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            }).toString();
            password = CryptoJS.AES.encrypt(password, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            }).toString();
        }
        const sendData = {};
        sendData[style.userName] = userName;
        sendData[style.password] = password;
        if(style.reportUrl){
            axios.post(style.reportUrl,sendData,{params:sendData}).then((response) =>{
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
                    if(style.areaName === 'wzjb'){
                        this.gotoPageWzjb(response.data.data);
                    }else{
                        if(style.gotoType === 2){
                            this.gotoPage(response.data.data,style.pageList,style.key);
                        }else{
                          console.log('pageId', style);
                          console.log('response', response);
                          console.log('style', style);
                            this.changePage(style.pageId,response.data.data,'',style);
                        }
                    }
                }else{
                    Modal.error({
                        content: response.data.message,
                    });
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    gotoPageWzjb(token){
        const menuUrl = '/fy-rbac/fyOpdataRight/getNextOneByPage?parentId=screen0101&offset=0&rows=4';
        // const menuUrl = './json/wzdsj/menuList.json';
        axios.get(menuUrl, { params: { rbacToken: token} }).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if (result && result.length > 0 && result[0]) {
                const wzjbPage = {
                    'screen010101':'515800d08e2b44e39cf6b5f891cfd466',
                    'screen010102':'0165e56164d248c3a25e678221060474',
                    'screen010103':'3a66508c026347d48c966556203fc0c0',
                    'screen010104':'0364b5fc49764fd1aef035e6c13c199f',
                    'screen010105':'275beb5f83e44b21823f187cd0969f6d',
                    'screen010106':'3d4c5e099c8b4feda00f6b09939a97b3',
                    'screen010107':'0080135e273e4a99b9d0fc6af3736aed',
                    'screen010108':'4ae820909d8641d6915ba919a66715f1',
                };
                this.changePage(wzjbPage[result[0].id],token);
            }else{
                Modal.error({
                    content: '请联系管理员添加访问权限！',
                });
            }
        }).catch(function (error) {
            // 处理请求出错的情况
        });
    }

    changePage(pageId,token,roadId,opt){
      console.log();
        if(opt.withToken === 2){
            sessionStorage.setItem("rbacToken",token);
        }
        if(pageId && pageId.indexOf('http') === 0){
            if(opt.withToken === 2){
                window.location.href = pageId;
            }else{
                window.location.href = pageId+(pageId.indexOf('?') > 0 ? '&' : '?')+'rbacToken='+token;
            }
        }else{
            const {style} = this.props.thisData;
            if(style.areaName === 'tzmzx'){
                const key = CryptoJS.enc.Latin1.parse(aesKey);
                const iv = CryptoJS.enc.Latin1.parse(aesIv);
                const roadIdAes = CryptoJS.AES.encrypt(roadId, key, {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.ZeroPadding
                }).toString();
                // 跳转方式为
                if (opt.gotoType === 1) {
                  // 判断温州 和其他大屏的特殊情况 返回的 数据格式不一致
                  let rbacToken = ''
                  if (token instanceof Object) {
                    rbacToken = token.rbacToken
                  } else {
                    rbacToken = token
                  }
                  createHashHistory().push('/show/' + pageId +'/'+ (opt.withToken === 2 ? '1':rbacToken) +'/'+ encodeURIComponent(roadIdAes));
                  return
                }
                createHashHistory().push('/show/' + pageId +'/'+ (opt.withToken === 2 ? '1':token) +'/'+ encodeURIComponent(roadIdAes));
            }else{
                createHashHistory().push('/show/' + pageId +'/'+ (opt.withToken === 2 ? '1':token));
            }
        }
    }

    gotoPage(message,pageList,key){
        const {style} = this.props.thisData;
        let loginInfo =  null;
        if(message){
            if(style.areaName === 'tzmzx'){
                loginInfo = message;
                sessionStorage.setItem("roadId",loginInfo.roadId);
            }else{
                loginInfo = message.loginInfo
            }
        }
        if(loginInfo){
            if(pageList && pageList.length > 0){
                const data = loginInfo[key];
                let hasSub = false;
                let otherPage;
                let otherPageItem;
                for(let i = 0;i < pageList.length;i ++){
                    switch(pageList[i].valueType){
                        case "1":
                            if(data == null || data === ''){
                                this.changePage(pageList[i].pageId,message.rbacToken,loginInfo.roadId,pageList[i]);
                                hasSub = true;
                            }
                            break;
                        case "2":
                            if(data != null && data !== ''){
                                this.changePage(pageList[i].pageId,message.rbacToken,loginInfo.roadId,pageList[i]);
                                hasSub = true;
                            }
                            break;
                        case "equal":
                            if(data+'' === pageList[i].value){
                                this.changePage(pageList[i].pageId,message.rbacToken,loginInfo.roadId,pageList[i]);
                                hasSub = true;
                            }
                            break;
                        case "notEqual":
                            if(data+'' !== pageList[i].value){
                                this.changePage(pageList[i].pageId,message.rbacToken,loginInfo.roadId,pageList[i]);
                                hasSub = true;
                            }
                            break;
                        case "like":
                            if(data && (typeof(data) === 'string' || Array.isArray(data)) && data.indexOf(pageList[i].value) >= 0){
                                this.changePage(pageList[i].pageId,message.rbacToken,loginInfo.roadId,pageList[i]);
                                hasSub = true;
                            }
                            break;
                        case "others":
                            otherPage = pageList[i].pageId;
                            otherPageItem = pageList[i];
                            break;
                        default:
                    }
                    if(hasSub){
                        break;
                    }
                }
                if(!hasSub){
                    if(otherPage){
                        this.changePage(otherPage,message.rbacToken,loginInfo.roadId,otherPageItem);
                    }else{
                        Modal.error({
                            content: '请联系管理员添加访问权限！',
                        });
                    }
                }
            }else{
                Modal.error({
                    content: '未配置登录成功后具体跳转页面！',
                });
            }
        }else{
            Modal.error({
                content: '未获取到用户信息！',
            });
        }
    }

    changeLoginType(){
        this.setState({loginType:this.state.loginType === 1?2:1});
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize ? style.fontSize : '2vh');
        const areaName = style.areaName ? style.areaName :'cangnan';
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={`${cssStyle.box} ${this.boxCss[areaName]} ${this.bgClass[areaName]} ${style.bgImg === 2 ? cssStyle.tzmzxBg2:''}`} style={{opacity:opacity,fontSize}}>
                            {this.titleImg[areaName] && <img alt={''} src={this.titleImg[areaName]} className={`${cssStyle.title} ${this.titleClass[areaName]}`} />}
                            {areaName === 'tzmzx' && style.bgImg === 2 && <div className={cssStyle.tzmzxTitle2} style={{fontSize:style.titleSize}}>{style.titleText}</div>}
                            <div className={cssStyle.loginBox} >
                                {this.kuangImg[areaName] !== 'none' && <img alt={'loginBox'} src={this.kuangImg[areaName]?this.kuangImg[areaName]:loginBox}/>}
                                <div className={cssStyle.inputBox}>
                                    <img alt='' src={this.state.userNameSelected ? (this.nameIcon[areaName]?this.nameIcon[areaName]:nameSelected) : (this.nameIcon[areaName]?this.nameIcon[areaName]:nameDefault)} />
                                    <input value={this.state.userName}  onChange={this.changeInput.bind(this,'userName')} onBlur={this.changeSelected.bind(this,'userNameSelected',false)} onFocus={this.changeSelected.bind(this,'userNameSelected',true)} placeholder={style.namePlaceholder} />
                                </div>
                                <div className={cssStyle.inputBox}>
                                    <img alt='' src={this.state.passwordSelected ? (this.passwordIcon[areaName]?this.passwordIcon[areaName]:passwordSelected) : (this.passwordIcon[areaName]?this.passwordIcon[areaName]:passwordDefault)} />
                                    <input value={this.state.password} type='password' onChange={this.changeInput.bind(this,'password')} onBlur={this.changeSelected.bind(this,'passwordSelected',false)} onFocus={this.changeSelected.bind(this,'passwordSelected',true)} placeholder={style.passwordPlaceholder} />
                                </div>
                                <Checkbox
                                    checked={this.state.checked}
                                    onChange={this.changeRemember.bind(this)}
                                    className={cssStyle.remember}
                                >
                                    记住密码
                                </Checkbox>
                                <Button type="primary" onClick={this.login.bind(this)} className={cssStyle.login}>登录</Button>
                                {areaName === 'tzmzx' && this.state.loginType === 2 && style.redirectUri && (
                                    <div className={cssStyle.infoBox}>
                                        <img alt={''} className={cssStyle.infoIcon} src={infoIcon} />
                                        <div>扫码登录更安全</div>
                                    </div>
                                )}
                                {areaName === 'tzmzx' && this.state.loginType === 1 && (style.redirectUri ? <iframe title={'浙政钉扫码登录'} className={cssStyle.loginCode} src={`https://login-pro.ding.zj.gov.cn/oauth2/auth.htm?response_type=code&client_id=${style.clientId}&redirect_uri=${style.redirectUri}&scope=get_user_info&authType=QRCODE&embedMode=true`} /> : <div className={cssStyle.loginCodeNo}>即将上线</div> )}
                                {areaName === 'tzmzx'&& style.redirectUri && <img alt={''} src={this.state.loginType === 1 ? loginTypeTwo:loginTypeOne} onClick={this.changeLoginType.bind(this)} className={cssStyle.loginType} /> }
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}