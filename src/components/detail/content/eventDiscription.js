/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./eventDiscription.module.css";
import { getCompatibleData } from "../../../common/detailUtil";

import { interactData } from "../../../common/util";

import { Scrollbars } from 'react-custom-scrollbars';

export default class EventProgress extends React.Component {
    constructor(props) {
        super(props);
        this.state = { detail: {} };
        this.getCompatibleData = getCompatibleData.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.sendMessage();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime && this.props.getDataTime){
            this.sendMessage();
        }
    }

    sendMessage(){
        const { detail } = this.props;
        if(detail && detail.runHanding){
            const { sendDiscriptionDataInteract } = this.props.thisData.style;
            this.interactData(sendDiscriptionDataInteract, detail ? detail.runHanding : null);
        }
    }

    render() {
        const { detail } = this.props;
        const { runHanding } = detail;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        return (
            <div
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding, width: '100%', height: '100%' }}
            >
                {
                    detail.runHanding && <div className={`${cssStyle.container} ${cssStyle.background}`}>
                        <Scrollbars style={{ with: '100%', height: '100%' }}>
                            <div className={cssStyle.title}>{runHanding.title}</div>
                            <div className={cssStyle.time}>{runHanding.createTime}</div>
                            <div className={cssStyle.address}>{runHanding.incidentAddress}</div>
                            <div className={cssStyle.discription}>事件描述:{runHanding.incidentContent}</div>
                        </Scrollbars>
                    </div>
                }
            </div>
        );
    }
}