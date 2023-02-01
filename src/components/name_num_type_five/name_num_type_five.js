import React from "react";
import ComponentBox from "../component_box";
import {Motion, spring} from "react-motion";

import cssStyle from "./name_num_type_five.module.css";
import {getData} from "../../common/getDataUtil";
import {interactData} from "../../common/util";

export default class NameNumTypeFive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[]};
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
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

    itemClick(index){
        const {itemInteract} = this.props.thisData.style;
        if(itemInteract){
            this.interactData(itemInteract[index]);
        }
    }

    render() {
        const {style} = this.props.thisData;
        if(style.itemList == null){
            style.itemList = [];
        }
        const {itemInteract} = style;
        const interactLength = itemInteract ? itemInteract.length : 0;
        const titleKey = style.titleKey ? style.titleKey : 'name';
        const numKey = style.numKey ? style.numKey : 'num';
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity}}>
                            <div className={cssStyle.background}/>
                            {this.state.resultData.map((item,index) => {
                                const itemStyle = style.itemList[index] ? style.itemList[index] : {};
                                const titleSize = this.props.getCompatibleSize(itemStyle.titleSize);
                                const numSize = this.props.getCompatibleSize(itemStyle.numSize);
                                const unitSize = this.props.getCompatibleSize(itemStyle.unitSize);
                                const dataLength = item[numKey] ? item[numKey].toString().length : 1;
                                const numBgLength = itemStyle.numBgLength && itemStyle.numBgLength > dataLength ? itemStyle.numBgLength : dataLength;
                                return (
                                    <div key={index} className={cssStyle.itemBox} style={{cursor:interactLength > index ? 'pointer':''}} onClick={this.itemClick.bind(this,index)} >
                                        <div style={{fontSize:titleSize,color:itemStyle.titleColor}}>{item[titleKey]}</div>
                                        <div className={cssStyle.numBox} style={index !== 0 ? {height:numSize}:{}}>
                                            <div className={cssStyle.numBg} style={{fontSize:numSize,color:itemStyle.numColor,fontFamily:itemStyle.numType === 2 ? 'LESLIE':''}}>
                                                {itemStyle.numType === 1 ? item[numKey]:<div className={cssStyle.numBg} style={{color:itemStyle.numBgColor}}>{"88888888".slice(0,numBgLength)}</div>}
                                                {itemStyle.numType === 1 ? null:<div className={cssStyle.num}>{item[numKey]}</div>}
                                            </div>
                                            <div className={cssStyle.unit} style={{fontSize:unitSize,color:itemStyle.unitColor}}>{itemStyle.unit}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}