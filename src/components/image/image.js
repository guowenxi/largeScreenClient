import React from "react";
import ComponentBox from "../component_box";
import {Motion, spring} from "react-motion";
import cssStyle from './image.module.css';
import {fileUrl} from "../../config";
import {interactData} from "../../common/util";

export default class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false, opacity:0,scale:1,moveFlag:false,movementX:0,movementY:0};
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
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }


    scrollFunc(e){
        const {style} = this.props.thisData;
        if(style && style.scaleAction){
            let {scale} = this.state;
            if (e.deltaY < 0) { //当滑轮向上滚动时
                scale += 0.2;
            }else if (e.deltaY > 0) { //当滑轮向下滚动时
                scale -= 0.2;
            }
            if(scale <= 8 && scale >= 0.4){
                e.stopPropagation();
                this.setState({scale});
            }
        }
    };

    changeMoveFlag(moveFlag){
        this.setState({moveFlag});
    }

    moveImg(e){
        const {style} = this.props.thisData;
        if(this.state.moveFlag && style && style.moveAction){
            let {movementX,movementY} = this.state;
            movementX += e.movementX;
            movementY += e.movementY;
            this.setState({movementX,movementY});
        }
    }

    imgClick() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact);
    }

    render() {
        const {style} = this.props.thisData;
        const shadowLeft = style.shadowLeft ? this.props.getCompatibleSize(style.shadowLeft) : 0;
        const shadowTop = style.shadowTop ? this.props.getCompatibleSize(style.shadowTop) : 0;
        const blur = style.blur ? this.props.getCompatibleSize(style.blur) : '10px';
        const spread = style.blur ? this.props.getCompatibleSize(style.spread) : '5px';
        const { interact } = this.props.thisData.dataSources;
        return (
            <ComponentBox style={{...this.props.style,pointerEvents:style.ignoreClick?'none':'auto'}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity),scale:spring(this.state.scale)}}>
                    {({opacity,scale}) =>
                        <div
                            className={`${cssStyle.imgBox} ${style.sizeType === 2 ? cssStyle.flex:''}`}
                            onWheel={this.scrollFunc.bind(this)}
                            onMouseDown={this.changeMoveFlag.bind(this,true)}
                            onMouseUp={this.changeMoveFlag.bind(this,false)}
                            onMouseMove={this.moveImg.bind(this)}
                            // onMouseLeave={this.changeMoveFlag.bind(this,false)}
                            style={style.sizeType === 2 ? {justifyContent:style.justifyContent,alignItems:style.alignItems}:{}}
                        >
                            <img
                                alt={''} className={style.sizeType === 2 ? cssStyle.imgTwo:cssStyle.img}
                                draggable={false}
                                style={{
                                    opacity:opacity,
                                    boxShadow:shadowLeft+' '+shadowTop+' '+blur+' '+spread+' '+style.shadowColor,
                                    backgroundColor:style.backgroundColor,
                                    transform:`scale(${scale}) translate(${this.state.movementX}px,${this.state.movementY}px)`
                                }}
                                src={style.icon ? fileUrl + '/download/' + style.icon:''}
                            />
                            {interact && interact.length > 0 && <div className={cssStyle.clickDiv} onClick={this.imgClick.bind(this)}/>}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}