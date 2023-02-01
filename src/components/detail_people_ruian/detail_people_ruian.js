import React from "react";
import ComponentBox from "../component_box";
import {Motion, spring} from "react-motion";
import Emitter from "../../common/eventBus";
import "../../common/css/antdTimeline.css";
import {getCompatibleSize, interactData} from "../../common/util";
import cssStyle from "./detail_people_ruian.module.css";
import {Input, Button, Popover, Icon, Modal} from "antd";
import {Scrollbars} from "react-custom-scrollbars";

import closeIcon from "./images/closeTypeOne.svg";
import defaultImg from "./images/head.jpg";
import axios from "axios";

export default class DetailPeopleRuian extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, hasCheck: true, opacity:0,checkData:{phone:''},headList:[],selectedHeadImg:'',selectedHeadImgIndex:-1,carList:[],selectedCarImg:'',selectedCarImgIndex:-1,hasSendCode:false,remainTime:0,iconOneLoading:false,iconTwoLoading:false};
        this.interactData = interactData.bind(this);
        this.keyParams = {};
        this.interactParams = {};
        this.watermarkList = [
            '','','','','',
            '','','','','',
            '','','','','',
            '','','','','',
            '','','','','',
            '','','','','',
        ];
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.resetTimer){
            clearTimeout(this.resetTimer);
        }
        if(this.codeTimer){
            clearTimeout(this.codeTimer);
        }
        if(this.closeTimer){
            clearTimeout(this.closeTimer);
        }
    }

    //组件加载触发函数
    componentDidMount() {
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.setState({opacity:1});
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "changeKey" :
            case "showComponent":
                //修改请求条件
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                if(data.type === 'showComponent'){
                    if(this.resetTimer){
                        clearTimeout(this.resetTimer);
                    }
                    this.setState({hasCheck: false,checkData:{}});
                    this.changeThisShow(true);
                }
                break;
            case 'messageSend':
                for (let key in data.data) {
                    this.interactParams[key] = data.data[key];
                }
                break;
            default:
                break;
        }
    }

    //重新获取数据
    reGetData() {
    }

    //获取数据后回调
    callBack(result) {
        if (result) {
            this.setState({hasCheck:true});
            const {style} = this.props.thisData;
            //记录查询信息
            if(style.saveRecordUrl){
                axios.post(style.saveRecordUrl, {rbacToken:this.props.token,peopleId:this.keyParams.peopleId,phone:this.state.checkData.phone},{params:{rbacToken:this.props.token}}).then((response) => {
                }).catch( (error) => {
                });
            }

            this.getDataTime = new Date().getTime();
            const detail = result.detailInfo;
            if(detail){
                const headList = detail.headUrl ? detail.headUrl.split(','):[];
                const carList = detail.carUrl ? detail.carUrl.split(','):[];
                this.setState({headList,carList});
                this.changeImg(0,headList,1);
                this.changeImg(0,carList,2);
            }
            this.setState({data: result});
            this.startCloseTimer();
        }
    }

    startCloseTimer(){
        this.closeTimer = setTimeout(()=>{
            this.changeThisShow(false);
        },180000);
    }

    //当前组件显示隐藏
    changeThisShow(type) {
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: {showStatus: type, id: this.props.thisData.id}
        });
        if(!type){
            if(this.closeTimer){
                clearTimeout(this.closeTimer);
            }
            this.resetTimer = setTimeout(()=>{
                this.setState({hasCheck: false,checkData:{}});
            },500);
        }
    }

    getContent(){
        const {hasCheck} = this.state;
        if(hasCheck){
            return this.getDetailContent();
        }else{
            return this.getCheckContent();
        }
    }

    dataEdit(key,event){
        let {checkData} = this.state;
        checkData[key] = event.target.value;
        this.setState({checkData});
    }

    getCheckContent(){
        const {checkData,remainTime,hasSendCode,iconOneLoading,iconTwoLoading} = this.state;
        return (
            <div className={cssStyle.checkBox}>
                <div className={cssStyle.checkLine}>
                    <div className={cssStyle.phonePrefix}>+86</div>
                    <Input value={checkData.phone} onChange={this.dataEdit.bind(this,'phone')} className={cssStyle.checkPhone} placeholder='请输入手机号码'/>
                </div>
                <div className={cssStyle.checkLine}>
                    <Input value={checkData.checkCode} onChange={this.dataEdit.bind(this,'checkCode')} className={cssStyle.checkCode} placeholder='请输入验证码'/>
                    <Button type="primary" className={cssStyle.sendCode} onClick={this.getCheckCode.bind(this)} disabled={!!remainTime} loading={iconOneLoading}>{hasSendCode ? '重新发送' + (remainTime?`(${remainTime})`:''):'获取验证码'}</Button>
                </div>
                <div className={cssStyle.checkButtonLine}>
                    <Button onClick={this.changeThisShow.bind(this,false)} className={cssStyle.checkButton}>取消</Button>
                    <Button type="primary" onClick={this.checkCode.bind(this)} className={cssStyle.checkButton} loading={iconTwoLoading}>确定</Button>
                </div>
            </div>
        );
    }

    codeTimerRun(){
        this.codeTimer = setTimeout(()=>{
            const {remainTime} = this.state;
            this.setState({remainTime:remainTime-1});
            if(remainTime > 1){
                this.codeTimerRun();
            }
        },1000);
    }

    getCheckCode(){
        if(this.state.checkData.phone){
            this.setState({iconOneLoading:true});
            // const getUrl = './json/ruian/peopleDetail.json';
            const getUrl = '/socialGovernance/OuEmphasesPeople/getSMSCode';
            axios.get(getUrl, { params: { rbacToken: this.props.token,phone:this.state.checkData.phone} }).then((response) => {
                // 在这儿实现 setState
                this.setState({iconOneLoading:false});
                const result = response.data;
                if (result.success) {
                    Modal.success({
                        content: '验证码已发送。',
                    });
                    this.setState({remainTime:30,hasSendCode:true});
                    this.codeTimerRun();
                }else{
                    Modal.error({
                        content: result.message,
                    });
                }
            }).catch((error)=> {
                this.setState({iconOneLoading:false});
                // 处理请求出错的情况
                Modal.error({
                    content: '获取验证码出错！',
                });
            });
        }else{
            Modal.info({
                content: '请输入手机号码。',
            });
        }
    }

    checkCode(){
        if(this.state.checkData.checkCode){
            this.setState({iconTwoLoading:true});
            const sendData = {
                rbacToken:this.props.token,
                smscode:this.state.checkData.checkCode,
                phone:this.state.checkData.phone,
                peopleId:this.keyParams.peopleId
            };
            // const getUrl = './json/ruian/peopleDetail.json';
            const getUrl = '/socialGovernance/OuEmphasesPeople/getEmphPeopleDetailWithSensitiveNew';
            axios.get(getUrl, { params: sendData }).then((response) => {
                // 在这儿实现 setState
                this.setState({iconTwoLoading:false});
                const result = response.data;
                if (result.success) {
                    this.callBack(result.data);
                }else{
                    Modal.error({
                        content: result.message,
                    });
                }
            }).catch( (error)=> {
                this.setState({iconTwoLoading:false});
                // 处理请求出错的情况
                Modal.error({
                    content: '获取详情出错！',
                });
            });
        }else{
            Modal.info({
                content: '请输入验证码！',
            });
        }
    }

    changeImg(selectedImgIndex,list,type){
        if(selectedImgIndex<0 || selectedImgIndex>=list.length){
            return;
        }
        let imgUrl = list[selectedImgIndex];
        if(imgUrl){
            const selectedImg = imgUrl + (imgUrl.indexOf('?') > 0 ? '&':'?') +'rbacToken='+ this.props.token;
            if(type === 1){
                this.setState({selectedHeadImg:selectedImg,selectedHeadImgIndex:selectedImgIndex});
            }else{
                this.setState({selectedCarImg:selectedImg,selectedCarImgIndex:selectedImgIndex});
            }
        }else{
            if(type === 1){
                this.setState({selectedHeadImg:'',selectedHeadImgIndex:-1});
            }else{
                this.setState({selectedCarImg:'',selectedCarImgIndex:-1});
            }
        }
    }

    getPetitionDetail(petition){
        return (
            <div className={cssStyle.petitionDetailBox}>
                <div className={cssStyle.petitionTitle}>异动情况</div>
                <div className={cssStyle.petitionContentLine}>{petition.petitionTime}</div>
                <div className={cssStyle.petitionContentLine}>{petition.petitionContent}</div>
                <div className={cssStyle.petitionTitle}>处置情况</div>
                <div className={cssStyle.timeLineBox}>
                    {petition.recordList && petition.recordList.map((record,recordIndex)=>{
                        let date,time;
                        if(record.createTime){
                            date = record.createTime.split(' ')[0];
                            time = record.createTime.split(' ')[1];
                        }
                        return (
                            <div key={recordIndex} className={cssStyle.timeLineItem}>
                                <div className={cssStyle.timeLine} />
                                <div className={cssStyle.timePoint} style={{backgroundColor:recordIndex===0?'rgb(61,157,235)':'rgb(202,202,202)'}}>
                                    <Icon className={cssStyle.timePointIcon} type={recordIndex===0 ? "check":"up"} />

                                </div>
                                <div className={cssStyle.dateTimeBox}>
                                    <div className={cssStyle.time}>{time}</div>
                                    <div className={cssStyle.date}>{date}</div>
                                </div>
                                <div className={cssStyle.timeLineContent}>{record.combineContent}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    getImgContent(imgList,selectedImg,selectedIndex,type){
        return (
            <React.Fragment >
                <img className={cssStyle.img} alt={''} src={selectedImg ? selectedImg:defaultImg}/>
                {imgList.length > 0 && (
                    <div className={cssStyle.imgBoxFoot}>
                        <div className={cssStyle.pageNum}>{`${selectedIndex+1}/${imgList.length}`}</div>
                        <div>
                            <Icon type="left-circle" onClick={this.changeImg.bind(this,selectedIndex-1,imgList,type)} className={`${cssStyle.changeIcon} ${selectedIndex<=0 ? cssStyle.noChange:''}`}/>
                            <Icon type="right-circle" onClick={this.changeImg.bind(this,selectedIndex+1,imgList,type)} className={`${cssStyle.changeIcon} ${selectedIndex>=imgList.length-1 ? cssStyle.noChange:''}`}/>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }

    getDetailContent(){
        const data = this.state.data ? this.state.data : {};
        const detail = data.detailInfo ? data.detailInfo : {};
        const {selectedHeadImg,headList,selectedHeadImgIndex,carList,selectedCarImg,selectedCarImgIndex} = this.state;
        return (
            <div className={cssStyle.detailBox}>
                <Scrollbars>
                    <div className={cssStyle.detailBodyBox}>
                        {/*<img alt={''} src={selectedHeadImg ? selectedHeadImg:defaultImg} className={cssStyle.headImg}/>*/}
                        {/*<div className={cssStyle.headListBox}>*/}
                        {/*    {headList.map((head,index)=>*/}
                        {/*        <div*/}
                        {/*            onClick={this.changeHeadImg.bind(this,index,'')}*/}
                        {/*            key={index} className={`${cssStyle.headSelectItem} ${index === selectedHeadImgIndex ? cssStyle.headSelectedItem:''}`}*/}
                        {/*        >*/}
                        {/*            {index+1}*/}
                        {/*        </div>*/}
                        {/*    )}*/}
                        {/*</div>*/}
                        <div className={cssStyle.partTitle}>基本情况</div>
                        <div className={cssStyle.contentBoxOne}>
                            <table className={cssStyle.tableOne}>
                                <tbody>
                                <tr className={cssStyle.line}>
                                    <td className={cssStyle.titleOne}>姓名</td>
                                    <td className={cssStyle.contentOne}>{detail.name}</td>
                                    <td className={cssStyle.titleOne}>性别</td>
                                    <td className={cssStyle.contentOne}>{detail.sex}</td>
                                </tr>
                                <tr className={cssStyle.line}>
                                    <td className={cssStyle.titleOne}>民族</td>
                                    <td className={cssStyle.contentOne}>{detail.nation}</td>
                                    <td className={cssStyle.titleOne}>籍贯</td>
                                    <td className={cssStyle.contentOne}>{detail.adminDivision}</td>
                                </tr>
                                <tr className={cssStyle.line}>
                                    <td className={cssStyle.titleOne}>身份证号</td>
                                    <td colSpan={3} className={cssStyle.contentTwo}>{detail.cardId}</td>
                                </tr>
                                <tr className={cssStyle.line}>
                                    <td className={cssStyle.titleOne}>联系电话</td>
                                    <td colSpan={3} className={cssStyle.contentTwo}>{detail.phone}</td>
                                </tr>
                                <tr className={cssStyle.line}>
                                    <td className={cssStyle.titleOne}>户籍地址</td>
                                    <td colSpan={3} className={cssStyle.contentTwo}>{detail.permanentAddress}</td>
                                </tr>
                                <tr className={cssStyle.line}>
                                    <td className={cssStyle.titleOne}>现居住地址</td>
                                    <td colSpan={3} className={cssStyle.contentTwo}>{detail.address}</td>
                                </tr>
                                <tr className={cssStyle.line}>
                                    <td className={cssStyle.titleOne}>所属镇道</td>
                                    <td className={cssStyle.contentOne}>{detail.roadName}</td>
                                    <td className={cssStyle.titleOne}>所属村社</td>
                                    <td className={cssStyle.contentOne}>{detail.communityName}</td>
                                </tr>
                                <tr className={cssStyle.line}>
                                    <td className={cssStyle.titleOne}>人员类型</td>
                                    <td className={cssStyle.contentOne}>{detail.peopleTypeName}</td>
                                    <td className={cssStyle.titleOne}>处置类别</td>
                                    <td className={cssStyle.contentOne}>{detail.aboutTypeName}</td>
                                </tr>
                                <tr className={cssStyle.line}>
                                    <td className={cssStyle.titleOne}>管控等级</td>
                                    <td className={cssStyle.contentOne}>{detail.level}</td>
                                    <td className={cssStyle.titleOne}>车辆消息</td>
                                    <td className={cssStyle.contentOne}>{detail.carInfo}</td>
                                </tr>
                                <tr className={cssStyle.line}>
                                    <td className={cssStyle.titleOne}>工作单位</td>
                                    <td colSpan={3} className={cssStyle.contentTwo}>{detail.workCompany}</td>
                                </tr>
                                <tr className={cssStyle.line}>
                                    <td className={cssStyle.titleOne}>备注</td>
                                    <td colSpan={3} className={cssStyle.contentTwo}>{detail.remark}</td>
                                </tr>
                                </tbody>
                            </table>
                            <div className={cssStyle.headImgListBox}>
                                {this.getImgContent(headList,selectedHeadImg,selectedHeadImgIndex,1)}
                            </div>
                            <div className={cssStyle.carImgListBox}>
                                {this.getImgContent(carList,selectedCarImg,selectedCarImgIndex,2)}
                            </div>
                        </div>
                        <div className={cssStyle.partTitle}>关系图谱</div>
                        <div className={cssStyle.contentBoxTwo}>
                            <table>
                                <tbody>
                                <tr>
                                    <td>关系类型</td>
                                    <td>姓名</td>
                                    <td>关系</td>
                                    <td>籍贯</td>
                                    <td>联系方式</td>
                                    <td style={{width:'16%'}}>工作单位</td>
                                    <td>车辆信息</td>
                                </tr>
                                {detail.aboutFamilyList && detail.aboutFamilyList.map((family,index)=>
                                    <tr className={cssStyle.contentFourLine} key={index}>
                                        {index === 0 && <td rowSpan={detail.aboutFamilyList.length}>家庭关系</td>}
                                        <td>{family.name}</td>
                                        <td>{family.relation}</td>
                                        <td>{family.adminDivision}</td>
                                        <td>{family.phone}</td>
                                        <td>{family.workCompany}</td>
                                        <td>{family.carInfo}</td>
                                    </tr>
                                )}
                                {detail.aboutSocietyList && detail.aboutSocietyList.map((family,index)=>
                                    <tr className={cssStyle.contentFourLine} key={index}>
                                        {index === 0 && <td rowSpan={detail.aboutSocietyList.length}>社会关系</td>}
                                        <td>{family.name}</td>
                                        <td>{family.relation}</td>
                                        <td>{family.adminDivision}</td>
                                        <td>{family.phone}</td>
                                        <td>{family.workCompany}</td>
                                        <td>{family.carInfo}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className={cssStyle.partTitle}>化解情况</div>
                        <div className={cssStyle.contentBoxTwo}>
                            <table>
                                <tbody>
                                <tr>
                                    <td>基本诉求</td>
                                    <td className={cssStyle.contentSix}>{detail.requireContent}</td>
                                </tr>
                                <tr>
                                    <td>化解状态</td>
                                    <td className={cssStyle.contentSix}>{detail.isSolve}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className={cssStyle.partTitle}>稳控专班</div>
                        <div className={cssStyle.contentBoxTwo}>
                            <table>
                                <tbody>
                                <tr>
                                    <td>身份</td>
                                    <td>单位职务</td>
                                    <td>姓名</td>
                                    <td>联系电话</td>
                                    <td>市府短号</td>
                                </tr>
                                {data.controlPeopleList && data.controlPeopleList.map((people,index)=>
                                    <tr className={cssStyle.contentFive} key={index}>
                                        <td>{people.peopleTypeName}</td>
                                        <td>{people.duty}</td>
                                        <td>{people.name}</td>
                                        <td>{people.phone}</td>
                                        <td>{people.goverCornet}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className={cssStyle.partTitle}>历史异动</div>
                        <div className={cssStyle.contentBoxTwo}>
                            <table>
                                <tbody>
                                <tr className={cssStyle.contentFiveLine}>
                                    <td>日期</td>
                                    <td>异动行为</td>
                                    <td>操作</td>
                                </tr>
                                {data.petitionList && data.petitionList.map((petition,index)=>
                                    <tr className={cssStyle.contentFive} key={index}>
                                        <td>{petition.petitionTime}</td>
                                        <td>{petition.petitionContent}</td>
                                        <td>
                                            <Popover placement="topRight" content={this.getPetitionDetail(petition)} trigger="click">
                                                <Button className={cssStyle.button} type="primary" >处置详情</Button>
                                            </Popover>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Scrollbars>
                <img alt={''} src={closeIcon} className={cssStyle.closeIcon} onClick={this.changeThisShow.bind(this,false)} />
            </div>
        );
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const {hasCheck} = this.state;
        return (
            <ComponentBox
                id={this.props.thisData.id}
                thisData={this.props.thisData}
                receiveMessage={this.receiveMessage.bind(this)}
                reGetData={this.reGetData.bind(this)}
                style={this.props.style}
            >
                <Motion style={{opacity: spring(this.state.opacity)}}>
                    {({opacity}) => {
                        return (
                            <div className={cssStyle.detailContentBox} style={{fontSize,opacity}} >
                                <div className={cssStyle.detailBg} onClick={this.changeThisShow.bind(this,false)}/>
                                {this.getContent()}
                                {hasCheck && (
                                    <div className={cssStyle.watermarkBox}>
                                        {this.watermarkList.map((item,index)=>
                                            <div className={cssStyle.watermarkItem} key={index}>
                                                {this.state.checkData.phone}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    }}
                </Motion>
            </ComponentBox>
        )
    }
}