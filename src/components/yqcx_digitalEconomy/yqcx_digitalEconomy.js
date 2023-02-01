/* eslint-disable no-unused-vars */
import React from "react";
import ComponentBox from "../component_box";
import { getData } from "../../common/getDataUtil";
import { Motion, spring, } from "react-motion";
import { interactData } from "../../common/util";


import { getColumnNum } from "../../common/util";

import cssStyle from "./yqcx_digitalEconomy.module.css";


import SpringScrollbars from "../../common/springScrollbars";

export default class YQCXDigitalEconomy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: 0,
            dataList: [],
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
            this.setState({ dataList: result });
            if (resolve) {
                resolve(result);
            }
        }
    }
    // 获取标题的背景颜色
    getTitleBgColor() {
        const { titleBgColorType, titleBgColor1, titleBgColor2, gradientType, gradientDeg, } = this.props.thisData.style;
        const linear = titleBgColor2.map((item, index, arr) => `${item.color} ${item.stop}%${index < arr.length - 1 ? ',' : ''}`).join('');
        return titleBgColorType === 1 ? titleBgColor1 : `${gradientType === 1 ? 'linear' : 'radial'}-gradient(${gradientType === 1 ? gradientDeg + 'deg,' : ''}${linear})`;
    }
    render() {
        const { dataList } = this.state;
        const { style } = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        let itemStyle;
        if (dataList.length) {
            itemStyle = getColumnNum(style, dataList);
        }
        const titleBgColor = this.getTitleBgColor();
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
                            <div className={cssStyle.container} style={{ opacity, fontSize, }}>
                                {dataList.length > 0 && dataList.map((item, index) => {
                                    return (
                                        <div className={cssStyle.itemBox} key={index} style={{ ...itemStyle, backgroundColor: style.backgroundColor, }} >
                                            <div
                                                className={cssStyle.titleBox}
                                                style={{
                                                    fontSize: style.titleFontSize,
                                                    color: style.titleColor,
                                                    height: style.titleHeight || '8%',
                                                    background: titleBgColor,
                                                    fontWeight: style.titleFontWeight,
                                                }}
                                            >
                                                <span className={cssStyle.titleIcon}></span>
                                                {item[style.titleKey]}
                                            </div>
                                            <div
                                                className={cssStyle.subTitleBox}
                                                style={{
                                                    fontSize: style.subTitleFontSize,
                                                    color: style.subTitleColor,
                                                    fontWeight: style.subTitleFontWeight,
                                                }}
                                            >
                                                {item[style.subTitleKey]}
                                            </div>
                                            {
                                                item[style.imgListKey] &&
                                                <div
                                                    className={cssStyle.imgListBox}
                                                    style={{
                                                        position: 'relative',
                                                        width: style.imgListWidth || '70%',
                                                        height: style.imgListHeight || '40%',
                                                    }}
                                                >
                                                    {<SpringScrollbars
                                                        style={{ width: '100%', height: '100%' }}
                                                        autoscrolltype={'row'}
                                                        autoMove={style.imgListAutoMove}
                                                        interval={style.imgListInterval}
                                                        lineHeight={100 / item[style.imgListKey].length + '%'}
                                                    >
                                                        {typeof item[style.imgListKey] === 'string' ? JSON.parse(item[style.imgListKey]).map((imgItem, imgIndex) => {
                                                            return (
                                                                <img
                                                                    style={{ position: 'absolute', left: `${100 * imgIndex}%` }}
                                                                    src={imgItem} alt=""
                                                                    className={cssStyle.imgItem}
                                                                    key={imgIndex}
                                                                />
                                                            )
                                                        }) : item[style.imgListKey].map((imgItem, imgIndex) => {
                                                            return (
                                                                <img
                                                                    style={{ position: 'absolute', left: `${100 * imgIndex}%` }}
                                                                    src={imgItem} alt=""
                                                                    className={cssStyle.imgItem}
                                                                    key={imgIndex}
                                                                />
                                                            )
                                                        })}
                                                    </SpringScrollbars>}
                                                </div>
                                            }
                                            <div className={cssStyle.contentBox}>
                                                <SpringScrollbars>
                                                    <div
                                                        style={{
                                                            fontSize: style.contentFontSize,
                                                            color: style.contentColor,
                                                            lineHeight: style.contentLineHeight,
                                                        }}
                                                    >{item[style.contentKey]}</div>
                                                </SpringScrollbars>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}
