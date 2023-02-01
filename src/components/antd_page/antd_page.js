import React from "react";
import {Pagination} from 'antd';
import ComponentBox from "../component_box";
import cssStyle from './antd_page.module.css';
import "./pagination.css";
import { Motion, spring } from "react-motion";

import {getCompatibleSize, interactData} from "../../common/util";
import {getData} from "../../common/getDataUtil";

export default class AntdPage extends React.Component {
    constructor(props) {
        super(props);
        const { style } = this.props.thisData;
        this.state = { opacity: 0, total:0,pageNo:style.pageNo?style.pageNo:1,pageSize:style.pageSize?style.pageSize:20 };
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.keyParams = {};
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if(this.props.thisData.firstLoad){
                this.getData(this.callBack.bind(this, resolve));
            }else{
                this.callBack(resolve);
            }
        });
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
            case "showComponent":
                //显示当前组件
                break;
            case "changeKey":
                //修改条件
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "cancelSelect":
                //取消选择
                break;
            case "resultDataInterchange":
                //接收结果数据
                break;
            case "returnDefault":
                //还原默认
                break;
            case "changeSelected":
                //切换选中
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.setState({ opacity: 1 });
    }

    //重新获取数据
    reGetData() {
        this.setState({ total: 0,pageNo:1 });
        this.changePage(1,this.state.pageSize);
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve(result);
        }
        if (result) {
            const data = Array.isArray(result) ? result[0]:result;
            const { style } = this.props.thisData;
            const totalKey = style.totalKey ? style.totalKey : 'total';
            this.setState({ total: data[totalKey] });
        }
    }

    changePage(pageNo, pageSize) {
        this.setState({pageNo,pageSize});
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {pageNo,pageSize});
    }

    render() {
        const {total,pageNo,pageSize} = this.state;
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={`${cssStyle.box} black-blue-page`} style={{ opacity,fontSize,justifyContent:style.justifyContent,alignItems:style.alignItems }}>
                            <Pagination current={pageNo} pageSize={pageSize} total={total} onChange={this.changePage.bind(this)} />
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}