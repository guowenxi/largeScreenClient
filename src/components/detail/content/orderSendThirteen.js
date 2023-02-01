import React from "react";
import cssStyle from "./orderSendThirteen.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { Input, Upload, DatePicker, Radio, Modal, Icon} from "antd";
import "./orderSendTwo.css";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from "moment";
import "../../../common/css/antdDatePicker.css";
import axios from "axios";
import "../../antd_select/antd_select.css";

moment.locale('zh-cn');

const { TextArea } = Input;

export default class OrderSendThirteen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sendData:{},planShow:false,planId:undefined,departmentList:[],planList:[],roadList:[],communityList:[],groupList:[], fileList: []};
        this.limitTypeList = [{id:1,name:'时'},{id:2,name:'天'},{id:3,name:'周'}];
        this.levelList = [{id:1,name:'乡镇街道'},{id:2,name:'村社'}];
        this.typeList = [{id:1,name:'表单'},{id:2,name:'文字'}];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        const {depListUrl,planListUrl,roadListUrl} = this.props.thisData.style;
        this.getListData(depListUrl,'departmentList');
        this.getListData(planListUrl,'planList');
        this.getListData(roadListUrl,'roadList');
    }

    uploadFile(info){
      if (info.file.status === 'done') {
          const result = info.file.response;
          if(result.success){
              let { fileList } = this.state;
              fileList.push({id:result.data[0],name:info.file.name});
              this.setState({fileList});
          }else{
              Modal.error({
                  content: '上传失败！',
              });
          }
      }
    }

    deleteFile(index){
      let { fileList } = this.state;
      fileList.splice(index,1);
      this.setState({fileList});
    }

    getListData(url,key,params){
        if(url){
            axios.get(url,{params:{...params,rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                if(response.data.success && response.data.data){
                    this.setState({[key]:response.data.data});
                    if(key === 'groupList'){
                        this.setState({indeterminate:false,checkAll:false})
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    handleSearch(value){
        const {style} = this.props.thisData;
        let sendData = {};
        sendData[style.planSearchKey] = value;
        this.getListData(style.planListUrl,'planList',sendData);
    }

    getPlanData(id){
        this.setState({planId:id});
        const {planDetailUrl} = this.props.thisData.style;
        if(planDetailUrl){
            axios.get(planDetailUrl,{params:{id,rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                if(response.data.success && response.data.data){
                    const result = response.data.data;
                    this.setState({sendData:result});
                    if(result.roadId){
                        const {communityListUrl} = this.props.thisData.style;
                        this.getListData(communityListUrl,'communityList',{id:result.roadId});
                    }
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    close(){
      const { interact } = this.props.thisData.dataSources;
      this.interactData(interact, {});
    }

    sendOrder() {
      // const {sendData,fileList} = this.state;
      // const {taskName,taskTypeId,taskTypeName,integral,date,taskContent} = sendData;
      // if(!taskName){
      //   Modal.info({
      //       content: '请输入任务名称。',
      //   });
      //   return;
      // }
    }

    changeValue(type,key,event,e){
      let {sendData} = this.state;
      sendData[key] = type === 1 ? event.target.value : event;
      if(key === 'taskTypeId'){
          sendData.taskTypeName = e.props.title;
      }
      this.setState({sendData});
  }

    changeData(key,type,event){
        let {sendData} = this.state;
        sendData[key] = type===1 ? event.target.value : event;
        this.setState({sendData},()=>{
            if(key === 'roadId'){
                const {communityListUrl} = this.props.thisData.style;
                this.getListData(communityListUrl,'communityList',{id:event});
            }else if('department,roadId,communityId'.indexOf(key) >= 0){
                const {groupListUrl} = this.props.thisData.style;
                const {department,roadId,communityId} = this.state.sendData;
                this.getListData(groupListUrl,'groupList',{department,roadId,communityId});
            }
        });
    }

    onCheckChange(item){
        let {groupList} = this.state;
        let checkAll = true;
        let indeterminate = false;
        item.checked = !item.checked;
        groupList.forEach((item)=>{
            if(item.checked){
                indeterminate = true;
            }else{
                checkAll = false;
            }
        });
        if(checkAll){
            indeterminate = false;
        }
        this.setState({checkAll,indeterminate,groupList});
    }

    render() {
        const {styleData} = this.props;
        const {sendData, fileList} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={`${cssStyle.contentOne} antdSelectThemeOne`}>
                    <Scrollbars>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>关联人员 王曼</div>
                        </div>
                        <div className={cssStyle.row2}>
                            <div className={cssStyle.title}><span className={cssStyle.red}>*</span>人员动向</div>
                            <Radio.Group className={cssStyle.editRow} >
                              <Radio value={1}><span className={cssStyle.white}>到市</span></Radio>
                              <Radio value={2}><span className={cssStyle.white}>到杭</span></Radio>
                              <Radio value={3}><span className={cssStyle.white}>到京</span></Radio>
                            </Radio.Group>
                        </div>
                        <div className={cssStyle.row}>
                          <div className={cssStyle.title}>发生时间</div>
                          <DatePicker value={sendData.date} placeholder="请选择发生时间" className={cssStyle.datePicker} locale={locale} onChange={this.changeValue.bind(this,2,'date')} />
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>发生地点</div>
                            <Input value={sendData.name} onChange={this.changeData.bind(this,'name',1)} placeholder="请输入" className={`${cssStyle.input}`} />
                        </div>
                        <div className={cssStyle.row} style={{height:'auto'}}>
                            <div className={cssStyle.title}><span className={cssStyle.red}>*</span>详细情况</div>
                            <TextArea value={sendData.content} onChange={this.changeData.bind(this,'content',1)} placeholder="请输入报告内容，1000字以内" className={`${cssStyle.input} ${cssStyle.textArea}`} maxLength={1000} />
                        </div>
                        <div>
                            <div className={cssStyle.title}>附件上传 {fileList.length }/ 5</div>
                            <div className={cssStyle.fileBox}>
                              {
                                fileList.length <= 5 && <Upload
                                name="files"
                                className={cssStyle.addFile}
                                showUploadList={false}
                                action={styleData.fileServiceUrl + '?rbacToken=' + this.props.token}
                                onChange={this.uploadFile.bind(this)}
                                multiple={true}
                                >
                                  上传附件
                                </Upload>
                              }
                                
                                {fileList.map((item,index)=>
                                    <div key={index} className={cssStyle.fileName}>
                                        <div>{item.name}</div>
                                        <Icon type="close-circle" className={cssStyle.delete} onClick={this.deleteFile.bind(this,index)}/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Scrollbars>
                </div>
               
                <div className={cssStyle.buttonBox}>
                    {/* <div className={cssStyle.button} onClick={this.close.bind(this)}>取消</div> */}
                    <div className={cssStyle.buttonTwo} onClick={this.sendOrder.bind(this,2)}>提交</div>
                </div>
            </div>
        );
    }
}