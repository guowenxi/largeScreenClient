import React from "react";
import cssStyle from "./typeThree.module.css";
import templateIcon from "../images/typeThree_wd.svg"

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
        const {detail} = this.props;
        let weatherImg;
        try{
            // weatherImg = require('../images/'+detail.weather.now.text+'.png');
            let weatherCode=parseInt(detail.weather.now.code);
            if(weatherCode>=0&&weatherCode<=3){
                weatherImg = require('../images/typeThree_qing.svg');
            }else if(weatherCode>=4&&weatherCode<=6){
                weatherImg = require('../images/typeThree_duoyun_qing.svg');
            }else if(weatherCode>=7&&weatherCode<=8){
                weatherImg = require('../images/typeThree_qing_duoyun.svg');
            }else if(weatherCode===9){
                weatherImg = require('../images/typeThree_duoyun.svg');
            }else if(weatherCode===10||(weatherCode>=13&&weatherCode<=18)){
                weatherImg = require('../images/typeThree_yu.svg');
            }else if(weatherCode===11||weatherCode===12){
                weatherImg = require('../images/typeThree_leizhenyu.svg');
            }else if(weatherCode===19||weatherCode===20){
                weatherImg = require('../images/typeThree_yujiaxue.svg');
            }else if(weatherCode>=21&&weatherCode<=25){
                weatherImg = require('../images/typeThree_xue.svg');
            }else{
                weatherImg = require('../images/typeThree_qing.svg');
            }
        }catch (e) {}
        return (
            <div className={cssStyle.box} >
                <img alt='' src={weatherImg != null ? weatherImg:''} className={cssStyle.weatherStyle} />
                <div className={cssStyle.templateStyle}>
                    <img src={templateIcon} alt="" className={cssStyle.templateIcon} />
                    <div className={cssStyle.templateText}>{detail.weather ? detail.weather.now.temperature+'℃':''}</div>
                </div>
            </div>
        );
    }
}