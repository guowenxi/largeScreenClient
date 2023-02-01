import React from "react";
import {Cascader} from 'antd';
import ComponentBox from "../component_box";
import cssStyle from './antd_cascader.module.css';
import "./antd_cascader.css";
import { Motion, spring } from "react-motion";

import {getCompatibleSize, interactData} from "../../common/util";
import {getData} from "../../common/getDataUtil";
import {fileUrl} from "../../config";

export default class AntdCascader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [],value:[] };
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.styleList = ['antdCascaderThemeOne'];
        this.dropStyleList = ['antdCascaderDropThemeOne'];
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
                this.setState({ value: [] });
                break;
            case "resultDataInterchange":
                //接收结果数据
                if(data.data){
                    this.callBack(null,data.data);
                }
                break;
            case "returnDefault":
                //还原默认
                const { style } = this.props.thisData;
                const defaultValue = this.getEvalFun(style.defaultValueFun,[]);
                this.setState({value:defaultValue });
                break;
            case "changeSelected":
                //切换选中
                if(data.data){
                    let value = [];
                    for(let i = 1;i < 10;i ++){
                        if(data.data['id'+i]){
                            value.push(data.data['id'+i]);
                        }else{
                            break;
                        }
                    }
                    this.setState({value});
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
        this.setState({ resultData: [],value:[] });
        this.getData(this.callBack.bind(this, ''));
    }

    changeData(result,idKey,nameKey,childKey){
        result.forEach((item)=>{
            if(item.label == null){
                item.label = item[nameKey];
            }
            if(item.value == null){
                item.value = item[idKey];
            }
            if(item[childKey] && Array.isArray(item[childKey]) && item[childKey].length > 0){
                this.changeData(item[childKey],idKey,nameKey,childKey);
            }else{
                item[childKey] = null;
            }
        });
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve(result);
        }
        if (result) {
            const { style } = this.props.thisData;
            const idKey = style.idKey ? style.idKey : 'id';
            const nameKey = style.nameKey ? style.nameKey : 'name';
            const childKey = style.childKey ? style.childKey : 'children';
            this.changeData(result,idKey,nameKey,childKey);
            this.setState({ resultData: result },()=>{
                const { style } = this.props.thisData;
                const {value} = this.state;
                const defaultValue = this.getEvalFun(style.defaultValueFun,[]);
                if(value.length === 0 && defaultValue.length > 0){
                    this.setState({value:defaultValue });
                }
            });
            // this.setState({ resultData: result });
            if(this.props.thisData.firstSend){
                this.sendMessage();
            }
        }
    }

    onChange(value) {
        this.setState({value},()=>{
            this.sendMessage();
        });
    }

    sendMessage(){
        const {resultData,value} = this.state;
        let sendData = {
            selectedLevel:value.length
        };
        let findList = resultData;
        value.forEach((item,index) => {
            sendData['id'+(index+1)] = item;
            for(let i = 0;i < findList.length;i ++){
                if(findList[i].value === item){
                    sendData['name'+(index+1)] = findList[i].label;
                    findList = findList[i].children;
                    break;
                }
            }
        });
        // console.log(sendData);
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, sendData);
    }

    displayRender(label){
        return label.join('/');
    }

    filter(inputValue, path) {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    getEvalFun(funStr,defaultReturn){
        if(funStr){
            let returnFun;
            try {
                // eslint-disable-next-line no-eval
                returnFun = eval(funStr).bind(this);
            } catch (e) {}
            if(returnFun){
                return returnFun();
            }
        }
        return defaultReturn;
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
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={`${cssStyle.box} ${this.styleList[style.theme]}`} style={{ opacity,fontSize,...boxStyle }}>
                            {style.backgroundImg && <img alt={''} src={fileUrl + '/download/' + style.backgroundImg} className={cssStyle.backgroundImg} />}
                            <Cascader
                                notFoundContent={'无数据'}
                                allowClear={this.getEvalFun(style.allowClearFun,true)}
                                className={cssStyle.cascader}
                                popupClassName={this.dropStyleList[style.theme]}
                                options={resultData}
                                placeholder={style.placeholder}
                                changeOnSelect={this.getEvalFun(style.changeOnSelectFun,true)}
                                expandTrigger="hover"
                                displayRender={this.displayRender}
                                onChange={this.onChange.bind(this)}
                                value={value}
                                showSearch={{ filter:this.filter }}
                            />
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}