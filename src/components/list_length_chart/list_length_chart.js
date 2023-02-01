/* eslint-disable no-unused-vars */
import React from "react";
import ComponentBox from "../component_box";
import { getData } from "../../common/getDataUtil";
import { Motion, spring, StaggeredMotion } from "react-motion";

import { Scrollbars } from 'react-custom-scrollbars';
import { interactData } from "../../common/util";

import cssStyle from "./list_length_chart.module.css";
import SpringScrollbars from "../../common/springScrollbars";

export default class ListLengthChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: 0,
            // 数据list
            dataList: [],
            // 鼠标点上去透明度变化的行的index
            opacityIndex: 0,
            // list中的最大num
            max: 10,
            keyer: null,
            opacityList: [],
            flag: false,
        };
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.keyParams = {};
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
            this.setState({ dataList: result }, () => {
                if (this.state.dataList.length) {
                    const { dataList, opacityList } = this.state;
                    const max = this.getMax(dataList);
                    dataList.forEach(() => {
                        opacityList.push({ opacity: 0 });
                    })
                    this.setState({ max, opacityList, });
                    this.setKeyer();
                }
            });
            if (resolve) {
                resolve(result);
            }
        }
    }
    // 获取list中最大的num
    getMax = (dataList) => {
        return dataList.map(item => item.num).reduce((prev, next) => Math.max(prev, next));
    }
    // 获取中间块的宽度，= 每一行的宽度 - 左右标签的宽度（包含左右标签部分的对中间的距离）
    getCenterWidth = () => {
        const { left, right, container } = this;
        if (!(left && right && container)) {
            return 0;
        }
        return container.offsetWidth - left.offsetWidth - right.offsetWidth;
    }
    // 获取中间色块的颜色
    getBackgroundColor = () => {
        const { bgColorType, backgroundColor1, backgroundColor2, gradientType, gradientDeg, } = this.props.thisData.style;
        const linear = backgroundColor2.map((item, index, arr) => `${item.color} ${item.stop}%${index < arr.length - 1 ? ',' : ''}`).join('');
        return bgColorType === 1 ? backgroundColor1 : `${gradientType === 1 ? 'linear' : 'radial'}-gradient(${gradientType === 1 ? gradientDeg + 'deg,' : ''}${linear})`;
    }
    // 设置定时器
    setKeyer = () => {
        clearInterval(this.state.keyer);
        const keyer = setInterval(() => {
            let { opacityIndex, dataList } = this.state;
            opacityIndex++;
            opacityIndex = opacityIndex === dataList.length ? 0 : opacityIndex;
            this.setState({ opacityIndex });
        }, this.props.thisData.style.time || 2500);
        this.setState({ keyer });
    }
    clearKeyer = () => {
        clearInterval(this.state.keyer);
        this.setState({ keyer: null });
    }
    handleEnterCenter = (index) => {
        this.clearKeyer();
        this.setState({ opacityIndex: index, flag: false, });
    }

    handleLeaveCenter = () => {
        this.setState({ flag: true, }, () => {
            if (this.state.flag) {
                this.setKeyer();
            }
        });
    }
    render() {
        const { dataList, opacityIndex, } = this.state;
        const { style } = this.props.thisData;
        const backgroundColor = this.getBackgroundColor();
        const max = style.max || this.state.max;
        const centerWidth = this.getCenterWidth();
        const num = style.rowNum || (this.state.dataList ? this.state.dataList.length : 0);
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
                            <SpringScrollbars style={{ width: '100%', height: '100%', }} autoscrolltype={'column'} autoMove={true} lineHeight={100/(this.state.dataList ? this.state.dataList.length : num)+'%'} interval={style.time}>
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute",
                                        opacity,
                                    }}
                                    className={cssStyle.list}
                                    ref={container => this.container = container}
                                >
                                    {this.state.opacityList.length && <StaggeredMotion
                                        defaultStyles={[...this.state.opacityList]}
                                        styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
                                            return i === 0
                                                ? { opacity: spring(1) }
                                                : { opacity: spring(prevInterpolatedStyles[i - 1].opacity) }
                                        })}>
                                        {interpolatingStyles =>
                                            <>
                                                {interpolatingStyles.map((styles, index) => {
                                                    return (
                                                        <div
                                                            style={{
                                                                padding: `${style.rowGap ? style.rowGap / 20 : 0}% 0`,
                                                                height: num ? `${100 / num}%` : '15%',
                                                                opacity: styles.opacity
                                                            }}
                                                            key={index}
                                                            className={cssStyle['list-item']}
                                                            ref={a => this.a = a}
                                                        >
                                                            <div
                                                                className={cssStyle.left}
                                                                style={{
                                                                    color: opacityIndex !== index ? style.leftLabel.fontColor : style.leftLabel.selectedFontColor,
                                                                    fontSize: style.leftLabel.fontSize || '2vh',
                                                                    paddingRight: style.leftLabel.toCenterDistance ? style.leftLabel.toCenterDistance / 10 + '%' : 0,
                                                                }}
                                                                ref={left => this.left = left}
                                                            >{dataList[index].name}</div>
                                                            <div
                                                                className={cssStyle.center}
                                                                style={{
                                                                    width: centerWidth ? (dataList[index].num / max) * centerWidth : '100%',
                                                                    height: style.backgroundHeight ? style.backgroundHeight + '%' : '100%',
                                                                    background: backgroundColor,
                                                                    opacity: opacityIndex === index ? 1 : 0.5,
                                                                }}
                                                                onMouseEnter={() => this.handleEnterCenter(index)}
                                                                onMouseLeave={this.handleLeaveCenter}
                                                            ></div>
                                                            <div
                                                                className={cssStyle.right}
                                                                style={{
                                                                    color: opacityIndex !== index ? style.rightLabel.fontColor : style.rightLabel.selectedFontColor,
                                                                    fontSize: style.rightLabel.fontSize || '3vh',
                                                                    fontWeight: style.rightLabel.fontWeight || 400,
                                                                    paddingLeft: style.rightLabel.toCenterDistance ? style.rightLabel.toCenterDistance / 10 + '%' : 0,
                                                                }}
                                                                ref={right => this.right = right}
                                                            >{dataList[index].num}</div>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        }
                                    </StaggeredMotion>}
                                </div>
                            </SpringScrollbars>
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}
