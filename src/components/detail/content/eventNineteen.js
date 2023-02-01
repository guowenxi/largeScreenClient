import React from "react";
import cssStyle from './eventNineteen.module.css';

import IconSeven from "../images/iconSeven.png";
import IconEight from "../images/iconEight.png";
import IconNine from "../images/iconNine.png";

export default class EventNineteen extends React.Component {
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
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.title}>{detail.title}</div>
                <div className={cssStyle.content}>{detail.content}</div>
                <div className={cssStyle.content}>
                    {detail.imgList && detail.imgList.map((item,index)=>
                        <img src={item} key={index} alt={''} className={cssStyle.img} />
                    )}
                </div>
                <div className={cssStyle.content}>
                    <div className={cssStyle.itemBox}>
                        <img alt={''} className={cssStyle.icon} src={IconSeven} />
                        <div>&nbsp;浏览 {detail.read}</div>
                    </div>
                    <div className={cssStyle.itemBox}>
                        <img alt={''} className={cssStyle.icon} src={IconEight} />
                        <div>&nbsp;评论 {detail.comment}</div>
                    </div>
                    <div className={cssStyle.itemBox}>
                        <img alt={''} className={cssStyle.icon} src={IconNine} />
                        <div>&nbsp;转发 {detail.forward}</div>
                    </div>
                </div>
            </div>
        );
    }
}