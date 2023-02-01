import React from "react";
import cssStyle from "./weather.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import {Icon} from "antd";
import axios from "axios";
import {displayUrl, rootUrl} from "../../../config";

export default class EventTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {weather:{}};
        this.warningColor = {
            '红色预警':'#EF4D4D',
            '橙色预警':'#F99450',
            '黄色预警':'#E8D443',
            '蓝色预警':'#00CBFE',
        };
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.getNowWeather();
    }

    getNowWeather(){
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

    getWeatherContent(detail){
        const {weather} = this.state;
        if(weather && weather.now){
            return (
                <div className={cssStyle.nowWeatherBox}>
                    {/*<img alt={''} src={`./images/weather/${weather.now.text}.png`} className={cssStyle.nowWeatherIcon}/>*/}
                    <img alt={''} src={`./images/weather/${detail.weatherName}.png`} className={cssStyle.nowWeatherIcon}/>
                    <div className={cssStyle.nowTemperature}>{weather.now.temperature+'℃'}</div>
                </div>
            );
        }
    }

    closeDetail(){
        this.props.changeThisShow(false,true);
    }

    render() {
        const {detail} = this.props;
        // const {weather} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                {detail.warning == null || detail.warning.length === 0 ? (
                    <React.Fragment>
                        <div className={cssStyle.head}>
                            今天：{detail.weatherName} {detail.content}
                            {/*今天：{weather && weather.now ? weather.now.text:''} {detail.content}*/}
                        </div>
                        <div className={cssStyle.nowWeatherBox}>
                            {this.getWeatherContent(detail)}
                        </div>
                        <div className={cssStyle.messageSafe}>
                            今日无恶劣天气，风险较小。
                        </div>
                    </React.Fragment>
                ):(
                    <React.Fragment>
                        <div className={cssStyle.head}>
                            今天：{detail.weatherName} {detail.content}
                            {/*今天：{weather && weather.now ? weather.now.text:''} {detail.content}*/}
                        </div>
                        <div className={cssStyle.messageWarning}>
                            今日有恶劣天气，请注意出行安全。
                        </div>
                        <div className={cssStyle.warningBox}>
                            <Scrollbars>
                                {detail.warning && detail.warning.map((warning,index)=>
                                    <div key={index} className={cssStyle.warningItem}>
                                        <img alt={''} src={`./images/weather/${warning.name}.png`} className={cssStyle.warningImg}/>
                                        <div className={cssStyle.warningName}>{warning.name}</div>
                                        <div className={cssStyle.warningLevel} style={{color:this.warningColor[warning.level]}}>{warning.level}</div>
                                        <div className={cssStyle.warningTime}>{warning.time}</div>
                                    </div>
                                )}
                            </Scrollbars>
                        </div>
                    </React.Fragment>
                )}
                <div className={cssStyle.close} onClick={this.closeDetail.bind(this)}>
                    收起
                    <Icon type="arrow-up" />
                </div>
            </div>
        );
    }
}