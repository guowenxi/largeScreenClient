import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from './sort_list.module.css';
import {Scrollbars} from "react-custom-scrollbars";
import {getCompatibleSizeList, interactData} from "../../common/util";

export default class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: [], selectIndex: 0};
        this.keyParams = {};
        this.getCompatibleSizeList = getCompatibleSizeList.bind(this);
        this.interactData = interactData.bind(this);
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
            this.setState({data});
            this.selItem(data[0]);
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "dataInterchange":
                if(data.data.notClick){
                    this.notClick = data.data.notClick;
                }
            case "changeKey" ://eslint-disable-line
                for(let key in data.data){
                    this.keyParams[key] = data.data[key];
                }
                // this.keyParams[data.keyName] = data.data;
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
                if(!this.notClick){
                    this.selItem(defaultData[0]);
                }
                this.notClick = false;
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
                if(result){
                    if (resolve) {
                        resolve(result);
                    } else {
                        this.setState({data: result});
                        if(!this.notClick){
                            this.selItem(result[0]);
                        }
                        this.notClick = false;
                    }
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    // 选择项
    selItem(selectedItem) {
        if(selectedItem != null ){
            this.state.data.forEach((item)=>{
                item.selected = false;
            });
            selectedItem.selected = true;
            this.setState({});
        }
        const {interact} = this.props.thisData.dataSources;
        this.interactData(interact,selectedItem);
    }

    render() {
        const list = this.state.data ? this.state.data : [];
        const {style} = this.props.thisData;
        if(style.one == null){
            style.one = {};
        }
        if(style.two == null){
            style.two = {};
        }
        const {one,two} = style;
        const padding = this.getCompatibleSizeList(style.padding);
        const oneSize = this.props.getCompatibleSize(one.size);
        const oneLineHeight = this.props.getCompatibleSize(one.lineHeight);
        const twoSize = this.props.getCompatibleSize(two.size);
        const twoLineHeight = this.props.getCompatibleSize(two.lineHeight);
        return (
            <ComponentBox id={this.props.thisData.id} thisData={this.props.thisData} style={this.props.style}
                          receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: style.bgColor
                }}>
                    <Scrollbars >
                        <ul className={cssStyle.listBox}>
                            {list.map((item, index) => {
                                return (
                                    <li className={cssStyle.listItem} key={index}  onClick={this.selItem.bind(this, item)}
                                        style={{
                                            backgroundColor: item.selected ? style.bgColorSelect : style.lineBgColor,
                                            padding,
                                        }}>
                                        <div className={cssStyle.title} style={{fontSize:oneSize,color:(item.selected ? one.colorSelect : one.color),lineHeight:oneLineHeight}}>{item[one.key]}</div>
                                        <div className={cssStyle.content} style={{fontSize:twoSize,color:(item.selected ? two.colorSelect : two.color),lineHeight:twoLineHeight}}>{item[two.key]}</div>
                                    </li>
                                )
                            })}
                        </ul>
                    </Scrollbars>
                </div>
            </ComponentBox>
        );
    }
}