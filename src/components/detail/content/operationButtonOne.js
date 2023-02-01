import React from "react";
import cssStyle from "./operationButtonOne.module.css";
import ReactDOM from "react-dom";
import {Button, Icon, Input, Modal} from "antd";
import axios from "axios";

const { confirm } = Modal;
const { TextArea } = Input;

export default class OperationButtonOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,text:''};
        this.bodyId = global.editType ? 'canvas-view' : 'root';
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    changeEditShow(flag){
        this.setState({showEdit:flag});
    }

    sendMessage(){
        confirm({
            title: '确定发送短信提醒吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    rbacToken: this.props.token,
                    configId: this.props.keyParams.configId,
                    content: this.state.text
                };
                return new Promise((resolve) => {
                    axios.post(this.props.styleData.fileUrl+'/fyWisdomGovern/screen/sendSMSForUnCheck', sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '已发送。',
                            });
                            this.setState({showEdit:false,text:''});
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

    exportList(){
        window.open(this.props.styleData.fileUrl+"/fyWisdomGovern/screen/unCheckExportExcel?rbacToken="+this.props.token+"&configId="+this.props.keyParams.configId);
    }

    render() {
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.sendButton} onClick={this.changeEditShow.bind(this,true)}>短信提醒</div>
                <div className={cssStyle.exportButton} onClick={this.exportList.bind(this)}>导出名单</div>
                {this.state.showEdit && ReactDOM.createPortal(
                    (
                        <div className={cssStyle.editBg} style={{fontSize:this.props.style.fontSize}}>
                            <div className={cssStyle.editBox} >
                                <div className={cssStyle.headBox}>
                                    <span className={cssStyle.head}>短信通知</span>
                                    <Icon className={cssStyle.close} onClick={this.changeEditShow.bind(this,false)} type="close" />
                                </div>
                                <TextArea className={cssStyle.textArea} value={this.state.text} onChange={(event)=>this.setState({text:event.target.value})} />
                                <div className={cssStyle.editButtonBox}>
                                    <Button type="primary" className={cssStyle.button} onClick={this.sendMessage.bind(this)}>发送短信</Button>
                                    <Button className={cssStyle.button} onClick={this.changeEditShow.bind(this,false)}>取消</Button>
                                </div>
                            </div>
                        </div>
                    ),
                    document.getElementById(this.bodyId)
                )}
            </div>
        );
    }
}