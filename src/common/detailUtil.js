import {Button, Collapse, Form, Icon, Input, Modal, Radio, Select, Timeline} from "antd";
import axios from "axios";
import cssStyle from "./css/detail.module.css";
import React from "react";
import ColorSelect from "./colorSelect";
import { addListItem, changeDetailData, setColor, getInteractEdit } from "./editUtil";
import iconTriangle from "./images/lanjiao_blue.svg";
import iconClose from "./images/closed.svg";
import { warningUrl } from "../config";
import Emitter from "./eventBus";
import closeTypeOne from "./images/closeTypeOne.svg";
import { getCompatibleSize, getCompatibleSizeList, interactData } from "./util";

const { confirm } = Modal;
const { Panel } = Collapse;

export function changeThisShow(type) {
    Emitter.emit('app_box', {
        type: 'changeComponentShowStatus',
        data: { showStatus: type, id: this.props.thisData.id }
    });
    this.setState({ showComponent: type });
    if (!type) {
        this.setState({ data: {} });
        const { closeInteract } = this.props.thisData.style;
        if (this.interactData == null) {
            this.interactData = interactData.bind(this);
        }
        this.interactData(closeInteract);
    }
}

//关联事件详情
export function getAboutEvent(event, type) {
    if(event){
        if (type === 3){
            return (
                <tbody>
                <tr>
                    <td className={cssStyle.tdTitle}>事件来源</td>
                    <td className={cssStyle.tdContent}>{event.sourceTypeName}</td>
                    <td className={cssStyle.tdTitle}>事件类型</td>
                    <td className={cssStyle.tdContent}>{event.eventTypeName}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>上报时间</td>
                    <td className={cssStyle.tdContent}>{event.createTime}</td>
                    <td className={cssStyle.tdTitle}>所属街道</td>
                    <td className={cssStyle.tdContent}>{event.roadName}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>事件概述</td>
                    <td className={cssStyle.tdContent} colSpan={3}>{event.eventDescribe}</td>
                </tr>
                </tbody>
            );
        }else if (type === 2) {
            return (
                <tbody>
                <tr>
                    <td className={cssStyle.tdTitle}>事件名称</td>
                    <td className={cssStyle.tdContent} colSpan={3}>{event.title}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>事件类别</td>
                    <td className={cssStyle.tdContent}>{event.eventTypeName}</td>
                    <td className={cssStyle.tdTitle}>事件来源</td>
                    <td className={cssStyle.tdContent}>{event.sourceName}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>预警时间</td>
                    <td className={cssStyle.tdContent}>{event.warningTime}</td>
                    <td className={cssStyle.tdTitle}>预警等级</td>
                    <td className={cssStyle.tdContent}>{event.earlyWarningLevel}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>预警状态</td>
                    <td className={cssStyle.tdContent}>{event.isWarning}</td>
                    <td className={cssStyle.tdTitle}>乡镇街道</td>
                    <td className={cssStyle.tdContent}>{event.roadName}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>现实行为</td>
                    <td className={cssStyle.tdContent}>{event.actionTypeName}</td>
                    <td className={cssStyle.tdTitle}>事发时间</td>
                    <td className={cssStyle.tdContent}>{event.incidentTime}</td>

                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>参与人数</td>
                    <td className={cssStyle.tdContent}>{event.joinNum}</td>
                    <td className={cssStyle.tdTitle}>操作人</td>
                    <td className={cssStyle.tdContent}>{event.operationUser}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>操作时间</td>
                    <td className={cssStyle.tdContent}>{event.operationUserId}</td>
                    <td className={cssStyle.tdTitle}>所属地点</td>
                    <td className={cssStyle.tdContent}>{event.incidentAddress}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>事件描述</td>
                    <td className={cssStyle.tdContent} colSpan={3}>{event.incidentContent}</td>
                </tr>
                </tbody>
            );
        } else {
            return (
                <tbody>
                <tr>
                    <td className={cssStyle.tdTitle}>事件来源</td>
                    <td className={cssStyle.tdContent}>{event.sourceName}</td>
                    <td className={cssStyle.tdTitle}>事发类型</td>
                    <td className={cssStyle.tdContent}>{event.eventTypeName}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>上报时间</td>
                    <td className={cssStyle.tdContent}>{event.incidentTime}</td>
                    <td className={cssStyle.tdTitle}>所属街道</td>
                    <td className={cssStyle.tdContent}>{event.roadName}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>事件概述</td>
                    <td className={cssStyle.tdContent} colSpan={3}>{event.incidentContent}</td>
                </tr>
                </tbody>
            );
        }
    }else{
        return null;
    }
}

//关联事件列表框
export function getEventAboutBox(list, mainId, mainType, listType, headRemove) {
    return list && list.length > 0 && (
        <div className={cssStyle.itemBox}>
            <div className={cssStyle.itemHead} onClick={listType === 2 ? changeItemShow.bind(this, 3) : null}>
                <img alt='' src={listType ? this.themeImgList[1] : iconTriangle} className={`${cssStyle.itemHeadIcon} ${listType === 2 ? (this.state.showList && this.state.showList.indexOf(3) >= 0 ? cssStyle.itemHeadIconShow : '') : ''}`} />
                <div className={cssStyle.itemTitle}>关联事件</div>
            </div>
            <div className={cssStyle.tabBox} style={{ display: this.state.showList && this.state.showList.indexOf(3) < 0 ? 'none' : '' }}>
                {list.map((item, index) =>
                    <div key={index} className={`${cssStyle.tabItem} ${index === this.state.aboutEventIndex ? cssStyle.selectedTab : ''}`} onClick={changeState.bind(this, 'aboutEventIndex', index)}>
                        <div className={cssStyle.tabName}>{'事件' + (index + 1)}</div>
                        <img alt='' src={iconClose} className={cssStyle.tabClose} onClick={removeAbout.bind(this, item.id, 2, mainId, mainType)} style={{display:headRemove?'':'none'}} />
                    </div>
                )}
            </div>
            <table className={cssStyle.itemContent} style={{ display: this.state.showList && this.state.showList.indexOf(3) < 0 ? 'none' : '' }}>
                {getAboutEvent(list[this.state.aboutEventIndex], listType)}
            </table>
        </div>
    );
}

//关联人员详情
export function getAboutPeople(people, type) {
    if (people && type === 2) {
        return (
            <tbody>
                <tr>
                    <td className={cssStyle.tdTitle}>姓名</td>
                    <td className={cssStyle.tdContent}>{people.name}</td>
                    <td className={cssStyle.tdTitle}>异动类型</td>
                    <td className={cssStyle.tdContent}>{people.peopleTypeName}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>乡镇街道</td>
                    <td className={cssStyle.tdContent}>{people.roadName}</td>
                    <td className={cssStyle.tdTitle}>预警时间</td>
                    <td className={cssStyle.tdContent}>{people.warningTime}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>预警等级</td>
                    <td className={cssStyle.tdContent}>{people.warningLevel}</td>
                    <td className={cssStyle.tdTitle}>预警状态</td>
                    <td className={cssStyle.tdContent}>{people.isWarning}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>管控等级</td>
                    <td className={cssStyle.tdContent}>{people.level}</td>
                    <td className={cssStyle.tdTitle}>操作人</td>
                    <td className={cssStyle.tdContent}>{people.operationUser}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>操作时间</td>
                    <td className={cssStyle.tdContent}>{people.operationUserId}</td>
                    <td className={cssStyle.tdTitle}>详细地址</td>
                    <td className={cssStyle.tdContent}>{people.address}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>工作单位</td>
                    <td className={cssStyle.tdContent} colSpan={3}>{people.workCompany}</td>
                </tr>
            </tbody>
        )
    } else {
        return (
            <tbody>
                <tr>
                    <td className={cssStyle.tdTitle}>姓名</td>
                    <td className={cssStyle.tdContent}>{people.name}</td>
                    <td className={cssStyle.tdTitle}>上报时间</td>
                    <td className={cssStyle.tdContent}>{people.createTime}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>人员类别</td>
                    <td className={cssStyle.tdContent} colSpan={3}>{people.peopleTypeName}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>公司</td>
                    <td className={cssStyle.tdContent} colSpan={3}>{people.workCompany}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>地址</td>
                    <td className={cssStyle.tdContent} colSpan={3}>{people.address}</td>
                </tr>
            </tbody>
        );
    }
}

//关联人员列表框
export function getPeopleAboutBox(list, mainId, mainType, listType,headRemove) {
    return list && list.length > 0 && (
        <div className={cssStyle.itemBox}>
            <div className={cssStyle.itemHead} onClick={listType === 2 ? changeItemShow.bind(this, 2) : null}>
                <img alt='' src={listType === 2 ? this.themeImgList[1] : iconTriangle} className={`${cssStyle.itemHeadIcon} ${listType === 2 ? (this.state.showList && this.state.showList.indexOf(2) >= 0 ? cssStyle.itemHeadIconShow : '') : ''}`} />
                <div className={cssStyle.itemTitle}>关联人员</div>
            </div>
            <div className={cssStyle.tabBox} style={{ display: this.state.showList && this.state.showList.indexOf(2) < 0 ? 'none' : '' }}>
                {list.map((item, index) =>
                    <div key={index} className={`${cssStyle.tabItem} ${index === this.state.aboutPeopleIndex ? cssStyle.selectedTab : ''}`} onClick={changeState.bind(this, 'aboutPeopleIndex', index)}>
                        <div className={cssStyle.tabName}>{'人员' + (index + 1)}</div>
                        <img alt='' src={iconClose} className={cssStyle.tabClose} onClick={removeAbout.bind(this, item.id, 1, mainId, mainType)} style={{display:headRemove?'':'none'}} />
                    </div>
                )}
            </div>
            <table className={cssStyle.itemContent} style={{ display: this.state.showList && this.state.showList.indexOf(2) < 0 ? 'none' : '' }}>
                {getAboutPeople(list[this.state.aboutPeopleIndex], listType)}
            </table>
        </div>
    );
}

export function changeItemShow(index) {
    let { showList } = this.state;
    const indexPos = showList.indexOf(index);
    if (indexPos >= 0) {
        showList.splice(indexPos, 1);
    } else {
        showList.push(index);
    }
    this.setState({ showList });
}

//关联重点物详情
export function getAboutGoods(goods) {
    if (goods) {
        return (
            <table className={cssStyle.itemContent}>
                <tbody>
                    <tr>
                        <td className={cssStyle.tdTitle}>名称</td>
                        <td className={cssStyle.tdContent}>{goods.goodsName}</td>
                        <td className={cssStyle.tdTitle}>类别</td>
                        <td className={cssStyle.tdContent}>{goods.typeName}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>概述</td>
                        <td className={cssStyle.tdContent} colSpan={3}>{goods.remarks}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

//关联重点物列表框
export function getGoodsAboutBox(list, mainId, mainType) {
    return list && list.length > 0 && (
        <div className={cssStyle.itemBox}>
            <div className={cssStyle.itemHead}>
                <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon} />
                <div className={cssStyle.itemTitle}>关联重点物</div>
            </div>
            <div className={cssStyle.tabBox}>
                {list.map((item, index) =>
                    <div key={index} className={`${cssStyle.tabItem} ${index === this.state.aboutGoodsIndex ? cssStyle.selectedTab : ''}`} onClick={changeState.bind(this, 'aboutGoodsIndex', index)}>
                        <div className={cssStyle.tabName}>{'重点物' + (index + 1)}</div>
                        <img alt='' src={iconClose} className={cssStyle.tabClose} onClick={removeAbout.bind(this, item.goodsId, 4, mainId, mainType)} />
                    </div>
                )}
            </div>
            {getAboutGoods(list[this.state.aboutGoodsIndex])}
        </div>
    );
}


//关联单位详情
export function getAboutCompany(company, type) {
    if (company && type === 2) {
        return (
            <tbody>
                <tr>
                    <td className={cssStyle.tdTitle}>单位名称</td>
                    <td className={cssStyle.tdContent}>{company.companyName}</td>
                    <td className={cssStyle.tdTitle}>预警类型</td>
                    <td className={cssStyle.tdContent}>{company.companyTypeName}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>乡镇街道</td>
                    <td className={cssStyle.tdContent}>{company.roadName}</td>
                    <td className={cssStyle.tdTitle}>预警时间</td>
                    <td className={cssStyle.tdContent}>{company.warningTime}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>预警等级</td>
                    <td className={cssStyle.tdContent}>{company.warningLevel}</td>
                    <td className={cssStyle.tdTitle}>预警状态</td>
                    <td className={cssStyle.tdContent}>{company.isWarning}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>电话</td>
                    <td className={cssStyle.tdContent}>{company.phone}</td>
                    <td className={cssStyle.tdTitle}>邮箱</td>
                    <td className={cssStyle.tdContent}>{company.email}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>官网</td>
                    <td className={cssStyle.tdContent}>{company.website}</td>
                    <td className={cssStyle.tdTitle}>操作人</td>
                    <td className={cssStyle.tdContent}>{company.operationUser}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>操作时间</td>
                    <td className={cssStyle.tdContent}>{company.operationUserId}</td>
                    <td className={cssStyle.tdTitle}>地址</td>
                    <td className={cssStyle.tdContent}>{company.companyAddress}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>备注</td>
                    <td className={cssStyle.tdContent} colSpan={3}>{company.remarks}</td>
                </tr>
            </tbody>
        )
    }
}

//关联重点单位表框
export function getCompanyAboutBox(list, mainId, mainType, listType,headRemove) {
    return list && list.length > 0 && (
        <div className={cssStyle.itemBox}>
            <div className={cssStyle.itemHead} onClick={listType === 2 ? changeItemShow.bind(this, 4) : null}>
                <img alt='' src={listType === 2 ? this.themeImgList[1] : iconTriangle} className={`${cssStyle.itemHeadIcon} ${listType === 2 ? (this.state.showList && this.state.showList.indexOf(4) >= 0 ? cssStyle.itemHeadIconShow : '') : ''}`} />
                <div className={cssStyle.itemTitle}>关联单位</div>
            </div>
            <div className={cssStyle.tabBox} style={{ display: this.state.showList && this.state.showList.indexOf(4) < 0 ? 'none' : '' }}>
                {list.map((item, index) =>
                    <div key={index} className={`${cssStyle.tabItem} ${index === this.state.aboutCompanytIndex ? cssStyle.selectedTab : ''}`} onClick={changeState.bind(this, 'aboutCompanytIndex', index)}>
                        <div className={cssStyle.tabName}>{'单位' + (index + 1)}</div>
                        <img alt='' src={iconClose} className={cssStyle.tabClose} onClick={removeAbout.bind(this, item.id, 1, mainId, mainType)} style={{display:headRemove?'':'none'}} />
                    </div>
                )}
            </div>
            <table className={cssStyle.itemContent} style={{ display: this.state.showList && this.state.showList.indexOf(4) < 0 ? 'none' : '' }}>
                {getAboutCompany(list[this.state.aboutPeopleIndex], listType)}
            </table>
        </div>
    );
}





export function getEventHistoryBox(list) {
    return list && list.length > 0 && (
        <div className={cssStyle.itemBox}>
            <div className={cssStyle.itemHead}>
                <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon} />
                <div className={cssStyle.itemTitle}>涉稳事件历史记录</div>
            </div>
            <div className={cssStyle.tabBox}>
                {list.map((item, index) =>
                    <div key={index} className={`${cssStyle.tabItem} ${index === this.state.historyIndex ? cssStyle.selectedTab : ''}`} onClick={changeState.bind(this, 'historyIndex', index)}>
                        <div className={`${cssStyle.tabName} ${cssStyle.borderRightRadius}`}>{'事件' + (index + 1)}</div>
                    </div>
                )}
            </div>
            {this.getHistoryDetail(list[this.state.historyIndex])}
        </div>
    )
}

export function getMemberTable(memberList) {
    if (memberList && memberList.length > 0) {
        return (
            <table className={cssStyle.childTable}>
                <tbody>
                    <tr>
                        <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{ width: '30%' }}>姓名</td>
                        <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{ width: '30%' }}>职务</td>
                        <td className={`${cssStyle.tdTitle} ${cssStyle.alignLeft}`} style={{ width: '40%' }}>联系方式</td>
                    </tr>
                    {memberList.map((item, index) =>
                        <tr key={index}>
                            <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{ width: '30%' }}>{item.name}</td>
                            <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{ width: '30%' }}>{item.duty}</td>
                            <td className={`${cssStyle.tdContent} ${cssStyle.alignLeft}`} style={{ width: '40%' }}>{item.phone}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    } else {
        return null;
    }
}

//获取关闭按钮样式
export function getCloseDom(style, compatibleSize) {
    if (style.iconType === 0) {
        return (
            <Icon
                type="close" className={cssStyle.closeBtn}
                onClick={this.changeThisShow.bind(this, false)}
                style={{
                    color: style.iconColor,
                    fontSize: compatibleSize.iconSize,
                    right: compatibleSize.iconRight,
                    top: compatibleSize.iconTop,
                }}
            />
        );
    } else if (style.iconType === 1) {
        return (
            <img
                alt="" className={cssStyle.closeBtn}
                src={closeTypeOne}
                onClick={this.changeThisShow.bind(this, false)}
                style={{
                    width: compatibleSize.iconSize,
                    height: compatibleSize.iconSize,
                    right: compatibleSize.iconRight,
                    top: compatibleSize.iconTop,
                }}
            />
        );
    }
}

export function getTimelineList(dataList,type) {
    if (dataList && dataList.length > 0&&type===2) {
        const length = dataList.length;
        return dataList.map((item, index) =>
            <Timeline.Item key={index} className={cssStyle.fontColor} style={length - 1 === index ? { padding: '0 0 1.6em' } : {}}>
                <div className={cssStyle.timelineHead}>
                    <span>{item.userName}</span>
                    <span>{item.processDate}</span>
                    <span>{item.mobilePhone}</span>
                </div>
                <div>{item.suggestion}</div>
            </Timeline.Item>
        )
    }else if(dataList && dataList.length > 0){
        const length = dataList.length;
        return dataList.map((item, index) =>
            <Timeline.Item key={index} className={cssStyle.fontColor} style={length - 1 === index ? { padding: '0 0 1.6em' } : {}}>
                <div className={cssStyle.timelineHead}>
                    <span>{item.time}</span>
                    <span>{item.dep}</span>
                    <span>{item.user}</span>
                </div>
                <div>{item.content}</div>
            </Timeline.Item>
        )
    }
}

//修改state/主要用于切换标签页
export function changeState(key, data) {
    let newData = {};
    newData[key] = data;
    this.setState(newData);
}
//各种操作/排除/转为重点事
export function operation(id, type) {
    let message = "";
    let dataUrl = "";
    let sendData = { rbacToken: this.props.token };
    switch (type) {
        case 1:
            dataUrl = warningUrl + "/emphaseDataManage/hanlderPrePeople";
            message = '将该人员排除';
            sendData.ids = id;
            sendData.type = 0;
            break;
        case 2:
            dataUrl = warningUrl + "/emphaseDataManage/hanlderPreEvent";
            message = '将该事件排除';
            sendData.ids = id;
            sendData.type = 0;
            break;
        case 3:
            dataUrl = warningUrl + "/emphaseDataManage/hanlderPreEvent";
            message = '将该事件转为重点事';
            sendData.ids = id;
            sendData.type = 1;
            break;
        case 4:
            dataUrl = warningUrl + "/emphasesDateView/handlePreCompanyById";
            message = '将该企业排除';
            sendData.ids = id;
            sendData.type = 0;
            break;
        case 5:
            dataUrl = warningUrl + "/emphasesDateView/handlePreCompanyById";
            message = '将该企业转为重点企业';
            sendData.ids = id;
            sendData.type = 3;
            break;
        default:
            break;
    }
    confirm({
        title: '是否确认' + message + '?',
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
            return new Promise((resolve) => {
                axios.post(dataUrl, sendData).then((response) => {
                    resolve();
                    if (response.data.success) {
                        Modal.success({
                            content: '已' + message + '。',
                        });
                        //若为排除则隐藏当前弹窗详情
                        if ('1,2,4'.indexOf(type) >= 0) {
                            // this.changeThisShow(false);
                            this.setState({ hasRemove: true });
                            const { removeInteract } = this.props.thisData.style;
                            this.interactData(removeInteract);
                        } else {
                            if (type === 3) {
                                //切换重点详情内容
                                this.keyParams.dataType = 1;
                                this.setState({ dataType: 1 });
                            } else if (type === 5) {
                                //切换重点详情内容
                                this.keyParams.companyType = 1;
                                this.setState({ companyType: 1 });
                            }
                            //重新获取数据
                            this.reGetData();
                        }
                        //通知刷新
                        this.sendMessage();
                    } else {
                        Modal.error({
                            content: response.data.data,
                        });
                    }
                }).catch(function (error) {
                });
            }).catch(() => console.log('Oops errors!'));
        },
        onCancel: () => { },
    });
}

//解除关联
export function removeAbout(subId, subType, mainId, mainType) {
    let subName = '';
    switch (subType) {
        case 1:
            subName = '人员';
            break;
        case 2:
            subName = '事件';
            break;
        case 3:
            subName = '单位';
            break;
        case 4:
            subName = '重点物';
            break;
        default:
    }
    confirm({
        title: '是否确认将该' + subName + '解除关联?',
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
            return new Promise((resolve) => {
                const sendData = {
                    rbacToken: this.props.token,
                    subId: subId,
                    subType: subType,
                    id: mainId,
                    type: mainType
                };
                axios.post(warningUrl + "/emphasesDateView/removeAbout", sendData).then((response) => {
                    resolve();
                    if (response.data.success) {
                        Modal.success({
                            content: '已解除关联。',
                        });
                        this.reGetData();
                    } else {
                        Modal.error({
                            content: response.data.data,
                        });
                    }
                }).catch(function (error) {
                });
            }).catch(() => console.log('Oops errors!'));
        },
        onCancel: () => { },
    });
}

//通知消息刷新
export function sendMessage() {
    const { interact } = this.props.thisData.dataSources;
    interact && interact.forEach((item) => {
        Emitter.emit(item.receiveId, { type: 'reFreshAll' });
    });
}

export function getCompatibleData(style) {
    return {
        iconSize: getCompatibleSize(style.iconSize),
        padding: getCompatibleSizeList(style.padding),
        titleSize: getCompatibleSize(style.titleSize),
        titleHeight: getCompatibleSize(style.titleHeight),
        iconTop: getCompatibleSize(style.iconTop),
        iconRight: getCompatibleSize(style.iconRight),
        fontSize: getCompatibleSize(style.fontSize ? style.fontSize : '1.5vh'),
    };
}

export function getDetailEdit(style) {
    if(this.getInteractEdit == null){
        this.getInteractEdit = getInteractEdit.bind(this);
    }
    return (
        <Collapse>
            <Panel header="基础样式设置" key="1">
                <Form.Item label="背景色">
                    <ColorSelect color={style.bgColor} setColor={setColor.bind(this, style, 'bgColor')} />
                </Form.Item>
                <Form.Item label="内边距">
                    <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                </Form.Item>
                <Form.Item label="内容字号">
                    <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                </Form.Item>
                <Form.Item label="配色方案">
                    <Select value={style.theme} onChange={changeDetailData.bind(this, 2, style, 'theme')}>
                        <Select.Option value={0} >方案一</Select.Option>
                        <Select.Option value={1} >方案二</Select.Option>
                    </Select>
                </Form.Item>
            </Panel>
            <Panel header="边框样式" key="8">
                <Form.Item label="边框线宽" >
                    <Input value={style.borderWidth} onChange={changeDetailData.bind(this, 1, style, 'borderWidth')} />
                </Form.Item>
                <Form.Item label="边框颜色" >
                    <ColorSelect color={style.borderColor} setColor={setColor.bind(this, style, 'borderColor')} />
                </Form.Item>
                <Form.Item label="边框圆角" >
                    <Input value={style.borderRadius} onChange={changeDetailData.bind(this, 1, style, 'borderRadius')} />
                </Form.Item>
                <Form.Item label="边框类型" >
                    <Radio.Group value={style.borderStyle} onChange={changeDetailData.bind(this, 1, style, 'borderStyle')}>
                        <Radio value="solid">实线</Radio>
                        <Radio value="dashed">虚线1</Radio>
                        <Radio value="dotted">虚线2</Radio>
                    </Radio.Group>
                </Form.Item>
            </Panel>
            <Panel header="关闭按钮设置" key="2">
                <Form.Item label="按钮样式">
                    <Select value={style.iconType} onChange={changeDetailData.bind(this, 2, style, 'iconType')}>
                        <Select.Option value={0} >样式一</Select.Option>
                        <Select.Option value={1} >样式二</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="按钮颜色" style={{ display: style.iconType !== 0 ? 'none' : '' }}>
                    <ColorSelect color={style.iconColor} setColor={setColor.bind(this, style, 'iconColor')} />
                </Form.Item>
                <Form.Item label="按钮大小">
                    <Input value={style.iconSize} onChange={changeDetailData.bind(this, 1, style, 'iconSize')} />
                </Form.Item>
                <Form.Item label="上">
                    <Input value={style.iconTop} onChange={changeDetailData.bind(this, 1, style, 'iconTop')} />
                </Form.Item>
                <Form.Item label="右">
                    <Input value={style.iconRight} onChange={changeDetailData.bind(this, 1, style, 'iconRight')} />
                </Form.Item>
            </Panel>
            <Panel header="标题设置" key="3">
                <Form.Item label="标题颜色">
                    <ColorSelect color={style.titleColor} setColor={setColor.bind(this, style, 'titleColor')} />
                </Form.Item>
                <Form.Item label="字体大小">
                    <Input value={style.titleSize} onChange={changeDetailData.bind(this, 1, style, 'titleSize')} />
                </Form.Item>
                <Form.Item label="行高">
                    <Input value={style.titleHeight} onChange={changeDetailData.bind(this, 1, style, 'titleHeight')} />
                </Form.Item>
                <Form.Item label="标题宽">
                    <Input value={style.titleWidth} onChange={changeDetailData.bind(this, 1, style, 'titleWidth')} />
                </Form.Item>
                <Form.Item label="下间距">
                    <Input value={style.titleGap} onChange={changeDetailData.bind(this, 1, style, 'titleGap')} />
                </Form.Item>
            </Panel>
            <Panel header="关闭时交互" key="4">
                {this.getInteractEdit(style.closeInteract)}
                <Form.Item label="">
                    <Button type="dashed" onClick={addListItem.bind(this, style, 'closeInteract', {})}>
                        <Icon type="plus" /> 添加交互内容
                    </Button>
                </Form.Item>
            </Panel>
            <Panel header="排除时交互" key="5">
                {this.getInteractEdit(style.removeInteract)}
                <Form.Item label="">
                    <Button type="dashed" onClick={addListItem.bind(this, style, 'removeInteract', {})}>
                        <Icon type="plus" /> 添加交互内容
                    </Button>
                </Form.Item>
            </Panel>
            {style.contentName === 'totalQuantityYuhai' && (
                <Panel header="预警时交互" key="6">
                    {this.getInteractEdit(style.warningInteract)}
                    <Form.Item label="">
                        <Button type="dashed" onClick={addListItem.bind(this, style, 'warningInteract', {})}>
                            <Icon type="plus" /> 添加交互内容
                        </Button>
                    </Form.Item>
                </Panel>
            )}
            {style.contentName === 'totalQuantityYuhai' && (
                <Panel header="催办时交互" key="7">
                    {this.getInteractEdit(style.urgingInteract)}
                    <Form.Item label="">
                        <Button type="dashed" onClick={addListItem.bind(this, style, 'urgingInteract', {})}>
                            <Icon type="plus" /> 添加交互内容
                        </Button>
                    </Form.Item>
                </Panel>
            )}
            {style.contentName === 'totalQuantityYuhai' && (
                <Panel header="结束时交互" key="8">
                    {this.getInteractEdit(style.setEndInteract)}
                    <Form.Item label="">
                        <Button type="dashed" onClick={addListItem.bind(this, style, 'setEndInteract', {})}>
                            <Icon type="plus" /> 添加交互内容
                        </Button>
                    </Form.Item>
                </Panel>
            )}
            {('messageEdit,addInstruction,addEventOne,addEventTwo'.indexOf(style.contentName) >= 0) && (
                <Panel header="请求成功后交互" key="9">
                    {this.getInteractEdit(style.successInteract)}
                    <Form.Item label="">
                        <Button type="dashed" onClick={addListItem.bind(this, style, 'successInteract', {})}>
                            <Icon type="plus" /> 添加交互内容
                        </Button>
                    </Form.Item>
                </Panel>
            )}
        </Collapse>
    );
}

//文件下载
export function downloadFile(url) {
    window.open(url);
}