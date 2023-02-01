import React from "react";
import cssStyle from "./contentThree.module.css";

export default class ContentThree extends React.Component {
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
            <div className={cssStyle.contentBox} style={this.props.style}>
                <div className={cssStyle.headBox}>
                    <div className={cssStyle.carId}>{detail.carId}</div>
                    <div className={cssStyle.text}>{detail.message}</div>
                </div>
                <div className={cssStyle.lineBox}>
                    <div className={cssStyle.text}>{detail.time}</div>
                    <div className={cssStyle.text}>{detail.content}</div>
                </div>
            </div>
        );
    }
}