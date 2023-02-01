import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./svg_map_point.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";

import { fileUrl } from "../../config";
import { getCompatibleSize } from "../../common/util";
import RectTypeOne from "../../common/svg/rectTypeOne";
import { interactData } from "../../common/util";

export default class SvgMapPoint extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], showIndex: 0, detail: {}, dateType: 1, hideType: [], selectIndex: null };
        this.getData = getData.bind(this);
        this.keyParams = {};
        this.interactData = interactData.bind(this);
        this.pointBoxPosition = {
            'shangcheng': { width: '94.5%', height: '91.6%', left: '3.8%', top: '0.4%' },
            'longwan': { width: '86.5%', height: '78%', left: '9.5%', top: '8.3%' }
        };
        this.legendTheme = { '3': cssStyle.themeThree };
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
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (this.detailTimer) {
            clearTimeout(this.detailTimer);
        }
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
        this.setState({ resultData: [] });
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            this.setState({ resultData: result });
            if (resolve) {
                resolve(result);
            }
        }
    }

    getFitItem(iconList, value) {
        for (let i = 0; i < iconList.length; i++) {
            if (value == iconList[i].value) {//eslint-disable-line
                return iconList[i];
            }
        }
        return null;
    }

    getIconBgColor(item) {
        const { style } = this.props.thisData;
        if (style.iconBgType === 1) {
            return style.iconBgColor;
        } else if (style.iconBgType === 2 && style.iconBgList && style.dependKey) {
            for (let i = 0; i < style.iconBgList.length; i++) {
                if (style.subType === 1) {
                    if (item[style.dependKey] + '' === style.iconBgList[i].num + '') {
                        return style.iconBgList[i].color;
                    }
                } else {
                    if (item[style.dependKey] >= style.iconBgList[i].more && item[style.dependKey] < style.iconBgList[i].less) {
                        return style.iconBgList[i].color;
                    }
                }
            }
            return 'none';
        } else {
            return 'none';
        }
    }

    //打点
    getPoint() {
        const { style } = this.props.thisData;
        const { resultData, hideType } = this.state;
        const { minX, minY, maxX, maxY, iconList, typeKey, selectIconList } = style;
        const selectIconWidth = getCompatibleSize(style.selectIconWidth);
        const selectIconHeight = getCompatibleSize(style.selectIconHeight);
        const selectIconSize = getCompatibleSize(style.selectIconSize);
        if (iconList && iconList.length > 0) {
            if (style.iconType === 1) {
                const iconWidth = getCompatibleSize(style.iconWidth);
                const iconHeight = getCompatibleSize(style.iconHeight);
                return resultData.map((item, index) => {
                    if (hideType.indexOf("" + item[typeKey]) >= 0) {
                        return null;
                    }
                    const fitOne = this.getFitItem(iconList, item[typeKey]);
                    const fitTwo = selectIconList && selectIconList.length > 0 && this.getFitItem(selectIconList, item[typeKey]);
                    const left = (item.x - minX) * 100 / (maxX - minX) + '%';
                    const bottom = (item.y - minY) * 100 / (maxY - minY) + '%';
                    if (this.state.selectIndex === index && style.selectchange === 1) {
                        if (style.selectIconType === 1 && fitTwo) {
                            return <img alt={''} src={fileUrl + '/download/' + fitTwo.img} style={{ left, bottom, width: selectIconWidth, height: selectIconHeight, padding: style.iconPadding, background: this.getIconBgColor(item), borderRadius: style.iconRadius }} key={index} className={cssStyle.point} onClick={this.pointClick.bind(this, item, index)} />;
                        } else if (style.selectIconType === 2 && fitTwo) {
                            return <div style={{ left, bottom, width: selectIconSize, height: selectIconSize, backgroundColor: fitTwo.color }} key={index} className={cssStyle.pointTwo} onClick={this.pointClick.bind(this, item, index)} />;
                        } else {
                            return null
                        }
                    } else {
                        if (fitOne) {
                            return <img alt={''} src={fileUrl + '/download/' + fitOne.img} style={{ left, bottom, width: iconWidth, height: iconHeight, padding: style.iconPadding, background: this.getIconBgColor(item), borderRadius: style.iconRadius }} key={index} className={cssStyle.point} onClick={this.pointClick.bind(this, item, index)} />;
                        } else {
                            return null
                        }
                    }
                });
            } else if (style.iconType === 2) {
                const iconSize = getCompatibleSize(style.iconSize);
                return resultData.map((item, index) => {
                    if (hideType.indexOf("" + item[typeKey]) >= 0) {
                        return null;
                    }
                    const fitOne = this.getFitItem(iconList, item[typeKey]);
                    const fitTwo = selectIconList && selectIconList.length > 0 && this.getFitItem(selectIconList, item[typeKey]);
                    const left = (item.x - minX) * 100 / (maxX - minX) + '%';
                    const bottom = (item.y - minY) * 100 / (maxY - minY) + '%';
                    if (this.state.selectIndex === index && style.selectchange === 1) {
                        if (style.selectIconType === 1 && fitTwo) {
                            return <img alt={''} src={fileUrl + '/download/' + fitTwo.img} style={{ left, bottom, width: selectIconWidth, height: selectIconHeight }} key={index} className={cssStyle.point} onClick={this.pointClick.bind(this, item, index)} />;
                        } else if (style.selectIconType === 2 && fitTwo) {
                            return <div style={{ left, bottom, width: selectIconSize, height: selectIconSize, backgroundColor: fitTwo.color }} key={index} className={cssStyle.pointTwo} onClick={this.pointClick.bind(this, item, index)} />;
                        } else {
                            return null
                        }
                    } else {
                        if (fitOne) {
                            return <div style={{ left, bottom, width: iconSize, height: iconSize, backgroundColor: fitOne.color }} key={index} className={cssStyle.pointTwo} onClick={this.pointClick.bind(this, item, index)} />;
                        } else {
                            return null;
                        }
                    }
                });
            }
        }
    }

    changeTypeShow(value) {
        const { hideType } = this.state;
        const index = hideType.indexOf(value);
        if (index >= 0) {
            hideType.splice(index, 1);
        } else {
            hideType.push(value);
        }
        this.setState({ hideType });
    }

    pointClick(item, index) {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
        this.setState({ selectIndex: index })
    }

    render() {
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const area = style.area ? style.area : 'datong';
        // const mapBG = require('./images/' + area + '.svg');
        const pointStyle = {
            width: style.pointWidth,
            height: style.pointHeight,
            left: style.pointLeft,
            top: style.pointTop
        };
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity }} >
                            <div className={cssStyle.mapBox} style={{ width: style.width, height: style.height, left: style.left, top: style.top }}>
                                {
                                    area !== 'yueqing' &&
                                    <img
                                        alt={''}
                                        src={`./images/svgMapPoint/${area}.${'longwanTwo,wenzhou,'.indexOf(area+',') >= 0 ? 'png' : 'svg'}`}
                                        className={cssStyle.mapBG}
                                    />
                                }
                                <div className={cssStyle.pointBox} style={{ ...this.pointBoxPosition[area], ...pointStyle }} >
                                    {this.getPoint()}
                                </div>
                            </div>
                            {style.legendShow && (
                                <div className={`${cssStyle.legendBox} ${this.legendTheme[style.legendBox]}`} style={{ fontSize, width: style.widthLegend, height: style.heightLegend, left: style.leftLegend, right: style.rightLegend, top: style.topLegend, bottom: style.bottomLegend }}>
                                    {style.legendBox === 2 && <RectTypeOne className={cssStyle.legendBg} />}
                                    {style.titleHeight ? <div className={cssStyle.legendTitle} style={{ height: style.titleHeight + 'em', color: style.titleColor, fontSize: style.titleFontSize + 'em' }}>{style.title}</div> : ''}
                                    {style.titleHeight ? <div className={cssStyle.splitLine} /> : ''}
                                    <div className={cssStyle.legendContentBox} style={{ height: style.titleHeight ? `calc(100% - ${style.titleHeight}em - 4px)` : '100%' }}>
                                        {style.iconList && style.iconList.map((item, index) =>
                                            <div key={index} className={cssStyle.legendItem} onClick={this.changeTypeShow.bind(this, item.value)}>
                                                {style.iconType === 1 && <img alt={''} src={fileUrl + '/download/' + item.img} className={cssStyle.legendIcon} />}
                                                {style.iconType === 2 && <div className={cssStyle.legendIcon} style={{ backgroundColor: this.state.hideType.indexOf(item.value) >= 0 ? 'gray' : item.color }} />}
                                                <div className={cssStyle.legendName} style={{ fontSize: style.contentFontSize + 'em', color: this.state.hideType.indexOf(item.value) >= 0 ? 'gray' : style.contentColor }}>{item.name}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}