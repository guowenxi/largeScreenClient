import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_seventeen.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import {getColumnNum, getLinearBackground} from "../../common/util";

import backg from "../name_num_type_seventeen/images/wsyj.svg";

export default class NameNumTypeSeventeen extends React.Component {
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
        const { style} = this.props.thisData;
        let resultData = this.state.resultData.slice();
        const fontSize = this.props.getCompatibleSize(style.fontSize, 'num');
        let itemStyle;
        if (resultData) {
            itemStyle = getColumnNum(style, resultData);
        }
        const titleStyle={
            fontSize:style.titleSize+'em',
            color:style.titleColor,
            width:style.titleWidth+'em',
            borderBottomWidth:style.underLineWidth,
            borderBottomStyle:'solid',
            borderBottomColor:style.underLineColor,
            textAlign:'center'
        };
        const numStyle={
            position: 'absolute',
            fontSize:style.numSize+'em',
            color:style.numColor,
            lineHeight:style.numLineHeight,
        };
        if(style.contentList){
            style.contentList.forEach((item) => {
                item.background = getLinearBackground(item.boxColor, item.angle);
            });
        }
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize: fontSize }} >
                            {resultData.map((item, index) => {
                                return (
                                    <div style={{ ...itemStyle, display: 'flex', flexDirection: 'row' }} key={index} className={cssStyle.lineBox}>
                                        <div style={titleStyle} className={cssStyle.title}>{item[style.titleKey]}</div>
                                        <div className={cssStyle.countBox}>
                                            <img alt=""  src={backg} />
                                            <div style={numStyle} className={cssStyle.countNum}>{item[style.countKey]}</div>
                                        </div>
                                        {/*{item.partNum.length>0&&item.partNum.map((partItem,partIndex) => {*/}
                                        {/*    return (*/}
                                        {/*        <div key={partIndex} style={{backgroundImage:'linear-gradient(to top right,'+style.backgroundColor[partIndex][0]+','+style.backgroundColor[partIndex][1]+')'}} className={cssStyle.textBackground}>*/}
                                        {/*            <div className={cssStyle.text} style={{color:'white'}}>{partItem}</div>*/}
                                        {/*        </div>*/}
                                        {/*    )*/}
                                        {/*})}*/}
                                        {style.contentList && style.contentList.map((content,contentIndex) =>
                                            <div key={contentIndex} style={{background:content.background,fontSize:style.contentSize+'em',color:style.contentColor}} className={cssStyle.textBackground}>
                                                <div className={cssStyle.text} style={{color:'white'}}>{item[content.key]}</div>
                                            </div>
                                        )}
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