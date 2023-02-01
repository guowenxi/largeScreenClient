import React from 'react';
import {
    Row,
    Col,
    PageHeader,
    Collapse,
    Tabs,
    Radio,
    Form,
    Button,
    Input,
    InputNumber,
    Select,
    Tooltip,
    Modal,
    Icon,
    Switch
} from 'antd';

import {
    addListItem,
    changeDetailData,
    changeDetailDataWithFunction, deleteListItem, getInteractEdit,
} from "../../../common/editUtil";
import {fileUrl} from "../../../config";
import html2canvas from "html2canvas";
import axios from "axios";

const formItemLayout12 = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
};
const formItemLayout24 = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;

export default class ComponentEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {jsonData:'',loading:false};
        this.addInteract = this.addInteract.bind(this);
        this.messageItem = {dataKey:'',messageKey:''};
        this.getInteractEdit = getInteractEdit.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    //修改位置大小样式
    changeViewData(type, keyOne, keyTwo, event) {
        this.props.saveNowDataToHistory();
        let thisData = {...this.props.data};
        if (type === 1) {
            thisData[keyOne] = event.target.value;
        } else if (type === 2) {
            thisData[keyOne][keyTwo] = event.target.value;
        }
        this.props.updateData(thisData);
    }

    //修改数据源
    changeData(key, event) {
        this.props.saveNowDataToHistory();
        let thisData = {...this.props.data};
        thisData.dataSources[key] = event.target.value;
        //根据getDataTime是否变更判断组件是否要重新获取数据
        thisData.getDataTime = (new Date()).getTime();
        this.props.updateData(thisData);
    }

    //添加交互对象
    addInteract() {
        this.props.saveNowDataToHistory();
        let thisData = {...this.props.data};
        thisData.dataSources.interact.push({type: 1, dataType: 1, receiveId: '', keyName: ''});
        this.props.updateData(thisData);
    }

    //修改交互内容
    changeInteract(index, type, valueType, value) {
        this.props.saveNowDataToHistory();
        let thisData = {...this.props.data};
        if (valueType === 1) {
            thisData.dataSources.interact[index][type] = value.target.value;
        } else {
            thisData.dataSources.interact[index][type] = value;
        }
        this.props.updateData(thisData);
    }

    //删除交互对象
    deleteInteract(index){
        this.props.saveNowDataToHistory();
        let thisData = {...this.props.data};
        thisData.dataSources.interact.splice(index,1);
        this.props.updateData(thisData);
    }

    collapseCallback() {
        console.log('open collapse');
    }

    //复制组件数据
    copyData(){
        let dataTemp = { ...this.props.data,thumbnailUrl:''};
        delete dataTemp.thumbnailUrl;
        this.setState({jsonData:JSON.stringify(dataTemp)});
        setTimeout(() => {
            document.getElementById("componentData").select();
            document.execCommand("Copy");
            Modal.success({
                content: '已复制到剪切版。',
            });
        });
    }

    //上传缩略图
    uploadThumbnailUrl(){
        this.setState({loading:true});
        const { id } = this.props.data;
        html2canvas(document.getElementById(id+'_content').firstElementChild).then((canvas) => {
            canvas.toBlob((blob) => {
                let form = new FormData();
                form.append("files",blob);
                axios.post(fileUrl + '/upload',form).then((response) =>{
                    this.setState({loading:false});
                    const result = response.data;
                    if(result.success){
                        this.props.saveNowDataToHistory();
                        let thisData = {...this.props.data};
                        thisData.coverImg = result.data[0];
                        this.props.updateData(thisData);
                    }else{
                        Modal.error({
                            content: '上传失败！',
                        });
                    }
                }).catch(function(error){
                    this.setState({loading:false});
                    // 处理请求出错的情况
                });
            });
        });
    }

    render() {
        return (
            <div>
                <textarea style={{width:0,height:0,position:'absolute',opacity:0}} id='componentData' value={this.state.jsonData} readOnly={true}/>
                <PageHeader
                    title={
                        <div>
                            组件名称：
                        </div>
                    }
                >
                    <Input value={this.props.data.nickName}
                           onChange={this.changeViewData.bind(this, 1, 'nickName', '')}/>
                </PageHeader>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="样式" key="1">
                        <Collapse defaultActiveKey={['1']} onChange={this.collapseCallback}>
                            <Panel header="基础设置" key="1">
                                <Row>
                                    <Col span={12}><Form.Item {...formItemLayout12} label="左">
                                        <Input value={this.props.data.position.left}
                                               onChange={this.changeViewData.bind(this, 2, 'position', 'left')}/>
                                    </Form.Item></Col>
                                    <Col span={12}><Form.Item {...formItemLayout12} label="上">
                                        <Input value={this.props.data.position.top}
                                               onChange={this.changeViewData.bind(this, 2, 'position', 'top')}/>
                                    </Form.Item></Col>
                                </Row>
                                <Row>
                                    <Col span={12}><Form.Item {...formItemLayout12} label="宽">
                                        <Input value={this.props.data.position.width}
                                               onChange={this.changeViewData.bind(this, 2, 'position', 'width')}/>
                                    </Form.Item></Col>
                                    <Col span={12}> <Form.Item {...formItemLayout12} label="高">
                                        <Input value={this.props.data.position.height}
                                               onChange={this.changeViewData.bind(this, 2, 'position', 'height')}/>
                                    </Form.Item></Col>
                                </Row>
                                <Form.Item {...formItemLayout24} label="所属图层">
                                    <Select value={this.props.data.position.layerId} onChange={changeDetailDataWithFunction.bind(this, 2, this.props.data.position, 'layerId', this.props.changeComponentsShowStatus)}>
                                        <Select.Option value={''} key={'none'}>无所属</Select.Option>
                                        {this.props.layerList.map((item) =>
                                            <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                                <Form.Item {...formItemLayout24} label="所在层级">
                                    <InputNumber value={this.props.data.position.zIndex} onChange={changeDetailData.bind(this, 2, this.props.data.position, 'zIndex')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout24} label="缩略图">
                                    <div className='thumbnail-box'>
                                        <img alt='' src={this.props.data.coverImg ? fileUrl + '/download/' + this.props.data.coverImg:''} />
                                        <div className='refresh'>
                                            <Icon type={this.state.loading ? 'loading' : 'reload'} onClick={this.uploadThumbnailUrl.bind(this)}/>
                                        </div>
                                    </div>
                                </Form.Item>
                                <Form.Item
                                    {...formItemLayout24}
                                    label={
                                        <Tooltip title='与下个组件显示加载的时间间隔，单位为毫秒'>
                                            加载间隔*
                                        </Tooltip>
                                    }
                                >
                                    <InputNumber value={this.props.data.delayTime} onChange={changeDetailData.bind(this, 2, this.props.data, 'delayTime')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout24} label="隐藏时不渲染">
                                    <Switch checked={this.props.data.style.hideNotLoad} onChange={changeDetailData.bind(this, 2, this.props.data.style, 'hideNotLoad')}/>
                                </Form.Item>
                                <Form.Item {...formItemLayout24} label="模块名">
                                    {this.props.data.moduleName}
                                </Form.Item>
                            </Panel>
                            <Panel header="绕Y旋转设置" key="2">
                                <Form.Item {...formItemLayout24} label="来源类型">
                                    <Radio.Group value={this.props.data.position.rotateType} onChange={changeDetailData.bind(this, 1, this.props.data.position, 'rotateType')}>
                                        <Radio value={1}>rotate旋转(透视</Radio>
                                        <Radio value={2}>skew旋转</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="旋转角度" {...formItemLayout24}>
                                    <InputNumber value={this.props.data.position.rotateY} onChange={changeDetailData.bind(this, 2, this.props.data.position, 'rotateY')} />
                                </Form.Item>
                                <Form.Item label="轴线位置" {...formItemLayout24}>
                                    <Input value={this.props.data.position.transformOriginX} onChange={changeDetailData.bind(this, 1, this.props.data.position, 'transformOriginX')} />
                                </Form.Item>
                            </Panel>
                        </Collapse>
                        {this.props.children}
                    </TabPane>
                    <TabPane tab="数据配置" key="2" >
                        <Collapse defaultActiveKey={['1']} onChange={this.collapseCallback}>
                            <Panel header="数据源" key="1">
                                <Form.Item {...formItemLayout24} label="来源类型">
                                    <Radio.Group value={this.props.data.dataSources.dataType} onChange={this.changeData.bind(this, 'dataType')}
                                                 style={{marginBottom: '16px'}}>
                                        <Radio value={1}>示例</Radio>
                                        <Radio value={2}>接口</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="初始加载" {...formItemLayout24}>
                                    <Radio.Group value={this.props.data.firstLoad} onChange={changeDetailData.bind(this, 1, this.props.data, 'firstLoad')}>
                                        <Radio.Button value={1}>是</Radio.Button>
                                        <Radio.Button value={0}>否</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <TextArea rows={20} value={this.props.data.dataSources.defaultData}
                                          style={{display: this.props.data.dataSources.dataType === 1 ? 'block' : 'none'}}
                                          onChange={this.changeData.bind(this, 'defaultData')} />
                                <div style={{display: this.props.data.dataSources.dataType === 2 ? 'block' : 'none'}}>
                                    <Form.Item {...formItemLayout24} label="地址">
                                        <Input value={this.props.data.dataSources.dataUrl}
                                               onChange={this.changeData.bind(this, 'dataUrl')}/>
                                    </Form.Item>
                                    <Form.Item {...formItemLayout24} label="参数">
                                        <Input value={this.props.data.dataSources.dataParams}
                                               onChange={this.changeData.bind(this, 'dataParams')}/>
                                    </Form.Item>
                                    <Form.Item {...formItemLayout24} label="/后跟参">
                                        <Input value={this.props.data.dataSources.urlParamKey}
                                               onChange={this.changeData.bind(this, 'urlParamKey')}/>
                                    </Form.Item>
                                    <Form.Item {...formItemLayout24}
                                        label={
                                            <span>
                                                <Tooltip title="点击添加">
                                                    <Icon type="plus" style={{cursor:'pointer',marginRight:'0.5vh'}} onClick={addListItem.bind(this,this.props.data.dataSources,'urlParams','')}/>
                                                </Tooltip>
                                                地址栏传参
                                            </span>
                                        }
                                    >
                                        {this.props.data.dataSources.urlParams && this.props.data.dataSources.urlParams.map((item,index)=>
                                            <Col key={index}>
                                                <Input value={item} onChange={changeDetailData.bind(this, 1, this.props.data.dataSources.urlParams, index)} key={index} style={{width:'80%'}}/>
                                                <Icon type="close" style={{position:'absolute',top:'12px',marginLeft:'0.5vh',cursor:'pointer'}} onClick={deleteListItem.bind(this, this.props.data.dataSources.urlParams, index)}/>
                                            </Col>
                                        )}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout24} label="session条件">
                                        <Switch checked={this.props.data.dataSources.sessionData} onChange={changeDetailData.bind(this, 2, this.props.data.dataSources, 'sessionData')}/>
                                    </Form.Item>
                                    <Form.Item {...formItemLayout24} label="session键名">
                                        <Input value={this.props.data.dataSources.sessionKey}
                                               onChange={this.changeData.bind(this, 'sessionKey')}/>
                                    </Form.Item>
                                </div>
                                <Form.Item
                                    {...formItemLayout24}
                                    label={
                                        <Tooltip title='数据定时刷新时间间隔，单位毫秒。'>
                                            刷新间隔*
                                        </Tooltip>
                                    }
                                >
                                    <InputNumber value={this.props.data.dataSources.freshTime} onChange={changeDetailData.bind(this, 2, this.props.data.dataSources, 'freshTime')}/>
                                </Form.Item>
                            </Panel>
                            <Panel header="交互" key="2">
                                <Form.Item label="初始交互" {...formItemLayout24}>
                                    <Radio.Group value={this.props.data.firstSend} onChange={changeDetailData.bind(this, 1, this.props.data, 'firstSend')}>
                                        <Radio.Button value={1}>是</Radio.Button>
                                        <Radio.Button value={0}>否</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form {...formItemLayout24}>
                                    {this.getInteractEdit(this.props.data.dataSources.interact)}
                                </Form>
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this,this.props.data.dataSources,'interact',{})}>
                                        <Icon type="plus"/> 添加交互内容
                                    </Button>
                                </Form.Item>
                                {/*{this.props.data.dataSources.interact.map((item, index) =>*/}
                                {/*    <div key={index}>*/}
                                {/*        <Tag closable visible={true} onClose={this.deleteInteract.bind(this,index)}>{'交互对象' + (index + 1)}</Tag>*/}
                                {/*        <Form.Item {...formItemLayout24} label="交互方式">*/}
                                {/*            <Select value={item.type} onChange={this.changeInteract.bind(this, index, 'type', 2)}>*/}
                                {/*                <Select.Option value={1}>修改条件</Select.Option>*/}
                                {/*                <Select.Option value={2}>取消选中</Select.Option>*/}
                                {/*                <Select.Option value={3}>显示组件</Select.Option>*/}
                                {/*                <Select.Option value={4}>数据传输</Select.Option>*/}
                                {/*                <Select.Option value={5}>数据刷新</Select.Option>*/}
                                {/*                <Select.Option value={6}>地图图层切换</Select.Option>*/}
                                {/*                <Select.Option value={7}>页面跳转</Select.Option>*/}
                                {/*            </Select>*/}
                                {/*        </Form.Item>*/}
                                {/*        <Form.Item {...formItemLayout24} label="交互对象" style={{display: item.type !== 7 ? 'block' : 'none'}}>*/}
                                {/*            <Select value={item.receiveId}*/}
                                {/*                    onChange={this.changeInteract.bind(this, index, 'receiveId', 2)}>*/}
                                {/*                {this.props.componentList.map((component, index) => {*/}
                                {/*                    if (component.id === this.props.data.id) {*/}
                                {/*                        return '';*/}
                                {/*                    } else {*/}
                                {/*                        return <Select.Option value={component.id}*/}
                                {/*                                              key={component.id}>{component.nickName}</Select.Option>;*/}
                                {/*                    }*/}
                                {/*                })}*/}
                                {/*            </Select>*/}
                                {/*        </Form.Item>*/}
                                {/*        <Form.Item {...formItemLayout24} label="传输内容"*/}
                                {/*                   style={{display: item.type === 1 || item.type === 3 ? 'block' : 'none'}}>*/}
                                {/*            <Select value={item.dataType}*/}
                                {/*                    onChange={this.changeInteract.bind(this, index, 'dataType', 2)}>*/}
                                {/*                <Select.Option value={1}>id</Select.Option>*/}
                                {/*                <Select.Option value={2}>名称</Select.Option>*/}
                                {/*                <Select.Option value={3}>其他</Select.Option>*/}
                                {/*            </Select>*/}
                                {/*        </Form.Item>*/}
                                {/*        {item.dataType === 3 && (*/}
                                {/*            <Form.Item {...formItemLayout24} label="内容键名" >*/}
                                {/*                <Input value={item.dataKeyName}*/}
                                {/*                       onChange={this.changeInteract.bind(this, index, 'dataKeyName', 1)}/>*/}
                                {/*            </Form.Item>*/}
                                {/*        )}*/}
                                {/*        <Form.Item {...formItemLayout24} label="传输键名"*/}
                                {/*                   style={{display: item.type === 1 || item.type === 3 ? 'block' : 'none'}}>*/}
                                {/*            <Input value={item.keyName}*/}
                                {/*                   onChange={this.changeInteract.bind(this, index, 'keyName', 1)}/>*/}
                                {/*        </Form.Item>*/}
                                {/*        <Form.Item {...formItemLayout24} label="数据格式"*/}
                                {/*                   style={{display: item.type === 1 || item.type === 3 ? 'block' : 'none'}}>*/}
                                {/*            <Radio.Group value={item.dataStyle} onChange={changeDetailData.bind(this, 1, item, 'dataStyle')}>*/}
                                {/*                <Radio.Button value={1}>默认</Radio.Button>*/}
                                {/*                <Radio.Button value={2}>数组</Radio.Button>*/}
                                {/*            </Radio.Group>*/}
                                {/*        </Form.Item>*/}
                                {/*        {item.type === 4 && (*/}
                                {/*            <Collapse>*/}
                                {/*                <Panel header="传输内容字段设置" key="1">*/}
                                {/*                    {item.message && item.message.map((messageItem,messageIndex) =>*/}
                                {/*                        <div key={messageIndex}>*/}
                                {/*                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item.message, messageIndex)}>{'列' + (messageIndex + 1)}</Tag>*/}
                                {/*                            <Form.Item label="数据键名" {...formItemLayout24}>*/}
                                {/*                                <Input value={messageItem.dataKey} onChange={changeDetailData.bind(this, 1, messageItem, 'dataKey')} />*/}
                                {/*                            </Form.Item>*/}
                                {/*                            <Form.Item label="传输键名" {...formItemLayout24}>*/}
                                {/*                                <Input value={messageItem.messageKey} onChange={changeDetailData.bind(this, 1, messageItem, 'messageKey')} />*/}
                                {/*                            </Form.Item>*/}
                                {/*                            <Form.Item {...formItemLayout24} label="数据格式">*/}
                                {/*                                <Radio.Group value={messageItem.dataStyle} onChange={changeDetailData.bind(this, 1, messageItem, 'dataStyle')}>*/}
                                {/*                                    <Radio.Button value={1}>默认</Radio.Button>*/}
                                {/*                                    <Radio.Button value={2}>数组</Radio.Button>*/}
                                {/*                                </Radio.Group>*/}
                                {/*                            </Form.Item>*/}
                                {/*                        </div>*/}
                                {/*                    )}*/}
                                {/*                    <Form.Item label="">*/}
                                {/*                        <Button type="dashed" onClick={addListItem.bind(this,item,'message',this.messageItem)}>*/}
                                {/*                            <Icon type="plus"/> 添加传输内容*/}
                                {/*                        </Button>*/}
                                {/*                    </Form.Item>*/}
                                {/*                </Panel>*/}
                                {/*            </Collapse>*/}
                                {/*        )}*/}
                                {/*        {item.type === 7 && (*/}
                                {/*            <Collapse>*/}
                                {/*                <Panel header="跳转页面设置" key="1">*/}
                                {/*                    <Form.Item label="依据字段" {...formItemLayout24}>*/}
                                {/*                        <Input value={item.pageKey} onChange={changeDetailData.bind(this, 1, item, 'pageKey')} />*/}
                                {/*                    </Form.Item>*/}
                                {/*                    {item.pageList && item.pageList.map((page,pageIndex) =>*/}
                                {/*                        <div key={pageIndex}>*/}
                                {/*                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item.pageList, pageIndex)}>{'项' + (pageIndex + 1)}</Tag>*/}
                                {/*                            <Form.Item label="数据值" {...formItemLayout24}>*/}
                                {/*                                <Input value={page.data} onChange={changeDetailData.bind(this, 1, page, 'data')} />*/}
                                {/*                            </Form.Item>*/}
                                {/*                            <Form.Item label="页面id" {...formItemLayout24}>*/}
                                {/*                                <Input value={page.pageId} onChange={changeDetailData.bind(this, 1, page, 'pageId')} />*/}
                                {/*                            </Form.Item>*/}
                                {/*                        </div>*/}
                                {/*                    )}*/}
                                {/*                    <Form.Item label="">*/}
                                {/*                        <Button type="dashed" onClick={addListItem.bind(this,item,'pageList',{})}>*/}
                                {/*                            <Icon type="plus"/> 添加页面跳转设置*/}
                                {/*                        </Button>*/}
                                {/*                    </Form.Item>*/}
                                {/*                </Panel>*/}
                                {/*            </Collapse>*/}
                                {/*        )}*/}
                                {/*        <Form.Item {...formItemLayout24}*/}
                                {/*               label={*/}
                                {/*                   <Tooltip title="格式为json字串。">*/}
                                {/*                       附带数据**/}
                                {/*                   </Tooltip>*/}
                                {/*               }*/}
                                {/*        >*/}
                                {/*            <Input value={item.remark}*/}
                                {/*                   onChange={this.changeInteract.bind(this, index, 'remark', 1)}/>*/}
                                {/*        </Form.Item>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                                {/*<div style={{display: this.props.data.dataSources.interact.length === 0 ? 'block' : 'none'}}>*/}
                                {/*    无交互*/}
                                {/*</div>*/}
                                {/*<Button type="primary" onClick={this.addInteract} style={{marginBottom: '16px',float: 'right'}}>添加</Button>*/}
                            </Panel>
                        </Collapse>
                    </TabPane>
                    <TabPane tab="操作" key="3">
                        <Form.Item {...formItemLayout24} label="" style={{padding:'5px 10px'}}>
                            <Button type="button" onClick={this.copyData.bind(this)}>复制组件数据</Button>
                            <Button type="button" onClick={this.props.copyComponent}>复制组件</Button>
                        </Form.Item>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
