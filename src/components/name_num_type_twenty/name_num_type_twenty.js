import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_twenty.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import { getColumnNum } from "../../common/util";
import { fileUrl } from "../../config";

import CircleTypeThree from "../../common/svg/circleTypeThree"

export default class NameNumTypeTwenty extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], selectedIndex: 0, show: false, showBox: false };
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
        let sum = 0;
        const numKey = style.numKey;
        resultData.forEach((item) => {
            sum += parseInt(item[numKey])
        });
        let itemStyle;
        if (resultData) {
            itemStyle = getColumnNum(style, resultData);
        }
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize }} >
                            {resultData.map((item, index) => {
                                let titleContent;
                                if(style.titleType === 1){
                                    titleContent = <div style={{color:style.nameColor,lineHeight:style.lineHeightName+'em',fontSize:style.nameFontSize+'em'}}>{item[style.nameKey]}</div>
                                }else{
                                    const thisPartStyle = style.coverImgList[index];
                                    let icon;
                                    if (thisPartStyle) {
                                        icon = thisPartStyle.normalImg;
                                    }
                                    titleContent = <img alt="" src={icon ? fileUrl + '/download/' + icon:''} style={{width:style.imgWidth,height:style.imgHeight,top:style.top,left:style.left,position:'relative'}} />;
                                }

                                if(item){
                                    return (
                                        <div style={{ ...itemStyle, position: 'relative' }} key={index}>
                                            <CircleTypeThree style={{ width: '100%', height: '100%', transform: index % 2 === 0 ? 'rotate(180deg)' : 'rotate(0deg)' }} allStyle={style} sum={sum} num={item[numKey]} numbers={index} />
                                            {
                                                index % 2 === 0 &&
                                                <div className={cssStyle.inBox}>
                                                    <div className={cssStyle.topBox}>
                                                        {titleContent}
                                                    </div>
                                                    <div className={cssStyle.bottomBox} style={{color:style.textColor,lineHeight:style.lineHeight+'em',fontSize:style.numFontSize+'em'}} >{item[numKey]}</div>
                                                </div>
                                            }
                                            {
                                                index % 2 !== 0 &&
                                                <div className={cssStyle.inBox}>
                                                    <div className={cssStyle.bottomBox}>
                                                        {titleContent}
                                                    </div>
                                                    <div className={cssStyle.topBox} style={{color:style.textColor,lineHeight:style.lineHeight+'em',fontSize:style.numFontSize+'em'}}>{item[numKey]}</div>
                                                </div>
                                            }
                                        </div>
                                    )
                                }else{
                                    return <div style={{ ...itemStyle, position: 'relative' }} key={index}/>;
                                }
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}