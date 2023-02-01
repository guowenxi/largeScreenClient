import React from "react";
import cssStyle from "./orderSendEight.module.css";
import {Modal, Select, Button} from "antd";
import axios from "axios";

const { confirm } = Modal;

export default class OrderSendEight extends React.Component {
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
            title: '确定要交办吗？',
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
                                content: '已交办。',
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
                            content: '交办失败',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    changeData(key,type,event,option){
        this.setState({[key]:type === 1 ? event.target.value : event});
    }

    render() {
        const { system } = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.headName}>请选择要流转的系统</div>
                <Select value={system} className={cssStyle.select} onChange={this.changeData.bind(this,'system',2)} >
                    <Select.Option value={'1'} >信访12345</Select.Option>
                    <Select.Option value={'2'} >四平台</Select.Option>
                </Select>
                <div className={cssStyle.editFootBox}>
                    <Button >取消</Button>
                    <Button type="primary" >确定</Button>
                </div>
            </div>
        );
    }
}