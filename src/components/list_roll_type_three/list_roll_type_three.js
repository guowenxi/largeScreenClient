import React from "react";

import ComponentBox from "../component_box";
import {Motion, spring} from 'react-motion';
import cssStyle from './list_roll_type_three.module.css';
import {getData} from "../../common/getDataUtil";

import itemBg from "./images/itemBg.png";

export default class ListRollTypeThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {resultData: [], showNewsItemIndex: 0,opacity:0};
        this.keyParams = {startTime: null, endTime: null};
        this.getData = getData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.intervalTimer){
            clearInterval(this.intervalTimer);
        }
        if(this.refreshTimer){
            clearTimeout(this.refreshTimer);
        }
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then((data) => {
            this.setState({resultData:data,opacity:1});
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey" :
                this.setState({showNewsItemIndex:data.data.index});
                break;
            case "animateOn":
                this.animateOn();
                break;
            default:
                break;
        }
    }

    //重新获取数据
    reGetData(){
        if(this.intervalTimer){
            clearInterval(this.intervalTimer);
        }
        this.setState({resultData:[],showNewsItemIndex:0});
        this.getData(this.callBack.bind(this,''));
    }

    //获取数据后回调
    callBack(resolve,result){
        if(result){
            this.setState({resultData:result});
            // setInterval(()=>{
            //     this.setState({showNewsItemIndex:this.state.showNewsItemIndex+1});
            // },2000);
            if(resolve){
                resolve(result);
            }
        }
    }

    getContent(){
        const {resultData,showNewsItemIndex} = this.state;
        return resultData.map((outerItem, outerIndex) => {
            return (
                <Motion style={{
                    selectedIndex: spring(showNewsItemIndex)
                }} key={outerIndex}>
                    {({selectedIndex}) => {
                        const sub = selectedIndex - outerIndex;
                        const subAbs = Math.abs(sub);
                        let style;
                        if(subAbs <= 3){
                            style = {
                                opacity: 1-subAbs/3,
                                width:(1-subAbs*0.33)*100+'%',
                                height:10*(3-subAbs)+'%',
                                left:(1-subAbs*0.33)*50+'%',
                                // top:(Math.abs(subAbs-2)*10+10)+'%',
                                top: (50 - sub*22.5 - (2-subAbs)*5*sub)+'%'
                            };
                        }else{
                            style = {
                                opacity:0,
                                width:'10%',
                                height:'10%',
                                left:'10%',
                                top:'-5%'
                            };
                        }
                        return (
                            <div className={cssStyle.itemBox} style={style}>
                                <img alt='' src={itemBg}  className={cssStyle.floor}/>
                                <div className={cssStyle.name}>{outerItem.name}</div>
                            </div>
                        );
                    }}
                </Motion>
            );
        })
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox id={this.props.thisData.id} thisData={this.props.thisData} style={this.props.style}
                          receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div style={{fontSize: fontSize,color:style.color,opacity}} className={cssStyle.box} >
                            {this.getContent()}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}