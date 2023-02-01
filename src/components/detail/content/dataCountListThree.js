import React from "react";
import cssStyle from "./dataCountListThree.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {interactData} from "../../../common/util";
import "./eventListThree.css";

export default class DataCountListThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedId:0};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    itemClick(item,index){
        this.setState({selectedId:index});
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }

    render() {
        const { detail } = this.props;
        return (
            <div style={this.props.style} className={`${cssStyle.box} black-blue-page`} >
                <Scrollbars className={'eventListThreeBlueBar'}>
                    {detail && Array.isArray(detail) && detail.map((item,index)=>{
                        return (
                            <div key={index} className={`${cssStyle.itemBox} ${index === this.state.selectedId ? cssStyle.selectedBox:''}`} onClick={this.itemClick.bind(this,item,index)}>
                                <div className={cssStyle.head}>{item.name}</div>
                                <div className={cssStyle.perRow}>
                                    <div className={cssStyle.perTitle}>人员在岗率</div>
                                    <div className={cssStyle.perData}>{item.per}%</div>
                                </div>
                                <div className={cssStyle.barBox}>
                                    <div className={cssStyle.bar} style={{width:item.per+'%'}} />
                                </div>
                                <div className={cssStyle.leaderBox}>
                                    <div className={cssStyle.typeOne}>总指挥长</div>
                                    <div className={cssStyle.name}>{item.leaderName}</div>
                                    <div className={cssStyle.phone}>{item.leaderPhone}</div>
                                </div>
                                {item.memberList && item.memberList.map((member,memberIndex)=>
                                    <div className={cssStyle.memberBox} key={memberIndex}>
                                        <div className={memberIndex === 0 ? cssStyle.typeTwo : cssStyle.typeThree}>{member.type}</div>
                                        <div className={cssStyle.name}>{member.name}</div>
                                        <div className={cssStyle.phone}>{member.phone}</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </Scrollbars>
            </div>
        );
    }
}