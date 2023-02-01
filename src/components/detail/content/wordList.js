import React from "react";
import { Pagination } from 'antd';
import cssStyle from "./wordList.module.css";
import "./pagination.css";

export default class WordList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    changePage(page, pageSize) {
        this.props.changeKeyParams({ pageNo: page, pageSize });
    }

    getTableContentPart(list,partIndex,pageNo){
        return (
            <div className={cssStyle.table} key={partIndex}>
                <div className={cssStyle.row}>
                    <div className={cssStyle.order}>序号</div>
                    <div className={cssStyle.name}>热词</div>
                    <div className={cssStyle.num}>次数</div>
                </div>
                {list.map((item,index)=>
                    <div className={cssStyle.row} key={index}>
                        <div className={cssStyle.order}>{(pageNo-1)*50+partIndex*10+index+1}</div>
                        <div className={cssStyle.name}>{item.name}</div>
                        <div className={cssStyle.num}>{item.num}</div>
                    </div>
                )}
            </div>
        );
    }

    render() {
        const { detail, keyParams } = this.props;
        if (detail == null) {
            return '';
        }
        const { total, list } = detail;
        const { pageNo, pageSize } = keyParams;
        return (
            <div style={this.props.style} className={`${cssStyle.box} black-blue-page`}>
                {!list || list.length === 0 ? (
                    <div className={cssStyle.noData}>{this.props.loading ? '数据加载中...' : '暂无数据'}</div>
                ) : (
                    <React.Fragment>
                        <div className={cssStyle.contentBox}>
                            {[0,1,2,3,4].map((item)=>{
                                return this.getTableContentPart(list.slice(item*10,item*10+10),item,pageNo);
                            })}
                        </div>
                        <Pagination style={{float:'right'}} current={pageNo} pageSize={pageSize} total={total} onChange={this.changePage.bind(this)} />
                    </React.Fragment>
                )}
            </div>
        );
    }
}