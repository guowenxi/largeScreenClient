import React from "react";
import cssStyle from "./addEventOne.module.css";
// import CloseIcon from "../images/closeTypeOne.svg";
import {Input, Icon, Button, Modal, Select, DatePicker} from 'antd';
import {emergencyUrl} from "../../../config";
import axios from "axios";
import AddressSet from "../../linkage_disposal/addressSet";
import moment from "moment";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {interactData} from "../../../common/util";

moment.locale('zh-cn');

const { TextArea } = Input;

export default class AddEventOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {detail:{},roadList:[],eventTypeList:[],sourceList:[],loading:false,showMap:false,selectedTypes:[]};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        const roadListUrl = emergencyUrl + "/socialGovernance/preWarning/getPreWarningType";
        // const roadListUrl = "./json/ruian/roadList.json";
        axios.get(roadListUrl,{params:{rbacToken:this.props.token,type:4}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({roadList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
        const eventTypeListUrl = emergencyUrl + "/socialGovernance/preWarning/getPreWarningType";
        // const eventTypeListUrl = "./json/ruian/eventTypeList.json";
        axios.get(eventTypeListUrl,{params:{rbacToken:this.props.token,type:2}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({eventTypeList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
        const sourceListUrl = emergencyUrl + "/socialGovernance/statistics/getTypeList";
        // const sourceListUrl = "./json/ruian/sourceList.json";
        axios.get(sourceListUrl,{params:{rbacToken:this.props.token,type:1}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({sourceList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
        this.initDetail();
    }

    initDetail(){
        const {detail} = this.props;
        if(detail.id){
            let editDetail = {};
            editDetail.id = detail.id;
            editDetail.title = detail.title;
            if(detail.eventTypes){
                editDetail.type = detail.eventTypes.split(',').map((num)=>{return parseInt(num)});
            }else{
                editDetail.type = [];
            }
            editDetail.level = detail.warningLevel;
            editDetail.time = detail.incidentTime;
            editDetail.road = detail.roadId;
            editDetail.address = detail.incidentAddress;
            editDetail.source = detail.sourceType;
            editDetail.content = detail.incidentContent;
            editDetail.x = detail.x;
            editDetail.y = detail.y;
            this.setState({detail:editDetail,defaultDate:detail.incidentTime ? moment(detail.incidentTime):moment()});
        }
    }

    closeThis(){
        this.props.changeThisShow(false);
    }

    dataEdit(type,key,event){
        let {detail} = this.state;
        detail[key] = type === 1 ? event.target.value : event;
        this.setState({detail});
    }

    changeMapShow(flag){
        this.setState({showMap:flag});
    }

    setAddress(address){
        this.setState({detail:{...this.state.detail,...address},showMap:false});
    }

    changeDate(date, dateString){
        let {detail} = this.state;
        detail.time = dateString;
        this.setState({detail,defaultDate:date});
    }

    saveEvent(){
        this.setState({loading:true});
        const {style} = this.props.thisData;
        const {detail} = this.state;
        let sendData = {
            rbacToken:this.props.token,
            title:detail.title,
            eventTypes:typeof(detail.type) === 'object' ? detail.type.join(','):detail.type,
            warningLevel:detail.level,
            incidentTime:detail.time,
            roadId:detail.road,
            incidentAddress:detail.address,
            sourceType:detail.source,
            incidentContent:detail.content,
            x:detail.x,
            y:detail.y,
        };
        if(detail.id){
            sendData.id = detail.id
        }
        axios.post(emergencyUrl+"/socialGovernance/command/savePlatformEvent", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
            this.setState({loading:false});
            if(response.data.success){
                Modal.success({
                    content: style.contentType === 1 ? '新增完成。':'编辑完成。',
                });
                setTimeout(()=>{
                    this.closeThis();
                    const { successInteract } = this.props.thisData.style;
                    this.interactData(successInteract);
                });
            }else{
                Modal.error({
                    content: response.data.message,
                });
            }
        }).catch( (error) => {
            Modal.error({
                content: (style.contentType === 1 ? '新增':'编辑')+'事件请求出错！',
            });
            this.setState({loading:false});
        });
    }

    render() {
        const {style} = this.props.thisData;
        const {detail,roadList,eventTypeList,sourceList,loading,showMap} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.backgroundBox}>
                    {/*<img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)}/>*/}
                    <div className={cssStyle.editHeadBox}>
                        <div>{style.contentType === 1 ? '新增事件':'事件编辑'}</div>
                        <Icon type="close" className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)}/>
                    </div>
                    <div className={cssStyle.eventAddRow}>
                        <div className={cssStyle.addRowTitle}>事件名称</div>
                        <Input value={detail.title} onChange={this.dataEdit.bind(this, 1, 'title')} className={cssStyle.addRowContent}/>
                    </div>
                    <div className={cssStyle.eventAddRow}>
                        <div className={cssStyle.addRowTitle}>事件类别</div>
                        <Select mode="multiple" value={detail.type} onChange={this.dataEdit.bind(this, 2, 'type')} className={cssStyle.addRowContent}>
                            {eventTypeList.map((eventType,index)=>
                                <Select.Option value={eventType.value} key={index}>{eventType.text}</Select.Option>
                            )}
                        </Select>
                    </div>
                    <div className={cssStyle.eventAddRow}>
                        <div className={cssStyle.addRowTitle}>事发时间</div>
                        <DatePicker showTime onChange={this.changeDate.bind(this)} value={this.state.defaultDate} locale={locale} className={cssStyle.addRowContent}/>
                    </div>
                    <div className={cssStyle.eventAddRow}>
                        <div className={cssStyle.addRowTitle}>所属街道</div>
                        <Select value={detail.road} onChange={this.dataEdit.bind(this, 2, 'road')} className={cssStyle.addRowContent}>
                            {roadList.map((road,index)=>
                                <Select.Option value={road.value} key={index}>{road.text}</Select.Option>
                            )}
                        </Select>
                    </div>
                    <div className={cssStyle.eventAddRow}>
                        <div className={cssStyle.addRowTitle}>事发地点</div>
                        <div className={cssStyle.addRowContentAddress}>
                            <Input value={detail.address} onChange={this.dataEdit.bind(this, 1, 'address')} className={cssStyle.addressContent}/>
                            <Icon type="environment" className={`${cssStyle.positionSelect} ${detail.x && detail.y ? cssStyle.positionSelected:''}`} onClick={this.changeMapShow.bind(this,true)} />
                        </div>
                    </div>
                    <div className={cssStyle.eventAddRow}>
                        <div className={cssStyle.addRowTitle}>预警等级</div>
                        <Select value={detail.level} onChange={this.dataEdit.bind(this, 2, 'level')} className={cssStyle.addRowContent}>
                            <Select.Option value={1}>一级</Select.Option>
                            <Select.Option value={2}>二级</Select.Option>
                            <Select.Option value={3}>三级</Select.Option>
                            <Select.Option value={4}>四级</Select.Option>
                            <Select.Option value={5}>五级</Select.Option>
                        </Select>
                    </div>
                    <div className={cssStyle.eventAddRow}>
                        <div className={cssStyle.addRowTitle}>事件来源</div>
                        <Select value={detail.source} onChange={this.dataEdit.bind(this, 2, 'source')} className={cssStyle.addRowContent}>
                            {sourceList.map((source,index)=>
                                <Select.Option value={source.value} key={index}>{source.key}</Select.Option>
                            )}
                        </Select>
                    </div>
                    <div className={cssStyle.eventAddRow} style={{height: 'auto',alignItems: 'flex-start'}}>
                        <div className={cssStyle.addRowTitle}>事件概述</div>
                        <TextArea value={detail.content} onChange={this.dataEdit.bind(this, 1, 'content')} className={cssStyle.addRowContent}/>
                    </div>
                    <div className={cssStyle.editFootBox}>
                        <Button onClick={this.closeThis.bind(this)}>取消</Button>
                        <Button type="primary" onClick={this.saveEvent.bind(this)} loading={loading}>确定</Button>
                    </div>
                    <AddressSet show={showMap} detail={detail} setAddress={this.setAddress.bind(this)} changeMapShow={this.changeMapShow.bind(this,false)}/>
                </div>
            </div>
        );
    }
}