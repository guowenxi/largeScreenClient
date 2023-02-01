import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./box_type_three.module.css";
import {Motion, spring} from "react-motion";

export default class BoxTypeThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false, opacity:0};
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "showComponent":
                //显示当前组件
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    lineTop(lineBackground,lineHeight){
        return (<div className={cssStyle.line} style={{background:lineBackground,height:lineHeight,top: 0}}/>)
    }

    lineBottom(lineBackground,lineHeight){
        return(<div className={cssStyle.line} style={{background:lineBackground,height:lineHeight,bottom: 0}}/>)
    }

    render() {
        const {style} = this.props.thisData;
        const borderRadius = this.props.getCompatibleSize(style.borderRadius);
        const borderWidth = this.props.getCompatibleSize(style.borderWidth);
        const lineHeight = this.props.getCompatibleSize(style.lineHeight);
        let boxBackground = 'linear-gradient('+style.angle+'deg,';
        style.boxColor && style.boxColor.forEach((item,index) => {
            boxBackground += item.color + ' ' + item.percent + '%' + (index < style.boxColor.length - 1 ? ',':'');
        });
        boxBackground += ')';
        let lineBackground = 'radial-gradient(ellipse,';
        style.lineColor && style.lineColor.forEach((item,index) => {
            lineBackground += item.color + ' ' + item.percent + '%' + (index < style.lineColor.length - 1 ? ',':'');
        });
        lineBackground += ')';
        let linePosition=''
        if(style.linePosition==='top'){
            linePosition=this.lineTop(lineBackground,lineHeight)
        }else{
            linePosition=this.lineBottom(lineBackground,lineHeight)
        }
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity:opacity,background:boxBackground,borderRadius:borderRadius,borderWidth:borderWidth,borderColor:style.borderColor,borderStyle:'solid'}}>
                            {linePosition}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}