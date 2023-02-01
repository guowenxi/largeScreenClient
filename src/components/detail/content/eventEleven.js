import React from "react";
import Scrollbars from "react-custom-scrollbars";
import cssStyle from "./peopleFive.module.css";

export default class EventEleven extends React.Component {
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

    render() {
        const { detail, loading } = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                {
                    JSON.stringify(detail) === '{}' ? (
                        <div className={cssStyle.noData}>{loading ? '数据加载中...' : '暂无数据'}</div>
                    ) : (
                        <Scrollbars>
                            <div className={cssStyle.line}>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>姓名：</div>
                                    <div className={cssStyle.content}>{detail.name}</div>
                                </div>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>身份证号：</div>
                                    <div className={cssStyle.content}>{detail.cardId}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>性别：</div>
                                    <div className={cssStyle.content}>{detail.sexName}</div>
                                </div>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>年龄：</div>
                                    <div className={cssStyle.content}>{detail.age}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>联系方式：</div>
                                    <div className={cssStyle.content}>{detail.phone}</div>
                                </div>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>发现渠道：</div>
                                    <div className={cssStyle.content}>{detail.reportSource}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>上报时间：</div>
                                    <div className={cssStyle.content}>{detail.createTime}</div>
                                </div>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>上报人：</div>
                                    <div className={cssStyle.content}>{detail.createUser}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>现住址详情：</div>
                                    <div className={cssStyle.content}>{detail.address}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>户籍地：</div>
                                    <div className={cssStyle.content}>{detail.residencePlace}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>人员疑似原因：</div>
                                    <div className={cssStyle.content}>{detail.suspectedReason}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>所属镇街：</div>
                                    <div className={cssStyle.content}>{detail.roadName}</div>
                                </div>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>事件处置状态：</div>
                                    <div className={cssStyle.content}>{detail.handleStatusName}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>风险研判结果：</div>
                                    <div className={cssStyle.content}>{detail.controlStatusName}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>人员危险等级：</div>
                                    <div className={cssStyle.content}>{detail.dangerClassesName}</div>
                                </div>
                            </div>
                        </Scrollbars>
                    )
                }
            </div>
        );
    }
}