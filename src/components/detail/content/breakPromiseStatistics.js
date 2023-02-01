/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./breakPromiseStatistics.module.css";
import { interactData } from "../../../common/util";

import arrow from '../images/breakPromiseStatisticsOne.png';


export default class BreakPromiseStatistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }
    //组件删除时触发函数
    componentWillUnmount() {
    }

    // 交互
    handleInteract() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {});
    }
    render() {
        const { detail } = this.props;
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <div className={cssStyle.titleBox}>
                    <div className={cssStyle.titleItem}>指标</div>
                    <div className={cssStyle.titleItem}>数量</div>
                    <div className={cssStyle.titleItem}>得分</div>
                    <div className={cssStyle.titleItem}>综合信用分</div>
                </div>
                <div className={cssStyle.bodyBox} onClick={this.handleInteract.bind(this)}>
                    <div className={cssStyle.left}>
                        {
                            Array.isArray(detail.list) &&
                            detail.list.map((item, index) => {
                                return (
                                    <div key={item.name} className={`${cssStyle.leftItemBox} ${index % 2 !== 0 ? cssStyle.background : ''}`}>
                                        {
                                            item.name &&
                                            <span className={cssStyle.leftItem} style={{ fontSize: '0.8em' }}>{item.name}</span>
                                        }
                                        <span className={cssStyle.leftItem}>{item.quantity}</span>
                                        <span className={cssStyle.leftItem}>{item.score}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={cssStyle.right}>
                        <span className={cssStyle.total}>{detail.total}</span>
                        <img alt="" className={cssStyle.arrow} src={arrow} />
                    </div>
                </div>
            </div >
        );
    }
}