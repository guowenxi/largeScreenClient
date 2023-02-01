import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./iframe_yueqing_map.module.css";
import {Motion, spring} from "react-motion";
import {getCompatibleSize, interactData} from "../../common/util";
import {Checkbox} from "antd";

export default class IframeYueqingMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newSrc:'',show:false,opacity:0,token:'',selectedList:['grid'],selectedBoxShow:true,showMode:1,left:28.4,top: 26.3,width: 43.4,height: 71.76};
        this.selectList = [{key:'event',name:'隐患事件'},{key:'people',name:'重点人'},{key:'way',name:'巡防路线'},{key:'grid',name:'微网格边界'}];
        this.keyParams = {};
        this.mapChildMessage = this.childMessage.bind(this);
        this.interactData = interactData.bind(this);
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
                if(data.data.actionType === 'changeMapSize'){
                    this.setState({bigMap:data.data.bigMap,zIndex:data.data.zIndex});
                }else{
                    for(let key in data.data){
                        this.keyParams[key] = data.data[key];
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
        iframe.contentWindow.postMessage({mapShow:this.props.thisData.showStatus,keyParams:this.keyParams,showLayer:this.state.selectedList},'*');
    }

    //切换选择框展开收起
    changeSelectBoxShow(){
        const {selectedBoxShow} = this.state;
        this.setState({selectedBoxShow:!selectedBoxShow});
    }

    changeLayerShow(item){
        let { selectedList } = this.state;
        const index = selectedList.indexOf(item.key);
        if(index >= 0){
            selectedList.splice(index,1);
        }else{
            selectedList.push(item.key)
        }
        this.setState({selectedList},()=>{
            this.sendMessage();
        })
    }

    getThemeTwoSelect(){
        let { selectedList,selectedBoxShow } = this.state;
        return (
            <Motion style={{height: spring(selectedBoxShow ? this.selectList.length*2+1.5:0)}} >
                {({height}) =>
                    <div className={cssStyle.contentBox} style={{height:height+'em'}}>
                        {this.selectList.map((item,index)=>
                            <Checkbox
                                key={index}
                                onChange={this.changeLayerShow.bind(this,item)}
                                checked={selectedList.indexOf(item.key)>=0}
                                className={cssStyle.checkBoxThemeTwo}
                            >
                                <div className={cssStyle.checkContentBox}>
                                    <div>{item.name}</div>
                                    <div className={cssStyle.point}/>
                                </div>
                            </Checkbox>
                        )}
                    </div>
                }
            </Motion>
        );
    }

    render() {
        const {style} = this.props.thisData;
        // const {selectedBoxShow,showMode,opacity,left,top,width,height,zIndex} = this.state;
        const {selectedBoxShow,showMode,opacity,bigMap,zIndex} = this.state;
        const selectStyle = {
            left: getCompatibleSize(style.selectLeft),
            top: getCompatibleSize(style.selectTop),
            right: getCompatibleSize(style.selectRight),
            bottom: getCompatibleSize(style.selectBottom),
            height: getCompatibleSize(style.selectHeight),
        };
        let left,top,width,height;
        if(showMode === 2){
            left=46.35;top= 10.19;width= 51.93;height= 87.59;
        }else if(bigMap){
            left=0.5;top= 9;width= 99;height= 90;
        }else{
            left=28.4;top= 26.3;width= 43.4;height= 71.76;
        }
        return (
            <ComponentBox style={{...this.props.style, pointerEvents: 'none',zIndex}} receiveMessage={this.receiveMessage.bind(this)} thisData={{...this.props.thisData,showStatus:showMode===2?true:this.props.thisData.showStatus}} >
                <Motion style={{opacity:spring(opacity),left:spring(left),top:spring(top),width:spring(width),height:spring(height)}}>
                    {({opacity,left,top,width,height}) =>
                        <div className={cssStyle.iframeContent} style={{opacity,left:left+'%',top:top+'%',width:width+'%',height:height+'%'}}>
                            {style.src && <iframe id={'iframe_'+this.props.thisData.id} title="map" src={style.src+'?rbacToken='+this.props.token} />}
                            <div className={cssStyle.selectBoxTwo} style={selectStyle}>
                                <div className={cssStyle.headBox} style={selectedBoxShow ? {}:{border:'none'}}>
                                    <div className={cssStyle.head}>地图落点</div>
                                    <div className={cssStyle.changeShow} onClick={this.changeSelectBoxShow.bind(this)}>{selectedBoxShow ? '收起':'展开'}</div>
                                </div>
                                {this.getThemeTwoSelect()}
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}