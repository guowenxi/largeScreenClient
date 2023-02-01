import React from "react";
import cssStyle from "./eventTen.module.css";
import {Scrollbars} from "react-custom-scrollbars";

export default class EventTen extends React.Component {
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
        const { detail } = this.props;
        if (detail == null) {
            return '';
        }
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <Scrollbars>
                    {Array.isArray(detail) && detail.map((item,index)=>
                        <div key={index} className={cssStyle.itemBox}>
                            <div>{item.content && item.content.substr(0,51)}...</div>
                            <div><span className={cssStyle.title}>预警时间：</span>{item.time}</div>
                            <div><span className={cssStyle.title}>预警原因：</span>{item.reason}</div>
                        </div>
                    )}
                </Scrollbars>
            </div>
        );
    }
}