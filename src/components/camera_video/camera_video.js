import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./camera_video.module.css";
import { Motion, spring } from "react-motion";
import VideoPlayer from "../../common/videoPlayer";
import {getCompatibleSize} from "../../common/util";

// import one from "./images/1.svg";
// import oneW from "./images/1白.svg";
// import four from "./images/4.svg";
// import fourW from "./images/4白.svg";
// import nine from "./images/9.svg";
// import nineW from "./images/9白.svg";
// import closeIcon from "./images/close.svg";
// import maxIcon from "./images/Max.svg";
// import resumeIcon from "./images/Resume.svg";
// import Emitter from "../../common/eventBus";

export default class CameraVideo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, size: 4, isMax: false, videoList:[], videoStyle: {width:'50%',height:'50%'}  };
        // this.sizeNum = [
        //     { size: 1, icon: one, select: oneW, videoStyle: {width:'100%',height:'100%'}},
        //     { size: 4, icon: four, select: fourW, videoStyle: {width:'50%',height:'50%'} },
        //     { size: 9, icon: nine, select: nineW, videoStyle: {width:'33.33%',height:'33.33%'} }
        // ];
        this.videoStyle = {
            '1':{width:'100%',height:'100%'},
            '2':{width:'100%',height:'50%'},
            '4':{width:'50%',height:'50%'},
            '9':{width:'33.33%',height:'33.33%'},
        };
        this.playIndex = 0;
        this.videoList = [];
    }

    componentDidMount() {
        this.initDefault();
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
                this.changeCamera(data.data.url);
                //显示当前组件
                this.changeThisShow(true);
                break;
            case "dataInterchange":
                this.changeCamera(data.data.url);
                //接收数据/播放监控
                break;
            case "changeKey":
                this.changeCamera(data.data.url);
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.setState({ opacity: 1 });
    }

    //修改尺寸布局
    // changeSize(sizeNum) {
    //     this.setState({ size:sizeNum.size,videoStyle:sizeNum.videoStyle });
    //     if(this.playIndex >= sizeNum.size){
    //         this.playIndex = 0
    //     }
    //     const {videoList} = this.state;
    //     videoList.forEach((video,index)=>{
    //         if(index >= sizeNum.size){
    //         }else{
    //         }
    //     });
    // }

    //加载默认数据
    initDefault(){
        this.playIndex = 0;
        const {defaultSize,defaultCamera} = this.props.thisData.style;
        let defaultCameraList = [];
        try {
            defaultCameraList = JSON.parse(defaultCamera);
        }catch (e) {}
        let videoList = [];
        for(let i = 0;i < defaultSize;i ++){
            if(defaultCameraList[i]){
                this.playIndex ++;
            }
            videoList.push({url:defaultCameraList[i],hasInit:false});
        }
        this.setState({videoList,videoStyle:this.videoStyle[defaultSize?defaultSize:4]});
    }

    changeCamera(url){
        const {defaultSize} = this.props.thisData.style;
        const {videoList} = this.state;
        if(this.playIndex >= defaultSize){
            this.playIndex = 0;
        }
        videoList[this.playIndex].url = url;
        this.playIndex ++;
        this.setState({videoList});
    }

    render() {
        const {videoList,size,videoStyle} = this.state;
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize?style.fontSize:'2vh');
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)}
                          thisData={this.props.thisData}>
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{
                            opacity,fontSize,
                            backgroundColor: style.backgroundColor,
                        }}>
                            {/*<div className={cssStyle.head}>*/}
                            {/*    {this.sizeNum.map((item, index) =>*/}
                            {/*        <img key={index}*/}
                            {/*             className={`${cssStyle.button} ${this.state.size === item.size ? cssStyle.select : ''}`}*/}
                            {/*             onClick={this.changeSize.bind(this, item)} alt=''*/}
                            {/*             src={this.state.size === item.size ? item.select : item.icon}*/}
                            {/*        />*/}
                            {/*    )}*/}
                            {/*</div>*/}
                            <div className={cssStyle.content} >
                                {videoList.map((video,index)=>{
                                    if(video.url && index < size){
                                        return <VideoPlayer key={video.url+index} url={video.url} type='rtmp/flv' style={{...videoStyle,display:index >= size ? 'none':''}} className={cssStyle.video} id={'video'+this.props.thisData.id+index}/>;
                                    }else{
                                        return <div key={index} style={{...videoStyle,display:index >= size ? 'none':''}} className={cssStyle.blank} />;
                                    }
                                })}
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}