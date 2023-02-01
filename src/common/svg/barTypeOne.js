import React from "react";
import cssStyle from "./barTypeOne.module.css";

export default class BarTypeOne extends React.Component {
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
        const {percentage,num} = this.props;
        let width;
        if(this.boxRef && this.boxRef.current){
            width = this.boxRef.current.clientWidth*percentage/100;
        }
        return (
            <div style={this.props.style} className={cssStyle.barBox} ref={this.boxRef}>
                {width ? (
                    <svg x="0" y="0" viewBox={`0 0 ${width} 80`} style={{width:percentage+'%'}} preserveAspectRatio="none">
                        <linearGradient id={`BarTypeOne_${this.id}`} gradientUnits="userSpaceOnUse" x1={width} y1="0" x2="0" y2="0">
                            <stop  offset="0" style={{stopColor:'#09F9F8'}}/>
                            <stop  offset="0.1344" style={{stopColor:'#09F5F7',stopOpacity:'0.8656'}}/>
                            <stop  offset="0.2738" style={{stopColor:'#09E8F5',stopOpacity:'0.7262'}}/>
                            <stop  offset="0.4154" style={{stopColor:'#0AD4F0',stopOpacity:'0.5846'}}/>
                            <stop  offset="0.5587" style={{stopColor:'#0AB7EA',stopOpacity:'0.4413'}}/>
                            <stop  offset="0.7033" style={{stopColor:'#0B91E2',stopOpacity:'0.2967'}}/>
                            <stop  offset="0.8488" style={{stopColor:'#0B63D9',stopOpacity:'0.1512'}}/>
                            <stop  offset="0.9927" style={{stopColor:'#0C2ECE',stopOpacity:'7.293224e-003'}}/>
                            <stop  offset="1" style={{stopColor:'#0C2BCD',stopOpacity:'0'}}/>
                        </linearGradient>
                        <path
                            style={{fillRule:'evenodd',clipRule:'evenodd',fill:`url(#BarTypeOne_${this.id})`}}
                            d={`M0,0h${width-4.7}c0,0-9.9,8.9-9.9,20.8c0,11.4,14.6,25.5,14.6,37.1c0,12.8-4.7,22.1-4.7,22.1H0V0z`}
                        />
                    </svg>
                ):''}
                <div className={cssStyle.numBox} style={percentage > 50 ?{left:'0px',width:percentage+'%'}:{left:percentage+'%',width:(100-percentage)+'%'}}>{num}</div>
            </div>
        );
    }
}