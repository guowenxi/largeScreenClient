import React from "react";
import ComponentBox from "../component_box";
import {Motion, spring} from "react-motion";
import axios from "axios";

import cssStyle from "./name_num_type_three.module.css";
import {interactData} from "../../common/util";

export default class NameNumTypeThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[]};
        this.interactData = interactData.bind(this);
        this.keyParams = {};
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(resolve)});
        if(this.props.firstLoad === false){
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
        this.getData();
    }

    //获取数据
    getData(resolve){
        if(this.props.thisData.dataSources.dataType === 1){
            let defaultData = [];
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            }catch (e) {
            }
            this.setState({resultData:defaultData});
            if(resolve){
                resolve(defaultData);
            }
        }else if(this.props.thisData.dataSources.dataType === 2){
            let params = {};
            try {
                params = JSON.parse(this.props.thisData.dataSources.dataParams);
            }catch (e) {}
            for(let key in this.keyParams){
                params[key] = this.keyParams[key];
            }
            axios.get(this.props.thisData.dataSources.dataUrl,{params:params}).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if(result){
                    this.setState({resultData:result});
                    if(resolve){
                        resolve(result);
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    getLineColor(lineColor){
        if(lineColor){
            let gapLineBackground = 'radial-gradient(ellipse,';
            lineColor.forEach((item,index) => {
                gapLineBackground += item.color + ' ' + item.percent + '%' + (index < lineColor.length - 1 ? ',':'');
            });
            gapLineBackground += ')';
            return gapLineBackground;
        }else{
            return '';
        }
    }

    itemClick(index){
        const {itemInteract} = this.props.thisData.style;
        if(itemInteract){
            this.interactData(itemInteract[index]);
        }
    }

    render() {
        let resultData = this.state.resultData.slice();
        const {style} = this.props.thisData;
        if(style.itemList == null){
            style.itemList = [];
        }
        const columnNum = style.columnNum ? style.columnNum : 1;
        const columnGap = style.columnGap ? style.columnGap : 0;
        const rowNum = Math.ceil(resultData.length/columnNum);
        //计算多余个数
        const subNum = rowNum*columnNum - resultData.length;
        for(let i = 0;i < subNum;i ++){
            resultData.push({});
        }
        const rowGap = style.rowGap ? style.rowGap : 0;
        const itemSize = {
            width: columnNum === 1 ? '100%' : (100 - columnGap*(columnNum - 1))/columnNum + '%',
            height: (100 - rowGap*(rowNum - 1))/rowNum + '%',
        };
        const titleKey = style.titleKey ? style.titleKey : 'name';
        const numKey = style.numKey ? style.numKey : 'num';
        const lineHeight = this.props.getCompatibleSize(style.lineHeight);
        const lineBackground = this.getLineColor(style.lineColor);
        const gapLineWidth = this.props.getCompatibleSize(style.gapLineWidth);
        const gapLineBackground = this.getLineColor(style.gapLineColor);
        const {itemInteract} = style;
        const interactLength = itemInteract ? itemInteract.length : 0;
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity}}>
                            {resultData.map((item,index) => {
                                if(index >= this.state.resultData.length){
                                    return (
                                        <div key={index} className={cssStyle.hideItem} style={itemSize}/>
                                    );
                                }else{
                                    const itemStyle = style.itemList[index] ? style.itemList[index] : {};
                                    const titleSize = this.props.getCompatibleSize(itemStyle.titleSize);
                                    const numSize = this.props.getCompatibleSize(itemStyle.numSize);
                                    const unitSize = this.props.getCompatibleSize(itemStyle.unitSize);
                                    const dataLength = item[numKey] ? item[numKey].toString().length : 1;
                                    const numBgLength = itemStyle.numBgLength && itemStyle.numBgLength > dataLength ? itemStyle.numBgLength : dataLength;
                                    return [(
                                        <div key={index} style={{...itemSize,cursor:interactLength > index ? 'pointer':''}} className={cssStyle.item} onClick={this.itemClick.bind(this,index)} >
                                            <div className={`${cssStyle.title} ${cssStyle.flexCenter}`} style={{fontSize:titleSize,color:itemStyle.titleColor}}>{item[titleKey]}</div>
                                            <div className={cssStyle.split} style={{background:lineBackground,height:lineHeight}}/>
                                            <div className={`${cssStyle.numBox} ${cssStyle.flexCenter}`}>
                                                <div className={cssStyle.numBg} style={{fontSize:numSize,color:itemStyle.numColor,height:numSize,fontFamily:itemStyle.numType === 2 ? 'LESLIE':''}}>
                                                    {itemStyle.numType === 1 ? item[numKey]:<div className={cssStyle.numBg} style={{color:itemStyle.numBgColor}}>{"88888888".slice(0,numBgLength)}</div>}
                                                    {itemStyle.numType === 1 ? null:<div className={cssStyle.num}>{item[numKey]}</div>}
                                                    <div className={cssStyle.unit} style={{fontSize:unitSize,color:itemStyle.unitColor}}>{itemStyle.unit}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ),(
                                        (gapLineWidth && (index+1)%columnNum !== 0) && <div key={index+'gap'} className={cssStyle.splitGap} style={{background:gapLineBackground,width:gapLineWidth}}/>
                                    )];
                                }
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}