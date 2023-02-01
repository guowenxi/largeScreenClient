import React from "react";
import cssStyle from "./detailEventYongjia.module.css";

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
        const { detail,padding } = this.props;
        return (
            <div className={cssStyle.mainItem} style={{ padding }}>
                <ul className={cssStyle.mainContent}>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemHalf}`}>
                        <p>发生时间</p>
                    <p className={`${cssStyle.detailColor} ${cssStyle.hidden}`}>{detail.incidentTime}</p>
                    </li>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemHalf}`}>
                        <p>涉及人数</p>
                        <p className={cssStyle.detailColor}>{detail.peopleNumber}</p>
                    </li>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemHalf}`}>
                        <p>所在街道</p>
                        <p className={cssStyle.detailColor}>{detail.road}</p>
                    </li>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemHalf}`}>
                        <p>事发地点</p>
                        <p className={cssStyle.detailColor}>{detail.address}</p>
                    </li>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemAll}`} >
                        <p>事件类型</p>
                        <p className={cssStyle.detailColor}>{detail.eventType}</p>
                    </li>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemAll}`}>
                        <p>涉稳事件</p>
                        <p className={cssStyle.detailColor}>{detail.event}</p>
                    </li>
                    <li className={`${cssStyle.contentItem} ${cssStyle.contentItemAll}`}>
                        <p>涉稳问题</p>
                        <p className={cssStyle.detailColor}>{detail.problem}</p>
                    </li>
                </ul>
            </div>
        )
    }
}