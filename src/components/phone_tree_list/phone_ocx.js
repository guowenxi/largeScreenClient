import React from "react";
import ReactDOM from "react-dom";

import cssStyle from './phone_tree_list.module.css';
import closeIcon from './image/close.svg';

export default class PhoneOcx extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.isPlay = false;
        this.bodyId = props.editType ? 'canvas-view' : 'root';
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.isPlay === false){
            this.isPlay = true;
            setTimeout(() => {
                this.playVideo(this.props.data);
            },500);
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        this.stopVideo(this.props.data);
    }

    //组件数据更新时触发函数
    // componentDidUpdate(prevProps){
    //     if(prevProps.data.id !== this.props.data.id){
    //         this.stopVideo(prevProps.data);
    //         this.playVideo(this.props.data)
    //     }
    // }

    //显示通话视频
    playVideo(data){
        if(navigator.userAgent.indexOf("Chrome") < 0){
            const ocxDom = document.getElementById("callOcx" + data.id);
            this.port = ocxDom.ME_GetMemberVideo(data.addcid, data.id, data.callHostInfo);
        }
    }

    //停止播放
    stopVideo(data){
        if(this.port != null && navigator.userAgent.indexOf("Chrome") < 0){
            const ocxDom = document.getElementById("callOcx" + data.id);
            ocxDom.ME_StopGetMemberVideo(data.addcid, data.id, "", this.port);
        }
    }

    //踢出会议
    outMeeting(){
        this.props.outMeeting(this.props.index,true);
    }

    render() {
        return ReactDOM.createPortal(
            (
                <div className={cssStyle.playBox} style={this.props.style}>
                    <div className={cssStyle.head}>
                        <div>{this.props.data.name}</div>
                        <img src={closeIcon} alt='' onClick={this.outMeeting.bind(this)}/>
                    </div>
                    <object id={"callOcx"+this.props.data.id} classID="clsid:1AEF5D45-E61F-44DF-B862-8F005038D4F8">
                    </object>
                </div>
            ),
            document.getElementById(this.bodyId)
        );
    }
}