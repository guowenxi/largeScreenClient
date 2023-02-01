import React from "react";
import cssStyle from "./publicSecurityList.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import CloseIcon from "../images/closeOne.png";

export default class EventListOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.planName = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    closeThis() {
        this.props.changeThisShow(false, true);
    }

    render() {
        const { detail } = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.backgroundBox}>
                    <div className={cssStyle.contentBox}>
                        {!detail || detail.length === 0 ? (<div className={cssStyle.noData}>暂无数据</div>) :
                            (
                                <>
                                    <table className={cssStyle.contentTable}>
                                        <tbody>
                                            <tr align="center">
                                                <td rowSpan={2} width="13.92%">派出所名称</td>
                                                <td colSpan={2} width="50.69%">管控人员状态</td>
                                                <td colSpan={4} width="35.39%">管控人员级别</td>
                                            </tr>
                                            <tr align="center">
                                                <td width="40.36%">种类</td>
                                                <td width="10.43%">数量</td>
                                                <td width="8.83%">红</td>
                                                <td width="8.83%">橙</td>
                                                <td width="8.83%">黄</td>
                                                <td width="8.83%">绿</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <Scrollbars style={{ width: '100%', height: '37em', borderBottom: '1px solid #1e8dd9' }}>
                                        <table border={1} className={cssStyle.tableMaxContent} style={{ width: '100%' }}>
                                            <tbody className={cssStyle.contentInnerBox}>
                                                {
                                                    Array.isArray(detail) &&
                                                    detail.map((item, index) => {
                                                        return (
                                                            <React.Fragment key={index}>
                                                                {
                                                                    Array.isArray(item.controlStatus) &&
                                                                    item.controlStatus.map((controlItem, controlIndex) => {
                                                                        return (
                                                                            <React.Fragment key={controlIndex}>
                                                                                <tr>
                                                                                    {
                                                                                        controlIndex === 0 &&
                                                                                        <td
                                                                                            width="13.92%"
                                                                                            rowSpan={11}
                                                                                            className={cssStyle.tdItem}
                                                                                        >{item.name}</td>
                                                                                    }
                                                                                    <td
                                                                                        width="40.36%"
                                                                                        className={`${cssStyle.tdItem} ${cssStyle.secondTdItem}`}
                                                                                    >{controlItem.name}</td>
                                                                                    <td width="10.43%" className={cssStyle.tdItem}>{controlItem.num}</td>
                                                                                    {
                                                                                        item.controlLevel && controlIndex === 0 &&
                                                                                        <>
                                                                                            <td
                                                                                                width="8.83%"
                                                                                                rowSpan={2}
                                                                                                className={cssStyle.tdItem}
                                                                                            >{item.controlLevel.red}</td>
                                                                                            <td
                                                                                                width="8.83%"
                                                                                                rowSpan={2}
                                                                                                className={cssStyle.tdItem}
                                                                                            >{item.controlLevel.orange}</td>
                                                                                            <td
                                                                                                width="8.83%"
                                                                                                rowSpan={2}
                                                                                                className={cssStyle.tdItem}
                                                                                            >{item.controlLevel.yellow}</td>
                                                                                            <td
                                                                                                width="8.83%"
                                                                                                rowSpan={2}
                                                                                                className={cssStyle.tdItem}
                                                                                            >{item.controlLevel.green}</td>
                                                                                        </>
                                                                                    }
                                                                                    {
                                                                                        controlIndex === 2 &&
                                                                                        <td
                                                                                            width="35.39%"
                                                                                            rowSpan={3}
                                                                                            colSpan={4}
                                                                                            className={cssStyle.tdItem}
                                                                                        >备注：</td>
                                                                                    }
                                                                                    {
                                                                                        controlIndex === 5 &&
                                                                                        <td
                                                                                            width="35.39%"
                                                                                            rowSpan={6}
                                                                                            colSpan={4}
                                                                                            className={`${cssStyle.tdItem} ${cssStyle.lastTdItem}`}
                                                                                        >
                                                                                            {
                                                                                                Array.isArray(item.remarks) &&
                                                                                                item.remarks.map((remarkItem, remarkIndex) => {
                                                                                                    return (
                                                                                                        <React.Fragment>
                                                                                                            <span className={cssStyle.lastSpan}>
                                                                                                                {remarkIndex + 1}、{remarkItem}<br />
                                                                                                            </span>
                                                                                                        </React.Fragment>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </td>
                                                                                    }
                                                                                </tr>
                                                                            </React.Fragment>
                                                                        )
                                                                    })
                                                                }
                                                            </React.Fragment>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </Scrollbars>

                                </>
                            )
                        }
                    </div>
                    <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)} />
                </div>
            </div >
        );
    }
}