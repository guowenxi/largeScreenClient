import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import {Motion, spring} from 'react-motion';
import {fileUrl} from "../../config";
import cssStyle from './title_warning.module.css';
import {getLinearBackground, interactData} from "../../common/util";

export default class TitleWarning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: [], showNewsItemIndex: 0,opacity:0};
        this.interactData = interactData.bind(this);
        this.keyParams = {startTime: null, endTime: null};
        this.idList = [];
        this.firstLoadData = true;
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.timer){
            clearTimeout(this.timer);
        }
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            this.getData(resolve)
        });
        this.timer = setTimeout(() => this.changeNewsShow(), 5000);
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then((data) => {
            this.setState({data,opacity:1});
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
        this.getData();
    }

    // 获取数据
    getData(resolve) {
        const {freshTime} = this.props.thisData.dataSources;
        if (freshTime) {
            setTimeout(() => {
                this.keyParams.startTime = this.keyParams.endTime;
                this.keyParams.endTime = this.formatDateTime(new Date());
                this.getData();
            }, freshTime)
        }
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
            axios.get(this.props.thisData.dataSources.dataUrl, {params: {...params,rbacToken:this.props.token}}).then((response) => {
                const result = response.data.data;
                if (result.length > 0) {
                    result.forEach((item) => {
                        if(item.id && this.idList.indexOf(item.id) < 0){
                            this.idList.push(item.id);
                            if(!this.firstLoadData){
                                this.playAudio();
                            }
                        }
                    });
                }
                this.firstLoadData = false;
                if (resolve) {
                    resolve(result);
                } else {
                    if (result.length > 0) {
                        this.setState({data: result});
                    }
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    playAudio() {
        let playPromise = document.getElementById('audio-box').play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("audio played auto");
            }).catch(() => {
                console.log("playback prevented");
            });
        }
    }

    // 展现消息
    changeNewsShow() {
        if (this.state.data.length > 0) {
            if ((this.state.showNewsItemIndex + 2) > this.state.data.length) {
                this.setState({showNewsItemIndex: 0});
            } else {
                this.setState({showNewsItemIndex: this.state.showNewsItemIndex + 1});
            }
        }
        this.timer = setTimeout(() => this.changeNewsShow(), 5000);
    }

    formatDateTime(date) {
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        let second = date.getSeconds();
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    };

    changeShowTimer(flag){
        if(flag){
            this.timer = setTimeout(() => this.changeNewsShow(), 5000);
        }else{
            if(this.timer){
                clearTimeout(this.timer);
            }
        }
    }

    //点击响应
    selItem(selectedItem) {
        const {interact} = this.props.thisData.dataSources;
        this.interactData(interact,selectedItem);
    }

    render() {
        const {data,showNewsItemIndex} = this.state;
        const lastIndex = showNewsItemIndex === 0 ? this.state.data.length - 1 : showNewsItemIndex - 1;
        const {style} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const coverWidth = this.props.getCompatibleSize(style.coverWidth);
        const coverHeight = this.props.getCompatibleSize(style.coverHeight);
        const background = getLinearBackground(style.boxColor, style.angle);
        return (
            <ComponentBox id={this.props.thisData.id} thisData={this.props.thisData} style={this.props.style}
                          receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)}>
                {data && (
                    <Motion style={{opacity:spring(this.state.opacity)}}>
                        {({opacity}) =>
                            <ul className={cssStyle.newsList} style={{background,opacity}} onMouseEnter={this.changeShowTimer.bind(this,false)} onMouseLeave={this.changeShowTimer.bind(this,true)}>
                                {data.map((outerItem, outerIndex) => {
                                    return (
                                        <Motion style={{
                                            top: spring(outerIndex === showNewsItemIndex ? 0 : 100),
                                        }} key={outerIndex}>
                                            {({top}) =>
                                                <li key={outerIndex} className={cssStyle.newsItem}
                                                    onClick={this.selItem.bind(this,outerItem)}
                                                    style={{
                                                        top: (lastIndex === outerIndex ? -top:top) + '%',
                                                        fontSize: fontSize
                                                    }}
                                                >
                                                    <img className={cssStyle.coverImg}
                                                         src={style.coverImg ? (fileUrl + '/download/' + style.coverImg) : ''}
                                                         alt=""
                                                         style={{
                                                             width: coverWidth,
                                                             height: coverHeight
                                                         }}/>
                                                    {style.list.map((innerItem, innerIndex) => {
                                                        return (
                                                            <div key={innerIndex} className={cssStyle.itemPart}
                                                                 style={{
                                                                     color: innerItem.color,
                                                                     maxWidth: innerItem.maxWidth,
                                                                 }}
                                                            >
                                                                {innerItem.type === 1 ? innerItem.key : outerItem[innerItem.key]}
                                                            </div>
                                                        );
                                                    })}
                                                </li>
                                            }
                                        </Motion>
                                    );
                                })}
                            </ul>
                        }
                    </Motion>
                )}
                <audio id="audio-box" src="/audio/warning.wav"/>
            </ComponentBox>
        );
    }
}