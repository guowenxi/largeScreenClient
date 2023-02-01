import React from "react";
import cssStyle from "./eventNine.module.css";
import {Scrollbars} from "react-custom-scrollbars";

export default class EventOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {time:''};
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    //组件加载触发函数
    componentDidMount() {
        this.startTimer();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(this.props.getDataTime !== prevProps.getDataTime){
            clearTimeout(this.timer);
            this.startTimer();
        }
    }

    startTimer(){
        const {detail} = this.props;
        if(detail.startTime){
            const now = detail.endTime ? (new Date(detail.endTime.replace(/-/g, '/'))).getTime() : (new Date()).getTime();
            this.subTime = now - (new Date(detail.startTime.replace(/-/g, '/'))).getTime();
            this.dateTimeout();
        }else{
            this.setState({time:'00:00:00'});
        }
    }

    dateTimeout(){
        const day = Math.floor(this.subTime/(3600000*24));
        const dayLeft = this.subTime%(3600000*24);
        const hour = Math.floor(dayLeft/3600000);
        const minuteLeft = this.subTime%3600000;
        const minute = Math.floor(minuteLeft/60000);
        const secondLeft = minuteLeft%60000;
        const second = Math.floor(secondLeft/1000);
        this.setState({time:(day ? day+'天 ':'')+(hour< 10 ? '0'+hour:hour)+':'+(minute< 10 ? '0'+minute:minute)+':'+(second< 10 ? '0'+second:second)});
        this.timer = setTimeout(()=>{
            this.subTime += 1000;
            this.dateTimeout();
        },1000);
    }

    render() {
        const {detail} = this.props;
        const {time} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.contentBox}>
                    <div className={cssStyle.head}>任务基本信息</div>
                    <div className={cssStyle.detailBox}>
                        <Scrollbars>
                            <div className={cssStyle.row}>
                                <span className={cssStyle.title}>事件类型：</span>
                                {detail.type}
                            </div>
                            <div className={cssStyle.row}>
                                <span className={cssStyle.title}>事发时间：</span>
                                {detail.startTime}
                            </div>
                            <div className={cssStyle.row}>
                                <span className={cssStyle.title}>现实行为：</span>
                                {detail.actionType}
                            </div>
                            <div className={cssStyle.row}>
                                <span className={cssStyle.title}>所属街道：</span>
                                {detail.road}
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.title}>事件描述：</div>
                                {detail.content}
                            </div>
                        </Scrollbars>
                    </div>
                </div>
                <div className={cssStyle.centerLine} />
                <div className={cssStyle.contentBox}>
                    <div className={cssStyle.head}>应急计时</div>
                    <div className={cssStyle.timeBox}>{time}</div>
                    <div className={cssStyle.detailBox}>
                        <Scrollbars>
                            <div className={cssStyle.processBox}>
                                <div className={cssStyle.processLine} />
                                {detail.process && Array.isArray(detail.process) && detail.process.map((item,index)=>
                                    <div className={cssStyle.stepBox} key={index}>
                                        <div className={cssStyle.point} />
                                        <div className={cssStyle.time}>{item.time}</div>
                                        <div className={cssStyle.stepContent}>{item.content}</div>
                                    </div>
                                )}
                            </div>
                        </Scrollbars>
                    </div>
                </div>
            </div>
        );
    }
}