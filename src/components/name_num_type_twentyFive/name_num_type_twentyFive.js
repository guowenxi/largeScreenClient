import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_twentyFive.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import { getColumnNum } from "../../common/util";
import SpringScrollbars from "../../common/springScrollbars";
import firstGzz from "./images/firstGzz.png"
import secondGzz from "./images/secondGzz.png"
import firstYjz from "./images/firstYjz.png"
import secondYjz from "./images/secondYjz.png"
export default class NameNumTypeTwentyFive extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [] };
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
        this.gzzList = [firstGzz, secondGzz]
        this.yjzList = [firstYjz, secondYjz]
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
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        let itemStyle;
        if (resultData) {
            itemStyle = getColumnNum(style, resultData);
        }
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity,fontSize:fontSize }} >
                            {resultData && resultData.map((item, index) => {
                                return (
                                    <div style={{ ...itemStyle }} className={cssStyle.divBox} key={index}>
                                        <div className={cssStyle.title} style={{ fontSize: style.titleFontSize, color: style.titleColor }}>{item[style.titleKey]}</div>
                                        <div className={cssStyle.contentBox}>
                                            <SpringScrollbars style={{width:'100%',height:'100%'}} autoscrolltype={index % 2 === 0 ?'row':'column'} autoMove={style.autoMove} lineHeight={item[style.groupKey]&&100/item[style.groupKey].length+'%'} interval={style.interval}>
                                                {item[style.groupKey] && item[style.groupKey].map((nameItem, nameIndex) => {
                                                    return (
                                                        <div className={cssStyle.itemBox} style={{ width: index % 2 === 0 ? '50%' : '100%', left: item[style.groupKey].length===1?index % 2 === 0 ?'25%':'0%':index%2===0?50 * nameIndex + '%':0,top:index%2===0?0:100*nameIndex+'%' }} key={nameIndex}>
                                                            <div className={cssStyle.imgBox} style={{width:index % 2 === 0 ?'100%':'30%',height:index % 2 === 0 ?'50%':'80%',left:index % 2 === 0 ?'0%':'5%',top:index % 2 === 0 ?'10%':'10%'}}>
                                                                <img alt="" src={index % 2 === 0 ? this.gzzList[nameIndex % 2] : this.yjzList[nameIndex % 2]} />
                                                            </div>
                                                            <div className={cssStyle.textBox} style={{width:item[style.groupKey].length===1?index % 2 === 0 ?'100%':'65%':index % 2 === 0 ? '60%' : '60%',height:index % 2 === 0 ? '40%' : '100%',left:item[style.groupKey].length===1?index % 2 === 0 ?'0%':'35%':index % 2 === 0 ?'20%':'38%',top:index % 2 === 0 ?'60%':'0%'}}>
                                                                <div style={{lineHeight:style.fatherLineHeight+'em',color:style.fatherColor,fontSize:style.fatherFontSize}}>{nameItem[style.fatherKey]}</div>
                                                                <div style={{lineHeight:style.childLineHeight+'em',color:style.childColor,fontSize:style.childFontSize}}>{nameItem[style.childKey]}</div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </SpringScrollbars>
                                        </div>
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