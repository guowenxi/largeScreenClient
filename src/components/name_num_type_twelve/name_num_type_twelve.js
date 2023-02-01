import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_twelve.module.css";
import {getColumnNum,getItemColor} from "../../common/util";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";

export default class NameNumTypeTwelve extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],selectedIndex:0,show:false,showBox:false};
        this.keyParams = {};
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

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.updateTime !== this.props.thisData.updateTime){
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

    getContentItem(itemData,dataIndex){
        if(itemData){
            const {style} = this.props.thisData;
            return style.contentList && style.contentList.map((item,index) => {
                const thisStyle = {
                    width:item.width+'%',
                    height:item.height+'%',
                    left:item.left+'%',
                    top:item.top+'%',
                    justifyContent:item.justifyContent,
                    alignItems:item.alignItems,
                };
                const color = getItemColor(item,itemData,dataIndex);
                let content;
                if(item.contentType === 'icon'){
                    if(item.iconType === 'rect1'){
                        content = (
                            <svg viewBox={`0 0 100 100`} style={{width:item.fontSize+'em',height:item.fontSize+'em'}} className={cssStyle.absolute}>
                                <polygon points={`0,0 100,0 0,100`} fill={color}/>
                            </svg>
                        );
                    }else if(item.iconType === 'rect2'){
                        content = (
                            <svg viewBox={`0 0 100 100`} style={{width:item.fontSize+'em',height:item.fontSize+'em'}} className={cssStyle.absolute}>
                                <polygon points={`100,0 0,100 100,100`} fill={color}/>
                            </svg>
                        );
                    }else if(item.iconType === 'circle'){
                        const strokeWidth = item.strokeWidth || 1;
                        content = (
                            <svg viewBox={`0 0 100 100`} style={{width:item.fontSize+'em',height:item.fontSize+'em'}} className={cssStyle.relative}>
                                <circle cx="50" cy="50" r={50-strokeWidth} stroke={color} strokeWidth={strokeWidth} fill='rgba(0,0,0,0)'/>
                            </svg>
                        );
                    }
                }else if(item.contentType === 'text'){
                    thisStyle.fontSize = item.fontSize+'em';
                    thisStyle.color = color;
                    content = itemData[item.key];
                }
                return (
                    <div key={index} className={`${cssStyle.flex} ${cssStyle.contentItem}`} style={thisStyle}>
                        {content}
                    </div>
                );
            });
        }else{
            return null;
        }
    }

    render() {
        const {style} = this.props.thisData;
        const {resultData} = this.state;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const itemStyle = getColumnNum(style,resultData);
        const padding = style.padding || 0;
        const colorList = style.colorList || [];
        return (
            <ComponentBox style={{...this.props.style,overflow:'hidden'}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={`${cssStyle.allBox} ${cssStyle.flex}`} style={{opacity,flexDirection:style.flexDirection,fontSize,backgroundColor:style.backgroundColor}} >
                            {resultData.map((item,index) => {
                                if(item){
                                    const thisColor = colorList[index]||'#000';
                                    const border = `${style.borderWidth}px ${style.borderStyle} ${thisColor}`;
                                    return (
                                        <div className={cssStyle.item} style={{...itemStyle,padding:padding+'em',border}} key={index} >
                                            <div className={cssStyle.itemBox}>
                                                {this.getContentItem(item,index)}
                                            </div>
                                        </div>
                                    );
                                }else{
                                    return <div className={cssStyle.item} style={itemStyle} key={index} />;
                                }
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}