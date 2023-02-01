import React from "react";
import cssStyle from "./peopleTwoPartFour.module.css";
import { Scrollbars } from "react-custom-scrollbars";

export default class PeopleTwoPartFour extends React.Component {
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
                        <>
                            <div className={cssStyle.leftBox}>
                                <div className={cssStyle.title}>趋势研判结果：</div>
                                <div className={cssStyle.content}>
                                    <Scrollbars >
                                    {detail.result}
                                    </Scrollbars>
                                </div>
                                <div className={cssStyle.title}>趋势研判缘由：</div>
                                <div className={cssStyle.content}>
                                    <Scrollbars >
                                        {detail.reason}
                                    </Scrollbars>
                                </div>
                                <div className={cssStyle.title}>预案管控措施：</div>
                                <div className={cssStyle.content}>
                                    <Scrollbars >
                                        {detail.measures}
                                    </Scrollbars>
                                </div>
                            </div>
                            <div className={cssStyle.rightBox}>
                                <Scrollbars >
                                    {detail.process && detail.process.map((process, index) =>
                                        <div className={cssStyle.stepBox} key={index}>
                                            <div className={cssStyle.point} />
                                            <div className={cssStyle.line} />
                                            <div className={cssStyle.time}>{process.time}</div>
                                            <div className={cssStyle.status}>{process.status}</div>
                                            <div className={cssStyle.stepContent}>{process.content}</div>
                                        </div>
                                    )}
                                </Scrollbars>
                            </div>
                        </>
                    )
                }
            </div>
        );
    }
}