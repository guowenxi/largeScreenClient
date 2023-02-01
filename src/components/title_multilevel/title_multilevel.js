import React from "react";

import ComponentBox from "../component_box";
import cssStyle from './title_multilevel.module.css';
import { fileUrl } from "../../config";
import { Motion, spring } from "react-motion";
import { interactData } from "../../common/util";
import RectTypeFive from "../../common/svg/rectTypeFive"
import RectTypeSix from "../../common/svg/rectTypeSix"

import Rect from "./underLine";

export default class TitleMultilevel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {}, opacity: 0 };
        this.keyParams = {};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.setState({ opacity: 1 });
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
    }

    buttonClick() {
        const { dataSources } = this.props.thisData;
        if (dataSources.interact && dataSources.interact.length > 0) {
            this.interactData(dataSources.interact);
        }
    }

    render() {
        const { style, position } = this.props.thisData;
        return (
            <ComponentBox id={this.props.thisData.id} thisData={this.props.thisData} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)}
                style={{
                    ...this.props.style
                }}>
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <ul className={cssStyle.title} style={{
                            opacity
                        }}>
                            {style && style.map((item, index) => {
                                const fontSize = this.props.getCompatibleSize(item.fontSize);
                                const lineHeight = this.props.getCompatibleSize(item.lineHeight);
                                const imgMargin = this.props.getCompatibleSize(item.imgMargin);
                                let background = '';
                                if (item.backgroundType && item.backgroundType === 1) {
                                    background = item.backgroundColor
                                } else if (item.backgroundType === 2) {
                                    background = 'url(' + fileUrl + '/download/' + item.backgroundImg + ') 100% 100% no-repeat'
                                }
                                return (
                                    <div style={{ width: '100%', height: '100%' }} key="index">
                                        {item.backgroundType === 3 &&
                                            <RectTypeFive style={{ width: '100%', height: '100%', position: 'absolute', left: '0', top: '0' }} />
                                        }
                                        {item.backgroundType === 4 &&
                                            <RectTypeSix style={{ width: '100%', height: '100%', position: 'absolute', left: '0', top: '0' }} />
                                        }
                                        <li key={index} style={{
                                            height: lineHeight,
                                            fontSize: fontSize,
                                            fontWeight: item.fontWeight,
                                            color: item.color,
                                            background: background
                                        }}>
                                            {item.titleImg && <img className={cssStyle.titleImg}
                                                src={fileUrl + '/download/' + item.titleImg} alt=""
                                                style={{
                                                    display: item.showTitleImg ? 'inline-block' : 'none',
                                                    marginRight: imgMargin,
                                                    position: 'relative',
                                                    left: item.imgLeft,
                                                    top: item.imgTop,
                                                    width: this.props.getCompatibleSize(item.imgWidth),
                                                    height: this.props.getCompatibleSize(item.imgHeight),
                                                    //  width: this.props.getCompatibleSize(item.fontSize),
                                                }} />}
                                            <div className={cssStyle.titleText} style={{
                                                width: item.textWidth,
                                                borderBottomColor: item.lineStyle === 1 && item.showLine ? item.lineColor : '',
                                                borderBottomWidth: item.lineStyle === 1 && item.showLine ? item.lineWidth : '',
                                                borderBottomStyle: item.lineStyle === 1 && item.showLine ? 'solid' : '',
                                                textAlign: 'center',
                                                padding: item.textPadding,
                                                flexDirection: 'column',
                                                position:item.backgroundType===3||item.backgroundType===4?'absolute':''
                                            }}>
                                                {item.title}
                                                {item.showLine && <Rect id={'draw' + this.props.thisData.id + index} key={position.height} graphicalStyle={item} />}
                                            </div>
                                            <div className={cssStyle.button} style={{ color: item.buttonColor, fontSize: this.props.getCompatibleSize(item.buttonSize) }} onClick={this.buttonClick.bind(this)}>{item.buttonName}</div>
                                        </li>
                                    </div>

                                );
                            })}
                            <li>{style.hasAction}</li>
                        </ul>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}