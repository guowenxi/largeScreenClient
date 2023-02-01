import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./svg_map.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {SVG} from "@svgdotjs/svg.js";
import {roadPath} from "./svg_data";

export default class SvgMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],showIndex:0,detail:{}};
        this.getData = getData.bind(this);
        this.saveRef = ref => {this.refDom = ref};
        this.reGetNum = 0;
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
            const {style} = this.props.thisData;
            const svgWidth = style.svgWidth || 1822;
            const svgHeight = style.svgHeight || 969.7;
            const {colorList} = style;
            const draw = SVG().addTo('#'+this.props.id+'_svg').viewbox(0,0,svgWidth,svgHeight).size('100%','100%').attr({preserveAspectRatio:"none"});
            result.forEach((road) => {
                const svgPath = roadPath[road[style.matchkey]];
                if(svgPath){
                    if(colorList && colorList.length > 0){
                        for(let i = 0;i < colorList.length;i ++){
                            if(road[style.baseKey] >= colorList[i].bottom && road[style.baseKey] < colorList[i].top){
                                if(style.svgType === 'path'){
                                    draw.path(svgPath).attr({fill:colorList[i].color,id:road.name});
                                }else{
                                    draw.polygon(svgPath).attr({fill:colorList[i].color,id:road.name});
                                }
                            }
                        }
                    }else{
                        draw.polygon(svgPath).attr({fill:'rgba(0,0,0,0)',id:road.name});
                    }
                }
            });
            this.setState({resultData:result});
            if(resolve){
                resolve(result);
            }
        }
    }

    render() {
        const {style} = this.props.thisData;
        const {colorList} = style;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const barHeight = this.props.getCompatibleSize(style.barHeight);
        const legendLength = colorList ? colorList.length : 0;
        const barGap = style.barGap || 1;
        const legendWidth = (100 - barGap*(legendLength-1))/legendLength + '%';
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize}} >
                            <div className={cssStyle.map} ref={this.saveRef} id={this.props.id+'_svg'} style={{width:style.mapWidth+'%',height:style.mapHeight+'%',left:style.mapLeft+'%',top:style.mapTop+'%'}}/>
                            <div className={cssStyle.legend} style={{width:style.legendWidth+'%',height:style.legendHeight+'%',left:style.legendLeft+'%',top:style.legendTop+'%'}}>
                                <div className={cssStyle.legendBar} style={{height:barHeight}}>
                                    {colorList && colorList.map((item,index) =>
                                        <div className={cssStyle.legendItem} style={{width:legendWidth,backgroundColor:item.color}} key={index}/>
                                    )}
                                </div>
                                {legendLength > 0 && (
                                    <div className={cssStyle.legendNum} style={{fontSize,lineHeight:style.lineHeight + 'em'}}>
                                        <div style={{color:colorList[0].color}}>{colorList[0].bottom}</div>
                                        <div style={{color:colorList[legendLength-1].color}}>{colorList[legendLength-1].top}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}