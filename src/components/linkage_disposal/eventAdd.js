import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {DatePicker, Icon, Input, Select, Button, Modal} from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";
import moment from "moment";
import axios from "axios";
import {emergencyUrl} from "../../config";
import AddressSet from "./addressSet";

export default class EventAdd extends React.Component {
    constructor(props) {
        super(props);
        const defaultTime = new Date();
        this.state = {detail:{road:this.props.roadId?this.props.roadId:'',time:moment(defaultTime).format('YYYY-MM-DD HH:mm:ss')},roadList:[],eventTypeList:[],sourceList:[],loading:false,defaultTime:moment(defaultTime, 'YYYY-MM-DD HH:mm:ss'),showMap:false};
    }

    //组件加载触发函数
    componentDidMount() {
        const roadListUrl = emergencyUrl + "/socialGovernance/roadConfig/getRoadList";
        // const roadListUrl = "./json/ruian/roadList.json";
        axios.get(roadListUrl,{params:{rbacToken:this.props.token}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({roadList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
        const eventTypeListUrl = emergencyUrl + "/socialGovernance/statistics/getTypeList";
        // const eventTypeListUrl = "./json/ruian/eventTypeList.json";
        axios.get(eventTypeListUrl,{params:{rbacToken:this.props.token,type:7}}).then((response) => {
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
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    dataEdit(type,key,event){
        let {detail} = this.state;
        detail[key] = type === 1 ? event.target.value : event;
        this.setState({detail});
    }

    changeDate(date, dateString){
        let {detail} = this.state;
        detail.time = dateString;
        this.setState({detail});
    }

    addNewEvent(){
        this.setState({loading:true});
        const {detail} = this.state;
        const sendData = {
            title:detail.title,
            eventType:detail.type,
            incidentTime:detail.time,
            roadId:detail.road,
            incidentAddress:detail.address,
            earlyWarningLevel:detail.level,
            sourceType:detail.source,
            influence:detail.influence,
            trends:detail.development,
            measuresTaken:detail.measures,
            incidentRemark:detail.remark,
            x:detail.x,
            y:detail.y,
        };
        // console.log(sendData);
        // let fd = new FormData();
        // fd.append('rbacToken',this.props.token);
        // fd.append('event',sendData);
        axios.post(emergencyUrl+"/socialGovernance/emergencyProcess/addEmergencyEvent", {rbacToken:this.props.token,event:sendData},{params:{rbacToken:this.props.token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: '新增完成。',
                });
                this.props.changeEditShow();
                this.props.changeListShow({id:1,name:'未处置'},true);
                this.clearDetail();
            }else{
                Modal.error({
                    content: response.data.message,
                });
            }
            this.setState({loading:false});
        }).catch( (error) => {
            Modal.error({
                content: '请求出错！',
            });
            this.setState({loading:false});
        });
    }

    clearDetail(){
        const defaultTime = new Date();
        this.setState({detail:{road:this.props.roadId?this.props.roadId:'',time:moment(defaultTime).format('YYYY-MM-DD HH:mm:ss')}})
    }

    changeMapShow(flag){
        this.setState({showMap:flag});
    }

    setAddress(address){
        this.setState({detail:{...this.state.detail,...address},showMap:false});
    }

    render() {
        const {show,changeEditShow,roadId} = this.props;
        const {detail,roadList,eventTypeList,sourceList,loading,defaultTime,showMap} = this.state;
        return (
            <Motion style={{opacity:spring(show ? 1 : 0)}}>
                {({opacity}) =>
                    <div style={{opacity,zIndex:show?1:-1}} className={cssStyle.eventAddBox}>
                        <div className={cssStyle.editHeadBox}>
                            <div>新增事件</div>
                            <Icon type="close" className={cssStyle.closeIcon} onClick={changeEditShow}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>事件名称</div>
                            <Input value={detail.title} onChange={this.dataEdit.bind(this, 1, 'title')} className={cssStyle.addRowContent}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>事件类别</div>
                            <Select value={detail.type} onChange={this.dataEdit.bind(this, 2, 'type')} className={cssStyle.addRowContent}>
                                {eventTypeList.map((eventType,index)=>
                                    <Select.Option value={eventType.id} key={index}>{eventType.name}</Select.Option>
                                )}
                            </Select>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>事发时间</div>
                            <DatePicker showTime onChange={this.changeDate.bind(this)} locale={locale} defaultValue={defaultTime} className={cssStyle.addRowContent}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>所属街道</div>
                            <Select value={detail.road} disabled={roadId} onChange={this.dataEdit.bind(this, 2, 'road')} className={cssStyle.addRowContent}>
                                {roadList.map((road,index)=>
                                    <Select.Option value={road.id} key={index}>{road.name}</Select.Option>
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
                            <div className={cssStyle.addRowTitle}>事件等级</div>
                            <Select value={detail.level} onChange={this.dataEdit.bind(this, 2, 'level')} className={cssStyle.addRowContent}>
                                <Select.Option value={1}>特大</Select.Option>
                                <Select.Option value={2}>重大</Select.Option>
                                <Select.Option value={3}>较大</Select.Option>
                                <Select.Option value={4}>一般</Select.Option>
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
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>影响范围</div>
                            <Input value={detail.influence} onChange={this.dataEdit.bind(this, 1, 'influence')} className={cssStyle.addRowContent}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>事件发展趋势</div>
                            <Input value={detail.development} onChange={this.dataEdit.bind(this, 1, 'development')} className={cssStyle.addRowContent}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>已采取措施</div>
                            <Input value={detail.measures} onChange={this.dataEdit.bind(this, 1, 'measures')} className={cssStyle.addRowContent}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>备注</div>
                            <Input value={detail.remark} onChange={this.dataEdit.bind(this, 1, 'remark')} className={cssStyle.addRowContent}/>
                        </div>
                        <div className={cssStyle.editFootBox}>
                            <Button onClick={changeEditShow}>取消</Button>
                            <Button type="primary" onClick={this.addNewEvent.bind(this)} loading={loading}>确定</Button>
                        </div>
                        <AddressSet show={showMap} detail={detail} setAddress={this.setAddress.bind(this)} changeMapShow={this.changeMapShow.bind(this,false)}/>
                    </div>
                }
            </Motion>
        );
    }
}