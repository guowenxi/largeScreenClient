import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./video_lucheng.module.css";
import {Motion, spring} from "react-motion";
import {getCompatibleSize, interactData} from "../../common/util";
import Emitter from "../../common/eventBus";
import {getData} from "../../common/getDataUtil";
import ImageLeft from "./images/video_left.png";
import ImageRight from "./images/video_right.png";
import ImageClose from "./images/close.png";

export default class VideoLucheng extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:{}, selectedIndex: null, current: {}};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.keyParams = {};
        this._scrollLeft = 0
        this.step = 180
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if (this.props.thisData.firstLoad) {
                this.getData(this.callBack.bind(this, resolve));
            } else {
                this.callBack(resolve);
            }
        });
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "dataInterchange":
            case "changeKey" :
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];

                }
                for (let key in data.data) {
                  const subData = data.data[key];
                  const { resultData } = this.state;
                  for (let i = 0; i < resultData.length; i++) {
                    if (subData === resultData[i][key] + '') {
                      if(data.isInteract !== 2) {
                        const { interact } = this.props.thisData.dataSources;
                        this.interactData(interact, resultData[i]);
                      }
                      this.setState({ current: resultData[i] })
                      this.setState({ selectedIndex: i})
                    }
                  }
                }
                if(data.reGetData !== 2){
                    this.reGetData();
                }
                break;
            case "showComponent":
                //显示当前组件
                Emitter.emit('app_box', {
                    type: 'changeComponentShowStatus',
                    data: { showStatus: true, id: this.props.thisData.id }
                });
                
                break;
            case "changeSelected":
              break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve();
        }
        if (result) {
            //数据结果处理
            this.setState({ resultData: result });
        }
    }
    // 关闭视频弹窗
    close() {
      Emitter.emit('app_box', {
        type: 'changeComponentShowStatus',
        data: { showStatus: false, id: this.props.thisData.id }
      });
    }
    // 上一个
    previous() {
      // 左右移动
      const outDiv = document.getElementById('out');
      this._scrollLeft -= this.step
		  outDiv.scrollTo(this._scrollLeft, 0);
      const { selectedIndex, resultData } = this.state
      const index = selectedIndex
      if (selectedIndex - 1 < 0) return
      this.setState({ current: resultData[index - 1] })
      this.setState({ selectedIndex: index - 1})
      
    }
    // 下一个
    next() {
      // 左右移动
      const outDiv = document.getElementById('out');
      this._scrollLeft += this.step
		  outDiv.scrollTo(this._scrollLeft, 0);
      const { selectedIndex, resultData } = this.state
      const index = selectedIndex
      if (selectedIndex + 1 >= resultData.length) return
      this.setState({ current: resultData[index + 1] })
      this.setState({ selectedIndex: index + 1})
      
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const {resultData, selectedIndex, current} = this.state;
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={`${cssStyle.box} blank_style`} style={{fontSize,opacity,color:style.fontColor}}>
                            {/*展示内容*/}
                            <div className={cssStyle.main}>
                              {
                                current && current.type === 'video' ?
                                <video className={cssStyle.video} controls={true} src={current.videoSrc}></video> : <iframe className={cssStyle.video} src={current.videoSrc} title="vr"></iframe> 
                              }
                              <div className={cssStyle.close} onClick={this.close.bind(this)}>
                                <img src={ImageClose} alt="" />
                              </div>
                              <div className={cssStyle.bottom}>
                                <div className={cssStyle.bottom_box}>
                                  <img onClick={this.previous.bind(this)} src={ImageLeft} alt=""  />
                                  <div className={cssStyle.context}
                                  id="out">
                                    {
                                    Array.isArray(resultData) && resultData.length && resultData.map((item, index) => (
                                      <div key={index} className={`${cssStyle.item} ${selectedIndex === index ? cssStyle.item_selected : ''}`}>
                                        <div className={`${cssStyle.item_name} `}>{item.name}</div>
                                        <div className={cssStyle.item_address}>{item.address}</div>
                                      </div>
                                      ))
                                    }
                                  </div>
                                  <img onClick={this.next.bind(this)} src={ImageRight} alt=""  />
                                </div>
                              </div>
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}