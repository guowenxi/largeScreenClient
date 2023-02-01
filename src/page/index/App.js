import React from 'react';
import Emitter from '../../common/eventBus';
import DragBox from "./drag_box/drag_box";
import CanvasEdit from './edit_box/canvas_edit';
import ComponentEdit from "./edit_box/component_edit";

// import {bodyData} from "../../bodyData";

import {Scrollbars} from "react-custom-scrollbars";
import {Button, Modal} from 'antd';
import IntegerStep from "../../common/integerStep";
import ComponentList from "./component_list/component_list";
import util from "../../common/util";
import html2canvas from "html2canvas";
import axios from "axios";
import {rootUrl, fileUrl, displayUrl, aesKey, aesIv} from '../../config';
import CryptoJS from "crypto-js";
// import loadable from "../../common/loadable";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {paste:false,data: [], selectedIndex:-1,selectedPart:'canvas',boxData:{moduleName:'canvas'},scale:80,firstLoad:true};
        this.animateIndex = 0;
        //修改记录存储
        this.oldHistory = [];
        this.newHistory = [];
        //修改前数据存储
        this.oldBodyData = [];
        //记录是否有resize或drag
        this.hasMove = false;
        //是否为首次加载
        // this.firstLoad = true;
        global.editType = true;
        this.dynamicList = {};
    }

    componentDidMount() {
        this.saveRoadId();
        //注册事件监听
        this.event = Emitter.on('app_box', (data) => {
            this.receiveMessage(data)
        });
        //获取布局数据
        this.getBodyData();
        //监听键盘事件
        window.addEventListener('keydown',e => {
            const keyCode = e.key;
            const ctrlKey = e.ctrlKey || e.metaKey;
            if(ctrlKey && keyCode === 'z') {
                this.backHistory();
                e.preventDefault();
            }
            if(ctrlKey && keyCode === 'y') {
                this.goHistory();
                e.preventDefault();
            }
        });
    }

    componentWillUnmount() {
        if (this.event) {
            Emitter.removeListener('app_box', Emitter._events['app_box']);
        }
        document.removeEventListener('paste', this.pasteData);
    }

    saveRoadId(){
        global.roadIdAes = this.props.roadId;
        if(global.roadIdAes){
            const key = CryptoJS.enc.Latin1.parse(aesKey);
            const iv = CryptoJS.enc.Latin1.parse(aesIv);
            global.roadId = CryptoJS.AES.decrypt(decodeURIComponent(this.props.roadId), key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            }).toString(CryptoJS.enc.Utf8);
        }else{
            global.roadId = null;
        }
    }

    startPaste(){
        this.setState({paste:true});
        //绑定粘贴事件
        document.addEventListener('paste', this.pasteData);
    }

    //粘贴事件触发函数
    pasteData = (evt) => {
        const clipdata = evt.clipboardData || window.clipboardData;
        const pasteContent = clipdata.getData('text/plain');
        try{
            const newViewData = JSON.parse(pasteContent);
            this.addView(newViewData);
        }catch (e) {

        }
        //注销粘贴事件
        document.removeEventListener('paste', this.pasteData);
        this.setState({paste:false});
    };

    //添加组件
    addView(newViewData){
        //保存当前布局数据到历史记录
        this.saveNowDataToHistory();
        // 以时间戳设置组件id（之后改为uuid）
        newViewData.id = (new Date()).getTime();
        newViewData.nickName = newViewData.id;
        newViewData.moduleId = newViewData.id;
        newViewData.isAnimate = true;
        newViewData.sceneId = this.props.pageId;
        newViewData.orderNum = this.state.data.length + 1;
        newViewData.showStatus = true;
        delete newViewData.sysUserId;
        //组件主体
        if(this.dynamicList[newViewData.moduleName] == null){
            try {
                // this.dynamicList[newViewData.moduleName] = loadable(() => import(`../../components/${newViewData.moduleName}/${newViewData.moduleName}`));
                this.dynamicList[newViewData.moduleName] = require(`../../components/${newViewData.moduleName}/${newViewData.moduleName}`).default;
            }catch (e) {
            }
        }
        // 执行添加操作
        const {data} = this.state;
        data.push(newViewData);
        this.setState({data: data,selectedIndex:data.length-1,selectedPart:newViewData.id});
    }

    // 解析消息，新加或者实时修改组件展示
    receiveMessage(data) {
        switch (data.type) {
            case "addView":
                // 以组件名引入新组件默认数据
                const moduleName = data.moduleName;
                const defaultData = require(`../../components/${moduleName}/default_data`).default;
                const newViewData = JSON.parse(JSON.stringify(defaultData));
                this.addView(newViewData);
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
                this.changeComponentsShowStatus(true);
                break;
            case "changeComponentShowStatus":
                let components = this.state.data;
                for(let i = 0;i < components.length;i ++){
                    if(components[i].id === data.data.id){
                        components[i].showStatus = data.data.showStatus;
                        break;
                    }
                }
                this.setState({ data:components });
                break;
            default:
                break;
        }
    }

    // 设置主体展示
    getBodyData() {
        //从接口获取布局数据(现为直接获取测试数据bodyData
        axios.get(rootUrl + displayUrl + '/layoutModule/getSceneDetail',{params:{id:this.props.pageId}}).then((response) =>{
            // 在这儿实现 setState
            const result = response.data.data;
            let layer = [];
            try{
                layer = JSON.parse(result.layer);
            }catch (e) {}
            global.bodyWidth = result.width;
            global.bodyHeight = result.height;
            this.setState({boxData:{...result,moduleName:'canvas',layer}});
            this.getLayerShowStatus(layer);
            this.getComponents();
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //获取组件列表
    getComponents(){
        axios.get(rootUrl + displayUrl + '/layoutModule/getLayout',{params:{sceneId:this.props.pageId}}).then((response) =>{
            // 在这儿实现 setState
            let result = response.data.data;
            result.forEach((item,index) => {
                item.position = JSON.parse(item.position);
                item.style = JSON.parse(item.style);
                item.dataSources = JSON.parse(item.dataSources);
                if(this.dynamicList[item.moduleName] == null){
                    //组件主体
                    try {
                        // this.dynamicList[item.moduleName] = loadable(() => import(`../../components/${item.moduleName}/${item.moduleName}`));
                        this.dynamicList[item.moduleName] = require(`../../components/${item.moduleName}/${item.moduleName}`).default;
                    }catch (e) {
                    }
                }
            });
            this.setState({data:result});
            this.changeComponentsShowStatus();
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
                    axios.get(item.url,{params:{rbacToken:this.props.token}}).then((response) =>{
                        // 在这儿实现 setState
                        const result = response.data.data;
                        let subValue = item.value;
                        try {
                            subValue = JSON.parse(item.value);
                        }catch (e) {}
                        if(typeof(subValue) === 'object'){
                            item.show = (result && subValue.indexOf(result[item.key]) >= 0);
                        }else{
                            item.show = (result && result[item.key] + '' === item.value + '');
                        }
                        item.hasChange = true;
                        this.changeComponentsShowStatus(true);
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
        if (!data[this.animateIndex]) {
            this.setState({firstLoad:false});
            // this.firstLoad = false;
            return;
        }
        Emitter.emit(data[this.animateIndex].moduleId, {type: 'animateOn'});
        this.animateIndex++;
        if (this.animateIndex < data.length) {
            // setTimeout(() => this.startAnimate(), this.state.data[this.animateIndex - 1].delayTime);
            // this.startAnimate();
            setTimeout(() => this.startAnimate(), 10);
        }else{
            this.setState({firstLoad:false});
            // this.firstLoad = false;
            //获取组件缩略图
            // setTimeout(() => this.getImg(), 1200);
        }
    }

    //画布点击响应
    canvasClick(){
        //页面选中组件样式
        this.setState({selectedIndex:-1,selectedPart:'canvas'});
    }

    //组件点击响应
    partClick(index,e){
        e.stopPropagation();
        //页面选中组件样式
        this.setState({selectedIndex:index,selectedPart:this.state.data[index].id});
    }

    //组件大小变更
    resize(isLeft, isTop, lockX, lockY, e, id){
        const _this = this;
        const dragMinWidth = 100;
        const dragMinHeight = 100;
        //鼠标按下时组件大小位置
        const oParent = document.getElementById(id+'_drag');
        const iParentTop = oParent.offsetTop;
        const iParentLeft = oParent.offsetLeft;
        const iParentWidth = oParent.offsetWidth;
        const iParentHeight = oParent.offsetHeight;
        //鼠标按下时鼠标位置
        const disX = e.pageX;
        const disY = e.pageY;
        e.stopPropagation();
        //存储修改前数据
        this.saveNowData();
        document.onmousemove = function (event){
            _this.hasMove = true;
            //鼠标新位置
            let newX = event.pageX;
            let newY = event.pageY;
            let iL = (newX - disX)*100/_this.state.scale;  //left偏移量
            let iT = (newY - disY)*100/_this.state.scale;  //top偏移量
            //组件新left
            let newLeft = isLeft ? iParentLeft + iL : iParentLeft;
            //若鼠标超出容器左方则定义组件新left为0，且left偏移量为原组件的left
            if(newLeft < 0){
                newLeft = 0;
                iL = -iParentLeft;
            }
            //组件新top
            let newTop = isTop ? iParentTop + iT : iParentTop;
            //若鼠标超出容器上方则定义组件新top为0，且top偏移量为原组件的top
            if(newTop < 0){
                newTop = 0;
                iT = -iParentTop;
            }
            //新宽度计算
            let iW = isLeft ? iParentWidth - iL : iParentWidth + iL;
            const maxW = _this.state.boxData.width - oParent.offsetLeft;    //最大宽度
            iW < dragMinWidth && (iW = dragMinWidth);
            iW > maxW && (iW = maxW);
            //新高度计算
            let iH = isTop ? iParentHeight - iT : iParentHeight + iT;
            const maxH = _this.state.boxData.height - oParent.offsetTop;    //最大高度
            iH < dragMinHeight && (iH = dragMinHeight);
            iH > maxH && (iH = maxH);

            let thisData = _this.state.data;
            for(let i = 0;i < thisData.length;i ++){
                if(thisData[i].id === id){
                    //复制组件原位置
                    let newPosition = JSON.parse(JSON.stringify(thisData[i].position));
                    if(isLeft){
                        if(iW === dragMinWidth){
                            //若新宽度为拖拽最小宽度则固定组件left
                            newPosition.left = ((iParentLeft+iParentWidth-dragMinWidth)*100/_this.state.boxData.width).toFixed(2) + "%";
                        }else{
                            newPosition.left = (newLeft*100/_this.state.boxData.width).toFixed(2) + "%";
                        }
                    }
                    if(isTop){
                        if(iH === dragMinHeight){
                            //若新高度为拖拽最小高度则固定组件top
                            newPosition.top = ((iParentTop+iParentHeight-dragMinHeight)*100/_this.state.boxData.height).toFixed(2) + "%";
                        }else{
                            newPosition.top = (newTop*100/_this.state.boxData.height).toFixed(2) + "%";
                        }
                    }
                    lockX || (newPosition.width = (iW*100/_this.state.boxData.width).toFixed(2) + "%");
                    lockY || (newPosition.height = (iH*100/_this.state.boxData.height).toFixed(2) + "%");
                    thisData[i].position = newPosition;
                    thisData[i].updateTime = new Date().getTime();
                    break;
                }
            }
            _this.setState({data:thisData});
        };
        document.onmouseup = function ()
        {
            document.onmousemove = null;
            document.onmouseup = null;
            if(_this.hasMove){
                _this.saveHistory();
            }
            _this.hasMove = false;
        };
    }

    //组件位置变更
    drag(e, id){
        e.stopPropagation();
        //组件对象
        const oDrag = document.getElementById(id+'_drag');
        //鼠标按下时位置
        const disX = e.pageX;
        const disY = e.pageY;
        //组件原位置
        const oldLeft = oDrag.offsetLeft;
        const oldTop = oDrag.offsetTop;
        //存储修改前数据
        this.saveNowData();
        const _this = this;
        document.onmousemove = function (event){
            _this.hasMove = true;
            let iL = (event.pageX - disX)*100/_this.state.scale + oldLeft;    //组件新位置left
            let iT = (event.pageY - disY)*100/_this.state.scale + oldTop;    //组件新位置top
            const maxL = _this.state.boxData.width - oDrag.offsetWidth;
            const maxT = _this.state.boxData.height - oDrag.offsetHeight;
            iL <= 0 && (iL = 0);
            iT <= 0 && (iT = 0);
            iL >= maxL && (iL = maxL);
            iT >= maxT && (iT = maxT);
            let thisData = _this.state.data;
            for(let i = 0;i < thisData.length;i ++){
                if(thisData[i].id === id){
                    //复制组件原位置
                    let newPosition = JSON.parse(JSON.stringify(thisData[i].position));
                    //更新位置数据
                    newPosition.left = (iL*100/_this.state.boxData.width).toFixed(2) + '%';
                    newPosition.top = (iT*100/_this.state.boxData.height).toFixed(2) + '%';
                    thisData[i].position = newPosition;
                    thisData[i].updateTime = new Date().getTime();
                    break;
                }
            }
            _this.setState({data:thisData});
        };
        document.onmouseup = function ()
        {
            document.onmousemove = null;
            document.onmouseup = null;
            if(_this.hasMove){
                _this.saveHistory();
            }
            _this.hasMove = false;
        };
    }

    //记录当前数据
    saveNowData(){
        this.oldBodyData = {
            data: JSON.parse(JSON.stringify(this.state.data)),
            boxData: JSON.parse(JSON.stringify(this.state.boxData))
        };
    }

    //保存旧布局到历史记录
    saveHistory(){
        this.oldHistory.push(this.oldBodyData);
        this.newHistory = [];
    }

    //保存当前布局数据到历史记录
    saveNowDataToHistory(){
        this.saveNowData();
        this.saveHistory();
    }

    //撤销操作
    backHistory(){
        if(this.oldHistory.length > 0){
            const thisHistory = this.oldHistory.pop();
            this.saveNowData();
            this.newHistory.push(this.oldBodyData);
            this.updateStateWithSelected(thisHistory);
        }
    }

    //取消撤销操作
    goHistory(){
        if(this.newHistory.length > 0){
            const thisHistory = this.newHistory.pop();
            this.saveNowData();
            this.oldHistory.push(this.oldBodyData);
            this.updateStateWithSelected(thisHistory);
        }
    }

    //更新组件列表和选中组件状态
    updateStateWithSelected(thisHistory){
        //若当前选中为背景修改 或者 新布局数据长度和旧布局数据长度相同 则 只更新布局数据
        if(this.state.selectedIndex === -1 || thisHistory.data.length === this.state.data.length){
            this.setState(thisHistory);
        }else{
            //若当前选中为某组件修改 且 新布局数据长度和旧布局数据长度不同 则 同时更新当前选中组件顺序
            const selectedIndex = this.getSelectedIndex(thisHistory.data);
            if(selectedIndex === -1){
                this.setState({...thisHistory,selectedIndex:-1,selectedPart:'canvas'});
            }else{
                this.setState({...thisHistory,selectedIndex:selectedIndex});
            }
        }
    }

    //根据selectedPart获取选中组件index
    getSelectedIndex(data){
        let selectedIndex = -1;
        for(let i = 0;i < data.length;i ++){
            if(data[i].id === this.state.selectedPart){
                selectedIndex = i;
                break;
            }
        }
        return selectedIndex;
    }

    //获取兼容 展示/修改 两个状态下的 vh/vw 值
    getCompatibleSize(data,type){
        if(data == null || data === ''){
            return;
        }
        if(type && type === 'num'){
            if(data.indexOf('vh') > 0){
                return data.replace('vh','')*this.state.boxData.height/100;
            }else if(data.indexOf('vw') > 0){
                return data.replace('vw','')*this.state.boxData.width/100;
            }else{
                return parseFloat(data.replace(/[^\d.]/g,''));
            }
        }else{
            if(data.indexOf('vh') > 0){
                return data.replace('vh','')*this.state.boxData.height/100 + 'px';
            }else if(data.indexOf('vw') > 0){
                return data.replace('vw','')*this.state.boxData.width/100 + 'px';
            }else{
                return data;
            }
        }
    }

    //画布放大缩小
    changeScale(value){
        this.setState({scale:value});
    }

    //获取现有组件列表
    getComponentList(){
        const stateData = this.state.data;
        let componentList = [];
        stateData.forEach((item) => {
            componentList.push({
                nickName: item.nickName,
                id: item.moduleId
            });
        });
        return componentList;
    }

    //更新当前布局数据
    updateData(newData){
        if(this.state.selectedIndex === -1){
            global.bodyWidth = newData.width;
            global.bodyHeight = newData.height;
            this.setState({boxData:newData});
        }else{
            let thisData = this.state.data.slice();
            thisData[this.state.selectedIndex] = newData;
            this.setState({data:thisData});
        }
    }

    //修改组件顺序
    changeOrder(oldIndex,newIndex){
        const newData = util.reinsert(this.state.data,oldIndex,newIndex);
        this.setState({data:newData,selectedIndex:this.getSelectedIndex(newData)});
    }

    //删除组件
    deleteComponent(index){
        this.saveNowData();
        this.saveHistory();
        let {data} = this.state;
        data.splice(index,1);
        if('canvas' === this.state.selectedPart){
            //若当前选中为背景修改则直接修改布局数据
            this.setState({data});
        }else{
            //若当前选中为某组件修改 则 同时更新当前选中组件顺序
            const selectedIndex = this.getSelectedIndex(data);
            if(selectedIndex === -1){
                this.setState({data,selectedIndex:-1,selectedPart:'canvas'});
            }else{
                this.setState({data,selectedIndex:selectedIndex});
            }
        }
    }

    //复制组件
    copyComponent(){
        const newViewData = JSON.parse(JSON.stringify(this.state.data[this.state.selectedIndex]));
        this.addView(newViewData);
    }

    //获取组件缩略图
    getImg(id){
        let {data} = this.state;
        if(id != null){
            data.forEach((item) => {
                if(item.id === id){
                    this.html2canvasTodo(item,data);
                }
            });
        }else{
            data.forEach((item) => {
                this.html2canvasTodo(item,data);
            });
        }
    }

    //截图
    html2canvasTodo(item,data){
        if(document.getElementById(item.id+'_content') == null){
            return;
        }
        html2canvas(document.getElementById(item.id+'_content').firstElementChild).then((canvas) => {
            item.thumbnailUrl = canvas.toDataURL();
            this.setState({data});
        });
    }

    //根据moduleName获取当前选中组件的修改内容
    getEditPart(){
        const componentList = this.getComponentList();
        let editData;
        if(this.state.selectedIndex === -1){
            return (
                <CanvasEdit data={this.state.boxData} componentList={componentList} token={this.props.token}
                            updateData={this.updateData.bind(this)} saveNowDataToHistory={this.saveNowDataToHistory.bind(this)}
                            changeComponentsShowStatus={this.changeComponentsShowStatus.bind(this)}
                />
            );
        }else{
            editData = this.state.data[this.state.selectedIndex];
            const editName = editData.moduleName + '_edit';
            const DynamicDetails = require(`../../components/${editData.moduleName}/${editName}`).default;
            return (
                <ComponentEdit
                    data={editData} componentList={componentList} updateData={this.updateData.bind(this)}
                    saveNowDataToHistory={this.saveNowDataToHistory.bind(this)} layerList={this.state.boxData.layer}
                    changeComponentsShowStatus={this.changeComponentsShowStatus.bind(this)} copyComponent={this.copyComponent.bind(this)}
                >
                    <DynamicDetails
                        data={editData} updateData={this.updateData.bind(this)} saveNowDataToHistory={this.saveNowDataToHistory.bind(this)}
                        token={this.props.token} componentList={componentList} layerList={this.state.boxData.layer}
                    />
                </ComponentEdit>
            );
        }
    }

    //保存布局数据
    saveListData(){
        this.state.data.forEach((item,index) => item.orderNum = index);
        const sendData = {
            sceneId: this.props.pageId,
            moduleString: JSON.stringify(this.state.data),
            rbacToken: this.props.token
        };
        axios.post(rootUrl + displayUrl + '/layoutModule/updateModuleList',sendData).then((response) =>{
            if(response.data.success){
                Modal.success({
                    content: '保存成功。',
                });
            }else{
                Modal.error({
                    content: '保存失败！',
                });
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //保存布局数据
    savePartData(){
        let postUrl;
        let postData;
        if(this.state.selectedPart === 'canvas'){
            postUrl = rootUrl + displayUrl + '/layoutModule/updateScene';
            postData = this.state.boxData;
        }else{
            postUrl = rootUrl + displayUrl + '/layoutModule/updateModule';
            postData = this.state.data[this.state.selectedIndex];
        }
        axios.post(postUrl,postData,{params:{rbacToken:this.props.token}}).then((response) =>{
            if(response.data.success){
                Modal.success({
                    content: '保存成功。',
                });
            }else{
                Modal.error({
                    content: '保存失败！',
                });
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //根据图层是否显示控制组件显示隐藏
    changeComponentsShowStatus(needChange){
        // const data = JSON.parse(JSON.stringify(this.state.data));
        const data = this.state.data;
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
        const trans = this.state.scale < 100 ? -(100-this.state.scale)*100/(2*this.state.scale) : (this.state.scale - 100)*100/(2*this.state.scale);
        const { boxData } = this.state;
        const canvasStyle = {
            transform:'scale('+this.state.scale/100+') translate('+trans+'%,'+trans+'%)',
            width:boxData.width+'px',
            height:boxData.height+'px',
            backgroundColor:boxData.backgroundColor,
            backgroundImage:boxData.backgroundImage ? 'url('+fileUrl+'/download/'+boxData.backgroundImage+')' : 'none'
        };
        return (
            <div className='app-box' onClick={this.canvasClick.bind(this)}>
                {/*中间栏组件查看*/}
                <div className='canvas-box'>
                    <Scrollbars>
                        <div className='canvas-view' style={canvasStyle} id='canvas-view'>
                            {this.state.data.map((data,index) => {
                                const DynamicDetails = this.dynamicList[data.moduleName];
                                if(DynamicDetails){
                                    return (
                                        <DragBox key={data.id} thisData={data} isSelected={this.state.selectedIndex === index}
                                                 onPartClick={this.partClick.bind(this,index)} resize={this.resize.bind(this)} drag={this.drag.bind(this)} >
                                            <DynamicDetails token={this.props.token} thisData={data} getCompatibleSize={this.getCompatibleSize.bind(this)} firstLoad={this.state.firstLoad} isSelected={this.state.selectedIndex === index} editType={true}/>
                                            {/*<DynamicDetails token={'51c290c5724f4af5b6589463d819c142'} thisData={data} getCompatibleSize={this.getCompatibleSize.bind(this)} firstLoad={this.state.firstLoad} isSelected={this.state.selectedIndex === index} editType={true}/>*/}
                                        </DragBox>
                                    );
                                }else{
                                    return null;
                                }
                            })}
                        </div>
                    </Scrollbars>
                </div>
                {/*右栏编辑*/}
                <div className='edit-box' onClick={(e) => {e.stopPropagation()}}>
                    <Scrollbars>
                        {this.getEditPart()}
                    </Scrollbars>
                    <div className='save-button' onClick={this.savePartData.bind(this)}>保存</div>
                </div>
                {/*左栏*/}
                <div onClick={(e) => {e.stopPropagation()}}>
                    <IntegerStep className='scale-slider' step={5} min={20} max={180} onChange={this.changeScale.bind(this)} inputValue={this.state.scale} />
                    <ComponentList className='component-menu-box' componentList={this.state.data} changeOrder={this.changeOrder.bind(this)}
                                   saveNowData={this.saveNowData.bind(this)} saveHistory={this.saveHistory.bind(this)} saveListData={this.saveListData.bind(this)}
                                   selectedIndex={this.state.selectedIndex} onPartClick={this.partClick.bind(this)} deleteComponent={this.deleteComponent.bind(this)}/>
                </div>
                <Button type="dashed" className='paste-button' onClick={this.startPaste.bind(this)} >
                    {this.state.paste ? '按ctrl+v完成粘贴':'粘贴组件'}
                </Button>
            </div>
        );
    }
}
