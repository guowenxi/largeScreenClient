import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./gallery.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import { interactData } from "../../common/util";

export default class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], points: [], showIndex: 0 };
        this.getData = getData.bind(this);
        this.keyParams = {};
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => { this.getData(this.callBack.bind(this, resolve)) });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        this.clearTimer();
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
        })
    }

    //重新获取数据
    reGetData() {
        this.clearTimer();
        this.setState({ resultData: [] });
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            this.setState({ resultData: result });
            this.autoChangeCenter();
            if (resolve) {
                resolve(result);
            }
        }
    }

    // 交互
    changeInteract(item) {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }

    autoChangeCenter() {
        const { interval } = this.props.thisData.style;
        this.timer = setTimeout(() => {
            this.clearTimer();
            let { showIndex, resultData } = this.state;
            showIndex++;
            if (showIndex >= resultData.length) {
                showIndex = 0;
            }
            this.setState({ showIndex }, () => {
                this.changeInteract(resultData[this.state.showIndex]);
            });
            this.autoChangeCenter();
        }, interval || 2000);
    }

    // 鼠标放在上面不滚动
    handleMouseEnter() {
        this.clearTimer();
    }

    // 鼠标离开滚动
    handleMouseLeave() {
        this.autoChangeCenter();
    }

    // 点击下面的点
    handleClickPoint(index) {
        this.setState({ showIndex: index }, () => {
            const { resultData, showIndex } = this.state;
            this.changeInteract(resultData[showIndex]);
        })
    }

    // 清除定时器
    clearTimer() {
        const { timer } = this;
        if (timer) {
            clearTimeout(timer);
        }
    }
    render() {
        const { style } = this.props.thisData;
        // const fontSize = getCompatibleSize(style.fontSize);
        const { resultData, showIndex } = this.state;
        const imgKey = style.imgKey ? style.imgKey : 'img';
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div
                            className={cssStyle.box}
                            style={{ opacity }}
                            onMouseEnter={this.handleMouseEnter.bind(this)}
                            onMouseLeave={this.handleMouseLeave.bind(this)}
                        >
                            {resultData.map((item, index) => {
                                const subOne = showIndex - index;
                                const subTwo = showIndex - (index - resultData.length);
                                const subThree = showIndex - (index + resultData.length);
                                let sub = subOne;
                                if (Math.abs(sub) > Math.abs(subTwo)) {
                                    sub = subTwo;
                                }
                                if (Math.abs(sub) > Math.abs(subThree)) {
                                    sub = subThree;
                                }
                                // const sub = Math.abs(subOne) < Math.abs(subTwo) ? subOne : subTwo;
                                const subAbs = Math.abs(sub);
                                let opacity, translateX, translateZ, rotateY;
                                if (subAbs === 0) {
                                    opacity = 1;
                                    translateZ = 0;
                                } else if (subAbs === 1) {
                                    opacity = 0.5;
                                    translateZ = -200;
                                } else {
                                    opacity = 0;
                                    translateZ = -300;
                                }
                                if (sub >= 2) {
                                    translateX = -94;
                                    rotateY = 45;
                                } else if (sub === 1) {
                                    translateX = -72;
                                    rotateY = 45;
                                } else if (sub === 0) {
                                    translateX = 0;
                                    rotateY = 0;
                                } else if (sub === -1) {
                                    translateX = 72;
                                    rotateY = -45;
                                } else if (sub <= -2) {
                                    translateX = 94;
                                    rotateY = -45;
                                }
                                return (
                                    <Motion style={{ opacity: spring(opacity), translateX: spring(translateX), translateZ: spring(translateZ), rotateY: spring(rotateY) }} key={index}>
                                        {({ opacity, translateX, translateZ, rotateY }) =>
                                            <div className={`${cssStyle.item} ${style.openReflect ? cssStyle.reflect : ''}`} style={{ opacity, transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg)` }} key={index}>
                                                <img alt={''} src={item[imgKey]} className={cssStyle.image} />
                                            </div>
                                        }
                                    </Motion>
                                );
                            })}
                            {
                                style.showPaginition &&
                                <div className={cssStyle.pointBox}>
                                    {
                                        resultData.map((item, index) => {
                                            return (
                                                <div
                                                    className={`${cssStyle.pointItem} ${showIndex === index ? cssStyle.selectedPointItem : ''}`}
                                                    key={index}
                                                    onClick={this.handleClickPoint.bind(this, index)}
                                                >
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}