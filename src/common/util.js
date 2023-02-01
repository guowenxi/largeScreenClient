import Emitter from "./eventBus";
import {createHashHistory} from "history";
import {aesIv, aesKey, dataViewUrl} from "../config";
import React from "react";
import axios from "axios";
import {Modal} from "antd";
import CryptoJS from "crypto-js";

//获取总数
export function getSum(list){
    if(list){
        let sum = 0;
        list.forEach((item)=>{
            sum += parseFloat(item);
        });
        return sum;
    }else{
        return 0;
    }
}
//根据字段获取总数
export function getSumByKey(list,key){
    if(list){
        let sum = 0;
        list.forEach((item)=>{
            sum += parseFloat(item[key]);
        });
        return sum;
    }else{
        return 0;
    }
}
//获取最大值
export function getMaxNum(result,numKey){
    if(result && result.length > 0){
        let max = parseFloat(numKey ? result[0][numKey] : result[0].num);
        for(let i = 1;i < result.length;i ++){
            const thisData = parseFloat(numKey ? result[i][numKey] : result[i].num);
            if(max < thisData){
                max = thisData;
            }
        }
        return max;
    }else{
        return 0;
    }
}
//获取最小值
export function getMinNum(result,numKey){
    if(result && result.length > 0){
        let min = result[0][numKey];
        for(let i = 1;i < result.length;i ++){
            const thisData = parseFloat(numKey ? result[i][numKey] : result[i].num);
            if(min > thisData){
                min = thisData;
            }
        }
        return min;
    }else{
        return 0;
    }
}
//获取数组最小值
export function getArrayMin(list){
    if(list && list.length > 0){
        let min = list[0];
        list.forEach((item)=>{
            if(min > item){
                min = item;
            }
        });
        return min;
    }else{
        return 0;
    }
}
//获取多数组最小值
export function getArrayAllMin(list){
    if(list && list.length > 0){
        let min = getArrayMin(list[0]);
        list.forEach((item,index)=>{
            if(index !== 0){
                const thisMin = getArrayMin(item);
                if(min > thisMin){
                    min = thisMin;
                }
            }
        });
        return min;
    }else{
        return 0;
    }
}
//获取数组占比最小值
export function getArrayPerMin(dataList,maxList){
    if(dataList && dataList.length > 0 && maxList.length > 0){
        let min = 1;
        dataList.forEach((item,index)=>{
            const per = item/maxList[index];
            if(min > per){
                min = per;
            }
        });
        return min;
    }else{
        return 0;
    }
}
//获取多数组占比最小值
export function getArrayAllPerMin(dataList,maxList){
    if(dataList && dataList.length > 0 && maxList.length > 0){
        let min = 1;
        dataList.forEach((item)=>{
            const thisMin = getArrayPerMin(item,maxList);
            if(min > thisMin){
                min = thisMin;
            }
        });
        return min;
    }else{
        return 0;
    }
}
//获取最大值
export function getAllMaxNum(result){
    if(!result.xAxis){
        return 0;
    }
    let max = 0;
    if(result.legends && Array.isArray(result.legends) && (result.legends.length>1 || Array.isArray(result.series[0]))){
        result.series.forEach((item) => {
            item.forEach((number) => {
                const thisNum = parseFloat(number);
                if(thisNum > max){
                    max = thisNum;
                }
            });
        });
    }else{
        result.series.forEach((number) => {
            const thisNum = parseFloat(number);
            if(thisNum > max){
                max = thisNum;
            }
        });
    }
    return max;
}
//获取堆叠最大值
export function getStackMaxNum(result){
    if(!result.xAxis){
        return 0;
    }
    let max = 0;
    if(result.legends && result.legends.length>0){
        result.xAxis.forEach((item,index) => {
            let partNum = 0;
            result.series.forEach((number,i) => {
                partNum += parseFloat(result.series[i][index]);
            });
            if(max < partNum){
                max = partNum;
            }
        });
    }else{
        result.series.forEach((number) => {
            const thisNum = parseFloat(number);
            if(thisNum > max){
                max = thisNum;
            }
        });
    }
    return max;
}
//格式化获取的数据
export function dataFormat(result){
    if(!result.xAxis){
        return [];
    }
    let showData = [];
    result.xAxis.forEach((item,index) =>
        showData.push({
            name : item,
            id : result.ids && result.ids[index],
            num : result.series[index]
        })
    );
    return showData;
}
//数组内两个对象交换顺序
export function reinsert(arr, from, to) {
    const _arr = arr.slice(0);
    const val = _arr[from];
    _arr.splice(from, 1);
    _arr.splice(to, 0, val);
    return _arr;
}
//格式化时间
export function getCurrentTime() {
    const date = new Date();
    let yy = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM<10 && (MM = "0" + MM);
    let dd=date.getDate();
    dd<10 && (dd = "0" + dd);
    let hh=date.getHours();
    hh<10 && (hh = "0" + hh);
    let mm=date.getMinutes();
    mm<10 && (mm = "0" + mm);
    let ss=date.getSeconds();
    ss<10 && (ss = "0" + ss);
    const sss=date.getMilliseconds();
    return (yy + MM + dd + hh + mm + ss + sss);
}
//获取兼容 展示/修改 两个状态下的 vh/vw 值
export function getCompatibleSize(data,type){
    if(data == null || data === ''){
        return;
    }
    if(global.editType){
        if(type && type === 'num'){
            if(data.indexOf('vh') > 0){
                return data.replace('vh','')*global.bodyHeight/100;
            }else if(data.indexOf('vw') > 0){
                return data.replace('vw','')*global.bodyWidth/100;
            }else{
                return parseFloat(data.replace(/[^\d.]/g,''));
            }
        }else{
            if(data.indexOf('vh') > 0){
                return data.replace('vh','')*global.bodyHeight/100 + 'px';
            }else if(data.indexOf('vw') > 0){
                return data.replace('vw','')*global.bodyWidth/100 + 'px';
            }else{
                return data;
            }
        }
    }else{
        if(type && type === 'num'){
            if(data.indexOf('vh') > 0){
                return data.replace('vh','')*global.bodyHeight/100;
            }else if(data.indexOf('vw') > 0){
                return data.replace('vw','')*global.bodyWidth/100;
            }else{
                return parseFloat(data.replace(/[^\d.]/g,''));
            }
        }else{
            return data;
        }
    }
}

//数组格式化像素尺寸
export function getCompatibleSizeList(str,type) {
    try{
        const list = JSON.parse(str);
        const returnList = list.map((item) => {
            return getCompatibleSize(item,type);
        });
        return returnList.join(' ');
    }catch (e) {
        return getCompatibleSize(str,type);
    }
}
export function interactData(interact,clickItem,itemType, e) {
    if(this.interactDataItem == null){
        this.interactDataItem = interactDataItem.bind(this);
    }
    const selectedItem = {...clickItem,...this.interactParams};
    interact && interact.forEach((item) => {
        if(item.actionType !== 2){
            this.interactDataItem(item, selectedItem, itemType, e);
        }else{
            const baseItem = item.baseKeyType === 2 ? this.keyParams : selectedItem;
            if(baseItem && item.baseKey && item.baseList && item.baseList.length > 0){
                let otherAll;
                let hasSub = false;
                for(let i = 0;i < item.baseList.length;i ++){
                    if(item.baseList[i].valueType === '1' && (baseItem[item.baseKey] == null || baseItem[item.baseKey]+'' === '')){
                        this.interactDataItem(item.baseList[i], selectedItem, itemType, e);
                        hasSub = true;
                        break;
                    }else if(item.baseList[i].valueType === '2' && baseItem[item.baseKey] != null && baseItem[item.baseKey] !== ''){
                        this.interactDataItem(item.baseList[i], selectedItem, itemType, e);
                        hasSub = true;
                        break;
                    }else if(item.baseList[i].valueType === 'other' && baseItem[item.baseKey] == item.baseList[i].value){//eslint-disable-line
                        this.interactDataItem(item.baseList[i], selectedItem, itemType, e);
                        hasSub = true;
                        break;
                    }else if(item.baseList[i].valueType === 'otherAll'){
                        otherAll = item.baseList[i]
                    }
                }
                if(!hasSub && otherAll){
                    this.interactDataItem(otherAll, selectedItem, itemType, e);
                }
            }
        }
    });
}
function doRequest(item,sendData,token){
    if(item.requestType === 2){
        axios.post(item.requestUrl,{...sendData,rbacToken:token},{params:{rbacToken:token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: item.successMessage?item.successMessage:'请求成功。',
                });
            }else{
                Modal.error({
                    content: response.data.message,
                });
            }
        }).catch( (error) => {
            Modal.error({
                content: '请求出错！',
            });
        });
    }else{
        axios.get(item.requestUrl,{params:{...sendData,rbacToken:token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: item.successMessage?item.successMessage:'请求成功。',
                });
            }else{
                Modal.error({
                    content: response.data.message,
                });
            }
        }).catch(function(error){
            // 处理请求出错的情况
            Modal.error({
                content: '请求出错！',
            });
        });
    }
}
export function interactDataItem(item, selectedItem, itemType, e) {
    // if(item.receiveId === '1643095346305'){
    //     console.log(this.props.thisData);
    // }
    let sendData = {};
    try{
        sendData = JSON.parse(item.remark);
    }catch (e) {}
    if(this.defaultInteractData){
        sendData = {...sendData,...this.defaultInteractData};
    }
    let dataMessage = null;
    switch (item.type) {
        case 1:
        case 3:
        case 10:
        case 15:
            if(item.keyName && selectedItem != null){
                if(item.dataType === 3){
                    dataMessage = selectedItem[item.dataKeyName];
                }else{
                    if(itemType === 'charts'){
                        dataMessage = item.dataType === 1 ? this.state.data.ids[selectedItem.dataIndex] : selectedItem.name;
                    }else{
                        dataMessage = item.dataType === 1 ? selectedItem.id : selectedItem.name;
                    }
                }
                if(dataMessage == null){
                    dataMessage = '';
                }
                sendData[item.keyName] = item.dataStyle === 2 ? [dataMessage]:dataMessage;
            }
            item.message && item.message.forEach((messageItem)=>{
                let data;
                if(messageItem.dataSource === 2){
                    data = this.keyParams ? this.keyParams[messageItem.dataKey]:null;
                }else{
                    data = selectedItem == null ? null : selectedItem[messageItem.dataKey];
                }
                if(data == null){
                    data = '';
                }
                sendData[messageItem.messageKey] = messageItem.dataStyle === 2 ? [data]:data;
            });
            if(item.type === 15){
                doRequest(item,sendData,this.props.token)
            }else{
                let actionName;
                if(item.type === 1){
                    actionName = 'changeKey';
                }else if(item.type === 3){
                    actionName = 'showComponent';
                }else{
                    actionName = 'changeSelected';
                }
                Emitter.emit(item.receiveId,{type:actionName,data:sendData,isInteract:item.isInteract,reGetData:item.reGetData});
            }
            break;
        case 2:
            Emitter.emit(item.receiveId,{type:'deleteKey',data:sendData});
            break;
        case 4:
        case 11:
            item.message && item.message.forEach((messageItem)=>{
                let data;
                if(messageItem.dataSource === 2){
                    data = this.keyParams ? this.keyParams[messageItem.dataKey]:null;
                }else{
                    data = selectedItem == null ? null : selectedItem[messageItem.dataKey];
                }
                sendData[messageItem.messageKey] = messageItem.dataStyle === 2 ? [data]:data;
            });
            Emitter.emit(item.receiveId,{type:item.type===4?'dataInterchange':'messageSend',data:sendData});
            break;
        case 18:
            Emitter.emit(item.receiveId,{type:'resultDataInterchange',data:this.state.resultData});
            break;
        case 5:
            Emitter.emit(item.receiveId,{type:'reFresh',data:sendData});
            break;
        case 6:
            Emitter.emit(item.receiveId,{type:'changeLayerShow',data:sendData});
            break;
        case 21:
            logout(item.logoutUrl,this.props.token);
        // eslint-disable-next-line no-fallthrough
        case 7:
            item.message && item.message.forEach((messageItem)=>{
                let data;
                if(messageItem.dataSource === 2){
                    data = this.keyParams ? this.keyParams[messageItem.dataKey]:null;
                }else{
                    data = selectedItem == null ? null : selectedItem[messageItem.dataKey];
                }
                if(data == null){
                    data = '';
                }
                sendData[messageItem.messageKey] = messageItem.dataStyle === 2 ? [data]:data;
            });
            if(item.pageActionType === 1 && item.pageId){
                gotoOtherPage(item.pageId,this.props.token,item.goToType,sendData,item,selectedItem,{});
            }else if(item.pageActionType === 2 && item.pageKey && item.pageList && item.pageList.length > 0){
                for(let i = 0;i < item.pageList.length;i ++){
                    if(item.pageList[i].data+'' === selectedItem[item.pageKey]+'' && item.pageList[i].pageId){
                        gotoOtherPage(item.pageList[i].pageId,this.props.token,item.goToType,sendData,item,selectedItem,item.pageList[i]);
                        break;
                    }
                }
            }
            break;
        case 8:
            Emitter.emit('app_box', {
                type: 'changeLayerShowStatus',
                data: {showList: item.showList, hideList: item.hideList}
            });
            break;
        case 9:
            Emitter.emit(item.receiveId,{type:'hideComponent',data:sendData});
            break;
        case 12:
            Emitter.emit(item.receiveId,{type:'cancelSelect',data:sendData});
            break;
        case 13:
            if(item.urlKey && selectedItem[item.urlKey]){
                window.open(selectedItem[item.urlKey], selectedItem[item.titleKey], `height=${item.windowHeight ? item.windowHeight : 800}, width=${item.windowWidth ? item.windowWidth : 1600}, top=${item.windowTop ? item.windowTop : 140}, left=${item.windowLeft ? item.windowLeft : 160}, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no`)
            }
            break;
        case 14:
            this.setState({windowContent:item.windowType,windowMessage:{...item,...selectedItem},windowTheme:item.windowTheme});
            if(this.mapWindowfirstLoad){
                this.map.infoWindow.setContent(this.mapWindowBoxRef.current);
                this.mapWindowfirstLoad = false;
            }
            this.map.infoWindow.show(e.mapPoint);
            e.stopPropagation();
            break;
        case 16:
            Emitter.emit(item.receiveId,{type:'clearData'});
            break;
        case 17:
            Emitter.emit(item.receiveId,{type:'changeFreshMode',data:item.freshMode});
            break;
        case 19:
            Emitter.emit(item.receiveId,{type:'returnDefault'});
            break;
        case 20:
            Modal.info({
                content: item.remark,
            });
            break;
        default:
    }
}
function logout(logoutUrl,token){
    if(logoutUrl){
        axios.get(logoutUrl,{params:{rbacToken:token}}).then((response) => {
        }).catch(function(error){
        });
    }
}
export function gotoOtherPage(page,token,type,keyParams,item,data,pageItemSet){
    if(page){
        const {notWithMessage,areaIdKey,tokenType} = item;
        let areaIdAes;
        if(areaIdKey && data[areaIdKey] != null){
            const key = CryptoJS.enc.Latin1.parse(aesKey);
            const iv = CryptoJS.enc.Latin1.parse(aesIv);
            areaIdAes = CryptoJS.AES.encrypt(data[areaIdKey], key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            }).toString();
        }
        let url;
        if(page.indexOf('http') >= 0){
            if(notWithMessage){
                url = page;
            }else{
                let message = (page.indexOf('?') > 0?'&':'?') + (tokenType === 2 ? '':'rbacToken=' + token);
                // for(let key in sendData){
                //     message += '&'+key+'='+sendData[key];
                // }
                if(keyParams){
                    for(let key in keyParams){
                        message += `&${key}=${keyParams[key]}`;
                    }
                }
                let hashIndex = page.indexOf('#/');
                if(hashIndex > 0){
                    url = page.substr(0,hashIndex) + message + page.substr(hashIndex);
                }else{
                    url = page + message;
                }
            }
        }else{
            if(areaIdAes){
                url = (dataViewUrl.indexOf('http') >= 0 ? '':window.location.origin) + dataViewUrl + '#/show/' + page +'/'+ token + '/'+encodeURIComponent(areaIdAes);
            }else{
                url = (dataViewUrl.indexOf('http') >= 0 ? '':window.location.origin) + dataViewUrl + '#/show/' + page +'/'+ token;
            }
        }
        if(tokenType === 2){
            url = url.replace('{token}',token);
        }
        if(type === 2){
            if(typeof(jsOBJ) != "undefined"){
                const place = {
                    "top" : 0,
                    "left" : 0,
                    "width" : 1920,
                    "height" : 1080
                };
                // eslint-disable-next-line no-restricted-globals,no-undef
                jsOBJ.createVideo(1,page,place.top,place.left,place.width,place.height,1);
                setTimeout(function(){
                    // eslint-disable-next-line no-undef
                    jsOBJ.showVideo(1,true);
                },100);
            }else{
                console.log('请用大屏软件打开页面');
            }
        }else if(type === 3){
            const pageSize = {
                pageSizeSet:pageItemSet.pageSizeSet != null ? pageItemSet.pageSizeSet : item.pageSizeSet,
                windowHeight:pageItemSet.windowHeight || item.windowHeight,
                windowWidth:pageItemSet.windowWidth || item.windowWidth,
                windowTop:pageItemSet.windowTop || item.windowTop,
                windowLeft:pageItemSet.windowLeft || item.windowLeft,
            };
            if(pageSize.pageSizeSet){
                window.open(url, '', `height=${pageSize.windowHeight ? pageSize.windowHeight : 1920}, width=${pageSize.windowWidth ? pageSize.windowWidth : 1080}, top=${pageSize.windowTop ? pageSize.windowTop : 0}, left=${pageSize.windowLeft ? pageSize.windowLeft : 0}, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no`)
            }else{
                window.open(url);
            }
        }else{
            if(page.indexOf('http') >= 0){
                window.location.href = url;
            }else{
                if(areaIdAes){
                    createHashHistory().push('/show/' + page +'/'+ token+'/'+encodeURIComponent(areaIdAes));
                }else{
                    createHashHistory().push('/show/' + page +'/'+ token);
                }
            }
        }
    }
}
export function getColumnNum(style,resultData){
    const columnNum = style.columnNum ? style.columnNum : 1;
    const columnGap = style.columnGap ? style.columnGap : 0;
    const rowNum = style.rowNum ? style.rowNum : Math.ceil(resultData.length/columnNum);
    const rowGap = style.rowGap ? style.rowGap : 0;
    //计算多余个数
    const subNum = rowNum*columnNum - resultData.length;
    if(subNum >= 0){
        for(let i = 0;i < subNum;i ++){
            resultData.push('');
        }
        return {
            width: columnNum === 1 ? '100%' : (100 - columnGap*(columnNum - 1))/columnNum + '%',
            height: (100 - rowGap*(rowNum - 1))/rowNum + '%',
        };
    }else{
        if(style.scrollType === 'column'){
            if(subNum%columnNum !== 0){
                for(let i = 0;i < columnNum + (subNum%columnNum);i ++){
                    resultData.push('');
                }
            }
            const newRowNum = resultData.length/columnNum;
            return {
                width: columnNum === 1 ? '100%' : (100 - columnGap*(columnNum - 1))/columnNum + '%',
                height: (100 - rowGap*(newRowNum - 1))/newRowNum + '%',
            };
        }else{
            if(subNum%rowNum !== 0){
                for(let i = 0;i < rowNum + (subNum%rowNum);i ++){
                    resultData.push('');
                }
            }
            const newColumnNum = resultData.length/rowNum;
            return {
                width: (100 - columnGap*(newColumnNum - 1))/newColumnNum + '%',
                height: (100 - rowGap*(rowNum - 1))/rowNum + '%',
            };
        }
    }
}
export function getLinearBackground(colorList,angle){
    const gradientAngle = angle == null ? 180:angle;
    let background = "";
    if(colorList && colorList.length > 0){
        background = 'linear-gradient('+gradientAngle+'deg,';
        colorList.forEach((item,index) => {
            background += item.color + ' ' + item.percent + '%' + (index < colorList.length - 1 ? ',':'');
        });
        background += ')';
    }
    return background;
}
export function getRadialBackground(colorList){
    let background = "";
    if(colorList && colorList.length > 0){
        background = 'radial-gradient(ellipse,';
        colorList.forEach((item,index) => {
            background += item.color + ' ' + item.percent + '%' + (index < colorList.length - 1 ? ',':'');
        });
        background += ')';
    }
    return background;
}
export function getItemColor(item,data,index){
    let color;
    if(item.fontColorType === 1){
        color = item.fontColor;
    }else if(item.fontColorType === 2){
        item.fontColorList.forEach((colorItem) => {
            if(colorItem.num == data[item.fontColorKey]){//eslint-disable-line
                color = colorItem.color;
            }
        });
    }else{
        item.fontColorList.forEach((colorItem) => {
            if((index+1) >= colorItem.bottom && (index+1) < colorItem.top){
                color = colorItem.color;
            }
        });
    }
    return color;
}
export function getTypeImage(imgTypeList,value){
    for (let i = 0;i < imgTypeList.length;i ++){
        if(value+'' === imgTypeList[i].value+''){
            return imgTypeList[i].url;
        }
    }
    return '';
}
export function getTypeImageEx(imgTypeList,value,calculateType){
    if(imgTypeList && imgTypeList.length > 0){
        if(calculateType === 2){
            for (let i = 0;i < imgTypeList.length;i ++){
                if(parseFloat(value) >= parseFloat(imgTypeList[i].more) && parseFloat(value) < parseFloat(imgTypeList[i].less)){
                    return imgTypeList[i].url;
                }
            }
        }else{
            for (let i = 0;i < imgTypeList.length;i ++){
                if(value+'' === imgTypeList[i].value+''){
                    return imgTypeList[i].url;
                }
            }
        }
    }
    return '';
}
export function changeComponentShow(type){
    Emitter.emit('app_box', {
        type: 'changeComponentShowStatus',
        data: {showStatus: type, id: this.props.thisData.id}
    });
}

export function getNumberFormatter(numSplitShow,numFixed,value){
    if(typeof (value) === 'number' || (parseFloat(value) && parseFloat(value).toString().length === value.length)){
        let returnValue = parseFloat(value);
        if(numFixed != null){
            returnValue = returnValue.toFixed(numFixed);
        }
        if(numSplitShow){
            returnValue = returnValue.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
        }
        return returnValue;
    }else {
        return value;
    }
}

export function getSpecialNumContent(content,specialClass) {
    if(content){
        const numList = content.match(/\d+/g);
        if(numList == null){
            return content;
        }else{
            let result = [];
            let reasonRemain = content;
            numList.forEach((num)=>{
                const numIndex = reasonRemain.indexOf(num);
                reasonRemain = reasonRemain.replace(num,'');
                result.push(reasonRemain.substr(0,numIndex));
                result.push(<span className={specialClass}>{num}</span>);
                reasonRemain = reasonRemain.substr(numIndex);
            });
            result.push(reasonRemain);
            return result.map((item,index)=>
                <React.Fragment key={index}>
                    {item}
                </React.Fragment>
            );
        }
    }else{
        return '';
    }
}

export function getQueryString(name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

// 获取地址栏参数 code
export function getQuery(val) {
  const url = window.location.href
  const w = url.indexOf('?');
  const query = url.substring(w + 1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === val && pair[1]) {
      let data = pair[1]
      if (data.indexOf('#/') >= 0) {
        data = data.split('#/')[0];
      }
      return data;
    }
  }
  return (false);
}
export default {
    "getSum" : getSum,
    "getMaxNum": getMaxNum,
    "getAllMaxNum": getAllMaxNum,
    "getStackMaxNum": getStackMaxNum,
    "dataFormat" : dataFormat,
    "reinsert" : reinsert,
    "getCurrentTime" : getCurrentTime,
    "getCompatibleSizeList" : getCompatibleSizeList,
    "interactData" : interactData,
    "getQuery" : getQuery
}