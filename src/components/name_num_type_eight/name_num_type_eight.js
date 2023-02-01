import React from "react";
import ComponentBox from "../component_box";
import {Motion, spring} from "react-motion";
import axios from "axios";

import cssStyle from "./name_num_type_eight.module.css";
import {getColumnNum} from "../../common/util";

export default class NameNumTypeEight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],selectedIndex:0,show:false,showBox:false};
        this.keyParams = {};
        this.refreshTimer = [];
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(resolve)});
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
        this.getData();
    }

    //获取数据
    getData(resolve){
        const {content} = this.props.thisData.style;
        const {resultData} = this.state;
        content.forEach((item,index) => {
            if(this.refreshTimer[index]){
                clearTimeout(this.refreshTimer[index]);
            }
            if (item.freshTime) {
                this.refreshTimer[index] = setTimeout(() => {
                    this.getData();
                }, item.freshTime);
            }
            if(item.dataType === 1){
                let defaultData = [];
                try {
                    defaultData = JSON.parse(item.defaultData);
                }catch (e) {
                }
                resultData[index] = defaultData;
                this.setState({resultData});
                if(resolve){
                    resolve(defaultData);
                }
            }else{
                let params = {};
                try {
                    params = JSON.parse(item.dataParams);
                }catch (e) {}
                for(let key in this.keyParams){
                    params[key] = this.keyParams[key];
                }
                axios.get(item.dataUrl,{params:params}).then((response) => {
                    // 在这儿实现 setState
                    const result = response.data.data;
                    if(result){
                        resultData[index] = result;
                        this.setState({resultData});
                        if(resolve){
                            resolve(result);
                        }
                    }
                }).catch(function(error){
                    // 处理请求出错的情况
                });
            }
        });
    }

    getItemColor(item,data,index){
        let color;
        if(item.fontColorType === 1){
            color = item.fontColor;
        }else if(item.fontColorType === 2){
            item.fontColorList.forEach((colorItem) => {
                if(colorItem.num == data[item.fontColorKey]){//eslint-disable-line
                    color = colorItem.color;
                }
            });
        }else{
            item.fontColorList.forEach((colorItem) => {
                if((index+1) >= colorItem.bottom && (index+1) < colorItem.top){
                    color = colorItem.color;
                }
            });
        }
        return color;
    }

    getText(list,split,data,allIndex){
        return list && (
            list.map((item,index) => {
                const returnDom = [];
                returnDom.push(<div key={item.key+index+'split'} style={{fontSize:item.fontSize+'em',color:this.getItemColor(item,data,allIndex)}}>{data[item.key]}</div>);
                //分隔符
                if(split.key && index < list.length - 1){
                    returnDom.push(
                        <div key={index+'split'} style={{fontSize:split.fontSize+'em',color:this.getItemColor(item,data,allIndex)}}>{split.key}</div>
                    );
                }
                return returnDom;
            })
        );
    }

    changeShow(){
        if(this.state.show){
            this.setState({show:false});
            setTimeout(()=>{this.setState({showBox:false})},1000);
        }else{
            this.setState({showBox:true});
            setTimeout(()=>{this.setState({show:true})},10);
        }
    }

    render() {
        const {position,style} = this.props.thisData;
        const {resultData,showBox} = this.state;
        const {button,splitLine,content} = style;
        const splitLineWidth = this.props.getCompatibleSize(splitLine.width);
        const splitLineHeight = this.props.getCompatibleSize(splitLine.height);
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        if(this.props.editType || showBox){
            return (
                <ComponentBox style={{...this.props.style,overflow:'hidden'}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                    <div className={cssStyle.allBox} style={{fontSize}}>
                        <Motion style={{opacity:spring(this.state.opacity),offset: spring(this.state.show ? 0 : 100)}}>
                            {({opacity,offset}) => {
                                let offsetStyle = {};
                                switch (style.flexDirection) {
                                    case 1:
                                        offsetStyle = {left:-offset+'%'};
                                        break;
                                    case 2:
                                        offsetStyle = {right:-offset+'%'};
                                        break;
                                    case 3:
                                        offsetStyle = {top:-offset+'%'};
                                        break;
                                    case 4:
                                        offsetStyle = {bottom:-offset+'%'};
                                        break;
                                    default:
                                }
                                return (
                                    <div className={`${cssStyle.box} ${cssStyle.flex}`} style={{...offsetStyle,opacity,flexDirection:style.flexDirection,backgroundColor:style.backgroundColor}}>
                                        {content.map((contentItem,contentIndex) => {
                                            const returnDom = [];
                                            //计算项宽高
                                            let contentData = resultData[contentIndex] ? resultData[contentIndex].slice():[];
                                            const itemStyle = getColumnNum(contentItem,contentData);
                                            returnDom.push(
                                                <div className={`${cssStyle.contentItem} ${cssStyle.flex}`} style={{width:contentItem.width,height:contentItem.height,flexDirection:contentItem.flexDirection}} key={contentIndex}>
                                                    {contentData.map((item,index) => {
                                                        if(item){
                                                            return (
                                                                <div className={`${cssStyle.item} ${cssStyle.flex}`} style={{...itemStyle,flexDirection:contentItem.itemFlexDirection}} key={index}>
                                                                    <div className={cssStyle.flex} style={{width:contentItem.nameWidth,height:contentItem.nameHeight,justifyContent:contentItem.nameJustifyContent,alignItems:contentItem.nameAlignItems}}>
                                                                        {this.getText(contentItem.nameList,contentItem.nameSplit,item,index)}
                                                                    </div>
                                                                    <div className={cssStyle.flex} style={{width:contentItem.numWidth,height:contentItem.numHeight,justifyContent:contentItem.numJustifyContent,alignItems:contentItem.numAlignItems}}>
                                                                        {this.getText(contentItem.numList,contentItem.numSplit,item,index)}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }else{
                                                            return <div className={`${cssStyle.item} ${cssStyle.flex}`} style={{...itemStyle,flexDirection:contentItem.itemFlexDirection}} key={index} />;
                                                        }
                                                    })}
                                                </div>
                                            );
                                            //分割线
                                            if(contentIndex < content.length - 1){
                                                returnDom.push(
                                                    <div key={contentIndex+'line'} style={{width:splitLineWidth,height:splitLineHeight,backgroundColor:splitLine.backgroundColor}}/>
                                                );
                                            }
                                            return returnDom;
                                        })}
                                        <div className={cssStyle.button}
                                             style={{left:button.left,top:button.top,bottom:button.bottom,right:button.right,backgroundColor:style.backgroundColor,color:button.fontColor,fontSize:button.fontSize+'em'}}
                                             onClick={this.changeShow.bind(this)}
                                        >
                                            {this.state.show ? '收起':'展开'}
                                        </div>
                                    </div>
                                );
                            }}
                        </Motion>
                    </div>
                </ComponentBox>
            );
        }else{
            let boxStyle = {...position,fontSize};
            switch (style.flexDirection) {
                case 1:
                    boxStyle.width = '0%';
                    break;
                case 2:
                    boxStyle.height = '0%';
                    break;
                case 3:
                    boxStyle.left = 'calc('+position.left+' + '+position.width+')';
                    boxStyle.width = '0%';
                    break;
                case 4:
                    boxStyle.top = 'calc('+position.top+' + '+position.height+')';
                    boxStyle.height = '0%';
                    break;
                default:
            }
            return (
                <ComponentBox className={cssStyle.box} style={boxStyle} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData}>
                    <div className={cssStyle.button}
                         style={{left:button.left,top:button.top,bottom:button.bottom,right:button.right,backgroundColor:style.backgroundColor,color:button.fontColor,fontSize:button.fontSize+'em'}}
                         onClick={this.changeShow.bind(this)}
                    >
                        {this.state.show ? '收起':'展开'}
                    </div>
                </ComponentBox>
            );
        }
    }
}