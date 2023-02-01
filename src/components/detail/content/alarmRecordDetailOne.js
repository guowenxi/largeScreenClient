/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from './alarmRecordDetailOne.module.css';

import { interactData } from "../../../common/util";

import Scrollbars from "react-custom-scrollbars";
import leftIcon from '../images/alarmRecordDetailOneLeft.png';
import rightIcon from '../images/alarmRecordDetailOneRight.png';

export default class AlarmRecordDetailOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
        };
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    //组件加载触发函数
    componentDidMount() {
    }
    componentDidUpdate(prveProps) {
        if (prveProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            this.setState({ selectedIndex: 0 });
        }
    }
    hasProp(props) {
        return !!props ? props : '';
    }
    // 切换选中
    handleChangeSelect(type) {
        const { selectedIndex } = this.state;
        const { detail } = this.props;
        if (type > 0) {
            if (selectedIndex < detail.length - 1) {
                this.setState({ selectedIndex: selectedIndex + 1 });
            }
        } else {
            if (selectedIndex > 0) {
                this.setState({ selectedIndex: selectedIndex - 1 });
            }
        }
    }
    render() {
        const { detail } = this.props;
        const { selectedIndex } = this.state;
        let detailProps = {};
        let length = 0;
        if (Array.isArray(detail) && detail.length > 0) {
            detailProps = detail[selectedIndex];
            length = detail.length;
        }
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <div className={cssStyle.header}>
                    <span
                        className={`${cssStyle.iconBox} ${cssStyle.leftIconBox} ${selectedIndex <= 0 ? cssStyle.cannotChange : ''}`}
                        onClick={this.handleChangeSelect.bind(this, -1)}
                    >
                        <img className={cssStyle.arrowIcon} src={leftIcon} alt="" />
                    </span>
                    <span
                        className={`${cssStyle.rightIconBox} ${selectedIndex >= length - 1 ? cssStyle.cannotChange : ''} `}
                        onClick={this.handleChangeSelect.bind(this, 1)}
                    >
                        <img className={cssStyle.arrowIcon} src={rightIcon} alt="" />
                    </span>
                </div>
                <Scrollbars style={{ flex: 1, marginTop: '1.5em' }}>
                    <div className={cssStyle.paddingBottom}>
                        处置流程：<span className={cssStyle.color}>{this.hasProp(detailProps.disponsalProcess)}</span>
                    </div>
                    <div className={cssStyle.paddingBottom}>
                        处理人：{detailProps.name} <span className={cssStyle.color}>{this.hasProp(detailProps.phone)}</span>
                    </div>
                    <div className={cssStyle.paddingBottom}>告警地址：{this.hasProp(detailProps.address)}</div>
                    <div className={`${cssStyle.paddingBottom} ${cssStyle.item}`}>
                        <span className={cssStyle.title}>处置描述：</span>
                        <span className={cssStyle.content}>{this.hasProp(detailProps.reason)}</span>
                    </div>
                    <div className={cssStyle.item}>
                        <span className={cssStyle.title}>处理结果：</span>
                        <span className={cssStyle.content}>{this.hasProp(detailProps.result)}</span>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}