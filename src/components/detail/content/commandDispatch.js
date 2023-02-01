/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./commandDispatch.module.css";
import { getCompatibleData } from "../../../common/detailUtil";

import { interactData } from "../../../common/util";

import { emergencyUrl } from "../../../config";


import SpringScrollbars from "../../../common/springScrollbars";

import axios from 'axios';

import { Modal } from 'antd';

export default class CommandDispatch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedIndex: 0, dialogueValue: '', teamList: [], typeValue: '', planTaskId: '', emergencyId: '', dialogueList: [], visible: true, };
        this.getCompatibleData = getCompatibleData.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    //组件加载触发函数
    componentDidMount() {
        this.init();
    }
    componentDidUpdate(prevProps,) {
        if (prevProps.getDataTime !== this.props.getDataTime && this.props.getDataTime && prevProps.keyParams.emergencyId !== this.state.emergencyId) {
            this.init();
        }
    }
    init() {
        const { emergencyId, typeValue, visible } = this.props.keyParams;
        if (!emergencyId) {
            this.setState({ dialogueValue: '', teamList: [], typeValue: '', planTaskId: '', emergencyId: '', dialogueList: [], visible: true, });
            if (this.timer) {
                clearInterval(this.timer);
            }
            return;
        } else {
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.timer = setInterval(() => {
                this.getTeamList();
            }, 3000);
        }
        this.setState({ emergencyId, typeValue, visible: visible === false ? visible : true }, () => {
            const { typeValue, visible } = this.state;
            if (typeValue === 1 && visible) {
                this.handleClickInteract('selectDisscuss');
            }
            this.getTeamList();
        });
    }
    // 是否默认显示这个组件

    // 选中
    handleClickSelect(index) {
        this.setState({
            selectedIndex: index,
        }, () => {
            this.getTeamList(index);
        })
    }
    // 输入信息
    handleChangeDialogue(e) {
        this.setState({ dialogueValue: e.target.value });
    }
    // 发送信息
    handleSendMessage() {
        const url = emergencyUrl + '/socialGovernance/YQemergencyProcess/emergencyOperate';
        const { emergencyId, dialogueValue } = this.state;
        if (!dialogueValue) {
            Modal.info({
                content: '请输入要发送的消息',
            });
            return;
        }
        axios.post(url, { rbacToken: this.props.token, operationType: 107, emergencyId, remark: dialogueValue }).then((res) => {
            if (res.data.success) {
                this.getDialogue();
            }
            this.setState({ dialogueValue: '' });
        }).catch((e) => {
            console.log(e);
            this.setState({ dialogueValue: '' });
        })
    }
    // 获取处置小队
    getTeamList() {
        const url = emergencyUrl + '/socialGovernance/YQemergencyProcess/getPeopleSignStatus';
        axios.get(url, { params: { emergencyId: this.state.emergencyId, rbacToken: this.props.token, type: this.state.selectedIndex + 1 } })
            .then((res) => {
                if (res.data.data) {
                    this.setState({ teamList: res.data.data.peopleSignList });
                }
            }).catch((e) => {
                console.log(e);
            })
    }
    // 获取消息列表
    getDialogue() {
        const url = emergencyUrl + '/socialGovernance/YQemergencyProcess/getSceneFeedBackList';
        axios.get(url, { params: { emergencyId: this.state.emergencyId, rbacToken: this.props.token, } })
            .then((res) => {
                const { data } = res.data;
                if (data) {
                    this.setState({ dialogueList: data.feddBackList });
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }
    // 一键催办或者再次发送
    handleClickUrge(type, memberIndex) {
        const url = emergencyUrl + '/socialGovernance/YQemergencyProcess/urgeToDo';
        const { teamList, emergencyId } = this.state;
        const recordIds = type === 'urging' ? teamList.map(item => item.dingTaskRecordId) : [teamList[memberIndex].dingTaskRecordId];
        const sendData = { emergencyId, recordIds, rbacToken: this.props.token, }
        axios.post(url, sendData, { params: { rbacToken: this.props.token } }).then((res) => {
            const { data } = res;
            if (data) {
                if (data.success) {
                    this.getTeamList(this.state.selectedIndex);
                    const content = type === 'urging' ? '催办成功' : '发送成功';
                    Modal.success({
                        content,
                    });
                } else {
                    Modal.error({
                        content: res.data.message,
                    });
                }
            }
        }).catch((e) => {
            console.log(e);
        })
    }
    // 选中成员后再次发送
    handleClickSelectMember(index) {
        this.handleClickUrge('sendAgain', index);
    }
    // 点击交互
    handleClickInteract(type) {
        const { detail } = this.props;
        switch (type) {
            case 'selectDisscuss': {
                const { selectDisscussInteract } = this.props.thisData.style;
                this.interactData(selectDisscussInteract, detail);
                break;
            }
            case 'addPower': {
                const { addPowerInteract } = this.props.thisData.style;
                this.interactData(addPowerInteract, detail);
                break;
            }
            case 'addMember': {
                const { addMemberInteract } = this.props.thisData.style;
                this.interactData(addMemberInteract, detail);
                break;
            }
            case 'commandGroup': {
                const { commandGroupInteract } = this.props.thisData.style;
                this.interactData(commandGroupInteract, { id: this.props.keyParams.emergencyId });
                break;
            }
            default: {
                break;
            }
        }
    }

    render() {
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        const operationList = ['处置小组', '呼叫中', '无法执行'];
        const statusList = [
            { status: '已抵达', color: 'rgb(22, 176, 67)' },
            { status: '呼叫中...', color: 'rgb(22, 176, 67)' },
            { status: '确认并前往', color: 'rgb(217, 162, 61)' },
            { status: '无法执行', color: 'rgb(126, 133, 147)' }
        ]
        const { selectedIndex, dialogueValue, teamList, dialogueList } = this.state;
        const { feddBackList } = this.props.detail;
        let dialogues = [];
        if (feddBackList) {
            dialogues = dialogueList.length > feddBackList.length ? dialogueList : feddBackList;
        }
        return (
            <div
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding, }}
                className={cssStyle.container}
            >
                {
                    <div style={{ width: '100%', height: '100%', }}>
                        <div className={cssStyle.titleBox}>
                            <span className={cssStyle.titleIcon}></span>
                            指挥调度
                        </div>
                        <div className={cssStyle.contentBox}>
                            <div className={cssStyle.leftContent}>
                                <ul className={`${cssStyle.leftHead} ${cssStyle.resetAll}`}>
                                    {
                                        operationList.map((operationItem, operationIndex) => {
                                            return (
                                                <li
                                                    key={operationIndex}
                                                    className={
                                                        `${cssStyle.leftHeadItem} ${cssStyle.background} ${cssStyle.resetAll} ${cssStyle.resetLi} ${operationIndex === 1 ? cssStyle.noTransverseBorder : ''} ${selectedIndex === operationIndex ? cssStyle.activeItem : ''}`
                                                    }
                                                    onClick={this.handleClickSelect.bind(this, operationIndex)}
                                                >{operationItem}</li>
                                            )
                                        })
                                    }
                                </ul>
                                <div className={`${cssStyle.leftBody} ${cssStyle.background}`}>
                                    {<div style={{ width: '100%', height: '100%', position: 'relative', }}>
                                        <SpringScrollbars>
                                            {
                                                teamList.map((teamItem, teamIndex) => {
                                                    return (
                                                        <div key={teamIndex}>
                                                            <div className={cssStyle.teamItem}>
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <span
                                                                        className={cssStyle.teamIcon}
                                                                        style={{
                                                                            backgroundColor: selectedIndex === 2 ? 'rgb(99, 99, 99)' : 'rgb(30, 224, 70)'
                                                                        }}
                                                                    ></span>
                                                                    <p className={cssStyle.resetAll}>{teamItem.userName}({teamItem.depName})</p>
                                                                </div>
                                                                <span style={{ color: statusList[teamItem.isSign - 1].color }}>
                                                                    {statusList[teamItem.isSign - 1].status}
                                                                </span>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}>
                                                                {teamItem.isSign === 4 && <div
                                                                    style={{
                                                                        fontSize: '1.5vh',
                                                                        color: '#fff',
                                                                        backgroundColor: 'rgb(0, 85, 184)',
                                                                        padding: '0.3em 0.5em'
                                                                    }}
                                                                    onClick={this.handleClickSelectMember.bind(this, teamIndex)}
                                                                >
                                                                    再次发送
                                                                </div>}
                                                            </div>
                                                        </div>

                                                    )
                                                })
                                            }
                                        </SpringScrollbars>
                                        {teamList.length > 0 && selectedIndex === 1 && <div
                                            onClick={this.handleClickUrge.bind(this, 'urging')}
                                            className={cssStyle.urgingButton}
                                        >一键催办</div>}
                                    </div>}
                                </div>
                                <div className={cssStyle.leftFooter}>
                                    <div className={cssStyle.addButton} onClick={this.handleClickInteract.bind(this, 'addMember')}>添加</div>
                                    <div className={cssStyle.dispatchButton} onClick={this.handleClickInteract.bind(this, 'addPower')}>增派力量</div>
                                </div>
                            </div>
                            <div className={cssStyle.rightContent}>
                                <div className={cssStyle.rightHead}>
                                    <div className={cssStyle.rightHeadItem1} onClick={this.handleClickInteract.bind(this, 'commandGroup')}>镇街指挥室</div>
                                    {this.props.keyParams.typeValue === 1 && <div
                                        className={`${cssStyle.rightHeadItem2} ${cssStyle.background}`}
                                        onClick={this.handleClickInteract.bind(this, 'selectDisscuss')}
                                    >请选择预案</div>}
                                </div>
                                <div className={`${cssStyle.rightBody} ${cssStyle.background}`}>
                                    {
                                        dialogues && <SpringScrollbars style={{ width: '100%', height: '100%' }}>
                                            {
                                                dialogues.map((dialogueItem, dialogueIndex, arr) => {
                                                    return (
                                                        <div
                                                            className={cssStyle.dialogueItem}
                                                            key={dialogueIndex}
                                                            style={{
                                                                alignItems: dialogueItem.self ? 'flex-end' : 'flex-start',
                                                                marginBottom: dialogueIndex === arr.length - 1 ? '2em' : 0,
                                                            }}
                                                        >
                                                            <p className={`${cssStyle.resetAll} ${cssStyle.dialogueItemName}`}>{dialogueItem.userName}</p>
                                                            <p
                                                                className={
                                                                    `${cssStyle.resetAll} ${cssStyle.dialogueItemContent} ${dialogueItem.self ? cssStyle.rightBubble : cssStyle.leftBubble}`
                                                                }
                                                                style={{ paddingTop: dialogueItem.self ? '1em' : '1.5em' }}
                                                            >{dialogueItem.progressContent}</p>
                                                            <p
                                                                className={`${cssStyle.resetAll} ${cssStyle.dialogueItemTime}`}
                                                            >{dialogueItem.progressTime}</p>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </SpringScrollbars>
                                    }
                                </div>
                                <div className={cssStyle.rightFooter}>
                                    <div className={`${cssStyle.rightFooterItem1} ${cssStyle.background}`}>
                                        <input
                                            className={`${cssStyle.resetInput} ${cssStyle.resetAll}`}
                                            value={dialogueValue}
                                            placeholder="单行输入"
                                            onChange={this.handleChangeDialogue.bind(this)}
                                        />
                                    </div>
                                    <div className={cssStyle.rightFooterItem2} onClick={this.handleSendMessage.bind(this)}>发送</div>
                                    <div className={cssStyle.rightFooterItem3}>
                                        <a
                                            href={`dingtalkgov://dingtalkclient/page/link?url=${encodeURIComponent(emergencyUrl + '/zwddPC?type=1&id=' + this.props.keyParams.emergencyId)}&pc_slide=true`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                            }}
                                            style={{ color: '#fff' }}
                                        >会议</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}