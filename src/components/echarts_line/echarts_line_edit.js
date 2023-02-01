import React from 'react';
import { Form, Input, InputNumber, Collapse, Switch, Radio, Tooltip, Icon, Row, Col, Slider, Button, Tag } from 'antd';
import ColorSelect from "../../common/colorSelect";
import {addListItem, changeDetailData, deleteListItem, setColor} from "../../common/editUtil";

const formItemLayout24 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const { Panel } = Collapse;
const { TextArea } = Input;

export default class EchartsLineEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.seriesItem = {
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            symbol: 'emptyCircle',
            symbolSize: '1vh',
            showAllSymbol: true,
            step: false,
            smooth: 0,
            itemStyle: {
                opacity: true,
                color: ['#0ff'],
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 0,
                borderType: 'solid',
                barBorderRadius: 0,
            },
            lineStyle: {
                opacity: true,
                colorType: 1,
                color: ['#0ff'],
                width: '2',
                type: 'solid'
            },
            areaStyle: {
                opacity: true,
                colorType: 1,
                color: ['#0ff'],
                linearColor: [{
                    start: 'red',
                    end: 'blue'
                }],
            },
            label: {
                show: true,
                color: '#fff',
                positionType: 'inside',
                position: '',
                distance: '5',
                rotate: 0,
                fontSize: '12',
                align: 'center',
                verticalAlign: 'middle',
            },

            barWidth: '30%',
            barMaxWidth: '100%',
            barMinWidth: '1%',
            barGap: '-50%',
            colorType: 1,
            color: ['#0ff'],
            linearColor: [{
                start: 'red',
                end: 'blue'
            }],
        };
        this.yAxis = {"axisLabel":{"rotate":0,"verticalAlign":"middle","margin":8,"color":"rgba(255,255,255,1)","show":true,"interval":0,"fontSize":"12","inside":false,"align":"right"},"inverse":false,"gridIndex":0,"axisLine":{"lineStyle":{"color":"rgba(0,255,255,0.7)","width":1,"type":"solid"},"show":true},"show":true,"axisTick":{"lineStyle":{"color":"rgba(255,255,255,0.4)","width":1,"type":"solid"},"show":false,"length":5,"interval":0,"inside":false,"alignWithLabel":false},"splitLine":{"lineStyle":{"color":"rgba(0,255,255,0.2)","width":1,"type":"dashed"},"show":true,"interval":0},"scale":false,"position":"left","boundaryGap":true};
        this.xAxis = {"axisLabel":{"rotate":0,"verticalAlign":"top","margin":8,"color":"rgba(255,255,255,1)","show":true,"interval":0,"fontSize":"12","inside":false,"align":"center"},"inverse":false,"gridIndex":0,"axisLine":{"lineStyle":{"color":"rgba(0,255,255,0.7)","width":1,"type":"solid"},"show":true},"show":true,"axisTick":{"lineStyle":{"color":"#333","width":1,"type":"solid"},"show":false,"length":5,"interval":0,"inside":false,"alignWithLabel":false},"splitLine":{"lineStyle":{"color":"#333","width":1,"type":"solid"},"show":false,"interval":0},"scale":false,"position":"bottom","boundaryGap":false};
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

    getBarColorEdit(item){
        return (
            <React.Fragment>
                <Form.Item label="颜色类型">
                    <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'colorType')} value={item.colorType}>
                        <Radio value={1}>单一色</Radio>
                        <Radio value={2}>渐变色</Radio>
                    </Radio.Group>
                </Form.Item>
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
        );
    }

    getZoomEdit(item){
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
        );
    }

    //轴线设置
    getAxisEdit(axis, axisType) {
        return axis.map((item, index) =>
            <Form {...formItemLayout24} key={index}>
                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, axis, index)}>{'轴线' + (index + 1)}</Tag>
                <Form.Item label="是否显示">
                    <Switch checked={item.show} onChange={this.changeDetailData.bind(this, 2, item, 'show')} />
                </Form.Item>
                <Form.Item label="所在层级" >
                    <InputNumber value={item.z} onChange={changeDetailData.bind(this, 2, item, 'z')} />
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
                <Form.Item
                    label={
                        <Tooltip title="自动计算的坐标轴最小间隔大小。只在数值轴或时间轴中（type: 'value' 或 'time'）有效。">
                            最小间隔*
                        </Tooltip>
                    }
                >
                    <InputNumber value={item.minInterval} onChange={this.changeDetailData.bind(this, 2, item, 'minInterval')} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title="坐标轴刻度最大值。">
                            最大值*
                        </Tooltip>
                    }
                >
                    <InputNumber value={item.max} onChange={this.changeDetailData.bind(this, 2, item, 'max')} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title="坐标轴刻度最小值。">
                            最小值*
                        </Tooltip>
                    }
                >
                    <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'minType')} value={item.minType}>
                        <Radio value={1}>
                            固定值<InputNumber value={item.minNum} onChange={this.changeDetailData.bind(this, 2, item, 'minNum')} />
                        </Radio>
                        <Radio value={2}>
                            数据最小值减<InputNumber value={item.minSubNum} style={{width:'60px'}} onChange={this.changeDetailData.bind(this, 2, item, 'minSubNum')} />
                        </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='轴线偏移' >
                    <InputNumber value={item.offset} onChange={this.changeDetailData.bind(this, 2, item, 'offset')} />
                </Form.Item>
                <Collapse >
                    {this.getZoomEdit(item)}
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
        )
    }

    getLineEdit(item) {
        return (
            <Form {...formItemLayout24}>
                <Form.Item label="x轴序号" >
                    <InputNumber min={0} value={item.xAxisIndex} onChange={changeDetailData.bind(this, 2, item, 'xAxisIndex')} />
                </Form.Item>
                <Form.Item label="y轴序号" >
                    <InputNumber min={0} value={item.yAxisIndex} onChange={changeDetailData.bind(this, 2, item, 'yAxisIndex')} />
                </Form.Item>
                <Form.Item label="阶梯线图">
                    <Switch checked={item.step}
                        onChange={this.changeDetailData.bind(this, 2, item, 'step')} />
                </Form.Item>
                <Form.Item label="尾迹特效">
                    <Switch checked={item.showEffect}
                        onChange={this.changeDetailData.bind(this, 2, item, 'showEffect')} />
                </Form.Item>
                <Form.Item label="平滑程度">
                    <Slider
                        min={0}
                        max={1}
                        onChange={this.changeDetailData.bind(this, 2, item, 'smooth')}
                        value={item.smooth}
                        step={0.01}
                    />
                </Form.Item>
                <Collapse >
                    <Panel header="标记样式" key="4">
                        <Form.Item label="是否显示">
                            <Switch checked={item.itemStyle.opacity}
                                onChange={this.changeDetailData.bind(this, 2, item.itemStyle, 'opacity')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="类型包括 'emptyCircle', 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'。可以通过 'image://url' 设置为图片，其中 URL 为图片的链接，或者 dataURI。可以通过 'path://' 将图标设置为任意的矢量路径。">
                                    标记图形*
                                </Tooltip>
                            }
                        >
                            <Input value={item.symbol} onChange={this.changeDetailData.bind(this, 1, item, 'symbol')} />
                        </Form.Item>
                        <Form.Item label="颜色类型">
                            <Radio.Group value={item.symbolColorType} onChange={changeDetailData.bind(this, 1, item, 'symbolColorType')}>
                                <Radio value={1}>统一色</Radio>
                                <Radio value={2}>不同序号不同色</Radio>
                                <Radio value={3}>不同值不同色</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {item.symbolColorType !== 3 && (
                            <Form.Item label={
                                <span>
                                <Tooltip title="点击添加">
                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.itemStyle.color, 1)} />
                                </Tooltip>
                                            标记颜色
                                        </span>
                            }>
                                <Row>
                                    {item.itemStyle.color.map((thisColor, index) =>
                                        <Col key={index}>
                                            <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.itemStyle.color, index)} />
                                            <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={this.deleteColor.bind(this, item.itemStyle.color, index)} />
                                        </Col>
                                    )}
                                </Row>
                            </Form.Item>
                        )}
                        {item.symbolColorType === 3 && (
                            <Collapse style={{ marginBottom: '20px' }}>
                                <Panel header="颜色列表" key="1">
                                    {item.symbolColorList && item.symbolColorList.map((color, index) =>
                                        <div key={index}>
                                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item.symbolColorList, index)}>{'颜色' + (index + 1)}</Tag>
                                            <Form.Item label="大于等于" >
                                                <InputNumber value={color.more} onChange={changeDetailData.bind(this, 2, color, 'more')} />
                                            </Form.Item>
                                            <Form.Item label="小与" >
                                                <InputNumber value={color.less} onChange={changeDetailData.bind(this, 2, color, 'less')} />
                                            </Form.Item>
                                            <Form.Item label="颜色">
                                                <ColorSelect color={color.color} setColor={setColor.bind(this, color, 'color')} />
                                            </Form.Item>
                                        </div>
                                    )}
                                    <Form.Item label="">
                                        <Button type="dashed"
                                                onClick={addListItem.bind(this, item, 'symbolColorList', {})}>
                                            <Icon type="plus" /> 添加颜色设置
                                        </Button>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        )}
                        <Form.Item label="标记大小">
                            <Input value={item.symbolSize} onChange={this.changeDetailData.bind(this, 1, item, 'symbolSize')} />
                        </Form.Item>
                        <Form.Item label="标记间隔">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'showAllSymbol')} value={item.showAllSymbol}>
                                <Radio value={true}>显示所有</Radio>
                                <Radio value={false}>随主轴间隔隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="线样式" key="2">
                        <Form.Item label="是否显示">
                            <Switch checked={item.lineStyle.opacity}
                                onChange={this.changeDetailData.bind(this, 2, item.lineStyle, 'opacity')} />
                        </Form.Item>
                        <Form.Item label="颜色类型">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.lineStyle, 'colorType')} value={item.lineStyle.colorType}>
                                <Radio value={1}>统一色</Radio>
                                <Radio value={2}>不同值不同色</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {item.lineStyle.colorType !== 2 && (
                            <Form.Item label={
                                <span>
                                <Tooltip title="点击添加">
                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.lineStyle.color, 1)} />
                                </Tooltip>
                                            颜色
                                        </span>
                            }>
                                <Row>
                                    {item.lineStyle.color.map((thisColor, index) =>
                                        <Col key={index}>
                                            <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.lineStyle.color, index)} />
                                            <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={this.deleteColor.bind(this, item.lineStyle.color, index)} />
                                        </Col>
                                    )}
                                </Row>
                            </Form.Item>
                        )}
                        {item.lineStyle.colorType === 2 && (
                            <Collapse style={{ marginBottom: '20px' }}>
                                <Panel header="颜色列表" key="1">
                                    {item.lineStyle.colorList && item.lineStyle.colorList.map((color, index) =>
                                        <div key={index}>
                                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item.lineStyle.colorList, index)}>{'颜色' + (index + 1)}</Tag>
                                            <Form.Item label="大于等于" >
                                                <InputNumber value={color.more} onChange={changeDetailData.bind(this, 2, color, 'more')} />
                                            </Form.Item>
                                            <Form.Item label="小与" >
                                                <InputNumber value={color.less} onChange={changeDetailData.bind(this, 2, color, 'less')} />
                                            </Form.Item>
                                            <Form.Item label="颜色">
                                                <ColorSelect color={color.color} setColor={setColor.bind(this, color, 'color')} />
                                            </Form.Item>
                                        </div>
                                    )}
                                    <Form.Item label="">
                                        <Button type="dashed"
                                                onClick={addListItem.bind(this, item.lineStyle, 'colorList', {})}>
                                            <Icon type="plus" /> 添加颜色设置
                                        </Button>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        )}
                        <Form.Item label="线宽">
                            <Input value={item.lineStyle.width} onChange={this.changeDetailData.bind(this, 1, item.lineStyle, 'width')} />
                        </Form.Item>
                        <Form.Item label="线类型">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.lineStyle, 'type')} value={item.lineStyle.type}>
                                <Radio value={'solid'}>实线</Radio>
                                <Radio value={'dashed'}>虚线1</Radio>
                                <Radio value={'dotted'}>虚线2</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="区域填充样式" key="3">
                        <Form.Item label="是否显示">
                            <Switch checked={item.areaStyle.opacity}
                                onChange={this.changeDetailData.bind(this, 2, item.areaStyle, 'opacity')} />
                        </Form.Item>
                        <Form.Item label="起始位置">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.areaStyle, 'origin')} value={item.areaStyle.origin}>
                                <Radio value={"auto"}>默认</Radio>
                                <Radio value={"start"}>坐标轴底部</Radio>
                                <Radio value={"end"}>坐标轴顶部</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="颜色类型">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.areaStyle, 'colorType')} value={item.areaStyle.colorType}>
                                <Radio value={1}>单一色</Radio>
                                <Radio value={2}>渐变色</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item style={{ display: item.areaStyle.colorType === 2 ? 'none' : '' }} label={
                            <span>
                                <Tooltip title="点击添加">
                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.areaStyle.color, 1)} />
                                </Tooltip>
                                            颜色
                                        </span>
                        }>
                            <Row>
                                {item.areaStyle.color.map((thisColor, index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.areaStyle.color, index)} />
                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={this.deleteColor.bind(this, item.areaStyle.color, index)} />
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>
                        <Form.Item style={{ display: item.areaStyle.colorType !== 2 ? 'none' : '' }} label={
                            <span>
                                <Tooltip title="点击添加">
                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.areaStyle.linearColor, 2)} />
                                </Tooltip>
                                <Tooltip title="从左往右渐变。">
                                    颜色*
                                            </Tooltip>
                            </span>
                        }>
                            <Row>
                                {item.areaStyle.linearColor.map((thisColor, index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={this.setColor.bind(this, thisColor, 'start')} />
                                        <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={this.setColor.bind(this, thisColor, 'end')} />
                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={this.deleteColor.bind(this, item.areaStyle.linearColor, index)} />
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>
                    </Panel>
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
            </Form>
        );
    }

    getBarEdit(item) {
        return (
            <Form {...formItemLayout24}>
                <Form.Item label="x轴序号" >
                    <InputNumber min={0} value={item.xAxisIndex} onChange={changeDetailData.bind(this, 2, item, 'xAxisIndex')} />
                </Form.Item>
                <Form.Item label="y轴序号" >
                    <InputNumber min={0} value={item.yAxisIndex} onChange={changeDetailData.bind(this, 2, item, 'yAxisIndex')} />
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
                <Form.Item label="是否堆叠">
                    <Switch checked={item.stack}
                            onChange={this.changeDetailData.bind(this, 2, item, 'stack')} />
                </Form.Item>
                <Form.Item label="颜色类型">
                    <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'seriesColorType')} value={item.seriesColorType}>
                        <Radio value={1}>统一色</Radio>
                        <Radio value={2}>不同序号不同色</Radio>
                        <Radio value={3}>不同值不同色</Radio>
                    </Radio.Group>
                </Form.Item>
                {item.seriesColorType !== 3 && this.getBarColorEdit(item)}
                {item.seriesColorType === 3 && (
                    <Collapse style={{ marginBottom: '20px' }}>
                        <Panel header="颜色列表" key="1">
                            {item.barColorList && item.barColorList.map((color, index) =>
                                <div key={index}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item.barColorList, index)}>{'颜色' + (index + 1)}</Tag>
                                    <Form.Item label="大于等于" >
                                        <InputNumber value={color.more} onChange={changeDetailData.bind(this, 2, color, 'more')} />
                                    </Form.Item>
                                    <Form.Item label="小与" >
                                        <InputNumber value={color.less} onChange={changeDetailData.bind(this, 2, color, 'less')} />
                                    </Form.Item>
                                    <Form.Item label="颜色类型">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, color, 'colorType')} value={color.colorType}>
                                            <Radio value={1}>单一色</Radio>
                                            <Radio value={2}>渐变色</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    {color.colorType === 1 && (
                                        <Form.Item label="颜色">
                                            <ColorSelect color={color.color} setColor={setColor.bind(this, color, 'color')} />
                                        </Form.Item>
                                    )}
                                    {color.colorType === 2 && (
                                        <Form.Item label={
                                            <Tooltip title="图标样式为纵向时颜色从上往下渐变。为横向时颜色从左往右渐变。">颜色* </Tooltip>
                                        }>
                                            <Row>
                                                <Col >
                                                    <ColorSelect style={{ marginTop: '5px' }} color={color.start} setColor={this.setColor.bind(this, color, 'start')} />
                                                    <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                                    <ColorSelect style={{ marginTop: '5px' }} color={color.end} setColor={this.setColor.bind(this, color, 'end')} />
                                                </Col>
                                            </Row>
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
                )}
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
            </Form>
        );
    }

    render() {
        const { style } = this.props.data;
        if (style.tooltip == null) {
            style.tooltip = {};
        }
        if (style.tooltip.textStyle == null) {
            style.tooltip.textStyle = {};
        }
        const { legend, series, tooltip } = style;
        return (
            <Collapse >
                <Panel header="grid" key="1">
                    {this.props.data.style.grid.map((item, index) =>
                        <Form {...formItemLayout24} key={index}>
                            <Form.Item
                                label={
                                    <Tooltip title='显示的最大条数，超出隐藏，并出现滚动条'>
                                        显示数量*
                                    </Tooltip>
                                }
                            >
                                <InputNumber value={style.maxShowNum} onChange={changeDetailData.bind(this, 2, style, 'maxShowNum')} />
                            </Form.Item>
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
                        <Form.Item label="选择模式">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'selectedMode')} value={legend.selectedMode}>
                                <Radio value={true}>开启</Radio>
                                <Radio value={false}>关闭</Radio>
                                <Radio value={'single'}>单选</Radio>
                                <Radio value={'multiple'}>多选</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="初始化时默认选中项，内容为项序号json字串，如：[1,3]表示默认选中第一项和第三项">
                                    默认选中*
                                </Tooltip>
                            }
                        >
                            <Input value={legend.defaultSelected} onChange={this.changeDetailData.bind(this, 1, legend, 'defaultSelected')} />
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
                        <Form.Item style={{ display: legend.symbolType === 2 ? 'none' : '' }}
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
                        <Form.Item
                            label={
                                <Tooltip title="刻度标签内容格式器。内容为函数代码。">
                                    格式器*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={style.legend.formatter}
                                onChange={changeDetailData.bind(this, 1, style.legend, 'formatter')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="自定义富文本样式。内容格式为json字串。">
                                    文本样式*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={style.legend.textStyle.rich}
                                onChange={changeDetailData.bind(this, 1, style.legend.textStyle, 'rich')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="提示框" key="4">
                    <Form {...formItemLayout24}>
                        <Form.Item label="是否显示">
                            <Switch checked={tooltip.show} onChange={this.changeDetailData.bind(this, 2, tooltip, 'show')} />
                        </Form.Item>
                        <Form.Item label="限制在图表区域">
                            <Switch checked={tooltip.confine} onChange={this.changeDetailData.bind(this, 2, tooltip, 'confine')} />
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
                </Panel>
                <Panel header="x轴" key="2">
                    {this.getAxisEdit(this.props.data.style.xAxis, 'x')}
                    <Form.Item label="" style={{margin:'1vh'}}>
                        <Button type="dashed"
                                onClick={addListItem.bind(this, this.props.data.style, 'xAxis', this.xAxis)}>
                            <Icon type="plus" /> 添加轴线
                        </Button>
                    </Form.Item>
                </Panel>
                <Panel header="y轴" key="3">
                    {this.getAxisEdit(this.props.data.style.yAxis, 'y')}
                    <Form.Item label="" style={{margin:'1vh'}}>
                        <Button type="dashed"
                                onClick={addListItem.bind(this, this.props.data.style, 'yAxis', this.yAxis)}>
                            <Icon type="plus" /> 添加轴线
                        </Button>
                    </Form.Item>
                </Panel>
                <Panel header="图表样式" key="6">
                    {series.map((item, index) => {
                        return (
                            <div key={index}>
                                <Tag closable={series.length > 1} visible={true} onClose={deleteListItem.bind(this, series, index)}>
                                    {'图表' + (index + 1)}
                                </Tag>
                                <Form.Item label="图表类型" {...formItemLayout24}>
                                    <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'type')} value={item.type}>
                                        <Radio value={'line'}>折线图</Radio>
                                        <Radio value={'bar'}>普通柱状图</Radio>
                                        <Radio value={'pictorialBar'}>图片柱状图</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                {item.type === 'line' ? this.getLineEdit(item) : this.getBarEdit(item)}
                            </div>
                        );
                    })}
                    <Form.Item label="">
                        <Button type="dashed"
                            onClick={addListItem.bind(this, this.props.data.style, 'series', this.seriesItem)}>
                            <Icon type="plus" /> 添加图表
                        </Button>
                    </Form.Item>
                </Panel>
                <Panel header="其他设置" key="8">
                    <Form {...formItemLayout24}>
                        <Form.Item label="自动滚动">
                            <Switch checked={style.autoMove} onChange={changeDetailData.bind(this, 2, style, 'autoMove')} />
                        </Form.Item>
                        <Form.Item label="滚动间隔">
                            <InputNumber value={style.autoMoveTime} onChange={changeDetailData.bind(this, 2, style, 'autoMoveTime')} />
                        </Form.Item>
                        <Form.Item label="数据刷新不清空">
                            <Switch checked={style.freshNotClear} onChange={changeDetailData.bind(this, 2, style, 'freshNotClear')} />
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
