import axios from "axios";
import {getQueryString} from "./util";

export function getData(callBack,dataSourcesMessage,keyParams,getDataType) {
    const dataSources = dataSourcesMessage ? dataSourcesMessage : this.props.thisData.dataSources;
    if(dataSources == null){
        callBack(null);
    }
    const {freshTime} = dataSources;
    if(this.refreshTimer){
        clearTimeout(this.refreshTimer);
    }
    if (freshTime && this.freshMode !== 'notFresh') {
        this.refreshTimer = setTimeout(() => {
            this.getData(callBack,dataSourcesMessage,keyParams,'freshData');
        }, freshTime);
    }
    if(getDataType === 'freshData' && this.props.thisData.showStatus === false){
        return;
    }
    if(dataSources.dataType === 1){
        let defaultData;
        try {
            defaultData = JSON.parse(dataSources.defaultData);
        }catch (e) {
        }
        callBack(defaultData,getDataType);
    }else if(dataSources.dataType === 2){
        let params = {};
        try {
            params = JSON.parse(dataSources.dataParams);
        }catch (e) {}
        if(dataSources.urlParams){
            dataSources.urlParams.forEach((item)=>{
                params[item] = getQueryString(item);
            });
        }
        if(!this.hasInitParams && this.keyParams && typeof(this.keyParams) === 'object'){
            if(dataSources.sessionData){
                // params.roadId = sessionStorage.getItem("roadId");
                if(global.roadId){
                    params[dataSources.sessionKey ? dataSources.sessionKey:'roadId'] = global.roadId
                }
            }
            for(let key in params){
                if(this.keyParams[key] == null){
                    this.keyParams[key] = params[key];
                }
            }
            this.hasInitParams = true;
        }
        const searchParams = keyParams ? keyParams : this.keyParams;
        for(let key in searchParams){
            params[key] = searchParams[key];
        }
        axios.get(dataSources.dataUrl+(dataSources.urlParamKey ? '/'+params[dataSources.urlParamKey]:''),{params:{...params,rbacToken:this.props.token}}).then((response) => {
            // 在这儿实现 setState
            callBack(response.data.data,getDataType);
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }
}