import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./warning_type_one.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import ErrorIcon from "./images/zhuyi.svg"
import { Icon, Tooltip } from "antd";
import { interactData } from "../../common/util";

export default class WarningTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], deleteId: [] };
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
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
        if (result && result.map) {
            const { style } = this.props.thisData;
            if (style.carryId) {
                const dataKey = style.dataKey ? style.dataKey : 'id';
                const sendKey = style.sendKey ? style.sendKey : 'id';
                let { resultData } = this.state;
                if (style.orderBy === 2) {
                    resultData = result.concat(resultData);
                    if (result[0]) {
                        this.keyParams[sendKey] = result[0][dataKey];
                    }
                } else {
                    resultData = resultData.concat(result);
                    if (result[result.length - 1]) {
                        this.keyParams[sendKey] = result[result.length - 1][dataKey];
                    }
                }
                this.setState({ resultData });
            } else {
                this.setState({ resultData: result });
            }
            if (resolve) {
                resolve(result);
            }
        }
    }

    delete(item) {
        let { deleteId } = this.state;
        deleteId.push(item.id);
        this.setState({ deleteId });
        const { interact } = this.props.thisData.dataSources;
        if (interact) {
            this.interactData(interact, item);
        }
    }

    render() {
        const { resultData, deleteId } = this.state;
        const { style } = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden', pointerEvents: 'none' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize }} >
                            {resultData && resultData.map((item, index) => {
                                return (
                                    <Motion style={{ height: spring(deleteId.indexOf(item.id) < 0 ? 4 : 0) }} key={index}>
                                        {({ height }) =>
                                            <div className={cssStyle.warningBox} style={{ height: height + 'em', marginBottom: deleteId.indexOf(item.id) < 0 ? '0.5em' : '0px' }}>
                                                <img alt="" src={ErrorIcon} className={cssStyle.imgStyle} />
                                                <div className={cssStyle.centerPart}>
                                                    <div className={cssStyle.partBox}>
                                                        <Tooltip title={item[style.partKey]}>
                                                            <span className={cssStyle.spanContent} style={{ padding: item[style.partKey] ? '0 1em 0 0' : '0' }}>{item[style.partKey]}</span>
                                                        </Tooltip>
                                                        <span>{item[style.timeKey]}</span>
                                                    </div>
                                                    <div className={cssStyle.contentBox}>
                                                        <span>{item[style.contentKey]}</span>
                                                    </div>
                                                </div>
                                                <div className={cssStyle.iconStyle}>
                                                    <Icon type="close" style={{ fontSiz: fontSize, color: 'white', pointerEvents: 'auto' }} onClick={this.delete.bind(this, item)} />
                                                </div>
                                            </div>
                                        }
                                    </Motion>
                                )
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}