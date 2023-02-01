import React from "react";

import { Modal } from "antd";
import cssStyle from "./eventFiveNew.module.css";
import { interactData } from "../../../common/util";
// import { eventTurnToUrl } from "../../../config";

import Scrollbars from "react-custom-scrollbars";

import axios from 'axios';

const { confirm } = Modal;

export default class EventFiveNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasTurnTo: false, hasWarning: false,
        };
        this.interactData = interactData.bind(this);
        this.titleList1 = [{ key: 'title', name: '事件名称' }, { key: 'eventTypeName', name: '事件类别' }, { key: 'actionTypeName', name: '现实行为' }, { key: 'incidentContent', name: '事件描述' }, { key: 'sourceName', name: '事件来源' }];
        this.titleList2 = [{ key: 'warningTime', name: '事发时间' }, { key: 'earlyWarningLevelName', name: '事件等级' }, { key: 'roadName', name: '所属街道' }, { key: 'joinNum', name: '参与人数' }, { key: 'reasonList', name: '预警因子' }];
        this.statusList = [{ color: 'rgba(255, 63, 64, 0.86)', status: 1 }, { color: '#8f5d49', status: 2 }, { color: '#e49e4a', status: 3 }, { color: '#0161e9', status: 4 }, { color: '#06c6a9', status: 5 }]
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        if (prevProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            // this.init();
        }
    }

    //转入指挥调度
    eventTurnTo(type) {
        confirm({
            title: `确定要将该事件转入${type === 1 ? '协同' : '应急'}？`,
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                const { detail, token } = this.props;
                const sendData = {
                    rbacToken: token,
                    id: detail.id,
                };
                const url = type === 1 ? '/socialGovernance/command/shiftToCommand' : '/socialGovernance/emergencyProcess/warningToEmergency';
                const { fileUrl } = this.props.styleData;
                return new Promise((resolve) => {
                    axios.post(fileUrl + url, sendData, { params: { rbacToken: this.props.token } }).then((response) => {
                        resolve();
                        if (response.data.success) {
                            if (type === 1) {
                                this.setState({ hasTurnTo: true });
                            } else {
                                this.setState({ hasWarning: true });
                            }
                            Modal.success({
                                content: `已转入${type === 1 ? '协同' : '应急'}。`,
                            });
                        } else {
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch((error) => {
                        resolve();
                        Modal.error({
                            content: `转入${type === 1 ? '协同' : '应急'}请求出错！`,
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel: () => { },
        });
    }
    // 点击关闭交互
    handleClickClose() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {});
    }
    // 渲染预警因子
    getRenderReason() {
        const { reasonList } = this.props.detail;
        let peopleContent = [], AreaContent = [];
        if (reasonList) {
            peopleContent = reasonList.peopleContent;
            AreaContent = reasonList.AreaContent;
        }
        return (
            [peopleContent, AreaContent].map((item, index) => {
                return (
                    <div key={index}>
                        <span className={cssStyle.reasonTitle}>{index === 0 ? '涉及重点人' : '涉及重点场所'}</span>
                        {
                            Array.isArray(item) &&
                            item.map((subItem, subIndex, subArr) => {
                                return (
                                    <span key={subIndex} className={`${cssStyle.reasonContent}`}>
                                        {subItem}{subArr.length - 1 === subIndex ? '' : '、'}
                                    </span>
                                )
                            })
                        }
                    </div>
                )
            })
        )
    }
    // 渲染表格
    getRenderTable(type) {
        const titleList = this[`titleList${type}`];
        const { detail } = this.props;
        const tableClassName = type === 1 ? cssStyle.leftInfo : cssStyle.rightInfo;
        return (
            <Scrollbars style={{ width: '29em', height: '17.2em' }}>
                <table className={tableClassName}>
                    <tbody>
                        {
                            titleList.map(({ key, name }) => {
                                const lastInfoClassName = key === 'source' ? cssStyle.lastInfoItem : '';
                                const levelClassName = key === 'level' ? cssStyle.levelContent : '';
                                let statusColor = '';
                                const status = this.statusList.filter(({ status }) => status === detail.earlyWarningLevel)[0];
                                if (status) {
                                    statusColor = status.color;
                                }
                                const color = key === 'earlyWarningLevelName' ? statusColor : '#fff';
                                return (
                                    <tr key={key}>
                                        <td className={`${cssStyle.infoTitle}  ${lastInfoClassName}`}>{name}</td>
                                        <td className={`${cssStyle.infoContent} ${lastInfoClassName} ${levelClassName}`} style={{ color }}>
                                            {key === 'reasonList' ? this.getRenderReason() : detail[key]}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </Scrollbars>
        )
    }
    render() {
        const { detail } = this.props;
        const { isTurn, isTeamWork } = detail;
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <div className={cssStyle.top}>
                    <span className={cssStyle.title}>事件详情</span>
                    <span className={cssStyle.closeIcon} onClick={this.handleClickClose.bind(this)}></span>
                </div>
                <div className={cssStyle.center}>
                    <div className={cssStyle.infoBox}>
                        {([1, 2]).map(item => {
                            return (
                                <React.Fragment key={item}>
                                    {this.getRenderTable(item)}
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
                <div className={cssStyle.buttonBox}>
                    {isTeamWork === 1 || this.state.hasTurnTo ? (
                        <button className={cssStyle.buttonItem} >已转入协同</button>
                    ) : (
                        <button onClick={this.eventTurnTo.bind(this, 1)} className={cssStyle.buttonItem} >转入协同</button>
                    )}
                    {isTurn === 1 || this.state.hasWarning ? (
                        <button className={`${cssStyle.buttonItem} ${cssStyle.rightButtonItem}`} >已转入应急</button>
                    ) : (
                        <button
                            onClick={this.eventTurnTo.bind(this, 2)}
                            className={`${cssStyle.buttonItem} ${cssStyle.rightButtonItem}`}
                        >转入应急</button>
                    )}
                </div>
            </div>
        );
    }
}