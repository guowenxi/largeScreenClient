import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./svg_map_longgang.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {roadPath, roadPosition, roadViewBox, roadSelectedImg} from "./svg_data";
import Circle from "../../common/circle";

import mapBgTop from "./images/mapBgTop.svg";
import mapBgBottom from "./images/mapBgBottom.svg";
import {interactData} from "../../common/util";

export default class SvgMapLonggang extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],selectedName:''};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.keyParams = {};
        this.selectedImg = {};
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
            this.setState({resultData:result});
            if(resolve){
                resolve(result);
            }
        }
    }

    getCircleList(){
        const {style} = this.props.thisData;
        const areaName = style.areaName ? style.areaName : 'longgang';
        const {circleSizeList} = style;
        const {resultData} = this.state;
        if(circleSizeList){
            return resultData.map((road,index) => {
                for(let i = 0;i < circleSizeList.length;i ++){
                    if(road[style.baseKey] >= circleSizeList[i].bottom && road[style.baseKey] < circleSizeList[i].top){
                        const size = this.props.getCompatibleSize(circleSizeList[i].size);
                        return (
                            <div key={index} style={{...roadPosition[areaName][road.name],width:size,height:size}} className={cssStyle.circleBox}>
                                <Circle className={cssStyle.circle} id={'map_circle'+road.name} />
                            </div>
                        );
                    }
                }
                return null;
            });
        }
    }

    partClick(item){
        const {interact} = this.props.thisData.dataSources;
        if(this.state.selectedName === item.name){
            this.setState({selectedName:''});
            this.interactData(interact,{});
        }else{
            this.setState({selectedName:item.name});
            this.interactData(interact,item);
        }
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const areaName = style.areaName ? style.areaName : 'longgang';
        const thisRoadPath = roadPath[areaName];
        const {resultData} = this.state;
        let topMapImg;
        let bottomMapImg;
        if(areaName === 'longgang'){
            topMapImg = mapBgTop;
            bottomMapImg = mapBgBottom;
        }else{
            try {
                topMapImg = require('./images/map_top_'+areaName+'.svg');
            }catch (e) {}
            try {
                bottomMapImg = require('./images/map_bg_'+areaName+'.svg');
            }catch (e) {}
        }
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize}} >
                            {bottomMapImg && <img alt={''} src={bottomMapImg} className={cssStyle.mapBG}/>}
                            {style.areaName === 'longgangNew' ? (
                                <div className={cssStyle.allName}>龙港市矛调服务区域展示图</div>
                            ):(
                                <svg className={cssStyle.map} x="0px" y="0px" viewBox={roadViewBox[areaName]} preserveAspectRatio="none">
                                    <g>
                                        {resultData && resultData.map((road,index) => {
                                            const roadPart = thisRoadPath[road.name];
                                            if(roadPart){
                                                if(roadPart.type === 'path'){
                                                    return <path key={index} className={areaName === 'longgang' ? cssStyle.part:cssStyle.noColorPart} onClick={this.partClick.bind(this,road)} d={roadPart.path}/>
                                                }else{
                                                    return <polygon key={index} className={areaName === 'longgang' ? cssStyle.part:cssStyle.noColorPart} onClick={this.partClick.bind(this,road)} points={roadPart.path}/>
                                                }
                                            }else{
                                                return null;
                                            }
                                        })}
                                    </g>
                                </svg>
                            )}
                            {topMapImg && <img alt={''} src={topMapImg} className={cssStyle.mapBGTop}/>}
                            {this.state.selectedName && <img alt={''} src={roadSelectedImg[areaName][this.state.selectedName]} className={cssStyle.mapBGTop}/>}
                            {this.getCircleList()}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}