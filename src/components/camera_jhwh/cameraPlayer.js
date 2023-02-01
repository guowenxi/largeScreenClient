import React from "react";
import cssStyle from "./camera_jhwh.module.css";

export default class CameraPlayer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.hasStartInit = false;
        this.hasInit = false;
    }

    componentDidMount() {
    }

    //组件删除触发函数
    componentWillUnmount() {
        this.destroyCamera();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.showStatus !== this.props.showStatus){
            if(this.props.showStatus){
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
        if(prevProps.url !== this.props.url && this.props.url){
            if(this.hasInit && this.oVideoControl){
                this.playCamera();
            }
        }
    }

    initCamera(){
        //控件初始化
        const className = this.props.className;
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
                this.createCamera();
            },
            connectClose: () => {
                this.oVideoControl = null
            }
        });
        this.oVideoControl.init();
    }

    createCamera(){
        this.oVideoControl.event.create({
            ismount: false,
            mount: true,
            num: 1,
            windowType: "2"
        },()=>{
            // console.log(this.props.className+'_窗口创建成功');
            this.hasInit = true;
            if(this.props.url){
                this.playCamera();
            }
            if(!this.props.showStatus){
                this.oVideoControl.event.hide();
            }
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

    playCamera(){
        this.oVideoControl.event.realmonitor({
            path: this.props.url
        })
    }

    render() {
        return (
            <div className={`${this.props.className} ${cssStyle.camera}`} style={this.props.style} />
        );
    }
}