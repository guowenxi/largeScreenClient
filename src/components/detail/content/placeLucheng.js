import React from "react";
import cssStyle from "../../../common/css/detail.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { getCloseDom, getCompatibleData, changeThisShow } from "../../../common/detailUtil";
import iconTriangleOne from "../../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../../common/images/lanjiao_blue.svg";

export default class BudgetImplementation extends React.Component {
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
        const { detail } = this.props;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        return (
            <div
                className={`${cssStyle.detailBox} ${this.themeList[style.theme]}`}
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding }}
            >
                <div className={cssStyle.headBox} style={{ height: compatibleSize.titleHeight }}>
                    <div className={cssStyle.head} style={{ fontSize: compatibleSize.titleSize, color: style.titleColor }}>{detail.name}</div>
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
                                    <td className={cssStyle.tdTitle}>名称</td>
                                    <td className={cssStyle.tdContent}>{detail.name}</td>
                                    <td className={cssStyle.tdTitle}>事发地点</td>
                                    <td className={cssStyle.tdContent}>{detail.address}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>类别</td>
                                    <td className={cssStyle.tdContent}>{detail.type}</td>
                                    <td className={cssStyle.tdTitle}>所属街道</td>
                                    <td className={cssStyle.tdContent}>{detail.street}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>预警时间</td>
                                    <td className={cssStyle.tdContent}>{detail.time}</td>
                                    <td className={cssStyle.tdTitle}>预警原因</td>
                                    <td className={cssStyle.tdContent}>{detail.reason}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}