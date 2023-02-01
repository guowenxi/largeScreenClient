import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./page_type_one.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import {Icon} from "antd";
import {interactData} from "../../common/util";

export default class PageTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], selectedIndex: 0 };
        this.keyParams = {};
        this.refreshTimer = [];
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
                for (let key in data.data) {
                    const subData = data.data[key];
                    const { resultData } = this.state;
                    for (let i = 0; i < resultData.length; i++) {
                        if (subData + '' === resultData[i][key] + '') {
                            if(data.isInteract !== 2){
                                this.chanePage(i);
                            }else{
                                this.setState({ selectedIndex: i });
                            }
                            break;
                        }
                    }
                    break;
                }
                break;
            default:
                break;
        }
    }

    chanePage(index){
        const { resultData } = this.state;
        if(index >= 0 && index < resultData.length){
            const { interact } = this.props.thisData.dataSources;
            this.interactData(interact, resultData[index]);
            this.setState({ selectedIndex: index });
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
            this.setState({ resultData: result });
        }
    }

    render() {
        const { style } = this.props.thisData;
        const { resultData,selectedIndex } = this.state;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden',pointerEvents: 'none' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize, color:style.fontColor }} >
                            <div className={`${cssStyle.buttonBox} ${selectedIndex === 0 ? cssStyle.none:''}`} onClick={this.chanePage.bind(this,selectedIndex-1)} >
                                <Icon type="left" className={cssStyle.icon} />
                            </div>
                            <div className={`${cssStyle.buttonBox} ${selectedIndex === resultData.length-1 ? cssStyle.none:''}`} onClick={this.chanePage.bind(this,selectedIndex+1)} >
                                <Icon type="right" className={cssStyle.icon} />
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}