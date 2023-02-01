import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_nineteen.module.css";
import { getData } from "../../common/getDataUtil";
import {Motion, spring, StaggeredMotion} from "react-motion";
import { getContentList, sendDataFormat } from "../../common/nameNumUtil";
import { getColumnNum, getCompatibleSize, interactData } from "../../common/util";
import SpringScrollbars from "../../common/springScrollbars";

import leftIcon from "./images/pageLeft.png";
import rightIcon from "./images/pageRight.png";

import { fileUrl } from "../../config";

export default class NameNumTypeNineteen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], selectedIndex: -1, show: false, showBox: false, left: 0, pageSelected: 0 };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.getContentList = getContentList.bind(this);
        this.interactData = interactData.bind(this);
        this.firstLoad = true;
        this.getDataType = 'changeKey';
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if (this.props.thisData.firstLoad) {
                this.getData(this.callBack.bind(this, resolve), null, null, 'changeKey');
            } else {
                this.callBack(resolve);
            }
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
        if (this.autoSelectTimer) {
            clearTimeout(this.autoSelectTimer);
        }
        if (this.autoPageTimer) {
            clearTimeout(this.autoPageTimer);
        }
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        const { style } = this.props.thisData;
        if (style.showAutoClick) {
            if (prevProps.thisData.showStatus !== this.props.thisData.showStatus && this.props.thisData.showStatus) {
                const { resultData, selectedIndex } = this.state;
                const { interact } = this.props.thisData.dataSources;
                if(style.selectType === 2){
                    const sendData = sendDataFormat(selectedIndex,resultData,style.sendDataFormat);
                    this.interactData(interact, sendData);
                }else{
                    if (selectedIndex >= 0 && resultData && resultData[selectedIndex]) {
                        this.interactData(interact, resultData[selectedIndex]);
                    }
                }
            }
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "dataInterchange":
            case "changeKey":
                let hasChange = false;
                for (let key in data.data) {
                    if (this.keyParams[key]+'' !== data.data[key]+'') {
                        this.keyParams[key] = data.data[key];
                        hasChange = true;
                    }
                }
                if (hasChange && data.reGetData !== 2) {
                    this.reGetData('changeKey');
                }
                break;
            case "showComponent":
                break;
            case "changeSelected":
                for (let key in data.data) {
                    const subData = data.data[key];
                    const { resultData } = this.state;
                    for (let i = 0; i < resultData.length; i++) {
                        if (subData + '' === resultData[i][key] + '') {
                            if(data.isInteract !== 2){
                                const { interact } = this.props.thisData.dataSources;
                                this.interactData(interact, resultData[i]);
                            }
                            const { style } = this.props.thisData;
                            if(style.showPage){
                                const pageSize = style.rowNum * style.columnNum;
                                this.setState({ selectedIndex: i,pageSelected: Math.floor(i/pageSize) });
                            }else{
                                this.setState({ selectedIndex: i });
                            }
                            // this.setState({ selectedIndex: i });
                            break;
                        }
                    }
                    break;
                }
                break;
            case "cancelSelect":
                const { style } = this.props.thisData;
                if (style.selectType === 2) {
                    this.setState({ selectedIndex: [] });
                }else{
                    this.setState({ selectedIndex: -1 });
                }
                break;
            case "reFresh":
                //刷新数据
                this.reGetData();
                break;
            case "resultDataInterchange":
                //接收结果数据
                if(data.data){
                    this.callBack(null,data.data);
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
        })
    }

    //重新获取数据
    reGetData(getDataType) {
        if (this.autoSelectTimer) {
            clearTimeout(this.autoSelectTimer);
        }
        if (this.autoPageTimer) {
            clearTimeout(this.autoPageTimer);
        }
        this.setState({ resultData: [] });
        this.getData(this.callBack.bind(this, ''), null, null, getDataType);
    }

    //获取数据后回调
    callBack(resolve, resultData, getDataType) {
        if (resolve) {
            resolve(resultData);
        }
        if (resultData) {
            const result = Array.isArray(resultData) ? resultData : [resultData];
            this.getDataTime = new Date().getTime();
            this.setState({ resultData: result });
            const { style,showStatus } = this.props.thisData;
            if (result && result.length > 0 && getDataType === 'changeKey') {
                let defaultSelectIndex;
                if (style.selectType === 2) {
                    defaultSelectIndex = [];
                }
                const { selectedIndex } = this.state;
                if (style.keepSelect && !this.firstLoad) {
                    defaultSelectIndex = selectedIndex;
                } else {
                    if (style.defaultSelectType === 2) {
                        if (style.defaultSelectKey && style.defaultSelect) {
                            if(style.selectType === 2){
                                const defaultList = style.defaultSelect.split(',');
                                for(let j = 0;j < defaultList.length;j ++){
                                    for (let i = 0; i < result.length; i++) {
                                        if (result[i][style.defaultSelectKey] + '' === defaultList[j] + '') {
                                            defaultSelectIndex.push(i);
                                            break;
                                        }
                                    }
                                }
                            }else{
                                for (let i = 0; i < result.length; i++) {
                                    if (result[i][style.defaultSelectKey] + '' === style.defaultSelect + '') {
                                        defaultSelectIndex = i;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        if (style.defaultSelect != null && style.defaultSelect !== '') {
                            if (style.selectType === 2) {
                                const defaultIndex = style.defaultSelect.split(',');
                                defaultSelectIndex = defaultIndex.map((item) => { return item - 1; });
                            } else {
                                defaultSelectIndex = style.defaultSelect - 1;
                            }
                        }
                    }
                }
                if (defaultSelectIndex != null) {
                    if (this.props.thisData.firstSend && (!style.actionInteractWhenShow || (style.actionInteractWhenShow && showStatus))) {
                        const { interact } = this.props.thisData.dataSources;
                        if (style.selectType === 2) {
                            const sendData = sendDataFormat(defaultSelectIndex, result, style.sendDataFormat);
                            this.interactData(interact, sendData);
                        } else {
                            this.interactData(interact, result[defaultSelectIndex]);
                        }
                    }
                    this.setState({ selectedIndex: defaultSelectIndex });
                    if (style.autoSelect) {
                        this.autoSelectChange();
                    }
                }
            }
            if (style.showPage) {
                const rowNum = style.rowNum ? style.rowNum : 1;
                const columnNum = style.columnNum ? style.columnNum : 1;
                this.pageNum = Math.ceil(result.length / (rowNum * columnNum));
                this.setState({ pageSelected: 0 });
                if (style.autoMove) {
                    this.autoPageChange();
                }
            }
            if (this.firstLoad) {
                this.firstLoad = false;
            }
        }
    }

    autoSelectChange() {
        const { style,showStatus } = this.props.thisData;
        const intervalSelect = style.intervalSelect ? style.intervalSelect : 2000;
        if (this.autoSelectTimer) {
            clearTimeout(this.autoSelectTimer);
        }
        this.autoSelectTimer = setTimeout(() => {
            if(showStatus){
                let { resultData, selectedIndex } = this.state;
                if (resultData && resultData.length > 0) {
                    selectedIndex++;
                    if (selectedIndex >= resultData.length) {
                        selectedIndex = 0;
                    }
                    const { interact } = this.props.thisData.dataSources;
                    this.interactData(interact, resultData[selectedIndex]);
                    if(style.showPage){
                        const pageSize = style.rowNum * style.columnNum;
                        this.setState({ selectedIndex: selectedIndex,pageSelected: Math.floor(selectedIndex/pageSize) });
                    }else{
                        this.setState({ selectedIndex: selectedIndex });
                    }
                }
            }
            this.autoSelectChange();
        }, intervalSelect);
    }

    autoPageChange() {
        const { style,showStatus } = this.props.thisData;
        if (this.autoPageTimer) {
            clearTimeout(this.autoPageTimer);
        }
        if(style.autoSelect){
            return;
        }
        if (style.interval) {
            this.autoPageTimer = setTimeout(() => {
                if(showStatus){
                    let { pageSelected } = this.state;
                    pageSelected++;
                    if (pageSelected >= this.pageNum) {
                        pageSelected = 0;
                    }
                    this.setState({ pageSelected });
                }
                this.autoPageChange();
            }, style.interval);
        }
    }

    //切换自动滚动开始暂停
    changeIntervalStart(flag) {
        if (flag) {
            const { style } = this.props.thisData;
            if (style.autoSelect) {
                this.autoSelectChange();
            }
            if (style.autoMove && style.showPage) {
                this.autoPageChange();
            }
        } else {
            if (this.autoSelectTimer) {
                clearTimeout(this.autoSelectTimer);
            }
            if (this.autoPageTimer) {
                clearTimeout(this.autoPageTimer);
            }
        }
    }

    changePage(i) {
        this.setState({ pageSelected: i });
        const { style } = this.props.thisData;
        if(style.pageChangeSelect){
            const pageSize = style.rowNum * style.columnNum;
            const { interact } = this.props.thisData.dataSources;
            const { resultData } = this.state;
            this.interactData(interact, resultData[pageSize*i]);
            this.setState({ selectedIndex: pageSize*i });
        }
    }

    getPageBox(pageNum) {
        const { style } = this.props.thisData;
        const { pageSelected } = this.state;
        if(style.pageStyle === 2){
            return (
                <React.Fragment>
                    <img
                        alt={''} src={leftIcon}
                        className={`${cssStyle.pageIcon} ${cssStyle.leftIcon} ${pageSelected === 0 ? cssStyle.noRemain : ''}`}
                        onClick={this.changePage.bind(this, pageSelected > 1 ? pageSelected-1:0)}
                        onMouseOver={this.changeIntervalStart.bind(this, false)}
                        onMouseOut={this.changeIntervalStart.bind(this, true)}
                    />
                    <img
                        alt={''} src={rightIcon}
                        className={`${cssStyle.pageIcon} ${cssStyle.rightIcon} ${pageSelected === pageNum-1 ? cssStyle.noRemain : ''}`}
                        onClick={this.changePage.bind(this, pageSelected < pageNum-1 ? pageSelected+1:pageNum-1)}
                        onMouseOver={this.changeIntervalStart.bind(this, false)}
                        onMouseOut={this.changeIntervalStart.bind(this, true)}
                    />
                </React.Fragment>
            );
        }else{
            let pageList = [];
            for (let i = 0; i < pageNum; i++) {
                pageList.push(<div key={i} className={`${cssStyle.pagePoint} ${i === pageSelected ? cssStyle.pageSelected : ''}`} onClick={this.changePage.bind(this, i)} />)
            }
            return (
                <div
                    className={style.pageStyle === 3 ? cssStyle.pageBoxThree : cssStyle.pageBox}
                    onMouseOver={this.changeIntervalStart.bind(this, false)}
                    onMouseOut={this.changeIntervalStart.bind(this, true)}
                >
                    {pageList}
                </div>
            );
        }
    }

    getListContent(resultData,fontSize,boxWidth,boxHeight,flexStyle,itemStyle){
        const { style, showStatus } = this.props.thisData;
        const blankNum = style.blankNum ? style.blankNum : 0;
        const defaultStyle = resultData.map(() => ({ opacity: 0 }));
        const border = { borderStyle: style.borderStyle, borderWidth: style.borderWidth, borderColor: style.borderColor, borderRadius: style.borderRadius };
        if(style.showAnType === 2){
            return (
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div
                            className={`${cssStyle.box} ${style.openReflect ? cssStyle.reflect : ''} ${style.animateOne ? cssStyle.animateOne:''}`}
                            style={{ fontSize: fontSize, ...flexStyle, flexDirection: style.flexDirection, width: boxWidth, height: boxHeight, ...border, opacity: opacity }}
                            onMouseOver={this.changeIntervalStart.bind(this, false)}
                            onMouseOut={this.changeIntervalStart.bind(this, true)}
                        >
                            {resultData.map((item, index) => {
                                if (item) {
                                    if (style.itemPositionType === 2) {
                                        const position = (style.itemPositionType === 2 && style.positionList) ? style.positionList[index] : {};
                                        const itemSize = { width: item.width ? item.width : style.width, height: item.height ? item.height : style.height };
                                        return (
                                            <div key={index} style={{ ...itemSize, ...position }} className={cssStyle.itemBoxSpecial}>
                                                {this.getContentList(item, style.content, index, index)}
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index} style={{ ...itemStyle }} className={cssStyle.itemBox}>
                                                {this.getContentList(item, style.content, index - blankNum, index - blankNum)}
                                            </div>
                                        )
                                    }
                                } else {
                                    return (
                                        <div key={index} style={{ ...itemStyle }} className={cssStyle.itemBox} />
                                    )
                                }
                            })}
                        </div>
                    }
                </Motion>
            );
        }else{
            return (
                <StaggeredMotion
                    key={defaultStyle.length}
                    defaultStyles={defaultStyle}
                    styles={prevStyles => prevStyles.map((item, i) => {
                        return i === 0
                            ? { opacity: showStatus ? this.state.opacity : 0 }
                            : {
                                opacity: spring(prevStyles[i - 1].opacity)
                            };

                    })}>
                    {interpolatingStyles =>
                        <div
                            className={`${cssStyle.box} ${style.openReflect ? cssStyle.reflect : ''} ${style.animateOne ? cssStyle.animateOne:''}`}
                            style={{ fontSize: fontSize, ...flexStyle, flexDirection: style.flexDirection, width: boxWidth, height: boxHeight, ...border, opacity: this.state.opacity }}
                            onMouseOver={this.changeIntervalStart.bind(this, false)}
                            onMouseOut={this.changeIntervalStart.bind(this, true)}
                        >
                            {resultData.map((item, index) => {
                                if (item) {
                                    if (style.itemPositionType === 2) {
                                        const position = (style.itemPositionType === 2 && style.positionList) ? style.positionList[index] : {};
                                        const itemSize = { width: item.width ? item.width : style.width, height: item.height ? item.height : style.height };
                                        return (
                                            <div key={index} style={{ ...itemSize, ...position, opacity: interpolatingStyles[index].opacity }} className={cssStyle.itemBoxSpecial}>
                                                {this.getContentList(item, style.content, index, index)}
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index} style={{ ...itemStyle, opacity: interpolatingStyles[index].opacity }} className={cssStyle.itemBox}>
                                                {this.getContentList(item, style.content, index - blankNum, index - blankNum)}
                                            </div>
                                        )
                                    }
                                } else {
                                    return (
                                        <div key={index} style={{ ...itemStyle, opacity: interpolatingStyles[index].opacity }} className={cssStyle.itemBox} />
                                    )
                                }
                            })}
                        </div>
                    }
                </StaggeredMotion>
            );
        }
    }

    render() {
        const { style } = this.props.thisData;
        const resultData = this.state.resultData.slice();
        let boxWidth = "100%";
        let boxHeight = "100%";
        let itemStyle;
        let flexStyle = {};
        let pageNum = 1;
        let rowNum = 1;
        let columnNum = 1;
        if (style.itemPositionType === 2 || style.itemPositionType === 3) {
            itemStyle = { width: style.width, height: style.height };
            flexStyle = { justifyContent: style.justifyContent, alignItems: style.alignItems };
        } else {
            if (style.blankNum) {
                for (let i = 0; i < style.blankNum; i++) {
                    resultData.unshift('');
                }
            }
            itemStyle = getColumnNum(style, resultData);
            if (style.rowNum) {
                rowNum = style.rowNum;
                columnNum = style.columnNum ? style.columnNum : 1;
                pageNum = Math.ceil(resultData.length / (style.rowNum * columnNum));
                if (style.scrollType === 'column') {
                    boxHeight = Math.ceil(resultData.length * 100 / (style.rowNum * columnNum)) + '%';
                } else {
                    boxWidth = Math.ceil(resultData.length * 100 / (style.rowNum * columnNum)) + '%';
                }
            }
        }
        const fontSize = getCompatibleSize(style.fontSize);
        let lineHeight = 0;
        let pageHeight = 0;
        if (style.scrollType === 'column') {
            lineHeight = (parseFloat(itemStyle.height) + (style.rowGap ? style.rowGap : 0)) + '%';
            pageHeight = (parseFloat(itemStyle.height) + (style.rowGap ? style.rowGap : 0)) * rowNum + '%';
        } else {
            lineHeight = (parseFloat(itemStyle.width) + (style.columnGap ? style.columnGap : 0)) + '%';
            pageHeight = (parseFloat(itemStyle.width)+ (style.columnGap ? style.columnGap : 0)) * columnNum  + '%';
        }
        return (
            <ComponentBox style={{ ...this.props.style,fontSize: fontSize }} className={style.openReflect ? cssStyle.reflect : ''} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                {
                    this.state.resultData.length > 0 ?
                        (
                            <>
                                {style.rowNum && style.columnNum && style.rowNum*style.columnNum < resultData.length && style.itemPositionType === 1 ? (
                                    <SpringScrollbars
                                        style={{ width: '100%', height: '100%' }}
                                        className={style.showPage ? 'scrollbars-hideScroll' : ''}
                                        autoscrolltype={style.scrollType}
                                        autoMove={!style.autoSelect && style.autoMove && !style.showPage}
                                        autoSelect={style.autoSelect && style.moveDepend !== 2}
                                        lineHeight={lineHeight}
                                        pageHeight={pageHeight}
                                        interval={style.interval}
                                        selectedIndex={this.state.selectedIndex}
                                        pageSelected={this.state.pageSelected}
                                    >
                                        {this.getListContent(resultData,fontSize,boxWidth,boxHeight,flexStyle,itemStyle)}
                                    </SpringScrollbars>
                                ):this.getListContent(resultData,fontSize,boxWidth,boxHeight,flexStyle,itemStyle)}
                                {style.itemPositionType === 1 && style.showPage && this.getPageBox(pageNum)}
                            </>
                        ) :
                        (
                            <div className={cssStyle.emptyBox}>
                                {
                                    style.emptyIcon &&
                                    <img
                                        alt=""
                                        src={fileUrl + '/download/' + style.emptyIcon}
                                        className={cssStyle.emptyImg}
                                        style={{ width: style.emptyIconWidth || '5em', height: style.emptyIconHeight || '5em' }}
                                    />
                                }
                                {
                                    style.emptyTipText &&
                                    <span
                                        style={{
                                            fontSize: style.emptyFontSize,
                                            color: style.emptyFontColor,
                                            lineHeight: style.emptyLineHeight,
                                            marginTop: style.innerPadding,
                                        }}
                                        className={cssStyle.emptyText}
                                    >{style.emptyTipText}</span>
                                }
                            </div>
                        )
                }
            </ComponentBox>
        );
    }
}