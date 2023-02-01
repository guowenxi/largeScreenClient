import React from "react";
import cssStyle from "./rectTypeFour.module.css";

export default class circleTypeThree extends React.Component {
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
        let width, height;
        if (this.boxRef && this.boxRef.current) {
            width = this.boxRef.current.clientWidth;
            height = this.boxRef.current.clientHeight;
        }
        return (
            <div style={this.props.style} className={this.props.className} ref={this.boxRef}>
                {width && height ? (
                    <svg x="0" y="0" viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
                        <linearGradient id={`SVGID_1_${this.id}`} gradientUnits="userSpaceOnUse" x1="0" y1={`${height-120}`} x2={`${width}`} y2={`${height-120}`}>
                            <stop offset="0" className={cssStyle.linearGradientStop1}></stop>
                            <stop offset="0.5" className={cssStyle.linearGradientStop2}></stop>
                            <stop offset="1" className={cssStyle.linearGradientStop3}></stop>
                        </linearGradient>
                        <path className={cssStyle.path1} style={{stroke:`url(#SVGID_1_${this.id})`}} d={`M17.6,0.5 L${width-14.7},0.5 l14.2,10.1 v${height-25.3} h-23.7 l-11.4,14.7 H40.3 l-12.3-18 H0.5 V19.7 L17.6,0.5z`} />
                        <g>
                            <g>
                            <path className={cssStyle.path2}  d={`M0,0 v14.6 L13.3,0 H0z M${width-10.4},0.5 L${width-0.5},7.9 V0.5 H${width-10.4}z M0.5,${height-14.1} v9 h32.2 l-6.6-9 H0.5z M${width-28.7},${height-4} H${width-0.5} v-7.9 h-22.1 L${width-28.7},${height-4}z`} fill="blue" />
                            </g>
                        </g>
                    </svg>
                ) : ''}
            </div>
        );
    }
}