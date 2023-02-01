import React from "react";
import cssStyle from "./eventLucheng.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {getCompatibleData} from "../../../common/detailUtil";

import pointIcon from "../images/pointIcon.png";
import {interactData} from "../../../common/util";

export default class EventLucheng extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    clickCompany(company,detail){
        const {interact} = this.props.thisData.dataSources;
        this.interactData(interact,{...detail,...company});
    }

    render() {
        const detailList = this.props.detail;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        return (
            <div
                className={`${cssStyle.detailBox}`}
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding }}
            >
                <Scrollbars >
                    {detailList && detailList.map && detailList.map((detail,detailIndex)=>
                        <div className={cssStyle.eventOneBox} key={detailIndex}>
                            <div className={cssStyle.head}>
                                <img alt={''} src={pointIcon} className={cssStyle.headIcon} />
                                <div>关联事件{detailIndex+1}</div>
                            </div>
                            <div className={cssStyle.head}>
                                <img alt={''} src={pointIcon} className={cssStyle.headIcon} />
                                <div>基本信息</div>
                            </div>
                            <table>
                                <tbody>
                                <tr>
                                    <td className={cssStyle.title}>事件名称：</td>
                                    <td className={cssStyle.contentOne}>{detail.title}</td>
                                    <td className={cssStyle.title}>是否重大：</td>
                                    <td className={cssStyle.contentThree}>{detail.isGreat}</td>
                                    <td className={cssStyle.title}>是否紧急：</td>
                                    <td className={cssStyle.contentThree}>{detail.isUrgent}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.title}>事发时间：</td>
                                    <td className={cssStyle.contentOne}>{detail.time}</td>
                                    <td className={cssStyle.title}>事件类别：</td>
                                    <td className={cssStyle.contentTwo} colSpan={3}>{detail.type}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.title}>事发地点：</td>
                                    <td className={cssStyle.contentOne}>{detail.address}</td>
                                    <td className={cssStyle.title}>所属街道：</td>
                                    <td className={cssStyle.contentTwo} colSpan={3}>{detail.road}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.title}>涉及公司：</td>
                                    <td colSpan={5} >
                                        {detail.company && detail.company.map((company,index)=>
                                            <div key={index} className={`${cssStyle.blue} ${cssStyle.company}`} onClick={this.clickCompany.bind(this,company,detail)}>{company.name}</div>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.title}>事件详情：</td>
                                    <td colSpan={5}>{detail.content}</td>
                                </tr>
                                </tbody>
                            </table>
                            <div className={cssStyle.head}>
                                <img alt={''} src={pointIcon} className={cssStyle.headIcon} />
                                <div>涉事人员</div>
                            </div>
                            <table>
                                <tbody>
                                <tr>
                                    <td className={cssStyle.title}>涉事人数：</td>
                                    <td >{detail.peopleNum}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.title}>挑头人员：</td>
                                    <td >
                                        {detail.leader && detail.leader.map((leader,index)=>{
                                            return (
                                                <div key={index} className={cssStyle.leaderBox}>
                                                    <div>{leader.name}</div>
                                                    <div>{leader.phone}</div>
                                                    <div>{leader.cardId}</div>
                                                    <div className={cssStyle.blue}>{leader.isBind}</div>
                                                </div>
                                            );
                                        })}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </Scrollbars>
            </div>
        );
    }
}