import React from "react";

export default class SvgRing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.defaultStyle = {
            "fillColor": [{
                "color": "rgba(55,227,72,1)",
                "percent": 0
            }, {
                "color": "rgba(62,29,227,1)",
                "percent": 100
            }],
            "bgColor": "rgba(255,255,255,0.05)",
            "angle": 0,
            "lineColor": "rgba(80,227,194,1)",
            "shadowColor": "rgba(57,21,235,0.8)",
            "lineWidth": 1,
            "minRadius": 54,
            "maxRadius": 82
        };
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        let {per,ringStyle} = this.props;
        let thisStyle;
        if(ringStyle == null){
            thisStyle = this.defaultStyle;
        }else {
            thisStyle = {...this.defaultStyle,...ringStyle};
        }
        const {minRadius,maxRadius} = thisStyle;
        if(minRadius > 100 || minRadius < 0){
            return "内半径配置有误";
        }
        if(maxRadius > 100 || maxRadius < 0){
            return "外半径配置有误";
        }
        if(minRadius >= maxRadius){
            return "内半径需小与外半径";
        }
        if(per > 1 || per < 0){
            return "占比配置有误";
        }
        //计算圆环path路径
        const bgPath = `M100,${100-maxRadius} 
            a${maxRadius},${maxRadius} 0, 1, 0, 0, ${2*maxRadius}
            a${maxRadius},${maxRadius} 0, 1, 0, 0, ${-2*maxRadius} Z
            m 0,${maxRadius-minRadius}
            a${minRadius},${minRadius} 0, 1, 1, 0, ${2*minRadius}
            a${minRadius},${minRadius} 0, 1, 1, 0, ${-2*minRadius} Z`;
        let path;
        per = parseFloat(per);
        if(per === 1){
            path = bgPath;
        }else if(per !== 0){
            const sub = maxRadius - minRadius;
            const smallRadius = sub/2;
            const asin = Math.asin(smallRadius/(minRadius+smallRadius));
            const maxPer = 1 - Math.ceil(asin*1000/Math.PI)/1000;
            if(per > maxPer){
                per = maxPer;
            }
            const sin = Math.sin(Math.PI*2*per).toFixed(2);
            const cos = Math.cos(Math.PI*2*per).toFixed(2);
            const largeArcFlag = per >= 0.5 ? 1 : 0;
            path = `M100,${100-maxRadius} 
            A${maxRadius},${maxRadius} 0 ${largeArcFlag},1 ${100+sin*maxRadius},${100-cos*maxRadius} 
            a${sub/2},${sub/2} 0 1,1 ${-sin*sub},${cos*sub} 
            A${minRadius},${minRadius} 0 ${largeArcFlag},0 100,${100-minRadius}
            a${sub/2},${sub/2} 0 0,1 0,${-sub} Z`;
        }
        //填充色渐变角度
        const angle = thisStyle.angle == null ? 0 : thisStyle.angle;
        return (
            <div style={this.props.style} className={this.props.className}>
                <svg x="0" y="0" viewBox="0 0 200 200" style={{width:'100%',height:'100%'}}>
                    <filter id={`SvgRingFilter_${this.props.id}`} width="200" height="200" x="-10" y="-10">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                    </filter>
                    <linearGradient id={`linearGradient_${this.props.id}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={angle <= 45 ? 200 : Math.tan((90-angle)*Math.PI/180)*200} y2={angle >= 45 ? 200 : Math.tan(angle*Math.PI/180)*200}>
                        {thisStyle.fillColor && thisStyle.fillColor.map((item,index) =>
                            <stop  offset={item.percent/100} style={{stopColor:item.color}} key={index}/>
                        )}
                    </linearGradient>
                    <path d={bgPath} style={{fill:thisStyle.bgColor}} />
                    {per > 0 && (
                        <g >
                            <path d={path} style={{fill:thisStyle.shadowColor}} filter={`url(#SvgRingFilter_${this.props.id})`}/>
                            <path d={path} style={{fill:`url(#linearGradient_${this.props.id})`,stroke:thisStyle.lineColor,strokeWidth:thisStyle.lineWidth}} />
                        </g>
                    )}
                </svg>
            </div>
        );
    }
}