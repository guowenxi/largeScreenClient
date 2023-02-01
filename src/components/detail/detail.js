import React from "react";
import ComponentBox from "../component_box";
import { Motion, spring } from "react-motion";
import Emitter from "../../common/eventBus";
import { getData } from "../../common/getDataUtil";
import "../../common/css/antdTimeline.css";
import { getCompatibleSize, interactData } from "../../common/util";


export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {}, showComponent: false, opacity: 0, loading: false };
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.keyTime = (new Date()).getTime();
        this.keyParams = {};
        this.interactParams = {};
        this.contentList = ['peopleTwoPartOne', 'peopleTwoPartTwo', 'peopleTwoPartThree', 'peopleTwoPartFour'];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        try {
            this.keyParams = JSON.parse(this.props.thisData.dataSources.dataParams);
        } catch (e) { }
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

    //挂载数据到页面显示
    animateOn() {
        // this.reGetData();
        this.p.then((data) => {
            this.setState({ opacity: 1 });
        });
        // this.getData();
        // this.changeThisShow(true);
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "changeKey":
                this.changeKeyTime = (new Date()).getTime();
                // console.log({data});
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                    // this.keyTime = (new Date()).getTime();
                }
                if(data.reGetData !== 2){
                    this.reGetData();
                }
                break;
            case "showComponent":
            case "dataInterchange":
                if (data.type === 'dataInterchange' && data.data.actionType !== 'changeKey') {
                    let stateData = this.state.data;
                    for (let key in data.data) {
                        stateData[key] = data.data[key];
                    }
                    this.setState({ data: stateData });
                    break;
                } else {
                    delete data.data.actionType;
                }
                //修改请求条件
                let hasKey = false;
                for (let key in data.data) {
                    // this.keyTime = (new Date()).getTime();
                    this.keyParams[key] = data.data[key];
                    hasKey = true;
                }
                if (hasKey) {
                    this.reGetData();
                }
                if (data.type === 'showComponent') {
                    this.changeThisShow(true);
                }
                break;
            case 'messageSend':
                for (let key in data.data) {
                    this.interactParams[key] = data.data[key];
                }
                break;
            case 'reFresh':
                this.reGetData();
                break;
            case 'clearData':
                this.setState({ data : data.data && data.data.default ? data.data.default : {} });
                break;
            case "changeFreshMode":
                //切换数据定时刷新模式
                if(data.data){
                    this.freshMode = data.data;
                }
                break;
            default:
                break;
        }
    }

    changeKeyParams(data) {
        for (let key in data) {
            this.keyParams[key] = data[key];
        }
        this.reGetData();
    }

    //重新获取数据
    reGetData() {
        this.setState({ loading: true });
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        this.setState({ loading: false });
        if (resolve) {
            resolve(result);
        }
        if (result) {
            this.getDataTime = new Date().getTime();
            this.setState({ data: result });
        } else {
            const { contentName } = this.props.thisData.style;
            if (this.contentList.includes(contentName)) {
                this.setState({ data: {} });
            }
        }
    }

    //当前组件显示隐藏
    changeThisShow(type, notClear) {
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: { showStatus: type, id: this.props.thisData.id }
        });
        this.setState({ showComponent: type });
        if (!type) {
            if (!notClear) {
                this.setState({ data: {} });
            }
            const { closeInteract } = this.props.thisData.style;
            this.interactData(closeInteract);
        }
    }

    clearData(data){
        this.setState({data:data?data:{}});
    }

    render() {
        const detail = this.state.data ? this.state.data  : {};
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const border = { borderStyle: style.borderStyle, borderWidth: style.borderWidth, borderColor: style.borderColor, borderRadius: style.borderRadius };
        if (style.contentName) {
            try {
                let DetailContent = require(`./content/${style.contentName}`).default;
                return (
                    <ComponentBox
                        id={this.props.thisData.id}
                        thisData={this.props.thisData}
                        receiveMessage={this.receiveMessage.bind(this)}
                        reGetData={this.reGetData.bind(this)}
                        style={this.props.style}
                    >
                        <Motion style={{ top: spring(this.props.thisData.showStatus ? 0 : 100), opacity: spring(this.state.opacity) }}>
                            {({ top, opacity }) => {
                                return (
                                    <DetailContent
                                        key={detail.id ? detail.id : this.keyTime}
                                        detail={detail}
                                        style={{ top: (style.formTop ? -top : 0) + '%', fontSize, opacity, ...border }}
                                        styleData={style}
                                        changeThisShow={this.changeThisShow.bind(this)}
                                        thisData={this.props.thisData}
                                        getDataTime={this.getDataTime}
                                        token={this.props.token}
                                        keyParams={this.keyParams}
                                        changeKeyParams={this.changeKeyParams.bind(this)}
                                        loading={this.state.loading}
                                        changeKeyTime={this.changeKeyTime}
                                        clearData={this.clearData.bind(this)}
                                        showStatus={this.props.thisData.showStatus}
                                    />
                                )
                            }}
                        </Motion>
                    </ComponentBox>
                )
            } catch (e) {
                return '';
            }
        } else {
            return '';
        }
    }
}