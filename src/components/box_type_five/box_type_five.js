import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./box_type_five.module.css";
import {Motion, spring} from "react-motion";
import {getCompatibleSize, interactData, changeComponentShow} from "../../common/util";
import lightIcon from "./images/light.png";
import SvgBox from "./svgBox";

export default class BoxTypeFive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false, opacity:0, width:0, height:0, move:true};
        this.boxRef = React.createRef();
        this.interactData = interactData.bind(this);
        this.changeComponentShow = changeComponentShow.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.timerShow){
            clearTimeout(this.timerShow);
        }
        if(this.timerReshow){
            clearTimeout(this.timerReshow);
        }
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
        this.startMove();
    }

    //闪光移动计时器
    startMove(){
        this.timerShow = setTimeout(()=>{this.setState({move:true});},300);
        const time = Math.random()*10 + 5;
        this.timerReshow = setTimeout(() => {
            this.setState({move:false});
            this.startMove();
        },time*1000)
    }

    //点击响应
    itemClick(hasInteract){
        if(hasInteract){
            const {interact} = this.props.thisData.dataSources;
            this.interactData(interact,{});
        }
    }

    //刷新背景框
    refreshBox(){
        setTimeout(()=>{
            this.setState({});
        });
    }

    render() {
        const {style,id,dataSources} = this.props.thisData;
        // const {width,height} = this.state;
        let width,height;
        if(this.boxRef && this.boxRef.current){
            width = this.boxRef.current.clientWidth;
            height = this.boxRef.current.clientHeight;
        }
        const fontSize = style.fontSize ? getCompatibleSize(style.fontSize,'num') : 12;
        const hasInteract = dataSources && dataSources.interact && dataSources.interact.length > 0;
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div style={{opacity:opacity}} className={cssStyle.box} ref={this.boxRef}>
                            {width && height && (
                                <SvgBox width={width} height={height} id={id} style={style} fontSize={fontSize}/>
                            )}
                            <div className={`${cssStyle.line} ${cssStyle.lineRow} ${this.state.move ? cssStyle.lineMoveRow :cssStyle.lineMoveRowOut}`}>
                                <img alt={''} src={lightIcon} className={cssStyle.lineImg}/>
                            </div>
                            <div className={`${cssStyle.line} ${cssStyle.lineColumn} ${this.state.move ? cssStyle.lineMoveColumn :cssStyle.lineMoveColumnOut}`}>
                                <img alt={''} src={lightIcon} className={cssStyle.lineImg}/>
                            </div>
                            <div className={cssStyle.head} onClick={this.itemClick.bind(this,hasInteract)}
                                 style={{left:`calc(${style.headLeft}em + 13.6px)`,width:style.headWidth+'em',height:style.headHeight+'em',fontSize:fontSize+'px',color:style.fontColor,cursor:hasInteract?'pointer':''}}
                            >
                                {style.headContent}
                                <div className={`${cssStyle.line} ${cssStyle.lineTitle}`}>
                                    <img alt={''} src={lightIcon} className={cssStyle.lineImg}/>
                                </div>
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}