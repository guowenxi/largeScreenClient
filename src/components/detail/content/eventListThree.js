import React from "react";
import cssStyle from "./eventListThree.module.css";
import './eventListOne.css';
import { Scrollbars } from "react-custom-scrollbars";
import "./pagination.css";
import { Pagination } from "antd";
import {interactData} from "../../../common/util";
import "./eventListThree.css";

export default class EventListThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedId:''};
        this.scrollbars = React.createRef();
        this.colorList = ['','rgba(255,204,0,0.7)','rgba(137,226,116,0.7)','#ff0000'];
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
                        <Scrollbars ref={this.scrollbars} className={'eventListThreeBlueBar'}>
                            {list.map((item,index)=>{
                                return (
                                    <div key={index} className={`${cssStyle.itemBox} ${item.id === selectedId ? cssStyle.selectedBox:''}`} onClick={this.itemClick.bind(this,item)}>
                                        <div className={cssStyle.tagBox}>
                                            {!!item.oversee && <div className={cssStyle.oversee}>督办</div>}
                                            {!!item.overTime && <div className={cssStyle.overTime}>逾期</div>}
                                        </div>
                                        <div className={cssStyle.status} style={{background:this.colorList[item.status]}}>{item.statusName}</div>
                                        <div className={cssStyle.line} style={{background:this.colorList[item.status]}} />
                                        <div className={cssStyle.title}>{item.title}</div>
                                        <div className={cssStyle.content}>{item.content}</div>
                                        <div className={cssStyle.row}>事件类型　{item.type}</div>
                                        <div className={cssStyle.row}>来源系统　{item.source}</div>
                                        <div className={cssStyle.row}>发生地点　{item.address}</div>
                                        <div className={cssStyle.row}>发生时间　{item.time}</div>
                                    </div>
                                );
                            })}
                        </Scrollbars>
                    ):(
                        <div className={cssStyle.noData}>{loading ? '数据加载中...':'暂无数据'}</div>
                    )}
                </div>
                <Pagination current={pageNo} pageSize={pageSize} total={total} onChange={this.changePage.bind(this)} style={{float:'right'}} />
            </div>
        );
    }
}