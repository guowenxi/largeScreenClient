/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./checkDepartmentList.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { interactData } from "../../../common/util";
import CloseIcon from "../images/closeOne.png";

export default class EventTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gridCode: '', gridName: '' };
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
        // this.setState({gridCode: '', gridName: ''});
    }
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        })
    }
    handleSearch() {
        this.props.changeKeyParams({ ...this.state });
    }
    render() {
        const { detail,loading } = this.props;
        const { gridName, gridCode } = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.backgroundBox}>
                    <div className={cssStyle.contentBox}>
                        {!detail.dataList || (Array.isArray(detail.dataList) && detail.length === 0) ? (<div className={cssStyle.noData}>{loading?'数据加载中...':'暂无数据'}</div>) :
                            (
                                <div className={cssStyle.content}>
                                    <div className={cssStyle.searchBox}>
                                        <div className={cssStyle.searchItem}>
                                            <label>部门代码：</label>
                                            <input
                                                value={gridCode}
                                                name="gridCode"
                                                onChange={this.handleChange.bind(this)}
                                                className={cssStyle.searchInput}
                                            />
                                        </div>
                                        <div className={cssStyle.searchItem}>
                                            <label>部门名称：</label>
                                            <input
                                                value={gridName} name="gridName"
                                                onChange={this.handleChange.bind(this)}
                                                className={cssStyle.searchInput}
                                            />
                                        </div>
                                        <button className={cssStyle.searchButton} onClick={this.handleSearch.bind(this)}>查询</button>
                                    </div>
                                    <Scrollbars style={{ height: 'calc(100% - 3em)', border: '1px solid #1e8dd9' }}>
                                        <div className={cssStyle.contentInnerBox} style={{ width: 20 * (detail.title.length + 2) + '%' }}>
                                            <div className={cssStyle.titleBox}>
                                                <div className={cssStyle.titleItem}>部门</div>
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
                                                        Array.isArray(detail.dataList) && detail.dataList.map((item, index,) => {
                                                            return (
                                                                <div key={index} className={cssStyle.contentItem}>
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
                                                                            {Array.isArray(item.differentConstant) && item.differentConstant.map((differenceItem, differenceIndex, differenceArr) => {
                                                                                return (
                                                                                    <div
                                                                                        className={cssStyle.rateBox}
                                                                                        key={differenceIndex}
                                                                                        style={{
                                                                                            width: 100 / (detail.title.length + 1) + '%',
                                                                                            borderRight: differenceArr.length - 1 === differenceIndex ? 0 : '1px solid #1e8dd9'
                                                                                        }}
                                                                                    >{differenceItem}</div>
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
                                </div>
                            )
                        }
                    </div>
                    <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)} />
                </div>
            </div >
        );
    }
}