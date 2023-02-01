import React from "react";
import cssStyle from "./orderSendOne.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {Button, Checkbox, Icon, Modal} from "antd";
import axios from "axios";
import {interactData} from "../../../common/util";

const { confirm } = Modal;

export default class OrderSendOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checkAll:false,indeterminate:false,selectedId:[],detailId:''};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime && this.props.thisData.showStatus){
            this.setState({checkAll:false,indeterminate:false,selectedId:[],detailId:''});
        }
    }

    changAllSelected(){
        if(this.state.checkAll){
            this.setState({checkAll:false,indeterminate:false,selectedId:[]});
        }else{
            const { detail } = this.props;
            this.setState({checkAll:true,indeterminate:false,selectedId:detail.map((people)=>{return people.id})});
        }
    }

    changeOneSelected(people){
        const { detail } = this.props;
        let {selectedId} = this.state;
        const index = selectedId.indexOf(people.id);
        if(index >= 0){
            selectedId.splice(index,1);
        }else{
            selectedId.push(people.id);
        }
        let checkAll = false;
        let indeterminate = false;
        if(selectedId.length === detail.length){
            checkAll = true;
        }else if(selectedId.length > 0){
            indeterminate = true;
        }
        this.setState({checkAll,indeterminate,selectedId})
    }

    sendOrder(){
        if(this.state.selectedId.length === 0){
            Modal.info({
                content: '请选择小队。',
            });
            return;
        }
        confirm({
            title: '确定要向所选小队发送指令吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    rbacToken: this.props.token,
                    teamIds: this.state.selectedId.join(',')
                };
                return new Promise((resolve) => {
                    axios.post(this.props.styleData.fileUrl, sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '已发送。',
                            });
                            this.setState({checkAll:false,indeterminate:false,selectedId:[]});
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch(function (error) {
                        resolve();
                        Modal.error({
                            content: '发送失败',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    groupClick(group){
        this.setState({detailId:group.id});
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, group);
    }

    render() {
        const { detail } = this.props;
        const {selectedId,detailId} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.headBox}>
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        checked={this.state.checkAll}
                        className={cssStyle.checkBox}
                        onClick={this.changAllSelected.bind(this)}
                    >
                        <div className={cssStyle.text}>全选</div>
                    </Checkbox>
                    <Button type="primary" onClick={this.sendOrder.bind(this)} className={cssStyle.button} >一键指令</Button>
                </div>
                <Scrollbars style={{height:'calc(100% - 2.5em)'}}>
                    {detail && Array.isArray(detail) && detail.map((group,index)=>
                        <div className={`${cssStyle.groupLineBox} ${detailId === group.id ? cssStyle.detailSelected:''}`} key={index}>
                            <Checkbox checked={selectedId.indexOf(group.id) >= 0} className={cssStyle.checkBox} onClick={this.changeOneSelected.bind(this,group)}>
                                <div className={cssStyle.groupBox}>
                                    <div className={cssStyle.row}>
                                        <span className={cssStyle.no}>第{group.no}小队（{group.member}人）</span>
                                        <span className={cssStyle.name}>小队长：{group.head}</span>
                                        <span className={cssStyle.name}>{group.headPhone}</span>
                                    </div>
                                    <div className={cssStyle.row}>
                                        <span className={cssStyle.peopleNum}>区块内人数：{group.peopleNum}</span>
                                        <span className={cssStyle.name}>网格长：{group.leader}</span>
                                        <span className={cssStyle.name}>{group.leaderPhone}</span>
                                    </div>
                                </div>
                            </Checkbox>
                            <div className={cssStyle.detail} onClick={this.groupClick.bind(this,group)}>
                                <div>详情</div>
                                <Icon type="right" className={cssStyle.detailIcon} />
                            </div>
                        </div>
                    )}
                </Scrollbars>
            </div>
        );
    }
}