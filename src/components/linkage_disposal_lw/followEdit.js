import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Icon, Input, Select, Button, Modal, TreeSelect} from "antd";
import axios from "axios";

const { TextArea } = Input;
const { TreeNode } = TreeSelect;

export default class FollowEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {detail:{},depList:[],peopleList:[],loading:false};
    }

    //组件加载触发函数
    componentDidMount() {
        const depListUrl = this.props.emergencyUrl + "/socialGovernance/common/getDepartmentTree";
        axios.get(depListUrl,{params:{rbacToken:this.props.token}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({depList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    dataEdit(type,key,event){
        let {detail} = this.state;
        detail[key] = type === 1 ? event.target.value : event;
        this.setState({detail});
        if(key === 'departmentId'){
            this.getPeopleList(detail[key]);
        }
    }

    getPeopleList(id){
        const peopleListUrl = this.props.emergencyUrl + "/socialGovernance/common/getDepartmentUserListMobile";
        axios.get(peopleListUrl,{params:{rbacToken:this.props.token,departmentId:id}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({peopleList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    addNewEvent(){
        this.setState({loading:true});
        const {detail} = this.state;
        const sendData = {
            rbacToken:this.props.token,
            eventId:this.props.emergencyId,
            assignDepartmentId:detail.departmentId,
            assignUserId:detail.userId,
            remark:detail.eventContent
        };
        axios.post(this.props.emergencyUrl+"/socialGovernance/commandDispatch/completeEventFollowUp", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: '后续跟踪指派完成。',
                });
                this.props.changeEditShow();
                this.props.reGetDetail();
                this.clearDetail();
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

    clearDetail(){
        this.setState({detail:{}})
    }

    getTreeNode(list){
        if(list){
            return list.map((item)=>{
                if(item.children){
                    return (
                        <TreeNode value={item.departmentId} key={item.departmentId} title={item.departmentName} >
                            {this.getTreeNode(item.children)}
                        </TreeNode>
                    );
                }else{
                    return <TreeNode value={item.departmentId} key={item.departmentId} title={item.departmentName}/>
                }
            });
        }else{
            return null;
        }
    }

    render() {
        const {show,changeEditShow} = this.props;
        const {detail,depList,peopleList,loading} = this.state;
        return (
            <Motion style={{opacity:spring(show ? 1 : 0)}}>
                {({opacity}) =>
                    <div style={{opacity,zIndex:show?2:-1}} className={cssStyle.eventAddBox}>
                        <div className={cssStyle.editHeadBox}>
                            <div className={cssStyle.headName}>跟踪部门</div>
                            <Icon type="close" className={cssStyle.closeIcon} onClick={changeEditShow}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>部门</div>
                            <TreeSelect
                                value={detail.departmentId}
                                allowClear
                                onChange={this.dataEdit.bind(this, 2, 'departmentId')}
                                className={cssStyle.addRowContent}
                            >
                                {this.getTreeNode(depList)}
                            </TreeSelect>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>负责人</div>
                            <Select value={detail.userId} onChange={this.dataEdit.bind(this, 2, 'userId')} className={cssStyle.addRowContent}>
                                {peopleList.map((source,index)=>
                                    <Select.Option value={source.id} key={index}>{source.name}</Select.Option>
                                )}
                            </Select>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>后续跟踪</div>
                            <TextArea value={detail.eventContent} onChange={this.dataEdit.bind(this, 1, 'eventContent')} className={cssStyle.addRowTextArea}/>
                        </div>
                        <div className={cssStyle.editFootBox}>
                            <Button onClick={changeEditShow}>取消</Button>
                            <Button type="primary" onClick={this.addNewEvent.bind(this)} loading={loading}>确定</Button>
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}