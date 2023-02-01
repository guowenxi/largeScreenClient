import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./text_search.module.css";
import "./text_search.css";
import {Motion, spring} from "react-motion";
import {changeComponentShow, getCompatibleSize, interactData} from "../../common/util";
import searchButton from "./images/search.svg";
import {getData} from "../../common/getDataUtil";
import {Select} from "antd";
import axios from "axios";
import {fileUrl} from "../../config";

const { Option } = Select;

export default class TextSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show:false, opacity:0, mouseDown: false, text:'', value:undefined, data:[]};
        this.keyParams = {};
        this.changeComponentShow = changeComponentShow.bind(this);
        this.interactData = interactData.bind(this);
        this.getData = getData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    componentDidUpdate(prevProps){
        //组件隐藏时播放顺序复位
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus && this.props.thisData.showStatus){
            const {style} = this.props.thisData;
            if(style.showAction){
                this.search();
            }
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                const {style} = this.props.thisData;
                if(style.searchOpen){
                    this.setState({ data: [], value:undefined });
                }
                break;
            case "showComponent":
                //显示当前组件
                this.changeComponentShow(true);
                break;
            case "hideComponent":
                //显示当前组件
                this.changeComponentShow(false);
                break;
            case "cancelSelect":
                //取消选择
                this.setState({ text:'', value:undefined });
                if(data.data == null || !data.data.cancelOnly){
                    const { interact } = this.props.thisData.dataSources;
                    this.interactData(interact, {});
                }
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    //搜索按钮鼠标按下状态切换
    mouseDown(flag){
        this.setState({mouseDown:flag});
    }

    //搜索点击响应
    search(){
        const {interact} = this.props.thisData.dataSources;
        const {style} = this.props.thisData;
        if(style.searchOpen){
            this.interactData(interact,{id:this.state.value});
        }else{
            this.interactData(interact,{id:this.state.text,name:this.state.text,value:this.state.value});
        }
    }

    changeText(event){
        this.setState({text:event.target.value},()=>{
            const {style} = this.props.thisData;
            if(style.buttonShow === false){
                this.search();
            }
        });
    }

    handleSearch(value){
        if (value) {
            const {dataSources} = this.props.thisData;
            const {style} = this.props.thisData;
            let sendData = {};
            sendData[style.keyName] = value;
            axios.get(dataSources.dataUrl,{params:{...this.keyParams,...sendData,rbacToken:this.props.token}}).then((response) => {
                if(response.data.data && Array.isArray(response.data.data)){
                    this.setState({ data: response.data.data });
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        } else {
            this.setState({ data: [] });
        }
    }

    handleChange(value,e){
        this.setState({ value },()=>{
            const {style} = this.props.thisData;
            if(style.buttonShow === false){
                this.search();
            }
        });
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const searchStyle = {backgroundColor:style.fontBgColor,color:style.fontColor,borderColor:style.borderColor};
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div style={{fontSize,opacity:opacity}} className={cssStyle.box} >
                            {style.backgroundImg && <img alt={''} src={fileUrl + '/download/' + style.backgroundImg} className={cssStyle.backgroundImg} />}
                            {style.searchOpen ? (
                                <Select
                                    className={`${cssStyle.select} text_search`}
                                    showSearch
                                    placeholder={'请输入关键字'}
                                    style={searchStyle}
                                    value={this.state.value}
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearch.bind(this)}
                                    onChange={this.handleChange.bind(this)}
                                    notFoundContent={null}
                                    dropdownClassName={style.dropDownStyle}
                                    dropdownStyle={{fontSize}}
                                >
                                    {this.state.data.map(d => <Option key={d.id}>{d.name}</Option>)}
                                </Select>
                            ):(
                                <input className={cssStyle.input} value={this.state.text} style={searchStyle} placeholder={style.placeholder ? style.placeholder:'请输入关键字'} onChange={this.changeText.bind(this)}/>
                            )}
                            {style.buttonShow !== false && (
                                <div
                                    className={cssStyle.buttonBox}
                                    style={{backgroundColor:this.state.mouseDown ? style.mouseDownBgColor:style.buttonBgColor}}
                                    onMouseDown={this.mouseDown.bind(this,true)}
                                    onMouseUp={this.mouseDown.bind(this,false)}
                                >
                                    <img alt='' src={searchButton} onClick={this.search.bind(this)}/>
                                </div>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}