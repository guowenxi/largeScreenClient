import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./box_type_four.module.css";
import {Motion, spring} from "react-motion";
import {Icon} from "antd";
import {changeComponentShow, getCompatibleSize, interactData} from "../../common/util";
import SvgBox from "./svgBox";

export default class BoxTypeFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false, opacity:0, width:0, height:0, isBig: false};
        this.boxRef = React.createRef();
        this.changeComponentShow = changeComponentShow.bind(this);
        this.interactData = interactData.bind(this);
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
                this.changeComponentShow(true);
                this.refreshBox();
                break;
            case "hideComponent":
                //显示当前组件
                this.changeComponentShow(false);
                this.refreshBox();
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
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
        this.refreshBox();
    }

    //刷新背景框
    refreshBox(){
        setTimeout(()=>{
            this.setState({});
        });
    }

    getHeight(){
        const {isBig} = this.state;
        const {style} = this.props.thisData;
        const {height} = this.props.thisData.position;
        const heightNum = global.editType ? 100 : parseFloat(height);
        if(isBig && style.multiple){
            return (heightNum*style.multiple)+'%';
        }else{
            return heightNum+'%';
        }
    }

    render() {
        const {style,id} = this.props.thisData;
        const {isBig} = this.state;
        const headHeight = style.headHeight == null ? 0 : getCompatibleSize(style.headHeight,'num');
        const fontSize = getCompatibleSize(style.fontSize);
        let width,height;
        if(this.boxRef && this.boxRef.current){
            width = this.boxRef.current.clientWidth;
            height = this.boxRef.current.clientHeight;
        }
        return (
            <ComponentBox style={{...this.props.style,height:this.getHeight()}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div style={{fontSize,opacity:opacity}} className={cssStyle.box} ref={this.boxRef}>
                            {width && height && (
                                <SvgBox width={width} height={height} id={id} headHeight={headHeight}/>
                            )}
                            <div className={cssStyle.head} style={{height:headHeight+'px',color:style.fontColor}}>{style.headContent}</div>
                            {style.buttonShow && <Icon type={isBig ? 'caret-up':'caret-down'} className={cssStyle.more} onClick={this.changeHeight.bind(this)}/>}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}