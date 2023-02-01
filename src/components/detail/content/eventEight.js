import React from "react";
import cssStyle from './eventEight.module.css';
import ReactDOM from "react-dom";
import {Input, Select} from "antd";
import "../../antd_select/antd_select.css";
import axios from "axios";

const { TextArea } = Input;

export default class EventEight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,departmentList:[],department:undefined,opinion:''};
        this.bodyId = global.editType ? 'canvas-view' : 'root';
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    //组件加载触发函数
    componentDidMount() {
        if(this.props.thisData.style.depListUrl){
            axios.get(this.props.thisData.style.depListUrl,{params:{rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                if(response.data.success && response.data.data){
                    this.setState({departmentList:response.data.data});
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    changeEditShow(flag){
        this.setState({showEdit:flag});
    }

    changeData(key,type,event){
        this.setState({[key]:type===1?event.target.value:event});
    }

    editDom(){
        const {department,departmentList,opinion} = this.state;
        return ReactDOM.createPortal(
            (
                <div className={cssStyle.editBox} style={{fontSize:this.props.style.fontSize}}>
                    <div className={cssStyle.editContent}>
                        <div className={cssStyle.editHead}>事件分配</div>
                        <div className={`${cssStyle.editRow} antdSelectThemeOne`}>
                            <div className={cssStyle.editTitle}>责任单位</div>
                            <Select
                                value={department}
                                className={cssStyle.input}
                                onChange={this.changeData.bind(this,'department',2)}
                                placeholder="请选择责任单位"
                                dropdownClassName={'antdSelectDropThemeOne'}
                            >
                                {departmentList && departmentList.map((item,index) =>
                                    <Select.Option value={item.id} key={index}>{item.value}</Select.Option>
                                )}
                            </Select>
                        </div>
                        <div className={cssStyle.editRow}>
                            <div className={cssStyle.editTitle}>处理意见</div>
                            <TextArea value={opinion} onChange={this.changeData.bind(this,'opinion',1)} placeholder="请输入处理意见" className={`${cssStyle.input} ${cssStyle.textArea}`} />
                        </div>
                        <div className={cssStyle.editButtonBox}>
                            <div className={cssStyle.edit} >确定</div>
                            <div className={cssStyle.cancel} onClick={this.changeEditShow.bind(this,false)}>取消</div>
                        </div>
                    </div>
                </div>
            ),
            document.getElementById(this.bodyId)
        );
    }

    render() {
        const { detail } = this.props;
        if (detail == null) {
            return '';
        }
        return (
            <div style={this.props.style} className={`${cssStyle.box}`} >
                <div className={cssStyle.row}>
                    <span className={cssStyle.title}>预警楼盘：</span>
                    <span>{detail.buildName}</span>
                </div>
                <div className={cssStyle.row}>
                    <span className={cssStyle.title}>预警开发商：</span>
                    <span>{detail.devName}</span>
                </div>
                <div className={cssStyle.row}>
                    <span className={cssStyle.title}>预警等级：</span>
                    <span>{detail.level}</span>
                </div>
                <div className={cssStyle.row}>
                    <span className={cssStyle.title}>预警描述：</span>
                    <span>{detail.eventInfo}</span>
                </div>
                <div className={cssStyle.row}>
                    <span className={cssStyle.title}>预警时间：</span>
                    <span>{detail.createTime}</span>
                </div>
                <div className={cssStyle.row}>
                    <span className={cssStyle.title}>当前状态：</span>
                    <span>{detail.status}</span>
                </div>
                {/*{detail.status === '待分配' && (*/}
                {/*    <div className={cssStyle.buttonBox}>*/}
                {/*        <div className={cssStyle.edit} onClick={this.changeEditShow.bind(this,true)}>事件分配</div>*/}
                {/*        <div className={cssStyle.cancel}>忽略</div>*/}
                {/*    </div>*/}
                {/*)}*/}
                {this.state.showEdit && this.editDom()}
            </div>
        );
    }
}