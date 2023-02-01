import React from "react";
import cssStyle from "./orderSendThree.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {Modal} from "antd";
import axios from "axios";

const { confirm } = Modal;

export default class OrderSendThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.limitTypeList = ['','小时','天','周']
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    sendOrder(){
        if(!this.props.detail.id){
            Modal.info({
                content: '请选择需发送的常态任务！'
            });
            return;
        }
        confirm({
            title: '确定要发送该常态任务吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    rbacToken: this.props.token,
                    planId: this.props.detail.id
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

    render() {
        const { detail } = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.head}>任务基本信息</div>
                <div className={cssStyle.contentOne}>
                    <Scrollbars>
                        <div className={cssStyle.row}>
                            <span className={cssStyle.title}>发布部门：</span>
                            <span>{detail.departmentName}</span>
                        </div>
                        <div className={cssStyle.row}>
                            <span className={cssStyle.title}>任务时长：</span>
                            <span>{detail.limitTime}{this.limitTypeList[detail.limitType]}</span>
                        </div>
                        <div className={cssStyle.row}>
                            <span className={cssStyle.title}>区域范围：</span>
                            <span>{detail.areaName}</span>
                        </div>
                        <div className={cssStyle.row}>
                            <span className={cssStyle.title}>触达层级：</span>
                            <span>{detail.level}</span>
                        </div>
                        <div className={cssStyle.row}>
                            <span className={cssStyle.title}>指令内容：</span>
                            <span>{detail.content}</span>
                        </div>
                        {/*{detail.type === 1 ? (*/}
                        {/*    <React.Fragment>*/}
                        {/*        <div className={cssStyle.row}>*/}
                        {/*            <span className={cssStyle.title}>指令形式：</span>*/}
                        {/*            <span>表单</span>*/}
                        {/*        </div>*/}
                        {/*        <div className={cssStyle.row}>*/}
                        {/*            <span className={cssStyle.title}>指令表单：</span>*/}
                        {/*            <span>{detail.formName}</span>*/}
                        {/*        </div>*/}
                        {/*    </React.Fragment>*/}
                        {/*):(*/}
                        {/*    <React.Fragment>*/}
                        {/*        <div className={cssStyle.row}>*/}
                        {/*            <span className={cssStyle.title}>指令形式：</span>*/}
                        {/*            <span>文字</span>*/}
                        {/*        </div>*/}
                        {/*        <div className={cssStyle.row}>*/}
                        {/*            <span className={cssStyle.title}>指令内容：</span>*/}
                        {/*            <span>{detail.content}</span>*/}
                        {/*        </div>*/}
                        {/*    </React.Fragment>*/}
                        {/*)}*/}
                    </Scrollbars>
                </div>
                <div className={cssStyle.head}>任务对象信息</div>
                <div className={cssStyle.totalRow}>共计{detail.groupNum?detail.groupNum:0}小队，{detail.peopleNum?detail.peopleNum:0}人</div>
                <div className={cssStyle.contentTwo}>
                    <div className={`${cssStyle.groupRow} ${cssStyle.groupTitle}`}>
                        <div className={cssStyle.groupName}>队伍名称</div>
                        <div className={cssStyle.groupNum}>人数</div>
                        <div className={cssStyle.groupLeader}>队长</div>
                        <div className={cssStyle.groupLeaderPhone}>队长联系方式</div>
                    </div>
                    <Scrollbars>
                        {detail.groupList && Array.isArray(detail.groupList) && detail.groupList.map((item,index)=>
                            <div className={cssStyle.groupRow} key={index}>
                                <div className={cssStyle.groupName}>{item.name}</div>
                                <div className={cssStyle.groupNum}>{item.num}</div>
                                <div className={cssStyle.groupLeader}>{item.leaderName}</div>
                                <div className={cssStyle.groupLeaderPhone}>{item.leaderPhone}</div>
                            </div>
                        )}
                    </Scrollbars>
                </div>
                <div className={cssStyle.buttonBox}>
                    <div className={cssStyle.button} onClick={this.sendOrder.bind(this)}>发布指令</div>
                </div>
            </div>
        );
    }
}