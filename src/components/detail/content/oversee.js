import React from "react";
import cssStyle from './eventThirteen.module.css';
import {Icon, Input, InputNumber, Select, Button, Modal, TreeSelect, Upload} from "antd";
import axios from "axios";
import ReactDOM from "react-dom";

const { TextArea } = Input;
const { TreeNode } = TreeSelect;

export default class Oversee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {detail:{},depList:[],peopleList:[],fileList:[],loading:false};
        this.bodyId = global.editType ? 'canvas-view' : 'root';
    }

    //组件加载触发函数
    componentDidMount() {
        const depListUrl = this.props.serviceUrl + "/socialGovernance/common/getDepartmentTree";
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
        const peopleListUrl = this.props.serviceUrl + "/socialGovernance/common/getDepartmentUserListMobile";
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
        const {detail,fileList} = this.state;
        const sendData = {
            rbacToken:this.props.token,
            id:this.props.eventId,
            handleDepartmentId:detail.departmentId,
            handleUserId:detail.userId,
            instruction:detail.eventContent,
            handleDays:detail.limitTime,
            fileIds:fileList.map((file)=>{return file.id})
        };
        axios.post(this.props.serviceUrl+"/socialGovernance/warningEvent/sendToSuperviseAndSaveInstructions", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: '转入督办完成。',
                });
                this.props.changeEditShow();
                this.props.changeKeyParams();
                this.props.interactOther();
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
        this.setState({detail:{},fileList:[]})
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

    uploadFile(info){
        if (info.file.status === 'done') {
            const result = info.file.response;
            if(result.success){
                let { fileList } = this.state;
                fileList.push({id:result.data[0],name:info.file.name});
                this.setState({fileList});
            }else{
                Modal.error({
                    content: '上传失败！',
                });
            }
        }
    }

    deleteFile(index){
        let { fileList } = this.state;
        fileList.splice(index,1);
        this.setState({fileList});
    }

    render() {
        const {show,fileServiceUrl,changeEditShow} = this.props;
        const {detail,depList,peopleList,fileList,loading} = this.state;
        return (
            show ? ReactDOM.createPortal(
                (
                    <div className={cssStyle.editBg}>
                        <div className={cssStyle.eventAddBox}>
                            <div className={cssStyle.editHeadBox}>
                                <div className={cssStyle.headName}>转入督办</div>
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
                                <div className={cssStyle.addRowTitle}>督办批示</div>
                                <TextArea value={detail.eventContent} onChange={this.dataEdit.bind(this, 1, 'eventContent')} className={cssStyle.addRowTextArea}/>
                            </div>
                            <div className={cssStyle.eventAddRow} >
                                <div className={cssStyle.addRowTitle}>附件</div>
                                <div className={`${cssStyle.addRowContent} ${cssStyle.addFileRow}`}>
                                    <Upload
                                        name="files"
                                        showUploadList={false}
                                        action={fileServiceUrl + 'upload?rbacToken=' + this.props.token}
                                        onChange={this.uploadFile.bind(this)}
                                        multiple={true}
                                    >
                                        <div className={cssStyle.addFile}>上传附件</div>
                                    </Upload>
                                    {fileList.map((item,index)=>
                                        <div key={index} className={cssStyle.addFileName}>
                                            <div>{item.name+' '}</div>
                                            <Icon type="close-circle" className={cssStyle.delete} onClick={this.deleteFile.bind(this,index)}/>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={cssStyle.eventAddRow}>
                                <div className={cssStyle.addRowTitle}>反馈时间</div>
                                <div className={cssStyle.addRowContent}>
                                    <InputNumber value={detail.limitTime} className={cssStyle.limitTime} onChange={this.dataEdit.bind(this,2,'limitTime')} />
                                    &nbsp;天
                                </div>
                            </div>
                            <div className={cssStyle.editFootBox}>
                                <Button onClick={changeEditShow}>取消</Button>
                                <Button type="primary" onClick={this.addNewEvent.bind(this)} loading={loading}>确定</Button>
                            </div>
                        </div>
                    </div>
                ),
                document.getElementById(this.bodyId)
            ):null
        );
    }
}