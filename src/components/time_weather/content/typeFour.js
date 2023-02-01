import React from "react";
import cssStyle from "./typeFour.module.css";

export default class TypeFour extends React.Component {
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
                <div className={cssStyle.time}>{detail.time}</div>
                <div className={cssStyle.day}>{detail.day}</div>
            </div>
        );
    }
}