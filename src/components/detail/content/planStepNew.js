/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./planStepNew.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { interactData } from "../../../common/util";

import icon1 from '../images/planStepNewThree.png';
import icon2 from '../images/planStepNewFour.png';

export default class PlanStepNew extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { now: '', planStep: {}, emergencyId: '' };
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps, prevSatate) {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    // 点击关闭交互
    handleClickClose() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, { emergencyId: this.props.keyParams });
    }

    getProcessOverview(process) {
        return (
            <div className={cssStyle.processBox}>
                {process.name &&
                    <div className={cssStyle.processNameBox}>
                        <div className={`${cssStyle.processName} ${process.runFlag ? cssStyle.activeProcessName : ''}`}>{process.name}</div>
                        {this.getProcessLine(process)}
                        {/* {
                            process.children && process.children.length >= 2 &&
                            <div className={cssStyle.successText}>
                                <span
                                    style={{ color: process.children[0].runFlag ? '#4dc4b6' : '#c75f6c' }}
                                >{process.children[0].runFlag ? '处置成功' : '未成功'}</span>
                                <span
                                    style={{ color: process.children[1].runFlag ? '#4dc4b6' : '#c75f6c' }}
                                >{process.children[1].runFlag ? '处置成功' : '未成功'}</span>
                            </div>
                        } */}
                    </div>
                }
                <div className={cssStyle.processChildren}>
                    {
                        process.children && process.children.length > 0 &&
                        process.children.map((item, index) => {
                            return (
                                <React.Fragment key={index}>
                                    {this.getProcessOverview(item)}
                                </React.Fragment>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    getProcessLine(process) {
        if (process.children && process.children.length >= 2) {
            return (
                <div className={cssStyle.forkNode}>
                    <img src={icon2} alt="" />
                </div>
            )
        } else if (process.children && process.children.length < 2 && process.children.length > 0) {
            return (
                <div className={cssStyle.continuousNode}>
                    <img src={icon1} alt="" />
                </div>
            )
        } else {
            return null;
        }
    }
    render() {
        const { detail } = this.props;
        return (
            <div style={{ ...this.props.style, }} className={cssStyle.container}>
                <div className={cssStyle.top}>
                    <span className={cssStyle.title}>流程全貌</span>
                    <span className={cssStyle.closeIcon} onClick={this.handleClickClose.bind(this)}></span>
                </div>
                <Scrollbars style={{ height: 'calc(100% - 3.6em)' }}>
                    <div className={cssStyle.center}>
                        {this.getProcessOverview(detail)}
                    </div>
                </Scrollbars>

            </div>
        )
    }
}