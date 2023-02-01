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
                                    <td className={cssStyle.tdTitle}>拟购建资产名称</td>
                                    <td className={cssStyle.tdContent}>{detail.name}</td>
                                    <td className={cssStyle.tdTitle}>品牌</td>
                                    <td className={cssStyle.tdContent}>{detail.brand}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>规格型号</td>
                                    <td className={cssStyle.tdContent}>{detail.specifications}</td>
                                    <td className={cssStyle.tdTitle}>计量单位</td>
                                    <td className={cssStyle.tdContent}>{detail.unit}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>数量</td>
                                    <td className={cssStyle.tdContent}>{detail.num}</td>
                                    <td className={cssStyle.tdTitle}>计划单价</td>
                                    <td className={cssStyle.tdContent}>{detail.unitPrice}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>计划总额</td>
                                    <td className={cssStyle.tdContent}>{detail.totalPrice}</td>
                                    <td className={cssStyle.tdTitle}>配置方式</td>
                                    <td className={cssStyle.tdContent}>{detail.configuration}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>同类资产存量</td>
                                    <td className={cssStyle.tdContent}>{detail.similarNum}</td>
                                    <td className={cssStyle.tdTitle}>财政批复数（数量）</td>
                                    <td className={cssStyle.tdContent}>{detail.approvalNum}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>财政批复数（金额）</td>
                                    <td className={cssStyle.tdContent} colSpan={3}>{detail.approvalMoney}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}