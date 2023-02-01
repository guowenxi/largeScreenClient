import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./export_analysis_report.module.css";
import { Motion, spring } from "react-motion";
import Emitter from "../../common/eventBus";
import { getData } from "../../common/getDataUtil";

export default class ExportAnalysisReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: {} };
        this.getData = getData.bind(this);
        this.keyParams = {};
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

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "dataInterchange":
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                // if (data.reGetData !== 2) {
                //     this.reGetData();
                // }
                break;
            case "showComponent":
                //显示当前组件
                Emitter.emit('app_box', {
                    type: 'changeComponentShowStatus',
                    data: { showStatus: true, id: this.props.thisData.id }
                });
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.setState({ opacity: 1 });
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve();
        }
        if (result) {
            //数据结果处理
            this.setState({ resultData: result });
        }
    }

    exportList() {
        const {dataSources} = this.props.thisData
        const {dateType, searchTime,roadId,eventTypeId } = this.keyParams
        if (dataSources && dataSources.dataUrl && searchTime && dateType) {
            window.open(dataSources.dataUrl + "?rbacToken=" + this.props.token + "&dateType="+dateType + "&searchTime="+searchTime +"&roadId="+ roadId +"&eventTypeId="+eventTypeId );
        }
    }
    render() {
        // const {style} = this.props.thisData;
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box}>
                            <div className={cssStyle.exportButton} onClick={this.exportList.bind(this)}>导出分析报告</div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        )
    }
}