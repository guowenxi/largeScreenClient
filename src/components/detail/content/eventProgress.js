/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./eventProgress.module.css";
import { getCompatibleData } from "../../../common/detailUtil";

import { interactData } from "../../../common/util";

import axios from 'axios';

import SpringScrollbars from "../../../common/springScrollbars";
import { emergencyUrl } from "../../../config";
import { Modal } from "antd";
export default class EventProgress extends React.Component {
    constructor(props) {
        super(props);
        this.state = { time: '00:00:00', selectedIndex: 0, name: '', timeStamp: 0, emergencyId: '', detail: {}, restProcess: [], typeValue: '' };
        this.getCompatibleData = getCompatibleData.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        this.clearTimeKeyer();
    }

    //组件加载触发函数
    componentDidMount() {
        this.init();
        this.setTimeKeyer();
    }
    componentDidUpdate(prevProps,) {
        if (prevProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            this.init();
        }
    }
    init() {
        if (!this.props.keyParams.emergencyId) {
            this.clearTimeKeyer();
            this.setState({ time: '00:00:00', selectedIndex: 0, name: '', timeStamp: 0, emergencyId: '', detail: {}, restProcess: [], typeValue: '' },);
            return;
        }
        this.setState({ emergencyId: this.props.keyParams.emergencyId }, () => {
            this.getTypeValue();
        });
    }
    // 根据时间戳获取时分秒
    getTimeLength() {
        const { timeStamp } = this.state;
        const diff = (new Date().getTime() - timeStamp) / 1000;
        if (diff < 60) {
            return {
                h: 0, min: 0, s: Math.floor(diff),
            }
        } else if (diff > 60 && diff < 3600) {
            const min = Math.floor(diff / 60);
            const s = Math.floor(diff - 60 * min);
            return {
                h: 0, min, s,
            }
        } else {
            const h = Math.floor(diff / 3600);
            const min = Math.floor((diff - h * 3600) / 60);
            const s = Math.floor(diff - 3600 * h - 60 * min);
            return {
                h, min, s,
            }
        }
    }
    // 时分秒一位数时添0
    getMoreTen(number) {
        return number >= 10 ? number : '0' + number;
    }
    // 设置秒数变化的定时器
    setTimeKeyer() {
        this.clearTimeKeyer();
        const timeKeyer = setInterval(() => {
            if (this.state.name) {
                let { h, min, s } = this.getTimeLength();
                s++;
                if (s === 60) {
                    s = 0;
                    min++;
                }
                if (min === 60) {
                    s = 0;
                    min = 0;
                    h++;
                }
                this.setState({ time: `${this.getMoreTen(h)}:${this.getMoreTen(min)}:${this.getMoreTen(s)}` });
            }
        }, 1000);
        this.timeKeyer = timeKeyer;
    }
    clearTimeKeyer() {
        if (this.timeKeyer) {
            clearInterval(this.timeKeyer);
        }
    }
    // 选中某个分支
    handleClickSelect(index) {
        this.setState({ selectedIndex: index }, () => {
            this.getRestProess();
        });
    }
    // 流程全貌的交互
    handleClickProgressOverview() {
        const { detail } = this.props;
        const { progressOverviewInteract } = this.props.thisData.style;
        this.interactData(progressOverviewInteract, detail);
    }
    // 点击下一步的交互
    handleNextStepInteract() {
        const { detail } = this.props;
        const { nextStepInteract } = this.props.thisData.style;
        this.interactData(nextStepInteract, { ...detail, emergencyId: this.props.keyParams.emergencyId });
    }
    // 完成的交互
    handleCompleteInteract() {
        const { detail } = this.props;
        const { completeEventProgressInteract } = this.props.thisData.style;
        this.interactData(completeEventProgressInteract, { ...detail, emergencyId: this.props.keyParams.emergencyId });
    }
    // 点击下一步或者处置完成
    nextStep(type) {
        const url = emergencyUrl + '/socialGovernance/YQemergencyProcess/emergencyOperate';
        const { branchList } = this.state.detail;
        const { emergencyId, selectedIndex } = this.state;
        if (branchList && branchList.length > 0) {
            const sendData = { emergencyId, rbacToken: this.props.token, operationType: type === 'nextStep' ? 103 : 106, nextPlanTaskId: branchList[selectedIndex].planTaskId };
            axios.post(url, sendData, { params: { rbacToken: this.props.token } }).then((res) => {
                const { data } = res;
                if (data.success) {
                    if (type === 'nextStep') {
                        this.handleNextStepInteract();
                    } else {
                        this.handleCompleteInteract();
                    }
                    this.getList();
                    this.getTypeValue();
                } else {
                    Modal.error({
                        content: res.data.message,
                    })
                }
            }).catch((e) => {
                console.log(e);
            })
        }
    }
    handleClickNextStep(type) {
        const that = this;
        Modal.confirm({
            content: type === 'nextStep' ? '确定下一步吗？' : '确定完成吗？',
            onOk() { that.nextStep(type) },
            onCancel() {
                return;
            },
            okText: '确定',
            cancelText: '取消',
        })
    }
    // 获取详情中的时间和名称
    getDetail() {
        const eventDetailUrl = emergencyUrl + "/socialGovernance/emergencyProcess/getDetailById";
        axios.get(eventDetailUrl, { params: { emergencyId: this.state.emergencyId, rbacToken: this.props.token, } }).then((res) => {
            // 在这儿实现 setState
            const { data } = res.data;
            if (data) {
                this.setState({
                    name: data.planDetail && data.planDetail.planName,
                    timeStamp: new Date(data.runHanding.createTime).getTime(),
                });
            }
        }).catch(function (e) {
            console.log(e);
            // 处理请求出错的情况
        });
    }
    // 获取事件列表和分支列表
    getList() {
        const eventDetailUrl = emergencyUrl + "/socialGovernance/YQemergencyProcess/getPastNode";
        axios.get(eventDetailUrl, { params: { emergencyId: this.state.emergencyId, rbacToken: this.props.token, } }).then((res) => {
            const { data } = res.data;
            if (data) {
                this.setState({
                    detail: data
                }, () => {
                    if (this.state.detail.branchList.length > 0) {
                        this.getRestProess();
                    }
                });
            }
        }).catch(function (e) {
            console.log(e);
            // 处理请求出错的情况
        });
    }
    // 获取后面流程
    getRestProess() {
        const eventDetailUrl = emergencyUrl + "/socialGovernance/YQemergencyProcess/getOtherPlanListById";
        const { detail, selectedIndex } = this.state;
        axios.get(eventDetailUrl, { params: { emergencyId: this.state.emergencyId, rbacToken: this.props.token, planTaskId: detail.branchList && detail.branchList.length > 0 && detail.branchList[selectedIndex].planTaskId } }).then((res) => {
            const { data } = res.data;
            if (data) {
                this.setState({
                    restProcess: data.list
                });
            }
        }).catch(function (e) {
            console.log(e);
            // 处理请求出错的情况
        });
    }
    getTypeValue() {
        const eventDetailUrl = emergencyUrl + "/socialGovernance/YQemergencyProcess/getCurrentEmergency";
        axios.get(eventDetailUrl, { params: { emergencyId: this.state.emergencyId, rbacToken: this.props.token, } }).then((res) => {
            const { data } = res.data;
            if (data) {
                this.setState({
                    typeValue: data[0] && data[0].typeValue
                }, () => {
                    const { typeValue } = this.state;
                    if (typeValue === 1) {
                        this.setState({ time: '00:00:00', selectedIndex: 0, name: '', timeStamp: 0, emergencyId: '', detail: {}, restProcess: [], });
                        return;
                    } else if (typeValue === 2 || typeValue === 3) {
                        this.getDetail();
                        this.getList();
                    }
                    if (typeValue === 3 || typeValue === 1) {
                        this.clearTimeKeyer();
                    } else if (typeValue === 2) {
                        this.setTimeKeyer();
                    }
                });
            }
        }).catch(function (e) {
            console.log(e);
            // 处理请求出错的情况
        });
    }
    render() {
        const { detail, restProcess } = this.state;
        const { branchList, list, } = detail;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        let { time, selectedIndex, name, } = this.state;
        const typeValue = this.state.typeValue || this.props.keyParams.typeValue;
        return (
            <div
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding, }}
                className={cssStyle.container}
            >
                {
                    <div style={{ width: '100%', height: '100%', }}>
                        <div className={cssStyle.titleBox}>
                            <span className={cssStyle.titleIcon}></span>
                            事件进程
                        </div>
                        <SpringScrollbars style={{ height: 'calc(100% - 2vh - 1em)' }}>
                            <div className={`${cssStyle.timeBox} ${cssStyle.background}`}>
                                <span>处置时长</span>
                                <span className={cssStyle.time}>{time}</span>
                            </div>
                            {
                                <div className={cssStyle.planBox}>
                                    <div className={cssStyle.planName}>{name}</div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {(typeValue === 2 || typeValue === 3) && <div className={cssStyle.progressOverview} onClick={this.handleClickProgressOverview.bind(this)}>流程全貌</div>}
                                    </div>
                                    {
                                        list && list.map((item, index) => {
                                            return (
                                                <div
                                                    className={`${cssStyle.background} ${cssStyle.progressItemBox}`}
                                                    key={index}
                                                    style={{ marginBottom: '1em', paddingRight: '1em', paddingBottom: '0.5em' }}
                                                >
                                                    <div className={cssStyle.progressNameBox}>
                                                        <span className={cssStyle.progressNameIcon}></span>
                                                        {item.progressName}
                                                    </div>
                                                    {
                                                        item.detailList.map((subItem, subIndex, arr) => {
                                                            return (
                                                                <div
                                                                    key={subIndex}
                                                                    className={cssStyle.eventBox}
                                                                >
                                                                    <span className={cssStyle.eventTime}>{subItem.progressTime}</span>
                                                                    <span style={{ lineHeight: 1.3 }}>{subItem.progressContent}</span>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                            {
                                branchList && <div className={cssStyle.branchBox}>
                                    <SpringScrollbars style={{ width: ' 100%', height: '100%' }}>
                                        {
                                            branchList.map((branchItem, branchIndex) => {
                                                return (
                                                    <div
                                                        key={branchIndex}
                                                        className={`${cssStyle.background} ${cssStyle.branchItem} ${selectedIndex === branchIndex ? cssStyle.activeBranch : ''}`}
                                                        onClick={this.handleClickSelect.bind(this, branchIndex)}
                                                        style={{ left: 35.5 * branchIndex + '%' }}
                                                    >{branchItem.planTaskName}</div>
                                                )
                                            })
                                        }
                                    </SpringScrollbars>
                                </div>
                            }
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {(typeValue === 2) && <div className={cssStyle.nextStep} onClick={this.handleClickNextStep.bind(this, 'nextStep')}>下一步</div>}
                            </div>
                            {
                                restProcess.map((item) => {
                                    return (
                                        <div
                                            key={item.progressTaskId}
                                            className={`${cssStyle.operationBox} ${cssStyle.background}`}
                                            style={{ marginTop: '0.6em' }}
                                        >
                                            <span className={cssStyle.operationIcon}></span>
                                            {item.progressName}
                                        </div>
                                    )
                                })
                            }
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1em' }}>
                                {typeValue === 2 && <div
                                    className={cssStyle.nextStep}
                                    style={{ marginTop: '0.5em' }}
                                    onClick={this.handleClickNextStep.bind(this, 'complete')}
                                >完成处置</div>}
                            </div>
                        </SpringScrollbars>
                    </div>
                }
            </div>
        );
    }
}