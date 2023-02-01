import React from "react";
import cssStyle from "./tankListSix.module.css";

import tankBg from "../images/tankSix.png";
import sRed from "../images/sRed.png";
import sGreen from "../images/sGreen.png";
import sOrange from "../images/sOrange.png";
import sGray from "../images/sGray.png";

export default class TankListThree extends React.Component {
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
        const { detail,loading } = this.props;
        if (detail == null) {
            return null;
        }
        const { name,tankList,tankPumpList,carPumpList } = detail;
        return (
            <div style={this.props.style} className={`${cssStyle.box}`} >
                {loading ? (
                    <div className={cssStyle.noData}>数据加载中...</div>
                ) : (
                    <React.Fragment>
                        <img alt={''} src={tankBg} className={cssStyle.tankBg} />
                        <div className={cssStyle.title}>{name}</div>
                        <div className={cssStyle.tankListBox}>
                            {tankList && tankList.map((item,index)=>{
                                const warningColor = item.warning ? 'rgb(255,75,75)':'rgb(0,217,133)';
                                return (
                                    <div key={index} className={cssStyle.tankItemBox}>
                                        <img alt={''} src={this.valveIconList[item.valveStatus]} className={cssStyle.tankValveStatus} />
                                        <div className={cssStyle.barBox}>
                                            <div className={cssStyle.bar} style={{height:item.per+'%',backgroundColor:warningColor}}/>
                                        </div>
                                        <div className={cssStyle.tankName}>{item.name}</div>
                                        <div className={cssStyle.vCode}>{item.vCode}</div>
                                        <div className={cssStyle.warningBox}>
                                            <div className={cssStyle.warningStatus} style={{backgroundColor:warningColor}}/>
                                            <div>液位报警</div>
                                        </div>
                                        <div className={cssStyle.status}>{item.status}</div>
                                        <div className={cssStyle.per}>{item.per.toFixed(2)+'%'}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={cssStyle.tankPumpListBox}>
                            {tankPumpList && tankPumpList.map((item,index)=>{
                                return (
                                    <div key={index} className={cssStyle.tankPumpItemBox}>
                                        <div>{item.name}</div>
                                        <div>{item.pCode}</div>
                                        <div className={cssStyle.tankPumpStatus}>{item.status}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={cssStyle.carPumpListBox}>
                            {carPumpList && carPumpList.map((item,index)=>{
                                return (
                                    <div key={index} className={cssStyle.carPumpItemBox}>
                                        <div>{item.pCode}</div>
                                        <div className={cssStyle.tankPumpStatus}>{item.status}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }
}