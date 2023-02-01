import React from "react";

import ComponentBox from "../component_box";
import cssStyle from './num_img_list.module.css';
import { fileUrl } from "../../config";
import Emitter from "../../common/eventBus";
import { getData } from "../../common/getDataUtil";
import { dataFormat,changeComponentShow,getNumberFormatter } from "../../common/util";

export default class NumImgList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], selectIndex: 0 };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.changeComponentShow = changeComponentShow.bind(this);
    }

    componentWillUnmount() {
    }

    componentDidMount() {
        this.p = new Promise((resolve) => { this.getData(this.callBack.bind(this, resolve)) });
        if (this.props.firstLoad === false) {
            this.animateOn();
        } else {
            this.itemSelect(this.props.thisData.style.coverImgList[0], 0);
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then((data) => {
            this.formatterData(data);
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "animateOn":
                this.animateOn();
                break;
            case "deleteKey":
                this.keyParams = {};
                this.reGetData();
                break;
            case "showComponent":
                //显示当前组件
                this.changeComponentShow(true);
                break;
            case "hideComponent":
                //隐藏当前组件
                this.changeComponentShow(false);
                break;
            default:
                break;
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            if (resolve) {
                resolve(result);
            } else {
                this.formatterData(result);
            }
        }
    }

    formatterData(data) {
        const { style } = this.props.thisData;
        if (style.dataStyle === 2) {
            this.setState({ data: dataFormat(data) })
        } else {
            this.setState({ data });
        }
    }

    // 点击响应
    itemSelect(listItem, listIndex) {
        this.setState({ selectIndex: listIndex });
        const { data } = this.state;
        if (listItem.interact && listItem.interact.length > 0) {
            listItem.interact.forEach((item) => {
                switch (item.type) {
                    case 1:
                        if (data[listIndex] == null) {
                            return;
                        }
                        let sendData = {};
                        sendData[item.messageKey] = data[listIndex][item.dataKeyName];
                        Emitter.emit(item.receiveId, { type: 'changeKey', data: sendData });
                        break;
                    case 2:
                        Emitter.emit('app_box', {
                            type: 'changeLayerShowStatus',
                            data: { showList: item.showList, hideList: item.hideList }
                        });
                        break;
                    default:
                        break
                }
            });
        }
    }

    render() {
        let resultData = this.state.data.slice();
        const { style } = this.props.thisData;
        //阴影样式
        const shadowLeft = style.shadowLeft ? this.props.getCompatibleSize(style.shadowLeft) : 0;
        const shadowTop = style.shadowTop ? this.props.getCompatibleSize(style.shadowTop) : 0;
        const blur = style.blur ? this.props.getCompatibleSize(style.blur) : 0;
        const spread = style.blur ? this.props.getCompatibleSize(style.spread) : 0;
        //计算元素宽高
        const columnNum = style.columnNum ? style.columnNum : 1;
        const columnGap = style.columnGap ? style.columnGap : 10;
        const rowNum = Math.ceil(resultData.length / columnNum);
        //计算多余个数
        const subNum = rowNum * columnNum - resultData.length;
        for (let i = 0; i < subNum; i++) {
            resultData.push({ empty: true });
        }
        const rowGap = style.rowGap ? style.rowGap : 10;
        //每个元素样式
        const itemStyle = {
            width: columnNum === 1 ? '100%' : (100 - columnGap * (columnNum - 1)) / columnNum + '%',
            height: (100 - rowGap * (rowNum - 1)) / rowNum + '%',
            boxShadow: shadowLeft + ' ' + shadowTop + ' ' + blur + ' ' + spread + ' ' + style.shadowColor
        };
        if (style.nameSplit == null) {
            style.nameSplit = {};
        }
        if (style.numSplit == null) {
            style.numSplit = {};
        }
        const { list, nameSplit, numSplit } = style;
        return (
            <ComponentBox id={this.props.thisData.id} thisData={this.props.thisData} style={this.props.style}
                receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)}>
                <ul className={cssStyle.listBox}>
                    {resultData.map((outerItem, outerIndex) => {
                        if (outerItem.empty) {
                            return (
                                <li className={cssStyle.listItem} style={itemStyle} key={outerIndex} />
                            );
                        } else {
                            let icon;
                            let backgroundColor;
                            let border;
                            const thisPartStyle = style.coverImgList[outerIndex];
                            const isSelected = this.state.selectIndex === outerIndex;
                            let indexPosition={
                                position:'relative',
                                left:thisPartStyle.liLeft,
                                top:thisPartStyle.liTop,
                            }
                            if (thisPartStyle) {
                                if (isSelected) {
                                    icon = thisPartStyle.selectedImg ? thisPartStyle.selectedImg : thisPartStyle.normalImg;
                                    backgroundColor = thisPartStyle.selectedBgColor ? thisPartStyle.selectedBgColor : thisPartStyle.itemBgColor;
                                    border = {
                                        borderRadius: this.props.getCompatibleSize(thisPartStyle.selectedBorderRadius ? thisPartStyle.selectedBorderRadius : thisPartStyle.borderRadius),
                                        borderWidth: this.props.getCompatibleSize(thisPartStyle.selectedBorderWidth ? thisPartStyle.selectedBorderWidth : thisPartStyle.borderWidth),
                                        borderColor: thisPartStyle.selectedBorderColor ? thisPartStyle.selectedBorderColor : thisPartStyle.borderColor,
                                        borderStyle: thisPartStyle.selectedBorderStyle ? thisPartStyle.selectedBorderStyle : thisPartStyle.borderStyle,
                                    };
                                } else {
                                    icon = thisPartStyle.normalImg;
                                    backgroundColor = thisPartStyle.itemBgColor;
                                    border = {
                                        borderRadius: this.props.getCompatibleSize(thisPartStyle.borderRadius),
                                        borderWidth: this.props.getCompatibleSize(thisPartStyle.borderWidth),
                                        borderColor: thisPartStyle.borderColor,
                                        borderStyle: thisPartStyle.borderStyle,
                                    };
                                }
                            }
                            let numColor;
                            if (list[0].numColorType === 3) {
                                list[0].normalNumColorList && list[0].normalNumColorList.forEach((colorItem) => {
                                    if ((outerIndex + 1) >= colorItem.bottom && (outerIndex + 1) < colorItem.top) {
                                        numColor = colorItem.color;
                                    }
                                });
                            } else {
                                numColor = list[0].normalNumColor;
                            }
                            let subNumColor;
                            if (list[1].numColorType === 3) {
                                list[1].normalNumColorList && list[1].normalNumColorList.forEach((colorItem) => {
                                    if ((outerIndex + 1) >= colorItem.bottom && (outerIndex + 1) < colorItem.top) {
                                        subNumColor = colorItem.color;
                                    }
                                });
                            } else {
                                subNumColor = list[1].normalNumColor;
                            }
                            return (
                                <li className={cssStyle.listItem}
                                    onClick={this.itemSelect.bind(this, style.coverImgList[outerIndex], outerIndex)}
                                    style={{
                                        ...itemStyle,
                                        ...border,
                                        ...indexPosition,
                                        backgroundColor: backgroundColor,
                                    }} key={outerIndex}>
                                    <img className={cssStyle.cover} alt=""
                                        src={icon ? fileUrl + '/download/' + icon : ''}
                                        style={{
                                            top: style.coverImgTop + '%',
                                            left: style.coverImgLeft + '%',
                                            width: style.coverImgWidth + '%',
                                            height: style.coverImgHeight + '%'
                                        }} />
                                    <ul className={cssStyle.header}
                                        style={{
                                            top: style.textTop + '%',
                                            left: style.textLeft + '%',
                                            width: style.textWidth + '%',
                                            height: style.textHeight + '%',
                                            justifyContent: style.justifyContent,
                                            alignItems: style.alignItems,
                                        }}>
                                        <div style={{ color: isSelected && list[0].selectedColor ? list[0].selectedColor : list[0].normalColor, fontSize: this.props.getCompatibleSize(list[0].headerFontSize), fontWeight: list[0].headerFontWeight, marginRight: this.props.getCompatibleSize(list[0].mainMarginRight), lineHeight: this.props.getCompatibleSize(list[0].headerLineHeight) }}>{getNumberFormatter(style.numSplitShow,style.numFixed,outerItem[list[0].nameKey])}</div>
                                        <div style={{ color: isSelected && nameSplit.selectedColor ? nameSplit.selectedColor : nameSplit.color, fontSize: this.props.getCompatibleSize(nameSplit.fontSize), fontWeight: nameSplit.fontWeight }}>{nameSplit.text}</div>
                                        <div style={{ color: isSelected && list[1].selectedColor ? list[1].selectedColor : list[1].normalColor, fontSize: this.props.getCompatibleSize(list[1].headerFontSize), fontWeight: list[1].headerFontWeight, lineHeight: this.props.getCompatibleSize(list[1].headerLineHeight) }}>{getNumberFormatter(style.numSplitShow,style.numFixed,outerItem[list[1].nameKey])}</div>
                                    </ul>
                                    <ul className={cssStyle.main}
                                        style={{
                                            top: style.numTop + '%',
                                            left: style.numLeft + '%',
                                            width: style.numWidth + '%',
                                            height: style.numHeight + '%',
                                            justifyContent: style.numJustifyContent,
                                            alignItems: style.numAlignItems,
                                        }}>
                                        <div style={{ color: isSelected && list[0].selectedNumColor ? list[0].selectedNumColor : numColor, fontSize: this.props.getCompatibleSize(list[0].numFontSize), fontWeight: list[0].numFontWeight, lineHeight: this.props.getCompatibleSize(list[0].numLineHeight) }}>{getNumberFormatter(style.numSplitShow,style.numFixed,outerItem[list[0].numKey])}</div>
                                        <div style={{ color: isSelected && numSplit.selectedColor ? numSplit.selectedColor : numSplit.color, fontSize: this.props.getCompatibleSize(numSplit.fontSize), fontWeight: numSplit.fontWeight }}>{numSplit.text}</div>
                                        <div style={{ color: isSelected && list[1].selectedNumColor ? list[1].selectedNumColor : subNumColor, fontSize: this.props.getCompatibleSize(list[1].numFontSize), fontWeight: list[1].numFontWeight, lineHeight: this.props.getCompatibleSize(list[1].numLineHeight) }}>{getNumberFormatter(style.numSplitShow,style.numFixed,outerItem[list[1].numKey])}</div>
                                    </ul>
                                </li>
                            )
                        }
                    })}
                </ul>
            </ComponentBox>
        );
    }
}