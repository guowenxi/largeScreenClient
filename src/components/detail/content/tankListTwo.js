import React from "react";
import cssStyle from "./tankListTwo.module.css";

import tankBg from "../images/tankTwo.png";
import sRed from "../images/sRed.png";
import sGreen from "../images/sGreen.png";
import sOrange from "../images/sOrange.png";
import sGray from "../images/sGray.png";

export default class TankListTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.valveIconList = {
            '1':sRed,
            '2':sGreen,
            '3':sOrange,
            '4':sGray,
        }
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
            return null;
        }
        const { list,name } = detail;
        return (
            <div style={this.props.style} className={`${cssStyle.box}`} >
                {!list || list.length === 0 ? (
                    <div className={cssStyle.noData}>{this.props.loading ? '数据加载中...' : '暂无数据'}</div>
                ) : (
                    <React.Fragment>
                        <img alt={''} src={tankBg} className={cssStyle.tankBg} />
                        <div className={cssStyle.title}>{name}</div>
                        <div className={cssStyle.listBox}>
                            {list && list.map((item,index)=>{
                                return (
                                    <div key={index} className={cssStyle.itemBox}>
                                        <img alt={''} src={this.valveIconList[item.valveStatus]} className={cssStyle.valveStatus} />
                                        <div className={cssStyle.scaleName}>{item.scaleName}</div>
                                        <div className={cssStyle.valueBox}>
                                            <div>{item.actualValue}</div>
                                            <div className={cssStyle.setValueBox}>
                                                <div>称重设定值：</div>
                                                <div>{item.setValue}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={cssStyle.nameListBox}>
                            {list && list.map((item,index)=>{
                                return <div key={index} >{item.areaName}</div>;
                            })}
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }
}