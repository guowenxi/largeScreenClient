import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./box_ex.module.css";
import { Motion, spring } from "react-motion";
import { getCompatibleSize } from "../../common/util";

export default class BoxEx extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [] };
        this.keyParams = {};
        this.refreshTimer = [];
    }

    //组件加载触发函数
    componentDidMount() {
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey":
                break;
            case "showComponent":
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.setState({ opacity: 1 });
    }

    render() {
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        if (style.contentName) {
            const SvgContent = require(`./content/${style.contentName}/${style.contentName}`).default;
            return (
                <ComponentBox style={{ ...this.props.style, pointerEvents: !style.pointerEvents && 'none' }} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                    <Motion style={{ opacity: spring(this.state.opacity) }}>
                        {({ opacity }) =>
                            <div className={cssStyle.box} style={{ opacity, fontSize }} >
                                <SvgContent className={cssStyle.box} thisData={this.props.thisData} />
                            </div>
                        }
                    </Motion>
                </ComponentBox>
            );
        } else {
            return '';
        }

    }
}