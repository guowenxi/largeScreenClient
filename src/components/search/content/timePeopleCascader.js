import React from "react";
import cssStyle from "./timePeopleCascader.module.css";
import {Cascader, DatePicker, Icon, Modal, Select} from "antd";
import { getCompatibleSize } from "../../../common/util";
import './timePeopleCascader.css'
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { interactData } from "../../../common/util";
import "../../../common/css/antdDatePicker.css";
import Emitter from "../../../common/eventBus";
import axios from "axios";

const { RangePicker } = DatePicker;
moment.locale('zh-cn');
export default class TimePeopleCascader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { peopleData: '',treeSelected:[],selectedPeople:undefined,isPeople:false,selectOption:[] };
        this.interactData = interactData.bind(this);
        this.dateString = ['',''];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    getPeopleData(value,selectedOptions) {
        console.log(value,selectedOptions);
        const selected = selectedOptions[selectedOptions.length - 1];
        this.setState({peopleData:selected.data,treeText:selected.name,isPeople:selectedOptions.length === 3,treeSelected:value,selectedPeople:undefined});
    }

    sendMessage() {
        if(!this.state.isPeople){
            Modal.info({
                content: '请选择人员！',
            });
            return;
        }
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
                        sendData[style.startKey] = this.dateString[0] ? this.dateString[0]:'';
                        sendData[style.endKey] = this.dateString[1] ? this.dateString[1]:'';
                        sendData[style.contentKey]=this.state.peopleData;
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
            let endData;
            if(style.endType === 'today'){
                endData = moment(new Date());
            }else{
                const endDateNextDay = moment(new Date()).add(style.endType === 'now' ? 1 : 1-style.last,'months').format('YYYY-MM')+'-01';
                endData = moment(endDateNextDay).subtract(1,'days');
            }
            this.dateString = [style.startDate,endData.format('YYYY-MM-DD')];
            this.defaultDate = [moment(style.startDate, 'YYYY-MM-DD'),endData];
        }
        return this.defaultDate;
    }

    displayRender(label){
        return label[label.length - 1];
    }

    changeSelectPeople(value){
        this.setState({peopleData:value,selectedPeople:value,isPeople:true,treeSelected:[]});
    }

    peopleSearch(value){
        const {style} = this.props.thisData;
        if(style.searchKey && style.searchUrl){
            let sendMessage = {
                rbacToken: this.props.token
            };
            sendMessage[style.searchKey] = value;
            axios.get(style.searchUrl, { params: sendMessage }).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if (result) {
                    this.setState({selectOption:result});
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    render() {
        const { searchData, styleData } = this.props;
        const {treeSelected,selectedPeople,selectOption} = this.state;
        const fontSize = getCompatibleSize(styleData.fontSize);
        return (
            <div className={`${cssStyle.box} time-people-cascader`}>
                <Cascader options={searchData} value={treeSelected} onChange={this.getPeopleData.bind(this)} placeholder="选择环卫工" className='ant-cascader-picker' displayRender={this.displayRender.bind(this)} fieldNames={{ label:styleData.labelKey , value: styleData.valueKey, children: styleData.childKey }} />
                <RangePicker size='default' onChange={this.onChange.bind(this)} className='ant-calendar-picker' locale={locale}  defaultValue={this.getDefaultDate()} />
                <Select
                    showSearch
                    placeholder={'请输入姓名或者工号'}
                    value={selectedPeople}
                    onChange={this.changeSelectPeople.bind(this)}
                    onSearch={this.peopleSearch.bind(this)}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    className={cssStyle.select}
                    notFoundContent={'查无此人'}
                    dropdownClassName={'time-people-select'}
                >
                    {selectOption && selectOption.map((item,index)=>
                        <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                    )}
                </Select>
                <div className={cssStyle.iconStyle} onClick={this.sendMessage.bind(this)}>
                    <Icon type='search' style={{ fontSize: fontSize, color: 'white' }} />
                </div>
            </div>
        )
    }
}