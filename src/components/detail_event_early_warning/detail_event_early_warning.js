import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from '../../common/css/detail.module.css';
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import {Button, Modal} from "antd";
import Emitter from "../../common/eventBus";
import {
    operation,
    getCompatibleData,
    getEventAboutBox,
    getMemberTable,
    getEventHistoryBox, sendMessage, getCloseDom
} from "../../common/detailUtil";
import {warningUrl} from "../../config";
import {getCompatibleSizeList, interactData} from "../../common/util";
import iconTriangleOne from "../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../common/images/lanjiao_blue.svg";
import {systemArea} from "../../config";

const { confirm } = Modal;

export default class DetailEventEarlyWarning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showComponent: false, visible: false, operateType: null, aboutEventIndex: 0, dataType: 0, historyIndex: 0, hasRemove: false};
        this.keyParams = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getEventAboutBox = getEventAboutBox.bind(this);
        this.getEventHistoryBox = getEventHistoryBox.bind(this);
        this.sendMessage = sendMessage.bind(this);
        this.interactData = interactData.bind(this);
        this.getCompatibleSizeList = getCompatibleSizeList.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.themeList = ['',cssStyle.themeOne];
        this.themeImgList = [iconTriangleOne,iconTriangleTwo];
        this.warningLevelList = ["无风险","高风险", "中风险", "中风险", "低风险", "低风险", "无风险"];
        // this.levelColor = ["#232349","rgb(221,80,80)","rgb(221,157,44)","rgb(219,199,15)","rgb(6,78,136)","rgb(30,155,41)","#232349"];
        this.levelColor = ["#232349","rgb(221,80,80)","rgb(221,157,44)","rgb(221,157,44)","rgb(6,78,136)","rgb(6,78,136)","#232349"];
        this.warningTypeName = {"-1":"已结束","0":"未预警","1":"预警中"};
        this.warningTypeColor = {"-1":"#2bc8a1","0":"#1572e8","1":"#e60012"};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        // this.p = new Promise((resolve) => {
        //     this.getData(resolve)
        // });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        // this.p.then((data) => {
        //     this.setState({data});
        // });
        // this.getData();
        // this.changeThisShow(true);
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey" :
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "animateOn":
                this.animateOn();
                break;
            case "showComponent":
                //修改请求条件
                let hasKey = false;
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                    hasKey = true;
                }
                this.setState({dataType:data.data.dataType});
                if(hasKey){
                    this.getData();
                }
                this.changeThisShow(true);
                break;
            default:
                break;
        }
    }

    //重新获取数据
    reGetData() {
        this.getData();
    }

    // 获取数据
    getData(resolve) {
        if (this.props.thisData.dataSources.dataType === 1) {
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            } catch (e) {
            }
            if (resolve) {
                resolve(defaultData);
            } else {
                this.setState({data: defaultData});
            }
        } else if (this.props.thisData.dataSources.dataType === 2) {
            let params = {};
            try {
                params = JSON.parse(this.props.thisData.dataSources.dataParams);
            } catch (e) {
            }
            for (let key in this.keyParams) {
                params[key] = this.keyParams[key];
            }
            let dataUrl = warningUrl;
            if(this.keyParams.dataType === 0){
                dataUrl += "/emphasesManage/getDetailEventEarlyWarning";
            }else{
                dataUrl += "/emphasesManage/getOuEventDetail";
            }
            axios.get(dataUrl, {params: params}).then((response) => {
                const result = response.data.data;
                if (resolve) {
                    resolve(result);
                } else {
                    this.setState({data: result,aboutEventIndex: 0, historyIndex: 0, hasRemove: false});
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    //当前组件显示隐藏
    changeThisShow(type) {
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: {showStatus: type, id: this.props.thisData.id}
        });
        this.setState({showComponent: type});
        if(!type){
            this.setState({data:{}});
            const {closeInteract} = this.props.thisData.style;
            this.interactData(closeInteract);
        }
    }

    //转入应急
    gotoWarning(id){
        const sendData = {
            rbacToken : this.props.token,
            id : id,
        };
        confirm({
            title: '确定要将该事件转入应急吗？?',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                return new Promise((resolve) => {
                    axios.post(warningUrl+"/emphasesManage/updateEmergencyCommandEvent", sendData).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '已转入。',
                            });
                            //重新获取数据
                            this.reGetData();
                        }else{
                            Modal.error({
                                content: response.data.data,
                            });
                        }
                    }).catch(function (error) {
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    //重点事历史记录
    getHistoryDetail(history){
        if(history){
            return (
                <table className={cssStyle.itemContent}>
                    <tbody>
                    <tr>
                        <td className={cssStyle.tdTitle}>事件等级</td>
                        <td className={cssStyle.tdContent}>{history.eventLevelName}</td>
                        <td className={cssStyle.tdTitle}>事发时间</td>
                        <td className={cssStyle.tdContent}>{history.incidentTime}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>事发地点</td>
                        <td className={cssStyle.tdContent} colSpan={3}>{history.incidentAddress}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>现实行为</td>
                        <td className={cssStyle.tdContent}>{history.actionTypeName}</td>
                        <td className={cssStyle.tdTitle}>冲突事件</td>
                        <td className={cssStyle.tdContent}>{history.isConflict === 0 ? '无' : '有'}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>参与人数</td>
                        <td className={cssStyle.tdContent} colSpan={3}>{history.joinNum}</td>
                    </tr>
                    {history.leadInformationList && (
                        <tr>
                            <td className={cssStyle.tdTitle}>挑头人员</td>
                            <td className={cssStyle.tdContent} colSpan={3}>
                                <table className={cssStyle.childTable}>
                                    <tbody>
                                    <tr>
                                        <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'30%'}}>姓名</td>
                                        <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'30%'}}>身份证号码</td>
                                        <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'40%'}}>联系方式</td>
                                    </tr>
                                    {history.leadInformationList.map((item,index) =>
                                        <tr key={index}>
                                            <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'30%'}}>{item.leaderName}</td>
                                            <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'30%',wordBreak:'break-all'}}>{item.leaderCardId}</td>
                                            <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'40%'}}>{item.leaderPhone}</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td className={cssStyle.tdTitle}>事件概述</td>
                        <td className={cssStyle.tdContent} colSpan={3}>{history.incidentContent}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>处理结果</td>
                        <td className={cssStyle.tdContent} colSpan={3} >{history.result}</td>
                    </tr>
                    </tbody>
                </table>
            );
        }
    }

    //重点事详情
    getDetail(compatibleSize,detail){
        return (
            <Scrollbars style={{fontSize:compatibleSize.fontSize,flex:1}}>
                <div className={cssStyle.itemBox}>
                    <div className={cssStyle.itemHead}>
                        <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
                        <div className={cssStyle.itemTitle}>基本信息</div>
                    </div>
                    <table className={cssStyle.itemContent}>
                        <tbody>
                        <tr>
                            <td className={cssStyle.tdTitle}>事件类别</td>
                            <td className={cssStyle.tdContent}>{detail.eventTypeName}</td>
                            <td className={cssStyle.tdTitle}>挂牌时间</td>
                            <td className={cssStyle.tdContent}>{detail.incidentTime}</td>
                        </tr>
                        <tr>
                            {/*<td className={cssStyle.tdTitle}>预警状态</td>*/}
                            {/*<td className={cssStyle.tdContent} style={{color:this.warningTypeColor[detail.isWarning]}}>{this.warningTypeName[detail.isWarning]}</td>*/}
                            <td className={cssStyle.tdTitle}>研判时间</td>
                            <td className={cssStyle.tdContent} colSpan={3}>{detail.createTime}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>预警等级</td>
                            <td className={cssStyle.tdContent} style={{color:this.levelColor[detail.earlyWarningLevel]}}>{this.warningLevelList[detail.earlyWarningLevel]}</td>
                            <td className={cssStyle.tdTitle}>预警时间</td>
                            <td className={cssStyle.tdContent}>{detail.warningTime}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>{systemArea === 'longgang' ? '所属工作站':'所属街道'}</td>
                            <td className={cssStyle.tdContent}>{detail.roadName}</td>
                            <td className={cssStyle.tdTitle}>参与人数</td>
                            <td className={cssStyle.tdContent}>{detail.joinNum}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>积分量化</td>
                            <td className={cssStyle.tdContent}>{detail.quantitativeScore}</td>
                            <td className={cssStyle.tdTitle}>关注等级</td>
                            <td className={cssStyle.tdContent}>{detail.level}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle} >事件概述</td>
                            <td className={cssStyle.tdContent} colSpan={3}>
                                {detail.incidentContent}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                {detail.leaderInformationList && (
                    <div className={cssStyle.itemBox}>
                        <div className={cssStyle.itemHead}>
                            <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
                            <div className={cssStyle.itemTitle}>挑头人员</div>
                        </div>
                        <table className={cssStyle.itemContent}>
                            <tbody>
                            <tr>
                                <td className={cssStyle.tdTitle} style={{width:'15%'}}>序号</td>
                                <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`}>姓名</td>
                                <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'35%'}}>身份证号码</td>
                                <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'25%'}}>联系方式</td>
                            </tr>
                            {detail.leaderInformationList.map((item,index) =>
                                <tr key={index}>
                                    <td className={cssStyle.tdContent} style={{width:'15%'}}>{index+1}</td>
                                    <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'20%'}}>{item.leaderName}</td>
                                    <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'35%'}}>{item.leaderCardId}</td>
                                    <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'25%'}}>{item.leaderPhone}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className={cssStyle.itemBox}>
                    <div className={cssStyle.itemHead}>
                        <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
                        <div className={cssStyle.itemTitle}>事权单位</div>
                    </div>
                    <table className={cssStyle.itemContent}>
                        <tbody>
                        <tr>
                            <td className={cssStyle.tdTitle}>单位名称</td>
                            <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} colSpan={2} style={{width:'80%'}}>{detail.eventCtrlDepartmentVo ? detail.eventCtrlDepartmentVo.departName : ''}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle} rowSpan={2}>稳控专班</td>
                            <td className={cssStyle.tdTitle} style={{width:'13%'}}>包案<br />领导</td>
                            <td className={cssStyle.tdContent} style={{width:'67%'}}>
                                {detail.eventCtrlDepartmentVo && getMemberTable(detail.eventCtrlDepartmentVo.emphControlLeaderVo)}
                            </td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle} style={{width:'13%'}}>专班<br />成员</td>
                            <td className={cssStyle.tdContent} style={{width:'67%'}}>
                                {detail.eventCtrlDepartmentVo && getMemberTable(detail.eventCtrlDepartmentVo.emphControlMemberVo)}
                            </td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>稳控<br />（化解）<br />方案</td>
                            <td className={cssStyle.tdContent} colSpan={2} >
                                {detail.eventCtrlDepartmentVo ? detail.eventCtrlDepartmentVo.authorityIdea : ''}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={cssStyle.itemBox}>
                    <div className={cssStyle.itemHead}>
                        <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
                        <div className={cssStyle.itemTitle}>稳控单位</div>
                    </div>
                    <table className={cssStyle.itemContent}>
                        <tbody>
                        <tr>
                            <td className={cssStyle.tdTitle} rowSpan={2}>稳控专班</td>
                            <td className={cssStyle.tdTitle} style={{width:'13%'}}>包案<br />领导</td>
                            <td className={cssStyle.tdContent} style={{width:'67%'}}>
                                {detail.eventMeasureDepartmentVo && getMemberTable(detail.eventMeasureDepartmentVo.emphControlLeaderVo)}
                            </td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle} style={{width:'13%'}}>专班<br />成员</td>
                            <td className={cssStyle.tdContent} style={{width:'67%'}}>
                                {detail.eventMeasureDepartmentVo && getMemberTable(detail.eventMeasureDepartmentVo.emphControlMemberVo)}
                            </td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle} >稳控<br />（化解）<br />方案</td>
                            <td className={cssStyle.tdContent} colSpan={2} >
                                {detail.eventMeasureDepartmentVo ? detail.eventMeasureDepartmentVo.controlIdea : ''}
                            </td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>化解启示</td>
                            <td className={cssStyle.tdContent} colSpan={2} >
                                {detail.eventMeasureDepartmentVo ? detail.eventMeasureDepartmentVo.revelation : ''}
                            </td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle} >备注</td>
                            <td className={cssStyle.tdContent} colSpan={2} >
                                {detail.eventMeasureDepartmentVo ? detail.eventMeasureDepartmentVo.remark : ''}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={cssStyle.itemBox}>
                    <div className={cssStyle.itemHead}>
                        <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
                        <div className={cssStyle.itemTitle}>归档信息</div>
                    </div>
                    <table className={cssStyle.itemContent}>
                        <tbody>
                        <tr>
                            <td className={cssStyle.tdTitle} >归档说明</td>
                            <td className={cssStyle.tdContent} style={{width:'80%'}} >
                                {detail.emphEventArchiveVo ? detail.emphEventArchiveVo.feedback : ''}
                            </td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>备注</td>
                            <td className={cssStyle.tdContent} style={{width:'80%'}}>
                                {detail.emphEventArchiveVo ? detail.emphEventArchiveVo.remark : ''}
                            </td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>附件</td>
                            <td className={cssStyle.tdContent} style={{width:'80%'}} >
                                {detail.emphEventArchiveVo && detail.emphEventArchiveVo.videoFile && (
                                    detail.emphEventArchiveVo.videoFile.map((file,index) =>
                                        <span className={cssStyle.fileName} key={index}>{file.fileName}</span>
                                    )
                                )}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                {this.getEventHistoryBox(detail.emphEventHistoryVoList)}
            </Scrollbars>
        );
    }

    //预警事件详情
    getWarningDetail(compatibleSize,detail){
        return (
            <Scrollbars style={{fontSize:compatibleSize.fontSize,flex:1}}>
                <div className={cssStyle.itemBox}>
                    <div className={cssStyle.itemHead}>
                        <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
                        <div className={cssStyle.itemTitle}>基本信息</div>
                    </div>
                    <table className={cssStyle.itemContent}>
                        <tbody>
                        <tr>
                            <td className={cssStyle.tdTitle}>事件类别</td>
                            <td className={cssStyle.tdContent} colSpan={3}>{detail.allEventTypeName}</td>
                            {/*<td className={cssStyle.tdTitle}>预警状态</td>*/}
                            {/*<td className={cssStyle.tdContent} style={{color:this.warningTypeColor[detail.isWarning]}}>{this.warningTypeName[detail.isWarning]}</td>*/}
                        </tr>
                       {/* <tr>
                            <td className={cssStyle.tdTitle}>相似度</td>
                            <td className={cssStyle.tdContent} >{detail.similarity ? detail.similarity+'%':''}</td>
                            <td className={cssStyle.tdTitle}>研判时间</td>
                            <td className={cssStyle.tdContent}>{detail.createTime}</td>
                        </tr>*/}
                        <tr>
                            <td className={cssStyle.tdTitle}>预警等级</td>
                            <td className={cssStyle.tdContent} style={{color:this.levelColor[detail.earlyWarningLevel]}}>{this.warningLevelList[detail.earlyWarningLevel]}</td>
                            <td className={cssStyle.tdTitle}>预警时间</td>
                            <td className={cssStyle.tdContent}>{detail.warningTime}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>事件来源</td>
                            <td className={cssStyle.tdContent}>{detail.sourceName}</td>
                            <td className={cssStyle.tdTitle}>现实行为</td>
                            <td className={cssStyle.tdContent}>{detail.actionTypeName}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>{systemArea === 'longgang' ? '所属工作站':'所属街道'}</td>
                            <td className={cssStyle.tdContent}>{detail.roadName}</td>
                            <td className={cssStyle.tdTitle}>事发时间</td>
                            <td className={cssStyle.tdContent}>{detail.incidentTime}</td>
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
                                {detail.incidentContent}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                {this.getEventAboutBox(detail.associatedEvent,detail.id,2)}
            </Scrollbars>
        );
    }

    render() {
        const detail = this.state.data ? this.state.data : {};
        const {style} = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        this.iconTriangle = this.themeImgList[style.theme];
        const border = {borderStyle: style.borderStyle, borderWidth: style.borderWidth, borderColor: style.borderColor, borderRadius: style.borderRadius};
        return (
            <ComponentBox
                id={this.props.thisData.id}
                thisData={this.props.thisData}
                receiveMessage={this.receiveMessage.bind(this)}
                reGetData={this.reGetData.bind(this)}
                style={this.props.style}
            >
                <Motion style={{top: spring(this.props.thisData.showStatus ? 0 : 100)}}>
                    {({top}) => {
                        return (
                            <div
                                className={`${cssStyle.detailBox} ${this.themeList[style.theme]}`}
                                style={{backgroundColor: style.bgColor, top: -top + '%', padding:compatibleSize.padding,...border}}
                            >
                                <div className={cssStyle.headBox} style={{minHeight:compatibleSize.titleHeight}}>
                                    <div className={cssStyle.head} style={{fontSize:compatibleSize.titleSize,color: style.titleColor,width:style.titleWidth}}>{detail.title}</div>
                                    <div className={cssStyle.headGap} style={{backgroundColor: style.bgColor}}/>
                                </div>
                                {this.getCloseDom(style,compatibleSize)}
                                {this.state.dataType === 0 ? this.getWarningDetail(compatibleSize,detail) : this.getDetail(compatibleSize,detail)}
                                {this.state.dataType === 0 && !this.state.hasRemove && (
                                    <div className={cssStyle.bottomBox} style={{fontSize:compatibleSize.fontSize}}>
                                        <Button type="danger" style={{fontSize:compatibleSize.fontSize}} onClick={operation.bind(this,detail.id,2)}>排除</Button>
                                        {systemArea !== 'linan' && systemArea !== 'ruian' && (
                                            <Button type="primary" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} onClick={operation.bind(this,detail.id,3)} >转入重点事</Button>
                                        )}
                                        {systemArea === 'jiande' && (
                                            <React.Fragment>
                                                <Button type="danger" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em',display: detail.isTurn ? 'none':''}} onClick={this.gotoWarning.bind(this,detail.id)} >转入应急</Button>
                                                <Button type="danger" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em',display: detail.isTurn ? '':'none'}} >已转入应急</Button>
                                            </React.Fragment>
                                        )}
                                        {systemArea === 'ruian' && (
                                            <Button type="primary" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} onClick={operation.bind(this,detail.id,3)} >转入指挥调度</Button>
                                        )}
                                    </div>
                                )}
                                {this.state.hasRemove && (
                                    <div className={cssStyle.bottomBox} style={{fontSize:compatibleSize.fontSize}}>
                                        <Button type="danger" style={{fontSize:compatibleSize.fontSize}} >已排除</Button>
                                    </div>
                                )}
                            </div>
                        )
                    }}
                </Motion>
            </ComponentBox>
        )
    }
}