import React from "react";
import cssStyle from "./box_type_five.module.css";

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

    //获取背景框右边方块列表
    getRectList(width,height){
        const rectBoxHeight = height - 103.3;
        const rectNum = Math.floor(rectBoxHeight / 12.8);
        const gap = (rectBoxHeight - rectNum*7.8)/(rectNum-1);
        const rectList = [];
        for(let i = 0;i < rectNum;i ++){
            rectList.push(<rect x={width-3.2} y={i*(7.8+gap)+43.7} className={cssStyle.rectListItem} width="2.2" height="7.8" key={i}/>);
        }
        return rectList;
    }

    render() {
        const {width,height,id,style,fontSize} = this.props;
        return (
            <svg x="0px" y="0px" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                <linearGradient id={`SVGID_1_${id}`} gradientUnits="userSpaceOnUse" x1={style.headLeft*fontSize} y1="0" x2={(style.headLeft+style.headWidth)*fontSize+27.2} y2="0">
                    <stop  offset="0" className={cssStyle.radialGradient1stop1}/>
                    <stop  offset="0.1206" className={cssStyle.radialGradient1stop2}/>
                    <stop  offset="0.3465" className={cssStyle.radialGradient1stop3}/>
                    <stop  offset="0.5669" className={cssStyle.radialGradient1stop4}/>
                    <stop  offset="0.5955" className={cssStyle.radialGradient1stop5}/>
                    <stop  offset="0.8692" className={cssStyle.radialGradient1stop6}/>
                    <stop  offset="1" className={cssStyle.radialGradient1stop7}/>
                </linearGradient>
                <radialGradient id={`SVGID_2_${id}`} cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse">
                    <stop  offset="0" className={cssStyle.radialGradient2stop1}/>
                    <stop  offset="1" className={cssStyle.radialGradient2stop2}/>
                </radialGradient>
                <radialGradient id={`SVGID_5_${id}`} cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse">
                    <stop  offset="0" className={cssStyle.radialGradient5stop1}/>
                    <stop  offset="1" className={cssStyle.radialGradient5stop2}/>
                </radialGradient>
                <radialGradient id={`SVGID_3_${id}`} cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse">
                    <stop  offset="0" className={cssStyle.radialGradient3stop1}/>
                    <stop  offset="0.1575" className={cssStyle.radialGradient3stop2}/>
                    <stop  offset="0.6391" className={cssStyle.radialGradient3stop3}/>
                    <stop  offset="1" className={cssStyle.radialGradient3stop4}/>
                </radialGradient>
                <linearGradient id={`SVGID_4_${id}`} gradientUnits="userSpaceOnUse" x1={style.headLeft*fontSize+13.6} y1="0" x2={(style.headLeft+style.headWidth)*fontSize+13.6} y2="0">
                    <stop  offset="0" className={cssStyle.radialGradient1stop1}/>
                    <stop  offset="0.1206" className={cssStyle.radialGradient1stop2}/>
                    <stop  offset="0.3465" className={cssStyle.radialGradient1stop3}/>
                    <stop  offset="0.5669" className={cssStyle.radialGradient1stop4}/>
                    <stop  offset="0.5955" className={cssStyle.radialGradient1stop5}/>
                    <stop  offset="0.8692" className={cssStyle.radialGradient1stop6}/>
                    <stop  offset="1" className={cssStyle.radialGradient1stop7}/>
                </linearGradient>
                <rect x={style.headLeft*fontSize} y="1.1" style={{fill:`url(#SVGID_1_${id})`}} width={style.headWidth*fontSize+27.2} height={style.headHeight*fontSize} className={cssStyle.rect1}/>
                <polygon className={cssStyle.polygon2} points={`2,10.5 2,${height-2} ${width-7.6},${height-2} ${width-1},${height-10} ${width-1},${height-52.6} ${width-5.6},${height-57.8} ${width-5.6},41.9 ${width-1},37.1 ${width-1},8
                ${width-8.4},8 ${width-17.2},1 ${(style.headLeft+style.headWidth)*fontSize+27.2},1 ${(style.headLeft+style.headWidth)*fontSize+13.6},${style.headHeight*fontSize+1.6} ${style.headLeft*fontSize+13.6},${style.headHeight*fontSize+1.6} ${style.headLeft*fontSize},1 16.1,1 `} style={{fill:`url(#SVGID_${style.fill ? style.fill : 2}_${id})`,stroke:`url(#SVGID_3_${id})`,fillOpacity: style.fillOpacity!=null ? style.fillOpacity : 0.08}}/>
                <polygon className={cssStyle.polygon3} points="2,1 2,6 10,1"/>
                {this.getRectList(width,height)}
                <rect x={style.headLeft*fontSize+13.6} y="0" style={{fill:`url(#SVGID_4_${id})`}} width={style.headWidth*fontSize} height="1" className={cssStyle.rect2}/>
            </svg>
        );
    }
}