import React from "react";
import cssStyle from "./eventStep.module.css";
import CloseIcon from "../images/closeOne.png";

export default class EventStepTwo extends React.Component {
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
                        <table className={cssStyle.table}>
                            <tbody>
                                <tr>
                                    <td width='25%' className={cssStyle.title}>MZX防控节点</td>
                                    <td width='25%' >{detail.point}</td>
                                    <td width='25%' className={cssStyle.title}>开始时间</td>
                                    <td width='25%' >{detail.startTime}</td>
                                </tr>
                                <tr>
                                    <td width='25%' className={cssStyle.title}>识别异常对象</td>
                                    <td width='25%' >{detail.object}</td>
                                    <td width='25%' className={cssStyle.title}>识别主体</td>
                                    <td width='25%' >{detail.main}</td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className={cssStyle.title}>预测预警结果</td>
                                </tr>
                                {
                                    detail.content && detail.content.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td colSpan={4} className={cssStyle.content}>{item}</td>
                                            </tr>
                                        )
                                    })
                                }
                                {/* {detail.disposition && detail.disposition.map((item, index) =>
                                    <tr key={index}>
                                        {index === 0 && <td width='25%' className={cssStyle.title} rowSpan={detail.disposition.length}>性格要素</td>}
                                        <td width='75%' colSpan={3} className={cssStyle.content}>{item}</td>
                                    </tr>
                                )}
                                {detail.action && detail.action.map((item, index) =>
                                    <tr key={index}>
                                        {index === 0 && <td width='25%' className={cssStyle.title} rowSpan={detail.action.length}>行为要素</td>}
                                        <td width='75%' colSpan={3} className={cssStyle.content}>{item}</td>
                                    </tr>
                                )}
                                {detail.event && detail.event.map((item, index) =>
                                    <tr key={index}>
                                        {index === 0 && <td width='25%' className={cssStyle.title} rowSpan={detail.event.length}>事件要素</td>}
                                        <td width='75%' colSpan={3} className={cssStyle.content}>{item}</td>
                                    </tr>
                                )} */}
                            </tbody>
                        </table>
                    </div>
                    <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)} />
                </div>
            </div>
        );
    }
}