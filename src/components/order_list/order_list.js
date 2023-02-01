import React from "react";

import ComponentBox from "../component_box";
import cssStyle from './order_list.module.css';
import {interactData} from "../../common/util";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";

export default class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {resultData: [], selectIndex: 0, opacity: 0};
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
    }

    componentWillUnmount() {
    }

    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.p.then(() => {
            this.setState({opacity:1});
        })
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
    reGetData(){
        this.setState({resultData:[]});
        this.getData(this.callBack.bind(this,''));
    }

    //获取数据后回调
    callBack(resolve,result){
        if(result){
            this.setState({resultData:result.list ? result.list : []});
            if(resolve){
                resolve(result);
            }
        }
    }

    // 选择筛选类型
    selType(item) {
        this.props.thisData.style.typeList.forEach((typeItem, typeIndex)=>{
            typeItem.selected = false;
        });
        item.selected = true;
        this.keyParams[item.key] = item.value;
        this.getData();
    }

    itemClick(clickItem){
        const {interact} = this.props.thisData.dataSources;
        this.interactData(interact,clickItem);
    }

    moreClick(){
        const {moreInteract} = this.props.thisData.style;
        this.interactData(moreInteract);
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox id={this.props.thisData.id} thisData={this.props.thisData} style={this.props.style}
                          receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div style={{fontSize,opacity}} className={cssStyle.box}>
                            <p className={cssStyle.selectTitle}>{style.title}</p>
                            {style.hasSearch && (
                                <ul className={cssStyle.selectBox}>
                                    {
                                        style.typeList.map((item, index) => {
                                            return (
                                                <li key={index} onClick={this.selType.bind(this, item)}>
                                        <span style={{
                                            fontWeight: item.selected ? "bold" : "normal"
                                        }}>{item.name}</span>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            )}
                            <ul className={cssStyle.selectBox}>
                                <li onClick={this.moreClick.bind(this)}>
                                    <span>更多</span>
                                </li>
                            </ul>
                            <ul className={cssStyle.listBox} style={{color:style.fontColor}}>
                                {this.state.resultData.map((item, index) => {
                                    return (
                                        <li className={cssStyle.listItem} key={index} onClick={this.itemClick.bind(this,item)}>
                                            {(index+1)+'. '+item[style.nameKey]}<span>{item.num}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}