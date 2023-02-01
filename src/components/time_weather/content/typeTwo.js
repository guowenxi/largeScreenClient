import React from "react";
import cssStyle from "./typeTwo.module.css";

import arrowIcon from "../images/arrow.png";

export default class TypeTwo extends React.Component {
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
                <div className={cssStyle.topLine}>
                    <img alt={''} src={arrowIcon}/>
                    <div className={cssStyle.week}>{detail.week}</div>
                </div>
                <div className={cssStyle.bottomLine}>
                    <div>{detail.day}</div>
                    <div>{detail.time}</div>
                </div>
            </div>
        );
    }
}