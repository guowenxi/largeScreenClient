import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from '../../common/css/detail.module.css';
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import {Button, Modal, Select, Row, Col} from "antd";
import {
    getEventAboutBox,
    operation,
    getCompatibleData,
    sendMessage,
    getMemberTable,
    changeState, getCloseDom
} from "../../common/detailUtil";
import Emitter from "../../common/eventBus";
import {warningUrl} from "../../config";
import {getCompatibleSizeList, interactData} from "../../common/util";
import iconTriangleOne from "../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../common/images/lanjiao_blue.svg";
import {systemArea} from "../../config";

export default class DetailEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showComponent: false, visible: false, confirmLoading:false, operateType: null, level: 1, aboutEventIndex: 0, peopleType: 0, historyIndex: 0, relationIndex: 0};
        this.keyParams = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getEventAboutBox = getEventAboutBox.bind(this);
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
                let hasKey = false;
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                    hasKey = true;
                }
                this.setState({peopleType:data.data.peopleType});
                //显示组件
                this.changeThisShow(true);
                //获取数据
                if(hasKey){
                    this.getData();
                }
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
                    this.setState({data: result, aboutEventIndex: 0, historyIndex: 0, relationIndex: 0, hasRemove: false});
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

    //选择管控等级
    changeLevel(value){
        this.setState({level:value});
    }

    //转为重点人弹出框
    changePeople(flag){
        this.setState({visible:flag});
    }

    //确认转为重点人
    handleOk(){
        this.setState({confirmLoading:true});
        const sendData = {
            rbacToken: this.props.token,
            ids: this.state.data.id,
            level: this.state.level,
            type: 1
        };
        axios.post(warningUrl+"/emphaseDataManage/hanlderPrePeople", sendData).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: '已转为重点人。',
                });
                this.keyParams.peopleType = 1;
                this.setState({peopleType:1});
                this.reGetData();
                this.setState({confirmLoading:false,visible:false});
                this.sendMessage();
            }else{
                Modal.error({
                    content: response.data.data,
                });
            }
        }).catch(function (error) {
        });
    }

    //重点人详情
    getDetail(compatibleSize,detail){
        return (
            <Scrollbars style={{height: 'calc(100% - ' + compatibleSize.titleHeight + ')',fontSize:compatibleSize.fontSize}}>
                <div className={cssStyle.itemBox}>
                    <div className={cssStyle.itemHead}>
                        <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
                        <div className={cssStyle.itemTitle}>基本信息</div>
                    </div>
                    <table className={cssStyle.itemContent}>
                        <tbody>
                        <tr>
                            {/*<td className={cssStyle.tdTitle}>预警状态</td>*/}
                            {/*<td className={cssStyle.tdContent} style={{color:this.warningTypeColor[detail.isWarning]}}>{this.warningTypeName[detail.isWarning]}</td>*/}
                            <td className={cssStyle.tdTitle}>研判时间</td>
                            <td className={cssStyle.tdContent} colSpan={3}>{detail.createTime}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>预警等级</td>
                            <td className={cssStyle.tdContent} style={{color:this.levelColor[detail.warningLevel]}}>{this.warningLevelList[detail.warningLevel]}</td>
                            <td className={cssStyle.tdTitle}>预警时间</td>
                            <td className={cssStyle.tdContent}>{detail.warningTime}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>管控等级</td>
                            <td className={cssStyle.tdContent}>{detail.level}</td>
                            <td className={cssStyle.tdTitle}>异动行为</td>
                            <td className={cssStyle.tdContent}>{detail.peopleTypeName}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>最近异动<br />时间</td>
                            <td className={cssStyle.tdContent}>{detail.lastPetitionTime}</td>
                            <td className={cssStyle.tdTitle}>身份证号码</td>
                            <td className={cssStyle.tdContent}>{detail.cardId}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>{systemArea === 'longgang' ? '所属工作站':'所属街道'}</td>
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
                                        item ? <span className={cssStyle.fileName} key={index}>{item.eventName}</span> :''
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
                        <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
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
                            <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
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
                            <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
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
        );
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

    //预警人详情
    getWarningDetail(compatibleSize,detail){
        return (
            <Scrollbars style={{height: 'calc(100% - ' + compatibleSize.titleHeight + ' - 3em)',fontSize:compatibleSize.fontSize}}>
                <div className={cssStyle.itemBox}>
                    <div className={cssStyle.itemHead}>
                        <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
                        <div className={cssStyle.itemTitle}>基本信息</div>
                    </div>
                    <table className={cssStyle.itemContent}>
                        <tbody>
                        <tr>
                            <td className={cssStyle.tdTitle}>异动行为</td>
                            <td className={cssStyle.tdContent}>{detail.peopleTypeName}</td>
                            <td className={cssStyle.tdTitle}>{systemArea === 'longgang' ? '所属工作站':'所属街道'}</td>
                            <td className={cssStyle.tdContent}>{detail.roadName}</td>
                        </tr>
                       {/* <tr>
                            <td className={cssStyle.tdTitle}>相似度</td>
                            <td className={cssStyle.tdContent} >{detail.similarity ? detail.similarity+'%':''}</td>
                            <td className={cssStyle.tdTitle}>研判时间</td>
                            <td className={cssStyle.tdContent}>{detail.createTime}</td>
                        </tr>*/}
                        {/*<tr>*/}
                        {/*    <td className={cssStyle.tdTitle}>预警状态</td>*/}
                        {/*    <td className={cssStyle.tdContent} colSpan={3} style={{color:this.warningTypeColor[detail.isWarning]}}>{this.warningTypeName[detail.isWarning]}</td>*/}
                        {/*</tr>*/}
                        <tr>
                            <td className={cssStyle.tdTitle}>预警等级</td>
                            <td className={cssStyle.tdContent} style={{color:this.levelColor[detail.warningLevel]}}>{this.warningLevelList[detail.warningLevel]}</td>
                            <td className={cssStyle.tdTitle}>预警时间</td>
                            <td className={cssStyle.tdContent}>{detail.warningTime}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>详细地址</td>
                            <td className={cssStyle.tdContent} colSpan={3} >{detail.address}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>工作单位</td>
                            <td className={cssStyle.tdContent} colSpan={3} >{detail.workCompany}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                {this.getEventAboutBox(detail.peopleEventVoList,detail.id,1)}
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
                                <div className={cssStyle.headBox} style={{height:compatibleSize.titleHeight}}>
                                    <div className={cssStyle.head} style={{fontSize:compatibleSize.titleSize,color: style.titleColor,width:style.titleWidth}}>{detail.name}</div>
                                </div>
                                {this.getCloseDom(style,compatibleSize)}
                                {this.state.peopleType === 0 ? this.getWarningDetail(compatibleSize,detail) : this.getDetail(compatibleSize,detail)}
                                {detail.handleState === -1 && !this.state.hasRemove && (
                                    <div className={cssStyle.bottomBox} style={{fontSize:compatibleSize.fontSize}}>
                                        <Button type="danger" style={{fontSize:compatibleSize.fontSize}} onClick={operation.bind(this,detail.id,1)}>排除</Button>
                                        {systemArea !== 'linan' && systemArea !== 'ruian' && (
                                            <Button type="primary" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} onClick={this.changePeople.bind(this,true)} >转入重点人</Button>
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
                <Modal
                    title="转为重点人"
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.changePeople.bind(this,false)}
                    okText="确认"
                    cancelText="取消"
                    confirmLoading={this.state.confirmLoading}
                >
                    <Row >
                        <Col span={6} style={{lineHeight:'32px'}}>
                            管控等级
                        </Col>
                        <Col span={18}>
                            <Select value={this.state.level} onChange={this.changeLevel.bind(this)} style={{width:'100%'}}>
                                <Select.Option value={1}>关注</Select.Option>
                                <Select.Option value={2}>一级</Select.Option>
                                <Select.Option value={3}>二级</Select.Option>
                                <Select.Option value={4}>三级</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                </Modal>
            </ComponentBox>
        )
    }
}