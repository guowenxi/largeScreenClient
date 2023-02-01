import React from "react";
import cssStyle from "./explain.module.css";
import {Scrollbars} from "react-custom-scrollbars";

export default class Explain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedIndex:0,fileId:''};
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
                <table className={cssStyle.content}>
                    <tbody>
                    <tr style={{height:'3em'}}>
                        <td>
                            <span className={cssStyle.title}>风险隐患：</span>
                            <span>{detail.danger}</span>
                        </td>
                    </tr>
                    <tr style={{height:'3em'}}>
                        <td>
                            <span className={cssStyle.title}>灭火方式：</span>
                            <span>{detail.way}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Scrollbars>
                                <span className={cssStyle.explain}>规格说明：{detail.explain}</span>
                            </Scrollbars>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}