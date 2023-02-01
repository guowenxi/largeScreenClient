import React from "react";
import cssStyle from "./news.module.css";
// import cssStyle from "../../../common/css/detail.module.css";
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
                <div className={cssStyle.itemHead}>
                    <div className={cssStyle.itemTitle} style={{ fontSize: compatibleSize.titleSize, color: style.titleColor }}>{detail.title}</div>
                </div>
                {this.getCloseDom(style, compatibleSize)}
                <div className={cssStyle.itemBox}>
                    <div className={cssStyle.label}>
                        <div className={cssStyle.title}>
                            <div>作者：</div>
                            <div>{detail.author}</div>
                        </div>
                        <div className={cssStyle.title}>
                            <div>阅读次数：</div>
                            <div>{detail.readNum}</div>
                        </div>
                        <div className={cssStyle.title}>
                            <div>栏目类型：</div>
                            <div>{detail.type}</div>
                        </div>
                    </div>
                </div>
                <Scrollbars style={{ height: 'calc(95% - 5em)', fontSize: '1.2em' }}>
                    <div className={cssStyle.content}>
                        {detail.content}
                    </div>
                </Scrollbars>
                <div className={cssStyle.end}>
                    <div>发布时间：</div>
                    <div>{detail.launchTime}</div>
                </div>
            </div>
        );
    }
}