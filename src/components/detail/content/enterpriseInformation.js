/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./enterpriseInformation.module.css";
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
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {

    }

    render() {
        const { detail } = this.props;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        return (
            <div
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding, width: '100%', height: '100%' }}
            >
                <div className={cssStyle.itemBox}>
                    <div className={`${cssStyle.item} ${cssStyle.background}`}>
                        <span className={cssStyle.name}>企业名称</span>
                        <span className={cssStyle.content} title={detail.enterpriseName}>{detail.enterpriseName}</span>
                    </div>
                    <div className={`${cssStyle.item} ${cssStyle.background}`}>
                        <span className={cssStyle.name}>法定代表人</span>
                        <span className={cssStyle.content} title={detail.representer}>{detail.representer}</span>
                    </div>
                </div>
                <div className={cssStyle.itemBox}>
                    <div className={cssStyle.item}>
                        <span className={cssStyle.name}>统一社会信用代码</span>
                        <span className={cssStyle.content} title={detail.creditCode}>{detail.creditCode}</span>
                    </div>
                    <div className={cssStyle.item}>
                        <span className={cssStyle.name}>联系方式</span>
                        <span className={cssStyle.content} title={detail.phone}>{detail.phone}</span>
                    </div>
                </div>
                <div className={cssStyle.itemBox}>
                    <div className={`${cssStyle.item} ${cssStyle.background}`}>
                        <span className={cssStyle.name}>经营地址</span>
                        <span className={cssStyle.content} title={detail.address}>{detail.address}</span>
                    </div>
                    <div className={`${cssStyle.item} ${cssStyle.background}`}>
                        <span className={cssStyle.name}>行业</span>
                        <span className={cssStyle.content} title={detail.industryType}>{detail.industryType}</span>
                    </div>
                </div>
                <div className={cssStyle.itemBox}>
                    <div className={cssStyle.item}>
                        <span className={cssStyle.name}>企业类型</span>
                        <span className={cssStyle.content} title={detail.enterpriseType}>{detail.enterpriseType}</span>
                    </div>
                    <div className={cssStyle.item}>
                        <span className={cssStyle.name}>成立日期</span>
                        <span className={cssStyle.content} title={detail.registerDate}>{detail.registerDate}</span>
                    </div>
                </div>
                <div className={cssStyle.itemBox}>
                    <div className={`${cssStyle.item} ${cssStyle.background}`}>
                        <span className={cssStyle.name}>经营范围</span>
                        <span className={cssStyle.content} title={detail.manageScope}>{detail.manageScope}</span>
                    </div>
                    <div className={`${cssStyle.item} ${cssStyle.background}`}>
                        <span className={cssStyle.name}>企业标签</span>
                        <span className={cssStyle.content} title={detail.enterpriseLabel}>{detail.enterpriseLabel}</span>
                    </div>
                </div>
                <div className={cssStyle.itemBox}>
                    <div className={cssStyle.item}>
                        <span className={cssStyle.name}>行政区划</span>
                        <span className={cssStyle.content} title={detail.admDivision}>{detail.admDivision}</span>
                    </div>
                    <div className={cssStyle.item}>
                        <span className={cssStyle.name}>平安网格</span>
                        <span className={cssStyle.content} title={detail.safeGrid}>{detail.safeGrid}</span>
                    </div>
                </div>
            </div>
        );
    }
}