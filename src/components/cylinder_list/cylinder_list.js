/* eslint-disable no-unused-vars */
import React from "react";
import ComponentBox from "../component_box";
import { getData } from "../../common/getDataUtil";
import { Motion, spring, } from "react-motion";
import { interactData } from "../../common/util";

import cssStyle from "./cylinder_list.module.css";

import SvgCylinder from "./components/svg_cylinder";

export default class CylinderList extends React.Component {
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
            result.forEach((item) => {
                switch (item.name) {
                    case '差': {
                        item.type = 'red';
                        break;
                    }
                    case '一般': {
                        item.type = 'yellow';
                        break;
                    }
                    case '良': {
                        item.type = 'blue';
                        break;
                    }
                    case '优': {
                        item.type = 'green';
                        break;
                    }
                    default: {
                        break;
                    }
                }
            })
            this.setState({ dataList: result });
            if (resolve) {
                resolve(result);
            }
        }
    }
    getMax() {
        const { style } = this.props.thisData;
        const { dataList } = this.state;
        return style.max || (dataList.length && dataList.map(item => item.num).reduce((prev, next) => Math.max(prev, next))) || dataList.length;
    }
    render() {
        const { dataList } = this.state;
        const { style } = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
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
                                {
                                    dataList.length > 0 && dataList.map(({ type, name, num }, index, arr) => {
                                        return (
                                            <div key={index} style={{ width: '15%', height: '100%' }} className={cssStyle.itemBox}>
                                                <div className={cssStyle.contentBox}>
                                                    <p
                                                        className={`${cssStyle.noMargin} ${cssStyle.number}`}
                                                        style={{ fontSize: style.numberFontSize, color: style.numberColor, }}
                                                    >{num}</p>
                                                    <div className={cssStyle.svgBox}>
                                                        <SvgCylinder type={type} heightRadio={num / this.getMax()} />
                                                    </div>
                                                </div>
                                                <p
                                                    className={`${cssStyle.noMargin} ${cssStyle.word}`}
                                                    style={{ fontSize: style.wordFontSize, color: style.wordColor,  }}
                                                >{name}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}
