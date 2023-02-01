import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {DatePicker} from 'antd';

import ComponentBox from "../component_box";
import Emitter from "../../common/eventBus";
import './date_picker_type_one.css';


moment.locale('zh-cn');

export default class BoxTypeTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false};
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.firstLoad === false){
            this.animateOn();
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
    }

    onChange(date, dateString){
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
                        sendData[style.startKey] = dateString[0]+' 00:00:00';
                        sendData[style.endKey] = dateString[1]+' 23:59:59';
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

    getDefaultDate(){
        const {style} = this.props.thisData;
        if(style.timeType === 1){
            if(style.endType === 'today'){
                const endData = moment(new Date());
                const sub = style.sub ? style.sub : 1;
                const startDate = endData.clone().subtract(sub,'months');
                return [startDate,endData];
            }else{
                const endDateNextDay = moment(new Date()).add(style.endType === 'now' ? 1 : 1-style.last,'months').format('YYYY-MM')+'-01';
                const endData = moment(endDateNextDay).subtract(1,'days');
                const sub = style.sub ? style.sub : 1;
                const startDate = endData.clone().subtract(sub-1,'months').format('YYYY-MM')+'-01';
                return [moment(startDate, 'YYYY-MM-DD'),endData];
            }
        }else{
            return [moment(style.startDate, 'YYYY-MM-DD'),moment(style.endDate, 'YYYY-MM-DD')];
        }
    }

    render() {
        const {style} = this.props.thisData;
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <DatePicker.RangePicker key={style.updateTime} onChange={this.onChange.bind(this)} size={style.size} locale={locale} defaultValue={this.getDefaultDate()}/>
            </ComponentBox>
        );
    }
}