/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./eventDiscriptionNew.module.css";
import { getCompatibleData } from "../../../common/detailUtil";

import { interactData } from "../../../common/util";

import { Scrollbars } from 'react-custom-scrollbars';

export default class EventDiscriptionNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        // this.sendMessage();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            this.sendMessage();
        }
    }

    sendMessage() {
        const { detail } = this.props;
        const { interact } = this.props.thisData.dataSources;
        if (detail && detail.runHanding) {
            this.interactData(interact, detail ? detail.runHanding : null);
        }
    }

    render() {
        const { detail } = this.props;
        const { runHanding } = detail;
        return (
            <div style={{ ...this.props.style }} className={cssStyle.container}>
                {
                    runHanding &&
                    <>
                        <Scrollbars style={{ with: '100%', height: '100%' }}>
                            <div className={`${cssStyle.title} ${cssStyle.line}`}>{runHanding.title}</div>
                            <div className={`${cssStyle.time} ${cssStyle.line}`}>{runHanding.createTime}</div>
                            <div className={`${cssStyle.address} ${cssStyle.line}`}>{runHanding.incidentAddress}</div>
                            <div className={cssStyle.discription}>事件描述：{runHanding.incidentContent}</div>
                        </Scrollbars>
                    </>
                }
            </div>
        );
    }
}