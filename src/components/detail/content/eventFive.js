import React from "react";
import cssStyle from "./eventFive.module.css";
import {Button, Modal} from "antd";
import axios from "axios";
import {eventTurnToUrl} from "../../../config";

const { confirm } = Modal;

export default class EventFive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasTurnTo:false,hasWarning:false};
        this.reasonType = ['','涉及重点人','涉及重点场所'];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }


    //转入指挥调度
    eventTurnTo(type){
        confirm({
            title: `确定要将该事件转入${type===1?'协同':'应急'}？`,
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const {detail} = this.props;
                const sendData = {
                    rbacToken:this.props.token,
                    id:detail.id,
                };
                const url = type === 1 ? '/socialGovernance/command/shiftToCommand':'/socialGovernance/emergencyProcess/warningToEmergency';
                return new Promise((resolve) => {
                    axios.post(eventTurnToUrl+url, sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            if(type === 1){
                                this.setState({hasTurnTo:true});
                            }else{
                                this.setState({hasWarning:true});
                            }
                            Modal.success({
                                content: `已转入${type===1?'协同':'应急'}。`,
                            });
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch( (error) => {
                        resolve();
                        Modal.error({
                            content: `转入${type===1?'协同':'应急'}请求出错！`,
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <table className={cssStyle.content}>
                    <tbody>
                    <tr>
                        <td className={cssStyle.trTitle}>事件名称：</td>
                        <td className={cssStyle.trContentOne}>{detail.title}</td>
                        <td className={cssStyle.trTitle}>事发时间：</td>
                        <td className={cssStyle.trContentTwo}>{detail.time}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>事件类别：</td>
                        <td className={cssStyle.trContentOne}>{detail.type}</td>
                        <td className={cssStyle.trTitle}>事件等级：</td>
                        <td className={cssStyle.trContentTwo}>{detail.level}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>现实行为：</td>
                        <td className={cssStyle.trContentOne}>{detail.action}</td>
                        <td className={cssStyle.trTitle}>事发街道：</td>
                        <td className={cssStyle.trContentTwo}>{detail.road}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>事发地点：</td>
                        <td className={cssStyle.trContentOne}>{detail.address}</td>
                        <td className={cssStyle.trTitle}>参与人数：</td>
                        <td className={cssStyle.trContentTwo}>{detail.joinNum}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>事件概述：</td>
                        <td className={cssStyle.trContent} colSpan={3}>{detail.content}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>事件来源：</td>
                        <td className={cssStyle.trContent} colSpan={3}>{detail.source}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>预警因子：</td>
                        <td className={cssStyle.trContent} colSpan={3}>
                            {detail.reasonList && detail.reasonList.map((reason,reasonIndex)=>
                                <div key={reasonIndex} className={cssStyle.reasonBox}>
                                    <div>{this.reasonType[reason.type]}</div>
                                    {reason.content && reason.content.map((item,index)=>
                                        <div key={index} className={cssStyle.reasonItem}>{item.name}{index < reason.content.length-1 ? '、':'。'}</div>
                                    )}
                                </div>
                            )}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className={cssStyle.buttonBox}>
                    {detail.isPlatform || this.state.hasTurnTo ? (
                        <Button type="primary" className={cssStyle.button} >已转入协同</Button>
                    ):(
                        <Button type="primary" onClick={this.eventTurnTo.bind(this,1)} className={cssStyle.button} >转入协同</Button>
                    )}
                    {detail.isWarning || this.state.hasWarning ? (
                        <Button type="danger" className={cssStyle.button} >已转入应急</Button>
                    ):(
                        <Button type="danger" onClick={this.eventTurnTo.bind(this,2)} className={cssStyle.button} >转入应急</Button>
                    )}
                </div>
            </div>
        );
    }
}