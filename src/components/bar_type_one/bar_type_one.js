import React from 'react';
import Emitter from '../../common/eventBus';
import Util from '../../common/util';
import axios from 'axios';
import { Motion, StaggeredMotion, spring } from 'react-motion';

import ComponentBox from "../component_box";

import style from './bar_type_one.module.css';


export default class BarTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,color:'#000',isAnimate:false,resultData:[],maxNum:0};
        this.keyParams = {};
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

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey" :
                //修改请求条件
                for(let key in data.data){
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "deleteKey":
                //删除请求条件
                delete this.keyParams[data.keyName];
                break;
            case "deselect":
                //取消当前选中
                break;
            case "showPart":
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
        })
    }

    //重新获取数据
    reGetData(){
        this.setState({resultData:[]});
        this.getData();
    }

    //获取数据
    getData(resolve){
        if(this.props.thisData.dataSources.dataType === 1){
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            }catch (e) {
            }
            let showData = Util.dataFormat(defaultData);
            this.setState({resultData:showData,maxNum:Util.getMaxNum(showData)});
            if(resolve){
                resolve(showData);
            }
        }else if(this.props.thisData.dataSources.dataType === 2){
            let params = {};
            try {
                params = JSON.parse(this.props.thisData.dataSources.dataParams);
            }catch (e) {}
            for(let key in this.keyParams){
                params[key] = this.keyParams[key];
            }
            axios.get(this.props.thisData.dataSources.dataUrl,{params:params}).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                let showData = Util.dataFormat(result);
                this.setState({resultData:showData,maxNum:Util.getMaxNum(showData)});
                if(resolve){
                    resolve(showData);
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    clickItem(clickItem){
        if(this.props.thisData.dataSources.interact && this.props.thisData.dataSources.interact.length > 0){
            this.props.thisData.dataSources.interact.forEach((item,index) => {
                let sendData = {};
                switch (item.type) {
                    case 1:
                        sendData[item.keyName] = item.dataType === 1 ? clickItem.id : clickItem.name;
                        Emitter.emit(item.receiveId,{type:'changeKey',data:sendData});
                        break;
                    case 2:
                        break;
                    case 3:
                        sendData[item.keyName] = item.dataType === 1 ? clickItem.id : clickItem.name;
                        Emitter.emit(item.receiveId,{type:'showComponent',data:sendData});
                        break;
                    default:
                        break
                }
            });
        }
    }

    render() {
        let resultData = this.state.resultData.slice();
        const thisStyle = this.props.thisData.style;
        const columnNum = thisStyle.columnNum ? thisStyle.columnNum : 1;
        const columnGap = thisStyle.columnGap ? thisStyle.columnGap : 0;
        const rowNum = Math.ceil(resultData.length/columnNum);
        //计算多余个数
        const subNum = rowNum*columnNum - resultData.length;
        for(let i = 0;i < subNum;i ++){
            resultData.push({id:(new Date().getTime())});
        }
        const rowGap = thisStyle.rowGap ? thisStyle.rowGap : 0;
        const itemStyle = {
            width: columnNum === 1 ? '100%' : (100 - columnGap*(columnNum - 1))/columnNum + '%',
            height: (100 - rowGap*(rowNum - 1))/rowNum + '%',
        };
        const defaultStyle = resultData.map(() => ({opacity : 0}));
        return (
            <ComponentBox receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} style={this.props.style}>
                { resultData.length > 0 ?
                        <StaggeredMotion
                            key={defaultStyle.length}
                            defaultStyles={defaultStyle}
                            styles={prevStyles => prevStyles.map((item, i) => {
                                return i === 0
                                    ? {opacity:this.state.opacity}
                                    : {
                                        opacity: spring(prevStyles[i - 1].opacity)
                                    };

                            })}>
                            {interpolatingStyles =>
                                <div className={style.barBox} >
                                    {interpolatingStyles.map((item, i) => {
                                        const thisData = resultData[i];
                                        if(thisData == null || thisData.name == null){
                                            return (
                                                <div key={i} className={style.hideItem} style={itemStyle}/>
                                            );
                                        }else{
                                            const thisWidth = thisData.num/this.state.maxNum;
                                            return (
                                                <div key={i} className={style.itemBox} style={{...itemStyle,opacity: item.opacity,background:thisStyle.itemBackground,paddingLeft:thisStyle.itemPaddingLeft,paddingRight:thisStyle.itemPaddingRight,
                                                    border:this.props.getCompatibleSize(thisStyle.border)+' '+thisStyle.borderColor+' '+thisStyle.borderStyle}} onClick={this.clickItem.bind(this,thisData)}>
                                                    <Motion style={{width: spring(thisWidth)}} >
                                                        {({width}) =>
                                                            <div className={style.itemBar} style={{width:(width*100)+'%',background:thisStyle.barColor}}/>
                                                        }
                                                    </Motion>
                                                    <div className={style.itemFont} style={{float:thisStyle.nameFloat,fontSize:this.props.getCompatibleSize(thisStyle.nameFontSize),color:thisStyle.nameFontColor}}>{thisData.name}</div>
                                                    <div className={style.itemFont} style={{float:thisStyle.numFloat,fontSize:this.props.getCompatibleSize(thisStyle.numFontSize),color:thisStyle.numFontColor}}>{thisData.num}</div>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            }
                        </StaggeredMotion>
                    : null }
            </ComponentBox>
        );
    }
}
