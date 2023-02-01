import React from "react";
import cssStyle from "./orderSendFour.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {Checkbox, Input, Modal} from "antd";
import axios from "axios";

const { confirm } = Modal;
const { TextArea } = Input;

export default class OrderSendSix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {content:'',group:[],department:[],groupList:[],departmentList:[]};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.initListData();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime){
            this.setState({content:'',group:[],department:[],groupList:[],departmentList:[]});
            this.initListData();
        }
    }

    initListData(){
        const {depListUrl,groupListUrl} = this.props.thisData.style;
        this.getListData(depListUrl,'departmentList');
        this.getListData(groupListUrl,'groupList');
    }

    getListData(url,key,params){
        if(url){
            axios.get(url,{params:{...params,rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                if(response.data.success && response.data.data){
                    this.setState({[key]:response.data.data});
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    sendOrder(){
        confirm({
            title: '确定要发送该常态任务吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    rbacToken: this.props.token,
                    planId: this.props.detail.id,
                    eventId: this.props.keyParams.eventId,
                };
                return new Promise((resolve) => {
                    axios.post(this.props.styleData.fileUrl, sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '已发送。',
                            });
                            this.props.clearData();
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch(function (error) {
                        resolve();
                        Modal.error({
                            content: '发送失败',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    onCheckGroupChange(item){
        let {group,groupList} = this.state;
        const index = group.indexOf(item.id);
        if(index >= 0){
            group.splice(index,1);
        }else{
            group.push(item.id);
        }
        this.setState({checkAllGroup:group.length === groupList.length,indeterminateGroup:group.length !== groupList.length && group.length > 0,group});
    }

    onCheckAllGroupChange(){
        let { groupList,checkAllGroup,indeterminateGroup,group } = this.state;
        if(checkAllGroup){
            checkAllGroup = false;
            indeterminateGroup = false;
            group = [];
        }else {
            checkAllGroup = true;
            indeterminateGroup = false;
            group = groupList.map((item)=>{
                return item.id;
            });
        }
        this.setState({checkAllGroup,indeterminateGroup,group});
    }

    changeData(key,event){
        this.setState({[key]:event.target.value});
    }

    onCheckAllDepChange(){
        let {checkAllDep,indeterminateDep,departmentList} = this.state;
        if(checkAllDep){
            checkAllDep = false;
            indeterminateDep = false;
        }else{
            checkAllDep = true;
            indeterminateDep = false;
        }
        departmentList.forEach((dep)=>{
            dep.checked = checkAllDep;
            dep.indeterminate = false;
            dep.peopleList.forEach((people)=>{
                people.checked = checkAllDep;
            });
        });
        this.setState({checkAllDep,indeterminateDep,departmentList});
    }

    onCheckAllOneDepChange(item){
        item.checked = !item.checked;
        item.indeterminate = false;
        item.peopleList.forEach((people)=>{
            people.checked = item.checked;
        });
        this.checkAllDep();
    }

    onCheckDepChange(dep,people){
        people.checked = !people.checked;
        dep.checked = true;
        dep.indeterminate = false;
        dep.peopleList.forEach((item)=>{
            if(item.checked){
                dep.indeterminate = true;
            }else{
                dep.checked = false;
            }
        });
        dep.indeterminate = dep.indeterminate && !dep.checked;
        this.checkAllDep();
    }

    checkAllDep(){
        let {departmentList} = this.state;
        let checkAllDep = true;
        let indeterminateDep = false;
        for(let i = 0;i < departmentList.length;i ++){
            if(departmentList[i].checked || departmentList[i].indeterminate){
                indeterminateDep = true;
                if(departmentList[i].indeterminate){
                    checkAllDep = false;
                }
            }else{
                checkAllDep = false;
            }
        }
        this.setState({checkAllDep,indeterminateDep:indeterminateDep&&!checkAllDep});
    }

    render() {
        const { groupList,departmentList,checkAllDep,indeterminateDep,checkAllGroup,indeterminateGroup,content,group } = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.head}>指令信息</div>
                <div className={cssStyle.contentOne} style={{height:'8em'}}>
                    <TextArea value={content} onChange={this.changeData.bind(this,'content')} placeholder="请输入指令内容" className={`${cssStyle.input} ${cssStyle.textArea}`} style={{width:'100%'}} />
                </div>
                <div className={cssStyle.head}>预编组小队</div>
                <div className={cssStyle.totalRow} style={{paddingBottom:'0px'}}>
                    <Checkbox
                        className={cssStyle.checkbox}
                        indeterminate={indeterminateGroup}
                        onChange={this.onCheckAllGroupChange.bind(this)}
                        checked={checkAllGroup}
                    >
                        全选
                    </Checkbox>
                </div>
                <div className={cssStyle.contentOne} style={{height:'24%'}}>
                    <Scrollbars>
                        {groupList && Array.isArray(groupList) && groupList.map((item,index)=>
                            <Checkbox
                                key={index}
                                className={`${cssStyle.checkbox} ${cssStyle.checkboxTwo} ${group.indexOf(item.id) >= 0 ? cssStyle.blueColor:''}`}
                                onClick={this.onCheckGroupChange.bind(this,item)}
                                checked={group.indexOf(item.id) >= 0}
                            >
                                {`${item.name} (${item.leaderName} ${item.leaderPhone})`}
                            </Checkbox>
                        )}
                    </Scrollbars>
                </div>
                <div className={cssStyle.head}>部门联动</div>
                <div className={cssStyle.totalRow} style={{paddingBottom:'0px'}}>
                    <Checkbox
                        className={cssStyle.checkbox}
                        indeterminate={indeterminateDep}
                        onChange={this.onCheckAllDepChange.bind(this)}
                        checked={checkAllDep}
                    >
                        全选
                    </Checkbox>
                </div>
                <div className={cssStyle.contentOne} style={{height:'32%'}}>
                    <Scrollbars>
                        {departmentList && Array.isArray(departmentList) && departmentList.map((item,index)=>
                            <React.Fragment key={index}>
                                <Checkbox
                                    className={`${cssStyle.checkboxThree} ${cssStyle.blueColor}`}
                                    onClick={this.onCheckAllOneDepChange.bind(this,item)}
                                    checked={item.checked}
                                    indeterminate={item.indeterminate}
                                >
                                    {item.name}
                                </Checkbox>
                                <div className={cssStyle.depPeopleBox}>
                                    {item.peopleList && item.peopleList.map((people,peopleIndex)=>
                                        <Checkbox
                                            key={peopleIndex}
                                            className={cssStyle.checkboxThree}
                                            onClick={this.onCheckDepChange.bind(this,item,people)}
                                            checked={people.checked}
                                            style={{width:'25%'}}
                                        >
                                            {people.name}
                                        </Checkbox>
                                    )}
                                </div>
                            </React.Fragment>
                        )}
                    </Scrollbars>
                </div>
                <div className={cssStyle.buttonBox}>
                    <div className={cssStyle.buttonThree} onClick={this.sendOrder.bind(this)}>发布指令</div>
                </div>
            </div>
        );
    }
}