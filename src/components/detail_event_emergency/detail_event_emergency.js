import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from './detail_event_emergency.module.css';
import { Scrollbars } from "react-custom-scrollbars";
import {getCompatibleSize} from "../../common/util";

export default class DetailEventEmergency extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showComponent: false, data: {} };
        this.keyParams = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey":
            case "dataInterchange":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
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
                this.setState({ data: defaultData });
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
            axios.get(this.props.thisData.dataSources.dataUrl, { params: params }).then((response) => {
                const result = response.data.data;
                if (resolve) {
                    resolve(result);
                } else {
                    this.setState({ data: result });
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    render() {
        const detail = this.state.data ? this.state.data : {};
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize?style.fontSize:'2vh');
        const padding = this.props.getCompatibleSize(style.padding);
        const contentName = style.contentType ? style.contentType : 'detailEventCangnan';
        const DetailContent = require(`./content/${contentName}`).default;
        return (
            <ComponentBox
                id={this.props.thisData.id}
                thisData={this.props.thisData}
                receiveMessage={this.receiveMessage.bind(this)}
                reGetData={this.reGetData.bind(this)}
                style={this.props.style}
            >
                <Scrollbars className={cssStyle.main} style={{ backgroundColor: style.bgColor }}>
                    <DetailContent detail={detail} padding={padding} fontSize={fontSize}/>
                </Scrollbars>
            </ComponentBox>
        )
    }
}