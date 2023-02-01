import React from "react";

import cssStyle from "./svg_map_type_one.module.css";
import { mapSize, roadPath, mapImgPath, roadPosition, roadLine } from "./roadPath";
import { interactData } from "../../../common/util";
import { Motion, spring } from "react-motion";
import detailBg from "./images/detailBg.svg"
import axios from "axios";
import { fileUrl } from "../../../config";
import {addClusterPoints} from "../../../common/svgMapUtil";

export default class SvgMapTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = { scale: 1, moveFlag: false, movementX: 0, movementY: 0, showIndex: 0 };
        this.addClusterPoints = addClusterPoints.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        setTimeout(() => this.showDetail(0, true));
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if (this.detailTimer) {
            clearTimeout(this.detailTimer);
        }
    }

    getRoadColor(road, style) {
        if (style.partColorType === 1) {
            return style.partColor;
        } else if (style.subKey && style.colorList && style.colorList.length > 0) {
            const value = road[style.subKey];
            if (style.subType === 1) {
                for (let i = 0; i < style.colorList.length; i++) {
                    if (style.colorList[i].value === value + '') {
                        return style.colorList[i].color;
                    }
                }
            } else {
                for (let i = 0; i < style.colorList.length; i++) {
                    if (style.colorList[i].more <= value && style.colorList[i].less > value) {
                        return style.colorList[i].color;
                    }
                }
            }
        }
        return 'none';
    }

    getLineColor(road, style) {
        if (style.lineColorType === 1) {
            return style.lineColor;
        } else if (style.lineSubKey && style.lineColorList && style.lineColorList.length > 0) {
            const value = road[style.lineSubKey];
            if (style.lineSubType === 1) {
                for (let i = 0; i < style.lineColorList.length; i++) {
                    if (style.lineColorList[i].lineValue === value + '') {
                        return style.lineColorList[i].lineColor;
                    }
                }
            } else {
                for (let i = 0; i < style.lineColorList.length; i++) {
                    if (style.lineColorList[i].lineMore <= value && style.lineColorList[i].lineLess > value) {
                        return style.lineColorList[i].lineColor;
                    }
                }
            }
        }
        return 'none';
    }

    partClick(clickItem) {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, clickItem);
    }

    addPoints() {
        const { points, thisData } = this.props;
        return this.addClusterPoints(points,thisData,this.clusterClick);
    }

    clusterClick(point){
        const {clusterInteract} = this.props.thisData.style;
        this.interactData(clusterInteract,{x:point.x,y:point.y,distance:this.clusterDistance});
    }

    scrollFunc(e) {
        const { style } = this.props.thisData;
        if (style && style.scaleAction) {
            let { scale } = this.state;
            if (e.deltaY < 0) { //当滑轮向上滚动时
                scale += 0.2;
            } else if (e.deltaY > 0) { //当滑轮向下滚动时
                scale -= 0.2;
            }
            if (scale <= 8 && scale >= 0.4) {
                e.stopPropagation();
                this.setState({ scale });
            }
        }
    };

    changeMoveFlag(moveFlag) {
        this.setState({ moveFlag });
    }

    moveMap(e) {
        const { style } = this.props.thisData;
        if (this.state.moveFlag && style && style.moveAction) {
            let { movementX, movementY } = this.state;
            movementX += e.movementX;
            movementY += e.movementY;
            this.setState({ movementX, movementY });
        }
    }


    showDetail(index, auto) {
        if (this.detailTimer) {
            clearTimeout(this.detailTimer);
        }
        const { resultData } = this.props;
        const { style } = this.props.thisData;
        if (resultData[index]) {
            this.reGetNum = 0;
            const sendUrl = style.detailUrl;
            axios.get(sendUrl).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                this.setState({ detail: result, showIndex: index });
                if (auto) {
                    this.startTime(index);
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        } else {
            this.reGetNum++;
            if (this.reGetNum < 20) {
                const nextIndex = resultData.length - 1 > index ? index + 1 : 0;
                this.showDetail(nextIndex, auto);
            }
        }
    }

    startTime(index) {
        const { resultData } = this.props;
        const nextIndex = resultData.length - 1 > index ? index + 1 : 0;
        this.detailTimer = setTimeout(() => this.showDetail(nextIndex, true), 5000);
    }


    getDetailContent() {
        const { style } = this.props.thisData;
        const { resultData } = this.props;
        const { showIndex, detail } = this.state;
        const road = resultData[showIndex];
        if (detail && detail.length !== 0 && style.detailShow) {
            let count = 0;
            count += parseInt(detail[showIndex].warningThing) + parseInt(detail[showIndex].warningPeople) + parseInt(detail[showIndex].warningCompany);
            return (
                <div className={cssStyle.detailBox} style={{ ...roadPosition[road.roadName], width: style.winWidth + 'em', height: style.winHeight + 'em' }}>
                    <img alt={''} src={detailBg} className={cssStyle.detailBg} />
                    <div className={cssStyle.count} >
                        {count}
                    </div>
                    {style.detailType === 1 ?
                        (<div className={cssStyle.contentBox}>
                            <div className={cssStyle.content}>
                                <div className={`${cssStyle.contentItem} ${cssStyle.number}`}>{detail[showIndex].warningThing}</div>
                                <div className={`${cssStyle.contentItem} ${cssStyle.title}`}>预警事件</div>
                            </div>
                            <div className={cssStyle.content}>
                                <div className={`${cssStyle.contentItem} ${cssStyle.number}`}>{detail[showIndex].warningPeople}</div>
                                <div className={`${cssStyle.contentItem} ${cssStyle.title}`}>预警人员</div>
                            </div>
                            <div className={cssStyle.content}>
                                <div className={`${cssStyle.contentItem} ${cssStyle.number}`}>{detail[showIndex].warningCompany}</div>
                                <div className={`${cssStyle.contentItem} ${cssStyle.title}`}>预警单位</div>
                            </div>
                        </div>
                        ) : (
                            <div></div>
                        )}
                </div>
            );
        }
    }

    getImgLine() {
        const { resultData } = this.props;
        const { style } = this.props.thisData;
        const nameKey = style.nameKey ? style.nameKey : 'roadName';
        const thisLineData = style.pathContent && style.pathContent !== 'default' ? roadLine[style.pathContent] : roadLine;
        if(thisLineData){
            return (
                resultData && resultData.map((item, index) => {
                    const thisLinePath = thisLineData[item[nameKey]];
                    if (thisLinePath) {
                        const thisImgLine = this.getImgLineList(item);
                        return (thisImgLine && thisLinePath && style.imgShow && <img alt="" src={fileUrl + '/download/' + thisImgLine} className={cssStyle.imgLine} style={thisLinePath} key={index} />)
                    }else{
                        return '';
                    }
                })
            )
        }else{
            return '';
        }
    }

    getImgLineList(road) {
        const { style } = this.props.thisData;
        if (style.partColorType === 1) {
            return style.valueImg;
        } else if (style.colorList && style.colorList.length > 0) {
            const value = road[style.subKey];
            if (style.subType === 1) {
                for (let i = 0; i < style.colorList.length; i++) {
                    if (style.colorList[i].value === value + '') {
                        return style.colorList[i].img;
                    }
                }
            } else {
                for (let i = 0; i < style.colorList.length; i++) {
                    if (style.colorList[i].more <= value && style.colorList[i].less > value) {
                        return style.colorList[i].img;
                    }
                }
            }
        }
    }

    render() {
        const { thisData, resultData, area } = this.props;
        const { style } = thisData;
        if (style && (style.area || area)) {
            // const thisMapImg = mapImgPath[style.area];
            const thisMapImg = area ? mapImgPath[area] : mapImgPath[style.area];
            let mapBg, mapTop;
            if (thisMapImg) {
                try {
                    mapBg = require(`./images/${thisMapImg.bottom}`);
                } catch (e) { }
                try {
                    mapTop = require(`./images/${thisMapImg.top}`);
                } catch (e) { }
            }
            const nameKey = style.nameKey ? style.nameKey : 'roadName';
            let pointBoxStyle = {};
            style.pointAreaWidth && (pointBoxStyle.width = style.pointAreaWidth + '%');
            style.pointAreaHeight && (pointBoxStyle.height = style.pointAreaHeight + '%');
            style.pointAreaLeft && (pointBoxStyle.left = style.pointAreaLeft + '%');
            style.pointAreaTop && (pointBoxStyle.top = style.pointAreaTop + '%');
            const thisPathData = style.pathContent && style.pathContent !== 'default' ? roadPath[style.pathContent] : roadPath;
            // let data = [];
            // for(let key in thisPathData){
            //     data.push({name:key,level:1})
            // }
            // console.log(JSON.stringify(data));
            return (
                <div className={cssStyle.box}>
                    <Motion style={{ scale: spring(this.state.scale) }}>
                        {({ scale }) =>
                            <div
                                className={cssStyle.mapBox}
                                style={{ transform: `scale(${scale}) translate(${this.state.movementX}px,${this.state.movementY}px)` }}
                                onWheel={this.scrollFunc.bind(this)}
                                onMouseDown={this.changeMoveFlag.bind(this, true)}
                                onMouseUp={this.changeMoveFlag.bind(this, false)}
                                onMouseMove={this.moveMap.bind(this)}
                            >
                                {mapBg && <img alt={''} src={mapBg} className={cssStyle.map} />}
                                <svg viewBox={mapSize[area ? area : style.area]} x="0px" y="0px" className={cssStyle.map} preserveAspectRatio="none">
                                    {resultData && resultData.map((road, index) => {
                                        const thisRoadPath = thisPathData[road[nameKey]];
                                        const fillColor = this.getRoadColor(road, style);
                                        const lineColor = style.lineColorShow ? this.getLineColor(road, style) : fillColor;
                                        if (thisRoadPath) {
                                            if (thisRoadPath.path.map) {
                                                return thisRoadPath.path.map((path, pathIndex) => {
                                                    return <path key={pathIndex} d={path} fill={fillColor} stroke={lineColor} strokeWidth={style.lineColorShow ? style.lineWidth : ''} className={cssStyle.roadPart} onClick={this.partClick.bind(this, road)} transform={thisRoadPath.transform} />
                                                })
                                            } else {
                                                return <path key={index} d={thisRoadPath.path} fill={fillColor} stroke={lineColor} strokeWidth={style.lineColorShow ? style.lineWidth : ''} className={cssStyle.roadPart} onClick={this.partClick.bind(this, road)} transform={thisRoadPath.transform} onMouseEnter={this.showDetail.bind(this, index, false)} onMouseLeave={this.startTime.bind(this, index)} />
                                            }
                                        } else {
                                            return null;
                                        }
                                    })}
                                </svg>
                                {mapTop && <img alt={''} src={mapTop} className={cssStyle.mapTop} />}
                                <div className={`${cssStyle.pointBox} ${style.clusterInteract&&style.clusterInteract.length>0?cssStyle.hasClusterInteract:cssStyle.noClusterInteract}`} style={pointBoxStyle}>
                                    {this.addPoints()}
                                </div>
                                {this.getDetailContent()}
                                {this.getImgLine()}
                            </div>
                        }
                    </Motion>
                </div>
            );
        } else {
            return null;
        }
    }
}