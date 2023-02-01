import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./bar_type_three.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import {interactData,getSumByKey} from "../../common/util";

export default class BarTypeThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], selectedIndex: 0 };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if (this.props.thisData.firstLoad) {
                this.getData(this.callBack.bind(this, resolve))
            } else {
                this.callBack(resolve);
            }
        });
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
            case "changeSelected":
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
        if (resolve) {
            resolve(result);
        }
        if (result) {
            const sum = getSumByKey(result,'num');
            this.setState({ resultData: result,sum });
        }
    }

    render() {
        const { style } = this.props.thisData;
        const { resultData,sum } = this.state;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize, color:style.fontColor }} >
                            <div className={cssStyle.barBox}>
                                <div className={cssStyle.content}>
                                    {resultData.map((item,index)=>
                                        <div className={cssStyle.barItem} key={index} style={{width:item.num*100/sum+'%'}}>
                                            <div className={cssStyle.partNum}>{item.name+'：'+item.num}</div>
                                        </div>
                                    )}
                                    {resultData[0] && <div className={cssStyle.splitLine} style={{left:resultData[0].num*100/sum+'%'}} />}
                                </div>
                            </div>
                            <div className={cssStyle.perBox}>
                                <div>{style.perName}</div>
                                <div className={cssStyle.perNum}>{resultData[0] ? (resultData[0].num*100/sum).toFixed(2)+'%':''}</div>
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}