/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from './visitorDetailOne.module.css';

import { interactData } from "../../../common/util";

import Scrollbars from "react-custom-scrollbars";
import enterIcon from '../images/carDetailOneEnter.png';
import leaveIcon from '../images/carDetailOneLeave.png';
import { PhotoSlider } from 'react-photo-view';

export default class EquipmentDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoIndex: 0, visible: false
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
    // 图片预览
    getImagePreview() {
        let imgList = [];
        const { fileServiceUrl } = this.props.styleData;
        const { visible, photoIndex } = this.state;
        const { detail } = this.props;
        const { logList } = detail;
        if (Array.isArray(logList) && logList.length > 0) {
            imgList = logList.map(({ capturePath }) => {
                const imgs = typeof capturePath === 'string' ? capturePath.split(',') : [];
                const imgSrc = imgs.length > 0 ? imgs[0] : capturePath;
                return fileServiceUrl + imgSrc;
            });
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
                    {/*<div className={cssStyle.imgBox}>*/}
                    {/*    <img src={fileServiceUrl + detail.photo} alt="" className={cssStyle.photo} />*/}
                    {/*</div>*/}
                    <div className={cssStyle.centerContent}>
                        <div className={cssStyle.nameBox}>
                            {detail.name}
                            <span className={cssStyle.gender}>{detail.sex}</span>
                        </div>
                        <div>联系电话：{detail.phone}</div>
                        <div>定位卡：{detail.positioningCard}</div>
                    </div>
                    <span className={cssStyle.carType}>{detail.typeName}</span>
                </div>
                <span className={cssStyle.secondContent}>访问有效期：{detail.time}</span>
                <span className={cssStyle.secondContent}>身份证号：{detail.idNumber}</span>
                <div className={cssStyle.thirdContent}>
                    <span className={cssStyle.matterTitle}>访问事由：</span>
                    <span className={cssStyle.matterContent}>{detail.situation}</span>
                </div>
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
                                        onClick={() => this.setState({ photoIndex: index, visible: true })}
                                        style={{ cursor: 'pointer' }}
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