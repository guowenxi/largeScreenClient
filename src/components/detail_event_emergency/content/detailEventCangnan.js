import React from "react";
import cssStyle from "./detailEventCangnan.module.css";
import {systemArea} from "../../../config";

export default class DetailEventCangnan extends React.Component {
    constructor(props) {
        super(props);
        this.state = { contentType: 0 };
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    getFontColor(level) {
        let color;
        switch (level) {
            case "黄色":
                color = "yellow";
                break;
            case "橙色":
                color = "orange";
                break;
            case "红色":
                color = "red";
                break;
            default:
                break;
        }
        return color;
    }

    render() {
        const { detail,padding,fontSize } = this.props;
        return (
            <div className={cssStyle.mainItem} style={{ padding,fontSize }}>
                <ul className={cssStyle.mainContent}>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemHalf}`}>
                        <p>事件类别：</p>
                        <p className={cssStyle.hidden}>{detail.eventType}</p>
                    </li>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemHalf}`}>
                        <p>事件等级：</p>
                        <p style={{ color: this.getFontColor(detail.earlyWarningLevel) }}>{detail.earlyWarningLevel}</p>
                    </li>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemHalf}`}>
                        <p>现实行为：</p>
                        <p>{detail.actionType}</p>
                    </li>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemHalf}`}>
                        <p>{systemArea === 'longgang' ? '所属工作站':'所属街道'}：</p>
                        <p>{detail.roadId}</p>
                    </li>
                    <li className={cssStyle.contentItem}>
                        <p>事发地点：</p>
                        <p>{detail.incidentAddress}</p>
                    </li>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemHalf}`}>
                        <p>事发时间：</p>
                        <p>{detail.incidentTime}</p>
                    </li>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemHalf}`}>
                        <p>参与人数：</p>
                        <p>{detail.joinNum}</p>
                    </li>
                    <li className={cssStyle.contentItem}>
                        <p>附件：</p>
                        <p>
                            {detail.files && detail.files.length > 0 ?
                                detail.files.map((item, index) => {
                                    return (
                                        <span className={cssStyle.clickItem}
                                            key={index}>{item.fileName}</span>
                                    )
                                }) : ''}
                        </p>
                    </li>
                    <li className={cssStyle.contentItem}>
                        <p>事件概述：</p>
                        <p>{detail.incidentContent}</p>
                    </li>
                    <li className={cssStyle.contentItem}>
                        <p>响应等级：</p>
                        <p style={{ color: this.getFontColor(detail.warningLevel) }}>{detail.warningLevel}</p>
                    </li>
                    <li className={cssStyle.contentItem}>
                        <p>应急小组：</p>
                        <p>{detail.teamName}</p>
                    </li>
                    <li className={cssStyle.contentItem}>
                        <p>备注：</p>
                        <p>{detail.remark}</p>
                    </li>
                </ul>
            </div>
        )
    }
}