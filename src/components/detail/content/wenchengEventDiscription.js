/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./wenchengEventDiscription.module.css";
import { interactData } from "../../../common/util";

import SpringScrollbars from "../../../common/springScrollbars";

import { PhotoProvider, PhotoConsumer } from 'react-photo-view';
import axios from "axios";

import { Rate } from 'antd';
export default class EventTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { detail: {}, targetObjectTypeList: [], };
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }
    componentDidUpdate(prveProps) {
        if (prveProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            this.setState({ eventId: prveProps.keyParams.id }, () => {
                this.getTargetObjectTypeList();
                this.getEventDiscription();
            })
        }
    }
    //组件删除时触发函数
    componentWillUnmount() {
    }
    // 判断文件格式
    switchFileType(type) {
        const thisType = ['image', 'video',].filter(item => type.includes(item));
        return thisType[0];
    }
    // 渲染视频和图片
    getEnclosureRender(eventFileList) {
        return (
            <PhotoProvider>
                {
                    Array.isArray(eventFileList) && eventFileList.map((item, index) => {
                        const type = this.switchFileType(item.fileType);
                        const { fileServiceUrl } = this.props.styleData;
                        return (
                            (type === 'image' || type === 'video') &&
                            <div key={item.fileId} style={{ width: '30%', marginRight: '0.5em', marginBottom: '0.8em' }}>
                                {type === 'image' &&
                                    (
                                        <PhotoConsumer
                                            src={`${fileServiceUrl}/peopleAffair/uploadFlv/downloadRb/${item.fileId}?rbacToken=${this.props.token}`}
                                            intro={item.fileName}
                                        >
                                            <img
                                                src={`${fileServiceUrl}/peopleAffair/uploadFlv/downloadRb/${item.fileId}?rbacToken=${this.props.token}`}
                                                alt=""
                                                style={{ width: '100%', height: '8em', }}
                                                title={item.fileName}
                                            />
                                        </PhotoConsumer>
                                    )
                                }
                                {type === 'video' &&
                                    <video
                                        src={`${fileServiceUrl}/peopleAffair/uploadFlv/downloadRb/${item.fileId}?rbacToken=${this.props.token}`}
                                        controls
                                        autoPlay
                                        style={{ width: '100%', height: '8em', }}
                                        title={item.fileName}
                                    ></video>
                                }
                                {(type === 'image' || type === 'video') && <span
                                    className={cssStyle.onlyLine}
                                    title={item.fileName}
                                >{item.fileName}</span>}
                            </div>
                        )
                    })
                }
            </PhotoProvider>
        )
    }
    // 渲染文件
    getFileRender(eventFileList) {
        const { fileServiceUrl } = this.props.styleData;
        return (
            Array.isArray(eventFileList) && eventFileList.map((item, index) => {
                const type = this.switchFileType(item.fileType);
                return (
                    (type !== 'image' && type !== 'video') &&
                    <div key={item.fileId} style={{ display: 'flex', alignItems: 'center', width: '100%', marginRight: '0.5em', marginBottom: '0.8em' }}>
                        <span
                            title={item.fileName}
                        >{item.fileName}</span>
                        <div style={{ lineHeight: '2em', width: '5em', marginLeft: '0.5em' }}>
                            <a href={`${fileServiceUrl}/peopleAffair/uploadFlv/downloadRb/${item.fileId}?rbacToken=${this.props.token}`}>点击下载</a>
                        </div>
                    </div>
                )
            })
        )
    }
    // 获取举报对象类型
    getTargetObjectTypeList() {
        const { fileUrl } = this.props.styleData;
        const url = fileUrl + '/peopleAffair/dictionaries/getTargetObjectTypeList';
        axios.get(url, { params: { rbacToken: this.props.token, id: this.state.eventId } })
            .then((res) => {
                if (res.data.success) {
                    const { data } = res.data;
                    this.setState({ targetObjectTypeList: data });
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }
    // 获取事件详情
    getEventDiscription() {
        const { fileUrl } = this.props.styleData;
        const url = fileUrl + '/peopleAffair/event/getEventDetail';
        axios.get(url, { params: { rbacToken: this.props.token, id: this.state.eventId } })
            .then((res) => {
                if (res.data.success) {
                    const { data } = res.data;
                    this.setState({ detail: data });
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }
    render() {
        const { detail, targetObjectTypeList } = this.state;
        const statusList = [{ "text": "待分配", "value": 0, color: '#ffb023' }, { "text": "待签收", "value": 1, color: '#ffb023' }, { "text": "处置中", "value": 2, color: '#00aaff' }, { "text": "已办结", "value": 3, color: '#00aaff' }, { "text": "已反馈", "value": 4, color: '#00aaff' }, { "text": "不予受理", "value": 5, color: '#ff4446' }, { "text": "已撤诉", "value": 6, color: '#9b9b9b' }, { "text": "已逾期", "value": 306, color: '#ff4446', }];
        const handleArr = statusList.filter(item => item.value === detail.handleStatus);
        const handleStatusName = handleArr.length > 0 ? handleArr[0].text : '';
        const handleColor = handleArr.length > 0 ? handleArr[0].color : '#fff';
        const targetObjectTypeInfo = targetObjectTypeList.filter(item => item.sysNumber === detail.targetObjectType);
        const targetObjectTypeName = (Array.isArray(targetObjectTypeInfo) && targetObjectTypeInfo.length > 0) ? targetObjectTypeInfo[0].name : detail.targetObjectType;
        const rateLevels = ['非常不满意', '不满意', '基本满意', '满意', '非常满意'];
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <SpringScrollbars style={{ width: '100%', height: '100%' }}>
                    <div className={cssStyle.itemBox}>
                        <span className={cssStyle.title}>事件名称：</span>
                        <span className={cssStyle.content}>{detail.eventSubject}</span>
                    </div>
                    <div className={cssStyle.itemBox}>
                        <span className={cssStyle.title}>相关事件：</span>
                        <span
                            className={cssStyle.content}
                            style={{ color: ['#009cec', '#eaa225', '#d43a40'][detail.eventLevel - 1] }}
                        >{detail.relateEventNum}件</span>
                    </div>
                    <div className={cssStyle.itemBox}>
                        <div className={cssStyle.contentBox}>
                            <span className={cssStyle.title}>上报类型：</span>
                            <span className={cssStyle.content}>{detail.reportTypeName}</span>
                        </div>
                        <div className={cssStyle.contentBox}>
                            <span className={cssStyle.title}>事件类型：</span>
                            <span className={cssStyle.content}>{detail.eventTypeName}</span>
                        </div>
                    </div>
                    <div className={cssStyle.itemBox}>
                        <div className={cssStyle.contentBox}>
                            <span className={cssStyle.title}>风险等级：</span>
                            <span
                                className={cssStyle.content}
                                style={{ color: ['#009cec', '#eaa225', '#d43a40'][detail.eventLevel - 1] }}
                            >
                                {['低风险', '中风险', '高风险'][detail.eventLevel - 1]}
                            </span>
                        </div>
                        <div className={cssStyle.contentBox}>
                            <span className={cssStyle.title}>上报渠道：</span>
                            <span className={cssStyle.content}>{detail.reportChannel}</span>
                        </div>
                    </div>
                    <div className={cssStyle.itemBox}>
                        <div className={cssStyle.contentBox} >
                            <span className={cssStyle.title} >所属区域：</span>
                            <span className={cssStyle.content}>{detail.orgInternalName || detail.orgInternalCode}</span>
                        </div>
                        <div className={cssStyle.contentBox}>
                            <span className={cssStyle.title}>投诉/举报对象：</span>
                            <span className={cssStyle.content}>
                                <span>{targetObjectTypeName} {detail.targetObject}</span>
                            </span>
                        </div>
                    </div>
                    <div className={cssStyle.itemBox}>
                        <span className={cssStyle.title}>事件内容：</span>
                        <p className={cssStyle.content} style={{ margin: 0, lineHeight: 1.5, }}>{detail.eventContent}</p>
                    </div>
                    <div className={cssStyle.itemBox}>
                        <span className={cssStyle.title}>附件：</span>
                        <div className={`${cssStyle.content}`} style={{ width: 'calc(100% - 9em)' }}>
                            <div className={cssStyle.fileBox}>
                                {this.getEnclosureRender(detail.eventFileList)}
                            </div>
                            {this.getFileRender(detail.eventFileList)}
                        </div>
                    </div>
                    <div className={cssStyle.itemBox}>
                        <span className={cssStyle.title}>上报人：</span>
                        <span className={cssStyle.content}>{detail.createUserName}</span>
                    </div>
                    <div className={cssStyle.itemBox}>
                        <span className={cssStyle.title}>上报时间：</span>
                        <span className={cssStyle.content}>{detail.createDateStr}</span>
                    </div>
                    <div className={cssStyle.itemBox}>
                        <span className={cssStyle.title}>事件状态：</span>
                        <span className={cssStyle.content} style={{ color: handleColor }}>{handleStatusName}</span>
                    </div>
                    {detail.eventEvaluateInfo && <div className={cssStyle.itemBox}>
                        <span className={cssStyle.title}>反馈详情：</span>
                        <div style={{ marginLeft: '1em' }}>
                            {
                                (!!detail.eventEvaluateInfo.series || detail.eventEvaluateInfo.series === 0) &&
                                <div className={cssStyle.rateBox}>
                                    <Rate disabled value={detail.eventEvaluateInfo.series} />
                                    <span className={cssStyle.rateText}>{rateLevels[detail.eventEvaluateInfo.series - 1] || '非常不满意'}</span>
                                </div>
                            }
                            <div className={cssStyle.rateLabelBox}>
                                {
                                    detail.eventEvaluateInfo.evaluateLable &&
                                    detail.eventEvaluateInfo.evaluateLable.split(',').map((item, index) => {
                                        return <span key={index} className={cssStyle.rateLabel} >{item}</span>
                                    })
                                }
                            </div>
                            <div>
                                {detail.eventEvaluateInfo.evaluateContent}
                            </div>
                        </div>
                    </div>}
                </SpringScrollbars>
            </div>
        );
    }
}