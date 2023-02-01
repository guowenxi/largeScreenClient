import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from '../../common/css/detail.module.css';
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import Emitter from "../../common/eventBus";
import {Icon} from "antd";
import {
    changeState,
    getCompatibleData,
    getEventAboutBox,
    getMemberTable
} from "../../common/detailUtil";
import iconTriangle from "../detail_event_early_warning/images/lanjiao_blue.svg";

export default class DetailPeopleEarlyWarning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showComponent: false, visible: false, operateType: null, historyIndex: 0, relationIndex: 0};
        this.keyParams = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getEventAboutBox = getEventAboutBox.bind(this);
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
    changeThisShow(type){
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: {showStatus: type, id: this.props.thisData.id}
        });
        this.setState({showComponent:type});
    }

    //异动详情
    getHistoryDetail(history){
        if(history){
            return (
                <table className={cssStyle.itemContent}>
                    <tbody>
                    <tr>
                        <td className={cssStyle.tdTitle}>异动时间</td>
                        <td className={cssStyle.tdContent}>{history.petitionTime}</td>
                        <td className={cssStyle.tdTitle}>异动类型</td>
                        <td className={cssStyle.tdContent}>{history.petitionTypeName}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>异动内容</td>
                        <td className={cssStyle.tdContent} colSpan={3} >{history.petitionContent}</td>
                    </tr>
                    </tbody>
                </table>
            );
        }
    }

    //关系人详情
    getRelationDetail(history){
        if(history){
            return (
                <table className={cssStyle.itemContent}>
                    <tbody>
                    <tr>
                        <td className={cssStyle.tdTitle}>姓名</td>
                        <td className={cssStyle.tdContent}>{history.name}</td>
                        <td className={cssStyle.tdTitle}>关系</td>
                        <td className={cssStyle.tdContent}>{history.relation}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>身份证<br />号码</td>
                        <td className={cssStyle.tdContent}>{history.idCard}</td>
                        <td className={cssStyle.tdTitle}>手机号码</td>
                        <td className={cssStyle.tdContent}>{history.phone}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>工作单位</td>
                        <td className={cssStyle.tdContent} colSpan={3} >{history.workCompany}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>异动经历</td>
                        <td className={cssStyle.tdContent} colSpan={3} >{history.experience}</td>
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
                                    <div className={cssStyle.head} style={{fontSize:compatibleSize.titleSize,color: style.titleColor,width:style.titleWidth}}>{detail.name}</div>
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
                                                <td className={cssStyle.tdTitle}>管控等级</td>
                                                <td className={cssStyle.tdContent}>{detail.level}</td>
                                                <td className={cssStyle.tdTitle}>人员类型</td>
                                                <td className={cssStyle.tdContent}>{detail.peopleTypeName}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>最近异动<br />时间</td>
                                                <td className={cssStyle.tdContent}>{detail.lastPetitionTime}</td>
                                                <td className={cssStyle.tdTitle}>身份证号码</td>
                                                <td className={cssStyle.tdContent}>{detail.cardId}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>所属街道</td>
                                                <td className={cssStyle.tdContent}>{detail.roadName}</td>
                                                <td className={cssStyle.tdTitle}>手机号码</td>
                                                <td className={cssStyle.tdContent}>{detail.phone}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>详细地址</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>{detail.address}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>工作单位</td>
                                                <td className={cssStyle.tdContent}>{detail.workCompany}</td>
                                                <td className={cssStyle.tdTitle}>车牌号</td>
                                                <td className={cssStyle.tdContent}>{detail.carId}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>主要诉求</td>
                                                <td className={`${cssStyle.tdContent} ${cssStyle.breakAll}`} colSpan={3}>{detail.requireContent}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle} >关联<br />重点事</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.importantEvents && (
                                                        detail.importantEvents.map((item,index) =>
                                                            <span className={cssStyle.fileName} key={index}>{item.eventName}</span>
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>列控事由</td>
                                                <td className={`${cssStyle.tdContent} ${cssStyle.breakAll}`} colSpan={3}>{detail.reason}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>化解措施</td>
                                                <td className={`${cssStyle.tdContent} ${cssStyle.breakAll}`} colSpan={3}>{detail.measure}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead}>
                                            <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
                                            <div className={cssStyle.itemTitle}>稳控责任单位</div>
                                        </div>
                                        <table className={cssStyle.itemContent}>
                                            <tbody>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>单位名称</td>
                                                <td className={cssStyle.tdContent}>{detail.dutyDepartment}</td>
                                                <td className={cssStyle.tdTitle}>是否化解</td>
                                                <td className={cssStyle.tdContent}>{detail.isSolve === 0 ? '否' : '是'}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>稳控专班<br />工作人员</td>
                                                <td className={`${cssStyle.tdContent} ${cssStyle.breakAll}`} colSpan={3}>
                                                    {detail.peopleControlInfos && getMemberTable(detail.peopleControlInfos)}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {detail.peoplePetitionInfos && (
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.itemHead}>
                                                <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
                                                <div className={cssStyle.itemTitle}>异动记录</div>
                                            </div>
                                            <div className={cssStyle.tabBox}>
                                                {detail.peoplePetitionInfos.map((item,index) =>
                                                    <div key={index} className={`${cssStyle.tabItem} ${index === this.state.historyIndex ? cssStyle.selectedTab:''}`} onClick={changeState.bind(this,'historyIndex',index)}>
                                                        <div className={`${cssStyle.tabName} ${cssStyle.borderRightRadius}`}>{'异动'+(index+1)}</div>
                                                    </div>
                                                )}
                                            </div>
                                            {this.getHistoryDetail(detail.peoplePetitionInfos[this.state.historyIndex])}
                                        </div>
                                    )}
                                    {detail.relationshipInfos && (
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.itemHead}>
                                                <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
                                                <div className={cssStyle.itemTitle}>重点对象亲友</div>
                                            </div>
                                            <div className={cssStyle.tabBox}>
                                                {detail.relationshipInfos.map((item,index) =>
                                                    <div key={index} className={`${cssStyle.tabItem} ${index === this.state.relationIndex ? cssStyle.selectedTab:''}`} onClick={changeState.bind(this,'relationIndex',index)}>
                                                        <div className={`${cssStyle.tabName} ${cssStyle.borderRightRadius}`}>{item.relation ? item.relation:'关系'+(index+1)}</div>
                                                    </div>
                                                )}
                                            </div>
                                            {this.getRelationDetail(detail.relationshipInfos[this.state.relationIndex])}
                                        </div>
                                    )}
                                    {this.getEventAboutBox(detail.assocEventInfo)}
                                </Scrollbars>
                            </div>
                        )
                    }}
                </Motion>
            </ComponentBox>
        )
    }
}