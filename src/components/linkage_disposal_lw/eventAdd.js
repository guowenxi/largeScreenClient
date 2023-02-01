import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {DatePicker, Icon, Input, Select, Button, Modal, TreeSelect} from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";
import moment from "moment";
import axios from "axios";
import AddressSet from "./addressSet";

const { TextArea } = Input;
const { TreeNode } = TreeSelect;

export default class EventAdd extends React.Component {
    constructor(props) {
        super(props);
        const defaultTime = new Date();
        this.state = {detail:{type:[],road:this.props.roadId?this.props.roadId:'',time:moment(defaultTime).format('YYYY-MM-DD HH:mm:ss')},roadList:[],eventTypeList:[],sourceList:[],loading:false,defaultTime:moment(defaultTime, 'YYYY-MM-DD HH:mm:ss'),showMap:false};
        this.eventSourceType = '';
    }

    //组件加载触发函数
    componentDidMount() {
        const roadListUrl = this.props.emergencyUrl + "/socialGovernance/common/getRoadList";
        axios.get(roadListUrl,{params:{rbacToken:this.props.token}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({roadList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
        const sourceListUrl = this.props.emergencyUrl + "/socialGovernance/common/getEventSourceTypeList";
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
        if(key === 'source'){
            this.eventSourceType = detail[key];
            this.setState({detail},()=>{
                this.getTypeList();
            });
        }else{
            this.setState({detail});
        }
    }

    getTypeList(){
        const eventTypeListUrl = this.props.emergencyUrl + "/socialGovernance/warningConfig/queryKeywordOrEventTypeList";
        axios.get(eventTypeListUrl,{params:{rbacToken:this.props.token,eventSourceType:this.eventSourceType,level:1,type:1}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({eventTypeList:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
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
            rbacToken:this.props.token,
            eventTitle:detail.title,
            roadId:detail.road,
            eventTypeList:detail.type,
            eventDate:detail.time,
            eventLocation:detail.address,
            longitude:detail.x,
            latitude:detail.y,
            eventLevel:detail.level,
            eventSourceCode:detail.source,
            eventContent:detail.eventContent,
            dataInputMethod:2,
        };
        axios.post(this.props.emergencyUrl+"/socialGovernance/commandDispatch/addEvent", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: '新增完成。',
                });
                this.props.changeEditShow();
                this.props.changeListShow({id:2,name:'未处置'},true);
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
        this.setState({detail:{type:[],road:this.props.roadId?this.props.roadId:'',time:moment(defaultTime).format('YYYY-MM-DD HH:mm:ss')}})
    }

    changeMapShow(flag){
        this.setState({showMap:flag});
    }

    setAddress(address){
        this.setState({detail:{...this.state.detail,...address},showMap:false});
    }

    filter(inputValue, path) {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    getTreeNode(list){
        if(list){
            return list.map((item)=>{
                if(item.children && Array.isArray(item.children) && item.children.length > 0){
                    return (
                        <TreeNode value={item.id} key={item.id} title={item.name} selectable={false}>
                            {this.getTreeNode(item.children)}
                        </TreeNode>
                    );
                }else{
                    return <TreeNode value={item.id} key={item.id} title={item.name}/>
                }
            });
        }else{
            return null;
        }
    }

    render() {
        const {show,changeEditShow,roadId} = this.props;
        const {detail,roadList,eventTypeList,sourceList,loading,defaultTime,showMap} = this.state;
        return (
            <Motion style={{opacity:spring(show ? 1 : 0)}}>
                {({opacity}) =>
                    <div style={{opacity,zIndex:show?2:-1}} className={cssStyle.eventAddBox}>
                        <div className={cssStyle.editHeadBox}>
                            <div className={cssStyle.headName}>新增事件</div>
                            <Icon type="close" className={cssStyle.closeIcon} onClick={changeEditShow}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>事件名称</div>
                            <Input value={detail.title} onChange={this.dataEdit.bind(this, 1, 'title')} className={cssStyle.addRowContent}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>事件来源</div>
                            <Select value={detail.source} onChange={this.dataEdit.bind(this, 2, 'source')} className={cssStyle.addRowContent}>
                                {sourceList.map((source,index)=>
                                    <Select.Option value={source.code} key={index}>{source.value}</Select.Option>
                                )}
                            </Select>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>事件类别</div>
                            {/*<Select mode="multiple" value={detail.type} onChange={this.dataEdit.bind(this, 2, 'type')} className={cssStyle.addRowContent} placeholder={!detail.source ? '请先选择事件来源':''} >*/}
                            {/*    {eventTypeList.map((eventType,index)=>*/}
                            {/*        <Select.Option value={eventType.id} key={index}>{eventType.name}</Select.Option>*/}
                            {/*    )}*/}
                            {/*</Select>*/}
                            <TreeSelect
                                placeholder={!detail.source ? '请先选择事件来源':''}
                                disabled={!detail.source}
                                value={detail.type}
                                allowClear
                                onChange={this.dataEdit.bind(this, 2, 'type')}
                                className={cssStyle.addRowContent}
                                multiple={true}
                            >
                                {this.getTreeNode(eventTypeList)}
                            </TreeSelect>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>事发时间</div>
                            <DatePicker showTime onChange={this.changeDate.bind(this)} locale={locale} defaultValue={defaultTime} className={cssStyle.addRowContent}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>所属街道</div>
                            <Select value={detail.road} disabled={!!roadId} onChange={this.dataEdit.bind(this, 2, 'road')} className={cssStyle.addRowContent}>
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
                                <Select.Option value={1}>一级</Select.Option>
                                <Select.Option value={2}>二级</Select.Option>
                                <Select.Option value={3}>三级</Select.Option>
                                <Select.Option value={4}>四级</Select.Option>
                                <Select.Option value={5}>五级</Select.Option>
                            </Select>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>事件概述</div>
                            <TextArea value={detail.eventContent} onChange={this.dataEdit.bind(this, 1, 'eventContent')} className={cssStyle.addRowTextArea}/>
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