import React from "react";
import {Icon} from 'antd';
import ComponentBox from "../component_box";
import cssStyle from "./name_img_list.module.css";
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import {fileUrl} from "../../config";
import axios from "axios";
import {interactData} from "../../common/util";

export default class NameImgList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false, opacity:0,searchStr:'',resultData:[],pageNum:1,allPage:1};
        this.interactData = interactData.bind(this);
        this.keyParams = {};
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(1,resolve)});
        if(this.props.firstLoad === false){
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
            case "changeKey" :
                let searchStr;
                for(let key in data.data){
                    this.keyParams[key] = data.data[key];
                    searchStr = data.data[key];
                }
                if(this.props.thisData.dataSources.dataType === 2){
                    this.reGetData();
                }else{
                    this.setState({searchStr});
                }
                break;
            case "dataInterchange":
                //显示当前组件
                this.setState({resultData:data.data});
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.p.then(() => {
            this.setState({opacity:1});
        })
    }

    //重新获取数据
    reGetData(){
        this.setState({resultData:[]});
        this.getData(1);
    }

    //获取数据
    getData(pageNum,resolve){
        const {style} = this.props.thisData;
        if(this.props.thisData.dataSources.dataType === 1){
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            }catch (e) {
            }
            if(Object.prototype.toString.call(defaultData) === '[object Object]'){
                this.setState({resultData:defaultData.list,pageNum:pageNum,allPage:Math.ceil(defaultData.total/style.pageSize)});
            }else{
                this.setState({resultData:defaultData});
            }
            if(resolve){
                resolve(defaultData);
            }
        }else if(this.props.thisData.dataSources.dataType === 2){
            let params = {};
            try {
                params = JSON.parse(this.props.thisData.dataSources.dataParams);
            }catch (e) {}
            axios.get(this.props.thisData.dataSources.dataUrl,{params:{...params,...this.keyParams,pageSize:style.pageSize,pageNo:pageNum}}).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if(result){
                    this.setState({resultData:result.list,pageNum:pageNum,allPage:Math.ceil(result.total/style.pageSize)});
                    if(resolve){
                        resolve(result);
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    //翻页
    nextPage(type){
        let {pageNum,allPage} = this.state;
        if(type === 1 && pageNum !== 1){
            this.getData(pageNum-1);
        }else if(type === 2 && pageNum < allPage){
            this.getData(pageNum+1);
        }
    }

    //点击响应
    selItem(selectedItem) {
        const {interact} = this.props.thisData.dataSources;
        this.interactData(interact,selectedItem);
    }

    render() {
        const {searchStr} = this.state;
        const {style} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const lineHeight = this.props.getCompatibleSize(style.lineHeight);
        const pageHeight = style.hasPage ? this.props.getCompatibleSize(style.pageHeight) : 0;
        const imgStyle={
            width:style.imgWidth,
            height:style.imgHeight,
            top:style.top,
            left:style.left
        };
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div style={{opacity:opacity,fontSize,color:style.fontColor}} className={cssStyle.box}>
                            <div className={cssStyle.content} style={{height:style.hasPage ? 'calc(100% - '+pageHeight+')':'100%'}}>
                                <Scrollbars>
                                    {this.state.resultData.map((item,index) =>{
                                        if(searchStr && item[style.key] && item[style.key].indexOf(searchStr) < 0){
                                            return null;
                                        }else{
                                            return (
                                                <div className={cssStyle.itemBox} key={index} style={{height:lineHeight,lineHeight}} onClick={this.selItem.bind(this,item)}>
                                                    <div className={cssStyle.title} style={{left:style.textLeft,top:style.textTop}}>{item[style.key]}</div>
                                                    {style.icon && <img alt='' src={fileUrl + '/download/' + style.icon} className={cssStyle.img}  style={imgStyle}/>}
                                                </div>
                                            );
                                        }
                                    })}
                                </Scrollbars>
                            </div>
                            {style.hasPage && (
                                <div className={cssStyle.pageBox} style={{height:pageHeight}}>
                                    <Icon type="left-circle" style={{fontSize:fontSize}} className={this.state.pageNum === 1 ? cssStyle.none:cssStyle.has} onClick={this.nextPage.bind(this,1)}/>
                                    <Icon type="right-circle" style={{fontSize:fontSize}} className={this.state.pageNum === this.state.allPage ? cssStyle.none:cssStyle.has} onClick={this.nextPage.bind(this,2)}/>
                                </div>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}