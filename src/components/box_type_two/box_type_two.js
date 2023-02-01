import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./box_type_two.module.css";
import { Motion, spring } from "react-motion";
import { getLinearBackground ,interactData} from "../../common/util";
import closeTypeOne from "../../common/images/closeTypeOne.svg";
import { fileUrl } from "../../config";

export default class BoxTypeTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { src: '', show: false, opacity: 0 };
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        if (this.props.firstLoad === false) {
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
    animateOn() {
        this.setState({ opacity: 1 });
    }

    //点击交互
    interact() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {});
    }

    getBgImg(){
        const {style} = this.props.thisData;
        if(style.backgroundImage&&style.type===1){
            return <img alt={''} src={fileUrl + '/download/' + style.backgroundImage} className={cssStyle.backgroundImg}/>;
        }
    }


    render() {
        const { style } = this.props.thisData;
        const thisStyle = this.props.thisData.style;
        const shadowLeft = style.shadowLeft ? this.props.getCompatibleSize(style.shadowLeft) : 0;
        const shadowTop = style.shadowTop ? this.props.getCompatibleSize(style.shadowTop) : 0;
        const blur = style.blur ? this.props.getCompatibleSize(style.blur) : '10px';
        const spread = style.blur ? this.props.getCompatibleSize(style.spread) : '5px';
        const borderWidthHeight = this.props.getCompatibleSize(thisStyle.littleWidthHeight);
        let background;
        if(style.type===1){
            background=''
        }else{
            if (style.backgroundType === 1) {
                background = style.backgroundColor
            } else {
                background = getLinearBackground(style.boxColor, style.angle);
            }
        }
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, background: background, boxShadow: shadowLeft + ' ' + shadowTop + ' ' + blur + ' ' + spread + ' ' + style.shadowColor, borderRadius: style.borderRadius, borderWidth: style.borderWidth, borderColor: style.borderColor, borderStyle: style.borderStyle }}>
                            {this.getBgImg()}
                            <div style={{ display: thisStyle.show === true ? 'block' : 'none' }}>
                                <div className={cssStyle.leftTop} style={{ width: borderWidthHeight, height: borderWidthHeight, borderWidth: this.props.getCompatibleSize(thisStyle.littleBorderWidth), borderColor: thisStyle.littleBorderColor }} />
                                <div className={cssStyle.rightTop} style={{ width: borderWidthHeight, height: borderWidthHeight, borderWidth: this.props.getCompatibleSize(thisStyle.littleBorderWidth), borderColor: thisStyle.littleBorderColor }} />
                                <div className={cssStyle.leftBottom} style={{ width: borderWidthHeight, height: borderWidthHeight, borderWidth: this.props.getCompatibleSize(thisStyle.littleBorderWidth), borderColor: thisStyle.littleBorderColor }} />
                                <div className={cssStyle.rightBottom} style={{ width: borderWidthHeight, height: borderWidthHeight, borderWidth: this.props.getCompatibleSize(thisStyle.littleBorderWidth), borderColor: thisStyle.littleBorderColor }} />
                            </div>
                            { style.iconShow===1&&
                                <img
                                alt="" className={cssStyle.closeBtn}
                                src={style.iconSelect===2?fileUrl + '/download/' + style.closeImg:closeTypeOne}
                                onClick={this.interact.bind(this)}
                                style={{
                                    width: style.iconSize,
                                    height: style.iconSize,
                                    right: style.iconRight,
                                    top: style.iconTop,
                                }}
                            />
                            }
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}