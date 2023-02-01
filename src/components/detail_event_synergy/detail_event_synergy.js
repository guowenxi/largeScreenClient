import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from './detail_event_synergy.module.scss';
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import {Icon, Modal} from "antd";
import Emitter from "../../common/eventBus";

export default class DetailEventEarlyWarning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showComponent: false, visible: false, operateType: null};
        this.keyParams = {};
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
        /*this.getData();
        this.changeThisShow(true);*/
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
                this.getData();
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

    // 催办、转为重点事
    changeTypeStatus(type) {
        this.setState({operateType: type});
        this.setState({visible: true});
    }

    handleOk = e => {
        this.setState({visible: false});
    };
    handleCancel = e => {
        this.setState({visible: false});
    };

    render() {
        const detail = this.state.data ? this.state.data : {};
        const {style} = this.props.thisData;
        const iconSize = this.props.getCompatibleSize(style.iconSize);
        const padding = this.props.getCompatibleSize(style.padding);
        const titleHeight = this.props.getCompatibleSize(style.titleHeight);
        const titleGap = this.props.getCompatibleSize(style.titleGap);
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
                                className={cssStyle.detailEventSynergyBox}
                                style={{backgroundColor: style.bgColor, top: -top + '%', padding}}
                            >
                                <Icon type="close" className={cssStyle.closeBtn}
                                      onClick={this.changeThisShow.bind(this, false)} style={{
                                    color: style.iconColor,
                                    fontSize: iconSize,
                                    top: style.gap + 'em',
                                    right: style.gap + 'em'
                                }}/>
                                <div className={cssStyle.header}>
                                    <ul className={cssStyle.detailBox}>
                                        <li
                                            className={cssStyle.textTitle}
                                            style={{
                                                fontSize: this.props.getCompatibleSize(style.titleSize),
                                                lineHeight: titleHeight,
                                                marginBottom: titleGap,
                                                color: style.titleColor,
                                            }}
                                        >
                                            {detail.eventTypeName}<span>（{detail.statusName}）</span>
                                        </li>
                                        <li onClick={this.changeTypeStatus.bind(this, 1)}>催办</li>
                                        <li onClick={this.changeTypeStatus.bind(this, 2)}>转入重点事</li>
                                    </ul>
                                </div>
                                <Scrollbars style={{height: 'calc(100% - ' + titleHeight + ' - ' + titleGap + ')'}}>
                                    <div className={cssStyle.main}>
                                        <div className={cssStyle.mainItem}>
                                            <p className={cssStyle.mainTitle}>详细信息</p>
                                            <ul className={cssStyle.mainContent}>
                                                <li className={cssStyle.contentItem}>
                                                    <p>事件名称：</p>
                                                    <p>{detail.title}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>事发地点：</p>
                                                    <p>{detail.incidentAddress}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>事发时间：</p>
                                                    <p>{detail.incidentTime}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>事件类别：</p>
                                                    <p>{detail.eventTypeName}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>紧急等级：</p>
                                                    <p>{detail.earlyWarningLevelName}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>现实行为：</p>
                                                    <p>{detail.actionTypeName}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>所属区域：</p>
                                                    <p>{detail.areaName}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>所属街道：</p>
                                                    <p>{detail.roadName}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>参与人数：</p>
                                                    <p>{detail.joinNum}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>事件描述：</p>
                                                    <p>{detail.incidentContent}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>事件来源：</p>
                                                    <p>{detail.sourceName}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>最新处理时间：</p>
                                                    <p>{detail.updateTime}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>截止时间：</p>
                                                    <p>{detail.cutOffTime}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>主办部门：</p>
                                                    <p>{detail.mainDepartmentName}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>协办部门：</p>
                                                    <p>{detail.synergicDepartmentNames}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>报送领导：</p>
                                                    <p>{detail.leadName}</p>
                                                </li>
                                                <li className={cssStyle.contentItem}>
                                                    <p>处置要求：</p>
                                                    <p>{detail.remark}</p>
                                                </li>
                                            </ul>
                                        </div>
                                        {detail.progressEventVoList ? detail.progressEventVoList.map((item, index) => {
                                            let stepContent;
                                            switch (item.operationType) {
                                                case 0:
                                                    stepContent = item.departmentName + " 将事件转入协同处置系统";
                                                    break;
                                                case 1:
                                                    stepContent = item.departmentName + " 将事件批转给 " + item.operationName;
                                                    break;
                                                case 2:
                                                    stepContent = item.departmentName + " 将 " + item.operationName + " 加入协办";
                                                    break;
                                                case 3:
                                                    stepContent = item.departmentName + " 将事件指派给 " + item.operationName;
                                                    break;
                                                case 4:
                                                    stepContent = item.departmentName + " 添加补充说明";
                                                    break;
                                                case 5:
                                                    stepContent = item.departmentName + " 办结了该事件";
                                                    break;
                                                case 6:
                                                    stepContent = item.departmentName + " 上报该事件到协同处置系统";
                                                    break;
                                                case 7:
                                                    stepContent = item.departmentName + " 上报区级";
                                                    break;
                                                case 8:
                                                    stepContent = item.departmentName + " 申请办结";
                                                    break;
                                                case 9:
                                                    stepContent = item.departmentName + " 将事件撤回";
                                                    break;
                                                case 10:
                                                    stepContent = item.departmentName + " 将事件退回给 " + item.operationName;
                                                    break;
                                                default:
                                                    break;
                                            }
                                            return (
                                                <div className={cssStyle.mainItem}>
                                                    <p className={cssStyle.mainTitle}>事件进度</p>
                                                    <ul className={cssStyle.progressContent}>
                                                        <li className={cssStyle.progressItem} key={index}>
                                                            <div className={cssStyle.stepsItemTail} style={{
                                                                opacity: index === detail.progressEventVoList.length - 1 ? 0 : 1
                                                            }}/>
                                                            <div className={cssStyle.stepsItemIcon}><span> </span></div>
                                                            <div className={cssStyle.stepsItemContent}>
                                                                <p className={cssStyle.itemTitle}>{item.date}</p>
                                                                <p className={cssStyle.itemTitleName}>{item.userName}</p>
                                                                <div className={cssStyle.itemContent}>
                                                                    <div>{stepContent}</div>
                                                                    <div style={{display: item.remark ? '' : 'none'}}>
                                                                        <div className={cssStyle.itemRemark}>处理意见：</div>
                                                                        {item.remark}</div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )
                                        }) : ''}
                                        {detail.fileVoList ? detail.fileVoList.map((item, index) => {
                                            return (
                                                <div className={cssStyle.mainItem}>
                                                    <p className={cssStyle.mainTitle}>附件信息</p>
                                                    <ul className={cssStyle.mainContent}>
                                                        <li className={`${cssStyle.contentTableItem} ${cssStyle.tableHeight}`}>
                                                            <ul className={`${cssStyle.tableHeader} ${cssStyle.tableWidth3}`}>
                                                                <li>序号</li>
                                                                <li>附件名称</li>
                                                                <li>上传人</li>
                                                                <li>上传时间</li>
                                                                <li>操作</li>
                                                            </ul>
                                                            <ul className={`${cssStyle.tableContent} ${cssStyle.tableWidth3}`}
                                                                key={index}>
                                                                <li>{index + 1}</li>
                                                                <li>{item.name}</li>
                                                                <li>{item.userName}</li>
                                                                <li>{item.createTime}</li>
                                                                <li style={{
                                                                    color: "#0099ff"
                                                                }}>预览
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )
                                        }) : ''}
                                        {detail.handleDetailList ? detail.handleDetailList.map((item, index) => {
                                            return (
                                                <div className={cssStyle.mainItem}>
                                                    <p className={cssStyle.mainTitle}>处置情况</p>
                                                    <ul className={cssStyle.mainContent}>
                                                        <li className={`${cssStyle.contentTableItem} ${cssStyle.tableHeight}`}>
                                                            <ul className={`${cssStyle.tableHeader} ${cssStyle.tableWidth}`}>
                                                                <li>序号</li>
                                                                <li>处置内容</li>
                                                                <li>姓名</li>
                                                                <li>上传时间</li>
                                                            </ul>
                                                            <ul className={`${cssStyle.tableContent} ${cssStyle.tableWidth}`}
                                                                key={index}>
                                                                <li>{index + 1}</li>
                                                                <li>{item.remark}</li>
                                                                <li>{item.userName}</li>
                                                                <li>{item.createTime}</li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )
                                        }) : ''}
                                        {detail.leadInstructList ? detail.leadInstructList.map((item, index) => {
                                            return (
                                                <div className={cssStyle.mainItem}>
                                                    <p className={cssStyle.mainTitle}>领导批示</p>
                                                    <ul className={cssStyle.mainContent}>
                                                        <li className={`${cssStyle.contentTableItem} ${cssStyle.tableHeight}`}>
                                                            <ul className={`${cssStyle.tableHeader} ${cssStyle.tableWidth}`}>
                                                                <li>序号</li>
                                                                <li>领导批示</li>
                                                                <li>姓名</li>
                                                                <li>上传时间</li>
                                                            </ul>
                                                            <ul className={`${cssStyle.tableContent} ${cssStyle.tableWidth}`}
                                                                key={index}>
                                                                <li>{index + 1}</li>
                                                                <li>{item.remark}</li>
                                                                <li>{item.userName}</li>
                                                                <li>{item.createTime}</li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )
                                        }) : ''}
                                        {detail.emergencyList ? detail.emergencyList.map((item, index) => {
                                            return (
                                                <div className={cssStyle.mainItem}>
                                                    <p className={cssStyle.mainTitle}>应急事件</p>
                                                    <ul className={cssStyle.emergencyEventContent}>
                                                        <li className={cssStyle.emergencyEventItem} key={index}>
                                                            <p className={cssStyle.emergencyTitle}>{item.title}</p>
                                                            <ul className={cssStyle.emergencyProgressContent}>
                                                                {item.emergencyProcessList ? item.emergencyProcessList.map((progressItem, progressIndex) => {
                                                                    return (
                                                                        <li className={cssStyle.progressItem}
                                                                            key={progressIndex}>
                                                                            <div className={cssStyle.stepsItemTail}
                                                                                 style={{
                                                                                     opacity: progressIndex === item.emergencyProcessList.length - 1 ? 0 : 1
                                                                                 }}/>
                                                                            <div className={cssStyle.stepsItemIcon}>
                                                                                <span>{progressIndex + 1}</span>
                                                                            </div>
                                                                            <div className={cssStyle.stepsItemContent}>
                                                                                <p>{progressItem.createTime + ' ' + progressItem.typeName}</p>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                }) : ''
                                                                }
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )
                                        }) : ''}
                                    </div>
                                </Scrollbars>
                            </div>
                        )
                    }}
                </Motion>
                <Modal
                    title="提示"
                    cancelText="取消"
                    okText="确认"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {(() => {
                            switch (this.state.operateType) {
                                case 1:
                                    return <p>是否催办？</p>;
                                case 2:
                                    return <p>确认转为重点事？</p>;
                                default:
                                    return null;
                            }
                        }
                    )()}
                </Modal>
            </ComponentBox>
        )
    }
}