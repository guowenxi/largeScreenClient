import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_eleven.module.css";
import {getColumnNum, getLinearBackground, getRadialBackground, interactData} from "../../common/util";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import iconOne from "./images/sorrow.svg";
import {Tooltip} from "antd";

import "./name_num_type_eleven.css";

export default class NameNumTypeEleven extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],selectedIndex:0,show:false,showBox:false};
        this.keyParams = {};
        this.refreshTimer = [];
        this.iconList = [iconOne];
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.specialItem = [];
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.updateTime !== this.props.thisData.updateTime){
            //组件数据源变更时刷新数据
            this.getData();
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey" :
                for(let key in data.data){
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
    animateOn(){
        this.p.then(() => {
            this.setState({opacity:1});
        })
    }

    //重新获取数据
    reGetData(){
        this.setState({resultData:[]});
        this.getData(this.callBack.bind(this,''));
    }

    //获取数据后回调
    callBack(resolve,result){
        if(result){
            this.setState({resultData:result});
            if(resolve){
                resolve(result);
            }
        }
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

    getText(list,split,data,allIndex,numSplit){
        return list && (
            list.map((item,index) => {
                const returnDom = [];
                if(numSplit){
                }
                data[item.key] && returnDom.push(
                    <div key={item.key+index+'split'} style={{fontSize:item.fontSize+'em',color:this.getItemColor(item,data,allIndex)}}>
                        {numSplit ? data[item.key].toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") : data[item.key]}
                    </div>
                );
                //分隔符
                if(split.key && index < list.length - 1){
                    returnDom.push(
                        <div key={index+'split'} style={{fontSize:split.fontSize+'em',color:this.getItemColor(item,data,allIndex)}}>{split.key}</div>
                    );
                }
                return returnDom;
            })
        );
    }

    getContent(itemData){
        const {contentList} = this.props.thisData.style;
        return contentList && contentList.map((content,index) =>
            <div key={index} className={`${cssStyle.item} ${cssStyle.flex}`} style={{flexDirection:content.flexDirection,flex:1,height:'100%'}}>
                <div className={`${cssStyle.item} ${cssStyle.flex} ${cssStyle.fontColor}`} style={{width:content.nameWidth,height:content.nameHeight,fontSize:content.nameSize+'em',color:content.nameColor}}>{itemData[content.nameKey]}</div>
                <div className={`${cssStyle.item} ${cssStyle.flex} ${cssStyle.fontColor}`} style={{width:content.numWidth,height:content.numHeight,fontSize:content.numSize+'em',color:content.numColor,marginTop:'-0.08em'}}>{itemData[content.numKey]}</div>
            </div>
        );
    }

    getTip(itemData){
        const {style} = this.props.thisData;
        if(style.tipType){
            const DynamicDetails = require(`./tipContent/${style.tipType}`).default;
            return <DynamicDetails data={itemData} />
        }else{
            return null;
        }
    }

    //点击响应函数
    itemClick(selectedItem,index){
        if(this.specialItem.indexOf(index) >= 0){
            return;
        }
        const {interact} = this.props.thisData.dataSources;
        this.interactData(interact,selectedItem);
    }

    render() {
        const {style} = this.props.thisData;
        const {resultData} = this.state;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const lineWidth = this.props.getCompatibleSize(style.lineWidth);
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
            startLine = {height:style.startLineLong+'%',width:lineWidth,background:lineBackground};
            splitLine = {height:style.splitLineLong+'%',width:lineWidth,background:lineBackground};
            endLine = {height:style.endLineLong+'%',width:lineWidth,background:lineBackground};
        }else{
            startLine = {width:style.startLineLong+'%',height:lineWidth,background:lineBackground};
            splitLine = {width:style.splitLineLong+'%',height:lineWidth,background:lineBackground};
            endLine = {width:style.endLineLong+'%',height:lineWidth,background:lineBackground};
        }
        const borderStyle = {
            borderWidth: style.borderWidth,
            borderColor: style.borderColor,
            borderStyle: style.borderStyle
        };
        const nameStyle = {
            width:style.nameWidth,
            height:style.nameHeight,
            justifyContent:style.nameJustifyContent,
            alignItems:style.nameAlignItems,
            background:style.nameBackgroundColor
        };
        const contentStyle = {
            width:style.contentWidth,
            height:style.contentHeight,
        };
        const iconType = style.nameIconType ? style.nameIconType : 0;
        const nameIconStyle = {
            width:style.nameIconSize+'em',
            height:style.nameIconSize+'em',
            margin:style.nameIconGap+'em',
        };
        if(style.specialItem){
            this.specialItem = [];
            try{
                this.specialItem = JSON.parse(style.specialItem);
            }catch (e) {}
        }
        return (
            <ComponentBox style={{...this.props.style,overflow:'hidden'}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={`${cssStyle.contentItem} ${cssStyle.flex}`} style={{opacity,flexDirection:style.flexDirection,fontSize,backgroundColor:style.backgroundColor}} >
                            {style.startLineLong ? (<div className={cssStyle.item} style={startLine}/>):null}
                            {resultData.map((item,index) => {
                                if(item){
                                    const returnDom = [];
                                    returnDom.push(
                                        <div className={`${cssStyle.item} ${cssStyle.flex} ${cssStyle.point} ${this.specialItem.indexOf(index) >= 0 ? cssStyle.specialItem:''}`}
                                             style={{...itemStyle,...borderStyle,flexDirection:style.itemFlexDirection,background:itemBackground,padding:style.padding+'em'}}
                                             key={index+'content'}
                                             onClick={this.itemClick.bind(this,item,index)}
                                        >
                                            <Tooltip className={cssStyle.flex} placement="rightTop" title={this.specialItem.indexOf(index) >= 0 ? '':this.getTip(item)} >
                                                <div className={`${cssStyle.flex} ${cssStyle.title}`} style={nameStyle}>
                                                    {this.getText(style.nameList,style.nameSplit,item,index)}
                                                    {style.nameIconShow && <img alt={''} style={nameIconStyle} src={this.iconList[iconType]}/>}
                                                </div>
                                            </Tooltip>
                                            <div className={`${cssStyle.item} ${cssStyle.flex}`} style={contentStyle}>
                                                {this.getContent(item)}
                                            </div>
                                        </div>
                                    );
                                    if(index < resultData.length - 1 && style.splitLineLong){
                                        returnDom.push(<div className={cssStyle.item} style={splitLine} key={index+'splitLine'}/>)
                                    }
                                    return returnDom;
                                }else{
                                    return <div className={`${cssStyle.item} ${cssStyle.flex}`} style={{...itemStyle,flexDirection:style.itemFlexDirection}} key={index} />;
                                }
                            })}
                            {style.endLineLong ? (<div className={cssStyle.item} style={endLine}/>):null}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}