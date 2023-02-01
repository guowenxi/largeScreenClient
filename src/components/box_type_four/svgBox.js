import React from "react";
import cssStyle from "./box_type_four.module.css";

export default class SvgBox extends React.PureComponent {
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
        const {width,height,headHeight,id} = this.props;
        return (
            <svg x="0px" y="0px" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                <g>
                    <polygon className={cssStyle.polygon1}
                             points={`18.5,0.5 0.5,14.9 0.5,${height - 0.6} ${width - 48.8},${height - 0.5} ${width - 0.5},${height - 38.5} ${width - 0.5},0.5`}/>
                    <polygon className={cssStyle.polygon2}
                             points={`18.5,0.5 0.5,14.9 0.5,${height - 0.6} ${width - 48.8},${height - 0.5} ${width - 0.5},${height - 38.5} ${width - 0.5},0.5`}/>
                </g>
                <g>
                    <polygon className={cssStyle.polygon3}
                             points={`18.5,0.5 0.5,14.9 0.5,${headHeight} ${width - 0.5},${headHeight} ${width - 0.5},0.5`}/>
                </g>
                <g>
                    <polygon className={cssStyle.polygon4}
                             points={`${width},${height - 27.6} ${width - 38.1},${height} ${width},${height}`}/>
                    <polygon className={cssStyle.polygon5}
                             points={`${width - 4.9},${height - 24} ${width - 33.1},${height - 3.6} ${width - 4.9},${height - 3.6}`}/>
                </g>
                <g>
                    <path className={cssStyle.polygon6}
                          d="M7.8,53.8c-1.1,0-2-0.9-2-2V17c0-0.6,0.3-1.2,0.7-1.6L18.1,6c0.4-0.3,0.8-0.4,1.3-0.4h41.5c1.1,0,2,0.9,2,2s-0.9,2-2,2H20.1L9.8,17.9v33.9C9.8,52.9,8.9,53.8,7.8,53.8z"/>
                </g>
                <linearGradient id={`${id}_svg_1`} gradientUnits="userSpaceOnUse" x1="40.8" y1="0.5" x2={width - 40.8}
                                y2="0.5">
                    <stop offset="0" className={cssStyle.linearGradient1Stop1}/>
                    <stop offset="4.344553e-002" className={cssStyle.linearGradient1Stop2}/>
                    <stop offset="0.1193" className={cssStyle.linearGradient1Stop3}/>
                    <stop offset="0.1959" className={cssStyle.linearGradient1Stop4}/>
                    <stop offset="0.2724" className={cssStyle.linearGradient1Stop5}/>
                    <stop offset="0.3487" className={cssStyle.linearGradient1Stop6}/>
                    <stop offset="0.4246" className={cssStyle.linearGradient1Stop7}/>
                    <stop offset="0.5" className={cssStyle.linearGradient1Stop8}/>
                    <stop offset="0.5928" className={cssStyle.linearGradient1Stop9}/>
                    <stop offset="0.6691" className={cssStyle.linearGradient1Stop10}/>
                    <stop offset="0.7396" className={cssStyle.linearGradient1Stop11}/>
                    <stop offset="0.8066" className={cssStyle.linearGradient1Stop12}/>
                    <stop offset="0.8711" className={cssStyle.linearGradient1Stop13}/>
                    <stop offset="0.9338" className={cssStyle.linearGradient1Stop14}/>
                    <stop offset="0.9939" className={cssStyle.linearGradient1Stop15}/>
                    <stop offset="1" className={cssStyle.linearGradient1Stop16}/>
                </linearGradient>
                <rect x="40.8" style={{fill: `url(#${id}_svg_1)`}} width={width - 40.8} height="1"/>
                <rect x="40.8" y={headHeight} style={{fill: `url(#${id}_svg_1)`}} width={width - 40.8} height="1"/>
            </svg>
        );
    }
}