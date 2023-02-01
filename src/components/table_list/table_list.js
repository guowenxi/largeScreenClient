import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import { Modal, Pagination } from 'antd';
import SpringScrollbars from "../../common/springScrollbars";
import cssStyle from './table_list.module.css';
import ReactDom from 'react-dom'
import {
    getLinearBackground,
    getRadialBackground,
    interactData,
    changeComponentShow,
    getTypeImageEx,
    getCompatibleSize
} from "../../common/util";
import { Motion, spring } from "react-motion";
import {fileUrl} from "../../config";
import "./table_list.css";
import {PhotoSlider} from "react-photo-view";

const { confirm } = Modal;

export default class TableList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: { list: [], total: 0 },
            pageNo: props.thisData.style.pageNo ? props.thisData.style.pageNo:1,
            pageSize: 5, hoverIndex: -1, opacity: 0,
            visible: false, photoIndex: 0
        };
        this.keyParams = {};
        this.interactData = interactData.bind(this);
        this.scrollbars = React.createRef();
        this.formatter = [];
        this.hasGetFormatter = false;
        this.changeComponentShow = changeComponentShow.bind(this);
        this.rowItemRef = React.createRef();
        this.getDataTime = (new Date()).getTime();
        this.firstGetDate = true;
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if (this.props.thisData.firstLoad) {
                this.getData(resolve);
            } else {
                resolve();
            }
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
        this.setPaginationColor();
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity: 1 });
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey":
            case "dataInterchange":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                if(data.reGetData !== 2){
                    this.setState({ data: { list: [], total: 0 }, pageNo:1 },()=>{
                        this.reGetData();
                    });
                }
                break;
            case "deleteKey":
                this.keyParams = {};
                this.reGetData();
                break;
            case "reFresh":
                this.reGetData();
                break;
            case "animateOn":
                this.animateOn();
                break;
            case "showComponent":
                //显示当前组件
                this.changeComponentShow(true);
                break;
            case "hideComponent":
                //隐藏当前组件
                this.changeComponentShow(false);
                break;
            case "changeSelected":
                //切换选中
                this.setState({ selectBackgroundId: data.data.id });
                if(data.isInteract === 1){
                    const { style } = this.props.thisData;
                    const listKey = style.listKey ? style.listKey : 'list';
                    const list = this.state.data[listKey] ? this.state.data[listKey] : [];
                    for(let i = 0;i < list.length;i ++){
                        if(list[i].id === data.data.id){
                            this.itemSelect(list[i]);
                            break;
                        }
                    }
                }
                break;
            case "cancelSelect":
                this.setState({ selectBackgroundId: null });
                break;
            default:
                break;
        }
    }

    //重新获取数据
    reGetData() {
        this.getData();
    }

    // 获取数据
    getData(resolve) {
        const { freshTime } = this.props.thisData.dataSources;
        const { style } = this.props.thisData;
        this.getDataTime = (new Date()).getTime();
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
        if (freshTime) {
            this.refreshTimer = setTimeout(() => {
                this.getData();
            }, freshTime);
        }
        if (this.props.thisData.dataSources.dataType === 1) {
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            } catch (e) {
            }
            this.getDateCallBack(defaultData,resolve);
        } else if (this.props.thisData.dataSources.dataType === 2) {
            let params = {};
            try {
                params = JSON.parse(this.props.thisData.dataSources.dataParams);
            } catch (e) {
            }
            if(!this.hasInitParams && this.keyParams && typeof(this.keyParams) === 'object'){
                const {dataSources} = this.props.thisData;
                if(dataSources.sessionData){
                    // params.roadId = sessionStorage.getItem("roadId");
                    if(global.roadId){
                        params[dataSources.sessionKey ? dataSources.sessionKey:'roadId'] = global.roadId
                    }
                }
                for(let key in params){
                    if(this.keyParams[key] == null){
                        this.keyParams[key] = params[key];
                    }
                }
                this.hasInitParams = true;
            }
            for (let key in this.keyParams) {
                params[key] = this.keyParams[key];
            }
            const pageParams = {
                pageNo: this.state.pageNo,
                pageSize: style.pageSize ? style.pageSize : 20
            };
            axios.get(this.props.thisData.dataSources.dataUrl, { params: { ...params, ...pageParams, rbacToken: this.props.token } }).then((response) => {
                const result = response.data.data;
                this.getDateCallBack(result,resolve);
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    getDateCallBack(result,resolve){
        if (resolve) {
            resolve();
        }
        if(result){
            const { style } = this.props.thisData;
            const listKey = style.listKey ? style.listKey : 'list';
            const list = result[listKey] ? result[listKey] : [];
            const {pageNo} = this.state;
            const pageSize = style.pageSize ? style.pageSize : 20;
            list.forEach((resultItem,resultIndex)=>{
                resultItem.index_num = resultIndex+1;
                resultItem.all_index_num = (pageNo-1)*pageSize+resultIndex+1;
            });
            this.setState({ data: result });
            if(style.firstClick || (this.props.thisData.firstSend && this.firstGetDate)){
                if (list.length > 0) {
                    this.itemSelect(list[0]);
                }else if(style.firstEmptyClick){
                    this.itemSelect({});
                }
            }
            this.firstGetDate = false;
        }
    }

    // 显示详情
    itemSelect(listItem) {
        const { interact } = this.props.thisData.dataSources;
        const { style } = this.props.thisData;
        const primaryKey = style.primaryKey ? style.primaryKey : 'id';
        this.interactData(interact, listItem);
        this.setState({ selectBackgroundId: listItem[primaryKey] })
    }

    // 浮动响应
    toggleHover(item, index) {
        item.hoverState = !item.hoverState;
        this.setState({ hoverIndex: index });
    }

    // 分页响应
    pageChange = page => {
        this.setState({ pageNo: page }, () => {
            // this.setPaginationColor();
            // this.keyParams['pageNo'] = page;
            this.getData();
        });
    };

    // 设置分页组件色彩
    setPaginationColor() {
        let dom = document.getElementById(this.props.thisData.id);
        let thisStyle = this.props.thisData.style;
        if (dom) {
            let pagination = dom.getElementsByClassName('ant-pagination');
            if (pagination.length) {
                // 设置分页按钮样式
                ReactDom.findDOMNode(pagination[0].getElementsByClassName('ant-pagination-prev')[0].getElementsByTagName('a')[0]).style.color = thisStyle.paginationColor;
                ReactDom.findDOMNode(pagination[0].getElementsByClassName('ant-pagination-next')[0].getElementsByTagName('a')[0]).style.color = thisStyle.paginationColor;
                ReactDom.findDOMNode(pagination[0].getElementsByClassName('ant-pagination-disabled')[0]).style.opacity = 0.5;
                // 设置页码按钮样式
                let paginationA = pagination[0].getElementsByClassName('ant-pagination-item');
                if (paginationA && Array.isArray(paginationA) && paginationA.length) {
                    paginationA.forEach(function (item, index) {
                        ReactDom.findDOMNode(item).style.border = 0;
                        ReactDom.findDOMNode(item.getElementsByTagName('a')[0]).style.color = thisStyle.paginationColor;
                    })
                }
                let paginationActiveA = pagination[0].getElementsByClassName('ant-pagination-item-active');
                if (paginationActiveA.length) {
                    paginationActiveA.forEach(function (item, index) {
                        ReactDom.findDOMNode(item).style.border = '1px solid ' + thisStyle.paginationActiveColor;
                        ReactDom.findDOMNode(item.getElementsByTagName('a')[0]).style.color = thisStyle.paginationActiveColor;
                    })
                }
            }
        }
    }

    getColumnFormatter() {
        const { style } = this.props.thisData;
        style.column && style.column.forEach((item, index) => {
            if (item.formatter) {
                try {
                    // eslint-disable-next-line no-eval
                    this.formatter[index] = eval(item.formatter).bind(this);
                } catch (e) {
                    this.formatter[index] = null;
                }
            } else {
                this.formatter[index] = null;
            }
        });
        this.hasGetFormatter = true;
    }

    getJustifyContent(item) {
        let justifyContent;
        if (item.justifyContent) {
            justifyContent = item.justifyContent;
        } else {
            switch (item.textAlign) {
                case 'left':
                    justifyContent = 'flex-start';
                    break;
                case 'center':
                    justifyContent = 'center';
                    break;
                case 'right':
                    justifyContent = 'flex-end';
                    break;
                default:
            }
        }
        return justifyContent;
    }

    //临安交办
    linanAssigned(column, item, e) {
        e.stopPropagation();
        confirm({
            title: '确定要进行交办吗？',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                return new Promise((resolve) => {
                    axios.post(column.operationUrl, { id: item.id, rbacToken: this.props.token }, {}).then((response) => {
                        resolve();
                        if (response.data.success) {
                            Modal.success({
                                content: '已完成交办。',
                            });
                            this.reGetData();
                        } else {
                            Modal.error({
                                content: response.data.data,
                            });
                        }
                    }).catch(function (error) {
                        resolve();
                        // 处理请求出错的情况
                        Modal.error({
                            content: '请求失败！',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel: () => { },
        });
    }

    wzmzxShowImg(imgList){
        this.setState({ wzmzxImg:imgList,photoIndex: 0, visible: true });
    }

    operationInteract(operationInteract,item){
        this.interactData(operationInteract,item);
    }

    //获取操作展示内容
    getOperationContent(column, item) {
        switch (column.operationType) {
            case 'operation':
                return (
                    <React.Fragment >
                        <div className={cssStyle.operation} onClick={this.operationInteract.bind(this, column.operationInteract,item)}>
                            {column.operationText}
                        </div>
                    </React.Fragment>
                );
            case 'linanAssigned':
                if (!item.isCollaboration) {
                    return (
                        <React.Fragment >
                            <div className={cssStyle.operationButton} onClick={this.linanAssigned.bind(this, column, item)}>
                                交办
                            </div>
                        </React.Fragment>
                    );
                } else {
                    return '-';
                }
            case 'wzmzxShowImg':
                if (column.imageKey && item[column.imageKey]) {
                    return (
                        <React.Fragment >
                            <div className={cssStyle.wzmzxShowImgButton} onClick={this.wzmzxShowImg.bind(this, item[column.imageKey])}>
                                查看
                            </div>
                        </React.Fragment>
                    );
                } else {
                    return '-';
                }
            case 'operationYqshzl':
                return (
                    <React.Fragment >
                        <div className={cssStyle.operationYqshzl} >
                            查看详情
                        </div>
                        <div className={cssStyle.operationYqshzl} onClick={this.operationYqshzl.bind(this, column,item, 'turnTo')}>
                            流转
                        </div>
                        <div className={cssStyle.operationYqshzl} onClick={this.operationYqshzl.bind(this, column,item, 'assign')}>
                            交办
                        </div>
                        <div className={cssStyle.operationYqshzl} onClick={this.operationYqshzl.bind(this, column,item, 'ignore')}>
                            忽略
                        </div>
                        <div className={cssStyle.operationYqshzl} onClick={this.operationYqshzl.bind(this, column,item, 'oversee')}>
                            督办
                        </div>
                    </React.Fragment>
                );
            case 'other':
                break;
            default:
        }
    }

    operationYqshzl(column, item, type,e){
        console.log('xxx');
        switch (type) {
            case 'turnTo':
                e.stopPropagation();
                this.interactData(column.turnToInteract, item);
                break;
            case 'assign':
                e.stopPropagation();
                this.interactData(column.assignInteract, item);
                break;
            case 'ignore':
                e.stopPropagation();
                confirm({
                    title: '确定要忽略这条预警吗？',
                    content: '忽略预警后无法恢复，请谨慎操作。',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        const sendData = {
                            rbacToken: this.props.token,
                        };
                        return new Promise((resolve) => {
                            axios.post("/socialGovernance/equipment/anwser", sendData, { params: { rbacToken: this.props.token } }).then((response) => {
                                resolve();
                                if (response.data.success) {
                                    Modal.success({
                                        content: '已忽略',
                                    });
                                } else {
                                    Modal.error({
                                        content: response.data.message,
                                    });
                                }
                            }).catch((error) => {
                                resolve();
                                Modal.error({
                                    content: '忽略请求出错！',
                                });
                            });
                        }).catch(() => console.log('Oops errors!'));
                    },
                    onCancel: () => { },
                });
                break;
            case 'oversee':
                e.stopPropagation();
                this.interactData(column.overseeInteract, item);
                break;
            default:
        }
    }

    columnClick(outerItem, innerItem, e) {
        if (innerItem.actionType === 2) {
            e.stopPropagation();
            if (innerItem.interact) {
                this.interactData(innerItem.interact, outerItem);
            }
        }
    }

    getTotalShow(total){
        const { style } = this.props.thisData;
        if(style.showTotal){
            return `共${total}条`;
        }else{
            return '';
        }
    }

    render() {
        const {visible,photoIndex,wzmzxImg,selectBackgroundId} = this.state;
        const { style } = this.props.thisData;
        const primaryKey = style.primaryKey ? style.primaryKey : 'id';
        const pageFontSize = getCompatibleSize(style.pageFontSize);
        const listKey = style.listKey ? style.listKey : 'list';
        const countKey = style.countKey ? style.countKey : 'total';
        const list = Array.isArray(this.state.data) ? this.state.data : (this.state.data[listKey] ? this.state.data[listKey] : []);
        const total = this.state.data[countKey] ? parseInt(this.state.data[countKey]) : 0;
        const pageSize = style.pageSize ? style.pageSize : 20;
        const pageNo = parseInt(this.state.pageNo);
        const headHeight = style.titleHeight ? this.props.getCompatibleSize(style.titleHeight) : '0px';
        const lineHeight = style.lineHeight ? this.props.getCompatibleSize(style.lineHeight, 'num') : null;
        const pageHeight = style.pageHeight ? this.props.getCompatibleSize(style.pageHeight) : '0px';
        const contentFontSize = this.props.getCompatibleSize(style.contentFontSize);
        const titleFontSize = this.props.getCompatibleSize(style.titleFontSize);
        !this.hasGetFormatter && this.getColumnFormatter();
        const contentHoverBg = style.contentHoverBgType === 2 ? (style.backgroundGradientType === 'radial' ? getRadialBackground(style.boxColor) : getLinearBackground(style.boxColor, style.angle)) : style.contentHoverBg;
        const selectContentHoverBg = style.selectContentHoverBgType === 2 ? (style.selectBackgroundGradientType !== 'linear' ? getRadialBackground(style.selectBoxColor) : getLinearBackground(style.selectBoxColor, style.selectAngle)) : style.selectContentHoverBg;
        const border = { borderStyle: style.borderStyleBox, borderWidth: style.borderWidthBox, borderColor: style.borderColorBox, borderRadius: style.borderRadiusBox };
        const itemContentBorder = style.contentItemBorderWidth ? `${style.contentItemBorderWidth} ${style.contentItemBorderStyle} ${style.contentItemBorderColor}` : 'none';
        const itemTitleBorder = style.itemBorderWidth ? `${style.itemBorderWidth} ${style.itemBorderColor} ${style.itemBorderStyle}` : 'none';
        return (
            <ComponentBox id={this.props.thisData.id} thisData={this.props.thisData} style={this.props.style}
                receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)}>
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div style={{ backgroundColor: style.backgroundColor, opacity, ...border }} className={cssStyle.box}>
                            <ul className={cssStyle.header}
                                style={{
                                    display: style.titleShow === 1 ? '' : 'none',
                                    height: headHeight,
                                    fontSize: titleFontSize,
                                    fontWeight: style.titleFontWeight,
                                    color: style.titleColor,
                                    background: style.titleBg,
                                    borderStyle: style.borderStyle,
                                    borderRadius: style.borderRadius,
                                    borderColor: style.borderColor,
                                    borderWidth: style.borderWidth,
                                }}
                            >
                                {
                                    style.indexShow && <li
                                        style={{
                                            width: style.indexWidth,
                                            textAlign: style.indexAlign,
                                            justifyContent: this.getJustifyContent({textAlign:style.indexAlign}),
                                            padding: style.itemPadding,
                                            height: '100%',
                                            borderRight: itemTitleBorder,
                                            borderBottom: itemTitleBorder,
                                        }}
                                    >
                                        <p className={cssStyle.titleText}>{style.name}</p>
                                    </li>
                                }
                                {style.column.map((item, index, arr) => {
                                    return (
                                        <li key={index} style={{
                                            width: item.columnWidth,
                                            textAlign: item.textAlign,
                                            justifyContent: this.getJustifyContent(item),
                                            padding: style.itemPadding,
                                            height: '100%',
                                            borderBottom: itemTitleBorder,
                                            borderRight: arr.length - 1 === index ? 'none' : itemTitleBorder,
                                        }}>
                                            <p className={cssStyle.titleText}>{item.showName}</p>
                                        </li>
                                    );
                                })}
                            </ul>
                            <SpringScrollbars className={style.scrollbarsTheme} key={this.getDataTime} autoMove={this.props.thisData.showStatus && style.autoMove && ((selectBackgroundId&&!style.selectedStop) || !selectBackgroundId)} lineHeight={lineHeight} interval={style.interval} ref={this.scrollbars} style={{ height: 'calc(100% - ' + (style.titleShow ? headHeight : '0px') + ' - ' + (style.paginationShow ? pageHeight : '0px') + ')', background: style.contentBg }}>
                                {list.map((outerItem, outerIndex, outerArr) => {
                                    const selectedColor = style.contentHoverShow && outerItem.hoverState && this.state.hoverIndex === outerIndex;
                                    let animateCss = '';
                                    if (style.rowAnimateOpen && style.rowAnimateKey && outerItem[style.rowAnimateKey] + '' === style.rowAnimateValue) {
                                        animateCss = cssStyle.twinkle;
                                    }
                                    return (
                                        <ul className={`${cssStyle.listMain} ${animateCss}`} key={outerIndex}
                                            onMouseEnter={this.toggleHover.bind(this, outerItem, outerIndex)}
                                            onMouseLeave={this.toggleHover.bind(this, outerItem, outerIndex)}
                                            onClick={this.itemSelect.bind(this, outerItem, outerIndex)}
                                            style={{
                                                height: lineHeight + 'px',
                                                lineHeight: style.fontHeight + 'em',
                                                fontSize: contentFontSize,
                                                fontWeight: style.contentFontWeight,
                                                background: selectedColor ? contentHoverBg : (this.state.selectBackgroundId === outerItem[primaryKey] && selectContentHoverBg ? selectContentHoverBg : (style.numberBackground || style.oddBackground ? (outerIndex % 2 === 0 ? style.numberBackground : style.oddBackground) : (outerIndex % 2 === 0 ? 'rgba(3,110,184,0.07)' : ''))),
                                                margin: style.lineMargin,
                                                borderWidth: this.state.selectBackground === outerIndex ? style.selectBorderWidth : '0px',
                                                borderColor: this.state.selectBackground === outerIndex ? style.selectBorderColor : '',
                                                borderStyle: this.state.selectBackground === outerIndex && style.selectBorderWidth && style.selectBorderColor ? 'solid' : '',
                                            }}
                                            ref={outerArr.length - 1 === outerIndex ? this.rowItemRef : null}
                                        >
                                            {style.indexShow && <li
                                                style={{
                                                    width: style.indexWidth,
                                                    textAlign: style.indexAlign,
                                                    justifyContent: this.getJustifyContent({ textAlign: style.indexAlign }),
                                                    color: selectedColor ? style.contentHoverColor : style.indexColor,
                                                    height: '100%',
                                                    padding: style.itemPadding,
                                                    // border: '1px solid #153F57',
                                                    borderBottom: itemContentBorder,
                                                    borderRight: itemContentBorder,
                                                }}
                                            >{(style.indexCumulative ? pageSize*(pageNo-1):0)+(outerIndex + 1)}</li>}
                                            {style.column.map((innerItem, innerIndex, innerArr) => {
                                                let fontColor;
                                                let spicaleSize;
                                                const colorKeyName = innerItem.colorKeyName ? innerItem.colorKeyName : innerItem.keyName;
                                                if (innerItem.colorType === 2) {
                                                    if (innerItem.calculateType === 1) {
                                                        for (let i = 0; i < innerItem.calculateList.length; i++) {
                                                            if (innerItem.calculateList[i].value == outerItem[colorKeyName]) {//eslint-disable-line
                                                                fontColor = innerItem.calculateList[i].color;
                                                                spicaleSize = innerItem.calculateList[i].spicaleSize ? this.props.getCompatibleSize(innerItem.calculateList[i].spicaleSize) : contentFontSize;
                                                                break;
                                                            }
                                                        }
                                                    } else if (innerItem.calculateType === 2 && innerItem.calculateList != null) {
                                                        for (let i = 0; i < innerItem.calculateList.length; i++) {
                                                            let moreType = true;
                                                            let lessType = true;
                                                            if (innerItem.calculateList[i].less != null && innerItem.calculateList[i].less !== "" && innerItem.calculateList[i].less <= outerItem[colorKeyName]) {
                                                                lessType = false;
                                                            }
                                                            if (innerItem.calculateList[i].more != null && innerItem.calculateList[i].more !== "" && innerItem.calculateList[i].more > outerItem[colorKeyName]) {
                                                                moreType = false;
                                                            }
                                                            if (moreType && lessType) {
                                                                fontColor = innerItem.calculateList[i].color;
                                                                spicaleSize = innerItem.calculateList[i].spicaleSize ? this.props.getCompatibleSize(innerItem.calculateList[i].spicaleSize) : contentFontSize;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    fontColor = innerItem.fontColor ? innerItem.fontColor : (selectedColor ? style.contentHoverColor : style.contentColor);
                                                }
                                                let itemData = outerItem[innerItem.keyName];
                                                let itemContent;
                                                let titleBg;
                                                if (innerItem.contentShowType === 'operation') {
                                                    itemContent = this.getOperationContent(innerItem, outerItem);
                                                } else {
                                                    if (innerItem.contentType === 2) {
                                                        //若为图片内容
                                                        const thisImage = getTypeImageEx(innerItem.imageList, itemData, innerItem.imageCalculateType);
                                                        if(thisImage){
                                                            itemContent = <img alt={''} src={thisImage ? fileUrl + '/download/' + thisImage : ''} className={cssStyle.image} />;
                                                        }else{
                                                            let returnText;
                                                            if(innerItem.noSubShowType === 1){
                                                                returnText = itemData;
                                                            }else{
                                                                returnText = innerItem.noSubShowText;
                                                            }
                                                            itemContent = <div className={cssStyle.valueBox} dangerouslySetInnerHTML={{ __html: returnText }} style={{ textAlign: innerItem.textAlign || this.getJustifyContent(innerItem), whiteSpace: innerItem.textWrap === 1 ? 'normal' : 'nowrap' }} title={returnText} />
                                                        }
                                                    } else if (innerItem.contentType === 3) {
                                                        //若为图片背景加文字
                                                        let thisText = itemData;
                                                        if (this.formatter[innerIndex] != null) {
                                                            thisText = this.formatter[innerIndex](itemData,outerItem);
                                                        }
                                                        const thisImage = getTypeImageEx(innerItem.imageList, itemData, innerItem.imageCalculateType);
                                                        itemContent = (
                                                            <div className={cssStyle.innerItemBox} style={{ width: innerItem.imageBgWidth + 'em', height: innerItem.imageBgHeight + 'em' }}>
                                                                <img alt={''} src={thisImage ? fileUrl + '/download/' + thisImage : ''} className={cssStyle.imageBg} />
                                                                <div className={cssStyle.valueBox} dangerouslySetInnerHTML={{ __html: thisText }} style={{ whiteSpace: innerItem.textWrap === 1 ? 'normal' : 'nowrap' }} />
                                                            </div>
                                                        );
                                                    } else {
                                                        //若为纯文本
                                                        if (this.formatter[innerIndex] != null) {
                                                            itemData = this.formatter[innerIndex](itemData,outerItem);
                                                        }
                                                        itemContent = <div className={cssStyle.valueBox} dangerouslySetInnerHTML={{ __html: itemData }} style={{ textAlign: innerItem.textAlign || this.getJustifyContent(innerItem), whiteSpace: innerItem.textWrap === 1 ? 'normal' : 'nowrap' }} title={itemData} />
                                                    }
                                                    if (innerItem.titleImg && innerItem.titleImgKey) {
                                                        titleBg = getTypeImageEx(innerItem.titleImg, outerItem[innerItem.titleImgKey], innerItem.titleImgCalculateType);
                                                    }
                                                }
                                                return (
                                                    <li key={innerIndex}
                                                        style={{
                                                            width: innerItem.columnWidth,
                                                            color: fontColor,
                                                            textAlign: innerItem.textAlign,
                                                            justifyContent: this.getJustifyContent(innerItem),
                                                            fontSize: spicaleSize,
                                                            padding: style.itemPadding,
                                                            // border: '1px solid #153F57',
                                                            borderRight: innerArr.length - 1 === innerIndex ? 'none' : itemContentBorder,
                                                            borderBottom: itemContentBorder,
                                                        }}
                                                        onClick={this.columnClick.bind(this, outerItem, innerItem)}
                                                    >
                                                        {itemContent}
                                                        {innerItem.showAdditionalImg === 1 && <img alt="" src={titleBg ? fileUrl + '/download/' + titleBg : ''} style={{ width: style.imgWidth ? style.imgWidth : innerItem.imgWidth, height: style.imgHeight ? style.imgHeight : innerItem.imgHeight }} />}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )
                                })}

                                {
                                    (!!style.criticalItemNumber && list.length <= style.criticalItemNumber) &&
                                    (<div style={{ height: `calc(100% - ${lineHeight * list.length}px)` }}>
                                        <img
                                            style={{
                                                position: 'relative',
                                                left: style.iconLeft,
                                                top: style.iconTop,
                                                width: style.iconWidth,
                                                height: style.iconHeight,
                                            }}
                                            src={fileUrl + '/download/' + style.icon}
                                            alt=""
                                        />
                                    </div>)
                                }
                            </SpringScrollbars>
                            <Pagination size="small" total={total} current={pageNo} pageSize={pageSize}
                                simple={!!style.simplePage}
                                onChange={this.pageChange.bind(this)}
                                className={`${cssStyle.page} ${style.theme}`}
                                showTotal={this.getTotalShow.bind(this)}
                                style={{
                                    display: style.paginationShow === 1 ? 'block' : 'none',
                                    height: pageHeight,
                                    lineHeight: pageHeight,
                                    textAlign: style.paginationAlign,
                                    background: style.paginationBg,
                                    fontSize: pageFontSize,
                                    marginTop: style.pageTop + 'em'
                                }} />
                            {this.state.visible && (
                                <PhotoSlider
                                    images={wzmzxImg.map((item) => ({ src: item }))}
                                    visible={visible}
                                    onClose={() => this.setState({ visible: false })}
                                    onIndexChange={(index) => this.setState({ photoIndex: index })}
                                    index={photoIndex}
                                />
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}