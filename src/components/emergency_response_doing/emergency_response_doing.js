import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./emergency_response_doing.module.css";
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import {Input, Modal, Icon} from "antd";
import axios from "axios";

import Emitter from "../../common/eventBus";
import EmptyDom from "../../common/emptyDom";
import {interactData} from "../../common/util";

const { TextArea } = Input;

export default class EmergencyResponseDoing extends React.Component {
    constructor(props) {
        super(props);
        this.editType = 1;  //1新增,2修改
        this.state = {opacity:0,content:'',startTime:0,result:{},selectedType:-1};
        this.postData = {authName:'emerCommand:recording'};
        this.typeList = [{type:1,name:'人员到位'},{type:2,name:'警示喊话'},{type:3,name:'公安接手指挥'},{type:4,name:'开始强制清场'},{type:5,name:'现场处置完毕'}];
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "showComponent":
                //接收数据
                for(const key in data.data){
                    this.postData[key] = data.data[key];
                }
                this.getData();
                //显示当前组件
                this.changeThisShow(true);
                break;
            case "dataInterchange":
                //接收数据
                for(const key in data.data){
                    this.postData[key] = data.data[key];
                }
                this.getData();
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    getData(){
        if(this.timer){
            clearTimeout(this.timer);
        }
        const { dataSources } = this.props.thisData;
        if(dataSources.dataType === 1){
            let defaultData = [];
            try {
                defaultData = JSON.parse(dataSources.defaultData);
            }catch (e) {
            }
            this.setState({result:defaultData});
            this.dataHandle(defaultData);
        }else if(dataSources.dataType === 2 && this.postData.commondId){
            let params = {};
            try {
                params = JSON.parse(dataSources.dataParams);
            }catch (e) {}
            axios.get(dataSources.dataUrl,{params:{...params,commondId:this.postData.commondId}}).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if(result){
                    this.setState({result:result});
                    this.dataHandle(result);
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    //数据处理
    dataHandle(result){
        if(result.createTime){
            this.startTime = (new Date(result.createTime.replace(/-/g, '/'))).getTime();
            // this.startTime = (new Date('2020-03-10')).getTime();
            this.dateTimeout();
        }
    }

    //定时刷新时间
    dateTimeout(){
        const now = (new Date()).getTime();
        const sub = now - this.startTime;
        const hour = Math.floor(sub/3600000);
        const minuteLeft = sub%3600000;
        const minute = Math.floor(minuteLeft/60000);
        const secondLeft = minuteLeft%60000;
        const second = Math.floor(secondLeft/1000);
        this.setState({now:(hour< 10 ? '0'+hour:hour)+':'+(minute< 10 ? '0'+minute:minute)+':'+(second< 10 ? '0'+second:second)});
        this.timer = setTimeout(()=>this.dateTimeout(),1000);
    }

    //修改步骤
    editContent(editItem){
        this.editType = 2;
        this.editItem = editItem;
        this.setState({selectedType:-1,content:editItem.content});
    }

    //修改备注
    changeContext(event){
        this.setState({content:event.target.value});
    }

    //选择进度类型（新增步骤
    selectType(typeItem){
        this.editType = 1;
        this.editItem = {};
        this.setState({selectedType:typeItem.type,content:typeItem.name});
    }

    //记录步骤
    saveRecord(){
        const { style } = this.props.thisData;
        const sendData = {
            ...this.editItem,
            ...this.postData,
            rbacToken: this.props.token,
            content: this.state.content,
            type: this.state.selectedType
        };
        if(style.reportUrl){
            console.log(sendData);
            axios.post(style.reportUrl,sendData).then((response) =>{
                if(response.data.success){
                    if(this.state.selectedType === 5){
                        Modal.success({
                            content: '已结束响应。',
                        });
                        //隐藏当前组件
                        this.changeThisShow(false);
                        //结束响应通知筛选变更
                        this.sendMessage();
                    }else{
                        this.setState({content:'',selectedType:-1});
                        this.getData();
                    }
                }else{
                    Modal.error({
                        content: '记录失败！',
                    });
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    sendMessage(){
        const {interact} = this.props.thisData.dataSources;
        this.interactData(interact);
    }

    //当前组件显示隐藏
    changeThisShow(type){
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: {showStatus: type, id: this.props.thisData.id}
        });
        if(type === false){
            //若为关闭则清空数据
            setTimeout(() => {
                clearTimeout(this.timer);
                this.setState({result:{},content:''});
            },500)
        }
    }

    render() {
        const {result} = this.state;
        const { style } = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={`${cssStyle.box} ${style.padding ? cssStyle.padding:''}`} style={{opacity:opacity,backgroundColor:style.bgColor,fontSize:fontSize}}>
                            <div className={`${cssStyle.head} ${cssStyle.flexCenter}`}>
                                <div>{this.state.now}</div>
                                {style.close && <Icon type="close" onClick={this.changeThisShow.bind(this,false)} className={cssStyle.close}/>}
                            </div>
                            <div className={`${cssStyle.title} ${cssStyle.flexCenter}`}>
                                {result.title}
                            </div>
                            <div className={cssStyle.timeLineBox}>
                                <Scrollbars>
                                    <ul className={cssStyle.timeline}>
                                        {
                                            (result.recordList) ? result.recordList.map((item, index) => {
                                                return (
                                                    <li key={index}>
                                                        <div className={cssStyle.point}>
                                                            <div className={cssStyle.main} />
                                                        </div>
                                                        <div className={cssStyle.liright}>
                                                            <p className={cssStyle.title} >{item.createTime}</p>
                                                            <div className={cssStyle.content} >
                                                                {item.content}
                                                                <div className={cssStyle.editButton} onClick={this.editContent.bind(this,item)}>修改</div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            }) : (<EmptyDom description={<span style={{fontSize:'2.5vh'}}>暂无数据</span>}/>)
                                        }
                                    </ul>
                                </Scrollbars>
                            </div>
                            <div className={cssStyle.editBox}>
                                <div className={`${cssStyle.typeListBox} ${cssStyle.flexCenter}`}>
                                    {this.typeList.map((item,index) => {
                                        return <div key={index} className={`${cssStyle.typeItem} ${cssStyle.flexCenter} ${this.state.selectedType === item.type ? cssStyle.selectedType:''}`} onClick={this.selectType.bind(this,item)}>{item.name}</div>;
                                    })}
                                </div>
                                <div className={cssStyle.textBox}>
                                    <TextArea className={cssStyle.text} value={this.state.content} onChange={this.changeContext.bind(this)} placeholder={'在此输入备注信息'}/>
                                    <div className={`${cssStyle.responseButton} ${cssStyle.flexCenter}`} onClick={this.saveRecord.bind(this)}>记 录</div>
                                </div>
                            </div>
                            <div className={cssStyle.bottomBox}>
                                {/*<Scrollbars>*/}
                                {/*</Scrollbars>*/}
                                <div className={`${cssStyle.nameItem} ${cssStyle.flexCenter}`}>未读：</div>
                                {result.noReadUser && result.noReadUser.map((item,index) =>
                                    <div key={index} className={`${cssStyle.nameItem} ${cssStyle.flexCenter}`}>{item.name}</div>
                                )}
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}