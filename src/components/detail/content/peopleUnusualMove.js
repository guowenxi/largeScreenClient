import React from "react";
import cssStyle from "../../../common/css/detail.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { getCloseDom, getCompatibleData, changeThisShow } from "../../../common/detailUtil";
import iconTriangleOne from "../../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../../common/images/lanjiao_blue.svg";

export default class PeopleUnusualMove extends React.Component {
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
        const {detail} = this.props;
        const { style } = this.props.thisData;
        const petition = detail.petitionList ? detail.petitionList : {};
        const detailInfo = detail.detailInfo ? detail.detailInfo : {};
        const compatibleSize = this.getCompatibleData(style);
        return (
            <div
                className={`${cssStyle.detailBox} ${this.themeList[style.theme]}`}
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding }}
            >
                <div className={cssStyle.headBox} style={{ height: compatibleSize.titleHeight }}>
                    <div className={cssStyle.head} style={{ fontSize: compatibleSize.titleSize, color: style.titleColor }}>{detailInfo.name}</div>
                </div>
                {this.getCloseDom(style, compatibleSize)}
                <Scrollbars style={{ height: 'calc(100% - ' + compatibleSize.titleHeight + ')', fontSize: compatibleSize.fontSize }}>
                    <div className={cssStyle.itemBox}>
                        <div className={cssStyle.itemHead}>
                            <img alt='' src={this.themeImgList[style.theme]} className={cssStyle.itemHeadIcon} />
                            <div className={cssStyle.itemTitle}>异动行为</div>
                        </div>
                        <table className={cssStyle.itemContent}>
                            <tbody>
                            <tr>
                                <td className={cssStyle.tdTitle}>时间</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{petition.petitionTime}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>内容</td>
                                <td className={cssStyle.tdContent} colSpan={3}>{petition.petitionContent}</td>
                            </tr>
                            </tbody>
                        </table>
                        <div className={cssStyle.itemHead}>
                            <img alt='' src={this.themeImgList[style.theme]} className={cssStyle.itemHeadIcon} />
                            <div className={cssStyle.itemTitle}>处置情况</div>
                        </div>
                        <table className={cssStyle.itemContent}>
                            <tbody>
                            {petition.recordList && petition.recordList.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className={cssStyle.tdTitle}>{item.createTime}</td>
                                        <td className={cssStyle.tdContent} colSpan={3}>{item.combineContent}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        <div className={cssStyle.itemHead}>
                            <img alt='' src={this.themeImgList[style.theme]} className={cssStyle.itemHeadIcon} />
                            <div className={cssStyle.itemTitle}>稳控专班</div>
                        </div>
                        <table className={cssStyle.itemContent}>
                            <tbody>
                            <tr>
                                <td className={cssStyle.tdTitle} >身份</td>
                                <td className={cssStyle.tdTitle} >单位职务</td>
                                <td className={cssStyle.tdTitle} style={{width:'15%'}}>姓名</td>
                                <td className={cssStyle.tdTitle} style={{width:'27%'}}>联系电话</td>
                                <td className={cssStyle.tdTitle} style={{width:'18%'}}>市府短号</td>
                            </tr>
                            {detail.controlPeopleList && detail.controlPeopleList.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignCenter}`} style={{width:'20%'}}>{item.peopleTypeName}</td>
                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignCenter}`} style={{width:'20%'}}>{item.duty}</td>
                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignCenter}`} style={{width:'15%'}}>{item.name}</td>
                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignCenter}`} style={{width:'27%'}}>{item.phone}</td>
                                        <td className={`${cssStyle.tdContent} ${cssStyle.alignCenter}`} style={{width:'18%'}}>{item.goverCornet?item.goverCornet:'5'}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}