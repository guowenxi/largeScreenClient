import React from "react";
import cssStyle from "./numberShowTypeTwo.module.css";
import GridIcon from  "./images/grid.png";
import ErrorIcon from  "./images/error.png";

export default class NumberShowTypeTwo extends React.Component {
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
        const {data} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} onClick={this.props.onClick}>
                <img className={cssStyle.img} alt={''} src={GridIcon} />
                <div className={cssStyle.numOne}>{data.grid}</div>
                <img className={cssStyle.img} alt={''} src={ErrorIcon} />
                <div className={cssStyle.numTwo}>{data.error}</div>
            </div>
        );
    }
}