import React from "react";
import ComponentBox from "../component_box";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";

import { interactData } from "../../common/util";

import cssStyle from "./month_slider.module.css";

export default class MonthSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: 0,
            // 滑块能否移动
            canMove: false,
            // 滑块的left
            left: 0,
            // 鼠标点击在滑块上的内部偏移量
            offsetX: 0,
            // 月份区间
            dates: [],
            // 滑块显示的月份的索引值
            index: 0,
            // 滑块自动移动的定时器
            keyer: null,
            // 判断定时器是否被中断（被clear，但未设置为null），当定时器还在工作，拖动滑块时，定时器暂停执行，鼠标从滑块上抬起后，定时器重新开始工作
            isInterrupted: false,
            // 标记定时器工作后滑块的运动状态，当定时器处于中断状态或者未开启（为null），但index不为0的状态，鼠标从滑块上放开后，定时器开始工作直接移动到index+1的位置
            flag: false,
            // 每个月份在轴上占的区间宽度
            sliceWidth: 0,
            // 滑块运动的最大区间
            disx: 0,
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
    //组件删除时触发函数
    componentWillUnmount() {
        clearInterval(this.state.keyer);
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
        this.setState({ resultData: [] });
        this.getData(this.callBack.bind(this, ""));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            this.setState({ dates: result }, () => {
                const { slider } = this;
                const { defaultIndex } = this.props.thisData.style;
                setTimeout(() => {
                    const disx = slider.parentNode.offsetWidth - slider.offsetWidth;
                    const sliceWidth = disx / (this.state.dates.length - 1);
                    const index = defaultIndex ? defaultIndex - 1 : 0;
                    const left = defaultIndex ? sliceWidth * (defaultIndex - 1) : 0;
                    this.setState({ index, left, disx, sliceWidth, });
                }, 0);
            });
            this.autoChangeSelected();
            if (resolve) {
                resolve(result);
            }
        }
    }

    autoChangeSelected() { }
    // 获取元素左侧到页面左侧的距离
    getOffsetLeft = (obj) => {
        let tmp = obj.offsetLeft;
        let node = obj.offsetParent;
        while (node != null) {
            tmp += node.offsetLeft;
            node = node.offsetParent;
        }
        return tmp;
    };
    // 点击滑块，鼠标按下，滑块可以手动移动
    handleSliderMouseDown = (e) => {
        document.addEventListener('mouseup', this.handleSliderMouseUp);
        document.addEventListener('mousemove', this.handleSliderMouseMove);
        clearInterval(this.state.keyer);
        // 如果定时器已经启动，此时让滑块处于中断状态
        if (this.state.keyer) this.setState({ isInterrupted: true });
        const offsetX = e.pageX - this.getOffsetLeft(e.target);
        this.setState({
            canMove: true,
            offsetX,
        });
    };
    // 点击滑块移动
    handleSliderMouseMove = (e) => {
        const { canMove, offsetX, disx, sliceWidth, } = this.state;
        if (!canMove) {
            return;
        };
        const { parentNode } = e.target;
        let left = e.pageX - offsetX - this.getOffsetLeft(parentNode);
        // 控制滑块的运动区间
        left = left <= 0 ? 0 : left >= disx ? disx : left;
        // 计算展示月份的index
        const index = Math.floor(left / sliceWidth);
        this.setState({ left, index });
    };
    // 鼠标抬起，滑块不能移动
    handleSliderMouseUp = () => {
        document.removeEventListener('mouseup', this.handleSliderMouseUp);
        document.removeEventListener('mousemove', this.handleSliderMouseMove);
        const { index, isInterrupted, } = this.state;
        if (isInterrupted) {
            this.setState({ flag: true });
            this.setKeyer();
        } else if (index !== 0) {
            this.setState({ flag: true });
        }
        this.setState({ canMove: false, isInterrupted: false },);
        this.fetchData();
    };
    // 交互数据
    fetchData = () => {
        const { dates, index } = this.state;
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, { id: dates[index] });
    }
    // 设置定时器
    setKeyer = () => {
        const keyer = setInterval(() => {
            let { left, flag, index, disx, sliceWidth } = this.state;
            if (flag) {
                left = sliceWidth * (index + 1);
                this.setState({ flag: false });
            } else {
                left += sliceWidth;
            }
            // 数值有1-2的误差，所以将left的范围调大2px
            left = left > disx + 4 ? 0 : left;
            const idx = Math.round(left / sliceWidth);
            this.setState({ left, index: idx }, () => {
                this.fetchData();
            });
        }, this.props.thisData.style.time || 2000);
        this.setState({ keyer });
    };
    // 清除定时器
    clearKeyer = () => {
        clearInterval(this.state.keyer);
        this.setState({ keyer: null });
    };
    // 开始暂停
    handleClickBtn = () => {
        this.state.keyer ? this.clearKeyer() : this.setKeyer();
    };
    render() {
        const { dates, index, keyer } = this.state;
        const { style } = this.props.thisData;
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
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    opacity,

                                }}
                            >
                                <div className={cssStyle.container} style={{ background: style.axisColor || '#0b3057', }}>
                                    <div
                                        className={cssStyle.slider}
                                        ref={(slider) => (this.slider = slider)}
                                        onMouseDown={this.handleSliderMouseDown}
                                        onMouseUp={this.handleSliderMouseUp}
                                        style={{
                                            left: `${this.state.left}px`,
                                            width: style.sliderWidth + '%' || '10%',
                                            fontSize: style.fontSize || '1.5em',
                                            color: style.fontColor || '#fff',
                                            background: style.sliderColor || '#054a78',
                                        }}
                                    >
                                        {dates[index]}
                                    </div>
                                </div>
                                <div
                                    className={cssStyle["start-btn"]}
                                    onClick={this.handleClickBtn}
                                    style={{
                                        fontSize: style.fontSize || '1.3em',
                                        color: style.fontColor || '#fff',
                                        background: style.btnColor || '#054a78',
                                    }}
                                >
                                    {keyer ? "暂停" : "开始"}
                                </div>
                            </div>
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}
