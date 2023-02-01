import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_twentyFour.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import one from "./imges/one.png"
import two from "./imges/two.png"
import three from "./imges/three.png"
import four from "./imges/four.png"
import five from "./imges/five.png"
import six from "./imges/six.png"
import up from "./imges/up.png"
import down from "./imges/down.png"
import champion from "./imges/champion.png"
import SpringScrollbars from "../../common/springScrollbars";

export default class NameNumTypeTwentyFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [] };
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
        this.iconList = [one, two, three, four, five, six]
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
        const { resultData } = this.state
        const { style } = this.props.thisData
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <SpringScrollbars style={{ width: '100%', height: '100%' }} autoscrolltype={'row'} autoMove={style.autoMove} lineHeight={100/(resultData.length+1)+'%'} interval={style.interval}>
                            <div className={cssStyle.box} style={{ opacity, fontSize: fontSize }} >
                                {resultData && resultData.map((item, index) => {
                                    return (
                                        <div key={index} className={cssStyle.combination} style={{ left: index * 16.7 + '%', top: (index) % 2 === 0 ? '0%' : '50%' }}>
                                            <img alt="" src={this.iconList[index % 6]} className={cssStyle.imgStyle} style={{ top: (index) % 2 === 0 ? '92%' : '-8%' }} />
                                            {resultData.length===index+1&&<img alt="" src={this.iconList[resultData.length % 6]} className={cssStyle.imgStyle} style={{left:'57.5%' ,top: (index) % 2 === 0 ? '92%' : '-8%' }} />}
                                            <img alt="" src={(index) % 2 === 0 ? up : down} className={cssStyle.upDownStyle} style={{ left: (index) % 2 === 0 ? '15%' : '18%', top: (index) % 2 === 0 ? '5%' : '-5%' }} />
                                            <img alt="" src={champion} className={cssStyle.champion} style={{ left: (index) % 2 === 0 ? '17%' : '20%', top: (index) % 2 === 0 ? '40%' : '62%' }} />
                                            <div className={cssStyle.time} style={{top:(index)%2===0?'2%':'24%',fontSize:style.timeFontSize,lineHeight:style.timeLineHeight+'em',color:style.timeFontColor,justifyContent:style.timeJustifyContent,alignItems:style.timeAlignItems}}>{item[style.time]}</div>
                                            <div className={cssStyle.text} style={{ top: (index) % 2 === 0 ? '27%' : '49%', left: (index) % 2 === 0 ? '30%' : '33%', fontSize: style.timeFontSize }}>
                                                {item[style.title] && <div className={cssStyle.title} style={{ fontSize: style.titleFontSize, lineHeight: style.titleLineHeight+'em', color: style.titleFontColor, justifyContent: style.titleJustifyContent, alignItems: style.titleAlignItems }}>{item[style.title]}</div>}
                                                {item[style.sub] && <div className={cssStyle.title} style={{ fontSize: style.subFontSize, lineHeight: style.subLineHeight+'em', color: style.subFontColor, justifyContent: style.subJustifyContent, alignItems: style.subAlignItems }}>{item[style.sub]}</div>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </SpringScrollbars>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}