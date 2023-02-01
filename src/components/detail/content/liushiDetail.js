import React from "react";
import cssStyle from "./liushiDetail.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { getCompatibleData } from "../../../common/detailUtil";
import Icon from "../images/liushiIcon.png";

export default class AboutPlatform extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getCompatibleData = getCompatibleData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const { detail } = this.props;
        return (
            <div
                className={cssStyle.box} style={this.props.style}
            >
                <Scrollbars style={{width:'100%',height:'100%'}}>
                    <div className={cssStyle.titleBox}>
                        <img alt="" src={Icon} className={cssStyle.imgStyle} />
                        <div className={cssStyle.title}>{detail.title}</div>
                    </div>
                    <div className={cssStyle.contentBox}>
                        <div className={cssStyle.content}>{detail.content}</div>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}