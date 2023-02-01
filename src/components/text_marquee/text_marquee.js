/* eslint-disable no-unused-vars */
import React from "react";
import ComponentBox from "../component_box";
import { getData } from "../../common/getDataUtil";
import { Motion, spring, } from "react-motion";

import { interactData } from "../../common/util";

import cssStyle from "./text_marquee.module.css";

export default class TextMarquee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: 0,
            translateX: 0,
            keyer: null,
            content: '',
        };
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            this.getData(this.callBack.bind(this, resolve));
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }
    componentDidUpdate() {
    }
    //组件删除时触发函数
    componentWillUnmount() {
        this.clearKeyer();
        this.keyer = null;
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "showComponent":
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity: 1 });
        });
    }

    //重新获取数据
    reGetData() {
        this.clearKeyer();
        this.setState({ resultData: [] });
        this.getData(this.callBack.bind(this, ""));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            // 数据配置为{content: ''}
            this.setState({ content: result.content }, () => {
                this.setKeyer();
            });
            if (resolve) {
                resolve(result);
            }
        }
    }
    getOffsetWidth(target) {
        if (target === 'current') {
            return this.contentRef ? this.contentRef.offsetWidth : 0;
        }
        return this.contentRef ? this.contentRef.parentNode.offsetWidth : 0;
    }
    // 设置运动的定时器
    setKeyer() {
        const currentWidth = this.getOffsetWidth('current');
        const parentWidth = this.getOffsetWidth('parent');
        const { scrollType } = this.props.thisData.style;
        const callback = () => {
            this.clearKeyer();
            let { translateX } = this.state;
            translateX--;
            if (translateX < -currentWidth) {
                translateX = parentWidth;
            }
            this.setState({ translateX, });
            requestAnimationFrame(callback);
        }
        if (scrollType === 1 || !scrollType) {
            this.setState({ translateX: -this.contentRef.parentNode.offsetWidth });
            const keyer = requestAnimationFrame(callback);
            this.keyer = keyer;
        } else if (scrollType === 2) {
            if (currentWidth >= parentWidth) {
                const keyer = requestAnimationFrame(callback);
                this.keyer = keyer;
            }
        } else {
            return;
        }
    }
    // 清除定时器
    clearKeyer() {
        if (this.keyer) {
            cancelAnimationFrame(this.keyer);
        }
    }
    render() {
        const { fontSize, fontColor, } = this.props.thisData.style;
        const { content, translateX, } = this.state;
        return (
            <ComponentBox
                style={this.props.style}
                receiveMessage={this.receiveMessage.bind(this)}
                reGetData={this.reGetData.bind(this)}
                thisData={this.props.thisData}
            >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) => {
                        return (
                            <div className={cssStyle.container} style={{ opacity }} >
                                <div
                                    className={cssStyle.content}
                                    style={{ fontSize, color: fontColor, transform: `translate(${translateX}px)` }}
                                    ref={contentRef => this.contentRef = contentRef}
                                >{content}</div>
                            </div>
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}
