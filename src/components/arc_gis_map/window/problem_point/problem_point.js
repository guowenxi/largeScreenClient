import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";

export default class ProblemPoint extends React.Component {
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
            <div ref={this.refDom} className={cssStyle.box} style={this.props.style}>
                <table>
                    <tbody className={cssStyle.itemContent}>
                    <tr>
                        <td className={`${cssStyle.tdHead}`} colSpan={2}>{attributes.name}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>上报时间:</td>
                        <td >{attributes.commitTime}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>上报地址:</td>
                        <td >{attributes.address}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}