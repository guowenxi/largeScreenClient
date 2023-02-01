import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./line_type_one.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {getCompatibleSize,dataFormat,getAllMaxNum} from "../../common/util";
import Line from "./line";

import iconOne from "./images/icon1.png";
import iconTwo from "./images/icon2.png";

export default class LineTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],points:[],maxNum:0,selectedIndex:0};
        this.getData = getData.bind(this);
        this.boxRef = React.createRef();
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
            this.setState({resultData:dataFormat(result),maxNum:getAllMaxNum(result)});
            this.autoChangeSelected();
            if(resolve){
                resolve(result);
            }
        }
    }

    autoChangeSelected(){
        this.timer = setTimeout(()=>{
            let {resultData,selectedIndex} = this.state;
            selectedIndex ++;
            if(selectedIndex >= resultData.length){
                selectedIndex = 0;
            }
            this.setState({selectedIndex});
            this.autoChangeSelected();
        },4000);
    }

    render() {
        const {style} = this.props.thisData;
        const {resultData,maxNum,selectedIndex} = this.state;
        const fontSize = getCompatibleSize(style.fontSize);
        const itemWidth = 90/resultData.length;
        let width,height;
        if(this.boxRef && this.boxRef.current){
            width = this.boxRef.current.clientWidth;
            height = this.boxRef.current.clientHeight;
        }
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize}} >
                            <div className={cssStyle.lineBox}  ref={this.boxRef}>
                                {width && height && <Line data={resultData} maxNum={maxNum} width={width} height={height} itemWidth={itemWidth}/>}
                            </div>
                            <div className={cssStyle.listBox}>
                                {resultData.map((item,index)=>{
                                    const per = item.num*100/maxNum;
                                    return (
                                        <div key={index} className={cssStyle.itemBox} style={{width:itemWidth+'%'}} >
                                            <div className={cssStyle.rect} />
                                            <div className={`${cssStyle.name} ${selectedIndex === index ? cssStyle.selectedName:''}`}>{item.name}</div>
                                            <div className={cssStyle.dataBox}>
                                                <div className={cssStyle.circleBox} style={{bottom:per+'%'}}>
                                                    <img alt={''} src={selectedIndex === index ? iconTwo:iconOne} className={`${cssStyle.circle} ${selectedIndex === index ? cssStyle.selectedCircle:''}`}/>
                                                    <div className={`${cssStyle.num} ${per > 50 ? cssStyle.numBottom : cssStyle.numTop} ${selectedIndex === index ? cssStyle.selectedNum:''}`}>{item.num}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className={cssStyle.bottomLine} />
                            <div className={cssStyle.bottomRect} />
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}