import React from "react";
import cssStyle from "./rectTypeOne.module.css";

export default class RectTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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

    render() {
        let width,height;
        if(this.boxRef && this.boxRef.current){
            width = this.boxRef.current.clientWidth;
            height = this.boxRef.current.clientHeight;
        }
        return (
            <div style={this.props.style} className={this.props.className} ref={this.boxRef}>
                {width && height ? (
                    <svg x="0" y="0" viewBox={`0 0 ${width} ${height}`} style={{width:'100%',height:'100%'}}>
                        <radialGradient id={`RectTypeOne_${this.id}`} cx="50%" cy="50%" r="80%"  gradientUnits="userSpaceOnUse">
                            <stop  offset="0" className={cssStyle.radialGradientStop1}/>
                            <stop  offset="1" className={cssStyle.radialGradientStop2}/>
                        </radialGradient>
                        <rect x="0.5" y="0.5" fill={`url(#RectTypeOne_${this.id})`} width={width-1} height={height-1} className={cssStyle.rect}/>
                        <polygon className={cssStyle.polygon} points="5.5,0.5 0.5,0.5 0.5,5.5 "/>
                        <polygon className={cssStyle.polygon} points={`5.5,${height-0.5} 0.5,${height-0.5} 0.5,${height-5.5}`}/>
                        <polygon className={cssStyle.polygon} points={`${width-5.5},${height-0.5} ${width-0.5},${height-0.5} ${width-0.5},${height-5.5}`}/>
                        <polygon className={cssStyle.polygon} points={`${width-5.5},0.5 ${width-0.5},0.5 ${width-0.5},5.5`}/>
                    </svg>
                ):''}
            </div>
        );
    }
}