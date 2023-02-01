/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./collectionDataList.module.css";
import { Scrollbars } from "react-custom-scrollbars";

import { interactData } from "../../../common/util";

import CloseIconOne from "../images/closeOne.png";
import CloseIconTwo from "../images/closeThree.png";

export default class EventOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.interactData = interactData.bind(this);
        this.closeIconList = {
            "1":CloseIconOne,
            "2":CloseIconTwo,
        };
        this.themeList = {
            "2":cssStyle.themeTwo,
        };
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    // 点击交互关闭
    handleClickClose() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {});
    }
    render() {
        const {styleData} = this.props;
        const themeType = styleData.themeType ? styleData.themeType : 1;
        const { detail } = this.props;
        return (
            <div style={this.props.style} className={`${cssStyle.container} ${this.themeList[themeType]}`} >
                <div className={cssStyle.backgroundBox}>
                    {themeType === 2 && <div className={cssStyle.headBox} />}
                    <div className={cssStyle.contentBox}>
                        <table className={cssStyle.tableBox} style={{ borderBottom: 0 }}>
                            <tbody>
                                <tr >
                                    <td className={cssStyle.tableHeader} colSpan="2">归集数据项</td>
                                </tr>
                            </tbody>
                        </table>
                        {
                            Array.isArray(detail) &&
                            <>
                                {
                                    detail.length > 8 ? (
                                        <Scrollbars style={{ width: '70%', height: '20.4em', borderBottom: '1px solid #0853d9' }}>
                                            <table className={`${cssStyle.tableBox} ${cssStyle.inner}`} border="1">
                                                <tbody>
                                                    {
                                                        detail.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td width="50%" className={`${cssStyle.tableItem} ${cssStyle.titleItem}`}>
                                                                        {item.name}
                                                                    </td>
                                                                    <td width="50%" className={cssStyle.tableItem} valign="middle">
                                                                        <div className={cssStyle.innerItem}>
                                                                            <span className={cssStyle.numBox}>{item.num}</span>
                                                                            条
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </Scrollbars>
                                    ) : (
                                        <table className={`${cssStyle.tableBox}`} border="1">
                                            <tbody>
                                                {
                                                    detail.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td width="50%" className={`${cssStyle.tableItem} ${cssStyle.titleItem}`}>{item.name}</td>
                                                                <td width="50%" className={cssStyle.tableItem}>
                                                                    <div className={cssStyle.innerItem}>
                                                                        <span className={cssStyle.numBox}>{item.num}</span>
                                                                        条
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    )
                                }
                            </>
                        }
                    </div>
                    <img src={this.closeIconList[themeType]} alt={''} className={cssStyle.closeIcon} onClick={this.handleClickClose.bind(this)} />
                </div>
            </div>
        );
    }
}