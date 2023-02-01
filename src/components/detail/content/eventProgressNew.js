/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./eventProgressNew.module.css";
import { getCompatibleData } from "../../../common/detailUtil";

import { interactData } from "../../../common/util";

import axios from 'axios';

import Scrollbars from "react-custom-scrollbars";
import { emergencyUrl } from "../../../config";
import { Modal } from "antd";
export default class EventProgressNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = { time: '00:00:00', selectedIndex: 0, name: '', list: [], branchList: [], restProcess: [], typeValue: '', startTime: 0, endTime: 0 };
        this.getCompatibleData = getCompatibleData.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        this.clearTimeKeyer();
    }

    //组件加载触发函数
    componentDidMount() {
    }
    componentDidUpdate(prevProps,) {
        if (prevProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            this.init();
        }
    }
    init() {
        if (!this.props.keyParams.emergencyId) {
            this.clearTimeKeyer();
            this.setState({ time: '00:00:00', selectedIndex: 0, name: '', startTime: 0, list: [], branchList: [], restProcess: [], typeValue: '' },);
            return;
        }
        this.getTypeValue();
    }
    // 根据时间戳获取时分秒
    getTimeLength() {
        const { startTime, endTime } = this.state;
        const diff = endTime ? (endTime - startTime) / 1000 : (new Date().getTime() - startTime) / 1000;
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
            if (this.state.startTime) {
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
    // 点击交互
    handleClickInteract(type) {
        const { emergencyId } = this.props.keyParams;
        const { style } = this.props.thisData;
        const interact = style[`${type}Interact`];
        this.interactData(interact, { emergencyId });
    }
    // 点击下一步或者处置完成
    nextStep(type) {
        const url = emergencyUrl + '/socialGovernance/YQemergencyProcess/emergencyOperate';
        const { selectedIndex, branchList } = this.state;
        if (branchList && branchList.length > 0) {
            const sendData = { emergencyId: this.props.keyParams.emergencyId, rbacToken: this.props.token, operationType: type === 'nextStep' ? 103 : 106, nextPlanTaskId: branchList[selectedIndex].planTaskId };
            axios.post(url, sendData, { params: { rbacToken: this.props.token } }).then((res) => {
                const { success, message } = res.data;
                if (success) {
                    if (type === 'nextStep') {
                        this.handleClickInteract('nextStep');
                    } else {
                        this.handleClickInteract('completed');
                    }
                    this.getTypeValue();
                } else {
                    Modal.error({
                        content: message,
                    })
                }
            }).catch((e) => {
                console.log(e);
            })
        }
    }
    handleClickNextStep(type) {
        Modal.confirm({
            content: type === 'nextStep' ? '确定下一步吗？' : '确定完成吗？',
            onOk: () => { this.nextStep(type) },
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
        axios.get(eventDetailUrl, { params: { emergencyId: this.props.keyParams.emergencyId, rbacToken: this.props.token, } })
            .then((res) => {
                const { success, data } = res.data;
                if (success && data) {
                    const { createTime, endTime } = data.runHanding;
                    this.setState({
                        name: data.planDetail && data.planDetail.planName,
                        startTime: new Date(createTime).getTime(),
                        endTime: endTime ? new Date(endTime).getTime() : 0,
                    }, () => {
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
                    });
                }
            })
            .catch(function (e) {
                console.log(e);
            });
    }
    // 获取事件列表和分支列表
    getList() {
        this.setState({ selectedIndex: 0, list: [], branchList: [], restProcess: [] });
        const eventDetailUrl = emergencyUrl + "/socialGovernance/YQemergencyProcess/getPastNode";
        const { typeValue } = this.state;
        const { emergencyId } = this.props.keyParams;
        axios.get(eventDetailUrl, { params: { emergencyId, rbacToken: this.props.token, } })
            .then((res) => {
                const { data, success } = res.data;
                if (success && data) {
                    const { list, branchList } = data;
                    this.setState({ list, branchList: typeValue === 3 ? [] : branchList }, () => {
                        if (this.state.branchList.length > 0) {
                            this.getRestProess();
                        }
                    });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
    // 获取后面流程
    getRestProess() {
        const eventDetailUrl = emergencyUrl + "/socialGovernance/YQemergencyProcess/getOtherPlanListById";
        const { branchList, selectedIndex } = this.state;
        axios.get(eventDetailUrl, { params: { emergencyId: this.props.keyParams.emergencyId, rbacToken: this.props.token, planTaskId: branchList && branchList.length > 0 && branchList[selectedIndex].planTaskId } })
            .then((res) => {
                const { success, data } = res.data;
                if (success && data) {
                    this.setState({
                        restProcess: data.list
                    });
                }
            })
            .catch(function (e) {
                console.log(e);
            });
    }
    getTypeValue() {
        const eventDetailUrl = emergencyUrl + "/socialGovernance/YQemergencyProcess/getCurrentEmergency";
        axios.get(eventDetailUrl, { params: { emergencyId: this.props.keyParams.emergencyId, rbacToken: this.props.token, } })
            .then((res) => {
                const { data, success } = res.data;
                if (success && data) {
                    this.setState({
                        typeValue: data[0] && data[0].typeValue
                    }, () => {
                        const { typeValue } = this.state;
                        if (typeValue === 1) {
                            this.setState({ time: '00:00:00', selectedIndex: 0, name: '', startTime: 0, emergencyId: '', list: [], branchList: [], restProcess: [], });
                            this.clearTimeKeyer();
                            return;
                        } else if (typeValue === 2 || typeValue === 3) {
                            this.getDetail();
                            this.getList();
                            if (typeValue === 2) {
                                this.setTimeKeyer();
                            } else {
                                this.clearTimeKeyer();
                            }
                        }
                    });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
    render() {
        const { time, selectedIndex, name, list, branchList, restProcess, typeValue } = this.state;
        return (
            <div
                style={{ ...this.props.style, }}
                className={cssStyle.container}
            >
                <div style={{ ...this.props.style, }} className={cssStyle.container}>
                    <div className={cssStyle.titleBox}>
                        <div className={cssStyle.title}>{name}</div>
                        {
                            (typeValue === 2 || typeValue === 3) &&
                            <button className={cssStyle.processButton} onClick={this.handleClickInteract.bind(this, 'processOverview')}>流程全貌</button>
                        }
                    </div>
                    <div className={cssStyle.timeBox}>
                        <span className={cssStyle.time}>{time}</span>
                        <span className={cssStyle.timeText}>处置时长</span>
                    </div>
                    <div className={cssStyle.listBox}>
                        <Scrollbars style={{ width: '100%', height: '15em' }}>
                            {
                                Array.isArray(list) &&
                                list.map((item, index, arr) => {
                                    return (
                                        <div key={index} className={cssStyle.listItem} style={{ marginBottom: index === arr.length - 1 ? 0 : '1em' }}>
                                            <div className={cssStyle.listItemName}>
                                                <span className={cssStyle.icon}></span>
                                                <span>{item.progressName}</span>
                                            </div>
                                            {
                                                Array.isArray(item.detailList) &&
                                                item.detailList.map((detailItem, detailIndex) => {
                                                    return (
                                                        <div key={detailIndex} className={cssStyle.listItemDetailBox}>
                                                            <span className={cssStyle.listItemProgressTime}>{detailItem.progressTime}</span>
                                                            <span>{detailItem.progressContent}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.branchBox}>
                        <Scrollbars style={{ width: 'calc(100% - 8em)', height: '100%' }}>
                            <div className={cssStyle.branchInnerBox}>
                                {
                                    Array.isArray(branchList) && branchList.map((item, index, arr) => {
                                        return (
                                            <button
                                                className={`${cssStyle.branchItem} ${selectedIndex === index ? cssStyle.selectedBranchItem : ''}`}
                                                key={item.planTaskId}
                                                onClick={this.handleClickSelect.bind(this, index)}
                                                style={{ marginRight: index === arr.length - 1 ? 0 : '1em', flexShrink: 0 }}
                                            >{item.planTaskName}</button>
                                        )
                                    })
                                }
                            </div>
                        </Scrollbars>
                        {
                            (typeValue === 2) &&
                            <button
                                className={cssStyle.nextButton}
                                style={{ marginLeft: Array.isArray(branchList) && branchList.length > 0 ? '3em' : 0 }}
                                onClick={this.handleClickNextStep.bind(this, 'nextStep')}
                            >下一步</button>
                        }
                    </div>
                    <div className={cssStyle.processBox}>
                        <Scrollbars>
                            {
                                Array.isArray(restProcess) && restProcess.map((item, index) => {
                                    return (
                                        <div className={cssStyle.processItem} key={index}>
                                            <span className={cssStyle.icon}></span>
                                            <span>{item.progressName}</span>
                                        </div>
                                    )
                                })
                            }
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.completeBox}>
                        {
                            (typeValue === 2) &&
                            <button className={cssStyle.completeButton} onClick={this.handleClickNextStep.bind(this, 'completed')}>完成处置</button>
                        }
                    </div>
                </div>
            </div>
        );
    }
}