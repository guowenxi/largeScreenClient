import React from "react";
import {Button, Icon, Modal} from "antd";
import cssStyle from './eventThirteen.module.css';
import {Scrollbars} from "react-custom-scrollbars";
import Oversee from "./oversee.js";
import axios from "axios";
import {interactData} from "../../../common/util";

const { confirm } = Modal;

export default class EventThirteen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {imageList:[],fileList:[],videoList:[]};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    //组件加载触发函数
    componentDidMount() {
        this.initFile();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime){
            this.initFile();
        }
    }

    initFile(){
        this.keyParams = this.props.keyParams;
        const { detail } = this.props;
        let imageList = [];
        let fileList = [];
        let videoList = [];
        if(detail.fileIdList){
            detail.fileIdList.forEach((file)=>{
                if(file.fileType.indexOf('image') >= 0){
                    imageList.push(file);
                }else if(file.fileType.indexOf('video') >= 0){
                    videoList.push(file);
                }else{
                    fileList.push(file);
                }
            });
        }
        this.setState({imageList,fileList,videoList});
    }

    downloadFile(url){
        window.open(url);
    }

    eventTurnTo(type){
        if(type === 3){
            this.setState({overseeShow:true})
        }else{
            let message,url;
            let sendData = {
                rbacToken:this.props.token
            };
            switch (type) {
                case 1:
                    message = '退回';
                    url = '/socialGovernance/warningEvent/exclude/'+this.props.detail.id;
                    break;
                case 2:
                    message = '转入应急联动';
                    url = '/socialGovernance/warningEvent/sendToCommandDispatch/'+this.props.detail.id;
                    break;
                default:
            }
            confirm({
                title: '确定要'+message+'吗？',
                okText:'确认',
                cancelText:'取消',
                onOk:()=> {
                    const { styleData } = this.props;
                    return new Promise((resolve) => {
                        axios.post(styleData.fileUrl+url,sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                            resolve();
                            if(response.data.success){
                                Modal.success({
                                    content: message+'完成。',
                                });
                                this.props.changeKeyParams({});
                                //通知列表刷新
                                this.interactOther();
                            }else{
                                Modal.error({
                                    content: response.data.message,
                                });
                            }
                        }).catch( (error) => {
                            resolve();
                            Modal.error({
                                content: message+'请求出错！',
                            });
                        });
                    }).catch(() => console.log('Oops errors!'));
                },
                onCancel:()=> {},
            });
        }
    }

    interactOther() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {});
    }

    render() {
        const { detail,styleData } = this.props;
        const {imageList,fileList,videoList,overseeShow} = this.state;
        if (detail == null) {
            return '';
        }
        return (
            <div style={this.props.style} className={`${cssStyle.box}`} >
                <div className={cssStyle.contentBox}>
                    <Scrollbars>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>事件名称：</div>
                            <div className={cssStyle.contentOne}>{detail.eventTitle}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>来源编号：</div>
                            <div className={cssStyle.contentTwo}>{detail.sourceId}</div>
                            <div className={cssStyle.title}>事件等级：</div>
                            <div className={cssStyle.contentTwo}>{detail.eventLevelName}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>事件来源：</div>
                            <div className={cssStyle.contentTwo}>{detail.sourceTypeName}</div>
                            <div className={cssStyle.title}>事件类型：</div>
                            <div className={cssStyle.contentTwo}>{detail.eventTypeParentName}/{detail.eventTypeName}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>所属区域：</div>
                            <div className={cssStyle.contentTwo}>{detail.roadName}</div>
                            <div className={cssStyle.title}>事发时间：</div>
                            <div className={cssStyle.contentTwo}>{detail.eventDate}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>事发地点：</div>
                            <div className={cssStyle.contentOne}>{detail.eventAddress}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>事件概述：</div>
                            <div className={cssStyle.contentOne}>{detail.eventContent}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>附件：</div>
                            <div className={cssStyle.contentFour}>
                                {imageList.map((item,index)=>
                                    <img className={cssStyle.img} key={index} alt={''} src={item.fileUrl+'?rbacToken=' + this.props.token}/>
                                )}
                                {videoList.map((item,index)=>
                                    <video className={cssStyle.img} key={index} src={item.fileUrl+'?rbacToken=' + this.props.token} controls="controls"/>
                                )}
                                {fileList.map((item,index)=>
                                    <div key={index} className={cssStyle.fileRow}>
                                        <Icon type="file" className={cssStyle.fileIcon} />
                                        <div className={cssStyle.fileName}>{item.fileName}</div>
                                        <div className={cssStyle.downloadButton} onClick={this.downloadFile.bind(this,item.fileUrl+'?rbacToken=' + this.props.token)}>下载</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {styleData.contentType !== 1 && (
                            <>
                                <div className={cssStyle.row}>
                                    <div className={cssStyle.title}>风险等级：</div>
                                    <div className={cssStyle.contentTwo}>{detail.riskLevelName}</div>
                                    {/*<div className={cssStyle.title}>事件等级：</div>*/}
                                    {/*<div className={cssStyle.contentTwo}>{detail.eventLevelName}</div>*/}
                                </div>
                                <div className={cssStyle.row}>
                                    <div className={cssStyle.title}>是否逾期：</div>
                                    <div className={cssStyle.contentOne}>{detail.overdued}</div>
                                </div>
                                <div className={cssStyle.row}>
                                    <div className={cssStyle.title}>扣分项：</div>
                                    <div className={cssStyle.contentFour}>
                                        {detail.deductionItems && Array.isArray(detail.deductionItems) && detail.deductionItems.map((item,index)=>
                                            <div className={cssStyle.label} key={index}>{item.name}{item.score > 0 ? '-'+item.score:''}</div>
                                        )}
                                    </div>
                                </div>
                                <div className={cssStyle.row}>
                                    <div className={cssStyle.title}>标签：</div>
                                    <div className={cssStyle.contentFour}>
                                        {detail.labelList && Array.isArray(detail.labelList) && detail.labelList.map((item,index)=>
                                            <div className={cssStyle.label} key={index}>{item}</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>处理部门：</div>
                            <div className={cssStyle.contentThree}>
                                <div>部门：</div>
                                <div>{detail.handleDepartmentName}</div>
                                <div>事件负责人员：</div>
                                <div>{detail.handleUserName}</div>
                            </div>
                        </div>
                    </Scrollbars>
                </div>
                <div className={cssStyle.contentBox}>
                    <div className={cssStyle.row}>
                        <div className={cssStyle.title} style={{width:'8.05em'}}>原平台处置过程：</div>
                    </div>
                    <div className={cssStyle.listBox}>
                        <div className={`${cssStyle.listRow} ${cssStyle.titleRow}`}>
                            <div>时间</div>
                            <div>部门/负责人</div>
                            <div>处置</div>
                            <div>附件</div>
                        </div>
                        <div className={cssStyle.listScrollBox}>
                            <Scrollbars >
                                {detail.handleList && detail.handleList.map((item,index)=>
                                    <div className={cssStyle.listRow} key={index}>
                                        <div>{item.handleTime}</div>
                                        <div>{item.handleUser}</div>
                                        <div>{item.handleDesc}</div>
                                        <div>
                                            {item.fileIdList && item.fileIdList.map((file,fileIndex)=>
                                                <div className={cssStyle.listFileName} key={fileIndex} onClick={this.downloadFile.bind(this,file.fileUrl+'?rbacToken=' + this.props.token)}>{file.fileName}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Scrollbars>
                        </div>
                    </div>
                    {styleData.contentType === 2 && detail.operable+''==='1' && (
                        <div className={cssStyle.editButtonBox}>
                            <Button type="danger" onClick={this.eventTurnTo.bind(this,1)} >退回</Button>
                            <Button type="primary" onClick={this.eventTurnTo.bind(this,2)} >转入应急联动</Button>
                            <Button type="primary" onClick={this.eventTurnTo.bind(this,3)} >转入督办</Button>
                        </div>
                    )}
                </div>
                {styleData.contentType === 2 && (
                    <Oversee interactOther={this.interactOther.bind(this)} eventId={detail.id} changeKeyParams={this.props.changeKeyParams} show={overseeShow} token={this.props.token} fileServiceUrl={styleData.fileServiceUrl} serviceUrl={styleData.fileUrl} changeEditShow={()=>{this.setState({overseeShow:false})}} />
                )}
            </div>
        );
    }
}