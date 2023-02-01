import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Icon, Input, Select, Button, Modal, TreeSelect} from "antd";
import axios from "axios";
import PeopleSelect from "./peopleSelect";

const { TextArea } = Input;
const { TreeNode } = TreeSelect;

export default class Discuss extends React.Component {
    constructor(props) {
        super(props);
        this.state = {detail:{plan:[]},roadList:[],subTypeList:[],planList:[],loading:false,contentType:1,showPeople:false,peopleType:1,dominators:[],participators:[]};
    }

    //组件加载触发函数
    componentDidMount() {
        const roadListUrl = this.props.emergencyUrl + "/socialGovernance/common/getRoadList";
        axios.get(roadListUrl,{params:{rbacToken:this.props.token,type:7}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({roadList:result})
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
        const {roadId,eventTypeList} = this.props.detail;
        detail.roadId = roadId;
        detail.eventType = eventTypeList ? eventTypeList.map((item)=>{return item.eventType}):[];
        detail.plan = undefined;
        detail.remark = '';
        detail.judgedEventContent = '';
        detail.analysisProcedure = '';
        detail.finalDecision = '';
        this.setState({detail,peopleType:1,contentType:1,dominators:[],participators:[]},()=>{
            this.getPlanList();
        });
        this.getTypeList();
    }

    getTypeList(){
        let {detail} = this.props;
        const eventTypeListUrl = this.props.emergencyUrl + "/socialGovernance/warningConfig/queryKeywordOrEventTypeList";
        axios.get(eventTypeListUrl,{params:{rbacToken:this.props.token,level:1,type:1,eventSourceType:detail.eventSourceCode}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({subTypeList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    dataEdit(type,key,event){
        let {detail} = this.state;
        detail[key] = type === 1 ? event.target.value : event;
        if(key === 'eventType' || key === 'roadId'){
            detail.plan = '';
            this.setState({detail},()=>{
                this.getPlanList();
            });
        }else{
            this.setState({detail});
        }
    }

    getPlanList(){
        const {roadId,eventType} = this.state.detail;
        const planListUrl = this.props.emergencyUrl + "/socialGovernance/emergencyPlan/queryPlanList";
        axios.get(planListUrl,{params:{roadId,eventTypeList:eventType.join(','),rbacToken:this.props.token}}).then((response) => {
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
        const {dominators,participators} = this.state;
        const {roadId,eventType,plan,remark,judgedEventContent,analysisProcedure,finalDecision} = this.state.detail;
        const sendData = {
            rbacToken:this.props.token,
            eventId:this.props.emergencyId,
            roadId,
            eventTypeList:eventType,
            planId:plan,
            remark,
            judgedEventContent,
            analysisProcedure,
            finalDecision,
            dominators:dominators.map((item)=>{return item.id}),
            participators:participators.map((item)=>{return item.id})
        };
        // console.log(sendData)
        axios.post(this.props.emergencyUrl+"/socialGovernance/commandDispatch/analysisAndJudge", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: '研判完成。',
                });
                this.props.changeEditShow();
                this.setState({detail:{plan:[]}});
                this.props.changeListShow({id:3,name:'处置中'},true);
            }else{
                Modal.error({
                    content: response.data.message,
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

    changeContentShow(type){
        this.setState({contentType:type});
    }

    changePeopleSelectShow(flag,peopleType){
        if(peopleType){
            this.setState({showPeople:flag,peopleType});
        }else{
            this.setState({showPeople:flag});
        }
    }

    changePeopleSelect(peopleList){
        const {peopleType} = this.state;
        if(peopleType === 1){
            this.setState({dominators:peopleList,showPeople:false});
        }else{
            this.setState({participators:peopleList,showPeople:false});
        }
    }

    getTreeNode(list){
        if(list){
            return list.map((item)=>{
                if(item.children && Array.isArray(item.children) && item.children.length > 0){
                    return (
                        <TreeNode value={item.id} key={item.id} title={item.name} selectable={false}>
                            {this.getTreeNode(item.children)}
                        </TreeNode>
                    );
                }else{
                    return <TreeNode value={item.id} key={item.id} title={item.name}/>
                }
            });
        }else{
            return null;
        }
    }

    render() {
        const {show,changeEditShow,token} = this.props;
        const {detail,roadList,subTypeList,planList,loading,showPeople,contentType,peopleType,dominators,participators} = this.state;
        return (
            <Motion style={{opacity:spring(show ? 1 : 0)}}>
                {({opacity}) =>
                    <div style={{opacity,zIndex:show?1:-1}} className={cssStyle.eventDiscussBox}>
                        {contentType === 1 ? (
                            <>
                                <div className={cssStyle.editHeadBox}>
                                    <div className={cssStyle.headName}>分析研判</div>
                                    <Icon type="close" className={cssStyle.closeIcon} onClick={changeEditShow}/>
                                </div>
                                <div className={cssStyle.eventAddRow}>
                                    <div className={cssStyle.addRowTitle}>主持人</div>
                                    <div className={cssStyle.addRowSelectPeople} onClick={this.changePeopleSelectShow.bind(this,true,1)}>
                                        {dominators && dominators.length > 0 ? dominators.map((item,index)=>
                                            <span key={index}>{item.name}{index < dominators.length-1 && ','}</span>
                                        ):'点击选择人员'}
                                    </div>
                                </div>
                                <div className={cssStyle.eventAddRow}>
                                    <div className={cssStyle.addRowTitle}>参与人员</div>
                                    <div className={cssStyle.addRowSelectPeople} onClick={this.changePeopleSelectShow.bind(this,true,2)}>
                                        {participators && participators.length > 0 ? participators.map((item,index)=>
                                            <span key={index}>{item.name}{index < participators.length-1 && ','}</span>
                                        ):'点击选择人员'}
                                    </div>
                                </div>
                                <div className={cssStyle.eventAddRow}>
                                    <div className={cssStyle.addRowTitle}>事件内容</div>
                                    <TextArea value={detail.judgedEventContent} onChange={this.dataEdit.bind(this, 1, 'judgedEventContent')} className={cssStyle.addRowTextArea}/>
                                </div>
                                <div className={cssStyle.eventAddRow}>
                                    <div className={cssStyle.addRowTitle}>分析过程</div>
                                    <TextArea value={detail.analysisProcedure} onChange={this.dataEdit.bind(this, 1, 'analysisProcedure')} className={cssStyle.addRowTextArea}/>
                                </div>
                                <div className={cssStyle.eventAddRow}>
                                    <div className={cssStyle.addRowTitle}>最终决策</div>
                                    <TextArea value={detail.finalDecision} onChange={this.dataEdit.bind(this, 1, 'finalDecision')} className={cssStyle.addRowTextArea}/>
                                </div>
                                <div className={cssStyle.editFootBox}>
                                    <Button onClick={changeEditShow}>取消</Button>
                                    <Button type="primary" onClick={this.changeContentShow.bind(this,2)} >预案选择</Button>
                                </div>
                            </>
                        ):(
                            <>
                                <div className={cssStyle.editHeadBox}>
                                    <div className={cssStyle.headName}>预案选择</div>
                                    <Icon type="close" className={cssStyle.closeIcon} onClick={changeEditShow}/>
                                </div>
                                <div className={cssStyle.eventAddRow}>
                                    <div className={cssStyle.addRowTitle}>所属街道</div>
                                    <Select value={detail.roadId} onChange={this.dataEdit.bind(this, 2, 'roadId')} className={cssStyle.addRowContent}>
                                        {roadList.map((subType,index)=>
                                            <Select.Option value={subType.id} key={index}>{subType.name}</Select.Option>
                                        )}
                                    </Select>
                                </div>
                                <div className={cssStyle.eventAddRow}>
                                    <div className={cssStyle.addRowTitle}>事件类型</div>
                                    {/*<Select mode="multiple" value={detail.eventType} onChange={this.dataEdit.bind(this, 2, 'eventType')} className={cssStyle.addRowContent}>*/}
                                    {/*    {subTypeList.map((subType,index)=>*/}
                                    {/*        <Select.Option value={subType.code} key={index}>{subType.value}</Select.Option>*/}
                                    {/*    )}*/}
                                    {/*</Select>*/}
                                    <TreeSelect
                                        value={detail.eventType}
                                        allowClear
                                        onChange={this.dataEdit.bind(this, 2, 'eventType')}
                                        className={cssStyle.addRowContent}
                                        multiple={true}
                                    >
                                        {this.getTreeNode(subTypeList)}
                                    </TreeSelect>
                                </div>
                                <div className={cssStyle.eventAddRow}>
                                    <div className={cssStyle.addRowTitle}>应急预案</div>
                                    <Select value={detail.plan} onChange={this.dataEdit.bind(this, 2, 'plan')} className={cssStyle.addRowContent}>
                                        {planList.map((plan,index)=>
                                            <Select.Option value={plan.id} key={index}>{plan.planName}</Select.Option>
                                        )}
                                    </Select>
                                </div>
                                <div className={cssStyle.eventAddRow}>
                                    <div className={cssStyle.addRowTitle}>备注</div>
                                    <TextArea value={detail.remark} onChange={this.dataEdit.bind(this, 1, 'remark')} className={cssStyle.addRowTextArea}/>
                                </div>
                                <div className={cssStyle.editFootBox}>
                                    <Button onClick={this.changeContentShow.bind(this,1)} >上一步</Button>
                                    <Button type="primary" onClick={this.discussEvent.bind(this)} loading={loading} >确定</Button>
                                </div>
                            </>
                        )}
                        <PeopleSelect showPeople={showPeople} token={token} selectedPeople={peopleType === 1 ? dominators:participators} changePeopleSelectShow={this.changePeopleSelectShow.bind(this,false)} changePeopleSelect={this.changePeopleSelect.bind(this)} emergencyUrl={this.props.emergencyUrl} />
                    </div>
                }
            </Motion>
        );
    }
}