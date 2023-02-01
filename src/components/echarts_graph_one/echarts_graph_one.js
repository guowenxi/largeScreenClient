import React from "react";
import ComponentBox from "../component_box";
import {getData} from "../../common/getDataUtil";
import {changeComponentShow, interactData} from "../../common/util";
import {Motion, spring} from "react-motion";
import Graph from "./graph";

export default class ArcGisMapTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {},opacity:0,resultData:[],dataTime:0 };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.changeComponentShow = changeComponentShow.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if(this.props.thisData.firstLoad){
                this.getData(this.callBack.bind(this, resolve))
            }else{
                this.callBack(resolve);
            }
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //props变更时触发函数
    // componentDidUpdate(prevProps){
    //     if(this.props.thisData.showStatus !== prevProps.thisData.showStatus && this.props.thisData.showStatus && !this.hasLoadMap){
    //     }
    // }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity:1 });
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "dataInterchange":
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                if(data.reGetData !== 2){
                    this.reGetData();
                }
                break;
            case "deleteKey":
                this.keyParams = {};
                this.reGetData();
                break;
            case "showComponent":
                //显示当前组件
                this.changeComponentShow(true);
                break;
            case "hideComponent":
                //隐藏当前组件
                this.changeComponentShow(false);
                break;
            case "reFresh":
                //刷新数据
                this.reGetData();
                break;
            case "changeSelected":
                //切换选中
                break;
            default:
                break;
        }
    }

    //获取数据后回调
    callBack(resolve,result) {
        if(resolve){
            resolve();
        }
        if (result) {
            let resultData;
            if(typeof(result) === 'string'){
                try {
                    resultData = JSON.parse(result);
                }catch (e) {
                    resultData = [];
                }
            }else{
                resultData = result;
            }
            this.setState({resultData:resultData,dataTime:(new Date()).getTime()});
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    rowClick(item){
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }

    render() {
        const {style} = this.props.thisData;
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) => {
                        return (
                            <div
                                style={{ width: '100%', height: '100%', position: 'absolute',opacity }}
                            >
                                {this.state.resultData.length > 0 && <Graph interactData={this.rowClick.bind(this)} contentType={style.contentType} showLevel={this.props.thisData.style.showLevel} dataTime={this.state.dataTime} engineData={JSON.stringify(this.state.resultData)} engineid={'graph_'+this.props.thisData.id} />}
                            </div>
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}