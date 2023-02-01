import React from "react";
import cssStyle from "./eventTwo.module.css";
import {Scrollbars} from "react-custom-scrollbars";

import PointIconOne from "../images/pointOne.svg";
import PointIconTwo from "../images/pointTwo.svg";
import closeIcon from "../images/closeTypeOne.svg";

export default class EventTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.planName = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    closeDetail(){
        this.props.changeThisShow(false);
    }

    getPlanImg(type){
        switch (type) {
            case '医闹':
            case '房闹':
            case '路闹':
            case '项目进场闹':
                return {url:'./images/lucheng/plan2.png',name:'公共安全突发事件处置流程图'};
            case '劳动争议闹':
                return {url:'./images/lucheng/plan3.png',name:'劳资纠纷突发事件处置流程图'};
            case '特定群体闹':
                return {url:'./images/lucheng/plan4.png',name:'特定诉求群体突发事件处置流程图'};
            case '征地拆迁闹':
                return {url:'./images/lucheng/plan5.png',name:'征地拆迁突发事件处置流程图'};
            default:
                return {url:'./images/lucheng/plan1.png',name:'一三五总预案图'};
        }
    }

    render() {
        const {detail} = this.props;
        const planImg = this.getPlanImg(detail.eventType);
        if(this.props.thisData.showStatus){
            return (
                <div style={this.props.style} className={cssStyle.box} >
                    <div className={cssStyle.leftBox}>
                        <Scrollbars>
                            {detail.circulationStatus && detail.circulationStatus.length > 0 && (
                                <React.Fragment>
                                    <div className={cssStyle.title}>流转状态</div>
                                    <div className={cssStyle.timeLineBox}>
                                        <div className={cssStyle.line} />
                                        {detail.circulationStatus.map((circulation,index)=>{
                                            return (
                                                <div className={cssStyle.timeStepBox} key={index}>
                                                    <div className={cssStyle.pointStatus}>{circulation.status}</div>
                                                    <img alt={''} src={circulation.time ? PointIconOne:PointIconTwo} className={cssStyle.timePoint} />
                                                    <div className={cssStyle.pointTime}>{circulation.time}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </React.Fragment>
                            )}
                            <div className={cssStyle.title}>事件简述</div>
                            <div className={`${cssStyle.content} ${cssStyle.blueColor}`}>
                                {detail.incidentContent}
                            </div>
                            <div className={cssStyle.title}>发生时间</div>
                            <div className={`${cssStyle.content} ${cssStyle.yellowColor}`}>
                                {detail.incidentTime}
                            </div>
                            <div className={cssStyle.title}>涉事类别</div>
                            <div className={`${cssStyle.content} ${cssStyle.blueColor}`}>
                                {detail.eventType}
                            </div>
                            <div className={cssStyle.title}>化解状态</div>
                            <div className={`${cssStyle.content}`} style={{color:detail.isSolve === 1 ? '#12cc5e':'#e80723'}}>
                                {detail.isSolve === 1 ? '已化解':'未化解'}
                            </div>
                            <div className={cssStyle.title}>重点挑头人员</div>
                            <div className={`${cssStyle.content} ${cssStyle.greenColor}`}>
                                {detail.leaderList && detail.leaderList.map((item,index) =>
                                    <div className={cssStyle.peopleBox} key={index}>
                                        <div>姓名：{item.name}</div>
                                        <div>联系电话：{item.phone}</div>
                                        <div>身份证号码：{item.cardId}</div>
                                    </div>
                                )}
                            </div>
                            <div className={cssStyle.title}>涉事人数</div>
                            <div className={`${cssStyle.content} ${cssStyle.greenColor}`}>
                                {detail.peopleNum}
                            </div>
                            <div className={cssStyle.title}>事发地点</div>
                            <div className={`${cssStyle.content} ${cssStyle.greenColor}`}>
                                {detail.address}
                            </div>
                            <div className={cssStyle.title}>所属街道</div>
                            <div className={`${cssStyle.content} ${cssStyle.greenColor}`}>
                                {detail.road}
                            </div>
                            <div className={cssStyle.title}>是否重大</div>
                            <div className={`${cssStyle.content} ${cssStyle.greenColor}`}>
                                {detail.isGreat}
                            </div>
                            <div className={cssStyle.title}>是否紧急</div>
                            <div className={`${cssStyle.content} ${cssStyle.greenColor}`}>
                                {detail.isUrgent}
                            </div>
                            <div className={cssStyle.title}>关联信息</div>
                            <div className={`${cssStyle.content} ${cssStyle.greenColor}`}>
                                {detail.aboutMessage}
                            </div>
                            <div className={cssStyle.title}>责任单位</div>
                            <div className={`${cssStyle.content} ${cssStyle.greenColor}`}>
                                {detail.department}
                            </div>
                            <div className={cssStyle.title}>包案领导</div>
                            <div className={`${cssStyle.content} ${cssStyle.greenColor}`}>
                                {detail.dutyDepartmentLeader ? detail.dutyDepartmentLeader+(detail.dutyDepartmentJob ? ` -- ${detail.dutyDepartmentJob}`:''):''}
                            </div>
                            <div className={cssStyle.title}>化解专班成员</div>
                            <div className={`${cssStyle.content} ${cssStyle.greenColor}`}>
                                {detail.allControlList && detail.allControlList.map((item,index) =>
                                    <div className={cssStyle.peopleBox} key={index}>
                                        <div>姓名：{item.name}</div>
                                        <div>工作单位：{item.department}</div>
                                        <div>职务：{item.duty}</div>
                                        <div>联系电话：{item.phone}</div>
                                    </div>
                                )}
                            </div>
                            <div className={cssStyle.title}>稳控化解方案</div>
                            <div className={`${cssStyle.content} ${cssStyle.greenColor}`}>
                                {detail.measure}
                            </div>
                            <div className={cssStyle.title}>反馈内容</div>
                            <div className={`${cssStyle.content} ${cssStyle.greenColor}`}>
                                {detail.disposalSituation}
                            </div>
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.rightBox}>
                        <div className={cssStyle.title}>{planImg.name}</div>
                        <img alt='' src={closeIcon} className={cssStyle.closeIcon} onClick={this.closeDetail.bind(this)}/>
                        <img alt={''} src={planImg.url} className={cssStyle.stepImg}/>
                    </div>
                </div>
            );
        }else{
            return (
                <div style={this.props.style} className={cssStyle.box} />
            );
        }
    }
}