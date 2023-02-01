import React from "react";
import cssStyle from "./nucleicAcidTesting.module.css";
import {Modal, Icon, Input, DatePicker, Radio, Button} from "antd";
import axios from "axios";
import 'moment/locale/zh-cn';
import locale from "antd/es/date-picker/locale/zh_CN";

import BgOne from "../images/bg1.png";
import SvgRing from "../../../common/svgRing";
import {interactData} from "../../../common/util";
import moment from "moment";
// import BgTwo from "../images/bg2.png";
// import BgThree from "../images/bg3.png";

const { confirm } = Modal;
const { TextArea } = Input;

export default class NucleicAcidTesting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {state:0,showEdit:false,editType:1,timeList:[],dateRange:[],dateRangeStr:[],needSend:0,messageOne:'',messageTwo:'',messageThree:''};
        this.unitList = ["时","分","秒"];
        this.stateName = ["新一轮即将启动","倒计时","本轮已结束"];
        this.messgaeList = ["启动全员核酸检测","修改全员核酸检测计划","取消全员核酸检测计划"];
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
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
        this.calculateTime();
        const {detail} = this.props;
        const { interact } = this.props.thisData.dataSources;
        if(detail && detail.id){
            const {lastConfig} = detail;
            if(lastConfig && lastConfig.id){
                this.interactData(interact, lastConfig);
            }else{
                this.interactData(interact, detail);
            }
            this.setState({
                needSend:detail.isNotice,
                messageOne:detail.gridLeaderContent,
                messageTwo:detail.gridContent,
                messageThree:detail.publicContent,
                dateRange:[moment(detail.startTime, 'YYYY-MM-DD HH:mm:ss'),moment(detail.endTime, 'YYYY-MM-DD HH:mm:ss')]
            })
        }else{
            this.interactData(interact, {});
        }
    }


    editPlan(type){
        confirm({
            title: '确定要'+this.messgaeList[type]+'吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    rbacToken: this.props.token,
                };
                const {detail} = this.props;
                const {dateRangeStr,needSend,messageOne,messageTwo,messageThree,state} = this.state;
                let url;
                if(type === 2){
                    url = '/fyWisdomGovern/screen/deletedConfig';
                    sendData.id = detail.id;
                }else{
                    url = '/fyWisdomGovern/screen/saveConfig';
                    if(detail.id && state === 0){
                        sendData.id = detail.id;
                    }
                    sendData.startTime = dateRangeStr[0];
                    sendData.endTime = dateRangeStr[1];
                    sendData.isNotice = needSend;
                    sendData.gridLeaderContent = messageOne;
                    sendData.gridContent = messageTwo;
                    sendData.publicContent = messageThree;
                }
                return new Promise((resolve) => {
                    axios.post(this.props.styleData.fileUrl+url, sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '已'+this.messgaeList[type]+'。',
                            });
                            if(type === 1){
                                this.setState({showEdit:false});
                            }
                            this.props.changeKeyParams({});
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch( (error)=> {
                        resolve();
                        Modal.error({
                            content: this.messgaeList[type]+'失败',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    changeData(key,type,event){
        this.setState({[key]:type === 1 ? event.target.value : event});
    }

    onDateChange(date, dateString) {
        this.setState({dateRange:date,dateRangeStr:dateString});
    }

    clearEdit(){
        this.setState({dateRange:[],dateRangeStr:[],needSend:0,messageOne:'',messageTwo:'',messageThree:''});
    }

    getPlanEdit(detail){
        return (
            <div className={cssStyle.editBox} >
                <div className={cssStyle.headBox}>
                    <span className={cssStyle.head}>启动全员核酸</span>
                    {detail.id && <Icon className={cssStyle.close} onClick={this.changeEditShow.bind(this,false)} type="close" />}
                </div>
                <div className={cssStyle.editRow}>
                    <div>全员核酸时间：</div>
                    <DatePicker.RangePicker
                        showTime={true}
                        value={this.state.dateRange}
                        onChange={this.onDateChange.bind(this)}
                        locale={locale}
                    />
                </div>
                <div className={cssStyle.editRow}>
                    <div>是否短信通知：</div>
                    <Radio.Group onChange={this.changeData.bind(this,'needSend',1)} value={this.state.needSend}>
                        <Radio value={1}><span className={cssStyle.white}>是</span></Radio>
                        <Radio value={0}><span className={cssStyle.white}>否</span></Radio>
                    </Radio.Group>
                </div>
                {this.state.needSend === 1 && (
                    <div className={cssStyle.editRow}>
                        <div className={cssStyle.textAreaEdit}>
                            <div>网格长短信内容：</div>
                            <TextArea className={cssStyle.textArea} value={this.state.messageOne} onChange={this.changeData.bind(this,'messageOne',1)} />
                        </div>
                        <div className={cssStyle.textAreaEdit}>
                            <div>网格员短信内容：</div>
                            <TextArea className={cssStyle.textArea} value={this.state.messageTwo} onChange={this.changeData.bind(this,'messageTwo',1)} />
                        </div>
                        <div className={cssStyle.textAreaEdit}>
                            <div>群众短信内容：</div>
                            <TextArea className={cssStyle.textArea} value={this.state.messageThree} onChange={this.changeData.bind(this,'messageThree',1)} />
                        </div>
                    </div>
                )}
                <div className={cssStyle.editButtonBox}>
                    <Button type="primary" className={cssStyle.button} onClick={this.editPlan.bind(this,(this.state.state === 0 && detail !== null && detail.id)?1:0)}>启动</Button>
                    <Button className={cssStyle.button} onClick={this.clearEdit.bind(this)}>重置</Button>
                    {(this.state.state === 0 && detail !== null && detail.id) && <Button type="danger" className={cssStyle.button} onClick={this.editPlan.bind(this,2)}>取消全员核酸</Button>}
                </div>
            </div>
        );
    }

    calculateTime(){
        const { detail } = this.props;
        if(detail && detail.startTime && detail.endTime){
            const nowTime = new Date().getTime();
            const startTime = new Date(detail.startTime).getTime();
            const endTime = new Date(detail.endTime).getTime();
            const allTime = endTime - startTime;
            let pastTime = 0;
            let state,subTime;
            if(nowTime < startTime){
                //未开始
                state = 0;
                subTime = startTime - nowTime;
            }else if(nowTime < endTime){
                //进行中
                state = 1;
                subTime = endTime - nowTime;
                pastTime = nowTime - startTime;
            }else{
                //已结束
                state = 2;
                subTime = 0;
            }
            if(state === 2){
                this.setState({timeList:["00","00","00"],state,pastTime,allTime});
            }else{
                const hour = Math.floor(subTime/(1000*60*60));
                const subMin = subTime%(1000*60*60);
                const minute = Math.floor(subMin/(1000*60));
                const subSec = subMin%(1000*60);
                const second = Math.floor(subSec/1000);
                this.setState({timeList:[hour<10?"0"+hour:hour,minute<10?"0"+minute:minute,second<10?"0"+second:second],state,pastTime,allTime});
            }
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            this.calculateTime();
        },1000);
    }

    changeEditShow(flag){
        this.setState({showEdit:flag});
    }

    getPlanDetail(detail){
        // const {hour,minute,second} = this.state;
        const {timeList,state,pastTime,allTime} = this.state;
        const {lastConfig} = detail;
        const ringStyleOne = {
            maxRadius:99,minRadius:92,lineWidth:0,
            fillColor:[{color:"rgb(255,144,13)",percent:0},{color:"rgb(248,217,121)",percent:100}],
            angle:90,bgColor:"rgb(67,61,59)"
        };
        const ringStyleTwo = {
            maxRadius:88,minRadius:78,lineWidth:0,
            fillColor:[{color:"rgb(9,197,201)",percent:0},{color:"rgb(58,94,177)",percent:100}],
            angle:90,bgColor:"rgba(66,68,83,0.76)"
        };
        let timePer;
        if(state === 1){
            timePer = pastTime/allTime;
        }else{
            if(!lastConfig || !lastConfig.id){
                timePer = 0;
            }else{
                timePer = 1;
            }
        }
        const completePer = detail.checkNum+detail.unCheckNum === 0 ? 0 : detail.checkNum/(detail.checkNum+detail.unCheckNum);
        let showData;
        if(state === 0 && lastConfig && lastConfig.id){
            showData = lastConfig;
        }else{
            showData = detail;
        }
        return (
            <div className={cssStyle.detailBox} >
                <div className={cssStyle.smallHead}>全员核酸{state === 1 && "中"}</div>
                <div className={cssStyle.countBox}>
                    <div className={cssStyle.countItem}>
                        <div className={cssStyle.countName}>已检测人数</div>
                        <div className={cssStyle.countNun}>{showData.checkNum}</div>
                    </div>
                    <div className={cssStyle.countItem}>
                        <div className={cssStyle.countName}>未检测人数</div>
                        <div className={cssStyle.countNun}>{showData.unCheckNum}</div>
                    </div>
                    <div className={cssStyle.countItem}>
                        <div className={cssStyle.countName}>短信通知人次</div>
                        <div className={cssStyle.countNun}>{showData.sendNum?showData.sendNum:0}</div>
                    </div>
                </div>
                <div className={cssStyle.centerBox}>
                    <img alt={''} src={BgOne} className={cssStyle.centerBg} />
                    <SvgRing id={`${this.props.thisData.id}_ring1`} className={cssStyle.ring} per={completePer} ringStyle={ringStyleOne}/>
                    <SvgRing id={`${this.props.thisData.id}_ring2`} className={cssStyle.ring} per={timePer} ringStyle={ringStyleTwo}/>
                    <div className={cssStyle.timePerBox}>
                        <div className={cssStyle.dataBox}>
                            <div className={cssStyle.dataNameBox}>
                                <div className={cssStyle.point} />
                                <div>已耗时</div>
                            </div>
                            <div className={cssStyle.dataNum}>{(timePer*100).toFixed(2)}%</div>
                        </div>
                    </div>
                    <div className={cssStyle.checkPerBox}>
                        <div className={cssStyle.dataBox}>
                            <div className={cssStyle.dataNameBox}>
                                <div className={cssStyle.point} />
                                <div>完成率</div>
                            </div>
                            <div className={cssStyle.dataNum}>{(completePer*100).toFixed(2)}%</div>
                        </div>
                    </div>
                </div>
                <div className={cssStyle.timeRangeBox}>
                    <div className={cssStyle.timeRange}>{detail.startTime.split(" ").map((item,index)=><span key={index}>{item}</span>)}</div>
                    <div className={cssStyle.timeRange}>{detail.endTime.split(" ").map((item,index)=><span key={index}>{item}</span>)}</div>
                </div>
                <div className={cssStyle.line} />
                <div className={cssStyle.timingBox}>
                    {timeList.map((time,index)=>
                        <React.Fragment key={index}>
                            {time.toString().split("").map((str,strIndex)=>
                                <div key={strIndex} className={cssStyle.numPart}>
                                    {index === 0 && strIndex === 0 && <div className={`${cssStyle.stateName} ${state === 0 ? cssStyle.stateNameSmall:''}`}>{this.stateName[state]}</div>}
                                    <span className={cssStyle.num}>{str}</span>
                                </div>
                            )}
                            <div className={cssStyle.timeUnit}>{this.unitList[index]}</div>
                        </React.Fragment>
                    )}
                </div>
                {state === 0 && <div className={cssStyle.editButton} onClick={this.changeEditShow.bind(this,true)}>修改全员核酸检测计划</div>}
                {state === 2 && <div className={cssStyle.newButton} onClick={this.changeEditShow.bind(this,true)}>启动全员核酸检测</div>}
            </div>
        );
    }

    render() {
        const { detail } = this.props;
        const {showEdit} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                {detail == null || !detail.id || showEdit ? this.getPlanEdit(detail):this.getPlanDetail(detail)}
            </div>
        );
    }
}