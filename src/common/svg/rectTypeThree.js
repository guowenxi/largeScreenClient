import React from "react";

export default class RectTypeThree extends React.Component {
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
        let {width,height} = this.props;
        if(!width || !height){
            if(this.boxRef && this.boxRef.current){
                width = this.boxRef.current.clientWidth;
                height = this.boxRef.current.clientHeight;
            }
        }
        return (
            <div style={this.props.style} className={this.props.className} ref={this.boxRef}>
                {width && height ? (
                    <svg x="0" y="0" viewBox={`0 0 ${width} ${height}`} style={{width:'100%',height:'100%'}} preserveAspectRatio="none">
                        <linearGradient id={`RectTypeThree_${this.id}`} gradientUnits="userSpaceOnUse" x1="45.6948" y1="100.0439" x2="355.8415" y2="100.0439">
                            <stop  offset="0" style={{stopColor:"#0F84FF"}}/>
                            <stop  offset="0.217" style={{stopColor:"#50B9FE"}}/>
                            <stop  offset="0.4341" style={{stopColor:"#8CEAFC"}}/>
                            <stop  offset="0.5376" style={{stopColor:"#A3FDFC"}}/>
                            <stop  offset="0.7358" style={{stopColor:"#64CCFD"}}/>
                            <stop  offset="1" style={{stopColor:"#148DFF"}}/>
                        </linearGradient>
                        <path d={`M1,3 V${height-3} A2,2 0 0,1 3,${height-1} H${width-3} A2,2 0 0,1 ${width-1},${height-3} V3 A2,2 0 0,1 ${width-3},1 H3 A2,2 0 0,1 1,3 Z`}
                              style={{stroke:`url(#RectTypeThree_${this.id})`}}
                              fill="#001447" fillOpacity={0.9}
                        />
                        {/*<filter id={`RectTypeThreeFilter_${this.id}`}  x="-10" y="-10" width={width-60} height={height-60}>*/}
                        {/*    <feGaussianBlur in="SourceGraphic" stdDeviation="30" />*/}
                        {/*</filter>*/}
                        {/*<rect x='20' y='20' width={width-40} height={height-40} fill="#001447" filter={`url(#RectTypeThreeFilter_${this.id})`} />*/}
                    </svg>
                ):''}
            </div>
        );
    }
}