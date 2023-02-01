import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./rect_pie.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {getCompatibleSize} from "../../common/util";

import Rect from "./rect";

export default class RectPie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],points:[]};
        this.boxRef = React.createRef();
        this.getData = getData.bind(this);
        this.keyParams = {};
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.timer){
            clearTimeout(this.timer);
        }
        if(this.detailTimer){
            clearTimeout(this.detailTimer);
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey" :
                for(let key in data.data){
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "showComponent":
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.p.then(() => {
            this.setState({opacity:1});
        })
    }

    //重新获取数据
    reGetData(){
        this.setState({resultData:[]});
        this.getData(this.callBack.bind(this,''));
    }

    //获取数据后回调
    callBack(resolve,result){
        if(result){
            this.setState({resultData:result});
            if(resolve){
                resolve(result);
            }
        }
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize,'num');
        let width,height;
        if(this.boxRef && this.boxRef.current){
            width = this.boxRef.current.clientWidth;
            height = this.boxRef.current.clientHeight;
        }
        const lineWidth = style.lineWidth ? style.lineWidth : 1;
        const radius = (style.radius ? style.radius : 1)*fontSize;
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize:fontSize+'px'}} ref={this.boxRef}>
                            {width && height && <Rect width={width} height={height} data={this.state.resultData} id={this.props.thisData.id+'rect_pie'} lineWidth={fontSize*lineWidth} radius={radius} fontSize={fontSize} numKey={style.numKey} />}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}