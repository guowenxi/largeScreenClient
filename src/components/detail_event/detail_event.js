import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from '../../common/css/detail.module.css';
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import Emitter from "../../common/eventBus";
import {Icon, Modal} from "antd";
import iconTriangle from "./images/lanjiao_blue.svg";
import {getMemberTable, getCompatibleData, getEventHistoryBox} from "../../common/detailUtil";

const { confirm } = Modal;

export default class DetailEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showComponent: false, visible: false, operateType: null, historyIndex: 0};
        this.keyParams = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getEventHistoryBox = getEventHistoryBox.bind(this);
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
                this.keyParams[data.keyName] = data.data;
                this.reGetData();
                break;
            case "animateOn":
                this.animateOn();
                break;
            case "showComponent":
                //修改请求条件
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                //获取数据
                this.getData();
                //显示组件
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
            axios.get(this.props.thisData.dataSources.dataUrl, {params: params}).then((response) => {
                const result = response.data.data;
                if (resolve) {
                    resolve(result);
                } else {
                    this.setState({data: result});
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
    }

    // 催办
    changeTypeStatus(type) {
        confirm({
            title: '是否确认进行催办?',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk() {

            },
            onCancel() {},
        });
    }

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

    render() {
        const detail = this.state.data ? this.state.data : {};
        const {style} = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
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
                                className={cssStyle.detailBox}
                                style={{backgroundColor: style.bgColor, top: -top + '%', padding:compatibleSize.padding}}
                            >
                                <div className={cssStyle.headBox} style={{height:compatibleSize.titleHeight}}>
                                    <div className={cssStyle.head} style={{fontSize:compatibleSize.titleSize,color: style.titleColor,width:style.titleWidth}}>{detail.title}</div>
                                    <Icon type="close" className={cssStyle.closeBtn}
                                          onClick={this.changeThisShow.bind(this, false)} style={{
                                        color: style.iconColor,
                                        fontSize: compatibleSize.iconSize,
                                    }}/>
                                </div>
                                <Scrollbars style={{height: 'calc(100% - ' + compatibleSize.titleHeight + ')',fontSize:compatibleSize.fontSize}}>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead}>
                                            <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
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
                                                    <td className={cssStyle.tdTitle}>所属街道</td>
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
                                                <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
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
                                            <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
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
                                            <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
                                            <div className={cssStyle.itemTitle}>稳控单位</div>
                                        </div>
                                        <table className={cssStyle.itemContent}>
                                            <tbody>
                                            {/*<tr>*/}
                                            {/*    <td className={cssStyle.tdTitle}>单位名称</td>*/}
                                            {/*    <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} colSpan={2} style={{width:'80%'}}>{detail.eventMeasureDepartmentVo ? detail.eventMeasureDepartmentVo.departName : ''}</td>*/}
                                            {/*</tr>*/}
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
                                            <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
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
                                {/*<div className={cssStyle.bottomBox} style={{fontSize:fontSize}}>*/}
                                {/*    <Button type="primary" style={{fontSize:fontSize}} onClick={this.changeTypeStatus.bind(this,1)}>催办</Button>*/}
                                {/*</div>*/}
                            </div>
                        )
                    }}
                </Motion>
            </ComponentBox>
        )
    }
}