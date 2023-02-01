import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./svg_map_linan_new.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {roadPath,mapSize,roadPosition,nickName} from "./svg_data";

import detailBg from "./images/detailBg.svg";
import detailBgTwo from "./images/detailBgTwo.svg";
import pointGray from "./images/point_gray.svg";
import pointRed from "./images/point_red.svg";
import pointOrange from "./images/point_orange.svg";
import pointYellow from "./images/point_yellow.svg";
import pointBlue from "./images/point_blue.svg";
import pointGreen from "./images/point_green.svg";
import axios from "axios";
import {warningUrl} from "../../config";

export default class SvgMapLinan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],showIndex:0,detail:{},dateType:1};
        this.getData = getData.bind(this);
        this.keyParams = {};
        this.colorList = ["#CCCCCC","#FB5447","#E37F15","#FFCC00","#43BAFE","#42CA83","#CCCCCC"];
        this.pointIcon = [pointGray,pointRed,pointOrange,pointYellow,pointBlue,pointGreen,pointGray];
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
            this.setState({resultData:result});
            setTimeout(()=> this.showDetail(0,true));
            if(resolve){
                resolve(result);
            }
        }
    }

    showDetail(index,auto){
        if(this.detailTimer){
            clearTimeout(this.detailTimer);
        }
        const {resultData} = this.state;
        const {style} = this.props.thisData;
        if(resultData[index]){
            this.reGetNum = 0;
            const sendUrl = style.detailUrl ? style.detailUrl : warningUrl + '/brainManage/getOverviewInfoByRoadId';
            axios.get(sendUrl,{params:{roadId:resultData[index].roadId,rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                this.setState({detail:result,showIndex:index,showRoad:resultData[index].roadName});
                if(auto){
                    this.startTime(index);
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }else{
            this.reGetNum++;
            if(this.reGetNum < 20){
                const nextIndex = resultData.length - 1 > index ? index + 1 : 0;
                this.showDetail(nextIndex,auto);
            }
        }
    }

    startTime(index){
        const {resultData} = this.state;
        const nextIndex = resultData.length - 1 > index ? index + 1 : 0;
        this.detailTimer = setTimeout(() => this.showDetail(nextIndex,true),5000);
    }

    getDetailContent(){
        const {style} = this.props.thisData;
        const {detail,showIndex,resultData,dateType} = this.state;
        const road = resultData[showIndex];
        if(detail && detail.overviewInfoVoList && road){
            let count = 0;
            if(parseInt(dateType) === 1){
                count = detail.allNum;
            }else{
                detail.overviewInfoVoList.forEach((item) => {
                    count += parseInt(item.inscrNum);
                });
            }
            return (
                <div className={style.detailType === 2 ? cssStyle.detailBoxTwo:cssStyle.detailBox} style={{...roadPosition[road.roadName],width:style.winWidth+'em',height:style.winHeight+'em'}}>
                    <img alt={''} src={style.detailType === 2 ? detailBgTwo:detailBg} className={cssStyle.detailBg}/>
                    <div className={cssStyle.count} >
                        {count}
                    </div>
                    {style.detailType === 2 ? (
                        <div className={cssStyle.contentBox}>
                            <div className={cssStyle.content}>
                                <div className={`${cssStyle.contentItem} ${cssStyle.number}`}>{detail.overviewInfoVoList[0].totalNum}</div>
                                <div className={`${cssStyle.contentItem} ${cssStyle.title}`}>重点人员</div>
                            </div>
                            <div className={cssStyle.content}>
                                <div className={`${cssStyle.contentItem} ${cssStyle.number}`}>{detail.overviewInfoVoList[1].totalNum}</div>
                                <div className={`${cssStyle.contentItem} ${cssStyle.title}`}>预警人员</div>
                            </div>
                            <div className={cssStyle.content}>
                                <div className={`${cssStyle.contentItem} ${cssStyle.number}`}>{detail.overviewInfoVoList[2].totalNum}</div>
                                <div className={`${cssStyle.contentItem} ${cssStyle.title}`}>重点事件</div>
                            </div>
                            <div className={cssStyle.content}>
                                <div className={`${cssStyle.contentItem} ${cssStyle.number}`}>{detail.overviewInfoVoList[3].totalNum}</div>
                                <div className={`${cssStyle.contentItem} ${cssStyle.title}`}>预警事件</div>
                            </div>
                        </div>
                    ):(
                        <div className={cssStyle.contentBox}>
                            <div className={cssStyle.content}>
                                <div className={`${cssStyle.contentItem} ${cssStyle.number}`}>{parseInt(dateType) === 1 ? detail.overviewInfoVoList[0].totalNum : detail.overviewInfoVoList[0].inscrNum}</div>
                                <div className={`${cssStyle.contentItem} ${cssStyle.title}`}>预警人员</div>
                            </div>
                            <div className={cssStyle.content}>
                                <div className={`${cssStyle.contentItem} ${cssStyle.number}`}>{parseInt(dateType) === 1 ? detail.overviewInfoVoList[1].totalNum : detail.overviewInfoVoList[1].inscrNum}</div>
                                <div className={`${cssStyle.contentItem} ${cssStyle.title}`}>预警事件</div>
                            </div>
                            <div className={cssStyle.content}>
                                <div className={`${cssStyle.contentItem} ${cssStyle.number}`}>{parseInt(dateType) === 1 ? detail.overviewInfoVoList[2].totalNum : detail.overviewInfoVoList[2].inscrNum}</div>
                                <div className={`${cssStyle.contentItem} ${cssStyle.title}`}>预警单位</div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
    }

    render() {
        const {style} = this.props.thisData;
        const {resultData} = this.state;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const areaName = style.areaName ? style.areaName : 'linan';
        const mapBg = require('./images/map_bg_'+areaName+'.svg');
        const mapRoad = require('./images/map_road_'+areaName+'.svg');
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize}} >
                            <img src={mapBg} alt={''} className={cssStyle.mapBg}/>
                            <svg viewBox={`0 0 ${mapSize[areaName].width} ${mapSize[areaName].height}`} x="0px" y="0px" className={cssStyle.svg} preserveAspectRatio="none" >
                                <filter id="f1" x="0" y="0">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                                </filter>
                                {resultData && resultData.map((item,index) =>{
                                    const path = roadPath[item.roadName];
                                    if(path){
                                        if(path.type === 2){
                                            return <path className={cssStyle.polygon}  d={path.polygon} key={index} style={{fill:this.colorList[item.warningLevel],opacity:0.15}}/>;
                                        }else{
                                            return <polygon className={cssStyle.polygon}  points={path.polygon} key={index} style={{fill:this.colorList[item.warningLevel],opacity:0.15}}/>;
                                        }
                                    }else{
                                        return null;
                                    }
                                })}
                                <g filter="url(#f1)">
                                    {resultData && resultData.map((item,index) =>{
                                        const path = roadPath[item.roadName];
                                        if(path){
                                            if(path.type === 2){
                                                return <path className={cssStyle.polygon}  d={roadPath[item.roadName].polygon} key={index} style={{strokeWidth:2,stroke:this.colorList[item.warningLevel]}}/>;
                                            }else{
                                                return <polygon className={cssStyle.polygon}  points={roadPath[item.roadName].polygon} key={index} style={{strokeWidth:2,stroke:this.colorList[item.warningLevel]}}/>;
                                            }
                                        }else{
                                            return null;
                                        }
                                    })}
                                </g>
                                {resultData && resultData.map((item,index) =>{
                                    const path = roadPath[item.roadName];
                                    if(path){
                                        if(path.type === 2){
                                            return <path className={cssStyle.polygon}  d={roadPath[item.roadName].polygon} key={index} style={{stroke:this.colorList[item.warningLevel]}} />;
                                        }else{
                                            return <polygon className={cssStyle.polygon}  points={roadPath[item.roadName].polygon} key={index} style={{stroke:this.colorList[item.warningLevel]}} />;
                                        }
                                    }else{
                                        return null;
                                    }
                                })}
                            </svg>
                            {areaName !== 'longgang' ? (
                                <img src={mapRoad} alt={''} className={cssStyle.mapBg}/>
                            ):(
                                <div className={cssStyle.nameBox}>
                                    {resultData && resultData.map((item,index) =>
                                        <div key={index} style={roadPosition[item.roadName]} className={cssStyle.nameItem} >{nickName[item.roadName] ? nickName[item.roadName] : item.roadName}</div>
                                    )}
                                </div>
                            )}
                            {resultData && resultData.map((item,index) =>
                                <img
                                    alt={''} className={cssStyle.point} key={index}
                                    src={item.warningLevel == null ? pointGray : this.pointIcon[item.warningLevel]}
                                    style={{...roadPosition[item.roadName],width:style.pointWidth+'em',height:style.pointHeight+'em'}}
                                    onMouseEnter={this.showDetail.bind(this,index,false)}
                                    onMouseLeave={this.startTime.bind(this,index)}
                                />
                            )}
                            {this.getDetailContent()}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}