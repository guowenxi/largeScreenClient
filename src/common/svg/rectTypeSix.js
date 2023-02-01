import React from "react";

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
        this.timer = setTimeout(() => { this.setState({}) });
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
                        <linearGradient id={`SVGID_1_${this.id}`} gradientUnits="userSpaceOnUse" x1={`${width - 52.9372}`} y1={`${height + 10.937}`} x2={`${width - 11.063}`} y2={`${height - 30.937}`}>
                            <stop offset="0" style={{ stopColor: "#FFFFFF", stopOpacity: "0" }} />
                            <stop offset="0.9807" style={{ stopColor: "#FFFFFF", stopOpacity: "0.9807" }} />
                            <stop offset="1" style={{ stopColor: "#FFFFFF" }} />
                        </linearGradient>
                        <path d={`  M17.2,0.5 h${width - 18.4} l-16,${height - 1} H1.2 L17.2,0.5z`} style={{ fillRule: "evenodd", clipRule: "evenodd", fill: "#2579F2", stroke: `url(#SVGID_1_${this.id})`, strokeMiterlimit: "10" }} />
                    </svg>
                ) : ''}
            </div>
        );
    }
}