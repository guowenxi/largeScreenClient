import React from "react";
import cssStyle from "../../../common/css/detail.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { getCloseDom, getCompatibleData, changeThisShow } from "../../../common/detailUtil";
import iconTriangleOne from "../../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../../common/images/lanjiao_blue.svg";

export default class Instruction extends React.Component {
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
        const compatibleSize = this.getCompatibleData(style);
        return (
            <div
                className={`${cssStyle.detailBox} ${this.themeList[style.theme]}`}
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding }}
            >
                <div className={cssStyle.headBox} style={{ minHeight: compatibleSize.titleHeight }}>
                    <div className={cssStyle.head} style={{ fontSize: compatibleSize.titleSize, color: style.titleColor }}>{detail.instructionTitle}</div>
                </div>
                {this.getCloseDom(style, compatibleSize)}
                <Scrollbars style={{fontSize: compatibleSize.fontSize,flex:1 }}>
                    <div className={cssStyle.itemBox}>
                        <div className={cssStyle.itemHead}>
                            <img alt='' src={this.themeImgList[style.theme]} className={cssStyle.itemHeadIcon} />
                            <div className={cssStyle.itemTitle}>基本信息</div>
                        </div>
                        <table className={cssStyle.itemContent}>
                            <tbody>
                            <tr>
                                <td className={cssStyle.tdTitle}>发送时间</td>
                                <td className={cssStyle.tdContent} style={{width:'80%'}}>{detail.createTime}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>接收人员</td>
                                <td className={cssStyle.tdContent} style={{width:'80%'}}>
                                    {detail.userList && detail.userList.map((user,index)=>
                                        <span key={index}>{user.departmentName ? user.departmentName+'-':''}{user.userName}{index < detail.userList.length-1?'；':''}</span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>指令内容</td>
                                <td className={cssStyle.tdContent} style={{width:'80%'}}>{detail.instructionContent}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}