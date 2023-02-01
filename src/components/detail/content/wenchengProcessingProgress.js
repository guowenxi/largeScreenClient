/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./wenchengProcessingProgress.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { interactData } from "../../../common/util";

import axios from 'axios';

import icon1 from '../images/wenchengProcessingProgressOne.png';
import icon2 from '../images/wenchengProcessingProgressTwo.png';
import icon3 from '../images/wenchengProcessingProgressThree.png'
import icon4 from '../images/wenchengProcessingProgressFour.png'
import line2 from '../images/wenchengProcessingProgressFive.png';
import line1 from '../images/wenchengProcessingProgressSix.png';
import icon5 from '../images/wenchengProcessingProgressSeven.png';
import icon6 from '../images/wenchengProcessingProgressEight.png';
import icon7 from '../images/wenchengProcessingProgressNine.png';
import icon8 from '../images/wenchengProcessingProgressTen.png';

import { Icon } from "antd";

export default class EventTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProcessList: [],
            eventId: '',
            disposal: { hostHandleDepart: {}, coHandleDepartList: [], supervisePeople: {}, refusedHostDepartList: [] },
            eventNotesList: [],
            expectCompleteList: [],
            delayReminder: '',
        };
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }
    //组件删除时触发函数
    componentWillUnmount() {
    }
    componentDidUpdate(prveProps) {
        if (prveProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            this.setState({ eventId: prveProps.keyParams.id }, () => {
                this.init();
            })
        }
    }
    init() {
        this.getCurrentProcess();
        this.getDisposal();
        this.getEventNotes();
    }
    // 获取处理进度
    getCurrentProcess() {
        const { fileUrl } = this.props.styleData;
        const url = fileUrl + '/peopleAffair/event/getProgress';
        axios.get(url, { params: { rbacToken: this.props.token, id: this.state.eventId } })
            .then((res) => {
                const { data, success } = res.data;
                if (success) {
                    const { handleStatusList, expectCompleteList, delayReminder } = data;
                    this.setState({
                        currentProcessList: handleStatusList,
                        expectCompleteList,
                        delayReminder,
                    });
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }
    // 获取处置情况
    getDisposal() {
        const { fileUrl } = this.props.styleData;
        const url = fileUrl + '/peopleAffair/event/getAssignDepart';
        axios.get(url, { params: { rbacToken: this.props.token, id: this.state.eventId } })
            .then((res) => {
                const { data } = res;
                if (data.success) {
                    const { hostHandleDepart, coHandleDepartList, supervisePeople, refusedHostDepartList } = data.data;
                    this.setState({
                        disposal: {
                            hostHandleDepart,
                            coHandleDepartList,
                            supervisePeople,
                            refusedHostDepartList,
                        },
                    });
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }
    // 获取事件备注
    getEventNotes() {
        const { fileUrl } = this.props.styleData;
        const url = fileUrl + '/peopleAffair/event/getHandleContent';
        axios.get(url, { params: { rbacToken: this.props.token, id: this.state.eventId } })
            .then((res) => {
                const { data } = res;
                if (data.success) {
                    this.setState({
                        eventNotesList: data.data
                    });
                }
            })
            .catch((e) => {
                console.log(e);
            })
    }
    // 选择处理进度的图标
    switchIcon(code) {
        // eslint-disable-next-line default-case
        switch (code) {
            case 6:
                return icon4;
            case 304:
                return icon2;
            case 5:
                return icon3;
            default:
                return icon8;
        }
    }
    // 选择签收状态下的图标
    switchSignIcon(signType) {
        switch (signType) {
            case 0:
                return icon6;
            case 1:
                return icon5;
            default:
                return icon7;
        }
    }
    // 判断事件的状态
    eventIsNotSignOrInadmissible(currentProcessList, statusCode) {
        return currentProcessList.some(item => item.statusCode === statusCode);
    }

    render() {
        const { currentProcessList, disposal, eventNotesList, expectCompleteList, delayReminder } = this.state;
        const { hostHandleDepart, coHandleDepartList, supervisePeople, refusedHostDepartList } = disposal;
        const { fileServiceUrl } = this.props.styleData;
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <div className={cssStyle.mainTop}>
                    <div className={cssStyle.left}>
                        <span style={{ display: 'block', marginBottom: '1em', fontSize: '1.2em' }}>当前进度：</span>
                        <Scrollbars style={{ width: '50%', height: 'calc(100% - 1em - 2.2em)' }}>
                            <div style={{ width: '100%', height: '100%' }}>
                                {
                                    Array.isArray(currentProcessList) && currentProcessList.length > 0 &&
                                    currentProcessList.map((item, index, arr) => {
                                        return (
                                            <div key={index} style={{ display: 'flex' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <img className={cssStyle.icon} alt="" src={item.arrive ? icon1 : this.switchIcon(item.statusCode)} />
                                                    {index !== arr.length - 1 && <img
                                                        className={cssStyle.line}
                                                        alt=""
                                                        src={arr[index + 1].arrive ? line1 : line2}
                                                    />}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', margin: '0.3em 0 0 1em' }}>
                                                    <span>{item.statusDescribe}</span>
                                                    <span style={{ marginTop: '0.3em' }}>{item.handleTime}</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Scrollbars>
                    </div>
                    {
                        (!this.eventIsNotSignOrInadmissible(currentProcessList, 6) && !this.eventIsNotSignOrInadmissible(currentProcessList, 5)) &&
                        <div className={cssStyle.right}>
                            <Scrollbars style={{ width: '100%', height: '100%' }}>
                                <span style={{ fontSize: '1.2em' }}>分配情况：</span>
                                {hostHandleDepart && !this.eventIsNotSignOrInadmissible(currentProcessList, 5) && <>
                                    {
                                        (
                                            <div style={{ display: 'flex', }}>
                                                <span className={cssStyle.title}>主办部门：</span>
                                                <div>
                                                    {
                                                        (!this.eventIsNotSignOrInadmissible(currentProcessList, 2) && (Array.isArray(refusedHostDepartList) && refusedHostDepartList.length > 0)) &&
                                                        refusedHostDepartList.map((item, index) => {
                                                            return (
                                                                <div style={{ display: 'flex', alignItems: 'center' }} key={index}>
                                                                    <span>{item.handleDepartName}</span>
                                                                    {
                                                                        !this.eventIsNotSignOrInadmissible(refusedHostDepartList, 2) &&
                                                                        <img
                                                                            alt=""
                                                                            style={{ width: '1.1em', height: '1.1em', marginRight: '0.5em' }}
                                                                            src={this.switchSignIcon(item.signType)}
                                                                        />
                                                                    }
                                                                    <span>
                                                                        {item.flowCount ? `第${item.flowCount}次分配` : ''}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    {
                                                        hostHandleDepart.handleDepartName &&
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <span>{hostHandleDepart.handleDepartName}</span>
                                                            {
                                                                !this.eventIsNotSignOrInadmissible(currentProcessList, 2) &&
                                                                <>
                                                                    <img
                                                                        alt=""
                                                                        style={{ width: '1.1em', height: '1.1em', marginRight: '0.5em' }}
                                                                        src={this.switchSignIcon(hostHandleDepart.signType)}
                                                                    />
                                                                    {
                                                                        Array.isArray(refusedHostDepartList) && refusedHostDepartList.length > 0 &&
                                                                        <span>
                                                                            {hostHandleDepart.flowCount ? `第${hostHandleDepart.flowCount}次分配` : ''}
                                                                        </span>
                                                                    }
                                                                </>
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        hostHandleDepart.handleUserName && this.eventIsNotSignOrInadmissible(currentProcessList, 302) && (Array.isArray(coHandleDepartList) && coHandleDepartList.length > 0 && coHandleDepartList.some(item => item.signType === 0)) &&
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span className={cssStyle.title}>处置人员：</span>
                                            <span>
                                                {hostHandleDepart.handleUserName}
                                                {hostHandleDepart.handleDepartName ? '-' + hostHandleDepart.handleDepartName : ''}
                                            </span>
                                            {
                                                !this.eventIsNotSignOrInadmissible(currentProcessList, 2) &&
                                                <img
                                                    alt=""
                                                    style={{ width: '1.1em', height: '1.1em' }}
                                                    src={this.switchSignIcon(hostHandleDepart.userSignType)}
                                                />
                                            }
                                        </div>
                                    }
                                    {
                                        !this.eventIsNotSignOrInadmissible(currentProcessList, 302) && (hostHandleDepart.handleUserId && hostHandleDepart.signType === 1) &&
                                        <div style={{ display: 'flex', }}>
                                            <span className={cssStyle.title}>处置结果：</span>
                                            <div>
                                                <span>
                                                    {hostHandleDepart.handleUserName}
                                                    {hostHandleDepart.handleDepartName ? '-' + hostHandleDepart.handleDepartName : ''}
                                                </span>
                                                <div>
                                                    {
                                                        hostHandleDepart.handleContent &&
                                                        <span style={{ color: '#1890ff', }}>备注：{hostHandleDepart.handleContent}</span>
                                                    }
                                                    {
                                                        Array.isArray(hostHandleDepart.eventFileList) &&
                                                        <div>
                                                            {
                                                                hostHandleDepart.eventFileList.length > 0 &&
                                                                hostHandleDepart.eventFileList.map((item, index) => {
                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={cssStyle.onlyLine}
                                                                            style={{ width: '18em', color: '#1890ff', }}
                                                                            title={item.fileName}
                                                                        >
                                                                            <Icon type="link" style={{ color: '#bbbbbb', marginRight: '0.5em' }} />
                                                                            <a
                                                                                href={`${fileServiceUrl}/peopleAffair/uploadFlv/downloadRb/${item.fileId}?rbacToken=${this.props.token}`}
                                                                            >{item.fileName}</a>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </>}
                                {
                                    (Array.isArray(coHandleDepartList) && coHandleDepartList.length > 0) &&
                                    <>
                                        <div style={{ display: 'flex' }}>
                                            <span className={cssStyle.title}>协办部门：</span>
                                            <div>
                                                {
                                                    coHandleDepartList.map((item, index) => {
                                                        return (
                                                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                                <span>{item.handleDepartName}</span>
                                                                {!this.eventIsNotSignOrInadmissible(currentProcessList, 2) && <img
                                                                    style={{ width: '1.1em', height: '1.1em' }}
                                                                    alt=""
                                                                    src={this.switchSignIcon(item.signType)}
                                                                />}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        {
                                            this.eventIsNotSignOrInadmissible(currentProcessList, 302) && coHandleDepartList.some(item => item.handleUserName) &&
                                            <div style={{ display: 'flex' }}>
                                                <span className={cssStyle.title}>处置人员：</span>
                                                <div>
                                                    {
                                                        coHandleDepartList.map((item, index) => {
                                                            return (
                                                                item.handleUserName &&
                                                                <div key={index}>
                                                                    <span>
                                                                        {item.handleUserName}
                                                                        {item.handleDepartName ? '-' + item.handleDepartName : ''}
                                                                    </span>
                                                                    {
                                                                        !this.eventIsNotSignOrInadmissible(currentProcessList, 2) &&
                                                                        <img
                                                                            alt=""
                                                                            style={{ width: '1.1em', height: '1.1em' }}
                                                                            src={this.switchSignIcon(item.userSignType)}
                                                                        />
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        }
                                        {!this.eventIsNotSignOrInadmissible(currentProcessList, 302) && coHandleDepartList.some(item => item.handleUserName) &&
                                            <div style={{ display: 'flex' }}>
                                                <span className={cssStyle.title}>处置结果：</span>
                                                <div>
                                                    {
                                                        coHandleDepartList.length > 0 && coHandleDepartList.map((item, index) => {
                                                            return (
                                                                item && <React.Fragment key={index}>
                                                                    <span style={{ margin: 0 }}>
                                                                        <span>{item.handleUserName}-{item.handleDepartName}</span>
                                                                        <div>
                                                                            {
                                                                                item.handleContent &&
                                                                                <span style={{ color: '#1890ff', }}>备注：{item.handleContent}</span>
                                                                            }
                                                                            {
                                                                                Array.isArray(item.eventFileList) &&
                                                                                <div>
                                                                                    {
                                                                                        item.eventFileList.length > 0 &&
                                                                                        item.eventFileList.map((fileItem, fileIndex) => {
                                                                                            return (
                                                                                                <div
                                                                                                    key={fileIndex}
                                                                                                    className={cssStyle.onlyLine}
                                                                                                    style={{ width: '18em', color: '#1890ff', }}
                                                                                                    title={fileItem.fileName}
                                                                                                >
                                                                                                    <Icon
                                                                                                        type="link"
                                                                                                        style={{ color: '#bbbbbb', marginRight: '0.5em' }}
                                                                                                    />
                                                                                                    <a
                                                                                                        href={`${fileServiceUrl}/peopleAffair/uploadFlv/downloadRb/${fileItem.fileId}?rbacToken=${this.props.token}`}
                                                                                                    >{fileItem.fileName}</a>
                                                                                                </div>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    </span>
                                                                </React.Fragment>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>}
                                    </>
                                }
                                {
                                    (supervisePeople && supervisePeople.handleUserName) &&
                                    <div style={{ display: 'flex' }}>
                                        <span className={cssStyle.title}>督办人：</span>
                                        <span>
                                            {supervisePeople.handleUserName}
                                            {hostHandleDepart && (hostHandleDepart.handleDepartName ? '-' + hostHandleDepart.handleDepartName : '')}
                                        </span>
                                    </div>
                                }
                                {
                                    (supervisePeople && supervisePeople.isCompleted === 1) &&
                                    <div>
                                        <span style={{ fontSize: '1.2em' }}>督办反馈：</span>
                                        <div style={{ display: 'flex' }}>
                                            <span className={cssStyle.title}>督办人：</span>
                                            <span>
                                                {supervisePeople.handleUserName}
                                                {hostHandleDepart && (hostHandleDepart.handleDepartName ? '-' + hostHandleDepart.handleDepartName : '')}
                                            </span>
                                        </div>
                                        {supervisePeople.handleContent &&
                                            <div style={{ display: 'flex' }}>
                                                <span className={cssStyle.title}>督办反馈：</span>
                                                <span>{supervisePeople.handleContent}</span>
                                            </div>}
                                    </div>
                                }

                                {
                                    (currentProcessList.length > 0 && currentProcessList[3].statusCode !== 3) &&
                                    <div>
                                        <span style={{ fontSize: '1.2em' }}>预计完成：</span>
                                        {
                                            (Array.isArray(expectCompleteList) && expectCompleteList.length > 0) &&
                                            expectCompleteList.map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <span>{item.name + '：'}</span>
                                                        <span style={{ color: '#13f0ff' }}>{item.value}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                        <span style={{ color: '#13f0ff' }}>{delayReminder}</span>
                                    </div>
                                }
                            </Scrollbars>
                        </div>
                    }
                </div>
                <div className={cssStyle.mainBottom}>
                    <span style={{ display: 'block', marginBottom: '1em', fontSize: '1.2em' }}>事件备注：</span>
                    <Scrollbars style={{ width: '100%', height: 'calc(100% - 1.5vh - 1em)' }}>
                        <div style={{ width: '100%', height: '100%' }}>
                            {
                                eventNotesList.length > 0 && eventNotesList.map((item, index) => {
                                    return (
                                        <div style={{ display: 'flex', background: '#063053' }} key={index}>
                                            <div
                                                style={{ width: '16%', }}
                                                className={`${cssStyle.mainBottomItem} ${cssStyle.onlyLine}`}
                                                title={item.handleTimeStr}
                                            >{item.handleTimeStr}</div>
                                            <div
                                                style={{ width: '20%', }}
                                                title={item.handler}
                                                className={`${cssStyle.mainBottomItem} ${cssStyle.onlyLine}`}
                                            >{item.handler}</div>
                                            <div
                                                title={item.content}
                                                className={`${cssStyle.onlyLine} ${cssStyle.mainBottomItem}`}
                                            >{item.content}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Scrollbars>
                </div>
            </div>
        );
    }
}