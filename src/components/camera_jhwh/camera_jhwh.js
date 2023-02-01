import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./camera_jhwh.module.css";
import { Motion, spring } from "react-motion";
import {getData} from "../../common/getDataUtil";

import CameraPlayer from "./cameraPlayer";

export default class CameraJhwh extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, url:['','',''] };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.showIndex = 0;
    }

    componentDidMount() {
        this.p = new Promise((resolve) => {
            //获取数据
            if(this.props.thisData.firstLoad){
                this.getData(this.callBack.bind(this, resolve));
            }else{
                this.callBack(resolve);
            }
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除触发函数
    componentWillUnmount() {
    }

    componentDidUpdate(prevProps){
        //组件隐藏时播放顺序复位
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus && !this.props.thisData.showStatus){
            this.showIndex = 0;
            this.setState({url:['','','']});
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "showComponent":
                //接收数据/播放监控
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                //显示当前组件
                this.changeThisShow(true);
                break;
            case "dataInterchange":
                //接收数据/播放监控
                // this.DoStartPlay(data.data.cameraId);
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity:1 });
        });
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve(result);
        }
        if (result) {
            let {url} = this.state;
            url[this.showIndex] = result;
            this.setState({url});
            this.showIndex ++;
            if(this.showIndex >= 3){
                this.showIndex = 0;
            }
        }
    }

    render() {
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)}
                          thisData={this.props.thisData}>
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{opacity}}>
                            {this.state.url.map((url,index)=>
                                <CameraPlayer key={index} className={'DHVideoPlayer'+this.props.thisData.id+'_'+index} url={url} showStatus={this.props.thisData.showStatus} />
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}