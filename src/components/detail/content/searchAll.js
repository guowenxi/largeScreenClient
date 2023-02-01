/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./searchAll.module.css";
import { interactData } from "../../../common/util";
import CloseIcon from "../images/closeOne.png";
import { Radio, Select, DatePicker, Button } from "antd";
import "../../../common/css/antdDatePicker.css";
import './searchAll.css';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';

export default class EventTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { form: { name: '', cardId: '', startTime: null, endTime: null, reskLevel: '', searchType: '', } };
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }
    //组件删除时触发函数
    componentWillUnmount() {
    }
    // 改变状态
    handleChange(type, e) {
        const value = (type === 'startTime' || type === 'endTime') ? e : e.target ? e.target.value : e;
        this.setState({
            form: {
                ...this.state.form,
                [type]: value
            }
        });
    }
    // 点击取消或关闭
    handleCancel() {
        const { closeInteract } = this.props.thisData.style;
        this.interactData(closeInteract, {});
        // this.setState({ form: { name: '', cardId: '', startTime: null, endTime: null, reskLevel: '', searchType: '', } });
    }
    // 点击查询
    handleSearch() {
        const { searchInteract } = this.props.thisData.style;
        const { startTime, endTime } = this.state.form;
        this.interactData(searchInteract, {
            ...this.state.form,
            startTime: startTime ? startTime.format('YYYY-MM-DD') : startTime,
            endTime: endTime ? endTime.format('YYYY-MM-DD') : endTime,
        });
    }

    // // 对输入的内容进行验证
    // vertification(obj, key, promptings) {
    //     const status = !!obj[key];
    //     return {
    //         status,
    //         message: !status ? promptings[key] : '',
    //     }
    // }
    // dataCheck(obj, promptings) {
    //     for (const key in obj) {
    //         const { status, message } = this.vertification(obj, key, promptings);
    //         if (!status) {
    //             return {
    //                 status, message,
    //             }
    //         }
    //     }
    //     return {
    //         status: true,
    //         message: '',
    //     }
    // }
    render() {
        const { form } = this.state;
        return (
            <div style={this.props.style} className={`${cssStyle.box} searchAllContainer`} >
                <div className={cssStyle.backgroundBox}>
                    <div className={cssStyle.contentBox}>
                        <div className={cssStyle.title}>
                            全员条件查询
                        </div>
                        <div className={cssStyle.formBox}>
                            <div className={cssStyle.itemBox}>
                                <label className={cssStyle.label}>姓名</label>
                                <input value={form.name} onChange={this.handleChange.bind(this, 'name')} className={cssStyle.searchInput} />
                            </div>
                            <div className={cssStyle.itemBox}>
                                <label className={cssStyle.label}>身份证</label>
                                <input value={form.cardId} onChange={this.handleChange.bind(this, 'cardId')} className={cssStyle.searchInput} />
                            </div>
                            <div className={cssStyle.itemBox}>
                                <label className={cssStyle.label}>起始时间</label>
                                <DatePicker
                                    placeholder=""
                                    value={form.startTime}
                                    format="YYYY-MM-DD"
                                    onChange={this.handleChange.bind(this, 'startTime')}
                                    locale={locale}
                                />
                            </div>
                            <div className={cssStyle.itemBox}>
                                <label className={cssStyle.label}>截至时间</label>
                                <DatePicker
                                    placeholder=""
                                    format="YYYY-MM-DD"
                                    value={form.endTime}
                                    onChange={this.handleChange.bind(this, 'endTime')}
                                    locale={locale}
                                />
                            </div>
                            <div className={cssStyle.itemBox}>
                                <label className={cssStyle.label}>风险等级</label>
                                <Select
                                    value={form.reskLevel}
                                    onChange={this.handleChange.bind(this, 'reskLevel')}
                                    dropdownClassName="searchAllContainer-select-dropdown-menu"
                                >
                                    <Select.Option value={1}>红</Select.Option>
                                    <Select.Option value={2}>橙</Select.Option>
                                    <Select.Option value={3}>黄</Select.Option>
                                </Select>
                            </div>
                            <div className={cssStyle.itemBox}>
                                <label className={cssStyle.label}>选择</label>
                                <Radio.Group value={form.searchType} onChange={this.handleChange.bind(this, 'searchType')}>
                                    <Radio value={1}>新增</Radio>
                                    <Radio value={2}>总数</Radio>
                                    <Radio value={3}>出库</Radio>
                                </Radio.Group>
                            </div>
                            <div className={cssStyle.buttonBox}>
                                <button className={`${cssStyle.button} ${cssStyle.cancelButton}`} onClick={this.handleCancel.bind(this)}>取消</button>
                                <button className={`${cssStyle.button} ${cssStyle.confirmButton}`} onClick={this.handleSearch.bind(this)}>查询</button>
                            </div>
                        </div>
                    </div>
                    <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.handleCancel.bind(this,)} />
                </div>
            </div >
        );
    }
}