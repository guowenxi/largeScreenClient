import React from "react";
import cssStyle from './emergencyDisposalDetail.module.css';

import { interactData } from "../../../common/util";
import Scrollbars from "react-custom-scrollbars";
import axios from "axios";
import {Modal} from "antd";
// import closeIcon from '../images/emergencyDisposalDetailClose.png';

const { confirm } = Modal;

export default class EmergencyDisposalDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
        };
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    componentDidUpdate(prveProps) {
        if (prveProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            // this.getDetail();
        }
    }
    //组件加载触发函数
    componentDidMount() {
    }
    // 渲染处置流程
    getRenderProcess(detail) {
        const { selectedIndex } = this.state;
        const { processes } = detail;
        let processDetail = [];
        if(processes && processes[selectedIndex]){
            try{
                processDetail = JSON.parse(processes[selectedIndex].process);
            }catch (e) {}
        }
        return (
            Array.isArray(processes) &&
            <>
                <div className={cssStyle.processNameBox}>
                    {
                        processes.map(({ name }, index) => {
                            return (
                                <span
                                    className={`${cssStyle.processNameItem} ${selectedIndex === index ? cssStyle.activeProcessName : ''}`}
                                    key={index}
                                    onClick={() => this.setState({ selectedIndex: index })}
                                >{name}</span>
                            )
                        })
                    }
                </div>
                {
                    processes[selectedIndex] &&
                    <>
                        {
                            Array.isArray(processDetail) && processDetail.map((item, index) => {
                                return <div key={index} className={cssStyle.processItem}>{item}</div>
                            })
                        }
                        <div className={cssStyle.title}>处置组负责人</div>
                        {
                            Array.isArray(processes[selectedIndex].memberList) &&
                            processes[selectedIndex].memberList.map(({ name, identity, phone }, index) => {
                                return (
                                    <div className={cssStyle.memberItem} key={index}>
                                        {identity}：
                                        <span className={cssStyle.name}>{name}</span>
                                        {phone}
                                    </div>
                                )
                            })
                        }
                    </>
                }
            </>
        )
    }
    // 渲染注意事项
    getRenderMatters(detail) {
        const { matters } = detail;
        let matterDetail = [];
        if(matters){
            try{
                matterDetail = JSON.parse(matters);
            }catch (e) {}
        }
        return (
            Array.isArray(matterDetail) && matterDetail.map((item, index) => {
                return (
                    <div key={index} className={cssStyle.matterItem}>{item}</div>
                )
            })
        )
    }

    // 点击交互
    handleClickInteract() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {});
    }

    endEvent(){
        if(this.props.thisData.style.fileUrl){
            confirm({
                title: '是否确认结束应急?',
                content: '',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    return new Promise((resolve) => {
                        axios.post(this.props.thisData.style.fileUrl, {recordId:this.props.keyParams.eventId},{params:{recordId:this.props.keyParams.eventId}}).then((response) => {
                            resolve();
                            if (response.data.success) {
                                Modal.success({
                                    content: '已结束应急。',
                                });
                                this.handleClickInteract();
                            } else {
                                Modal.error({
                                    content: response.data.message,
                                });
                            }
                        }).catch(function (error) {
                            resolve();
                            Modal.error({
                                content: '结束应急操作失败。',
                            });
                        });
                    }).catch(() => console.log('Oops errors!'));
                },
                onCancel: () => { },
            });
        }
    }

    render() {
        const detail = this.props.detail && this.props.detail[0] ? this.props.detail[0] : {};
        const { planName } = detail;
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <Scrollbars>
                    <div className={cssStyle.planName}>
                        <span className={cssStyle.blueBar} />
                        <span>{planName}</span>
                        {/*<div className={cssStyle.closeIconBox}>*/}
                        {/*    <img className={cssStyle.closeIcon} src={closeIcon} alt="" onClick={this.handleClickInteract.bind(this)} />*/}
                        {/*</div>*/}
                        <div className={cssStyle.endButton} onClick={this.endEvent.bind(this)}>结束应急</div>
                    </div>
                    <div className={`${cssStyle.title} ${cssStyle.firstTitle}`}>预案流程</div>
                    {this.getRenderProcess(detail)}
                    <div className={cssStyle.thirdTitle}>注意事项</div>
                    {this.getRenderMatters(detail)}
                </Scrollbars>
            </div>
        );
    }
}