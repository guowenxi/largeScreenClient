import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./box_type_one.module.css";
import {Motion, spring} from "react-motion";

export default class BoxTypeOne extends React.Component {
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

    render() {
        const {style} = this.props.thisData;
        const divWidth = 'calc(100% - '+style.shadowLeft+')';
        const divHeight = 'calc(100% - '+style.shadowTop+')';
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div style={{opacity:opacity}}>
                            <div className={cssStyle.whiteBox} style={{backgroundColor:style.backgroundColor,width:divWidth,height:divHeight}}/>
                            <div className={cssStyle.blackBox} style={{backgroundColor:style.shadowColor,width:divWidth,height:divHeight,boxShadow:'0 0 2px '+style.shadowColor}}/>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}