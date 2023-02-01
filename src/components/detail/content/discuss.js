import React from "react";
import cssStyle from "./discuss.module.css";
import { Motion, spring } from "react-motion";
import { Icon, Input, Select, Button, Modal } from "antd";
import axios from "axios";
import { emergencyUrl } from "../../../config";

import { Scrollbars } from 'react-custom-scrollbars';
import { interactData } from "../../../common/util";
export default class Discuss extends React.Component {
    constructor(props) {
        super(props);
        this.state = { detail: {}, subTypeList: [], planList: [], loading: false, emergencyId: '' };
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.getSubtypeList();
        this.getPlanList();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    // componentDidUpdate(prevProps) {
    //     if (prevProps.detail.id !== this.props.detail.id) {
    //         //组件数据源变更时刷新数据
    //         this.initDefault();
    //     }
    // }

    componentDidUpdate(prevProps,) {
        if (prevProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            this.getSubtypeList();
            this.getPlanList();
        }
    }

    initDefault() {
        let { detail } = this.state;
        const { eventType, warningLevel, incidentAddress, x, y, influence, incidentRemark } = this.props.detail;
        detail.subType = eventType;
        if (detail.subType) {
            this.getPlanList(detail.subType);
        }
        detail.level = warningLevel;
        detail.studyAddress = incidentAddress;
        detail.studyLng = x;
        detail.studyLat = y;
        detail.influence = influence;
        detail.remark = incidentRemark;
        this.setState({ detail });
    }



    dataEdit(type, key, event) {
        let { detail } = this.state;
        detail[key] = type === 1 ? event.target.value : event;
        if (key === 'subType') {
            this.getPlanList(detail[key]);
            detail.plan = '';
        }
        this.setState({ detail });
    }

    getPlanList(id) {
        const planListUrl = emergencyUrl + "/socialGovernance/emergencyPlans/getListByCondition";
        // const planListUrl = "./json/ruian/planList.json";
        axios.get(planListUrl, { params: { planType: id, rbacToken: this.props.token } }).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if (result) {
                this.setState({ planList: result });
            } else {
                this.setState({ planList: [] });
            }
        }).catch(function (error) {
            // 处理请求出错的情况
        });
    }
    getSubtypeList() {
        const eventTypeListUrl = emergencyUrl + "/socialGovernance/statistics/getTypeList";
        // const eventTypeListUrl = "./json/ruian/eventTypeList.json";
        axios.get(eventTypeListUrl, { params: { rbacToken: this.props.token, type: 7 } }).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if (result) {
                this.setState({ subTypeList: result })
            }
        }).catch(function (error) {
            // 处理请求出错的情况
        });
    }
    // 对输入的内容进行验证
    vertification(obj, key, promptings) {
        const status = !!obj[key];
        return {
            status,
            message: !status ? promptings[key] : '',
        }
    }
    dataCheck(obj, promptings) {
        for (const key in obj) {
            const { status, message } = this.vertification(obj, key, promptings);
            if (!status) {
                return {
                    status, message,
                }
            }
        }
        return {
            status: true,
            message: '',
        }
    }
    // 完成研判
    discussEvent() {
        this.setState({ loading: true });
        const { detail, } = this.state;
        const handingStudy = {
            joinNum: detail.peopleNum,
            eventType: detail.subType,
            warningLevel: detail.level,
            influence: detail.influence,
            remark: detail.remark,
            studyAddress: detail.studyAddress,
            studyLng: detail.studyLng,
            studyLat: detail.studyLat,
            isPlat: 3
        };
        const sendForm = { joinNum: detail.peopleNum, eventType: detail.subType, warningLevel: detail.level, influence: detail.influence, remark: detail.remark, planId: detail.plan };
        const promptings = {
            joinNum: '请输入人员数量',
            eventType: '请输入适用类型',
            warningLevel: '请选择事件等级',
            // remark: '请输入备注',
            // influence: '请输入影响范围',
            planId: '请选择应急预案',
        };
        const { status, message } = this.dataCheck(sendForm, promptings);
        if (!status) {
            Modal.error({
                content: message,
            });
            this.setState({ loading: false });
            return;
        }
        const sendData = {
            handingStudy,
            rbacToken: this.props.token,
            planId: detail.plan,
            emergencyId: this.props.keyParams.emergencyId,
            operationType: 101,
        };
        axios.post(emergencyUrl + "/socialGovernance/YQemergencyProcess/emergencyOperate", sendData, { params: { rbacToken: this.props.token } }).then((response) => {
            this.setState({ loading: false });
            if (response.data.success) {
                Modal.success({
                    content: '研判完成。',
                });
                this.handleCompleteDiscuss();
                this.setState({ detail: {} });
            } else {
                Modal.error({
                    content: response.data.message,
                });
            }
        }).catch((error) => {
            Modal.error({
                content: '请求出错！',
            });
            console.log(error);
            this.setState({ loading: false });
        });
    }
    // 关闭组件
    handleClickClose() {
        const { hideDisscussInteract } = this.props.thisData.style;
        this.interactData(hideDisscussInteract, { visible: false });
        this.setState({ detail: {} });
    }
    // 完成研判
    handleCompleteDiscuss() {
        const { emergencyId } = this.props.keyParams;
        const { completeDiscussInteract } = this.props.thisData.style;
        this.interactData(completeDiscussInteract, { emergencyId });
    }
    render() {
        const { detail, subTypeList, planList, loading } = this.state;
        return (
            <Motion style={{ opacity: spring(1) }}>
                {({ opacity }) =>
                    <Scrollbars>
                        <div style={{ opacity, }} className={`${cssStyle.eventDiscussBox} ${cssStyle.background}`}>
                            <div className={cssStyle.editHeadBox}>
                                <div>研判分析</div>
                                <Icon type="close" onClick={this.handleClickClose.bind(this)} className={cssStyle.closeIcon} />
                            </div>
                            <div className={cssStyle.eventAddRow}>
                                <div className={cssStyle.addRowTitle}>人员数量</div>
                                <Input value={detail.peopleNum} onChange={this.dataEdit.bind(this, 1, 'peopleNum')} className={cssStyle.addRowContent} />
                            </div>
                            {/*<div className={cssStyle.eventAddRow}>*/}
                            {/*    <div className={cssStyle.addRowTitle}>事件性质</div>*/}
                            {/*    <Input value={detail.character} onChange={this.dataEdit.bind(this, 1, 'character')} className={cssStyle.addRowContent}/>*/}
                            {/*</div>*/}
                            <div className={cssStyle.eventAddRow}>
                                <div className={cssStyle.addRowTitle}>适用类型</div>
                                <Select value={detail.subType} onChange={this.dataEdit.bind(this, 2, 'subType')} className={cssStyle.addRowContent}>
                                    {subTypeList.map((subType, index) =>
                                        <Select.Option value={subType.id} key={index}>{subType.name}</Select.Option>
                                    )}
                                </Select>
                            </div>
                            <div className={cssStyle.eventAddRow}>
                                <div className={cssStyle.addRowTitle}>事件等级</div>
                                <Select value={detail.level} onChange={this.dataEdit.bind(this, 2, 'level')} className={cssStyle.addRowContent}>
                                    <Select.Option value={1}>特大</Select.Option>
                                    <Select.Option value={2}>重大</Select.Option>
                                    <Select.Option value={3}>较大</Select.Option>
                                    <Select.Option value={4}>一般</Select.Option>
                                </Select>
                            </div>
                            <div className={cssStyle.eventAddRow}>
                                <div className={cssStyle.addRowTitle}>影响范围</div>
                                <Input value={detail.influence} onChange={this.dataEdit.bind(this, 1, 'influence')} className={cssStyle.addRowContent} />
                            </div>
                            <div className={cssStyle.eventAddRow}>
                                <div className={cssStyle.addRowTitle}>备注</div>
                                <Input value={detail.remark} onChange={this.dataEdit.bind(this, 1, 'remark')} className={cssStyle.addRowContent} />
                            </div>
                            <div className={cssStyle.eventAddRow}>
                                <div className={cssStyle.addRowTitle}>应急预案</div>
                                <Select value={detail.plan} onChange={this.dataEdit.bind(this, 2, 'plan')} className={cssStyle.addRowContent}>
                                    {planList.map((plan, index) =>
                                        <Select.Option value={plan.id} key={index}>{plan.planName}</Select.Option>
                                    )}
                                </Select>
                            </div>

                            <div className={cssStyle.editFootBox}>
                                <Button onClick={this.handleClickClose.bind(this)}>取消</Button>
                                <Button type="primary" onClick={this.discussEvent.bind(this)} loading={loading} >确定</Button>
                            </div>
                        </div>
                    </Scrollbars>

                }
            </Motion>
        );
    }
}