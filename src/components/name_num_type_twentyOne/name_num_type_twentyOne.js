import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_twentyOne.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import { getColumnNum, getCompatibleSize } from "../../common/util";
import RectTypeFive from "../../common/svg/rectTypeFive"
import EchartsRingPie from "../echarts_ring_pie/echarts_ring_pie"
import {pieStyle} from "./name_num_type_twentyOnePie"

export default class NameNumTypeTwentyOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [] };
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

    //获取兼容 展示/修改 两个状态下的 vh/vw 值
    getCompatibleSize(data,type){
        if(data == null || data === ''){
            return;
        }
        if(global.editType){
            if(type && type === 'num'){
                if(data.indexOf('vh') > 0){
                    return data.replace('vh','')*global.bodyHeight/100;
                }else if(data.indexOf('vw') > 0){
                    return data.replace('vw','')*global.bodyWidth/100;
                }else{
                    return parseFloat(data.replace(/[^\d.]/g,''));
                }
            }else{
                if(data.indexOf('vh') > 0){
                    return data.replace('vh','')*global.bodyHeight/100 + 'px';
                }else if(data.indexOf('vw') > 0){
                    return data.replace('vw','')*global.bodyWidth/100 + 'px';
                }else{
                    return data;
                }
            }
        }else{
            if(type && type === 'num'){
                if(data.indexOf('vh') > 0){
                    return data.replace('vh','')*global.bodyHeight/100;
                }else if(data.indexOf('vw') > 0){
                    return data.replace('vw','')*global.bodyWidth/100;
                }else{
                    return parseFloat(data.replace(/[^\d.]/g,''));
                }
            }else{
                return data;
            }
        }
    }

    render() {
        const { resultData } = this.state
        const { style } = this.props.thisData;
        let itemStyle;
        if (resultData) {
            itemStyle = getColumnNum(style, resultData);
        }
        const fontSize = getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, flexDirection: style.flexDirection, fontSize: fontSize }} >
                            {/* {resultData.map((item, index) => {
                                if (item) {
                                    pieStyle.legend.show=style.legend===1?true:false
                                    const newThisData = {
                                        dataSources: {
                                            dataType: this.props.thisData.dataSources.dataType,
                                            defaultData: this.props.thisData.dataSources.dataType===1?item.data:'',
                                            dataUrl:this.props.thisData.dataSources.dataType===2?item.dataUrl:''
                                        },
                                        id: this.props.thisData.id+'_'+index,
                                        nickName: this.props.thisData.id,
                                        position: {
                                            width: '100%',
                                            height: "100%",
                                            top: '0%',
                                            left: '0%'
                                        },
                                        sceneId: this.props.thisData.sceneId,
                                        status: 1,
                                        style:pieStyle,
                                        sysUserId: "yongjia",
                                        showStatus: true
                                    }
                                    return (
                                        <div style={{ ...itemStyle }} key={index} className={cssStyle.itemBox}>
                                            <div className={cssStyle.titleStyle} >
                                                <RectTypeFive style={{ width: '100%', height: '100%' }} />
                                                <div className={cssStyle.titleText}>{item.name}</div>
                                            </div>
                                            <div className={cssStyle.imgBox} />
                                            <EchartsRingPie firstLoad={false} token={this.props.token} thisData={newThisData} editType={true} getCompatibleSize={this.getCompatibleSize.bind(this)} index={index} />
                                        </div>
                                    )
                                } else {
                                    return <div className={`${cssStyle.item} ${cssStyle.flex}`} style={{ ...itemStyle, flexDirection: style.itemFlexDirection }} key={index} />;
                                }
                            })} */}
                            {resultData && resultData.map((item, index) => {
                                pieStyle.legend.show=style.legend===1?true:false
                                const newThisData = {
                                    dataSources: {
                                        dataType:item.url?2:this.props.thisData.dataSources.dataType,
                                        defaultData: item.url?'':item.data,
                                        dataUrl:item.url?item.url:''
                                    },
                                    id: this.props.thisData.id+'_'+index,
                                    nickName: this.props.thisData.id,
                                    position: {
                                        width: '100%',
                                        height: "100%",
                                        top: '0%',
                                        left: '0%'
                                    },
                                    sceneId: this.props.thisData.sceneId,
                                    status: 1,
                                    style:pieStyle,
                                    sysUserId: "yongjia",
                                    showStatus: true
                                }
                                return (
                                    <div style={{ ...itemStyle, flexDirection: style.itemFlexDirection }} key={index} className={cssStyle.itemBox}>
                                        <div className={cssStyle.titleStyle}>
                                            <RectTypeFive style={{ width: '100%', height: '100%' }} />
                                            <div className={cssStyle.titleText}>{item.name}</div>
                                        </div>
                                        {/* <img src={beijing} alt="" className={cssStyle.imgBox} /> */}
                                        <div className={cssStyle.imgBox} />
                                        <EchartsRingPie firstLoad={false} token={this.props.token} thisData={newThisData} editType={true} getCompatibleSize={this.getCompatibleSize.bind(this)} index={index} />
                                    </div>
                                )
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}