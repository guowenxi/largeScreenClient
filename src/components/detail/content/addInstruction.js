import React from "react";
import cssStyle from "./addInstruction.module.css";
import CloseIcon from "../images/closeTypeOne.svg";
import {Input, Icon, Button, Checkbox, Modal} from 'antd';
import {emergencyUrl} from "../../../config";
import axios from "axios";
import {Scrollbars} from "react-custom-scrollbars";
import {interactData} from "../../../common/util";

const { TextArea } = Input;

export default class AddInstruction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {depList:[],userList:[],selectedDepId:'',selectedDepName:'',selectedUserId:'',selectedUserList:[],searchText:'',content:'',title:'',loading:false};
        this.interactData = interactData.bind(this);
        this.planName = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.getGroupList();
    }

    closeThis(){
        this.props.changeThisShow(false);
    }

    getGroupList(){
        const groupListUrl = emergencyUrl + "/rbac/fyDepartment/getDeptTreeNew";
        // const groupListUrl = "./json/ruian/depList.json";
        const sendData = {
            rbacToken:this.props.token
        };
        axios.get(groupListUrl,{params:sendData}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({depList:result});
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    getNodeContent(dep){
        if(dep){
            return (
                <React.Fragment>
                    <div className={`${cssStyle.nodeLine} ${this.state.selectedDepId === dep.key ? cssStyle.selectedNode:''}`} onClick={this.nodeClick.bind(this,dep)}>
                        {dep.children && <Icon className={cssStyle.nodeIcon} type={dep.childrenShow ? "caret-down":"caret-right"} />}
                        <div>{dep.title}</div>
                    </div>
                    {dep.children && dep.childrenShow && (
                        <div className={cssStyle.childrenBox}>
                            {dep.children.map((childrenDep,index)=>
                                <React.Fragment key={index}>
                                    {this.getNodeContent(childrenDep)}
                                </React.Fragment>
                            )}
                        </div>
                    )}
                </React.Fragment>
            )
        }
    }

    nodeClick(dep){
        if(dep.children){
            dep.childrenShow = !dep.childrenShow;
        }
        this.setState({selectedDepId:dep.key,selectedDepName:dep.title});
        this.getUserList(dep.key);
    }

    searchUser(){
        this.setState({selectedDepId:'',selectedDepName:''});
        this.getUserList();
    }

    getUserList(id){
        let groupListUrl = emergencyUrl + "/socialGovernance/dingUser/getListByDepartId";
        // const groupListUrl = "./json/ruian/userList.json";
        let sendData = {
            rbacToken:this.props.token,
        };
        if(id){
            sendData.departId = id;
            groupListUrl = emergencyUrl + "/socialGovernance/dingUser/getListByDepartId";
        }else{
            sendData.name = this.state.searchText;
            groupListUrl = emergencyUrl + "/socialGovernance/dingUser/getListByName";
        }
        axios.get(groupListUrl,{params:sendData}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({userList:result});
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    changeSearch(key,e){
        let data = {};
        data[key] = e.target.value;
        this.setState(data);
    }

    selectUser(user){
        let {selectedUserId,selectedUserList} = this.state;
        if(selectedUserId.indexOf('_'+user.userId+'|'+user.departmentId+'_') >= 0){
            this.removeSelected(user);
        }else{
            selectedUserId += '_'+user.userId+'|'+user.departmentId+'_,';
            selectedUserList.push(user);
            this.setState({selectedUserId,selectedUserList});
        }
    }

    removeSelected(user){
        let {selectedUserId,selectedUserList} = this.state;
        selectedUserId = selectedUserId.replace('_'+user.userId+'|'+user.departmentId+'_','');
        let index = -1;
        for(let i = 0;i < selectedUserList.length;i ++){
            if(selectedUserList[i].userId === user.userId && selectedUserList[i].departmentId === user.departmentId){
                index = i;
                break;
            }
        }
        if(index >= 0){
            selectedUserList.splice(index,1);
        }
        this.setState({selectedUserId,selectedUserList});
    }

    sendMessage(){
        this.setState({loading:true});
        const {selectedUserList,title,content} = this.state;
        const sendData = {
            rbacToken:this.props.token,
            userList:selectedUserList ? selectedUserList.map((user)=>{
                return {id:user.userId,empAccountId:user.empAccountId,name:user.userName,departmentId:user.departmentId}
            }):[],
            instructionTitle:title,
            instructionContent:content
        };
        // console.log(sendData);
        axios.post(emergencyUrl+"/socialGovernance/dispatchInstruction/addInstruction", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
            this.setState({loading:false});
            if(response.data.success){
                Modal.success({
                    content: '指令已发送。',
                });
                setTimeout(()=>{
                    this.closeThis();
                    const { successInteract } = this.props.thisData.style;
                    this.interactData(successInteract);
                });
            }else{
                Modal.error({
                    content: response.data.message,
                });
            }
        }).catch( (error) => {
            Modal.error({
                content: '请求出错！',
            });
            this.setState({loading:false});
        });
    }

    render() {
        const {depList,userList,selectedUserId,selectedUserList,selectedDepId,selectedDepName,loading} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.backgroundBox}>
                    <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)}/>
                    <div className={cssStyle.treeBox}>
                        <Scrollbars >
                            {depList && depList.map((dep,depIndex)=>
                                <div className={cssStyle.treeNodeBox} key={depIndex}>
                                    {this.getNodeContent(dep)}
                                </div>
                            )}
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.searchBox}>
                        <Input className={`${cssStyle.input} ${cssStyle.edit}`} placeholder="请输入姓名" value={this.state.searchText} onChange={this.changeSearch.bind(this,'searchText')}/>
                        <Button type="primary" onClick={this.searchUser.bind(this)} className={cssStyle.searchButton} >搜索</Button>
                    </div>
                    <div className={cssStyle.userListTitle}>{selectedDepId?selectedDepName+'：':'搜索结果：'}</div>
                    <div className={cssStyle.userListBox}>
                        {userList && userList.map((user,index)=>
                            <Checkbox
                                key={index}
                                checked={selectedUserId.indexOf('_'+user.userId+'|'+user.departmentId+'_')>=0}
                                className={cssStyle.checkBox}
                                onClick={this.selectUser.bind(this,user)}
                            >
                                <span className={cssStyle.checkBoxText}>{selectedDepId ? '':user.departmentName+'-'}{user.userName}</span>
                            </Checkbox>
                        )}
                    </div>
                    <div className={cssStyle.userSelectedListTitle}>已选人员：</div>
                    <div className={cssStyle.userSelectedListBox}>
                        {selectedUserList && selectedUserList.map((user,index)=>
                            <div key={index} className={cssStyle.selectedItemBox}>
                                <div>{user.departmentName+'-'+user.userName}</div>
                                <Icon type="close" className={cssStyle.deleteIcon} onClick={this.removeSelected.bind(this,user)}/>
                            </div>
                        )}
                    </div>
                    <Input className={`${cssStyle.title} ${cssStyle.edit}`} placeholder="请输入指令标题" value={this.state.title} onChange={this.changeSearch.bind(this,'title')}/>
                    <TextArea className={`${cssStyle.textarea} ${cssStyle.edit}`} value={this.state.content} placeholder='请输入需要发送的内容' onChange={this.changeSearch.bind(this,'content')} />
                    <div className={cssStyle.buttonBox}>
                        <Button type="primary" onClick={this.sendMessage.bind(this)} className={cssStyle.button} loading={loading}>发送</Button>
                        <Button onClick={this.closeThis.bind(this)} className={cssStyle.button} style={{marginLeft:'1em'}}>取消</Button>
                    </div>
                </div>
            </div>
        );
    }
}