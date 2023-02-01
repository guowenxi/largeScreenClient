import React from "react";
import Graph from "./graph";

export default class GraphBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        return (
            <Graph engineData={this.props.engineData} engineid={this.props.engineid} />
        );
    }
}