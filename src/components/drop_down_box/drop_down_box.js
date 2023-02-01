import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./drop_down_box.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import { fileUrl } from "../../config";
import { getCompatibleSize, interactData } from "../../common/util";
import { Scrollbars } from "react-custom-scrollbars";
import ItemPart from "./itemPart";
import {Icon} from "antd";

// import up from "../drop_down_box/images/up.png"
// import down from "../drop_down_box/images/down.png"

export default class DropDownBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], show: false, showBox: false, value: '', selectedName: [], selectedId: [] };
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.selectedIndex = -1;
        this.firstGetData = true;
        this.themeList = ['', cssStyle.selectedBoxThemeTwo];
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if (this.props.thisData.firstLoad) {
                this.getData(this.callBack.bind(this, resolve));
            } else {
                this.callBack(resolve);
            }
        });
        // this.p = new Promise((resolve) => { this.getData(this.callBack.bind(this, resolve)) });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.thisData.updateTime !== this.props.thisData.updateTime) {
            //组件数据源变更时刷新数据
            this.getData(this.callBack.bind(this, ''));
        }
        const { style } = this.props.thisData;
        if (style.showAutoClick) {
            if (prevProps.thisData.showStatus !== this.props.thisData.showStatus && this.props.thisData.showStatus) {
                let sendData = {};
                if (style.selectMode === 2) {
                    let { selectedId, selectedName } = this.state;
                    if (style.sendDataFormat === 2) {
                        sendData.id = JSON.stringify(selectedId);
                        sendData.name = JSON.stringify(selectedName);
                    } else {
                        sendData.id = selectedId.join(',');
                        sendData.name = selectedName.join(',');
                    }
                } else {
                    const { resultData } = this.state;
                    sendData = resultData[this.selectedIndex];
                }
                const { interact } = this.props.thisData.dataSources;
                this.interactData(interact, sendData);
            }
        }
    }

    //接收事件消息
    receiveMessage(data) {
        const { style } = this.props.thisData;
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey":
                if(data.data && data.data.defaultSelectId){
                    this.defaultSelectId = data.data.defaultSelectId;
                    delete data.data.defaultSelectId;
                }
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "showComponent":
                break;
            case "changeSelected":
                this.setState({ selectedName: [], selectedId: [], value: '' },()=>{
                    const {resultData} = this.state;
                    let selectedIndex = -1;
                    for(let i = 0;i < resultData.length;i ++){
                        if(data.data.subType === 'name'){
                            if(resultData[i].name === data.data.name){
                                selectedIndex = i;
                                break;
                            }
                        }else{
                            if(resultData[i].id+'' === data.data.id+''){
                                selectedIndex = i;
                                break;
                            }
                        }
                    }
                    if(selectedIndex >= 0){
                        this.dropClick(resultData[selectedIndex],false,selectedIndex,data.isInteract);
                    }
                });
                break;
            case "cancelSelect":
                //取消选择
                if (style.selectMode === 2) {
                    this.setState({ selectedName: [], selectedId: [] });
                } else {
                    this.setState({ value: '' });
                }
                if (!style.cancelSelectNotInteract) {
                    const { interact } = this.props.thisData.dataSources;
                    this.interactData(interact, {});
                }
                if(style.clearOption){
                    this.setState({ resultData: [] });
                }
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity: 1 });
        });
    }

    //重新获取数据
    reGetData() {
        const { style } = this.props.thisData;
        if (style.allName) {
            this.setState({ resultData: [{ name: style.allName }] });
        }else{
            this.setState({ resultData: [] });
        }
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve(result);
        }
        if (result) {
            const { style } = this.props.thisData;
            let resultList = [];
            if ((style.idKey && style.idKey !== 'id') || (style.nameKey && style.nameKey !== 'name')) {
                result.forEach((item) => {
                    let itemData = {};
                    if (style.idKey) {
                        itemData.id = item[style.idKey];
                    } else {
                        itemData.id = item.id;
                    }
                    if (style.nameKey) {
                        itemData.name = item[style.nameKey];
                    } else {
                        itemData.name = item.name;
                    }
                    resultList.push(itemData);
                });
            } else {
                resultList = result;
            }
            if (style.allName) {
                resultList.unshift({ name: style.allName });
            }
            this.setState({ resultData: resultList });
            if (!style.cancelDefaultSelect) {
                if (this.firstGetData || this.defaultSelectId) {
                    let defaultIndex = 0;
                    if(!this.defaultSelectId){
                        if (style.defaultSelectKey) {
                            for (let i = 0; i < resultList.length; i++) {
                                if (resultList[i][style.defaultSelectKey] + '' === style.defaultSelect + '') {
                                    defaultIndex = i;
                                    break;
                                }
                            }
                        }
                    }else{
                        for (let i = 0; i < resultList.length; i++) {
                            if (resultList[i].id+'' === this.defaultSelectId+'') {
                                defaultIndex = i;
                                break;
                            }
                        }
                        this.defaultSelectId = null;
                    }
                    if (resultList[defaultIndex]) {
                        this.selectedIndex = defaultIndex;
                        const { firstSend } = this.props.thisData;
                        if (firstSend) {
                            this.dropClick(resultList[defaultIndex],false,defaultIndex);
                        } else {
                            const { style } = this.props.thisData;
                            if (style.selectMode === 2) {
                                this.setState({ selectedId: [resultList[defaultIndex].id], selectedName: [resultList[defaultIndex].name], showBox: false });
                            } else {
                                this.setState({ value: resultList[defaultIndex].name, showBox: false });
                            }
                        }
                    }
                    this.firstGetData = false;
                } else {
                    if (style.selectMode === 2) {
                        this.setState({ selectedId: [], selectedName: [], showBox: false });
                        setTimeout(() => { this.dropClick(resultList[0],false,0); });
                    } else {
                        let sameIndex = 0;
                        for(let i = 0;i < resultList.length;i ++){
                            if(resultList[i].id === this.selectedId){
                                sameIndex = i;
                                break;
                            }
                        }
                        this.dropClick(resultList[sameIndex],false,sameIndex);
                    }
                }
            }
            if(this.selectedIndex === -1){
                this.selectedIndex = 0;
            }
            this.autoChange();
        }
    }

    itemClick() {
        if (this.state.showBox === false) {
            this.setState({ showBox: true })
        } else {
            this.setState({ showBox: false })
        }
    }

    dropClick(dropItem, isAuto, index, isInteract) {
        if (dropItem) {
            const { style } = this.props.thisData;
            let sendData = {};
            if (style.selectMode === 2) {
                let { selectedId, selectedName } = this.state;
                const selectedIndex = selectedId.indexOf(dropItem.id);
                if (selectedIndex >= 0) {
                    selectedId.splice(selectedIndex, 1);
                    selectedName.splice(selectedIndex, 1);
                } else {
                    selectedId.push(dropItem.id);
                    selectedName.push(dropItem.name);
                }
                if (style.sendDataFormat === 2) {
                    sendData.id = JSON.stringify(selectedId);
                    sendData.name = JSON.stringify(selectedName);
                } else {
                    sendData.id = selectedId.join(',');
                    sendData.name = selectedName.join(',');
                }
                this.setState({ selectedId, selectedName });
            } else {
                this.setState({ value: dropItem.name, showBox: false });
                sendData = dropItem;
            }
            if(index === 0 && style.allName && !style.allNameSend){
                sendData = {};
            }
            if(isInteract !== 2){
                const { interact } = this.props.thisData.dataSources;
                this.interactData(interact, sendData);
            }
            if (isAuto === false) {
                //若为手动点击
                this.selectedId = dropItem.id;
                this.selectedIndex = index;
                this.timeDelay = true;
            }
        }
    }

    autoChange() {
        const { style } = this.props.thisData;
        if (style.autoTime) {
            const timeDelay = this.timeDelay && style.delayTime ? style.delayTime : 0;
            this.timer = setTimeout(() => {
                this.selectedIndex++;
                const { resultData } = this.state;
                if (this.selectedIndex >= resultData.length) {
                    this.selectedIndex = 0;
                }
                this.dropClick(resultData[this.selectedIndex], true,this.selectedIndex);
                this.timeDelay = false;
                this.autoChange();
            }, style.autoTime + timeDelay);
        }
    }

    changeAutoStart(flag) {
        if (flag) {
            this.autoChange();
        } else {
            clearTimeout(this.timer);
        }
    }

    leave() {
        this.setState({ showBox: false });
    }

    render() {
        let resultData = this.state.resultData;
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.allFontSize);
        let textStyle = {
            color: style.fontColor,
        };
        if (style.theme !== 1) {
            textStyle.width = style.imgWidth ? `calc(100% - ${style.imgHeight}em)` : '100%';
        }
        const box = {
            backgroundColor: style.color,
            borderWidth: style.borderWidth,
            borderStyle: 'solid',
            borderColor: style.borderColor,
            borderRadius: style.borderRadius,
            padding: style.padding,
            height: style.height + 'em'
        };
        const dropStyle = {
            color: style.dropColor,
            height: style.lineHeight + 'em',
            lineHeight: style.lineHeight + 'em',
            padding: style.padding
        };
        const imgStyle = {
            width: style.imgWidth + 'em',
            height: style.imgHeight + 'em'
        };
        const hoverBgColor = style.hoverBgColor ? style.hoverBgColor : 'rgb(16,54,118)';
        const hoverFontColor = style.hoverFontColor ? style.hoverFontColor : '#fff';
        return (
            <ComponentBox style={{ ...this.props.style,pointerEvents:style.clickArea === 2 ? 'none':'auto' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div style={{ opacity, fontSize: fontSize, height: style.height + 'em' }} className={cssStyle.box} onMouseEnter={this.changeAutoStart.bind(this, false)} onMouseLeave={this.changeAutoStart.bind(this, true)} tabIndex="1" onBlur={this.leave.bind(this)}>
                            <div style={box} className={`${cssStyle.selectedBox} ${this.themeList[style.theme]}`} onClick={this.itemClick.bind(this)} >
                                {style.backgroundImg && <img alt={''} src={fileUrl + '/download/' + style.backgroundImg} className={cssStyle.backgroundImg} />}
                                <div style={textStyle} className={style.theme === 1 ? cssStyle.name : cssStyle.nameOverHide} >
                                    {style.fixedText ? style.fixedText : (style.selectMode === 2 ? (this.state.selectedName.join(',') || style.placeholder) : (this.state.value || style.placeholder))}
                                </div>
                                {style.imgType == null || style.imgType === 1 ? (
                                    <img alt="" src={this.state.showBox ? fileUrl + '/download/' + style.beforeImg : fileUrl + '/download/' + style.afterImg} style={imgStyle} />
                                ):(
                                    <Icon type={this.state.showBox ? 'up':'down'} className={cssStyle.icon} style={{fontSize:style.imgSize+'em'}} />
                                )}
                            </div>
                            <div className={cssStyle.dropBox} style={{ display: this.state.showBox === false ? 'none' : 'block', borderWidth: style.dropBorderWidth, borderStyle: 'solid', borderColor: style.dropBorderColor, borderRadius: style.dropBorderRadius, backgroundColor: style.dropBackgroundColor, height: style.boxHeight + 'em' }}>
                                <Scrollbars>
                                    {resultData.map((item, index) => {
                                        let itemStyle = {};
                                        if (style.selectMode === 2) {
                                            if (style.selectedBgColor && this.state.selectedId.indexOf(item.id) >= 0) {
                                                itemStyle.backgroundColor = style.selectedBgColor
                                            }
                                            if (style.selectedFontColor && this.state.selectedId.indexOf(item.id) >= 0) {
                                                itemStyle.color = style.selectedFontColor
                                            }
                                        } else {
                                            if (style.selectedBgColor && this.state.value === item.name) {
                                                itemStyle.backgroundColor = style.selectedBgColor
                                            }
                                            if (style.selectedFontColor && this.state.value === item.name) {
                                                itemStyle.color = style.selectedFontColor
                                            }
                                        }
                                        // return <div style={dropStyle} className={cssStyle.drop} onClick={this.dropClick.bind(this, item, false, index)} key={index} >{item.name}</div>;
                                        return (
                                            <ItemPart
                                                style={{ ...dropStyle, ...itemStyle }}
                                                className={cssStyle.drop}
                                                onClick={this.dropClick.bind(this, item, false, index)}
                                                key={index}
                                                name={item.name}
                                                hoverBgColor={hoverBgColor}
                                                hoverFontColor={hoverFontColor}
                                            />
                                        );
                                    })}
                                </Scrollbars>
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}