import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Scrollbars} from "react-custom-scrollbars";

export default class GroupPower extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.leaderType = {
            '1':'总指挥',
            '2':'第一指挥',
            '3':'副总指挥',
        };
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        let {handlePower} = this.props;
        return (
            <div className={cssStyle.handlePowerBox}>
                <Scrollbars >
                    <div className={cssStyle.handleTitleBox}>
                        <div className={cssStyle.handleTitleLine}/>
                        组织领导
                    </div>
                    <div className={cssStyle.handleContentBox}>
                        {handlePower.leader && handlePower.leader.map((leader,index)=>
                            <div className={cssStyle.handleContentRow} key={index} >
                                <span className={cssStyle.handleContentRowPart}>{this.leaderType[leader.commanderType]}</span>
                                <span className={cssStyle.handleContentRowPart}>{leader.departmentName}</span>
                                <span className={cssStyle.handleContentRowPart}>{leader.duty}</span>
                                <span className={cssStyle.handleContentRowPart}>{leader.userName}</span>
                            </div>
                        )}
                    </div>
                    <div className={cssStyle.handleTitleBox}>
                        <div className={cssStyle.handleTitleLine}/>
                        参与处置小组
                    </div>
                    <div className={cssStyle.handleContentBox}>
                        {handlePower.team && handlePower.team.map((team,index)=>
                            <div className={cssStyle.handleTeamBox} key={index} >
                                <div className={cssStyle.handleTeamName}>{team.teamName}</div>
                                {team.allMemberList && team.allMemberList.map((people,peopleIndex)=>
                                    <div className={cssStyle.handleContentRow} key={peopleIndex}>
                                        <span className={cssStyle.handleContentRowPart}>{people.departmentName}</span>
                                        <span className={cssStyle.handleContentRowPart}>{people.teamDuty}</span>
                                        <span className={cssStyle.handleContentRowPart}>{people.userName}</span>
                                        <span className={cssStyle.handleContentRowPart}>{people.teamUserPhone}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {handlePower.depart && (
                        <React.Fragment>
                            <div className={cssStyle.handleTitleBox}>
                                <div className={cssStyle.handleTitleLine}/>
                                基层站所
                            </div>
                            <div className={cssStyle.handleContentBox}>
                                {handlePower.depart.map((team,index)=>
                                    <div className={cssStyle.handleTeamBox} key={index} >
                                        <div className={cssStyle.handleTeamName}>{team.stationName}</div>
                                        {team.allMemberList && team.allMemberList.map((people,peopleIndex)=>
                                            <div className={cssStyle.handleContentRow} key={peopleIndex}>
                                                <span className={cssStyle.handleContentRowPart}>{people.departmentName}</span>
                                                <span className={cssStyle.handleContentRowPart}>{people.duty}</span>
                                                <span className={cssStyle.handleContentRowPart}>{people.userName}</span>
                                                <span className={cssStyle.handleContentRowPart}>{people.teamUserPhone}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    )}
                </Scrollbars>
            </div>
        );
    }
}