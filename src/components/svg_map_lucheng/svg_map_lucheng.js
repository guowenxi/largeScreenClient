import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./svg_map_lucheng.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {roadPosition} from "./svg_data";
import {interactData,getCompatibleSize} from "../../common/util";
import LuChengImgMap from "./images/lucheng_map.svg";
import ImgPoint from "./images/img_point.png";

export default class SvgMapLuCheng extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:{}, currentId: null};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.keyParams = {};
        this.id = 1
        this.luchengMap = [
          {
            lat: 120.3800,
            lng: 28.1596
          },
          {
            lat: 120.8019,
            lng: 27.9723
          },
        ]
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.timer){
            clearTimeout(this.timer);
        }
        if(this.detailTimer){
            clearTimeout(this.detailTimer);
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey" :
                this.id = data.data.type
                for(let key in data.data){
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "showComponent":
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.p.then(() => {
            this.setState({opacity:1});
        })
    }

    //重新获取数据
    reGetData(){
        this.setState({resultData:[]});
        this.getData(this.callBack.bind(this,''));
    }

    //获取数据后回调
    callBack(resolve,result){
        if(result){
            this.setState({resultData:result});
            if(resolve){
                resolve(result);
            }
        }
    }

    getPointLeft(lat){
      // 是后端传来数据的与最左侧地图的距离
      const pointLeft = lat - this.luchengMap[0].lat
      // 地图左右两侧的距离
      const bothSidesOfMap= this.luchengMap[1].lat - this.luchengMap[0].lat
      const currentPoint = (pointLeft / bothSidesOfMap * 100).toFixed(2)
      return currentPoint + '%'
    }
    getPointTop(lng){
      // 是后端传来数据的与最左侧地图的距离
      const pointTop = this.luchengMap[0].lng - lng
      // 地图上下两侧的距离
      const bothSidesOfMap= this.luchengMap[0].lng - this.luchengMap[1].lng
      const currentPoint = (pointTop / bothSidesOfMap * 100).toFixed(2)
      return currentPoint + '%'
    }

    roadClick(item){
      if (item.type === 2 && !item.videoFlag) return
      const { interact } = this.props.thisData.dataSources;
      this.interactData(interact, item);
    }

    handleMouseOver(item) {
      this.setState((state)=>({
        currentId: item.id
      }))
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        let {resultData, currentId} = this.state;
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{opacity,fontSize}} >
                          <div className={cssStyle.map_box}>
                          <img src={LuChengImgMap} alt={''}  className={cssStyle.map_img}/>
                            {Array.isArray(resultData) && resultData.length && resultData.map((item,index)=>
                                <div key={index} className={cssStyle.roadBox} style={roadPosition[item.id]} onClick={this.roadClick.bind(this,item)} >
                                    <div className={cssStyle.nameBox} style={{position: 'absolute',left:this.getPointLeft(item.lat), top:this.getPointTop(item.lng)}} >
                                        <img onMouseOver={this.handleMouseOver.bind(this, item)} alt={''} src={ImgPoint}  />
                                        {
                                          currentId === item.id && <div className={cssStyle.pointBox}>
                                          <div className={cssStyle.name}>{item.name}</div>
                                          <div className={cssStyle.address}>{item.address}</div>
                                          {
                                            item.videoFlag && <div className={cssStyle.subName}>
                                              展厅视频
                                            </div>
                                          }
                                        </div>
                                        }
                                        
                                    </div>
                                </div>
                            )}
                          </div>
                            
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}