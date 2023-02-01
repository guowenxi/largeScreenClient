import React from "react";
import cssStyle from "./orderSendTwo.module.css";
import {Button, DatePicker, Icon, Input, Modal, Select, Tree, Upload} from "antd";
import "./orderSendTwo.css";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from "moment";
import "../../../common/css/antdDatePicker.css";
import axios from "axios";
import ReactDOM from "react-dom";
import {Scrollbars} from "react-custom-scrollbars";

moment.locale('zh-cn');

const { TextArea } = Input;
const { TreeNode } = Tree;
const { confirm } = Modal;

export default class OrderSendTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sendData:{},typeList:[],peopleList:[],selectedPeople:[],selectedPeopleList:[],peopleListShow:false,checkedKeys:[],fileList:[]};
        this.planName = {};
        this.bodyId = global.editType ? 'canvas-view' : 'root';
        this.levelKey = ['community','peopleType','people'];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.getListData();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime){
            //隐藏单兵控件
            this.reSetData();
        }
    }

    reSetData(){
        this.setState({sendData:{},selectedPeople:[],selectedPeopleList:[],peopleListShow:false,checkedKeys:[],fileList:[]});
    }

    closeThis(){
        this.props.changeThisShow(false);
    }

    changeValue(type,key,event,e){
        let {sendData} = this.state;
        sendData[key] = type === 1 ? event.target.value : event;
        if(key === 'taskTypeId'){
            sendData.taskTypeName = e.props.title;
        }
        this.setState({sendData});
    }

    getListData(){
        const {typeListUrl,peopleListUrl} = this.props.styleData;
        if(typeListUrl){
            axios.get(typeListUrl,{params:{rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                if(response.data && response.data.data){
                    this.setState({typeList:response.data.data});
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
        if(peopleListUrl){
            axios.get(peopleListUrl,{params:{rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                if(response.data && response.data.data){
                    this.setState({peopleList:response.data.data});
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    changePeopleSelectShow(flag){
        this.setState({peopleListShow:flag});
    }

    changePeopleSelected(){
        this.setState({selectedPeople:this.state.selectedPeopleList,peopleListShow:false});
    }

    getTreeNode(list,level,parentId){
        if(list){
            return list.map((item,index)=>{
                if(item[this.levelKey[level]]){
                    if(level === 0){
                        this.defaultExpandedKeys.push(parentId+'_'+item.id);
                    }
                    return (
                        <TreeNode key={parentId+'_'+item.id} title={item.name} >
                            {this.getTreeNode(item[this.levelKey[level]],level+1,parentId+'_'+item.id)}
                        </TreeNode>
                    );
                }else{
                    return <TreeNode key={parentId+'_'+item.id} title={item.name}/>
                }
            });
        }
    }

    treeCheck(checkedKeys, info){
        let selectedPeopleList = [];
        let selectedPeopleIdList = [];
        info.checkedNodes.forEach((item)=>{
            const keyPart = item.key.split('_');
            if(keyPart.length === 5 && selectedPeopleIdList.indexOf(keyPart[4]) < 0){
                selectedPeopleList.push({id:keyPart[4],name:item.props.title});
                selectedPeopleIdList.push(keyPart[4]);
            }
        });
        this.setState({ checkedKeys,selectedPeopleList });
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

    sendOrder(){
        const {sendData,selectedPeople,fileList} = this.state;
        const {taskName,taskTypeId,taskTypeName,integral,date,taskContent} = sendData;
        if(!taskName){
            Modal.info({
                content: '请输入任务名称。',
            });
            return;
        }
        if(!taskTypeId){
            Modal.info({
                content: '请选择任务类型。',
            });
            return;
        }
        if(!selectedPeople || selectedPeople.length === 0){
            Modal.info({
                content: '请选择人员。',
            });
            return;
        }
        if(!integral){
            Modal.info({
                content: '请输入建议积分。',
            });
            return;
        }
        if(!date){
            Modal.info({
                content: '请选择截止时间。',
            });
            return;
        }
        if(!taskContent){
            Modal.info({
                content: '请输入任务说明。',
            });
            return;
        }
        confirm({
            title: '确定要向所选人员指派任务吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    rbacToken: this.props.token,
                    cutOffTime: date.format('YYYY-MM-DD HH:mm:ss'),
                    files:fileList,
                    integral,
                    person:selectedPeople,
                    taskContent,
                    taskName,
                    taskTypeId,
                    taskTypeName,
                    urlType:'parw_street'
                };
                return new Promise((resolve) => {
                    axios.post(this.props.styleData.sendUrl, sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            this.props.changeThisShow(false);
                            this.reSetData();
                            Modal.success({
                                content: '任务已指派。',
                            });
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch(function (error) {
                        resolve();
                        Modal.error({
                            content: '任务指派失败',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    getPeopleSelect(){
        let {peopleList,selectedPeopleList} = this.state;
        this.defaultExpandedKeys = [];
        const treeDom = this.getTreeNode(peopleList.street,0,0);
        return ReactDOM.createPortal(
            (
                <div className={`${cssStyle.box} ${cssStyle.peopleSelectBg} orderSendTwoBox`} style={{fontSize:this.props.style.fontSize}}>
                    <div className={cssStyle.peopleSelectBox}>
                        <div className={cssStyle.selectHeadBox}>人员选择</div>
                        <Icon type="close-circle" theme="filled" onClick={this.changePeopleSelectShow.bind(this,false)} className={cssStyle.closeIcon} />
                        <div className={cssStyle.selectContent}>
                            <div className={cssStyle.treeBox}>
                                <Scrollbars >
                                    <Tree
                                        defaultExpandedKeys={this.defaultExpandedKeys}
                                        checkable
                                        selectable={false}
                                        checkedKeys={this.state.checkedKeys}
                                        onCheck={this.treeCheck.bind(this)}
                                    >
                                        {treeDom}
                                    </Tree>
                                </Scrollbars>
                            </div>
                            <div className={cssStyle.selectedBox}>
                                <table className={cssStyle.table}>
                                    <tbody>
                                    <tr>
                                        <td className={cssStyle.index}>序号</td>
                                        <td className={cssStyle.name}>人员</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div className={cssStyle.tableContent}>
                                    <Scrollbars >
                                        <table className={cssStyle.table}>
                                            <tbody>
                                            {selectedPeopleList && selectedPeopleList.map((item,index)=>
                                                <tr key={item.id}>
                                                    <td className={cssStyle.index}>{index+1}</td>
                                                    <td className={cssStyle.name}>{item.name}</td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </Scrollbars>
                                </div>
                            </div>
                        </div>
                        <div className={cssStyle.footBox}>
                            <Button className={cssStyle.button} onClick={this.changePeopleSelectShow.bind(this,false)}>取消</Button>
                            <Button className={cssStyle.button} type="primary" onClick={this.changePeopleSelected.bind(this)} >确定</Button>
                        </div>
                    </div>
                </div>
            ),
            document.getElementById(this.bodyId)
        )
    }

    render() {
        const {styleData} = this.props;
        let {sendData,typeList,selectedPeople,peopleListShow,fileList} = this.state;
        return (
            <div style={this.props.style} className={`${cssStyle.box} orderSendTwoBox`} >
                <div className={cssStyle.backgroundBox} style={{width:styleData.width,height:styleData.height,left:styleData.left,top:styleData.top}}>
                    <div className={cssStyle.head}>任务指派</div>
                    <Icon type="close-circle" theme="filled" onClick={this.closeThis.bind(this)} className={cssStyle.closeIcon} />
                    <div className={cssStyle.lineBox} >
                        <div className={cssStyle.rowPart} >
                            <div className={cssStyle.red}>*</div>
                            <div className={cssStyle.title}>任务名称</div>
                            <Input value={sendData.taskName} className={cssStyle.input} placeholder={'请输入任务名称'} onChange={this.changeValue.bind(this,1,'taskName')} />
                        </div>
                        <div className={cssStyle.rowPart} >
                            <div className={cssStyle.red}>*</div>
                            <div className={cssStyle.title}>任务类型</div>
                            <Select value={sendData.taskTypeId} className={cssStyle.select} placeholder={'请选择任务类型'} onChange={this.changeValue.bind(this,2,'taskTypeId')} >
                                {typeList && typeList.map((item,index)=>
                                    <Select.Option value={item.id} key={index} title={item.name} >{item.name}</Select.Option>
                                )}
                            </Select>
                        </div>
                    </div>
                    <div className={cssStyle.lineBox} >
                        <div className={cssStyle.row} >
                            <div className={cssStyle.red}>*</div>
                            <div className={cssStyle.title}>人员</div>
                            <div className={cssStyle.peopleBox} onClick={this.changePeopleSelectShow.bind(this)}>
                                <Scrollbars style={{height:'8em'}}>
                                    {selectedPeople.length ? (
                                        selectedPeople.map((item,index)=>
                                            <div key={index} className={cssStyle.peopleName}>{item.name}</div>
                                        )
                                    ):(
                                        <div className={cssStyle.selectPeople}>点击选择人员</div>
                                    )}
                                </Scrollbars>
                            </div>
                        </div>
                    </div>
                    <div className={cssStyle.lineBox} >
                        <div className={cssStyle.rowPart} >
                            <div className={cssStyle.red}>*</div>
                            <div className={cssStyle.title}>建议积分</div>
                            <Input value={sendData.integral} className={cssStyle.input} placeholder={'请输入建议积分'} onChange={this.changeValue.bind(this,1,'integral')} />
                        </div>
                        <div className={cssStyle.rowPart} >
                            <div className={cssStyle.red}>*</div>
                            <div className={cssStyle.title}>截止时间</div>
                            <DatePicker value={sendData.date} showTime placeholder="请选择截止时间" className={cssStyle.datePicker} locale={locale} onChange={this.changeValue.bind(this,2,'date')} />
                        </div>
                    </div>
                    <div className={cssStyle.lineBox} >
                        <div className={cssStyle.row} >
                            <div className={cssStyle.red}>*</div>
                            <div className={cssStyle.title}>任务说明</div>
                            <TextArea value={sendData.taskContent} className={cssStyle.textArea} placeholder={'请输入任务说明'} onChange={this.changeValue.bind(this,1,'taskContent')} />
                        </div>
                    </div>
                    <div className={cssStyle.lineBox} >
                        <div className={cssStyle.row} >
                            <div className={cssStyle.title}>附件</div>
                            <div className={cssStyle.fileBox}>
                                <Scrollbars >
                                    <Upload
                                        name="files"
                                        className={cssStyle.addFile}
                                        showUploadList={false}
                                        action={styleData.fileServiceUrl + '?rbacToken=' + this.props.token}
                                        onChange={this.uploadFile.bind(this)}
                                        multiple={true}
                                    >
                                        上传附件
                                    </Upload>
                                    {fileList.map((item,index)=>
                                        <div key={index} className={cssStyle.fileName}>
                                            <div>{item.name}</div>
                                            <Icon type="close-circle" className={cssStyle.delete} onClick={this.deleteFile.bind(this,index)}/>
                                        </div>
                                    )}
                                </Scrollbars>
                            </div>
                        </div>
                    </div>
                    <div className={cssStyle.footBox}>
                        <Button className={cssStyle.button} onClick={this.closeThis.bind(this)}>取消</Button>
                        <Button className={cssStyle.button} type="primary" onClick={this.sendOrder.bind(this,false)} >指派</Button>
                    </div>
                </div>
                {peopleListShow && this.getPeopleSelect()}
            </div>
        );
    }
}