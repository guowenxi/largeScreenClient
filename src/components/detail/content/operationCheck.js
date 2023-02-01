import React from "react";
import {interactData} from "../../../common/util";

export default class operationCheck extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.operationCheck = this.operationCheck.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
        window.removeEventListener('keydown',this.operationCheck);
        window.removeEventListener('mousemove',this.operationCheck);
    }

    //组件加载触发函数
    componentDidMount() {
        window.addEventListener('keydown',this.operationCheck);
        window.addEventListener('mousemove', this.operationCheck);
    }

    operationCheck(){
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            const { interact } = this.props.thisData.dataSources;
            this.interactData(interact, {});
        },this.props.styleData.time || 1000*60*5);
    }

    render() {
        return (
            <div />
        );
    }
}