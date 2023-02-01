import React from "react";
import axios from "axios";
import {clusterLayer} from "./clusterLayerEx";
import cssStyle from "../components/svg_map_box/svg_map_type_one/svg_map_type_one.module.css";
import Circle from "./circle";

export function getPointsData(){
    const {style} = this.props.thisData;
    let params = {};
    try {
        params = JSON.parse(style.pointParams);
    }catch (e) {}
    if(style.pointUrl){
        axios.get(style.pointUrl,{params:{...params,...this.pointsParams,rbacToken:this.props.token}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({points:result})
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }
}

export function addClusterPoints(points,thisData,pointClick){
    if(this._clusterLayer == null){
        this._clusterLayer = clusterLayer();
    }
    const { style } = thisData;
    if (points && points.length > 0 && style.xMin != null && style.xMax != null && style.yMin != null && style.yMax != null) {
        const xWidth = style.xMax - style.xMin;
        const yHeight = style.yMax - style.yMin;
        const svgMapWidth = global.bodyWidth * (parseFloat(thisData.position.width) / 100) * ((style.pointAreaWidth ? style.pointAreaWidth : 100) / 100);
        //地图层级设置
        this._clusterLayer._clusterResolution = xWidth / svgMapWidth;
        this.clusterDistance = this._clusterLayer._clusterResolution*this._clusterLayer._clusterTolerance;
        // //数据设置
        this._clusterLayer._clusterData = points;
        this._clusterLayer._clusters = [];
        // //计算聚合
        this._clusterLayer._clusterGraphics();
        // //循环聚合结果打点
        return this._clusterLayer._clusters.map((cluster, index) => {
            const pointNum = cluster.attributes.clusterCount;
            let pointSize = {};
            if (style.pointSizeList && style.pointSizeList.length > 0) {
                for (let i = 0; i < style.pointSizeList.length; i++) {
                    if (style.pointSizeList[i].less > pointNum && style.pointSizeList[i].more <= pointNum) {
                        pointSize = { width: style.pointSizeList[i].size + 'em', height: style.pointSizeList[i].size + 'em' };
                        break;
                    }
                }
            }
            const left = (cluster.x - style.xMin) * 100 / xWidth + '%';
            const top = (style.yMax - cluster.y) * 100 / yHeight + '%';
            return (
                <div key={index} style={{ ...pointSize, left, top }} className={cssStyle.circleBox} onClick={pointClick ? pointClick.bind(this,cluster):null}>
                    <Circle className={cssStyle.circle} id={thisData.id+'map_circle' + index} />
                </div>
            );
        });
    } else {
        return null;
    }
}