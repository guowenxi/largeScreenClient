import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./list_roll_type_two.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {getContentList} from "../../common/nameNumUtil";

export default class ListRollTypeTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],selectedIndex:0,show:false,showBox:false,left:0};
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
        this.getContentList = getContentList.bind(this);
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
            this.startMove();
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

    startMove(){
        const {number,timing} = this.props.thisData.style;
        this.timer = setTimeout(() => {
            let left = this.state.left + 1;
            if(this.state.resultData.length - (number ? number : 4) < left){
                left = 0;
            }
            this.setState({left});
            this.startMove();
        },(timing ? timing : 5000))
    }

    render() {
        const {style} = this.props.thisData;
        const {resultData} = this.state;
        const fontSize = this.props.getCompatibleSize(style.fontSize, 'num');
        const number = style.number ? style.number : 4;
        // const oneWidth = parseFloat((100/number).toFixed(2));
        const oneWidth = 100/number;
        return (
            <ComponentBox style={{...this.props.style,overflow:'hidden'}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize:fontSize}} >
                            <Motion style={{left:spring(this.state.left)}}>
                                {({left}) =>
                                    <div className={cssStyle.listBox} style={{width:oneWidth*resultData.length+'%',left:-left*oneWidth+'%'}}>
                                        {resultData.map((item,index)=>{
                                            return(
                                                <div key={index} style={{width:100/resultData.length+'%'}} className={cssStyle.itemBox}>
                                                    {this.getContentList(item,style.content)}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </Motion>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}