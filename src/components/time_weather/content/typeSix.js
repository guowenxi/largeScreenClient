import React from "react";
import cssStyle from "./typeSix.module.css";

export default class TypeFive extends React.Component {
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
            <div className={cssStyle.box} >
                <div className={cssStyle.week}>{detail.week}</div>
                <div className={cssStyle.text}>{detail.day}</div>
                <div className={cssStyle.text}>{detail.time}</div>
            </div>
        );
    }
}