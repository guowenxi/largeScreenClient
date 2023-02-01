import React from "react";
import { Pagination } from 'antd';
import cssStyle from "./peopleListOne.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import CloseIcon from "../images/closeOne.png";
import "./pagination.css";

export default class PeopleListOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.planName = {};
        this.scrollbars = React.createRef();
        this.titleList = [
            { name: '姓名', key: 'name', width: '8%' },
            { name: '预警级别', key: 'level', width: '8%' },
            { name: '预警事由', key: 'reason', width: '18%' },
            { name: '预警时间', key: 'time', width: '10%' },
            { name: '处置状态', key: 'status', width: '10%' },
            { name: '牵头单位', key: 'department', width: '6%' },
            { name: '身份证', key: 'idCard', width: '6%' },
            { name: '手机', key: 'phone', width: '6%' },
            { name: '户籍地', key: 'household', width: '6%' },
            { name: '现居住地', key: 'address', width: '6%' },
            { name: '就职单位', key: 'company', width: '6%' },
            { name: '单位信用状态', key: 'companyStatus', width: '10%' },
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

    closeThis() {
        this.props.changeThisShow(false, true);
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
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.backgroundBox}>
                    <div className={`${cssStyle.contentBox} black-blue-page`}>
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
                                {list.length > 5 ? (
                                    <div className={cssStyle.tableMaxContent}>
                                        <Scrollbars ref={this.scrollbars}>
                                            {this.getContent(list)}
                                        </Scrollbars>
                                    </div>
                                ) : (
                                    <div className={cssStyle.tableContent}>
                                        {this.getContent(list)}
                                    </div>
                                )}
                                {
                                    this.props.styleData.peopleListOneShowPaginition &&
                                    <Pagination current={pageNo} pageSize={pageSize} total={total} onChange={this.changePage.bind(this)} />
                                }
                            </React.Fragment>
                        )}
                    </div>
                    <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)} />
                </div>
            </div>
        );
    }
}