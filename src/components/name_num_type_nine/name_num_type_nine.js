import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from "./name_num_type_nine.module.css";
import {fileUrl} from "../../config";
import {getColumnNum} from "../../common/util";

export default class NameNumTypeNine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}};
        this.keyParams = {};
    }

    componentDidMount() {
        this.p = new Promise((resolve) => {
            this.getData(resolve)
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    componentWillUnmount() {
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey" :
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "deleteKey" :
                this.keyParams = {};
                this.reGetData();
                break;
            case "animateOn":
                this.animateOn();
                break;
            default:
                break;
        }
    }

    //重新获取数据
    reGetData() {
        this.getData();
    }

    // 获取数据
    getData(resolve) {
        if (this.props.thisData.dataSources.dataType === 1) {
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            } catch (e) {
            }
            if (resolve) {
                resolve(defaultData);
            } else {
                this.setState({data: defaultData});
            }
        } else if (this.props.thisData.dataSources.dataType === 2) {
            let params = {};
            try {
                params = JSON.parse(this.props.thisData.dataSources.dataParams);
            } catch (e) {
            }
            for (let key in this.keyParams) {
                params[key] = this.keyParams[key];
            }
            axios.get(this.props.thisData.dataSources.dataUrl, {params: params}).then((response) => {
                const result = response.data.data;
                if (result) {
                    if (resolve) {
                        resolve(result);
                    } else {
                        this.setState({data: result});
                    }
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then((data) => {
            this.setState({data});
        });
    }

    render() {
        const resultData = this.state.data;
        const {style} = this.props.thisData;
        const itemStyle = getColumnNum(style, resultData.xAxis ? resultData.xAxis : []);
        return (
            <ComponentBox id={this.props.thisData.id} thisData={this.props.thisData} style={this.props.style}
                          receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)}>
                <div className={cssStyle.typeNineBox}>
                    {resultData && resultData.xAxis && (
                        resultData.xAxis.map((item, index) =>
                            <div className={cssStyle.listItem} key={index} style={{
                                marginRight: (index % style.columnNum) !== (style.columnNum - 1) ? style.columnGap + '%' : 0,
                                marginBottom: (index < ((resultData.xAxis.length / style.columnNum) - 1) * style.columnNum)
                                    ? style.rowGap + '%' : 0,
                                width: itemStyle.width,
                                height: itemStyle.height,
                                backgroundColor: style.backgroundColor,
                                border: "1px solid " + style.borderColor
                            }}>
                                <img alt='' className={cssStyle.icon}
                                     src={(style.icon.iconList[index] ? fileUrl + '/download/' + style.icon.iconList[index].icon : '')}
                                     style={{
                                         top: style.icon.top,
                                         left: style.icon.left,
                                         width: style.icon.width,
                                         height: style.icon.height
                                     }}/>
                                <p className={cssStyle.title} style={{
                                    top: style.titleTop,
                                    left: style.titleLeft,
                                    color: style.icon.iconList[index] ? style.icon.iconList[index].color : "#fff",
                                    fontSize: style.titleFontSize
                                }}>{item}</p>
                                <ul className={cssStyle.content} style={{
                                    top: style.contentTop,
                                    left: style.contentLeft,
                                    width: style.contentWidth + '%',
                                    height: style.contentHeight + '%',
                                    fontSize: style.contentFontSize,
                                    flexDirection: style.flexDirection
                                }}>
                                    {resultData.legends && (
                                        resultData.legends.map((innerItem, innerIndex) =>
                                            <li key={innerIndex}>
                                                <span>{resultData.legends[innerIndex]}：</span>
                                                <span>{resultData.series[innerIndex][index]}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )
                    )}
                </div>
            </ComponentBox>
        );
    }
}