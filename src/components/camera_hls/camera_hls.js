import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./camera_hls.module.css";
import { Motion, spring } from "react-motion";
import axios from "axios";
import Hls from 'hls.js';

import one from "./images/1.svg";
import oneW from "./images/1白.svg";
import four from "./images/4.svg";
import fourW from "./images/4白.svg";
import nine from "./images/9.svg";
import nineW from "./images/9白.svg";
import closeIcon from "./images/close.svg";
// import maxIcon from "./images/Max.svg";
// import resumeIcon from "./images/Resume.svg";
import Emitter from "../../common/eventBus";
import { interactData } from "../../common/util";

export default class CameraHls extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, size: 1, isMax: false };
        this.sizeNum = [
            { size: 1, icon: one, select: oneW },
            { size: 4, icon: four, select: fourW },
            { size: 9, icon: nine, select: nineW }
        ];
        this.keyParams = {};
        this.interactData = interactData.bind(this);
    }

    componentDidMount() {
        this.p = new Promise((resolve) => {
            this.getData(resolve)
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    componentWillUnmount() {
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
                // this.DoStartPlay(data.data.cameraId);
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

    //重新获取数据
    reGetData() {
        this.getData();
    }

    // 获取数据
    getData(resolve) {
        if (this.props.thisData.dataSources.dataType === 1) {
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            } catch (e) {
            }
            if (resolve) {
                resolve(defaultData);
            } else {
                this.setState({ data: defaultData });
            }
        } else if (this.props.thisData.dataSources.dataType === 2) {
            let params = {};
            try {
                params = JSON.parse(this.props.thisData.dataSources.dataParams);
            } catch (e) {
            }
            for (let key in this.keyParams) {
                params[key] = this.keyParams[key];
            }
            axios.get(this.props.thisData.dataSources.dataUrl, { params: params }).then((response) => {
                const result = response.data.data;
                this.setState({ data: result.list });
                // if (result) {
                //     if (resolve) {
                //         resolve(result);
                //     } else {
                //         this.setState({ data: result });
                //     }
                // }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    //运行加载动画
    animateOn() {
        this.p.then((data) => {
            this.setState({ data });
            this.setState({ opacity: 1 });
            this.playVideo(1);
        });
    }

    //最大化窗格/还原窗格
    changeMax() {
        this.setState({ isMax: !this.state.isMax });
    }

    //修改尺寸布局
    changeSize(size) {
        this.setState({ size });
        this.playVideo(size);
    }

    playVideo(size) {
        let dataList = this.state.data;
        for (let i = 0; i < size; i++) {
            let video = document.getElementById(this.props.thisData.id + "_video_" + i);
            let hls = new Hls();
            let hlsSource = dataList[i] ? dataList[i].url : '';
            hls.loadSource(hlsSource);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        }
    }

    //当前组件显示隐藏
    changeThisShow(type) {
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: { showStatus: type, id: this.props.thisData.id }
        });
        this.setState({ showComponent: type });
        if (!type) {
            this.setState({ data: {} });
            const { closeInteract } = this.props.thisData.style;
            this.interactData(closeInteract);
        }
    }

    render() {
        const resultData = this.state.data;
        const { style } = this.props.thisData;
        const headHeight = this.props.getCompatibleSize(style.headHeight);
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)}
                thisData={this.props.thisData}>
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{
                            opacity,
                            backgroundColor: style.backgroundColor,
                            display: this.props.thisData.showStatus ? '' : 'none'
                        }}>
                            {headHeight && (
                                <div className={cssStyle.head} style={{ height: headHeight, fontSize: headHeight }}>
                                    {/*<img alt='' className={cssStyle.button}*/}
                                    {/*     src={this.state.isMax ? resumeIcon : maxIcon}*/}
                                    {/*     onClick={this.changeMax.bind(this)}/>*/}
                                    {this.sizeNum.map((item, index) =>
                                        <img key={index}
                                            className={`${cssStyle.button} ${this.state.size === item.size ? cssStyle.select : ''}`}
                                            onClick={this.changeSize.bind(this, item.size)} alt=''
                                            src={this.state.size === item.size ? item.select : item.icon}
                                        />
                                    )}
                                    {style.hasClose && <img alt='' src={closeIcon} className={cssStyle.button}
                                        onClick={this.changeThisShow.bind(this, false)} />}
                                </div>
                            )}
                            <div className={cssStyle.content} style={{
                                height: 'calc((100% - ' + headHeight + ')'
                            }}>
                                {resultData && resultData.map((item, index) => (
                                    <div className={cssStyle.contentItem} style={{
                                        width: 'calc(100% / ' + Math.sqrt(this.state.size) + ')',
                                        height: 'calc(100% /' + Math.sqrt(this.state.size) + ')'
                                    }} key={index}>
                                        <video id={this.props.thisData.id + "_video_" + index}></video>
                                    </div>
                                )
                                )}
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}