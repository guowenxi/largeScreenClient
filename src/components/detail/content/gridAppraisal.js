import React from "react";
import cssStyle from "./gridAppraisal.module.css";
import CloseIcon from "../images/closeOne.png";
import {Scrollbars} from "react-custom-scrollbars";

export default class GridAppraisal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.planName = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    closeThis(){
        this.props.changeThisShow(false,true);
    }


    getContent(detail){
        return (
            <table className={cssStyle.table}>
                <tbody >
                {detail && detail.map && detail.map((item,index)=>
                    <React.Fragment key={index}>
                        <tr>
                            <td className={cssStyle.head} colSpan={5}>评奖情况</td>
                        </tr>
                        <tr>
                            <td width='15%'>网格名称</td>
                            <td width='15%'>评奖星级</td>
                            <td width='35%'>评奖事由</td>
                            <td width='20%'>考评单位</td>
                            <td width='15%'>颁奖负责人</td>
                        </tr>
                        <tr>
                            <td width='15%'>{item.gridName}</td>
                            <td width='15%'>{item.level}</td>
                            <td width='35%'>{item.reason}</td>
                            <td width='20%'>{item.department}</td>
                            <td width='15%'>{item.responsible}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.head} colSpan={5}>基本信息</td>
                        </tr>
                        <tr>
                            <td width='15%'>网格长</td>
                            <td width='15%'>网格员数量</td>
                            <td width='35%'>网格指导员</td>
                            <td width='35%' colSpan={2}>网格业务指导员</td>
                        </tr>
                        <tr>
                            <td width='15%'>{item.gridLeader}</td>
                            <td width='15%'>{item.gridNum}</td>
                            <td width='35%'>{item.guide}</td>
                            <td width='35%' colSpan={2}>{item.businessGuide}</td>
                        </tr>
                    </React.Fragment>
                )}
                </tbody>
            </table>
        );
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.backgroundBox}>
                    <div className={cssStyle.contentBox}>
                        {!detail || detail.length === 0 ? (
                            <div className={cssStyle.noData}>{this.props.loading?'数据加载中...':'暂无数据'}</div>
                        ):(
                            <React.Fragment>
                                {detail.length > 1 ? (
                                    <div className={cssStyle.tableMaxContent}>
                                        <Scrollbars>
                                            {this.getContent(detail)}
                                        </Scrollbars>
                                    </div>
                                ):(
                                    <div className={cssStyle.tableContent}>
                                        {this.getContent(detail)}
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </div>
                    <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)}/>
                </div>
            </div>
        );
    }
}