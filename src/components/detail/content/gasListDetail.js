import React from "react";
import cssStyle from './gasListDetail.module.css';

import { interactData } from "../../../common/util";
import {Modal, Pagination} from "antd";

import './gasListDetail.css';

import uncheck from "../images/uncheck.png";
import checked from "../images/checked.png";

export default class GasListDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedList:[]};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    componentDidUpdate(prveProps) {
        if (prveProps.changeKeyTime !== this.props.changeKeyTime && this.props.changeKeyTime) {
            this.setState({selectedList:[]},()=>{
                this.interactAction();
            });
        }
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //切换选中
    changeSelected(id){
        const {selectedList} = this.state;
        const index = selectedList.indexOf(id);
        if(index >= 0){
            selectedList.splice(index,1);
        }else{
            if(selectedList.length >= 8){
                Modal.info({
                    content: '最多只能选择八个监测设备！',
                });
                return;
            }
            selectedList.push(id);
        }
        this.setState({selectedList},()=>{
            this.interactAction();
        });
    }

    interactAction(){
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {id:this.state.selectedList.join(',')});
    }

    // 渲染列表
    getRenderList(list) {
        return (
            Array.isArray(list) && list.length > 0 &&
            <div className={cssStyle.listInnerBox}>
                {
                    list.map(({ warehouse, gas, explosionLimit, id }, index, arr) => {
                        const selected = this.state.selectedList.indexOf(id) >= 0;
                        return (
                            <div
                                className={cssStyle.listItem}
                                key={index}
                                style={
                                    {
                                        backgroundColor: index % 2 !== 0 ? 'rgba(60,255,253,0.4)' : 'transparent',
                                        borderBottom: arr.length - 1 === index ? 'solid 1px #3cfffd' : 0
                                    }
                                }
                                onClick={this.changeSelected.bind(this,id)}
                            >
                                <img alt={''} src={selected ? checked:uncheck} className={selected?'':cssStyle.uncheck} />
                                <span className={`${cssStyle.firstContent} ${cssStyle.onlyLine}`} title={warehouse}>{warehouse}</span>
                                <span
                                    className={`${cssStyle.marginLeft} ${cssStyle.secondContent} ${cssStyle.onlyLine}`}
                                    title={gas}
                                >
                                    {gas}
                                </span>
                                <span
                                    className={`${cssStyle.marginLeft} ${cssStyle.thirdContent} ${cssStyle.onlyLine}`}
                                    title={explosionLimit}
                                >
                                    {explosionLimit}
                                </span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    render() {
        const { list, total } = this.props.detail;
        let list1 = [], list2 = [], list3 = [];
        if (Array.isArray(list)) {
            list1 = list.slice(0, 16);
            list2 = list.slice(16, 32);
            list3 = list.slice(32, 48);
        }
        return (
            <div style={this.props.style} className={`${cssStyle.container} gasListDetailBox`} >
                <div className={cssStyle.listBox}>
                    {[list1, list2, list3].map((item, index) => {
                        return <React.Fragment key={index}>{this.getRenderList(item)}</React.Fragment>
                    })}
                </div>
                <Pagination
                    total={total}
                    pageSize={48}
                    onChange={(pageNo) => this.props.changeKeyParams({ ...this.props.keyParams, pageNo, pageSize: 48 })}
                />
            </div>
        );
    }
}