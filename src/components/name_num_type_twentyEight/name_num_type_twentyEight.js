import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_twentyEight.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";

import {getMaxNum,getSumByKey} from "../../common/util";

export default class NameNumTypeTwentyEight extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], selectedIndex: 0, show: false, showBox: false };
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
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
            const { style } = this.props.thisData;
            const numKey = style.numKey ? style.numKey : 'num';
            const maxPartNum = style.maxPartNum ? style.maxPartNum : 8;
            const maxNum = getMaxNum(result,numKey);
            const sum = getSumByKey(result,numKey);
            result.forEach((item)=>{
                item.partNum = Math.ceil(item[numKey]*maxPartNum/maxNum);
                item.per = (item[numKey]*100/sum).toFixed(2)+'%';
            });
            this.setState({ resultData: result,maxNum });
        }
    }

    render() {
        const { style } = this.props.thisData;
        const { resultData } = this.state;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const colorListLength = style.colorList ? style.colorList.length : 0;
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize, color:style.fontColor }} >
                            {resultData.map((item, index) => {
                                let partColor;
                                if(colorListLength){
                                    partColor = style.colorList[index%colorListLength];
                                }else{
                                    partColor = '#0ff';
                                }
                                let barParts = [];
                                for(let i = 0;i < item.partNum;i ++){
                                    barParts.push(<div key={'part'+index+i} className={cssStyle.barPart} style={{background:partColor}} />);
                                }
                                return (
                                    <div className={cssStyle.itemBox} key={index}>
                                        {barParts}
                                        <div>{item.per}</div>
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