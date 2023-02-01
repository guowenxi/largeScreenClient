/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./commandDispatchNew.module.css";
import './commandDispatchNew.css';

import { interactData } from "../../../common/util";

import { emergencyUrl } from "../../../config";

import Scrollbars from "react-custom-scrollbars";

import axios from 'axios';

import { Modal, Select } from 'antd';

export default class CommandDispatchNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedIndex: 0, dialogueValue: '', teamList: [], typeValue: '', planTaskId: '', dialogueList: [], visible: true, planList: [], planId: '', };
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        this.clearTimer();
    }

    //组件加载触发函数
    componentDidMount() {
        // this.init();
    }
    componentDidUpdate(prevProps,) {
        if (prevProps.getDataTime !== this.props.getDataTime && this.props.getDataTime && prevProps.keyParams.emergencyId !== this.state.emergencyId) {
            this.init();
        }
    }
    init() {
        const { emergencyId } = this.props.keyParams;
        if (!emergencyId) {
            this.setState({ dialogueValue: '', teamList: [], typeValue: '', planTaskId: '', dialogueList: [], planList: [], planId: '', });
            this.clearTimer();
            return;
        } else {
            this.clearTimer();
            this.setTimer();
        }
        this.getTeamList();
        this.getDialogue();
        this.getTypeValue();
    }
    setTimer() {
        const { teamInterval, dialogueInterval } = this.props.thisData.style;
        if (teamInterval) {
            this.teamTimer = setInterval(() => {
                this.getTeamList();
            }, teamInterval);
        }
        if (dialogueInterval) {
            this.dialogueTimer = setInterval(() => {
                this.getDialogue();
            }, dialogueInterval);
        }
    }
    clearTimer() {
        if (this.teamTimer) {
            clearInterval(this.teamTimer);
        }
        if (this.dialogueTimer) {
            clearInterval(this.dialogueTimer);
        }
    }
    // 选中
    handleClickSelect(index) {
        this.setState({
            selectedIndex: index,
        }, () => {
            if (index <= 2) {
                this.getTeamList(index);
            } else {
                this.handleClickInteract('commandGroup');
            }
        })
    }
    // 输入信息
    handleChangeDialogue(e) {
        this.setState({ dialogueValue: e.target.value });
    }
    // 选中预案
    handleChangePlan(value) {
        this.setState({
            planId: value,
        });
    }
    // 完成研判
    handleCompleteDiscuss() {
        const { planId } = this.state;
        if (!planId) {
            Modal.warn({
                content: '请先选择预案',
            });
            return;
        }
        const sendData = {
            rbacToken: this.props.token,
            planId: this.state.planId,
            emergencyId: this.props.keyParams.emergencyId,
            operationType: 101,
            isPlat: 3,
        };
        axios.post(emergencyUrl + "/socialGovernance/YQemergencyProcess/emergencyOperate", sendData, { params: { rbacToken: this.props.token } })
            .then((res) => {
                const { message, success } = res.data;
                if (success) {
                    Modal.success({
                        content: '研判完成',
                    });
                    this.handleClickInteract('commandDiscuss');
                    this.getTypeValue();
                } else {
                    Modal.error({
                        content: message,
                    });
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }
    // 发送信息
    handleSendMessage() {
        const { dialogueValue, typeValue } = this.state;
        if (typeValue === 1) {
            Modal.warning({ content: '事件未开始处置' });
            return;
        } else if (typeValue === 3) {
            Modal.warning({ content: '事件已处置结束' });
            return;
        }
        if (!dialogueValue) {
            Modal.warn({
                content: '请输入要发送的消息',
            });
            return;
        }
        const url = emergencyUrl + '/socialGovernance/YQemergencyProcess/emergencyOperate';
        axios.post(url, { rbacToken: this.props.token, operationType: 107, emergencyId: this.props.keyParams.emergencyId, remark: dialogueValue })
            .then((res) => {
                const { success, message } = res.data;
                if (success) {
                    this.getDialogue();
                    this.setState({ dialogueValue: '' });
                } else {
                    Modal.error({
                        content: message,
                    });
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }
    handleClickOpenMetting(e) {
        const { typeValue } = this.state;
        if (typeValue === 1) {
            Modal.warning({ content: '事件未开始处置' });
            return;
        } else if (typeValue === 3) {
            Modal.warning({ content: '事件已处置结束' });
            return;
        }
        e.stopPropagation();
        window.location.href = `dingtalkgov://dingtalkclient/page/link?url=${encodeURIComponent(emergencyUrl + '/zwddPC?type=1&id=' + this.props.keyParams.emergencyId)}&pc_slide=true`;
    }
    // 获取处置小队
    getTeamList() {
        const url = emergencyUrl + '/socialGovernance/YQemergencyProcess/getPeopleSignStatus';
        axios.get(url, { params: { emergencyId: this.props.keyParams.emergencyId, rbacToken: this.props.token, type: this.state.selectedIndex + 1 } })
            .then((res) => {
                const { data, success } = res.data;
                if (success && data) {
                    this.setState({ teamList: data.peopleSignList });
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }
    // 获取消息列表
    getDialogue() {
        const url = emergencyUrl + '/socialGovernance/YQemergencyProcess/getSceneFeedBackList';
        axios.get(url, { params: { emergencyId: this.props.keyParams.emergencyId, rbacToken: this.props.token, } })
            .then((res) => {
                const { success, data } = res.data;
                if (success && data) {
                    this.setState({ dialogueList: data.feddBackList });
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }
    getPlanList() {
        const planListUrl = emergencyUrl + "/socialGovernance/emergencyPlans/getListByCondition";
        axios.get(planListUrl, { params: { planType: '', rbacToken: this.props.token } })
            .then((res) => {
                const { success, data } = res.data;
                if (success) {
                    this.setState({ planList: data });
                } else {
                    this.setState({ planList: [] });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
    // 一键催办或者再次发送
    handleClickUrge(type, memberIndex) {
        const { teamList, typeValue } = this.state;
        if (typeValue === 1) {
            Modal.warning({ content: '事件未开始处置' });
            return;
        } else if (typeValue === 3) {
            Modal.warning({ content: '事件已处置结束' });
            return;
        }
        const url = emergencyUrl + '/socialGovernance/YQemergencyProcess/urgeToDo';
        const recordIds = type === 'urging' ? teamList.map(item => item.dingTaskRecordId) : [teamList[memberIndex].dingTaskRecordId];
        const sendData = { emergencyId: this.props.keyParams.emergencyId, recordIds, rbacToken: this.props.token, }
        axios.post(url, sendData, { params: { rbacToken: this.props.token } }).then((res) => {
            const { success, message } = res.data;
            if (success) {
                this.getTeamList(this.state.selectedIndex);
                const content = type === 'urging' ? '催办成功' : '发送成功';
                Modal.success({
                    content,
                });
            } else {
                Modal.error({
                    content: message,
                });
            }
        }).catch((e) => {
            console.log(e);
        })
    }
    // 点击交互
    handleClickInteract(type) {
        if (type === 'addMember' || type === 'addPower') {
            const { typeValue } = this.state;
            if (typeValue === 1) {
                Modal.warning({ content: '事件未开始处置' });
                return;
            } else if (typeValue === 3) {
                Modal.warning({ content: '事件已处置结束' });
                return;
            }
        }
        const { style } = this.props.thisData;
        const { emergencyId } = this.props.keyParams;
        const interact = style[`${type}Interact`];
        this.interactData(interact, { emergencyId });
    }
    getTypeValue() {
        const eventDetailUrl = emergencyUrl + "/socialGovernance/YQemergencyProcess/getCurrentEmergency";
        axios.get(eventDetailUrl, { params: { emergencyId: this.props.keyParams.emergencyId, rbacToken: this.props.token, } }).then((res) => {
            const { data, success } = res.data;
            if (success && data) {
                this.setState({
                    typeValue: data[0] && data[0].typeValue
                }, () => {
                    if (this.state.typeValue === 1) {
                        this.getPlanList();
                    }
                });
            }
        }).catch((e) => {
            console.log(e);
        });
    }
    render() {
        const statusList = [
            { status: '已抵达', color: 'rgba(84,211,190,0.86)', value: 1 },
            { status: '呼叫中', color: 'rgba(253,172,77,0.86)', value: 2 },
            { status: '接受并前往', color: 'rgba(253,172,77,0.86)', value: 3 },
            { status: '无法执行', color: '#cf656e', value: 4 }
        ];
        const { selectedIndex, dialogueValue, teamList, dialogueList, planId, planList, typeValue } = this.state;
        return (
            <div style={{ ...this.props.style }} className={`${cssStyle.container} commandDispatchNewBox`} >
                <div className={cssStyle.buttonBox}>
                    {
                        ['处置小组', '呼叫中', '无法执行', '镇街指挥室'].map((item, index) => {
                            if (typeValue !== 2 && index === 3) {
                                return '';
                            }
                            return (
                                <button
                                    className={`${cssStyle.buttonItem} ${selectedIndex === index ? cssStyle.selectedButtonItem : ''}`}
                                    key={index}
                                    onClick={this.handleClickSelect.bind(this, index)}
                                >{item}</button>
                            )
                        })
                    }
                </div>
                <div className={cssStyle.top}>
                    <div className={cssStyle.topContent}>
                        <Scrollbars>
                            {
                                (Array.isArray(teamList) && teamList.length > 0) &&
                                teamList.map((item, index) => {
                                    let statusObj = { status: '', color: '' };
                                    item.isSign && (statusObj = statusList.filter(statusItem => statusItem.value === item.isSign)[0]);
                                    const { status, color } = statusObj;
                                    return (
                                        <div
                                            key={index}
                                            className={cssStyle.teamItem}
                                            style={{ backgroundColor: index % 2 !== 0 ? 'rgba(38,165,255,0.3)' : 'transparent' }}
                                        >
                                            <span className={cssStyle.orangeIcon}></span>
                                            <div className={cssStyle.teamItemCenter}>
                                                <span>{item.userName}{item.depName ? `（${item.depName}）` : ''}</span>
                                                <span
                                                    style={{ color }}
                                                    className={cssStyle.teamStatus}
                                                >
                                                    {status}
                                                </span>
                                            </div>
                                            {
                                                (typeValue === 2 && item.isSign === 4) &&
                                                <span
                                                    className={cssStyle.sendAgainButton}
                                                    onClick={this.handleClickUrge.bind(this, 'sendAgain', index)}
                                                >再次发送</span>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.operationButtonBox}>
                        {/* {
                            typeValue === 2 &&
                            <>
                                {
                                    selectedIndex === 1 &&
                                    <button
                                        className={`${cssStyle.buttonItem} ${cssStyle.operationButtonItem}`}
                                        onClick={this.handleClickUrge.bind(this, 'urging')}
                                    >一键催办</button>
                                }
                                <button
                                    className={`${cssStyle.buttonItem} ${cssStyle.operationButtonItem}`}
                                    onClick={this.handleClickInteract.bind(this, 'addMember')}
                                >添加</button>
                                <button
                                    className={`${cssStyle.buttonItem} ${cssStyle.selectedButtonItem} ${cssStyle.operationButtonItem}`}
                                    onClick={this.handleClickInteract.bind(this, 'addPower')}
                                >增派力量</button>
                            </>
                        } */}
                        {
                            selectedIndex === 1 &&
                            <button
                                className={`${cssStyle.buttonItem} ${cssStyle.operationButtonItem}`}
                                onClick={this.handleClickUrge.bind(this, 'urging')}
                            >一键催办</button>
                        }
                        <button
                            className={`${cssStyle.buttonItem} ${cssStyle.operationButtonItem}`}
                            onClick={this.handleClickInteract.bind(this, 'addMember')}
                        >添加</button>
                        <button
                            className={`${cssStyle.buttonItem} ${cssStyle.selectedButtonItem} ${cssStyle.operationButtonItem}`}
                            onClick={this.handleClickInteract.bind(this, 'addPower')}
                        >增派力量</button>
                    </div>
                </div>
                <div className={cssStyle.planButtonBox}>
                    {
                        typeValue === 1 &&
                        <>
                            <Select
                                placeholder="请选择预案"
                                value={planId === '' ? undefined : planId}
                                onSelect={this.handleChangePlan.bind(this)}
                                showArrow={false}
                            >
                                {
                                    planList.map((item) => {
                                        return (
                                            <Select.Option key={item.id} value={item.id}>{item.planName}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                            <button
                                className={`${cssStyle.buttonItem} ${cssStyle.selectedButtonItem}`}
                                onClick={this.handleCompleteDiscuss.bind(this)}
                            >开始执行</button>
                        </>
                    }
                </div>
                <div className={cssStyle.bottom}>
                    <div className={cssStyle.bottomContent}>
                        <Scrollbars>
                            {
                                (Array.isArray(dialogueList) && dialogueList.length > 0) &&
                                dialogueList.map((item, index) => {
                                    return (
                                        <div className={cssStyle.dialogueItem} key={index}>
                                            <div
                                                className={cssStyle.dialogueName}
                                                style={{ color: item.self ? 'rgba(140,217,253,0.86)' : 'rgba(255,255,255,0.66)' }}
                                            >
                                                {!item.self && <span className={cssStyle.redIcon}></span>}
                                                <span className={cssStyle.userName}>{item.userName}</span>
                                                <span>{item.progressTime}</span>
                                            </div>
                                            <div style={{ marginLeft: !item.self ? '1.6em' : 0 }}>{item.progressContent}</div>
                                        </div>
                                    )
                                })
                            }
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.operationBox}>
                        {/* {
                            typeValue === 2 &&
                            <>
                                <input
                                    className={cssStyle.operationInput}
                                    placeholder="单行输入"
                                    value={dialogueValue}
                                    onChange={this.handleChangeDialogue.bind(this)}
                                />
                                <button className={`${cssStyle.buttonItem} ${cssStyle.operationButton}`} onClick={this.handleSendMessage.bind(this)}>发送</button>
                                <button className={`${cssStyle.buttonItem} ${cssStyle.selectedButtonItem} ${cssStyle.operationButton}`}>
                                    <a
                                        href={
                                            `dingtalkgov://dingtalkclient/page/link?url=${encodeURIComponent(emergencyUrl + '/zwddPC?type=1&id=' + this.props.keyParams.emergencyId)}&pc_slide=true`
                                        }
                                        onClick={(e) => { e.stopPropagation() }}
                                        style={{ color: '#fff' }}
                                    >会议</a>
                                </button>
                            </>
                        } */}
                        <input
                            className={cssStyle.operationInput}
                            placeholder="单行输入"
                            value={dialogueValue}
                            onChange={this.handleChangeDialogue.bind(this)}
                        />
                        <button className={`${cssStyle.buttonItem} ${cssStyle.operationButton}`} onClick={this.handleSendMessage.bind(this)}>发送</button>
                        <button
                            className={`${cssStyle.buttonItem} ${cssStyle.selectedButtonItem} ${cssStyle.operationButton}`}
                            onClick={this.handleClickOpenMetting.bind(this)}
                        >会议</button>
                    </div>
                </div>
            </div>
        );
    }
}