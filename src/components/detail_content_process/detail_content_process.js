import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from './detail_content_process.module.css';
import ContentOcx from "./content_ocx";
import Emitter from "../../common/eventBus";

import { getCompatibleSize } from "../../common/util";

export default class DetailContentEvent extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { data: {}, checkReatBox: 1, showul: false, spanText: "", planList: list, detail: detail, isResponse: '3', showBox: false };
        this.state = { data: {}, checkReatBox: 1, showul: false, spanText: "", planList: [], detail: {}, isResponse: '3', showBox: false };
        this.keyParams = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
        this.getData();
    }

    //挂载数据到页面显示
    animateOn() {
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "dataInterchange":
            case "changeKey":
                const { isResponse, id } = data.data;
                this.setState({ showBox: false });
                if (isResponse) {
                    this.setState({ isResponse: isResponse });
                } else {
                    if (id) {
                        this.changeSelected(id);
                    } else if (this.state.planList&&this.state.planList.length > 0) {
                        this.changeText(this.state.planList[0]);
                    }
                }
                // this.setState({eventPlanId:data.data.id});
                // this.changeOtherShow();
                break;
            case "animateOn":
                this.animateOn();
                break;
            default:
                break;
        }
    }

    //重新获取数据
    reGetData() {
        this.getData();
    }

    // 获取数据
    getData() {
        const { style } = this.props.thisData;
        if (style.listUrl) {
            axios.get(style.listUrl).then((response) => {
                const result = response.data.data;
                this.setState({ planList: result.list });
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    changeBackground(number) {
        this.setState({ checkReatBox: number });
        if (this.state.checkReatBox === number && this.state.showBox === true) {
            this.setState({ showBox: false });
        } else {
            this.setState({ showBox: true });
        }
    }

    changeDiv() {
        if (this.state.isResponse === '3') {
            this.setState({ showul: !this.state.showul });
        }
    };

    //点击选择预案
    changeText(item) {
        this.setState({ showul: false, spanText: item.name });
        const { style } = this.props.thisData;
        if (style.detailUrl) {
            axios.get(style.detailUrl, { params: { planId: item.id } }).then((response) => {
                const result = response.data.data;
                this.setState({ detail: result });
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
        //发送预案id给一键响应组件
        const { interact } = this.props.thisData.dataSources;
        interact && interact.forEach((interactItem) => {
            let sendData = {};
            sendData[interactItem.keyName] = item.id;
            Emitter.emit(interactItem.receiveId, { type: 'dataInterchange', data: sendData });
        });
    }

    //选中对应预案
    changeSelected(planId) {
        const { planList } = this.state;
        let hasFind = false;
        for (let i = 0; i < planList.length; i++) {
            if (planList[i].id === planId) {
                this.changeText(planList[i]);
                hasFind = true;
                break;
            }
        }
        if (hasFind === false && this.state.planList.length > 0) {
            //若未找到对应预案则选中第一个
            this.changeText(this.state.planList[0]);
        }
    }

    render() {
        const { style } = this.props.thisData;
        const { planList, detail } = this.state;
        const selectHeight = getCompatibleSize(style.height);
        const oneVh=getCompatibleSize('1vh');
        const arrowDownStyle = {
            margin: 0,
            borderTop: oneVh + ' solid #0077c1',
            borderRight: oneVh + ' solid transparent',
            borderLeft: oneVh + ' solid transparent',
        };
        const managementBoxTitleFontSize=getCompatibleSize(style.selectFontSize ? style.selectFontSize:'2vh');
        const twoVh=getCompatibleSize('2vh');
        return (
            <ComponentBox
                id={this.props.thisData.id}
                thisData={this.props.thisData}
                receiveMessage={this.receiveMessage.bind(this)}
                reGetData={this.reGetData.bind(this)}
                style={this.props.style}
            >
                <div style={{
                    height: '100%',
                    backgroundColor: style.bgColor
                }}>
                    <div className={cssStyle.managementBoxTitle} style={{fontSize:managementBoxTitleFontSize}}>
                        <label htmlFor="flowChart" onClick={this.changeBackground.bind(this, 1)}>
                            <span id="flowChart" className={cssStyle.specialSpan} style={{
                                backgroundColor: this.state.checkReatBox === 1&&this.state.showBox ? '#00a4ff' : '#ffffff'
                            }} />
                            <span style={{
                                color: this.state.showBox&&this.state.checkReatBox === 1 ? '#00a4ff' : '#ffffff'
                            }}>流程图</span>
                        </label>
                        <label htmlFor="textPlan" onClick={this.changeBackground.bind(this, 2)}>
                            <span id="textPlan" className={cssStyle.specialSpan} style={{
                                backgroundColor: this.state.checkReatBox === 2&&this.state.showBox ? '#00a4ff' : '#ffffff'
                            }} />
                            <span style={{
                                color: this.state.showBox&&this.state.checkReatBox === 2 ? '#00a4ff' : '#ffffff'
                            }}>文字预案</span>
                        </label>
                    </div>
                    <div className={cssStyle.managementBoxSelect} style={{ backgroundColor: style.bgColor,fontSize:twoVh }}>
                        <div className={`${cssStyle.divSelect} ${this.state.isResponse !== '3' ? cssStyle.noEdit : ''}`} style={{ width: style.width, height: selectHeight }}>
                            <div className={cssStyle.arrowDiv} onClick={this.changeDiv.bind(this)}>
                                <span>{this.state.spanText}</span>
                                <div className={cssStyle.arrowDown} style={arrowDownStyle} />
                            </div>
                            <div id="hiddenDiv" style={{
                                display: this.state.showul ? 'block' : 'none',
                                background:style.contentColor
                            }}>
                                <ul>
                                    {planList && planList.length > 0 ? planList.map((item, index) => {
                                        return (
                                            <li key={index}
                                                onClick={this.changeText.bind(this, item, index)}>{item.name}</li>
                                        )
                                    }) : ''}

                                </ul>
                            </div>
                        </div>
                    </div>
                    <ContentOcx detail={detail} cssStyle={cssStyle} showBox={this.state.showBox} style={style} text={this.state.spanText} number={this.state.checkReatBox}></ContentOcx>
                </div>
            </ComponentBox>
        );
    }
}