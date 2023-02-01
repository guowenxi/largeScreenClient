import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { DatePicker } from 'antd';

import ComponentBox from "../component_box";
import cssStyle from './antd_time_search.module.css';

import "../../common/css/antdDatePicker.css";
import { Motion, spring } from "react-motion";

import {getCompatibleSize, interactData} from "../../common/util";

moment.locale('zh-cn');

export default class AntdTimeSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { src: '', show: false, resultData: [], selected: '', opacity: 0, timeTemp: new Date().getTime() };
        this.dateString = ['', ''];
        this.themeList = ['','theme-four','theme-four'];
        this.dropdownThemeList = ['','drop-down-theme-three',''];
        this.interactData = interactData.bind(this);
        this.keyParams = {};
        this.hasChangeSelect = false;
    }

    //组件加载触发函数
    componentDidMount() {
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
        const { style } = this.props.thisData;
        if (style.defaultValue != null) {
            this.setState({ selected: style.defaultValue });
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
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                break;
            case "showComponent":
                //显示当前组件
                break;
            case "cancelSelect":
                //取消选择
                this.setState({ timeTemp: new Date().getTime() });
                if(data.data == null || !data.data.cancelOnly){
                    const { interact } = this.props.thisData.dataSources;
                    this.interactData(interact, {});
                }
                break;
            case "changeSelected":
                if(data.data.startDate && data.data.endData){
                    const startDate = moment(data.data.startDate, 'YYYY-MM-DD');
                    const endData = moment(data.data.endData, 'YYYY-MM-DD');
                    this.dateString = [startDate.format('YYYY-MM-DD'), endData.format('YYYY-MM-DD')];
                    this.defaultDate = [startDate, endData];
                    this.hasChangeSelect = true;
                    this.setState({ timeTemp: new Date().getTime() });
                }else{
                    this.dateString = ['', ''];
                    this.setState({ timeTemp: new Date().getTime() });
                }
                if(data.isInteract !== 2){
                    this.sendMessage();
                }
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.setState({ opacity: 1 });
    }

    onChange(date, dateString) {
        this.dateString = dateString.slice();
        this.sendMessage();
    }

    getDefaultDate() {
        const { style } = this.props.thisData;
        if (!style.hasDefault && !this.hasChangeSelect) {
            return [];
        }
        this.hasChangeSelect = false;
        if (this.updateTime === style.updateTime) {
            return this.defaultDate;
        }
        this.updateTime = style.updateTime;
        if (style.timeType === 3) {
            const today = moment(new Date());
            this.dateString = [today.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')];
            this.defaultDate = [today, today.clone()];
        }else if (style.timeType === 1) {
            if (style.endType === 'today') {
                const endData = moment(new Date());
                const sub = style.sub ? style.sub : 1;
                const startDate = endData.clone().subtract(sub, 'months');
                this.dateString = [startDate.format('YYYY-MM-DD'), endData.format('YYYY-MM-DD')];
                this.defaultDate = [startDate, endData];
            } else {
                const endDateNextDay = moment(new Date()).add(style.endType === 'now' ? 1 : 1 - style.last, 'months').format('YYYY-MM') + '-01';
                const endData = moment(endDateNextDay).subtract(1, 'days');
                const sub = style.sub ? style.sub : 1;
                const startDate = endData.clone().subtract(sub - 1, 'months').format('YYYY-MM') + '-01';
                this.dateString = [startDate, endData.format('YYYY-MM-DD')];
                this.defaultDate = [moment(startDate, 'YYYY-MM-DD'), endData];
            }
        } else {
            let endData;
            if (style.endType === 'today') {
                endData = moment(new Date());
            } else {
                const endDateNextDay = moment(new Date()).add(style.endType === 'now' ? 1 : 1 - style.last, 'months').format('YYYY-MM') + '-01';
                endData = moment(endDateNextDay).subtract(1, 'days');
            }
            this.dateString = [style.startDate, endData.format('YYYY-MM-DD')];
            this.defaultDate = [moment(style.startDate, 'YYYY-MM-DD'), endData];
        }
        setTimeout(() => {
            if (style.firstSend) {
                this.sendMessage();
            }
        });
        return this.defaultDate;
    }

    sendMessage() {
        const { style } = this.props.thisData;
        const { interact } = this.props.thisData.dataSources;
        let sendData = {};
        sendData[style.startKey] = this.dateString[0] ? this.dateString[0] + (style.showTime ? '':' 00:00:00') : '';
        sendData[style.endKey] = this.dateString[1] ? this.dateString[1] + (style.showTime ? '':' 23:59:59') : '';
        if(!style.notSendDefault){
            this.defaultInteractData = sendData;
        }
        this.interactData(interact, sendData);
        // if (interact && interact.length > 0) {
        //     interact.forEach((item) => {
        //         switch (item.type) {
        //             case 1:
        //                 let remark = {};
        //                 if (item.remark) {
        //                     try {
        //                         remark = JSON.parse(item.remark);
        //                     } catch (e) { }
        //                 }
        //                 Emitter.emit(item.receiveId, { type: 'changeKey', data: { ...remark, ...sendData } });
        //                 break;
        //             case 2:
        //                 break;
        //             case 12:
        //                 Emitter.emit(item.receiveId,{type:'cancelSelect'});
        //                 break;
        //             default:
        //                 break
        //         }
        //     });
        // }
    }

    render() {
        const { style } = this.props.thisData;
        const theme = style.theme != null ? style.theme : 0;
        const fontSize = getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={`${cssStyle.box} ${this.themeList[theme]}`} style={{ opacity,fontSize,borderColor:style.borderColor,borderRadius:style.borderRadius }}>
                            <DatePicker.RangePicker
                                showTime={style.showTime}
                                dropdownClassName={this.dropdownThemeList[theme]}
                                key={(style.updateTime || '') + this.state.timeTemp}
                                onChange={this.onChange.bind(this)}
                                size={style.size} locale={locale}
                                defaultValue={this.getDefaultDate()}
                            />
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}