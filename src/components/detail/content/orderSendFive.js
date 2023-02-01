import React from "react";
import cssStyle from "./orderSendThree.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {Checkbox, Modal} from "antd";
import axios from "axios";

const { confirm } = Modal;

export default class OrderSendFive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {groupList:[]};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime){
            this.getRoadList();
        }
    }

    getRoadList(){
        const {roadListUrl} = this.props.thisData.style;
        if(roadListUrl){
            axios.get(roadListUrl,{params:{rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                if(response.data.success && response.data.data){
                    const result = response.data.data;
                    this.setState({groupList:result});
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

    render() {
        const { detail } = this.props;
        const { groupList,checkAll,indeterminate } = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.head}>预案指令名称</div>
                <div className={cssStyle.content}>
                    <span className={cssStyle.title}>{detail.name}</span>
                </div>
                <div className={cssStyle.head}>指令内容</div>
                <div className={cssStyle.content} style={{height:'8em'}}>
                    <Scrollbars>
                        {detail.content}
                    </Scrollbars>
                </div>
                <div className={cssStyle.head}>部门人员</div>
                <div className={cssStyle.contentOne} style={{height:'25%'}}>
                    <Scrollbars>
                        {detail.groupList && Array.isArray(detail.groupList) && detail.groupList.map((item,index)=>
                            <div className={cssStyle.row} key={index}>
                                <span className={cssStyle.title}>{item.name}</span>
                                <span >{` -- ${item.leaderName} (${item.leaderPhone})`}</span>
                            </div>
                        )}
                    </Scrollbars>
                </div>
                <div className={cssStyle.head}>镇街人员</div>
                <div className={cssStyle.totalRow} style={{paddingBottom:'0px'}}>
                    <Checkbox
                        className={cssStyle.checkbox}
                        indeterminate={indeterminate}
                        onChange={this.onCheckAllChange.bind(this)}
                        checked={checkAll}
                    >
                        全选
                    </Checkbox>
                </div>
                <div className={cssStyle.contentOne} style={{height:'25%',paddingTop:'0px'}}>
                    <Scrollbars>
                        <div className={cssStyle.checkboxList}>
                            {groupList && Array.isArray(groupList) && groupList.map((item,index)=>
                                <Checkbox
                                    key={index}
                                    className={cssStyle.checkbox}
                                    onClick={this.onCheckChange.bind(this,item)}
                                    checked={item.checked}
                                >
                                    {item.name}
                                </Checkbox>
                            )}
                        </div>
                    </Scrollbars>
                </div>
                <div className={cssStyle.buttonBox}>
                    <div className={cssStyle.button} onClick={this.sendOrder.bind(this)}>发布指令</div>
                </div>
            </div>
        );
    }
}