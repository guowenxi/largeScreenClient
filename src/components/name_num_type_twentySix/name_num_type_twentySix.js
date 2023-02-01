import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_twentySix.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import SpringScrollbars from "../../common/springScrollbars";

export default class NameNumTypeTwentySix extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: []};
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => { this.getData(this.callBack.bind(this, resolve)) });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
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
                    this.setState({content:data.data[key]})
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
        if (result) {
            this.setState({ resultData: result });
            if (resolve) {
                resolve(result);
            }
        }
    }

    render() {
        const { resultData } = this.state
        const { style } = this.props.thisData
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        if(resultData){
            resultData.forEach((item)=>{
                if(item.files){
                    try{
                        item.files=JSON.parse(item.files)
                    }catch(e){
                    }
                }
            })
        }
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity,fontSize:fontSize }} >
                            <SpringScrollbars style={{width:'100%',height:'100%'}} autoscrolltype={'row'} autoMove={style.autoMove} lineHeight={100/resultData.length+'%'} interval={style.interval} >
                                {resultData && resultData.map((item, index) => {
                                    return (
                                        <div className={cssStyle.moveBox} key={index} style={{ left: 33.4 * index + '%' }}>
                                            <div className={cssStyle.backgroundBox}>
                                                <div className={cssStyle.titleBox}>
                                                    <div className={cssStyle.title} style={{fontSize:style.titleFontSize+'em',color:style.titleColor,lineHeight:style.titleLineHeight+'em'}}>{item[style.titleKey]}</div>
                                                </div>
                                                <div className={cssStyle.imgBox}>
                                                    <SpringScrollbars style={{width:'100%',height:'100%'}} autoscrolltype={'row'} autoMove={style.autoMove} lineHeight={item.files?100/item.files.length+'%':''} interval={style.interval}>
                                                        {item.files && item.files.map((fileItem, fileIndex) => {
                                                            return (
                                                                <img alt="" src={fileItem} className={cssStyle.imgStyle} style={{ left: 100 * fileIndex+'%' }} key={fileIndex} />
                                                            )
                                                        })}
                                                    </SpringScrollbars>
                                                </div>
                                                <div className={cssStyle.contentBox}>
                                                    <SpringScrollbars>
                                                        <div
                                                            className={cssStyle.text}
                                                            style={{ opacity, color: style.contentFontColor, fontSize: style.contentFontSize+'em',justifyContent:style.contentJustifyContent,alignItems:style.contentAlignItems,lineHeight:style.contentLineHeight?style.contentLineHeight+'em':'1.2em' }}
                                                            dangerouslySetInnerHTML={{ __html: style.contentKey?item[style.contentKey]:style.text }}
                                                        />
                                                    </SpringScrollbars>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </SpringScrollbars>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}