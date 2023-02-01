import React from "react";
import ComponentBox from "../component_box";
import { Motion, spring } from "react-motion";

import cssStyle from "./menu_select_list.module.css";
import Emitter from "../../common/eventBus";
import { getLinearBackground, getCompatibleSize } from "../../common/util";
import { fileUrl } from "../../config";
import SelectSvgOne from "../../common/svg/rectTypeSix"
import UnSelectSvgOne from "../../common/svg/rectTypeSeven"


export default class NameNumTypeFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, selectedIndex: props.thisData.style.selectedIndex - 1 };
    }

    //组件加载触发函数
    componentDidMount() {
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.thisData.showStatus !== this.props.thisData.showStatus && this.props.thisData.showStatus) {
            const { style } = this.props.thisData;
            const { selectedIndex } = this.state;
            this.menuClick(style.menuList[selectedIndex]);
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
            case "dataInterchange":
                const index = data.data.id;
                if (index != null) {
                    if(data.data.notClick){
                        this.setState({ selectedIndex: index });
                    }else{
                        const { style } = this.props.thisData;
                        this.menuClick(style.menuList[index], index);
                    }
                }
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.setState({ opacity: 1 });
    }

    menuClick(menuItem, index) {
        if (menuItem == null||menuItem.clickInteraction) {
            return;
        }
        if (index != null) {
            this.setState({ selectedIndex: index });
        }
        if (this.props.thisData.dataSources.interact && this.props.thisData.dataSources.interact.length > 0) {
            this.props.thisData.dataSources.interact.forEach((item) => {
                let sendData = {};
                switch (item.type) {
                    case 1:
                        sendData[item.keyName] = menuItem.value;
                        Emitter.emit(item.receiveId, { type: 'changeKey', data: sendData });
                        break;
                    case 2:
                        break;
                    case 3:
                        sendData[item.keyName] = menuItem.value;
                        Emitter.emit(item.receiveId, { type: 'showComponent', data: sendData });
                        break;
                    case 6:
                        sendData.mapShow = menuItem.mapShow;
                        sendData.mapHide = menuItem.mapHide;
                        Emitter.emit(item.receiveId, { type: 'changeLayerShow', data: sendData });
                        break;
                    default:
                        break
                }
            });
        }
        if ((menuItem.showList && menuItem.showList.length > 0) || (menuItem.hideList && menuItem.hideList.length > 0)) {
            Emitter.emit('app_box', {
                type: 'changeLayerShowStatus',
                data: { showList: menuItem.showList, hideList: menuItem.hideList }
            });
        }
    }

    render() {
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const itemBackground = style.backgroundColorType !== 2 ? style.backgroundColor : getLinearBackground(style.boxColor, style.angle);
        const selectedBackground = style.selectedBackgroundColorType !== 2 ? style.selectedBackgroundColor : getLinearBackground(style.selectedBoxColor, style.selectedAngle);
        const shadowLeft = style.outShadowLeft ? this.props.getCompatibleSize(style.outShadowLeft) : 0;
        const shadowTop = style.outShadowTop ? this.props.getCompatibleSize(style.outShadowTop) : 0;
        const blur = style.outBlur ? this.props.getCompatibleSize(style.outBlur) : '10px';
        const spread = style.outSpread ? this.props.getCompatibleSize(style.outSpread) : '5px';
        const imgWidth = this.props.getCompatibleSize(style.imgWidth);
        const imgHeight = this.props.getCompatibleSize(style.imgHeight);
        let underlinHeight = '';
        if (fontSize.indexOf('vh') > 0) {
            underlinHeight = parseInt(fontSize) / 2 + 'vh';
        } else {
            underlinHeight = parseInt(fontSize) / 2 + 'px';
        }
        let underlineBackg = '';
        if (style.underlineType === 1) {
            if (style.underlineBackground) {
                underlineBackg = style.underlineBackground
            } else {
                underlineBackg = 'rgb(0,181,253)'
            }
        } else if (style.underlineType === 2) {
            underlineBackg = getLinearBackground(style.underlineBoxColor, style.underlineAngle);
        } else {
            underlineBackg = 'rgb(0,181,253)'
        }
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ borderRadius:style.bgRadius,flexDirection: style.flexDirection, color: style.fontColor, fontSize: fontSize, backgroundColor: style.allBackgroundColor, opacity, boxShadow: shadowLeft + ' ' + shadowTop + ' ' + blur + ' ' + spread + ' ' + style.outShadowColor, padding: style.boxPadding }}>
                            {style.menuList && style.menuList.map((item, index) =>
                                <div key={index} onClick={this.menuClick.bind(this, item, index)}
                                    className={`${cssStyle.item} ${item.clickInteraction?'':this.state.selectedIndex === index?'':cssStyle.selected}`}
                                    style={{
                                        color: this.state.selectedIndex === index ? style.selectedColor : '',
                                        textDecorationColor: this.state.selectedIndex === index ? style.selectedColor : '',
                                        background: this.state.selectedIndex === index ? selectedBackground : itemBackground,
                                        textDecoration: style.allLine === 2 ? this.state.selectedIndex === index && style.lineStyle === 1 && style.showUnderLine ? 'underline' : 'none' : style.lineStyle === 1 && style.showUnderLine ? 'underline' : 'none',
                                        minWidth: style.minWidth + 'em',
                                        padding: style.padding,
                                        height: style.height,
                                        borderRadius: style.borderRadius,
                                        flexDirection: style.flexDirection,
                                        borderWidth: style.selectBorderWidth && this.state.selectedIndex === index ? style.selectBorderWidth : style.borderWidth,
                                        borderStyle: style.selectBorderStyle && this.state.selectedIndex === index ? style.selectBorderStyle : style.borderStyle,
                                        borderColor: style.selectBorderColor && this.state.selectedIndex === index ? style.selectBorderColor : style.borderColor,
                                        backgroundImage: this.state.selectedIndex === index ? (style.indexBackgroundImg ? 'url(' + fileUrl + '/download/' + style.indexBackgroundImg + ')':'') : (style.backgroundImg ? 'url(' + fileUrl + '/download/' + style.backgroundImg + ')':''),
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '100% 100%',
                                        position:'relative'
                                    }}
                                >
                                    <div className={cssStyle.item} style={{ flexDirection: 'column' }}>
                                        {style.svgType===1&&this.state.selectedIndex === index&&<SelectSvgOne   style={{width:'100%',height: '100%', position: 'absolute',left:'0',top:'0' }} />}
                                        {style.svgType===1&&this.state.selectedIndex !== index&&<UnSelectSvgOne style={{width:'100%',height: '100%', position: 'absolute',left:'0',top:'0' }} />}
                                        <div style={{ flexDirection: style.inFlexDirection, padding: style.textPadding,position:style.svgType===1?'relative':'',display:'flex',justifyContent:'center',alignItems:'center' }}>
                                            {item.showImg === 1 && <img alt="" src={this.state.selectedIndex === index ? fileUrl + '/download/' + item.afterImg : fileUrl + '/download/' + item.beforeImg} className={cssStyle.icon} style={{ display: item.showImg === 1 ? 'block' : 'none', width: imgWidth, height: imgHeight, top: style.top, left: style.left }} />}
                                            {item.name}
                                        </div>
                                        {style.showUnderLine && <div style={{ width: style.underlineWidth ? style.underlineWidth : fontSize, height: style.underlineHeight ? style.underlineHeight : underlinHeight, background: style.allLine === 2 ? (this.state.selectedIndex === index && style.lineStyle === 2 ? underlineBackg : 'rgba(0,0,0,0)') : (style.lineStyle === 2 ? underlineBackg : 'rgba(0,0,0,0)'), borderRadius: style.underlineRadius ? style.underlineRadius : '5px' }} />}
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}