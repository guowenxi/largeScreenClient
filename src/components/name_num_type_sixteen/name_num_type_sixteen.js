import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./name_num_type_sixteen.module.css";

import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";

import background from "./images/background.svg";
import {getCompatibleSize} from "../../common/util";
import {getContentList} from "../../common/nameNumUtil";

export default class NameNumTypeFourteen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],selectedIndex:0,show:false,showBox:false};
        this.keyParams = {};
        this.refreshTimer = [];
        this.getContentList = getContentList.bind(this);
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

    render() {
        const {resultData} = this.state;
        const {style} = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const contentList = resultData.slice(2,resultData.length);
        return (
            <ComponentBox style={{...this.props.style,overflow:'hidden'}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div style={{opacity,fontSize}} className={cssStyle.box}>
                            <img alt={''} src={background} className={cssStyle.background}/>
                            <div className={cssStyle.headBox} >
                                {this.getContentList(resultData[0],style.head)}
                            </div>
                            <div className={cssStyle.centerBox}>
                                {this.getContentList(resultData[1],style.center)}
                            </div>
                            <div className={cssStyle.contentBox}>
                                {contentList.map((item,index) =>
                                    <div key={index} className={cssStyle.contentItem}>
                                        {this.getContentList(item,style.content)}
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}