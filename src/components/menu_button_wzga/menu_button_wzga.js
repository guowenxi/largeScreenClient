import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./menu_button_wzga.module.css";
import { Motion, spring } from "react-motion";
import { getLinearBackground, getRadialBackground, getCompatibleSize} from "../../common/util";
import { createHashHistory } from 'history';
import {dataViewUrl, fileUrl} from "../../config";

import backg from "../menu_button_wzga/images/xialakuang.svg"
export default class MenuButtonWZGA extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], showDrop: 0 };
        this.keyParams = {};
        this.refreshTimer = [];
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
        this.setState({ opacity: 1 });
    }

    //主菜单点击切换页面
    goToPage(menu) {
        if (!menu.selected && menu.pageId) {
            const {style} = this.props.thisData;
            let websocketId;
            try{
                websocketId = window.external.GetWebSocketId();
            }catch (e) {}
            if(menu.changeType === 3 || (menu.changeType === 2 && style.websocketId && (websocketId || typeof(jsOBJ) != "undefined"))){
                let url;
                if(menu.contentType === 'other'){
                    url = menu.pageId;
                }else{
                    url = (dataViewUrl.indexOf('http') >= 0 ? '':window.location.origin) + dataViewUrl + '#/show/' + menu.pageId +'/'+ this.props.token;
                }
                if(menu.changeType === 3){
                    window.open(url);
                }else if(style.websocketId){
                    const sendData = {
                        "sceneId": "",
                        "height": 100,
                        "isIE": menu.coreType == null ? 1 : menu.coreType,
                        "exeName": "0",
                        "layoutType": "url",
                        "url": url,
                        "remark": 0,
                        "leftNum": 0,
                        "topNum": 0,
                        "width": 100
                    };
                    if(global.bodyWebsocket){
                        const {style} = this.props.thisData;
                        global.bodyWebsocket.send(JSON.stringify([{"parameter":JSON.stringify([sendData]),"targetId":(websocketId?websocketId:style.websocketId) + "_All_"}]));
                    }
                    setTimeout(()=>{
                        if(menu.contentType === 'other'){
                            window.location.href = menu.pageId;
                        }else{
                            createHashHistory().push('/show/' + menu.pageId +'/'+ this.props.token);
                        }
                    },100);
                }
            }else{
                if(menu.contentType === 'other'){
                    window.location.href = menu.pageId;
                }else{
                    createHashHistory().push('/show/' + menu.pageId +'/'+ this.props.token);
                }
            }
        }
    }

    judgeJump(menu) {
        if (menu.hasSub) {
            if (this.state.showDrop === 1) {
                this.setState({ showDrop: 0 })
            } else {
                this.setState({ showDrop: 1 })
            }
        } else {
            this.goToPage(menu)
        }
    }


    render() {
        const { style } = this.props.thisData;
        const lineWidth = getCompatibleSize(style.lineWidth);
        const fontSize = this.props.getCompatibleSize(style.fontSize, 'num');
        const lineBackground = style.lineGradientType !== 'linear' ? getRadialBackground(style.lineColor) : getLinearBackground(style.lineColor, style.lineAngle);
        const underlineBackground = getLinearBackground(style.boxColor, style.angle);
        let splitLine = {};
        if (style.flexDirection === 'row') {
            splitLine = { height: style.splitLineLong + '%', width: lineWidth, background: lineBackground, transform: 'skew(' + style.rotate + 'deg)' };
        } else {
            splitLine = { width: style.splitLineLong + '%', height: lineWidth, background: lineBackground, transform: 'skew(' + style.rotate + 'deg)' };
        }
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize: fontSize, justifyContent: 'space-between' }} >
                            {style.menuList && style.menuList.map((item, index) => {
                                if (item) {
                                    const returnDom = [];
                                    const menu = style.menuList[index];
                                    returnDom.push(
                                        <div className={cssStyle.item} key={index} style={{
                                            backgroundImage: this.props.thisData.sceneId === item.pageId ? 'url(' + fileUrl + '/download/' + style.backgroundImg + ')' : 'url(' + fileUrl + '/download/' + style.indexBackgroundImg + ')',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: '100% 100%',
                                            padding: style.padding
                                        }} onClick={this.judgeJump.bind(this, menu)}>
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <div className={cssStyle.item} key={index} >
                                                    <div className={cssStyle.item} style={{ color: this.props.thisData.sceneId === item.pageId ?(style.selectFontColor?style.selectFontColor:style.fontColor) : style.fontColor, opacity: this.props.thisData.sceneId === item.pageId ? '1' : '0.7', width: '100%', textDecoration: style.underlineShow === 1 && style.underlineStyle === 1 ? 'underline' : '' }}>
                                                        {item.name}
                                                        {item.hasSub && <div style={{
                                                            margin: '1vh',
                                                            borderTop: '5px solid rgb(18,159,169)',
                                                            borderRight: '5px solid transparent',
                                                            borderLeft: '5px solid transparent',
                                                        }} />}
                                                    </div>
                                                    {style.underlineShow===1&&<div className={cssStyle.underlineBox} style={{ background: underlineBackground, opacity: this.props.thisData.sceneId === item.pageId && style.underlineShow === 1 && style.underlineStyle === 2 ? '1' : '0' }} />}
                                                </div>
                                                {item.hasSub && this.state.showDrop === 1 && <div className={cssStyle.dropBox} style={{ backgroundImage: 'url(' + backg + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', margin: '0.5em -0.5em' }}>
                                                    {item.subList.map((item, index) => {
                                                        return (
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: style.fontColor,
                                                                opacity: this.props.thisData.sceneId === item.pageId ? '1' : '0.7',
                                                                justifyContent: 'center',
                                                                padding: '0.2em',
                                                                paddingTop: index === 0 ? '0.5em' : '0em'
                                                            }} className={cssStyle.drop} key={index} onClick={this.judgeJump.bind(this, item)} >{item.name}</div>
                                                        )
                                                    })}
                                                </div>}
                                            </div>
                                        </div>
                                    )
                                    if (index < style.menuList.length - 1 && style.splitLineLong) {
                                        returnDom.push(<div style={splitLine} key={index + 'splitLine'} />)
                                    }
                                    return returnDom;
                                } else {
                                    return <div className={`${cssStyle.item} ${cssStyle.flex}`} key={index} />;
                                }
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}