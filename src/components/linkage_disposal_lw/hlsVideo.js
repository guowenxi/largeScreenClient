import React from "react";
import Hls from "hls.js";
import cssStyle from "./linkage_disposal.module.css";
import ReactDOM from "react-dom";

export default class HlsVideo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {full:false};
        this.refDom = React.createRef();
        this.bodyId = global.editType ? 'canvas-view' : 'root';
    }

    //组件加载触发函数
    componentDidMount() {
        setTimeout(()=>{
            this.initVideo();
        });
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.hls){
            this.hls.destroy();
        }
    }

    initVideo(){
        const {id,hlsUrl} = this.props;
        if(id){
            this.hls = new Hls();
            const video = document.getElementById(id);
            this.hls.attachMedia(video);
            this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                this.hls.loadSource(hlsUrl);
            });
        }
    }

    changeFull(){
        const flag = !this.state.full;
        this.setState({full:flag});
        const {id} = this.props;
        if(flag){
            document.getElementById('bodyBox_'+id).appendChild(this.refDom.current);
        }else{
            document.getElementById('smallBox_'+id).appendChild(this.refDom.current);
        }
        this.refDom.current.play();
    }

    render() {
        const {id,className,style,changePlayIndex} = this.props;
        return (
            <div className={className} style={style} id={'smallBox_'+id}>
                <video ref={this.refDom} id={id} className={cssStyle.video} autoPlay onClick={changePlayIndex} onDoubleClick={this.changeFull.bind(this)}/>
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