import React from "react";
import cssStyle from "./contentOne.module.css";
import {Tooltip} from "antd";

export default class ContentOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const {detail,styleData} = this.props;
        return (
            <div className={cssStyle.listItem} style={this.props.style}>
                <div>上报人：{detail.userName}</div>
                <div>时间：{detail.commitTime}</div>
                <div>所属街道：{detail.streetName}</div>
                <Tooltip title={detail.descr} >
                    <div className={cssStyle.content} style={{width:styleData.contentWidth}}>{detail.descr}</div>
                </Tooltip>
            </div>
        );
    }
}