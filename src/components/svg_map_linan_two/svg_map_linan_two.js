import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./svg_map_linan_two.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {roadPath,mapSize,roadPosition,circlePointPosition,detailPosition} from "./svg_data";
import {getCompatibleSize, interactData} from "../../common/util";
import circleIcon from "./images/circleIcon.png";
import {getSpecialStyle} from "../../common/nameNumUtil";

export default class SvgMapLinanTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],showIndex:0,keepSelect:false};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.keyParams = {};
        this.firstGetData = true;
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if(this.props.thisData.firstLoad){
                this.getData(this.callBack.bind(this,resolve));
            }else{
                this.callBack(resolve);
            }
        });
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.timer){
            clearTimeout(this.timer);
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
                if (data.reGetData !== 2) {
                    this.reGetData();
                }
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
        if(resolve){
            resolve();
        }
        if(result){
            this.setState({resultData:result});
            if(result && this.firstGetData){
                this.changeInteract(result[this.state.showIndex]);
            }
            this.firstGetData = false;
            this.startTimer();
        }
    }

    startTimer(){
        if(this.timer){
            clearTimeout(this.timer);
        }
        const {style} = this.props.thisData;
        if(style.detailType === 2 || style.detailType === 3){
            if(!this.state.keepSelect){
                this.setState({showIndex:-1});
            }
        }else if(style.time){
            this.timer = setTimeout(()=>{
                let {resultData,showIndex} = this.state;
                showIndex ++;
                if(showIndex >= resultData.length){
                    showIndex = 0
                }
                this.setState({showIndex});
                this.changeInteract(resultData[showIndex]);
                this.startTimer();
            },style.time);
        }
    }

    getFontColor(num){
        const {style} = this.props.thisData;
        if(style.fontColorType === 1){
            return style.fontColor;
        }else if(style.fontColorKey && style.fontColorList && style.fontColorList.length > 0){
            if(style.calculateType === 1){
                for(let i = 0;i < style.fontColorList.length;i ++){
                    if(num+'' === style.fontColorList[i].num){
                        return style.fontColorList[i].color;
                    }
                }
            }else{
                for(let i = 0;i < style.fontColorList.length;i ++){
                    if(num < style.fontColorList[i].top && num >= style.fontColorList[i].bottom){
                        return style.fontColorList[i].color;
                    }
                }
            }
        }
        return null;
    }

    getNumList(areaName){
        const {resultData} = this.state;
        if(resultData){
            const areaRoadPosition = roadPosition[areaName] ? roadPosition[areaName]:{};
            return resultData.map((road,index)=>{
                return <div className={cssStyle.num} key={index} style={{color:this.getFontColor(road.num),...areaRoadPosition[road.roadName]}}>{road.num}</div>
            });
        }else{
            return null;
        }
    }

    roadClick(road){
        const {style} = this.props.thisData;
        if(style.detailType === 2 || style.detailType === 3){
            this.setState({keepSelect:!this.state.keepSelect})
        }else{
            const { interact } = this.props.thisData.dataSources;
            this.interactData(interact, road);
        }
    }

    changeInteract(road){
        const { changeInteract } = this.props.thisData.style;
        this.interactData(changeInteract,road);
    }

    changeIndex(index){
        if(this.timer){
            clearTimeout(this.timer);
        }
        if(!this.state.keepSelect){
            this.setState({showIndex:index});
            const {resultData} = this.state;
            this.changeInteract(resultData[index]);
        }
    }

    peopleNumClick(numData,roadData){
        const { peopleInteract } = this.props.thisData.style;
        this.interactData(peopleInteract,{...roadData,...numData});
    }

    eventNumClick(numData,roadData){
        const { eventInteract } = this.props.thisData.style;
        this.interactData(eventInteract,{...roadData,...numData});
    }

    getSelectedContent(){
        const {resultData,showIndex} = this.state;
        const roadData = resultData[showIndex];
        const {style} = this.props.thisData;
        if(roadData && style.detailType !== 0){
            if(style.detailType === 2){
                if(roadData && roadData.details && roadData.details.length > 0){
                    const thisDetailPosition = detailPosition[roadData.roadName];
                    return (
                        <div className={cssStyle.twoBox} style={{...thisDetailPosition,pointerEvents:this.state.keepSelect?'auto':'none'}}>
                            <table>
                                <tbody>
                                <tr>
                                    <td style={{width:'8em'}}>{roadData.roadName}</td>
                                    <td style={{width:'6em'}} className={cssStyle.cursor} onClick={this.peopleNumClick.bind(this,null,roadData)}>总数</td>
                                    <td style={{width:'6em'}} className={cssStyle.cursor} onClick={this.eventNumClick.bind(this,null,roadData)}>预警</td>
                                </tr>
                                {roadData.details.map((item,index)=>
                                    <tr key={index}>
                                        <td style={{width:'8em'}}>{item.name}</td>
                                        <td style={{width:'6em'}} className={cssStyle.cursor} onClick={this.peopleNumClick.bind(this,item,roadData)}>{item.peopleNum}</td>
                                        <td style={{width:'6em'}} className={cssStyle.cursor} onClick={this.eventNumClick.bind(this,item,roadData)}>{item.eventNum}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    );
                }else{
                    return (
                        <div className={cssStyle.twoBox}>暂无数据</div>
                    );
                }
            }else if(style.detailType === 3){
                if(roadData && roadData.details && roadData.details.length > 0){
                    const thisDetailPosition = detailPosition[roadData.roadName];
                    return (
                        <div className={`${cssStyle.twoBox} ${cssStyle.threeBox}`} style={{...thisDetailPosition,pointerEvents:this.state.keepSelect?'auto':'none'}}>
                            <table>
                                <tbody>
                                <tr>
                                    <td style={{width:'11em'}}>{roadData.roadName}</td>
                                    <td style={{width:'5em'}} className={cssStyle.cursor} onClick={this.peopleNumClick.bind(this,null,roadData)}>数量</td>
                                </tr>
                                {roadData.details.map((item,index)=>
                                    <tr key={index}>
                                        <td style={{width:'11em'}}>{item.name}</td>
                                        <td style={{width:'5em'}} className={cssStyle.cursor} onClick={this.peopleNumClick.bind(this,item,roadData)}>{item.num}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    );
                }else{
                    return (
                        <div className={cssStyle.twoBox}>暂无数据</div>
                    );
                }
            }else{
                return (
                    <div className={cssStyle.oneBox}>
                        <div className={cssStyle.titleBox}>
                            <img alt={''} src={circleIcon} className={cssStyle.img} />
                            <div className={cssStyle.title}>{roadData.roadName}</div>
                        </div>
                        <div className={cssStyle.numBox}>
                            <div className={cssStyle.name}>平安天目指数：</div>
                            <div className={cssStyle.numOne}>{roadData.num}</div>
                        </div>
                    </div>
                );
            }
        }else{
            return null;
        }
    }

    render() {
        const {style} = this.props.thisData;
        const {resultData,showIndex} = this.state;
        const fontSize = getCompatibleSize(style.fontSize);
        const areaName = style.areaName ? style.areaName : 'linan';
        const mapBg = require('./images/map_bg_'+areaName+'.svg');
        const mapRoad = require('./images/map_road_'+areaName+'.svg');
        const thisAreaPath = roadPath[areaName];
        const thisCirclePointPosition = circlePointPosition[areaName];
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize}} >
                            {style.theme !== 2 && <img src={mapBg} alt={''} className={cssStyle.mapBg}/>}
                            <svg viewBox={mapSize[areaName]} x="0px" y="0px" className={cssStyle.svg} preserveAspectRatio="none" >
                                <g onMouseLeave={this.startTimer.bind(this)}>
                                    {thisAreaPath && resultData && resultData.map((road,index)=>{
                                        const data = road[style.areaNumKey];
                                        let thisColor = data != null ? getSpecialStyle(style.areaStyleList,data,2) : null;
                                        return (
                                            <polyline
                                                key={index}
                                                points={thisAreaPath[road.roadName].path}
                                                className={showIndex === index ? cssStyle.selectedRoad:cssStyle.road}
                                                onClick={this.roadClick.bind(this,road)}
                                                onMouseOver={this.changeIndex.bind(this,index)}
                                                style={thisColor?{fill:thisColor.color,opacity:1}:{}}
                                            />
                                        );
                                    })}
                                </g>
                            </svg>
                            {style.theme === 2 && <img src={mapRoad} alt={''} className={cssStyle.mapBg}/>}
                            {this.getNumList(areaName)}
                            {this.getSelectedContent()}
                            {(style.detailType === 2 || style.detailType === 3) && (
                                <div className={cssStyle.circlePointBox}>
                                    {thisCirclePointPosition && resultData && resultData.map((road,index)=>
                                        <img
                                            alt={''} key={index} src={circleIcon}
                                            style={{...thisCirclePointPosition[road.roadName],display:index === showIndex ? 'block':'none'}}
                                            className={cssStyle.circlePoint}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}