import React from "react";
import cssStyle from "./peopleOneNew.module.css";
import { interactData } from "../../../common/util";

export default class PeopleOneNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasTurnTo: false, hasWarning: false };
        this.warningLevelName = ['无', '高', '中', '中', '低', '低', '无'];
        this.controlLevelName = ['', '关注', '一级', '二级', '三级'];
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }
    // 点击关闭交互
    handleClickClose() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, { emergencyId: this.props.keyParams });
    }
    render() {
        const { detail } = this.props;
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <div className={cssStyle.top}>
                    <span className={cssStyle.title}>人员详情</span>
                    <span className={cssStyle.closeIcon} onClick={this.handleClickClose.bind(this)}></span>
                </div>
                <table className={cssStyle.content}>
                    <tbody>
                        <tr>
                            <td className={cssStyle.trTitle}>姓名：</td>
                            <td className={cssStyle.trContentOne}>{detail.name}</td>
                            <td className={cssStyle.trTitle}>异动行为：</td>
                            <td className={cssStyle.trContentTwo}>{detail.peopleTypeName}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.trTitle}>乡镇街道：</td>
                            <td className={cssStyle.trContentOne}>{detail.roadName}</td>
                            <td className={cssStyle.trTitle}>预测等级：</td>
                            <td className={cssStyle.trContentTwo}>{detail.warningLevel ? this.warningLevelName[detail.warningLevel] : ''}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.trTitle}>事发时间：</td>
                            <td className={cssStyle.trContentOne}>{detail.warningTime}</td>
                            <td className={cssStyle.trTitle}>管控等级：</td>
                            <td className={cssStyle.trContentTwo}>{detail.level ? this.controlLevelName[detail.level] : ''}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.trTitle}>操作人：</td>
                            <td className={cssStyle.trContentOne}>{detail.operationUser}</td>
                            <td className={cssStyle.trTitle}>操作时间：</td>
                            <td className={cssStyle.trContentTwo}>{detail.operationTime}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.trTitle}>涉事类型：</td>
                            <td className={cssStyle.trContent} colSpan={3}>{detail.relateEventTypeName}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.trTitle}>详细地址：</td>
                            <td className={cssStyle.trContent} colSpan={3}>{detail.address}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.trTitle}>工作单位：</td>
                            <td className={cssStyle.trContent} colSpan={3}>{detail.workCompany}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}