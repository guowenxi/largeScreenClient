import React from "react";
import cssStyle from "./contentFive.module.css";

export default class ContentFive extends React.Component {
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
                <img alt={''} src={detail.path}/>
                <div className={cssStyle.contentBox}>
                    <div>{`${detail.licenseplate} ${detail.time}`}</div>
                    <div>{detail.address}</div>
                </div>
            </div>
        );
    }
}