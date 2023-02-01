import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./emergency_response.module.css";
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import {Input, Modal} from "antd";
import axios from "axios";

import defaultIcon from "./images/defult.svg";
import selectedIcon from "./images/selected.svg";
import {interactData} from "../../common/util";

const { TextArea } = Input;

export default class EmergencyResponse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedType : 1,result:[],group:[],content:'',opacity:0};
        this.postData = {authName:'emerCommand:oneButtonResponse'};
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(resolve)});
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "showComponent":
                //显示当前组件
                break;
            case "dataInterchange":
                //接收数据
                for(const key in data.data){
                    this.postData[key] = data.data[key];
                }
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.p.then((result) => {
            this.setState({opacity:1,result});
        })
    }

    getData(resolve){
        const { dataSources } = this.props.thisData;
        if(dataSources.dataType === 1){
            let defaultData = [];
            try {
                defaultData = JSON.parse(dataSources.defaultData);
            }catch (e) {
            }
            if(resolve){
                resolve(defaultData);
            }else{
                this.setState({result:defaultData});
            }
        }else if(dataSources.dataType === 2){
            let params = {};
            try {
                params = JSON.parse(dataSources.dataParams);
            }catch (e) {}
            axios.get(dataSources.dataUrl,{params:{...params,warningLevel:this.state.selectedType}}).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if(result){
                    if(resolve){
                        resolve(result);
                    }else{
                        this.setState({result:result});
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    //修改等级
    changeLevel(level){
        this.setState({selectedType:level,group:[]});
        setTimeout(() => this.getData());
    }

    //选择小组
    selectGroup(item){
        const index = this.state.group.indexOf(item.id);
        const {group} = this.state;
        if(index >= 0){
            group.splice(index,1);
        }else{
            group.push(item.id);
        }
        this.setState(group);
    }

    //修改备注
    changeContext(event){
        this.setState({content:event.target.value});
    }

    //启动响应
    saveEmerCommond(){
        const { style } = this.props.thisData;
        const sendData = {
            ...this.postData,
            rbacToken: this.props.token,
            teamIds: this.state.group.join(","),
            content: this.state.content,
            warningLevel: this.state.selectedType
        };
        if(style.reportUrl){
            axios.post(style.reportUrl,sendData).then((response) =>{
                if(response.data.success){
                    //清空填写的数据
                    this.setState({group:[],content:''});
                    //通知筛选变更
                    this.sendMessage();
                }else{
                    Modal.error({
                        content: '启动失败！',
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

    render() {
        const { style } = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity:opacity,fontSize:fontSize}}>
                            <div className={cssStyle.head}>
                                <div className={cssStyle.selectBox}>
                                    <div className={`${cssStyle.selectItem} ${cssStyle.flexCenter} ${this.state.selectedType === 3 ? cssStyle.selectedItem:''}`} onClick={this.changeLevel.bind(this,3)}>红色预警</div>
                                    <div className={`${cssStyle.selectItem} ${cssStyle.flexCenter} ${this.state.selectedType === 2 ? cssStyle.selectedItem:''}`} onClick={this.changeLevel.bind(this,2)}>橙色预警</div>
                                    <div className={`${cssStyle.selectItem} ${cssStyle.flexCenter} ${this.state.selectedType === 1 ? cssStyle.selectedItem:''}`} onClick={this.changeLevel.bind(this,1)}>黄色预警</div>
                                </div>
                                <div className={`${cssStyle.responseButton} ${cssStyle.flexCenter}`} onClick={this.saveEmerCommond.bind(this)}>一键响应</div>
                            </div>
                            <div className={cssStyle.listBox}>
                                <Scrollbars>
                                    {this.state.result.map((item,index) =>
                                        <div className={`${cssStyle.listItem} ${cssStyle.flexCenter}`} key={index} onClick={this.selectGroup.bind(this,item)}>
                                            <img src={this.state.group.indexOf(item.id) >= 0 ? selectedIcon : defaultIcon} alt='' />
                                            {item.group_name}
                                        </div>
                                    )}
                                </Scrollbars>
                            </div>
                            <div className={cssStyle.remark}>备注</div>
                            <TextArea className={cssStyle.text} value={this.state.content} onChange={this.changeContext.bind(this)} placeholder={'在此输入备注信息'}/>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}