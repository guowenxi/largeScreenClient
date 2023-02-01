/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./monitorJinhai.module.css";
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
                <div className={cssStyle.home}>
                    <img alt="" className={cssStyle.homeImg} src={require('../images/iconOneJinhai.png')} />
                </div>
                <div className={cssStyle.onlyLine}>
                    <span className={cssStyle.label} >时间：</span>
                    <span style={{ flex: 1, }} className={cssStyle.time}>{detail.time}</span>
                </div>
                <div className={cssStyle.onlyLine}>
                    <div
                        style={{ display: 'flex', alignItems: 'center' }}
                        className={cssStyle.label}
                    >
                        <img alt="" style={{ width: '1.6em', height: '1.6em', marginRight: '0.5em', }} src={require('../images/iconTwoJinhai.png')} />
                        <span>处理人：</span>
                    </div>
                    <span>{detail.name}</span>
                    <span className={cssStyle.phone}>{detail.phone}</span>
                </div>
                <div className={cssStyle.onlyLine}>
                    <span className={cssStyle.label}>告警地址：</span>
                    <span style={{ flex: 1, }}>{detail.address}</span>
                </div>
                <div className={cssStyle.multiLine}>
                    <span className={cssStyle.label}>告警原因：</span>
                    <span style={{ flex: 1, }}>{detail.reason}</span>
                </div>
                <div className={cssStyle.multiLine}>
                    <span className={cssStyle.label}>处理结果：</span>
                    <span style={{ flex: 1, }}>{detail.result}</span>
                </div>
            </div>
        );
    }
}