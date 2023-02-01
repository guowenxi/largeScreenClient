import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Checkbox, Icon, Input, Button, Modal} from "antd";
import axios from "axios";
import {emergencyUrl} from "../../config";
import {Scrollbars} from "react-custom-scrollbars";

const { TextArea } = Input;
const { confirm } = Modal;

export default class AddOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {teamList:[],departList:[],selectedList:[],groupShowType:1,content:'',loading:false};
        this.groupTypeList = [{id:1,name:'应急小组'},{id:2,name:'基层站所'}];
    }

    //组件加载触发函数
    componentDidMount() {
    }


    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.show !== this.props.show && this.props.show){
            //组件数据源变更时刷新数据
            this.initGroupData();
        }
    }

    initList(list){
        list.forEach(item => {
            item.checkedAll = false;
            item.indeterminate = false;
            if(item.allMemberList){
                item.allMemberList.forEach(peopleItem => {
                    peopleItem.checked = false;
                });
            }
        });
    }

    initGroupData(){
        this.setState({selectedList:[],groupShowType:1,content:''});
        const groupListUrl = emergencyUrl + '/socialGovernance/emergencyProcess/getRunTeamAndStation';
        // const groupListUrl = './json/ruian/teamList.json';
        axios.get(groupListUrl, { params: { rbacToken: this.props.token,type:1,emergencyId:this.props.emergencyId} }).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if (result) {
                const teamList = result.allTeamList ? result.allTeamList : [];
                this.initList(teamList);
                const departList = result.basicStationList ? result.basicStationList : [];
                this.initList(teamList);
                this.setState({ teamList, departList });
            }
        }).catch(function (error) {
            // 处理请求出错的情况
        });
    }

    //详情显示内容切换
    changeDetailShow(item){
        if(item.id !== this.state.groupShowType){
            this.setState({groupShowType:item.id});
        }
    }

    onChangeText(event){
        this.setState({content:event.target.value});
    }

    getSelectedList(list,type){
        let returnList = [];
        list.forEach((item)=>{
            if((item.checkAll || item.indeterminate) && item.allMemberList && item.allMemberList.length > 0){
                let ids = [];
                item.allMemberList.forEach((people)=>{
                    if(people.checked){
                        if(type === 1){
                            ids.push(people.teamUserId);
                        }else{
                            ids.push(people.userId);
                        }
                    }
                });
                if(type === 1){
                    returnList.push({
                        teamId:item.id,
                        peopleIds:ids.join(',')
                    });
                }else{
                    returnList.push({
                        stationId:item.id,
                        peopleIds:ids.join(',')
                    });
                }
            }
        });
        return returnList;
    }

    determineAction(){
        if(this.props.contentType === 'openMeeting'){
            this.openMeeting();
        }else{
            this.sendOrder();
        }
    }

    openMeeting(){
        confirm({
            title: '确定要开启会议吗？',
            content: '注：需开启浙政钉并登陆，否则无法开启会议！',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const selectedIds = this.state.selectedList.map((people)=>{return people.empAccountId});
                const sendData = {
                    rbacToken:this.props.token,
                    empAccountIds:selectedIds.join(',')
                };
                return new Promise((resolve) => {
                    axios.post(emergencyUrl+"/socialGovernance/collaboration/saveMeetingMessage",sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            const meetingUrl = 'https://shzl.ruian.gov.cn:8000/zwddPC?id='+response.data.data;
                            window.location.href = 'dingtalkgov://dingtalkclient/page/link?url='+encodeURIComponent(meetingUrl)+'&pc_slide=true';
                            this.props.changeEditShow();
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch( (error) => {
                        resolve();
                        Modal.error({
                            content: '开启会议请求出错！',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    sendOrder(){
        this.setState({loading:true});
        const {teamList,departList,content} = this.state;
        const {emergencyId} = this.props;
        const runProcessTaskTeam = this.getSelectedList(teamList,1);
        const runProcessTaskStation = this.getSelectedList(departList,2);
        const sendData = {
            rbacToken:this.props.token,
            remark: content,
            emergencyId: emergencyId,
            operationType:105,
            runProcessTaskTeam,
            runProcessTaskStation
        };
        // console.log(sendData);
        axios.post(emergencyUrl+"/socialGovernance/emergencyProcess/emergencyOperate", sendData).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: '指令已发送。',
                });
                this.props.changeEditShow();
                this.props.reGetDetail();
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
            this.setState({loading:false});
        });
    }

    changeSelected(people,type){
        let {selectedList} = this.state;
        let thisIndex;
        for(let i = 0;i < selectedList.length;i ++){
            if(type === 1){
                if(selectedList[i].teamUserId === people.teamUserId){
                    thisIndex = i;
                    break;
                }
            }else{
                if(selectedList[i].userId === people.userId){
                    thisIndex = i;
                    break;
                }
            }
        }
        if(people.checked){
            if(thisIndex == null){
                selectedList.push({...people,type});
            }
        }else{
            if(thisIndex != null){
                selectedList.splice(thisIndex,1);
            }
        }
    }

    changeCheckAll(group){
        let checkAll = true;
        let indeterminate = false;
        if(group.allMemberList){
            group.allMemberList.forEach((item)=>{
                if(item.checked){
                    indeterminate = true;
                }else{
                    checkAll = false;
                }
            });
        }
        group.checkAll = checkAll;
        group.indeterminate = indeterminate && !checkAll;
    }

    selectPeople(people,group,type){
        people.checked = !people.checked;
        this.changeSelected(people,type);
        this.changeCheckAll(group);
        this.setState({});
    }

    selectGroup(group,type){
        group.checkAll = !group.checkAll;
        if(group.checkAll){
            group.indeterminate = false;
        }
        if(group.allMemberList){
            group.allMemberList.forEach((item)=>{
                if(this.props.contentType !== 'openMeeting' || item.empAccountId){
                    item.checked = group.checkAll;
                    this.changeSelected(item,type);
                }
            });
        }
        this.setState({});
    }

    removeSelected(people,index){
        const {teamList,departList,selectedList} = this.state;
        selectedList.splice(index,1);
        this.removeFromGroup(people,teamList);
        this.removeFromGroup(people,departList);
    }

    removeFromGroup(people,groupList){
        let hasFind = false;
        if(groupList){
            for(let j = 0;j < groupList.length;j ++){
                if(groupList[j].allMemberList){
                    for(let i = 0;i < groupList[j].allMemberList.length;i ++){
                        if(groupList[j].allMemberList[i].userId === people.userId){
                            groupList[j].allMemberList[i].checked = false;
                            hasFind = true;
                            break;
                        }
                    }
                    if(hasFind){
                        this.changeCheckAll(groupList[j]);
                        break;
                    }
                }
            }
        }
        this.setState({});
    }

    getGroupList(groupList,type){
        return groupList && groupList.map((team,index)=>{
            return (
                <div className={cssStyle.handleTeamBox} key={index} >
                    <div className={cssStyle.handleTeamName}>
                        <Checkbox
                            indeterminate={team.indeterminate}
                            checked={team.checkAll}
                            className={cssStyle.checkBox}
                            onClick={this.selectGroup.bind(this,team,type)}
                        >
                            <span className={cssStyle.blueColor}>{type === 1 ? team.teamName : team.stationName}</span>
                        </Checkbox>
                    </div>
                    {team.allMemberList && team.allMemberList.map((people,peopleIndex)=>
                        <div className={cssStyle.handleContentRow} key={peopleIndex}>
                            <Checkbox checked={people.checked} className={`${cssStyle.checkBox} ${this.props.contentType === 'openMeeting' && !people.empAccountId ? cssStyle.disabled:''}`} onClick={this.selectPeople.bind(this,people,team,type)} disabled={this.props.contentType === 'openMeeting' && !people.empAccountId}>
                                <span className={cssStyle.handleContentRowPart}>{people.departmentName}</span>
                                <span className={cssStyle.handleContentRowPart}>{type === 1 ? people.teamDuty : people.duty}</span>
                                <span className={cssStyle.handleContentRowPart}>{people.userName}</span>
                                <span className={cssStyle.handleContentRowPart}>{type === 1 ? people.teamUserPhone : people.phone}</span>
                            </Checkbox>
                        </div>
                    )}
                </div>
            )
        })
    }

    render() {
        const {show,changeEditShow,contentType} = this.props;
        const {teamList,departList,selectedList,groupShowType,content,loading} = this.state;
        return (
            <Motion style={{opacity:spring(show ? 1 : 0)}}>
                {({opacity}) =>
                    <div style={{opacity,zIndex:show?1:-1}} className={cssStyle.addOrderBox}>
                        <div className={cssStyle.editHeadBox}>
                            <div>{contentType === 'openMeeting' ? '开启会议':'下达指令'}</div>
                            <Icon type="close" className={cssStyle.closeIcon} onClick={changeEditShow}/>
                        </div>
                        <div className={cssStyle.selectedListBox}>
                            <div className={cssStyle.selectedListTitle}>已选人员：</div>
                            {selectedList.map((item,index)=>{
                                return (
                                    <div key={index} className={cssStyle.selectedItemBox}>
                                        <div>{item.userName}</div>
                                        <Icon type="close" className={cssStyle.deleteIcon} onClick={this.removeSelected.bind(this,item,index)}/>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={`${cssStyle.groupChangeBox}`}>
                            {this.groupTypeList.map((item,index)=>
                                <div
                                    key={index} onClick={this.changeDetailShow.bind(this,item)}
                                    className={`${cssStyle.changeButton} ${groupShowType === item.id ? cssStyle.changeButtonSelected:''}`}
                                >
                                    {item.name}
                                </div>
                            )}
                        </div>
                        <div className={cssStyle.groupListBox}>
                            <Motion style={{left:spring(groupShowType === 1 ? 0 : -100)}}>
                                {({left}) =>
                                    <div style={{left:left+'%'}} className={cssStyle.groupListContent}>
                                        <Scrollbars >
                                            {this.getGroupList(teamList,1)}
                                        </Scrollbars>
                                    </div>
                                }
                            </Motion>
                            <Motion style={{left:spring(groupShowType === 2 ? 0 : 100)}}>
                                {({left}) =>
                                    <div style={{left:left+'%'}} className={cssStyle.groupListContent}>
                                        <Scrollbars >
                                            {this.getGroupList(departList,2)}
                                        </Scrollbars>
                                    </div>
                                }
                            </Motion>
                        </div>
                        {contentType !== 'openMeeting' && <TextArea value={content} onChange={this.onChangeText.bind(this)} placeholder="请输入需要发送的内容" className={cssStyle.editContent} />}
                        <div className={cssStyle.editFootBox}>
                            <Button onClick={changeEditShow}>取消</Button>
                            <Button type="primary" onClick={this.determineAction.bind(this)} loading={loading}>确定</Button>
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}