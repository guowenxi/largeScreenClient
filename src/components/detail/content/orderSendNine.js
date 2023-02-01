import React from "react";
import cssStyle from "./orderSendEight.module.css";
import {Modal, Button, Input} from "antd";
import axios from "axios";

const { confirm } = Modal;
const { TextArea } = Input;

export default class OrderSendNine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
            this.setState({});
            this.initListData();
        }
    }

    initListData(){
    }


    sendOrder(){
        confirm({
            title: '确定要督办吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    rbacToken: this.props.token,
                };
                return new Promise((resolve) => {
                    axios.post(this.props.styleData.fileUrl, sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '已督办。',
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
                            content: '督办失败',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    render() {
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <TextArea className={cssStyle.textArea} placeholder={'请输入督办批注'} />
                <div className={cssStyle.editFootBox}>
                    <Button >取消</Button>
                    <Button type="primary" >确定</Button>
                </div>
            </div>
        );
    }
}