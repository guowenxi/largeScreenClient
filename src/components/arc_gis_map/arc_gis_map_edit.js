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
    Select, Slider, Col,
} from 'antd';
import FileSelect from "../../common/fileSelect";
import ColorSelect from "../../common/colorSelect";
// import InputNumber from "../../common/inputNumberEx";
import { fileUrl } from '../../config';
import cssStyle from './arc_gis_map.module.css';
import {
    addListItem,
    changeDetailData,
    deleteListItem,
    deleteListItemWithTime,
    getInteractEdit,
    getLayerChangeEdit,
    setColor
} from "../../common/editUtil";
import { getColorList, getColorSet } from "../../common/nameNumEditUtil";

const { Panel } = Collapse;

export default class ArcGisMapEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false };
        this.baseItem = {};
        this.getColorSet = getColorSet.bind(this);
        this.getColorList = getColorList.bind(this);
        this.colorItemOne = { num: 1, color: 'rgb(61,219,88)' };
        this.colorItemTwo = { bottom: 1, top: 2, color: 'rgb(61,219,88)' };
        this.getCommonInteractEdit = getInteractEdit.bind(this);
        this.heatColorItem = { ratio: 1.0, color: "rgb(46,167,224,0.9)" };
        this.getLayerChangeEdit = getLayerChangeEdit.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    changeDetailData(type, item, key, part, event) {
        this.props.saveNowDataToHistory();
        item[key] = type === 1 ? event.target.value : event;
        let thisData = { ...this.props.data };
        if (part != null) {
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
        item[key] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        let thisData = { ...this.props.data };
        if (part != null) {
            const now = new Date().getTime();
            part.updateTime = now;
            thisData.updateTime = now;
        }
        this.props.updateData(thisData);
    }

    //删除列表内某项
    deleteList(list, index, layer) {
        this.props.saveNowDataToHistory();
        list.splice(index, 1);
        let thisData = { ...this.props.data };
        if (layer != null) {
            const now = new Date().getTime();
            if (layer !== true) {
                layer.updateTime = now;
            }
            thisData.updateTime = now;
        }
        this.props.updateData(thisData);
    }

    addListItem(list, type) {
        this.props.saveNowDataToHistory();
        switch (type) {
            case 1:
                //新增图层
                list.push({
                    id: (new Date()).getTime(),
                    firstShow: true,
                    type: 1,
                    url: 'http://localhost:3000/json/people.json',
                    name: '',
                    key: 'type',
                    cluster: false,
                    selectOpen: true,
                    whole: {
                        img: '',
                        selectedImg: '',
                        width: 44,
                        height: 48,
                        top: 22,
                        left: 0,
                        clusterImg: '',
                        clusterWidth: 44,
                        clusterHeight: 48,
                        clusterTop: 22,
                        clusterLeft: 0,
                        fontSize: 20,
                        fontTop: 22,
                        fontLeft: 0,
                        fontColor: '#0ff'
                    },
                    renderer: [],
                    icon: [],
                    category: [],
                    interact: [],
                    clusterInteract: []
                });
                break;
            case 2:
                //新增图标类型
                list.push({
                    value: 'type1',
                    img: '',
                    width: '',
                    height: '',
                    top: '',
                    left: ''
                });
                break;
            case 3:
                //新增聚合层级
                list.push({
                    min: 0,
                    max: 100,
                    img: '',
                    width: '',
                    height: '',
                    top: '',
                    left: '',
                    fontSize: '',
                    fontTop: '',
                    fontLeft: '',
                    fontColor: '#0ff',
                });
                break;
            case 4:
                //图层点击交互内容
                list.push({ type: 1, dataType: 1, receiveId: '', keyName: '', nearLayer: [], distance: 500, aboutLayer: [] });
                break;
            case 8:
                //周边图层/关联图层
                list.push({ url: '', lineColor: '#0ff', lineWidth: 3, lineType: 'solid', whole: { img: '', width: '', height: '', top: '', left: '' }, icon: [], interact: [] });
                break;
            case 5:
                //分类方式
                list.push({ key: '', name: '', dataType: 1, typeList: [], url: '' });
                break;
            case 6:
                //分类类型
                list.push({ value: '', label: '' });
                break;
            case 7:
                //行政区划点击交互内容
                list.push({ dataType: 1, receiveId: '', keyName: '' });
                break;
            default:
                break;
        }
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    //选择图标素材弹框
    selectIcon(item, layer, key) {
        this.editPart = item;
        if(layer){
            this.editLayer = layer;
        }
        this.editKey = key;
        this.setState({ visible: true });
    }

    //暂存选中的图标素材
    imgSelect(id) {
        this.selectedImg = id;
    }

    //确定选中图标素材
    handleOk() {
        const now = new Date().getTime();
        this.props.saveNowDataToHistory();
        this.editPart[this.editKey] = this.selectedImg;
        let thisData = { ...this.props.data };
        if (this.editLayer != null) {
            this.editLayer.updateTime = now;
            thisData.updateTime = now;
        }
        this.props.updateData(thisData);
        this.setState({ visible: false });
    }

    //取消选择
    handleCancel() {
        this.setState({ visible: false });
    }

    getWindowContentEdit(interact){
        return (
            <React.Fragment>
                <Form.Item label="弹窗主题">
                    <Select value={interact.windowTheme} onChange={this.changeDetailData.bind(this, 2, interact, 'windowTheme', null)}>
                        <Select.Option value={0}>主题一</Select.Option>
                        <Select.Option value={1}>主题二</Select.Option>
                        <Select.Option value={2}>主题三</Select.Option>
                        <Select.Option value={3}>主题四</Select.Option>
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
                        <Select.Option value={'event_taizhou'}>事件详情1(台州)</Select.Option>
                        <Select.Option value={'event_two'}>事件详情2(乐清)</Select.Option>
                        <Select.Option value={'people_taizhou'}>人员详情(台州)</Select.Option>
                        <Select.Option value={'thing_yongjia'}>重点事(永嘉)</Select.Option>
                        <Select.Option value={'address_yongjia'}>重点场所(永嘉)</Select.Option>
                        <Select.Option value={'monitor_wzwt'}>监控(温州违停)</Select.Option>
                        <Select.Option value={'parking_wzwt'}>停车(温州违停)</Select.Option>
                        <Select.Option value={'thing_nanxing'}>南星事件详情</Select.Option>
                        <Select.Option value={'sanitation_truck'}>环卫车</Select.Option>
                        <Select.Option value={'sanitation_worker'}>环卫工</Select.Option>
                        <Select.Option value={'carNumber'}>南星消防车</Select.Option>
                        <Select.Option value={'thing_ruian'}>重点事(瑞安)</Select.Option>
                        <Select.Option value={'people_ruian'}>人员(瑞安)</Select.Option>
                        <Select.Option value={'company_jiande'}>公司名(建德)</Select.Option>
                        <Select.Option value={'emergency_jiande'}>应急处置(建德)</Select.Option>
                        <Select.Option value={'project'}>项目(温州大数据)</Select.Option>
                        <Select.Option value={'building'}>楼盘详情(富阳</Select.Option>
                        <Select.Option value={'building_two'}>楼盘详情(杭州</Select.Option>
                        <Select.Option value={'care_home'}>关爱之家(杭州</Select.Option>
                        <Select.Option value={'party'}>党建详情(芦岙</Select.Option>
                        <Select.Option value={'camera_hls'}>hls监控</Select.Option>
                        <Select.Option value={'detail_one'}>点位详情(芦岙</Select.Option>
                        <Select.Option value={'detail_linan'}>临安点位详情(临安</Select.Option>
                        <Select.Option value={'detail_yueqing'}>点位详情(乐清</Select.Option>
                    </Select>
                </Form.Item>
            </React.Fragment>
        );
    }

    //地图内弹窗设置
    getMapWindowEdit(interact) {
        return (
            <div>
                {this.getWindowContentEdit(interact)}
                {(interact.windowType === 'sanitation_truck' || interact.windowType === 'sanitation_worker'|| interact.windowType === 'car_use') && (
                    <React.Fragment>
                        <Form.Item label="轨迹接口">
                            <Input value={interact.trailUrl}
                                   onChange={this.changeDetailData.bind(this, 1, interact, 'trailUrl', null)} />
                        </Form.Item>
                        <Form.Item label="坐标系">
                            <Radio.Group value={interact.wkid} onChange={changeDetailData.bind(this, 1, interact, 'wkid')}>
                                <Radio value={1}>天地图</Radio>
                                <Radio value={2}>高德</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </React.Fragment>
                )}
                {interact.windowType === 'event_emergency' && (
                    <div>
                        <Form.Item label="预案接口">
                            <Input value={interact.planUrl}
                                onChange={this.changeDetailData.bind(this, 1, interact, 'planUrl', null)} />
                        </Form.Item>
                        <Form.Item label="小组接口">
                            <Input value={interact.groupUrl}
                                onChange={this.changeDetailData.bind(this, 1, interact, 'groupUrl', null)} />
                        </Form.Item>
                        <Form.Item label="启动接口">
                            <Input value={interact.reportUrl}
                                onChange={this.changeDetailData.bind(this, 1, interact, 'reportUrl', null)} />
                        </Form.Item>
                        <Form.Item label="通知组件">
                            <Select value={interact.receiveId} onChange={this.changeDetailData.bind(this, 2, interact, 'receiveId', null)}>
                                {this.props.componentList.map((component, componentIndex) => {
                                    if (component.id === this.props.data.id) {
                                        return '';
                                    } else {
                                        return <Select.Option value={component.id} key={componentIndex}>{component.nickName}</Select.Option>;
                                    }
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="传输键名" >
                            <Input value={interact.keyName}
                                onChange={this.changeDetailData.bind(this, 1, interact, 'keyName', null)} />
                        </Form.Item>
                    </div>
                )}
                {'people_ruian,care_home,detail_linan,party,camera_hls,detail_one,event_two'.indexOf(interact.windowType) >= 0 && (
                    <React.Fragment>
                        <Form.Item label="服务地址">
                            <Input value={interact.detailUrl}
                                   onChange={this.changeDetailData.bind(this, 1, interact, 'detailUrl', null)} />
                        </Form.Item>
                        <Form.Item label="传参键名">
                            <Input value={interact.idKey}
                                   onChange={this.changeDetailData.bind(this, 1, interact, 'idKey', null)} />
                        </Form.Item>
                        <Form.Item label="数据键名">
                            <Input value={interact.dataKey}
                                   onChange={this.changeDetailData.bind(this, 1, interact, 'dataKey', null)} />
                        </Form.Item>
                    </React.Fragment>
                )}
                {'car_use,thing_yongjia,address_yongjia,rental_housing,thing_ruian,people_ruian,care_home,building_three'.indexOf(interact.windowType) >= 0 && (
                    <Collapse>
                        <Panel header="小弹框内点击交互" key="1">
                            {this.getCommonInteractEdit(interact.interactWindow)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, interact, 'interactWindow', {})}>
                                    <Icon type="plus" /> 添加小弹框内交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                )}
                {/* 临安详情 轨迹 */}
                {'detail_linan'.indexOf(interact.windowType) >= 0 && (
                    <Collapse>
                        <Panel header="小弹框内点击交互" key="1">
                            {this.getCommonInteractEdit(interact.interactWindow1)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, interact, 'interactWindow1', {})}>
                                    <Icon type="plus" /> 添加小弹框内交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                        
                    </Collapse>
                )}
                {/* 临安详情 签到历史 */}
                {'detail_linan'.indexOf(interact.windowType) >= 0 && (
                    <Collapse>
                        <Panel header="小弹框内点击交互" key="1">
                            {this.getCommonInteractEdit(interact.interactWindow2)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, interact, 'interactWindow2', {})}>
                                    <Icon type="plus" /> 添加小弹框内交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                )} {/* 杭州房产详情 查看详情 */}
                {/* {'building_three'.indexOf(interact.windowType) >= 0 && (
                    <Collapse>
                        <Panel header="小弹框内点击交互" key="1">
                            {this.getCommonInteractEdit(interact.interactWindow1)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, interact, 'interactWindow1', {})}>
                                    <Icon type="plus" /> 添加小弹框内交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                )} */}
            </div>
        );
    }

    getIconEdit(item,layer,formItemLayout){
        return (
            <React.Fragment>
                <Form.Item label="图标" {...formItemLayout}>
                    {
                        item.img ? (
                            <img alt="" onClick={this.selectIcon.bind(this, item, layer, 'img')} src={fileUrl + '/download/' + item.img} className={cssStyle.icon} />
                        ) : (
                            <Button type="dashed" onClick={this.selectIcon.bind(this, item, layer, 'img')} >
                                <Icon type="plus" /> 选择图标
                            </Button>
                        )
                    }
                </Form.Item>
                <Form.Item label="宽" {...formItemLayout}>
                    <InputNumber value={item.width} onChange={this.changeDetailData.bind(this, 2, item, 'width', null)} />
                </Form.Item>
                <Form.Item label="高" {...formItemLayout}>
                    <InputNumber value={item.height} onChange={this.changeDetailData.bind(this, 2, item, 'height', null)} />
                </Form.Item>
                <Form.Item label="垂直偏移" {...formItemLayout}>
                    <InputNumber value={item.top} onChange={this.changeDetailData.bind(this, 2, item, 'top', null)} />
                </Form.Item>
                <Form.Item label="水平偏移" {...formItemLayout}>
                    <InputNumber value={item.left} onChange={this.changeDetailData.bind(this, 2, item, 'left', null)} />
                </Form.Item>
            </React.Fragment>
        )
    }

    //子图层设置
    getChildLayerEdit(layer,formItemLayout24) {
        const formItemLayout10 = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
        };
        if (layer.whole == null) {
            layer.whole = {};
        }
        if (layer.icon == null) {
            layer.icon = [];
        }
        if (layer.interact == null) {
            layer.interact = [];
        }
        return (
            <Collapse >
                <Panel header="全局图标" key="1">
                    {this.getIconEdit(layer.whole,layer,formItemLayout10)}
                </Panel>
                <Panel header="分类图标" key="2">
                    <Form.Item label="类型键名" {...formItemLayout10}>
                        <Input value={layer.key} onChange={this.changeDetailData.bind(this, 1, layer, 'key', null)} />
                    </Form.Item>
                    {layer.icon.map((icon, iconIndex) =>
                        <div key={iconIndex}>
                            <Tag closable={true} visible={true} onClose={this.deleteList.bind(this, layer.icon, iconIndex, layer)}>{'类型' + (iconIndex + 1)}</Tag>
                            <Form.Item label="类型键值" {...formItemLayout10}>
                                <Input value={icon.value} onChange={this.changeDetailData.bind(this, 1, icon, 'value', null)} />
                            </Form.Item>
                            <Form.Item label="图标" {...formItemLayout10}>
                                {
                                    icon.img ? (
                                        <img alt="" onClick={this.selectIcon.bind(this, icon, layer, 'img')} src={fileUrl + '/download/' + icon.img} className={cssStyle.icon} />
                                    ) : (
                                            <Button type="dashed" onClick={this.selectIcon.bind(this, icon, layer, 'img')} >
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
                        <Button type="dashed" onClick={this.addListItem.bind(this, layer.icon, 2)} >
                            <Icon type="plus" /> 添加类型
                        </Button>
                    </Form.Item>
                </Panel>
                <Panel header="交互" key="3" style={{ marginBottom: '20px' }}>
                    {this.getInteractBoxEdit(layer, 'interact', formItemLayout24)}
                    <Form.Item {...formItemLayout24} label="">
                        <Button type="dashed" onClick={this.addListItem.bind(this, layer.interact, 4)} >
                            <Icon type="plus" /> 添加交互内容
                        </Button>
                    </Form.Item>
                </Panel>
            </Collapse>
        );
    }

    getMapSelectInteractEdit(interact) {
        const { style } = this.props.data;
        if (style.category && style.category.length > 0) {
            if (interact.mapSelectList == null) {
                interact.mapSelectList = style.category.map(() => {
                    return {};
                });
            } else if (interact.mapSelectList.length !== style.category.length) {
                style.category.forEach((category, index) => {
                    if (interact.mapSelectList[index] == null) {
                        interact.mapSelectList[index] = {};
                    }
                });
            }
            return interact.mapSelectList.map((item, index) =>
                <React.Fragment key={index}>
                    <Tag closable={false} visible={true} >{'划分方式' + (index + 1)}</Tag>
                    <Form.Item label="传输键名">
                        <Input value={item.keyName}
                            onChange={this.changeDetailData.bind(this, 1, item, 'keyName', null)} />
                    </Form.Item>
                </React.Fragment>
            )
        } else {
            return '';
        }
    }

    getInteractEdit(interact,formItemLayout24) {
        const { style } = this.props.data;
        return (
            <div>
                <Form.Item label="响应方式" >
                    <Select value={interact.respondType} onChange={this.changeDetailData.bind(this, 2, interact, 'respondType', null)}>
                        <Select.Option value={1}>默认</Select.Option>
                        <Select.Option value={2}>重复点击发送空数据</Select.Option>
                        <Select.Option value={3}>重复点击重复同一响应</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="交互方式">
                    <Select value={interact.type} onChange={this.changeDetailData.bind(this, 2, interact, 'type', null)}>
                        <Select.Option value={1}>显示组件</Select.Option>
                        <Select.Option value={2}>显示周边</Select.Option>
                        <Select.Option value={3}>显示关联</Select.Option>
                        <Select.Option value={4}>发送数据</Select.Option>
                        <Select.Option value={5}>悬浮窗口</Select.Option>
                        <Select.Option value={6}>地图内弹窗</Select.Option>
                        <Select.Option value={8}>页面图层切换</Select.Option>
                        <Select.Option value={9}>修改条件</Select.Option>
                        <Select.Option value={10}>放大地图</Select.Option>
                        <Select.Option value={11}>切换选中</Select.Option>
                        <Select.Option value={12}>页面跳转</Select.Option>
                    </Select>
                </Form.Item>
                {interact.type === 12 && (
                    <Form.Item label="页面地址" >
                        <Input value={interact.pageId} onChange={changeDetailData.bind(this, 1, interact, 'pageId')} />
                    </Form.Item>
                )}
                {interact.type === 10 && (
                    <Form.Item label="放大层级" >
                        <InputNumber value={interact.zoom} onChange={changeDetailData.bind(this, 2, interact, 'zoom')} />
                    </Form.Item>
                )}
                <Form.Item label="交互对象" style={{ display: interact.type === 1 || interact.type === 4 || interact.type === 9 || interact.type === 11 ? 'block' : 'none' }}>
                    <Select value={interact.receiveId} onChange={this.changeDetailData.bind(this, 2, interact, 'receiveId', null)}>
                        {this.props.componentList.map((component, componentIndex) => {
                            if (component.id === this.props.data.id) {
                                return '';
                            } else {
                                return <Select.Option value={component.id} key={componentIndex}>{component.nickName}</Select.Option>;
                            }
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="内容键名"
                    style={{ display: interact.type === 1 ? 'block' : 'none' }}>
                    <Input value={interact.keyContent}
                        onChange={this.changeDetailData.bind(this, 1, interact, 'keyContent', null)} />
                </Form.Item>
                <Form.Item label="传输键名"
                    style={{ display: interact.type === 1 ? 'block' : 'none' }}>
                    <Input value={interact.keyName}
                        onChange={this.changeDetailData.bind(this, 1, interact, 'keyName', null)} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title='是否同时传输地图全局筛选过滤条件'>
                            筛选传输*
                        </Tooltip>
                    }
                    style={{ display: interact.type === 1 || interact.type === 4 || interact.type === 9 ? 'block' : 'none' }}
                >
                    <Switch checked={interact.mapSelect}
                        onChange={this.changeDetailData.bind(this, 2, interact, 'mapSelect', null)} />
                </Form.Item>
                {interact.mapSelect && style.category && this.getMapSelectInteractEdit(interact)}
                <Form.Item style={{ display: interact.type === 2 ? 'block' : 'none' }}
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
                        onChange={this.changeDetailData.bind(this, 1, interact, 'remark', null)} />
                </Form.Item>
                {(interact.type === 6 || interact.type === 5) && this.getMapWindowEdit(interact)}
                { (interact.type === 1 || interact.type === 11 || interact.type === 4 || interact.type === 9 || interact.windowType === 'sanitation_truck' || interact.windowType === 'sanitation_worker'|| interact.windowType === 'car_use') && (
                    <Collapse>
                        <Panel header="传输内容字段设置" key="1">
                            {interact.message && interact.message.map((messageItem, messageIndex) =>
                                <div key={messageIndex}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.message, messageIndex)}>{'列' + (messageIndex + 1)}</Tag>
                                    <Form.Item  label="内容来源">
                                        <Radio.Group value={messageItem.dataSource} onChange={changeDetailData.bind(this, 1, messageItem, 'dataSource')}>
                                            <Radio.Button value={1}>请求结果</Radio.Button>
                                            <Radio.Button value={2}>请求条件</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="数据键名" >
                                        <Input value={messageItem.dataKey} onChange={changeDetailData.bind(this, 1, messageItem, 'dataKey')} />
                                    </Form.Item>
                                    <Form.Item label="传输键名" >
                                        <Input value={messageItem.messageKey} onChange={changeDetailData.bind(this, 1, messageItem, 'messageKey')} />
                                    </Form.Item>
                                    <Form.Item label="数据格式">
                                        <Radio.Group value={messageItem.dataStyle} onChange={changeDetailData.bind(this, 1, messageItem, 'dataStyle')}>
                                            <Radio.Button value={1}>默认</Radio.Button>
                                            <Radio.Button value={2}>数组</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            )}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, interact, 'message', {})}>
                                    <Icon type="plus" /> 添加传输内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                )}
                {interact.type === 8 && (
                    <div>
                        {this.getLayerChangeEdit(interact, 'showList', 1)}
                        {this.getLayerChangeEdit(interact, 'hideList', 2)}
                    </div>
                )}
                <Collapse>
                    <Panel header="周边图层" key="1" style={{ display: interact.type === 2 ? 'block' : 'none' }}>
                        {interact.nearLayer && interact.nearLayer.map((nearLayer, nearLayerIndex) =>
                            <div key={nearLayerIndex}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.nearLayer, nearLayerIndex)}>{'周边图层' + (nearLayerIndex + 1)}</Tag>
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
                                    <Switch checked={nearLayer.needSend} onChange={changeDetailData.bind(this, 2, nearLayer, 'needSend')} />
                                </Form.Item>
                                <Form.Item label="通知组件">
                                    <Select value={nearLayer.receiveId} onChange={this.changeDetailData.bind(this, 2, nearLayer, 'receiveId', null)}>
                                        {this.props.componentList.map((component, componentIndex) => {
                                            if (component.id === this.props.data.id) {
                                                return '';
                                            } else {
                                                return <Select.Option value={component.id} key={componentIndex}>{component.nickName}</Select.Option>;
                                            }
                                        })}
                                    </Select>
                                </Form.Item>
                                {this.getChildLayerEdit(nearLayer,formItemLayout24)}
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, interact, 'nearLayer', {})} >
                                <Icon type="plus" /> 添加周边图层
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="关联图层" key="2" style={{ display: interact.type === 3 ? 'block' : 'none' }}>
                        {interact.aboutLayer && interact.aboutLayer.map((aboutLayer, aboutLayerIndex) =>
                            <div key={aboutLayerIndex}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.aboutLayer, aboutLayerIndex)}>{'周边图层' + (aboutLayerIndex + 1)}</Tag>
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
                                {this.getChildLayerEdit(aboutLayer,formItemLayout24)}
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, interact, 'aboutLayer', {})} >
                                <Icon type="plus" /> 添加关联图层
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </div>
        );
    }

    getGridColorSet(grid,key) {
        if (grid[key] == null) {
            grid[key] = [];
        }
        return this.getColorSet(grid[key], grid.calculateType, grid.colorType === 1 ? 'none' : '');
    }

    //获取交互设置
    getInteractBoxEdit(layer, key, formItemLayout24) {
        if (layer[key] == null) {
            layer[key] = [];
        }
        return layer[key].map((interact, interactIndex) =>
            <Form {...formItemLayout24} key={interactIndex} style={{ marginBottom: '20px' }}>
                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this, layer[key], interactIndex, null)}>{'交互内容' + (interactIndex + 1)}</Tag>
                <Form.Item label="响应类型">
                    <Select value={interact.actionType} onChange={this.changeDetailData.bind(this, 2, interact, 'actionType', null)}>
                        <Select.Option value={1}>固定一种交互方式</Select.Option>
                        <Select.Option value={2}>根据某字段不同值不同交互方式</Select.Option>
                    </Select>
                </Form.Item>
                {interact.actionType !== 2 && this.getInteractEdit(interact,formItemLayout24)}
                {interact.actionType === 2 && (
                    <div>
                        <Form.Item label="依据字段">
                            <Input value={interact.baseKey}
                                onChange={this.changeDetailData.bind(this, 1, interact, 'baseKey', null)} />
                        </Form.Item>
                        <Collapse>
                            <Panel header="依据内容设置" key="1">
                                {interact.baseList && interact.baseList.map((baseItem, baseIndex) =>
                                    <div key={baseIndex}>
                                        <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.baseList, baseIndex)}>{'方式' + (baseIndex + 1)}</Tag>
                                        <Form.Item label="值">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, baseItem, 'valueType')} value={baseItem.valueType}>
                                                <Radio value={'1'}>空</Radio>
                                                <Radio value={'2'}>非空</Radio>
                                                <Radio value={'other'}>
                                                    <Input value={baseItem.value} onChange={changeDetailData.bind(this, 1, baseItem, 'value')} />
                                                </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {this.getInteractEdit(baseItem,formItemLayout24)}
                                    </div>
                                )}
                                <Form.Item {...formItemLayout24} label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, interact, 'baseList', this.baseItem)} >
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
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        if (style.legend == null) {
            style.legend = {};
        }
        if (style.select == null) {
            style.select = {};
        }
        if (style.gridOne == null) {
            style.gridOne = {};
        }
        if (style.searchTrail == null) {
            style.searchTrail = {};
        }
        if (style.trailTimeLine == null) {
            style.trailTimeLine = {};
        }
        const { grid, legend, select, gridOne, searchTrail, trailTimeLine } = style;
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
                            <Form.Item label="背景颜色" >
                                <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
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
                                    <Radio value={1}>白(默认</Radio>
                                    <Radio value={2}>蓝黑</Radio>
                                    <Radio value={3}>黑</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="底图类型">
                                <Radio.Group value={style.mapBase} onChange={changeDetailData.bind(this, 1, style, 'mapBase')}>
                                    <Radio value='TDT'>天地图</Radio>
                                    <Radio value='TDTTY'>天地图(影像图</Radio>
                                    <Radio value='ZT'>数字政通</Radio>
                                    <Radio value='TDTBlue'>天地图（蓝色）</Radio>
                                </Radio.Group>
                            </Form.Item>
                            {style.mapBase === 'TDT' && (
                                <Form.Item label="地名显示">
                                    <Radio.Group value={style.addressShow} onChange={changeDetailData.bind(this, 1, style, 'addressShow')}>
                                        <Radio value={1}>显示(默认)</Radio>
                                        <Radio value={2}>不显示</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            )}
                        </Form>
                    </Panel>
                    <Panel header="图层" key="1">
                        {style.layer.map((layer, layerIndex) =>
                            <div key={layerIndex} style={{ marginBottom: '24px' }}>
                                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this, style.layer, layerIndex, true)}>{'图层' + (layerIndex + 1)}</Tag>
                                <Form {...formItemLayout24} >
                                    <Form.Item label="初始显示" >
                                        <Switch checked={layer.firstShow} onChange={this.changeDetailData.bind(this, 2, layer, 'firstShow', null)} />
                                    </Form.Item>
                                    <Form.Item label="图层层级" >
                                        <InputNumber value={layer.zoom} onChange={changeDetailData.bind(this, 2, layer, 'zoom')} />
                                    </Form.Item>
                                    <Form.Item label="初始加载" >
                                        <Radio.Group value={layer.firstLoad} onChange={this.changeDetailData.bind(this, 1, layer, 'firstLoad', layer)}>
                                            <Radio.Button value={1}>是</Radio.Button>
                                            <Radio.Button value={0}>否</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="内容类型">
                                        <Radio.Group value={layer.type} onChange={this.changeDetailData.bind(this, 1, layer, 'type', layer)}>
                                            <Radio value={1}>点位</Radio>
                                            <Radio value={2}>线</Radio>
                                            <Radio value={3}>热力图</Radio>
                                            <Radio value={4}>网格相关数据</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="坐标系">
                                        <Radio.Group value={layer.wkid} onChange={this.changeDetailData.bind(this, 1, layer, 'wkid', layer)}>
                                            <Radio value={1}>天地图</Radio>
                                            <Radio value={2}>高德</Radio>
                                            <Radio value={3}>百度</Radio>
                                            {/*<Radio value={4}>CGCS2000</Radio>*/}
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
                                            onChange={this.changeDetailData.bind(this, 1, layer, 'params', layer)} />
                                    </Form.Item>
                                    <Form.Item
                                        {...formItemLayout24}
                                        label={
                                            <Tooltip title='数据定时刷新时间间隔，单位毫秒。'>
                                                刷新间隔*
                                            </Tooltip>
                                        }
                                    >
                                        <InputNumber value={layer.freshTime} onChange={changeDetailData.bind(this, 2, layer, 'freshTime')} />
                                    </Form.Item>
                                    <Form.Item label="图层名称">
                                        <Input value={layer.name} onChange={this.changeDetailData.bind(this, 1, layer, 'name', null)} />
                                    </Form.Item>
                                    <Form.Item label="筛选开启">
                                        <Switch checked={layer.selectOpen} onChange={this.changeDetailData.bind(this, 2, layer, 'selectOpen', layer)} />
                                    </Form.Item>
                                </Form>
                                <Collapse >
                                    <Panel header="图层全局样式设置" key="4">
                                        <Collapse>
                                            <Panel header="独立图标" key="1" style={{ display: layer.type === 2 ? 'none' : '' }}>
                                                <Form {...formItemLayout24} >
                                                    <Form.Item label="图标">
                                                        {
                                                            layer.whole.img ? (
                                                                <img alt="" onClick={this.selectIcon.bind(this, layer.whole, layer, 'img')} src={fileUrl + '/download/' + layer.whole.img} className={cssStyle.icon} />
                                                            ) : (
                                                                    <Button type="dashed" onClick={this.selectIcon.bind(this, layer.whole, layer, 'img')} >
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
                                            <Panel header="选中图标" key="7" style={{ display: layer.type === 2 ? 'none' : '' }}>
                                                <Form {...formItemLayout24} >
                                                    <Form.Item label="选中图标">
                                                        {
                                                            layer.whole.selectedImg ? (
                                                                <img alt="" onClick={this.selectIcon.bind(this, layer.whole, layer, 'selectedImg')} src={fileUrl + '/download/' + layer.whole.selectedImg} className={cssStyle.icon} />
                                                            ) : (
                                                                    <Button type="dashed" onClick={this.selectIcon.bind(this, layer.whole, layer, 'selectedImg')} >
                                                                        <Icon type="plus" /> 选择图标
                                                                    </Button>
                                                                )
                                                        }
                                                    </Form.Item>
                                                    <Form.Item label="宽">
                                                        <InputNumber value={layer.whole.selectedWidth} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'selectedWidth', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="高">
                                                        <InputNumber value={layer.whole.selectedHeight} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'selectedHeight', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="垂直偏移">
                                                        <InputNumber value={layer.whole.selectedTop} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'selectedTop', layer)} />
                                                    </Form.Item>
                                                    <Form.Item label="水平偏移">
                                                        <InputNumber value={layer.whole.selectedLeft} onChange={this.changeDetailData.bind(this, 2, layer.whole, 'selectedLeft', layer)} />
                                                    </Form.Item>
                                                </Form>
                                            </Panel>
                                            <Panel header="聚合图标" key="2" style={{ display: layer.type === 2 ? 'none' : '' }}>
                                                <Form {...formItemLayout24} >
                                                    <Form.Item label="图标">
                                                        {
                                                            layer.whole.clusterImg ? (
                                                                <img alt="" onClick={this.selectIcon.bind(this, layer.whole, layer, 'clusterImg')} src={fileUrl + '/download/' + layer.whole.clusterImg} className={cssStyle.icon} />
                                                            ) : (
                                                                    <Button type="dashed" onClick={this.selectIcon.bind(this, layer.whole, layer, 'clusterImg')} >
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
                                            <Panel header="数字标识" key="3" style={{ display: layer.type === 2 ? 'none' : '' }}>
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
                                            <Panel header="线样式" key="6" style={{ display: layer.type !== 2 ? 'none' : '' }}>
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
                                    <Panel header="图标" key="1" style={{ display: layer.type === 2 ? 'none' : '' }}>
                                        <Form.Item label="类型键名" {...formItemLayout24}>
                                            <Input value={layer.key} onChange={this.changeDetailData.bind(this, 1, layer, 'key', layer)} />
                                        </Form.Item>
                                        <Form.Item label="匹配方式">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, layer, 'iconSubType')} value={layer.iconSubType}>
                                                <Radio value={1}>相等</Radio>
                                                <Radio value={2}>区间</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {layer.icon.map((icon, iconIndex) =>
                                            <div key={iconIndex}>
                                                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this, layer.icon, iconIndex, layer)}>{'类型' + (iconIndex + 1)}</Tag>
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
                                                    ) : (
                                                            <Form.Item label="类型键值">
                                                                <Input value={icon.value} onChange={this.changeDetailData.bind(this, 1, icon, 'value', layer)} />
                                                            </Form.Item>
                                                        )}
                                                    <Form.Item label="图标">
                                                        {
                                                            icon.img ? (
                                                                <img alt="" onClick={this.selectIcon.bind(this, icon, layer, 'img')} src={fileUrl + '/download/' + icon.img} className={cssStyle.icon} />
                                                            ) : (
                                                                    <Button type="dashed" onClick={this.selectIcon.bind(this, icon, layer, 'img')} >
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
                                            <Button type="dashed" onClick={this.addListItem.bind(this, layer.icon, 2)} >
                                                <Icon type="plus" /> 添加类型
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                    <Panel header="热力图颜色设置" key="10" style={{ display: layer.type === 2 ? 'none' : '' }}>
                                        <Form {...formItemLayout24} >
                                            {layer.heatColor && layer.heatColor.map((color, colorIndex) =>
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
                                            <Form.Item label="" style={{ margin: '1vh' }}>
                                                <Button type="dashed"
                                                    onClick={addListItem.bind(this, layer, 'heatColor', this.heatColorItem, layer)}>
                                                    <Icon type="plus" /> 添加具体设置
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Panel>
                                    <Panel header="聚合" key="2" style={{ display: layer.type === 2 ? 'none' : '' }}>
                                        <Form {...formItemLayout24} >
                                            <Form.Item label="是否开启" >
                                                <Switch checked={layer.cluster} onChange={this.changeDetailData.bind(this, 2, layer, 'cluster', layer)} />
                                            </Form.Item>
                                            <Form.Item label="聚合方式" >
                                                <Radio.Group value={layer.clusterType} onChange={this.changeDetailData.bind(this, 1, layer, 'clusterType', layer)}>
                                                    <Radio value={1}>相近</Radio>
                                                    <Radio value={2}>相同</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                            {layer.renderer.map((renderer, rendererIndex) =>
                                                <div key={rendererIndex} style={{ marginBottom: '20px' }}>
                                                    <Tag closable={true} visible={true} onClose={this.deleteList.bind(this, layer.renderer, rendererIndex, layer)}>{'聚合层级' + (rendererIndex + 1)}</Tag>
                                                    <Form.Item label="区间">
                                                        <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)', marginBottom: 0 }} >
                                                            <InputNumber value={renderer.min} onChange={this.changeDetailData.bind(this, 2, renderer, 'min', layer)} style={{ width: '100%' }} />
                                                        </Form.Item>
                                                        <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                                                        <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)', marginBottom: 0 }}>
                                                            <InputNumber value={renderer.max} onChange={this.changeDetailData.bind(this, 2, renderer, 'max', layer)} style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Collapse>
                                                        <Panel header="图标" key="1">
                                                            <Form.Item label="图标">
                                                                {
                                                                    renderer.img ? (
                                                                        <img alt="" onClick={this.selectIcon.bind(this, renderer, layer, 'img')} src={fileUrl + '/download/' + renderer.img} className={cssStyle.icon} />
                                                                    ) : (
                                                                            <Button type="dashed" onClick={this.selectIcon.bind(this, renderer, layer, 'img')} >
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
                                                <Button type="dashed" onClick={this.addListItem.bind(this, layer.renderer, 3)} >
                                                    <Icon type="plus" /> 添加聚合层级
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Panel>
                                    <Panel header="线样式" key="7" style={{ display: layer.type !== 2 ? 'none' : '' }}>
                                        <Form.Item label="类型键名" {...formItemLayout24}>
                                            <Input value={layer.key} onChange={this.changeDetailData.bind(this, 1, layer, 'key', layer)} />
                                        </Form.Item>
                                        {layer.line && layer.line.map((line, lineIndex) =>
                                            <div key={lineIndex}>
                                                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this, layer.line, lineIndex, layer)}>{'类型' + (lineIndex + 1)}</Tag>
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
                                            <Button type="dashed" onClick={addListItem.bind(this, layer, 'line', {})} >
                                                <Icon type="plus" /> 添加类型
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                    <Panel header="数据划分" key="3">
                                        {layer.category.map((category, categoryIndex) =>
                                            <Form key={categoryIndex} {...formItemLayout24}>
                                                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this, layer.category, categoryIndex, layer)}>{'划分方式' + (categoryIndex + 1)}</Tag>
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
                                                    style={{ display: category.dataType === 2 ? 'block' : 'none' }} >
                                                    <Input value={category.url} onChange={this.changeDetailData.bind(this, 1, category, 'url', layer)} />
                                                </Form.Item>
                                                <Collapse style={{ display: category.dataType === 1 ? 'block' : 'none', marginBottom: '10px' }}>
                                                    <Panel header="类型数据" key="1">
                                                        {category.typeList.map((type, typeIndex) =>
                                                            <div key={typeIndex}>
                                                                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this, category.typeList, typeIndex, layer)}>{'类型' + (typeIndex + 1)}</Tag>
                                                                <Form.Item label="类型名称">
                                                                    <Input value={type.label} onChange={this.changeDetailData.bind(this, 1, type, 'label', layer)} />
                                                                </Form.Item>
                                                                <Form.Item label="类型键值">
                                                                    <Input value={type.value} onChange={this.changeDetailData.bind(this, 1, type, 'value', layer)} />
                                                                </Form.Item>
                                                            </div>
                                                        )}
                                                        <Form.Item {...formItemLayout24} label="">
                                                            <Button type="dashed" onClick={this.addListItem.bind(this, category.typeList, 6)} >
                                                                <Icon type="plus" /> 添加类型
                                                            </Button>
                                                        </Form.Item>
                                                    </Panel>
                                                </Collapse>
                                                <Collapse style={{ marginBottom: '10px' }}>
                                                    <Panel header="切换交互" key="1">
                                                        <Form.Item label="值格式">
                                                            <Radio.Group value={category.sendDataFormat} onChange={changeDetailData.bind(this, 1, category, 'sendDataFormat')}>
                                                                <Radio.Button value={1}>json字串</Radio.Button>
                                                                <Radio.Button value={2}>逗号分隔</Radio.Button>
                                                            </Radio.Group>
                                                        </Form.Item>
                                                        {this.getCommonInteractEdit(category.selectInteract)}
                                                        <Form.Item label="">
                                                            <Button type="dashed" onClick={addListItem.bind(this, category, 'selectInteract', {})}>
                                                                <Icon type="plus" /> 添加小弹框内交互内容
                                                            </Button>
                                                        </Form.Item>
                                                    </Panel>
                                                </Collapse>
                                            </Form>
                                        )}
                                        <Form.Item {...formItemLayout24} label="">
                                            <Button type="dashed" onClick={this.addListItem.bind(this, layer.category, 5)} >
                                                <Icon type="plus" /> 添加划分方式
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                    <Panel header="单独点交互" key="5">
                                        {this.getInteractBoxEdit(layer, 'interact', formItemLayout24)}
                                        <Form.Item {...formItemLayout24} label="">
                                            <Button type="dashed" onClick={this.addListItem.bind(this, layer.interact, 4)} >
                                                <Icon type="plus" /> 添加交互内容
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                    <Panel header="聚合点交互" key="6">
                                        {this.getInteractBoxEdit(layer, 'clusterInteract', formItemLayout24)}
                                        <Form.Item {...formItemLayout24} label="">
                                            <Button type="dashed" onClick={this.addListItem.bind(this, layer.clusterInteract, 4)} >
                                                <Icon type="plus" /> 添加交互内容
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                            </div>
                        )}
                        <Form.Item {...formItemLayout24} label="">
                            <Button type="dashed" onClick={this.addListItem.bind(this, style.layer, 1)} >
                                <Icon type="plus" /> 添加图层
                            </Button>
                        </Form.Item>
                    </Panel>

                    <Panel header="数据划分" key="11">
                        {style.category && style.category.map((category, categoryIndex) =>
                            <Form key={categoryIndex} {...formItemLayout24}>
                                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this, style.category, categoryIndex)}>{'划分方式' + (categoryIndex + 1)}</Tag>
                                <Form.Item label="展示方式">
                                    <Radio.Group value={category.showType} onChange={this.changeDetailData.bind(this, 1, category, 'showType', null)}>
                                        <Radio value={1}>方式一</Radio>
                                        <Radio value={2}>方式二</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Collapse style={{ display: category.showType === 2 ? 'block' : 'none', marginBottom: '10px' }}>
                                    <Panel header="大小位置" key="1">
                                    </Panel>
                                </Collapse>
                                <Form.Item label="划分名称">
                                    <Input value={category.name} onChange={this.changeDetailData.bind(this, 1, category, 'name', null)} />
                                </Form.Item>
                                <Form.Item label="类型键名">
                                    <Input value={category.key} onChange={this.changeDetailData.bind(this, 1, category, 'key', null)} />
                                </Form.Item>
                                <Form.Item label="传输内容">
                                    <Radio.Group value={category.sendType} onChange={this.changeDetailData.bind(this, 1, category, 'sendType', null)}>
                                        <Radio value={1}>类型键值</Radio>
                                        <Radio value={2}>传输数据</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="匹配方式">
                                    <Radio.Group value={category.subType} onChange={this.changeDetailData.bind(this, 1, category, 'subType', null)}>
                                        <Radio value={1}>相等</Radio>
                                        <Radio value={2}>相似</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="数据来源">
                                    <Radio.Group value={category.dataType} onChange={this.changeDetailData.bind(this, 1, category, 'dataType', null)}>
                                        <Radio value={1}>固定类型</Radio>
                                        <Radio value={2}>接口获取</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="默认选中">
                                    <Radio.Group value={category.defaultSelectType} onChange={this.changeDetailData.bind(this, 1, category, 'defaultSelectType', null)}>
                                        <Radio value={1}>全选</Radio>
                                        <Radio value={2}>全不选</Radio>
                                        <Radio value={3}>
                                            <Input value={category.defaultSelected} onChange={this.changeDetailData.bind(this, 1, category, 'defaultSelected', null)} />
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Tooltip title='数据请求地址。返回数据示例：[{"value":"1","label":"类型1"},{"value":"2","label":"类型2"}]'>
                                            接口地址*
                                        </Tooltip>
                                    }
                                    style={{ display: category.dataType === 2 ? 'block' : 'none' }} >
                                    <Input value={category.url} onChange={this.changeDetailData.bind(this, 1, category, 'url', null)} />
                                </Form.Item>
                                <Collapse style={{ display: category.dataType === 1 ? 'block' : 'none', marginBottom: '10px' }}>
                                    <Panel header="类型数据" key="1">
                                        {category.typeList && category.typeList.map((type, typeIndex) =>
                                            <div key={typeIndex}>
                                                <Tag closable={true} visible={true} onClose={this.deleteList.bind(this, category.typeList, typeIndex, null)}>{'类型' + (typeIndex + 1)}</Tag>
                                                <Form.Item label="类型名称">
                                                    <Input value={type.label} onChange={this.changeDetailData.bind(this, 1, type, 'label', null)} />
                                                </Form.Item>
                                                <Form.Item label="类型键值">
                                                    <Input value={type.value} onChange={this.changeDetailData.bind(this, 1, type, 'value', null)} />
                                                </Form.Item>
                                                <Form.Item label="传输数据">
                                                    <Input value={type.sendData} onChange={this.changeDetailData.bind(this, 1, type, 'sendData', null)} />
                                                </Form.Item>
                                            </div>
                                        )}
                                        <Form.Item {...formItemLayout24} label="">
                                            <Button type="dashed" onClick={addListItem.bind(this, category, 'typeList', {})}>
                                                <Icon type="plus" /> 添加类型
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                    {/*<Panel header="交互" key="2">*/}
                                    {/*    {this.getInteractBoxEdit(category,'interact',formItemLayout24)}*/}
                                    {/*    <Form.Item {...formItemLayout24} label="">*/}
                                    {/*        <Button type="dashed" onClick={this.addListItem.bind(this,category.interact,4)} >*/}
                                    {/*            <Icon type="plus" /> 添加交互内容*/}
                                    {/*        </Button>*/}
                                    {/*    </Form.Item>*/}
                                    {/*</Panel>*/}
                                </Collapse>
                            </Form>
                        )}
                        <Form.Item {...formItemLayout24} label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'category', {})}>
                                <Icon type="plus" /> 添加划分方式
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="网格" key="3">
                        <Form {...formItemLayout24} >
                            <Form.Item label="是否开启">
                                <Switch checked={grid.open}
                                    onChange={this.changeDetailData.bind(this, 2, grid, 'open', grid)} />
                            </Form.Item>
                            <Form.Item label="网格层级" >
                                <InputNumber value={grid.zoom} onChange={changeDetailData.bind(this, 2, grid, 'zoom')} />
                            </Form.Item>
                            <Form.Item label="初始加载" >
                                <Radio.Group value={grid.firstLoad} onChange={changeDetailData.bind(this, 1, grid, 'firstLoad')}>
                                    <Radio.Button value={1}>是</Radio.Button>
                                    <Radio.Button value={0}>否</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="移动地图">
                                <Switch checked={grid.firstLoadMoveMap}
                                    onChange={this.changeDetailData.bind(this, 2, grid, 'firstLoadMoveMap', grid)} />
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
                            <Form.Item label="session条件">
                                <Switch checked={grid.sessionData} onChange={this.changeDetailData.bind(this, 2, grid, 'sessionData', grid)} />
                            </Form.Item>
                            <Form.Item label="坐标系">
                                <Radio.Group value={grid.wkid} onChange={changeDetailData.bind(this, 1, grid, 'wkid')}>
                                    <Radio value={1}>天地图</Radio>
                                    <Radio value={2}>高德</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='是否开启同级区块合并'>
                                        区块合并*
                                    </Tooltip>
                                }
                            >
                                <Switch checked={grid.mergeOpen}
                                        onChange={this.changeDetailData.bind(this, 2, grid, 'mergeOpen', grid)} />
                            </Form.Item>
                            <Collapse style={{ marginBottom: '20px' }}>
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
                                            <Radio value={1}>固定</Radio>
                                            <Radio value={2}>特殊</Radio>
                                            <Radio value={3}>根据顺序排颜色一</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="网格颜色" >
                                        <ColorSelect color={grid.backgroundColor} setColor={this.setColor.bind(this, grid, 'backgroundColor', grid)} />
                                    </Form.Item>
                                    <Form.Item label="选中颜色" >
                                        <ColorSelect color={grid.backgroundColorSelected} setColor={this.setColor.bind(this, grid, 'backgroundColorSelected', grid)} />
                                    </Form.Item>
                                    <Form.Item label="颜色依据字段" style={{ display: grid.colorType !== 2 ? 'none' : '' }}>
                                        <Input value={grid.colorKey} onChange={this.changeDetailData.bind(this, 1, grid, 'colorKey', grid)} />
                                    </Form.Item>
                                    <Form.Item label="依据内容" style={{ display: grid.colorType !== 2 ? 'none' : '' }}>
                                        <Input value={grid.colorUrl} onChange={this.changeDetailData.bind(this, 1, grid, 'colorUrl', grid)} />
                                    </Form.Item>
                                    <Form.Item label="请求条件" style={{ display: grid.colorType !== 2 ? 'none' : '' }}>
                                        <Input value={grid.colorParams} onChange={this.changeDetailData.bind(this, 1, grid, 'colorParams', grid)} />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <span>
                                                <Tooltip title="点击添加">
                                                    <Icon type="plus" style={{cursor:'pointer',marginRight:'0.5vh'}} onClick={addListItem.bind(this,grid,'colorUrlParams','')}/>
                                                </Tooltip>
                                                地址栏传参
                                            </span>
                                        }
                                        style={{ display: grid.colorType !== 2 ? 'none' : '' }}
                                    >
                                        {grid.colorUrlParams && grid.colorUrlParams.map((item,index)=>
                                            <Col key={index}>
                                                <Input value={item} onChange={changeDetailData.bind(this, 1, grid.colorUrlParams, index)} key={index} style={{width:'80%'}}/>
                                                <Icon type="close" style={{position:'absolute',top:'12px',marginLeft:'0.5vh',cursor:'pointer'}} onClick={deleteListItem.bind(this, grid.colorUrlParams, index)}/>
                                            </Col>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        style={{ display: grid.colorType !== 2 ? 'none' : '' }}
                                        label={
                                            <Tooltip title='数据定时刷新时间间隔，单位毫秒。'>
                                                刷新间隔*
                                            </Tooltip>
                                        }
                                    >
                                        <InputNumber value={grid.freshTime} onChange={changeDetailData.bind(this, 2, grid, 'freshTime')} />
                                    </Form.Item>
                                    <Form.Item label="网格匹配字段" style={{ display: grid.colorType !== 2 ? 'none' : '' }}>
                                        <Input value={grid.subAreaKey} onChange={this.changeDetailData.bind(this, 1, grid, 'subAreaKey', grid)} />
                                    </Form.Item>
                                    <Form.Item label="数据匹配字段" style={{ display: grid.colorType !== 2 ? 'none' : '' }}>
                                        <Input value={grid.subKey} onChange={this.changeDetailData.bind(this, 1, grid, 'subKey', grid)} />
                                    </Form.Item>
                                    <Form.Item label="计算方式" style={{ display: grid.colorType !== 2 ? 'none' : '' }}>
                                        <Radio.Group size="small" value={grid.calculateType}
                                            onChange={changeDetailData.bind(this, 1, grid, 'calculateType')}>
                                            <Radio.Button value={1}>相等</Radio.Button>
                                            <Radio.Button value={2}>区间</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    {this.getGridColorSet(grid,'bgColorList')}
                                </Panel>
                                <Panel header="分割线设置" key="2">
                                    {grid.colorType === 2 ? (
                                        this.getGridColorSet(grid,'lineColorList')
                                    ):(
                                        <Form.Item label="颜色">
                                            <ColorSelect color={grid.lineColor} setColor={this.setColor.bind(this, grid, 'lineColor', grid)} />
                                        </Form.Item>
                                    )}
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
                                            onChange={this.changeDetailData.bind(this, 2, grid, 'allLine', grid)} />
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
                                            onChange={this.changeDetailData.bind(this, 2, grid, 'showName', grid)} />
                                    </Form.Item>
                                    <Form.Item label="移上显示">
                                        <Switch checked={grid.overShow}
                                            onChange={this.changeDetailData.bind(this, 2, grid, 'overShow', grid)} />
                                    </Form.Item>
                                    <Form.Item label="字体颜色">
                                        <ColorSelect color={grid.fontColor} setColor={this.setColor.bind(this, grid, 'fontColor', grid)} />
                                    </Form.Item>
                                    <Form.Item label="字体大小">
                                        <Input value={grid.fontSize} onChange={this.changeDetailData.bind(this, 1, grid, 'fontSize', grid)} />
                                    </Form.Item>
                                </Panel>
                                <Panel header="网格对应值设置" key="8">
                                    <Form.Item label="是否显示">
                                        <Switch checked={grid.showNum}
                                            onChange={this.changeDetailData.bind(this, 2, grid, 'showNum', grid)} />
                                    </Form.Item>
                                    <Form.Item label="值键名">
                                        <Input value={grid.numKey} onChange={this.changeDetailData.bind(this, 1, grid, 'numKey', grid)} />
                                    </Form.Item>
                                    <Form.Item label="字体颜色">
                                        <ColorSelect color={grid.numColor} setColor={this.setColor.bind(this, grid, 'numColor', grid)} />
                                    </Form.Item>
                                    <Form.Item label="字体大小">
                                        <Input value={grid.numFontSize} onChange={this.changeDetailData.bind(this, 1, grid, 'numFontSize', grid)} />
                                    </Form.Item>
                                </Panel>
                                <Panel header="网格区域鼠标悬浮响应" key="9">
                                    {this.getCommonInteractEdit(grid.areaMouseOverInteract)}
                                    <Form.Item label="">
                                        <Button type="dashed" onClick={addListItem.bind(this, grid, 'areaMouseOverInteract', {})}>
                                            <Icon type="plus" /> 添加交互内容
                                        </Button>
                                    </Form.Item>
                                </Panel>
                                <Panel header="网格区域点击响应(默认)" key="5">
                                    {this.getCommonInteractEdit(grid.areaClickInteract)}
                                    <Form.Item label="">
                                        <Button type="dashed" onClick={addListItem.bind(this, grid, 'areaClickInteract', {})}>
                                            <Icon type="plus" /> 添加交互内容
                                        </Button>
                                    </Form.Item>
                                </Panel>
                                <Panel header="网格区域点击响应(类型2)" key="6">
                                    {this.getCommonInteractEdit(grid.areaPartClickInteract)}
                                    <Form.Item label="">
                                        <Button type="dashed" onClick={addListItem.bind(this, grid, 'areaPartClickInteract', {})}>
                                            <Icon type="plus" /> 添加交互内容
                                        </Button>
                                    </Form.Item>
                                </Panel>
                                <Panel header="网格区域点击响应(类型3)" key="7">
                                    {this.getCommonInteractEdit(grid.areaClickInteractTwo)}
                                    <Form.Item label="">
                                        <Button type="dashed" onClick={addListItem.bind(this, grid, 'areaClickInteractTwo', {})}>
                                            <Icon type="plus" /> 添加交互内容
                                        </Button>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        </Form>
                    </Panel>
                    <Panel header="行政区划（网格结构）" key="4">
                        <Form {...formItemLayout24} >
                            <Form.Item label="是否显示">
                                <Switch checked={grid.treeOpen}
                                    onChange={this.changeDetailData.bind(this, 2, grid, 'treeOpen', grid)} />
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
                                    {grid.interact.map((interact, interactIndex) =>
                                        <div key={interactIndex}>
                                            <Tag closable={true} visible={true} onClose={this.deleteList.bind(this, grid.interact, interactIndex, null)}>{'交互内容' + (interactIndex + 1)}</Tag>
                                            <Form.Item label="交互对象">
                                                <Select value={interact.receiveId} onChange={this.changeDetailData.bind(this, 2, interact, 'receiveId', null)}>
                                                    {style.layer.map((layer, layerIndex) =>
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
                                        <Button type="dashed" onClick={this.addListItem.bind(this, grid.interact, 7)} >
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
                                        <img alt="" onClick={this.selectIcon.bind(this, legend, null, 'img')} src={fileUrl + '/download/' + legend.img} className={cssStyle.icon} />
                                    ) : (
                                            <Button type="dashed" onClick={this.selectIcon.bind(this, legend, null, 'img')} >
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
                    <Panel header="筛选框" key="6">
                        <Collapse>
                            <Panel header="筛选框位置" key="1">
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
                                    <Form.Item label="下">
                                        <Input value={select.bottom} onChange={this.changeDetailData.bind(this, 1, select, 'bottom', null)} />
                                    </Form.Item>
                                </Form>
                            </Panel>
                            <Panel header="筛选框样式" key="2">
                                <Form {...formItemLayout24} >
                                    <Form.Item label="样式类型">
                                        <Radio.Group value={select.theme} onChange={this.changeDetailData.bind(this, 1, select, 'theme', null)}>
                                            <Radio value={''}>默认</Radio>
                                            <Radio value={'theme-one'}>样式一</Radio>
                                            <Radio value={'theme-two'}>样式二</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Form>
                            </Panel>
                        </Collapse>
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
                            <Form.Item label="遮罩样式">
                                <Select value={style.maskType} onChange={changeDetailData.bind(this, 2, style, 'maskType')}>
                                    <Select.Option value={''}>无</Select.Option>
                                    <Select.Option value={'maskTypeOne'}>样式一</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="透明图层">
                                <Switch checked={style.blankLayer} onChange={changeDetailData.bind(this, 2, style, 'blankLayer')} />
                            </Form.Item>
                            <Form.Item label="透明度" >
                                <InputNumber value={style.shadeOpacity} onChange={changeDetailData.bind(this, 2, style, 'shadeOpacity')} />
                            </Form.Item>
                            <Form.Item label="渐变类型" >
                                <Radio.Group value={style.shadeGradientType} onChange={changeDetailData.bind(this, 1, style, 'shadeGradientType')}>
                                    <Radio.Button value="radial">径向</Radio.Button>
                                    <Radio.Button value="linear">线性</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            {style.shadeGradientType === 'linear' && (
                                <Form.Item label="渐变角度">
                                    <Slider defaultValue={180} max={180} min={0} value={style.shadeAngle} onChange={changeDetailData.bind(this, 2, style, 'shadeAngle')} />
                                </Form.Item>
                            )}
                            {this.getColorList(style.shadeColor)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'shadeColor', {})}>
                                    <Icon type="plus" /> 添加颜色
                                </Button>
                            </Form.Item>
                        </Form>
                    </Panel>
                    <Panel header="模糊设置" key="9">
                        <Form {...formItemLayout24} >
                            <Form.Item label="是否开启">
                                <Switch checked={style.blurOpen} onChange={changeDetailData.bind(this, 2, style, 'blurOpen')} />
                            </Form.Item>
                            <Collapse>
                                <Panel header="清晰区域设置" key="1">
                                </Panel>
                            </Collapse>
                        </Form>
                    </Panel>
                    <Panel header="轨迹搜索" key="12">
                        <Form {...formItemLayout24} >
                            <Form.Item label="请求地址" >
                                <Input value={searchTrail.url} onChange={changeDetailData.bind(this, 1, searchTrail, 'url')} />
                            </Form.Item>
                            <Form.Item label="坐标系">
                                <Radio.Group value={searchTrail.wkid} onChange={changeDetailData.bind(this, 1, searchTrail, 'wkid')}>
                                    <Radio value={1}>天地图</Radio>
                                    <Radio value={2}>高德</Radio>
                                </Radio.Group>
                            </Form.Item>
                            {this.getWindowContentEdit(searchTrail)}
                            {this.getIconEdit(searchTrail,null,{})}
                        </Form>
                    </Panel>
                    <Panel header="轨迹时间轴" key="13">
                        <Form {...formItemLayout24} >
                            <Form.Item label="字号" >
                                <Input value={trailTimeLine.fontSize} onChange={changeDetailData.bind(this, 1, trailTimeLine, 'fontSize')} />
                            </Form.Item>
                            <Form.Item label="宽" >
                                <Input value={trailTimeLine.width} onChange={changeDetailData.bind(this, 1, trailTimeLine, 'width')} />
                            </Form.Item>
                            <Form.Item label="高" >
                                <Input value={trailTimeLine.height} onChange={changeDetailData.bind(this, 1, trailTimeLine, 'height')} />
                            </Form.Item>
                            <Form.Item label="左" >
                                <Input value={trailTimeLine.left} onChange={changeDetailData.bind(this, 1, trailTimeLine, 'left')} />
                            </Form.Item>
                            <Form.Item label="上" >
                                <Input value={trailTimeLine.top} onChange={changeDetailData.bind(this, 1, trailTimeLine, 'top')} />
                            </Form.Item>
                            <Form.Item label="右" >
                                <Input value={trailTimeLine.right} onChange={changeDetailData.bind(this, 1, trailTimeLine, 'right')} />
                            </Form.Item>
                            <Form.Item label="下" >
                                <Input value={trailTimeLine.bottom} onChange={changeDetailData.bind(this, 1, trailTimeLine, 'bottom')} />
                            </Form.Item>
                        </Form>
                    </Panel>
                    <Panel header="地图大小位置" key="14">
                        <Form {...formItemLayout24} >
                            <Form.Item label="初始宽" >
                                <InputNumber value={style.width} onChange={changeDetailData.bind(this, 2, style, 'width')} />
                            </Form.Item>
                            <Form.Item label="初始高" >
                                <InputNumber value={style.height} onChange={changeDetailData.bind(this, 2, style, 'height')} />
                            </Form.Item>
                            <Form.Item label="初始左" >
                                <InputNumber value={style.left} onChange={changeDetailData.bind(this, 2, style, 'left')} />
                            </Form.Item>
                            <Form.Item label="初始上" >
                                <InputNumber value={style.top} onChange={changeDetailData.bind(this, 2, style, 'top')} />
                            </Form.Item>
                            <Form.Item label="放大宽" >
                                <InputNumber value={style.widthBig} onChange={changeDetailData.bind(this, 2, style, 'widthBig')} />
                            </Form.Item>
                            <Form.Item label="放大高" >
                                <InputNumber value={style.heightBig} onChange={changeDetailData.bind(this, 2, style, 'heightBig')} />
                            </Form.Item>
                            <Form.Item label="放大左" >
                                <InputNumber value={style.leftBig} onChange={changeDetailData.bind(this, 2, style, 'leftBig')} />
                            </Form.Item>
                            <Form.Item label="放大上" >
                                <InputNumber value={style.topBig} onChange={changeDetailData.bind(this, 2, style, 'topBig')} />
                            </Form.Item>
                        </Form>
                    </Panel>
                    <Panel header="全边界展示设置" key="15">
                        <Form {...formItemLayout24} >
                            <Form.Item label="初始加载">
                                <Switch checked={style.firstLoadAllGrid} onChange={changeDetailData.bind(this, 2, style, 'firstLoadAllGrid')} />
                            </Form.Item>
                            <Form.Item label="是否展示">
                                <Switch checked={style.showAllGrid} onChange={changeDetailData.bind(this, 2, style, 'showAllGrid')} />
                            </Form.Item>
                            <Form.Item label="图层层级" >
                                <InputNumber value={style.allGridZoom} onChange={changeDetailData.bind(this, 2, style, 'allGridZoom')} />
                            </Form.Item>
                            <Form.Item label="镇街边界" >
                                <Input value={style.roadGridUrl} onChange={changeDetailData.bind(this, 1, style, 'roadGridUrl')} />
                            </Form.Item>
                            <Form.Item label="村社边界" >
                                <Input value={style.communityGridUrl} onChange={changeDetailData.bind(this, 1, style, 'communityGridUrl')} />
                            </Form.Item>
                            <Form.Item label="网格边界" >
                                <Input value={style.partGridUrl} onChange={changeDetailData.bind(this, 1, style, 'partGridUrl')} />
                            </Form.Item>
                            <Form.Item label="微网格边界" >
                                <Input value={style.smallPartGridUrl} onChange={changeDetailData.bind(this, 1, style, 'smallPartGridUrl')} />
                            </Form.Item>
                            <Collapse style={{ marginBottom: '20px' }}>
                                <Panel header="边界切换显隐响应交互" key="1">
                                    {this.getCommonInteractEdit(style.allGridChangeShowInteract)}
                                    <Form.Item label="">
                                        <Button type="dashed" onClick={addListItem.bind(this, style, 'allGridChangeShowInteract', {})}>
                                            <Icon type="plus" /> 添加交互内容
                                        </Button>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
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
