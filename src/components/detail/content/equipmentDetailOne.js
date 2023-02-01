/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from './equipmentDetailOne.module.css';

import { interactData } from "../../../common/util";

import closeIcon from '../images/equipmentDetailOneOne.png';

import Scrollbars from "react-custom-scrollbars";
import { PhotoSlider } from 'react-photo-view';
import { Modal } from "antd";

export default class EquipmentDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 0,
            visible: false,
            photoIndex: 0,
        };
        this.statusList = [
            { status: '在线', text: '在线', color: 'rgba(0,172,254,0.6)' }, { status: '离线', text: '离线', color: 'rgba(242,224,6,0.6)' }, { status: '故障', text: '故障', color: 'rgba(240,87,73,0.6)' }
        ];
        this.titleList1 = [
            { name: '设备名称', key: 'productName' }, { name: '所属分类', key: 'productClassifyName' }, { name: '设备编号', key: 'productNumber' }, { name: '安装位置', key: 'installationPosition' }, { name: '设备规格', key: 'productSpecifications' }, { name: '创建时间', key: 'creatTimeString' }, { name: '创建人员', key: 'creator' }, { name: '有效期', key: 'termOfValidityString' }, { name: '预警时间', key: 'earlyWarningTimeString' }, { name: '巡检周期', key: 'inspectorCycle' }, { name: '巡检人员', key: 'inspector' }, { name: '相关负责人', key: 'personInCharge' }, { name: '设备类型', key: 'productType' }
        ];
        this.titleList3 = [
            { name: '类型', key: 'maintenanceType' }, { name: '状态', key: 'equipmentStatus' }, { name: '维护时间', key: 'timeString' }, { name: '维护人员', key: 'repairman' }, { name: '原因', key: 'reason' }, { name: '结果', key: 'result' }
        ];
        this.tabs = ['基本信息', '规格参数', '维护记录'];
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    componentDidUpdate(prveProps) {
        if (prveProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            // this.getDetail();
        }
    }
    //组件加载触发函数
    componentDidMount() {
    }
    // 点击关闭
    handleClickClose() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {});
    }
    // 渲染列表的每一行
    getRenderDetailRow(name, content, index, length, subLength) {
        const backgroundColor = subLength ? (index % 2 === 0 ? 'rgba(60,255,253,0.3)' : 'transparent') : (index % 2 !== 0 ? 'rgba(60,255,253,0.3)' : 'transparent');
        const borderBottom = index === length - 1 ? 'solid 1px #3cfffd' : 0
        return (
            <div className={cssStyle.detailItem} style={{ backgroundColor, borderBottom }}>
                <span className={cssStyle.detailItemTitle}>
                    {name}
                </span>
                <span
                    className={`${cssStyle.detailItemContent} ${(subLength && index > 3) ? cssStyle.detailItemContentMore : ''}`}
                    title={content}
                >
                    {content}
                </span>
            </div>
        )
    }
    // 渲染维护记录
    getRenderLog(maintenanceLog, titleList) {
        return (
            Array.isArray(maintenanceLog) &&
            maintenanceLog.map((item, index, arr) => {
                return (
                    <div
                        key={index}
                        className={cssStyle.logBox}
                        style={{ borderBottom: arr.length < 2 ? 'solid 1px #3cfffd' : (arr.length - 1 === index ? 0 : 'solid 1px #3cfffd') }}
                    >
                        <div className={cssStyle.detailItem} style={{ justifyContent: 'space-between', padding: 0 }}>
                            <span className={cssStyle.firstDetailTitle}>{`记录${index + 1}`}</span>
                            <span
                                className={cssStyle.imgButton}
                                onClick={this.handleClickPreviewImg.bind(this, index)}
                            >
                                查看照片
                            </span>
                        </div>
                        {
                            titleList.map(({ key, name }, subIndex, subArr) => {
                                return (
                                    <React.Fragment key={subIndex}>
                                        {this.getRenderDetailRow(name, item[key], subIndex, null, subArr.length)}
                                    </React.Fragment>
                                )
                            })
                        }
                    </div>
                )
            })
        )
    }
    // 渲染规格参数
    getRenderSpecification(parameterKeys, parameterSpecificationMap) {
        return (
            parameterKeys.map((item, index, arr) => {
                return (
                    <React.Fragment key={index}>
                        {this.getRenderDetailRow(item, parameterSpecificationMap[item], index, arr.length < 14 ? arr.length : null)}
                    </React.Fragment>
                )
            })
        )
    }
    // 渲染详情
    getRenderDetail() {
        const { selectIndex } = this.state;
        const { detail } = this.props;
        const titleList = this[`titleList${selectIndex + 1}`];
        if (selectIndex === 0) {
            return (
                titleList.map(({ name, key }, index, arr) => {
                    return (
                        <React.Fragment key={index}>
                            {this.getRenderDetailRow(name, detail[key], index, arr.length)}
                        </React.Fragment>
                    )
                })
            )
        } else if (selectIndex === 1) {
            let parameterKeys = [];
            const { parameterSpecificationMap } = detail;
            if (typeof parameterSpecificationMap === 'object') {
                parameterKeys = Object.keys(parameterSpecificationMap);
            }
            return (
                parameterKeys.length > 0 && (
                    parameterKeys.length >= 14 ? (
                        <Scrollbars style={{ borderBottom: 'solid 1px #3cfffd' }}>
                            {this.getRenderSpecification(parameterKeys, parameterSpecificationMap)}
                        </Scrollbars>
                    ) : (
                        this.getRenderSpecification(parameterKeys, parameterSpecificationMap,)
                    )
                )
            )
        } else {
            const { maintenanceLog } = detail;
            if (Array.isArray(maintenanceLog)) {
                return (
                    maintenanceLog.length >= 2 ?
                        (
                            <Scrollbars style={{ borderBottom: 'solid 1px #3cfffd' }}>
                                {this.getRenderLog(maintenanceLog, titleList)}
                            </Scrollbars>
                        ) :
                        (
                            this.getRenderLog(maintenanceLog, titleList)
                        )
                )
            }
            return null;
        }
    }
    // 照片预览
    getImagePreview() {
        let imgList = [];
        const { fileServiceUrl } = this.props.styleData;
        const { visible, photoIndex } = this.state;
        const { maintenanceLog } = this.props.detail;
        if (Array.isArray(maintenanceLog) && maintenanceLog.length > 0) {
            const { photoBack, photoTop } = maintenanceLog[photoIndex];
            const backImgs = !!photoBack && typeof photoBack ? photoBack.split(',') : [];
            const topImgs = !!photoTop && typeof photoTop ? photoTop.split(',') : [];
            imgList = backImgs.concat(topImgs).map(item => fileServiceUrl + item);
        }
        return (
            <PhotoSlider
                images={imgList.map((item) => ({ src: item }))}
                visible={visible}
                onClose={() => this.setState({ visible: false })}
            // onIndexChange={(index) => this.setState({ photoIndex: index })}
            />
        )
    }
    // 查看照片
    handleClickPreviewImg(index) {
        const { photoBack, photoTop } = this.props.detail.maintenanceLog[index];
        if (!photoBack && !photoTop) {
            Modal.error({
                content: '该设备还没有上传照片',
            });
            return;
        }
        this.setState({ visible: true, photoIndex: index });
    }
    render() {
        const { detail } = this.props;
        const filterStatus = this.statusList.filter(item => item.status === detail.productState);
        let text = '', color = '';
        if (filterStatus.length > 0) {
            const status = filterStatus[0];
            text = status.text;
            color = status.color
        }
        const { selectIndex } = this.state;
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <div className={cssStyle.header}>
                    <div className={cssStyle.headerLeft}>
                        <div className={cssStyle.title}>设备详情</div>
                        <div className={cssStyle.statusIcon} style={{ backgroundColor: color }}></div>
                        <div className={cssStyle.statusText} style={{ color }}>{text}</div>
                    </div>
                    <img className={cssStyle.closeIcon} src={closeIcon} alt="" onClick={this.handleClickClose.bind(this)} />
                </div>
                <div className={cssStyle.tabs}>
                    {
                        this.tabs.map((item, index, arr) => {
                            return (
                                <span
                                    className={`${cssStyle.tabItem} ${selectIndex === index ? cssStyle.activeTabItem : ''}`}
                                    key={index}
                                    style={{ borderRight: arr.length - 1 === index ? 0 : 'solid 1px #3cfffd' }}
                                    onClick={() => this.setState({ selectIndex: index })}
                                >
                                    {item}
                                </span>
                            )
                        })
                    }
                </div>
                <div className={cssStyle.detail}>
                    {this.getRenderDetail()}
                </div>
                {
                    selectIndex === 2 &&
                    <div className={cssStyle.imgBox} style={{ display: this.state.visible ? 'block' : 'none' }}>
                        {this.getImagePreview()}
                    </div>
                }
            </div>
        );
    }
}