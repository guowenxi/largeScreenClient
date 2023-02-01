import React from "react";
import ComponentBox from "../component_box";
import {Motion, spring} from "react-motion";
import cssStyle from "./time_weather.module.css";
import moment from "moment";
import axios from "axios";
import {rootUrl,displayUrl} from "../../config";

export default class TimeWeather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0};
        this.weekday = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    }

    //组件加载触发函数
    componentDidMount() {
        this.getDateFormat();
        this.getWeather();
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
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
        this.setState({opacity:1});
    }

    getDateFormat(){
        const now = new Date();
        const {style} = this.props.thisData;
        const formatType = style.dateType === 1 ? 'YYYY-MM-DD' : (style.dateType === 2 ? 'YYYY.MM.DD':'YYYY/MM/DD');
        this.setState({now:now,day:moment(now).format(formatType),week:this.weekday[now.getDay()],time:moment(now).format('HH:mm:ss')});
        this.timer = setTimeout(() => this.getDateFormat(),1000);
    }

    getWeather(){
        axios.get(rootUrl + displayUrl + '/commonApi/getNowWeather').then((response) => {
            // 在这儿实现 setState
            const result = response.data;
            if(result.success){
                this.setState({weather:result.data.results[0]});
                // console.log(result)
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = style.fontSize ? this.props.getCompatibleSize(style.fontSize) : '20px';
        const contentType = style.contentType ? style.contentType : 'typeOne';
        const ContentDetail = require(`./content/${contentType}`).default;
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{color:style.fontColor,fontSize:fontSize,opacity:opacity}}>
                            <ContentDetail detail={this.state} style={style} />
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}