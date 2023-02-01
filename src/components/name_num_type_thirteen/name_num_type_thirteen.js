import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_thirteen.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import { fileUrl } from "../../config";
import { getCompatibleSize, getColumnNum } from "../../common/util";

import NameNumTypeTenContent from "../name_num_type_ten/name_num_type_ten_content";

export default class NameNumTypeThirteen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], selectedIndex: 0, show: false, showBox: false };
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => { this.getData(this.callBack.bind(this, resolve)) });
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
        this.p.then(() => {
            this.setState({ opacity: 1 });
        })
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

    render() {
        const { style } = this.props.thisData;
        let resultData = this.state.resultData.slice();
        const fontSize = getCompatibleSize(style.fontSize);
        const { icon, title, outRow, sub } = style;
        const iconWidth = getCompatibleSize(icon.width);
        const iconHeight = getCompatibleSize(icon.height);
        if (style.startEmptyNumber && style.startEmptyNumber > 0) {
            for (let i = 0; i < style.startEmptyNumber; i++) {
                resultData.unshift({ "sub": [] })
            }
        }
        if (style.endEmptyNumber && style.endEmptyNumber > 0) {
            for (let i = 0; i < style.endEmptyNumber; i++) {
                resultData.push({ "sub": [] })
            }
        }
        let itemStyle;
        if (resultData) {
            itemStyle = getColumnNum(outRow, resultData);
        }
        const titleStyle = {
            fontSize: title.fontSize+'em',
            color: title.fontColor,
            justifyContent: title.titleJustifyContent,
            alignItems: title.titleAlignItems,
            width: title.width,
            height: title.height,
            left: title.left,
            top: title.top,
        };
        const subStyle = {
            width: sub.width,
            height: sub.height,
            left: sub.left,
            top: sub.top,
        };
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, flexDirection: outRow.flexDirection, backgroundColor: style.backgroundColor,fontSize }}>
                            {resultData.map((item, index) => {
                                let iconUrl;
                                if (icon.iconKey && icon.iconList.length > 0) {
                                    icon.iconList.forEach((iconItem) => {
                                        if (iconItem.num == item[icon.iconKey]) {//eslint-disable-line
                                            iconUrl = iconItem.icon;
                                        }
                                    });
                                }
                                if (item) {
                                    return (
                                        <div className={cssStyle.box} style={{ ...itemStyle, opacity,backgroundColor:outRow.allBackgroundColor }} key={index}>
                                            {icon.iconKey && <img alt="" src={iconUrl ? fileUrl + '/download/' + iconUrl : ''} className={cssStyle.icon} style={{ width: iconWidth, height: iconHeight, left: icon.left, top: icon.top }} />}
                                            <div className={cssStyle.titleBox} style={titleStyle}>{item.title}</div>
                                            <div className={cssStyle.subBox} style={subStyle}>
                                                <NameNumTypeTenContent style={{ opacity }} thisData={this.props.thisData} resultData={item.sub} />
                                            </div>
                                        </div>
                                    )
                                }else{
                                    return <div className={`${cssStyle.item} ${cssStyle.flex}`} style={{...itemStyle}} key={index} />;
                                }
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}