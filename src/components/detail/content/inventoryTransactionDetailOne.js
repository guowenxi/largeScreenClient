/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from './inventoryTransactionDetailOne.module.css';

import { interactData } from "../../../common/util";
import enterIcon from '../images/inventoryTransactionDetailOneTwo.png';
import moveIcon from '../images/inventoryTransactionDetailOneFive.png';
import leaveIcon from '../images/inventoryTransactionDetailOneOne.png';
import processIcon1 from '../images/inventoryTransactionDetailOneThree.png';
import processIcon2 from '../images/inventoryTransactionDetailOneFour.png';
import processIcon3 from '../images/wenchengProcessingProgressThree.png';


// import Scrollbars from "react-custom-scrollbars";

export default class InventoryTransactionDetailOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.interactData = interactData.bind(this);
        this.titleList1 = [{ name: '化学品名称', key: 'name' }, { name: '仓库位置', key: 'warehouseAddress' }, { name: '货品规格', key: 'specifications' }, { name: '卸车服务', key: 'unloadService' }, { name: '堆高车', key: 'stackerService' }, { name: '铲车', key: 'forkliftService' }, { name: '驾驶员', key: 'driver' }, { name: '车牌号', key: 'carId' }, { name: '驾驶员电话', key: 'driverPhone' }];
        this.titleList2 = [{ name: '化学品名称', key: 'name' }, { name: '原仓库', key: 'warehouseAddress' }, { name: '目标仓库', key: 'targetLocation' }];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    //组件加载触发函数
    componentDidMount() {
    }
    // 点击交互
    handleClickInteract(type) {
        const { style } = this.props.thisData;
        const interact = style[`${type}Interact`];
        const { detail } = this.props;
        this.interactData(interact, detail);
    }
    // 获取左下部分化学品的相关信息
    getChemicalInfo(info) {
        const { status } = info;
        const flag = status === '移库';
        const titleList = flag ? this.titleList2 : this.titleList1;
        return (
            <div className={cssStyle.bottomLeft} style={{ justifyContent: !flag ? 'space-between' : 'flex-start' }}>
                {
                    titleList.map(({ name, key }, index) => {
                        return (
                            <div key={index} className={cssStyle.bottomLeftItem} style={{ marginBottom: flag ? '0.8em' : 0 }}>
                                <span className={cssStyle.itemName}>{name}：</span>
                                <span className={`${cssStyle.itemContent} ${cssStyle.onlyLine}`}>{info[key]}</span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    // 右下的流程
    getProcess(process) {
        return (
            <div className={cssStyle.bottomRight}>
                <div className={cssStyle.processLine} />
                {
                    Array.isArray(process) &&
                    process.map(({ name, department, time, status, statusName }, index, arr) => {
                        const statusIcons = {
                            processIcon1, processIcon2, processIcon3
                        };
                        const statusIcon = statusIcons[`processIcon${status}`];
                        const length = arr.length;
                        // const showLine = length > 1 && ((length === 2 && index === 0) || (length === 3 && (index === 0 || index === 1)));
                        return (
                            <React.Fragment key={index}>
                                <div className={cssStyle.processTop}>
                                    <button className={`${cssStyle.processButton}`}>
                                        {statusName}
                                    </button>
                                    <div className={cssStyle.processInfo}>
                                        <span>{name}{department ? `（${department}` : ''}</span>
                                        <span className={cssStyle.infoTime}>{time}</span>
                                    </div>
                                    {statusIcon && <img src={statusIcon} alt="" className={cssStyle.processImg} />}
                                </div>
                                {/*{showLine && <div className={cssStyle.processBottom}></div>}*/}
                            </React.Fragment>
                        )
                    })
                }
            </div>
        )
    }
    render() {
        const { detail } = this.props;
        const statusIcon = detail.status === '入库' ? enterIcon : (detail.status === '出库' ? leaveIcon : moveIcon);
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <div className={cssStyle.top}>
                    <div className={cssStyle.statusBox}>
                        <img src={statusIcon} className={cssStyle.statusImg} alt="" />
                        <span className={cssStyle.statusText}>{detail.status}</span>
                    </div>
                    <div className={cssStyle.enterpriseInfo}>
                        <span>{detail.number}</span>
                        <span>{detail.enterprise}</span>
                        <span>联系电话：{detail.phone}</span>
                        <span>预计{detail.status}时间：{detail.estimatedTime}</span>
                    </div>
                    <div className={cssStyle.quantityBox}>
                        <span className={cssStyle.quantity}>{detail.quantity}</span>{detail.unit}
                    </div>
                </div>
                {/* <div className={cssStyle.centerButton}>
                    <button
                        className={`${cssStyle.commonButton} ${cssStyle.adoptButton}`}
                        onClick={this.handleClickInteract.bind(this, 'adopt')}
                    >
                        通过
                    </button>
                    <button
                        className={`${cssStyle.commonButton} ${cssStyle.backButton}`}
                        onClick={this.handleClickInteract.bind(this, 'back')}
                    >
                        退回
                    </button>
                </div> */}
                <div className={cssStyle.bottom}>
                    {this.getChemicalInfo(detail,)}
                    {this.getProcess(detail.processes)}
                </div>
            </div>
        );
    }
}