import React from "react";
import cssStyle from "./groupList.module.css";
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

    getTdPart(partList, dataIndex, rowSpan) {
        if (partList && partList[dataIndex]) {
            return (
                <React.Fragment>
                    <td width={'12.5%'} rowSpan={rowSpan}>{partList[dataIndex].name}</td>
                    <td width={'7%'} rowSpan={rowSpan}>{partList[dataIndex].num}</td>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <td width={'12.5%'} rowSpan={rowSpan}> </td>
                    <td width={'7%'} rowSpan={rowSpan}> </td>
                </React.Fragment>
            );
        }
    }

    getCount(partList) {
        if (partList) {
            let count = 0;
            partList.forEach((part) => {
                count += parseInt(part.num);
            });
            return count;
        } else {
            return 0;
        }
    }

    getAllCount(detail, key) {
        if (detail && detail.length) {
            let count = 0;
            detail.forEach((item) => {
                if (item[key]) {
                    count += this.getCount(item[key]);
                }
            });
            return count;
        } else {
            return 0;
        }
    }

    render() {
        const { detail } = this.props;
        const content = detail;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.backgroundBox}>
                    <div className={cssStyle.contentBox}>
                        {!content || content.length === 0 ? (
                            <div className={cssStyle.noData}>{this.props.loading?'数据加载中...':'暂无数据'}</div>
                        ) : (
                            <React.Fragment>
                                <table className={cssStyle.table} >
                                    <tbody>
                                        <tr>
                                            <td rowSpan={2} width={'13.5%'}>名称</td>
                                            <td colSpan={6} width={'58.5%'}>三要素内容</td>
                                        </tr>
                                        <tr>
                                            <td width={'12.5%'}>性格</td>
                                            <td width={'7%'}>数量</td>
                                            <td width={'12.5%'}>行为</td>
                                            <td width={'7%'}>数量</td>
                                            <td width={'12.5%'}>事件</td>
                                            <td width={'7%'}>数量</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className={cssStyle.tableMaxContent}>
                                    <Scrollbars>
                                        <table className={cssStyle.table}>
                                            <tbody>
                                                {content && content.map && content.map((item, index) => {
                                                    const { disposition, action, event } = item;
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <tr>
                                                                <td rowSpan={8} width={'13.5%'}>{item.name}</td>
                                                                {this.getTdPart(disposition, 0, 1)}
                                                                {this.getTdPart(action, 0, 1)}
                                                                {this.getTdPart(event, 0, 1)}
                                                            </tr>
                                                            <tr>
                                                                {this.getTdPart(disposition, 1, 1)}
                                                                {this.getTdPart(action, 1, 1)}
                                                                {this.getTdPart(event, 1, 1)}
                                                            </tr>
                                                            <tr>
                                                                {this.getTdPart(disposition, 2, 1)}
                                                                {this.getTdPart(action, 2, 1)}
                                                                {this.getTdPart(event, 2, 1)}
                                                            </tr>
                                                            <tr>
                                                                {this.getTdPart(disposition, 3, 1)}
                                                                {this.getTdPart(action, 3, 1)}
                                                                {this.getTdPart(event, 3, 1)}
                                                            </tr>
                                                            <tr>
                                                                {this.getTdPart(disposition, 4, 1)}
                                                                {this.getTdPart(action, 4, 1)}
                                                                {this.getTdPart(event, 4, 1)}
                                                            </tr>
                                                            <tr>
                                                                {this.getTdPart(disposition, 5, 1)}
                                                                {this.getTdPart(action, 5, 1)}
                                                                {this.getTdPart(event, 5, 3)}
                                                            </tr>
                                                            <tr>
                                                                {this.getTdPart(disposition, 6, 1)}
                                                                {this.getTdPart(action, 6, 1)}
                                                            </tr>
                                                            <tr>
                                                                {this.getTdPart(disposition, 7, 1)}
                                                                {this.getTdPart(action, 7, 1)}
                                                            </tr>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </Scrollbars>
                                </div>
                                <table className={cssStyle.table} >
                                    <tbody>
                                        <tr>
                                            <td width={'13.5%'}>总计</td>
                                            <td width={'12.5%'}>———</td>
                                            <td width={'7%'}>{this.getAllCount(detail, 'disposition')}</td>
                                            <td width={'12.5%'}>———</td>
                                            <td width={'7%'}>{this.getAllCount(detail, 'action')}</td>
                                            <td width={'12.5%'}>———</td>
                                            <td width={'7%'}>{this.getAllCount(detail, 'event')}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/*<div className={cssStyle.remark}>*/}
                                {/*    <div className={cssStyle.remarkHead}>备注</div>*/}
                                {/*    <div className={cssStyle.remarkContent}>*/}
                                {/*        {remarks}*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </React.Fragment>
                        )}
                    </div>
                    <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)} />
                </div>
            </div>
        );
    }
}