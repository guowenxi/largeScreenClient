import React from "react";
import cssStyle from "./svgMapTwo.module.css";
import liushiTop from "../images/liushiTopTwo.png";
import liushiBg from "../images/liushiBgTwo.png";
import {interactData} from "../../../common/util";
import {greenPath,bluePath,yellowPath} from "./svgMapTwoPath";

export default class SvgMapTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {line:0};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        setInterval(()=>{
            let {line} = this.state;
            line += 0.01;
            if(line > 1){
                line = -0.35;
            }
            this.setState({line});
        },20);
    }

    mapClick(){
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact);
    }

    render() {
        const {line} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} onClick={this.mapClick.bind(this)}>
                <img alt={''} src={liushiBg} className={cssStyle.box}/>
                <svg x="0px" y="0px" viewBox="0 0 1331 574" preserveAspectRatio="none"  className={cssStyle.box}>
                    <radialGradient id={`linearGradient_1`} cx="1278.5" cy="485" r="80%" gradientUnits="userSpaceOnUse" >
                        <stop offset={line+0.05>1?1:line+0.05} stopColor="#0051BF" stopOpacity="0"/>
                        <stop offset={line+0.1>1?1:line+0.1} stopColor="#0051BF" stopOpacity="1"/>
                        <stop offset={line+0.2>1?1:line+0.2} stopColor="#39DAFF" stopOpacity="1"/>
                        <stop offset={line+0.25>1?1:line+0.25} stopColor="#39DAFF" stopOpacity="0"/>
                    </radialGradient>
                    <radialGradient id={`linearGradient_2`} cx="1278.5" cy="485" r="80%" gradientUnits="userSpaceOnUse" >
                        <stop offset={line+0.05>1?1:line+0.05} stopColor="#52FF39" stopOpacity="0"/>
                        <stop offset={line+0.1>1?1:line+0.1} stopColor="#52FF39" stopOpacity="1"/>
                        <stop offset={line+0.2>1?1:line+0.2} stopColor="#A3FF95" stopOpacity="1"/>
                        <stop offset={line+0.25>1?1:line+0.25} stopColor="#A3FF95" stopOpacity="0"/>
                    </radialGradient>
                    <radialGradient id={`linearGradient_3`} cx="1278.5" cy="485" r="80%" gradientUnits="userSpaceOnUse" >
                        <stop offset={line+0.05>1?1:line+0.05} stopColor="#B8BC24" stopOpacity="0"/>
                        <stop offset={line+0.1>1?1:line+0.1} stopColor="#B8BC24" stopOpacity="1"/>
                        <stop offset={line+0.2>1?1:line+0.2} stopColor="#F2F65F" stopOpacity="1"/>
                        <stop offset={line+0.25>1?1:line+0.25} stopColor="#F2F65F" stopOpacity="0"/>
                    </radialGradient>
                    <g transform='translate(-613,-198)'>
                        {bluePath.map((item,index)=>{
                            if(item.type === 1){
                                return <path key={index} className={cssStyle.line} fill={`url(#linearGradient_1)`} d={item.path} />
                            }else{
                                return <rect key={index} className={cssStyle.line} fill={`url(#linearGradient_1)`} x={item.x} y={item.y} width={item.width} height={item.height}  />;
                            }
                        })}
                        {greenPath.map((item,index)=>{
                            if(item.type === 1){
                                return <path key={index} className={cssStyle.line} fill={`url(#linearGradient_2)`} d={item.path} />
                            }else{
                                return <rect key={index} className={cssStyle.line} fill={`url(#linearGradient_2)`} x={item.x} y={item.y} width={item.width} height={item.height}  />;
                            }
                        })}
                        {yellowPath.map((item,index)=>{
                            if(item.type === 1){
                                return <path key={index} className={cssStyle.line} fill={`url(#linearGradient_3)`} d={item.path} />
                            }else{
                                return <rect key={index} className={cssStyle.line} fill={`url(#linearGradient_3)`} x={item.x} y={item.y} width={item.width} height={item.height}  />;
                            }
                        })}
                    </g>

                </svg>
                <img alt={''} src={liushiTop} className={cssStyle.box}/>
                <div className={cssStyle.mask} />
            </div>
        );
    }
}