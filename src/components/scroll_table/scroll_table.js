import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./scroll_table.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import { getCompatibleSize, getTypeImage } from "../../common/util";
import { Scrollbars } from "react-custom-scrollbars";

import {fileUrl} from "../../config";

export default class ScrollTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [] };
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

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.thisData.updateTime !== this.props.thisData.updateTime) {
            //组件数据源变更时刷新数据
            this.getData();
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

    render() {
        const { style } = this.props.thisData;
        const { resultData } = this.state;
        const fontSize = getCompatibleSize(style.fontSize);
        const contentStyle = {
            fontSize: style.contentFont+'em',
            color: style.contentColor,
            lineHeight: style.contentLineHeight+'em',
        };
        const titleKey = style.titleKey ? style.titleKey : 'title';
        const numKey = style.numKey ? style.numKey : 'content';
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <Scrollbars >
                            <div className={cssStyle.box} style={{ opacity, fontSize: fontSize }} >
                                {resultData.map((item, index) => {
                                    let titleBg;
                                    if(style.titleImg && style.titleImgKey){
                                        titleBg = getTypeImage(style.titleImg,item[style.titleImgKey]);
                                    }
                                    return (
                                        <div key={index} className={cssStyle.itemBox} style={{marginBottom: style.gap+'em'}}>
                                            <div className={cssStyle.titleBox} style={{width:style.titleWidth+'em',marginRight:style.marginRight+'em'}}>
                                                <div className={cssStyle.titleStyle} style={{
                                                    fontSize: style.titleFont+'em',
                                                    color: style.titleColor,
                                                    height:style.titleHeight+'em',
                                                    backgroundImage:titleBg ? `url(${fileUrl + '/download/' + titleBg})` : ''
                                                }}>
                                                    {item[titleKey]}
                                                </div>
                                            </div>
                                            <div className={cssStyle.contentStyle} style={contentStyle}>{item[numKey]}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Scrollbars>
                    }
                </Motion>
            </ComponentBox >
        );
    }
}