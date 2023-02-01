import React from "react";
import cssStyle from "./briefingOne.module.css";

export default class BriefingOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.serialNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
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
                <div className={cssStyle.row}>{detail.title}</div>
                {detail.content && detail.content.map((item,index)=>
                    <div key={index} className={cssStyle.itemBox}>
                        <div className={cssStyle.row}>{this.serialNumbers[index]}、{item.title}</div>
                        {item.content && item.content.map((child,childIndex)=>
                            <React.Fragment key={childIndex}>
                                <div className={cssStyle.contentOne}>{childIndex+1}、{child}</div>
                            </React.Fragment>
                        )}
                    </div>
                )}
            </div>
        );
    }
}