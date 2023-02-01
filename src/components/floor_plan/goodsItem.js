import React from "react";
import {Icon} from 'antd';
import cssStyle from "./floor_plan.module.css";

import goodsBox from "./images/goodsBox.svg";
import iconCom from "./images/icon_diannao.svg";

export default class GoodsItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show:false,listHeight:0};
        this.iconList = {
            1:iconCom
        };
    }

    render() {
        const {data} = this.props;
        return (
            <div style={this.props.style} className={`${this.props.className}`}>
                <img alt={''} src={goodsBox} className={cssStyle.goodsItemBg} />
                <div className={cssStyle.goodsHead} onClick={this.props.itemClick.bind(this,data)}>
                    <img alt={''} src={this.iconList[data.type]} className={cssStyle.icon}/>
                    <div className={cssStyle.typeName}>{data.typeName}</div>
                    <div className={cssStyle.No}>{data.no}</div>
                    <Icon type="right-circle" theme="filled" className={cssStyle.rightIcon}/>
                </div>
                <div className={cssStyle.goodsContent}>
                    <div className={cssStyle.title}>
                        <span>型</span>
                        <span>号：</span>
                    </div>
                    <div className={cssStyle.value}>{data.model}</div>
                    <div className={cssStyle.title}>
                        <span>分</span>
                        <span>配</span>
                        <span>时</span>
                        <span>间：</span>
                    </div>
                    <div className={cssStyle.value}>{data.date}</div>
                    <div className={cssStyle.title}>
                        <span>使</span>
                        <span>用</span>
                        <span>人：</span>
                    </div>
                    <div className={cssStyle.value}>{data.userName}</div>
                    <div className={cssStyle.title}>
                        <span>状</span>
                        <span>态：</span>
                    </div>
                    <div className={cssStyle.value}>{data.status}</div>
                </div>
            </div>
        );
    }
}