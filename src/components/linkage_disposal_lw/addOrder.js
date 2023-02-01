import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Checkbox, Icon, Input, Button, Modal, Select, Tree} from "antd";
import axios from "axios";
import {Scrollbars} from "react-custom-scrollbars";

const { TextArea,Search } = Input;
const { confirm } = Modal;
const { TreeNode } = Tree;

export default class AddOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTask:undefined,
            teamList:[],departList:[],allDepList:[],selectedList:[],groupShowType:1,content:'',loading:false,expandedKeys:[],
            searchKey:'',allDepUserSelected:[],allDepUserId:[],teamUserId:[],depUserId:[],
        };
        this.groupTypeList = props.contentType === 'openMeeting' ? [{id:1,name:'应急小组'},{id:2,name:'基层站所'},{id:3,name:'浙政钉组织架构'}] : [{id:1,name:'应急小组'},{id:2,name:'基层站所'}];
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
            if(item.userList){
                item.userList.forEach(peopleItem => {
                    peopleItem.checked = false;
                });
            }
        });
    }

    mergeTeamUser(teamList,addTeamList,subKey){
        addTeamList.forEach((team)=>{
            let hasFindTeam = false;
            for(let i = 0;i < teamList.length;i ++){
                if(team[subKey] === teamList[i][subKey]){
                    const teamListUser = teamList[i].userList;
                    team.userList.forEach((user)=>{
                        let hasFind = false;
                        for(let j = 0;j < teamListUser.length;j ++){
                            if(teamListUser[j].userId === user.userId){
                                hasFind = true;
                                break;
                            }
                        }
                        if(!hasFind){
                            teamListUser.push(user);
                        }
                    });
                    hasFindTeam = true;
                    break;
                }
            }
            if(!hasFindTeam){
                teamList.push(team);
            }
        });
    }

    initGroupData(){
        const {activeTaskList,currentStationDutyUser,helpStationDutyUserList} = this.props.detail;
        this.setState({
            teamList:[],departList:[],selectedList:[],groupShowType:1,content:'',
            searchKey:'',allDepUserSelected:[],teamUserId:[],depUserId:[],allDepUserId:[]
        });
        if(activeTaskList && activeTaskList.length > 0){
            this.initTeamList(activeTaskList[0].id);
        }else{
            this.initTeamList();
        }
        const departList = JSON.parse(JSON.stringify((currentStationDutyUser ? [currentStationDutyUser]:[])));
        const addDepartList = JSON.parse(JSON.stringify((helpStationDutyUserList || [])));
        this.mergeTeamUser(departList,addDepartList,'stationId');
        this.initList(departList);
        this.setState({ departList });
    }

    initTeamList(taskId){
        if(taskId){
            const {contentType,currentTeamList,planFlowTeamList,helpTeamUserList,helpDepartmentUserList} = this.props.detail;
            let teamListSource = [];
            if(contentType === 'openMeeting'){
                teamListSource = JSON.parse(JSON.stringify((planFlowTeamList || [])));
            }else{
                teamListSource = JSON.parse(JSON.stringify((currentTeamList || [])));
            }
            const addTeamListSource = JSON.parse(JSON.stringify((helpTeamUserList || [])));
            let teamList = [];
            teamListSource.forEach((item)=>{
                if(item.taskIds && item.taskIds.indexOf(taskId) >= 0){
                    teamList.push({
                        teamId:item.teamId,
                        teamName:item.teamName,
                        userList:[...item.leader,...item.deputy,...item.member]
                    });
                }
            });
            let addTeamList = [];
            addTeamListSource.forEach((item)=>{
                addTeamList.push({
                    teamId:item.teamId,
                    teamName:item.teamName,
                    userList:[...item.leader,...item.deputy,...item.member]
                });
            });
            this.mergeTeamUser(teamList,addTeamList,'teamId');
            if(helpDepartmentUserList){
                teamList.push({
                    teamId:'specialTeam',
                    teamName:'特殊增派组',
                    userList:[...helpDepartmentUserList]
                });
            }
            this.initList(teamList);
            this.setState({ teamList,selectedTask:taskId});
        }else{
            this.setState({selectedTask:undefined})
        }
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
            if((item.checkAll || item.indeterminate) && item.userList && item.userList.length > 0){
                if(item.teamId === 'specialTeam'){
                    let depList = [];
                    let depIdList = [];
                    item.userList.forEach((people)=>{
                        if(people.checked){
                            const depIndex = depIdList.indexOf(people.departmentId);
                            if(depIndex >= 0){
                                depList[depIndex].userList.push(people.userId);
                            }else{
                                depIdList.push(people.departmentId);
                                depList.push({
                                    userFromId:people.departmentId,
                                    assignUserFrom:3,
                                    userList:[people.userId]
                                });
                            }
                        }
                    });
                    depIdList = null;
                    returnList = returnList.concat(depList);
                }else{
                    let ids = [];
                    item.userList.forEach((people)=>{
                        if(people.checked){
                            ids.push(people.userId);
                        }
                    });
                    returnList.push({
                        userFromId:type === 1 ? item.teamId : item.stationId,
                        assignUserFrom:type,
                        userList:ids
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
                const sendData = {
                    eventId:this.props.emergencyId,
                    rbacToken:this.props.token,
                    memberList:JSON.parse(JSON.stringify(this.state.selectedList)).map((item)=>{
                        delete item.type;
                        delete item.checked;
                        return item;
                    })
                };
                // console.log(sendData);
                return new Promise((resolve) => {
                    axios.post(this.props.emergencyUrl+"/socialGovernance/commandDispatch/saveMeetingMessage",sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            const meetingUrl = `${this.props.meetingUrl}?id=${response.data.data}&rbacToken=${this.props.token}`;
                            window.location.href = this.props.dingtalkUrl+'?url='+encodeURIComponent(meetingUrl)+'&pc_slide=true';
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
        // this.setState({loading:true});
        const {teamList,departList,content,selectedTask} = this.state;
        const {emergencyId} = this.props;
        const sendData = {
            eventId: emergencyId,
            taskId: selectedTask,
            assignUserGroupList:[
                ...this.getSelectedList(teamList,1),
                ...this.getSelectedList(departList,2)
            ],
            remark: content,
            rbacToken: this.props.token
        };
        // console.log(sendData)
        axios.post(this.props.emergencyUrl+"/socialGovernance/commandDispatch/assignEvent", sendData).then((response) => {
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
        let {selectedList,teamUserId,depUserId,allDepUserId} = this.state;
        let thisIndex;
        for(let i = 0;i < selectedList.length;i ++){
            if(selectedList[i].userId === people.userId){
                thisIndex = i;
                break;
            }
        }
        if(people.checked){
            if(type === 1){
                teamUserId.push(people.userId);
            }else{
                depUserId.push(people.userId);
            }
            if(thisIndex == null){
                selectedList.push({...people,type});
            }
        }else{
            if(type === 1){
                teamUserId.splice(teamUserId.indexOf(people.userId),1);
            }else{
                depUserId.splice(depUserId.indexOf(people.userId),1);
            }
            if(thisIndex != null && allDepUserId.indexOf(people.userId) < 0 && depUserId.indexOf(people.userId) < 0 && teamUserId.indexOf(people.userId) < 0){
                selectedList.splice(thisIndex,1);
            }
        }
    }

    changeCheckAll(group){
        let checkAll = true;
        let indeterminate = false;
        if(group.userList){
            group.userList.forEach((item)=>{
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
        if(group.userList){
            group.userList.forEach((item)=>{
                if(this.props.contentType !== 'openMeeting' || item.empAccountId){
                    item.checked = group.checkAll;
                    this.changeSelected(item,type);
                }
            });
        }
        this.setState({});
    }

    removeFromDepTree(people){
        const {allDepUserSelected} = this.state;
        let selectIndex = null;
        for(let i = 0;i < allDepUserSelected.length;i ++){
            if(allDepUserSelected[i].indexOf('user_'+people.userId) === 0){
                selectIndex = i;
                break
            }
        }
        if(selectIndex != null){
            allDepUserSelected.splice(selectIndex,1);
        }
        this.setState({allDepUserSelected});
    }

    spliceAll(list,id){
        const index = list.indexOf(id);
        if(index >= 0){
            list.splice(index,1);
            this.spliceAll(list,id);
        }
    }

    removeSelected(people,index){
        const {teamList,departList,selectedList,teamUserId,depUserId,allDepUserId} = this.state;
        selectedList.splice(index,1);
        this.spliceAll(teamUserId,people.userId);
        this.spliceAll(depUserId,people.userId);
        this.spliceAll(allDepUserId,people.userId);
        this.removeFromGroup(people,teamList);
        this.removeFromGroup(people,departList);
        this.removeFromDepTree(people);
    }

    removeFromGroup(people,groupList){
        if(groupList){
            for(let j = 0;j < groupList.length;j ++){
                let hasFind = false;
                if(groupList[j].userList){
                    for(let i = 0;i < groupList[j].userList.length;i ++){
                        if(groupList[j].userList[i].userId === people.userId){
                            groupList[j].userList[i].checked = false;
                            hasFind = true;
                            break;
                        }
                    }
                    if(hasFind){
                        this.changeCheckAll(groupList[j]);
                    }
                }
            }
        }
        this.setState({});
    }


    getExpandedKeys(list,type,key){
        let returnList = [];
        if(list && Array.isArray(list) && list.length > 0){
            if(type === 2){
                list.forEach((item)=>{
                    if(item.name.indexOf(key) >= 0){
                        returnList.push(item);
                    }
                });
            }else{
                list.forEach((item)=>{
                    const userList = this.getExpandedKeys(item.userList,2,key);
                    const childList = this.getExpandedKeys(item.children,1,key);
                    if(userList.length > 0 || childList.length > 0){
                        returnList.push('department_'+item.departmentId);
                        returnList = returnList.concat(childList);
                    }
                });
            }
        }
        return returnList;
    }

    changeSearchKey(value){
        if(value){
            this.setState({searchKey:value,expandedKeys:this.getExpandedKeys(this.props.allDepList,1,value)});
        }else{
            this.setState({searchKey:value});
        }
    }

    getTreeNode(list,type,departmentId,departmentName){
        const {searchKey} = this.state;
        if(list && Array.isArray(list) && list.length > 0){
            return list.map((item)=>{
                if(type === 2){
                    let title = item.name;
                    if(searchKey){
                        const index = title.indexOf(searchKey);
                        const beforeStr = title.substr(0, index);
                        const afterStr = title.substr(index + searchKey.length);
                        if(index >= 0){
                            title = (
                                <span>
                                    {beforeStr}
                                    <span style={{ color: '#f50' }}>{searchKey}</span>
                                    {afterStr}
                                </span>
                            );
                        }
                    }
                    return <TreeNode disabled={!item.empAccountId} {...{...item,departmentId,departmentName}} key={'user_'+item.id+'_'+departmentId} title={title} />;
                }else{
                    return (
                        <TreeNode key={'department_'+item.departmentId} title={item.departmentName} >
                            {this.getTreeNode(item.userList,2,item.departmentId,item.departmentName)}
                            {this.getTreeNode(item.children,1)}
                        </TreeNode>
                    )
                }
            });
        }else{
            return null;
        }
    }

    allDepUserSelect(ids,e){
        let {allDepUserSelected,selectedList,teamUserId,depUserId,allDepUserId} = this.state;
        let newAllDepUserSelected = [];
        const {checkedNodes} = e;
        ids.forEach((id,nodeIndex)=>{
            if(id.indexOf('user_') === 0){
                newAllDepUserSelected.push(id);
                if(allDepUserSelected.indexOf(id) < 0){
                    const userStr = id.split('_');
                    const thisNodeData = checkedNodes[nodeIndex].props;
                    let selectIndex = null;
                    selectedList.forEach((user,index)=>{
                        if(id.indexOf('user_'+user.userId) === 0){
                            selectIndex = index;
                        }
                    });
                    allDepUserId.push(userStr[1]);
                    if(selectIndex == null){
                        const user = {
                            userId:userStr[1],
                            empAccountId:thisNodeData.empAccountId,
                            userName:thisNodeData.name,
                            userPhone:thisNodeData.phone,
                            departmentId:thisNodeData.departmentId,
                            departmentName:thisNodeData.departmentName,
                            type:3
                        };
                        // console.log(user);
                        selectedList.push(user);
                    }
                }
            }
        });
        allDepUserSelected.forEach((id)=>{
            if(ids.indexOf(id) < 0){
                const userStr = id.split('_');
                allDepUserId.splice(allDepUserId.indexOf(userStr[1]),1);
                if(teamUserId.indexOf(userStr[1]) < 0 && depUserId.indexOf(userStr[1]) < 0){
                    let selectIndex = null;
                    selectedList.forEach((user,index)=>{
                        if(id.indexOf('user_'+user.userId) === 0){
                            selectIndex = index;
                        }
                    });
                    if(selectIndex != null){
                        selectedList.splice(selectIndex,1);
                    }
                }
            }
        });
        this.setState({allDepUserSelected:newAllDepUserSelected,selectedList});
    }

    getGroupList(groupList,type){
        if(type === 3){
            const {allDepUserSelected,expandedKeys} = this.state;
            return (
                <Tree
                    className={'linkage_disposal_lw_tree'}
                    checkable
                    onExpand={expandedKeys => this.setState({expandedKeys})}
                    checkedKeys={allDepUserSelected}
                    expandedKeys={expandedKeys}
                    onCheck={this.allDepUserSelect.bind(this)}
                >
                    {this.getTreeNode(groupList,1)}
                </Tree>
            );
        }else{
            const {searchKey} = this.state;
            return groupList && groupList.map((team,index)=>{
                let dom = [];
                team.userList && team.userList.forEach((people,peopleIndex)=>{
                    if(!searchKey || (people.userName && people.userName.indexOf(searchKey) >= 0)){
                        dom.push(
                            <div className={cssStyle.handleContentRow} key={peopleIndex}>
                                <Checkbox checked={people.checked} className={`${cssStyle.checkBox} ${this.props.contentType === 'openMeeting' && !people.empAccountId ? cssStyle.disabled:''}`} onClick={this.selectPeople.bind(this,people,team,type)} disabled={this.props.contentType === 'openMeeting' && !people.empAccountId}>
                                    <span className={cssStyle.handleContentRowPart}>{people.departmentName}</span>
                                    {type === 1 && <span className={cssStyle.handleContentRowPart}>{people.memberTypeValue}</span>}
                                    <span className={cssStyle.handleContentRowPart}>{people.userName}</span>
                                    <span className={cssStyle.handleContentRowPart}>{people.userPhone}</span>
                                </Checkbox>
                            </div>
                        )
                    }
                });
                if(dom.length > 0){
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
                            {dom}
                        </div>
                    )
                }else{
                    return null;
                }
            })
        }
    }

    render() {
        const {show,changeEditShow,contentType,detail,allDepList} = this.props;
        const {teamList,departList,selectedList,groupShowType,content,selectedTask,loading} = this.state;
        return (
            <Motion style={{opacity:spring(show ? 1 : 0)}}>
                {({opacity}) =>
                    <div style={{opacity,zIndex:show?2:-1}} className={cssStyle.addOrderBox}>
                        <div className={cssStyle.editHeadBox}>
                            <div className={cssStyle.headName}>{contentType === 'openMeeting' ? '开启会议':'下达指令'}</div>
                            <Icon type="close" className={cssStyle.closeIcon} onClick={changeEditShow}/>
                            {contentType !== 'openMeeting' && (
                                <Select value={selectedTask} onChange={this.initTeamList.bind(this)} className={cssStyle.selectTask}>
                                    {detail.activeTaskList && detail.activeTaskList.map((task,index)=>
                                        <Select.Option value={task.id} key={index}>{task.name}</Select.Option>
                                    )}
                                </Select>
                            )}
                            <Search
                                placeholder="请输入姓名"
                                onSearch={this.changeSearchKey.bind(this)}
                                className={contentType !== 'openMeeting' ? cssStyle.nameSearchTwo:cssStyle.nameSearch}
                            />
                        </div>
                        <div className={cssStyle.selectedListTitle}>已选人员：</div>
                        <div className={cssStyle.selectedListBoxAll}>
                            <Scrollbars className={'blueScrollbars'}>
                                <div className={cssStyle.selectedListBox}>
                                    {selectedList.map((item,index)=>{
                                        return (
                                            <div key={index} className={cssStyle.selectedItemBox}>
                                                <div>{item.userName}</div>
                                                <Icon type="close" className={cssStyle.deleteIcon} onClick={this.removeSelected.bind(this,item,index)}/>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Scrollbars>
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
                                        <Scrollbars className={'blueScrollbars'}>
                                            {this.getGroupList(teamList,1)}
                                        </Scrollbars>
                                    </div>
                                }
                            </Motion>
                            <Motion style={{left:spring(groupShowType === 2 ? 0 : (groupShowType === 3 ? -100:100))}}>
                                {({left}) =>
                                    <div style={{left:left+'%'}} className={cssStyle.groupListContent}>
                                        <Scrollbars className={'blueScrollbars'} >
                                            {this.getGroupList(departList,2)}
                                        </Scrollbars>
                                    </div>
                                }
                            </Motion>
                            <Motion style={{left:spring(groupShowType === 3 ? 0 : 100)}}>
                                {({left}) =>
                                    <div style={{left:left+'%'}} className={`${cssStyle.groupListContent} linkage_disposal_lw_tree`}>
                                        <Scrollbars className={'blueScrollbars'} >
                                            {this.getGroupList(allDepList,3)}
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