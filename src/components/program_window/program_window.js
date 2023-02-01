import React from "react";
import ComponentBox from "../component_box";
import Emitter from "../../common/eventBus";

export default class ProgramWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false,opacity:0};
        this.windowId = 1;
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.firstLoad === false){
            this.animateOn();
        }
        this.createWindow();
    }

    //组件删除时触发函数
    componentWillUnmount() {
        this.changeWindowShow(false);
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "showComponent":
                //显示当前组件
                Emitter.emit('app_box', {
                    type: 'changeComponentShowStatus',
                    data: {showStatus: true, id: this.props.thisData.id}
                });
                if(global.bodyWebsocket){
                    global.bodyWebsocket.send(JSON.stringify([{"parameter":JSON.stringify({...data,websocketSender:this.props.thisData.sceneId,moduleId:this.props.thisData.id}),"targetId":this.props.thisData.id+"_All_"}]));
                }
                // this.changeWindowShow(true);
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    //创建窗口
    createWindow(){
        if(typeof(jsOBJ) != "undefined"){
            const {style,position} = this.props.thisData;
            let {src} = style;
            if(style.token){
                src += style.tokenType === 1 ? '?token=':'/';
                src += this.props.token;
            }
            if(style.websocket){
                src += '/' + this.props.thisData.id;
            }
            const place = {
                "top" : parseInt((parseFloat(position.top)*global.bodyHeight)/100),
                "left" : parseInt((parseFloat(position.left)*global.bodyWidth)/100),
                "width" : parseInt((parseFloat(position.width)*global.bodyWidth)/100),
                "height" : parseInt((parseFloat(position.height)*global.bodyHeight)/100)
            };
            // eslint-disable-next-line no-undef
            jsOBJ.createVideo(this.windowId,src,place.top,place.left,place.width,place.height,0);
        }
    }

    //窗口显示隐藏
    changeWindowShow(flag){
        if(typeof(jsOBJ) != "undefined"){
            // eslint-disable-next-line no-undef
            jsOBJ.showVideo(this.windowId,flag);
            this.showStatus = flag;
        }
    }

    render() {
        if(this.props.thisData.showStatus !== this.showStatus){
            this.changeWindowShow(this.props.thisData.showStatus);
        }
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
            </ComponentBox>
        );
    }
}