import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./text.module.css";
import { Motion, spring } from "react-motion";
import {interactData,changeComponentShow} from "../../common/util";
import {getData} from "../../common/getDataUtil";
import SpringScrollbars from "../../common/springScrollbars";

export default class Text extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0,content:'',resultData:{}};
        this.keyParams = {};
        this.interactData = interactData.bind(this);
        this.changeComponentShow = changeComponentShow.bind(this);
        this.getData = getData.bind(this);
        this.formatData = {};
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            try {
                this.formatData = JSON.parse(this.props.thisData.dataSources.dataParams);
            }catch (e) {
            }
            if(this.props.thisData.firstLoad){
                this.getData(this.callBack.bind(this,resolve));
            }else{
                this.callBack(resolve);
            }
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
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
                if(this.props.thisData.style.format){
                    for(let key in data.data){
                        this.formatData[key] = data.data[key];
                    }
                    this.setState({});
                }else{
                    if(this.props.thisData.dataSources.dataType === 2){
                        for(let key in data.data){
                            this.keyParams[key] = data.data[key];
                        }
                        this.reGetData();
                    }else{
                        for (let key in data.data) {
                            this.setState({content:data.data[key]})
                        }
                    }
                }
                break;
            case "dataInterchange":
                if(this.props.thisData.style.format){
                    for(let key in data.data){
                        this.formatData[key] = data.data[key];
                    }
                    this.setState({});
                }else{
                    for (let key in data.data) {
                        this.setState({content:data.data[key]});
                    }
                }
                break;
            case "showComponent":
                //显示当前组件
                this.changeComponentShow(true);
                break;
            case "hideComponent":
                //隐藏当前组件
                this.changeComponentShow(false);
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.p.then(() => {
            this.setState({opacity:1});
        });
    }

    //重新获取数据
    reGetData(){
        this.getData(this.callBack.bind(this,''));
    }

    //获取数据后回调
    callBack(resolve,result){
        if(result){
            const { style } = this.props.thisData;
            this.setState({resultData:result,content:style.key ? result[style.key]:result});
            if(this.props.thisData.firstSend){
                this.interact();
            }
        }
        if(resolve){
            resolve();
        }
    }
    //点击交互
    interact() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, this.state.resultData);
    }

    render() {
        const { style } = this.props.thisData;
        const { interact } = this.props.thisData.dataSources;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        let content = this.state.content && typeof(this.state.content) === 'string' ? this.state.content : style.text;
        let contentStyle = {
            color: style.fontColor,
            fontSize: fontSize,
            fontFamily: style.fontFamily,
            letterSpacing: style.letterSpacing
        };
        if(style.contentType !== 2){
            contentStyle.justifyContent = style.justifyContent;
            contentStyle.alignItems = style.alignItems;
            contentStyle.lineHeight = style.lineHeight?style.lineHeight+'em':'1.2em';
        }
        if(style.format){
            for(let key in this.formatData){
                content = content.replace('${'+key+'}',this.formatData[key]);
            }
        }
        return (
            <ComponentBox style={{ ...this.props.style}} receiveMessage={this.receiveMessage.bind(this)}  thisData={this.props.thisData} reGetData={this.reGetData.bind(this)} >
                <SpringScrollbars style={{width:'100%',height:'100%'}} >
                    <Motion style={{ opacity: spring(this.state.opacity) }}>
                        {({ opacity }) =>
                            <div
                                className={`${cssStyle.box} ${style.contentType !== 2 ? cssStyle.content:''}`}
                                style={{ opacity,...contentStyle,cursor: interact && interact.length > 0 ? 'pointer':'default'}}
                                onClick={this.interact.bind(this)}
                                dangerouslySetInnerHTML={{__html:content}}
                            />
                        }
                    </Motion>
                </SpringScrollbars>
            </ComponentBox>
        );
    }
}