import React from "react";
import {Timeline} from "antd";
import ComponentBox from "../component_box";
import cssStyle from '../../common/css/detail.module.css';
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import Emitter from "../../common/eventBus";
import {getCompatibleData, getCloseDom, getTimelineList, downloadFile, changeState} from "../../common/detailUtil";
import iconTriangleOne from "../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../common/images/lanjiao_blue.svg";
import {interactData} from "../../common/util";
import {getData} from "../../common/getDataUtil";
import "../../common/css/antdTimeline.css";

export default class DetailInfrastructureProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showComponent: false, showList: [2], contactDataIndex: 0};
        this.keyParams = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.themeList = ['',cssStyle.themeOne];
        this.themeImgList = [iconTriangleOne,iconTriangleTwo];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        // this.p = new Promise((resolve) => {
        //     this.getData(this.callBack.bind(this, resolve))
        // });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.reGetData();
        // this.p.then((data) => {
        //     this.setState({data});
        // });
        // this.getData();
        // this.changeThisShow(true);
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            // case "changeKey" :
            //     //修改请求条件
            //     for (let key in data.data) {
            //         this.keyParams[key] = data.data[key];
            //     }
            //     this.reGetData();
            //     break;
            case "animateOn":
                this.animateOn();
                break;
            case "changeKey" :
            case "showComponent":
                //修改请求条件
                let hasKey = false;
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                    hasKey = true;
                }
                if(hasKey){
                    this.reGetData();
                }
                if(data.type === 'showComponent'){
                    this.changeThisShow(true);
                }
                break;
            default:
                break;
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            if (resolve) {
                resolve(result);
            } else {
                this.setState({data: result, contactDataIndex: 0});
            }
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
            this.setState({data:{}, showList: [2], contactDataIndex: 0});
            const {closeInteract} = this.props.thisData.style;
            this.interactData(closeInteract);
        }
    }

    //切换某项内容显示隐藏
    changeItemShow(index){
        let {showList} = this.state;
        const indexPos = showList.indexOf(index);
        if(indexPos >= 0){
            showList.splice(indexPos,1);
        }else{
            showList.push(index);
        }
        this.setState({showList});
    }

    //某项联系单详情
    getContactData(detailParent){
        if(detailParent.contactDataList && detailParent.contactDataList[this.state.contactDataIndex]){
            const detail = detailParent.contactDataList[this.state.contactDataIndex];
            return (
                <tbody>
                <tr>
                    <td className={cssStyle.tdTitle}>联系单编号</td>
                    <td className={cssStyle.tdContent}>{detail.contactList}</td>
                    <td className={cssStyle.tdTitle}>变更估算金额（万元）</td>
                    <td className={cssStyle.tdContent}>{detail.changePrice}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>变更依据及内容</td>
                    <td className={cssStyle.tdContent} colSpan={3}>{detail.changeReason}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>是否需要重大警保会议研究</td>
                    <td className={cssStyle.tdContent}>{detail.needMeeting}</td>
                    <td className={cssStyle.tdTitle}>是否需局长办公会议或局党委会研究</td>
                    <td className={cssStyle.tdContent}>{detail.needMeetingStudy}</td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>资料</td>
                    <td className={cssStyle.tdContent} colSpan={3}>
                        {detail.contactFile && detail.contactFile.map((item,index) =>
                            <span key={index} className={cssStyle.fileName} onClick={downloadFile.bind(this,item.url)}>{item.name}</span>
                        )}
                    </td>
                </tr>
                <tr>
                    <td className={cssStyle.tdTitle}>图片</td>
                    <td className={cssStyle.tdContent} colSpan={3}>
                        {detail.contactImages && detail.contactImages.map((item,index) =>
                            <div key={index} className={cssStyle.imageBox}>
                                <img alt='' src={item.url}/>
                            </div>
                        )}
                    </td>
                </tr>
                </tbody>
            );
        }
    }


    render() {
        const detail = this.state.data ? this.state.data : {};
        const {style} = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        const {showList} = this.state;
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
                                style={{backgroundColor: style.bgColor, top: -top + '%', padding:compatibleSize.padding}}
                            >
                                <div className={cssStyle.headBox} style={{minHeight:compatibleSize.titleHeight}}>
                                    <div className={cssStyle.head} style={{fontSize:compatibleSize.titleSize,color: style.titleColor,width:style.titleWidth}}>{detail.projectName}</div>
                                </div>
                                {this.getCloseDom(style,compatibleSize)}
                                <Scrollbars style={{height: 'calc(100% - ' + compatibleSize.titleHeight + ')',fontSize:compatibleSize.fontSize}}>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead} onClick={this.changeItemShow.bind(this,1)}>
                                            <img alt='' src={this.themeImgList[style.theme]} className={`${cssStyle.itemHeadIcon} ${showList.indexOf(1) >= 0 ? cssStyle.itemHeadIconShow:''}`}/>
                                            <div className={cssStyle.itemTitle}>基本信息</div>
                                        </div>
                                        <table className={cssStyle.itemContent} style={{display:showList.indexOf(1)<0?'none':''}}>
                                            <tbody>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>项目编号</td>
                                                <td className={cssStyle.tdContent}>{detail.no}</td>
                                                <td className={cssStyle.tdTitle}>项目预算金额（万元）</td>
                                                <td className={cssStyle.tdContent}>{detail.price}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>申请时间</td>
                                                <td className={cssStyle.tdContent}>{detail.time}</td>
                                                <td className={cssStyle.tdTitle}>申请单位</td>
                                                <td className={cssStyle.tdContent}>{detail.dep}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>联系人</td>
                                                <td className={cssStyle.tdContent}>{detail.contactUser}</td>
                                                <td className={cssStyle.tdTitle}>现场负责人</td>
                                                <td className={cssStyle.tdContent}>{detail.responsibleUser}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>改造依据及内容</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>{detail.base}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>项目类型</td>
                                                <td className={cssStyle.tdContent}>{detail.type}</td>
                                                <td className={cssStyle.tdTitle}>是否经重大警报会议研究</td>
                                                <td className={cssStyle.tdContent}>{detail.needStudy}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>三重一大报备情况</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>{detail.hasReport}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>申请报告</td>
                                                <td className={cssStyle.tdContent}>
                                                    {detail.applicationReport && detail.applicationReport.map((item,index) =>
                                                        <span key={index} className={cssStyle.fileName} onClick={downloadFile.bind(this,item.url)}>{item.name}</span>
                                                    )}
                                                </td>
                                                <td className={cssStyle.tdTitle}>立项批复文件</td>
                                                <td className={cssStyle.tdContent}>
                                                    {detail.approvalDocuments && detail.approvalDocuments.map((item,index) =>
                                                        <span key={index} className={cssStyle.fileName} onClick={downloadFile.bind(this,item.url)}>{item.name}</span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>资料图片</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.images && detail.images.map((item,index) =>
                                                        <div key={index} className={cssStyle.imageBox}>
                                                            <img alt='' src={item.url}/>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead} onClick={this.changeItemShow.bind(this,3)}>
                                            <img alt='' src={this.themeImgList[style.theme]} className={`${cssStyle.itemHeadIcon} ${showList.indexOf(3) >= 0 ? cssStyle.itemHeadIconShow:''}`}/>
                                            <div className={cssStyle.itemTitle}>项目合同信息</div>
                                        </div>
                                        <table className={cssStyle.itemContent} style={{display:showList.indexOf(3)<0?'none':''}}>
                                            <tbody>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>合同名称</td>
                                                <td className={cssStyle.tdContent}>{detail.contractName}</td>
                                                <td className={cssStyle.tdTitle}>合同乙方</td>
                                                <td className={cssStyle.tdContent}>{detail.contractObject}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>合同金额（万元）</td>
                                                <td className={cssStyle.tdContent}>{detail.contractPrice}</td>
                                                <td className={cssStyle.tdTitle}>合同文件</td>
                                                <td className={cssStyle.tdContent}>
                                                    {detail.contractFile && detail.contractFile.map((item,index) =>
                                                        <span key={index} className={cssStyle.fileName} onClick={downloadFile.bind(this,item.url)}>{item.name}</span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>订立情况说明</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>{detail.contractRemark}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>资料图片</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.contractImages && detail.contractImages.map((item,index) =>
                                                        <div key={index} className={cssStyle.imageBox}>
                                                            <img alt='' src={item.url}/>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead} onClick={this.changeItemShow.bind(this,4)}>
                                            <img alt='' src={this.themeImgList[style.theme]} className={`${cssStyle.itemHeadIcon} ${showList.indexOf(4) >= 0 ? cssStyle.itemHeadIconShow:''}`}/>
                                            <div className={cssStyle.itemTitle}>项目前期阶段审批</div>
                                        </div>
                                        <Timeline className={cssStyle.timeline} style={{fontSize:compatibleSize.fontSize,display:showList.indexOf(4)<0?'none':''}}>
                                            <Timeline.Item color="green" className={cssStyle.fontColor} >
                                                审批人列表
                                            </Timeline.Item>
                                            {getTimelineList(detail.implementationApproval)}
                                            {getTimelineList(detail.teamApprovalTwo)}
                                            {getTimelineList(detail.businessDepApproval)}
                                        </Timeline>
                                    </div>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead} onClick={this.changeItemShow.bind(this,6)}>
                                            <img alt='' src={this.themeImgList[style.theme]} className={`${cssStyle.itemHeadIcon} ${showList.indexOf(6) >= 0 ? cssStyle.itemHeadIconShow:''}`}/>
                                            <div className={cssStyle.itemTitle}>项目在建阶段审批</div>
                                        </div>
                                        <Timeline className={cssStyle.timeline} style={{fontSize:compatibleSize.fontSize,display:showList.indexOf(6)<0?'none':''}}>
                                            <Timeline.Item color="green" className={cssStyle.fontColor} >
                                                在建阶段审批人员
                                            </Timeline.Item>
                                            {getTimelineList(detail.businessDepApprovalTwo)}
                                        </Timeline>
                                    </div>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead} onClick={this.changeItemShow.bind(this,5)}>
                                            <img alt='' src={this.themeImgList[style.theme]} className={`${cssStyle.itemHeadIcon} ${showList.indexOf(5) >= 0 ? cssStyle.itemHeadIconShow:''}`}/>
                                            <div className={cssStyle.itemTitle}>联系单基本内容</div>
                                        </div>
                                        <div className={cssStyle.tabBox} style={{display:showList.indexOf(5)<0?'none':''}}>
                                            {detail.contactDataList && detail.contactDataList.map((item,index) =>
                                                <div key={index} className={`${cssStyle.tabItem} ${index === this.state.contactDataIndex ? cssStyle.selectedTab:''}`} onClick={changeState.bind(this,'contactDataIndex',index)}>
                                                    <div className={cssStyle.tabName}>{'联系单'+(index+1)}</div>
                                                </div>
                                            )}
                                        </div>
                                        <table className={cssStyle.itemContent} style={{display:showList.indexOf(5)<0?'none':''}}>
                                            {this.getContactData(detail)}
                                        </table>
                                    </div>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead} onClick={this.changeItemShow.bind(this,7)}>
                                            <img alt='' src={this.themeImgList[style.theme]} className={`${cssStyle.itemHeadIcon} ${showList.indexOf(7) >= 0 ? cssStyle.itemHeadIconShow:''}`}/>
                                            <div className={cssStyle.itemTitle}>项目结算阶段审批</div>
                                        </div>
                                        <table className={cssStyle.itemContent} style={{marginBottom: '0.6em',display:showList.indexOf(7)<0?'none':''}}>
                                            <tbody>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>结算申报审批</td>
                                                <td className={cssStyle.tdContent} style={{width:'80%'}}>
                                                    {detail.reportImages && detail.reportImages.map((item,index) =>
                                                        <div key={index} className={cssStyle.imageBox}>
                                                            <img alt='' src={item.url}/>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>审定价确认审批</td>
                                                <td className={cssStyle.tdContent} >
                                                    {detail.confirmImages && detail.confirmImages.map((item,index) =>
                                                        <div key={index} className={cssStyle.imageBox}>
                                                            <img alt='' src={item.url}/>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <Timeline className={cssStyle.timeline} style={{fontSize:compatibleSize.fontSize,display:showList.indexOf(7)<0?'none':''}}>
                                            <Timeline.Item color="green" className={cssStyle.fontColor} >
                                                结束阶段审批人员
                                            </Timeline.Item>
                                            {getTimelineList(detail.businessDepApprovalThree)}
                                        </Timeline>
                                    </div>
                                </Scrollbars>
                            </div>
                        )
                    }}
                </Motion>
            </ComponentBox>
        )
    }
}