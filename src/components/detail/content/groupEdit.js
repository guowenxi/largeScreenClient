import React from "react";
import cssStyle from "./groupEdit.module.css";
import {Input, Modal} from "antd";
import axios from "axios";
import {interactData} from "../../../common/util";

const { confirm } = Modal;

export default class GroupEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {message:{roadCadreName:'',roadCadrePhone:'',firstSecretaryName:'',firstSecretaryPhone:'',organCadresName:'',organCadresPhone:''}};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime){
            const { detail } = this.props;
            let message = {roadCadreName:'',roadCadrePhone:'',firstSecretaryName:'',firstSecretaryPhone:'',organCadresName:'',organCadresPhone:''};
            if(detail){
                detail.forEach((item,index)=>{
                    if(item){
                        if(index === 0){
                            message.roadCadreName = item.name;
                            message.roadCadrePhone = item.phone;
                        }else if(index === 1){
                            message.firstSecretaryName = item.name;
                            message.firstSecretaryPhone = item.phone;
                        }else if(index === 2){
                            message.organCadresName = item.name;
                            message.organCadresPhone = item.phone;
                        }
                    }
                });
            }
            this.setState({message});
        }
    }

    changeData(key,event){
        let {message} = this.state;
        message[key] = event.target.value;
        this.setState({message});
    }

    saveEdit(){
        confirm({
            title: '确定要保存当前整治小组成员信息吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    ...this.state.message,
                    orgCommunity:this.props.keyParams.roadId,
                    rbacToken: this.props.token
                };
                return new Promise((resolve) => {
                    axios.post(this.props.styleData.fileUrl, sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '已保存。',
                            });
                            const { interact } = this.props.thisData.dataSources;
                            this.interactData(interact);
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch(function (error) {
                        resolve();
                        Modal.error({
                            content: '保存失败',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    // cancelEdit(){
    //     const { interact } = this.props.thisData.dataSources;
    //     this.interactData(interact);
    // }

    cancelEdit(){
        this.props.changeKeyParams();
    }

    render() {
        const { roadCadreName,roadCadrePhone,firstSecretaryName,firstSecretaryPhone,organCadresName,organCadresPhone } = this.state.message;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.row}>
                    <div className={cssStyle.title}>镇级干部</div>
                    <Input value={roadCadreName} className={cssStyle.input} onChange={this.changeData.bind(this, 'roadCadreName')} placeholder={'请输入姓名'} />
                    <Input value={roadCadrePhone} className={cssStyle.input} onChange={this.changeData.bind(this, 'roadCadrePhone')} placeholder={'请输入联系方式'} />
                </div>
                <div className={cssStyle.row}>
                    <div className={cssStyle.title}>第一书记</div>
                    <Input value={firstSecretaryName} className={cssStyle.input} onChange={this.changeData.bind(this, 'firstSecretaryName')} placeholder={'请输入姓名'} />
                    <Input value={firstSecretaryPhone} className={cssStyle.input} onChange={this.changeData.bind(this, 'firstSecretaryPhone')} placeholder={'请输入联系方式'} />
                </div>
                <div className={cssStyle.row}>
                    <div className={cssStyle.title}>机关干部</div>
                    <Input value={organCadresName} className={cssStyle.input} onChange={this.changeData.bind(this, 'organCadresName')} placeholder={'请输入姓名'} />
                    <Input value={organCadresPhone} className={cssStyle.input} onChange={this.changeData.bind(this, 'organCadresPhone')} placeholder={'请输入联系方式'} />
                </div>
                <div className={cssStyle.buttonBox}>
                    <div className={cssStyle.saveButton} onClick={this.saveEdit.bind(this)}>确定</div>
                    <div className={cssStyle.cancelButton} onClick={this.cancelEdit.bind(this)}>还原</div>
                </div>
            </div>
        );
    }
}