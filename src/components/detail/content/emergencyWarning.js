import React from "react";
import cssStyle from "./emergencyWarning.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { interactData } from "../../../common/util";

export default class EventTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.planName = {};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        // console.log(this.props.detail);
    }
    // 点击交互
    handleInteract(item, type) {
        const { statusInteract, detailInteract } = this.props.thisData.style;
        this.interactData(type === 'status' ? statusInteract : detailInteract, item);
    }
    render() {
        const { detail, loading } = this.props;
        return (
            <div style={this.props.style} className={cssStyle.container} >
                {
                    detail && Array.isArray(detail.list) && detail.list.length > 0 ? (
                        <Scrollbars>
                            {
                                detail.list.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={cssStyle.itemBox}
                                            style={{ marginBottom: detail.length - 1 === index ? 0 : '1.5em' }}
                                        >
                                            <div className={`${cssStyle.name} ${cssStyle.itemInnerBox}`}>{item.warningObject}</div>
                                            <div className={`${cssStyle.type} ${cssStyle.itemInnerBox}`}>{item.type}</div>
                                            <div className={`${cssStyle.reason}`}>
                                                {
                                                    Array.isArray(item.warningReasonList) && item.warningReasonList.map((subItem, subIndex) => {
                                                        return (
                                                            <div
                                                                key={subIndex}
                                                                className={
                                                                    `${cssStyle.reasonItem} ${subIndex % 2 === 0 ? cssStyle.reasonBackground : ''}`
                                                                }
                                                                title={subItem}
                                                            >{subIndex + 1 + '.' + subItem}</div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <div
                                                className={`${cssStyle.status}  ${cssStyle.itemInnerBox}`}
                                                onClick={this.handleInteract.bind(this, item, 'status')}
                                            >
                                                <div className={cssStyle.statusInnerBox}>
                                                    {item.status}
                                                </div>
                                            </div>
                                            <div
                                                className={`${cssStyle.detail}  ${cssStyle.itemInnerBox}`}
                                                onClick={this.handleInteract.bind(this, item, 'detail')}
                                            >{'>>'}</div>
                                        </div>
                                    )
                                })
                            }
                        </Scrollbars>
                    ) : (
                        <div className={cssStyle.empty}>{loading ? '数据加载中...' : '暂无数据'}</div>
                    )
                }
            </div>
        );
    }
}