import React from "react";
import cssStyle from "./planStep.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import StepLine from "./planStepLine";

import stepIconOne from "../images/planStepOne.png";
import stepIconTwo from "../images/planStepTwo.png";
import { Modal } from "antd";
import axios from "axios";
import { emergencyUrl } from "../../../config";

const { confirm } = Modal;

export default class PlanStep extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { now: '', planStep: {}, emergencyId: '' };
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps, prevSatate) {
        if (prevProps.keyParams.emergencyId !== prevSatate.emergencyId) {
            this.setState({ emergencyId: prevProps.keyParams.emergencyId });
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    getChildWidth(step) {
        if (step) {
            const children = step.children;
            if (children && children.length >= 1) {
                let width = 0;
                let hasOtherFinish = false;
                children.forEach((item) => {
                    if (item.runFlag) {
                        hasOtherFinish = true;
                    }
                    width = width + this.getChildWidth(item);
                });
                if (hasOtherFinish) {
                    children.forEach((item) => {
                        if (!item.runFlag && hasOtherFinish) {
                            item.hasOtherFinish = true;
                        }
                    });
                }
                step.width = width;
            } else {
                step.width = 1;
            }
            return step.width;
        } else {
            return 0;
        }
    }

    finishStep(step, parentFlag) {
        if (!step.runFlag) {
            if (parentFlag) {
                if (step.hasOtherFinish) {
                    Modal.info({
                        content: '已进入其他分支，无法结束该节点！',
                    });
                } else {
                    confirm({
                        title: '确定要结束该节点吗？',
                        content: '',
                        okText: '确认',
                        cancelText: '取消',
                        onOk: () => {
                            const sendData = {
                                rbacToken: this.props.token,
                                emergencyId: this.props.emergencyId,
                                operationType: 103,
                                nextPlanTaskId: step.id
                            };
                            return new Promise((resolve) => {
                                axios.post(emergencyUrl + "/socialGovernance/emergencyProcess/emergencyOperate", sendData, { params: { rbacToken: this.props.token } }).then((response) => {
                                    resolve();
                                    if (response.data.success) {
                                        Modal.success({
                                            content: '已完成该节点。',
                                        });
                                        if (step.planTaskType === 'ZFW00405') {
                                            this.props.changeListShow({ id: 3, name: '已结束' }, true);
                                        } else {
                                            this.props.reGetDetail();
                                        }
                                    } else {
                                        Modal.error({
                                            content: response.data.data,
                                        });
                                    }
                                }).catch((error) => {
                                    resolve();
                                    Modal.error({
                                        content: '请求出错！',
                                    });
                                });
                            }).catch(() => console.log('Oops errors!'));
                        },
                        onCancel: () => { },
                    });
                }
            } else {
                Modal.info({
                    content: '上一节点未完成，无法结束该节点！',
                });
            }
        }
    }

    getStepOne(step, parentWidth, parentFlag) {
        let hasChild = step.children && step.children.length > 0;
        return (
            <div className={cssStyle.stepOneBox} style={{ width: step.width * 100 / parentWidth + '%' }}>
                <div className={cssStyle.stepNameBox} style={{ marginBottom: hasChild ? '4.5em' : '0px', cursor: step.runFlag ? 'default' : 'pointer' }}>
                    <StepLine step={step} />
                    <div className={cssStyle.stepName} onClick={this.finishStep.bind(this, step, parentFlag)}>
                        <img alt={''} src={step.runFlag ? stepIconTwo : stepIconOne} className={`${cssStyle.stepBg} ${step.runFlag ? cssStyle.finishStepBg : ''}`} />
                        <span>{step.name}</span>
                    </div>
                </div>
                <div className={cssStyle.stepChildBox}>
                    {hasChild && step.children.map((child, index) => {
                        return (
                            <React.Fragment key={index}>
                                {this.getStepOne(child, step.width, step.runFlag)}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        )
    }

    //获取事件详情
    getEventDetail(id) {
        this.setState({ detail: {} });
        // const eventDetailUrl = emergencyUrl + "/socialGovernance/emergencyProcess/getEmergencyEventDetail";
        const eventDetailUrl = emergencyUrl + "/socialGovernance/YQemergencyProcess/getProcessTree";
        // const eventDetailUrl = "./json/ruian/detail.json";
        axios.get(eventDetailUrl, { params: { emergencyId: id, rbacToken: this.props.token, type: this.state.listType } }).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            // console.log('planStep', result);
            if (result) {
                const data = {
                    planStep: result ? result : {},
                };
                this.setState(data);
            }
        }).catch(function (error) {
            // 处理请求出错的情况
        });
    }

    render() {
        const planStep = this.props.detail;
        if (planStep) {
            this.getChildWidth(planStep);
            return (
                <Scrollbars>
                    <div className={cssStyle.stepBoxBg} style={{ width: planStep.width * 50 + '%' }}>
                        {this.getStepOne(planStep, planStep.width)}
                    </div>
                </Scrollbars>
            );
        } else {
            return '';
        }
    }
}