import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from './timeline.module.css';
import {Scrollbars} from "react-custom-scrollbars";
import EmptyDom from "../../common/emptyDom";

export default class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: [], selectIndex: 0, loading:true};
        this.keyParams = {};
    }

    componentWillUnmount() {
    }

    componentDidMount() {
        this.p = new Promise((resolve) => {
            this.getData(resolve)
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then((data) => {
            this.setState({data,loading:false});
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey" :
                for(let key in data.data){
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
        this.setState({loading:true});
        if (this.props.thisData.dataSources.dataType === 1) {
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            } catch (e) {
            }
            if (resolve) {
                resolve(defaultData);
            } else {
                this.setState({data: defaultData,loading:false});
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
                if (resolve) {
                    resolve(result);
                } else {
                    this.setState({data: result,loading:false});
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    render() {
        const list = this.state.data ? this.state.data : [];
        const {style} = this.props.thisData;
        if(style.title == null){
            style.title = {};
        }
        if(style.content == null){
            style.content = {};
        }
        const {title,content} = style;
        const titleSize = this.props.getCompatibleSize(title.size);
        const titleLineHeight = this.props.getCompatibleSize(title.lineHeight);
        const contentSize = this.props.getCompatibleSize(content.size);
        const contentLineHeight = this.props.getCompatibleSize(content.lineHeight);
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox id={this.props.thisData.id} thisData={this.props.thisData} style={this.props.style}
                          receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)}>
                <Scrollbars style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: style.bgColor,
                    fontSize:fontSize
                }}>
                    <ul className={cssStyle.timeline}>
                        {
                            (list.length > 0 || this.state.loading) ? list.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <div className={cssStyle.point}>
                                            <div className={cssStyle.main} />
                                        </div>
                                        <div className={cssStyle.liright}>
                                            <p className={cssStyle.title} style={{fontSize:titleSize,color:title.color,lineHeight:titleLineHeight}}>{item[title.key]}</p>
                                            <p className={cssStyle.content} style={{fontSize:contentSize,color:content.color,lineHeight:contentLineHeight,backgroundColor:style.bgColorContent}}>{item[content.key]}</p>
                                        </div>
                                    </li>
                                )
                            }) : (<EmptyDom description={<span style={{fontSize:'2.5vh'}}>暂无数据</span>}/>)
                        }
                    </ul>
                </Scrollbars>
            </ComponentBox>
        );
    }
}
