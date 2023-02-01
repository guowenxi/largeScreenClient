import React from "react";
import cssStyle from "../../../common/css/detail.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import {getCloseDom, getCompatibleData, changeThisShow} from "../../../common/detailUtil";
import iconTriangleOne from "../../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../../common/images/lanjiao_blue.svg";

export default class Infrastructure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.changeThisShow = changeThisShow.bind(this);
        this.themeList = ['',cssStyle.themeOne];
        this.themeImgList = [iconTriangleOne,iconTriangleTwo];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const {detail} = this.props;
        const {style} = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        return (
            <div
                className={`${cssStyle.detailBox} ${this.themeList[style.theme]}`}
                style={{...this.props.style,backgroundColor: style.bgColor, padding:compatibleSize.padding}}
            >
                <div className={cssStyle.headBox} style={{height:compatibleSize.titleHeight}}>
                    <div className={cssStyle.head} style={{fontSize:compatibleSize.titleSize,color: style.titleColor,width:style.titleWidth}}>{detail.name}</div>
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
                                <td className={cssStyle.tdTitle}>申请单位</td>
                                <td className={cssStyle.tdContent}>{detail.depart}</td>
                                <td className={cssStyle.tdTitle}>项目预算金额</td>
                                <td className={cssStyle.tdContent}>{detail.money}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>联系人</td>
                                <td className={cssStyle.tdContent}>{detail.connectName}</td>
                                <td className={cssStyle.tdTitle}>联系电话</td>
                                <td className={cssStyle.tdContent}>{detail.phone}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>警保部三科项目管理人</td>
                                <td className={cssStyle.tdContent}>{detail.manager}</td>
                                <td className={cssStyle.tdTitle}>联系电话</td>
                                <td className={cssStyle.tdContent}>{detail.managerPhone}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>项目前期阶段审批</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.earlyStatus}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>项目在建阶段审批</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.buildStatus}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>项目结算阶段审批</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.settleStatus}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>项目完成阶段审批</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{detail.finishStatus}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>审批人列表</td>
                                <td className={cssStyle.tdContent} colSpan={3}>
                                    {detail.approverList && (
                                        detail.approverList.map((item,index) =>
                                            item ? <span className={cssStyle.fileName} key={index}>{item}</span> :''
                                        )
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}