import React from "react";
import ComponentBox from "../component_box";
import {Motion, spring} from "react-motion";
import axios from "axios";

import cssStyle from "./name_num_type_one.module.css";

export default class NameNumTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[]};
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
        if(this.props.thisData.dataSources.dataType === 1){
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            }catch (e) {
            }
            this.setState({resultData:defaultData});
            if(resolve){
                resolve(defaultData);
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
                if(result){
                    this.setState({resultData:result});
                    if(resolve){
                        resolve(result);
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    render() {
        const {style} = this.props.thisData;
        const iconSize = this.props.getCompatibleSize(style.iconSize);
        const topTitleSize = this.props.getCompatibleSize(style.topTitleSize);
        const topTitleIndent = this.props.getCompatibleSize(style.topTitleIndent);
        const bigNumSize = this.props.getCompatibleSize(style.bigNumSize);
        const itemTitleSize = this.props.getCompatibleSize(style.itemTitleSize);
        const smallNumSize = this.props.getCompatibleSize(style.smallNumSize);
        const titleKey = style.titleKey ? style.titleKey : 'name';
        const numKey = style.numKey ? style.numKey : 'num';
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity}}>
                            <div className={cssStyle.titleOne}>
                                <div className={cssStyle.icon} style={{width:iconSize,height:iconSize,backgroundColor:style.iconColor}}/>
                                <span style={{fontSize:topTitleSize,color:style.topTitleColor,textIndent:topTitleIndent}}>
                                    {this.state.resultData[0] != null ? this.state.resultData[0][titleKey] :''}
                                </span>
                            </div>
                            <div className={`${cssStyle.positionOne} ${cssStyle.num}`} style={{fontSize:bigNumSize,color:style.bigNumBgColor}}>
                                8888
                            </div>
                            <div className={`${cssStyle.positionOne} ${cssStyle.num}`} style={{fontSize:bigNumSize,color:style.bigNumColor}}>
                                {this.state.resultData[0] != null ? this.state.resultData[0][numKey] :''}
                            </div>
                            <div className={`${cssStyle.positionTwo}`}>
                                <div className={cssStyle.item} style={{fontSize:itemTitleSize,color:style.itemTitleColor}}>
                                    {this.state.resultData[1] != null ? this.state.resultData[1][titleKey] :''}
                                </div>
                                <div className={cssStyle.item}>
                                    <div className={cssStyle.num} style={{fontSize:smallNumSize,color:style.smallNumBgColor}}>88</div>
                                    <div className={cssStyle.num} style={{fontSize:smallNumSize,color:style.smallNumColor}}>
                                        {this.state.resultData[1] != null ? this.state.resultData[1][numKey] :''}
                                    </div>
                                </div>
                            </div>
                            <div className={`${cssStyle.positionThree}`}>
                                <div className={cssStyle.item} style={{fontSize:itemTitleSize,color:style.itemTitleColor}}>
                                    {this.state.resultData[2] != null ? this.state.resultData[2][titleKey] :''}
                                </div>
                                <div className={cssStyle.item}>
                                    <div className={cssStyle.num} style={{fontSize:smallNumSize,color:style.smallNumBgColor}}>88</div>
                                    <div className={cssStyle.num} style={{fontSize:smallNumSize,color:style.smallNumColor}}>
                                        {this.state.resultData[2] != null ? this.state.resultData[2][numKey] :''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}