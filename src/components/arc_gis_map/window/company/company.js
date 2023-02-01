import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";

export default class Company extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,pageIndex:0};
        this.refDom = React.createRef();
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        const {attributes} = this.props;
        return (
            <div ref={this.refDom} className={`${cssStyle.box} ${cssStyle.titleRight}`} style={this.props.style}>
                <table>
                    <tbody className={cssStyle.itemContent}>
                    <tr>
                        <td className={`${cssStyle.tdHead}`} colSpan={2}>{attributes.companyName}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'6.5em'}}>地　　址:</td>
                        <td >{attributes.businessAddress}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>监管项目:</td>
                        <td >{attributes.regulatoryClassificationBigName}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>法定代表:</td>
                        <td >{attributes.legalPersonName}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>联系电话:</td>
                        <td >{attributes.phone}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}