import React from "react";
import cssStyle from "./equipmentDesignate.module.css";
import {Button, Checkbox, Icon, Input, Modal} from "antd";
import {interactData} from "../../../common/util";

import onlineIcon from "../images/equipmentOnline.svg";
import offlineIcon from "../images/equipmentOffline.svg";
import {Scrollbars} from "react-custom-scrollbars";
import axios from "axios";
import {emergencyUrl} from "../../../config";

const { TextArea } = Input;
const { confirm } = Modal;

export default class EquipmentDesignate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showIndex:-1,missionContent:'',drone:false};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    closeDesignate(){
        this.props.changeThisShow(false);
    }

    getButtonText(excuteType){
        switch (excuteType) {
            case 1:
                return '指派';
            case 2:
                return '已指派';
            case 3:
                return '任务中';
            case 4:
                return '离线';
            case 5:
                return '已拒绝';
            default:
                return '';
        }
    }

    cancelDesignate(type){
        confirm({
            title: '确定要'+(type===4?'取消':'结束')+'该人员的任务吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    rbacToken:this.props.token,
                    emergencyId:this.props.keyParams.emergencyId,
                    equipmentId:this.props.detail.data[this.state.showIndex].id,
                    excuteType:type,
                    content:''
                };
                return new Promise((resolve) => {
                    axios.post(emergencyUrl+"/socialGovernance/equipment/anwser",sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: type===4?'已取消任务':'已结束任务',
                            });
                            this.props.changeKeyParams({});
                            this.setState({missionContent:'',drone:false});
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch( (error) => {
                        resolve();
                        Modal.error({
                            content: (type===4?'取消':'结束')+'任务请求出错！',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    getDetailContent(item){
        if(item.excuteType === 1 || item.excuteType === 5){
            //可指派
            return (
                <div className={cssStyle.detailBox}>
                    <TextArea value={this.state.missionContent} className={cssStyle.textarea} placeholder='请输入任务明细' onChange={this.editData.bind(this,'missionContent')}/>
                    <div className={cssStyle.buttonBox}>
                        <Checkbox checked={this.state.drone} className={cssStyle.checkbox} onChange={this.editData.bind(this,'drone')}>携带无人机</Checkbox>
                        <Button className={cssStyle.sendButton} type="primary" onClick={this.sendDesignate.bind(this)} >发送</Button>
                    </div>
                </div>
            );
        }else if(item.excuteType === 2){
            //已指派待确认
            return (
                <div className={cssStyle.detailBox}>
                    <div className={cssStyle.detailLine}>任务明细：{item.content}</div>
                    <div className={cssStyle.detailLine}>是否携带无人机：{item.isDrone === 1 ? '是':'否'}</div>
                    <div className={cssStyle.detailLine}>指派状态：待确认</div>
                    <div className={cssStyle.buttonBox}>
                        <Button className={cssStyle.sendButton} type="danger" onClick={this.cancelDesignate.bind(this,4)} >取消指派</Button>
                    </div>
                </div>
            );
        }else if(item.excuteType === 3){
            //任务中
            return (
                <div className={cssStyle.detailBox}>
                    当前设备正在任务中，请于“正在进行的视频流”处
                    <div className={cssStyle.buttonBox}>
                        <Button className={cssStyle.sendButton} type="danger" onClick={this.cancelDesignate.bind(this,3)} >结束指派</Button>
                    </div>
                </div>
            );
        }else{
            //离线
            return (
                <div className={cssStyle.detailBox}>
                    {item.reason}
                </div>
            );
        }
    }

    editData(key,e){
        let data = {};
        if(key === 'drone'){
            data[key] = e.target.checked;
        }else{
            data[key] = e.target.value;
        }
        this.setState(data);
    }

    changeDetailShow(index){
        this.setState({showIndex:this.state.showIndex === index ? -1:index,missionContent:'',drone:false});
    }

    sendDesignate(){
        confirm({
            title: '确定要指派人员携带该设备'+(this.state.drone ? '和无人机':'')+'进行任务吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    rbacToken:this.props.token,
                    drone:this.state.drone?1:0,
                    missionContent:this.state.missionContent,
                    emergencyId:this.props.keyParams.emergencyId,
                    equipmentId:this.props.detail.data[this.state.showIndex].id
                };
                return new Promise((resolve) => {
                    axios.post(emergencyUrl+"/socialGovernance/equipment/appoint",sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            this.props.changeKeyParams({});
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch( (error) => {
                        resolve();
                        Modal.error({
                            content: '指派人员请求出错！',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    render() {
        const {detail} = this.props;
        const list = detail ? detail.data : [];
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.titleBox}>
                    <div className={cssStyle.title}>移动可视设备指派</div>
                    <Icon type="close" onClick={this.closeDesignate.bind(this)} className={cssStyle.closeIcon} />
                </div>
                <div className={cssStyle.contentBox}>
                    <Scrollbars>
                        {list && list.map((item,index)=>
                            <div key={index} className={cssStyle.itemBox} >
                                <div className={cssStyle.lineBox}>
                                    <div className={cssStyle.headBox}>
                                        <img src={item.excuteType === 4 ? offlineIcon : onlineIcon} alt={''} className={cssStyle.icon} />
                                        <div className={cssStyle.name}>{item.name}</div>
                                    </div>
                                    <div
                                        onClick={this.changeDetailShow.bind(this,index)}
                                        className={`${cssStyle.button} ${item.excuteType === 4 ? cssStyle.readOnly:(item.excuteType === 5 ? cssStyle.error:'')}`}
                                    >
                                        {this.getButtonText(item.excuteType)}
                                    </div>
                                </div>
                                {this.state.showIndex === index && this.getDetailContent(item)}
                            </div>
                        )}
                    </Scrollbars>
                </div>
            </div>
        );
    }
}