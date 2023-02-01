/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import cssStyle from "./equipmentVideoListNew.module.css";
import { Button, Icon, Modal } from "antd";
import { interactData } from "../../../common/util";
import qs from "qs";
import axios from "axios";
import { Scrollbars } from "react-custom-scrollbars";
import FlvJs from "flv.js";
import { emergencyUrl } from "../../../config";

const { confirm } = Modal;

export default class EquipmentVideoListNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showId: '', selectedItem: {}, showType: 1, selectedIdList: [], clickWinIndex: 0 };
        this.interactData = interactData.bind(this);
        this._cf = {
            ver: 'debug',
            q2http_url: 'http://ytly.yueqing.gov.cn:9585/icvs2/',// 连接icvs平台地址,如果是https协议,地址为'https://ip:port/icvs2/',ip为视频转码服务部署所在服务器的ip地址,port为q2http转码服务端口
            websocket_url: 'ws://ytly.yueqing.gov.cn:9585/wss',// websocket地址,如果是https协议,地址为'wss://ip:sslPort/wss',ip为视频转码服务部署所在服务器的ip地址,sslPort为SSL协议的监听端口，如果是http协议，sslPort和q2http_url使用ip和端口一致
            // - 配置登录参数
            connParams: {
                // - 登录平台IP
                address: "ytly.yueqing.gov.cn",
                port: "9988",
                // - 登录平台用户名
                user: "admin",
                // - 登录平台密码
                password: "",
                // - 登录平台企业ID
                epid: "system",
                // - 登录平台是否通过网闸模式
                bfix: 1
            }
        };
        this.bodyId = global.editType ? 'canvas-view' : 'root';
        this.videoIdx = {};
        this.singlePlayer = null;
        this.playerList = [];
    }

    //组件删除时触发函数
    componentWillUnmount() {
        this.destroyVideo(this, 'singlePlayer');
        this.playerList.forEach((player, index) => {
            this.destroyVideo(this.playerList, index);
        });
    }

    //组件加载触发函数
    componentDidMount() {
        this.login();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.getDataTime !== this.props.getDataTime && this.token) {
            //数据变更时列表内若没之前选中的监控则默认选中第一个
            const { detail } = this.props;
            const list = detail ? detail.data : [];
            if (list && list.length > 0) {
                const { showId } = this.state;
                let hasFind = false;
                for (let i = 0; i < list.length; i++) {
                    if (showId === list[i].id) {
                        hasFind = true;
                        break;
                    }
                }
                if (!hasFind) {
                    this.changeSingleShow(list[0]);
                }
            } else {
                this.destroyVideo(this, 'singlePlayer');
                this.playerList.forEach((player, index) => {
                    this.destroyVideo(this.playerList, index);
                });
                this.setState({ showId: '', selectedItem: {}, showType: 1, selectedIdList: [], clickWinIndex: 0 });
            }
        }
    }

    login() {
        const params = {
            "address": this._cf.connParams.address,
            "port": this._cf.connParams.port,
            "user": this._cf.connParams.user,
            "password": this._cf.connParams.password,
            "epid": this._cf.connParams.epid,
            "fixaddr": this._cf.connParams.bfix
        };
        axios.post(this._cf.q2http_url + 'login', qs.stringify(params)).then((response) => {
            if (response.data.token) {
                this.token = response.data.token;
            } else {
                Modal.error({
                    content: response.data.msg,
                });
            }
        }).catch((error) => {
            Modal.error({
                content: '单兵服务登录请求出错！',
            });
        });
        // this.token = 'a5ngAyO_12wz4D4v4l4qffr2ehT7P4Cg';
    }

    //关闭列表
    closeVideo() {
        this.props.changeThisShow(false);
        // this.destroyVideo(this,'singlePlayer');
        // this.playerList.forEach((player,index)=>{
        //     this.destroyVideo(this.playerList,index);
        // });
        // this.setState({showId:'',selectedItem:{},showType:1,selectedIdList:[],clickWinIndex:0});
    }

    //切换单窗口内单兵视频
    changeSingleShow(item) {
        if (this.state.showId !== item.id) {
            this.setState({ selectedItem: item, showId: item.id });
            this.getVideoIdx(item);
        }
    }

    getVideoIdx(item) {
        axios.get(this._cf.q2http_url + 'CAS/C_CAS_QueryPUIDRes', { params: { token: this.token, puid: item.epid } }).then((response) => {
            if (response.data.Res && response.data.Res.length > 0) {
                const { Res } = response.data;
                for (let i = 0; i < Res.length; i++) {
                    if (Res[i].Type === 'IV') {
                        this.videoIdx[item.epid] = Res[i].Idx;
                        break;
                    }
                }
                if (this.videoIdx[item.epid]) {
                    this.playVideo(item);
                } else {
                    Modal.error({
                        content: '该单兵设备无可播放视频！',
                    });
                }
            } else {
                Modal.error({
                    content: '该单兵设备无可播放视频！',
                });
            }
        }).catch((error) => {
            Modal.error({
                content: '获取单兵播放列表请求出错！',
            });
        });
    }

    playVideo(item) {
        const { showType, clickWinIndex, selectedIdList } = this.state;
        if (showType === 2) {
            const lastIndex = selectedIdList.indexOf(item.id);
            if (lastIndex >= 0) {
                this.setState({ clickWinIndex: lastIndex });
                return;
            }
        }
        let url = this._cf.q2http_url + "stream.flv?puid=" + item.epid + "&idx=" + this.videoIdx[item.epid] + "&stream=0&token=" + this.token;
        const player = FlvJs.createPlayer({
            type: 'flv',
            url: url,
            isLive: true,
            hasAudio: false
        }, {
            enableWorker: false,
            autoCleanupSourceBuffer: true, //清理缓冲区
            enableStashBuffer: false,
            stashInitialSize: 128, // 减少首桢显示等待时长
            statisticsInfoReportInterval: 600
        });
        let domId = "video" + this.props.thisData.id;
        if (showType === 2) {
            domId = "video_" + clickWinIndex + "_" + this.props.thisData.id;
            this.destroyVideo(this.playerList, clickWinIndex);
            this.playerList[clickWinIndex] = player;
            selectedIdList[clickWinIndex] = item.id;
            this.setState({ selectedIdList });
            this.changeNextIndex();
        } else {
            this.destroyVideo(this, 'singlePlayer');
            this.singlePlayer = player;
        }
        const videoElement = document.getElementById(domId ? domId : "video" + this.props.thisData.id);
        videoElement.controls = false;
        player.attachMediaElement(videoElement);
        player.load();
        setTimeout(() => {
            player.play();
        }, 100);
    }

    //切换到空余窗口
    changeNextIndex() {
        let index;
        for (let i = 0; i < 4; i++) {
            if (this.playerList[i] == null) {
                index = i;
                break;
            }
        }
        if (index != null) {
            this.setState({ clickWinIndex: index });
        }
    }

    destroyVideo(player, key) {
        if (player[key]) {
            player[key].unload();
            player[key].detachMediaElement();
            player[key].destroy();
            player[key] = null;
        }
    }

    //切换显示模式
    changeShowType() {
        if (this.state.showType === 1) {
            //切到全屏
            this.setState({ showType: 2 });
            //若无播放中监控则默认打开单监控模式下选中监控
            const { showId, selectedItem, selectedIdList } = this.state;
            if (showId) {
                const lastIndex = selectedIdList.indexOf(showId);
                if (lastIndex < 0) {
                    this.getVideoIdx(selectedItem);
                }
            }
        } else {
            this.setState({ showType: 1 });
        }
        // this.setState({showType:this.state.showType === 1 ? 2 : 1});
    }

    //点击一切换播放窗口
    videoClick(index) {
        this.setState({ clickWinIndex: index });
    }

    //多窗口内播放监控
    changeVideoShow(item) {
        this.getVideoIdx(item);
    }

    //结束指派
    endDesignate() {
        confirm({
            title: '确定要结束该人员的任务吗？',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                const sendData = {
                    rbacToken: this.props.token,
                    emergencyId: this.props.keyParams.emergencyId,
                    equipmentId: this.state.selectedItem.id,
                    excuteType: 3,
                    content: ''
                };
                return new Promise((resolve) => {
                    axios.post(emergencyUrl + "/socialGovernance/equipment/anwser", sendData, { params: { rbacToken: this.props.token } }).then((response) => {
                        resolve();
                        if (response.data.success) {
                            Modal.success({
                                content: '已结束任务',
                            });
                            this.props.changeKeyParams({});
                        } else {
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch((error) => {
                        resolve();
                        Modal.error({
                            content: '结束任务请求出错！',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel: () => { },
        });
    }

    bigContent() {
        const { showType, selectedIdList, clickWinIndex } = this.state;
        const { detail } = this.props;
        const list = detail ? detail.data : [];
        return ReactDOM.createPortal(
            (
                <div className={`${cssStyle.bigContentBox} ${showType === 1 || !this.props.thisData.showStatus ? cssStyle.hide : ''}`} >
                    <div className={cssStyle.titleBox}>
                        <div className={cssStyle.title}>正在进行的视频流</div>
                        {/*<Icon type="close" onClick={this.closeVideo.bind(this)} className={cssStyle.closeIcon} />*/}
                    </div>
                    <div className={cssStyle.menuBox}>
                        <Scrollbars style={{ width: 'calc(100% - 10em)' }}>
                            <div className={cssStyle.menuListBox}>
                                {list && list.map((item, index) =>
                                    <div key={index} className={`${cssStyle.menuItem} ${selectedIdList.indexOf(item.id) >= 0 ? cssStyle.selectedMenu : ''}`} onClick={this.changeVideoShow.bind(this, item)}>{item.name}</div>
                                )}
                            </div>
                        </Scrollbars>
                        <Button className={cssStyle.showAllButton} type="primary" onClick={this.changeShowType.bind(this)} >退出全屏</Button>
                    </div>
                    <div className={cssStyle.videoListBox}>
                        <video id={"video_0_" + this.props.thisData.id} className={`${cssStyle.videoItem} ${clickWinIndex === 0 ? cssStyle.selectedItem : ''}`} onClick={this.videoClick.bind(this, 0)} />
                        <video id={"video_1_" + this.props.thisData.id} className={`${cssStyle.videoItem} ${clickWinIndex === 1 ? cssStyle.selectedItem : ''}`} onClick={this.videoClick.bind(this, 1)} />
                        <video id={"video_2_" + this.props.thisData.id} className={`${cssStyle.videoItem} ${clickWinIndex === 2 ? cssStyle.selectedItem : ''}`} onClick={this.videoClick.bind(this, 2)} />
                        <video id={"video_3_" + this.props.thisData.id} className={`${cssStyle.videoItem} ${clickWinIndex === 3 ? cssStyle.selectedItem : ''}`} onClick={this.videoClick.bind(this, 3)} />
                    </div>
                </div>
            ),
            document.getElementById(this.bodyId)
        );
    }

    handleClickClose() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {})
    }
    render() {
        const { showId, selectedItem } = this.state;
        const { detail } = this.props;
        const list = detail ? detail.data : [];
        return (
            <div style={{ ...this.props.style, }} className={cssStyle.container}>
                <div className={cssStyle.top}>
                    <span className={cssStyle.title}>正在进行的视频流</span>
                    <span className={cssStyle.closeIcon} onClick={this.handleClickClose.bind(this)}></span>
                </div>
                <div className={cssStyle.menuBox}>
                    <Scrollbars style={{ width: 'calc(100% - 10em)' }}>
                        <div className={cssStyle.menuListBox}>
                            {list && list.map((item, index) =>
                                <div key={index} className={`${cssStyle.menuItem} ${showId === item.id ? cssStyle.selectedMenu : ''}`} onClick={this.changeSingleShow.bind(this, item)}>{item.name}</div>
                            )}
                        </div>
                    </Scrollbars>
                    <Button className={cssStyle.showAllButton} type="primary" onClick={this.changeShowType.bind(this)} >全屏显示</Button>
                </div>
                <div className={cssStyle.contentBox}>
                    <video id={"video" + this.props.thisData.id} className={cssStyle.video} />
                </div>
                <div className={cssStyle.footBox}>
                    <div className={cssStyle.detailBox}>
                        <div>设备名称：{selectedItem.name}</div>
                        <div>操作员：{selectedItem.operaterName}</div>
                        <div>联系方式：{selectedItem.phone}</div>
                    </div>
                    {showId && <Button className={cssStyle.endButton} type="danger" onClick={this.endDesignate.bind(this)} >结束指派</Button>}
                </div>
                {this.bigContent()}
            </div>
        );
    }
}