import React from "react";
import {roadPath} from './svg_data';
import cssStyle from "./svg_map_linan_ex.module.css";

export default class RoadPart extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }


    render() {
        const {style, className, roadName, color} = this.props;
        const thisRoadPath = roadPath[roadName];
        if (roadName && thisRoadPath && thisRoadPath.roadSize) {
            const partSize = thisRoadPath.roadSize.split(' ');
            return (
                <div style={style} className={className}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={thisRoadPath.roadSize} className={`${cssStyle.partLine} ${cssStyle.partLine4}`}>
                        <polygon points={thisRoadPath.partPath} style={{stroke:'url(#RoadPart_1)',strokeWidth:0.5}} />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={thisRoadPath.roadSize} className={`${cssStyle.partLine} ${cssStyle.partLine3}`}>
                        <polygon points={thisRoadPath.partPath} style={{stroke:'url(#RoadPart_1)',strokeWidth:0.6}} />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={thisRoadPath.roadSize} className={`${cssStyle.partLine} ${cssStyle.partLine2}`}>
                        <polygon points={thisRoadPath.partPath} style={{stroke:'url(#RoadPart_1)',strokeWidth:0.7}} />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={thisRoadPath.roadSize} className={`${cssStyle.partLine} ${cssStyle.partLine1}`}>
                        <polygon points={thisRoadPath.partPath} style={{stroke:'url(#RoadPart_1)',strokeWidth:0.8}} />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={thisRoadPath.roadSize} className={cssStyle.partSvg}>
                        <linearGradient id='RoadPart_1' gradientUnits="userSpaceOnUse" x1="0" y1={partSize[3]} x2="0" y2="0">
                            <stop offset="0" stopColor="#fff"/>
                            <stop offset="0.3" stopColor="#9bd4ef"/>
                            <stop offset="0.77" stopColor="#7dc6ea"/>
                            <stop offset="1" stopColor="#f6f6f6"/>
                        </linearGradient>
                        <linearGradient id='RoadPart_2' gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={partSize[2]} y2={partSize[3]}>
                            <stop offset="0" stopColor={color ? color : '#72c2e9'}/>
                            <stop offset="1" stopColor="#fff"/>
                        </linearGradient>
                        <clipPath id="RoadPartCutOff">
                            <polygon points={thisRoadPath.partPath} />
                        </clipPath>
                        <filter id="RoadPartFilter" x="0" y="0">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
                        </filter>
                        <polygon points={thisRoadPath.partPath} style={{fill:'url(#RoadPart_2)',strokeWidth:0}}  />
                        <polygon points={thisRoadPath.partPath} style={{stroke:'#000',strokeWidth:3,fill:'none'}} clipPath="url(#RoadPartCutOff)" filter="url(#RoadPartFilter)"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox={thisRoadPath.roadSize} className={`${cssStyle.partLine}`}>
                        <polygon points={thisRoadPath.partPath} style={{stroke:'url(#RoadPart_1)',strokeWidth:0.9}} />
                    </svg>
                </div>
            );
        }
    }
}