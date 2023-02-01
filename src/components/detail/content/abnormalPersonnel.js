/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from './abnormalPersonnel.module.css';
import Scrollbars from "react-custom-scrollbars";

import { interactData } from "../../../common/util";
import axios from "axios";
export default class AbnormalPersonnel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            basicInfo: {}, riskWarning: {}, relatedPersonInfo: {}, trendAssessment: {}, controlTrack: {}
        };
        this.interactData = interactData.bind(this);
        this.titles = ['个人基本信息', '风险预警', '关联人信息', '趋势评估', '管控轨迹'];
        this.nameList1 = [{ name: '人员姓名', key: 'name' }, { name: '性别', key: 'sex' }, { name: '身份证号', key: 'cardId' }, { name: '年龄', key: 'age' }, { name: '联系方式', key: 'phone' }, { name: '户籍地址', key: 'censusRegister' }, { name: '现居地址', key: 'address', width: '100%' }];
        this.nameList2 = [{ title: '风险等级', content: [{ name: '系统研判', key: 'systemJudge' }, { name: '人工复核', key: 'artificialJudge' }, { name: '家和码', key: 'familyRisk' }, { name: '专业心理评价', key: 'psychologicalAssessment' }, { name: '是否特殊人员', key: 'specialGroup', width: '100%' }] }, { title: '识别要素', content: [{ name: '性格', key: 'character', width: '100%' }, { name: '行为', key: 'action', width: '100%' }, { name: '事件', key: 'event', width: '100%' }] }];
        this.nameList3 = [{ name: '姓名', key: 'name' }, { name: '身份证', key: 'idCode' }, { name: '性别', key: 'gender' }, { name: '联系电话', key: 'phone' }, { name: '现居地址', key: 'address' }, { name: '网格', key: 'grid' }]
        this.levelColor = ['', 'rgb(208, 2, 27)', 'rgb(245, 166, 35)', 'rgb(248, 231, 28)', 'rgb(18, 183, 150)'];
        this.level = ['', '红', '橙', '黄', '绿'];
    }

    //组件删除时触发函数
    componentWillUnmount() {

    }
    componentDidUpdate(prveProps) {
        if (prveProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            this.init();
        }
    }
    //组件加载触发函数
    componentDidMount() {
        const { fileUrl } = this.props.styleData;
        this.baseUrl = fileUrl;
        // this.init();
    }
    // 获取基本信息
    getBasicInfo() {
        const { id } = this.props.keyParams;
        const url = this.baseUrl + '/fyDataManage/spc/getBasicInfo';
        axios.get(url, { params: { rbacToken: this.props.token, id } })
            .then((res) => {
                const { success, data } = res.data;
                if (success) {
                    this.setState({ basicInfo: data });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
    // 获取风险预警
    getRiskWarning() {
        const { id } = this.props.keyParams;
        const url = this.baseUrl + '/fyDataManage/spc/getRiskInfo';
        axios.get(url, { params: { rbacToken: this.props.token, id } })
            .then((res) => {
                const { success, data } = res.data;
                if (success) {
                    this.setState({ riskWarning: data });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
    // 获取关联人信息
    getRelatedPersonInfo() {
        const { id } = this.props.keyParams;
        const url = this.baseUrl + '/fyDataManage/spc/getAssociatedPersonInfo';
        axios.get(url, { params: { rbacToken: this.props.token, id } })
            .then((res) => {
                const { success, data } = res.data;
                if (success) {
                    this.setState({ relatedPersonInfo: data });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
    // 获取趋势分析
    getTrendAssessment() {
        const { id } = this.props.keyParams;
        const url = this.baseUrl + '/fyScreen/townshipStreet/abnormalMapDesc';
        axios.get(url, { params: { rbacToken: this.props.token, id } })
            .then((res) => {
                const { success, data } = res.data;
                if (success) {
                    this.setState({ trendAssessment: data });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
    // 获取管控轨迹
    getControlTrack() {
        const { id } = this.props.keyParams;
        const url = this.baseUrl + '/fyDataManage/spc/getControlTrajectory';
        axios.get(url, { params: { rbacToken: this.props.token, id } })
            .then((res) => {
                const { success, data } = res.data;
                if (success) {
                    this.setState({ controlTrack: data });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
    init() {
        this.getBasicInfo();
        this.getRiskWarning();
        this.getRelatedPersonInfo();
        this.getTrendAssessment();
        this.getControlTrack();
    }
    // 渲染头部
    renderHeader(index) {
        return (
            <div className={cssStyle.header} style={{ paddingTop: index === 1 ? 0 : '1em' }}>
                {this.titles[index - 1]}
            </div>
        )
    }
    // 渲染基本信息
    renderBasicInfo() {
        return (
            <>
                {this.renderHeader(1)}
                <div className={cssStyle.basicInfo}>
                    {
                        this.nameList1.map(({ name, key, width }) => {
                            return (
                                <div key={key} className={cssStyle.basicInfoItem} style={{ width: width || '50%' }}>
                                    {name}:
                                    <span className={cssStyle.basicInfoContent}>{this.state.basicInfo[key]}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )
    }
    // 渲染风险预警
    renderRiskWarning() {
        return (
            <>
                {this.renderHeader(2)}
                {
                    this.nameList2.map(({ title, content }) => {
                        return (
                            <div key={title} className={cssStyle.riskWarning}>
                                <div className={cssStyle.riskWarningTitle}>
                                    <span className={cssStyle.lineOne}></span>
                                    <span className={cssStyle.lineTwo}></span>
                                    <span>{title}</span>
                                </div>
                                <div className={cssStyle.riskWarningContent}>
                                    {
                                        content.map(({ name, key, width }) => {
                                            const flag = key === 'systemJudge' || key === 'artificialJudge' || key === 'familyRisk' || key === 'psychologicalAssessment';
                                            const flag2 = key === 'character' || key === 'action' || key === 'event';
                                            const { riskWarning } = this.state;
                                            const value = riskWarning[key];
                                            const info = flag ? this.level[Number(value)] : value;
                                            const color = flag ? this.levelColor[Number(value)] : '#fff';
                                            const lineHeight = flag2 ? '1.2em' : '1em';
                                            return (
                                                <div key={key} style={{ width: width || '50%' }} className={cssStyle.riskWarningContentItem}>
                                                    {name}:
                                                    <span className={cssStyle.riskWarningInnerContent} style={{ color, lineHeight }}>{info}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </>
        )
    }
    // 关联人信息每项的连接线
    getVerticalLine(index, length) {
        return (
            <>
                {
                    index === 0 &&
                    <div className={cssStyle.verticalLine} style={{ height: 'calc(100 % - 1.7em)', marginTop: '1.7em' }} ></div>
                }
                {
                    length >= 2 && index === length - 1 &&
                    <div className={cssStyle.verticalLine} style={{ height: '1.85em' }}></div>
                }
                {
                    length >= 3 && (index !== 0 && index !== length - 1) &&
                    <div className={cssStyle.verticalLine}></div>
                }
            </>
        )
    }
    // 渲染关联人信息
    renderRelatedPersonInfo() {
        const { relatedPeople, name } = this.state.relatedPersonInfo;
        return (
            <>
                {this.renderHeader(3)}
                {
                    Array.isArray(relatedPeople) &&
                    (
                        <div className={cssStyle.relatedPerson}>
                            <div className={cssStyle.relatedPersonNameBox}>
                                <div className={cssStyle.name}>{name}</div>
                                {relatedPeople.length > 0 && <span className={cssStyle.horizontalLine}></span>}
                            </div>
                            <div className={cssStyle.relationBox}>
                                <div className={cssStyle.relationList}>
                                    {
                                        relatedPeople.map((item, index, arr) => {
                                            return (
                                                <div className={cssStyle.relationItem} key={index} >
                                                    {this.getVerticalLine(index, arr.length)}
                                                    <div className={cssStyle.relationLeft}>
                                                        <div className={cssStyle.connectingBox}>
                                                            <span className={cssStyle.connectingLine}></span>
                                                            <div className={cssStyle.relationContent}>{item.relation}</div>
                                                        </div>
                                                        <div className={cssStyle.relationName}>{item.name}</div>
                                                    </div>
                                                    <div
                                                        className={cssStyle.relationRight}
                                                        style={{ paddingBottom: arr.length - 1 !== index ? '2em' : 0 }}
                                                    >
                                                        {
                                                            this.nameList3.map(({ key, name }) => {
                                                                return (
                                                                    <div className={cssStyle.listItem} key={key}>
                                                                        <span className={cssStyle.title}>{name}：</span>
                                                                        <span className={cssStyle.content}>{item[key]}</span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </>
        )
    }
    // 渲染趋势评估
    renderTrendAssessment() {
        const { trendAssessment } = this.state;
        return (
            <>
                {this.renderHeader(4)}
                <div className={cssStyle.trendAssessment}>
                    {trendAssessment && trendAssessment.describeTitle}
                </div>
            </>
        )
    }
    // 渲染管控轨迹
    renderControlTrack() {
        const { process } = this.state.controlTrack;
        return (
            <>
                {this.renderHeader(5)}
                {
                    Array.isArray(process) && process.length > 0 &&
                    process.map(({ time, status, content }, index) =>
                        <div className={cssStyle.stepBox} key={index}>
                            <div className={cssStyle.point} />
                            <div className={cssStyle.line} />
                            <div className={cssStyle.time}>{time}</div>
                            <div className={cssStyle.status}>{status}</div>
                            <div className={cssStyle.stepContent}>{content}</div>
                        </div>
                    )
                }
            </>
        )
    }
    render() {
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <Scrollbars>
                    {this.renderBasicInfo()}
                    {this.renderRiskWarning()}
                    {this.renderRelatedPersonInfo()}
                    {this.renderTrendAssessment()}
                    {this.renderControlTrack()}
                </Scrollbars>
            </div>
        );
    }
}