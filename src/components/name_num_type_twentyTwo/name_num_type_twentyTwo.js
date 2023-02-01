import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_twentyTwo.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";

import circleIcon from "./images/circle.svg";

export default class NameNumTypeTwenty extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0,resultData: [],selectedIndex: 0,show: false,showBox: false,deg: 0,showIndex: 0 };
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
        this.showIndex = 0;
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => { this.getData(this.callBack.bind(this, resolve)) });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
        setTimeout(()=>{
            this.setState({deg:180});
        },2000)
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.thisData.updateTime !== this.props.thisData.updateTime) {
            //组件数据源变更时刷新数据
            this.getData();
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey":
                for (let key in data.data) {
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
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity: 1 });
        })
    }

    //重新获取数据
    reGetData() {
        this.setState({ resultData: [] });
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        clearTimeout(this.timer);
        if (result && result.length > 0) {
            result.forEach((item,index)=>{
                item.topIndex = index;
            });
            const { style } = this.props.thisData;
            const showNum = style.showNum ? style.showNum : 5;
            let showList = JSON.parse(JSON.stringify(result));
            let enough = showList.length > showNum+2;
            while(!enough){
                showList = showList.concat(JSON.parse(JSON.stringify(result)));
                enough = showList.length > showNum+2;
            }
            this.changeShow(showList);
            if (resolve) {
                resolve(result);
            }
        }
    }

    changeShow(result){
        const { style } = this.props.thisData;
        const resultData = result ? result : this.state.resultData;
        if(resultData != null){
            const showNum = style.showNum != null ? style.showNum : 5;
            const oneDeg = style.oneDeg != null ? style.oneDeg : 40;
            const startDeg = style.startDeg != null ? style.startDeg : -10;
            resultData.forEach((item,index)=>{
                item.opacity = 1;
                item.show = false;
                if(index >= this.showIndex){
                    if((index - this.showIndex) <= showNum){
                        item.deg = startDeg + (this.showIndex - index)*oneDeg;
                        item.show = true;
                        if((index - this.showIndex) === showNum){
                            item.opacity = 0;
                        }
                    }else if((this.showIndex - (index - resultData.length)) < 2){
                        item.deg = startDeg + (this.showIndex - (index - resultData.length))*oneDeg;
                        item.show = true;
                        item.opacity = 0;
                    }
                }else{
                    if((index + resultData.length - this.showIndex) <= showNum){
                        item.deg = startDeg + (this.showIndex - (index + resultData.length))*oneDeg;
                        item.show = true;
                        if((index + resultData.length - this.showIndex) === showNum){
                            item.opacity = 0;
                        }
                    }else if((this.showIndex - index) < 2){
                        item.deg = startDeg + (this.showIndex - index)*oneDeg;
                        item.show = true;
                        item.opacity = 0;
                    }
                }
            });
            this.setState({ resultData: resultData });
        }
        if(style.moveTime){
            this.timer = setTimeout(()=>{
                this.showIndex ++;
                if(this.showIndex >= resultData.length){
                    this.showIndex = 0;
                }
                this.changeShow();
            },style.moveTime);
        }
    }

    render() {
        const { style } = this.props.thisData;
        const { resultData } = this.state;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize }} >
                            {resultData.map((item,index)=>{
                                if(item.show){
                                    return (
                                        <Motion style={{ deg: spring(item.deg),opacity:spring(item.opacity) }} key={index}>
                                            {({ deg,opacity }) => {
                                                const title = item[style.titleKey];
                                                return (
                                                    <div className={cssStyle.box} style={{ transform: `rotate(${deg}deg)`,opacity }} >
                                                        <div className={cssStyle.itemBox}  style={{ transform: `rotate(${-deg}deg)`,width:style.iconSize+'em',height:style.iconSize+'em',top:`calc(50% - ${style.iconSize/2}em)` }}>
                                                            <img alt='' src={circleIcon} className={cssStyle.image}/>
                                                            <div className={cssStyle.numBox}>
                                                                <div className={cssStyle.num} style={{fontSize:style.numSize+'em',color:style.numColor}}>{item[style.numKey]}</div>
                                                                {item.topIndex < style.topNum && <div className={cssStyle.index} style={{fontSize:style.topSize+'em',color:style.topColor}}>{style.text}{item.topIndex+1}</div>}
                                                            </div>
                                                            {title && <div className={cssStyle.title} style={{fontSize:(title.length > style.iconSize ? style.iconSize/title.length : 1)+'em',color:style.titleColor}}>{title}</div>}
                                                        </div>
                                                    </div>
                                                )
                                            }}
                                        </Motion>
                                    )
                                }else{
                                    return '';
                                }
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}