/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./digitalEconomyDetail.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { interactData } from "../../../common/util";

export default class DefuseDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gridRoadId: '', name: '' };
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }
    //组件删除时触发函数
    componentWillUnmount() {
    }
    render() {
        const { detail, } = this.props;
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <span className={cssStyle.title}>{detail.title}</span>
                <Scrollbars style={{width: '100%', height: 'calc(100% - 3.1em)'}}>
                    <div dangerouslySetInnerHTML={{ __html: detail.content }} className={cssStyle.content}></div>
                </Scrollbars>
            </div >
        );
    }
}