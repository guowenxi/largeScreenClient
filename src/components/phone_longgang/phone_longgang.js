import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./phone_longgang.module.css";
import {Motion, spring} from "react-motion";
// import "./plugin/jsencrypt.min.js";
// import "./plugin/jsWebControl-1.0.0.min.js";

import Emitter from "../../common/eventBus";
import closeIcon from "./images/close.svg";

export default class PhoneLonggang extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false,opacity:0,size:4,isMax:false};
        this.hasInit = false;
        this.initCount = 0;
        this.ocxWidth = 0;
        this.ocxHeight = 0;
        this.isShow = false;
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus){
            if(this.props.thisData.showStatus){
                //显示单兵控件
                this.oWebControl && this.oWebControl.JS_ShowWnd();
                this.isShow = true;
            }else{
                //隐藏单兵控件
                this.oWebControl && this.oWebControl.JS_HideWnd();
                this.isShow = false;
            }
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if (this.oWebControl != null){
            this.oWebControl.JS_HideWnd();   // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
            this.oWebControl.JS_Disconnect().then(function(){  // 断开与插件服务连接成功
                },
                function() {  // 断开与插件服务连接失败
                });
        }
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
            // eslint-disable-next-line no-fallthrough
            case "dataInterchange":
                if(!this.hasInit){
                    this.hasInit = true;
                    //初始化控件
                    this.initPlugin(()=>{
                        this.getDomSize();
                        this.oWebControl.JS_Resize(this.ocxWidth, this.ocxHeight);
                        this.oWebControl.JS_ShowWnd();
                        this.DoStartPlay(data.data.cameraId);
                        this.isShow = true;
                    });
                    // setTimeout(()=>{
                    // },150);
                }else{
                    if(this.oWebControl){
                        this.oWebControl.JS_ShowWnd();
                        if(!this.isShow){
                            this.isShow = true;
                        }
                        //接收数据/播放监控
                        this.DoStartPlay(data.data.cameraId);
                    }
                }
                break;
            default:
                break;
        }
    }

    //当前组件显示隐藏
    changeThisShow(type){
        if(!type && this.oWebControl){
            this.oWebControl.JS_HideWnd();
            this.isShow = false;
        }
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: {showStatus: type, id: this.props.thisData.id}
        });
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
        // this.initPlugin();
    }

    //获取组件宽高
    getDomSize(){
        this.ocxWidth = document.getElementById("playWnd").offsetWidth;
        this.ocxHeight = document.getElementById("playWnd").offsetHeight;
    }

    initPlugin(callBack){
        // eslint-disable-next-line no-undef
        this.oWebControl = new WebControl({
            szPluginContainer: "playWnd",                       // 指定容器id
            iServicePortStart: 15900,                           // 指定起止端口号，建议使用该值
            iServicePortEnd: 15909,
            szClassId:"23BF3B0A-2C56-4D97-9C03-0CB103AA8F11",   // 用于IE10使用ActiveX的clsid
            cbConnectSuccess: () => {                     // 创建WebControl实例成功
                this.oWebControl.JS_StartService("window", {         // WebControl实例创建成功后需要启动服务
                    dllPath: "./VideoPluginConnect.dll"         // 值"./VideoPluginConnect.dll"写死
                }).then(() => {                           // 启动插件服务成功
                    this.oWebControl.JS_CreateWnd("playWnd", this.ocxWidth, this.ocxHeight).then(() => { //JS_CreateWnd创建视频播放窗口，宽高可设定
                        this.init(callBack);  // 创建播放实例成功后初始化
                    });
                }, function () { // 启动插件服务失败
                });
            },
            cbConnectError: () => { // 创建WebControl实例失败
                this.oWebControl = null;
                alert("插件启动失败");
                // $("#playWnd").html("插件未启动，正在尝试启动，请稍候...");
                // eslint-disable-next-line no-undef
                WebControl.JS_WakeUp("VideoWebPlugin://"); // 程序未启动时执行error函数，采用wakeup来启动程序
                this.initCount ++;
                if (this.initCount < 3) {
                    setTimeout( () => {
                        this.initPlugin();
                    }, 3000)
                } else {
                    // $("#playWnd").html("插件启动失败，请检查插件是否安装！");
                }
            },
            cbConnectClose:  (bNormalClose) => {
                // 异常断开：bNormalClose = false
                // JS_Disconnect正常断开：bNormalClose = true
                console.log("cbConnectClose");
                this.oWebControl = null;
            }
        });
    }

    //获取公钥
    getPubKey (callback) {
        this.oWebControl.JS_RequestInterface({
            funcName: "getRSAPubKey",
            argument: JSON.stringify({
                keyLength: 1024
            })
        }).then( (oData) => {
            console.log(oData);
            if (oData.responseMsg.data) {
                this.pubKey = oData.responseMsg.data;
                callback()
            }
        })
    }

    //RSA加密
    setEncrypt (value) {
        // eslint-disable-next-line no-undef
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(this.pubKey);
        return encrypt.encrypt(value);
    }

    //初始化控件
    init(callBack){
        this.getPubKey( () => {
            const {style} = this.props.thisData;
            ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
            const appkey = style.userName;                           //综合安防管理平台提供的appkey，必填
            const secret = this.setEncrypt(style.secret);   //综合安防管理平台提供的secret，必填
            const ip = style.loginIp;                            //综合安防管理平台IP地址，必填
            const playMode = 0;                                  //初始播放模式：0-预览，1-回放
            const port = parseInt(style.loginPort);                                    //综合安防管理平台端口，若启用HTTPS协议，默认443
            // const appkey = "24141935";                           //综合安防管理平台提供的appkey，必填
            // const secret = this.setEncrypt("DK29RVUlSIqWfUwInQ6C");   //综合安防管理平台提供的secret，必填
            // const ip = "218.75.17.102";                            //综合安防管理平台IP地址，必填
            // const playMode = 0;                                  //初始播放模式：0-预览，1-回放
            // const port = 446;                                    //综合安防管理平台端口，若启用HTTPS协议，默认443
            const snapDir = "D:\\SnapDir";                       //抓图存储路径
            const videoDir = "D:\\VideoDir";                     //紧急录像或录像剪辑存储路径
            const layout = style.layout ? style.layout : "1x1";                                //playMode指定模式的布局
            const enableHTTPS = 1;                               //是否启用HTTPS协议与综合安防管理平台交互，是为1，否为0
            const encryptedFields = 'secret';					   //加密字段，默认加密领域为secret
            const showToolbar = 1;                               //是否显示工具栏，0-不显示，非0-显示
            const showSmart = 1;                                 //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
            const buttonIDs = "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769";  //自定义工具条按钮
            ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////

            this.oWebControl.JS_RequestInterface({
                funcName: "init",
                argument: JSON.stringify({
                    appkey: appkey,                            //API网关提供的appkey
                    secret: secret,                            //API网关提供的secret
                    ip: ip,                                    //API网关IP地址
                    playMode: playMode,                        //播放模式（决定显示预览还是回放界面）
                    port: port,                                //端口
                    snapDir: snapDir,                          //抓图存储路径
                    videoDir: videoDir,                        //紧急录像或录像剪辑存储路径
                    layout: layout,                            //布局
                    enableHTTPS: enableHTTPS,                  //是否启用HTTPS协议
                    encryptedFields: encryptedFields,          //加密字段
                    showToolbar: showToolbar,                  //是否显示工具栏
                    showSmart: showSmart,                      //是否显示智能信息
                    buttonIDs: buttonIDs                       //自定义工具条按钮
                })
            }).then( (oData) => {
                this.hasInit = true;
                callBack();
                // this.oWebControl.JS_Resize(1000, 600);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
            });
        });
    }

    //播放监控
    DoStartPlay(cameraId) {
        if(cameraId){
            let cameraIndexCode  = cameraId;     //获取输入的监控点编号值，必填
            const streamMode = 0;                                     //主子码流标识：0-主码流，1-子码流
            const transMode = 1;                                      //传输协议：0-UDP，1-TCP
            const gpuMode = 0;                                        //是否启用GPU硬解，0-不启用，1-启用
            const wndId = -1;                                         //播放窗口序号（在2x2以上布局下可指定播放窗口）

            cameraIndexCode = cameraIndexCode.replace(/(^\s*)/g, "");
            cameraIndexCode = cameraIndexCode.replace(/(\s*$)/g, "");

            this.oWebControl.JS_RequestInterface({
                funcName: "startPreview",
                argument: JSON.stringify({
                    cameraIndexCode:cameraIndexCode,                //监控点编号
                    streamMode: streamMode,                         //主子码流标识
                    transMode: transMode,                           //传输协议
                    gpuMode: gpuMode,                               //是否开启GPU硬解
                    wndId:wndId                                     //可指定播放窗口
                })
            })
        }
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
                                <div id="playWnd" className={cssStyle.playWnd} />
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}