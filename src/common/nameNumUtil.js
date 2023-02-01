import React from "react";
import { fileUrl } from "../config";
import RectTypeOne from "./svg/rectTypeOne";
import RectTypeTwo from "./svg/rectTypeTwo";
import RectTypeThree from "./svg/rectTypeThree";
import RectTypFour from "./svg/rectTypeFour";
import RectTypeFive from "./svg/rectTypeFive";
import RectTypeNine from "./svg/rectTypeNine";
import CircleTypeOne from "./svg/circleTypeOne";
import CircleTypeFour from "./svg/circleTypeFour";
import { getLinearBackground, getMaxNum, getRadialBackground, getTypeImageEx, interactData } from "./util";
import cssStyle from "./css/nameNum.module.css";
import BarTypeOne from "./svg/barTypeOne";
import BarTypeTwo from "./svg/barTypeTwo";
import SingleMoveNum from "./singleMoveNum";
import NameNumText from "./nameNumText";
import { Tooltip } from "antd";
import SvgRing from "./svgRing";
import moment from "moment";

function getBgStyle(item) {
    if (item) {
        const unit = item && item.unitTypeBg === 2 ? '':'%';
        const style = { width: item.widthBg + unit, height: item.heightBg + unit, left: item.leftBg + unit, top: item.topBg + unit, opacity: item.opacity };
        switch (item.bgType) {
            case 1:
                if (item.img) {
                    return <img alt={''} src={fileUrl + '/download/' + item.img} style={style} className={cssStyle.background} />;
                }
                break;
            case 2:
                return <div style={{ ...style, background: item.bgColor }} className={cssStyle.background} />;
            case 3:
                const backgroundColor = item.gradientType !== 'linear' ? getRadialBackground(item.bgColorList) : getLinearBackground(item.bgColorList, item.gradientAngle);
                return <div style={{ ...style, background: backgroundColor }} className={cssStyle.background} />;
            case 4:
                return <RectTypeOne style={style} className={cssStyle.background} />;
            case 5:
                return <RectTypeTwo style={style} className={cssStyle.background} />;
            case 6:
                return <RectTypeThree style={style} className={cssStyle.background} />;
            case 7:
                return <RectTypFour style={style} className={cssStyle.background} />;
            case 8:
                return <RectTypeFive style={style} className={cssStyle.background} />;
            case 9:
                return <RectTypeNine style={style} className={cssStyle.background} />;
            case 10:
                return <CircleTypeOne style={style} className={cssStyle.background} />;
            case 11:
                return <CircleTypeFour style={style} className={cssStyle.background} />;
            default:
        }
    }
}
export function sendDataFormat(selectedIndex,dataList,sendDataFormat){
    let sendData = {};
    if(dataList && selectedIndex){
        dataList.forEach((item,index)=>{
            if(selectedIndex.indexOf(index) >= 0){
                for(let key in item){
                    if(sendData[key] == null){
                        sendData[key] = [];
                    }
                    sendData[key].push(item[key]);
                }
            }
        });
        if(sendDataFormat === 2){
            for(let key in sendData){
                sendData[key] = JSON.stringify(sendData[key]);
            }
        }else{
            for(let key in sendData){
                sendData[key] = sendData[key].join(',');
            }
        }
    }
    return sendData;
}
//点击响应
function itemClick(item, hasInteract, index, clickInteract, e) {
    if (hasInteract) {
        e.stopPropagation();
        const {style} = this.props.thisData;
        const {selectedIndex,resultData} = this.state;
        if (this.interactData == null) {
            this.interactData = interactData.bind(this);
        }
        if(style.selectType === 2){
            const thisIndex = selectedIndex.indexOf(index);
            if(thisIndex >= 0){
                selectedIndex.splice(thisIndex,1);
            }else{
                selectedIndex.push(index);
            }
            const sendData = sendDataFormat(selectedIndex,resultData,style.sendDataFormat);
            const { interact } = this.props.thisData.dataSources;
            this.interactData(clickInteract && clickInteract.length > 0?clickInteract:interact, sendData);
            this.setState({ selectedIndex });
        }else{
            if(style.repeatClick === 3 && selectedIndex === index){
            }else if(style.repeatClick === 2 && selectedIndex === index){
                const {repeatInteract} = this.props.thisData.style;
                this.interactData(repeatInteract, item);
                this.setState({ selectedIndex: -1 });
            }else{
                const { interact } = this.props.thisData.dataSources;
                // console.log(interact);
                this.interactData(clickInteract && clickInteract.length > 0?clickInteract:interact, item);
                if(style.showPage){
                    const pageSize = style.rowNum * style.columnNum;
                    this.setState({ selectedIndex: index,pageSelected: Math.floor(index/pageSize) });
                }else{
                    this.setState({ selectedIndex: index });
                }
            }
        }
    }
}
//鼠标移入
function mouseOver(item, hasInteract){
    const {mouseOverInteract} = this.props.thisData.style;
    if(hasInteract && mouseOverInteract && mouseOverInteract.length){
        this.interactData(mouseOverInteract, item);
    }
}
//鼠标移出
function mouseOut(item, hasInteract){
    const {mouseOutInteract} = this.props.thisData.style;
    if(hasInteract && mouseOutInteract && mouseOutInteract.length){
        this.interactData(mouseOutInteract, item);
    }
}
//项内容
export function getItemContent(content, data, index, fontStyle, contentPosition) {
    switch (content.type) {
        case 1:
            let item;
            if(content.dataSource === 2){
                item = this.keyParams[content.key];
            }else{
                item = data[content.key];
            }
            let fontSize = '1em';
            if (fontStyle && fontStyle.maxFontNum && item && item.length > fontStyle.maxFontNum) {
                fontSize = (fontStyle.maxFontNum / item.length).toFixed(2) + 'em';
            }
            let alignStyle = {};
            if(contentPosition){
                switch (contentPosition.justifyContent) {
                    case "flex-start":
                        alignStyle.textAlign = "left";
                        break;
                    case "center":
                        alignStyle.textAlign = "center";
                        break;
                    case "flex-end":
                        alignStyle.textAlign = "right";
                        break;
                    default:
                }
            }
            if (fontStyle && fontStyle.tooltip) {
                return <Tooltip className={`${cssStyle.textHide}`} style={{ fontSize, height: fontStyle.lineHeight + 'em', ...alignStyle }} title={item}><span style={alignStyle}>{item}</span></Tooltip>;
            } else {
                return <NameNumText id={`${this.props.thisData.id}_${index}`} fontStyle={fontStyle} content={content} className={`${cssStyle.text}`} style={{ fontSize,...alignStyle }}>{item}</NameNumText>;
            }
        case 2:
            let thisContent = content.text;
            if(thisContent){
                if(thisContent.indexOf('{lastYear}') >= 0){
                    thisContent = thisContent.replace('{lastYear}',moment(new Date()).subtract(1, 'years').format('YYYY'));
                }
                if(thisContent.indexOf('{nowYear}') >= 0){
                    thisContent = thisContent.replace('{nowYear}',moment(new Date()).format('YYYY'));
                }
            }
            return <NameNumText id={`${this.props.thisData.id}_${index}`} fontStyle={fontStyle} content={content} className={cssStyle.text}>{thisContent}</NameNumText>;
        case 5:
            return <NameNumText id={`${this.props.thisData.id}_${index}`} fontStyle={fontStyle} content={content} className={cssStyle.text}>{index}</NameNumText>;
        case 9:
            return <NameNumText id={`${this.props.thisData.id}_${index}`} fontStyle={fontStyle} content={content} className={cssStyle.text}>{(index < 10 ? '0':'')+index}</NameNumText>;
        case 3:
            let imgUrl = '';
            if (content.imageType === 1) {
                imgUrl = content.img;
            } else if (content.imageList && content.imageList.length > 0) {
                if (content.imageType === 2 && content.key) {
                    imgUrl = getTypeImageEx(content.imageList, data[content.key], content.imageListCalculateType);
                } else if (content.imageType === 3) {
                    imgUrl = getTypeImageEx(content.imageList, index, content.imageListCalculateType);
                }
            }
            return <img alt='' src={imgUrl ? fileUrl + '/download/' + imgUrl : ''} className={cssStyle.imgItem} style={{ width: content.imageWidth + 'em', height: content.imageHeight + 'em' }} />;
        case 4:
            let num = parseFloat(data[content.key]);
            if (fontStyle && num != null  && !isNaN(num)) {
                if (fontStyle.numFixed != null) {
                    num = num.toFixed(fontStyle.numFixed);
                }
                num = num.toString();
                if (fontStyle.numLength != null) {
                    const numlength = num.replace('.', '').length;
                    const subNum = fontStyle.numLength - numlength;
                    if (subNum > 0) {
                        for (let i = 0; i < subNum; i++) {
                            num = '0' + num;
                        }
                    }
                }
                if (fontStyle.numSplitShow) {
                    num = num.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
                }
                if (fontStyle.numTheme === 2 && fontStyle.numStyle) {
                    const { numStyle } = fontStyle;
                    const numSingleList = num.split("");
                    return numSingleList.map((str, numIndex) => {
                        if (str === ',' || str === '.' || str === '-') {
                            return (
                                <div className={cssStyle.numSingle} key={numSingleList.length - numIndex} style={{ height: numStyle.height + 'em' }}>
                                    {str}
                                </div>
                            );
                        } else {
                            return (
                                <div className={cssStyle.numSingle} key={numSingleList.length - numIndex} style={{ width: numStyle.width + 'em', height: numStyle.height + 'em' }}>
                                    {getBgStyle(numStyle)}
                                    {/*<span className={cssStyle.text}>{str}</span>*/}
                                    <SingleMoveNum num={str} lineHeight={fontStyle.lineHeight} getDataTime={this.getDataTime} padding={numStyle.padding}/>
                                </div>
                            );
                        }
                    });
                } else {
                    return <NameNumText id={`${this.props.thisData.id}_${index}`} fontStyle={fontStyle} content={content} className={cssStyle.text}>{num}</NameNumText>;
                }
            } else {
                return <NameNumText id={`${this.props.thisData.id}_${index}`} fontStyle={fontStyle} content={content} className={cssStyle.text}>{num!=null?num:''}</NameNumText>;
            }
        case 6:
            if (content.barNumKey == null) {
                return;
            }
            if (this.maxBarNum == null || this.maxBarNum === 0 || this.barMaxNumType !== content.barMaxNumType) {
                if (content.barMaxNumType === 2 && content.maxNum) {
                    this.maxBarNum = content.maxNum;
                } else {
                    const maxNum = getMaxNum(this.state.resultData, content.barNumKey);
                    const maxNumTimes = content.maxNumTimes ? content.maxNumTimes : 1;
                    this.maxBarNum = maxNum * maxNumTimes;
                }
                this.barMaxNumType = content.barMaxNumType;
            }
            const percentage = this.maxBarNum === 0 ? 0 :(data[content.barNumKey] * 100 / this.maxBarNum).toFixed(2);
            if (content.barType === 4) {
                return <BarTypeTwo contentStyle={content} percentage={percentage} num={data[content.barNumKey]} index={index} />;
            } else if (content.barType === 3) {
                return <BarTypeOne style={{ color: content.numColor, fontSize: content.numSize + 'em' }} percentage={percentage} num={data[content.barNumKey]} />;
            } else {
                let barStyle = {};
                let barImgStyle = {};
                let barNumStyle = {
                    color:content.numColor,
                    fontSize:content.numSize+'em',
                };
                if (content.barDirection === 1) {
                    barStyle.width = percentage + '%';
                    barStyle.height = '100%';
                    barNumStyle.height = '100%';
                    barImgStyle.width = (10000 / percentage).toFixed(2) + '%';
                    barImgStyle.height = '100%';
                    barImgStyle.top = '0px';
                    if (content.barStart === 1) {
                        barStyle.left = '0px';
                        barImgStyle.left = '0px';
                        barNumStyle.left = barStyle.width;
                        barNumStyle.paddingLeft = '0.5em';
                    } else {
                        barImgStyle.right = '0px';
                        barNumStyle.right = barStyle.width;
                        barNumStyle.paddingRight = '0.5em';
                    }
                } else {
                    // barNumStyle.width = '100%';
                    barStyle.width = '100%';
                    barStyle.height = percentage + '%';
                    barImgStyle.width = '100%';
                    barImgStyle.height = (10000 / percentage).toFixed(2) + '%';
                    barImgStyle.left = '0px';
                    if (content.barStart === 1) {
                        barStyle.top = '0px';
                        barImgStyle.top = '0px';
                        // barNumStyle.top = '100%';
                        // barNumStyle.paddingTop = '1em';
                    } else {
                        barStyle.bottom = '0px';
                        barImgStyle.bottom = '0px';
                        // barNumStyle.bottom = '100%';
                        // barNumStyle.paddingBottom = '1em';
                    }
                }
                if (content.barType === 1) {
                    const barBgColor = content.barBgColorType === 2 ? (content.barBgGradientType !== 'linear' ? getRadialBackground(content.barBgColorList) : getLinearBackground(content.barBgColorList, content.barBgGradientAngle)) : content.barBgColor;
                    const barColor = content.barColorType === 2 ? (content.barGradientType !== 'linear' ? getRadialBackground(content.barColorList) : getLinearBackground(content.barColorList, content.barGradientAngle)) : content.barColor;
                    return (
                        <div className={cssStyle.barBox} style={{ background: barBgColor, borderRadius: content.barRadius }}>
                            <div className={cssStyle.bar} style={{ ...barStyle, background: barColor, borderRadius: content.barRadius }} />
                            {content.numShow && <div className={cssStyle.barNum} style={barNumStyle}>
                                {data[content.barNumKey]}
                            </div>}
                        </div>
                    );
                } else {
                    return (
                        <div className={cssStyle.barBox} >
                            <img className={cssStyle.barBgImg} alt='' src={content.barBgImg ? fileUrl + '/download/' + content.barBgImg : ''} />
                            <div className={cssStyle.imgBarBox} style={barStyle}>
                                <img className={cssStyle.barImg} style={barImgStyle} alt='' src={content.barImg ? fileUrl + '/download/' + content.barImg : ''} />
                            </div>
                        </div>
                    );
                }
            }
        case 7:
            if (content.ringNumKey == null) {
                return;
            }else{
                return <SvgRing id={`${this.props.thisData.id}_${index}`} className={cssStyle.ring} per={data[content.ringNumKey]} ringStyle={content}/>;
            }
        case 8:
            return <img alt="" src={data[content.key]} style={{width:content.imageUrlWidth+'%',height:content.imageUrlHeight+'%'}} />
        default:
    }
}
export function getSpecialStyle(styleList, value, calculateType,styleType) {
    if (styleList != null && styleList.length > 0) {
        if (calculateType === 1) {
            for (let i = 0; i < styleList.length; i++) {
                if (value + '' === styleList[i].value + '') {
                    return styleList[i];
                }
            }
        } else if (calculateType === 2){
            for (let i = 0; i < styleList.length; i++) {
                if (value >= styleList[i].more && value < styleList[i].less) {
                    return styleList[i];
                }
            }
        }else{
            for (let i = 0; i < styleList.length; i++) {
                if (styleList[i].valueType + '' === value%2 + '') {
                    return styleList[i];
                }
            }
        }
    } else {
        return null;
    }
}
function getItemStyle(content, styleType, styleList, dependKey, calculateType, data, index) {
    if (styleType === 1) {
        return content;
    } else if (styleType === 2 && dependKey) {
        return getSpecialStyle(styleList, data[dependKey], calculateType,styleType);
    } else if (styleType === 3) {
        return getSpecialStyle(styleList, index, calculateType,styleType);
    } else {
        return null;
    }
}
export function getContentList(data, contentStyle, dataIndex, rootIndex) {
    const {style} = this.props.thisData;
    const {selectedIndex} = this.state;
    let isSelected = selectedIndex === rootIndex;
    if(style.selectType === 2 && typeof(selectedIndex) === 'object'){
        isSelected = selectedIndex.indexOf(rootIndex) >= 0;
    }
    if (this.getItemContent == null) {
        this.getItemContent = getItemContent.bind(this);
    }
    if (data && contentStyle) {
        return contentStyle.map((item, index) => {
            //背景样式
            const itemBgStyle = isSelected && item.selectedBackground && Object.keys(item.selectedBackground).length > 0 ? item.selectedBackground : item;
            const itemBg = getItemStyle(itemBgStyle, itemBgStyle.backgroundType, itemBgStyle.backgroundList, itemBgStyle.keyBackground, itemBgStyle.backgroundCalculateType, data, dataIndex + 1);
            //大小位置
            const positionStyle = isSelected && item.selectedPosition && Object.keys(item.selectedPosition).length > 0 ? item.selectedPosition : item;
            const position = getItemStyle(positionStyle, positionStyle.positionType, positionStyle.positionList, positionStyle.keyPosition, positionStyle.positionCalculateType, data, dataIndex + 1);
            const unit = position && position.unitType === 2 ? '':'%';
            const contentPosition = position ? { overflow:position.overflowHidden === false?'visible':'hidden', width: position.width + unit, height: position.height + unit, left: position.left + unit, top: position.top + unit } : {};
            //边框
            const borderStyle = isSelected && item.selectedBorder && Object.keys(item.selectedBorder).length > 0 ? item.selectedBorder : item;
            const border = getItemStyle(borderStyle, borderStyle.borderType, borderStyle.borderList, borderStyle.keyBorder, borderStyle.borderCalculateType, data, dataIndex + 1);
            const contentBorder = border ? { borderStyle: border.borderStyle, borderWidth: border.borderWidth, borderColor: border.borderColor, borderRadius: border.borderRadius } : {};
            //排列情况
            const alignStyle = isSelected && item.selectedAlign && Object.keys(item.selectedAlign).length > 0 ? item.selectedAlign : item;
            const align = getItemStyle(alignStyle, alignStyle.alignType == null ? 1 : alignStyle.alignType, alignStyle.alignList, alignStyle.keyAlign, alignStyle.alignCalculateType, data, dataIndex + 1);
            const contentAlign = align ? { justifyContent: align.justifyContent, alignItems: align.alignItems, flexDirection: align.flexDirection } : {};
            return (
                <div
                    key={index} className={cssStyle.itemBox}
                    style={{
                        position: item.itemBoxPosition,
                        color: item.color, ...contentPosition, ...contentBorder, ...contentAlign,
                        fontSize: item.fontSize + (item.fontSizeUnit === 2 ? '':'em'),
                        cursor: item.hasInteract ? 'pointer' : ''
                    }}
                    onClick={itemClick.bind(this, data, item.hasInteract, rootIndex, item.clickInteract)}
                    onMouseEnter={mouseOver.bind(this, data, item.hasInteract)}
                    onMouseLeave={mouseOut.bind(this, data, item.hasInteract)}
                >
                    {getBgStyle(itemBg)}
                    {item.content && item.content.map((content, contentIndex) => {
                        //大小位置样式
                        const positionStyle = isSelected && content.selectedPosition && Object.keys(content.selectedPosition).length > 0 ? content.selectedPosition : content;
                        const position = getItemStyle(positionStyle, positionStyle.positionType, positionStyle.positionList, positionStyle.keyPosition, positionStyle.positionCalculateType, data, dataIndex + 1);
                        const unit = position && position.unitType === 2 ? '':'%';
                        const contentPosition = position ? {overflow:position.overflowHidden?'hidden':'visible', width: position.width && position.width + unit, height: position.height && position.height + unit, justifyContent: position.justifyContent, alignItems: position.alignItems } : {};
                        //字样式
                        const fontStyle = isSelected && content.selectedFont && Object.keys(content.selectedFont).length > 0 ? content.selectedFont : content;
                        const font = getItemStyle(fontStyle, fontStyle.fontType, fontStyle.fontList, fontStyle.keyFont, fontStyle.fontCalculateType, data, dataIndex + 1);
                        const fontSizeUnit = font && font.fontSizeUnit === 2 ? '':'em';
                        const contentFont = font ? { fontSize: font.fontSize + fontSizeUnit,letterSpacing:font.letterSpacing, lineHeight: font.lineHeight + 'em', fontWeight: font.fontWeight, color: font.fontColor } : {};
                        //背景样式
                        const bgStyle = isSelected && content.selectedBackground && Object.keys(content.selectedBackground).length > 0 ? content.selectedBackground : content;
                        const contentBg = getItemStyle(bgStyle, bgStyle.backgroundType, bgStyle.backgroundList, bgStyle.keyBackground, bgStyle.backgroundCalculateType, data, dataIndex + 1);
                        //边框
                        const borderStyle = isSelected && content.selectedBorder && Object.keys(content.selectedBorder).length > 0 ? content.selectedBorder : content;
                        const border = getItemStyle(borderStyle, borderStyle.borderType, borderStyle.borderList, borderStyle.keyBorder, borderStyle.borderCalculateType, data, dataIndex + 1);
                        const contentBorder = border ? { borderStyle: border.borderStyle, borderWidth: border.borderWidth, borderColor: border.borderColor, borderRadius: border.borderRadius } : {};
                        //字阴影
                        const textShadowStyle = isSelected && content.selectedTextShadow && Object.keys(content.selectedTextShadow).length > 0 ? content.selectedTextShadow : content;
                        const textShadow = getItemStyle(textShadowStyle, textShadowStyle.textShadowType, textShadowStyle.textShadowList, textShadowStyle.keyTextShadow, textShadowStyle.textShadowCalculateType, data, dataIndex + 1);
                        const contentTextShadow = textShadow ? { textShadow:`${textShadow.hShadow} ${textShadow.vShadow} ${textShadow.blur} ${textShadow.color}` } : {};
                        //内容
                        let thisContent;
                        if (content.type === 6 && content.barStyleType !== 1) {
                            //柱样式
                            const barStyle = getItemStyle(content, content.barStyleType, content.barStyleList, content.keyBarStyle, content.barStyleCalculateType, data, dataIndex + 1);
                            thisContent = { ...content, ...barStyle };
                        } else if (content.type === 7 && content.ringStyleType !== 1){
                            //圆环样式
                            const ringStyle = getItemStyle(content, content.ringStyleType, content.ringStyleList, content.keyRingStyle, content.ringStyleCalculateType, data, dataIndex + 1);
                            thisContent = { ...content, ...ringStyle };
                        }else {
                            thisContent = content;
                        }
                        return (
                            <div
                                key={contentIndex} className={cssStyle.contentBox}
                                style={{
                                    ...contentPosition, ...contentFont, ...contentBorder, ...contentTextShadow,
                                    cursor: content.hasInteract ? 'pointer' : '',
                                    padding: font && font.padding ? font.padding : content.padding,
                                    margin: content.margin,
                                    fontFamily:content.fontFamily,
                                    fontStyle:content.isOblique?'oblique':'normal'
                                }}
                                onClick={itemClick.bind(this, data, content.hasInteract, rootIndex, content.clickInteract)}
                            >
                                {getBgStyle(contentBg)}
                                {this.getItemContent(thisContent, data, dataIndex + 1, font,contentPosition)}
                            </div>
                        );
                    })}
                </div>
            );
        })
    }
}