import React from "react";
import FlvJs from "flv.js";
import cssStyle from "./camera_flv.module.css";

export default class VideoPlayer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件加载触发函数
    componentDidMount() {
        setTimeout(()=>{
            if(this.props.url){
                this.initVideo();
            }
        })
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.timer){
            clearTimeout(this.timer);
        }
        this.destroyVideo();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.url !== this.props.url && this.props.url){
            this.initVideo();
        }
    }

    initVideo(){
        if(this.timer){
            clearTimeout(this.timer);
        }
        this.destroyVideo();
        this.player = FlvJs.createPlayer({
            type: 'flv',
            url: this.props.url,
            isLive: true,
            hasAudio: false
        }, {
            enableWorker: false,
            autoCleanupSourceBuffer: true, //清理缓冲区
            enableStashBuffer: false,
            stashInitialSize: 128, // 减少首桢显示等待时长
            statisticsInfoReportInterval: 600
        });
        const videoElement = document.getElementById('video_'+this.props.id);
        videoElement.controls = false;
        this.player.attachMediaElement(videoElement);
        this.player.load();
        this.timer = setTimeout(() => {
            this.player.play();
        }, 100);
    }

    destroyVideo(){
        if(this.player){
            this.player.unload();
            this.player.detachMediaElement();
            this.player.destroy();
            this.player = null;
        }
    }

    render() {
        const {style,className,id,changeSelected} = this.props;
        return (
            <div className={className} style={style} onClick={changeSelected}>
                <video id={'video_'+id} />
                <div className={cssStyle.border} />
            </div>
        );
    }
}