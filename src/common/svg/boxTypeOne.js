import React from "react";
import cssStyle from "./boxTypeOne.module.css";
import lightIcon from "../images/lightTwo.png";
export default class BoxTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.boxRef = React.createRef();
        this.id = new Date().getTime();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        let width, height;
        if (this.boxRef && this.boxRef.current) {
            width = this.boxRef.current.clientWidth;
            height = this.boxRef.current.clientHeight;
        }
        const { headHeight } = this.props;
        return (
            <div style={this.props.style} className={this.props.className} ref={this.boxRef}>
                {width && height ? (
                    <svg x="0" y="0" viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
                        <g>
                            <linearGradient id={`SVGID_1_${this.id}`} gradientUnits="userSpaceOnUse" x1="0.5" y1="0" x2={`${width}`} y2="0" >
                                <stop offset="0" className={cssStyle.linearGradientStop1}></stop>
                                <stop offset="1" className={cssStyle.linearGradientStop2}></stop>
                            </linearGradient>
                            {headHeight && <polyline points={`7.6,18.9 33.6,1 ${width},1 `} className={cssStyle.polyline} style={{ stroke: `url(#SVGID_1_${this.id})` }} />}
                            <polygon points={`${width},${headHeight} 33.6,${headHeight} 1,${headHeight+23.9} 1,${height} ${width - 59.5},${height} ${width},${height - 40.8}`} className={cssStyle.polygon1} />
                            <g>
                                <polyline points={`1,${headHeight+60} 1,${headHeight+23.9} 33.6,${headHeight} 120.1,${headHeight} `} className={cssStyle.polyline} style={{ stroke: `url(#SVGID_1_${this.id})` }}  />
                            </g>
                            <linearGradient id={`SVGID_2_${this.id}`} gradientUnits="userSpaceOnUse" x1={`${width - 49.5}`} y1={`${height}`} x2={`${width}`} y2={`${height - 37.8}`}>
                                <stop offset="0" className={cssStyle.linearGradientStop3}></stop>
                                <stop offset="1" className={cssStyle.linearGradientStop4}></stop>
                            </linearGradient>
                            <line x1={`${width - 42.7}`} y1={`${height}`} x2={`${width - 10.7}`} y2={`${height - 22.1}`} className={cssStyle.line1} style={{ stroke: `url(#SVGID_2_${this.id})` }} />
                            <linearGradient id={`SVGID_3_${this.id}`} gradientUnits="userSpaceOnUse" x1={`${width - 59.5}`} y1={`${height}`} x2={`${width}`} y2={`${height - 40.8}`}>
                                <stop offset="0" className={cssStyle.linearGradientStop3}></stop>
                                <stop offset="1" className={cssStyle.linearGradientStop4}></stop>
                            </linearGradient>
                            <line x1={`${width - 59.5}`} y1={`${height}`} x2={`${width}`} y2={`${height - 40.9}`} className={cssStyle.line1} style={{ stroke: `url(#SVGID_3_${this.id})` }} />
                            <linearGradient id={`SVGID_4_${this.id}`} gradientUnits="userSpaceOnUse" x1={`${width - 39.5}`} y1={`${height}`} x2={`${width}`} y2={`${height - 34.8}`} >
                                <stop offset="0" className={cssStyle.linearGradientStop3}></stop>
                                <stop offset="1" className={cssStyle.linearGradientStop4}></stop>
                            </linearGradient>
                            <line x1={`${width - 28.9}`} y1={`${height}`} x2={`${width - 4.3}`} y2={`${height - 16.9}`} className={cssStyle.line1} style={{ stroke: `url(#SVGID_4_${this.id})` }} />
                            <linearGradient id={`SVGID_5_${this.id}`} gradientUnits="userSpaceOnUse" x1={`${width - 29.5}`} y1={`${height}`} x2={`${width}`} y2={`${height - 33.8}`}>
                                <stop offset="0" className={cssStyle.linearGradientStop3}></stop>
                                <stop offset="1" className={cssStyle.linearGradientStop4}></stop>
                            </linearGradient>
                            <line x1={`${width - 14.4}`} y1={`${height}`} x2={`${width}`} y2={`${height - 10}`} className={cssStyle.line1} style={{ stroke: `url(#SVGID_5_${this.id})` }} />
                            {headHeight && <path d={`M7.6,16.1c1.6,0,2.8,1.3,2.8,2.9s-1.3,2.9-2.8,2.9c-1.6,0-2.8-1.3-2.8-2.9C4.8,17.4,6,16.1,7.6,16.1   z`} className={cssStyle.path2} />}
                        </g>
                    </svg>
                ) : ''}
                <div className={`${cssStyle.line} ${cssStyle.lineRow1} `}>
                    <img alt={''} src={lightIcon} className={cssStyle.lineImg}/>
                </div>
                <div className={`${cssStyle.line} ${cssStyle.lineRow2} `} style={{top:headHeight+'px'}}>
                    <img alt={''} src={lightIcon} className={cssStyle.lineImg}/>
                </div>
            </div>
        );
    }
}