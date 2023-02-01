import React from "react";
import cssStyle from "./tankList.module.css";

import TankIcon from "../images/tank.png";
import {Scrollbars} from "react-custom-scrollbars";

import sRed from "../images/sRed.png";
import sGreen from "../images/sGreen.png";
import sOrange from "../images/sOrange.png";
import sGray from "../images/sGray.png";

export default class TankList extends React.Component {
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
                        <div className={cssStyle.title}>{name}</div>
                        <div className={cssStyle.listBox}>
                            <Scrollbars>
                                {list && list.map((item,index)=>{
                                    const warningColor = item.warning ? 'rgb(255,75,75)':'rgb(0,217,133)';
                                    return (
                                        <div key={index} className={cssStyle.itemBox}>
                                            <img alt={''} src={TankIcon} className={cssStyle.tankImg} />
                                            <div className={cssStyle.barBox}>
                                                <div className={cssStyle.bar} style={{height:item.per+'%',backgroundColor:warningColor}}/>
                                            </div>
                                            <div className={cssStyle.name}>{item.name}</div>
                                            <div className={cssStyle.no}>{item.vCode}</div>
                                            <div className={cssStyle.per}>{item.per.toFixed(2)+'%'}</div>
                                            <div className={cssStyle.status}>{item.status}</div>
                                            <div className={cssStyle.pCode}>{item.pCode}</div>
                                            <img alt={''} src={this.valveIconList[item.valveStatus]} className={cssStyle.valveStatus} />
                                            <div className={cssStyle.backNum}>{item.backNum}</div>
                                        </div>
                                    );
                                })}
                            </Scrollbars>
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }
}