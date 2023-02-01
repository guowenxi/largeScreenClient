import React from "react";
import cssStyle from "./typeFive.module.css";

export default class TypeFive extends React.Component {
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
        const {detail} = this.props;
        let weatherImg;
        try{
            weatherImg = require('../images/'+detail.weather.now.text+'.png');
        }catch (e) {}
        return (
            <div className={cssStyle.box} >
                <div className={cssStyle.name}>今日天气</div>
                {weatherImg && <img alt='' src={weatherImg} />}
                <div className={cssStyle.text}>{detail.weather ? detail.weather.now.text:''}</div>
                <div className={cssStyle.text}>{detail.weather ? detail.weather.now.temperature+'℃':''}</div>
            </div>
        );
    }
}