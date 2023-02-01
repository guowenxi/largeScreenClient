import React from "react";
import cssStyle from "./contentFour.module.css";

export default class ContentFour extends React.Component {
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
            <div className={cssStyle.listItem} style={this.props.style}>
                <img alt={''} src={detail.img}/>
                <div className={cssStyle.title}>{detail.title}</div>
            </div>
        );
    }
}