import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";

export default class MicroGrid extends React.Component {
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
                        <td className={`${cssStyle.tdHead}`} colSpan={2}>{attributes.microGridName}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'7em'}}>微网格长:</td>
                        <td >{attributes.userName}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>电　　话:</td>
                        <td >{attributes.userPhone}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>范　　围:</td>
                        <td >{attributes.microGridAddress}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>团队分享次数:</td>
                        <td >{attributes.shareNumber}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>隐患上报次数:</td>
                        <td >{attributes.problemNumber}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>微调查次数:</td>
                        <td >{attributes.infoNumber}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}