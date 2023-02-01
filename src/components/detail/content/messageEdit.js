import React from "react";
import cssStyle from "./messageEdit.module.css";
import { getCompatibleData,getCloseDom,changeThisShow } from "../../../common/detailUtil";
import { interactData } from "../../../common/util";
import {Button, Modal, Icon, Checkbox, Input} from "antd";
import { Scrollbars } from "react-custom-scrollbars";
import axios from "axios";
import {emergencyUrl} from "../../../config";

const { TextArea } = Input;

export default class AboutPlatform extends React.Component {
    constructor(props) {
        super(props);
        this.state = {teamList:[],departList:[],selectedList:[],groupShowType:1,content:'',loading:false};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.interactData = interactData.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.changeThisShow = changeThisShow.bind(this);
        this.headName = ['预警','催办','结束异动'];
        this.successMessage = ['预警消息已发送。','催办消息已发送。','已结束结束异动。'];
        this.sendType = [202,203,299];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime && this.props.thisData.showStatus){
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
                    peopleItem.teamId = item.id;
                    peopleItem.teamName = item.name;
                });
            }
            if(item.checked){
                this.selectGroup(item,1);
            }
        });
    }

    initGroupData(){
        const { style } = this.props.thisData;
        if(style.editType === 2){
            return;
        }
        this.setState({selectedList:[],groupShowType:1,content:''});
        const groupListUrl = emergencyUrl + '/socialGovernance/dealTeam/getDealTeamListByScreen';
        // const groupListUrl = './json/ruian/peopleTeam.json';
        axios.get(groupListUrl, { params: { rbacToken: this.props.token,...this.props.keyParams} }).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if (result) {
                this.initList(result);
                this.setState({ teamList:result });
            }
        }).catch(function (error) {
            // 处理请求出错的情况
        });
    }

    removeSelected(people,index){
        const {teamList,selectedList} = this.state;
        selectedList.splice(index,1);
        this.removeFromGroup(people,teamList);
        this.setState({teamList,selectedList});
    }

    removeFromGroup(people,groupList){
        let hasFind = false;
        if(groupList){
            for(let j = 0;j < groupList.length;j ++){
                if(groupList[j].allMemberList && groupList[j].id === people.teamId){
                    for(let i = 0;i < groupList[j].allMemberList.length;i ++){
                        if(groupList[j].allMemberList[i].teamUserId === people.teamUserId && groupList[j].allMemberList[i].teamId === people.teamId){
                            groupList[j].allMemberList[i].checked = false;
                            hasFind = true;
                            // break;
                        }
                    }
                    if(hasFind){
                        this.changeCheckAll(groupList[j]);
                    }
                    break;
                }
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
        // this.changeOtherSelected(people);
        this.setState({});
    }

    changeOtherSelected(people,groupId){
        const {teamList} = this.state;
        teamList.forEach((team)=>{
            if(team.allMemberList && team.allMemberList.length > 0){
                team.allMemberList.forEach((member)=>{
                    if(member.teamUserId === people.teamUserId && member.checked !== people.checked && (!groupId || groupId !== team.id)){
                        member.checked = people.checked;
                        this.changeCheckAll(team);
                    }
                });
            }
        });
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
                    // this.changeOtherSelected(item,group.id);
                }
            });
        }
        this.setState({});
    }

    changeSelected(people){
        let {selectedList} = this.state;
        let thisIndex;
        for(let i = 0;i < selectedList.length;i ++){
            if(selectedList[i].teamUserId === people.teamUserId && selectedList[i].teamName === people.teamName){
                thisIndex = i;
                break;
            }
        }
        if(people.checked){
            if(thisIndex == null){
                selectedList.push({...people});
            }
        }else{
            if(thisIndex != null){
                selectedList.splice(thisIndex,1);
            }
        }
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
                            <span className={cssStyle.blueColor}>{type === 1 ? team.name : team.stationName}</span>
                        </Checkbox>
                    </div>
                    {team.allMemberList && team.allMemberList.map((people,peopleIndex)=>
                        <div className={cssStyle.handleContentRow} key={peopleIndex}>
                            <Checkbox
                                checked={people.checked}
                                className={`${cssStyle.checkBox} ${this.props.contentType === 'openMeeting' && !people.empAccountId ? cssStyle.disabled:''}`}
                                onClick={this.selectPeople.bind(this,people,team,type)}
                                disabled={this.props.contentType === 'openMeeting' && !people.empAccountId}
                            >
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

    onChangeText(event){
        this.setState({content:event.target.value});
    }

    getSelectedList(list){
        let returnList = [];
        list.forEach((item)=>{
            if((item.checkAll || item.indeterminate) && item.allMemberList && item.allMemberList.length > 0){
                item.allMemberList.forEach((people)=>{
                    if(people.checked){
                        returnList.push({
                            teamId:item.id,
                            userId:people.teamUserId,
                            departId:people.teamDepartId,
                            empAccountId:people.empAccountId,
                        });
                    }
                });
            }
        });
        return returnList;
    }

    sendMessage(){
        this.setState({loading:true});
        const { style } = this.props.thisData;
        const {teamList,content} = this.state;
        const sendData = {
            rbacToken:this.props.token,
            petitionId: this.props.keyParams.petitionId,
            recordType: this.sendType[style.editType],
            recordContent:content
        };
        if(style.editType !== 2){
            sendData.recipientList = this.getSelectedList(teamList,1);
        }
        // console.log(sendData);
        axios.post(emergencyUrl+"/socialGovernance/OuEmphasesPeople/addPeoplePetitionRecord", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: this.successMessage[style.editType],
                });
                this.changeThisShow(false);
                const { successInteract } = this.props.thisData.style;
                this.interactData(successInteract);
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

    render() {
        const { detail } = this.props;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        if (JSON.stringify(detail) === '{}') {
            return '';
        }
        const {teamList,selectedList,content,loading} = this.state;
        return (
            <div className={cssStyle.box} style={{fontSize:this.props.style.fontSize}}>
                <div className={cssStyle.editHeadBox}>
                    {this.headName[style.editType]}
                </div>
                {this.getCloseDom(style, compatibleSize)}
                {style.editType !== 2 && (
                    <React.Fragment>
                        <div className={cssStyle.selectedListBox}>
                            <div className={cssStyle.selectedListTitle}>已选人员：</div>
                            {selectedList.map((item,index)=>{
                                return (
                                    <div key={index} className={cssStyle.selectedItemBox}>
                                        <div>{item.teamName+'-'+item.userName}</div>
                                        <Icon type="close" className={cssStyle.deleteIcon} onClick={this.removeSelected.bind(this,item,index)}/>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={cssStyle.groupListBox}>
                            <div className={cssStyle.groupListContent}>
                                <Scrollbars >
                                    {this.getGroupList(teamList,1)}
                                </Scrollbars>
                            </div>
                        </div>
                    </React.Fragment>
                )}
                <TextArea value={content} onChange={this.onChangeText.bind(this)} placeholder="请输入内容" className={cssStyle.editContent} />
                <div className={cssStyle.editFootBox}>
                    <Button onClick={changeThisShow.bind(this,false)}>取消</Button>
                    <Button type="primary" onClick={this.sendMessage.bind(this)} loading={loading}>确定</Button>
                </div>
            </div>
        );
    }
}