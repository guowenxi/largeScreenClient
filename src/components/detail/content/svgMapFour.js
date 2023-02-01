import React from "react";
import cssStyle from "./svgMapFour.module.css";
import mapBg from "../images/yueqingMap.png";
import {interactData} from "../../../common/util";

export default class SvgMapThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.interactData = interactData.bind(this);
        this.position = {
            "乐成街道" : {top:'46.5%',left:'30.8%'},
            "仙溪镇" : {top:'21.5%',left:'76.6%'},
            "北白象镇" : {top:'45.5%',left:'10.8%'},
            "南塘镇" : {top:'72.5%',left:'60%'},
            "南岳镇" : {top:'75.2%',left:'53%'},
            "城东街道" : {top:'65%',left:'37.2%'},
            "城南街道" : {top:'66%',left:'27.5%'},
            "大荆镇" : {top:'38%',left:'87.5%'},
            "天成街道" : {top:'95.5%',left:'47.6%',showLine:true},
            "岭底乡" : {top:'17.5%',left:'41%',showLine:true},
            "柳市镇" : {top:'88%',left:'3.6%',showLine:true},
            "淡溪镇" : {top:'38%',left:'43.2%'},
            "清江镇" : {top:'61.5%',left:'66.6%'},
            "湖雾镇" : {top:'83.5%',left:'87.8%',showLine:true},
            "白石街道" : {top:'39%',left:'20.8%'},
            "盐盆街道" : {top:'98.5%',left:'33.6%',showLine:true},
            "石帆街道" : {top:'53%',left:'42.2%'},
            "磐石镇" : {top:'36%',left:'0.8%',showLine:true},
            "翁垟街道" : {top:'80.6%',left:'22.8%'},
            "芙蓉镇" : {top:'43.5%',left:'62.6%'},
            "蒲岐镇" : {top:'74%',left:'45%'},
            "虹桥镇" : {top:'95.5%',left:'65.6%',showLine:true},
            "雁荡镇" : {top:'48%',left:'74.2%'},
            "龙西乡" : {top:'25%',left:'66%'},
            "智仁乡" : {top:'12.5%',left:'90%',showLine:true},
        };
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    roadClick(road){
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, road);
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <img alt={''} src={mapBg} />
                {detail && detail.map && detail.map((road,index)=>{
                    if(this.position[road.name]){
                        return (
                            <div key={index} className={cssStyle.numBox} style={this.position[road.name]} onClick={this.roadClick.bind(this,road)}>
                                {road.num}
                                {this.position[road.name].showLine && <div className={cssStyle.numLine} />}
                            </div>
                        );
                    }else{
                        return '';
                    }
                })}
            </div>
        );
    }
}