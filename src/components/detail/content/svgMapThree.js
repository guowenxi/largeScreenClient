import React from "react";
import cssStyle from "./svgMapThree.module.css";
import liushiTop from "../images/liushiTopThree.png";
import liushiBg from "../images/liushiBgThree.png";

export default class SvgMapThree extends React.Component {
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
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <img alt={''} src={liushiBg} />
                <img alt={''} src={liushiTop} className={cssStyle.top} />
            </div>
        );
    }
}