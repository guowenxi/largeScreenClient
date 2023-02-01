import React from "react";
import ComponentBox from "../component_box";
import {Icon} from "antd";
import axios from "axios";

import cssStyle from "./linkage_disposal.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {getCompatibleSize,} from "../../common/util";
import {Scrollbars} from "react-custom-scrollbars";
import Detail from "./detail";
import Progress from "./progress";
import PlanStep from "./planStep";
import GroupPower from "./groupPower";
import EventAdd from "./eventAdd";
import Discuss from "./discuss";
import AddOrder from "./addOrder";
import PowerEdit from "./powerEdit";
import Situation from "./situation";
import EndEvent from "./endEvent";
import FollowEdit from "./followEdit";

export default class LinkageDisposal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,listType:2,allDepList:[],eventList:[],selectedEventId:'',selectedEvent:{},detailShowType:1,detail:{},handingStudy:{},progress:[],planStep:{},handlePower:{leader:[],team:[],depart:[]},showEditContent:''};
        this.getData = getData.bind(this);
        this.keyParams = {eventState:2,platform:6};
        this.boxRef = React.createRef();
        this.eventTypeList = [{id:2,name:'未处置'},{id:3,name:'处置中'},{id:4,name:'已结束'}];
        this.detailTypeList = [{id:1,name:'基本信息'},{id:2,name:'处置进度'}];
    }

    //组件加载触发函数
    componentDidMount() {
        // this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
        this.p = new Promise((resolve) => {this.getEventList(this.callBack.bind(this,resolve))});
        if(this.props.firstLoad === false){
            this.animateOn();
        }
        this.getAllDepList();
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.timer){
            clearTimeout(this.timer);
        }
        if(this.freshDetailTimer){
            clearTimeout(this.freshDetailTimer);
        }
        if(this.freshEventListTimer){
            clearTimeout(this.freshEventListTimer);
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey" :
                for(let key in data.data){
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "showComponent":
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.p.then(() => {
            this.setState({opacity:1});
        })
    }

    //重新获取数据
    reGetData(){
        this.setState({eventList:[]});
        this.getEventList(this.callBack.bind(this,''));
    }

    getAllDepList(){
        const { style } = this.props.thisData;
        const allDepListUrl = style.emergencyUrl + '/socialGovernance/common/getDepartmentUserTree';
        axios.get(allDepListUrl, { params: { rbacToken: this.props.token } }).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if (result) {
                this.setState({ allDepList:result });
            }
        }).catch(function (error) {
            // 处理请求出错的情况
        });
    }

    getEventList(callBack){
        const { style } = this.props.thisData;
        const eventListUrl = style.emergencyUrl + "/socialGovernance/commandDispatch/queryEventPage";
        // const eventListUrl = "./json/ruian/eventList.json";
        const sendData = {
            eventState: this.keyParams.eventState,
            pageNo: 1,
            pageSize: 100,
            rbacToken:this.props.token
        };
        if(style.roadId){
            sendData.roadId = style.roadId;
        }
        axios.get(eventListUrl,{params:sendData}).then((response) => {
            // 在这儿实现 setState
            if(callBack != null){
                callBack(response.data.data);
            }
            this.freshEventList();
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //列表获取数据后回调
    callBack(resolve,result){
        if(resolve){
            resolve(result);
        }
        if(result){
            const list = result.data;
            if(list.length > 0){
                this.setState({eventList:list,selectedEventId:list[0].id,selectedEvent:list[0],showEditContent:''});
                this.getEventDetail(list[0].id);
            }else{
                this.setState({eventList:[],selectedEventId:'',selectedEvent:{},detailShowType:1,detail:{},handingStudy:{},progress:[],planStep:{},handlePower:{leader:[],team:[],depart:[]},showEditContent:''});
            }
        }
    }

    //获取事件详情
    getEventDetail(id,isReGet){
        if(!isReGet){
            this.setState({detail:{}});
        }
        const { style } = this.props.thisData;
        let eventDetailUrl;
        if(this.keyParams.eventState > 2){
            eventDetailUrl = style.emergencyUrl + "/socialGovernance/commandDispatch/getJudgeEventDetail/"+id;
        }else{
            eventDetailUrl = style.emergencyUrl + "/socialGovernance/commandDispatch/getEventDetail/"+id;
        }
        axios.get(eventDetailUrl,{params:{rbacToken:this.props.token}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                const data = {
                    getDataTime:new Date().getTime(),
                    detail:result,
                    planStep:result.planFlowRoot ? result.planFlowRoot : {},
                    progress:result.eventHandleList ? result.eventHandleList : [],
                    handingStudy:result.handingStudy ? result.handingStudy : {},
                    handlePower:{
                        followUpFeedbackUserList:result.followUpFeedbackUserList ? result.followUpFeedbackUserList : [],
                        helpDepartmentUserList:result.helpDepartmentUserList ? result.helpDepartmentUserList : [],
                        meetingRecords:result.meetingRecords ? result.meetingRecords : [],
                        team:result.completable+'' === '1' || result.eventState > 3 ? (result.planFlowTeamList ? result.planFlowTeamList : []):(result.currentTeamList ? result.currentTeamList : []),
                        helpTeamUserList:result.helpTeamUserList ? result.helpTeamUserList : [],
                        depart:result.currentStationDutyUser ? [result.currentStationDutyUser] : [],
                        helpStationDutyUserList:result.helpStationDutyUserList ? result.helpStationDutyUserList : [],
                        leader:[result.planFlowCommander,result.planFlowLeader,result.planFlowDeputy],
                    },
                };
                this.setState(data);
                this.freshDetail();
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
        if(this.keyParams.eventState > 2){
            axios.get(style.emergencyUrl + "/socialGovernance/commandDispatch/getUnreadEventHandleFeedbackCount/"+id,{params:{rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if(result != null){
                    this.setState({messageNum:result})
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    freshDetail(){
        if(this.freshDetailTimer){
            clearTimeout(this.freshDetailTimer);
        }
        const {style} = this.props.thisData;
        this.freshDetailTimer = setTimeout(()=>{
            if(this.props.thisData.showStatus && this.state.selectedEventId){
                this.reGetDetail();
            }else{
                this.freshDetail();
            }
        },style.detailTime ? style.detailTime : 5000);
    }

    freshEventList(){
        if(this.freshEventListTimer){
            clearTimeout(this.freshEventListTimer);
        }
        const {style} = this.props.thisData;
        this.freshEventListTimer = setTimeout(()=>{
            if(this.props.thisData.showStatus){
                this.getEventList(null);
            }else{
                this.freshEventList();
            }
        },style.listTime ? style.listTime : 5000);
    }

    //重新获取当前事件详情
    reGetDetail(){
        this.getEventDetail(this.state.selectedEventId,true);
    }

    //切换事件列表显示
    changeListShow(item,fresh){
        if(item.id !== this.state.listType || fresh){
            this.keyParams.eventState = item.id;
            this.reGetData();
            this.setState({listType:item.id,showEditContent:''});
        }
    }

    //点击事件
    changeEventShow(event){
        if(event.id !== this.state.selectedEventId){
            this.setState({selectedEventId:event.id,selectedEvent:event,showEditContent:''});
            this.getEventDetail(event.id);
        }
    }

    //详情显示内容切换
    changeDetailShow(item){
        if(item.id !== this.state.detailShowType){
            this.setState({detailShowType:item.id});
        }
    }

    changeEditShow(value){
        this.setState({showEditContent:value});
    }

    changeSituationShow(value){
        this.setState({showSituation:value,messageNum:0});
        if(!value){
            //关闭现场情况时 刷新详情内容
            this.reGetDetail();
        }
    }

    render() {
        const {style} = this.props.thisData;
        const {listType,eventList,selectedEventId,selectedEvent,handingStudy,detailShowType,detail,progress,planStep,handlePower,showEditContent,showSituation,getDataTime,messageNum,allDepList} = this.state;
        const fontSize = getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize}} >
                            <div className={cssStyle.leftBox}>
                                <div className={cssStyle.contentBox}>
                                    <div className={cssStyle.listBox}>
                                        <div className={cssStyle.titleBox}>
                                            处置事件列表
                                        </div>
                                        <div className={cssStyle.addButton} onClick={this.changeEditShow.bind(this,'eventAdd')}>
                                            <Icon type="plus" className={cssStyle.addIcon}/>事件新增
                                        </div>
                                        <div className={cssStyle.buttonListBox}>
                                            {this.eventTypeList.map((item,index)=>
                                                <div
                                                    key={index} onClick={this.changeListShow.bind(this,item)}
                                                    className={`${cssStyle.changeButton} ${listType === item.id ? cssStyle.changeButtonSelected:''}`}
                                                >
                                                    {item.name}
                                                </div>
                                            )}
                                        </div>
                                        <div className={cssStyle.eventListBox}>
                                            <Scrollbars className={'blueScrollbars'} >
                                                {eventList.map((event,index)=>
                                                    <div
                                                        className={`${cssStyle.eventItem} ${selectedEventId === event.id ? cssStyle.selectedEvent:''}`}
                                                        key={index} onClick={this.changeEventShow.bind(this,event)}
                                                    >
                                                        <div className={cssStyle.eventTime}>
                                                            {event.eventDate}
                                                        </div>
                                                        <div className={cssStyle.eventContentBox}>
                                                            <div className={cssStyle.eventTitle}>{event.eventTitle}</div>
                                                            <div className={cssStyle.eventContentLine}>
                                                                <div>所属街道</div>
                                                                <div className={cssStyle.blueColor}>{event.roadName}</div>
                                                            </div>
                                                            <div className={cssStyle.eventContentLine}>
                                                                <div>事发地点</div>
                                                                <div className={cssStyle.blueColor}>{event.eventLocation}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Scrollbars>
                                        </div>
                                    </div>
                                    <div className={cssStyle.detailBox}>
                                        <div className={`${cssStyle.buttonListBox} ${cssStyle.detailChangeBox}`}>
                                            {this.detailTypeList.map((item,index)=>
                                                <div
                                                    key={index} onClick={this.changeDetailShow.bind(this,item)}
                                                    className={`${cssStyle.changeButton} ${detailShowType === item.id ? cssStyle.changeButtonSelected:''}`}
                                                >
                                                    {item.name}
                                                </div>
                                            )}
                                        </div>
                                        <div className={cssStyle.detailContentBox}>
                                            <Detail detail={{...selectedEvent,...detail,remark:handingStudy.remark ? handingStudy.remark:detail.incidentRemark}} show={detailShowType === 1} changeEditShow={this.changeEditShow.bind(this,'eventDiscuss')} />
                                            <Progress emergencyFileUrl={style.emergencyFileUrl} progress={progress} show={detailShowType === 2} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cssStyle.rightBoxLeft} />
                            <div className={cssStyle.rightBoxRight} >
                                <div>
                                    <div className={cssStyle.titleBox}>
                                        处置力量
                                    </div>
                                </div>
                            </div>
                            <div className={cssStyle.rightBox}>
                                <div className={cssStyle.contentBox}>
                                    <div className={cssStyle.titleBox}>
                                        应急预案
                                    </div>
                                    {detail.eventState > 2 && (
                                        <React.Fragment>
                                            <div className={cssStyle.editButtonBox}>
                                                {detail.eventState >= 4 && detail.canFollowUp+'' === '1' && detail.latestFollowUpFeedback == null && (
                                                    <div className={`${cssStyle.addButton} ${cssStyle.openMeetingButton}`} onClick={this.changeEditShow.bind(this,'followEdit')}>
                                                        <Icon type="plus" className={cssStyle.addIcon}/>后续跟踪
                                                    </div>
                                                )}
                                                {detail.eventState < 4 && (
                                                    <React.Fragment>
                                                        {detail.completable+'' === '1' && (
                                                            <div className={`${cssStyle.addButton} ${cssStyle.endButton}`} onClick={this.changeEditShow.bind(this,'endEvent')}>
                                                                事件办结
                                                            </div>
                                                        )}
                                                        {detail.commandable+'' === '1' && (
                                                            <div className={`${cssStyle.addButton} ${cssStyle.addOrderButton}`} onClick={this.changeEditShow.bind(this,'addOrder')}>
                                                                <Icon type="plus" className={cssStyle.addIcon}/>下达指令
                                                            </div>
                                                        )}
                                                        <div className={`${cssStyle.addButton} ${cssStyle.addPowerButton}`} onClick={this.changeEditShow.bind(this,'powerEdit')}>
                                                            <Icon type="plus" className={cssStyle.addIcon}/>增派力量
                                                        </div>
                                                        <div className={`${cssStyle.addButton} ${cssStyle.openMeetingButton}`} onClick={this.changeEditShow.bind(this,'openMeeting')}>
                                                            <Icon type="plus" className={cssStyle.addIcon}/>开启会议
                                                        </div>
                                                    </React.Fragment>
                                                )}
                                                <div className={`${cssStyle.addButton} ${cssStyle.situationButton}`} onClick={this.changeSituationShow.bind(this,true)}>
                                                    <span>现场情况</span>
                                                    {!showSituation && messageNum > 0 && <div className={cssStyle.pointNum}>{messageNum}</div>}
                                                </div>
                                            </div>
                                            <PlanStep emergencyUrl={style.emergencyUrl} emergencyFileUrl={style.emergencyFileUrl} token={this.props.token} isEnd={detail.eventState >= 4} emergencyId={selectedEventId} changeListShow={this.changeListShow.bind(this)} reGetDetail={this.reGetDetail.bind(this)} createTime={detail.eventDate} endTime={detail.completeTime} planStep={planStep} planName={detail.planName} flowFileId={detail.flowFileId} />
                                            <GroupPower emergencyFileUrl={style.emergencyFileUrl} getDataTime={getDataTime} handlePower={handlePower} completeRemark={detail.completeRemark} latestFollowUpFeedback={detail.latestFollowUpFeedback} />
                                        </React.Fragment>
                                    )}
                                </div>

                                <FollowEdit emergencyFileUrl={style.emergencyFileUrl} emergencyUrl={style.emergencyUrl} roadId={style.roadId} token={this.props.token} emergencyId={selectedEventId} show={showEditContent === 'followEdit'} changeListShow={this.changeListShow.bind(this)} changeEditShow={this.changeEditShow.bind(this,'')} reGetDetail={this.reGetDetail.bind(this)} />
                                <EventAdd emergencyUrl={style.emergencyUrl} roadId={style.roadId} token={this.props.token} show={showEditContent === 'eventAdd'} changeListShow={this.changeListShow.bind(this)} changeEditShow={this.changeEditShow.bind(this,'')} />
                                <Discuss emergencyUrl={style.emergencyUrl} token={this.props.token} emergencyId={selectedEventId} detail={detail} show={showEditContent === 'eventDiscuss'} changeListShow={this.changeListShow.bind(this)} reGetDetail={this.reGetDetail.bind(this)} changeEditShow={this.changeEditShow.bind(this,'')} />
                                <AddOrder allDepList={allDepList} emergencyUrl={style.emergencyUrl} detail={detail} emergencyId={selectedEventId} token={this.props.token} show={showEditContent === 'addOrder'} reGetDetail={this.reGetDetail.bind(this)} changeEditShow={this.changeEditShow.bind(this,'')} />
                                <AddOrder allDepList={allDepList} dingtalkUrl={style.dingtalkUrl} meetingUrl={style.meetingUrl} emergencyUrl={style.emergencyUrl} detail={detail} emergencyId={selectedEventId} token={this.props.token} contentType='openMeeting' show={showEditContent === 'openMeeting'} reGetDetail={this.reGetDetail.bind(this)} changeEditShow={this.changeEditShow.bind(this,'')} />
                                <PowerEdit allDepList={allDepList} emergencyUrl={style.emergencyUrl} emergencyId={selectedEventId} token={this.props.token} show={showEditContent === 'powerEdit'} reGetDetail={this.reGetDetail.bind(this)} changeEditShow={this.changeEditShow.bind(this,'')} />
                                <EndEvent emergencyUrl={style.emergencyUrl} token={this.props.token} emergencyId={selectedEventId} show={showEditContent === 'endEvent'} changeListShow={this.changeListShow.bind(this)} changeEditShow={this.changeEditShow.bind(this,'')} />
                            </div>
                            {detail && detail.eventId && <Situation emergencyFileUrl={style.emergencyFileUrl} emergencyUrl={style.emergencyUrl} detailId={detail.id} detail={detail} handingStudy={detail} token={this.props.token} show={showSituation} hideSituation={this.changeSituationShow.bind(this,false)}/>}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}