import React from "react";
import cssStyle from "../../../common/css/detail.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {getCloseDom, getCompatibleData, changeThisShow, getEventAboutBox} from "../../../common/detailUtil";
import iconTriangleOne from "../../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../../common/images/lanjiao_blue.svg";
import {Button, Modal} from "antd";
import {interactData} from "../../../common/util";
import axios from "axios";
import {emergencyUrl} from "../../../config";

const { confirm } = Modal;

export default class EventWarning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {aboutEventIndex: 0,hasRemove: false,hasNotTurnTo:true};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.changeThisShow = changeThisShow.bind(this);
        this.interactData = interactData.bind(this);
        this.getEventAboutBox = getEventAboutBox.bind(this);
        this.themeList = ['', cssStyle.themeOne];
        this.themeImgList = [iconTriangleOne, iconTriangleTwo];
        this.levelColor = ["#232349","rgb(221,80,80)","rgb(221,157,44)","#DBC70F","rgb(6,78,136)","#1E9B29","#232349"];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //转入指挥调度
    eventTurnTo(){
        confirm({
            title: '确定要将该事件转入指挥调度？',
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
                    axios.post(emergencyUrl+"/socialGovernance/command/shiftToCommand", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            this.setState({hasNotTurnTo:false});
                            Modal.success({
                                content: '已转入指挥调度。',
                            });
                            const { turnToInteract } = this.props.thisData.style;
                            this.interactData(turnToInteract, detail);
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch( (error) => {
                        resolve();
                        Modal.error({
                            content: '转入指挥调度请求出错！',
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
            title: '确定要排除该预警事件吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const {detail} = this.props;
                const sendData = {
                    rbacToken:this.props.token,
                    ids:detail.id,
                    type:2
                };
                return new Promise((resolve) => {
                    axios.post(emergencyUrl+"/socialGovernance/preWarning/removeWarning", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            this.setState({hasRemove:true});
                            Modal.success({
                                content: '已排除。',
                            });
                            const { removeInteract } = this.props.thisData.style;
                            this.interactData(removeInteract,detail);
                        }else{
                            Modal.error({
                                content: response.data.data,
                            });
                        }
                    }).catch( (error) => {
                        resolve();
                        Modal.error({
                            content: '排除请求出错！',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
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
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.eventTypeName}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>预警等级</td>
                                <td className={cssStyle.tdContent} style={{color:this.levelColor[detail.warningLevel]}}>{detail.warningLevelName}</td>
                                <td className={cssStyle.tdTitle}>预警时间</td>
                                <td className={cssStyle.tdContent}>{detail.warningTime}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>事件来源</td>
                                <td className={cssStyle.tdContent}>{detail.sourceTypeName}</td>
                                <td className={cssStyle.tdTitle}>现实行为</td>
                                <td className={cssStyle.tdContent}>{detail.actionTypeName}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>所属街道</td>
                                <td className={cssStyle.tdContent}>{detail.roadName}</td>
                                <td className={cssStyle.tdTitle}>事发时间</td>
                                <td className={cssStyle.tdContent}>{detail.createTime}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>事发地点</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.incidentAddress}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>参与人数</td>
                                <td className={cssStyle.tdContent}>{detail.joinNum}</td>
                                <td className={cssStyle.tdTitle}>更新时间</td>
                                <td className={cssStyle.tdContent}>{detail.updateTime}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle} >事件概述</td>
                                <td className={cssStyle.tdContent} colSpan={3}>
                                    {detail.eventDescribe}
                                </td>
                            </tr>
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
                    {this.getEventAboutBox(detail.relateEvents,null,null,3)}
                </Scrollbars>
                {this.state.hasRemove ? (
                    <div className={cssStyle.bottomBox} style={{fontSize:compatibleSize.fontSize}}>
                        <Button type="danger" style={{fontSize:compatibleSize.fontSize}} >已排除</Button>
                    </div>
                ):(
                    <div className={cssStyle.bottomBox} style={{fontSize:compatibleSize.fontSize}}>
                        {detail.isNotPlatform && this.state.hasNotTurnTo ? (
                            <Button type="primary" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} onClick={this.eventTurnTo.bind(this)} >转入指挥调度</Button>
                        ):(
                            <Button type="primary" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} >已转入指挥调度</Button>
                        )}
                        <Button type="danger" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} onClick={this.eventDelete.bind(this)} >排除</Button>
                    </div>
                )}
            </div>
        );
    }
}