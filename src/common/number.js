import React from "react";

export default class NumBer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey" :
                this.keyParams[data.keyName] = data.data;
                this.reGetData();
                break;
            case "animateOn":
                this.animateOn();
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <div style={{position:'relative',height:'100%',...this.props.style}}>
                {this.props.num}
            </div>
        );
    }
}