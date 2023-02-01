import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./to_do_list.module.css";
import {Motion, spring} from "react-motion";
import {getCompatibleSize, interactData} from "../../common/util";
import Emitter from "../../common/eventBus";
import {getData} from "../../common/getDataUtil";

export default class Blank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:{}};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.keyParams = {};
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if (this.props.thisData.firstLoad) {
                this.getData(this.callBack.bind(this, resolve));
            } else {
                this.callBack(resolve);
            }
        });
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
            case "dataInterchange":
            case "changeKey" :
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                if(data.reGetData !== 2){
                    this.reGetData();
                }
                break;
            case "showComponent":
                //显示当前组件
                Emitter.emit('app_box', {
                    type: 'changeComponentShowStatus',
                    data: { showStatus: true, id: this.props.thisData.id }
                });
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve();
        }
        if (result) {
            //数据结果处理
            this.setState({ resultData: result });
        }
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const {resultData} = this.state;
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={`${cssStyle.box} blank_style`} style={{fontSize,opacity,color:style.fontColor}}>
                            {/*展示内容*/}
                            <div className={`${cssStyle.main} ${Array.isArray(resultData) && resultData.length < 2 ? cssStyle.display_main : ''}`}>
                              {
                                Array.isArray(resultData) && resultData.length > 1 ? resultData.map((item, index) => (
                                  <div key={index} className={`${cssStyle.item} ${item.status === 0 && cssStyle.item_status}` }>
                                    <div className={cssStyle.time}>{item.time}</div>
                                    <div className={cssStyle.title}>{item.title}</div>
                                    <div className={cssStyle.statusStr}>{item.statusStr}</div>
                                  </div>
                                )) :
                                Array.isArray(resultData) && resultData.length === 1 ? resultData.map((item, index) => (
                                  <div key={index} className={`${cssStyle.item_one} ${item.status === 0 && cssStyle.item_status}`}>
                                    <div className={cssStyle.time}>{item.time}</div>
                                    <div className={cssStyle.title}>{item.title}</div>
                                    <div className={cssStyle.statusStr}>{item.statusStr}</div>
                                  </div>
                                ))
                                : <div className={`${cssStyle.item_one} ${cssStyle.item_none}`}>
                                  今日暂无待办事件
                              </div>
                              }
                              
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}