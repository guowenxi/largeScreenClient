/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./jinHaiEquipmentNumber.module.css";
import { getCompatibleData } from "../../../common/detailUtil";

import { interactData } from "../../../common/util";

export default class PeopleLucheng extends React.Component {
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
    }

    render() {
        const { detail } = this.props;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        return (
            <div
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding, }}
                className={cssStyle.container}
            >
                <div className={`${cssStyle.number} ${cssStyle.common}`}>
                    <span className={cssStyle.label}>设备数量：</span>
                    {detail.number}
                </div>
                <div className={`${cssStyle.status} ${cssStyle.common}`}>
                    <span className={cssStyle.label}>设备状态：</span>
                    <span className={cssStyle.statusText}>{detail.status}</span>
                </div>
                <div className={`${cssStyle.common}`}>
                    <span className={cssStyle.label}>水压值：</span>
                    <span className={cssStyle.pressureText}>{detail.waterPressure}</span>
                </div>
                <div className={`${cssStyle.common}`}>
                    <span className={cssStyle.label}>设备名称(备注)：</span>
                    {detail.name}
                </div>
                <div className={`${cssStyle.common}`}>
                    <span className={cssStyle.label}>设备位置：</span>
                    {detail.position}
                </div>
                <div className={`${cssStyle.common}`}>
                    <span className={cssStyle.label}>安装时间：</span>
                    {detail.time}
                </div>
            </div>
        );
    }
}