import React from "react";
import Scrollbars from "react-custom-scrollbars";
import cssStyle from "./peopleFive.module.css";

export default class EventSixteen extends React.Component {
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
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>姓名：</div>
                                    <div className={cssStyle.content}>{detail.name}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>身份证号：</div>
                                    <div className={cssStyle.content}>{detail.cardId}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>发生时间：</div>
                                    <div className={cssStyle.content}>{detail.occurrenceTime}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>发生地点：</div>
                                    <div className={cssStyle.content}>{detail.address}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>所属镇街：</div>
                                    <div className={cssStyle.content}>{detail.roadName}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>事件描述：</div>
                                    <div className={cssStyle.content}>{detail.eventDescride}</div>
                                </div>
                            </div>
                        </Scrollbars>
                    )
                }
            </div>
        );
    }
}