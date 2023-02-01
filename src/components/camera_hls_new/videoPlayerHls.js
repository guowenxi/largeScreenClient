import React from "react";
import cssStyle from "./camera_hls_new.module.css";
import Hls from "hls.js";
import ReactDOM from "react-dom";

export default class VideoPlayerHls extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {full:false};
        this.refDom = React.createRef();
        this.bodyId = global.editType ? 'canvas-view' : 'root';
    }

    //组件加载触发函数
    componentDidMount() {
        setTimeout(()=>{
            this.player = document.getElementById('video_'+this.props.id);
            if(this.props.url){
                this.initVideo();
            }
        })
    }

    //组件删除时触发函数
    componentWillUnmount() {
        this.destroyVideo();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.url !== this.props.url && this.props.url){
            this.initVideo();
        }
    }

    initVideo(){
        this.destroyVideo();
        this.hls = new Hls();
        this.hls.loadSource(this.props.url);
        this.hls.attachMedia(this.player);
        this.hls.on(Hls.Events.MANIFEST_PARSED, function () {
            this.player.play();
        });
    }

    destroyVideo(){
        if(this.hls){
            this.hls.destroy();
        }
    }

    changeFull(){
        const flag = !this.state.full;
        this.setState({full:flag});
        const {id} = this.props;
        if(flag){
            document.getElementById('bodyBox_'+id).appendChild(this.refDom.current);
        }else{
            const dom = document.getElementById('smallBox_'+id);
            dom.insertBefore(this.refDom.current,dom.childNodes[0]);
        }
        this.refDom.current.play();
    }

    render() {
        const {style,className,id,changeSelected} = this.props;
        return (
            <div className={className} style={style} onClick={changeSelected} id={'smallBox_'+id}>
                <video ref={this.refDom} id={'video_'+id} autoPlay onDoubleClick={this.changeFull.bind(this)}/>
                <div className={cssStyle.border} />
                {ReactDOM.createPortal(
                    (
                        <div id={'bodyBox_'+id} className={`${cssStyle.bodyBox} ${this.state.full ? cssStyle.show:cssStyle.hide}`} />
                    ),
                    document.getElementById(this.bodyId)
                )}
            </div>
        );
    }
}