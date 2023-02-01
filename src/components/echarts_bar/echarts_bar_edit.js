import React from 'react';
import {Form, Input, InputNumber, Collapse, Switch, Radio, Tooltip, Icon, Row, Col, Tag, Button} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {addListItem, changeDetailData, deleteListItem, setColor} from "../../common/editUtil";
// import InputNumber from "../../common/inputNumberEx";

const formItemLayout24 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const { Panel } = Collapse;
const { TextArea } = Input;

export default class EchartsBarEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    changeDetailData(type, item, key, event) {
        this.props.saveNowDataToHistory();
        let editData = type === 1 ? event.target.value : event;
        item[key] = editData;
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    //修改颜色
    setColor(item, key, data) {
        this.props.saveNowDataToHistory();
        const rgb = data.rgb;
        item[key] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    addColor(item, type) {
        this.props.saveNowDataToHistory();
        if (type === 1) {
            item.push('#0ff');
        } else {
            item.push({
                start: 'red',
                end: 'blue'
            });
        }
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    deleteColor(item, index) {
        this.props.saveNowDataToHistory();
        item.splice(index, 1);
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    //获取文本标签编辑内容
    getLabelEdit(item) {
        if (item.label == null) {
            item.label = {};
        }
        return (
            <Collapse >
                <Panel header="文本标签" key="1">
                    <Form.Item label="显示">
                        <Switch checked={item.label.show}
                            onChange={this.changeDetailData.bind(this, 2, item.label, 'show')} />
                    </Form.Item>
                    <Form.Item label="颜色">
                        <ColorSelect color={item.label.color} setColor={this.setColor.bind(this, item.label, 'color')} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title="自定义时输入[x, y]表示标签相对于图形包围盒左上角的位置">
                                位置*
                            </Tooltip>
                        }
                    >
                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.label, 'positionType')} value={item.label.positionType}>
                            <Radio value={'top'}>上方</Radio>
                            <Radio value={'left'}>左方</Radio>
                            <Radio value={'right'}>右方</Radio>
                            <Radio value={'bottom'}>下方</Radio>
                            <Radio value={'inside'}>柱内</Radio>
                            <Radio value={'insideLeft'}>柱内左方</Radio>
                            <Radio value={'insideRight'}>柱内右方</Radio>
                            <Radio value={'insideTop'}>柱内上方</Radio>
                            <Radio value={'insideBottom'}>柱内下方</Radio>
                            <Radio value={'insideTopLeft'}>柱内左上</Radio>
                            <Radio value={'insideBottomLeft'}>柱内左下</Radio>
                            <Radio value={'insideTopRight'}>柱内右上</Radio>
                            <Radio value={'insideBottomRight'}>柱内右下</Radio>
                            <Radio value={'other'}>
                                <Input value={item.label.position} onChange={this.changeDetailData.bind(this, 1, item.label, 'position')} />
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title="位置自定义时无效。">
                                距离*
                            </Tooltip>
                        }
                    >
                        <Input value={item.label.distance} onChange={this.changeDetailData.bind(this, 1, item.label, 'distance')} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title="从 -90 度到 90 度。正值是逆时针。">
                                标签旋转*
                            </Tooltip>
                        }
                    >
                        <InputNumber value={item.label.rotate} onChange={this.changeDetailData.bind(this, 2, item.label, 'rotate')} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title="例如：[30, 40] 表示文字在横向上偏移 30，纵向上偏移 40。">
                                偏移*
                            </Tooltip>
                        }
                    >
                        <Input value={item.label.offset} onChange={this.changeDetailData.bind(this, 1, item.label, 'offset')} />
                    </Form.Item>
                    <Form.Item label="字体大小">
                        <Input value={item.label.fontSize} onChange={this.changeDetailData.bind(this, 1, item.label, 'fontSize')} />
                    </Form.Item>
                    <Form.Item label="水平对齐">
                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.label, 'align')} value={item.label.align}>
                            <Radio value={'left'}>左对齐</Radio>
                            <Radio value={'center'}>中对齐</Radio>
                            <Radio value={'right'}>右对齐</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="垂直对齐">
                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.label, 'verticalAlign')} value={item.label.verticalAlign}>
                            <Radio value={'top'}>上对齐</Radio>
                            <Radio value={'middle'}>中对齐</Radio>
                            <Radio value={'bottom'}>下对齐</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title="刻度标签内容格式器。内容为函数代码。">
                                格式器*
                            </Tooltip>
                        }
                    >
                        <TextArea rows={5} value={item.label.formatter}
                            onChange={this.changeDetailData.bind(this, 1, item.label, 'formatter')} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title="自定义富文本样式。内容格式为json字串。">
                                文本样式*
                            </Tooltip>
                        }
                    >
                        <TextArea rows={5} value={item.label.rich}
                            onChange={this.changeDetailData.bind(this, 1, item.label, 'rich')} />
                    </Form.Item>
                </Panel>
            </Collapse>
        );
    }

    //轴线设置
    getAxisEdit(axis, axisType) {
        return axis.map((item, index) => {
            if (item.dataZoomStyle == null) {
                item.dataZoomStyle = {
                    handleStyle: {
                        colorType:1,
                        color: ['#fff'],
                        linearColor: [{
                            start: 'red',
                            end: 'blue'
                        }]
                    },
                    lineStyle: {
                        colorType:1,
                        color: ['#0ff'],
                        linearColor: [{
                            start: 'red',
                            end: 'blue'
                        }]
                    },
                    areaStyle: {
                        colorType:1,
                        color: ['#0ff'],
                        linearColor: [{
                            start: 'red',
                            end: 'blue'
                        }]
                    }
                };
            }
            return (
                <Form {...formItemLayout24} key={index}>
                    <Form.Item label="是否显示">
                        <Switch checked={item.show} onChange={this.changeDetailData.bind(this, 2, item, 'show')} />
                    </Form.Item>
                    <Form.Item label="所在层级" >
                        <InputNumber value={item.z} onChange={changeDetailData.bind(this, 2, item, 'z')} />
                    </Form.Item>
                    <Form.Item label="轴类型">
                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'type')} value={item.type}>
                            <Radio value={'category'}>类目轴</Radio>
                            <Radio value={'time'}>时间轴</Radio>
                            <Radio value={'value'}>数值轴</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="位置">
                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'position')} value={item.position}>
                            <Radio value={'top'} style={{ display: axisType !== 'x' ? 'none' : '' }}>居上</Radio>
                            <Radio value={'bottom'} style={{ display: axisType !== 'x' ? 'none' : '' }}>居下</Radio>
                            <Radio value={'left'} style={{ display: axisType !== 'y' ? 'none' : '' }}>居左</Radio>
                            <Radio value={'right'} style={{ display: axisType !== 'y' ? 'none' : '' }}>居右</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="反向坐标">
                        <Switch checked={item.inverse} onChange={this.changeDetailData.bind(this, 2, item, 'inverse')} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title="为true时，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。">
                                留白策略*
                            </Tooltip>
                        }
                    >
                        <Switch checked={item.boundaryGap} onChange={this.changeDetailData.bind(this, 2, item, 'boundaryGap')} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title="只在数值轴中（type: 'value'）有效。是否是脱离 0 值比例。设置成 true 后坐标刻度不会强制包含零刻度。">
                                scale*
                            </Tooltip>
                        }
                    >
                        <Switch checked={item.scale} onChange={this.changeDetailData.bind(this, 2, item, 'scale')} />
                    </Form.Item>
                    <Form.Item label="偏移">
                        <InputNumber value={item.offset}
                            onChange={this.changeDetailData.bind(this, 2, item, 'offset')} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title="自动计算的坐标轴最小间隔大小。只在数值轴或时间轴中（type: 'value' 或 'time'）有效。">
                                最小间隔*
                            </Tooltip>
                        }
                    >
                        <InputNumber value={item.minInterval} onChange={this.changeDetailData.bind(this, 2, item, 'minInterval')} />
                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*    label={*/}
                    {/*        <Tooltip title="坐标轴刻度最大值。">*/}
                    {/*            最大值**/}
                    {/*        </Tooltip>*/}
                    {/*    }*/}
                    {/*>*/}
                    {/*    <InputNumber value={item.max} onChange={this.changeDetailData.bind(this, 2, item, 'max')} />*/}
                    {/*</Form.Item>*/}
                    {/*<Form.Item label='轴线偏移' >*/}
                    {/*    <InputNumber value={item.offset} onChange={this.changeDetailData.bind(this, 2, item, 'offset')} />*/}
                    {/*</Form.Item>*/}
                    <Form.Item label="最大值设置">
                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'maxType')} value={item.maxType}>
                            <Radio value={1}>默认</Radio>
                            <Radio value={2}>总数</Radio>
                            <Radio value={3}>最大值</Radio>
                            <Radio value={4}>
                                <InputNumber value={item.max} onChange={this.changeDetailData.bind(this, 2, item, 'max')} />
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Collapse >
                        <Panel header="缩放滚动条" key="5">
                            <Form.Item label="是否显示">
                                <Switch checked={item.dataZoom} onChange={changeDetailData.bind(this, 2, item, 'dataZoom')} />
                            </Form.Item>
                            <Form.Item label="默认项数">
                                <InputNumber value={item.endValue} onChange={changeDetailData.bind(this, 2, item, 'endValue')} />
                            </Form.Item>
                            <Form.Item label="滚动条宽度">
                                <InputNumber value={item.rollWidth} onChange={changeDetailData.bind(this, 2, item, 'rollWidth')} />
                            </Form.Item>
                            <Form.Item label="滚动条高度">
                                <InputNumber value={item.rollHeight} onChange={changeDetailData.bind(this, 2, item, 'rollHeight')} />
                            </Form.Item>
                            <Form.Item label="左边距">
                                <Input value={item.rollLeft} onChange={this.changeDetailData.bind(this, 1, item, 'rollLeft')} />
                            </Form.Item>
                            <Form.Item label="右边距">
                                <Input value={item.rollRight} onChange={this.changeDetailData.bind(this, 1, item, 'rollRight')} />
                            </Form.Item>
                            <Form.Item label="上边距">
                                <Input value={item.rollUp} onChange={this.changeDetailData.bind(this, 1, item, 'rollUp')} />
                            </Form.Item>
                            <Form.Item label="下边距">
                                <Input value={item.rollBottom} onChange={this.changeDetailData.bind(this, 1, item, 'rollBottom')} />
                            </Form.Item>
                            <Form.Item label="边框颜色">
                                <ColorSelect color={item.rollBorderColor} setColor={this.setColor.bind(this, item, 'rollBorderColor')} />
                            </Form.Item>
                            <Form.Item label="选中颜色">
                                <ColorSelect color={item.rollFillerColor} setColor={this.setColor.bind(this, item, 'rollFillerColor')} />
                            </Form.Item>
                            <Form.Item label="未选中颜色">
                                <ColorSelect color={item.rollBackgroundColor} setColor={this.setColor.bind(this, item, 'rollBackgroundColor')} />
                            </Form.Item>
                            <Form.Item label="数据阴影">
                                <Switch checked={item.showDataShadow}
                                    onChange={this.changeDetailData.bind(this, 2, item, 'showDataShadow')} />
                            </Form.Item>
                            <Collapse>
                                <Panel header="阴影线设置" key="1">
                                    <Form.Item label="阴影线类型">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.dataZoomStyle.lineStyle, 'colorType')} value={item.dataZoomStyle.lineStyle.colorType}>
                                            <Radio value={1}>单一色</Radio>
                                            <Radio value={2}>渐变色</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label={
                                        <span>
                                            颜色
                                </span>
                                    } style={{ display: item.dataZoomStyle.lineStyle.colorType === 1 ? '' : 'none' }}>
                                        <Row>
                                            {item.dataZoomStyle.lineStyle.color.map((thisColor, index) =>
                                                <Col key={index}>
                                                    <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.dataZoomStyle.lineStyle.color, index)} />
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Item>
                                    <Form.Item label={
                                        <span>
                                            <Tooltip title="图标样式为纵向时颜色从上往下渐变。为横向时颜色从左往右渐变。">
                                                颜色*
                                    </Tooltip>
                                        </span>
                                    } style={{ display: item.dataZoomStyle.lineStyle.colorType === 2 ? '' : 'none' }}>
                                        <Row>
                                            {item.dataZoomStyle.lineStyle.linearColor.map((thisColor, index) =>
                                                <Col key={index}>
                                                    <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={this.setColor.bind(this, thisColor, 'start')} />
                                                    <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                                    <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={this.setColor.bind(this, thisColor, 'end')} />
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Item>
                                    <Form.Item label="阴影线宽度">
                                        <InputNumber value={item.rollWidth} onChange={changeDetailData.bind(this, 2, item, 'rollWidth')} />
                                    </Form.Item>
                                    <Form.Item label="线类型">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'rollLineStyle')} value={item.rollLineStyle}>
                                            <Radio value={'solid'}>实线</Radio>
                                            <Radio value={'dashed'}>虚线1</Radio>
                                            <Radio value={'dotted'}>虚线2</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="线透明度">
                                        <InputNumber value={item.rollOpacity} onChange={changeDetailData.bind(this, 2, item, 'rollOpacity')} />
                                    </Form.Item>
                                </Panel>
                                <Panel header="阴影填充样式" key="2">
                                    <Form.Item label="阴影线类型">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.dataZoomStyle.areaStyle, 'colorType')} value={item.dataZoomStyle.areaStyle.colorType}>
                                            <Radio value={1}>单一色</Radio>
                                            <Radio value={2}>渐变色</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label={
                                        <span>
                                            颜色
                                </span>
                                    } style={{ display: item.dataZoomStyle.areaStyle.colorType === 1 ? '' : 'none' }}>
                                        <Row>
                                            {item.dataZoomStyle.areaStyle.color.map((thisColor, index) =>
                                                <Col key={index}>
                                                    <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.dataZoomStyle.areaStyle.color, index)} />
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Item>
                                    <Form.Item label={
                                        <span>
                                            <Tooltip title="图标样式为纵向时颜色从上往下渐变。为横向时颜色从左往右渐变。">
                                                颜色*
                                    </Tooltip>
                                        </span>
                                    } style={{ display: item.dataZoomStyle.areaStyle.colorType === 2 ? '' : 'none' }}>
                                        <Row>
                                            {item.dataZoomStyle.areaStyle.linearColor.map((thisColor, index) =>
                                                <Col key={index}>
                                                    <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={this.setColor.bind(this, thisColor, 'start')} />
                                                    <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                                    <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={this.setColor.bind(this, thisColor, 'end')} />
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Item>
                                    <Form.Item label="填充透明度">
                                        <InputNumber value={item.rollFillerOpacity} onChange={changeDetailData.bind(this, 2, item, 'rollFillerOpacity')} />
                                    </Form.Item>
                                </Panel>
                                <Panel header="标签设置" key="3">
                                    <Form.Item label="详细数值">
                                        <Switch checked={item.showDetail}
                                                onChange={this.changeDetailData.bind(this, 2, item, 'showDetail')} />
                                    </Form.Item>
                                    <Form.Item label="标签颜色">
                                        <ColorSelect color={item.rollTextColor} setColor={this.setColor.bind(this, item, 'rollTextColor')} />
                                    </Form.Item>
                                    <Form.Item label="字体大小">
                                        <Input value={item.rollFontSize} onChange={this.changeDetailData.bind(this, 1, item, 'rollFontSize')} />
                                    </Form.Item>
                                    <Form.Item label="文字描边颜色">
                                        <ColorSelect color={item.rollTextBorderColor} setColor={this.setColor.bind(this, item, 'rollTextBorderColor')} />
                                    </Form.Item>
                                    <Form.Item label="文字描边宽度">
                                        <Input value={item.rollTextBorderWidth} onChange={this.changeDetailData.bind(this, 1, item, 'rollTextBorderWidth')} />
                                    </Form.Item>
                                </Panel>
                                <Panel header="手柄设置" key="4">
                                    <Form.Item label="手柄大小">
                                        <Input value={item.handleSize} onChange={this.changeDetailData.bind(this, 1, item, 'handleSize')} />
                                    </Form.Item>
                                    <Form.Item label="阴影线类型">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.dataZoomStyle.handleStyle, 'colorType')} value={item.dataZoomStyle.handleStyle.colorType}>
                                            <Radio value={1}>单一色</Radio>
                                            <Radio value={2}>渐变色</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label={
                                        <span>
                                            颜色
                                        </span>
                                    } style={{ display: item.dataZoomStyle.handleStyle.colorType === 1 ? '' : 'none' }}>
                                        <Row>
                                            {item.dataZoomStyle.handleStyle.color.map((thisColor, index) =>
                                                <Col key={index}>
                                                    <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.dataZoomStyle.handleStyle.color, index)} />
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Item>
                                    <Form.Item label={
                                        <span>
                                            <Tooltip title="图标样式为纵向时颜色从上往下渐变。为横向时颜色从左往右渐变。">
                                                颜色*
                                </Tooltip>
                                        </span>
                                    } style={{ display: item.dataZoomStyle.handleStyle.colorType === 2 ? '' : 'none' }}>
                                        <Row>
                                            {item.dataZoomStyle.handleStyle.linearColor.map((thisColor, index) =>
                                                <Col key={index}>
                                                    <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={this.setColor.bind(this, thisColor, 'start')} />
                                                    <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                                    <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={this.setColor.bind(this, thisColor, 'end')} />
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Item>
                                    <Form.Item label="边框颜色">
                                        <ColorSelect color={item.handleBorderColor} setColor={this.setColor.bind(this, item, 'handleBorderColor')} />
                                    </Form.Item>
                                    <Form.Item label="边框宽度">
                                        <InputNumber value={item.handleBorderWidth} onChange={changeDetailData.bind(this, 2, item, 'handleBorderWidth')} />
                                    </Form.Item>
                                    <Form.Item label="边框类型">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'handleBorderType')} value={item.handleBorderType}>
                                            <Radio value={'solid'}>实线</Radio>
                                            <Radio value={'dashed'}>虚线1</Radio>
                                            <Radio value={'dotted'}>虚线2</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        </Panel>
                        <Panel header="坐标轴轴线" key="1">
                            <Form.Item label="显示">
                                <Switch checked={item.axisLine.show}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisLine, 'show')} />
                            </Form.Item>
                            <Form.Item label="颜色">
                                <ColorSelect color={item.axisLine.lineStyle.color} setColor={this.setColor.bind(this, item.axisLine.lineStyle, 'color')} />
                            </Form.Item>
                            <Form.Item label="线宽">
                                <InputNumber value={item.axisLine.lineStyle.width} min={0}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisLine.lineStyle, 'width')} />
                            </Form.Item>
                            <Form.Item label="类型">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.axisLine.lineStyle, 'type')} value={item.axisLine.lineStyle.type}>
                                    <Radio value={'solid'}>实线</Radio>
                                    <Radio value={'dashed'}>虚线1</Radio>
                                    <Radio value={'dotted'}>虚线2</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Panel>
                        <Panel header="坐标轴刻度" key="2">
                            <Form.Item label="显示">
                                <Switch checked={item.axisTick.show}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisTick, 'show')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐。">
                                        对齐方式*
                                    </Tooltip>
                                }
                            >
                                <Switch checked={item.axisTick.alignWithLabel}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisTick, 'alignWithLabel')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="坐标轴刻度的显示间隔，在类目轴中有效。可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』。">
                                        显示间隔*
                                    </Tooltip>
                                }
                            >
                                <InputNumber value={item.axisTick.interval} min={0}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisTick, 'interval')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="坐标轴刻度是否朝内，默认朝外。">
                                        朝向*
                                    </Tooltip>
                                }
                            >
                                <Switch checked={item.axisTick.inside}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisTick, 'inside')} />
                            </Form.Item>
                            <Form.Item label='长度' >
                                <InputNumber value={item.axisTick.length} min={0}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisTick, 'length')} />
                            </Form.Item>
                            <Form.Item label="颜色">
                                <ColorSelect color={item.axisTick.lineStyle.color} setColor={this.setColor.bind(this, item.axisTick.lineStyle, 'color')} />
                            </Form.Item>
                            <Form.Item label="线宽">
                                <InputNumber value={item.axisTick.lineStyle.width} min={0}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisTick.lineStyle, 'width')} />
                            </Form.Item>
                            <Form.Item label="类型">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.axisTick.lineStyle, 'type')} value={item.axisTick.lineStyle.type}>
                                    <Radio value={'solid'}>实线</Radio>
                                    <Radio value={'dashed'}>虚线1</Radio>
                                    <Radio value={'dotted'}>虚线2</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Panel>
                        <Panel header="分隔线" key="3">
                            <Form.Item label="显示">
                                <Switch checked={item.splitLine.show}
                                    onChange={this.changeDetailData.bind(this, 2, item.splitLine, 'show')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="坐标轴刻度的显示间隔，在类目轴中有效。可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』。">
                                        显示间隔*
                                    </Tooltip>
                                }
                            >
                                <InputNumber value={item.splitLine.interval} min={0}
                                    onChange={this.changeDetailData.bind(this, 2, item.splitLine, 'interval')} />
                            </Form.Item>
                            <Form.Item label="颜色">
                                <ColorSelect color={item.splitLine.lineStyle.color} setColor={this.setColor.bind(this, item.splitLine.lineStyle, 'color')} />
                            </Form.Item>
                            <Form.Item label="线宽">
                                <InputNumber value={item.splitLine.lineStyle.width} min={0}
                                    onChange={this.changeDetailData.bind(this, 2, item.splitLine.lineStyle, 'width')} />
                            </Form.Item>
                            <Form.Item label="类型">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.splitLine.lineStyle, 'type')} value={item.splitLine.lineStyle.type}>
                                    <Radio value={'solid'}>实线</Radio>
                                    <Radio value={'dashed'}>虚线1</Radio>
                                    <Radio value={'dotted'}>虚线2</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Panel>
                        <Panel header="刻度标签" key="4">
                            <Form.Item label="显示">
                                <Switch checked={item.axisLabel.show}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisLabel, 'show')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="坐标轴刻度的显示间隔，在类目轴中有效。可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』。">
                                        显示间隔*
                                    </Tooltip>
                                }
                            >
                                <InputNumber value={item.axisLabel.interval} min={0}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisLabel, 'interval')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="刻度标签是否朝内，默认朝外。">
                                        朝向*
                                    </Tooltip>
                                }
                            >
                                <Switch checked={item.axisLabel.inside}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisLabel, 'inside')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠。旋转的角度从 -90 度到 90 度。">
                                        旋转角度*
                                    </Tooltip>
                                }
                            >
                                <InputNumber value={item.axisLabel.rotate} min={-90} max={90}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisLabel, 'rotate')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="刻度标签与轴线之间的距离。">
                                        距离*
                                    </Tooltip>
                                }
                            >
                                <InputNumber value={item.axisLabel.margin}
                                    onChange={this.changeDetailData.bind(this, 2, item.axisLabel, 'margin')} />
                            </Form.Item>
                            <Form.Item label="颜色">
                                <ColorSelect color={item.axisLabel.color} setColor={this.setColor.bind(this, item.axisLabel, 'color')} />
                            </Form.Item>
                            <Form.Item label="字体大小">
                                <Input value={item.axisLabel.fontSize} onChange={this.changeDetailData.bind(this, 1, item.axisLabel, 'fontSize')} />
                            </Form.Item>
                            <Form.Item label="行高">
                                <Input value={item.axisLabel.lineHeight} onChange={this.changeDetailData.bind(this, 1, item.axisLabel, 'lineHeight')} />
                            </Form.Item>
                            <Form.Item label="水平对齐">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.axisLabel, 'align')} value={item.axisLabel.align}>
                                    <Radio value={'left'}>左对齐</Radio>
                                    <Radio value={'center'}>中对齐</Radio>
                                    <Radio value={'right'}>右对齐</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="垂直对齐">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.axisLabel, 'verticalAlign')} value={item.axisLabel.verticalAlign}>
                                    <Radio value={'top'}>上对齐</Radio>
                                    <Radio value={'middle'}>中对齐</Radio>
                                    <Radio value={'bottom'}>下对齐</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="刻度标签内容格式器。内容为函数代码。">
                                        格式器*
                                    </Tooltip>
                                }
                            >
                                <TextArea rows={5} value={item.axisLabel.formatter}
                                    onChange={this.changeDetailData.bind(this, 1, item.axisLabel, 'formatter')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="自定义富文本样式。内容格式为json字串。">
                                        文本样式*
                                    </Tooltip>
                                }
                            >
                                <TextArea rows={5} value={item.axisLabel.rich}
                                    onChange={this.changeDetailData.bind(this, 1, item.axisLabel, 'rich')} />
                            </Form.Item>
                        </Panel>
                    </Collapse>
                </Form>
            );
        })
    }

    getTooltipEdit(style){
        if(style.tooltip == null){
            style.tooltip = {};
        }
        if (style.tooltip.textStyle == null) {
            style.tooltip.textStyle = {};
        }
        const {tooltip} = style;
        return (
            <Form {...formItemLayout24}>
                <Form.Item label="是否显示">
                    <Switch checked={tooltip.show} onChange={this.changeDetailData.bind(this, 2, tooltip, 'show')} />
                </Form.Item>
                <Form.Item label="触发类型" >
                    <Radio.Group value={tooltip.trigger} onChange={changeDetailData.bind(this, 1, tooltip, 'trigger')}>
                        <Radio value={'axis'}>坐标轴触发(默认</Radio>
                        <Radio value={'item'}>数据项图形触发</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="字号">
                    <Input value={tooltip.textStyle.fontSize} onChange={this.changeDetailData.bind(this, 1, tooltip.textStyle, 'fontSize')} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title="提示框内容格式器。内容为函数代码。">
                            格式器*
                        </Tooltip>
                    }
                >
                    <TextArea rows={5} value={tooltip.formatter}
                              onChange={this.changeDetailData.bind(this, 1, tooltip, 'formatter')} />
                </Form.Item>
            </Form>
        );
    }

    render() {
        const { style } = this.props.data;
        const { legend } = style;
        return (
            <Collapse >
                <Panel header="grid" key="1">
                    {this.props.data.style.grid.map((item, index) =>
                        <Form {...formItemLayout24} key={index}>
                            {/*<Tag closable={this.props.data.style.grid.length > 1} visible={true} onClose={this.deleteItem.bind(this,'grid',index)}>{'索引：' + index}</Tag>*/}
                            <Form.Item
                                label={
                                    <Tooltip title="grid 区域是否包含坐标轴的刻度标签。">
                                        contain*
                                    </Tooltip>
                                }
                            >
                                <Switch checked={item.containLabel} onChange={this.changeDetailData.bind(this, 2, item, 'containLabel')} />
                            </Form.Item>
                            <Form.Item label="左空隙">
                                <Input value={item.left}
                                    onChange={this.changeDetailData.bind(this, 1, item, 'left')} />
                            </Form.Item>
                            <Form.Item label="上空隙">
                                <Input value={item.top}
                                    onChange={this.changeDetailData.bind(this, 1, item, 'top')} />
                            </Form.Item>
                            <Form.Item label="右空隙">
                                <Input value={item.right}
                                    onChange={this.changeDetailData.bind(this, 1, item, 'right')} />
                            </Form.Item>
                            <Form.Item label="下空隙">
                                <Input value={item.bottom}
                                    onChange={this.changeDetailData.bind(this, 1, item, 'bottom')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="auto为自适应">
                                        宽*
                                    </Tooltip>
                                }
                            >
                                <Input value={item.width}
                                    onChange={this.changeDetailData.bind(this, 1, item, 'width')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="auto为自适应">
                                        高*
                                    </Tooltip>
                                }
                            >
                                <Input value={item.height}
                                    onChange={this.changeDetailData.bind(this, 1, item, 'height')} />
                            </Form.Item>
                        </Form>
                    )}
                </Panel>
                <Panel header="图例" key="7">
                    <Form {...formItemLayout24}>
                        <Form.Item label="是否显示">
                            <Switch checked={legend.show} onChange={this.changeDetailData.bind(this, 2, legend, 'show')} />
                        </Form.Item>
                        <Form.Item label="左侧距离">
                            <Input value={legend.left} onChange={this.changeDetailData.bind(this, 1, legend, 'left')} />
                        </Form.Item>
                        <Form.Item label="右侧距离">
                            <Input value={legend.right} onChange={this.changeDetailData.bind(this, 1, legend, 'right')} />
                        </Form.Item>
                        <Form.Item label="上侧距离">
                            <Input value={legend.top} onChange={this.changeDetailData.bind(this, 1, legend, 'top')} />
                        </Form.Item>
                        <Form.Item label="下侧距离">
                            <Input value={legend.bottom} onChange={this.changeDetailData.bind(this, 1, legend, 'bottom')} />
                        </Form.Item>
                        <Form.Item label="宽">
                            <Input value={legend.width} onChange={this.changeDetailData.bind(this, 1, legend, 'width')} />
                        </Form.Item>
                        <Form.Item label="高">
                            <Input value={legend.height} onChange={this.changeDetailData.bind(this, 1, legend, 'height')} />
                        </Form.Item>
                        <Form.Item label="布局朝向">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'orient')} value={legend.orient}>
                                <Radio value={'horizontal'}>横向</Radio>
                                <Radio value={'vertical'}>竖向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="文本对齐">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'align')} value={legend.align}>
                                <Radio value={'auto'}>自动</Radio>
                                <Radio value={'left'}>左对齐</Radio>
                                <Radio value={'right'}>右对齐</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="内边距">
                            <InputNumber value={legend.padding} onChange={this.changeDetailData.bind(this, 2, legend, 'padding')} />
                        </Form.Item>
                        <Form.Item label="项间隔">
                            <Input value={legend.itemGap} onChange={this.changeDetailData.bind(this, 1, legend, 'itemGap')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'。可以通过 'image://url' 设置为图片，其中 URL 为图片的链接，或者 dataURI。可以通过 'path://' 将图标设置为任意的矢量路径。">
                                    图形*
                                </Tooltip>
                            }
                        >
                            <Input value={legend.icon} onChange={this.changeDetailData.bind(this, 1, legend, 'icon')} />
                        </Form.Item>
                        <Form.Item label="图形宽度">
                            <Input value={legend.itemWidth} onChange={this.changeDetailData.bind(this, 1, legend, 'itemWidth')} />
                        </Form.Item>
                        <Form.Item label="图形高度">
                            <Input value={legend.itemHeight} onChange={this.changeDetailData.bind(this, 1, legend, 'itemHeight')} />
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={legend.textStyle.color} setColor={this.setColor.bind(this, legend.textStyle, 'color')} />
                        </Form.Item>
                        <Form.Item label="文字大小">
                            <Input value={legend.textStyle.fontSize} onChange={this.changeDetailData.bind(this, 1, legend.textStyle, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="文字行高">
                            <Input value={legend.textStyle.lineHeight} onChange={this.changeDetailData.bind(this, 1, legend.textStyle, 'lineHeight')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="提示框" key="9">
                    {this.getTooltipEdit(style)}
                </Panel>
                <Panel header="x轴" key="2">
                    {this.getAxisEdit(this.props.data.style.xAxis, 'x')}
                </Panel>
                <Panel header="y轴" key="3">
                    {this.getAxisEdit(this.props.data.style.yAxis, 'y')}
                </Panel>
                <Panel header="图表样式" key="4">
                    <Form.Item label="是否堆叠">
                        <Switch checked={this.props.data.style.stack}
                            onChange={this.changeDetailData.bind(this, 2, this.props.data.style, 'stack')} />
                    </Form.Item>
                    <Form.Item label="柱图朝向">
                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, this.props.data.style, 'orientations')} value={this.props.data.style.orientations}>
                            <Radio value={1}>纵向</Radio>
                            <Radio value={2}>横向</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Panel>
                <Panel header="柱背景" key="5">
                    {this.props.data.style.seriesBackground.map((item, index) =>
                        <Form {...formItemLayout24} key={index}>
                            {/*<Form.Item label="显示">*/}
                            {/*    <Switch checked={item.show}*/}
                            {/*            onChange={this.changeDetailData.bind(this, 2, item, 'show')}/>*/}
                            {/*</Form.Item>*/}
                            <Form.Item label="颜色">
                                <ColorSelect color={item.itemStyle.color} setColor={this.setColor.bind(this, item.itemStyle, 'color')} />
                            </Form.Item>
                            <Form.Item label="背景宽">
                                <Input value={item.barWidth} onChange={this.changeDetailData.bind(this, 1, item, 'barWidth')} />
                            </Form.Item>
                            <Form.Item label="描边宽度">
                                <InputNumber value={item.itemStyle.borderWidth} onChange={this.changeDetailData.bind(this, 2, item.itemStyle, 'borderWidth')} />
                            </Form.Item>
                            <Form.Item label="描边颜色">
                                <ColorSelect color={item.itemStyle.borderColor} setColor={this.setColor.bind(this, item.itemStyle, 'borderColor')} />
                            </Form.Item>
                            <Form.Item label="描边类型">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.itemStyle, 'borderType')} value={item.itemStyle.borderType}>
                                    <Radio value={'solid'}>实线</Radio>
                                    <Radio value={'dashed'}>虚线1</Radio>
                                    <Radio value={'dotted'}>虚线2</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label={
                                <Tooltip title="默认为0。支持传入数组分别指定 4 个圆角半径（顺时针左上，右上，右下，左下）。">
                                    圆角半径*
                                </Tooltip>
                            }
                            >
                                <Input value={item.itemStyle.barBorderRadius} onChange={this.changeDetailData.bind(this, 1, item.itemStyle, 'barBorderRadius')} />
                            </Form.Item>
                            <Form.Item label="最大值倍数">
                                <InputNumber value={style.multiple} onChange={this.changeDetailData.bind(this, 2, style, 'multiple')} />
                            </Form.Item>
                            {this.getLabelEdit(item)}
                        </Form>
                    )}
                </Panel>
                <Panel header="柱样式" key="6">
                    {this.props.data.style.series.map((item, index) =>
                        <Form {...formItemLayout24} key={index}>
                            <Form.Item label="柱图类型">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'type')} value={item.type}>
                                    <Radio value={'bar'}>普通</Radio>
                                    <Radio value={'pictorialBar'}>图片</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item style={{ display: item.type !== 'pictorialBar' ? 'none' : '' }}
                                label={
                                    <Tooltip title="类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'。可以通过 'image://url' 设置为图片，其中 URL 为图片的链接，或者 dataURI。可以通过 'path://' 将图标设置为任意的矢量路径。">
                                        图形*
                                    </Tooltip>
                                }
                            >
                                <Input value={item.symbol} onChange={this.changeDetailData.bind(this, 1, item, 'symbol')} />
                            </Form.Item>
                            <Form.Item style={{ display: item.type !== 'pictorialBar' ? 'none' : '' }}
                                label={
                                    <Tooltip title="例如 [20, 10] 表示标记宽为20，高为10，也可以设置成诸如 10 这样单一的数字，表示 [10, 10]。值可以为数字，百分比（如 '120%'、['55%', 23]）">
                                        图形大小*
                                    </Tooltip>
                                }
                            >
                                <Input value={item.symbolSize} onChange={this.changeDetailData.bind(this, 1, item, 'symbolSize')} />
                            </Form.Item>
                            <Form.Item style={{ display: item.type !== 'pictorialBar' ? 'none' : '' }}
                                label={
                                    <Tooltip title="false/null/undefined：不重复。true：使图形元素重复，即每个数据值用一组重复的图形元素表示。重复的次数依据 data 计算得到。a number：使图形元素重复，即每个数据值用一组重复的图形元素表示。重复的次数是给定的定值。'fixed'：使图形元素重复，即每个数据值用一组重复的图形元素表示。重复的次数依据 symbolBoundingData 计算得到，即与 data 无关。这在此图形被用于做背景时有用。">
                                        图形重复*
                                    </Tooltip>
                                }
                            >
                                <Input value={item.symbolRepeat} onChange={this.changeDetailData.bind(this, 1, item, 'symbolRepeat')} />
                            </Form.Item>
                            <Form.Item style={{ display: item.type !== 'pictorialBar' ? 'none' : '' }}
                                label={
                                    <Tooltip title="false/null/undefined：图形本身表示数值大小。true：图形被剪裁后剩余的部分表示数值大小。">
                                        是否剪裁*
                                    </Tooltip>
                                }
                            >
                                <Switch checked={item.symbolClip} onChange={changeDetailData.bind(this, 2, item, 'symbolClip')} />
                            </Form.Item>
                            <Form.Item label="柱宽">
                                <Input value={item.barWidth} onChange={this.changeDetailData.bind(this, 1, item, 'barWidth')} />
                            </Form.Item>
                            <Form.Item label="最大柱宽">
                                <Input value={item.barMaxWidth} onChange={this.changeDetailData.bind(this, 1, item, 'barMaxWidth')} />
                            </Form.Item>
                            <Form.Item label="最小柱宽">
                                <Input value={item.barMinWidth} onChange={this.changeDetailData.bind(this, 1, item, 'barMinWidth')} />
                            </Form.Item>
                            <Form.Item label="柱间距离">
                                <Input value={item.barGap} onChange={this.changeDetailData.bind(this, 1, item, 'barGap')} />
                            </Form.Item>
                            <Form.Item label="颜色分布">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'seriesColorType')} value={item.seriesColorType}>
                                    <Radio value={1}>同系列同色</Radio>
                                    <Radio value={2}>同系列不同色</Radio>
                                    <Radio value={3}>根据不同值不同色</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="颜色类型">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'colorType')} value={item.colorType}>
                                    <Radio value={1}>单一色</Radio>
                                    <Radio value={2}>渐变色</Radio>
                                </Radio.Group>
                            </Form.Item>
                            {item.seriesColorType !== 3 ? (
                                <React.Fragment>
                                    <Form.Item style={{ display: item.colorType === 2 ? 'none' : '' }} label={
                                        <span>
                                    <Tooltip title="点击添加">
                                        <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.color, 1)} />
                                    </Tooltip>
                                    颜色
                                </span>
                                    }>
                                        <Row>
                                            {item.color.map((thisColor, index) =>
                                                <Col key={index}>
                                                    <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.color, index)} />
                                                    <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={this.deleteColor.bind(this, item.color, index)} />
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Item>
                                    <Form.Item style={{ display: item.colorType !== 2 ? 'none' : '' }} label={
                                        <span>
                                    <Tooltip title="点击添加">
                                        <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.linearColor, 2)} />
                                    </Tooltip>
                                    <Tooltip title="图标样式为纵向时颜色从上往下渐变。为横向时颜色从左往右渐变。">
                                        颜色*
                                    </Tooltip>
                                </span>
                                    }>
                                        <Row>
                                            {item.linearColor.map((thisColor, index) =>
                                                <Col key={index}>
                                                    <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={this.setColor.bind(this, thisColor, 'start')} />
                                                    <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                                    <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={this.setColor.bind(this, thisColor, 'end')} />
                                                    <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={this.deleteColor.bind(this, item.linearColor, index)} />
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Item>
                                </React.Fragment>
                            ):(
                                <React.Fragment>
                                    <Form.Item label="计算方式">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'calculateType')} value={item.calculateType}>
                                            <Radio value={1}>相同</Radio>
                                            <Radio value={2}>区间</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Collapse style={{ marginBottom: '20px' }}>
                                        <Panel header="颜色列表" key="1">
                                            {item.barColorList && item.barColorList.map((color,index)=>
                                                <div key={index}>
                                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item.barColorList, index)}>{'颜色' + (index + 1)}</Tag>
                                                    {item.calculateType === 1 &&
                                                        <Form.Item label="值" >
                                                            <Input value={color.num} onChange={changeDetailData.bind(this, 1, color, 'num')} />
                                                        </Form.Item>
                                                    }
                                                    {item.calculateType === 2 &&
                                                        <Form.Item label="大于等于" >
                                                            <InputNumber min={1} value={color.bottom} onChange={changeDetailData.bind(this, 2, color, 'bottom')} />
                                                        </Form.Item>
                                                    }
                                                    {item.calculateType === 2 &&
                                                        <Form.Item label="小与" >
                                                            <InputNumber min={1} value={color.top} onChange={changeDetailData.bind(this, 2, color, 'top')} />
                                                        </Form.Item>
                                                    }
                                                    {item.colorType === 2 ? (
                                                        <Form.Item label="颜色" >
                                                            <ColorSelect style={{ marginTop: '5px' }} color={color.start} setColor={this.setColor.bind(this, color, 'start')} />
                                                            <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                                            <ColorSelect style={{ marginTop: '5px' }} color={color.end} setColor={this.setColor.bind(this, color, 'end')} />
                                                        </Form.Item>
                                                    ):(
                                                        <Form.Item label="颜色">
                                                            <ColorSelect color={color.color} setColor={setColor.bind(this, color, 'color')} />
                                                        </Form.Item>
                                                    )}
                                                </div>
                                            )}
                                            <Form.Item label="">
                                                <Button type="dashed"
                                                        onClick={addListItem.bind(this, item, 'barColorList', {})}>
                                                    <Icon type="plus" /> 添加颜色设置
                                                </Button>
                                            </Form.Item>
                                        </Panel>
                                    </Collapse>
                                </React.Fragment>
                            )}
                            <Collapse style={{ marginBottom: '20px' }}>
                                <Panel header="透明度配置" key="1">
                                    <Form.Item label="透明度类型">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'opacityType')} value={item.opacityType}>
                                            <Radio value={1}>固定透明度</Radio>
                                            <Radio value={2}>根据x轴不同序号不同透明度</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    {item.opacityType === 2 ? (
                                        <React.Fragment>
                                            <Form.Item label="匹配方式">
                                                <Radio.Group onChange={changeDetailData.bind(this, 1, item, 'opacitySubType')} value={item.opacitySubType}>
                                                    <Radio value={1}>相等</Radio>
                                                    <Radio value={2}>区间</Radio>
                                                    <Radio value={3}>最后一个不同</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                            {item.opacitySubType === 3 ? (
                                                <React.Fragment>
                                                    <Form.Item label="最后透明度">
                                                        <InputNumber min={0} value={item.LastOpacity} onChange={changeDetailData.bind(this, 2, item, 'LastOpacity')} />
                                                    </Form.Item>
                                                    <Form.Item label="其他透明度">
                                                        <InputNumber min={0} value={item.otherOpacity} onChange={changeDetailData.bind(this, 2, item, 'otherOpacity')} />
                                                    </Form.Item>
                                                </React.Fragment>
                                            ):(
                                                <React.Fragment>
                                                    {item.opacityList && item.opacityList.map((opacityItem, opacityIndex) =>
                                                        <React.Fragment key={opacityIndex}>
                                                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item.opacityList, opacityIndex)}>{'透明度' + (opacityIndex + 1)}</Tag>
                                                            {item.opacitySubType === 1 &&
                                                            <Form.Item label="值" >
                                                                <InputNumber min={1} value={opacityItem.num} onChange={changeDetailData.bind(this, 2, opacityItem, 'num')} />
                                                            </Form.Item>
                                                            }
                                                            {item.opacitySubType === 2 &&
                                                            <Form.Item label="大于等于" >
                                                                <InputNumber min={1} value={opacityItem.more} onChange={changeDetailData.bind(this, 2, opacityItem, 'more')} />
                                                            </Form.Item>
                                                            }
                                                            {item.opacitySubType === 2 &&
                                                            <Form.Item label="小与" >
                                                                <InputNumber min={1} value={opacityItem.less} onChange={changeDetailData.bind(this, 2, opacityItem, 'less')} />
                                                            </Form.Item>
                                                            }
                                                            <Form.Item label="透明度">
                                                                <InputNumber min={0} value={opacityItem.opacity} onChange={changeDetailData.bind(this, 2, opacityItem, 'opacity')} />
                                                            </Form.Item>
                                                        </React.Fragment>
                                                    )}
                                                    <Form.Item label="">
                                                        <Button type="dashed" onClick={addListItem.bind(this, item, 'opacityList', {})}>
                                                            <Icon type="plus" /> 添加设置
                                                        </Button>
                                                    </Form.Item>
                                                </React.Fragment>
                                            )}
                                        </React.Fragment>
                                    ):(
                                        <Form.Item label="透明度">
                                            <InputNumber min={0} value={item.opacity} onChange={changeDetailData.bind(this, 2, item, 'opacity')} />
                                        </Form.Item>
                                    )}
                                </Panel>
                            </Collapse>
                            <Form.Item label="描边宽度">
                                <InputNumber value={item.itemStyle.borderWidth} onChange={this.changeDetailData.bind(this, 2, item.itemStyle, 'borderWidth')} />
                            </Form.Item>
                            <Form.Item label="描边颜色">
                                <ColorSelect color={item.itemStyle.borderColor} setColor={this.setColor.bind(this, item.itemStyle, 'borderColor')} />
                            </Form.Item>
                            <Form.Item label="描边类型">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.itemStyle, 'borderType')} value={item.itemStyle.borderType}>
                                    <Radio value={'solid'}>实线</Radio>
                                    <Radio value={'dashed'}>虚线1</Radio>
                                    <Radio value={'dotted'}>虚线2</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label={
                                <Tooltip title="默认为0。支持传入数组分别指定 4 个圆角半径（顺时针左上，右上，右下，左下）。">
                                    圆角半径*
                                </Tooltip>
                            }
                            >
                                <Input value={item.itemStyle.barBorderRadius} onChange={this.changeDetailData.bind(this, 1, item.itemStyle, 'barBorderRadius')} />
                            </Form.Item>
                            {this.getLabelEdit(item)}
                        </Form>
                    )}
                </Panel>
                <Panel header="其他设置" key="8">
                    <Form {...formItemLayout24} >
                        {/*<Form.Item label="刷新动画">*/}
                        {/*    <Switch checked={style.freshAnimate} onChange={this.changeDetailData.bind(this, 2, style, 'freshAnimate')} />*/}
                        {/*</Form.Item>*/}
                        <Form.Item label="自动滚动">
                            <Switch checked={style.autoMove} onChange={changeDetailData.bind(this, 2, style, 'autoMove')} />
                        </Form.Item>
                        <Form.Item label="滚动间隔">
                            <InputNumber value={style.autoMoveTime} onChange={changeDetailData.bind(this, 2, style, 'autoMoveTime')} />
                        </Form.Item>
                        <Form.Item label="数据刷新不清空">
                            <Switch checked={style.freshNotClear} onChange={changeDetailData.bind(this, 2, style, 'freshNotClear')} />
                        </Form.Item>
                        <Form.Item label="点击响应">
                            <Radio.Group onChange={changeDetailData.bind(this, 1, style, 'actionClickType')} value={style.actionClickType}>
                                <Radio value={1}>全点击响应(默认</Radio>
                                <Radio value={2}>只响应最后一个柱图点击</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
