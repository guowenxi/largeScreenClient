import React from "react";
import ComponentBox from "../component_box";
import {Motion, spring} from "react-motion";

import cssStyle from "./name_num_type_seven.module.css";
import {fileUrl} from "../../config";
import {getData} from "../../common/getDataUtil";

export default class NameNumTypeSeven extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],selectedIndex:0};
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

    render() {
        let resultData = this.state.resultData.slice();
        const {style} = this.props.thisData;
        const {index,name,num,sub,icon} = style;
        //计算每项宽高
        const columnNum = style.columnNum ? style.columnNum : 1;
        const columnGap = style.columnGap ? style.columnGap : 0;
        const rowNum = Math.ceil(resultData.length/columnNum);
        //计算多余个数
        const subNum = rowNum*columnNum - resultData.length;
        for(let i = 0;i < subNum;i ++){
            resultData.push({id:(new Date().getTime())});
        }
        const rowGap = style.rowGap ? style.rowGap : 0;
        const itemStyle = {
            width: columnNum === 1 ? '100%' : (100 - columnGap*(columnNum - 1))/columnNum + '%',
            height: (100 - rowGap*(rowNum - 1))/rowNum + '%',
        };
        //计算字体大小
        const indexWidth = this.props.getCompatibleSize(index.width);
        const indexHeight = this.props.getCompatibleSize(index.height);
        const indexFontSize = this.props.getCompatibleSize(index.fontSize);
        const mainFontSize = this.props.getCompatibleSize(name.fontSize);
        const numFontSize = this.props.getCompatibleSize(num.fontSize);
        const subFontSize = this.props.getCompatibleSize(sub.fontSize);
        const iconWidth = this.props.getCompatibleSize(icon.width);
        const iconHeight = this.props.getCompatibleSize(icon.height);
        const padding = this.props.getCompatibleSize(style.padding);
        if(style.showIndex == null){
            style.showIndex = true;
        }
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={`${cssStyle.box} ${cssStyle.flex}`} style={{opacity,flexDirection:style.flexDirection}}>
                            {resultData.map((item,dataIndex) => {
                                if(dataIndex >= this.state.resultData.length){
                                    return <div className={`${cssStyle.item} ${cssStyle.flex}`} key={dataIndex} style={{...itemStyle}}/>;
                                }else{
                                    //序号颜色
                                    const indexColor = this.getItemColor(index,item,dataIndex);
                                    //标题颜色
                                    const mainColor = this.getItemColor(name,item,dataIndex);
                                    //值颜色
                                    const numColor = this.getItemColor(num,item,dataIndex);
                                    //副项颜色
                                    const subColor = this.getItemColor(sub,item,dataIndex);
                                    //图标
                                    let iconUrl;
                                    if(icon.iconKey && icon.iconList.length > 0){
                                        icon.iconList.forEach((iconItem) => {
                                            if(iconItem.num == item[icon.iconKey]){//eslint-disable-line
                                                iconUrl = iconItem.icon;
                                            }
                                        });
                                    }
                                    return (
                                        <div className={`${cssStyle.item} ${cssStyle.flex}`} key={dataIndex} style={{...itemStyle,backgroundColor:style.backgroundColor,padding}} >
                                            {style.showIndex && (
                                                <div className={`${cssStyle.flex} ${cssStyle.index}`} style={{color:indexColor,fontSize:indexFontSize,width:indexWidth,height:indexHeight,backgroundColor:index.backgroundColor}}>
                                                    {dataIndex+1}
                                                </div>
                                            )}
                                            <div style={{fontSize:mainFontSize,color:mainColor,width:name.width}}>
                                                {item[name.key]}
                                            </div>
                                            <div style={{fontSize:numFontSize,color:numColor,width:num.width}}>
                                                {item[num.key]}
                                            </div>
                                            {sub.key && (
                                                <div style={{fontSize:subFontSize,color:subColor,width:sub.width}}>
                                                    {item[sub.key]}
                                                </div>
                                            )}
                                            {icon.iconKey && <img alt="" src={iconUrl ? fileUrl + '/download/' + iconUrl:''} className={cssStyle.icon} style={{width:iconWidth,height:iconHeight}}/>}
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}