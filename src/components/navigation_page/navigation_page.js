import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from './navigation_page.module.css';

export default class NavigationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showPage: false, pageUrl: ''};
        this.keyParams = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            this.getBodyData(resolve)
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then((data) => {
            this.setState({data});
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey" :
                this.keyParams[data.keyName] = data.data;
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
        this.getBodyData();
    }

    getBodyData(resolve) {
        if (this.props.thisData.dataSources.dataType === 1) {
            let defaultData = {};
            defaultData = this.props.thisData.dataSources.defaultData;
            resolve(defaultData);
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
                resolve(result);
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    // 展示集成的页面
    showPage(bo, item) {
        if (bo) {
            this.setState({pageUrl: item.url});
            this.setState({showPage: true});
        } else {
            this.setState({pageUrl: ''});
            this.setState({showPage: false});
        }
    }

    render() {
        const {style} = this.props.thisData;
        return (
            <ComponentBox id={this.props.thisData.id} thisData={this.props.thisData} style={this.props.style}
                          receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)}>
                <ul className={cssStyle.stateBox}>
                    {style.stateList.map((item, index) => {
                        return (
                            <li key={index} className={cssStyle.stateItem}
                                onClick={this.showPage.bind(this, true, item)}
                                style={{
                                    top: item.itemTop,
                                    left: item.itemLeft,
                                    width: item.itemWidth,
                                    height: item.itemHeight
                                }}>
                                <p>{item.text}</p>
                            </li>
                        );
                    })}
                </ul>
                <div className={cssStyle.iframeBox} style={{
                    display: this.state.showPage ? 'block' : 'none'
                }}>
                    <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no"
                            allowtransparency="yes" title="navigation"
                            src={this.state.pageUrl}></iframe>
                    <p className={cssStyle.iframeBtn} onClick={this.showPage.bind(this, false)}>关闭</p>
                </div>
            </ComponentBox>
        );
    }
}