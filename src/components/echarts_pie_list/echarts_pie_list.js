import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./echarts_pie_list.module.css";
import { getData } from "../../common/getDataUtil";
import { getColumnNum, getCompatibleSize } from "../../common/util";
import { Motion, spring } from "react-motion";
import { fileUrl } from "../../config";

import SvgRing from "../../common/svgRing";
export default class echartsPieList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, data: [] };
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
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
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then((data) => {
            this.setState({ data })
            this.setState({ opacity: 1 });
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "changeUrl":

                break;
            case "deleteKey":
                this.keyParams = {};
                this.reGetData();
                break;
            default:
                break;
        }
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            this.setState({ data: result });
            if (resolve) {
                resolve(result);
            }
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    getStyle(index, style) {
        return style.series[index]
    }

    getPer(item, sum, style, arr) {
        let per = 0
        if (style.numType === 2) {
            if (('' + item.value).indexOf('%') > 0) {
                per = parseFloat(item.value) / 100
                return per
            } else {
                let max = arr[0]
                arr.forEach(item => max = item > max ? item : max)
                per = parseFloat(item.value) / (max*1.5)
                return per
            }
        } else {
            if (('' + item.value).indexOf('%') > 0) {
                per = parseFloat(item.value) / 100
                return per
            } else if (item.value === sum) {
                per = parseFloat(item.value) / (parseFloat(item.value) * 1.2)
                return per
            } else {
                per = parseFloat(item.value) / sum
                return per
            }
        }
    }

    render() {
        let resultData = this.state.data;
        const { style } = this.props.thisData;
        let itemStyle;
        if (resultData.length !== 0) {
            if (resultData.length === 1) {
                itemStyle = { width: '100%', height: '100%' }
            } else {
                itemStyle = getColumnNum(style, resultData);
            }
        }
        const titleStyle = {
            position: 'relative',
            display: style.titleShow ? 'flex' : 'none',
            left: style.titleLeft,
            top: style.titleTop,
            fontSize: getCompatibleSize(style.titleSize),
            color: style.titleColor,
            lineHeight: style.titleHeight,
            justifyContent: 'center'
        }
        const numStyle = {
            display: style.numShow ? 'block' : 'none',
            fontSize: style.numSize,
            color: style.numColor,
            left: style.numLeft,
            top: style.numTop,
        }
        let sum = 0
        let arr = []
        resultData.forEach((item) => {
            sum += parseFloat(item.value)
            arr.push(item.value)
        })
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity }}>
                            {resultData.map((item, index) => {
                                if (item) {
                                    return (
                                        <div style={{ ...itemStyle, position: 'relative', backgroundImage: 'url(' + fileUrl + '/download/' + style.backgroundImg + ')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }} key={index}>
                                            <img alt="" src={fileUrl + '/download/' + style.series[index].icon} style={{
                                                display: style.series[index].imgShow ? 'block' : 'none',
                                                position: 'absolute',
                                                width: style.series[index].titleImgWidth,
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%,-50%)',
                                            }} />
                                            <SvgRing per={this.getPer(item, sum, style, arr)} ringStyle={this.getStyle(index, style)} style={{ position: 'absolute', width: '100%', height: '100%' }}></SvgRing>
                                            <div style={titleStyle}>{item.name}</div>
                                            <div style={numStyle} className={cssStyle.num}>{item.value}</div>
                                        </div>
                                    )
                                } else {
                                    return <div className={`${cssStyle.item} ${cssStyle.flex}`} style={{ ...itemStyle }} key={index} />;
                                }
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}