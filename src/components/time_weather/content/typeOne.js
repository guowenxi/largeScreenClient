import React from "react";
import cssStyle from "./typeOne.module.css";

export default class TypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const {detail,style} = this.props;
        let weatherImg;
        try{
            weatherImg = require('../images/'+detail.weather.now.text+'.png');
        }catch (e) {}
        return (
            <div className={cssStyle.box} >
                {style.selectYear===2?'':<div>{detail.day}</div>}
                {style.selectDate===2?'':<div>{detail.week}</div>}
                {style.selectTime===2?'':<div>{detail.time}</div>}
                {style.selectTemperature===2?'':<div>{detail.weather ? detail.weather.now.temperature+'℃':''}</div>}
                {style.selectWeather===2?'':(weatherImg && <img alt='' src={weatherImg != null ? weatherImg:''} />)}
            </div>
        );
    }
}