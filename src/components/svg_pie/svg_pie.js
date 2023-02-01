import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./svg_pie.module.css";
import {Motion, spring} from "react-motion";
import SvgRing from "../../common/svgRing";
import {getData} from "../../common/getDataUtil";

export default class BoxTypeFive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false, opacity:0, resultData: 0};
        this.getData = getData.bind(this);
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
        this.p.then(() => {
            this.setState({opacity:1});
        });
    }

    //重新获取数据
    reGetData(){
        this.getData(this.callBack.bind(this,''));
    }

    //获取数据后回调
    callBack(resolve,result){
        if(result != null){
            this.setState({resultData:result});
            if(resolve){
                resolve(result);
            }
        }
    }

    render() {
        const {style} = this.props.thisData;
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div style={{opacity:opacity}} className={cssStyle.box}>
                            <SvgRing className={cssStyle.box} per={this.state.resultData} ringStyle={style}/>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}