import React from "react";
import ComponentBox from "../component_box";
import {Motion, spring} from "react-motion";

import cssStyle from "./name_num_type_six.module.css";
import {fileUrl} from "../../config";
import {interactData} from "../../common/util";
import {getData} from "../../common/getDataUtil";

export default class NameNumTypeSix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],selectedIndex:0};
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

    getItemColor(item,data,isSelected){
        let color;
        if(item.numFontColorType === 1){
            color = item.numFontColor;
        }else if(item.numFontColorType === 2){
            item.numFontColorList.forEach((colorItem) => {
                if(colorItem.num == data[item.numFontColorKey]){//eslint-disable-line
                    color = colorItem.color;
                }
            });
        }else{
            color = isSelected ? item.numFontColorSelected : item.numFontColor;
        }
        return color;
    }

    itemClick(clickItem,index){
        const {interact} = this.props.thisData.dataSources;
        this.interactData(interact,clickItem);
        this.setState({selectedIndex:index});
    }

    render() {
        const {style} = this.props.thisData;
        const {main,subOne,subTwo,split} = style;
        const padding = this.props.getCompatibleSize(style.padding);
        const indexFontSize = this.props.getCompatibleSize(style.indexFontSize);
        const mainTitleSize = this.props.getCompatibleSize(main.titleFontSize);
        const mainNumSize = this.props.getCompatibleSize(main.numFontSize);
        const subOneTitleSize = this.props.getCompatibleSize(subOne.titleFontSize);
        const subOneNumSize = this.props.getCompatibleSize(subOne.numFontSize);
        const subTwoTitleSize = this.props.getCompatibleSize(subTwo.titleFontSize);
        const subTwoNumSize = this.props.getCompatibleSize(subTwo.numFontSize);
        const splitTitleSize = this.props.getCompatibleSize(split.titleFontSize);
        const splitNumSize = this.props.getCompatibleSize(split.numFontSize);
        if(style.specialSelected == null){
            style.specialSelected = true;
        }
        if(style.showIndex == null){
            style.showIndex = true;
        }
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={`${cssStyle.box} ${cssStyle.flex}`} style={{opacity}}>
                            {this.state.resultData.map((item,index) => {
                                const isSelected = this.state.selectedIndex === index;
                                const thisIndex = style.hasCount ? (index === 0 ? '总':index):(index + 1);
                                //项盒子样式
                                let itemStyle = {};
                                if(style.specialSelected && this.state.selectedIndex === index){
                                    itemStyle.width = style.selectedWidth+'%';
                                    itemStyle.height = style.selectedHeight+'%';
                                    itemStyle.backgroundColor = style.backgroundColorSelected;
                                }else{
                                    itemStyle.backgroundColor = style.backgroundColor;
                                }
                                //序号颜色
                                let indexColor;
                                if(style.indexColorType === 1){
                                    indexColor = style.indexColor;
                                }else{
                                    style.indexColorList.forEach((colorItem) => {
                                        if((index+1) >= colorItem.bottom && (index+1) < colorItem.top){
                                            indexColor = colorItem.color;
                                        }
                                    });
                                }
                                //标题值颜色
                                const titleNumColor = this.getItemColor(main,item,isSelected);
                                //图标
                                let icon;
                                if(main.iconKey && main.iconList.length > 0){
                                    main.iconList.forEach((iconItem) => {
                                        if(iconItem.num == item[main.iconKey]){//eslint-disable-line
                                            icon = iconItem.icon;
                                        }
                                    });
                                }
                                const subOneNumColor = this.getItemColor(subOne,item,isSelected);
                                const subTwoNumColor = this.getItemColor(subTwo,item,isSelected);
                                const splitColor = this.getItemColor(split,item,isSelected);
                                return (
                                    <div className={`${cssStyle.item} ${cssStyle.flex} ${isSelected ? cssStyle.selected:''}`} key={index}
                                         style={{padding,...itemStyle}} onClick={this.itemClick.bind(this,item,index)}
                                    >
                                        <div className={`${cssStyle.main} ${cssStyle.flex}`}>
                                            {style.showIndex && <div style={{color:indexColor,fontSize:indexFontSize}}>{thisIndex}</div>}
                                            <div style={{fontSize:mainTitleSize,color:main.titleFontColor}}>
                                                {item[main.titleKey]}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize:mainNumSize,
                                                    color:titleNumColor,
                                                    borderColor:main.numBorderColor,
                                                    borderWidth:main.numBorderWidth,
                                                    borderRadius:main.numBorderRadius
                                                }}
                                                className={`${cssStyle.numBox} ${cssStyle.flex}`}
                                            >
                                                {icon && <img alt="" src={fileUrl + '/download/' + icon} className={cssStyle.icon}/>}
                                                <div>{item[main.numKey]}</div>
                                            </div>
                                        </div>
                                        {
                                            isSelected && style.hasSub && (
                                                <div className={`${cssStyle.sub} ${cssStyle.flex}`}>
                                                    {style.showIndex && <div className={cssStyle.hidden}>{thisIndex}</div>}
                                                    <div>
                                                        <span style={{fontSize:subOneTitleSize,color:subOne.titleFontColor}}>{item[subOne.titleKey]}</span>
                                                        <span style={{fontSize:splitTitleSize,color:split.titleFontColor}}>{split.titleKey}</span>
                                                        <span style={{fontSize:subTwoTitleSize,color:subTwo.titleFontColor}}>{item[subTwo.titleKey]}</span>
                                                    </div>
                                                    <div>
                                                        <span style={{fontSize:subOneNumSize,color:subOneNumColor}}>{item[subOne.numKey]}</span>
                                                        <span style={{fontSize:splitNumSize,color:splitColor}}>{split.numKey}</span>
                                                        <span style={{fontSize:subTwoNumSize,color:subTwoNumColor}}>{item[subTwo.numKey]}</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}