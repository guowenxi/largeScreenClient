import React from "react";
import cssStyle from "./css/svgEffectLine.module.css";

export default class SvgEffectLine extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.start = performance.now();
        this.frame = this.frame.bind(this);
        this.pointList = ['','','','','','','','','',''];
    }

    //组件删除时触发函数
    componentWillUnmount() {
        cancelAnimationFrame(this.fameNum);
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.effect){
            setTimeout(()=>{
                this.path = document.querySelector('#path_'+this.props.id);
                this.len = this.path.getTotalLength();
                this.frame();
            });
        }
    }

    frame(){
        const speed = this.props.speed ? this.props.speed : 0.1;
        for(let i = 0;i < this.pointList.length;i ++){
            const pointDom = document.querySelector('#point_'+this.props.id+'_'+i);
            const now = performance.now();
            const phase = (((now - this.start )*speed - 3*i) / this.len) % 1;
            const point = this.path.getPointAtLength(this.len * phase);
            pointDom.style.transform = 'translate3d(' + point.x + 'px,' + point.y + 'px,0)'; // IE
            pointDom.style.WebkitTransform = 'translate3d(' + point.x + 'px,' + point.y + 'px,0)'; // Chrome&Safari
        }
        this.fameNum = requestAnimationFrame(this.frame);
    }

    render() {
        const {style,className,d,stroke,color,id,viewBox,effect,preserveAspectRatio,strokeWidth} = this.props;
        return (
            <div style={style} className={className}>
                <svg className={cssStyle.svg} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio}>
                    <path id={'path_'+id} d={d} stroke={stroke} strokeWidth={strokeWidth?strokeWidth:2} fill='none'/>
                    {effect && this.pointList.map((point,index)=>
                        <circle id={'point_'+id+'_'+index} cx="0" cy="0" r="3" className={cssStyle.point} key={index} style={{fill:color,fillOpacity:1-index/this.pointList.length}}/>
                    )}
                </svg>
                {/*{this.pointList.map((point,index)=>*/}
                {/*    <div id={'point_'+id+'_'+index} className={cssStyle.point} key={index} style={{backgroundColor:color,opacity:1-index/this.pointList.length}}/>*/}
                {/*)}*/}
            </div>
        );
    }
}