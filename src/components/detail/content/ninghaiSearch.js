import React from "react";
import cssStyle from "./ninghaiSearch.module.css";
import ReactDOM from "react-dom";
import {Button, Modal} from "antd";
import axios from "axios";
import {interactData} from "../../../common/util";

export default class NinghaiSearch extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,labelOne:'',labelTwo:'',loading:false,labelList:[],saveLoading:false,selectedLabel:null,selectedLabelName:''};
        this.interactData = interactData.bind(this);
        this.bodyId = global.editType ? 'canvas-view' : 'root';
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    editText(key,e){
        this.setState({[key]:e.target.value});
    }

    searchLabel(type){
        if(type === 1){
            this.setState({labelTwo:this.state.labelOne,loadingOne:true});
        }else{
            this.setState({loadingTwo:true});
        }
        const {labelOne,labelTwo} = this.state;
        axios.get(this.props.styleData.fileUrl+'/Portrait/rulePortrait/getCustomLabelList',{params:{rbacToken:this.props.token,name:type === 1 ? labelOne:labelTwo}}).then((response) => {
            // 在这儿实现 setState
            if(type === 1){
                this.setState({showEdit:true,loadingOne:false});
            }else{
                this.setState({loadingTwo:false});
            }
            const result = response.data.data;
            if(result){
                this.setState({labelList:result});
            }else{
                this.setState({labelList:[]});
            }
        }).catch((error)=>{
            // 处理请求出错的情况
            this.setState({loadingOne:false,loadingTwo:false});
        });
    }

    saveLabel(){
        this.setState({saveLoading:true});
        axios.post(this.props.styleData.fileUrl+"/Portrait/rulePortrait/addCustomLabel", {name:this.state.labelTwo},{params:{rbacToken:this.props.token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: '添加完成。',
                });
                this.labelSelect({name:this.state.labelTwo,id:response.data.data});
            }else{
                Modal.error({
                    content: response.data.message,
                });
            }
            this.setState({saveLoading:false});
        }).catch( (error) => {
            Modal.error({
                content: '请求出错！',
            });
            console.log(error);
            this.setState({saveLoading:false});
        });
    }

    labelSelect(label){
        this.setState({labelOne:label.name,showEdit:false});
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, label);
    }

    getLabelList(){
        const {labelList} = this.state;
        if(labelList.length > 0){
            return (
                <>
                    <div className={cssStyle.messageOne}>系统识别出多个相关事件类型，请选择你想查询的事件类型：</div>
                    <div className={cssStyle.labelListBox}>
                        {labelList.map((item,index)=>
                            <div key={index} className={cssStyle.labelItem} onClick={this.labelSelect.bind(this,item)}>{item.name}</div>
                        )}
                    </div>
                    <div className={cssStyle.messageTwo}>以上事件类型都不是我想要的，将该事件类型添加为自定义类型：</div>
                    <div className={cssStyle.editFootBox}>
                        <Button type="primary" onClick={this.saveLabel.bind(this)} loading={this.state.saveLoading} >添加为自定义类型</Button>
                    </div>
                </>
            );
        }else{
            return (
                <>
                    <div className={cssStyle.messageOne}>无相关事件类型内容，是否将该类型添加为自定义类型？</div>
                    <div className={cssStyle.editFootBox}>
                        <Button type="primary" onClick={this.saveLabel.bind(this)} loading={this.state.saveLoading} >添加为自定义类型</Button>
                    </div>
                </>
            );
        }
    }

    getEditDom(){
        return ReactDOM.createPortal(
            (
                <div className={cssStyle.customLabelEditBg} onClick={(e)=>{e.stopPropagation();}}>
                    <div className={cssStyle.customLabelEditBoxBg} />
                    <div className={cssStyle.customLabelEditBox}>
                        <div className={cssStyle.customLabelHead}>
                            <span>自定义事件分析</span>
                            <div className={cssStyle.closeButton} onClick={this.changeEditShow.bind(this,false)} />
                        </div>
                        <div className={cssStyle.editRow}>
                            <div>事件类型：</div>
                            <input className={cssStyle.editInput} value={this.state.labelTwo} onChange={this.editText.bind(this,'labelTwo')}/>
                            <Button type="primary" onClick={this.searchLabel.bind(this)} loading={this.state.loadingTwo} >查询</Button>
                        </div>
                        {this.getLabelList()}
                    </div>
                </div>
            ),
            document.getElementById(this.bodyId)
        )
    }

    changeEditShow(flag){
        this.setState({showEdit:flag});
    }

    clearLabel(){
        this.setState({labelOne:'',showEdit:false});
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {});
    }

    render() {
        const {showEdit} = this.state;
        return (
            <div className={cssStyle.customLabel} style={this.props.style}>
                <div className={cssStyle.editRow}>
                    <div>自定义事件分析：</div>
                    <input className={cssStyle.editInput} value={this.state.labelOne} onChange={this.editText.bind(this,'labelOne')}/>
                    <Button className={cssStyle.button} type="primary" onClick={this.searchLabel.bind(this,1)} loading={this.state.loadingOne} >分析</Button>
                    <Button className={cssStyle.button} onClick={this.clearLabel.bind(this,1)} >清空</Button>
                </div>
                {showEdit && this.getEditDom()}
            </div>
        );
    }
}