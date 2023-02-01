import React from "react";
import {Button, Icon, Modal} from "antd";
import cssStyle from './eventThirteen.module.css';
import {Scrollbars} from "react-custom-scrollbars";

import IconThree from '../images/iconThree.png';
import IconFour from '../images/iconFour.png';
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

    getFileList(fileList){
        const { styleData } = this.props;
        return fileList.map((item,index)=>
            <div key={index} className={cssStyle.fileRow}>
                <Icon type="file" className={cssStyle.fileIcon} />
                <div className={cssStyle.fileName}>{item.fileName}</div>
                <div className={cssStyle.downloadButton} onClick={this.downloadFile.bind(this,styleData.fileServiceUrl+item.fileId)}>下载</div>
            </div>
        )
    }

    eventTurnTo(){
        confirm({
            title: '确定要撤销吗？',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    eventId:this.props.detail.id,
                    rbacToken:this.props.token,
                };
                const { styleData } = this.props;
                return new Promise((resolve) => {
                    axios.post(styleData.fileUrl+'/socialGovernance/superviseEvent/revokeSuperviseEvent/'+this.props.detail.id,sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '撤销完成。',
                            });
                            //刷新详情
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
                            content: '撤销请求出错！',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    interactOther() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {});
    }

    render() {
        const { detail,styleData } = this.props;
        if (detail == null) {
            return '';
        }
        return (
            <div style={this.props.style} className={`${cssStyle.box}`} >
                <div className={cssStyle.contentBox}>
                    <div className={cssStyle.partLeftBox}>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>当前进度：</div>
                        </div>
                        <div className={cssStyle.progressBox}>
                            <div className={cssStyle.progressLine} />
                            {detail.statusTimeList && detail.statusTimeList.map((item,index)=>
                                <div className={cssStyle.progressStepBox} key={index}>
                                    <div className={cssStyle.progressStepItem}>
                                        <div className={cssStyle.point} />
                                        <div className={cssStyle.progressStepIcon}>
                                            <img alt={''} className={cssStyle.progressStepImg} src={item.time ? IconThree:IconFour} />
                                            <span>{index+1}</span>
                                        </div>
                                        <div className={cssStyle.progressContent}>
                                            <div>{item.name}</div>
                                            {item.time && <div>{item.time.split(' ')[0]}</div>}
                                            {item.time && <div>{item.time.split(' ')[1]}</div>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>反馈时间：</div>
                            {detail.leftHandleDays < 0 && <div className={cssStyle.warningMessage}>已逾期</div>}
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.titleTwo}>反馈时间：</div>
                            <div className={cssStyle.contentFive}>{detail.handleDays ? detail.handleDays+'天内':''}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.titleTwo}>剩余反馈时间：</div>
                            <div className={cssStyle.contentFive}>{detail.leftHandleDays ? detail.leftHandleDays+'天':''}</div>
                        </div>
                    </div>
                    <div className={cssStyle.partRightBox}>
                        <Scrollbars>
                            <div className={`${cssStyle.row} ${cssStyle.rowTwo}`}>
                                <div className={cssStyle.title}>处理部门：</div>
                                {detail.eventState === 6 && <div className={cssStyle.backMessage}>已撤销</div>}
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.titleTwo}>部门：</div>
                                <div className={cssStyle.contentFive}>{detail.handleDepartmentName}</div>
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.titleTwo}>事件负责人员：</div>
                                <div className={cssStyle.contentFive}>{detail.handleUserName}</div>
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.title}>督办批示：</div>
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.titleTwo}>督办人：</div>
                                <div className={cssStyle.contentFive}>
                                    {detail.superviseUserName}{detail.superviseUserDepartmentName ? ' - '+detail.superviseUserDepartmentName:''}
                                </div>
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.titleTwo}>督办批示：</div>
                                <div className={cssStyle.contentFive}>{detail.instruction}</div>
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.titleTwo}>附件：</div>
                                <div className={cssStyle.contentFive}>
                                    {detail.assignFileList && this.getFileList(detail.assignFileList)}
                                </div>
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.title}>反馈内容：</div>
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.titleTwo}>反馈人：</div>
                                <div className={cssStyle.contentFive}>
                                    {detail.handleUserName}{detail.handleDepartmentName ? ' - '+detail.handleDepartmentName:''}
                                </div>
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.titleTwo}>反馈内容：</div>
                                <div className={cssStyle.contentFive}>{detail.feedBackContent}</div>
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.titleTwo}>附件：</div>
                                <div className={cssStyle.contentFive}>
                                    {detail.feedBackFiles && this.getFileList(detail.feedBackFiles)}
                                </div>
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.title}>督办完结：</div>
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.titleTwo}>督办人：</div>
                                <div className={cssStyle.contentFive}>
                                    {detail.finishUserName}{detail.finishUserDepartmentName ? ' - '+detail.finishUserDepartmentName:''}
                                </div>
                            </div>
                            <div className={cssStyle.row}>
                                <div className={cssStyle.titleTwo}>督办完结：</div>
                                <div className={cssStyle.contentFive}>{detail.finishContent}</div>
                            </div>
                        </Scrollbars>
                    </div>
                </div>
                <div className={cssStyle.contentBox}>
                    <div className={cssStyle.row}>
                        <div className={cssStyle.title}>处置过程：</div>
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
                                                <div className={cssStyle.listFileName} key={fileIndex} onClick={this.downloadFile.bind(this,styleData.fileServiceUrl+file.fileId)}>{file.fileName}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Scrollbars>
                        </div>
                    </div>
                    {detail.eventState < 5 && (
                        <div className={cssStyle.editButtonBox}>
                            <Button type="danger" onClick={this.eventTurnTo.bind(this)} >撤销</Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}