import React from "react";
import cssStyle from "./grid.module.css";

export default class Grid extends React.Component {
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
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.head}>基本信息</div>
                <table className={cssStyle.content}>
                    <tbody>
                    <tr>
                        <td className={cssStyle.trTitle}>网格名称：</td>
                        <td className={cssStyle.trContent}>{detail.name}</td>
                        <td className={cssStyle.trTitle}>网格编号：</td>
                        <td className={cssStyle.trContent}>{detail.gridNo}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>所属镇街：</td>
                        <td className={cssStyle.trContent}>{detail.roadName}</td>
                        <td className={cssStyle.trTitle}>所属村社：</td>
                        <td className={cssStyle.trContent}>{detail.community}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>一肩挑：</td>
                        <td className={cssStyle.trContent}>{detail.allLeader}</td>
                        <td className={cssStyle.trTitle}>网格指导员：</td>
                        <td className={cssStyle.trContent}>{detail.instructor}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>网格长：</td>
                        <td className={cssStyle.trContent}>{detail.gridLeader}</td>
                        <td className={cssStyle.trTitle}>专职网格员：</td>
                        <td className={cssStyle.trContent}>{detail.gridMember}</td>
                    </tr>
                    </tbody>
                </table>
                <div className={cssStyle.head}>协管信息</div>
                <table className={cssStyle.content}>
                    <tbody>
                    <tr>
                        <td className={cssStyle.trTitle}>区域名称：</td>
                        <td className={cssStyle.trContent}>{detail.areaName}</td>
                        <td className={cssStyle.trTitle}>微网格员：</td>
                        <td className={cssStyle.trContent}>{detail.smallGridMember}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>网格协管员：</td>
                        <td className={cssStyle.trContent}>{detail.assistant}</td>
                        <td className={cssStyle.trTitle}>　</td>
                        <td className={cssStyle.trContent}>　</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}