import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import StepLine from "./stepLine";

import timeIcon from "./images/time.png";
import stepIconOne from "./images/step01.png";
import stepIconTwo from "./images/step02.png";
import {Modal} from "antd";
import axios from "axios";
import {PhotoSlider} from "react-photo-view";

const { confirm } = Modal;

export default class planStep extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {now:'',visible: false, photoIndex: 0};
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
            let createTime;
            if(this.props.createTime.indexOf(' ') < 0){
                createTime = this.props.createTime + ' 00:00:00';
            }else{
                createTime = this.props.createTime;
            }
            this.startTime = (new Date(createTime.replace(/-/g, '/'))).getTime();
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

    finishStep(step){
        if(step.assignHandling){
            confirm({
                title: '确定要完成该节点吗？',
                content: '',
                okText:'确认',
                cancelText:'取消',
                onOk:()=> {
                    const sendData = {
                        rbacToken:this.props.token,
                        eventId:this.props.emergencyId,
                        taskId:step.id
                    };
                    return new Promise((resolve) => {
                        axios.post(this.props.emergencyUrl+"/socialGovernance/commandDispatch/taskComplete", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                            resolve();
                            if(response.data.success){
                                Modal.success({
                                    content: '已完成该节点。',
                                });
                                this.props.reGetDetail();
                            }else{
                                Modal.error({
                                    content: response.data.message,
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
    }

    getStepOne(step,parentWidth,parentFlag){
        let hasChild = step.children && step.children.length > 0;
        return (
            <div className={cssStyle.stepOneBox} style={{width:step.width*100/parentWidth +'%'}}>
                <div className={cssStyle.stepNameBox} style={{marginBottom:hasChild?'4.5em':'0px'}}>
                    <StepLine step={step} />
                    <div className={`${cssStyle.stepName} ${step.assignHandling ? cssStyle.canClick:''}`} onClick={this.finishStep.bind(this,step,parentFlag)}>
                        <img alt={''} src={step.complete ? stepIconTwo:stepIconOne} className={`${cssStyle.stepBg} ${step.complete ? cssStyle.finishStepBg:''}`} />
                        <span>{step.taskName}</span>
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

    getImagePreview(){
        const { visible, photoIndex } = this.state;
        const {flowFileId,emergencyFileUrl} = this.props;
        if(flowFileId){
            return (
                <PhotoSlider
                    images={flowFileId.split(',').map((item) => ({ src: emergencyFileUrl+item }))}
                    visible={visible}
                    onClose={() => this.setState({ visible: false })}
                    onIndexChange={(index) => this.setState({ photoIndex: index })}
                    index={photoIndex}
                />
            )
        }else{
            return null;
        }
    }

    render() {
        const {planStep,planName,flowFileId,emergencyFileUrl} = this.props;
        const {now} = this.state;
        if(planStep){
            this.getChildWidth(planStep);
            return (
                <div className={cssStyle.planStepBox}>
                    <div className={cssStyle.planNameBox}>
                        <div className={cssStyle.planName}>{planName}</div>
                    </div>
                    <div className={cssStyle.timeBox}>
                        <img alt={''} src={timeIcon} className={cssStyle.timeIcon} />
                        <div className={cssStyle.timeText}>{now}</div>
                    </div>
                    <div className={cssStyle.stepBox}>
                        <Scrollbars className={'blueScrollbars'}>
                            <div className={cssStyle.stepBoxBg} style={{width:planStep.width*50+'%',marginLeft:planStep.width === 1 ? '25%':'0%'}}>
                                {this.getStepOne(planStep,planStep.width)}
                            </div>
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.stepImgBox}>
                        {flowFileId && flowFileId.split(',').map((item,index)=>
                            <img className={cssStyle.stepImgOne} src={emergencyFileUrl+item} alt={''} key={index}  onClick={() => this.setState({ visible: true, photoIndex: index })}  />
                        )}
                    </div>
                    {this.state.visible && this.getImagePreview()}
                </div>
            );
        }else{
            return '';
        }
    }
}