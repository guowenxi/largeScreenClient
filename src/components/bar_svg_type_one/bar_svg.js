import React from "react";

export default class Rect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.refDom = React.createRef();
    }

    //组件加载触发函数
    componentDidMount() {
        this.timer = setTimeout(() => this.setDom());
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    setDom(){
        this.setState({width:this.refDom.current.clientWidth,height:this.refDom.current.clientHeight});
    }

    render() {
        const {width,height} = this.state;
        return (
            <div ref={this.refDom} style={this.props.style} className={this.props.className}>
                {width && height && (
                    <svg id={this.props.id} x="0px" y="0px" viewBox={`0 0 ${width} ${height}`} style={{position:"absolute"}}>
                        <linearGradient id={"SVGID_1_"+this.props.id} gradientUnits="userSpaceOnUse" x1={width} y1="0" x2="0" y2="0">
                            <stop  offset="0" style={{stopColor:'#09F9F8'}}/>
                            <stop  offset="0.1344" style={{stopColor:'#09F5F7',stopOpacity:0.8656}}/>
                            <stop  offset="0.2738" style={{stopColor:'#09E8F5',stopOpacity:0.7262}}/>
                            <stop  offset="0.4154" style={{stopColor:'#0AD4F0',stopOpacity:0.5846}}/>
                            <stop  offset="0.5587" style={{stopColor:'#0AB7EA',stopOpacity:0.4413}}/>
                            <stop  offset="0.7033" style={{stopColor:'#0B91E2',stopOpacity:0.2967}}/>
                            <stop  offset="0.8488" style={{stopColor:'#0B63D9',stopOpacity:0.1512}}/>
                            <stop  offset="0.9927" style={{stopColor:'#0C2ECE',stopOpacity:7.293224e-003}}/>
                            <stop  offset="1" style={{stopColor:'#0C2BCD',stopOpacity:0}}/>
                        </linearGradient>
                        <polygon fill={`url(#SVGID_1_${this.props.id})`} points={`0,0 0,${height} ${width-height},${height} ${width},0 0,0`}/>
                    </svg>
                )}
            </div>
        );
    }
}