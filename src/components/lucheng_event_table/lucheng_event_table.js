import React, { Component } from 'react';


import { getData } from "../../common/getDataUtil";
import ComponentBox from "../component_box";


import { Motion, spring } from "react-motion";

import { Table, Pagination, Modal, ConfigProvider, Input, Select } from 'antd';

import zhCN from 'antd/es/locale/zh_CN';

import Scrollbars from 'react-custom-scrollbars';

import cssStyle from './lucheng_event_table.module.css';
import './lucheng_event_table.css';

import axios from 'axios';

export default class LuchengEventTable extends Component {

    constructor(props) {
        super(props);
        this.state = { data: [], opacity: 0, visible: false, selection: [], total: 10, pageSize: 10, pageNo: 1, loading: false, selectedRowKeys: [], workGroup: [], selectedId: '' };
        this.keyParams = { type: 1 };
        this.interactParams = {};
        this.getData = getData.bind(this);
        this.baseUrl = 'http://47.96.115.177:8010';
    }


    componentDidMount() {
        this.p = new Promise((resolve) => {
            if (this.props.thisData.firstLoad) {
                this.getData(this.callBack.bind(this, resolve));
            } else {
                this.callBack(resolve);
            }
        });
        this.getWorkGroup();
    }
    componentDidUpdate() {
    }
    componentWillUnmount() {
    }


    //挂载数据到页面显示
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity: 1 })
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                // this.reGetData();
                this.setState({ pageNo: 1 }, () => {
                    const { pageSize, pageNo } = this.state;
                    this.getDataList(this.keyParams.type, pageNo, pageSize);
                })
                break;
            case "changeUrl":

                break;
            case "deleteKey":
                this.keyParams = {};
                this.reGetData();
                break;
            case 'messageSend':
                for (let key in data.data) {
                    this.interactParams[key] = data.data[key];
                }
                break;
            case 'reFresh':
                this.reGetData();
                break;
            default:
                break;
        }
    }


    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve(result);
        }
        if (result) {
            this.setState({ data: result });
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    // 分页获取数据
    handleChangePagination(current) {
        this.setState({ pageNo: current }, () => {
            const { pageNo, pageSize } = this.state;
            this.getDataList(this.keyParams.type, pageNo, pageSize);
        })
    }

    //点击发送按钮
    handleClickSend() {
        this.setState({ visible: true });
    }

    // 点击取消按钮
    handleClickCancel() {
        this.setState({ visible: false, });
    }

    // 获取表格数据
    getDataList(type = 1, pageNo = 1, pageSize = 10) {
        this.setState({ loading: true, selection: [], selectedRowKeys: [] });
        // const url = this.baseUrl + (type === 1 ? '/fyPeaceConstruct/dataManage/getWarningEventList' : (type === 2 ? '/fyPeaceConstruct/peaceCheck/getProPeaceCheckList' : '/fyPeaceConstruct/peaceCheck/getList'));
        const urlType = type === 1 ? 'warningEvent' : (type === 2 ? 'provinceEvent' : 'districtEvent');
        const url = this.props.thisData.style[`${urlType}Url`];
        if (url) {
            axios.get(url, { params: { rbacToken: this.props.token, pageNo, pageSize } })
                .then((res) => {
                    const { success, data } = res.data;
                    if (success) {
                        const { list, total } = data;
                        list.forEach((item, index) => {
                            item.index = index + 1;
                            item.key = item.id;
                            if (item.riskLevel != null && item.riskLevel !== '') {
                                item.riskLevelName = item.riskLevel === 0 ? '绿' : (item.riskLevel === 1 ? '黄' : '红');
                            }
                        });
                        this.setState({
                            total: total, data: list, contents: list.map(item => item.incidentContent),
                        });
                    }
                    this.setState({ loading: false });
                })
                .catch((e) => {
                    console.log(e);
                })
                .finally(() => {
                    this.setState({ loading: false });
                })
        }
    }

    // 获取工作组
    getWorkGroup() {
        const url = this.props.thisData.style.workGroupUrl;
        if (url) {
            axios.get(url, { params: { rbacToken: this.props.token, } })
                .then((res) => {
                    const { data, success } = res.data;
                    if (success) {
                        this.setState({ workGroup: data, });
                    }
                })
                .catch((e) => {
                    console.log(e);
                })
        }
    }
    // 确认发送
    handleConfirm() {
        const { selection, selectedId } = this.state;
        if (selection.length > 0) {
            if (!selectedId) {
                Modal.warning({ content: '请选择工作组' });
                return;
            }
            const url = this.props.thisData.style.sendUrl;
            if (url) {
                const sendData = {
                    eventList: selection.map(item => {
                        return {
                            id: item.id, content: item.incidentContent,
                        }
                    }),
                    ids: selectedId,
                    rbacToken: this.props.token
                };
                axios.post(url, sendData, { params: { rbacToken: this.props.token } })
                    .then((res) => {
                        const { success, message } = res.data;
                        if (success) {
                            Modal.success({
                                content: '发送成功',
                                onOk: () => {
                                    this.setState({ visible: false }, () => {
                                        const { pageNo, pageSize } = this.state;
                                        this.getDataList(this.keyParams.type, pageNo, pageSize);
                                    });
                                }
                            });
                        } else {
                            this.setState({ visible: false });
                            Modal.error({
                                content: message,
                                onOk: () => {
                                    this.setState({ visible: false });
                                }
                            })
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    })
                    .finally(() => {
                        this.setState({ visible: false });
                    })
            }
        } else {
            Modal.warning({
                content: '请选择要发送的事件',
            })
        }

    }

    // 编辑事件内容
    handleChangeContent(index, e) {
        const { selection } = this.state;
        selection[index].incidentContent = e.target.value;
        this.setState({ selection });
    }

    handleChangeWorkGroup(value) {
        this.setState({ selectedId: value });
    }
    render() {
        const columns = [
            { title: '序号', dataIndex: 'index', align: 'center', width: '5%' },
            { title: '预警等级', dataIndex: 'riskLevelName', align: 'center', width: '10%' },
            { title: '事发时间', dataIndex: 'incidentTime', align: 'center', width: '15%' },
            { title: '事件内容', dataIndex: 'incidentContent', align: 'center', width: '70%' }
        ];
        this.keyParams.type !== 1 && columns.splice(1, 1);
        const { data, visible, total, pageNo, selection, loading, selectedId, workGroup } = this.state;
        const rowSelection = {
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys, selection: JSON.parse(JSON.stringify(selectedRows)) });
            },
            selectedRowKeys: this.state.selectedRowKeys,
        }
        return (
            <ComponentBox
                style={this.props.style}
                receiveMessage={this.receiveMessage.bind(this)}
                reGetData={this.reGetData.bind(this)}
                thisData={this.props.thisData}
            >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) => {
                        return (
                            <div
                                style={{ width: '100%', height: '100%', position: 'absolute', opacity }}
                                className={`${cssStyle.container} luchengEventTableBox`}
                            >
                                <ConfigProvider locale={zhCN}>
                                    <div className={cssStyle.top}>
                                        <button className={cssStyle.snedButton} onClick={this.handleClickSend.bind(this)}>发送</button>
                                        <Select
                                            value={selectedId === '' ? undefined : selectedId}
                                            placeholder="请选择工作组"
                                            onChange={this.handleChangeWorkGroup.bind(this)}
                                            style={{ marginLeft: '1.1em' }}
                                        >
                                            {
                                                workGroup.map((item) => {
                                                    return (
                                                        <Select.Option key={item.groupId} value={item.groupId}>{item.groupName}</Select.Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </div>
                                    <Scrollbars style={{ height: 'calc(100% - 15em)' }}>
                                        <Table
                                            dataSource={data}
                                            rowKey={record => record.id}
                                            rowSelection={rowSelection}
                                            columns={columns}
                                            pagination={false}
                                            loading={loading}
                                            selections={true}
                                        />
                                    </Scrollbars>
                                    <div className={cssStyle.paginationBox}>
                                        <Pagination
                                            current={pageNo}
                                            showTotal={(total) => `共${total}条`}
                                            onChange={this.handleChangePagination.bind(this)}
                                            total={total}
                                            showQuickJumper
                                        />
                                    </div>
                                    <div className={cssStyle.detailCover} style={{ display: visible ? 'block' : 'none' }}>
                                        <div className={cssStyle.detailBox}>
                                            <div className={cssStyle.subTitle}>每日快报</div>
                                            <div className={cssStyle.selectionBox}>
                                                {
                                                    selection.length > 0 ? (
                                                        <Scrollbars>
                                                            <div className={cssStyle.selcetionInnerBox}>
                                                                {
                                                                    selection.map((item, index) => {
                                                                        return (
                                                                            <div
                                                                                className={cssStyle.selectionItem}
                                                                                key={item.id}
                                                                            >
                                                                                <span className={cssStyle.eventTitle}>{'事件' + (index + 1)}</span>
                                                                                <Input.TextArea
                                                                                    value={item.incidentContent}
                                                                                    onChange={this.handleChangeContent.bind(this, index)}
                                                                                    rows={5}
                                                                                    autoSize={true}
                                                                                />
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </Scrollbars>
                                                    ) : (
                                                        <div className={cssStyle.noData}>请选择要发送的事件</div>
                                                    )
                                                }
                                            </div>
                                            <div className={cssStyle.buttonBox}>
                                                <button
                                                    className={`${cssStyle.commonButton} ${cssStyle.cancelButton}`}
                                                    onClick={this.handleClickCancel.bind(this)}
                                                >取消</button>
                                                <button
                                                    className={`${cssStyle.commonButton} ${cssStyle.confirmButton}`}
                                                    onClick={this.handleConfirm.bind(this)}
                                                >确定</button>
                                            </div>
                                        </div>
                                    </div>
                                </ConfigProvider>
                            </div>
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}