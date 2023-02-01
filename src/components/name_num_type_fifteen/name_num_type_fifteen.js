import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_fifteen.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import { getCompatibleSize} from "../../common/util";

export default class NameNumTypeFifteen extends React.Component {
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
        const { resultData } = this.state
        const fontSize = getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity,fontSize:fontSize }} >
                            <div className={cssStyle.topImg}>
                                <div className={cssStyle.topNumBox}>
                                    <div style={{fontSize:style.numFontSize,color:style.numColor,fontWeight:style.numWeight}}>{resultData.length !== 0 ? resultData[0].num : ''}</div>
                                    <div style={{fontSize:style.comFontSize,color:style.comColor}}>{style.company}</div>
                                </div>
                                <div className={cssStyle.title} style={{ right:0,fontSize:style.titleFontSize,color:style.titleColor }}>{resultData.length !== 0 ? resultData[0].title : ''}</div>
                            </div>
                            <div className={cssStyle.bottomImg}>
                                <div className={cssStyle.bottomNumBox}>
                                    <div style={{fontSize:style.numFontSize,color:style.numColor,fontWeight:style.numWeight}}>{resultData.length !== 0 ? resultData[1].num : ''}</div>
                                    <div style={{fontSize:style.comFontSize,color:style.comColor}}>{style.company}</div>
                                </div>
                                <div className={cssStyle.title} style={{  left: 0,fontSize:style.titleFontSize,color:style.titleColor}}>{resultData.length !== 0 ? resultData[1].title : ''}</div>
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}