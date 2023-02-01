import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./svg_map_ouhai.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {roadPath,roadPosition,partPath} from "./svg_data";

import mapBgTop from "./images/mapBgTop.svg";
import mapBgBottom from "./images/mapBgBottom.svg";
import mapBgPart from "./images/map_part.svg";
import detailBg from "./images/detailBg.svg";

import redIcon from "./images/red.svg";
import orangeIcon from "./images/orange.svg";
import yellowIcon from "./images/yellow.svg";
import blueIcon from "./images/blue.svg";
import greenIcon from "./images/green.svg";
import redCircle from "./images/circle_red.svg";
import orangeCircle from "./images/circle_orange.svg";
import yellowCircle from "./images/circle_yellow.svg";
import blueCircle from "./images/circle_blue.svg";
import greenCircle from "./images/circle_green.svg";
import grayCircle from "./images/circle_gray.svg";
import {interactData} from "../../common/util";

export default class SvgMapOuhai extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],showIndex:0,detail:{},dateType:1,detailIndex:-1};
        this.getData = getData.bind(this);
        this.keyParams = {};
        this.colorList = ["#CCCCCC","#ff6666","#f3874a","#fed33a","#1aa9fe","#19d031","#CCCCCC"];
        this.levelNameList = ["灰色","红色","橙色","黄色","蓝色","绿色","灰色"];
        this.iconList = ["",redIcon,orangeIcon,yellowIcon,blueIcon,greenIcon,""];
        this.circleList = [grayCircle,redCircle,orangeCircle,yellowCircle,blueCircle,greenCircle,grayCircle];
        this.interactData = interactData.bind(this);
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
                if(data.data.dateType){
                    this.setState({dateType:data.data.dateType});
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
            this.setState({resultData:result,detail:this.state.detailIndex >= 0 ? result[this.state.detailIndex]:{}});
            if(resolve){
                resolve(result);
            }
        }
    }

    partClick(road,index){
        if(index === this.state.detailIndex){
            this.setState({detail:{},detailIndex:-1});
        }else{
            this.setState({detail:road,detailIndex:index});
        }
    }

    detailClick(){
        const {interact} = this.props.thisData.dataSources;
        this.interactData(interact,this.state.detail);
    }

    render() {
        const {style} = this.props.thisData;
        const {resultData,detail,detailIndex} = this.state;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const roadKey = style.roadKey ? style.roadKey : 'roadName';
        const levelKey = style.levelKey ? style.levelKey : 'warningLevel';
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize}} >
                            <img alt={''} src={mapBgBottom} className={cssStyle.mapBG}/>
                            <svg className={cssStyle.map} x="0px" y="0px" viewBox="0 0 1500 1080" preserveAspectRatio="none">
                                <filter id={`filter_${this.props.thisData.id}`} x="0" y="0">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
                                </filter>
                                <g>
                                    {resultData && resultData.map((road,index) => {
                                        const roadName = road[roadKey];
                                        const warningLevel = road[levelKey];
                                        const roadPart = roadPath[roadName];
                                        if(roadPart){
                                            return (
                                                <g key={index} clipPath={`url(#clipPath_${roadName})`}>
                                                    <clipPath id={`clipPath_${roadName}`}>
                                                        <path d={roadPart.polygon} />
                                                    </clipPath>
                                                    <path
                                                        filter={`url(#filter_${this.props.thisData.id})`}
                                                        className={cssStyle.partLine}
                                                        d={roadPart.polygon}
                                                        style={{stroke:this.colorList[warningLevel]}}
                                                    />
                                                    <path
                                                        className={cssStyle.part}
                                                        onClick={this.partClick.bind(this,road,index)}
                                                        d={roadPart.polygon}
                                                        style={{stroke:this.colorList[warningLevel],fill:this.colorList[warningLevel]}}
                                                    />
                                                </g>
                                            )
                                        }else{
                                            if(roadName === '经济开发区'){
                                                this.partRoad = road;
                                                this.partLevel = warningLevel;
                                                this.partIndex = index;
                                            }
                                            return null;
                                        }
                                    })}
                                </g>
                            </svg>
                            <img alt={''} src={mapBgPart} className={cssStyle.mapBGTop}/>
                            <svg className={cssStyle.mapBGTop} x="0px" y="0px" viewBox="0 0 1500 1080" preserveAspectRatio="none">
                                <filter id={`filter_part_${this.props.thisData.id}`} x="0" y="0">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                                </filter>
                                <g>
                                    {partPath && partPath.map((roadPart,index) => {
                                        const roadName = '经济开发区';
                                        const road = this.partRoad;
                                        const warningLevel = this.partLevel;
                                        if(roadPart.type === 1){
                                            return (
                                                <g key={index} clipPath={`url(#clipPath_${roadName+index})`}>
                                                    <clipPath id={`clipPath_${roadName+index}`}>
                                                        <path d={roadPart.polygon} />
                                                    </clipPath>
                                                    <path
                                                        filter={`url(#filter_part_${this.props.thisData.id})`}
                                                        className={`${cssStyle.partLine} ${cssStyle.specialPartLine}`}
                                                        d={roadPart.polygon}
                                                        style={{stroke:this.colorList[warningLevel]}}
                                                    />
                                                    <path
                                                        className={`${cssStyle.part} ${cssStyle.specialPart}`}
                                                        onClick={this.partClick.bind(this,road,this.partIndex)}
                                                        d={roadPart.polygon}
                                                        style={{stroke:this.colorList[warningLevel],fill:this.colorList[warningLevel]}}
                                                    />
                                                </g>
                                            )
                                        }else{
                                            return (
                                                <g key={index} clipPath={`url(#clipPath_${roadName+index})`}>
                                                    <clipPath id={`clipPath_${roadName+index}`}>
                                                        <polygon points={roadPart.polygon} />
                                                    </clipPath>
                                                    <polygon
                                                        filter={`url(#filter_part_${this.props.thisData.id})`}
                                                        className={`${cssStyle.partLine} ${cssStyle.specialPartLine}`}
                                                        points={roadPart.polygon}
                                                        style={{stroke:this.colorList[warningLevel]}}
                                                    />
                                                    <polygon
                                                        className={`${cssStyle.part} ${cssStyle.specialPart}`}
                                                        onClick={this.partClick.bind(this,road,this.partIndex)}
                                                        points={roadPart.polygon}
                                                        style={{stroke:this.colorList[warningLevel],fill:this.colorList[warningLevel]}}
                                                    />
                                                </g>
                                            )
                                        }
                                    })}
                                </g>
                            </svg>
                            <img alt={''} src={mapBgTop} className={cssStyle.mapBGTop}/>
                            {detailIndex >= 0 && (
                                <div className={cssStyle.detailBox} style={roadPosition[detail[roadKey]]}>
                                    <img src={detailBg} alt={''} className={cssStyle.boxBg} />
                                    <div className={cssStyle.head} onClick={this.detailClick.bind(this)}>{detail.roadName}</div>
                                    <div className={cssStyle.content}>
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.title}>事件数：</div>
                                            <div className={cssStyle.blue}>{detail.count}</div>
                                        </div>
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.title}>指数：</div>
                                            <div style={{color:this.colorList[detail[levelKey]]}}>{detail.num}</div>
                                        </div>
                                        <div className={cssStyle.itemBox} style={{width:'100%'}}>
                                            <div className={cssStyle.title}>预警等级：</div>
                                            {this.iconList[detail[levelKey]] && <img alt={''} src={this.iconList[detail[levelKey]]} className={cssStyle.icon}/>}
                                            <div style={{color:this.colorList[detail[levelKey]]}}>{this.levelNameList[detail[levelKey]]}</div>
                                        </div>
                                    </div>
                                    <img className={cssStyle.circle} alt={''} src={this.circleList[detail[levelKey]]}/>
                                </div>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}