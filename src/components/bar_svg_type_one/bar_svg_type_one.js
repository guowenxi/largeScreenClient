import React from "react";
import ComponentBox from "../component_box";
import Util from '../../common/util';

import cssStyle from "./bar_svg_type_one.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";

import BarSvg from "./bar_svg";
import { Scrollbars } from "react-custom-scrollbars";
import { fileUrl } from "../../config";

export default class BarSvgTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], showIndex: 0, detail: {}, dateType: 1 };
        this.getData = getData.bind(this);
        this.keyParams = {};
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
                if (data.data.dateType) {
                    this.setState({ dateType: data.data.dateType });
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
            const { style } = this.props.thisData;
            const maxNum = Util.getMaxNum(result, style.numKey);
            this.setState({ resultData: result, maxNum });
            if (resolve) {
                resolve(result);
            }
        }
    }

    render() {
        const { style } = this.props.thisData;
        const { resultData, maxNum } = this.state;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize }} >
                            <Scrollbars>
                                <div className={cssStyle.divBox}>
                                    {resultData && resultData.map((item, index) => {
                                        const barWidth = item[style.numKey] * 100 / maxNum;
                                        let iconUrl = '';
                                        if (style.imageList && style.imageList.length > 0) {
                                            for (let i = 0; i < style.imageList.length; i++) {
                                                if (style.imageList[i].value + '' === item[style.typeKey] + '' && style.imageList[i].url) {
                                                    iconUrl = fileUrl + '/download/' + style.imageList[i].url;
                                                    break;
                                                }
                                            }
                                        }
                                        return (
                                            <div key={index} className={cssStyle.itemBox}>
                                                <img alt={''} className={cssStyle.img} src={iconUrl} />
                                                <div className={cssStyle.name}>{item[style.nameKey]}</div>
                                                <div className={cssStyle.barBox}>
                                                    <div className={`${cssStyle.num} ${barWidth > 10 ? cssStyle.numLeft : cssStyle.numRight}`} style={barWidth > 10 ? { right: (100 - barWidth) + '%' } : { left: `calc(${barWidth}% - 1px)` }}>{item[style.numKey]}</div>
                                                    <BarSvg className={cssStyle.bar} style={{ width: barWidth + '%' }} id={index} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Scrollbars>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}