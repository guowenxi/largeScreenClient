import React from "react";
import cssStyle from "./numberShowTypeOne.module.css";
import {getSpecialStyle} from "../../../common/nameNumUtil";

import bottomIcon from "./images/huan.svg";
import {getLinearBackground} from "../../../common/util";

export default class NumberShowTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const {height,styleData,data} = this.props;
        let thisColor = getSpecialStyle(styleData.styleList,data,2);
        let barBg;
        if(thisColor){
            barBg = getLinearBackground(thisColor.bgColorList, thisColor.gradientAngle);
        }else{
            thisColor = {};
        }
        return (
            <div style={this.props.style} className={cssStyle.box} onClick={this.props.onClick}>
                <div className={cssStyle.rectBox}>
                    <div className={cssStyle.rect} style={{backgroundColor:thisColor.color}}/>
                    <span>{data}</span>
                </div>
                <div className={cssStyle.barBox}>
                    <div className={cssStyle.barTop} style={{backgroundColor:thisColor.color}}/>
                    <div className={cssStyle.bar} style={{height:height+'em',background:barBg}}/>
                </div>
                <img alt='' src={bottomIcon} className={cssStyle.bottomIcon}/>
            </div>
        );
    }
}