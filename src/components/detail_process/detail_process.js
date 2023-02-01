import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from './detail_process.module.css';

import icon from "./images/num_bgimg.svg";
import Emitter from "../../common/eventBus";
import {Scrollbars} from "react-custom-scrollbars";

export default class DetailEvent extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { data: {}, checkReatBox: 1, showul: false, spanText: "", planList: [{name:'xxx'},{name:'xxx'},{name:'xxx'},{name:'xxx'},{name:'xxx'},{name:'xxx'}], detail: {processList:[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],fileId:'http://localhost:8080/fyDisplaySystem/file/download/1a12d5081be748f8b0bc36da2ce860c5'}, isResponse: '3' };
        this.state = { data: {}, checkReatBox: 1, showul: false, spanText: "", planList: [], detail: {processList:[]}, isResponse: '3' };
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
            case "changeKey":
                const { isResponse, id } = data.data;
                if (isResponse) {
                    this.setState({ isResponse: isResponse });
                } else {
                    if (id) {
                        this.changeSelected(id);
                    } else if (this.state.planList.length > 0) {
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

    //文字预案框盒
    getTextPlanBox(processList){
        if(processList){
            if(processList.length > 8){
                return (
                    <Scrollbars className={this.state.checkReatBox !== 2 ? cssStyle.hidden : ''}>
                        <div className={cssStyle.scrollbarsBox} style={{width:processList.length*100/8+'%'}}>
                            {this.getTextPlanList(processList)}
                        </div>
                    </Scrollbars>
                );
            }else{
                return this.getTextPlanList(processList);
            }
        }
    }

    getTextPlanList(processList){
        return (
            <ul className={`${cssStyle.textPlan} ${this.state.checkReatBox !== 2 ? cssStyle.hidden : ''}`} >
                {processList.map((textItem, index) => {
                    return (
                        <li key={index}>
                            <div className={cssStyle.indexTitle} style={{
                                backgroundImage: 'url(' + icon + ')'
                            }}>{index + 1}</div>
                            <div className={cssStyle.textContent}>{textItem.processContent}</div>
                        </li>
                    )
                })}
            </ul>
        );
    }

    render() {
        const { style } = this.props.thisData;
        const { planList, detail } = this.state;
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
                    <div className={cssStyle.managementBoxTitle} style={{ right: style.right ? style.right : '2%', top: style.top }}>
                        <label htmlFor="flowChart" onClick={this.changeBackground.bind(this, 1)} style={{marginRight:style.marginRight}}>
                            <span id="flowChart" className={cssStyle.specialSpan} style={{
                                backgroundColor: this.state.checkReatBox === 1 ? style.selectColor?style.selectColor:'#00a4ff' : '#ffffff'
                            }} />
                            <span style={{
                                color: this.state.checkReatBox === 1 ? style.selectColor?style.selectColor:'#00a4ff' : '#ffffff'
                            }}>流程图</span>
                        </label>
                        <label htmlFor="textPlan" onClick={this.changeBackground.bind(this, 2)}>
                            <span id="textPlan" className={cssStyle.specialSpan} style={{
                                backgroundColor: this.state.checkReatBox === 2 ? style.selectColor?style.selectColor:'#00a4ff' : '#ffffff'
                            }} />
                            <span style={{
                                color: this.state.checkReatBox === 2 ? style.selectColor?style.selectColor:'#00a4ff' : '#ffffff'
                            }}>文字预案</span>
                        </label>
                    </div>
                    <div className={cssStyle.managementBoxContent}>
                        {detail && detail.fileId ? <img alt='' src={detail.fileId} className={this.state.checkReatBox !== 1 ? cssStyle.hidden : ''} /> : ''}
                        {this.getTextPlanBox(detail.processList)}
                    </div>
                    <div className={cssStyle.managementBoxSelect} style={{ backgroundColor: style.bgColor }}>
                        <div className={`${cssStyle.divSelect} ${this.state.isResponse !== '3' ? cssStyle.noEdit : ''}`} style={{color:style.dropTextColor?style.dropTextColor:' #0077c1',borderColor:style.dropBoxColor,}}>
                            <div className={cssStyle.arrowDiv} onClick={this.changeDiv.bind(this)}>
                                <span>{this.state.spanText}</span>
                                <div className={cssStyle.arrowDown} style={{borderTopColor:style.triangleColor}} />
                            </div>
                            <div id="hiddenDiv" style={{
                                display: this.state.showul ? 'block' : 'none'
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
                </div>
            </ComponentBox>
        );
    }
}