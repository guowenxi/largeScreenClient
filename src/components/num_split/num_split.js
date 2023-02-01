import React from "react";
import ComponentBox from "../component_box";
import cssStyle from './num_split.module.css';
import { getColumnNum, getLinearBackground, getCompatibleSize } from '../../common/util';
import { getData } from "../../common/getDataUtil";
import { fileUrl } from "../../config";

export default class NumSplit extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {}, resultData: [] };
        this.getData = getData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => { this.getData(this.callBack.bind(this, resolve)) });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity: 1 });
        })
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey":
                this.keyParams[data.keyName] = data.data;
                this.reGetData();
                break;
            case "animateOn":
                this.animateOn();
                break;
            default:
                break;
        }
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

    getNumList(number, numLength, itemBackground, style, backgroundImageUrl) {
        if (number == null) {
            return null;
        }
        const numSingle = number.toString().split("");
        const sub = numLength - numSingle.length;
        if (sub > 0) {
            for (let i = 0; i < sub; i++) {
                numSingle.unshift('0');
            }
        }
        const showLength = sub > 0 ? numLength : numSingle.length;
        let backgroundImage = {};
        if(backgroundImageUrl){
            backgroundImage = {
                backgroundImage: "url(" + (fileUrl + '/download/' + backgroundImageUrl) + ")",
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
            };
        }
        return numSingle.map((item, index) => {
            const dom = [<div className={cssStyle.numSingle} key={index} style={{
                background: itemBackground, 
                padding: style.padding, 
                margin: style.margin,
                ...backgroundImage
            }}>{item}</div>];
            if ((showLength - index - 1) % 3 === 0 && index < numLength - 1) {
                dom.push(<div className={cssStyle.split} key={index + ','} style={{ color: style.symbolColor }}>,</div>)
            }
            return dom;
        });
    }

    render() {
        const { style } = this.props.thisData;
        let resultData = this.state.resultData.slice();
        const itemStyle = getColumnNum(style, resultData);
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const numLength = style.numLength ? style.numLength : 9;
        const itemBackground = getLinearBackground(style.boxColor, style.angle);
        if(style.icon == null){
            style.icon = {};
        }
        const { icon } = style;
        const iconWidth = getCompatibleSize(icon.width);
        const iconHeight = getCompatibleSize(icon.height);
        const marginRight = getCompatibleSize(icon.marginRight);
        return (
            <ComponentBox receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} id={this.props.thisData.id} style={this.props.style} reGetData={this.reGetData.bind(this)}>
                <div className={cssStyle.box} style={{ fontSize, color: style.color }}>
                    {resultData.map((item, index) => {
                        let iconUrl;
                        if (icon.iconKey && icon.iconList.length > 0) {
                            icon.iconList.forEach((iconItem) => {
                                if (iconItem.num == item[icon.iconKey]) {//eslint-disable-line
                                    iconUrl = iconItem.icon;
                                }
                            });
                        }
                        let backgroundImageUrl;
                        if(style.showBackgroundPic){
                            if(style.bgImgType === 2 && style.bgImgKey && style.bgImgList){
                                style.bgImgList.forEach((iconItem) => {
                                    if (iconItem.num == item[style.bgImgKey]) {//eslint-disable-line
                                        backgroundImageUrl = iconItem.icon;
                                    }
                                });
                            }else if(style.bgImgType !== 2 && style.backgroundPic){
                                backgroundImageUrl = style.backgroundPic;
                            }
                        }
                        if (item) {
                            return (
                                <div key={index} style={itemStyle} className={cssStyle.allBox}>
                                    {icon.iconKey && <img alt="" src={iconUrl ? fileUrl + '/download/' + iconUrl : ''} className={cssStyle.icon} style={{display:style.iconShow?'block':'none', width: iconWidth, height: iconHeight, left: icon.left, top: icon.top,marginRight:marginRight}} />}
                                    <div className={cssStyle.itemBox} key={index}>
                                        {this.getNumList(item[style.key], numLength, itemBackground, style, backgroundImageUrl)}
                                    </div>
                                </div>
                            );
                        } else {
                            return <div className={`${cssStyle.item} ${cssStyle.flex}`} style={{ ...itemStyle }} key={index} />;
                        }
                    })}
                </div>
            </ComponentBox>
        );
    }
}