import React from "react";
import cssStyle from "./groupDetailOne.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {interactData} from "../../../common/util";
import HeadIcon from "../images/headIconOne.png"

export default class GroupDetailOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showIndex:0};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    changeShow(index){
        this.setState({showIndex:index});
    }

    render() {
        const { detail } = this.props;
        const { showIndex } = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.headBox}>
                    <img alt={''} src={HeadIcon} />
                    <div>第{detail.teamNumber}小队</div>
                </div>
                <div className={cssStyle.changeBox}>
                    {['基本信息','成员信息','反馈信息'].map((item,index)=>
                        <div className={showIndex === index ? cssStyle.selected:''} key={index} onClick={this.changeShow.bind(this,index)}>{item}</div>
                    )}
                </div>
                {showIndex === 0 && (
                    <React.Fragment>
                        <div className={cssStyle.row}>所属区划：{detail.orgCountyMc}/{detail.orgRoadMc}/{detail.orgCommunityMc}</div>
                        <div className={cssStyle.row}>网格长:{detail.gridLeaderName+' '+detail.gridLeaderPhone}</div>
                        <div className={cssStyle.row}>
                            <span className={cssStyle.teamLeader}>小队长：{detail.teamLeaderName+' '+detail.teamLeaderPhone}</span>
                            <span className={cssStyle.teamMember}>小队成员数：{detail.teamMemberNum}</span>
                        </div>
                        <div className={cssStyle.gridName}>
                            <div>负责区块：</div>
                            <div className={cssStyle.gridContent}>
                                <Scrollbars >
                                    {detail.gridName}
                                </Scrollbars>
                            </div>
                        </div>
                        <div className={cssStyle.row}>区块内人数：{detail.girdPeopleCount}</div>
                        {detail.signature && (
                            <div className={cssStyle.imgRow}>
                                <div>签字确认：</div>
                                <img alt={''} src={detail.signature} />
                            </div>
                        )}
                    </React.Fragment>
                )}
                {showIndex === 1 && (
                    <div className={cssStyle.memberBox}>
                        <Scrollbars >
                            {detail.memberList && Array.isArray(detail.memberList) && detail.memberList.map((item,index)=>
                                <React.Fragment key={index}>
                                    <div className={cssStyle.memberRow}>
                                        <span className={cssStyle.teamMember}>成员{index+1}：{item.name}</span>
                                        <span className={cssStyle.teamLeader}>联系方式：{item.phone}</span>
                                    </div>
                                    <div className={cssStyle.splitLine} />
                                </React.Fragment>
                            )}
                        </Scrollbars>
                    </div>
                )}
                {showIndex === 2 && (
                    <div className={cssStyle.feedbackContent}>
                        <Scrollbars >
                            {detail.feedback && Array.isArray(detail.feedback) && detail.feedback.map((item,index)=>
                                <div key={index} className={cssStyle.feedbackOne}>
                                    <div className={cssStyle.row}>反馈时间：{item.backTime}</div>
                                    <div className={cssStyle.row}>小队长：{item.leader+' '+item.leaderPhone}</div>
                                    <div className={cssStyle.row}>完成情况：{item.completion}</div>
                                    {item.memberNum != null && <div className={cssStyle.row}>编组实际人数：{item.memberNum}</div>}
                                </div>
                            )}
                        </Scrollbars>
                    </div>
                )}
            </div>
        );
    }
}