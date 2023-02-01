import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_twentyNine.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import Scrollbars from "react-custom-scrollbars";
import forwardIcon from './img/1.png';
import { interactData } from "../../common/util";
import {Modal} from "antd";
import axios from "axios";

const { confirm } = Modal;

export default class NameNumTypeTwentyNine extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, dataList: [] };
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
        this.colorList = ['#039aff', '#ff961a', '#ff391f'];
        this.interactData = interactData.bind(this);
        this.themeList = ['',cssStyle.themeTwo];
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if (this.props.thisData.firstLoad) {
                this.getData(this.callBack.bind(this, resolve));
            } else {
                this.callBack(resolve);
            }
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.thisData.updateTime !== this.props.thisData.updateTime) {
            //组件数据源变更时刷新数据
            this.reGetData();
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "showComponent":
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity: 1 });
        })
    }

    //重新获取数据
    reGetData() {
        this.setState({ resultData: [] });
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve(result);
        }
        if (result) {
            this.setState({ dataList: result });
        }
    }
    // 求最大值
    getMax() {
        const { dataList } = this.state;
        const targetNums = dataList.map(item => item.greenStart);
        const valueNums = dataList.map(item => item.value);
        return targetNums.concat(valueNums).reduce((prev, next) => Math.max(prev, next));
    }
    // 点击交互
    handleClickInteract(item) {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }

    turnTo(department,id,hasTurnTo,e){
        e.stopPropagation();
        const {turnToUrl} = this.props.thisData.style;
        if(turnToUrl && !hasTurnTo){
            confirm({
                title: '是否确认通知'+department+'?',
                content: '',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    return new Promise((resolve) => {
                        const sendData = {
                            rbacToken: this.props.token,
                            id: id
                        };
                        axios.post(turnToUrl, sendData).then((response) => {
                            resolve();
                            if (response.data.success) {
                                Modal.success({
                                    content: '已通知。',
                                });
                                this.reGetData();
                            } else {
                                Modal.error({
                                    content: response.data.message,
                                });
                            }
                        }).catch(function (error) {
                            resolve();
                            Modal.error({
                                content: '通知操作失败。',
                            });
                        });
                    }).catch(() => console.log('Oops errors!'));
                },
                onCancel: () => { },
            });
        }
    }

    downloadDetail(id,event){
        event.stopPropagation();
        const { style } = this.props.thisData;
        const downloadUrl = style.downloadUrl+'?id='+id+'&rbacToken='+this.props.token;
        if(style.theme === 1){
            this.setState({downloadUrl},()=>{
                document.getElementById('downloadUrl'+this.props.thisData.id).select();
                document.execCommand("Copy");
                Modal.info({
                    content: '已复制下载地址，请打开浏览器粘贴下载。',
                })
            });
        }else{
            window.open(downloadUrl);
        }
    }

    render() {
        // eslint-disable-next-line no-unused-vars
        const { dataList } = this.state;
        const { style } = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const max = dataList.length > 0 ? this.getMax() : 1;
        return (
            <ComponentBox
                style={{ ...this.props.style, overflow: 'hidden' }}
                receiveMessage={this.receiveMessage.bind(this)}
                reGetData={this.reGetData.bind(this)}
                thisData={this.props.thisData}
            >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={`${cssStyle.container} ${this.themeList[style.theme]}`} style={{ opacity, fontSize: fontSize }} >
                            <Scrollbars style={{ width: '100%', height: '100%' }} className={'Scrollbars'}>
                                {
                                    dataList.length > 0 &&
                                    dataList.map(({ name, department, status, greenStart, value, valueMax, color, valueType, id, pnType, hasTurnTo, isFile }, index, arr) => {
                                        const { maxValueKey } = this.props.thisData.style;
                                        const realMax = valueMax || arr[index][maxValueKey] || max;
                                        const spanList = [{ className: cssStyle.barBg, value: '', style: { width: `${greenStart / realMax * 100}%` } }, { className: cssStyle.barContent, style: { width: `${value / realMax * 100}%`, backgroundColor: this.colorList[color - 1] }, value: '' }, { className: cssStyle.barIcon, style: { left: `calc(${greenStart / realMax * 100}% - 0.4em)` }, value: '' }, { className: cssStyle.greenStart, style: { left: `calc(${greenStart / realMax * 100}% - 1em)` }, value: greenStart + (valueType === 1 ? '' : '%') }, { className: cssStyle.value, style: { left: `calc(${value / realMax * 100}% - 1em)` }, value: value + (valueType === 1 ? '' : '%') }];
                                        return (
                                            <div
                                                className={cssStyle.itemBox}
                                                key={index+'_'+id}
                                                style={{ height: `calc(${100 / (style.theme === 1 ? 4:6)}% - 0.4em)` }}
                                                onClick={this.handleClickInteract.bind(this, arr[index])}
                                            >
                                                <div className={cssStyle.name}>
                                                    <span title={name}>{name}</span>
                                                    {pnType === 2 && style.theme === 1 && <span className={cssStyle.reverseDirectionTwo}>反向指标</span>}
                                                    {!!isFile && style.theme === 1 && <span className={cssStyle.downloadTwo} onClick={this.downloadDetail.bind(this,id)}>下载详情</span>}
                                                </div>
                                                <div className={cssStyle.bar}>
                                                    {
                                                        spanList.map(({ className, value, style }, index) => {
                                                            return <span className={className} style={style} key={index}>{value}</span>
                                                        })
                                                    }
                                                </div>
                                                <span className={cssStyle.department} onClick={this.turnTo.bind(this,department,id,hasTurnTo)}>{department}</span>
                                                {
                                                    status === 1 && <img src={forwardIcon} alt="" className={cssStyle.forwardIcon} />
                                                }
                                                {
                                                    pnType === 2 && style.theme !== 1 && <span className={cssStyle.reverseDirection}>反向指标</span>
                                                }
                                                {!!hasTurnTo && <div className={cssStyle.turnToMessage}>已通知</div>}
                                                {!!isFile && style.theme !== 1 && <div className={cssStyle.download} onClick={this.downloadDetail.bind(this,id)}>下载详情</div>}
                                            </div>
                                        )
                                    })
                                }
                            </Scrollbars>
                            <textarea style={{width:0,height:0,position:'absolute',opacity:0}} id={'downloadUrl'+this.props.thisData.id} value={this.state.downloadUrl} readOnly={true}/>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}