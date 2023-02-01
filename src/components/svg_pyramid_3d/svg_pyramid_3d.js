import React from "react";

import ComponentBox from "../component_box";

import cssStyle from "./svg_map.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
var _ = require('lodash');


export default class svgPyramid3d extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],showIndex:0,detail:{}};
 
        this.getData = getData.bind(this);
        this.thisRef = React.createRef();
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
        if(this.timer){
            clearTimeout(this.timer);
        }
        if(this.detailTimer){
            clearTimeout(this.detailTimer);
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
            this.filterData(result)
            if(resolve){
                resolve(result);
            }
        }
    }
    filterData(result){
        // var max = eval(result.series.join("+"));
        var max = _.sum(result.series);
        var list =[];
        var nums = [];
        result.series.map((item,idx)=>{
            list.push({
                num:item,
                rate:(item/max).toFixed(2),
                name:result.xAxis[idx]
            })
            nums.push((item/max).toFixed(2))
            return "";
        })
        this.setState({resultData:list,nums:nums});
    }
    filterColor(item){
        return {background:item  && "#000" };
    }
    filterBlock(style){
        
        if(style.flexDirection  === "column"){
            return {
                minHeight:`${style.blockSize}%`,
                maxHeight:`${style.blockSize}%`,
            }
        }else{
            return {
                minWidth:`${style.blockSize}%`,
                maxWidth:`${style.blockSize}%`,
            }
        }
    }

    render() {
        
        const {style } = this.props.thisData;
        const {colors} = style;
        const fontSize = style.fontSize ?  this.props.getCompatibleSize(style.fontSize,'num') : 12;
        let w,h;
        const { nums ,resultData } =this.state;

        let gap = 0.025;
        if(this.thisRef && this.thisRef.current){
            w = this.thisRef.current.clientWidth;
            h = this.thisRef.current.clientHeight;
        }

        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{
                            opacity,
                            fontSize,
                            flexDirection:style.flexDirection
                            }} >
                           <div className={cssStyle.pyramid} ref={this.thisRef}
                           style={this.filterBlock(style)}>
                           <svg x="0px" y="0px" width="100%" height="100%"  preserveAspectRatio="none">
                               {
                                   colors && colors.map((item,idx)=>{
                                       function filterData(item,num){
                                           let color = "#000";
                                           let opacity = 1;
                                           if(item.colorList[num] && item.colorList[num].hasOwnProperty("color")){
                                                color = item.colorList[num].color;
                                                opacity = item.colorList[num].percent;
                                           }
                                        return {"stopColor":color,"stopOpacity":opacity}
                                       }
                                       return  <defs key={idx}>
                                       <linearGradient id={`linearGradient_${idx}_s`}
                                        gradientTransform={`rotate(${Number(item.angle)})`} x1="0%" y1="0%" x2="100%" y2="0%">
                                           <stop offset="0%" style={filterData(item,0)}/>
                                           <stop offset="100%"  style={filterData(item,1)}/>
                                       </linearGradient> 
                                       <linearGradient id={`linearGradient_${idx}_e`}
                                        gradientTransform={`rotate(${Number(item.angle)})`} x1="100%" y1="0%" x2="0%" y2="0%">
                                           <stop offset="0%" style={filterData(item,0)}/>
                                           <stop offset="100%"  style={filterData(item,1)}/>
                                       </linearGradient>
                                       <linearGradient id={`linearGradient_${idx}_m`}
                                        gradientTransform={`rotate(${Number(item.angle)})`} x1="0%" y1="0%" x2="100%" y2="0%">
                                           <stop offset="0%" style={filterData(item,1)}/>
                                           <stop offset="100%"  style={filterData(item,1)}/>
                                       </linearGradient>
                                       </defs>
                                   })
                               }
                            {
                               w && h && nums.map((item,idx)=>{
                                   var idxs_1 = _.sum(nums.map(Number).slice(0,idx))
                                   var idxs_2 = _.sum(nums.map(Number).slice(0,idx+1))
                                //    var idxs_1 = eval(nums.slice(0,idx).join("+"))
                                //    var idxs_2 = eval(nums.slice(0,idx+1).join("+"))
                                //    console.log(idxs_1,idxs_2)
                                   if(item === 0) return "";
                                    if(idx === 0){
                                       return <g key={idx}>
                                       <polygon  
                                       points={`
                                       ${w/2},0 
                                       ${w/2},${h*item-h*gap} 
                                       ${w/2 -((h*item-h*gap)*0.5)},${(h*item-h*gap)*0.86}
                                       `}
                                       style={{fill:`url(#linearGradient_${idx}_s)`}} />
                                        <polygon  
                                       points={`
                                       ${w/2},0 
                                       ${w/2},${h*item-h*gap} 
                                       ${w/2 +((h*item-h*gap)*0.5)},${(h*item-h*gap)*0.86}
                                       `}
                                       style={{fill:`url(#linearGradient_${idx}_e)`}} />
                                            </g> 
                                    }else{
                                        return <g key={idx}>
                                        <polygon  
                                        points={`
                                        ${w/2},${h*idxs_1+h*gap} 
                                        ${w/2},${h*idxs_2-h*gap} 
                                        ${w/2 -((h*idxs_2-h*gap)*0.5)},${(h*idxs_2-h*gap)*0.86} 
                                        ${w/2 -((h*idxs_1+h*gap)*0.5)},${(h*idxs_1+h*gap)*0.86}
                                        `}
                                        style={{fill:`url(#linearGradient_${idx}_s)`}} />
                                        <polygon  
                                        points={`
                                        ${w/2},${h*idxs_1+h*gap} 
                                        ${w/2},${h*idxs_2-h*gap} 
                                        ${w/2 +((h*idxs_2-h*gap)*0.5)},${(h*idxs_2-h*gap)*0.86} 
                                        ${w/2 +((h*idxs_1+h*gap)*0.5)},${(h*idxs_1+h*gap)*0.86}
                                        `}
                                        style={{fill:`url(#linearGradient_${idx}_e)`}} />
                                        <polygon
                                        points={`
                                        ${w/2},${h*idxs_1+h*gap} 
                                        ${w/2 -((h*idxs_1+h*gap)*0.5)},${(h*idxs_1+h*gap)*0.86}
                                        ${w/2},${h*idxs_1-h*0.1*idx} 
                                        ${w/2 +((h*idxs_1+h*gap)*0.5)},${(h*idxs_1+h*gap)*0.86}
                                        `}
                                        style={{fill:`url(#linearGradient_${idx}_m)`}} />
                                        </g>  
                                    }
                                }).reverse()
                            }
                           </svg>
                           </div>
                           <div className={cssStyle.lengend}
                           style={{
                               padding:`0 ${style.padding}px`,
                               fontSize:`${fontSize}px`,
                               color:style.fontColor,
                               lineHeight:`${style.lineHeight}px`,
                           }}>
                               {resultData.map((item,idx)=>{
                                   return <div className={cssStyle.lengendItem}
                                   style={{
                                        minHeight:`${style.itemHeight}px`,
                                        maxHeight:`${style.itemHeight}px`,
                                   }} key={idx}>
                                       <div className={`${cssStyle.lengendItemSpan} ${cssStyle.title}`}
                                       style={{
                                           flex:5,
                                           textIndent:`${fontSize*1.1}px`
                                           }}>

                                <span className={cssStyle.titleRect}
                                style={{
                                    background:( colors[idx] && colors[idx]["colorList"][0].color) ? colors[idx]["colorList"][0].color : "#000",
                                    width:`${fontSize}px`,
                                    height:`${fontSize}px`,
                                        }}></span>{item.name}</div>
                                       <div className={`${cssStyle.lengendItemSpan} ${cssStyle.num}`}
                                        style={{flex:3}}
                                        >{item.num}</div>
                                       <div className={`${cssStyle.lengendItemSpan} ${cssStyle.rate}`}
                                        style={{flex:1}}
                                        >{(item.rate*100).toFixed(2)}%</div>
                                   </div>
                               })}
                           </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        )
    }
}