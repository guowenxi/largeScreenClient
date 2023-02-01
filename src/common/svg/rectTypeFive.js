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
                    <svg x="0" y="0" viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', position:'absolute' }}>
                        <linearGradient id={`SVGID_1_${this.id}`} gradientUnits="userSpaceOnUse" x1="0" y1={`${height-15}`} x2={`${width}`} y2={`${height-15}`}>
                            <stop offset="0" style={{stopColor:"#43BAFE"}} />
                            <stop offset="1" style={{stopColor:"#43BAFE",stopOpacity:"0"}} />
                        </linearGradient>
                        <polygon style={{fill:`url(#SVGID_1_${this.id})`}} points={`11.3,0.5 0.5,${height} ${width},${height} ${width},0 `} />
                    </svg>
                ) : ''}
            </div>
        );
    }
}