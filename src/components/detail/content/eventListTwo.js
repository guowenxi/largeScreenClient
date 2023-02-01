import React from "react";
import cssStyle from "./eventListTwo.module.css";
import './eventListOne.css';
import { Scrollbars } from "react-custom-scrollbars";
import "./pagination.css";
import { Pagination } from "antd";
import {interactData} from "../../../common/util";

export default class EventListTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedId:''};
        this.scrollbars = React.createRef();
        this.limitTypeTime = [0,60*60*1000,24*60*60*1000,7*24*60*60*1000];
        this.colorList = ['rgb(9,148,148)','rgb(219,167,26)','#ff0000'];
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    changePage(page, pageSize) {
        this.props.changeKeyParams({ pageNo: page, pageSize });
        this.scrollbars.current.scrollTop(0);
    }

    itemClick(item){
        this.setState({selectedId:item.id});
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }

    render() {
        const { detail, keyParams, loading } = this.props;
        if (detail == null || detail.list == null) {
            return '';
        }
        const { total, list } = detail;
        const { pageNo, pageSize } = keyParams;
        const {selectedId} = this.state;
        return (
            <div style={this.props.style} className={`${cssStyle.box} black-blue-page`} >
                <div className={cssStyle.contentBox}>
                    {list && list.length > 0 ? (
                        <Scrollbars ref={this.scrollbars}>
                            {list.map((item,index)=>{
                                const subTime = (item.endTime ? (new Date(item.endTime.replace(/-/g, '/'))).getTime():(new Date()).getTime()) - (new Date(item.startTime.replace(/-/g, '/'))).getTime();
                                const limitTime = item.limitTime * this.limitTypeTime[item.limitType];
                                let timePer,showTime,showNumTime,showTimeName,colorType;
                                if(subTime > limitTime){
                                    timePer = 1;
                                    showTime = subTime - limitTime;
                                    showTimeName = '超出时间';
                                    colorType = 2;
                                }else{
                                    timePer = subTime/limitTime;
                                    showTime = limitTime - subTime;
                                    showTimeName = '剩余时间';
                                    colorType = 1;
                                }
                                if(item.endTime){
                                    colorType = 0;
                                }
                                if(showTime > this.limitTypeTime[3]){
                                    showNumTime = Math.floor(showTime/this.limitTypeTime[3])+'周';
                                }else if(showTime > this.limitTypeTime[2]){
                                    showNumTime = Math.floor(showTime/this.limitTypeTime[2])+'日';
                                }else if(showTime > this.limitTypeTime[1]){
                                    showNumTime = Math.floor(showTime/this.limitTypeTime[1])+'小时';
                                }else{
                                    showNumTime = Math.ceil(showTime/(60*1000))+'分';
                                }
                                return (
                                    <div key={index} className={`${cssStyle.itemBox} ${item.id === selectedId ? cssStyle.selectedBox:''}`} onClick={this.itemClick.bind(this,item)}>
                                        <div className={cssStyle.headBox}>
                                            <div className={cssStyle.name}>{item.name}</div>
                                            <div className={cssStyle.department}>({item.departmentName})</div>
                                        </div>
                                        <div className={cssStyle.time}>{item.startTime}</div>
                                        <div className={cssStyle.dataBox}>
                                            <div className={cssStyle.row}>总人数：<span>{item.allNum}</span></div>
                                            <div className={cssStyle.row}>已反馈：<span>{item.feedback}</span></div>
                                            <div className={cssStyle.row}>反馈率：<span>{(item.feedback*100/item.allNum).toFixed(item.allNum === item.feedback ? 0:2)+'%'}</span></div>
                                        </div>
                                        <svg viewBox="0 0 124 124" className={cssStyle.svg}>
                                            {subTime < limitTime && (
                                                <defs>
                                                    <clipPath id={'clipPath_'+this.props.thisData.id+'_'+index}>
                                                        <path d={`M62,62 L62,0 A62,62 0 ${timePer>=0.5?1:0},1 ${62 + Math.sin(2*Math.PI*timePer)*62},${62 - Math.cos(2*Math.PI*timePer)*62} M62,62 Z`} />
                                                    </clipPath>
                                                </defs>
                                            )}
                                            <path className={cssStyle.cls1} style={{stroke:this.colorList[colorType]}} d="M1543.94,555.871a57.567,57.567,0,1,1-57.57,57.566A57.563,57.563,0,0,1,1543.94,555.871Z" transform="translate(-1481.94 -551.438)" />
                                            <circle className={cssStyle.cls2} style={{stroke:this.colorList[colorType]}} cx="62" cy="62" r="61.5"/>
                                            <path className={cssStyle.cls3} style={{stroke:this.colorList[colorType]}} d="M1543.94,578.125a35.313,35.313,0,1,1-35.32,35.312A35.312,35.312,0,0,1,1543.94,578.125Z" transform="translate(-1481.94 -551.438)"/>
                                            <path className={cssStyle.cls4} style={{stroke:this.colorList[colorType],opacity:0.3}} d="M62,18.815a43.176,43.176,0,1,1-43.18,43.176A43.175,43.175,0,0,1,62,18.815Z" />
                                            <path className={cssStyle.cls4} clipPath={`url('#clipPath_${this.props.thisData.id}_${index}')`} style={{stroke:this.colorList[colorType]}} d="M62,18.815a43.176,43.176,0,1,1-43.18,43.176A43.175,43.175,0,0,1,62,18.815Z" />
                                        </svg>
                                        <div className={cssStyle.subTime}>
                                            <span>{showNumTime}</span>
                                        </div>
                                        <div className={cssStyle.timeName}>{showTimeName}</div>
                                    </div>
                                );
                            })}
                        </Scrollbars>
                    ):(
                        <div className={cssStyle.noData}>{loading ? '数据加载中...':'暂无数据'}</div>
                    )}
                </div>
                <Pagination current={pageNo} pageSize={pageSize} total={total} onChange={this.changePage.bind(this)} />
            </div>
        );
    }
}