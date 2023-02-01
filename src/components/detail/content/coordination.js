import React from "react";
import cssStyle from "../../../common/css/detail.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { getCloseDom, getCompatibleData, changeThisShow, getPeopleAboutBox, getEventAboutBox, getCompanyAboutBox,getTimelineList } from "../../../common/detailUtil";
import iconTriangleOne from "../../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../../common/images/lanjiao_blue.svg";
import Emitter from "../../../common/eventBus";
import { Timeline } from "antd";

export default class BudgetImplementation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {}, showComponent: false, showList: [1], contactDataIndex: 0, aboutPeopleIndex: 0, aboutEventIndex: 0, aboutCompanytIndex: 0 };
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.changeThisShow = changeThisShow.bind(this);
        this.getPeopleAboutBox = getPeopleAboutBox.bind(this);
        this.getEventAboutBox = getEventAboutBox.bind(this);
        this.getCompanyAboutBox = getCompanyAboutBox.bind(this);
        this.themeList = ['', cssStyle.themeOne];
        this.themeImgList = [iconTriangleOne, iconTriangleTwo];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }


    //当前组件显示隐藏
    changeThisShow(type) {
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: { showStatus: type, id: this.props.thisData.id }
        });
        this.setState({ showComponent: type });
        if (!type) {
            this.setState({ data: {}, showList: [2], contactDataIndex: 0 });
            const { closeInteract } = this.props.thisData.style;
            this.interactData(closeInteract);
        }
    }



    //切换某项内容显示隐藏
    changeItemShow(index) {
        let { showList } = this.state;
        const indexPos = showList.indexOf(index);
        if (indexPos >= 0) {
            showList.splice(indexPos, 1);
        } else {
            showList.push(index);
        }
        this.setState({ showList });
    }



    render() {
        const { detail } = this.props;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        const { showList } = this.state;
        return (
            <div
                className={`${cssStyle.detailBox} ${this.themeList[style.theme]}`}
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding }}
            >
                <div className={cssStyle.headBox} style={{ height: compatibleSize.titleHeight }}>
                    <div className={cssStyle.head} style={{ fontSize: compatibleSize.titleSize, color: style.titleColor,width:style.titleWidth }}>{detail.title}</div>
                </div>
                {this.getCloseDom(style, compatibleSize)}
                <div style={{flex: 1}}>
                    <Scrollbars style={{ fontSize: compatibleSize.fontSize }}>
                        <div className={cssStyle.itemBox}>
                            <div className={cssStyle.itemHead} onClick={this.changeItemShow.bind(this, 1)}>
                                <img alt='' src={this.themeImgList[style.theme]} className={`${cssStyle.itemHeadIcon} ${showList.indexOf(1) >= 0 ? cssStyle.itemHeadIconShow : ''}`} />
                                <div className={cssStyle.itemTitle}>基本信息</div>
                            </div>
                            <table className={cssStyle.itemContent} style={{ display: showList.indexOf(1) < 0 ? 'none' : '' }}>
                                <tbody>
                                <tr>
                                    <td className={cssStyle.tdTitle}>事件类别</td>
                                    <td className={cssStyle.tdContent} colSpan={3}>{detail.allEventTypeName}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>预警等级</td>
                                    <td className={cssStyle.tdContent}>{detail.earlyWarningLevelName}</td>
                                    <td className={cssStyle.tdTitle}>预警状态</td>
                                    <td className={cssStyle.tdContent}>{detail.isWarning}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>预警时间</td>
                                    <td className={cssStyle.tdContent}>{detail.warningTime}</td>
                                    <td className={cssStyle.tdTitle}>所属地点</td>
                                    <td className={cssStyle.tdContent}>{detail.incidentAddress}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>总体描述</td>
                                    <td className={cssStyle.tdContent} colSpan={3}>{detail.incidentContent}</td>
                                </tr>
                                </tbody>
                            </table>

                        </div>
                        {this.getPeopleAboutBox(detail.associatedPeople, 1, 1, 2,false)}
                        {this.getEventAboutBox(detail.associatedEvent, 2, 1, 2,false)}
                        {this.getCompanyAboutBox(detail.associatedCompany, 3, 1, 2,false)}
                        <div className={cssStyle.itemBox}>
                            <div className={cssStyle.itemHead} onClick={this.changeItemShow.bind(this, 5)}>
                                <img alt='' src={this.themeImgList[1]} className={`${cssStyle.itemHeadIcon} ${showList.indexOf(5) >= 0 ? cssStyle.itemHeadIconShow : ''}`} />
                                <div className={cssStyle.itemTitle}>处置进度</div>
                            </div>
                            <Timeline className={cssStyle.timeline} style={{ fontSize: compatibleSize.fontSize, display: showList.indexOf(5) < 0 ? 'none' : '' }}>
                                {detail.fourPlatformEventProcessList&&detail.fourPlatformEventProcessList.map((item,index)=>{
                                    return(
                                        <div key={index}>
                                            <Timeline.Item color="green" className={cssStyle.fontColor} >
                                                {item.organizationName}
                                            </Timeline.Item>
                                            {getTimelineList(detail.fourPlatformEventProcessList,2)}
                                        </div>
                                    )
                                })}
                            </Timeline>
                        </div>
                    </Scrollbars>
                </div>
            </div>
        );
    }
}