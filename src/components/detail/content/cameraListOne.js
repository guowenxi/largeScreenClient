import React from "react";
import cssStyle from "./cameraListOne.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import "./eventListThree.css";

import Icon from "../images/iconSix.png";

export default class CameraListOne extends React.Component {
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
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <Scrollbars className={'eventListThreeBlueBar'}>
                    {detail && Array.isArray(detail) && detail.map((item,index)=>
                        <div className={cssStyle.contentBox} key={index}>
                            <div className={cssStyle.headBox}>
                                <img alt={''} src={Icon} className={cssStyle.icon} />
                                <div className={cssStyle.name}>{item.name}</div>
                                <div className={cssStyle.distance}>距离{item.distance}m</div>
                            </div>
                            <video className={cssStyle.video} autoPlay src={item.src} controls/>
                        </div>
                    )}
                </Scrollbars>
            </div>
        );
    }
}