import React from "react";
import cssStyle from "../../../common/css/detail.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { getCloseDom, getCompatibleData, changeThisShow } from "../../../common/detailUtil";
import iconTriangleOne from "../../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../../common/images/lanjiao_blue.svg";
import ProgressContent from "../../linkage_disposal/progressContent";

export default class EmergencyEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.changeThisShow = changeThisShow.bind(this);
        this.themeList = ['', cssStyle.themeOne];
        this.themeImgList = [iconTriangleOne, iconTriangleTwo];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        if(this.props.detail == null){
            return '';
        }
        const detail = this.props.detail.runHanding ? this.props.detail.runHanding : {};
        const progress = this.props.detail.processHandles ? this.props.detail.processHandles : [];
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        return (
            <div
                className={`${cssStyle.detailBox} ${this.themeList[style.theme]}`}
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding }}
            >
                <div className={cssStyle.headBox} style={{ height: compatibleSize.titleHeight }}>
                    <div className={cssStyle.head} style={{ fontSize: compatibleSize.titleSize, color: style.titleColor }}>{detail.title}</div>
                </div>
                {this.getCloseDom(style, compatibleSize)}
                <Scrollbars style={{ height: 'calc(100% - ' + compatibleSize.titleHeight + ')', fontSize: compatibleSize.fontSize }}>
                    <div className={cssStyle.itemBox}>
                        <div className={cssStyle.itemHead}>
                            <img alt='' src={this.themeImgList[style.theme]} className={cssStyle.itemHeadIcon} />
                            <div className={cssStyle.itemTitle}>基本信息</div>
                        </div>
                        <table className={cssStyle.itemContent}>
                            <tbody>
                            <tr>
                                <td className={cssStyle.tdTitle}>事件类别</td>
                                <td className={cssStyle.tdContent}>{detail.eventTypeName}</td>
                                <td className={cssStyle.tdTitle}>事发时间</td>
                                <td className={cssStyle.tdContent}>{detail.incidentTime}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>所属街道</td>
                                <td className={cssStyle.tdContent}>{detail.roadName}</td>
                                <td className={cssStyle.tdTitle}>事件等级</td>
                                <td className={cssStyle.tdContent}>{detail.warningLevelName}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>事发地点</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.incidentAddress}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>事件来源</td>
                                <td className={cssStyle.tdContent}>{detail.sourceTypeName}</td>
                                <td className={cssStyle.tdTitle}>影响范围</td>
                                <td className={cssStyle.tdContent}>{detail.influence}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>事件发展趋势</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.trends}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>已采取措施</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.measuresTaken}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>备注</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.备注}</td>
                            </tr>
                            </tbody>
                        </table>
                        <div className={cssStyle.itemHead}>
                            <img alt='' src={this.themeImgList[style.theme]} className={cssStyle.itemHeadIcon} />
                            <div className={cssStyle.itemTitle}>处置进度</div>
                        </div>
                        <ProgressContent progress={progress}/>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}