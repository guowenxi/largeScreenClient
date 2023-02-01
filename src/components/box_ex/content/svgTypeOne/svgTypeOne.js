import React from "react";
import cssStyle from "./svgTypeOne.module.css";
import lightIcon from "./light.png"
import {Icon} from "antd";
import {getLinearBackground, getRadialBackground, interactData} from "../../../../common/util";

export default class circleTypeThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isBig:false};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.hideTimer){
            clearTimeout(this.hideTimer);
        }
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus && !this.props.showStatus){
            this.hideTimer = setTimeout(()=>{
                this.setState({isBig:false});
            },500);
        }
    }

    getHeight(){
        const {isBig} = this.state;
        const {style} = this.props.thisData;
        const heightNum = 100;
        if(isBig && style.multiple){
            return (heightNum*style.multiple)+'%';
        }else{
            return heightNum+'%';
        }
    }

    //大小切换响应
    changeHeight(){
        const {isBig} = this.state;
        this.setState({isBig:!isBig});
        if(isBig){
            const {interactHide} = this.props.thisData.style;
            this.interactData(interactHide,{});
        }else{
            const {interactShow} = this.props.thisData.style;
            this.interactData(interactShow,{});
        }
    }

    render() {
        const {style} = this.props.thisData;
        const {isBig} = this.state;
        const background = style.backgroundGradientType !== 'linear' ? getRadialBackground(style.backgroundColor) : getLinearBackground(style.backgroundColor,style.backgroundAngle);
        const height = this.getHeight();
        return (
            <div className={this.props.className} style={{height}}>
                <div className={cssStyle.headBox} style={{height:style.headHeight+'em',color:style.color}}>
                    {style.head}
                </div>
                <div className={cssStyle.contentBox}  style={{height:`calc(100% - ${style.headHeight}em)`,background,opacity:style.backgroundOpacity}}/>
                <img alt={''} src={lightIcon} className={cssStyle.lightIcon}/>
                <img alt={''} src={lightIcon} className={cssStyle.lightIconTwo} style={{top:style.headHeight+'em'}}/>
                {style.buttonShow && (
                    <div className={cssStyle.button} onClick={this.changeHeight.bind(this)}>
                        <div className={cssStyle.lineLeft}/>
                        <div>{isBig ? '收起':'展开'}</div>
                        <Icon type={isBig ? 'caret-up':'caret-down'} className={cssStyle.icon} />
                        <div className={cssStyle.lineRight}/>
                    </div>
                )}
            </div>
        );
    }
}