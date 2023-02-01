import React from "react";
import Emitter from '../../common/eventBus';
import axios from "axios";

// import loadable from "../../common/loadable";

import './show.css';

// import {bodyData} from "../../bodyData";
import {fileUrl, rootUrl, websocketUrl, displayUrl, aesKey, aesIv} from "../../config";
import {Scrollbars} from "react-custom-scrollbars";
import CryptoJS from "crypto-js";

export default class Show extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: [], boxData:{},firstLoad:true,zoom:1};
        this.scrollbars = React.createRef();
        this.animateIndex = 0;
        this.dynamicList = {};
        this.animateOnList = [];
        // this.token = systemArea === 'ruian' ? sessionStorage.getItem("rbacToken") : props.match.params.token;
    }

    componentDidMount() {
        this.saveRoadId();
        //获取布局数据
        this.getBodyData();
        //注册事件监听
        this.event = Emitter.on('app_box', (data) => {
            this.receiveMessage(data)
        });
        //注册页面大小变更触发函数
        window.addEventListener('resize', this.resize);
        //创建websocket链接
        this.createWebsocket();
        if(global.websocketId == null){
            //调用大屏软件显示函数
            this.showPage();
        }
    }

    componentWillUnmount() {
        if (this.event) {
            Emitter.removeListener('app_box', Emitter._events['app_box']);
        }
        window.removeListener('resize', this.resize);
        clearTimeout(this.resizeTimer);
    }

    //组件数据更新时触发函数
    componentDidUpdate(prevProps){
        if(this.props.match.params.roadId !== global.roadIdAes){
            this.saveRoadId();
        }
        if(prevProps.match.params.id !== this.props.match.params.id){
            // this.token = systemArea === 'ruian' ? sessionStorage.getItem("rbacToken") : this.props.match.params.token;
            // window.location.reload();
            //数据重置
            this.setState({data: [],firstLoad:true});
            this.dynamicList = [];
            this.animateOnList = [];
            this.animateIndex = 0;
            this.scrollbars.current.scrollTop(0);
            //获取布局数据
            this.getBodyData();
        }
    }

    saveRoadId(){
        global.roadIdAes = this.props.match.params.roadId;
        if(global.roadIdAes){
            const key = CryptoJS.enc.Latin1.parse(aesKey);
            const iv = CryptoJS.enc.Latin1.parse(aesIv);
            global.roadId = CryptoJS.AES.decrypt(decodeURIComponent(this.props.match.params.roadId), key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            }).toString(CryptoJS.enc.Utf8);
        }else{
            global.roadId = null;
        }
    }

    //创建websocket链接
    createWebsocket(){
        global.websocketId = this.props.match.params.websocketId;
        if(global.websocketId){
            global.bodyWebsocket = new WebSocket(websocketUrl+"/websocket/MessageTransmission?id="+global.websocketId+"_All_");
        }else{
            global.bodyWebsocket = new WebSocket(websocketUrl+"/websocket/MessageTransmission?id="+this.props.match.params.id+"_All_");
        }
        global.bodyWebsocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if(global.websocketId){
                global.websocketSender = message.websocketSender;
                global.moduleId = message.moduleId;
                const {data} = this.state;
                //将接收到的消息转发给组件
                data.forEach((item) => {
                    Emitter.emit(item.moduieId, message);
                });
            }else{
                if(message.type === 'hideWindow'){
                    const moduleId = message.data;
                    let components = this.state.data;
                    for(let i = 0;i < components.length;i ++){
                        if(components[i].moduleId === moduleId){
                            //显示指定组件
                            components[i].showStatus = false;
                            break;
                        }
                    }
                    this.setState({ data:components });
                }else{
                    Emitter.emit(message.moduleId, message);
                }
            }
        }
    }

    //页面大小变更触发函数
    resize = () =>{
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(()=>{
            const {boxData} = this.state;
            let bodyWidth;
            let bodyHeight;
            if(boxData.fitType === 1){
                bodyWidth = window.innerWidth;
                bodyHeight = window.innerHeight;
            }else if(boxData.fitType === 3){
                bodyWidth = boxData.width;
                bodyHeight = boxData.height;
            }else{
                const widthPer = boxData.width/window.innerWidth;
                const heightPer = boxData.height/window.innerHeight;
                if(widthPer >= heightPer){
                    bodyWidth = boxData.width/heightPer;
                    bodyHeight = window.innerHeight;
                }else{
                    bodyWidth = window.innerWidth;
                    bodyHeight = boxData.height/widthPer;
                }
            }
            global.bodyWidth = bodyWidth;
            global.bodyHeight = bodyHeight;
            // const zoom = window.innerWidth/boxData.width;
            // this.setState({zoom,bodyWidth,bodyHeight,data:this.state.data.slice()});
            this.setState({bodyWidth,bodyHeight,data:this.state.data.slice()});
            // console.log('bodyResize');
        },100);
    };

    showPage(){
        if(navigator.userAgent.indexOf("Chrome") < 0){
            if(window.external && window.external.hideCurrentBrowsers){
                window.external.hideCurrentBrowsers();
            }
        }else{
            if(typeof(jsOBJ) != "undefined"){
                // eslint-disable-next-line no-undef
                jsOBJ.hideCurrentBrowsers();
            }
        }
    }

    // 解析消息
    receiveMessage(data) {
        let components = this.state.data;
        switch (data.type) {
            case "addView":
                break;
            case "changeLayerShowStatus":
                let { boxData } = this.state;
                const result = data.data;
                boxData.layer.forEach((item) => {
                    if(result.showList && result.showList.indexOf(item.id) >= 0){
                        item.show = true;
                        item.hasChange = true;
                    }else if(result.hideList && result.hideList.indexOf(item.id) >= 0){
                        item.show = false;
                        item.hasChange = true;
                    }
                });
                this.changeComponentsShowStatus(null,true);
                break;
            case "changeComponentShowStatus":
                let layerId;
                for(let i = 0;i < components.length;i ++){
                    if(components[i].id === data.data.id){
                        //显示指定组件
                        components[i].showStatus = data.data.showStatus;
                        layerId = components[i].position.layerId;
                        break;
                    }
                }
                if(data.data.showStatus && layerId != null){
                    //隐藏同一图层内其他组件
                    components.forEach((item) => {
                        if(item.position.layerId === layerId && item.id !== data.data.id){
                            item.showStatus = false;
                        }
                    });
                }
                this.setState({ data:components });
                break;
            default:
                break;
        }
    }

    // 获取布局数据
    getBodyData() {
        //从接口获取布局数据
        axios.get(rootUrl + displayUrl + '/layoutModule/getSceneDetail',{params:{id:this.props.match.params.id}}).then((response) =>{
            // 在这儿实现 setState
            const result = response.data.data;
            this.token = result.tokenType === 2 ? sessionStorage.getItem("rbacToken") : this.props.match.params.token;
            let layer = [];
            try{
                layer = JSON.parse(result.layer);
            }catch (e) {}
            this.setState({boxData:{...result,moduleName:'canvas',layer}});
            this.getLayerShowStatus(layer);
            this.resize();
            if(result.checkUrl){
                axios.get(result.checkUrl,{params:{id:this.props.match.params.id,rbacToken:this.token}}).then((response) =>{
                    if(response.data.success && response.data.data){
                        this.getComponents(result.layoutUrl);
                    }else{
                        window.location.href = result.loginPage;
                    }
                }).catch(function(error){
                    // 处理请求出错的情况
                });
            }else{
                this.getComponents(result.layoutUrl);
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //获取组件列表
    getComponents(layoutUrl){
        const getLayoutUrl = layoutUrl ? layoutUrl : rootUrl + displayUrl + '/layoutModule/getLayout';
        axios.get(getLayoutUrl,{params:layoutUrl ? {}:{sceneId:this.props.match.params.id}}).then((response) =>{
            // 在这儿实现 setState
            let result = response.data.data;
            result.forEach((item,index) => {
                item.position = JSON.parse(item.position);
                item.style = JSON.parse(item.style);
                item.dataSources = JSON.parse(item.dataSources);
                //组件主体
                if(this.dynamicList[item.moduleName] == null){
                    try {
                        this.animateOnList[index] = true;
                        // this.dynamicList[item.moduleName] = loadable(() => import(`../../components/${item.moduleName}/${item.moduleName}`));
                        this.dynamicList[item.moduleName] = require(`../../components/${item.moduleName}/${item.moduleName}`).default;
                    }catch (e) {
                    }
                }
            });
            // this.setState({data:result});
            this.changeComponentsShowStatus(result);
            setTimeout(() => this.startAnimate(), 50);
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //获取图层显示状态
    getLayerShowStatus(layer){
        if(layer && layer.length > 0){
            layer.forEach((item)=>{
                if(item.showType === 2 && item.url && item.key){
                    axios.get(item.url,{params:{rbacToken:this.token}}).then((response) =>{
                        // 在这儿实现 setState
                        const result = response.data.data;
                        let subValue = item.value;
                        try {
                            subValue = JSON.parse(item.value);
                        }catch (e) {}
                        if(typeof(subValue) === 'object'){
                            item.show = (result && subValue.indexOf(result[item.key]) >= 0);
                        }else{
                            item.show = (result && result[item.key]  + '' === item.value + '');
                        }
                        item.hasChange = true;
                        this.changeComponentsShowStatus(null,true);
                    }).catch(function(error){
                        // 处理请求出错的情况
                    });
                }
            })
        }
    }

    // 组件开始动画并展示
    startAnimate() {
        let data = this.state.data;
        if (data[this.animateIndex]) {
            Emitter.emit(data[this.animateIndex].moduleId, {type: 'animateOn'});
            // this.animateOnList[this.animateIndex] = true;
            // this.setState({});
            this.animateIndex++;
            if (this.animateIndex < data.length) {
                this.startAnimate();
                // setTimeout(() => this.startAnimate(), 10);
                // setTimeout(() => this.startAnimate(), this.state.data[this.animateIndex - 1].delayTime);
            }else{
                this.setState({firstLoad:false});
            }
        }else{
            this.setState({firstLoad:false});
        }
    }

    //获取兼容 展示/修改 两个状态下的 vh/vw 值
    getCompatibleSize(data,type){
        if(data == null || data === ''){
            return;
        }
        if(type && type === 'num'){
            if(data.indexOf('vh') > 0){
                return data.replace('vh','')*this.state.bodyHeight/100;
            }else if(data.indexOf('vw') > 0){
                return data.replace('vw','')*this.state.bodyWidth/100;
            }else{
                return parseFloat(data.replace(/[^\d.]/g,''));
            }
        }else{
            return data;
        }
    }

    //根据图层是否显示控制组件显示隐藏
    changeComponentsShowStatus(result,needChange){
        // const data = JSON.parse(JSON.stringify(result ? result : this.state.data));
        const data = result ? result : this.state.data;
        let { boxData } = this.state;
        for(let j = 0;j < data.length;j ++){
            if(data[j].showStatus == null){
                data[j].showStatus = true;
            }
            if(data[j].position.layerId){
                for(let i = 0;i < boxData.layer.length;i ++){
                    if(((needChange && boxData.layer[i].hasChange) || !needChange) && boxData.layer[i].id === data[j].position.layerId){
                        data[j] = JSON.parse(JSON.stringify(data[j]));
                        data[j].showStatus = boxData.layer[i].show;
                        break;
                    }
                }
            }
        }
        boxData.layer.forEach((item) => {
            item.hasChange = false;
        });
        this.setState({ data });
    }

    render() {
        const { boxData } = this.state;
        // console.log(this.token);
        return (
            <Scrollbars className={'ScrollbarBody'} ref={this.scrollbars}>
                <div className='canvas' style={{zoom:this.state.zoom,backgroundColor:boxData.backgroundColor,backgroundImage:boxData.backgroundImage ? 'url('+fileUrl+'/download/'+boxData.backgroundImage+')' : 'none',width:this.state.bodyWidth,height:this.state.bodyHeight}}>
                    {this.state.data.map((data,index) => {
                        const DynamicDetails = this.dynamicList[data.moduleName];
                        // if(data.moduleName === 'three_pie'){
                        //     console.log(JSON.stringify(data));
                        // }
                        if(DynamicDetails){
                            return (
                                <div key={data.id} className='components_box'>
                                    <DynamicDetails style={data.position} token={this.token} thisData={data} getCompatibleSize={this.getCompatibleSize.bind(this)} firstLoad={!this.animateOnList[index] && this.state.firstLoad}/>
                                </div>
                            );
                        }else{
                            return null;
                        }
                    })}
                </div>
            </Scrollbars>
        );
    }
}