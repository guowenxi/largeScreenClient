import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Scrollbars} from "react-custom-scrollbars";
// import {PhotoSlider} from "react-photo-view";

export default class GroupPower extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {team:[],depart:[],visible: false, photoIndex: 0,imageList:[],fileList:[],videoList:[]};
        this.leaderType = {
            '0':'总指挥',
            '1':'第一指挥',
            '2':'副总指挥',
        };
    }

    //组件加载触发函数
    componentDidMount() {
        this.initUserData();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props detailId变更时更新事件及监控点
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime){
            this.initUserData();
        }
    }

    getMemberList(memberList){
        return memberList.map((people,peopleIndex)=>
            <div className={cssStyle.handleContentRow} key={peopleIndex}>
                <span className={cssStyle.handleContentRowPart}>{people.departmentName}</span>
                <span className={cssStyle.handleContentRowPart}>{people.memberTypeValue}</span>
                <span className={cssStyle.handleContentRowPart}>{people.userName}</span>
                <span className={cssStyle.handleContentRowPart}>{people.userPhone}</span>
            </div>
        );
    }

    mergeTeamUser(teamList,addTeamList,subKey){
        addTeamList.forEach((team)=>{
            let hasFindTeam = false;
            for(let i = 0;i < teamList.length;i ++){
                if(team[subKey] === teamList[i][subKey]){
                    const teamListUser = teamList[i].userList;
                    team.userList.forEach((user)=>{
                        let hasFind = false;
                        for(let j = 0;j < teamListUser.length;j ++){
                            if(teamListUser[j].userId === user.userId){
                                hasFind = true;
                                break;
                            }
                        }
                        if(!hasFind){
                            teamListUser.push(user);
                        }
                    });
                    hasFindTeam = true;
                    break;
                }
            }
            if(!hasFindTeam){
                teamList.push(team);
            }
        });
    }

    initUserData(){
        let {handlePower} = this.props;
        let addTeamList = [];
        handlePower.helpTeamUserList.forEach((item)=>{
            addTeamList.push({
                teamId:item.teamId,
                teamName:item.teamName,
                userList:[...item.leader,...item.deputy,...item.member]
            });
        });
        const teamSource = JSON.parse(JSON.stringify(handlePower.team || []));
        let team = [];
        teamSource.forEach((item)=>{
            team.push({
                teamId:item.teamId,
                teamName:item.teamName,
                userList:[...item.leader,...item.deputy,...item.member]
            });
        });
        this.mergeTeamUser(team,addTeamList,'teamId');
        const depart = JSON.parse(JSON.stringify((handlePower.depart || [])));
        const addDepartList = JSON.parse(JSON.stringify((handlePower.helpStationDutyUserList || [])));
        this.mergeTeamUser(depart,addDepartList,'stationId');
        //初始化跟踪反馈附件数据
        // let imageList = [];
        // let fileList = [];
        // let videoList = [];
        // if(latestFollowUpFeedback && latestFollowUpFeedback.handleFileList){
        //     latestFollowUpFeedback.handleFileList.forEach((file)=>{
        //         if(file.fileType.indexOf('image') >= 0){
        //             imageList.push(file);
        //         }else if(file.fileType.indexOf('video') >= 0){
        //             videoList.push(file);
        //         }else{
        //             fileList.push(file);
        //         }
        //     });
        // }
        // this.setState({ team,depart,imageList,fileList,videoList });
        this.setState({ team,depart });
    }

    // getImagePreview(){
    //     const { visible, photoIndex } = this.state;
    //     const {latestFollowUpFeedback,emergencyFileUrl} = this.props;
    //     if(latestFollowUpFeedback && latestFollowUpFeedback.handleFileList){
    //         return (
    //             <PhotoSlider
    //                 images={latestFollowUpFeedback.handleFileList.map((item) => ({ src: emergencyFileUrl+item.fileId }))}
    //                 visible={visible}
    //                 onClose={() => this.setState({ visible: false })}
    //                 onIndexChange={(index) => this.setState({ photoIndex: index })}
    //                 index={photoIndex}
    //             />
    //         )
    //     }else{
    //         return null;
    //     }
    // }

    render() {
        let {handlePower} = this.props;
        const {team,depart} = this.state;
        return (
            <div className={cssStyle.handlePowerBox}>
                <Scrollbars className={'blueScrollbars'} >
                    <div className={cssStyle.handleTitleBox}>
                        <div className={cssStyle.handleTitleLine}/>
                        组织领导
                    </div>
                    <div className={cssStyle.handleContentBox}>
                        {handlePower.leader && handlePower.leader.map((leader,leaderIndex)=>{
                            return leader && leader.map((item,index)=>
                                <div className={cssStyle.handleContentRow} key={leaderIndex+'_'+index} >
                                    <span className={cssStyle.handleContentRowPart}>{this.leaderType[leaderIndex]}</span>
                                    <span className={cssStyle.handleContentRowPart}>{item.departmentName}</span>
                                    <span className={cssStyle.handleContentRowPart}>{item.memberTypeValue}</span>
                                    <span className={cssStyle.handleContentRowPart}>{item.userName}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className={cssStyle.handleTitleBox}>
                        <div className={cssStyle.handleTitleLine}/>
                        参与处置小组
                    </div>
                    <div className={cssStyle.handleContentBox}>
                        {team && team.map((team,index)=>
                            <div className={cssStyle.handleTeamBox} key={index} >
                                <div className={cssStyle.handleTeamName}>{team.teamName}</div>
                                {team.userList && this.getMemberList(team.userList)}
                            </div>
                        )}
                        {handlePower.helpDepartmentUserList && handlePower.helpDepartmentUserList.length > 0 && (
                            <div className={cssStyle.handleTeamBox} >
                                <div className={cssStyle.handleTeamName}>特殊增派组</div>
                                {handlePower.helpDepartmentUserList.map((people,peopleIndex)=>
                                    <div className={cssStyle.handleContentRow} key={peopleIndex}>
                                        <span className={cssStyle.handleContentRowPart}>{people.departmentName}</span>
                                        <span className={cssStyle.handleContentRowPart}>{people.userName}</span>
                                        <span className={cssStyle.handleContentRowPart}>{people.userPhone}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {depart && depart.length > 0 && (
                        <React.Fragment>
                            <div className={cssStyle.handleTitleBox}>
                                <div className={cssStyle.handleTitleLine}/>
                                基层站所
                            </div>
                            <div className={cssStyle.handleContentBox}>
                                {depart.map((team,index)=>
                                    <div className={cssStyle.handleTeamBox} key={index} >
                                        <div className={cssStyle.handleTeamName}>{team.stationName}</div>
                                        {team.userList && team.userList.map((people,peopleIndex)=>
                                            <div className={cssStyle.handleContentRow} key={peopleIndex}>
                                                <span className={cssStyle.handleContentRowPart}>{people.departmentName}</span>
                                                {/*<span className={cssStyle.handleContentRowPart}>{people.duty}</span>*/}
                                                <span className={cssStyle.handleContentRowPart}>{people.userName}</span>
                                                <span className={cssStyle.handleContentRowPart}>{people.userPhone}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    )}
                    {handlePower.meetingRecords && handlePower.meetingRecords.length > 0 && (
                        <React.Fragment>
                            <div className={cssStyle.handleTitleBox}>
                                <div className={cssStyle.handleTitleLine}/>
                                掌上指挥
                            </div>
                            <div className={cssStyle.handleContentBox}>
                                {handlePower.meetingRecords.map((item,index)=>
                                    <div className={cssStyle.handleTeamBox} key={index} >
                                        <div className={cssStyle.handleTeamName}>{`${item.createTime}　会议发起人：${item.createUser}`}</div>
                                        {item.confereeList && item.confereeList.map((people,peopleIndex)=>
                                            <div className={cssStyle.handleContentRow} key={peopleIndex}>
                                                <span className={cssStyle.handleContentRowPart}>{people.departmentName}</span>
                                                {people.memberTypeCode && <span className={cssStyle.handleContentRowPart}>{people.memberTypeCode}</span>}
                                                <span className={cssStyle.handleContentRowPart}>{people.userName}</span>
                                                <span className={cssStyle.handleContentRowPart}>{people.userPhone}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    )}
                    {/*{completeRemark && (*/}
                    {/*    <React.Fragment>*/}
                    {/*        <div className={cssStyle.handleTitleBox}>*/}
                    {/*            <div className={cssStyle.handleTitleLine}/>*/}
                    {/*            处置完结内容*/}
                    {/*        </div>*/}
                    {/*        <div className={cssStyle.handleContentBox}>*/}
                    {/*            <div className={`${cssStyle.handleTeamBox} ${cssStyle.completeRemark}`}>*/}
                    {/*                {completeRemark}*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </React.Fragment>*/}
                    {/*)}*/}
                    {/*{latestFollowUpFeedback && (*/}
                    {/*    <React.Fragment>*/}
                    {/*        <div className={cssStyle.handleTitleBox}>*/}
                    {/*            <div className={cssStyle.handleTitleLine}/>*/}
                    {/*            后续跟踪*/}
                    {/*        </div>*/}
                    {/*        <div className={cssStyle.handleContentBox}>*/}
                    {/*            <div className={cssStyle.handleTeamBox}>*/}
                    {/*                <div className={cssStyle.handleTeamName}>{latestFollowUpFeedback.departmentName+' '+latestFollowUpFeedback.userName}</div>*/}
                    {/*                {latestFollowUpFeedback.handleTime && (*/}
                    {/*                    <React.Fragment>*/}
                    {/*                        <div className={cssStyle.handleContentRow}>{latestFollowUpFeedback.handleTime}</div>*/}
                    {/*                        <div className={cssStyle.handleContentRow}>{latestFollowUpFeedback.handleContent}</div>*/}
                    {/*                        <div className={`${cssStyle.handleContentRow} ${cssStyle.feedbackRow}`}>*/}
                    {/*                            {imageList && imageList.map((file,fileIndex)=>*/}
                    {/*                                <img className={cssStyle.feedbackImg} alt={''} src={emergencyFileUrl+file.fileId} key={fileIndex} onClick={() => this.setState({ visible: true, photoIndex: fileIndex })} />*/}
                    {/*                            )}*/}
                    {/*                            {videoList && videoList.map((item,index)=>*/}
                    {/*                                <video className={cssStyle.feedbackImg} key={index} src={emergencyFileUrl+item.fileId} controls="controls"/>*/}
                    {/*                            )}*/}
                    {/*                        </div>*/}
                    {/*                    </React.Fragment>*/}
                    {/*                )}*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </React.Fragment>*/}
                    {/*)}*/}
                    {handlePower.followUpFeedbackUserList && Array.isArray(handlePower.followUpFeedbackUserList) && handlePower.followUpFeedbackUserList.length > 0 && (
                        <React.Fragment>
                            <div className={cssStyle.handleTitleBox}>
                                <div className={cssStyle.handleTitleLine}/>
                                后续跟踪人员
                            </div>
                            <div className={cssStyle.handleContentBox}>
                                <div className={cssStyle.handleTeamBox}>
                                    {handlePower.followUpFeedbackUserList.map((people,peopleIndex)=>
                                        <div className={cssStyle.handleContentRow} key={peopleIndex}>
                                            {/*<span className={cssStyle.handleContentRowPart}>{people.departmentName}</span>*/}
                                            {/*<span className={cssStyle.handleContentRowPart}>{people.userName}</span>*/}
                                            {/*<span className={cssStyle.handleContentRowPart}>{people.userPhone}</span>*/}
                                            <span className={cssStyle.handleContentRowPart}>{people}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                </Scrollbars>
                {/*{this.state.visible && this.getImagePreview()}*/}
            </div>
        );
    }
}