import React from "react";
import cssStyle from "./orderSendFour.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {Checkbox, Input, InputNumber, Modal, Radio, Select} from "antd";
import axios from "axios";
import "../../antd_select/antd_select.css";
import Icon from "../images/icon.png";
import {Motion, spring} from "react-motion";

const { confirm } = Modal;
const { TextArea } = Input;

export default class OrderSendFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sendData:{},planShow:false,planId:undefined,departmentList:[],planList:[],roadList:[],communityList:[],groupList:[]};
        this.limitTypeList = [{id:1,name:'时'},{id:2,name:'天'},{id:3,name:'周'}];
        this.levelList = [{id:1,name:'乡镇街道'},{id:2,name:'村社'}];
        this.typeList = [{id:1,name:'表单'},{id:2,name:'文字'}];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        const {depListUrl,planListUrl,roadListUrl} = this.props.thisData.style;
        this.getListData(depListUrl,'departmentList');
        this.getListData(planListUrl,'planList');
        this.getListData(roadListUrl,'roadList');
    }

    getListData(url,key,params){
        if(url){
            axios.get(url,{params:{...params,rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                if(response.data.success && response.data.data){
                    this.setState({[key]:response.data.data});
                    if(key === 'groupList'){
                        this.setState({indeterminate:false,checkAll:false})
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    handleSearch(value){
        const {style} = this.props.thisData;
        let sendData = {};
        sendData[style.planSearchKey] = value;
        this.getListData(style.planListUrl,'planList',sendData);
    }

    getPlanData(id){
        this.setState({planId:id});
        const {planDetailUrl} = this.props.thisData.style;
        if(planDetailUrl){
            axios.get(planDetailUrl,{params:{id,rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                if(response.data.success && response.data.data){
                    const result = response.data.data;
                    this.setState({sendData:result});
                    if(result.roadId){
                        const {communityListUrl} = this.props.thisData.style;
                        this.getListData(communityListUrl,'communityList',{id:result.roadId});
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    sendOrder(type){
        confirm({
            title: '确定要发送该常态任务吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    rbacToken: this.props.token,
                    type,
                    ...this.state.sendData
                };
                return new Promise((resolve) => {
                    axios.post(this.props.styleData.fileUrl, sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '已发送。',
                            });
                            this.setState({sendData:{}});
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

    changeData(key,type,event){
        let {sendData} = this.state;
        sendData[key] = type===1 ? event.target.value : event;
        this.setState({sendData},()=>{
            if(key === 'roadId'){
                const {communityListUrl} = this.props.thisData.style;
                this.getListData(communityListUrl,'communityList',{id:event});
            }else if('department,roadId,communityId'.indexOf(key) >= 0){
                const {groupListUrl} = this.props.thisData.style;
                const {department,roadId,communityId} = this.state.sendData;
                this.getListData(groupListUrl,'groupList',{department,roadId,communityId});
            }
        });
    }

    changePlanShow(){
        const planShow = !this.state.planShow;
        if(planShow && !this.state.sendData.department){
            Modal.info({
                content: '请先选择发布部门',
            });
        }else{
            this.setState({planShow});
        }
    }

    onCheckChange(item){
        let {groupList} = this.state;
        let checkAll = true;
        let indeterminate = false;
        item.checked = !item.checked;
        groupList.forEach((item)=>{
            if(item.checked){
                indeterminate = true;
            }else{
                checkAll = false;
            }
        });
        if(checkAll){
            indeterminate = false;
        }
        this.setState({checkAll,indeterminate,groupList});
    }

    onCheckAllChange(){
        const checkAll = !this.state.checkAll;
        let {groupList} = this.state;
        groupList.forEach((item)=>{
            item.checked = checkAll;
        });
        if(checkAll){
            this.setState({checkAll:true,indeterminate:false,isRandom:false,groupList});
        }else{
            this.setState({checkAll:false,indeterminate:false,isRandom:false,groupList});
        }
    }

    changeRandomNum(num){
        this.setState({randomNum:num},()=>{
            this.randomGroup();
        });
    }

    randomGroup(){
        let {randomNum,groupList} = this.state;
        if(randomNum){
            if(randomNum >= groupList.length){
                groupList.forEach((group)=>{
                    group.checked = true;
                });
                this.setState({checkAll:true,indeterminate:false,isRandom:true,groupList});
            }else{
                let randomList = [];
                for(let i = 0;i < randomNum;i ++){
                    randomList[i] = Math.floor(Math.random()*groupList.length);
                    for(let j = 0;j < i;j ++){
                        if(randomList[i] === randomList[j]){
                            i --;
                            break;
                        }
                    }
                }
                groupList.forEach((group,index)=>{
                    if(randomList.indexOf(index) >= 0){
                        group.checked = true;
                    }else{
                        group.checked = false;
                    }
                });
                this.setState({checkAll:false,indeterminate:true,isRandom:true,groupList});
            }
        }
    }

    render() {
        const {sendData,departmentList,planShow,planId,planList,roadList,communityList,groupList,checkAll,indeterminate,isRandom,randomNum} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.head}>任务基本信息</div>
                <div className={`${cssStyle.contentOne} antdSelectThemeOne`}>
                    <Scrollbars>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}><span className={cssStyle.red}>*</span>请选择发布部门：</div>
                            <Select
                                value={sendData.department}
                                className={cssStyle.input}
                                onChange={this.changeData.bind(this,'department',2)}
                                placeholder=""
                                dropdownClassName={'antdSelectDropThemeOne'}
                            >
                                {departmentList && departmentList.map((item,index) =>
                                    <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                                )}
                            </Select>
                            <img alt={''} src={Icon} className={cssStyle.icon} onClick={this.changePlanShow.bind(this)} />
                        </div>
                        <Motion style={{height:spring(planShow ? 2.5 : 0)}}>
                            {({height}) =>
                                <div style={{height:height+'em'}} className={cssStyle.row}>
                                    <div className={cssStyle.title}><span className={cssStyle.hide}>*</span>请选择模板任务：</div>
                                    <Select
                                        value={planId}
                                        className={cssStyle.input}
                                        onSearch={this.handleSearch.bind(this)}
                                        onChange={this.getPlanData.bind(this)}
                                        placeholder=""
                                        dropdownClassName={'antdSelectDropThemeOne'}
                                    >
                                        {planList && planList.map((item,index) =>
                                            <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                                        )}
                                    </Select>
                                </div>
                            }
                        </Motion>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}><span className={cssStyle.red}>*</span>请输入任务名称：</div>
                            <Input value={sendData.name} onChange={this.changeData.bind(this,'name',1)} placeholder="" className={`${cssStyle.input}`} />
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}><span className={cssStyle.red}>*</span>请选择区域范围：</div>
                            <Select
                                value={sendData.roadId}
                                className={`${cssStyle.input} ${cssStyle.limitTime}`}
                                onChange={this.changeData.bind(this,'roadId',2)}
                                placeholder="镇街"
                                dropdownClassName={'antdSelectDropThemeOne'}
                            >
                                {roadList.map((item,index) =>
                                    <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                                )}
                            </Select>
                            {sendData.roadId && (
                                <Select
                                    value={sendData.communityId}
                                    className={`${cssStyle.input} ${cssStyle.limitType}`}
                                    onChange={this.changeData.bind(this,'communityId',2)}
                                    placeholder="村社"
                                    dropdownClassName={'antdSelectDropThemeOne'}
                                >
                                    {communityList.map((item,index) =>
                                        <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                                    )}
                                </Select>
                            )}
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}><span className={cssStyle.red}>*</span>请选择触达层级：</div>
                            <Select
                                value={sendData.level}
                                className={cssStyle.input}
                                onChange={this.changeData.bind(this,'level',2)}
                                placeholder=""
                                dropdownClassName={'antdSelectDropThemeOne'}
                            >
                                {this.levelList.map((item,index) =>
                                    <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                                )}
                            </Select>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}><span className={cssStyle.red}>*</span>请输入任务时长：</div>
                            <InputNumber value={sendData.limitTime} onChange={this.changeData.bind(this,'limitTime',2)} placeholder="" className={`${cssStyle.input} ${cssStyle.limitTime}`} />
                            <Select
                                value={sendData.limitType}
                                className={`${cssStyle.input} ${cssStyle.limitType}`}
                                onChange={this.changeData.bind(this,'limitType',2)}
                                placeholder=""
                                dropdownClassName={'antdSelectDropThemeOne'}
                            >
                                {this.limitTypeList.map((item,index) =>
                                    <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                                )}
                            </Select>
                        </div>
                        <div className={cssStyle.row} style={{height:'auto'}}>
                            <div className={cssStyle.title}><span className={cssStyle.red}>*</span>请输入指令内容：</div>
                            <TextArea value={sendData.content} onChange={this.changeData.bind(this,'content',1)} placeholder="" className={`${cssStyle.input} ${cssStyle.textArea}`} />
                        </div>
                        {/*<div className={cssStyle.row}>*/}
                        {/*    <div className={cssStyle.title}><span className={cssStyle.red}>*</span>请选择指令形式：</div>*/}
                        {/*    <Select*/}
                        {/*        value={sendData.type}*/}
                        {/*        className={cssStyle.input}*/}
                        {/*        onChange={this.changeData.bind(this,'type',2)}*/}
                        {/*        placeholder=""*/}
                        {/*        dropdownClassName={'antdSelectDropThemeOne'}*/}
                        {/*    >*/}
                        {/*        {this.typeList.map((item,index) =>*/}
                        {/*            <Select.Option value={item.id} key={index}>{item.name}</Select.Option>*/}
                        {/*        )}*/}
                        {/*    </Select>*/}
                        {/*</div>*/}
                        {/*{sendData.type && (*/}
                        {/*    sendData.type === 1 ? (*/}
                        {/*        <React.Fragment>*/}
                        {/*            <div className={cssStyle.row}>*/}
                        {/*                <div className={cssStyle.title}><span className={cssStyle.red}>*</span>请选择指令表单：</div>*/}
                        {/*                <Select*/}
                        {/*                    value={sendData.department}*/}
                        {/*                    className={cssStyle.input}*/}
                        {/*                    onChange={this.changeData.bind(this,'department',2)}*/}
                        {/*                    placeholder=""*/}
                        {/*                    dropdownClassName={'antdSelectDropThemeOne'}*/}
                        {/*                >*/}
                        {/*                    {departmentList && departmentList.map((item,index) =>*/}
                        {/*                        <Select.Option value={item.id} key={index}>{item.name}</Select.Option>*/}
                        {/*                    )}*/}
                        {/*                </Select>*/}
                        {/*            </div>*/}
                        {/*        </React.Fragment>*/}
                        {/*    ):(*/}
                        {/*        <React.Fragment>*/}
                        {/*            <div className={cssStyle.row} style={{height:'auto'}}>*/}
                        {/*                <div className={cssStyle.title}><span className={cssStyle.red}>*</span>请输入指令内容：</div>*/}
                        {/*                <TextArea value={sendData.content} onChange={this.changeData.bind(this,'content',1)} placeholder="" className={`${cssStyle.input} ${cssStyle.textArea}`} />*/}
                        {/*            </div>*/}
                        {/*        </React.Fragment>*/}
                        {/*    )*/}
                        {/*)}*/}
                    </Scrollbars>
                </div>
                <div className={cssStyle.head}>选择任务对象</div>
                <div className={cssStyle.totalRow}>
                    <Checkbox
                        className={cssStyle.checkbox}
                        indeterminate={indeterminate}
                        onChange={this.onCheckAllChange.bind(this)}
                        checked={checkAll}
                    >
                        全选
                    </Checkbox>
                    <Radio className={cssStyle.checkbox} checked={isRandom} onClick={this.randomGroup.bind(this)}>随机</Radio>
                    <InputNumber  value={randomNum} onChange={this.changeRandomNum.bind(this)} placeholder="" className={`${cssStyle.input} ${cssStyle.limitTime}`} />
                    <span>队</span>
                </div>
                <div className={cssStyle.contentTwo}>
                    <Scrollbars>
                        {groupList && Array.isArray(groupList) && groupList.map((item,index)=>
                            <Checkbox
                                key={index}
                                className={cssStyle.checkbox}
                                onClick={this.onCheckChange.bind(this,item)}
                                checked={item.checked}
                            >
                                {`${item.name}（村社预编组${item.groupNum}队，共${item.peopleNum}人）`}
                            </Checkbox>
                        )}
                    </Scrollbars>
                </div>
                <div className={cssStyle.buttonBox}>
                    <div className={cssStyle.button} onClick={this.sendOrder.bind(this,1)}>发布指令</div>
                    <div className={cssStyle.buttonTwo} onClick={this.sendOrder.bind(this,2)}>发布并保存为常态</div>
                </div>
            </div>
        );
    }
}