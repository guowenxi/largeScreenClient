import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import StepLine from "./stepLine";

import timeIcon from "./images/time.png";
import stepIconOne from "./images/step01.png";
import stepIconTwo from "./images/step02.png";
import {Modal} from "antd";
import axios from "axios";
import {emergencyUrl} from "../../config";

const { confirm } = Modal;

export default class planStep extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {now:''};
    }

    //组件加载触发函数
    componentDidMount() {
        this.changeStartTime();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.createTime !== this.props.createTime && this.props.createTime != null){
            //组件数据源变更时刷新数据
            if(this.timer){
                clearTimeout(this.timer);
            }
            this.changeStartTime();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.timer){
            clearTimeout(this.timer);
        }
    }

    changeStartTime(){
        if(this.props.createTime){
            this.startTime = (new Date(this.props.createTime.replace(/-/g, '/'))).getTime();
            this.dateTimeout();
        }
    }

    //定时刷新时间
    dateTimeout(){
        const now = this.props.endTime ? (new Date(this.props.endTime.replace(/-/g, '/'))).getTime() : (new Date()).getTime();
        const sub = now - this.startTime;
        const hour = Math.floor(sub/3600000);
        const minuteLeft = sub%3600000;
        const minute = Math.floor(minuteLeft/60000);
        const secondLeft = minuteLeft%60000;
        const second = Math.floor(secondLeft/1000);
        this.setState({now:(hour< 10 ? '0'+hour:hour)+':'+(minute< 10 ? '0'+minute:minute)+':'+(second< 10 ? '0'+second:second)});
        if(!this.props.isEnd){
            this.timer = setTimeout(()=>this.dateTimeout(),1000);
        }
    }

    getChildWidth(step){
        if(step){
            const children = step.children;
            if(children && children.length >= 1){
                let width = 0;
                let hasOtherFinish = false;
                children.forEach((item)=>{
                    if(item.runFlag){
                        hasOtherFinish = true;
                    }
                    width = width + this.getChildWidth(item);
                });
                if(hasOtherFinish){
                    children.forEach((item)=>{
                        if(!item.runFlag && hasOtherFinish){
                            item.hasOtherFinish = true;
                        }
                    });
                }
                step.width = width;
            }else{
                step.width = 1;
            }
            return step.width;
        }else{
            return 0;
        }
    }

    finishStep(step,parentFlag){
        if(!step.runFlag){
            if(parentFlag){
                if(step.hasOtherFinish){
                    Modal.info({
                        content: '已进入其他分支，无法结束该节点！',
                    });
                }else{
                    confirm({
                        title: '确定要结束该节点吗？',
                        content: '',
                        okText:'确认',
                        cancelText:'取消',
                        onOk:()=> {
                            const sendData = {
                                rbacToken:this.props.token,
                                emergencyId:this.props.emergencyId,
                                operationType:103,
                                nextPlanTaskId:step.id
                            };
                            return new Promise((resolve) => {
                                axios.post(emergencyUrl+"/socialGovernance/emergencyProcess/emergencyOperate", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                                    resolve();
                                    if(response.data.success){
                                        Modal.success({
                                            content: '已完成该节点。',
                                        });
                                        if(step.planTaskType === 'ZFW00405'){
                                            this.props.changeListShow({id:3,name:'已结束'},true);
                                        }else{
                                            this.props.reGetDetail();
                                        }
                                    }else{
                                        Modal.error({
                                            content: response.data.data,
                                        });
                                    }
                                }).catch( (error) => {
                                    resolve();
                                    Modal.error({
                                        content: '请求出错！',
                                    });
                                });
                            }).catch(() => console.log('Oops errors!'));
                        },
                        onCancel:()=> {},
                    });
                }
            }else{
                Modal.info({
                    content: '上一节点未完成，无法结束该节点！',
                });
            }
        }
    }

    getStepOne(step,parentWidth,parentFlag){
        let hasChild = step.children && step.children.length > 0;
        return (
            <div className={cssStyle.stepOneBox} style={{width:step.width*100/parentWidth +'%'}}>
                <div className={cssStyle.stepNameBox} style={{marginBottom:hasChild?'4.5em':'0px',cursor:step.runFlag?'default':'pointer'}}>
                    <StepLine step={step} />
                    <div className={cssStyle.stepName} onClick={this.finishStep.bind(this,step,parentFlag)}>
                        <img alt={''} src={step.runFlag ? stepIconTwo:stepIconOne} className={`${cssStyle.stepBg} ${step.runFlag ? cssStyle.finishStepBg:''}`} />
                        <span>{step.name}</span>
                    </div>
                </div>
                <div className={cssStyle.stepChildBox}>
                    {hasChild && step.children.map((child,index)=>{
                        return (
                            <React.Fragment key={index}>
                                {this.getStepOne(child,step.width,step.runFlag)}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        )
    }

    render() {
        const {planStep} = this.props;
        const {now} = this.state;
        if(planStep.process){
            this.getChildWidth(planStep.process);
            return (
                <div className={cssStyle.planStepBox}>
                    <div className={cssStyle.planNameBox}>
                        <div className={cssStyle.planName}>{planStep.planName}</div>
                    </div>
                    <div className={cssStyle.timeBox}>
                        <img alt={''} src={timeIcon} className={cssStyle.timeIcon} />
                        <div className={cssStyle.timeText}>{now}</div>
                    </div>
                    <div className={cssStyle.stepBox}>
                        <Scrollbars>
                            <div className={cssStyle.stepBoxBg} style={{width:planStep.process.width*50+'%'}}>
                                {this.getStepOne(planStep.process,planStep.process.width)}
                            </div>
                        </Scrollbars>
                    </div>
                </div>
            );
        }else{
            return '';
        }
    }
}