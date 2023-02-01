import React from "react";
import {Icon} from 'antd';
import {Scrollbars} from "react-custom-scrollbars";
import ComponentBox from "../component_box";
import Emitter from "../../common/eventBus";
import PhoneOcx from "./phone_ocx";
import {GPS} from '../../common/locationChange';

import cssStyle from './phone_tree_list.module.css';

import callIcon from './image/tel_green.svg';
import hangUpIcon from './image/tel_red.svg';
import showIcon from './image/show.svg';
import insertIcon from './image/charu.svg';
import {isChrome} from "../../config";
import EmptyDom from "../../common/emptyDom";

export default class PhoneTreeList extends React.Component {
    constructor(props) {
        super(props);
        // videoMemberList 通话视频列表 callMember 拨打的会议内成员列表 videoMemberIdList 正在播放画面的会议内成员id列表 interposeId 强插时点击的用户id
        this.state = {data:{},groupList:[],videoMemberList:[],onlinePeople:'',callMember:[],videoMemberIdList:[],interposeId:''};
        this.keyParams = {};
        this.isCallInit = false;	//是否初始化
        this.isCallRegist = false;	//是否注册账号
        if(props.editType){
            this.groupList = [{"id":"55250","name":"宁海综治维稳平台","child":[{"id":"55251","name":"宁海综治办","child":[{"id":"56300","name":"56300","type":"item"},{"id":"56301","name":"56301","type":"item"},{"id":"56302","name":"56302","type":"item"},{"id":"56303","name":"56303","type":"item"},{"id":"56304","name":"56304","type":"item"},{"id":"56305","name":"56305","type":"item"}]},{"id":"55252","name":"宁海综治办通讯组","child":[{"id":"56300","name":"56300","type":"item"},{"id":"56301","name":"56301","type":"item"},{"id":"56302","name":"56302","type":"item"},{"id":"56303","name":"56303","type":"item"},{"id":"56304","name":"56304","type":"item"},{"id":"56305","name":"56305","type":"item"}]}]}];    //单兵组织列表
        } else {
            this.groupList = [];    //单兵组织列表
        }
        this.allGroupStr = '';  //单兵组织id列表字符串
        this.addcid = '';   //会议id
        this.videoMemberList = [];  //已接听的会议成员id
        this.isInCall = false;  //是否正在通话
        this.isInterpose = false;    //是否为强插通话
        this.peopleMap = [];    //单兵地图点位
        this.videoIndex = 0;  //当前播放的单兵视频序号
        this.callId = '';   //通话id
    }

    //组件加载触发函数
    componentDidMount() {
        this.initConfig();
        this.p = new Promise((resolve) => {this.getData(resolve)});
        if(this.props.firstLoad === false){
            this.animateOn();
        }
        this.initFunction();
        this.setState({groupList:this.groupList});
        setTimeout(() => {
            this.sendMessage();
        },500)
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //加载服务配置
    initConfig(){
        const { style } = this.props.thisData;
        this.thisCallIp = style.callIp;	//当前机器ip
        this.thisCallPart = style.callPart;	//端口号
        this.callHostInfo = style.callHostInfo;	//融合通信服务ip
        this.callHostport = style.callHostport;	//融合通信服务端口
        this.callUserName = style.callUserName;	//账号
        this.callPassword = style.callPassword;	//密码
        this.exclusionId = style.exclusionId;	//排除
    }

    //挂载数据到页面显示
    animateOn(){
        this.p.then((data) => {
            this.setState({data})
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "dataInterchange" :
                this.callPhone({id:data.data.data});
                break;
            default:
                break;
        }
    }

    //获取数据
    getData(resolve){
    }

    //初始化单兵函数
    initFunction(){
        window.onbeforeunload = () => {
            if (this.isCallInit) {
                if (this.isCallRegist){
                    document.callOcx.UnRegist();
                }
                document.callOcx.Dispose();
            }
        };
        //单兵ocx回调事件
        global.TreateReceivePublishMsg = (header,content) => {
            if(header === "Local.IP"){

            }else if(header === "Config.Mygroup"){
                const groupData = JSON.parse(content);
                for(let i = 0;i < groupData.length;i ++){
                    if(groupData[i].groupnum === "9005"){
                        if(groupData[i].group && groupData[i].group.length > 0){
                            this.groupList = this.getChildGroup(groupData[i].group);
                        }
                        break;
                    }else{
                        if(groupData[i].user && groupData[i].user.length > 0){
                            this.updateGroupUser(groupData[i].groupnum,groupData[i].user);
                        }
                    }
                }
                this.setState({groupList:this.groupList});
                // $rootScope.$broadcast("tree",{type:'loadPeopleData',data:groupList});
            }else if (header === "Session.Create") {
                //会议创建
                let thisContent = JSON.parse(content);
                this.addcid = thisContent[0].cid;
            }else if(header === "Session.Member.Change"){
                //会议成员变更
                let thisContent = JSON.parse(content);
                let thisMember = thisContent[0];
                if(thisMember.state === '10'){
                    this.removeMember(thisMember.employeeid);
                }else if(thisMember.state === '6' && thisMember.employeeid !== this.callUserName && this.exclusionId.indexOf(thisMember.employeeid) < 0){
                    if(thisMember.employeeid!=='54304'){
                        this.addMember(thisMember);
                    }
                }
            }else if(header === "GIS.GETPOSITION.CB"){
                this.updatePeopleLocation(JSON.parse(content));
            }else if(header === "Session.State.Change"){
                let thisContent = JSON.parse(content);
                this.addcid = thisContent[0].cid;
                if(thisContent[0].type === '6' && thisContent[0].state === '1'){
                    document.callOcx.GetCallMember(this.addcid);
                }
            }else if(header === "Session.Member.All"){
                const thisContent = JSON.parse(content);
                let { callMember } = this.state;
                const { videoList } = this.props.thisData.style;
                for(let x = 0;x < thisContent.length;++x){
                    const thisMember = thisContent[x];
                    if(thisMember.state === '6' && thisMember.employeeid !== this.callUserName && this.exclusionId.indexOf(thisMember.employeeid) < 0){
                        callMember.push(thisMember.employeeid);
                        this.videoMemberList.push(thisMember.employeeid);
                        if(x < videoList.length){
                            this.playVideo({id:thisMember.employeeid,name:thisMember.name});
                        }
                    }
                }
                this.setState({ callMember });
                //更新地图点位图标类型
                this.updatePeopleMap();
            }else if(header === "Call.MoreCall.Interpose"){
                document.callOcx.GetCallMember(this.addcid);
            }
        };
        //来电回调
        global.onIncomingCall = (mynum, othersidenum, callid, callstatus, isvideo) => {
            this.addcid = callid;
            document.callOcx.Answer(callid, isvideo);
        };
        //初始化ocx
        setTimeout(() => {
            this.initOcx();
        },100);
    }

    //初始化ocx
    initOcx(){
        //初始化
        if(navigator.userAgent.indexOf("Chrome") < 0){
            this.isCallInit = document.callOcx.Init(this.thisCallIp, this.thisCallPart);
            if(this.isCallInit){
                //账号注册
                this.isCallRegist = document.callOcx.ME_Regist(this.callHostInfo, this.callHostport, 10001, this.callUserName, this.callPassword, false, false, 3600);
                if(this.isCallRegist){
                    //获取单兵组织树
                    document.callOcx.ME_GetConfigMyGroupTree();
                    //开启定时更新坐标
                    this.updateGroupTime();
                }else{
                    alert("通话账号注册失败");
                }
            }else{
                alert("通话构件初始化失败");
            }
        }
    }

    //获取子节点
    getChildGroup(child){
        let thisChild = [];
        if(child && child.length > 0){
            for(let i = 0;i < child.length;i ++){
                thisChild.push({
                    "id" : child[i].groupnum,
                    "name" : child[i].groupname,
                    "child" : this.getChildGroup(child[i].group)
                });
                this.getGroupUsers(child[i].groupnum);
            }
        }
        return thisChild;
    }

    //获取分组内人员
    getGroupUsers(groupId){
        document.callOcx.ME_GetConfigGroupDetail(groupId, "");
    }

    //获取组内人员坐标
    getUserLocation(groupId){
        this.allGroupStr += groupId + ",";
        document.callOcx.ME_GetGisPosition(groupId);
    }

    //更新分组成员
    updateGroupUser(groupId,users,child){
        let isFind = false;
        let thisFindList;
        if(child){
            thisFindList = child;
        }else{
            thisFindList = this.groupList;
        }
        for(let i = 0;i < thisFindList.length;i ++){
            if(thisFindList[i].id === groupId){
                isFind = true;
                let thisUsers = [];
                for(let j = 0;j < users.length;j ++){
                    if(this.callUserName !== users[j].userid){
                        thisUsers.push({
                            "id" : users[j].userid,
                            "name" : users[j].username,
                            "type" : "item"
                        });
                        this.peopleMap.push({
                            "id" : users[j].userid,
                            "name" : users[j].username,
                        });
                    }
                }
                this.getUserLocation(groupId);
                thisFindList[i].child = thisFindList[i].child.concat(thisUsers);
                break;
            }else if(thisFindList[i].child && thisFindList[i].child.length > 0){
                isFind = this.updateGroupUser(groupId,users,thisFindList[i].child);
            }
            if(isFind){
                break;
            }
        }
        return isFind;
    }

    //成员离会
    removeMember(id){
        let { callMember } = this.state;
        const callMemberIndex = callMember.indexOf(id);
        if(callMemberIndex >= 0){
            callMember.splice(callMemberIndex,1);
        }
        const videoMemberIndex = this.videoMemberList.indexOf(id);
        if(videoMemberIndex >= 0){
            this.videoMemberList.splice(videoMemberIndex,1);
        }
        let { videoMemberList,videoMemberIdList } = this.state;
        for(let i = 0;i < videoMemberList.length;i ++){
            if(videoMemberList[i].id === id){
                videoMemberList.splice(i,1);
                videoMemberIdList.splice(i,1);
                break;
            }
        }
        this.setState({ videoMemberList,videoMemberIdList,callMember });
        //更新地图点位图标类型
        this.updatePeopleMap();
        //若会议成员为0人则结束会议
        if(callMember.length === 0){
            this.finishCall();
        }
    }

    //切换子级显示隐藏
    changeChildShow(node){
        node.showChild = !node.showChild;
        this.setState({groupList:this.state.groupList});
    }

    getStyle(){
        const { style } = this.props.thisData;
        this.style = {
            backgroundColor: style.backgroundColor ? style.backgroundColor:'rgba(0,0,0,0.1)',
            lineBackgroundColor: style.lineBackgroundColor ? style.lineBackgroundColor:'rgba(0,0,0,0.5)',
            lineHeight: style.lineHeight ? this.props.getCompatibleSize(style.lineHeight,'num'):'30',
            lineGap: style.lineGap ? this.props.getCompatibleSize(style.lineGap,'num'):'6',
            fontSize: style.fontSize ? this.props.getCompatibleSize(style.fontSize,'num'):'15',
            fontColor: style.fontColor ? style.fontColor:'#fff',
            indentation: style.indentation ? this.props.getCompatibleSize(style.indentation,'num'):'15',
            iconSize: style.iconSize ? this.props.getCompatibleSize(style.iconSize,'num'):'15',
        };
    }

    //显示组织树
    getTree(list,level){
        if(list == null){
            return null;
        }
        const lineStyle = {
            backgroundColor: this.style.lineBackgroundColor,
            height: this.style.lineHeight + 'px',
            marginBottom: this.style.lineGap + 'px',
            fontSize: this.style.fontSize + 'px',
            color: this.style.fontColor
        };
        let domList = [];
        list.forEach((item,index) => {
            const paddingLeft = this.style.indentation*level;
            if(item.type === 'item'){
                domList.push(
                    <div key={item.id} className={`${cssStyle.lineBox} ${cssStyle.itemBox}`} style={{paddingLeft:paddingLeft+'px',...lineStyle}}>
                        <div>{item.name}</div>
                        <div>
                            <img alt='拨打/挂断' src={this.state.callMember.indexOf(item.id) >= 0 ? hangUpIcon : callIcon}
                                 onClick={this.callPhone.bind(this,item)}
                                 style={{width:this.style.iconSize+'px',height:this.style.iconSize+'px',display:this.state.onlinePeople.indexOf(item.id) >= 0 && !this.isInterpose ? 'block':'none'}}
                            />
                            <img alt='退出强插' src={hangUpIcon}
                                 onClick={this.finishCall.bind(this)}
                                 style={{width:this.style.iconSize+'px',height:this.style.iconSize+'px',display:this.state.onlinePeople.indexOf(item.id) >= 0 && this.isInterpose && this.state.interposeId === item.id ? 'block':'none'}}
                            />
                            <img alt='强插' src={insertIcon}
                                 onClick={this.forceInterpose.bind(this,item.id)}
                                 style={{width:this.style.iconSize+'px',height:this.style.iconSize+'px',display:this.state.onlinePeople.indexOf(item.id) >= 0 && !this.isInCall && !this.isInterpose ? 'block':'none'}}
                            />
                            <img alt='调度画面' src={showIcon}
                                 onClick={this.playVideo.bind(this,item)}
                                 style={{width:this.style.iconSize+'px',height:this.style.iconSize+'px',display:this.videoMemberList.indexOf(item.id) >= 0 && this.state.videoMemberIdList.indexOf(item.id) < 0 ? 'block':'none'}}
                            />
                        </div>
                    </div>
                );
            }else{
                domList.push(
                    <div key={item.id} className={cssStyle.lineBox} style={{paddingLeft:paddingLeft+'px',...lineStyle}}>
                        <Icon type={item.showChild ? 'minus':'plus'} onClick={this.changeChildShow.bind(this,item)}/>
                        <div>{item.name}</div>
                        <div className={cssStyle.closeAll}>
                            {level === 0 ? (
                                <img alt='结束会议' src={hangUpIcon}
                                     onClick={this.finishCall.bind(this)}
                                     style={{width:this.style.iconSize+'px',height:this.style.iconSize+'px',display:this.isInCall && !this.isInterpose ? 'block':'none'}}
                                />
                            ):null}
                        </div>
                    </div>
                );
                domList.push(
                    <div key={item.id+'child'} className={cssStyle.childBox} style={{display:item.showChild ? 'block':'none'}}>
                        {this.getTree(item.child,level+1)}
                    </div>
                );
            }
        });
        return domList;
    }

    //初始化数据
    initializeData(){
        this.videoMemberList = [];
        this.isInCall = false;
        this.isInterpose = false;
        this.videoIndex = 0;
        this.callId = '';
        this.addcid = '';
        this.setState({interposeId:'',callMember:[],videoMemberIdList:[],videoMemberList:[]});
    }

    //强插通话
    forceInterpose(id){
        this.isInCall = true;
        this.isInterpose = true;
        this.setState({ interposeId:id,callMember:[],videoMemberIdList:[],videoMemberList:[] });
        document.callOcx.ME_ForceInterposeCall(id, "");
    }

    //拨打单兵
    callPhone(member){
        let { callMember } = this.state;
        const callMemberIndex = callMember.indexOf(member.id);
        //根据是否在通话列表内判断进行拨打还是挂断
        if(callMemberIndex >= 0){
            //挂断
            let videoIndex = -1;
            const { videoMemberList } = this.state;
            for(let i = 0;i < videoMemberList.length;i ++){
                if(videoMemberList[i].id === member.id){
                    videoIndex = i;
                    break;
                }
            }
            if(videoIndex >= 0){
                //若对方正在视频通话则关闭视频并踢出会议
                this.outMeeting(videoIndex);
            }else{
                //踢出会议
                callMember.splice(callMemberIndex,1);
                const videoMemberIndex = this.videoMemberList.indexOf(member.id);
                if(videoMemberIndex >= 0){
                    this.videoMemberList.splice(videoMemberIndex,1);
                }
                this.setState({ callMember });
                document.callOcx.DeleteMember(this.addcid, member.id);
            }
        }else{
            //拨打
            callMember.push(member.id);
            if(this.isInCall){
                //添加会议成员
                document.callOcx.AddMember(this.addcid, member.id);
            }else{
                //创建会议
                document.callOcx.CreateSnapMetting(member.id, true);
                this.isInCall = true;
            }
            this.setState({ callMember });
        }
        //更新地图点位图标类型
        this.updatePeopleMap();
    }

    //添加会议成员
    addMember(thisMember){
        if(this.videoMemberList.indexOf(thisMember.employeeid) < 0){
            this.videoMemberList.push(thisMember.employeeid);
            this.playVideo({id:thisMember.employeeid,name:thisMember.name});
        }
    }

    //加载视频通话画面
    playVideo(thisMember){
        const { videoList } = this.props.thisData.style;
        let { videoMemberList,videoMemberIdList } = this.state;
        const thisVideoMember = {
            "id" : thisMember.id,
            "name" : thisMember.name,
            "addcid" : this.addcid,
            "callHostInfo" : this.callHostInfo
        };
        if(videoMemberList.length < videoList.length){
            videoMemberList.push(thisVideoMember);
            videoMemberIdList.push(thisMember.id);
        }else{
            videoMemberList[this.videoIndex] = thisVideoMember;
            videoMemberIdList[this.videoIndex] = thisMember.id;
        }
        this.setState({ videoMemberList, videoMemberIdList });
        this.videoIndex ++;
        if(this.videoIndex >= videoList.length){
            this.videoIndex = 0;
        }
    }

    //踢出会议
    outMeeting(index,flag){
        if(this.props.editType){
            return ;
        }
        let { callMember } = this.state;
        let { videoMemberList,videoMemberIdList } = this.state;
        const id = videoMemberList[index].id;
        callMember.splice(callMember.indexOf(id),1);
        videoMemberList.splice(index,1);
        videoMemberIdList.splice(index,1);
        this.videoMemberList.splice(this.videoMemberList.indexOf(id),1);
        this.setState({ videoMemberList, callMember });
        document.callOcx.DeleteMember(this.addcid, id);
        //若会议成员为0人则结束会议
        if(callMember.length === 0){
            this.finishCall();
        }
        if(flag){
            //更新地图点位图标类型
            this.updatePeopleMap();
        }
    }

    //结束通话
    finishCall(){
        try{
            if(this.isInterpose){
                //退出强插
                document.callOcx.Hangup(this.callId);
            }else{
                //结束会议
                document.callOcx.ForceEndConfe(this.addcid);
            }
        }catch (e) {}
        //初始化通话数据
        this.initializeData();
    }

    //更新地图点位图标类型
    updatePeopleMap(){
        const { callMember } = this.state;
        this.peopleMap.forEach((point) => {
            point.type = callMember.indexOf(point.id) >= 0 ? 'calling' : 'hangup';
        });
        //将单兵点位消息发送到地图组件
        this.sendMessage();
    }

    //更新人员坐标位置
    updatePeopleLocation(users){
        for(let i = 0;i < users.length;i ++){
            for(let j = 0;j < this.peopleMap.length;j ++){
                if(users[i].employeeid === this.peopleMap[j].id){
                    this.peopleMap[j].regstate = users[i].regstate;
                    if(users[i].Latitude != null && users[i].Longitude != null && parseFloat(users[i].Latitude) !== 0 && parseFloat(users[i].Longitude) !== 0){
                        let point = GPS.bd_decrypt(parseFloat(users[i].Latitude),parseFloat(users[i].Longitude));//转换坐标系
                        let pointTemp = GPS.gcj_decrypt_exact(point.lat,point.lon);
                        this.peopleMap[j].x = pointTemp.lon;
                        this.peopleMap[j].y = pointTemp.lat;
                    }else{
                        this.peopleMap[j].x = 0;
                        this.peopleMap[j].y = 0;
                    }
                }
            }
        }
        //通知列表更新在线状态
        let onlinePeople = "";
        for(let i = 0;i < this.peopleMap.length;i ++){
            if(this.peopleMap[i].regstate !== '2'){
                this.peopleMap[i].x = 120.674728;
                this.peopleMap[i].y = 27.940701;
                onlinePeople += this.peopleMap[i].id + ",";
            }
        }
        this.setState({ onlinePeople });
        //将单兵点位消息发送到地图组件
        this.sendMessage();
    }

    //定时更新单兵信息
    updateGroupTime(){
        setTimeout(() => {
            document.callOcx.ME_GetGisPosition(this.allGroupStr);
            this.updateGroupTime();
        },1000*5)
    }

    //将单兵点位消息发送到地图组件
    sendMessage(){
        const { interact } = this.props.thisData.dataSources;
        interact.forEach((item) => {
            switch (item.type) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    let remark = {};
                    if(item.remark){
                        try{
                            remark = JSON.parse(item.remark);
                        }catch (e) {}
                    }
                    Emitter.emit(item.receiveId,{type:'dataInterchange',data:{...remark,data:this.peopleMap}});
                    break;
                default:
            }
        });
    }

    render() {
        this.getStyle();
        const { style } = this.props.thisData;
        const videoMemberList = this.props.editType && style.videoShow ? style.videoList.map((item,index) => {return {id:index,name:'窗口'+(index+1)}}) : this.state.videoMemberList;
        return (
            <ComponentBox style={{...this.props.style,backgroundColor: this.style.backgroundColor}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData}>
                <object id="callOcx" classID="clsid:1AEF5D45-E61F-44DF-B862-8F005038D4F8" style={{position:'absolute',left:1,top:0}} width="0" height="0" >
                </object>
                <Scrollbars>
                    {this.getTree(this.state.groupList,0)}
                </Scrollbars>
                {videoMemberList.map((item,index) =>
                    <PhoneOcx key={item.id} editType={this.props.editType} data={item} index={index} outMeeting={this.outMeeting.bind(this)} style={{...style.videoList[index],fontSize:style.videoFontSize,color:style.videoFontColor}} />
                )}
                {isChrome ? <EmptyDom description={<span style={{fontSize:'2.5vh'}}>请用ie浏览器打开</span>}/> : ''}
            </ComponentBox>
        );
    }
}