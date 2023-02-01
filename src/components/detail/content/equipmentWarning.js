import React from "react";
import cssStyle from './equipmentWarning.module.css';

import { interactData } from "../../../common/util";
import warningIcon from '../images/../images/emergencyDisposalDetailOne.png';
import {Modal, Select} from "antd";
import Scrollbars from "react-custom-scrollbars";
import axios from "axios";

export default class EquipmentWarning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            planList:[],
        };
        this.interactData = interactData.bind(this);
        this.warnRangeList = [10,20,30,40,50,60,70,80,90,100];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    //组件加载触发函数
    componentDidMount() {
    }
    componentDidUpdate(prveProps) {
        if (prveProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            this.setState({warnRange:null});
            this.getPlanList();
            this.playAudio();
        }
    }

    //播放告警声音
    playAudio() {
        let playPromise = document.getElementById('audio-box'+this.props.thisData.id);
        if (playPromise) {
            playPromise.currentTime = 0;
            playPromise.play();
        }
    }

    //停止播放告警声音
    stopAudio() {
        let playPromise = document.getElementById('audio-box'+this.props.thisData.id);
        if (playPromise) {
            playPromise.pause();
        }
    }

    //获取预案列表
    getPlanList(){
        const url = this.props.styleData.fileUrl + '/fy-warehouseManage/alarmIndex/getPlanManageAll';
        // const url = './json/jhwh/planList.json';
        axios.get(url,{params:{id:this.props.keyParams.device,rbacToken:this.props.token}}).then((response) => {
            if(response.data.data){
                this.setState({planList:response.data.data});
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //修改警戒范围
    changeWarnRange(value){
        this.setState({warnRange:value});
    }

    handleClickInteract(type, item) {
        this.keyParams = this.props.keyParams;
        const { style } = this.props.thisData;
        const interact = style[`${type}Interact`];
        if (type === 'start') {
            const {warnRange} = this.state;
            if(!warnRange){
                Modal.info({
                    content: '请选择警戒范围！',
                });
                return;
            }
            Modal.confirm({
                content: '确定开始启动应急方案吗？',
                okText: '确定',
                cancelText: '取消',
                onCancel: () => { },
                onOk: () => {
                    this.interactData(interact, {...item,warnRange,eventId:this.props.keyParams.device});
                    this.props.changeThisShow(false);
                    this.setState({visible: false,planList:[]});
                    this.stopAudio();
                },
            });
        } else {
            this.interactData(interact,{eventId:this.props.keyParams.device});
            this.props.changeThisShow(false);
            this.setState({visible: false,planList:[]});
            this.stopAudio();
        }
    }

    render() {
        const detail = this.props.keyParams;
        const { visible,planList,warnRange } = this.state;
        const scrollStyle = { display: visible ? 'block' : 'none', position: 'absolute', top: '1em', right: 'calc(-100% - 0.8em)', height: '9em', border: 'solid 1px #00c6ff', backgroundColor: '#023d56' };
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <div className={cssStyle.bodyBox}>
                    <div className={cssStyle.top}>
                        <img src={warningIcon} alt="" className={cssStyle.warningIcon} />
                        <span>设备告警提醒</span>
                    </div>
                    <span className={cssStyle.time}>{detail.time}</span>
                    <span className={cssStyle.address}>{detail.address}{detail.name}</span>
                    <div className={cssStyle.warnRangeBox}>
                        <span>警戒范围：</span>
                        <Select value={warnRange} onChange={this.changeWarnRange.bind(this)} className={cssStyle.warnRangeSelect} >
                            {this.warnRangeList.map((item,index)=>
                                <Select.Option value={item} key={index} >{item}</Select.Option>
                            )}
                        </Select>
                    </div>
                    <div className={cssStyle.buttonBox}>
                        <button
                            className={`${cssStyle.commonButton} ${cssStyle.cancelButton}`}
                            onClick={() => { this.setState({ visible: false }); this.handleClickInteract('cancel') }}
                        >取消预警</button>
                        <button
                            className={`${cssStyle.commonButton} ${cssStyle.confirmButton}`}
                            onClick={() => this.setState({ visible: true })}
                        >启动应急程序</button>
                    </div>
                    <Scrollbars style={scrollStyle}>
                        <div className={cssStyle.programmeBox}>
                            {
                                planList && Array.isArray(planList) &&
                                planList.map((item, index, arr) => {
                                    return (
                                        <div
                                            style={{ borderBottom: arr.length - 1 === index ? 0 : '2px solid #00c6ff' }}
                                            key={index}
                                            className={`${cssStyle.programmeItem} ${cssStyle.onlyLine}`}
                                            title={item.planName}
                                            onClick={this.handleClickInteract.bind(this, 'start', item)}
                                        >{item.planName}</div>
                                    )
                                })
                            }
                        </div>

                    </Scrollbars>
                </div>
                <audio id={"audio-box"+this.props.thisData.id} src="./audio/warning.mp3" className={cssStyle.audio} loop />
            </div>
        );
    }
}