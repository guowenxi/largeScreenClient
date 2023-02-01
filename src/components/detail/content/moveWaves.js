import React from "react";
import cssStyle from "./moveWaves.module.css";
import waves from "../images/waves.png";

export default class moveWaves extends React.Component {
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
                <img alt={''} src={waves} className={cssStyle.wavesOne} />
                <img alt={''} src={waves} className={cssStyle.wavesTwo} />
            </div>
        );
    }
}