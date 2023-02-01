import React from "react";
import {Timeline} from "antd";
import ComponentBox from "../component_box";
import cssStyle from '../../common/css/detail.module.css';
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import Emitter from "../../common/eventBus";
import {getCompatibleData, getCloseDom, getTimelineList} from "../../common/detailUtil";
import iconTriangleOne from "../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../common/images/lanjiao_blue.svg";
import {interactData} from "../../common/util";
import {getData} from "../../common/getDataUtil";
import "../../common/css/antdTimeline.css";

export default class DetailProcurementProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showComponent: false, visible: false};
        this.keyParams = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.themeList = ['',cssStyle.themeOne];
        this.themeImgList = [iconTriangleOne,iconTriangleTwo];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        // this.p = new Promise((resolve) => {
        //     this.getData(this.callBack.bind(this, resolve))
        // });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.reGetData();
        // this.p.then((data) => {
        //     this.setState({data});
        // });
        // this.getData();
        // this.changeThisShow(true);
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            // case "changeKey" :
            //     //修改请求条件
            //     for (let key in data.data) {
            //         this.keyParams[key] = data.data[key];
            //     }
            //     this.reGetData();
            //     break;
            case "animateOn":
                this.animateOn();
                break;
            case "changeKey" :
            case "showComponent":
                //修改请求条件
                let hasKey = false;
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                    hasKey = true;
                }
                if(hasKey){
                    this.reGetData();
                }
                if(data.type === 'showComponent'){
                    this.changeThisShow(true);
                }
                break;
            default:
                break;
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            if (resolve) {
                resolve(result);
            } else {
                this.setState({data: result});
            }
        }
    }

    //当前组件显示隐藏
    changeThisShow(type) {
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: {showStatus: type, id: this.props.thisData.id}
        });
        this.setState({showComponent: type});
        if(!type){
            this.setState({data:{}});
            const {closeInteract} = this.props.thisData.style;
            this.interactData(closeInteract);
        }
    }


    render() {
        const detail = this.state.data ? this.state.data : {};
        const {style} = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        return (
            <ComponentBox
                id={this.props.thisData.id}
                thisData={this.props.thisData}
                receiveMessage={this.receiveMessage.bind(this)}
                reGetData={this.reGetData.bind(this)}
                style={this.props.style}
            >
                <Motion style={{top: spring(this.props.thisData.showStatus ? 0 : 100)}}>
                    {({top}) => {
                        return (
                            <div
                                className={`${cssStyle.detailBox} ${this.themeList[style.theme]}`}
                                style={{backgroundColor: style.bgColor, top: -top + '%', padding:compatibleSize.padding}}
                            >
                                <div className={cssStyle.headBox} style={{minHeight:compatibleSize.titleHeight}}>
                                    <div className={cssStyle.head} style={{fontSize:compatibleSize.titleSize,color: style.titleColor,width:style.titleWidth}}>{detail.projectName}</div>
                                </div>
                                {this.getCloseDom(style,compatibleSize)}
                                <Scrollbars style={{height: 'calc(100% - ' + compatibleSize.titleHeight + ')',fontSize:compatibleSize.fontSize}}>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead}>
                                            <img alt='' src={this.themeImgList[style.theme]} className={cssStyle.itemHeadIcon}/>
                                            <div className={cssStyle.itemTitle}>基本信息</div>
                                        </div>
                                        <table className={cssStyle.itemContent}>
                                            <tbody>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>申报时间</td>
                                                <td className={cssStyle.tdContent}>{detail.time}</td>
                                                <td className={cssStyle.tdTitle}>经费预算</td>
                                                <td className={cssStyle.tdContent}>{detail.price}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>申报部门</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>{detail.dep}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>申报内容及理由</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>{detail.reason}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>项目经办人</td>
                                                <td className={cssStyle.tdContent}>{detail.user}</td>
                                                <td className={cssStyle.tdTitle}>联系电话</td>
                                                <td className={cssStyle.tdContent}>{detail.phone}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>信息化项目</td>
                                                <td className={cssStyle.tdContent}>{detail.informatization}</td>
                                                <td className={cssStyle.tdTitle}>是否单一来源项目</td>
                                                <td className={cssStyle.tdContent}>{detail.isSingle}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>详细送货地址</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>{detail.address}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead}>
                                            <img alt='' src={this.themeImgList[style.theme]} className={cssStyle.itemHeadIcon}/>
                                            <div className={cssStyle.itemTitle}>项目审批</div>
                                        </div>
                                        <Timeline className={cssStyle.timeline} style={{fontSize:compatibleSize.fontSize}}>
                                            <Timeline.Item color="green" className={cssStyle.fontColor} >
                                                单位领导审批
                                            </Timeline.Item>
                                            {getTimelineList(detail.leaderApproval)}
                                            <Timeline.Item color="green" className={cssStyle.fontColor} >
                                                内控小组审批
                                            </Timeline.Item>
                                            {getTimelineList(detail.teamApproval)}
                                        </Timeline>
                                    </div>
                                </Scrollbars>
                            </div>
                        )
                    }}
                </Motion>
            </ComponentBox>
        )
    }
}