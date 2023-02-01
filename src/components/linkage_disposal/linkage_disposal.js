import React from "react";
import ComponentBox from "../component_box";
import {Icon} from "antd";
import axios from "axios";

import cssStyle from "./linkage_disposal.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {getCompatibleSize,} from "../../common/util";
import {Scrollbars} from "react-custom-scrollbars";
import {emergencyUrl} from "../../config";
import Detail from "./detail";
import Progress from "./progress";
import PlanStep from "./planStep";
import GroupPower from "./groupPower";
import EventAdd from "./eventAdd";
import Discuss from "./discuss";
// import OrderEdit from "./orderEdit";
// import AddPower from "./addPower";
import AddOrder from "./addOrder";
import PowerEdit from "./powerEdit";
import Situation from "./situation";

export default class LinkageDisposal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,listType:1,eventList:[],selectedEventId:'',selectedEvent:{},detailShowType:1,detail:{},handingStudy:{},progress:[],planStep:{},handlePower:{leader:[],team:[],depart:[]},showEditContent:''};
        this.getData = getData.bind(this);
        this.keyParams = {type:1};
        this.boxRef = React.createRef();
        this.eventTypeList = [{id:1,name:'未处置'},{id:2,name:'处置中'},{id:3,name:'已结束'}];
        this.detailTypeList = [{id:1,name:'基本信息'},{id:2,name:'处置进度'}];
    }

    //组件加载触发函数
    componentDidMount() {
        // this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
        this.p = new Promise((resolve) => {this.getEventList(this.callBack.bind(this,resolve))});
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.timer){
            clearTimeout(this.timer);
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

    getEventList(callBack){
        const eventListUrl = emergencyUrl + "/socialGovernance/emergencyProcess/getEmergencyEventList";
        // const eventListUrl = "./json/ruian/eventList.json";
        const sendData = {
            type: this.keyParams.type,
            pageNo: 1,
            pageSize: 100,
            rbacToken:this.props.token
        };
        const { style } = this.props.thisData;
        if(style.roadId){
            sendData.roadId = style.roadId;
        }
        axios.get(eventListUrl,{params:sendData}).then((response) => {
            // 在这儿实现 setState
            callBack(response.data.data);
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //获取数据后回调
    callBack(resolve,result){
        if(result){
            const list = result.list;
            if(list.length > 0){
                this.setState({eventList:list,selectedEventId:list[0].emergencyId,selectedEvent:list[0]});
                this.getEventDetail(list[0].emergencyId);
            }
            if(resolve){
                resolve(result);
            }
        }
    }

    //获取事件详情
    getEventDetail(id){
        this.setState({detail:{}});
        const eventDetailUrl = emergencyUrl + "/socialGovernance/emergencyProcess/getEmergencyEventDetail";
        // const eventDetailUrl = "./json/ruian/detail.json";
        axios.get(eventDetailUrl,{params:{emergencyId:id,rbacToken:this.props.token,type:this.state.listType}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                const data = {
                    detail:result.runHanding ? result.runHanding : {},
                    planStep:result.planDetail ? result.planDetail : {},
                    progress:result.processHandles ? result.processHandles : [],
                    handingStudy:result.handingStudy ? result.handingStudy : {},
                    handlePower:{
                        team:result.allTeamList ? result.allTeamList : [],
                        depart:result.basicStationList ? result.basicStationList : [],
                        leader:result.planDetail && result.planDetail.commandersList ? result.planDetail.commandersList : [],
                    },
                };
                this.setState(data);
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
        // axios.get('./json/ruian/planStep.json',{params:{id:id,rbacToken:this.props.token}}).then((response) => {
        //     // 在这儿实现 setState
        //     const result = response.data.data;
        //     if(result){
        //         this.setState({planStep:result})
        //     }
        // }).catch(function(error){
        //     // 处理请求出错的情况
        // });
    }

    //重新获取当前事件详情
    reGetDetail(){
        this.getEventDetail(this.state.selectedEventId);
    }

    //切换事件列表显示
    changeListShow(item,fresh){
        if(item.id !== this.state.listType || fresh){
            this.keyParams.type = item.id;
            this.reGetData();
            this.setState({listType:item.id});
        }
    }

    //点击事件
    changeEventShow(event){
        if(event.emergencyId !== this.state.selectedEventId){
            this.setState({selectedEventId:event.emergencyId,selectedEvent:event});
            this.getEventDetail(event.emergencyId);
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
        this.setState({showSituation:value});
    }

    render() {
        const {style} = this.props.thisData;
        const {listType,eventList,selectedEventId,selectedEvent,handingStudy,detailShowType,detail,progress,planStep,handlePower,showEditContent,showSituation} = this.state;
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
                                            <Scrollbars >
                                                {eventList.map((event,index)=>
                                                    <div
                                                        className={`${cssStyle.eventItem} ${selectedEventId === event.emergencyId ? cssStyle.selectedEvent:''}`}
                                                        key={index} onClick={this.changeEventShow.bind(this,event)}
                                                    >
                                                        <div className={cssStyle.eventTime}>
                                                            {event.incidentTime}
                                                        </div>
                                                        <div className={cssStyle.eventContentBox}>
                                                            <div className={cssStyle.eventTitle}>{event.title}</div>
                                                            <div className={cssStyle.eventContentLine}>
                                                                <div>所属街道</div>
                                                                <div className={cssStyle.blueColor}>{event.roadName}</div>
                                                            </div>
                                                            <div className={cssStyle.eventContentLine}>
                                                                <div>事发地点</div>
                                                                <div className={cssStyle.blueColor}>{event.incidentAddress}</div>
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
                                            <Detail detail={{...detail,...selectedEvent,remark:handingStudy.remark ? handingStudy.remark:detail.incidentRemark}} show={detailShowType === 1} changeEditShow={this.changeEditShow.bind(this,'eventDiscuss')} />
                                            <Progress progress={progress} show={detailShowType === 2} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cssStyle.rightBox}>
                                <div className={cssStyle.contentBox}>
                                    <div className={cssStyle.titleBox}>
                                        应急预案
                                    </div>
                                    {detail.isstart && (
                                        <React.Fragment>
                                            {detail.isEnd !== 1 && (
                                                <React.Fragment>
                                                    <div className={`${cssStyle.addButton} ${cssStyle.situationButton}`} onClick={this.changeSituationShow.bind(this,true)}>
                                                        现场情况
                                                    </div>
                                                    <div className={`${cssStyle.addButton} ${cssStyle.openMeetingButton}`} onClick={this.changeEditShow.bind(this,'openMeeting')}>
                                                        <Icon type="plus" className={cssStyle.addIcon}/>开启会议
                                                    </div>
                                                    <div className={`${cssStyle.addButton} ${cssStyle.addOrderButton}`} onClick={this.changeEditShow.bind(this,'addOrder')}>
                                                        <Icon type="plus" className={cssStyle.addIcon}/>下达指令
                                                    </div>
                                                    <div className={`${cssStyle.addButton} ${cssStyle.addPowerButton}`} onClick={this.changeEditShow.bind(this,'powerEdit')}>
                                                        <Icon type="plus" className={cssStyle.addIcon}/>增派力量
                                                    </div>
                                                </React.Fragment>
                                            )}
                                            <PlanStep token={this.props.token} isEnd={detail.isEnd} emergencyId={selectedEventId} changeListShow={this.changeListShow.bind(this)} reGetDetail={this.reGetDetail.bind(this)} createTime={handingStudy.createTime} endTime={handingStudy.endTime} planStep={planStep} planName={detail.planName} />
                                            <GroupPower handlePower={handlePower} />
                                        </React.Fragment>
                                    )}
                                </div>

                                <EventAdd roadId={style.roadId} token={this.props.token} show={showEditContent === 'eventAdd'} changeListShow={this.changeListShow.bind(this)} changeEditShow={this.changeEditShow.bind(this,'')} />
                                <Discuss token={this.props.token} emergencyId={selectedEventId} detail={detail} show={showEditContent === 'eventDiscuss'} changeListShow={this.changeListShow.bind(this)} reGetDetail={this.reGetDetail.bind(this)} changeEditShow={this.changeEditShow.bind(this,'')} />
                                <AddOrder emergencyId={selectedEventId} token={this.props.token} show={showEditContent === 'addOrder'} reGetDetail={this.reGetDetail.bind(this)} changeEditShow={this.changeEditShow.bind(this,'')} />
                                <AddOrder emergencyId={selectedEventId} token={this.props.token} contentType='openMeeting' show={showEditContent === 'openMeeting'} reGetDetail={this.reGetDetail.bind(this)} changeEditShow={this.changeEditShow.bind(this,'')} />
                                <PowerEdit emergencyId={selectedEventId} token={this.props.token} show={showEditContent === 'powerEdit'} reGetDetail={this.reGetDetail.bind(this)} changeEditShow={this.changeEditShow.bind(this,'')} />
                            </div>
                            {detail && detail.id && <Situation detailId={detail.id} detail={detail} handingStudy={handingStudy} token={this.props.token} show={showSituation} hideSituation={this.changeSituationShow.bind(this,false)}/>}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}