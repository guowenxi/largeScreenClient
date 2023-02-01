import React from "react";
import cssStyle from "./barTypeTwo.module.css";

export default class BarTypeTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showNum:false,offsetX:0,offsetY:0};
        this.boxRef = React.createRef();
        this.id = new Date().getTime();
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    //组件加载触发函数
    componentDidMount() {
        this.timer = setTimeout(()=>{this.setState({})});
    }

    changeNumShow(flag,e){
        // console.log(e);
        // console.log({showNum:flag,offsetX:e.nativeEvent?e.nativeEvent.offsetX:0,offsetY:e.nativeEvent?e.nativeEvent.offsetY:0});
        this.setState({showNum:flag,offsetX:e.nativeEvent?e.nativeEvent.offsetX:0,offsetY:e.nativeEvent?e.nativeEvent.offsetY:0});
    }

    getSvg(width,height){
        const {percentage,contentStyle,opactiy} = this.props;
        const angle1 = Math.PI/10;
        const angle2 = Math.PI/6;
        const partWidth1 = width*0.6;
        const partWidth2 = width-partWidth1;
        const partHeight1 = partWidth1*Math.tan(angle1);
        const partHeight2 = partWidth2*Math.tan(angle2);
        const contentHeight = height - (partHeight1+partHeight2);
        const barHeight = contentHeight > 0 ? contentHeight*percentage/100+(partHeight1+partHeight2) : (partHeight1+partHeight2);
        return (
            <svg x="0" y="0" viewBox={`0 0 ${width} ${barHeight}`} style={{height:barHeight*100/height+'%',opactiy}} preserveAspectRatio="none" onMouseOver={this.changeNumShow.bind(this,true)} onMouseLeave={this.changeNumShow.bind(this,false)}>
                <linearGradient id={`linearGradient1_${this.id+this.props.index}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={barHeight} >
                    <stop  offset="0" stopColor={contentStyle.leftStartColor ? contentStyle.leftStartColor:'#16B0FF'}/>
                    <stop  offset="1" stopColor={contentStyle.leftEndColor ? contentStyle.leftEndColor:'#3933E4'}/>
                </linearGradient>
                <polygon points={`0,${partHeight1} ${partWidth2},${partHeight2+partHeight1} ${partWidth2},${barHeight} 0,${barHeight-partHeight2}`} fill={`url(#linearGradient1_${this.id+this.props.index})`} />
                <linearGradient id={`linearGradient2_${this.id+this.props.index}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={partHeight1+partHeight2} >
                    <stop  offset="0" stopColor={contentStyle.topStartColor ? contentStyle.topStartColor:'#72EFFF'}/>
                    <stop  offset="1" stopColor={contentStyle.topEndColor ? contentStyle.topEndColor:'#69D1FB'}/>
                </linearGradient>
                <polygon points={`${partWidth1},0 0,${partHeight1} ${partWidth2},${partHeight2+partHeight1} ${width},${partHeight2}`} fill={`url(#linearGradient2_${this.id+this.props.index})`} />
                <linearGradient id={`linearGradient3_${this.id+this.props.index}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={barHeight} >
                    <stop  offset="0" stopColor={contentStyle.rightStartColor ? contentStyle.rightStartColor:'#00EDFF'}/>
                    <stop  offset="1" stopColor={contentStyle.rightEndColor ? contentStyle.rightEndColor:'#3D5CE4'}/>
                </linearGradient>
                <polygon points={`${partWidth2},${partHeight2+partHeight1} ${width},${partHeight2} ${width},${barHeight-partHeight1} ${partWidth2},${barHeight}`} fill={`url(#linearGradient3_${this.id+this.props.index})`} />
            </svg>
        );
    }

    render() {
        const {num,name,tooltip} = this.props;
        const {offsetX,offsetY,showNum} = this.state;
        let width,height;
        if(this.boxRef && this.boxRef.current){
            width = this.boxRef.current.clientWidth;
            height = this.boxRef.current.clientHeight;
        }
        return (
            <div style={this.props.style} className={cssStyle.barBox} ref={this.boxRef}>
                {width && height && this.getSvg(width,height)}
                {tooltip !== false && (
                    <div className={cssStyle.num} style={{opacity:showNum?1:0,left:offsetX+'px',top:offsetY+'px'}}>
                        {name ? name+'：' : ''}{num}
                    </div>
                )}
            </div>
        );
    }
}