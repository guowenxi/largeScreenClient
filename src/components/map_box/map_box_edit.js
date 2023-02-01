import React from 'react';
import {
    Form,
    Input,
    InputNumber,
    Collapse,
    Switch,
    Radio,
    Tooltip,
    Icon,
    Tag,
    Button,
    Select, Slider,
} from 'antd';
import FileSelect from "../../common/fileSelect";
import ColorSelect from "../../common/colorSelect";
// import InputNumber from "../../common/inputNumberEx";
import {fileUrl} from '../../config';
import cssStyle from './map_box.module.css';
import {addListItem, changeDetailData, deleteListItem, deleteListItemWithTime, getInteractEdit, setColor} from "../../common/editUtil";
import {getColorList, getColorSet} from "../../common/nameNumEditUtil";

const { Panel } = Collapse;

export default class MapBoxEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible:false};
        this.baseItem = {};
        this.getColorSet = getColorSet.bind(this);
        this.getColorList = getColorList.bind(this);
        this.colorItemOne = {num:1,color:'rgb(61,219,88)'};
        this.colorItemTwo = {bottom:1,top:2,color:'rgb(61,219,88)'};
        this.getCommonInteractEdit = getInteractEdit.bind(this);
        this.heatColorItem = {ratio: 1.0, color: "rgb(46,167,224,0.9)"};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    changeDetailData(type, item, key, part, event){
        this.props.saveNowDataToHistory();
        item[key] = type === 1 ? event.target.value : event;
        let thisData = {...this.props.data};
        if(part != null){
            const now = new Date().getTime();
            part.updateTime = now;
            thisData.updateTime = now;
        }
        this.props.updateData(thisData);
    }

    //修改颜色
    setColor(item, key, part, data) {
        this.props.saveNowDataToHistory();
        const rgb = data.rgb;
        item[key] = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+rgb.a+')';
        let thisData = {...this.props.data};
        if(part != null){
            const now = new Date().getTime();
            part.updateTime = now;
            thisData.updateTime = now;
        }
        this.props.updateData(thisData);
    }

    //删除列表内某项
    deleteList(list,index,layer){
        this.props.saveNowDataToHistory();
        list.splice(index,1);
        let thisData = {...this.props.data};
        if(layer != null){
            const now = new Date().getTime();
            if(layer !== true){
                layer.updateTime = now;
            }
            thisData.updateTime = now;
        }
        this.props.updateData(thisData);
    }

    addListItem(list,type){
        this.props.saveNowDataToHistory();
        switch (type) {
            case 1:
                //新增图层
                list.push({
                    id:(new Date()).getTime(),
                    firstShow:true,
                    type:1,
                    url:'http://localhost:3000/json/people.json',
                    name:'',
                    key:'type',
                    cluster:false,
                    selectOpen:true,
                    whole: {
                        img:'',
                        selectedImg:'',
                        width:44,
                        height:48,
                        top:22,
                        left:0,
                        clusterImg:'',
                        clusterWidth:44,
                        clusterHeight:48,
                        clusterTop:22,
                        clusterLeft:0,
                        fontSize:20,
                        fontTop:22,
                        fontLeft:0,
                        fontColor:'#0ff'
                    },
                    renderer:[],
                    icon:[],
                    category:[],
                    interact:[],
                    clusterInteract:[]
                });
                break;
            case 2:
                //新增图标类型
                list.push({
                    value:'type1',
                    img:'',
                    width:'',
                    height:'',
                    top:'',
                    left:''
                });
                break;
            case 3:
                //新增聚合层级
                list.push({
                    min:0,
                    max:100,
                    img:'',
                    width:'',
                    height:'',
                    top:'',
                    left:'',
                    fontSize:'',
                    fontTop:'',
                    fontLeft:'',
                    fontColor:'#0ff',
                });
                break;
            case 4:
                //图层点击交互内容
                list.push({type: 1, dataType: 1, receiveId: '', keyName: '', nearLayer:[], distance:500, aboutLayer:[]});
                break;
            case 8:
                //周边图层/关联图层
                list.push({url: '', lineColor:'#0ff', lineWidth:3, lineType:'solid', whole:{img:'', width:'', height:'', top:'', left:''}, icon:[], interact:[]});
                break;
            case 5:
                //分类方式
                list.push({key: '', name: '', dataType: 1, typeList: [], url: ''});
                break;
            case 6:
                //分类类型
                list.push({value: '', label: ''});
                break;
            case 7:
                //行政区划点击交互内容
                list.push({dataType: 1, receiveId: '', keyName: ''});
                break;
            default:
                break;
        }
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    //选择图标素材弹框
    selectIcon(item,layer,key){
        this.editPart = item;
        this.editLayer = layer;
        this.editKey = key;
        this.setState({visible:true});
    }

    //暂存选中的图标素材
    imgSelect(id){
        this.selectedImg = id;
    }

    //确定选中图标素材
    handleOk(){
        const now = new Date().getTime();
        this.props.saveNowDataToHistory();
        this.editPart[this.editKey] = this.selectedImg;
        let thisData = {...this.props.data};
        if(this.editLayer != null){
            this.editLayer.updateTime = now;
            thisData.updateTime = now;
        }
        this.props.updateData(thisData);
        this.setState({visible:false});
    }

    //取消选择
    handleCancel(){
        this.setState({visible:false});
    }

    //地图内弹窗设置
    getMapWindowEdit(interact){
        return (

            <div>
                <Form.Item label="弹窗主题">
                    <Select value={interact.windowTheme} onChange={this.changeDetailData.bind(this, 2, interact, 'windowTheme', null)}>
                        <Select.Option value={0}>主题一</Select.Option>
                        <Select.Option value={1}>主题二</Select.Option>
                        <Select.Option value={2}>主题三</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="弹窗模板">
                    <Select value={interact.windowType} onChange={this.changeDetailData.bind(this, 2, interact, 'windowType', null)}>
                        <Select.Option value={'event_emergency'}>应急详情</Select.Option>
                        <Select.Option value={'check_route'}>巡防路径详情</Select.Option>
                        <Select.Option value={'cloth_point'}>巡防服详情</Select.Option>
                        <Select.Option value={'problem_point'}>隐患上报详情</Select.Option>
                        <Select.Option value={'micro_grid'}>微网格详情</Select.Option>
                        <Select.Option value={'check_task'}>防疫卡点详情</Select.Option>
                        <Select.Option value={'parking'}>停车场详情</Select.Option>
                        <Select.Option value={'company'}>公司详情</Select.Option>
                        <Select.Option value={'rental_housing'}>出租房详情</Select.Option>
                        <Select.Option value={'old_man'}>独居老人详情</Select.Option>
                        <Select.Option value={'people_shangcheng'}>人员(上城)详情</Select.Option>
                        <Select.Option value={'car_use'}>用车详情(温州公安)</Select.Option>
                        <Select.Option value={'event_taizhou'}>事件详情(台州)</Select.Option>
                        <Select.Option value={'people_taizhou'}>人员详情(台州)</Select.Option>
                        <Select.Option value={'thing_yongjia'}>重点事(永嘉)</Select.Option>
                        <Select.Option value={'address_yongjia'}>重点场所(永嘉)</Select.Option>
                        <Select.Option value={'monitor_wzwt'}>监控(温州违停)</Select.Option>
                        <Select.Option value={'parking_wzwt'}>停车(温州违停)</Select.Option>
                        <Select.Option value={'thing_nanxing'}>南星事件详情</Select.Option>
                    </Select>
                </Form.Item>
                {interact.windowType === 'event_emergency' && (
                    <div>
                        <Form.Item label="预案接口">
                            <Input value={interact.planUrl}
                                   onChange={this.changeDetailData.bind(this, 1, interact, 'planUrl', null)}/>
                        </Form.Item>
                        <Form.Item label="小组接口">
                            <Input value={interact.groupUrl}
                                   onChange={this.changeDetailData.bind(this, 1, interact, 'groupUrl', null)}/>
                        </Form.Item>
                        <Form.Item label="启动接口">
                            <Input value={interact.reportUrl}
                                   onChange={this.changeDetailData.bind(this, 1, interact, 'reportUrl', null)}/>
                        </Form.Item>
                        <Form.Item label="通知组件">
                            <Select value={interact.receiveId} onChange={this.changeDetailData.bind(this, 2, interact, 'receiveId', null)}>
                                {this.props.componentList.map((component,componentIndex) => {
                                    if (component.id === this.props.data.id) {
                                        return '';
                                    } else {
                                        return <Select.Option value={component.id}key={componentIndex}>{component.nickName}</Select.Option>;
                                    }
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="传输键名" >
                            <Input value={interact.keyName}
                                   onChange={this.changeDetailData.bind(this, 1, interact, 'keyName', null)}/>
                        </Form.Item>
                    </div>
                )}
                {'car_use,thing_yongjia,address_yongjia'.indexOf(interact.windowType) >= 0 && (
                    <Collapse>
                        <Panel header="小弹框内点击交互" key="1">
                            {this.getCommonInteractEdit(interact.interactWindow)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, interact,'interactWindow',{})}>
                                    <Icon type="plus"/> 添加小弹框内交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                )}
            </div>
        );
    }

    //子图层设置
    getChildLayerEdit(layer){
        const formItemLayout10 = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        if(layer.whole == null){
            layer.whole = {};
        }
        if(layer.icon == null){
            layer.icon = [];
        }
        if(layer.interact == null){
            layer.interact = [];
        }
        return (
            <Collapse >
                <Panel header="全局图标" key="1">
                    <Form.Item label="图标" {...formItemLayout10}>
                        {
                            layer.whole.img ? (
                                <img alt="" onClick={this.selectIcon.bind(this,layer.whole,layer,'img')} src={fileUrl + '/download/' + layer.whole.img} className={cssStyle.icon}/>
                            ) : (
                                <Button type="dashed" onClick={this.selectIcon.bind(this,layer.whole,layer,'img')} >
                                    <Icon type="plus" /> 选择图标
                                </Button>
                            )
                        }
                    </Form.Item>
                    <Form.Item label="宽" {...formItemLayout10}>
                        <InputNumber value={layer.whole.width} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'width', null)} />
                    </Form.Item>
                    <Form.Item label="高" {...formItemLayout10}>
                        <InputNumber value={layer.whole.height} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'height', null)} />
                    </Form.Item>
                    <Form.Item label="垂直偏移" {...formItemLayout10}>
                        <InputNumber value={layer.whole.top} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'top', null)} />
                    </Form.Item>
                    <Form.Item label="水平偏移" {...formItemLayout10}>
                        <InputNumber value={layer.whole.left} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'left', null)} />
                    </Form.Item>
                </Panel>
                <Panel header="分类图标" key="2">
                    <Form.Item label="类型键名" {...formItemLayout10}>
                        <Input value={layer.key} onChange={this.changeDetailData.bind(this, 1, layer, 'key', null)} />
                    </Form.Item>
                    {layer.icon.map((icon,iconIndex) =>
                        <div key={iconIndex}>
                            <Tag closable={true} visible={true} onClose={this.deleteList.bind(this,layer.icon,iconIndex,layer)}>{'类型' + (iconIndex + 1)}</Tag>
                            <Form.Item label="类型键值" {...formItemLayout10}>
                                <Input value={icon.value} onChange={this.changeDetailData.bind(this, 1, icon, 'value', null)} />
                            </Form.Item>
                            <Form.Item label="图标" {...formItemLayout10}>
                                {
                                    icon.img ? (
                                        <img alt="" onClick={this.selectIcon.bind(this,icon,layer,'img')} src={fileUrl + '/download/' + icon.img} className={cssStyle.icon}/>
                                    ) : (
                                        <Button type="dashed" onClick={this.selectIcon.bind(this,icon,layer,'img')} >
                                            <Icon type="plus" /> 选择图标
                                        </Button>
                                    )
                                }
                            </Form.Item>
                            <Form.Item label="宽" {...formItemLayout10}>
                                <InputNumber value={icon.width} onChange={this.changeDetailData.bind(this, 2, icon, 'width', null)} />
                            </Form.Item>
                            <Form.Item label="高" {...formItemLayout10}>
                                <InputNumber value={icon.height} onChange={this.changeDetailData.bind(this, 2, icon, 'height', null)} />
                            </Form.Item>
                            <Form.Item label="垂直偏移" {...formItemLayout10}>
                                <InputNumber value={icon.top} onChange={this.changeDetailData.bind(this, 2, icon, 'top', null)} />
                            </Form.Item>
                            <Form.Item label="水平偏移" {...formItemLayout10}>
                                <InputNumber value={icon.left} onChange={this.changeDetailData.bind(this, 2, icon, 'left', null)} />
                            </Form.Item>
                        </div>
                    )}
                    <Form.Item {...formItemLayout10} label="">
                        <Button type="dashed" onClick={this.addListItem.bind(this,layer.icon,2)} >
                            <Icon type="plus" /> 添加类型
                        </Button>
                    </Form.Item>
                </Panel>
                <Panel header="交互" key="3" style={{marginBottom:'20px'}}>
                    {layer.interact.map((nearInteract,nearInteractIndex) =>
                        <div key={nearInteractIndex} style={{marginBottom:'20px'}}>
                            <Tag closable={true} visible={true} onClose={this.deleteList.bind(this,layer.interact,nearInteractIndex,null)}>{'交互内容' + (nearInteractIndex + 1)}</Tag>
                            <Form.Item label="交互方式" {...formItemLayout10}>
                                <Select value={nearInteract.type} onChange={this.changeDetailData.bind(this, 2, nearInteract, 'type', null)}>
                                    <Select.Option value={1}>显示组件</Select.Option>
                                    <Select.Option value={4}>发送数据</Select.Option>
                                    <Select.Option value={6}>地图内弹窗</Select.Option>
                                </Select>
                            </Form.Item>
                            {nearInteract.type !== 6 && (
                                <div>
                                    <Form.Item label="交互对象" {...formItemLayout10} >
                                        <Select value={nearInteract.receiveId} onChange={this.changeDetailData.bind(this, 2, nearInteract, 'receiveId', null)}>
                                            {this.props.componentList.map((component) => {
                                                if (component.id === this.props.data.id) {
                                                    return '';
                                                } else {
                                                    return <Select.Option value={component.id}
                                                                          key={component.id}>{component.nickName}</Select.Option>;
                                                }
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="内容键名" {...formItemLayout10}>
                                        <Input value={nearInteract.keyContent}
                                               onChange={this.changeDetailData.bind(this, 1, nearInteract, 'keyContent', null)}/>
                                    </Form.Item>
                                    <Form.Item label="传输键名" {...formItemLayout10}>
                                        <Input value={nearInteract.keyName}
                                               onChange={this.changeDetailData.bind(this, 1, nearInteract, 'keyName', null)}/>
                                    </Form.Item>
                                    <Form.Item {...formItemLayout10}
                                               label={
                                                   <Tooltip title="格式为json字串。">
                                                       附带数据*
                                                   </Tooltip>
                                               }
                                    >
                                        <Input value={nearInteract.remark}
                                               onChange={this.changeDetailData.bind(this, 1, nearInteract, 'remark', null)}/>
                                    </Form.Item>
                                </div>
                            )}
                            {nearInteract.type === 6 && this.getMapWindowEdit(nearInteract)}
                        </div>
                    )}
                    <Form.Item {...formItemLayout10} label="">
                        <Button type="dashed" onClick={this.addListItem.bind(this,layer.interact,4)} >
                            <Icon type="plus" /> 添加交互内容
                        </Button>
                    </Form.Item>
                </Panel>
            </Collapse>
        );
    }

    getInteractEdit(interact){
        return (
            <div>
                <Form.Item label="交互方式">
                    <Select value={interact.type} onChange={this.changeDetailData.bind(this, 2, interact, 'type', null)}>
                        <Select.Option value={1}>显示组件</Select.Option>
                        <Select.Option value={2}>显示周边</Select.Option>
                        <Select.Option value={3}>显示关联</Select.Option>
                        <Select.Option value={4}>发送数据</Select.Option>
                        <Select.Option value={5}>悬浮窗口</Select.Option>
                        <Select.Option value={6}>地图内弹窗</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="交互对象" style={{display: interact.type === 1 || interact.type === 4 ? 'block':'none'}}>
                    <Select value={interact.receiveId} onChange={this.changeDetailData.bind(this, 2, interact, 'receiveId', null)}>
                        {this.props.componentList.map((component,componentIndex) => {
                            if (component.id === this.props.data.id) {
                                return '';
                            } else {
                                return <Select.Option value={component.id}key={componentIndex}>{component.nickName}</Select.Option>;
                            }
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="内容键名"
                           style={{display: interact.type === 1 ? 'block' : 'none'}}>
                    <Input value={interact.keyContent}
                           onChange={this.changeDetailData.bind(this, 1, interact, 'keyContent', null)}/>
                </Form.Item>
                <Form.Item label="传输键名"
                           style={{display: interact.type === 1 ? 'block' : 'none'}}>
                    <Input value={interact.keyName}
                           onChange={this.changeDetailData.bind(this, 1, interact, 'keyName', null)}/>
                </Form.Item>
                <Form.Item style={{display: interact.type === 2 ? 'block' : 'none'}}
                           label={
                               <Tooltip title='周边半径范围，单位米。'>
                                   半径*
                               </Tooltip>
                           }
                >
                    <InputNumber value={interact.distance} onChange={this.changeDetailData.bind(this, 2, interact, 'distance', null)} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title="格式为json字串。">
                            附带数据*
                        </Tooltip>
                    }
                >
                    <Input value={interact.remark}
                           onChange={this.changeDetailData.bind(this, 1, interact, 'remark', null)}/>
                </Form.Item>
                {interact.type === 4 && (
                    <Collapse>
                        <Panel header="传输内容字段设置" key="1">
                            {interact.message && interact.message.map((messageItem,messageIndex) =>
                                <div key={messageIndex}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.message, messageIndex)}>{'列' + (messageIndex + 1)}</Tag>
                                    <Form.Item label="数据键名" >
                                        <Input value={messageItem.dataKey} onChange={changeDetailData.bind(this, 1, messageItem, 'dataKey')} />
                                    </Form.Item>
                                    <Form.Item label="传输键名" >
                                        <Input value={messageItem.messageKey} onChange={changeDetailData.bind(this, 1, messageItem, 'messageKey')} />
                                    </Form.Item>
                                    <Form.Item  label="数据格式">
                                        <Radio.Group value={messageItem.dataStyle} onChange={changeDetailData.bind(this, 1, messageItem, 'dataStyle')}>
                                            <Radio.Button value={1}>默认</Radio.Button>
                                            <Radio.Button value={2}>数组</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            )}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this,interact,'message',{})}>
                                    <Icon type="plus"/> 添加传输内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                )}
                {interact.type === 6 && this.getMapWindowEdit(interact)}

                <Collapse>
                    <Panel header="周边图层" key="1" style={{display: interact.type === 2 ? 'block' : 'none'}}>
                        {interact.nearLayer && interact.nearLayer.map((nearLayer,nearLayerIndex) =>
                            <div key={nearLayerIndex}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this,interact.nearLayer,nearLayerIndex)}>{'周边图层' + (nearLayerIndex + 1)}</Tag>
                                <Form.Item
                                    label={
                                        <Tooltip title='周边数据请求地址。返回数据示例：[{"id":"id","x":120,"y":30,"type":"type1"}]。请求条件参数内容：x(经度)、y(维度)、distance(半径)'>
                                            数据来源*
                                        </Tooltip>
                                    }
                                >
                                    <Input value={nearLayer.url} onChange={this.changeDetailData.bind(this, 1, nearLayer, 'url', null)} />
                                </Form.Item>
                                <Form.Item label="结果传输">
                                    <Switch checked={nearLayer.needSend} onChange={changeDetailData.bind(this, 2, nearLayer, 'needSend')}/>
                                </Form.Item>
                                <Form.Item label="通知组件">
                                    <Select value={nearLayer.receiveId} onChange={this.changeDetailData.bind(this, 2, nearLayer, 'receiveId', null)}>
                                        {this.props.componentList.map((component,componentIndex) => {
                                            if (component.id === this.props.data.id) {
                                                return '';
                                            } else {
                                                return <Select.Option value={component.id}key={componentIndex}>{component.nickName}</Select.Option>;
                                            }
                                        })}
                                    </Select>
                                </Form.Item>
                                {this.getChildLayerEdit(nearLayer)}
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,interact,'nearLayer',{})} >
                                <Icon type="plus" /> 添加周边图层
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="关联图层" key="2" style={{display: interact.type === 3 ? 'block' : 'none'}}>
                        {interact.aboutLayer && interact.aboutLayer.map((aboutLayer,aboutLayerIndex) =>
                            <div key={aboutLayerIndex}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this,interact.aboutLayer,aboutLayerIndex)}>{'周边图层' + (aboutLayerIndex + 1)}</Tag>
                                <Form.Item
                                    label={
                                        <Tooltip title='关联数据请求地址。返回数据示例：[{"id":"id","x":120,"y":30,"type":"type1"}]'>
                                            数据来源*
                                        </Tooltip>
                                    }
                                >
                                    <Input value={aboutLayer.url} onChange={this.changeDetailData.bind(this, 1, aboutLayer, 'url', null)} />
                                </Form.Item>
                                <Form.Item label="连线颜色">
                                    <ColorSelect color={aboutLayer.lineColor} setColor={this.setColor.bind(this, aboutLayer, 'lineColor', null)} />
                                </Form.Item>
                                <Form.Item label="连线宽度">
                                    <InputNumber value={aboutLayer.lineWidth} onChange={this.changeDetailData.bind(this, 2, aboutLayer, 'lineWidth', null)} />
                                </Form.Item>
                                {this.getChildLayerEdit(aboutLayer)}
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,interact,'aboutLayer',{})} >
                                <Icon type="plus" /> 添加关联图层
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </div>
        );
    }

    getGridColorSet(grid){
        if(grid.bgColorList == null){
            grid.bgColorList = [];
        }
        return this.getColorSet(grid.bgColorList,grid.calculateType,grid.colorType === 1 ? 'none':'');
    }

    //获取交互设置
    getInteractBoxEdit(layer,key,formItemLayout24){
        if(layer[key] == null){
            layer[key] = [];
        }
        return layer[key].map((interact,interactIndex) =>
            <Form {...formItemLayout24} key={interactIndex} style={{marginBottom:'20px'}}>
                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this,layer[key],interactIndex,null)}>{'交互内容' + (interactIndex + 1)}</Tag>
                <Form.Item label="响应类型">
                    <Select value={interact.actionType} onChange={this.changeDetailData.bind(this, 2, interact, 'actionType', null)}>
                        <Select.Option value={1}>固定一种交互方式</Select.Option>
                        <Select.Option value={2}>根据某字段不同值不同交互方式</Select.Option>
                    </Select>
                </Form.Item>
                {interact.actionType !== 2 && this.getInteractEdit(interact)}
                {interact.actionType === 2 && (
                    <div>
                        <Form.Item label="依据字段">
                            <Input value={interact.baseKey}
                                   onChange={this.changeDetailData.bind(this, 1, interact, 'baseKey', null)}/>
                        </Form.Item>
                        <Collapse>
                            <Panel header="依据内容设置" key="1">
                                {interact.baseList && interact.baseList.map((baseItem,baseIndex) =>
                                    <div key={baseIndex}>
                                        <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.baseList, baseIndex)}>{'方式' + (baseIndex + 1)}</Tag>
                                        <Form.Item label="值">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, baseItem, 'valueType')} value={baseItem.valueType}>
                                                <Radio value={'1'}>空</Radio>
                                                <Radio value={'2'}>非空</Radio>
                                                <Radio value={'other'}>
                                                    <Input value={baseItem.value} onChange={changeDetailData.bind(this, 1, baseItem, 'value')}/>
                                                </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {this.getInteractEdit(baseItem)}
                                    </div>
                                )}
                                <Form.Item {...formItemLayout24} label="">
                                    <Button type="dashed" onClick={addListItem.bind(this,interact,'baseList',this.baseItem)} >
                                        <Icon type="plus" /> 添加依据内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </div>
                )}
            </Form>
        )
    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        if(style.legend == null){
            style.legend = {};
        }
        if(style.select == null){
            style.select = {};
        }
        if(style.gridOne == null){
            style.gridOne = {};
        }
        const { grid,legend,select,gridOne } = style;
        return (
            <div>
                <Collapse >
                    <Panel header="地图基础设置" key="2">
                        <Form {...formItemLayout24} >
                            <Form.Item label="初始经度">
                                <InputNumber value={style.lon} min={0} max={360} onChange={this.changeDetailData.bind(this, 2, style, 'lon', null)} />
                            </Form.Item>
                            <Form.Item label="初始纬度">
                                <InputNumber value={style.lat} min={0} max={90} onChange={this.changeDetailData.bind(this, 2, style, 'lat', null)} />
                            </Form.Item>
                            <Form.Item label="放大层级">
                                <InputNumber value={style.zoom} min={0} max={16} onChange={this.changeDetailData.bind(this, 2, style, 'zoom', null)} />
                            </Form.Item>
                            <Form.Item label="边框线宽" >
                                <Input value={style.borderWidth} onChange={changeDetailData.bind(this, 1, style, 'borderWidth')} />
                            </Form.Item>
                            <Form.Item label="边框颜色" >
                                <ColorSelect color={style.borderColor} setColor={setColor.bind(this, style, 'borderColor')} />
                            </Form.Item>
                            {/*<Form.Item label="边框类型" >*/}
                            {/*    <Radio.Group value={style.borderStyle} onChange={changeDetailData.bind(this, 1, style, 'borderStyle')}>*/}
                            {/*        <Radio value="solid">实线</Radio>*/}
                            {/*        <Radio value="dashed">虚线1</Radio>*/}
                            {/*        <Radio value="dotted">虚线2</Radio>*/}
                            {/*    </Radio.Group>*/}
                            {/*</Form.Item>*/}
                            <Form.Item label="色调">
                                <Radio.Group value={style.layerColor} onChange={changeDetailData.bind(this, 1, style, 'layerColor')}>
                                    <Radio value={1}>白</Radio>
                                    <Radio value={2}>黑</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Form>
                    </Panel>
                    <Panel header="图层" key="1">
                        {style.layer.map((layer,layerIndex) =>
                            <div key={layerIndex} style={{marginBottom:'24px'}}>
                                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this,style.layer,layerIndex,true)}>{'图层' + (layerIndex + 1)}</Tag>
                                <Form {...formItemLayout24} >
                                    <Form.Item label="初始显示" >
                                        <Switch checked={layer.firstShow} onChange={this.changeDetailData.bind(this, 2, layer, 'firstShow', null)}/>
                                    </Form.Item>
                                    <Form.Item label="内容类型">
                                        <Radio.Group value={layer.type} onChange={this.changeDetailData.bind(this, 1, layer, 'type', layer)}>
                                            <Radio value={1}>点位</Radio>
                                            <Radio value={2}>线</Radio>
                                            <Radio value={3}>热力图</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="坐标系">
                                        <Radio.Group value={layer.wkid} onChange={this.changeDetailData.bind(this, 1, layer, 'wkid', layer)}>
                                            <Radio value={1}>天地图</Radio>
                                            <Radio value={2}>高德</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title='数据请求地址。返回数据示例：[{"id":"id","x":120,"y":30,"type":"type1"}]'>
                                                数据来源*
                                            </Tooltip>
                                        }
                                    >
                                        <Input value={layer.url} onChange={this.changeDetailData.bind(this, 1, layer, 'url', layer)} />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title="格式为json字串。">
                                                请求条件*
                                            </Tooltip>
                                        }
                                    >
                                        <Input value={layer.params}
                                               onChange={this.changeDetailData.bind(this, 1, layer, 'params', layer)}/>
                                    </Form.Item>
                                    <Form.Item
                                        {...formItemLayout24}
                                        label={
                                            <Tooltip title='数据定时刷新时间间隔，单位毫秒。'>
                                                刷新间隔*
                                            </Tooltip>
                                        }
                                    >
                                        <InputNumber value={layer.freshTime} onChange={changeDetailData.bind(this, 2, layer, 'freshTime')}/>
                                    </Form.Item>
                                    <Form.Item label="图层名称">
                                        <Input value={layer.name} onChange={this.changeDetailData.bind(this, 1, layer, 'name', null)} />
                                    </Form.Item>
                                    <Form.Item label="筛选开启">
                                        <Switch checked={layer.selectOpen} onChange={this.changeDetailData.bind(this, 2, layer, 'selectOpen', layer)}/>
                                    </Form.Item>
                                </Form>
                                <Collapse >
                                    <Panel header="图层全局样式设置" key="4">
                                        <Collapse>
                                            <Panel header="独立图标" key="1" style={{display:layer.type === 2 ? 'none':''}}>
                                                <Form {...formItemLayout24} >
                                                    <Form.Item label="图标">
                                                        {
                                                            layer.whole.img ? (
                                                                <img alt="" onClick={this.selectIcon.bind(this,layer.whole,layer,'img')} src={fileUrl + '/download/' + layer.whole.img} className={cssStyle.icon}/>
                                                            ) : (
                                                                <Button type="dashed" onClick={this.selectIcon.bind(this,layer.whole,layer,'img')} >
                                                                    <Icon type="plus" /> 选择图标
                                                                </Button>
                                                            )
                                                        }
                                                    </Form.Item>
                                                    <Form.Item label="选中图标">
                                                        {
                                                            layer.whole.selectedImg ? (
                                                                <img alt="" onClick={this.selectIcon.bind(this,layer.whole,layer,'selectedImg')} src={fileUrl + '/download/' + layer.whole.selectedImg} className={cssStyle.icon}/>
                                                            ) : (
                                                                <Button type="dashed" onClick={this.selectIcon.bind(this,layer.whole,layer,'selectedImg')} >
                                                                    <Icon type="plus" /> 选择图标
                                                                </Button>
                                                            )
                                                        }
                                                    </Form.Item>
                                                    <Form.Item label="宽">
                                                        <InputNumber value={layer.whole.width} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'width', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="高">
                                                        <InputNumber value={layer.whole.height} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'height', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="垂直偏移">
                                                        <InputNumber value={layer.whole.top} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'top', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="水平偏移">
                                                        <InputNumber value={layer.whole.left} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'left', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="标识字段">
                                                        <Input value={layer.textKey} onChange={this.changeDetailData.bind(this, 1, layer, 'textKey', layer)} />
                                                    </Form.Item>
                                                </Form>
                                            </Panel>
                                            <Panel header="聚合图标" key="2" style={{display:layer.type === 2 ? 'none':''}}>
                                                <Form {...formItemLayout24} >
                                                    <Form.Item label="图标">
                                                        {
                                                            layer.whole.clusterImg ? (
                                                                <img alt="" onClick={this.selectIcon.bind(this,layer.whole,layer,'clusterImg')} src={fileUrl + '/download/' + layer.whole.clusterImg} className={cssStyle.icon}/>
                                                            ) : (
                                                                <Button type="dashed" onClick={this.selectIcon.bind(this,layer.whole,layer,'clusterImg')} >
                                                                    <Icon type="plus" /> 选择图标
                                                                </Button>
                                                            )
                                                        }
                                                    </Form.Item>
                                                    <Form.Item label="宽">
                                                        <InputNumber value={layer.whole.clusterWidth} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'clusterWidth', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="高">
                                                        <InputNumber value={layer.whole.clusterHeight} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'clusterHeight', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="垂直偏移">
                                                        <InputNumber value={layer.whole.clusterTop} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'clusterTop', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="水平偏移">
                                                        <InputNumber value={layer.whole.clusterLeft} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'clusterLeft', layer)} />
                                                    </Form.Item>
                                                </Form>
                                            </Panel>
                                            <Panel header="数字标识" key="3" style={{display:layer.type === 2 ? 'none':''}}>
                                                <Form {...formItemLayout24} >
                                                    <Form.Item label="字体颜色">
                                                        <ColorSelect color={layer.whole.fontColor} setColor={this.setColor.bind(this, layer.whole, 'fontColor', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="字体大小">
                                                        <Input value={layer.whole.fontSize} onChange={this.changeDetailData.bind(this, 1, layer.whole, 'fontSize', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="垂直偏移">
                                                        <InputNumber value={layer.whole.fontTop} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'fontTop', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="水平偏移">
                                                        <InputNumber value={layer.whole.fontLeft} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'fontLeft', layer)} />
                                                    </Form.Item>
                                                </Form>
                                            </Panel>
                                            <Panel header="线样式" key="6" style={{display:layer.type !== 2 ? 'none':''}}>
                                                <Form {...formItemLayout24} >
                                                    <Form.Item label="线颜色">
                                                        <ColorSelect color={layer.whole.lineColor} setColor={this.setColor.bind(this, layer.whole, 'lineColor', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="线宽">
                                                        <InputNumber value={layer.whole.lineWidth} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'lineWidth', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="线类型">
                                                        <Select value={layer.whole.lineType} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'lineType', layer)}>
                                                            <Select.Option value={'dash'}>dash</Select.Option>
                                                            <Select.Option value={'dashdot'}>dashdot</Select.Option>
                                                            <Select.Option value={'longdashdotdot'}>dashdotdot</Select.Option>
                                                            <Select.Option value={'dot'}>dot</Select.Option>
                                                            <Select.Option value={'longdash'}>longdash</Select.Option>
                                                            <Select.Option value={'longdashdot'}>longdashdot</Select.Option>
                                                            <Select.Option value={'none'}>none</Select.Option>
                                                            <Select.Option value={'shortdash'}>shortdash</Select.Option>
                                                            <Select.Option value={'shortdashdot'}>shortdashdot</Select.Option>
                                                            <Select.Option value={'shortdashdotdot'}>shortdashdotdot</Select.Option>
                                                            <Select.Option value={'shortdot'}>shortdot</Select.Option>
                                                            <Select.Option value={'solid'}>solid</Select.Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Form>
                                            </Panel>
                                        </Collapse>
                                    </Panel>
                                    <Panel header="图标" key="1" style={{display:layer.type === 2 ? 'none':''}}>
                                        <Form.Item label="类型键名" {...formItemLayout24}>
                                            <Input value={layer.key} onChange={this.changeDetailData.bind(this, 1, layer, 'key', layer)} />
                                        </Form.Item>
                                        <Form.Item label="匹配方式">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, layer, 'iconSubType')} value={layer.iconSubType}>
                                                <Radio value={1}>相等</Radio>
                                                <Radio value={2}>区间</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {layer.icon.map((icon,iconIndex) =>
                                            <div key={iconIndex}>
                                                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this,layer.icon,iconIndex,layer)}>{'类型' + (iconIndex + 1)}</Tag>
                                                <Form {...formItemLayout24} >
                                                    {layer.iconSubType === 2 ? (
                                                        <React.Fragment >
                                                            <Form.Item label="大于等于">
                                                                <InputNumber value={icon.more} onChange={changeDetailData.bind(this, 2, icon, 'more')} />
                                                            </Form.Item>
                                                            <Form.Item label="小于">
                                                                <InputNumber value={icon.less} onChange={changeDetailData.bind(this, 2, icon, 'less')} />
                                                            </Form.Item>
                                                        </React.Fragment>
                                                    ):(
                                                        <Form.Item label="类型键值">
                                                            <Input value={icon.value} onChange={this.changeDetailData.bind(this, 1, icon, 'value', layer)} />
                                                        </Form.Item>
                                                    )}
                                                    <Form.Item label="图标">
                                                        {
                                                            icon.img ? (
                                                                <img alt="" onClick={this.selectIcon.bind(this,icon,layer,'img')} src={fileUrl + '/download/' + icon.img} className={cssStyle.icon}/>
                                                            ) : (
                                                                <Button type="dashed" onClick={this.selectIcon.bind(this,icon,layer,'img')} >
                                                                    <Icon type="plus" /> 选择图标
                                                                </Button>
                                                            )
                                                        }
                                                    </Form.Item>
                                                    <Form.Item label="宽">
                                                        <InputNumber value={icon.width} onChange={this.changeDetailData.bind(this, 2, icon, 'width', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="高">
                                                        <InputNumber value={icon.height} onChange={this.changeDetailData.bind(this, 2, icon, 'height', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="垂直偏移">
                                                        <InputNumber value={icon.top} onChange={this.changeDetailData.bind(this, 2, icon, 'top', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="水平偏移">
                                                        <InputNumber value={icon.left} onChange={this.changeDetailData.bind(this, 2, icon, 'left', layer)} />
                                                    </Form.Item>
                                                </Form>
                                            </div>
                                        )}
                                        <Form.Item {...formItemLayout24} label="">
                                            <Button type="dashed" onClick={this.addListItem.bind(this,layer.icon,2)} >
                                                <Icon type="plus" /> 添加类型
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                    <Panel header="热力图颜色设置" key="10" style={{display:layer.type === 2 ? 'none':''}}>
                                        <Form {...formItemLayout24} >
                                            {layer.heatColor && layer.heatColor.map((color,colorIndex)=>
                                                <React.Fragment key={colorIndex}>
                                                    <Tag closable={true} visible={true} onClose={deleteListItemWithTime.bind(this, layer.heatColor, colorIndex, layer)}>{'颜色设置' + (colorIndex + 1)}</Tag>
                                                    <Form.Item label={<Tooltip title='从0开始，到1结束。'>比率*</Tooltip>} >
                                                        {/*<InputNumber value={color.ratio} min={0} max={1} onChange={changeDetailData.bind(this, 2, color, 'ratio')} />*/}
                                                        <InputNumber value={color.ratio} min={0} max={1} onChange={this.changeDetailData.bind(this, 2, color, 'ratio', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="颜色">
                                                        <ColorSelect color={color.color} setColor={this.setColor.bind(this, color, 'color', layer)} />
                                                    </Form.Item>
                                                </React.Fragment>
                                            )}
                                            <Form.Item label="" style={{margin:'1vh'}}>
                                                <Button type="dashed"
                                                        onClick={addListItem.bind(this, layer, 'heatColor', this.heatColorItem,layer)}>
                                                    <Icon type="plus" /> 添加具体设置
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Panel>
                                    <Panel header="聚合" key="2" style={{display:layer.type === 2 ? 'none':''}}>
                                        <Form {...formItemLayout24} >
                                            <Form.Item label="是否开启" >
                                                <Switch checked={layer.cluster} onChange={this.changeDetailData.bind(this, 2, layer, 'cluster', layer)}/>
                                            </Form.Item>
                                            <Form.Item label="聚合方式" >
                                                <Radio.Group value={layer.clusterType} onChange={this.changeDetailData.bind(this, 1, layer, 'clusterType', layer)}>
                                                    <Radio value={1}>相近</Radio>
                                                    <Radio value={2}>相同</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                            {layer.renderer.map((renderer,rendererIndex) =>
                                                <div key={rendererIndex} style={{marginBottom:'20px'}}>
                                                    <Tag closable={true} visible={true} onClose={this.deleteList.bind(this,layer.renderer,rendererIndex,layer)}>{'聚合层级' + (rendererIndex + 1)}</Tag>
                                                    <Form.Item label="区间">
                                                        <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)', marginBottom: 0 }} >
                                                            <InputNumber value={renderer.min} onChange={this.changeDetailData.bind(this, 2, renderer, 'min', layer)} style={{width:'100%'}}/>
                                                        </Form.Item>
                                                        <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                                                        <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)', marginBottom: 0 }}>
                                                            <InputNumber value={renderer.max} onChange={this.changeDetailData.bind(this, 2, renderer, 'max', layer)} style={{width:'100%'}}/>
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Collapse>
                                                        <Panel header="图标" key="1">
                                                            <Form.Item label="图标">
                                                                {
                                                                    renderer.img ? (
                                                                        <img alt="" onClick={this.selectIcon.bind(this,renderer,layer,'img')} src={fileUrl + '/download/' + renderer.img} className={cssStyle.icon}/>
                                                                    ) : (
                                                                        <Button type="dashed" onClick={this.selectIcon.bind(this,renderer,layer,'img')} >
                                                                            <Icon type="plus" /> 选择图标
                                                                        </Button>
                                                                    )
                                                                }
                                                            </Form.Item>
                                                            <Form.Item label="宽">
                                                                <InputNumber value={renderer.width} onChange={this.changeDetailData.bind(this, 2, renderer, 'width', layer)} />
                                                            </Form.Item>
                                                            <Form.Item label="高">
                                                                <InputNumber value={renderer.height} onChange={this.changeDetailData.bind(this, 2, renderer, 'height', layer)} />
                                                            </Form.Item>
                                                            <Form.Item label="垂直偏移">
                                                                <InputNumber value={renderer.top} onChange={this.changeDetailData.bind(this, 2, renderer, 'top', layer)} />
                                                            </Form.Item>
                                                            <Form.Item label="水平偏移">
                                                                <InputNumber value={renderer.left} onChange={this.changeDetailData.bind(this, 2, renderer, 'left', layer)} />
                                                            </Form.Item>
                                                        </Panel>
                                                        <Panel header="数字标识" key="2">
                                                            <Form.Item label="字体颜色">
                                                                <ColorSelect color={renderer.fontColor} setColor={this.setColor.bind(this, renderer, 'fontColor', layer)} />
                                                            </Form.Item>
                                                            <Form.Item label="字体大小">
                                                                <Input value={renderer.fontSize} onChange={this.changeDetailData.bind(this, 1, renderer, 'fontSize', layer)} />
                                                            </Form.Item>
                                                            <Form.Item label="垂直偏移">
                                                                <InputNumber value={renderer.fontTop} onChange={this.changeDetailData.bind(this, 2, renderer, 'fontTop', layer)} />
                                                            </Form.Item>
                                                            <Form.Item label="水平偏移">
                                                                <InputNumber value={renderer.fontLeft} onChange={this.changeDetailData.bind(this, 2, renderer, 'fontLeft', layer)} />
                                                            </Form.Item>
                                                        </Panel>
                                                    </Collapse>
                                                </div>
                                            )}
                                            <Form.Item {...formItemLayout24} label="">
                                                <Button type="dashed" onClick={this.addListItem.bind(this,layer.renderer,3)} >
                                                    <Icon type="plus" /> 添加聚合层级
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Panel>
                                    <Panel header="线样式" key="7" style={{display:layer.type !== 2 ? 'none':''}}>
                                        <Form.Item label="类型键名" {...formItemLayout24}>
                                            <Input value={layer.key} onChange={this.changeDetailData.bind(this, 1, layer, 'key', layer)} />
                                        </Form.Item>
                                        {layer.line && layer.line.map((line,lineIndex) =>
                                            <div key={lineIndex}>
                                                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this,layer.line,lineIndex,layer)}>{'类型' + (lineIndex + 1)}</Tag>
                                                <Form {...formItemLayout24} >
                                                    <Form.Item label="类型键值">
                                                        <Input value={line.value} onChange={this.changeDetailData.bind(this, 1, line, 'value', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="线颜色">
                                                        <ColorSelect color={line.lineColor} setColor={this.setColor.bind(this, line, 'lineColor', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="线宽">
                                                        <InputNumber value={line.lineWidth} onChange={this.changeDetailData.bind(this, 2, line, 'lineWidth', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="线类型">
                                                        <Select value={line.lineType} onChange={this.changeDetailData.bind(this, 2, line, 'lineType', layer)}>
                                                            <Select.Option value={'dash'}>dash</Select.Option>
                                                            <Select.Option value={'dashdot'}>dashdot</Select.Option>
                                                            <Select.Option value={'longdashdotdot'}>dashdotdot</Select.Option>
                                                            <Select.Option value={'dot'}>dot</Select.Option>
                                                            <Select.Option value={'longdash'}>longdash</Select.Option>
                                                            <Select.Option value={'longdashdot'}>longdashdot</Select.Option>
                                                            <Select.Option value={'none'}>none</Select.Option>
                                                            <Select.Option value={'shortdash'}>shortdash</Select.Option>
                                                            <Select.Option value={'shortdashdot'}>shortdashdot</Select.Option>
                                                            <Select.Option value={'shortdashdotdot'}>shortdashdotdot</Select.Option>
                                                            <Select.Option value={'shortdot'}>shortdot</Select.Option>
                                                            <Select.Option value={'solid'}>solid</Select.Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Form>
                                            </div>
                                        )}
                                        <Form.Item {...formItemLayout24} label="">
                                            <Button type="dashed" onClick={addListItem.bind(this,layer,'line',{})} >
                                                <Icon type="plus" /> 添加类型
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                    <Panel header="数据划分" key="3">
                                        {layer.category.map((category,categoryIndex) =>
                                            <Form key={categoryIndex} {...formItemLayout24}>
                                                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this,layer.category,categoryIndex,layer)}>{'划分方式' + (categoryIndex + 1)}</Tag>
                                                <Form.Item label="划分名称">
                                                    <Input value={category.name} onChange={this.changeDetailData.bind(this, 1, category, 'name', layer)} />
                                                </Form.Item>
                                                <Form.Item label="类型键名">
                                                    <Input value={category.key} onChange={this.changeDetailData.bind(this, 1, category, 'key', layer)} />
                                                </Form.Item>
                                                <Form.Item label="匹配方式">
                                                    <Radio.Group value={category.subType} onChange={this.changeDetailData.bind(this, 1, category, 'subType', layer)}>
                                                        <Radio value={1}>相等</Radio>
                                                        <Radio value={2}>相似</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                                <Form.Item label="数据来源">
                                                    <Radio.Group value={category.dataType} onChange={this.changeDetailData.bind(this, 1, category, 'dataType', layer)}>
                                                        <Radio value={1}>固定类型</Radio>
                                                        <Radio value={2}>接口获取</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                                <Form.Item
                                                    label={
                                                        <Tooltip title='数据请求地址。返回数据示例：[{"value":"1","label":"类型1"},{"value":"2","label":"类型2"}]'>
                                                            接口地址*
                                                        </Tooltip>
                                                    }
                                                    style={{display: category.dataType === 2 ? 'block':'none'}} >
                                                    <Input value={category.url} onChange={this.changeDetailData.bind(this, 1, category, 'url', layer)} />
                                                </Form.Item>
                                                <Collapse style={{display: category.dataType === 1 ? 'block':'none',marginBottom:'10px'}}>
                                                    <Panel header="类型数据" key="1">
                                                        {category.typeList.map((type,typeIndex) =>
                                                            <div key={typeIndex}>
                                                                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this,category.typeList,typeIndex,layer)}>{'类型' + (typeIndex + 1)}</Tag>
                                                                <Form.Item label="类型名称">
                                                                    <Input value={type.label} onChange={this.changeDetailData.bind(this, 1, type, 'label', layer)} />
                                                                </Form.Item>
                                                                <Form.Item label="类型键值">
                                                                    <Input value={type.value} onChange={this.changeDetailData.bind(this, 1, type, 'value', layer)} />
                                                                </Form.Item>
                                                            </div>
                                                        )}
                                                        <Form.Item {...formItemLayout24} label="">
                                                            <Button type="dashed" onClick={this.addListItem.bind(this,category.typeList,6)} >
                                                                <Icon type="plus" /> 添加类型
                                                            </Button>
                                                        </Form.Item>
                                                    </Panel>
                                                </Collapse>
                                            </Form>
                                        )}
                                        <Form.Item {...formItemLayout24} label="">
                                            <Button type="dashed" onClick={this.addListItem.bind(this,layer.category,5)} >
                                                <Icon type="plus" /> 添加划分方式
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                    <Panel header="单独点交互" key="5">
                                        {this.getInteractBoxEdit(layer,'interact',formItemLayout24)}
                                        <Form.Item {...formItemLayout24} label="">
                                            <Button type="dashed" onClick={this.addListItem.bind(this,layer.interact,4)} >
                                                <Icon type="plus" /> 添加交互内容
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                    <Panel header="聚合点交互" key="6">
                                        {this.getInteractBoxEdit(layer,'clusterInteract',formItemLayout24)}
                                        <Form.Item {...formItemLayout24} label="">
                                            <Button type="dashed" onClick={this.addListItem.bind(this,layer.clusterInteract,4)} >
                                                <Icon type="plus" /> 添加交互内容
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                            </div>
                        )}
                        <Form.Item {...formItemLayout24} label="">
                            <Button type="dashed" onClick={this.addListItem.bind(this,style.layer,1)} >
                                <Icon type="plus" /> 添加图层
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="网格" key="3">
                        <Form {...formItemLayout24} >
                            <Form.Item label="是否开启">
                                <Switch checked={grid.open}
                                        onChange={this.changeDetailData.bind(this, 2, grid, 'open', grid)}/>
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='网格数据请求地址。返回数据示例：[{"id":"1","name":"xx区","arcgisPoints":[...]}]'>
                                        数据来源*
                                    </Tooltip>
                                }
                            >
                                <Input value={grid.url} onChange={this.changeDetailData.bind(this, 1, grid, 'url', grid)} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='网格数据请求参数。格式为json字串'>
                                        请求参数*
                                    </Tooltip>
                                }
                            >
                                <Input value={grid.urlParams} onChange={this.changeDetailData.bind(this, 1, grid, 'urlParams', grid)} />
                            </Form.Item>
                            <Collapse style={{marginBottom: '20px'}}>
                                <Panel header="网格颜色设置" key="1">
                                    <Form.Item
                                        label={
                                            <Tooltip title='固定为内容设置内字体颜色，特殊为根据规则展示不同颜色。'>
                                                颜色类型*
                                            </Tooltip>
                                        }
                                    >
                                        <Radio.Group size="small" value={grid.colorType}
                                                     onChange={changeDetailData.bind(this, 1, grid, 'colorType')}>
                                            <Radio.Button value={1}>固定</Radio.Button>
                                            <Radio.Button value={2}>特殊</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="网格颜色" >
                                        <ColorSelect color={grid.backgroundColor} setColor={this.setColor.bind(this, grid, 'backgroundColor', grid)} />
                                    </Form.Item>
                                    <Form.Item label="依据字段" style={{display:grid.colorType !== 2 ? 'none':''}}>
                                        <Input value={grid.colorKey} onChange={this.changeDetailData.bind(this, 1, grid, 'colorKey', grid)} />
                                    </Form.Item>
                                    <Form.Item label="依据内容" style={{display:grid.colorType !== 2 ? 'none':''}}>
                                        <Input value={grid.colorUrl} onChange={this.changeDetailData.bind(this, 1, grid, 'colorUrl', grid)} />
                                    </Form.Item>
                                    <Form.Item
                                        style={{display:grid.colorType !== 2 ? 'none':''}}
                                        label={
                                            <Tooltip title='数据定时刷新时间间隔，单位毫秒。'>
                                                刷新间隔*
                                            </Tooltip>
                                        }
                                    >
                                        <InputNumber value={grid.freshTime} onChange={changeDetailData.bind(this, 2, grid, 'freshTime')}/>
                                    </Form.Item>
                                    <Form.Item label="匹配字段" style={{display:grid.colorType !== 2 ? 'none':''}}>
                                        <Input value={grid.subKey} onChange={this.changeDetailData.bind(this, 1, grid, 'subKey', grid)} />
                                    </Form.Item>
                                    <Form.Item label="计算方式" style={{display:grid.colorType !== 2 ? 'none':''}}>
                                        <Radio.Group size="small" value={grid.calculateType}
                                                     onChange={changeDetailData.bind(this, 1, grid, 'calculateType')}>
                                            <Radio.Button value={1}>相等</Radio.Button>
                                            <Radio.Button value={2}>区间</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    {this.getGridColorSet(grid)}
                                </Panel>
                                <Panel header="分割线设置" key="2">
                                    <Form.Item label="颜色">
                                        <ColorSelect color={grid.lineColor} setColor={this.setColor.bind(this, grid, 'lineColor', grid)} />
                                    </Form.Item>
                                    <Form.Item label="线宽">
                                        <InputNumber value={grid.lineWidth} min={1} onChange={this.changeDetailData.bind(this, 2, grid, 'lineWidth', grid)} />
                                    </Form.Item>
                                    <Form.Item label="线类型">
                                        <Select value={grid.lineType} onChange={this.changeDetailData.bind(this, 2, grid, 'lineType', grid)}>
                                            <Select.Option value={'dash'}>dash</Select.Option>
                                            <Select.Option value={'dashdot'}>dashdot</Select.Option>
                                            <Select.Option value={'longdashdotdot'}>dashdotdot</Select.Option>
                                            <Select.Option value={'dot'}>dot</Select.Option>
                                            <Select.Option value={'longdash'}>longdash</Select.Option>
                                            <Select.Option value={'longdashdot'}>longdashdot</Select.Option>
                                            <Select.Option value={'none'}>none</Select.Option>
                                            <Select.Option value={'shortdash'}>shortdash</Select.Option>
                                            <Select.Option value={'shortdashdot'}>shortdashdot</Select.Option>
                                            <Select.Option value={'shortdashdotdot'}>shortdashdotdot</Select.Option>
                                            <Select.Option value={'shortdot'}>shortdot</Select.Option>
                                            <Select.Option value={'solid'}>solid</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Panel>
                                <Panel header="边线设置" key="3">
                                    <Form.Item label="是否显示">
                                        <Switch checked={grid.allLine}
                                                onChange={this.changeDetailData.bind(this, 2, grid, 'allLine', grid)}/>
                                    </Form.Item>
                                    <Form.Item label="颜色">
                                        <ColorSelect color={grid.allLineColor} setColor={this.setColor.bind(this, grid, 'allLineColor', grid)} />
                                    </Form.Item>
                                    <Form.Item label="线宽">
                                        <InputNumber value={grid.allLineWidth} min={1} onChange={this.changeDetailData.bind(this, 2, grid, 'allLineWidth', grid)} />
                                    </Form.Item>
                                    <Form.Item label="线类型">
                                        <Select value={grid.allLineType} onChange={this.changeDetailData.bind(this, 2, grid, 'allLineType', grid)}>
                                            <Select.Option value={'dash'}>dash</Select.Option>
                                            <Select.Option value={'dashdot'}>dashdot</Select.Option>
                                            <Select.Option value={'longdashdotdot'}>dashdotdot</Select.Option>
                                            <Select.Option value={'dot'}>dot</Select.Option>
                                            <Select.Option value={'longdash'}>longdash</Select.Option>
                                            <Select.Option value={'longdashdot'}>longdashdot</Select.Option>
                                            <Select.Option value={'none'}>none</Select.Option>
                                            <Select.Option value={'shortdash'}>shortdash</Select.Option>
                                            <Select.Option value={'shortdashdot'}>shortdashdot</Select.Option>
                                            <Select.Option value={'shortdashdotdot'}>shortdashdotdot</Select.Option>
                                            <Select.Option value={'shortdot'}>shortdot</Select.Option>
                                            <Select.Option value={'solid'}>solid</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Panel>
                                <Panel header="网格名称设置" key="4">
                                    <Form.Item label="是否显示">
                                        <Switch checked={grid.showName}
                                                onChange={this.changeDetailData.bind(this, 2, grid, 'showName', grid)}/>
                                    </Form.Item>
                                    <Form.Item label="字体颜色">
                                        <ColorSelect color={grid.fontColor} setColor={this.setColor.bind(this, grid, 'fontColor', grid)} />
                                    </Form.Item>
                                    <Form.Item label="字体大小">
                                        <Input value={grid.fontSize} onChange={this.changeDetailData.bind(this, 1, grid, 'fontSize', grid)} />
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        </Form>
                    </Panel>
                    <Panel header="行政区划（网格结构）" key="4">
                        <Form {...formItemLayout24} >
                            <Form.Item label="是否显示">
                                <Switch checked={grid.treeOpen}
                                        onChange={this.changeDetailData.bind(this, 2, grid, 'treeOpen', grid)}/>
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='网格结构数据请求地址。返回数据示例：[{"key":"1","title":"xx区","children":[{"key":"2","title":"xx街道"}]}]'>
                                        结构来源*
                                    </Tooltip>
                                }
                            >
                                <Input value={grid.treeUrl} onChange={this.changeDetailData.bind(this, 1, grid, 'treeUrl', grid)} />
                            </Form.Item>
                            <Collapse>
                                <Panel header="交互内容" key="1">
                                    {grid.interact.map((interact,interactIndex) =>
                                        <div key={interactIndex}>
                                            <Tag closable={true} visible={true} onClose={this.deleteList.bind(this,grid.interact,interactIndex,null)}>{'交互内容' + (interactIndex + 1)}</Tag>
                                            <Form.Item label="交互对象">
                                                <Select value={interact.receiveId} onChange={this.changeDetailData.bind(this, 2, interact, 'receiveId', null)}>
                                                    {style.layer.map((layer,layerIndex) =>
                                                        <Select.Option value={layer.id} key={layerIndex}>{layer.name}</Select.Option>
                                                    )}
                                                    <Select.Option value='grid' key='grid'>网格</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="键名">
                                                <Input value={interact.keyName} onChange={this.changeDetailData.bind(this, 1, interact, 'keyName', null)} />
                                            </Form.Item>
                                            <Form.Item label="键值">
                                                <Radio.Group value={interact.dataType} onChange={this.changeDetailData.bind(this, 1, interact, 'dataType', null)}>
                                                    <Radio value={1}>区划id</Radio>
                                                    <Radio value={2}>区划名称</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        </div>
                                    )}
                                    <Form.Item label="">
                                        <Button type="dashed" onClick={this.addListItem.bind(this,grid.interact,7)} >
                                            <Icon type="plus" /> 添加交互对象
                                        </Button>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        </Form>
                    </Panel>
                    <Panel header="图例" key="5">
                        <Form {...formItemLayout24} >
                            <Form.Item label="图例图片">
                                {
                                    legend.img ? (
                                        <img alt="" onClick={this.selectIcon.bind(this,legend,null,'img')} src={fileUrl + '/download/' + legend.img} className={cssStyle.icon}/>
                                    ) : (
                                        <Button type="dashed" onClick={this.selectIcon.bind(this,legend,null,'img')} >
                                            <Icon type="plus" /> 选择图标
                                        </Button>
                                    )
                                }
                            </Form.Item>
                            <Form.Item label="宽">
                                <Input value={legend.width} min={0} max={360} onChange={this.changeDetailData.bind(this, 1, legend, 'width', null)} />
                            </Form.Item>
                            <Form.Item label="高">
                                <Input value={legend.height} min={0} max={360} onChange={this.changeDetailData.bind(this, 1, legend, 'height', null)} />
                            </Form.Item>
                            <Form.Item label="左">
                                <Input value={legend.left} min={0} max={360} onChange={this.changeDetailData.bind(this, 1, legend, 'left', null)} />
                            </Form.Item>
                            <Form.Item label="上">
                                <Input value={legend.top} min={0} max={360} onChange={this.changeDetailData.bind(this, 1, legend, 'top', null)} />
                            </Form.Item>
                            <Form.Item label="右">
                                <Input value={legend.right} min={0} max={360} onChange={this.changeDetailData.bind(this, 1, legend, 'right', null)} />
                            </Form.Item>
                            <Form.Item label="下">
                                <Input value={legend.bottom} min={0} max={360} onChange={this.changeDetailData.bind(this, 1, legend, 'bottom', null)} />
                            </Form.Item>
                        </Form>
                    </Panel>
                    <Panel header="筛选框位置" key="6">
                        <Form {...formItemLayout24}>
                            <Form.Item label="高">
                                <Input value={select.height} onChange={this.changeDetailData.bind(this, 1, select, 'height', null)} />
                            </Form.Item>
                            <Form.Item label="左">
                                <Input value={select.left} onChange={this.changeDetailData.bind(this, 1, select, 'left', null)} />
                            </Form.Item>
                            <Form.Item label="右">
                                <Input value={select.right} onChange={this.changeDetailData.bind(this, 1, select, 'right', null)} />
                            </Form.Item>
                            <Form.Item label="上">
                                <Input value={select.top} onChange={this.changeDetailData.bind(this, 1, select, 'top', null)} />
                            </Form.Item>
                        </Form>
                    </Panel>
                    <Panel header="特殊网格" key="7">
                        <Form {...formItemLayout24} >
                            <Form.Item
                                label={
                                    <Tooltip title='网格数据请求地址。'>
                                        数据来源*
                                    </Tooltip>
                                }
                            >
                                <Input value={gridOne.url} onChange={this.changeDetailData.bind(this, 1, gridOne, 'url', gridOne)} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='网格数据请求参数。格式为json字串'>
                                        请求参数*
                                    </Tooltip>
                                }
                            >
                                <Input value={gridOne.urlParams} onChange={this.changeDetailData.bind(this, 1, gridOne, 'urlParams', gridOne)} />
                            </Form.Item>
                            <Form.Item label="线宽">
                                <InputNumber value={gridOne.lineWidth} onChange={this.changeDetailData.bind(this, 2, gridOne, 'lineWidth', gridOne)} />
                            </Form.Item>
                            <Form.Item label="线类型">
                                <Select value={gridOne.lineType} onChange={this.changeDetailData.bind(this, 2, gridOne, 'lineType', gridOne)}>
                                    <Select.Option value={'dash'}>dash</Select.Option>
                                    <Select.Option value={'dashdot'}>dashdot</Select.Option>
                                    <Select.Option value={'longdashdotdot'}>dashdotdot</Select.Option>
                                    <Select.Option value={'dot'}>dot</Select.Option>
                                    <Select.Option value={'longdash'}>longdash</Select.Option>
                                    <Select.Option value={'longdashdot'}>longdashdot</Select.Option>
                                    <Select.Option value={'none'}>none</Select.Option>
                                    <Select.Option value={'shortdash'}>shortdash</Select.Option>
                                    <Select.Option value={'shortdashdot'}>shortdashdot</Select.Option>
                                    <Select.Option value={'shortdashdotdot'}>shortdashdotdot</Select.Option>
                                    <Select.Option value={'shortdot'}>shortdot</Select.Option>
                                    <Select.Option value={'solid'}>solid</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Panel>
                    <Panel header="遮罩设置" key="8">
                        <Form {...formItemLayout24} >
                            <Form.Item label="透明度" >
                                <InputNumber value={style.shadeOpacity} onChange={changeDetailData.bind(this, 2, style, 'shadeOpacity')}/>
                            </Form.Item>
                            <Form.Item label="渐变类型" >
                                <Radio.Group value={style.shadeGradientType} onChange={changeDetailData.bind(this, 1, style, 'shadeGradientType')}>
                                    <Radio.Button value="radial">径向</Radio.Button>
                                    <Radio.Button value="linear">线性</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            {style.shadeGradientType === 'linear' && (
                                <Form.Item label="渐变角度">
                                    <Slider defaultValue={180} max={180} min={0} value={style.shadeAngle} onChange={changeDetailData.bind(this, 2, style, 'shadeAngle')}/>
                                </Form.Item>
                            )}
                            {this.getColorList(style.shadeColor)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this,style,'shadeColor',{})}>
                                    <Icon type="plus"/> 添加颜色
                                </Button>
                            </Form.Item>
                        </Form>
                    </Panel>
                </Collapse>
                <FileSelect
                    title="图标选择"
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    imgSelect={this.imgSelect.bind(this)} token={this.props.token}
                    width={650}
                />
            </div>
        );
    }
}
