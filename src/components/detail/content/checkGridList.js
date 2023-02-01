/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./checkGridList.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { interactData } from "../../../common/util";
import CloseIcon from "../images/closeOne.png";
import { Modal } from "antd";

export default class CheckGridList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { orgId: '', orgName: '' };
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }
    //组件删除时触发函数
    componentWillUnmount() {
    }
    closeThis() {
        const { closeInteract } = this.props.thisData.style;
        this.interactData(closeInteract, {});
        // this.setState({ orgId: '', orgName: '' });
    }
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        })
    }
    handleSearch() {
        this.props.changeKeyParams({ ...this.props.keyParams, ...this.state, });
    }
    render() {
        const { detail } = this.props;
        const { orgName, orgId } = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.backgroundBox}>
                    <div className={cssStyle.contentBox}>
                        <div className={cssStyle.content}>
                            <div className={cssStyle.searchBox}>
                                <div className={cssStyle.searchItem}>
                                    <label>网格代码：</label>
                                    <input
                                        value={orgId}
                                        name="orgId"
                                        onChange={this.handleChange.bind(this)}
                                        className={cssStyle.searchInput}
                                    />
                                </div>
                                <div className={cssStyle.searchItem}>
                                    <label>网格名称：</label>
                                    <input
                                        value={orgName} name="orgName"
                                        onChange={this.handleChange.bind(this)}
                                        className={cssStyle.searchInput}
                                    />
                                </div>
                                <button className={cssStyle.searchButton} onClick={this.handleSearch.bind(this)}>查询</button>
                            </div>
                            {
                                !detail.dataList || (Array.isArray(detail.dataList) && detail.dataList.length === 0) ? (
                                    <div className={cssStyle.noData}>{this.props.loading ? '数据加载中...' : '暂无数据'}</div>
                                ) : (
                                    <Scrollbars style={{ height: 'calc(100% - 3em)', border: '1px solid #1e8dd9', }}>
                                        <div className={cssStyle.contentInnerBox} style={{ width: 20 * (detail.title.length + 2) + '%' }}>
                                            <div className={cssStyle.titleBox}>
                                                <div className={cssStyle.titleItem}>网格</div>
                                                <div className={cssStyle.titleItem}>指标</div>
                                                {
                                                    Array.isArray(detail.title) && detail.title.map((item, index, arr) => {
                                                        return (
                                                            <div
                                                                className={cssStyle.titleItem}
                                                                style={{ borderRight: index === arr.length - 1 ? 0 : '1px solid #1e8dd9' }}
                                                                key={item}
                                                            >{item}</div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <div className={cssStyle.contentTableBox}>
                                                <Scrollbars style={{ width: '100%' }}>
                                                    {
                                                        Array.isArray(detail.dataList) && detail.dataList.map((item, index, arr) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={cssStyle.contentItem}
                                                                >
                                                                    <div
                                                                        className={cssStyle.contentName}
                                                                        style={{ width: 100 / (detail.title.length + 2) + '%' }}
                                                                    >
                                                                        {item.name}
                                                                    </div>
                                                                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                                                                        <div style={{ display: 'flex', width: '100%' }}>
                                                                            <div
                                                                                className={cssStyle.rateName}
                                                                                style={{ width: 100 / (detail.title.length + 1) + '%' }}
                                                                            >异常数</div>
                                                                            {Array.isArray(item.differentConstant) && item.differentConstant.map((differenceItem, differenceIndex) => {
                                                                                return (
                                                                                    <div
                                                                                        className={cssStyle.rateBox}
                                                                                        key={differenceIndex}
                                                                                        style={{ width: 100 / (detail.title.length + 1) + '%' }}
                                                                                    >{differenceItem}</div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                        <div style={{ display: 'flex', width: '100%' }}>
                                                                            <div
                                                                                style={{
                                                                                    borderBottom: 0, width: 100 / (detail.title.length + 1) + '%'
                                                                                }}
                                                                                className={cssStyle.rateName}
                                                                            >及时走访率</div>
                                                                            {Array.isArray(item.visitRate) && item.visitRate.map((visitItem, visitIndex) => {
                                                                                return (
                                                                                    <div
                                                                                        className={cssStyle.rateBox}
                                                                                        style={{
                                                                                            borderBottom: 0, width: 100 / (detail.title.length + 1) + '%'
                                                                                        }}
                                                                                        key={visitIndex}
                                                                                    >{visitItem}</div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Scrollbars>
                                            </div>
                                        </div>
                                    </Scrollbars>
                                )
                            }
                        </div>
                    </div>
                    <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)} />
                </div>
            </div >
        );
    }
}