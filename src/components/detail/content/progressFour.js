import React from "react";
import cssStyle from "./progressOne.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import "./eventListThree.css";

import pointImg from "../images/pointThree.png";

export default class progressFour extends React.Component {
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
            <div style={this.props.style} className={cssStyle.box} >
                <Scrollbars className={'eventListThreeBlueBar'}>
                    <div className={cssStyle.contentBox}>
                        <div className={cssStyle.line} />
                        {detail && Array.isArray(detail) && detail.map((item,index)=>
                            <div key={index} className={cssStyle.itemBox}>
                                <div className={cssStyle.point} >
                                    <img alt={''} src={pointImg} />
                                </div>
                                <div className={`${cssStyle.row} ${cssStyle.rowTwo}`}>
                                    <span>{item.time}</span>
                                    <span>{item.dep}</span>
                                </div>
                                <div className={cssStyle.row}>{item.content}</div>
                            </div>
                        )}
                    </div>
                </Scrollbars>
            </div>
        );
    }
}