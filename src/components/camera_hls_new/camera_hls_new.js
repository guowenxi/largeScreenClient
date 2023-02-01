import React from "react";
import ComponentBox from "../component_box";
import {getData} from "../../common/getDataUtil";
import {changeComponentShow, getCompatibleSize, interactData} from "../../common/util";
import {Motion, spring} from "react-motion";
import cssStyle from "./camera_hls_new.module.css";

import VideoPlayerHls from "./videoPlayerHls";

export default class CameraFlv extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [],opacity:0,size:'2x2',selectedIndex:0 };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.getDataTime = 0;
        this.changeComponentShow = changeComponentShow.bind(this);
        this.interactData = interactData.bind(this);
        this.cameraSize = {'1x1':[''],'2x2':['','','',''],'2x3':['','','','','',''],'3x3':['','','','','','','','',''],'1x3':['','','']};
        this.classSize = {'1x1':cssStyle.oneBox,'2x2':cssStyle.twoBox,'3x3':cssStyle.threeBox,'1x3':cssStyle.fourBox,'2x3':cssStyle.fiveBox};
        this.cameraUrl = ['','','',''];
    }

    //组件加载触发函数
    componentDidMount() {
        const { style } = this.props.thisData;
        if(style.size){
            this.cameraUrl = this.cameraSize[style.size];
            this.setState({size:style.size});
        }
        this.p = new Promise((resolve) => {
            if(this.props.thisData.firstLoad){
                this.getData(this.callBack.bind(this, resolve));
            }else{
                this.callBack(resolve);
            }
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
        if(style.defaultCamera){
            let defaultCamera;
            try{
                defaultCamera = JSON.parse(style.defaultCamera);
            }catch (e) {}
            if(defaultCamera){
                defaultCamera.forEach((item)=>{
                    this.keyParams.cameraIndexCode = item;
                    this.getData(this.callBack.bind(this, ''));
                });
            }
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity:1 });
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "dataInterchange":
            case "changeKey":
                if(data.data.size){
                    this.changeSize(data.data.size);
                }else{
                    for (let key in data.data) {
                        this.keyParams[key] = data.data[key];
                    }
                    this.reGetData();
                }
                break;
            case "deleteKey":
                this.keyParams = {};
                this.reGetData();
                break;
            case "showComponent":
                //显示当前组件
                this.changeComponentShow(true);
                break;
            case "hideComponent":
                //隐藏当前组件
                this.changeComponentShow(false);
                break;
            case "reFresh":
                //刷新数据
                this.reGetData();
                break;
            default:
                break;
        }
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve(result);
        }
        if (result) {
            this.getDataTime = (new Date()).getTime();
            const {selectedIndex} = this.state;
            this.cameraUrl[selectedIndex] = result.url;
            let newSelectedIndex = selectedIndex + 1;
            if(newSelectedIndex >= this.cameraUrl.length){
                newSelectedIndex = 0;
            }
            //若下一个窗口为空则默认选中下一个窗口
            if(this.cameraUrl[newSelectedIndex]){
                this.setState({});
            }else{
                this.setState({selectedIndex:newSelectedIndex});
            }
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //点击响应
    changeSelected(index) {
        this.setState({selectedIndex:index});
    }

    //切换播放尺寸
    changeSize(size){
        if(this.cameraSize[size]){
            this.cameraUrl.length = this.cameraSize[size].length;
            if(this.state.selectedIndex >= this.cameraUrl.length){
                this.setState({size,selectedIndex:0});
            }else{
                this.setState({size});
            }
        }
    }

    render() {
        const {size,selectedIndex} = this.state;
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) => {
                        return (
                            <div id={'echarts_map_'+this.props.thisData.id} className={`${cssStyle.box} ${this.classSize[size]}`} style={{opacity,fontSize}} >
                                {this.props.thisData.showStatus && this.cameraSize[size] && this.cameraSize[size].map((item,index)=>
                                    <VideoPlayerHls
                                        showStatus={this.props.thisData.showStatus}
                                        url={this.cameraUrl[index]} key={index}
                                        className={`${cssStyle.videoBox}  ${selectedIndex === index ? cssStyle.selected:''}`}
                                        id={this.props.thisData.id+'_'+index}
                                        changeSelected={this.changeSelected.bind(this,index)}
                                    />
                                )}
                            </div>
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}