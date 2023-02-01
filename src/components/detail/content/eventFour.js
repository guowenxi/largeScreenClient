import React from "react";
import cssStyle from "../../../common/css/detail.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {getCloseDom, getCompatibleData, changeThisShow} from "../../../common/detailUtil";
import iconTriangleOne from "../../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../../common/images/lanjiao_blue.svg";
import {Button, Modal} from "antd";
import {interactData} from "../../../common/util";
import axios from "axios";
import {emergencyUrl, eventTurnToUrl} from "../../../config";

const { confirm } = Modal;

export default class EventFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.changeThisShow = changeThisShow.bind(this);
        this.interactData = interactData.bind(this);
        this.themeList = ['', cssStyle.themeOne];
        this.themeImgList = [iconTriangleOne, iconTriangleTwo];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //转入四平台
    eventTurnTo(){
        confirm({
            title: '确定要将该事件转入四平台吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                return new Promise((resolve) => {
                    const {detail} = this.props;
                    const sendData = {
                        id:detail.id,
                        rbacToken:this.props.token,
                    };
                    axios.post(eventTurnToUrl+"/socialGovernance/event/newReportEventToPlatform", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        this.setState({turnToLoading:false});
                        if(response.data.success){
                            Modal.success({
                                content: '已转入四平台。',
                            });
                            this.props.changeKeyParams({});
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch( (error) => {
                        resolve();
                        this.setState({turnToLoading:false});
                        Modal.error({
                            content: '转入四平台请求出错！',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    //转入应急
    eventTurnToWarning(){
        confirm({
            title: '确定要将该事件转入突发事件处置吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                return new Promise((resolve) => {
                    const {detail} = this.props;
                    const sendData = {
                        id:detail.id,
                        rbacToken:this.props.token,
                    };
                    axios.post(eventTurnToUrl+"/socialGovernance/emergencyProcess/warningToEmergency", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '已转入突发事件处置。',
                            });
                            this.props.changeKeyParams({});
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch( (error) => {
                        resolve();
                        Modal.error({
                            content: '突发事件处置请求出错！',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    //删除
    eventDelete(){
        confirm({
            title: '确定要删除该事件吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const {detail} = this.props;
                const sendData = {
                    rbacToken:this.props.token,
                    id:detail.id,
                };
                return new Promise((resolve) => {
                    axios.post(emergencyUrl+"/socialGovernance/command/removeCommand", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '已删除。',
                            });
                            const { afterDeleteInteract } = this.props.thisData.style;
                            this.interactData(afterDeleteInteract,detail);
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch( (error) => {
                        resolve();
                        Modal.error({
                            content: '删除请求出错！',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    editEvent(){
        const {detail} = this.props;
        const { editInteract } = this.props.thisData.style;
        this.interactData(editInteract, detail);
    }

    render() {
        const {detail} = this.props;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        return (
            <div
                className={`${cssStyle.detailBox} ${this.themeList[style.theme]}`}
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding }}
            >
                <div className={cssStyle.headBox} style={{ minHeight: compatibleSize.titleHeight }}>
                    <div className={cssStyle.head} style={{ fontSize: compatibleSize.titleSize, color: style.titleColor }}>{detail.title}</div>
                    <div className={cssStyle.headGap} style={{backgroundColor: style.bgColor}}/>
                </div>
                {this.getCloseDom(style, compatibleSize)}
                <Scrollbars style={{fontSize: compatibleSize.fontSize,flex:1 }}>
                    <div className={cssStyle.itemBox}>
                        <div className={cssStyle.itemHead}>
                            <img alt='' src={this.themeImgList[style.theme]} className={cssStyle.itemHeadIcon} />
                            <div className={cssStyle.itemTitle}>基本信息</div>
                        </div>
                        <table className={cssStyle.itemContent}>
                            <tbody>
                            <tr>
                                <td className={cssStyle.tdTitle}>事件类别</td>
                                <td className={cssStyle.tdContent}>{detail.eventTypesName}</td>
                                <td className={cssStyle.tdTitle}>事发时间</td>
                                <td className={cssStyle.tdContent}>{detail.incidentTime}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>预警等级</td>
                                <td className={cssStyle.tdContent}>{detail.warningLevelName}</td>
                                <td className={cssStyle.tdTitle}>事件来源</td>
                                <td className={cssStyle.tdContent}>{detail.sourceTypeName}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>所属街道</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.roadName}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>事发地点</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.incidentAddress}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>事件概述</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.incidentContent}</td>
                            </tr>
                            {/*<tr>*/}
                            {/*    <td className={cssStyle.tdTitle}>分类等级</td>*/}
                            {/*    <td className={cssStyle.tdContent}>{detail.eventLevelName}</td>*/}
                            {/*    <td className={cssStyle.tdTitle}>是否是重点场所</td>*/}
                            {/*    <td className={cssStyle.tdContent}>{detail.isEmphasisArea}</td>*/}
                            {/*</tr>*/}
                            {/*<tr>*/}
                            {/*    <td className={cssStyle.tdTitle}>四平台大类</td>*/}
                            {/*    <td className={cssStyle.tdContent}>{detail.firstCategoryName}</td>*/}
                            {/*    <td className={cssStyle.tdTitle}>四平台小类</td>*/}
                            {/*    <td className={cssStyle.tdContent}>{detail.secondCategoryName}</td>*/}
                            {/*</tr>*/}
                            <tr>
                                <td className={cssStyle.tdTitle}>事件状态</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.statusName}</td>
                            </tr>
                            {/*<tr>*/}
                            {/*    <td className={cssStyle.tdTitle}>处理者登录名称</td>*/}
                            {/*    <td className={cssStyle.tdContent}>{detail.userLoginName}</td>*/}
                            {/*    <td className={cssStyle.tdTitle}>处理者用户名</td>*/}
                            {/*    <td className={cssStyle.tdContent}>{detail.userName}</td>*/}
                            {/*</tr>*/}
                            {/*<tr>*/}
                            {/*    <td className={cssStyle.tdTitle}>处理者联系电话</td>*/}
                            {/*    <td className={cssStyle.tdContent}>{detail.mobile}</td>*/}
                            {/*    <td className={cssStyle.tdTitle}>处理者的组织机构编码</td>*/}
                            {/*    <td className={cssStyle.tdContent}>{detail.orgInternalCode}</td>*/}
                            {/*</tr>*/}
                            </tbody>
                        </table>
                        <div className={cssStyle.itemHead}>
                            <img alt='' src={this.themeImgList[style.theme]} className={cssStyle.itemHeadIcon} />
                            <div className={cssStyle.itemTitle}>处置进度</div>
                        </div>
                        <table className={cssStyle.itemContent} style={{marginBottom:'1px'}}>
                            <tbody>
                            {detail.eventFlowList && detail.eventFlowList.map((step,index)=>
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className={cssStyle.tdTitle} colSpan={4}>{step.dealDescription}</td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.tdTitle}>办理部门</td>
                                        <td className={cssStyle.tdContent} colSpan={3}>{step.orgName}</td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.tdTitle}>办理人</td>
                                        <td className={cssStyle.tdContent} colSpan={3}>{step.createUser}</td>
                                        {/*<td className={cssStyle.tdTitle}>联系方式</td>*/}
                                        {/*<td className={cssStyle.tdContent}>{step.mobilePhone}</td>*/}
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.tdTitle}>办理意见</td>
                                        <td className={cssStyle.tdContent} colSpan={3}>{step.content}</td>
                                    </tr>
                                    {/*<tr>*/}
                                    {/*    <td className={cssStyle.tdTitle}>附件</td>*/}
                                    {/*    <td className={cssStyle.tdContent} colSpan={3}>*/}
                                    {/*        {step.fileList && step.fileList.map((file,fileIndex)=>*/}
                                    {/*            <span key={fileIndex} className={cssStyle.fileName} onClick={downloadFile.bind(this,file.url)}>{file.name}</span>*/}
                                    {/*        )}*/}
                                    {/*    </td>*/}
                                    {/*</tr>*/}
                                </React.Fragment>
                            )}
                            </tbody>
                        </table>
                    </div>
                </Scrollbars>
                <div className={cssStyle.bottomBox} style={{fontSize:compatibleSize.fontSize}}>
                    {detail.toWarningStatus ? (
                        <Button type="primary" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} >已转入突发事件处置</Button>
                    ):(
                        <Button type="danger" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} onClick={this.eventTurnToWarning.bind(this)} >转入突发事件处置</Button>
                    )}
                    {detail.sourceType+'' !== '4' ? (detail.serialNumber ? (
                        <Button type="primary" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} >已转入四平台</Button>
                    ):(
                        <Button type="primary" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} onClick={this.eventTurnTo.bind(this)} >转入四平台</Button>
                    )):''}
                    <Button type="primary" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} onClick={this.editEvent.bind(this)} >编辑</Button>
                    <Button type="danger" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} onClick={this.eventDelete.bind(this)} >删除</Button>
                </div>
            </div>
        );
    }
}