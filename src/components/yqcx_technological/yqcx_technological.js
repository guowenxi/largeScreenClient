/* eslint-disable no-unused-vars */
import React from "react";
import ComponentBox from "../component_box";
import { getData } from "../../common/getDataUtil";
import { Motion, spring, } from "react-motion";
import { interactData } from "../../common/util";


import { getColumnNum } from "../../common/util";

import cssStyle from "./yqcx_technological.module.css";


import SpringScrollbars from "../../common/springScrollbars";

export default class YQCXTechnological extends React.Component {
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
        const { style } = this.props.thisData;
        if (result) {
            let dataList = result;
            if (result[0] && result[1] && style.contentListKey) {
                const [item1, item2, item3, item4] = result;
                const list1 = item1[style.contentListKey].splice(0, Math.floor(item1[style.contentListKey].length / 2));
                const list2 = item1[style.contentListKey];
                const list3 = item2[style.contentListKey].splice(0, Math.floor(item2[style.contentListKey].length / 2));
                const list4 = item2[style.contentListKey];
                dataList = [{ ...item1, [`${style.contentListKey}`]: [list1, list2] }, { ...item2, [`${style.contentListKey}`]: [list3, list4] }, item3, item4];
            }

            this.setState({ dataList: dataList });
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
                                {dataList.map((item, index) => {
                                    return (
                                        <div className={cssStyle.itemBox} key={index} style={{ ...itemStyle, backgroundColor: style.backgroundColor, }} >
                                            <div
                                                className={cssStyle.titleBox}
                                                style={{
                                                    fontSize: style.titleFontSize,
                                                    color: style.titleColor,
                                                    height: style.titleHeight || '15%',
                                                    background: titleBgColor,
                                                    fontWeight: style.titleFontWeight,
                                                }}
                                            >
                                                <span className={cssStyle.titleIcon}></span>
                                                {item[style.titleKey]}
                                            </div>

                                            <div
                                                className={cssStyle.contentBox}
                                                style={{
                                                    height: `calc(100% - ${style.titleHeight})`,
                                                    backgroundPositionX: index >= 2 ? '5%' : '30%',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {
                                                    (index <= 1 && item[style['contentListKey']]) &&
                                                    item[style['contentListKey']].map((subItem, subIndex) => {
                                                        return (
                                                            <div
                                                                key={subIndex}
                                                                className={`${cssStyle.doubleItem} ${subIndex === 0 ? cssStyle.doubleItemFirst : cssStyle.doubleItemSecond}`}
                                                            >
                                                                <SpringScrollbars
                                                                    style={{ width: '100%', height: '100%' }}
                                                                    autoscrolltype={'column'}
                                                                    autoMove={style.autoMove}
                                                                    interval={style.interval}
                                                                    lineHeight={subItem && 100 / subItem.length + '%'} >
                                                                    {
                                                                        subItem.length > 0 && subItem.map((grandItem, grandIndex) => {
                                                                            return (
                                                                                <div
                                                                                    key={grandIndex}
                                                                                    style={{
                                                                                        display: 'flex', width: '100%', height: '100%', padding: '0 2.5em',
                                                                                    }}
                                                                                >
                                                                                    {grandItem[style.prefixKey] && <p
                                                                                        style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'center',
                                                                                            fontSize: style.prefixFontSize,
                                                                                            color: style.prefixColor,
                                                                                            lineHeight: style.prefixLineHeight,
                                                                                            textAlign: 'center',
                                                                                        }}
                                                                                        className={cssStyle.noMargin}
                                                                                    >{grandItem[style.prefixKey]}</p>}
                                                                                    {grandItem[style.suffixKey] && <p
                                                                                        style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'center',
                                                                                            fontSize: style.suffixFontSize,
                                                                                            color: style.suffixColor,
                                                                                            lineHeight: style.suffixLineHeight,
                                                                                            textAlign: 'center',
                                                                                        }}
                                                                                        className={cssStyle.noMargin}
                                                                                    >{grandItem[style.suffixKey]}</p>}
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </SpringScrollbars>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {index > 1 && <div className={cssStyle.onlyItem}>
                                                    <SpringScrollbars
                                                        style={{ width: '100%', height: '100%' }}
                                                        autoscrolltype={'column'}
                                                        autoMove={style.autoMove}
                                                        interval={style.interval}
                                                        lineHeight={item[style.contentListKey] && 100 / item[style.contentListKey].length + '%'}
                                                    >
                                                        {
                                                            (item[style['contentListKey']]) &&
                                                            item[style['contentListKey']].map((subItem, subIndex) => {
                                                                return (
                                                                    <div
                                                                        key={subIndex}
                                                                        style={{
                                                                            display: 'flex', flexDirection: 'column', width: '100%', height: '100%', justifyContent: 'center',
                                                                        }}
                                                                    >
                                                                        {subItem[style.prefixKey] && <p
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                fontSize: style.prefixFontSize,
                                                                                color: style.prefixColor,
                                                                                lineHeight: style.prefixLineHeight,
                                                                                textAlign: 'center',
                                                                            }}
                                                                            className={cssStyle.noMargin}
                                                                        >{subItem[style.prefixKey]}</p>}
                                                                        {subItem[style.suffixKey] && <p
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                fontSize: style.suffixFontSize,
                                                                                color: style.suffixColor,
                                                                                lineHeight: style.suffixLineHeight,
                                                                                textAlign: 'center',
                                                                            }}
                                                                            className={cssStyle.noMargin}
                                                                        >{subItem[style.suffixKey]}</p>}
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </SpringScrollbars>
                                                </div>}
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
