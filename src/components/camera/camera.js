import React from "react";
import ComponentBox from "../component_box";
import {changeComponentShow, interactData} from "../../common/util";

export default class Camera extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false, opacity:0, width:0, height:0, isBig: false};
        this.boxRef = React.createRef();
        this.changeComponentShow = changeComponentShow.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        const {style} = this.props.thisData;
        this.winIndex = style.winIndex ? style.winIndex : 1;
        this.webSocketId = style.webSocketId ? style.webSocketId : this.winIndex+'_c';
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        this.closeCamera();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus){
            this.changeCameraWinShow(this.props.thisData.showStatus);
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
                //显示当前组件
                this.changeComponentShow(true);
                this.changeCameraWinShow(true);
                break;
            case "hideComponent":
                //隐藏当前组件
                this.changeComponentShow(false);
                this.changeCameraWinShow(false);
                break;
            case "dataInterchange" :
            case "changeKey" :
                //修改请求条件/即切换播放监控
                this.playCamera(data.data);
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.initCameraWin();
    }

    //初始化并显示弹框
    initCameraWin(){
        const {position,style} = this.props.thisData;
        if(typeof(jsOBJ) != "undefined" && style.url){
            const url = style.url + `?webSocketId=${this.webSocketId}`;
            const place = {
                "top" : parseInt(global.bodyHeight*parseFloat(position.top)/100),
                "left" : parseInt(global.bodyWidth*parseFloat(position.left)/100),
                "width" : parseInt(global.bodyWidth*parseFloat(position.width)/100),
                "height" : parseInt(global.bodyHeight*parseFloat(position.height)/100)
            };
            // eslint-disable-next-line no-restricted-globals,no-undef
            jsOBJ.createVideo(this.winIndex,url,place.top,place.left,place.width,place.height,2);
            // alert(JSON.stringify(place))
            if(this.props.thisData.showStatus){
                setTimeout(()=>{
                    // eslint-disable-next-line no-undef
                    jsOBJ.showVideo(this.winIndex,true);
                },100);
            }
        }else{
            console.log('请用大屏软件打开页面');
        }
    }

    changeCameraWinShow(flag){
        if(typeof(jsOBJ) != "undefined" ){
            // eslint-disable-next-line no-undef
            jsOBJ.showVideo(this.winIndex,flag);
        }else{
            console.log('请用大屏软件打开页面');
        }
    }

    playCamera(data){
        if(global.bodyWebsocket){
            global.bodyWebsocket.send(JSON.stringify([{"parameter":JSON.stringify({type:'play',data}),"targetId":this.webSocketId+"_All_"}]));
        }
    }

    closeCamera(){
        if(global.bodyWebsocket){
            global.bodyWebsocket.send(JSON.stringify([{"parameter":JSON.stringify({type:'close'}),"targetId":this.webSocketId+"_All_"}]));
        }
        this.changeCameraWinShow(false);
    }

    render() {
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
            </ComponentBox>
        );
    }
}