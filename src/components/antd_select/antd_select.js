import React from "react";
import {Select} from 'antd';
import ComponentBox from "../component_box";
import cssStyle from './antd_select.module.css';
import "./antd_select.css";
import { Motion, spring } from "react-motion";

import {getCompatibleSize, interactData} from "../../common/util";
import {getData} from "../../common/getDataUtil";
import {fileUrl} from "../../config";

export default class AntdSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [] };
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.styleList = ['antdSelectThemeOne'];
        this.dropStyleList = ['antdSelectDropThemeOne'];
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
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "cancelSelect":
                //取消选择
                this.setState({ value: undefined });
                break;
            case "changeSelected":
                for (let key in data.data) {
                    const subData = data.data[key];
                    const { resultData } = this.state;
                    const { style } = this.props.thisData;
                    const idKey = style.idKey ? style.idKey : 'id';
                    for (let i = 0; i < resultData.length; i++) {
                        if (subData + '' === resultData[i][key] + '') {
                            if(data.isInteract !== 2){
                                const { interact } = this.props.thisData.dataSources;
                                this.interactData(interact, resultData[i]);
                            }
                            this.setState({ value: resultData[i][idKey] });
                            break;
                        }
                    }
                    break;
                }
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
        this.setState({ resultData: [],value:undefined });
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve(result);
        }
        if (result) {
            this.setState({ resultData: result });
        }
    }

    onChange(value) {
        this.setState({value});
        const { resultData } = this.state;
        const { style } = this.props.thisData;
        const idKey = style.idKey ? style.idKey : 'id';
        for (let i = 0; i < resultData.length; i++) {
            if (value + '' === resultData[i][idKey] + '') {
                const { interact } = this.props.thisData.dataSources;
                this.interactData(interact, resultData[i]);
                break;
            }
        }
    }

    render() {
        const {value,resultData} = this.state;
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const boxStyle = {
            backgroundColor: style.color,
            borderWidth: style.borderWidth,
            borderStyle: 'solid',
            borderColor: style.borderColor,
            borderRadius: style.borderRadius
        };
        const idKey = style.idKey ? style.idKey : 'id';
        const nameKey = style.nameKey ? style.nameKey : 'name';
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={`${cssStyle.box} ${this.styleList[style.theme]}`} style={{ opacity,fontSize,...boxStyle }}>
                            {style.backgroundImg && <img alt={''} src={fileUrl + '/download/' + style.backgroundImg} className={cssStyle.backgroundImg} />}
                            <Select
                                showSearch
                                className={cssStyle.select}
                                placeholder={style.placeholder}
                                optionFilterProp="children"
                                onChange={this.onChange.bind(this)}
                                value={value}
                                dropdownClassName={this.dropStyleList[style.theme]}
                                dropdownStyle={{fontSize}}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {style.allSelectName && <Select.Option value={''}>{style.allSelectName}</Select.Option>}
                                {resultData && Array.isArray(resultData) && resultData.map((item,index)=>
                                    <Select.Option key={index} value={item[idKey]}>{item[nameKey]}</Select.Option>
                                )}
                            </Select>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}