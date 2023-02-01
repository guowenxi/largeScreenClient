import React from "react";
import { Pagination } from 'antd';
import cssStyle from "./peopleListTwo.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import "./pagination.css";

export default class PeopleListTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.planName = {};
        this.scrollbars = React.createRef();
        this.titleList = [
            { name: '姓名', key: 'name', width: '6%' },
            { name: '身份证', key: 'cardId', width: '10%' },
            { name: '联系方式', key: 'phone', width: '10%' },
            { name: '疑似理由', key: 'reason', width: '10%' },
            { name: '关联事件标题', key: 'title', width: '14%' },
            { name: '事件渠道', key: 'source', width: '10%' },
            { name: '事件类型', key: 'type', width: '10%' },
            { name: '事件最新处置状态', key: 'status', width: '6%' },
            { name: '事件内容', key: 'content', width: '24%' },
        ];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    getContent(detail) {
        return (
            <table className={cssStyle.table}>
                <tbody >
                    {detail && detail.map && detail.map((line, lineIndex) =>
                        <tr key={lineIndex}>
                            {this.titleList.map((title, index) =>
                                <td key={index} style={{ width: title.width }}>{line[title.key]}</td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    changePage(page, pageSize) {
        this.props.changeKeyParams({ pageNo: page, pageSize });
        this.scrollbars.current.scrollTop(0);
    }

    render() {
        const { detail, keyParams } = this.props;
        if (detail == null) {
            return '';
        }
        const { total, list } = detail;
        const { pageNo, pageSize } = keyParams;
        return (
            <div style={this.props.style} className={`${cssStyle.box} black-blue-page`} >
                {!list || list.length === 0 ? (
                    <div className={cssStyle.noData}>{this.props.loading ? '数据加载中...' : '暂无数据'}</div>
                ) : (
                    <React.Fragment>
                        <table className={cssStyle.table}>
                            <tbody>
                            <tr>
                                {this.titleList.map((title, index) =>
                                    <td key={index} style={{ width: title.width }}>{title.name}</td>
                                )}
                            </tr>
                            </tbody>
                        </table>
                        <div className={cssStyle.tableMaxContent}>
                            <Scrollbars ref={this.scrollbars}>
                                {this.getContent(list)}
                            </Scrollbars>
                        </div>
                        <Pagination current={pageNo} pageSize={pageSize} total={total} onChange={this.changePage.bind(this)} />
                    </React.Fragment>
                )}
            </div>
        );
    }
}