import React from "react";
import cssStyle from "./ninghai_head.module.css";
import ReactDOM from "react-dom";
import {Button, Icon, Modal} from "antd";
import axios from "axios";

export default class CustomLabel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,label:'',loading:false,labelList:[],hasSearch:false,saveLoading:false,selectedLabel:null,selectedLabelName:''};
        this.bodyId = global.editType ? 'canvas-view' : 'root';
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    editText(e){
        this.setState({label:e.target.value});
    }

    searchLabel(){
        this.setState({loading:true});
        axios.get(this.props.serviceAddress+'/Portrait/rulePortrait/getCustomLabelList',{params:{rbacToken:this.props.token,name:this.state.label}}).then((response) => {
            // 在这儿实现 setState
            this.setState({loading:false});
            const result = response.data.data;
            if(result){
                this.setState({labelList:result,hasSearch:true});
            }else{
                this.setState({labelList:[],hasSearch:true});
            }
        }).catch((error)=>{
            // 处理请求出错的情况
            this.setState({loading:false});
        });
    }

    saveLabel(){
        this.setState({saveLoading:true});
        axios.post(this.props.serviceAddress+"/Portrait/rulePortrait/addCustomLabel", {name:this.state.label},{params:{rbacToken:this.props.token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: '添加完成。',
                });
                this.labelSelect({name:this.state.label,id:response.data.data});
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
        this.setState({selectedLabel:label,selectedLabelName:label.name,showEdit:false});
        this.props.interactClick('labelSelect',label,3);
    }

    getLabelList(){
        const {labelList,hasSearch} = this.state;
        if(hasSearch){
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
        }else{
            // return (
            //     <div className={cssStyle.editFootBox}>
            //         <Button onClick={this.changeEditShow.bind(this,false)}>取消</Button>
            //         <Button type="primary" onClick={this.searchLabel.bind(this)} loading={this.state.loading} >查询</Button>
            //     </div>
            // );
            return null;
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
                            <input className={cssStyle.editInput} value={this.state.label} onChange={this.editText.bind(this)}/>
                            <Button type="primary" onClick={this.searchLabel.bind(this)} loading={this.state.loading} >查询</Button>
                        </div>
                        {this.getLabelList()}
                    </div>
                </div>
            ),
            document.getElementById(this.bodyId)
        )
    }

    changeEditShow(flag){
        if(this.props.selectedIndex !== 3){
            return;
        }
        if(flag && this.state.selectedLabel != null){
            this.props.interactClick('labelDetail',this.state.selectedLabel,3);
        }else{
            this.setState({showEdit:flag});
        }
    }

    deleteLabel(){
        if(this.props.selectedIndex !== 3){
            return;
        }
        this.props.interactClick('labelSelectCancel',{},3);
        this.setState({showEdit:false,label:'',loading:false,labelList:[],hasSearch:false,saveLoading:false,selectedLabel:null,selectedLabelName:''});
    }

    render() {
        const {showEdit,selectedLabelName} = this.state;
        return (
            <div className={cssStyle.customLabel}>
                <span onClick={this.changeEditShow.bind(this,true)}>{selectedLabelName || '自定义'}</span>
                {selectedLabelName && <Icon type="close-circle" className={cssStyle.deleteLabel} onClick={this.deleteLabel.bind(this)} />}
                {showEdit && this.getEditDom()}
            </div>
        );
    }
}