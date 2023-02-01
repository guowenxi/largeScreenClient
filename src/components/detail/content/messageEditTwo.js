import React from "react";
import cssStyle from "./messageEditTwo.module.css";
import {Button, Modal} from "antd";
import axios from "axios";

import closeIcon from "../images/close.png";

export default class MessageEditTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading:false};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    closeEdit(){
        this.props.changeThisShow(false);
    }


    sendMessage(){
        const {keyParams} = this.props;
        if(!keyParams.depId && !keyParams.roadId){
            Modal.info({
                content: '请选择签收部门或街道！',
            });
            return;
        }else {
            if(keyParams.depId && !keyParams.depUsers){
                Modal.info({
                    content: '请选择部门签收人员！',
                });
                return;
            }
            if(keyParams.roadId && !keyParams.roadUsers){
                Modal.info({
                    content: '请选择街道签收人员！',
                });
                return;
            }
        }
        this.setState({loading:true});
        const sendData = {
            rbacToken:this.props.token,
            isEmphase:1,
            ...this.props.keyParams
        };
        axios.post("/fyPeaceConstruct/warningEvent/warningEventHandle", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: '已转入重点事。',
                });
                this.props.changeThisShow(false);
            }else{
                Modal.error({
                    content: response.data.message,
                });
            }
            this.setState({loading:false});
        }).catch( (error) => {
            Modal.error({
                content: '转入重点事请求出错！',
            });
            this.setState({loading:false});
        });
    }

    render() {
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.editContent}>
                    <img src={closeIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeEdit.bind(this)}/>
                    <div className={cssStyle.buttonBox}>
                        <Button type="primary" className={cssStyle.button} loading={this.state.loading} onClick={this.sendMessage.bind(this)}>确定</Button>
                        <Button className={cssStyle.buttonTwo} onClick={this.closeEdit.bind(this)}>取消</Button>
                    </div>
                </div>
            </div>
        );
    }
}