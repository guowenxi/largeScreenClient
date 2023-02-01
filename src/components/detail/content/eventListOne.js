/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./eventListOne.module.css";
import './eventListOne.css';
import { Scrollbars } from "react-custom-scrollbars";
import CloseIcon from "../images/closeOne.png";
import "./pagination.css";
import { Pagination, Select } from "antd";
import axios from 'axios';

import searchButton from "../../text_search/images/search.svg";

export default class EventListOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataForm: {
                searchText: '',
                eventType: '',
                sendDepartment: '',
                receiveDepartment: '',
            },
            eventTypeList: [],
            sendDepartmentList: [],
            receiveDepartmentList: [],
        };
        this.planName = {};
        this.scrollbars = React.createRef();
        this.titleList = [
            { name: '协同事件编码', key: 'teamworkNo', width: '8%' },
            { name: '协同事件类型', key: 'type', width: '10%' },
            { name: '推送单位', key: 'sendDepartment', width: '8%' },
            { name: '接收单位', key: 'receiveDepartment', width: '8%' },
            { name: '事件描述', key: 'eventContent', width: '25%' },
            { name: '反馈结果', key: 'result', width: '10%' },
            { name: '推送时间', key: 'sendTime', width: '6.5%' },
            { name: '反馈时间', key: 'feedbackTime', width: '6.5%' },
            { name: '备注', key: 'remark', width: '8%' },
        ];
        this.selectList = [{ type: 'eventType', placeholder: '请选择事件类型' }, { type: 'sendDepartment', placeholder: '请选择推送单位' }, { type: 'receiveDepartment', placeholder: '请选择接收单位' }]
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }
    componentDidUpdate(prevProps) {
        const { themeType,eventTypeUrl,sendDepUrl,receiveDepUrl } = this.props.styleData;
        if (themeType === 2 && prevProps.thisData.showStatus !== this.props.thisData.showStatus) {
            if (this.props.thisData.showStatus) {
                const { part } = this.props.keyParams;
                if (part === 10008) {
                    this.setState({ eventTypeList: [{ id: '', name: '事件类型（全部）' }, { id: '64390001', name: '家庭纠纷' }, { id: '64390002', name: '情感纠纷' }, { id: '64390003', name: '邻里纠纷' }, { id: '64390004', name: '经济债务纠纷' }, { id: '64390005', name: '涉机构类纠纷' }, { id: '64390006', name: '安全生产意外事故引起的纠纷' }] });
                } else {
                    this.getDataList(eventTypeUrl || '/fyScreen/drop/eventDisputeList', 'eventTypeList', '事件类型（全部）');
                }
                this.getDataList(sendDepUrl || '/fyScreen/drop/policeDepartmentList', 'sendDepartmentList', '推送单位（全部）', { selectType: 1, id: part });
                this.getDataList(receiveDepUrl || '/fyScreen/drop/policeDepartmentList', 'receiveDepartmentList', '接收单位（全部）', { selectType: 2 });
                const dataForm = { searchText: '', eventType: '', sendDepartment: '', receiveDepartment: '' };
                this.setState({ dataForm });
                this.props.changeKeyParams(dataForm);
            }
        }
    }

    getContent(detail) {
        return (
            <table className={cssStyle.table}>
                <tbody >
                    {detail && detail.map && detail.map((line, lineIndex) =>
                        <tr key={lineIndex}>
                            {this.titleList.map((title, index) => {
                                if (title.name === '事件描述') {
                                    if (line.contentShow) {
                                        return <td key={index} style={{ width: title.width }} rowSpan={line.sameNum}>{line[title.key]}</td>;
                                    } else {
                                        return null;
                                    }
                                } else {
                                    return <td key={index} style={{ width: title.width }}>{line[title.key]}</td>;
                                }
                            })}
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    closeThis() {
        this.props.changeThisShow(false, true);
    }

    // themeType === 2，获取头部
    getHeader() {
        const { dataForm } = this.state;
        const { searchText } = dataForm;
        return (
            <div className={cssStyle.header}>
                {
                    this.selectList.map(({ type, placeholder }) => {
                        const valueList = this.state[`${type}List`];
                        const value = dataForm[type];
                        return (
                            <Select
                                value={value}
                                onChange={this.handleChangeDataForm.bind(this, type)}
                                dropdownClassName="eventListOneConteiner-select-dropdown-menu"
                                className={cssStyle.select}
                                placeholder={placeholder}
                                key={type}
                            >
                                {
                                    Array.isArray(valueList) &&
                                    valueList.map(({ id, name }) => {
                                        return (
                                            <Select.Option value={id} key={id}>{name}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        )
                    })
                }
                <div className={cssStyle.searchInputBox}>
                    <input
                        placeholder="请输入关键字"
                        value={searchText}
                        onChange={this.handleChangeDataForm.bind(this, 'searchText')}
                        className={cssStyle.searchInput}
                    />
                    <img alt='' src={searchButton} className={cssStyle.searchIcon} onClick={this.handleClickSearch.bind(this)} />
                </div>
            </div>
        );
    }

    changePage(page, pageSize) {
        this.props.changeKeyParams({ pageNo: page, pageSize });
        this.scrollbars.current.scrollTop(0);
    }

    getSameEventNum(detail) {
        if (detail) {
            let sameNum = 1;
            for (let i = detail.length - 1; i >= 0; i--) {
                if (i > 0 && detail[i].eventId === detail[i - 1].eventId) {
                    detail[i].contentShow = false;
                    sameNum++;
                } else {
                    detail[i].contentShow = true;
                    detail[i].sameNum = sameNum;
                    sameNum = 1;
                }
            }
        }
    }
    // 改变dataForm的状态
    handleChangeDataForm(type, e) {
        const value = type === 'searchText' ? e.target.value : e;
        this.setState({
            dataForm: {
                ...this.state.dataForm,
                [type]: value,
            }
        }, () => {
            if (type !== 'searchText') {
                this.props.changeKeyParams({ ...this.props.keyParams, ...this.state.dataForm });
            }
        })
    }
    // 点击查询
    handleClickSearch() {
        if (this.state.dataForm.searchText) {
            this.props.changeKeyParams({ ...this.props.keyParams, ...this.state.dataForm });
        }
    }
    // 获取头部三个下拉框的列表
    getDataList(url, key, text, params) {
        const { fileUrl } = this.props.styleData;
        if (fileUrl) {
            const { roadId } = this.props.keyParams;
            axios.get(fileUrl + url, { params: { ...params, parentCode: roadId, rbacToken: this.props.token } })
                .then((res) => {
                    const { data, success } = res.data;
                    if (success && data) {
                        const listData = {};
                        data.unshift({ name: text, id: '' });
                        listData[key] = data;
                        this.setState(listData, () => {
                            console.log({ data });
                        });
                    }
                })
                .catch((e) => {
                    console.log(e);
                })
        }
    }
    render() {
        const { detail, keyParams, loading } = this.props;
        const { themeType } = this.props.styleData;
        if (detail == null) {
            return '';
        }
        const { total, list } = detail;
        const { pageNo, pageSize } = keyParams;
        this.getSameEventNum(list);
        return (
            <div style={this.props.style} className={`${themeType === 2 ? cssStyle.boxTwo : cssStyle.box} eventListOneConteiner`} >
                <div className={themeType === 2 ? cssStyle.backgroundBoxTwo : cssStyle.backgroundBox}>
                    <div className={`${themeType === 2 ? cssStyle.contentBoxTwo : cssStyle.contentBox} black-blue-page`}>
                        {themeType === 2 && this.getHeader()}
                        {!list || list.length === 0 ? (
                            <div className={themeType === 2 ? cssStyle.noDataTwo : cssStyle.noData}>{loading ? '数据加载中...' : '暂无数据'}</div>
                        ) : (
                            <React.Fragment>
                                <table className={cssStyle.table}>
                                    <tbody>
                                        <tr>
                                            {this.titleList.map((title, index) =>
                                                <td key={index} style={{ width: title.width }}>{title.name}</td>
                                            )}
                                        </tr>
                                    </tbody>
                                </table>
                                {
                                    themeType !== 2 ? (
                                        <>
                                            {
                                                list.length > 5 ? (
                                                    <div className={cssStyle.tableMaxContent}>
                                                        <Scrollbars ref={this.scrollbars} style={{ borderBottom: '1px solid #1e8dd9' }}>
                                                            {this.getContent(list)}
                                                        </Scrollbars>
                                                    </div>
                                                ) : (
                                                    <div className={cssStyle.tableContent}>
                                                        {this.getContent(list)}
                                                    </div>
                                                )
                                            }
                                        </>
                                    ) : (
                                        <div className={cssStyle.tableMaxContentTwo}>
                                            <Scrollbars ref={this.scrollbars} style={{ borderBottom: '1px solid #1e8dd9' }}>
                                                {this.getContent(list)}
                                            </Scrollbars>
                                        </div>
                                    )
                                }
                                <Pagination current={pageNo} pageSize={pageSize} total={total} onChange={this.changePage.bind(this)} />
                            </React.Fragment>
                        )}
                    </div>
                    {themeType !== 2 && <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)} />}
                </div>
            </div>
        );
    }
}