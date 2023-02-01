import React from "react";

export default class ThreeBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        return (
            <div style={{position:'absolute',height:'100%',width:'100%'}}>
            </div>
        );
    }
}