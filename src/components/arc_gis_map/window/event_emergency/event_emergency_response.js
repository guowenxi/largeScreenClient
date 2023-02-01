import React from "react";
import cssStyle from "./event_emergency.module.css";
import ReactDOM from "react-dom";
import closeIcon from "./images/close.svg";
import axios from "axios";
import {Scrollbars} from "react-custom-scrollbars";
import {Input, Modal} from "antd";
import Emitter from "../../../../common/eventBus";

import defaultIcon from "./images/unselect.svg";
import redIcon from "./images/red.svg";
import yellowIcon from "./images/yellow.svg";
import orangeIcon from "./images/orange.svg";

const { TextArea } = Input;

export default class EventEmergencyResponse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedText:'选择应急预案',planList:[],planListShow:false,group:[],groupList:[],content:'',selectedType:1};
        this.colorList = ["#d8b10f","#e0610a","#d30000"];
        this.iconList = [yellowIcon,orangeIcon,redIcon];
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.firstLoad === false){
            this.animateOn();
        }
        this.loadData();
        this.changeLevel(1);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //加载数据
    loadData(){
        const {attributes} = this.props;
        if(attributes.planUrl){
            axios.get(attributes.planUrl).then((response) => {
                const result = response.data.data;
                if(result && result.list){
                    this.setState({planList: result.list});
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    //点击显示预案列表
    showPlanList(){
        this.setState({planListShow:!this.state.planListShow});
    }

    //修改预案
    changePlan(plan){
        this.setState({selectedText:plan.name,planListShow:false});
        this.selectedPlan = plan.id;
    }

    //修改等级
    changeLevel(level){
        this.setState({selectedType:level,group:[]});
        const {attributes} = this.props;
        if(attributes.groupUrl){
            axios.get(attributes.groupUrl,{params:{warningLevel:level}}).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if(result){
                    this.setState({groupList:result});
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
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
        const {attributes} = this.props;
        const sendData = {
            authName:'emerCommand:oneButtonResponse',
            eventId:attributes.id,
            title:attributes.title,
            rbacToken: this.props.token,
            teamIds: this.state.group.join(","),
            content: this.state.content,
            warningLevel: this.state.selectedType,
            planFileId: this.selectedPlan
        };
        if(attributes.reportUrl){
            axios.post(attributes.reportUrl,sendData).then((response) =>{
                if(response.data.success){
                    //清空填写的数据
                    this.setState({group:[],content:''});
                    //关闭窗口
                    this.props.hideEmergencyResponse(true);
                    //通知组件显示
                    let message = {};
                    message[attributes.keyName] = response.data.data;
                    Emitter.emit(attributes.receiveId,{type:'showComponent',data:message});
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

    render() {
        return ReactDOM.createPortal(
            (
                <div className={cssStyle.editBox} style={{...this.props.style,backgroundColor:this.colorList[this.state.selectedType-1]}} >
                    <img alt='' src={closeIcon} className={cssStyle.closeIcon} onClick={this.props.hideEmergencyResponse.bind(this,false)}/>
                    <div className={cssStyle.selectBox} style={{backgroundColor:this.colorList[this.state.selectedType-1]}}>
                        <div className={cssStyle.selectItem} onClick={this.showPlanList.bind(this)}>
                            {this.state.selectedText}
                        </div>
                        {this.state.planListShow && this.state.planList.map((plan,planIndex) =>
                            <div className={cssStyle.selectItem} key={planIndex} onClick={this.changePlan.bind(this,plan)}>
                                {plan.name}
                            </div>
                        )}
                    </div>
                    <div className={cssStyle.groupTypeBox}>
                        <div className={`${cssStyle.groupTypeItem} ${this.state.selectedType === 3 ? cssStyle.groupTypeSelected:''}`} onClick={this.changeLevel.bind(this,3)}>红色响应</div>
                        <div className={`${cssStyle.groupTypeItem} ${this.state.selectedType === 2 ? cssStyle.groupTypeSelected:''}`} onClick={this.changeLevel.bind(this,2)}>橙色响应</div>
                        <div className={`${cssStyle.groupTypeItem} ${this.state.selectedType === 1 ? cssStyle.groupTypeSelected:''}`} onClick={this.changeLevel.bind(this,1)}>黄色响应</div>
                    </div>
                    <Scrollbars style={{width:'100%',height:'calc(100% - 40vh)'}}>
                        {this.state.groupList.map((item,index) =>
                            <div className={`${cssStyle.groupItem} ${cssStyle.flexCenter}`}  key={index} onClick={this.selectGroup.bind(this,item)}>
                                <img src={this.state.group.indexOf(item.id) >= 0 ? this.iconList[this.state.selectedType-1] : defaultIcon} alt='' />
                                {item.group_name}
                            </div>
                        )}
                    </Scrollbars>
                    <TextArea className={cssStyle.text} value={this.state.content} onChange={this.changeContext.bind(this)} placeholder={'在此输入备注信息'}/>
                    <div className={cssStyle.sendButton} onClick={this.saveEmerCommond.bind(this)}>发　送</div>
                </div>
            ),
            document.getElementById(this.props.mapId)
        );
    }
}