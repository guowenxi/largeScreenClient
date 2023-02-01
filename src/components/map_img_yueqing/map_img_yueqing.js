import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./map_img_yueqing.module.css";
import {Motion, spring} from "react-motion";
import axios from "axios";
import {interactData} from "../../common/util";

import yueqingMapImg from "./images/yueqing.svg";
import ruianMapImg from "./images/ruian.svg";
import wenchengMapImg from "./images/wencheng.svg";
import Emitter from "../../common/eventBus";

export default class MapImgYueqing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false, opacity:0,resultData:[]};
        this.selectedIndex = -1;
        this.mapImg = {
            'yueqing' : yueqingMapImg,
            'ruian' : ruianMapImg,
            'wencheng' : wenchengMapImg
        };
        this.dataPosition = {
            'yueqing':{
                "乐成街道" : {top:'64%',left:'31.5%'},
                "仙溪镇" : {top:'22%',left:'50%'},
                "北白象镇" : {top:'80.6%',left:'19%'},
                "南塘镇" : {top:'50.6%',left:'65%'},
                "南岳镇" : {top:'56.5%',left:'61.6%'},
                "城东街道" : {top:'66%',left:'47%'},
                "城南街道" : {top:'72%',left:'40.6%'},
                "大荆镇" : {top:'22.5%',left:'71%'},
                "天成街道" : {top:'59.5%',left:'52%'},
                "岭底乡" : {top:'43%',left:'35.8%'},
                "柳市镇" : {top:'81.5%',left:'31.6%'},
                "淡溪镇" : {top:'53.5%',left:'37%'},
                "清江镇" : {top:'45%',left:'63%'},
                "湖雾镇" : {top:'26%',left:'82.8%'},
                "白石街道" : {top:'70%',left:'23.5%'},
                "盐盆街道" : {top:'75.2%',left:'46%'},
                "石帆街道" : {top:'57.4%',left:'45.5%'},
                "磐石镇" : {top:'87%',left:'17%'},
                "翁垟街道" : {top:'82.5%',left:'42.7%'},
                "芙蓉镇" : {top:'39.8%',left:'50.2%'},
                "蒲岐镇" : {top:'61.5%',left:'57%'},
                "虹桥镇" : {top:'52.5%',left:'54.8%'},
                "雁荡镇" : {top:'34.5%',left:'65.4%'},
                "龙西乡" : {top:'29%',left:'51.2%'},
                "智仁乡" : {top:'12.5%',left:'66%'},
            },
            'ruian':{
                "安阳街道" : {top:'60%',left:'71%'},
                "玉海街道" : {top:'63%',left:'67.5%'},
                "锦湖街道" : {top:'56%',left:'67.2%'},
                "潘岱街道" : {top:'47.2%',left:'64%'},
                "东山街道" : {top:'71%',left:'71.8%'},
                "上望街道" : {top:'75.5%',left:'77%'},
                "莘塍街道" : {top:'70%',left:'80%'},
                "汀田街道" : {top:'59.3%',left:'78%'},
                "飞云街道" : {top:'68%',left:'64.5%'},
                "云周街道" : {top:'60.2%',left:'61.9%'},
                "仙降街道" : {top:'61.4%',left:'55.9%'},
                "南滨街道" : {top:'80%',left:'69.8%'},
                "芳庄乡" : {top:'19.6%',left:'36.9%'},
                "北麂乡" : {top:'24.3%',left:'77%'},
                "塘下镇" : {top:'47.3%',left:'77.2%'},
                "陶山镇" : {top:'49.4%',left:'51.9%'},
                "桐浦镇" : {top:'39%',left:'58.2%'},
                "湖岭镇" : {top:'36%',left:'35%'},
                "林川镇" : {top:'23.6%',left:'46.2%'},
                "马屿镇" : {top:'62.4%',left:'43%'},
                "曹村镇" : {top:'81%',left:'48.3%'},
                "高楼镇" : {top:'57.2%',left:'25%'},
                "平阳坑镇" : {top:'71.2%',left:'36%'},
            },
            'wencheng':{

            }
        };
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(resolve)});
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
            case "showComponent":
                //显示当前组件
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
        this.getData();
    }

    //获取数据
    getData(resolve){
        if(this.props.thisData.dataSources.dataType === 1){
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            }catch (e) {
            }
            this.setState({resultData:defaultData});
            if(resolve){
                resolve(defaultData);
            }
        }else if(this.props.thisData.dataSources.dataType === 2){
            let params = {};
            try {
                params = JSON.parse(this.props.thisData.dataSources.dataParams);
            }catch (e) {}
            for(let key in this.keyParams){
                params[key] = this.keyParams[key];
            }
            axios.get(this.props.thisData.dataSources.dataUrl,{params:params}).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if(result){
                    this.setState({resultData:result});
                    if(resolve){
                        resolve(result);
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    //点击响应
    selItem(selectedItem,index) {
        const {interact} = this.props.thisData.dataSources;
        if(index === this.selectedIndex){
            this.selectedIndex = -1;
            interact.forEach((item)=>{
                Emitter.emit(item.receiveId,{type:'deleteKey'});
            });
        }else{
            interactData(interact,selectedItem);
            this.selectedIndex = index;
        }
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const titleKey = style.titleKey ? style.titleKey : 'name';
        const numKey = style.numKey ? style.numKey : 'num';
        const area = style.area ? style.area : 'yueqing';
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div style={{opacity:opacity,fontSize,color:style.color}} className={cssStyle.box} >
                            <img alt='' src={this.mapImg[area]} className={cssStyle.map}/>
                            {this.state.resultData.map((item,index) =>
                                <div key={index} style={this.dataPosition[area][item[titleKey]]} className={cssStyle.dataItem} onClick={this.selItem.bind(this,item,index)}>
                                    {item[numKey]}
                                </div>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}