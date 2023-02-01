import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from '../../common/css/detail.module.css';
// import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import Emitter from "../../common/eventBus";
import iconTriangle from "../detail_event_early_warning/images/lanjiao_blue.svg";
import {getCloseDom, getCompatibleData} from "../../common/detailUtil";
import {interactData} from "../../common/util";
import {systemArea} from "../../config";

export default class DetailEventHandleCangnan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showComponent: false, visible: false, operateType: null};
        this.keyParams = {};
        this.warningLevel = ['一般','黄色','橙色','红色'];
        this.getCompatibleData = getCompatibleData.bind(this);
        this.interactData = interactData.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.themeList = ['',cssStyle.themeOne];
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
                //修改请求条件
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
            params.rbacToken = this.props.token;
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
        if(!type){
            this.setState({data:{}});
            const {closeInteract} = this.props.thisData.style;
            this.interactData(closeInteract);
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
                {/*<Motion style={{top: spring(this.props.thisData.showStatus ? 0 : 100)}}>*/}
                {/*    {({top}) => {*/}
                {/*        return (*/}
                            <div
                                className={`${cssStyle.detailBox} ${this.themeList[style.theme]}`}
                                style={{backgroundColor: style.bgColor, padding:compatibleSize.padding}}
                            >
                                <div className={cssStyle.headBox} style={{height:compatibleSize.titleHeight}}>
                                    <div className={cssStyle.head} style={{fontSize:compatibleSize.titleSize,color: style.titleColor,width:style.titleWidth}}>{detail.title}</div>
                                </div>
                                {this.getCloseDom(style,compatibleSize)}
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
                                                <td className={cssStyle.tdContent}>{detail.eventName}</td>
                                                <td className={cssStyle.tdTitle}>事发时间</td>
                                                <td className={cssStyle.tdContent}>{detail.incidentTime}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>紧急等级</td>
                                                <td className={cssStyle.tdContent}>{this.warningLevel[detail.earlyWarningLevel]}</td>
                                                <td className={cssStyle.tdTitle}>现实行为</td>
                                                <td className={cssStyle.tdContent}>{detail.actionName}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>{systemArea === 'longgang' ? '所属工作站':'所属街道'}</td>
                                                <td className={cssStyle.tdContent}>{detail.roadName}</td>
                                                <td className={cssStyle.tdTitle}>参与人数</td>
                                                <td className={cssStyle.tdContent}>{detail.joinNum}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle} >事发地点</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.incidentAddress}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle} >事件概述</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.incidentContent}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>事件来源</td>
                                                <td className={cssStyle.tdContent}>{detail.sourceTypeName}</td>
                                                <td className={cssStyle.tdTitle}>更新时间</td>
                                                <td className={cssStyle.tdContent}>{detail.updateTime}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle} >截止时间</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.cutOffTime}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle} >主办部门</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.mainOperationList && detail.mainOperationList.join('　')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle} >协办部门</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.otherOperationList && detail.otherOperationList.join('　')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle} >报送领导</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.leaderOperationList && detail.leaderOperationList.join('　')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle} >处置要求</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.otherRemark}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {detail.handleProgList && (
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.itemHead}>
                                                <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
                                                <div className={cssStyle.itemTitle}>事件进度</div>
                                            </div>
                                            <ul className={cssStyle.progressContent}>
                                                {detail.handleProgList.map((item, index) => {
                                                    let stepContent;
                                                    switch (item.operationType) {
                                                        case 0:
                                                            stepContent = item.editDepartment+" 将事件转入协同处置系统";
                                                            break;
                                                        case 1:
                                                            stepContent = item.editDepartment+" 将事件批转给 " + item.department;
                                                            break;
                                                        case 2:
                                                            stepContent = item.editDepartment+" 将 "+item.department + " 加入协办";
                                                            break;
                                                        case 3:
                                                            stepContent = item.editDepartment+" 将事件指派给 " + item.department;
                                                            break;
                                                        case 4:
                                                            stepContent = item.editDepartment + " 添加补充说明";
                                                            break;
                                                        case 5:
                                                            stepContent = item.editDepartment + " 办结了该事件";
                                                            break;
                                                        case 6:
                                                            stepContent = item.editDepartment + " 上报该事件到协同处置系统";
                                                            break;
                                                        case 7:
                                                            stepContent = item.editDepartment + " 上报区级";
                                                            break;
                                                        case 8:
                                                            stepContent = item.editDepartment + " 申请办结";
                                                            break;
                                                        case 9:
                                                            stepContent = item.editDepartment+" 将事件撤回" ;
                                                            break;
                                                        case 10:
                                                            stepContent = item.editDepartment+" 将事件退回给 " + item.department;
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                    return (
                                                        <li className={cssStyle.progressItem} key={index}>
                                                            <div className={cssStyle.stepsItemTail} style={{
                                                                opacity: index === detail.handleProgList.length - 1 ? 0 : 1
                                                            }} />
                                                            <div className={cssStyle.stepsItemIcon}><span> </span></div>
                                                            <div className={cssStyle.stepsItemContent}>
                                                                <p className={cssStyle.itemTitle}>{item.createTime}</p>
                                                                <p className={cssStyle.itemTitleName}>{item.userName}</p>
                                                                <div className={cssStyle.itemContent}>
                                                                    <div>{stepContent}</div>
                                                                    <div style={{display:item.remark ? '':'none'}}><div className={cssStyle.itemRemark}>处理意见：</div>{item.remark}</div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                    {detail.handleFileList && (
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.itemHead}>
                                                <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
                                                <div className={cssStyle.itemTitle}>附件信息</div>
                                            </div>
                                            <table className={cssStyle.itemContent}>
                                                <tbody>
                                                <tr>
                                                    <td className={cssStyle.tdTitle} style={{width:'10%'}}>序号</td>
                                                    <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'25%'}}>附件名称</td>
                                                    <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'20%'}}>上传人</td>
                                                    <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'25%'}}>上传时间</td>
                                                    <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'20%'}}>操作</td>
                                                </tr>
                                                {detail.handleFileList.map((item,index) =>
                                                    <tr key={index}>
                                                        <td className={cssStyle.tdContent} style={{width:'10%'}}>{index+1}</td>
                                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'25%'}}>{item.fileName}</td>
                                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'20%'}}>{item.createUserName}</td>
                                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'25%'}}>{item.createTime}</td>
                                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'20%'}}>下载</td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {detail.supplementHandleList && (
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.itemHead}>
                                                <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
                                                <div className={cssStyle.itemTitle}>处置情况</div>
                                            </div>
                                            <table className={cssStyle.itemContent}>
                                                <tbody>
                                                <tr>
                                                    <td className={cssStyle.tdTitle} style={{width:'10%'}}>序号</td>
                                                    <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'45%'}}>处置内容</td>
                                                    <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'20%'}}>姓名</td>
                                                    <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'25%'}}>处置时间</td>
                                                </tr>
                                                {detail.supplementHandleList.map((item,index) =>
                                                    <tr key={index}>
                                                        <td className={cssStyle.tdContent} style={{width:'10%'}}>{index+1}</td>
                                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'45%'}}>{item.remark}</td>
                                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'20%'}}>{item.userName}</td>
                                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'25%'}}>{item.createTime}</td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {detail.leaderHandleList && (
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.itemHead}>
                                                <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
                                                <div className={cssStyle.itemTitle}>领导批示</div>
                                            </div>
                                            <table className={cssStyle.itemContent}>
                                                <tbody>
                                                <tr>
                                                    <td className={cssStyle.tdTitle} style={{width:'10%'}}>序号</td>
                                                    <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'45%'}}>领导批示</td>
                                                    <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'20%'}}>姓名</td>
                                                    <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{width:'25%'}}>批示时间</td>
                                                </tr>
                                                {detail.leaderHandleList.map((item,index) =>
                                                    <tr key={index}>
                                                        <td className={cssStyle.tdContent} style={{width:'10%'}}>{index+1}</td>
                                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'45%'}}>{item.remark}</td>
                                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'20%'}}>{item.optUserName}</td>
                                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{width:'25%'}}>{item.createTime}</td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {detail.emergencyCommondList && (
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.itemHead}>
                                                <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
                                                <div className={cssStyle.itemTitle}>应急事件</div>
                                            </div>
                                            <ul className={cssStyle.emergencyEventContent}>
                                                {detail.emergencyCommondList.map((item, index) => {
                                                    return (
                                                        <li className={cssStyle.emergencyEventItem} key={index}>
                                                            <p className={cssStyle.emergencyTitle}>{item.title}</p>
                                                            <ul className={cssStyle.emergencyProgressContent}>
                                                                {item.recordList && item.recordList.map((progressItem, progressIndex) => {
                                                                    return (
                                                                        <li className={cssStyle.progressItem}
                                                                            key={progressIndex}>
                                                                            <div className={cssStyle.stepsItemTail}
                                                                                 style={{
                                                                                     opacity: progressIndex === item.recordList.length - 1 ? 0 : 1
                                                                                 }} />
                                                                            <div className={cssStyle.stepsItemIcon}>
                                                                                <span>{progressIndex + 1}</span>
                                                                            </div>
                                                                            <div className={cssStyle.stepsItemContent}>
                                                                                <p>{progressItem.createTime+' '+progressItem.content}</p>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </Scrollbars>
                            </div>
                {/*        )*/}
                {/*    }}*/}
                {/*</Motion>*/}
            </ComponentBox>
        )
    }
}