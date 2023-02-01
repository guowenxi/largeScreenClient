import React from 'react';
import videojs from 'video.js'
import videozhCN from 'video.js/dist/lang/zh-CN.json'; //播放器中文，不能使用.js文件
import 'video.js/dist/video-js.css';  //样式文件注意要加上
import 'videojs-flash';  //如果要播放RTMP要使用flash 需要先npm i videojs-flash

export default class VideoPlayer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        videojs.options.flash.swf = './plugin/video-js.swf';
        setTimeout(()=>{
            const options = {
                autoplay: true,  //自动播放
                language: 'zh-CN',
                controls: true,  //控制条
                preload: 'auto',
                resizeManager:true,
                sources: [
                    {
                        src: this.props.url,
                        type: this.props.type,  //类型可加可不加，目前未看到影响
                    }
                ]
            };
            console.log(this.props.id+'creat');
            this.player = videojs(this.props.id, options, function onPlayerReady() {
            });
            videojs.addLanguage('zh-CN', videozhCN);
            this.player.play();
        });
    }

    componentWillUnmount() {
        if (this.player) {
            console.log(this.props.id+'dispose');
            this.player.dispose();
        }
    }
    componentDidUpdate(prevProps){
        if(prevProps.url !== this.props.url || prevProps.type !== this.props.type){
            if(this.player){
                console.log(this.props.id+'change');
                this.player.pause();
                this.player.src([{src:this.props.url,type:this.props.type}]);
                this.player.load();
                this.player.play();
            }
        }else{

        }
    }

    render() {
        return (
            <div className={this.props.className} style={this.props.style}>
                {/*{this.props.url ? <video id={this.props.id} ref={ node => this.videoNode = node } className={`video-js vjs-default-skin vjs-big-play-centered`} style={{width:'100%',height:'100%'}}/>:''}*/}
                {this.props.url ? <video id={this.props.id} ref={ node => this.videoNode = node } className={`video-js vjs-default-skin vjs-big-play-centered`} style={{width:'100%',height:'100%'}}/>:''}
            </div>
        );
    }
}
