import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./svg_map_linan.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {SVG} from "@svgdotjs/svg.js";
import {roadPath, roadPosition} from "./svg_data";
import {warningUrl} from "../../config";

// import mapBG from "./images/map_linan.svg";
import axios from "axios";
import iconOne from "./images/zhu_none.svg";
import iconTwo from "./images/zhu_di.svg";
import iconThree from "./images/zhu_zhong2.svg";
import iconFour from "./images/zhu_zhong1.svg";
import iconFive from "./images/zhu_gao.svg";
import iconOneEx from "./images/zhu_kong_ex.svg";
import iconTwoEx from "./images/zhu_di_ex.svg";
import iconThreeEx from "./images/zhu_zhong2_ex.svg";
import iconFourEx from "./images/zhu_zhong1_ex.svg";
import iconFiveEx from "./images/zhu_gao_ex.svg";

export default class SvgMapLinan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],showIndex:0,detail:{},dateType:1};
        this.getData = getData.bind(this);
        this.saveRef = ref => {this.refDom = ref};
        this.reGetNum = 0;
        this.colorList = ['rgb(119,120,120)','rgba(178,66,67)','rgba(178,128,38)','rgba(197,180,15)','#379add','rgba(51,226,68)','rgb(119,120,120)'];
        this.iconList = [iconOne,iconTwo,iconThree,iconFour,iconFive];
        this.iconExList = [iconOneEx,iconTwoEx,iconThreeEx,iconFourEx,iconFiveEx];
        this.keyParams = {};
    }

    //组件加载触发函数
    componentDidMount() {
        // this.timer = setTimeout(() => this.drawSvg());
        this.p = new Promise((resolve) => {this.drawSvg();this.getData(this.callBack.bind(this,resolve))});
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
            let hasLevel = false;
            result.forEach((road) => {
                const dom = SVG('#'+road.roadName);
                if(dom){
                    switch (road.warningLevel) {
                        case 1:
                            hasLevel = true;
                            dom.fill('rgba(178,66,67)');
                            break;
                        case 2:
                            hasLevel = true;
                            dom.fill('rgba(178,128,38)');
                            break;
                        case 3:
                            hasLevel = true;
                            dom.fill('rgba(197,180,15)');
                            break;
                        case 4:
                            hasLevel = true;
                            dom.fill('rgba(6,64,111)');
                            break;
                        case 5:
                            hasLevel = true;
                            dom.fill('rgba(25,126,35)');
                            break;
                        default:
                    }
                }
            });
            this.setState({resultData:result});
            if(hasLevel){
                this.showDetail(0,true);
            }
            if(resolve){
                resolve(result);
            }
        }
    }

    drawSvg(){
        const {style} = this.props.thisData;
        const areaName = style.areaName ? style.areaName : 'linan';
        const thisRoadPath = roadPath[areaName];
        const draw = SVG().addTo('#'+this.props.id+'_svg').viewbox(0,0,850,650).size('100%','100%').attr({preserveAspectRatio:"none"});
        thisRoadPath.forEach((road) => {
            if(style.svgType === 'path'){
                draw.path(road.path).attr({fill:'rgb(119,120,120)',id:road.name});
            }else{
                draw.polygon(road.path).attr({fill:'rgb(119,120,120)',id:road.name});
            }
        });
    }

    getCircleList(){
        const {style} = this.props.thisData;
        const {circleSizeList} = style;
        const {resultData,showRoad} = this.state;
        if(circleSizeList){
            return resultData.map((road,index) => {
                for(let i = 0;i < circleSizeList.length;i ++){
                    if(road[style.baseKey] >= circleSizeList[i].bottom && road[style.baseKey] < circleSizeList[i].top){
                        const size = this.props.getCompatibleSize(circleSizeList[i].size);
                        road.size = size;
                        return (
                            <div key={index} style={{...roadPosition[road.roadName]}} onMouseEnter={this.showDetail.bind(this,index,false)} onMouseLeave={this.startTime.bind(this,index)} className={cssStyle.circleBox}>
                                {/*<Circle className={cssStyle.circle} id={'map_circle'+road.roadName} />*/}
                                <img alt='' src={showRoad === road.roadName ? this.iconExList[i] : this.iconList[i]} className={cssStyle.bar}/>
                            </div>
                        );
                    }
                }
                return null;
            });
        }
    }

    showDetail(index,auto){
        if(this.detailTimer){
            clearTimeout(this.detailTimer);
        }
        const {resultData} = this.state;
        if(resultData[index] && resultData[index].totalWarningNum > 0){
            this.reGetNum = 0;
            axios.get(warningUrl + '/brainManage/getOverviewInfoByRoadId',{params:{roadId:resultData[index].roadId,rbacToken:this.props.token}}).then((response) => {
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
        const {detail,showIndex,resultData,dateType} = this.state;
        const road = resultData[showIndex];
        if(detail.overviewInfoVoList && road){
            let count = 0;
            if(parseInt(dateType) === 1){
                count = detail.allNum;
            }else{
                detail.overviewInfoVoList.forEach((item) => {
                    count += parseInt(item.inscrNum);
                });
            }
            return (
                <div className={cssStyle.detailBox} style={{...roadPosition[road.roadName]}}>
                    <div className={cssStyle.head} style={{color:this.colorList[road.warningLevel]}}>
                        {`${detail.roadName}　(${count})`}
                    </div>
                    <div className={cssStyle.content}>
                        <div className={cssStyle.title}>预警人员</div>
                        <div>{parseInt(dateType) === 1 ? detail.overviewInfoVoList[0].totalNum : detail.overviewInfoVoList[0].inscrNum}</div>
                    </div>
                    <div className={cssStyle.content}>
                        <div className={cssStyle.title}>预警事件</div>
                        <div>{parseInt(dateType) === 1 ? detail.overviewInfoVoList[1].totalNum : detail.overviewInfoVoList[1].inscrNum}</div>
                    </div>
                    <div className={cssStyle.content}>
                        <div className={cssStyle.title}>预警单位</div>
                        <div>{parseInt(dateType) === 1 ? detail.overviewInfoVoList[2].totalNum : detail.overviewInfoVoList[2].inscrNum}</div>
                    </div>
                    {/*<div className={cssStyle.content}>*/}
                    {/*    <div className={cssStyle.title}>异常场所</div>*/}
                    {/*    <div>{parseInt(dateType) === 1 ? detail.overviewInfoVoList[3].totalNum : detail.overviewInfoVoList[3].inscrNum}</div>*/}
                    {/*</div>*/}
                    {/*<div className={cssStyle.content}>*/}
                    {/*    <div className={cssStyle.title}>重点物</div>*/}
                    {/*    <div>{parseInt(dateType) === 1 ? detail.overviewInfoVoList[4].totalNum : detail.overviewInfoVoList[4].inscrNum}</div>*/}
                    {/*</div>*/}
                </div>
            );
        }
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const areaName = style.areaName ? style.areaName : 'linan';
        const mapBG = require('./images/map_'+areaName+'.svg');
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize}} >
                            <div className={cssStyle.map} ref={this.saveRef} id={this.props.id+'_svg'}/>
                            <img alt={''} src={mapBG} className={cssStyle.mapBG}/>
                            {this.getCircleList()}
                            {this.getDetailContent()}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}