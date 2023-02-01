import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_eighteen.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import { getCompatibleSize, getColumnNum, getTypeImage, getLinearBackground } from "../../common/util";
import Util from "../../common/util";
import { fileUrl } from "../../config";

export default class NameNumTypeEighteen extends React.Component {
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
        let itemStyle;
        if (resultData) {
            itemStyle = getColumnNum(style, resultData);
        }
        const fontSize = getCompatibleSize(style.fontSize, 'num');
        const numKey = style.numKey;
        let sum = 0;
        if (resultData) {
            sum = Util.getMaxNum(resultData, numKey)
        }
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize: fontSize, flexDirection: style.flexDirection }} >
                            {resultData.map((item,index) => {
                                let width = (item.num / sum) * 100 + '%';
                                return (
                                    <div style={{ ...itemStyle, display: 'flex' }} key={index}>
                                        {style.contentList && style.contentList.map((contentItem, contentIndex) => {
                                            let titleBg;
                                            if (contentItem.titleImg && contentItem.titleImgKey) {
                                                titleBg = getTypeImage(contentItem.titleImg, item[contentItem.titleImgKey]);
                                            }
                                            contentItem.background = getLinearBackground(contentItem.boxColor, contentItem.angle);
                                            let showLinear;
                                            if(contentItem.boxColor&&contentItem.boxColor.length!==0){
                                                showLinear=true
                                            }else{
                                                showLinear=false
                                            }
                                            return (
                                                <div key={contentIndex} style={{ height: '100%', width: contentItem.width, display: 'flex' }}>
                                                    <img alt="" src={titleBg ? fileUrl + '/download/' + titleBg : ''} style={{ width: contentItem.imgWidth, height: '100%' }} />
                                                    <div className={cssStyle.centerBox} style={{ width: contentItem.chartWidth?contentItem.chartWidth:contentItem.textWidth,height:'100%',flexDirection:showLinear?'column':'row' }}>
                                                        <div className={cssStyle.numStyle} style={{
                                                            fontSize: contentItem.textFont + 'em',
                                                            color: contentItem.textColor,
                                                            justifyContent: contentItem.textPosition,
                                                            width: contentItem.textWidth,
                                                            display:contentItem.numKey?'flex':'none',
                                                            height:'100%',
                                                            padding:contentItem.textPadding,
                                                        }}>
                                                            {item[contentItem.numKey]}
                                                        </div>
                                                        <div style={{ height: '100%', width: contentItem.background ? width : '', background: contentItem.background,display:showLinear?'block':'none' }}></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}