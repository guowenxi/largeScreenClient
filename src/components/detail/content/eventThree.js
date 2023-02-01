import React from "react";
import cssStyle from "./eventThree.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import {interactData} from "../../../common/util";
import {SpringSystem} from "rebound";

import BlankImg from "../images/blankOne.png";

export default class EventTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showIndex = 0;
        this.planName = {};
        this.themeCss = ['','',cssStyle.themeTwo];
        this.scrollbars = React.createRef();
        this.interactData = interactData.bind(this);
        this.handleSpringUpdate = this.handleSpringUpdate.bind(this);
        this.levelColor = {'高':'rgb(235,75,77)','中':'#ef851a','低':'#fbc800'};
    }

    //组件删除时触发函数
    componentWillUnmount() {
        this.springSystem.deregisterSpring(this.spring);
        this.springSystem.removeAllListeners();
        this.springSystem = undefined;
        this.spring.destroy();
        this.spring = undefined;
        if(this.autoMoveTimer){
            clearTimeout(this.autoMoveTimer);
        }
    }

    //组件加载触发函数
    componentDidMount() {
        this.springSystem = new SpringSystem();
        this.spring = this.springSystem.createSpring(200,30);
        this.spring.addListener({ onSpringUpdate: this.handleSpringUpdate });
        this.autoMove();
    }

    handleSpringUpdate(spring) {
        const val = spring.getCurrentValue();
        this.scrollbars.current.scrollTop(val);
    }

    getScrollTop() {
        return this.scrollbars.current.getScrollTop();
    }

    getScrollHeight() {
        return this.scrollbars.current.getScrollHeight();
    }

    getHeight() {
        return this.scrollbars.current.getClientHeight();
    }

    scrollTop(top) {
        const scrollTop = this.getScrollTop();
        this.spring.setCurrentValue(scrollTop).setAtRest();
        this.spring.setEndValue(top);
    }

    autoMove(){
        const { style } = this.props.thisData;
        this.autoMoveTimer = setTimeout(()=>{
            const {detail} = this.props;
            const eventList = style.contentType === 2 ? detail : (detail ? detail.eventList:[]);
            if(eventList && eventList.length > 0){
                const length = eventList.length;
                this.showIndex ++;
                // console.log(this.showIndex);
                if(length <= this.showIndex){
                    this.showIndex = 0;
                }
                const dom = document.getElementsByClassName(this.props.thisData.id+'_detailBox')[this.showIndex];
                const scrollTop = dom.offsetTop;
                const scrollHeight = this.getScrollHeight();
                const height = this.getHeight();
                const remain = scrollHeight - scrollTop - height;
                if(remain > 0){
                    this.scrollTop(scrollTop);
                }else{
                    this.scrollTop(scrollHeight - height);
                    this.showIndex = -1;
                }
            }
            this.autoMove();
        },style.autoMoveTime ? style.autoMoveTime : 5000);
    }

    getUnit(type){
        switch (type) {
            case 1:
            case 4:
                return '个';
            case 2:
            case 5:
                return '处';
            case 3:
                return '名';
            default:
                return '个';
        }
    }

    getReasonContent(reason){
        if(reason){
            let result = [];
            if(reason.title){
                result.push(reason.title+',');
            }
            const {content} = reason;
            if(content && content.length > 0){
                content.forEach((part,index)=>{
                    result.push(
                        <span className={cssStyle.reasonPart} onClick={this.reasonClick.bind(this,part)}>
                            {part.name}{part.type === 4 ? '点':''}<span className={cssStyle.redColor}>{part.num}</span>{this.getUnit(part.type)}{index === content.length-1 ? '。':'，'}
                        </span>
                    );
                });
            }
            return result.map((item,index)=>
                <React.Fragment key={index}>
                    {item}
                </React.Fragment>
            );
        }else{
            return '';
        }
    }

    reasonClick(part){
        const { reasonInteract } = this.props.thisData.style;
        this.interactData(reasonInteract, part);
    }

    eventClick(event){
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, event);
    }

    //手动拖动时结束定时自动滚动任务
    handleScrollStart(){
        clearTimeout(this.autoMoveTimer);
    }

    //手动拖动完毕时开始定时自动滚动任务
    handleScrollStop(){
        this.autoMove();
    }

    getContent(contentType,event){
        if(contentType === 2){
            return (
                <div className={cssStyle.detailContent}>
                    <div className={cssStyle.detailRow}>
                        <div className={cssStyle.rowTitle}>预警等级：</div>
                        <div className={cssStyle.rowContent} style={{color:this.levelColor[event.warningLevel]}}>{event.warningLevel}</div>
                    </div>
                    <div className={cssStyle.detailRow}>
                        <div className={cssStyle.rowTitle}>预警时间：</div>
                        <div className={cssStyle.rowContent}>{event.warningTime}</div>
                    </div>
                    <div className={cssStyle.detailRow}>
                        <div className={cssStyle.rowTitle}>预警原因：</div>
                        <div className={cssStyle.rowContent}>{event.reasonContent}</div>
                    </div>
                </div>
            );
        }else{
            return (
                <div className={cssStyle.detailContent}>
                    <div className={cssStyle.detailRow}>
                        <div className={cssStyle.rowTitle}>预警等级：</div>
                        <div className={cssStyle.rowContent}  style={{color:this.levelColor[event.warningLevel]}}>{event.warningLevel}</div>
                    </div>
                    <div className={cssStyle.detailRow}>
                        <div className={cssStyle.rowTitle}>预警原因：</div>
                        <div className={cssStyle.rowContent}>{this.getReasonContent(event.reasonContent)}</div>
                    </div>
                </div>
            );
        }
    }

    render() {
        const {detail} = this.props;
        const { style } = this.props.thisData;
        const eventList = style.contentType === 2 ? detail : (detail ? detail.eventList:[]);
        return (
            <div style={this.props.style} className={`${cssStyle.box} ${this.themeCss[style.contentStyle]}`} >
                {style.contentType !== 2 && <div className={cssStyle.head}>{detail.title}</div>}
                <div className={cssStyle.eventListBox} >
                    <Scrollbars
                        ref={this.scrollbars}
                        onMouseEnter={this.handleScrollStart.bind(this)}
                        onMouseLeave={this.handleScrollStop.bind(this)}
                    >
                        {eventList && eventList.map && eventList.length > 0 ? eventList.map((event,index)=>
                            <div className={`${cssStyle.detailBox} ${this.props.thisData.id+'_detailBox'}`} key={index} onClick={this.eventClick.bind(this,event)}>
                                <div className={cssStyle.headTwo}>
                                    {/*<div className={cssStyle.line}/>*/}
                                    <div>{event.title}</div>
                                </div>
                                {this.getContent(style.contentType,event)}
                            </div>

                        ) : (
                            <div className={cssStyle.blankBox}>
                                <img alt={''} src={BlankImg} />
                                <div className={cssStyle.blankText}>暂无数据</div>
                            </div>
                        )}
                    </Scrollbars>
                </div>
            </div>
        );
    }
}