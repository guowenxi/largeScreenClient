import React from "react";
import cssStyle from "./eventListFour.module.css";
import './eventListOne.css';
import { Scrollbars } from "react-custom-scrollbars";
import "./pagination.css";
import { Pagination } from "antd";
import {interactData} from "../../../common/util";
import "./eventListThree.css";

export default class EventListFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedId:''};
        this.scrollbars = React.createRef();
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
                                        <img className={cssStyle.img} alt={''} src={item.img} />
                                        <div className={cssStyle.title}>{item.title}</div>
                                        <div className={cssStyle.time}>{item.time}</div>
                                        <div className={cssStyle.tag}>{item.tag}</div>
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