import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_twentySeven.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import SpringScrollbars from "../../common/springScrollbars";

export default class NameNumTypeTwentySeven extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, dataList: [] };
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
        this.itemRef = React.createRef();
        this.titleRef = React.createRef();
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

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.thisData.updateTime !== this.props.thisData.updateTime) {
            //组件数据源变更时刷新数据
            this.reGetData();
        }
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
            this.setState({ dataList: result });
            if (resolve) {
                resolve(result);
            }
        }
    }
    // 获取子级数据列表的高度
    getListHeight() {
        const { itemRef, titleRef } = this;
        if (itemRef.current && titleRef.current) {
            return itemRef.current.offsetHeight - titleRef.current.offsetHeight;
        }
        return 0;
    }
    render() {
        // eslint-disable-next-line no-unused-vars
        const { dataList } = this.state
        const { style } = this.props.thisData
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox
                style={{ ...this.props.style, overflow: 'hidden' }}
                receiveMessage={this.receiveMessage.bind(this)}
                reGetData={this.reGetData.bind(this)}
                thisData={this.props.thisData}
            >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.container} style={{ opacity, fontSize: fontSize }} >
                            <SpringScrollbars style={{ width: '100%', height: '100%' }}>
                                {
                                    dataList.length > 0 && dataList.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={cssStyle.itemBox}
                                                style={{ width: '100%', height: 100 / 7 + '%' }}
                                                ref={this.itemRef}
                                            >
                                                <div
                                                    className={cssStyle.itemHead}
                                                    style={{
                                                        fontSize: style.titleFontSizeType === 'em' ? style.titleFontSize + 'em' : style.titleFontSize,
                                                        color: style.titleColor,
                                                        lineHeight: style.titleLineHeight,
                                                        backgroundColor: style.titleBackgroundColor
                                                    }}
                                                    ref={this.titleRef}
                                                >
                                                    <span className={cssStyle.itemHeadItem}>{item.name}</span>
                                                    <span className={cssStyle.itemHeadItem}>{item.num}</span>
                                                </div>
                                                <div
                                                    className={cssStyle.itemBody}
                                                    style={{ height: this.getListHeight() + 'px' }}
                                                >
                                                    {Array.isArray(item.statistics) && <SpringScrollbars
                                                        style={{ width: '100%', height: '100%' }}
                                                        autoscrolltype={'column'}
                                                        interval={style.interval}
                                                        lineHeight={100 / item.statistics.length + '%'}
                                                        autoMove={style.autoMove}
                                                    >
                                                        {
                                                            item.statistics.map((subItem, subIndex) => {
                                                                return (
                                                                    <div
                                                                        key={subIndex}
                                                                        className={cssStyle.subItem}
                                                                        style={{
                                                                            height: '50%',
                                                                            color: style.listColor,
                                                                            fontSize: style.listFontSizeType === 'em' ?  style.listFontSize + 'em' : style.listFontSize,
                                                                            lineHeight: style.listLineHeight,
                                                                        }}
                                                                    >
                                                                        <span className={cssStyle.subItemItem}>{subItem.name}</span>
                                                                        <span className={cssStyle.subItemItem}>{subItem.num}</span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </SpringScrollbars>}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </SpringScrollbars>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}