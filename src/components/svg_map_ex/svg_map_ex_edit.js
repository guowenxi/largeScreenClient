import React from 'react';
import {Form, Collapse, Input, Button, Icon, Tag, InputNumber, Select, Slider, Switch, Radio} from 'antd';
import {
    addListItem,
    changeDetailData,
    deleteListItem, getInteractEdit, setColor
} from "../../common/editUtil";
import {getColorList} from "../../common/nameNumEditUtil";
import ColorSelect from "../../common/colorSelect";
import {getClusterPointEdit} from "../../common/mapEditUtil";

const { Panel } = Collapse;

export default class SvgMapExEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorList = getColorList.bind(this);
        this.getInteractEdit = getInteractEdit.bind(this);
        this.getClusterPointEdit = getClusterPointEdit.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础内容设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="匹配键名">
                            <Input value={style.nameKey} onChange={changeDetailData.bind(this, 1, style, 'nameKey')}/>
                        </Form.Item>
                        {/*<Form.Item label="id键名">*/}
                        {/*    <Input value={style.idKey} onChange={changeDetailData.bind(this, 1, style, 'idKey')}/>*/}
                        {/*</Form.Item>*/}
                        <Form.Item label="区域">
                            <Select value={style.area} onChange={changeDetailData.bind(this, 2, style, 'area')}>
                                <Select.Option value={'yongjia'} >永嘉</Select.Option>
                                <Select.Option value={'浙江'} >浙江</Select.Option>
                                <Select.Option value={'台州'} >台州</Select.Option>
                                <Select.Option value={'台州2'} >台州2</Select.Option>
                                <Select.Option value={'温岭市'} >温岭市</Select.Option>
                                <Select.Option value={'泽国镇'} >泽国镇</Select.Option>
                                <Select.Option value={'金华'} >金华</Select.Option>
                                <Select.Option value={'杭州'} >杭州</Select.Option>
                                <Select.Option value={'杭州2'} >杭州2</Select.Option>
                                <Select.Option value={'温州'} >温州</Select.Option>
                                <Select.Option value={'绍兴'} >绍兴</Select.Option>
                                <Select.Option value={'黄岩'} >黄岩</Select.Option>
                                <Select.Option value={'临海'} >临海</Select.Option>
                                <Select.Option value={'天台'} >天台</Select.Option>
                                <Select.Option value={'温岭2'} >温岭2</Select.Option>
                                <Select.Option value={'仙居'} >仙居</Select.Option>
                                <Select.Option value={'玉环'} >玉环</Select.Option>
                                <Select.Option value={'椒江'} >椒江</Select.Option>
                                <Select.Option value={'路桥'} >路桥</Select.Option>
                                <Select.Option value={'三门'} >三门</Select.Option>
                                <Select.Option value={'台州湾新区'} >台州湾新区</Select.Option>
                                <Select.Option value={'温州2'} >温州2</Select.Option>
                                <Select.Option value={'330302000000'} >鹿城</Select.Option>
                                <Select.Option value={'330303000000'} >龙湾</Select.Option>
                                <Select.Option value={'330371000000'} >温州经开区</Select.Option>
                                <Select.Option value={'330304000000'} >瓯海</Select.Option>
                                <Select.Option value={'330324000000'} >永嘉</Select.Option>
                                <Select.Option value={'330326000000'} >平阳</Select.Option>
                                <Select.Option value={'330305000000'} >洞头</Select.Option>
                                <Select.Option value={'330381000000'} >瑞安</Select.Option>
                                <Select.Option value={'330382000000'} >乐清</Select.Option>
                                <Select.Option value={'330327000000'} >苍南</Select.Option>
                                <Select.Option value={'330328000000'} >文成</Select.Option>
                                <Select.Option value={'330329000000'} >泰顺</Select.Option>
                                <Select.Option value={'330383000000'} >龙港</Select.Option>
                                <Select.Option value={'宁海'} >宁海</Select.Option>
                                <Select.Option value={'瑞安'} >瑞安</Select.Option>
                                <Select.Option value={'临安'} >临安</Select.Option>
                                <Select.Option value={'上城'} >上城</Select.Option>
                                <Select.Option value={'台州3'} >台州3</Select.Option>
                                <Select.Option value={'宁海2'} >宁海2</Select.Option>
                                <Select.Option value={'乐清'} >乐清2</Select.Option>
                                {/*宁海区下镇街*/}
                                <Select.Option value={'茶院乡'} >茶院乡</Select.Option>
                                <Select.Option value={'岔路镇'} >岔路镇</Select.Option>
                                <Select.Option value={'大佳何街道'} >大佳何街道</Select.Option>
                                <Select.Option value={'胡陈乡'} >胡陈乡</Select.Option>
                                <Select.Option value={'黄坛镇'} >黄坛镇</Select.Option>
                                <Select.Option value={'力洋镇'} >力洋镇</Select.Option>
                                <Select.Option value={'梅林街道'} >梅林街道</Select.Option>
                                <Select.Option value={'前童镇'} >前童镇</Select.Option>
                                <Select.Option value={'强蛟镇'} >强蛟镇</Select.Option>
                                <Select.Option value={'桥头胡街道'} >桥头胡街道</Select.Option>
                                <Select.Option value={'桑洲镇'} >桑洲镇</Select.Option>
                                <Select.Option value={'深甽镇'} >深甽镇</Select.Option>
                                <Select.Option value={'桃源街道'} >桃源街道</Select.Option>
                                <Select.Option value={'西店镇'} >西店镇</Select.Option>
                                <Select.Option value={'一市镇'} >一市镇</Select.Option>
                                <Select.Option value={'跃龙街道'} >跃龙街道</Select.Option>
                                <Select.Option value={'越溪乡'} >越溪乡</Select.Option>
                                <Select.Option value={'长街镇'} >长街镇</Select.Option>
                                {/*湖州*/}
                                <Select.Option value={'湖州'} >湖州市</Select.Option>
                                <Select.Option value={'330503000000'} >南浔街道</Select.Option>
                            </Select>
                        </Form.Item>
                    </Panel>
                    <Panel header="数量展示设置" key="2">
                        <Form.Item label="数值键名">
                            <Input value={style.numKey} onChange={changeDetailData.bind(this, 1, style, 'numKey')}/>
                        </Form.Item>
                        <Form.Item label="展示类型">
                            <Select value={style.showType} onChange={changeDetailData.bind(this, 2, style, 'showType')}>
                                <Select.Option value={1} >类型一</Select.Option>
                                <Select.Option value={2} >类型二</Select.Option>
                                <Select.Option value={3} >类型三</Select.Option>
                            </Select>
                        </Form.Item>
                        {style.showType === 1 && (
                            <React.Fragment>
                                <Form.Item label="最低高度" >
                                    <InputNumber min={1} value={style.minheight} onChange={changeDetailData.bind(this, 2, style, 'minheight')} />
                                </Form.Item>
                                <Form.Item label="最高高度" >
                                    <InputNumber min={1} value={style.maxheight} onChange={changeDetailData.bind(this, 2, style, 'maxheight')} />
                                </Form.Item>
                                {style.styleList && style.styleList.map((item,index) =>
                                    <React.Fragment key={index}>
                                        <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.styleList, index)}>
                                            {'样式' + (index + 1)}
                                        </Tag>
                                        <Form.Item label="大于等于" >
                                            <InputNumber value={item.more} onChange={changeDetailData.bind(this, 2, item, 'more')} />
                                        </Form.Item>
                                        <Form.Item label="小与" >
                                            <InputNumber value={item.less} onChange={changeDetailData.bind(this, 2, item, 'less')} />
                                        </Form.Item>
                                        <Form.Item label="方块背景">
                                            <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                                        </Form.Item>
                                        <Collapse >
                                            <Panel header="柱背景设置" key="1">
                                                <Form.Item label="渐变角度">
                                                    <Slider defaultValue={180} max={180} min={0} value={item.gradientAngle} onChange={changeDetailData.bind(this, 2, item, 'gradientAngle')}/>
                                                </Form.Item>
                                                {this.getColorList(item.bgColorList)}
                                                <Form.Item label="">
                                                    <Button type="dashed" onClick={addListItem.bind(this,item,'bgColorList',{})}>
                                                        <Icon type="plus"/> 添加颜色
                                                    </Button>
                                                </Form.Item>
                                            </Panel>
                                        </Collapse>
                                    </React.Fragment>
                                )}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this,style,'styleList',{})}>
                                        <Icon type="plus"/> 添加样式分类
                                    </Button>
                                </Form.Item>
                            </React.Fragment>
                        )}
                    </Panel>
                    <Panel header="区域展示设置" key="6">
                        {/*<Form.Item label="名称键名">*/}
                        {/*    <Input value={style.areaNameKey} onChange={changeDetailData.bind(this, 1, style, 'areaNameKey')}/>*/}
                        {/*</Form.Item>*/}
                        <Form.Item label="隐藏边线">
                            <Switch checked={style.hideLine}
                                    onChange={changeDetailData.bind(this, 2, style, 'hideLine')}/>
                        </Form.Item>
                        <Form.Item label="数值键名">
                            <Input value={style.areaNumKey} onChange={changeDetailData.bind(this, 1, style, 'areaNumKey')}/>
                        </Form.Item>
                        <Form.Item label="默认颜色">
                            <ColorSelect color={style.areaDefaultColor} setColor={setColor.bind(this, style, 'areaDefaultColor')} />
                        </Form.Item>
                        <Form.Item label="选中颜色">
                            <ColorSelect color={style.areaSelectedColor} setColor={setColor.bind(this, style, 'areaSelectedColor')} />
                        </Form.Item>
                        {style.areaStyleList && style.areaStyleList.map((item,index) =>
                            <React.Fragment key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.areaStyleList, index)}>
                                    {'样式' + (index + 1)}
                                </Tag>
                                <Form.Item label="大于等于" >
                                    <InputNumber value={item.more} onChange={changeDetailData.bind(this, 2, item, 'more')} />
                                </Form.Item>
                                <Form.Item label="小与" >
                                    <InputNumber value={item.less} onChange={changeDetailData.bind(this, 2, item, 'less')} />
                                </Form.Item>
                                <Form.Item label="区域颜色">
                                    <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'areaStyleList',{})}>
                                <Icon type="plus"/> 添加样式分类
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="内发光色设置" key="10">
                        <Form.Item label="边线宽">
                            <InputNumber value={style.shadowLineWidth} onChange={changeDetailData.bind(this, 2, style, 'shadowLineWidth')} />
                        </Form.Item>
                        <Form.Item label="模糊距离">
                            <InputNumber value={style.stdDeviation} onChange={changeDetailData.bind(this, 2, style, 'stdDeviation')} />
                        </Form.Item>
                        <Form.Item label="默认颜色">
                            <ColorSelect color={style.shadowDefaultColor} setColor={setColor.bind(this, style, 'shadowDefaultColor')} />
                        </Form.Item>
                        {style.shadowStyleList && style.shadowStyleList.map((item,index) =>
                            <React.Fragment key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.shadowStyleList, index)}>
                                    {'样式' + (index + 1)}
                                </Tag>
                                <Form.Item label="大于等于" >
                                    <InputNumber value={item.more} onChange={changeDetailData.bind(this, 2, item, 'more')} />
                                </Form.Item>
                                <Form.Item label="小与" >
                                    <InputNumber value={item.less} onChange={changeDetailData.bind(this, 2, item, 'less')} />
                                </Form.Item>
                                <Form.Item label="区域颜色">
                                    <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'shadowStyleList',{})}>
                                <Icon type="plus"/> 添加样式分类
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="详情设置" key="7">
                        <Form.Item label="详情内容">
                            <Select value={style.detailType} onChange={changeDetailData.bind(this, 2, style, 'detailType')}>
                                <Select.Option value={0} >无详情</Select.Option>
                                <Select.Option value={1} >内容一</Select.Option>
                                <Select.Option value={2} >内容二(台州mzx</Select.Option>
                                <Select.Option value={3} >内容三(温州mzx</Select.Option>
                                <Select.Option value={4} >内容四(瑞安</Select.Option>
                                <Select.Option value={5} >内容五(宁海</Select.Option>
                                <Select.Option value={6} >内容六(杭州</Select.Option>
                                <Select.Option value={7} >内容七(台州平安乡镇</Select.Option>
                            </Select>
                        </Form.Item>
                    </Panel>
                    <Panel header="数字点击交互" key="3">
                        {this.getInteractEdit(style.numClickInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'numClickInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="区域点击交互" key="4">
                        {this.getInteractEdit(style.areaClickInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'areaClickInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="区域重复点击交互" key="8">
                        <Form.Item label="重复响应">
                            <Radio.Group value={style.repeatClickType} onChange={changeDetailData.bind(this, 1, style, 'repeatClickType')}>
                                <Radio value={1}>默认</Radio>
                                <Radio value={2}>取消选中</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="取消选中交互" key="9">
                        {this.getInteractEdit(style.cancelSelectInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'cancelSelectInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="聚合打点设置" key="5">
                        <Form.Item label="初始显示">
                            <Switch checked={style.firstShowCluster}
                                    onChange={changeDetailData.bind(this, 2, style, 'firstShowCluster')}/>
                        </Form.Item>
                        {this.getClusterPointEdit(style)}
                    </Panel>
                    <Panel header="响应设置" key="11">
                        <Form.Item label="缩放响应">
                            <Switch checked={style.scaleAction} onChange={changeDetailData.bind(this, 2, style, 'scaleAction')} />
                        </Form.Item>
                        <Form.Item label="拖动响应">
                            <Switch checked={style.moveAction} onChange={changeDetailData.bind(this, 2, style, 'moveAction')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
