import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {DatePicker} from 'antd';

import ComponentBox from "../component_box";
import cssStyle from './antd_range_picker.module.css';

import "../../common/css/antdDatePicker.css";
import {Motion, spring} from "react-motion";
import {getCompatibleSize, interactData} from "../../common/util";

moment.locale('zh-cn');

export default class AntdRangePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,startValue: null,endValue: null,endOpen: false};
        this.keyParams = {};
        this.themeList = ['','theme-two','theme-three'];
        this.dropdownThemeList = ['','','drop-down-theme-three'];
        this.interactData = interactData.bind(this);
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

    sendMessage(){
        const {interact} = this.props.thisData.dataSources;
        const {startValue,endValue} = this.state;
        let startDate,endDate;
        if(startValue){
            startDate = moment(startValue).format('YYYY-MM');
        }
        if(endValue){
            endDate = moment(endValue).format('YYYY-MM');
        }
        this.interactData(interact,{startDate,endDate});
    }

    disabledStartDate = startValue => {
        const { endValue } = this.state;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = endValue => {
        const { startValue } = this.state;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        },()=>{
            this.sendMessage();
        });
    };

    onStartChange = value => {
        this.onChange('startValue', value);
    };

    onEndChange = value => {
        this.onChange('endValue', value);
    };

    handleStartOpenChange = open => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    };

    handleEndOpenChange = open => {
        this.setState({ endOpen: open });
    };

    render() {
        const {style} = this.props.thisData;
        const theme = style.theme != null ? style.theme : 0;
        const fontSize = getCompatibleSize(style.fontSize);
        const { startValue, endValue, endOpen } = this.state;
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={`${cssStyle.box} ${this.themeList[theme]}`} style={{opacity,fontSize}}>
                            <DatePicker.MonthPicker
                                className={cssStyle.datePicker}
                                locale={locale}
                                disabledDate={this.disabledStartDate}
                                format="YYYY-MM"
                                value={startValue}
                                placeholder={style.startPlaceholder ? style.startPlaceholder : '开始日期'}
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                                dropdownClassName={this.dropdownThemeList[theme]}
                            />
                            <span>~</span>
                            <DatePicker.MonthPicker
                                className={cssStyle.datePicker}
                                locale={locale}
                                disabledDate={this.disabledEndDate}
                                format="YYYY-MM"
                                value={endValue}
                                placeholder={style.endPlaceholder ? style.endPlaceholder : '结束日期'}
                                onChange={this.onEndChange}
                                open={endOpen}
                                onOpenChange={this.handleEndOpenChange}
                                dropdownClassName={this.dropdownThemeList[theme]}
                            />
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}