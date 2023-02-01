import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./camera_jhwh_list.module.css";
import { Motion, spring } from "react-motion";
import {getData} from "../../common/getDataUtil";
import {getCompatibleSize} from "../../common/util";
import {Scrollbars} from "react-custom-scrollbars";
import axios from "axios";


export default class CameraJhwh extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData:[] };
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
        this.destroyCamera();
    }

    componentDidUpdate(prevProps){
        //组件隐藏时播放顺序复位
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus){
            if(this.props.thisData.showStatus){
                if(this.hasStartInit){
                    if(this.oVideoControl && this.hasInit){
                        this.oVideoControl.event.show();
                    }
                }else{
                    this.hasStartInit = true;
                    this.initCamera();
                }
            }else{
                if(this.oVideoControl){
                    // this.oVideoControl.event.hide();
                    // this.oVideoControl.event.closeAll();
                    this.destroyCamera();
                }
            }
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
            this.setState({resultData:result});
        }
    }

    //监控控件初始化
    initCamera(){
        const className = 'camera'+this.props.thisData.id;
        const width = document.getElementsByClassName(className)[0].clientWidth;
        const height = document.getElementsByClassName(className)[0].clientHeight;
        // eslint-disable-next-line no-undef
        this.DHPlayer = new DHPlayer();
        this.oVideoControl = new this.DHPlayer.videoPlayer({
            videoClassName: className, //视频id
            videoId:className,
            width:width,
            height:height,
            connectSuccess: () => {
                // console.log(className+'_初始化成功');
                this.oVideoControl.event.create({
                    ismount: false,
                    mount: true,
                    num: 9,
                    windowType: "0"
                },()=>{
                    // console.log(this.props.className+'_窗口创建成功');
                    this.hasInit = true;
                    if(!this.props.thisData.showStatus){
                        this.oVideoControl.event.hide();
                    }
                });
            },
            connectClose: () => {
                this.oVideoControl = null
            }
        });
        this.oVideoControl.init();
    }

    //播放监控
    openCamera(camera){
        const { style } = this.props.thisData;
        axios.get(style.cameraUrl,{params:{id:camera.id,rbacToken:this.props.token}}).then((response) => {
            const result = response.data.data;
            if(result && this.oVideoControl){
                this.oVideoControl.event.realmonitor({
                    path: result
                })
            }
        }).catch(function(error){
        });
    }

    destroyCamera(){
        if(this.oVideoControl){
            this.oVideoControl.event.destroy();
            this.oVideoControl = null;
            this.hasStartInit = false;
            this.hasInit = false;
            this.DHPlayer = null;
        }
    }

    render() {
        const {resultData} = this.state;
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)}
                          thisData={this.props.thisData}>
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{opacity,fontSize}}>
                            <div className={cssStyle.listBox}>
                                <Scrollbars >
                                    {Array.isArray(resultData) && resultData.map((item,index)=>
                                        <div key={index} className={cssStyle.oneLine} onClick={this.openCamera.bind(this,item)} >
                                            {item.name}
                                        </div>
                                    )}
                                </Scrollbars>
                            </div>
                            <div className={`${cssStyle.cameraBox} ${'camera'+this.props.thisData.id}`} />
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}