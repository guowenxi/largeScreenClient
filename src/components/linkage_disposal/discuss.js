import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Icon, Input, Select, Button, Modal} from "antd";
import axios from "axios";
import {emergencyUrl} from "../../config";

export default class Discuss extends React.Component {
    constructor(props) {
        super(props);
        this.state = {detail:{},subTypeList:[],planList:[],loading:false};
    }

    //组件加载触发函数
    componentDidMount() {
        const eventTypeListUrl = emergencyUrl + "/socialGovernance/statistics/getTypeList";
        // const eventTypeListUrl = "./json/ruian/eventTypeList.json";
        axios.get(eventTypeListUrl,{params:{rbacToken:this.props.token,type:7}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({subTypeList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.detail.id !== this.props.detail.id){
            //组件数据源变更时刷新数据
            this.initDefault();
        }
    }

    initDefault(){
        let {detail} = this.state;
        const {eventType,warningLevel,incidentAddress,x,y,influence,incidentRemark} = this.props.detail;
        detail.subType = eventType;
        if(detail.subType){
            this.getPlanList(detail.subType);
        }
        detail.level = warningLevel;
        detail.studyAddress = incidentAddress;
        detail.studyLng = x;
        detail.studyLat = y;
        detail.influence = influence;
        detail.remark = incidentRemark;
        this.setState({detail});
    }

    dataEdit(type,key,event){
        let {detail} = this.state;
        detail[key] = type === 1 ? event.target.value : event;
        if(key === 'subType'){
            this.getPlanList(detail[key]);
            detail.plan = '';
        }
        this.setState({detail});
    }

    getPlanList(id){
        const planListUrl = emergencyUrl + "/socialGovernance/emergencyPlans/getListByCondition";
        // const planListUrl = "./json/ruian/planList.json";
        axios.get(planListUrl,{params:{planType:id,rbacToken:this.props.token}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({planList:result});
            }else{
                this.setState({planList:[]});
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    discussEvent(){
        this.setState({loading:true});
        const {detail} = this.state;
        const handingStudy = {
            joinNum:detail.peopleNum,
            // eventType:detail.character,
            eventType:detail.subType,
            warningLevel:detail.level,
            influence:detail.influence,
            remark:detail.remark,
            studyAddress:detail.studyAddress,
            studyLng:detail.studyLng,
            studyLat:detail.studyLat,
            isPlat:3
        };
        const sendData = {
            handingStudy,
            rbacToken:this.props.token,
            planId:detail.plan,
            emergencyId:this.props.emergencyId,
            operationType:101,
        };
        // console.log(sendData);
        axios.post(emergencyUrl+"/socialGovernance/emergencyProcess/emergencyOperate", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: '研判完成。',
                });
                this.props.changeEditShow();
                this.setState({detail:{}});
                // this.props.reGetDetail();
                this.props.changeListShow({id:2,name:'处置中'},true);
            }else{
                Modal.error({
                    content: response.data.data,
                });
            }
            this.setState({loading:false});
        }).catch( (error) => {
            Modal.error({
                content: '请求出错！',
            });
            console.log(error);
            this.setState({loading:false});
        });
    }

    render() {
        const {show,changeEditShow} = this.props;
        const {detail,subTypeList,planList,loading} = this.state;
        return (
            <Motion style={{opacity:spring(show ? 1 : 0)}}>
                {({opacity}) =>
                    <div style={{opacity,zIndex:show?1:-1}} className={cssStyle.eventDiscussBox}>
                        <div className={cssStyle.editHeadBox}>
                            <div>研判分析</div>
                            <Icon type="close" className={cssStyle.closeIcon} onClick={changeEditShow}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>人员数量</div>
                            <Input value={detail.peopleNum} onChange={this.dataEdit.bind(this, 1, 'peopleNum')} className={cssStyle.addRowContent}/>
                        </div>
                        {/*<div className={cssStyle.eventAddRow}>*/}
                        {/*    <div className={cssStyle.addRowTitle}>事件性质</div>*/}
                        {/*    <Input value={detail.character} onChange={this.dataEdit.bind(this, 1, 'character')} className={cssStyle.addRowContent}/>*/}
                        {/*</div>*/}
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>适用类型</div>
                            <Select value={detail.subType} onChange={this.dataEdit.bind(this, 2, 'subType')} className={cssStyle.addRowContent}>
                                {subTypeList.map((subType,index)=>
                                    <Select.Option value={subType.id} key={index}>{subType.name}</Select.Option>
                                )}
                            </Select>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>事件等级</div>
                            <Select value={detail.level} onChange={this.dataEdit.bind(this, 2, 'level')} className={cssStyle.addRowContent}>
                                <Select.Option value={1}>特大</Select.Option>
                                <Select.Option value={2}>重大</Select.Option>
                                <Select.Option value={3}>较大</Select.Option>
                                <Select.Option value={4}>一般</Select.Option>
                            </Select>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>影响范围</div>
                            <Input value={detail.influence} onChange={this.dataEdit.bind(this, 1, 'influence')} className={cssStyle.addRowContent}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>备注</div>
                            <Input value={detail.remark} onChange={this.dataEdit.bind(this, 1, 'remark')} className={cssStyle.addRowContent}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>应急预案</div>
                            <Select value={detail.plan} onChange={this.dataEdit.bind(this, 2, 'plan')} className={cssStyle.addRowContent}>
                                {planList.map((plan,index)=>
                                    <Select.Option value={plan.id} key={index}>{plan.planName}</Select.Option>
                                )}
                            </Select>
                        </div>

                        <div className={cssStyle.editFootBox}>
                            <Button onClick={changeEditShow}>取消</Button>
                            <Button type="primary" onClick={this.discussEvent.bind(this)} loading={loading} >确定</Button>
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}