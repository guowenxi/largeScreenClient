import React from "react";
import cssStyle from "./orderSendSeven.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import locale from "antd/es/date-picker/locale/zh_CN";
import {DatePicker, Input, Modal, Radio, Select, Upload, Button, Icon} from "antd";
import axios from "axios";
import moment from "moment";
moment.locale('zh-cn');

const { confirm } = Modal;
const { TextArea } = Input;

export default class OrderSendSeven extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.initListData();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime){
            this.setState({content:'',group:[],department:[],groupList:[],departmentList:[]});
            this.initListData();
        }
    }

    initListData(){
    }


    sendOrder(){
        confirm({
            title: '确定要交办吗？',
            content: '',
            okText:'确认',
            cancelText:'取消',
            onOk:()=> {
                const sendData = {
                    rbacToken: this.props.token,
                };
                return new Promise((resolve) => {
                    axios.post(this.props.styleData.fileUrl, sendData,{params:{rbacToken:this.props.token}}).then((response) => {
                        resolve();
                        if(response.data.success){
                            Modal.success({
                                content: '已交办。',
                            });
                            this.props.clearData();
                        }else{
                            Modal.error({
                                content: response.data.message,
                            });
                        }
                    }).catch(function (error) {
                        resolve();
                        Modal.error({
                            content: '交办失败',
                        });
                    });
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel:()=> {},
        });
    }

    changeData(key,type,event,option){
        if(key === 'synergyDep' && option.length > 5){
            // console.log(option);
        }else{
            this.setState({[key]:type === 1 ? event.target.value : event});
        }
    }

    render() {
        const { leadDep,synergyDep,template } = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.oneBox}>
                    <div className={cssStyle.titleBox}>
                        <div className={cssStyle.rect} />
                        <div className={cssStyle.headName}>牵头单位（单选）<span className={cssStyle.red}>*</span></div>
                    </div>
                    <Select value={leadDep} className={cssStyle.select} placeholder={'请选择牵头单位'} onChange={this.changeData.bind(this,'leadDep',2)} >
                        <Select.Option value={'1'} >市场监督管理局</Select.Option>
                        <Select.Option value={'2'} >综合执法局</Select.Option>
                        <Select.Option value={'3'} >交警大队</Select.Option>
                        <Select.Option value={'4'} >城管局</Select.Option>
                    </Select>
                </div>
                <div className={cssStyle.oneBox}>
                    <div className={cssStyle.titleBox}>
                        <div className={cssStyle.rect} />
                        <div className={cssStyle.headName}>协同单位（{synergyDep ? synergyDep.length:0}/5）</div>
                    </div>
                    <Select mode={'multiple'} value={synergyDep} className={cssStyle.select} placeholder={'请选择协同单位'} onChange={this.changeData.bind(this,'synergyDep',2)} >
                        <Select.Option value={'1'} >市场监督管理局</Select.Option>
                        <Select.Option value={'2'} >综合执法局</Select.Option>
                        <Select.Option value={'3'} >交警大队</Select.Option>
                        <Select.Option value={'4'} >城管局</Select.Option>
                    </Select>
                </div>
                <div className={cssStyle.oneBox}>
                    <div className={cssStyle.titleBox}>
                        <div className={cssStyle.rect} />
                        <div className={cssStyle.headName}>处置模板</div>
                    </div>
                    <Select value={template} className={cssStyle.select} placeholder={'请选择处置模板'} onChange={this.changeData.bind(this,'template',2)} >
                        <Select.Option value={'1'} >模板一</Select.Option>
                        <Select.Option value={'2'} >模板二</Select.Option>
                        <Select.Option value={'3'} >模板三</Select.Option>
                        <Select.Option value={'4'} >模板四</Select.Option>
                    </Select>
                </div>
                <div className={cssStyle.twoBox}>
                    <div className={cssStyle.titleBox}>
                        <div className={cssStyle.rect} />
                        <div className={cssStyle.headName}>模板预览</div>
                    </div>
                    <div className={cssStyle.contentBox}>
                        <Scrollbars>
                            <div className={cssStyle.title}>1、排查情况反馈</div>
                            <TextArea className={cssStyle.textArea} placeholder={'请输入排查情况反馈'}/>
                            <div className={cssStyle.title}>2、处置情况反馈</div>
                            <TextArea className={cssStyle.textArea} placeholder={'请输入处置情况反馈'}/>
                            <div className={cssStyle.title}>3、是否需要回访</div>
                            <Radio.Group className={cssStyle.editRow} >
                                <Radio value={1}><span className={cssStyle.white}>是</span></Radio>
                                <Radio value={2}><span className={cssStyle.white}>否</span></Radio>
                            </Radio.Group>
                            <div className={cssStyle.title}>4、预计回访日期</div>
                            <DatePicker locale={locale} className={cssStyle.editRow}/>
                            <div className={cssStyle.title}>5、附件上传</div>
                            <Upload >
                                <Button className={cssStyle.editRow}>
                                    <Icon type="upload" /> 选择文件
                                </Button>
                            </Upload>
                            <div className={cssStyle.title}>支持扩域名：.rar .zip .doc .docx .pdf .jpg...</div>
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.editFootBox}>
                        <Button >取消</Button>
                        <Button type="primary" >确定</Button>
                    </div>
                </div>
            </div>
        );
    }
}