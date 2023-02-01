import React from "react";
import ComponentBox from "../component_box";
import { interactData } from "../../common/util";
import cssStyle from "./box_type_seven.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import { Icon } from 'antd';

export default class BoxTypeSeven extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], bgRight: 0, menuRight: 93,open:true };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        if (this.props.firstLoad === false) {
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
            case "changeKey":
                for (let key in data.data) {
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
    animateOn() {
        this.setState({ opacity: 1 });
    }

    //重新获取数据
    reGetData() {
        this.setState({ resultData: [] });
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            this.setState({ resultData: result });
            if (resolve) {
                resolve(result);
            }
        }
    }

    rollMenu(style,fontSize) {
        return (
            <Motion style={{ menuRight: spring(this.state.menuRight) }}>
                {({ menuRight }) => {
                    return (
                        <div className={cssStyle.button} onClick={this.changeBox.bind(this)} style={{ right: `${menuRight}%` }}>
                            <Icon type={this.state.open?"right-circle":"left-circle"} theme="filled" style={{ fontSize: fontSize, color: 'white' }} className={cssStyle.iconStyle} />
                            {this.state.open?<div className={cssStyle.textStyle}>{style.openName}</div>:<div className={cssStyle.textStyle}>{style.closeName}</div>}
                        </div>
                    )
                }}
            </Motion>
        )
    }


    rollBackground() {
        return (
            <Motion style={{ bgRight: spring(this.state.bgRight) }}>
                {({ bgRight }) => {
                    return (
                        <div className={cssStyle.backgroundBox} style={{ right: `${bgRight}%` }}></div>
                    )
                }}
            </Motion>
        )
    }

    changeBox() {
        if (this.state.open) {
            setTimeout(() => {
                this.setState({ bgRight: -93 })
                this.setState({ menuRight: 0 })
            },150)
            this.setState({open:false})
            const { interactHide } = this.props.thisData.style;
            this.interactData(interactHide, {});
        } else {
            this.setState({ bgRight: 0 })
            this.setState({ menuRight: 93 })
            this.setState({open:true})
            const { interactShow } = this.props.thisData.style;
            setTimeout(() => {
                this.interactData(interactShow, {});
            }, 200);
        }
    }

    render() {
        const { style } = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden',pointerEvents:'none'}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize }}>
                            {this.rollMenu(style,fontSize)}
                            {this.rollBackground()}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}