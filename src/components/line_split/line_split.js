import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./line_split.module.css";
import {Motion, spring} from "react-motion";
import {getLinearBackground, getRadialBackground} from "../../common/util";

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

    render() {
        const {style} = this.props.thisData;
        const lineStyle = {
            width: style.lineType === "row" ? '100%':style.splitWidth,
            height: style.lineType !== "row" ? '100%':style.splitWidth,
            background: style.colorType !== 1 ? getRadialBackground(style.colorList) : getLinearBackground(style.colorList,style.lineType === "row" ? 90 : 0)
        };
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity:opacity}}>
                            <div className={cssStyle.line} style={lineStyle}/>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}