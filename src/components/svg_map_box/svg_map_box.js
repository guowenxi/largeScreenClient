import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./svg_map_box.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {getCompatibleSize} from "../../common/util";
import {getPointsData} from "../../common/svgMapUtil";

export default class SvgMapBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],points:[],area:""};
        this.getData = getData.bind(this);
        this.getPointsData = getPointsData.bind(this);
        this.keyParams = {};
        this.pointsParams = {};
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
        this.getPointsData();
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
            case "dataInterchange" :
            case "changeKey" :
                for(let key in data.data){
                    this.keyParams[key] = data.data[key];
                }
                if(data.data && data.data.roadName){
                    this.setState({area:data.data.roadName});
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
        const fontSize = getCompatibleSize(style.fontSize);
        let MapContent;
        try{
            MapContent = require(`./${style.mapType}/${style.mapType}`).default;
        }catch (e) {}
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize}} >
                            {MapContent && <MapContent area={this.state.area} thisData={this.props.thisData} resultData={this.state.resultData} points={this.state.points} />}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}