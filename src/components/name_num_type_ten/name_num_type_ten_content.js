import React from "react";

import cssStyle from "./name_num_type_ten.module.css";
import {
    getColumnNum,
    getLinearBackground,
    getRadialBackground,
    getCompatibleSize,
    getNumberFormatter
} from "../../common/util";
import iconOne from "./images/sorrow.svg";
import SvgTypeOne from "../../common/svg/rectTypeOne"
import SvgTypeTwo from "../../common/svg/rectTypeTwo"

export default class NameNumTypeTen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],selectedIndex:0,show:false,showBox:false};
        this.keyParams = {};
        this.refreshTimer = [];
        this.iconList = [iconOne];
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    getItemColor(item,data,index){
        let color;
        if(item.fontColorType === 1){
            color = item.fontColor;
        }else if(item.fontColorType === 2){
            item.fontColorList.forEach((colorItem) => {
                if(colorItem.num == data[item.fontColorKey]){//eslint-disable-line
                    color = colorItem.color;
                }
            });
        }else{
            item.fontColorList.forEach((colorItem) => {
                if((index+1) >= colorItem.bottom && (index+1) < colorItem.top){
                    color = colorItem.color;
                }
            });
        }
        return color;
    }

    getText(list,split,data,allIndex,numSplit,numFixed){
        return list && (
            list.map((item,index) => {
                const returnDom = [];
                if(numSplit){
                }
                data[item.key] && returnDom.push(
                    <div key={item.key+index+'split'} style={{fontSize:item.fontSize+'em',color:this.getItemColor(item,data,allIndex),lineHeight:item.lineHeight+'em',fontWeight:item.fontWeight,padding:item.padding}}>
                        {/*{numSplit ? data[item.key].toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") : data[item.key]}*/}
                        {getNumberFormatter(numSplit,numFixed,data[item.key])}
                    </div>
                );
                //分隔符
                if(split.key && index < list.length - 1){
                    returnDom.push(
                        <div key={index+'split'} style={{fontSize:split.fontSize+'em',color:this.getItemColor(split,data,allIndex)}}>{split.key}</div>
                    );
                }
                return returnDom;
            })
        );
    }

    render() {
        const {style} = this.props.thisData;
        const resultData = this.props.resultData.slice();
        const fontSize = getCompatibleSize(style.fontSize);
        const lineWidth = getCompatibleSize(style.lineWidth);
        let itemStyle;
        if(resultData && resultData.length === 1){
            if(style.flexDirection === 'row'){
                itemStyle = {height:'100%',width:'calc(100% - '+lineWidth+' - '+lineWidth+')'};
            }else{
                itemStyle = {width:'100%',height:'calc(100% - '+lineWidth+' - '+lineWidth+')'};
            }
        }else{
            itemStyle = getColumnNum(style,resultData);
        }
        const itemBackground = getLinearBackground(style.boxColor,style.angle);
        const lineBackground = style.lineGradientType !== 'linear' ? getRadialBackground(style.lineColor) : getLinearBackground(style.lineColor,style.lineAngle);
        let startLine = {};
        let splitLine = {};
        let endLine = {};
        if(style.flexDirection === 'row'){
            startLine = {height:parseFloat(itemStyle.height)*style.startLineLong/100+'%',width:lineWidth,background:lineBackground};
            splitLine = {height:parseFloat(itemStyle.height)*style.splitLineLong/100+'%',width:lineWidth,background:lineBackground};
            endLine = {height:parseFloat(itemStyle.height)*style.endLineLong/100+'%',width:lineWidth,background:lineBackground};
        }else{
            startLine = {width:parseFloat(itemStyle.width)*style.startLineLong/100+'%',height:lineWidth,background:lineBackground};
            splitLine = {width:parseFloat(itemStyle.width)*style.splitLineLong/100+'%',height:lineWidth,background:lineBackground};
            endLine = {width:parseFloat(itemStyle.width)*style.endLineLong/100+'%',height:lineWidth,background:lineBackground};
        }
        const borderStyle = {
            borderWidth: style.borderWidth,
            borderColor: style.borderColor,
            borderStyle: style.borderStyle,
            borderRadius:style.borderRadius
        };
        const nameStyle = {
            width:style.nameWidth,
            height:style.nameHeight,
            justifyContent:style.nameJustifyContent,
            alignItems:style.nameAlignItems,
            background:style.nameBackgroundColor
        };
        const numStyle = {
            width:style.numWidth,
            height:style.numHeight,
            justifyContent:style.numJustifyContent,
            alignItems:style.numAlignItems,
            background:style.numBackgroundColor
        };
        const iconType = style.nameIconType ? style.nameIconType : 0;
        const nameIconStyle = {
            width:style.nameIconSize+'em',
            height:style.nameIconSize+'em',
            margin:style.nameIconGap+'em',
        };
        return (
            <div className={`${cssStyle.contentItem} ${cssStyle.flex}`} style={{...this.props.style,flexDirection:style.flexDirection,fontSize,backgroundColor:style.backgroundColor}} >
                {style.startLineLong ? (<div className={cssStyle.item} style={startLine}/>):null}
                {resultData.map((item,index) => {
                    if(item){
                        const returnDom = [];
                        returnDom.push(
                            <div className={`${cssStyle.item} ${cssStyle.flex}`} style={{...itemStyle,...borderStyle,flexDirection:style.itemFlexDirection,background:itemBackground,padding:style.padding+'em'}} key={index+'content'}>
                                <div className={cssStyle.flex} style={nameStyle}>
                                    {this.getText(style.nameList,style.nameSplit,item,index)}
                                    {style.nameIconShow && <img  alt={''} style={nameIconStyle} src={this.iconList[iconType]}/>}
                                </div>
                                <div className={`${cssStyle.flex} ${cssStyle.numBox}`} style={numStyle}>
                                    {style.backgroundType===1 && <SvgTypeOne className={cssStyle.numImg}/>}
                                    {style.backgroundType===2 && <SvgTypeTwo className={cssStyle.numImg}/>}
                                    {this.getText(style.numList,style.numSplit,item,index,style.numSplitShow,style.numFixed)}
                                </div>
                            </div>
                        );
                        if(index < resultData.length - 1 && style.splitLineLong && (index+1)%style.columnNum !== 0){
                            returnDom.push(<div className={cssStyle.item} style={splitLine} key={index+'splitLine'}/>)
                        }
                        return returnDom;
                    }else{
                        return <div className={`${cssStyle.item} ${cssStyle.flex}`} style={{...itemStyle,flexDirection:style.itemFlexDirection}} key={index} />;
                    }
                })}
                {style.endLineLong ? (<div className={cssStyle.item} style={endLine}/>):null}
            </div>
        );
    }
}