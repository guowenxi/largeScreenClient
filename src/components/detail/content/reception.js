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
                                    <td className={cssStyle.tdTitle}>标题</td>
                                    <td className={cssStyle.tdContent}>{detail.title}</td>
                                    <td className={cssStyle.tdTitle}>审批状态</td>
                                    <td className={cssStyle.tdContent}>{detail.status}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>审批结果</td>
                                    <td className={cssStyle.tdContent}>{detail.result}</td>
                                    <td className={cssStyle.tdTitle}>发起时间</td>
                                    <td className={cssStyle.tdContent}>{detail.launchTime}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>完成时间</td>
                                    <td className={cssStyle.tdContent}>{detail.finishTime}</td>
                                    <td className={cssStyle.tdTitle}>耗时(时:分:秒)</td>
                                    <td className={cssStyle.tdContent}>{detail.timeConsume}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>申请人姓名</td>
                                    <td className={cssStyle.tdContent}>{detail.applyName}</td>
                                    <td className={cssStyle.tdTitle}>申请部门</td>
                                    <td className={cssStyle.tdContent}>{detail.applyDepart}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>楼幢号</td>
                                    <td className={cssStyle.tdContent}>{detail.buildNum}</td>
                                    <td className={cssStyle.tdTitle}>被接待单位</td>
                                    <td className={cssStyle.tdContent}>{detail.receptionUnit}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>领队职级</td>
                                    <td className={cssStyle.tdContent}>{detail.leadClass}</td>
                                    <td className={cssStyle.tdTitle}>随行人数</td>
                                    <td className={cssStyle.tdContent}>{detail.togetherNum}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>陪同领导</td>
                                    <td className={cssStyle.tdContent}>{detail.leader}</td>
                                    <td className={cssStyle.tdTitle}>陪同人数（含领导）</td>
                                    <td className={cssStyle.tdContent}>{detail.accompanyNum}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>用餐日期</td>
                                    <td className={cssStyle.tdContent}>{detail.mealDate}</td>
                                    <td className={cssStyle.tdTitle}>用餐时间</td>
                                    <td className={cssStyle.tdContent}>{detail.mealTime}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>预计合计金额</td>
                                    <td className={cssStyle.tdContent}>{detail.money}</td>
                                    <td className={cssStyle.tdTitle}>来访事由</td>
                                    <td className={cssStyle.tdContent}>{detail.visitReason}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>审批人列表（审批记录）</td>
                                    <td className={cssStyle.tdContent} colSpan={3}>{detail.approverList}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}