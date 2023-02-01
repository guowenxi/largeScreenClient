import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./iframe_yueqing_map_two.module.css";
import {Motion, spring} from "react-motion";
import {interactData} from "../../common/util";
import {Checkbox} from "antd";
import {getAllGrid} from "../../common/allGridUtil";

export default class IframeYueqingMapTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newSrc:'',show:false,opacity:0,token:'',selectedList:['grid'],selectedBoxShow:true,showMode:1,left:28.4,top: 26.3,width: 43.4,height: 71.76};
        this.keyParams = {};
        this.gridDataParams = {};
        this.mapChildMessage = this.childMessage.bind(this);
        this.interactData = interactData.bind(this);
        this.getAllGrid = getAllGrid.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        window.addEventListener('message',this.mapChildMessage);
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        window.removeEventListener('message',this.mapChildMessage);
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus){
            this.sendMessage();
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "dataInterchange":
                if(data.data.showMode === 1){
                    this.setState({showMode:1,left:28.4,top: 26.3,width: 43.4,height: 71.76});
                    // this.changeModeTimer = setTimeout(()=>{
                    //     this.setState({showMode:data.data.showMode});
                    // },500);
                }
                break;
            case "changeKey" :
                if(data.data.actionType === 'changeKeyParams'){
                    for(let key in data.data){
                        this.keyParams[key] = data.data[key];
                    }
                }else{
                    for(let key in data.data){
                        this.gridDataParams[key] = data.data[key];
                    }
                    this.sendMessage();
                }
                break;
            case "showComponent":
                //显示当前组件
                break;
            default:
                break;
        }
    }

    changeKey(message){
        const data = JSON.parse(JSON.stringify(message));
        delete data.actionType;
        switch (message.actionType) {
            case 'changeKeyParams':
                for (let key in data) {
                    this.keyParams[key] = data[key];
                }
                break;
            case 'changeGridParams':
                for (let key in data) {
                    this.gridDataParams[key] = data[key];
                }
                break;
            case 'changeAllGridParams':
                for (let key in data) {
                    this.allGridParams[key] = data[key];
                }
                this.getAllGrid(this.map,this.props.thisData.style);
                break;
            default:
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    //建筑点击
    childMessage(e){
        const data = e.data;
        // console.log(e.data);
        switch (data.type) {
            case "buildingClick":
                this.setState({showMode:2,left:46.35,top: 10.19,width: 51.93,height: 87.59});
                const { interact } = this.props.thisData.dataSources;
                this.interactData(interact,e.data.data);
                break;
            case "other":
                break;
            default:
                break;
        }
    }

    //向iframe发送消息
    sendMessage(){
        const iframe = document.getElementById('iframe_'+this.props.thisData.id);
        iframe.contentWindow.postMessage({mapShow:this.props.thisData.showStatus,keyParams:this.gridDataParams,showLayer:this.state.selectedList},'*');
    }

    render() {
        const {style} = this.props.thisData;
        const {showMode,opacity,zIndex,allGridLevel} = this.state;
        return (
            <ComponentBox style={{...this.props.style, pointerEvents: 'none',zIndex}} receiveMessage={this.receiveMessage.bind(this)} thisData={{...this.props.thisData,showStatus:showMode===2?true:this.props.thisData.showStatus}} >
                <Motion style={{opacity:spring(opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.iframeContent} style={{opacity}}>
                            {style.src && <iframe id={'iframe_'+this.props.thisData.id} title="map" src={style.src+'?rbacToken='+this.props.token} />}
                            {this.allGridLayerData && (
                                <div className={cssStyle.allGridSelectBox}>
                                    {this.allGridLayerData.map((item,index)=>{
                                        if(index === 3 || index >= allGridLevel){
                                            return (
                                                <Checkbox
                                                    key={index}
                                                    checked={item.checked}
                                                    className={cssStyle.allGridCheckBox}
                                                    onClick={this.changeAllGridShow.bind(this,item,index)}
                                                >
                                                    <span className={cssStyle.allGridType}>{item.name}边界</span>
                                                </Checkbox>
                                            );
                                        }else{
                                            return null;
                                        }
                                    })}
                                </div>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}