/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from './peopleDetailOne.module.css';

import { interactData } from "../../../common/util";

import Scrollbars from "react-custom-scrollbars";
import enterIcon from '../images/carDetailOneEnter.png';
import leaveIcon from '../images/carDetailOneLeave.png';
import leftIcon from '../images/peopleDetailOneLeft.png';
import rightIcon from '../images/peopleDetailOneRight.png';

import { PhotoSlider } from 'react-photo-view';

export default class PeopleDetailOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tranlateX: 0, index: 0, visible: false, previewType: 0, photoIndex: 0
        };
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
    // 获取证书渲染列表
    getCertificates(list) {
        const { listBox, listItem } = this;
        const { index } = this.state;
        const width = listBox ? listBox.offsetWidth : 0;
        const singleWidth = listItem ? listItem.offsetWidth : 0;
        const { fileServiceUrl } = this.props.styleData;
        return (
            <div className={cssStyle.listBox}>
                <div style={{ opacity: index <= -(list.length - 6) ? 0.6 : 1 }}>
                    <img src={leftIcon} alt="" className={cssStyle.arrowIcon} onClick={this.handleChangeImage.bind(this, -1, list.length)} />
                </div>
                <div className={cssStyle.listImgBox} ref={el => this.listBox = el}>
                    <div className={cssStyle.innerBox} style={{ transform: `translateX(${singleWidth * index}px)` }}>
                        {
                            list.map((item, index) => {
                                return (
                                    <img
                                        ref={el => this.listItem = el}
                                        src={fileServiceUrl + item}
                                        alt=""
                                        key={index}
                                        className={cssStyle.listItem}
                                        style={{ width: width / 6 + 'px', left: (width / 6) * index + 'px', cursor: 'pointer' }}
                                        onClick={() => this.setState({ visible: true, photoIndex: index, previewType: 2 })}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                <div style={{ opacity: index >= 0 ? 0.6 : 1 }}>
                    <img src={rightIcon} alt="" className={cssStyle.arrowIcon} onClick={this.handleChangeImage.bind(this, 1, list.length)} />
                </div>
            </div>
        )
    }
    // 切换图片
    handleChangeImage(direction, length) {
        const { index } = this.state;
        if (direction < 0) {
            if (index > -(length - 6)) {
                this.setState({ index: index - 1 });
            }
        } else if (direction > 0) {
            if (index < 0) {
                this.setState({ index: index + 1 })
            }
        }
    }
    // 图片预览
    getImagePreview() {
        let imgList = [];
        const { fileServiceUrl } = this.props.styleData;
        const { visible, previewType, photoIndex } = this.state;
        const { detail } = this.props;
        if (previewType === 1) {
            imgList = detail.logList.map(({capturePath}) => {
                const imgs = typeof capturePath === 'string' ? capturePath.split(',') : [];
                const imgSrc = imgs.length > 0 ? imgs[0] : capturePath;
                return fileServiceUrl + imgSrc;
            });
        } else if (previewType === 2) {
            imgList = detail.certificate.map(item => fileServiceUrl + item);
        }
        return (
            <PhotoSlider
                images={imgList.map((item) => ({ src: item }))}
                visible={visible}
                onClose={() => this.setState({ visible: false })}
                onIndexChange={(index) => this.setState({ photoIndex: index })}
                index={photoIndex}
            />
        )
    }
    render() {
        const { detail } = this.props;
        const { fileServiceUrl } = this.props.styleData;
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <div className={cssStyle.firstContent}>
                    <div className={cssStyle.imgBox}>
                        <img
                            src={fileServiceUrl + detail.photo}
                            alt=""
                            className={cssStyle.photo}
                        />
                    </div>
                    <div className={cssStyle.centerContent}>
                        <div className={cssStyle.nameBox}>
                            {detail.name}
                            <span className={cssStyle.gender}>{detail.sex}</span>
                        </div>
                        <div>联系电话：{detail.phone}</div>
                        <div>定位卡：{detail.positioningCard}</div>
                    </div>
                    <span className={cssStyle.carType}>{detail.typeName}</span>
                    {detail.departmentName && <span className={cssStyle.departmentName}>{detail.departmentName}</span>}
                </div>
                <span className={cssStyle.secondContent}>访问有效期：{detail.time}</span>
                <span className={cssStyle.secondContent}>身份证号：{detail.idNumber}</span>
                {Array.isArray(detail.certificate) && this.getCertificates(detail.certificate)}
                <Scrollbars style={{ flex: 1 }}>
                    {
                        Array.isArray(detail.logList) &&
                        detail.logList.map(({ action, time, capturePath }, index, arr) => {
                            const imgs = typeof capturePath === 'string' ? capturePath.split(',') : [];
                            const imgSrc = imgs.length > 0 ? imgs[0] : capturePath;
                            return (
                                <div key={index} className={cssStyle.recordItem} style={{ marginBottom: arr.length - 1 === index ? 0 : '0.5em' }}>
                                    <img src={action === 1 ? enterIcon : leaveIcon} alt="" className={cssStyle.recordIcon} />
                                    <span className={cssStyle.recordStatus}>{action === 1 ? '进入' : '离开'}</span>
                                    <span className={cssStyle.recordTime}>{time}</span>
                                    <img
                                        src={fileServiceUrl + imgSrc}
                                        alt=""
                                        className={cssStyle.recordPhoto}
                                        onClick={() => this.setState({ visible: true, previewType: 1, photoIndex: index })}
                                        style={{cursor: 'pointer'}}
                                    />
                                </div>
                            )
                        })
                    }
                </Scrollbars>
                {this.state.visible && this.getImagePreview()}
            </div>
        );
    }
}