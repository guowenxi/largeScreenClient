/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./defuseDetail.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { interactData } from "../../../common/util";
import CloseIcon from "../images/closeOne.png";

export default class DefuseDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gridRoadId: '', name: '' };
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }
    //组件删除时触发函数
    componentWillUnmount() {
    }
    closeThis() {
        // this.setState({ gridRoadId: '', name: '' });
        const { closeInteract } = this.props.thisData.style;
        this.interactData(closeInteract, {});
    }
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        })
    }
    handleSearch() {
        const params = { ...this.props.keyParams, ...this.state };
        this.props.changeKeyParams(params);
    }
    render() {
        const { detail, loading } = this.props;
        const { name, gridRoadId } = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.backgroundBox}>
                    <div className={cssStyle.contentBox}>
                        <div className={cssStyle.content}>
                            <div className={cssStyle.searchBox}>
                                <div className={cssStyle.searchItem}>
                                    <label>网格代码：</label>
                                    <input
                                        value={gridRoadId}
                                        name="gridRoadId"
                                        onChange={this.handleChange.bind(this)}
                                        className={cssStyle.searchInput}
                                    />
                                </div>
                                <div className={cssStyle.searchItem}>
                                    <label>网格名称：</label>
                                    <input
                                        value={name} name="name"
                                        onChange={this.handleChange.bind(this)}
                                        className={cssStyle.searchInput}
                                    />
                                </div>
                                <button className={cssStyle.searchButton} onClick={this.handleSearch.bind(this)}>查询</button>
                            </div>
                            {
                                !detail || detail.length === 0 ? (
                                    <div className={cssStyle.noData}>{loading ? '数据加载中...' : '暂无数据'}</div>
                                ) : (
                                    <>
                                        <div className={cssStyle.titleBox}>
                                            <div className={cssStyle.titleItem} style={{ width: '30%' }}>网格</div>
                                            <div className={cssStyle.titleItem} style={{ width: '35%' }}>化解措施数</div>
                                            <div className={cssStyle.titleItem} style={{ width: '35%', borderRight: 0 }}>化解转关注数</div>
                                        </div>
                                        <Scrollbars style={{ width: '100%', height: '100%', border: '1px solid #1e8dd9', borderTop: 0, }}>
                                            <div className={cssStyle.contentOuterBox}>
                                                {
                                                    Array.isArray(detail) && detail.map((item, index,) => {
                                                        return (
                                                            <div key={index} className={cssStyle.contentItem}>
                                                                <div style={{ width: '30%' }} className={cssStyle.itemBox}>{item.name}</div>
                                                                <div style={{ width: '35%' }} className={cssStyle.itemBox}>{item.measuresNumber}</div>
                                                                <div style={{ width: '35%', borderRight: 0 }} className={cssStyle.itemBox}>
                                                                    {item.transferredToCustoms}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </Scrollbars>
                                    </>
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