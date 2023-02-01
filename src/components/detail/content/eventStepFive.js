import React from "react";
import cssStyle from "./eventStep.module.css";
import CloseIcon from "../images/closeOne.png";

export default class EventStepFive extends React.Component {
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
                                    <td width='25%' className={cssStyle.title}>排查异常对象</td>
                                    <td width='25%' >{detail.object}</td>
                                    <td width='25%' className={cssStyle.title}>关注主体</td>
                                    <td width='25%' >{detail.main}</td>
                                </tr>
                                <tr>
                                    <td width='25%' className={cssStyle.title}>牵头单位</td>
                                    <td width='25%' >{detail.department}</td>
                                    <td width='25%' className={cssStyle.title}>协同单位</td>
                                    <td width='25%' >{detail.synergy}</td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className={cssStyle.title}>跟踪关注内容</td>
                                </tr>
                                {detail.content && detail.content.map((item, index) =>
                                    <tr key={index}>
                                        <td  colSpan={4} className={cssStyle.content}>{item}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)} />
                </div>
            </div>
        );
    }
}