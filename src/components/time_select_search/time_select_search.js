import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {Button, DatePicker, Select} from 'antd';

import ComponentBox from "../component_box";
import Emitter from "../../common/eventBus";
// import './date_picker_type_one.css';
import axios from "axios";
import cssStyle from './time_select_search.module.css';


moment.locale('zh-cn');

export default class TimeSelectSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false,resultData:[],selected:''};
        this.dateString = ['',''];
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(resolve)});
        if(this.props.firstLoad === false){
            this.animateOn();
        }
        const {style} = this.props.thisData;
        if(style.defaultValue != null){
            this.setState({selected:style.defaultValue});
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
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
        this.p.then(() => {
            this.setState({opacity:1});
        })
    }

    //重新获取数据
    reGetData(){
        this.setState({resultData:[]});
        this.getData();
    }

    //获取数据
    getData(resolve){
        if(this.props.thisData.dataSources.dataType === 1){
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            }catch (e) {
            }
            this.setState({resultData:defaultData});
            if(resolve){
                resolve(defaultData);
            }
        }else if(this.props.thisData.dataSources.dataType === 2){
            let params = {};
            try {
                params = JSON.parse(this.props.thisData.dataSources.dataParams);
            }catch (e) {}
            for(let key in this.keyParams){
                params[key] = this.keyParams[key];
            }
            axios.get(this.props.thisData.dataSources.dataUrl,{params:params}).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if(result){
                    this.setState({resultData:result});
                    if(resolve){
                        resolve(result);
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    onChange(date, dateString){
        this.dateString = dateString.slice();
    }

    getDefaultDate(){
        const {style} = this.props.thisData;
        if(!style.hasDefault){
            return [];
        }
        if(this.updateTime === style.updateTime){
            return this.defaultDate;
        }
        this.updateTime = style.updateTime;
        if(style.timeType === 1){
            if(style.endType === 'today'){
                const endData = moment(new Date());
                const sub = style.sub ? style.sub : 1;
                const startDate = endData.clone().subtract(sub,'months');
                this.dateString = [startDate.format('YYYY-MM-DD'),endData.format('YYYY-MM-DD')];
                this.defaultDate = [startDate,endData];
            }else{
                const endDateNextDay = moment(new Date()).add(style.endType === 'now' ? 1 : 1-style.last,'months').format('YYYY-MM')+'-01';
                const endData = moment(endDateNextDay).subtract(1,'days');
                const sub = style.sub ? style.sub : 1;
                const startDate = endData.clone().subtract(sub-1,'months').format('YYYY-MM')+'-01';
                this.dateString = [startDate,endData.format('YYYY-MM-DD')];
                this.defaultDate = [moment(startDate, 'YYYY-MM-DD'),endData];
            }
        }else{
            this.dateString = [style.startDate,style.endDate];
            this.defaultDate = [moment(style.startDate, 'YYYY-MM-DD'),moment(style.endDate, 'YYYY-MM-DD')];
        }
        return this.defaultDate;
    }

    sendMessage(){
        const {style} = this.props.thisData;
        const {interact} = this.props.thisData.dataSources;
        if(interact && interact.length > 0){
            interact.forEach((item) => {
                switch (item.type) {
                    case 1:
                        let remark = {};
                        if(item.remark){
                            try{
                                remark = JSON.parse(item.remark);
                            }catch (e) {}
                        }
                        let sendData = {};
                        sendData[style.startKey] = this.dateString[0] ? this.dateString[0]+' 00:00:00':'';
                        sendData[style.endKey] = this.dateString[1] ? this.dateString[1]+' 23:59:59':'';
                        sendData[style.selectKey] = this.state.selected;
                        Emitter.emit(item.receiveId,{type:'changeKey',data:{...remark,...sendData}});
                        break;
                    case 2:
                        break;
                    default:
                        break
                }
            });
        }
    }

    changeSelected(value){
        this.setState({selected:value});
    }

    render() {
        const {style} = this.props.thisData;
        const idKey = style.idKey ? style.idKey : 'id';
        const nameKey = style.nameKey ? style.nameKey : 'name';
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <div className={`${cssStyle.box} time-select-search-box`}>
                    <div>
                        <span className={cssStyle.title}>时间：</span>
                        <DatePicker.RangePicker key={style.updateTime} onChange={this.onChange.bind(this)} size={style.size} locale={locale} defaultValue={this.getDefaultDate()}/>
                    </div>
                    <div>
                        <span className={cssStyle.title}>区域：</span>
                        <Select value={this.state.selected} onChange={this.changeSelected.bind(this)} className={cssStyle.select}>
                            {this.state.resultData.map((item) =>
                                <Select.Option value={item[idKey]} key={item[idKey]}>{item[nameKey]}</Select.Option>
                            )}
                        </Select>
                    </div>
                    <Button type="primary" onClick={this.sendMessage.bind(this)}>
                        筛选
                    </Button>
                </div>
            </ComponentBox>
        );
    }
}