import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./svg_map_linan_ex.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import RoadName from "./roadName";
import RoadArea from "./roadArea";
import RoadPart from "./roadPart";
import pointIcon from "./images/point.svg";
import { mapSize } from "./svg_data";
import SpringScrollbars from "../../common/springScrollbars";
import pointIcon2 from "./images/point2.svg";
import icon1 from "./images/type1.svg";
import icon2 from "./images/type2.svg";
import icon3 from "./images/type3.svg";
import icon4 from "./images/type4.svg";
import {getSpecialNumContent, interactData} from "../../common/util";

export default class SvgMapLinan extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], showIndex: 0, detail: {}, dateType: 1, selectedRoad: '', selectedAnalysis: '',warningLevel:0,showType:1 };
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.keyParams = {};
        this.colorList = ["#CCCCCC", "#EF4D4D", "#F99450", "#E8D443", "#00CBFE", "#70DD4B", "#CCCCCC"];
        this.iconList = ["#CCCCCC",icon4, icon3, icon2, "#00CBFE", icon1, "#CCCCCC"]
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => { this.getData(this.callBack.bind(this, resolve)) });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        this.stopAutoChange();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus && this.props.thisData.showStatus){
            if(this.state.showType === 1){
                this.allAreaClick();
            }else{
                this.roadClick(this.state.resultData[this.showIndex]);
                this.autoChange();
            }
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                if (data.data.dateType) {
                    this.setState({ dateType: data.data.dateType });
                }
                this.stopAutoChange();
                this.reGetData();
                break;
            case "showComponent":
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity: 1 });
        })
    }

    //重新获取数据
    reGetData() {
        this.setState({ resultData: [] });
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            this.setState({ resultData: result });
            if (result.length > 0) {
                this.showIndex = 0;
                const { style } = this.props.thisData;
                if(style.contentType !== 2){
                    this.roadClick(result[0]);
                    this.autoChange();
                }else{
                    this.autoChangeCity();
                }
            }
            if (resolve) {
                resolve(result);
            }
        }
    }

    roadClick(road, index) {
        this.stopAutoChange();
        if (index != null) {
            this.showIndex = index;
        }
        const {roadInteract} = this.props.thisData.style;
        this.interactData(roadInteract,road);
        this.setState({ selectedRoad: road.roadName, selectedColor: this.colorList[road.warningLevel], selectedAnalysis: road.analysis,warningLevel:road.warningLevel,showType:2 })
    }

    allAreaClick(){
        this.stopAutoChange();
        this.setState({showType:1});
        const {cityInteract} = this.props.thisData.style;
        this.interactData(cityInteract);
        this.autoChangeCity();
    }

    autoChange(e,changeShow) {
        this.stopAutoChange();
        const { style } = this.props.thisData;
        if (style.time && (this.state.showType === 2 || changeShow)) {
            this.timer = setTimeout(() => {
                this.showIndex++;
                if (this.showIndex >= this.state.resultData.length) {
                    this.showIndex = 0;
                }
                this.roadClick(this.state.resultData[this.showIndex]);
                this.autoChange();
            }, style.time)
        }else{
            this.autoChangeCity();
        }
    }

    autoChangeCity(){
        this.stopAutoChange();
        const { style } = this.props.thisData;
        const cityTime = style.cityTime ? style.cityTime : 60000;
        this.timer = setTimeout(() => {
            this.autoChange('',true);
        }, cityTime);
    }

    stopAutoChange() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    render() {
        const { style } = this.props.thisData;
        const { resultData } = this.state;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const areaName = style.areaName ? style.areaName : 'linan';
        const mapBg = require('./images/map_bg_' + areaName + '.svg');
        const mapTop = require('./images/map_top_' + areaName + '.svg');
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize }} onMouseOver={this.stopAutoChange.bind(this)} onMouseLeave={this.autoChange.bind(this)}>
                            <img src={mapBg} alt={''} className={cssStyle.mapBg} />
                            <svg viewBox={`0 0 ${mapSize[areaName].width} ${mapSize[areaName].height}`} x="0px" y="0px" className={cssStyle.map} >
                                {resultData.map((road, index) => {
                                    let areaStyle = {};
                                    if(this.state.showType === 1){
                                        areaStyle = {fill:'rgb(110,171,192)',opacity: 1}
                                    }else if(this.state.selectedRoad === road.roadName){
                                        areaStyle = { fill:this.colorList[road.warningLevel], opacity: 1 };
                                    }
                                    return (
                                        <g
                                            key={index}
                                            onClick={this.roadClick.bind(this, road, index)}
                                            className={cssStyle.roadBox}
                                        >
                                            <g className={cssStyle.roadArea} style={areaStyle}>
                                                <RoadArea roadName={road.roadName} />
                                            </g>
                                            <g className={`${cssStyle.roadName} ${this.state.selectedRoad === road.roadName ? cssStyle.selectedName : ''}`}>
                                                <RoadName roadName={road.roadName} />
                                            </g>
                                        </g>
                                    );
                                })}
                            </svg>
                            <img src={mapTop} alt={''} className={cssStyle.mapTop} />
                            {this.state.showType === 2 && (
                                <div className={style.contentType === 2 ? cssStyle.partBoxTypeTwo : cssStyle.partBox}>
                                    {this.state.selectedRoad && <RoadPart roadName={this.state.selectedRoad} color={this.state.selectedColor} />}
                                </div>
                            )}
                            {style.contentType !== 2 && (
                                <React.Fragment >
                                    <div className={cssStyle.roadPointBox} >
                                        <img alt='' src={pointIcon} />
                                        <div className={cssStyle.roadPointName}>{this.state.selectedRoad}</div>
                                    </div>
                                    <div className={cssStyle.text} >
                                        <SpringScrollbars style={{ width: '100%', height: '100%' }} >
                                            {this.state.selectedAnalysis}
                                        </SpringScrollbars>
                                    </div>
                                </React.Fragment>
                            )}
                            {style.contentType === 2 && (
                                <React.Fragment >
                                    <div className={cssStyle.headBox}>
                                        <img alt='' src={pointIcon2} className={cssStyle.headImg} />
                                        <div className={cssStyle.headNameBox}>
                                            <div className={`${cssStyle.headStyle} ${cssStyle.city}`} onClick={this.allAreaClick.bind(this)}>临安</div>
                                            <div className={cssStyle.headLine} />
                                            <div className={cssStyle.headStyle}>{this.state.showType === 1 ? '全区':this.state.selectedRoad}</div>
                                            <div className={cssStyle.headSubName}>风险预防情况：</div>
                                        </div>
                                    </div>
                                    {this.state.showType === 2 && (
                                        <div className={`${cssStyle.roadPointBox} ${cssStyle.themeTwoBox}`} >
                                            <img alt='' src={this.iconList[this.state.warningLevel]} style={{height:'4em'}} />
                                            <SpringScrollbars style={{ width: '100%', height: '100%', color: 'white' }} >
                                                {getSpecialNumContent(this.state.selectedAnalysis,cssStyle.blueColor)}
                                            </SpringScrollbars>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}