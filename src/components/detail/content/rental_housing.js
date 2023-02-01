import React from "react";
import cssStyle from "./rental_housing.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import iconTriangle from "../../detail_event/images/lanjiao_blue.svg";
import closeTypeOne from "../../../common/images/closeTypeOne.svg";
import { interactData } from "../../../common/util";

export default class CheckTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showEdit: false, pageIndex: 0 };
        this.refDom = React.createRef();
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    interact() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {});
    }

    render() {
        const { detail } = this.props;
        return (
            <div className={cssStyle.box} style={this.props.style}>
                <div className={cssStyle.headBox}>
                    {detail.road + "-" + detail.address}
                </div>
                <img
                    alt="" style={{ width: '2.5vh', height: '2.5vh', right: '2vh', position: 'absolute', top: '1.5vh' }}
                    src={closeTypeOne}
                    onClick={this.interact.bind(this)}
                />
                <Scrollbars style={{ width: '100%', height: 'calc(100% - 4vh)', position: 'relative' }}>
                    <div className={cssStyle.itemBox}>
                        <div className={cssStyle.itemHead}>
                            <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon} />
                            <div className={cssStyle.itemTitle}>基本信息</div>
                        </div>
                        <table className={cssStyle.itemContent}>
                            <tbody>
                                <tr>
                                    <td className={cssStyle.tdTitle}>租赁证号</td>
                                    <td className={cssStyle.tdContent}>{detail.leaseNum}</td>
                                    <td className={cssStyle.tdTitle}>备案时间</td>
                                    <td className={cssStyle.tdContent}>{detail.filingTime}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>房屋坐落</td>
                                    <td className={cssStyle.tdContent}>{detail.address}</td>
                                    <td className={cssStyle.tdTitle}>统一地址库编码</td>
                                    <td className={cssStyle.tdContent}>{detail.code}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={cssStyle.itemHead}>
                            <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon} />
                            <div className={cssStyle.itemTitle}>出租信息</div>
                        </div>
                        <table className={cssStyle.itemContent}>
                            <tbody>
                                <tr>
                                    <td className={cssStyle.tdTitle}>出租方</td>
                                    <td className={cssStyle.tdContent}>{detail.lessors}</td>
                                    <td className={cssStyle.tdTitle}>出租方证件号码</td>
                                    <td className={cssStyle.tdContent}>{detail.lessorsNum}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={cssStyle.itemHead}>
                            <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon} />
                            <div className={cssStyle.itemTitle}>承租信息</div>
                        </div>
                        <table className={cssStyle.itemContent}>
                            <tbody>
                                <tr>
                                    <td className={cssStyle.tdTitle}>承租方</td>
                                    <td className={cssStyle.tdContent}>{detail.tenantry}</td>
                                    <td className={cssStyle.tdTitle}>承租方证件号</td>
                                    <td className={cssStyle.tdContent}>{detail.tenantryNum}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>租赁开始时间</td>
                                    <td className={cssStyle.tdContent}>{detail.startTime}</td>
                                    <td className={cssStyle.tdTitle}>租赁结束时间</td>
                                    <td className={cssStyle.tdContent}>{detail.endTime}</td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.tdTitle}>租赁金额</td>
                                    <td className={cssStyle.tdContent} colSpan={3}>{detail.money}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}