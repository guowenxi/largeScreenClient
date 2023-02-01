import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {DatePicker, Icon} from 'antd';
import YearPicker from "../../common/yearPicker";

import ComponentBox from "../component_box";
import cssStyle from './antd_time_search_one.module.css';

import "../../common/css/antdDatePicker.css";
import {Motion, spring} from "react-motion";
import {getCompatibleSize, interactData} from "../../common/util";

moment.locale('zh-cn');

export default class AntdTimeSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false,resultData:[],selected:'',opacity:0,date:null};
        this.keyParams = {};
        this.dateString = ['',''];
        this.themeList = ['','theme-two','theme-three','theme-four','theme-five'];
        this.dropdownThemeList = ['','','drop-down-theme-three','',''];
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.firstLoad === false){
            this.animateOn();
        }
        this.getDefaultDate();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.thisData.updateTime !== this.props.thisData.updateTime) {
            this.getDefaultDate();
        }
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus && this.props.thisData.showStatus){
            //显示时马上发送数据
            if(this.state.date){
                this.sendMessage(this.state.date);
            }
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "showComponent"://显示当前组件
            case "changeKey" ://修改条件
                for(let key in data.data){
                    this.keyParams[key] = data.data[key];
                }
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    onChange(date){
        this.setState({date});
        this.sendMessage(date);
    }

    //初始化数据
    getDefaultDate(){
        const {style} = this.props.thisData;
        if(!style.hasDefault){
            return;
        }
        this.updateTime = style.updateTime;
        if(style.defaultType === 'now'){
            this.defaultDate = moment();
        }else if(style.defaultType === 'last'){
            if(style.timeType === 1){
                this.defaultDate = moment().subtract(1,'years');
            }else if(style.timeType === 2){
                this.defaultDate = moment().subtract(1,'months');
            }else if(style.timeType === 4){
                this.defaultDate = moment().subtract(1,'weeks');
            }else if(style.timeType === 5){
                this.defaultDate = moment().subtract(3,'months');
            }else{
                this.defaultDate = moment().subtract(1,'days');
            }
        }else{
            this.defaultDate = style.defaultDate ? moment(style.defaultDate):moment();
        }
        this.setState({date:this.defaultDate});
        setTimeout(()=>{
            if(style.firstSend){
                this.sendMessage(this.defaultDate);
            }
        });
    }

    sendMessage(date){
        const {interact} = this.props.thisData.dataSources;
        if(date){
            const {style} = this.props.thisData;
            let dateStr;
            if(style.format){
                dateStr = date.format(style.format);
            }else{
                if(style.timeType === 1){
                    dateStr = date.format('YYYY');
                }else if(style.timeType === 2 || style.timeType === 5){
                    dateStr = date.format('YYYY-MM');
                }else{
                    dateStr = date.format('YYYY-MM-DD');
                }
            }
            let sendData = {date:dateStr,id:dateStr,name:dateStr};
            if(style.dateArea){
                if(style.timeType === 1){
                    sendData.startDate = dateStr+'-01-01';
                    sendData.endDate = dateStr+'-12-31';
                }else if(style.timeType === 2){
                    sendData.startDate = dateStr+'-01';
                    sendData.endDate = dateStr+'-31';
                }else if(style.timeType === 4){
                    const clickDay = date.day();
                    sendData.startDate = moment(date).subtract(clickDay-1,'days').format('YYYY-MM-DD');
                    sendData.endDate = moment(date).add(7-clickDay,'days').format('YYYY-MM-DD');
                }
            }
            this.interactData(interact, sendData);
        }else{
            this.interactData(interact);
        }
    }

    getShowDate(){
        const {date} = this.state;
        const {style} = this.props.thisData;
        if(date){
            let dateStr;
            if(style.timeType === 1){
                dateStr = date.format('YYYY');
            }else if(style.timeType === 2){
                dateStr = date.format('YYYY-MM');
            }else{
                dateStr = date.format('YYYY-MM-DD');
            }
            const dateStrArr = dateStr.split('-');
            if(style.timeType === 5){
                return (
                    <div className={cssStyle.themeFiveBox}>
                        <Icon type="calendar" className={cssStyle.calendar}/>
                        <span className={cssStyle.underline}>{dateStrArr[0]}年</span>
                        <span>—</span>
                        <span className={cssStyle.underline}>{Math.ceil(dateStrArr[1]/3)}季度</span>
                        <Icon type="close-circle" className={cssStyle.clearTime}/>
                    </div>
                );
            }else{
                return (
                    <div className={cssStyle.themeFiveBox}>
                        <Icon type="calendar" className={cssStyle.calendar}/>
                        <span className={cssStyle.underline}>{dateStrArr[0]}年</span>
                        {style.timeType >= 2 && <span>—</span>}
                        {style.timeType >= 2 && <span className={cssStyle.underline}>{dateStrArr[1]}月</span>}
                        {style.timeType >= 3 && <span>—</span>}
                        {style.timeType >= 3 && <span className={cssStyle.underline}>{dateStrArr[2]}日</span>}
                        <Icon type="close-circle" className={cssStyle.clearTime}/>
                    </div>
                );
            }
        }else{
            let placeholder;
            if(style.timeType === 1){
                placeholder = '请选择年份';
            }else if(style.timeType === 2){
                placeholder = '请选择月份';
            }else if(style.timeType === 3){
                placeholder = '请选择日期';
            }else if(style.timeType === 4){
                placeholder = '请选择周';
            }else if(style.timeType === 5){
                placeholder = '请选择季度';
            }
            return (
                <div className={cssStyle.themeFiveBox}>
                    <Icon type="calendar" className={cssStyle.calendar}/>
                    <span className={cssStyle.underline}>{placeholder}</span>
                </div>
            );
        }
    }

    render() {
        const {style} = this.props.thisData;
        const theme = style.theme != null ? style.theme : 0;
        const fontSize = getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={`${cssStyle.box} ${this.themeList[theme]}`} style={{opacity,fontSize}}>
                            {style.timeType === 1 && <YearPicker dropdownClassName={this.dropdownThemeList[theme]} value={this.state.date} onChange={this.onChange.bind(this)} size={style.size} locale={locale} placeholder="请选择年份"/>}
                            {(style.timeType === 2 || style.timeType === 5) && <DatePicker.MonthPicker dropdownClassName={this.dropdownThemeList[theme]} value={this.state.date} onChange={this.onChange.bind(this)} size={style.size} locale={locale} placeholder="请选择月份" />}
                            {style.timeType === 3 && <DatePicker dropdownClassName={this.dropdownThemeList[theme]} value={this.state.date} onChange={this.onChange.bind(this)} size={style.size} locale={locale} placeholder="请选择日期" />}
                            {style.timeType === 4 && <DatePicker.WeekPicker dropdownClassName={this.dropdownThemeList[theme]} value={this.state.date} onChange={this.onChange.bind(this)} size={style.size} locale={locale} placeholder="请选择星期" />}
                            {style.theme === 4 && this.getShowDate()}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}