import React from 'react';
import { Form, Input, InputNumber, Collapse, Radio, Tooltip, Icon, Row, Col, Slider, Switch } from 'antd';
import ColorSelect from "../../common/colorSelect";
import {
    changeDetailData, deleteListItem, setColor,
} from "../../common/editUtil";

const formItemLayout24 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const { Panel } = Collapse;
const { TextArea } = Input;

export default class EchartsRadarEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
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

    getTooltipEdit(style) {
        if (style.tooltip == null) {
            style.tooltip = {};
        }
        if (style.tooltip.textStyle == null) {
            style.tooltip.textStyle = {};
        }
        const { tooltip } = style;
        return (
            <Form {...formItemLayout24}>
                <Form.Item label="是否显示">
                    <Switch checked={tooltip.show} onChange={changeDetailData.bind(this, 2, tooltip, 'show')} />
                </Form.Item>
                <Form.Item label="字号">
                    <Input value={tooltip.textStyle.fontSize} onChange={changeDetailData.bind(this, 1, tooltip.textStyle, 'fontSize')} />
                </Form.Item>
                <Form.Item label="样式">
                    <Radio.Group onChange={changeDetailData.bind(this, 1, tooltip, 'theme')} value={tooltip.theme}>
                        <Radio value={1}>默认</Radio>
                        <Radio value={2}>自定义</Radio>
                        <Radio value={3}>主题一</Radio>
                    </Radio.Group>
                </Form.Item>
                {tooltip.theme === 2 && (
                    <Form.Item
                        label={
                            <Tooltip title="提示框内容格式器。内容为函数代码。">
                                格式器*
                            </Tooltip>
                        }
                    >
                        <TextArea rows={5} value={tooltip.formatter}
                                  onChange={changeDetailData.bind(this, 1, tooltip, 'formatter')} />
                    </Form.Item>
                )}
            </Form>
        );
    }

    render() {
        const { style } = this.props.data;
        const { radar } = style;
        const { series } = style;
        const { name, axisLine, axisTick, axisLabel, splitLine, splitArea } = radar;
        const { areaStyle } = splitArea;
        const { legend } = style;
        if (!legend.textStyle ) {
            legend.textStyle = {
                    color: "rgba(255,255,255,1)",
                    fontSize: "1.2vh",
                    lineHeight: "1.2vh"
            }
        }
        series&&series.forEach(item=>{
            if(typeof(item.itemStyle.color)==="string"||!item.itemStyle.color){
                item.itemStyle.color=[''+item.itemStyle.color]
                item.itemStyle.colorType=1
            }
            if(!item.color){
                item.color=["rgba(255,255,255,1)"]
            }
            if(!item.lineStyle.colorType){
                item.lineStyle.colorType=1
            }
        })
        if(!radar.axisLine.lineStyle.colorType){
            radar.axisLine.lineStyle.colorType=1
        }
        return (
            <Form {...formItemLayout24}>
                <Collapse>
                    <Panel header="图例" key="10">
                        <Form.Item label="是否显示">
                            <Switch checked={legend.show} onChange={changeDetailData.bind(this, 2, legend, 'show')} />
                        </Form.Item>
                        <Form.Item label="选择模式">
                            <Radio.Group onChange={changeDetailData.bind(this, 1, legend, 'selectedMode')} value={legend.selectedMode}>
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
                            <Input value={legend.defaultSelected} onChange={changeDetailData.bind(this, 1, legend, 'defaultSelected')} />
                        </Form.Item>
                        <Form.Item label="左侧距离">
                            <Input value={legend.left} onChange={changeDetailData.bind(this, 1, legend, 'left')} />
                        </Form.Item>
                        <Form.Item label="右侧距离">
                            <Input value={legend.right} onChange={changeDetailData.bind(this, 1, legend, 'right')} />
                        </Form.Item>
                        <Form.Item label="上侧距离">
                            <Input value={legend.top} onChange={changeDetailData.bind(this, 1, legend, 'top')} />
                        </Form.Item>
                        <Form.Item label="下侧距离">
                            <Input value={legend.bottom} onChange={changeDetailData.bind(this, 1, legend, 'bottom')} />
                        </Form.Item>
                        <Form.Item label="宽">
                            <Input value={legend.width} onChange={changeDetailData.bind(this, 1, legend, 'width')} />
                        </Form.Item>
                        <Form.Item label="高">
                            <Input value={legend.height} onChange={changeDetailData.bind(this, 1, legend, 'height')} />
                        </Form.Item>
                        <Form.Item label="布局朝向">
                            <Radio.Group onChange={changeDetailData.bind(this, 1, legend, 'orient')} value={legend.orient}>
                                <Radio value={'horizontal'}>横向</Radio>
                                <Radio value={'vertical'}>竖向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="文本对齐">
                            <Radio.Group onChange={changeDetailData.bind(this, 1, legend, 'align')} value={legend.align}>
                                <Radio value={'auto'}>自动</Radio>
                                <Radio value={'left'}>左对齐</Radio>
                                <Radio value={'right'}>右对齐</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="内边距">
                            <InputNumber value={legend.padding} onChange={changeDetailData.bind(this, 2, legend, 'padding')} />
                        </Form.Item>
                        <Form.Item label="项间隔">
                            <Input value={legend.itemGap} onChange={changeDetailData.bind(this, 1, legend, 'itemGap')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'。可以通过 'image://url' 设置为图片，其中 URL 为图片的链接，或者 dataURI。可以通过 'path://' 将图标设置为任意的矢量路径。">
                                    图形*
                                </Tooltip>
                            }
                        >
                            <Input value={legend.icon} onChange={changeDetailData.bind(this, 1, legend, 'icon')} />
                        </Form.Item>
                        <Form.Item label="图形宽度">
                            <Input value={legend.itemWidth} onChange={changeDetailData.bind(this, 1, legend, 'itemWidth')} />
                        </Form.Item>
                        <Form.Item label="图形高度">
                            <Input value={legend.itemHeight} onChange={changeDetailData.bind(this, 1, legend, 'itemHeight')} />
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={legend.textStyle.color} setColor={setColor.bind(this, legend.textStyle, 'color')} />
                        </Form.Item>
                        <Form.Item label="文字大小">
                            <Input value={legend.textStyle.fontSize} onChange={changeDetailData.bind(this, 1, legend.textStyle, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="文字行高">
                            <Input value={legend.textStyle.lineHeight} onChange={changeDetailData.bind(this, 1, legend.textStyle, 'lineHeight')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
                <Collapse>
                    <Panel header="坐标系" key="1">
                        <Form.Item label="水平中心点位置">
                            <Input value={radar.centerX} onChange={changeDetailData.bind(this, 1, radar, 'centerX')} />
                        </Form.Item>
                        <Form.Item label="垂直中心点位置">
                            <Input value={radar.centerY} onChange={changeDetailData.bind(this, 1, radar, 'centerY')} />
                        </Form.Item>
                        <Form.Item label="内半径">
                            <Input value={radar.radiusIn} onChange={changeDetailData.bind(this, 1, radar, 'radiusIn')} />
                        </Form.Item>
                        <Form.Item label="外半径">
                            <Input value={radar.radiusOut} onChange={changeDetailData.bind(this, 1, radar, 'radiusOut')} />
                        </Form.Item>
                        <Form.Item label="旋转">
                            <Slider
                                min={0}
                                max={360}
                                onChange={changeDetailData.bind(this, 2, radar, 'startAngle')}
                                value={radar.startAngle}
                                step={1}
                            />
                        </Form.Item>
                        <Form.Item label="名称与轴距离">
                            <Input value={radar.nameGap} onChange={changeDetailData.bind(this, 1, radar, 'nameGap')} />
                        </Form.Item>
                        <Form.Item label="分割段数">
                            <InputNumber value={radar.splitNumber} onChange={changeDetailData.bind(this, 2, radar, 'splitNumber')} />
                        </Form.Item>
                        <Form.Item label="绘制类型">
                            <Radio.Group onChange={changeDetailData.bind(this, 1, radar, 'shape')} value={radar.shape}>
                                <Radio value={'polygon'}>多边形</Radio>
                                <Radio value={'circle'}>圆形</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Collapse>
                            <Panel header="文字标签" key="2">
                                <Form.Item label="是否显示">
                                    <Switch checked={name.show}
                                        onChange={changeDetailData.bind(this, 2, name, 'show')} />
                                </Form.Item>
                                <Form.Item label="文字颜色">
                                    <ColorSelect color={name.color} setColor={setColor.bind(this, name, 'color')} />
                                </Form.Item>
                                <Form.Item label="文字大小">
                                    <Input value={name.fontSize} onChange={changeDetailData.bind(this, 1, name, 'fontSize')} />
                                </Form.Item>
                                <Form.Item label="字体风格">
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, name, 'fontStyle')} value={name.fontStyle}>
                                        <Radio value={'normal'}>正常</Radio>
                                        <Radio value={'italic'}>斜体</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="字体粗细">
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, name, 'fontWeight')} value={name.fontWeight}>
                                        <Radio value={'normal'}>正常</Radio>
                                        <Radio value={'bold'}>粗体</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="字体">
                                    <Input value={name.fontFamily} onChange={changeDetailData.bind(this, 1, name, 'fontFamily')} />
                                </Form.Item>
                                <Form.Item label="文字边框色">
                                    <ColorSelect color={name.borderColor} setColor={setColor.bind(this, name, 'borderColor')} />
                                </Form.Item>
                                <Form.Item label="文字框宽度">
                                    <Input value={name.borderWidth} onChange={changeDetailData.bind(this, 1, name, 'borderWidth')} />
                                </Form.Item>
                                <Form.Item label="阴影长度">
                                    <Input value={name.shadowBlur} onChange={changeDetailData.bind(this, 1, name, 'shadowBlur')} />
                                </Form.Item>
                                <Form.Item label="阴影颜色">
                                    <ColorSelect color={name.shadowColor} setColor={setColor.bind(this, name, 'shadowColor')} />
                                </Form.Item>
                                <Form.Item label="阴影X偏移">
                                    <Input value={name.shadowOffsetX} onChange={changeDetailData.bind(this, 1, name, 'shadowOffsetX')} />
                                </Form.Item>
                                <Form.Item label="阴影Y偏移">
                                    <Input value={name.shadowOffsetY} onChange={changeDetailData.bind(this, 1, name, 'shadowOffsetY')} />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Tooltip title="刻度标签内容格式器。内容为函数代码。">
                                            格式器*
                                </Tooltip>
                                    }
                                >
                                    <TextArea rows={5} value={style.radar.name.formatter}
                                        onChange={changeDetailData.bind(this, 1, style.radar.name, 'formatter')} />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Tooltip title="自定义富文本样式。内容格式为json字串。">
                                            文本样式*
                                </Tooltip>
                                    }
                                >
                                    <TextArea rows={5} value={style.radar.name.rich}
                                        onChange={changeDetailData.bind(this, 1, style.radar.name, 'rich')} />
                                </Form.Item>

                            </Panel>
                        </Collapse>
                        <Collapse>
                            <Panel header="坐标轴线">
                                <Form.Item label="是否显示">
                                    <Switch checked={axisLine.show}
                                        onChange={changeDetailData.bind(this, 2, axisLine, 'show')} />
                                </Form.Item>
                                <Form.Item label="刻度显示类型">
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, axisLine, 'symbol')} value={axisLine.symbol}>
                                        <Radio value={'none'}>不显示</Radio>
                                        <Radio value={'arrow'}>两端显示</Radio>
                                        <Radio value={['none', 'arrow']}>只末端显示</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="箭头宽度">
                                    <Input value={axisLine.symbolSizeX} onChange={changeDetailData.bind(this, 1, axisLine, 'symbolSizeX')} />
                                </Form.Item>
                                <Form.Item label="箭头高度">
                                    <Input value={axisLine.symbolSizeY} onChange={changeDetailData.bind(this, 1, axisLine, 'symbolSizeY')} />
                                </Form.Item>
                                <Form.Item label="起始箭头偏移">
                                    <InputNumber value={axisLine.symbolOffsetStart} onChange={changeDetailData.bind(this, 2, axisLine, 'symbolOffsetStart')} />
                                </Form.Item>
                                <Form.Item label="末端箭头偏移">
                                    <InputNumber value={axisLine.symbolOffsetEnd} onChange={changeDetailData.bind(this, 2, axisLine, 'symbolOffsetEnd')} />
                                </Form.Item>
                                <Collapse>
                                    <Panel header="轴线样式">
                                        <Form.Item label="颜色类型">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, axisLine, 'colorType')} value={axisLine.colorType}>
                                                <Radio value={1}>单一色</Radio>
                                                <Radio value={2}>渐变色</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item style={{ display: axisLine.colorType === 2 ? 'none' : '' }} label={
                                            <span>
                                                <Tooltip title="点击添加">
                                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, axisLine.lineStyle.color, 1)} />
                                                </Tooltip>
                                    颜色
                                </span>
                                        }>
                                            <Row>
                                                {axisLine.lineStyle.color.map((thisColor, index) =>
                                                    <Col key={index}>
                                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={setColor.bind(this, axisLine.lineStyle.color, index)} />
                                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={deleteListItem.bind(axisLine, axisLine.lineStyle.color, index)} />
                                                    </Col>
                                                )}
                                            </Row>

                                        </Form.Item>
                                        <Form.Item style={{ display: axisLine.colorType !== 2 ? 'none' : '' }} label={
                                            <span>
                                                <Tooltip title="点击添加">
                                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, axisLine.linearColor, 2)} />
                                                </Tooltip>
                                                <Tooltip title="图标样式为纵向时颜色从上往下渐变。为横向时颜色从左往右渐变。">
                                                    颜色*
                                    </Tooltip>
                                            </span>
                                        }>
                                            <Row>
                                                {axisLine.linearColor.map((thisColor, index) =>
                                                    <Col key={index}>
                                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={setColor.bind(this, thisColor, 'start')} />
                                                        <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={setColor.bind(this, thisColor, 'end')} />
                                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={deleteListItem.bind(this, axisLine.linearColor, index)} />
                                                    </Col>
                                                )}
                                            </Row>
                                        </Form.Item>
                                        <Form.Item label="坐标轴宽度">
                                            <Input value={axisLine.lineStyle.width} onChange={changeDetailData.bind(this, 1, axisLine.lineStyle, 'width')} />
                                        </Form.Item>
                                        <Form.Item label="轴线类型">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, axisLine.lineStyle, 'type')} value={axisLine.lineStyle.type}>
                                                <Radio value={'solid'}>实线</Radio>
                                                <Radio value={'dashed'}>虚线</Radio>
                                                <Radio value={'dotted'}>点线</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                            </Panel>
                        </Collapse>
                        <Collapse>
                            <Panel header="轴刻度">
                                <Form.Item label="是否显示">
                                    <Switch checked={axisTick.show}
                                        onChange={changeDetailData.bind(this, 2, axisTick, 'show')} />
                                </Form.Item>
                                <Form.Item label="长度">
                                    <Input value={axisTick.length} onChange={changeDetailData.bind(this, 1, axisTick, 'length')} />
                                </Form.Item>
                                <Collapse>
                                    <Panel header="刻度样式">
                                        <Form.Item label="刻度颜色">
                                            <ColorSelect color={axisTick.lineStyle.color} setColor={setColor.bind(this, axisTick.lineStyle, 'color')} />
                                        </Form.Item>
                                        <Form.Item label="刻度线宽">
                                            <Input value={axisTick.lineStyle.width} onChange={changeDetailData.bind(this, 1, axisTick.lineStyle, 'width')} />
                                        </Form.Item>
                                        <Form.Item label="刻度类型">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, axisTick.lineStyle, 'type')} value={axisTick.lineStyle.type}>
                                                <Radio value={'solid'}>实线</Radio>
                                                <Radio value={'dashed'}>虚线</Radio>
                                                <Radio value={'dotted'}>点线</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                            </Panel>
                        </Collapse>
                        <Collapse>
                            <Panel header="刻度标签">
                                <Form.Item label="是否显示">
                                    <Switch checked={axisLabel.show}
                                        onChange={changeDetailData.bind(this, 2, axisLabel, 'show')} />
                                </Form.Item>
                                <Form.Item label="旋转">
                                    <Slider
                                        min={-90}
                                        max={90}
                                        onChange={changeDetailData.bind(this, 2, axisLabel, 'rotate')}
                                        value={axisLabel.rotate}
                                        step={1}
                                    />
                                </Form.Item>
                                <Form.Item label="标签颜色">
                                    <ColorSelect color={axisLabel.color} setColor={setColor.bind(this, axisLabel, 'color')} />
                                </Form.Item>
                                <Form.Item label="标签字体大小">
                                    <InputNumber value={axisLabel.fontSize} onChange={changeDetailData.bind(this, 2, axisLabel, 'fontSize')} />
                                </Form.Item>
                                <Form.Item label="字体风格">
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, axisLabel, 'fontStyle')} value={axisLabel.fontStyle}>
                                        <Radio value={'normal'}>正常</Radio>
                                        <Radio value={'italic'}>斜体</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="字体粗细">
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, axisLabel, 'fontWeight')} value={axisLabel.fontWeight}>
                                        <Radio value={'normal'}>正常</Radio>
                                        <Radio value={'bold'}>粗体</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="字体">
                                    <Input value={axisLabel.fontFamily} onChange={changeDetailData.bind(this, 1, axisLabel, 'fontFamily')} />
                                </Form.Item>
                                <Form.Item label="水平对齐">
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, axisLabel, 'align')} value={axisLabel.align}>
                                        <Radio value={'left'}>左对齐</Radio>
                                        <Radio value={'center'}>中对齐</Radio>
                                        <Radio value={'right'}>右对齐</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="垂直对齐">
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, axisLabel, 'verticalAlign')} value={axisLabel.verticalAlign}>
                                        <Radio value={'top'}>上对齐</Radio>
                                        <Radio value={'middle'}>中对齐</Radio>
                                        <Radio value={'bottom'}>下对齐</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="与轴线距离">
                                    <InputNumber value={axisLabel.margin} onChange={changeDetailData.bind(this, 2, axisLabel, 'margin')} />
                                </Form.Item>
                                <Form.Item label="文字边框色">
                                    <ColorSelect color={axisLabel.borderColor} setColor={setColor.bind(this, axisLabel, 'borderColor')} />
                                </Form.Item>
                                <Form.Item label="文字框宽度">
                                    <Input value={axisLabel.borderWidth} onChange={changeDetailData.bind(this, 1, axisLabel, 'borderWidth')} />
                                </Form.Item>
                                <Form.Item label="阴影长度">
                                    <Input value={axisLabel.shadowBlur} onChange={changeDetailData.bind(this, 1, axisLabel, 'shadowBlur')} />
                                </Form.Item>
                                <Form.Item label="阴影颜色">
                                    <ColorSelect color={axisLabel.shadowColor} setColor={setColor.bind(this, axisLabel, 'shadowColor')} />
                                </Form.Item>
                                <Form.Item label="阴影X偏移">
                                    <Input value={axisLabel.shadowOffsetX} onChange={changeDetailData.bind(this, 1, axisLabel, 'shadowOffsetX')} />
                                </Form.Item>
                                <Form.Item label="阴影Y偏移">
                                    <Input value={axisLabel.shadowOffsetY} onChange={changeDetailData.bind(this, 1, axisLabel, 'shadowOffsetY')} />
                                </Form.Item>
                            </Panel>
                        </Collapse>
                        <Collapse>
                            <Panel header="分隔线">
                                <Form.Item label="是否显示">
                                    <Switch checked={splitLine.show}
                                        onChange={changeDetailData.bind(this, 2, splitLine, 'show')} />
                                </Form.Item>
                                <Collapse>
                                    <Panel header="线样式">
                                        <Form.Item label="线宽">
                                            <InputNumber value={splitLine.lineStyle.width} onChange={changeDetailData.bind(this, 2, splitLine.lineStyle, 'width')} />
                                        </Form.Item>
                                        <Form.Item label="线颜色">
                                            <ColorSelect color={splitLine.lineStyle.color} setColor={setColor.bind(this, splitLine.lineStyle, 'color')} />
                                        </Form.Item>
                                        <Form.Item label="刻度类型">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, splitLine.lineStyle, 'type')} value={splitLine.lineStyle.type}>
                                                <Radio value={'solid'}>实线</Radio>
                                                <Radio value={'dashed'}>虚线</Radio>
                                                <Radio value={'dotted'}>点线</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="阴影长度">
                                            <Input value={splitLine.lineStyle.shadowBlur} onChange={changeDetailData.bind(this, 1, splitLine.lineStyle, 'shadowBlur')} />
                                        </Form.Item>
                                        <Form.Item label="阴影颜色">
                                            <ColorSelect color={splitLine.lineStyle.shadowColor} setColor={setColor.bind(this, splitLine.lineStyle, 'shadowColor')} />
                                        </Form.Item>
                                        <Form.Item label="阴影X偏移">
                                            <Input value={splitLine.lineStyle.shadowOffsetX} onChange={changeDetailData.bind(this, 1, splitLine.lineStyle, 'shadowOffsetX')} />
                                        </Form.Item>
                                        <Form.Item label="阴影Y偏移">
                                            <Input value={splitLine.lineStyle.shadowOffsetY} onChange={changeDetailData.bind(this, 1, splitLine.lineStyle, 'shadowOffsetY')} />
                                        </Form.Item>
                                        <Form.Item label="透明度">
                                            <Input value={splitLine.lineStyle.opacity} onChange={changeDetailData.bind(this, 1, splitLine.lineStyle, 'opacity')} />
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                            </Panel>
                        </Collapse>
                        <Collapse>
                            <Panel header="分隔区域">
                                <Form.Item label="是否显示">
                                    <Switch checked={splitArea.show}
                                        onChange={changeDetailData.bind(this, 2, splitArea, 'show')} />
                                </Form.Item>
                                <Collapse>
                                    <Panel header="区域样式">
                                        <Form.Item label={
                                            <span>
                                                <Tooltip title="点击添加">
                                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, areaStyle.color, 1)} />
                                                </Tooltip>
                                    颜色
                                </span>
                                        }>
                                            <Row>
                                                {areaStyle.color.map((thisColor, index) =>
                                                    <Col key={index}>
                                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={setColor.bind(this, areaStyle.color, index)} />
                                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={deleteListItem.bind(this, areaStyle.color, index)} />
                                                    </Col>
                                                )}
                                            </Row>
                                        </Form.Item>
                                        <Form.Item label="阴影长度">
                                            <Input value={areaStyle.shadowBlur} onChange={changeDetailData.bind(this, 1, areaStyle, 'shadowBlur')} />
                                        </Form.Item>
                                        <Form.Item label="阴影颜色">
                                            <ColorSelect color={areaStyle.shadowColor} setColor={setColor.bind(this, areaStyle, 'shadowColor')} />
                                        </Form.Item>
                                        <Form.Item label="阴影X偏移">
                                            <Input value={areaStyle.shadowOffsetX} onChange={changeDetailData.bind(this, 1, areaStyle, 'shadowOffsetX')} />
                                        </Form.Item>
                                        <Form.Item label="阴影Y偏移">
                                            <Input value={areaStyle.shadowOffsetY} onChange={changeDetailData.bind(this, 1, areaStyle, 'shadowOffsetY')} />
                                        </Form.Item>
                                        <Form.Item label="透明度">
                                            <Input value={areaStyle.opacity} onChange={changeDetailData.bind(this, 1, areaStyle, 'opacity')} />
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                            </Panel>
                        </Collapse>
                    </Panel>
                </Collapse>
                <Collapse>
                    <Panel header="提示框" key="9">
                        {this.getTooltipEdit(style)}
                    </Panel>
                </Collapse>
                <Collapse>
                    <Panel header="图表样式" key="2">
                        {series.map((item, index) =>
                            <Form {...formItemLayout24} key={index}>
                                <Form.Item label="背景颜色">
                                    <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                                </Form.Item>
                                <Form.Item label="图标样式">
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, item, 'symbol')} value={item.symbol}>
                                        <Radio value={'circle'}>圆形</Radio>
                                        <Radio value={'rect'}>矩形</Radio>
                                        <Radio value={'roundRect'}>圆矩形</Radio>
                                        <Radio value={'triangle'}>三角形</Radio>
                                        <Radio value={'diamond'}>菱形</Radio>
                                        <Radio value={'pin'}>大头针</Radio>
                                        <Radio value={'arrow'}>箭头</Radio>
                                        <Radio value={'none'}>无</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="图标大小">
                                    <InputNumber value={item.symbolSize} onChange={changeDetailData.bind(this, 2, item, 'symbolSize')} />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Tooltip title="坐标轴刻度最小值。">
                                            最小值*
                                        </Tooltip>
                                    }
                                >
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, item, 'minType')} value={item.minType}>
                                        <Radio value={0}>
                                            不设置
                                        </Radio>
                                        <Radio value={1}>
                                            固定值(占比)<InputNumber value={item.minNum} onChange={changeDetailData.bind(this, 2, item, 'minNum')} />
                                        </Radio>
                                        <Radio value={2}>
                                            数据最小值(占比)减<InputNumber value={item.minSubNum} style={{width:'60px'}} onChange={changeDetailData.bind(this, 2, item, 'minSubNum')} />
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Collapse>
                                    <Panel header="图形文本标签">
                                        <Form.Item label="是否显示">
                                            <Switch checked={item.label.show}
                                                onChange={changeDetailData.bind(this, 2, item.label, 'show')} />
                                        </Form.Item>
                                        <Form.Item label="水平位置">
                                            <Input value={item.label.positionX} onChange={changeDetailData.bind(this, 1, item.label, 'positionX')} />
                                        </Form.Item>
                                        <Form.Item label="垂直位置">
                                            <Input value={item.label.positionY} onChange={changeDetailData.bind(this, 1, item.label, 'positionY')} />
                                        </Form.Item>
                                        <Form.Item label="旋转">
                                            <Slider
                                                min={-90}
                                                max={90}
                                                onChange={changeDetailData.bind(this, 2, item.label, 'rotate')}
                                                value={item.label.rotate}
                                                step={1}
                                            />
                                        </Form.Item>
                                        <Form.Item label="字体颜色">
                                            <ColorSelect color={item.label.color} setColor={setColor.bind(this, item.label, 'color')} />
                                        </Form.Item>
                                        <Form.Item label="文字大小">
                                            <Input value={item.label.fontSize} onChange={changeDetailData.bind(this, 1, item.label, 'fontSize')} />
                                        </Form.Item>
                                        <Form.Item label="字体风格">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, item.label, 'fontStyle')} value={item.label.fontStyle}>
                                                <Radio value={'normal'}>正常</Radio>
                                                <Radio value={'italic'}>斜体</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="字体粗细">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, item.label, 'fontWeight')} value={item.label.fontWeight}>
                                                <Radio value={'normal'}>正常</Radio>
                                                <Radio value={'bold'}>粗体</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="字体">
                                            <Input value={item.label.fontFamily} onChange={changeDetailData.bind(this, 1, item.label, 'fontFamily')} />
                                        </Form.Item>
                                        <Form.Item label="水平对齐">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, item.label, 'align')} value={item.label.align}>
                                                <Radio value={'left'}>左对齐</Radio>
                                                <Radio value={'center'}>中对齐</Radio>
                                                <Radio value={'right'}>右对齐</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="垂直对齐">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, item.label, 'verticalAlign')} value={item.label.verticalAlign}>
                                                <Radio value={'top'}>上对齐</Radio>
                                                <Radio value={'middle'}>中对齐</Radio>
                                                <Radio value={'bottom'}>下对齐</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="文字边框色">
                                            <ColorSelect color={item.label.borderColor} setColor={setColor.bind(this, item.label, 'borderColor')} />
                                        </Form.Item>
                                        <Form.Item label="文字框宽度">
                                            <Input value={item.label.borderWidth} onChange={changeDetailData.bind(this, 1, item.label, 'borderWidth')} />
                                        </Form.Item>
                                        <Form.Item label="阴影长度">
                                            <Input value={item.label.shadowBlur} onChange={changeDetailData.bind(this, 1, item.label, 'shadowBlur')} />
                                        </Form.Item>
                                        <Form.Item label="阴影颜色">
                                            <ColorSelect color={item.label.shadowColor} setColor={setColor.bind(this, item.label, 'shadowColor')} />
                                        </Form.Item>
                                        <Form.Item label="阴影X偏移">
                                            <Input value={item.label.shadowOffsetX} onChange={changeDetailData.bind(this, 1, item.label, 'shadowOffsetX')} />
                                        </Form.Item>
                                        <Form.Item label="阴影Y偏移">
                                            <Input value={item.label.shadowOffsetY} onChange={changeDetailData.bind(this, 1, item.label, 'shadowOffsetY')} />
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                                <Collapse>
                                    <Panel header='图标样式' key='4'>
                                        <Form.Item label={
                                            <span>
                                                <Tooltip title="点击添加">
                                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.itemStyle.color, 1)} />
                                                </Tooltip>
                                    图标颜色
                                </span>
                                        }>
                                            <Row>
                                                {item.itemStyle.color.map((thisColor, index) =>
                                                    <Col key={index}>
                                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={setColor.bind(this, item.itemStyle.color, index)} />
                                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={deleteListItem.bind(this, item.itemStyle.color, index)} />
                                                    </Col>
                                                )}
                                            </Row>
                                        </Form.Item>
                                        {/* <Form.Item label="图标颜色">
                                            <ColorSelect color={item.itemStyle.color} setColor={setColor.bind(this, item.itemStyle, 'color')} />
                                        </Form.Item> */}
                                        <Form.Item label="描边颜色">
                                            <ColorSelect color={item.itemStyle.borderColor} setColor={setColor.bind(this, item.itemStyle, 'borderColor')} />
                                        </Form.Item>
                                        <Form.Item label="描边宽度">
                                            <InputNumber value={item.itemStyle.borderWidth} onChange={changeDetailData.bind(this, 2, item.itemStyle, 'borderWidth')} />
                                        </Form.Item>
                                        <Form.Item label="描边类型">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, item.itemStyle, 'borderType')} value={item.itemStyle.borderType}>
                                                <Radio value={'solid'}>实线</Radio>
                                                <Radio value={'dashed'}>虚线</Radio>
                                                <Radio value={'dotted'}>点线</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="阴影颜色">
                                            <ColorSelect color={item.itemStyle.shadowColor} setColor={setColor.bind(this, item.itemStyle, 'shadowColor')} />
                                        </Form.Item>
                                        <Form.Item label="阴影大小">
                                            <Input value={item.itemStyle.shadowBlur} onChange={changeDetailData.bind(this, 1, item.itemStyle, 'shadowBlur')} />
                                        </Form.Item>
                                        <Form.Item label="阴影X偏移">
                                            <Input value={item.itemStyle.shadowOffsetX} onChange={changeDetailData.bind(this, 1, item.itemStyle, 'shadowOffsetX')} />
                                        </Form.Item>
                                        <Form.Item label="阴影Y偏移">
                                            <Input value={item.itemStyle.shadowOffsetY} onChange={changeDetailData.bind(this, 1, item.itemStyle, 'shadowOffsetY')} />
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                                <Collapse>
                                    <Panel header="边框" key="3">
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
                                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={setColor.bind(this, item.lineStyle.color, index)} />
                                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={deleteListItem.bind(this, item.lineStyle.color, index)} />
                                                    </Col>
                                                )}
                                            </Row>

                                        </Form.Item>
                                        <Form.Item label="大小">
                                            <InputNumber value={item.lineStyle.width} onChange={changeDetailData.bind(this, 2, item.lineStyle, 'width')} />
                                        </Form.Item>
                                        <Form.Item label="描边类型">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, item.lineStyle, 'type')} value={item.lineStyle.type}>
                                                <Radio value={'solid'}>实线</Radio>
                                                <Radio value={'dashed'}>虚线</Radio>
                                                <Radio value={'dotted'}>点线</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item label="阴影颜色">
                                            <ColorSelect color={item.lineStyle.shadowColor} setColor={setColor.bind(this, item.lineStyle, 'shadowColor')} />
                                        </Form.Item>
                                        <Form.Item label="阴影大小">
                                            <Input value={item.lineStyle.shadowBlur} onChange={changeDetailData.bind(this, 1, item.lineStyle, 'shadowBlur')} />
                                        </Form.Item>
                                        <Form.Item label="阴影X偏移">
                                            <Input value={item.lineStyle.shadowOffsetX} onChange={changeDetailData.bind(this, 1, item.lineStyle, 'shadowOffsetX')} />
                                        </Form.Item>
                                        <Form.Item label="阴影Y偏移">
                                            <Input value={item.lineStyle.shadowOffsetY} onChange={changeDetailData.bind(this, 1, item.lineStyle, 'shadowOffsetY')} />
                                        </Form.Item>
                                        <Form.Item label="透明度">
                                            <Input value={item.lineStyle.opacity} onChange={changeDetailData.bind(this, 1, item.lineStyle, 'opacity')} />
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                                <Collapse>
                                    <Panel header="区域样式">
                                        <Form.Item label="颜色类型">
                                            <Radio.Group onChange={changeDetailData.bind(this, 1, item, 'colorType')} value={item.colorType}>
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
                                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={setColor.bind(this, item.color, index)} />
                                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={deleteListItem.bind(this, item.color, index)} />
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
                                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={setColor.bind(this, thisColor, 'start')} />
                                                        <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={setColor.bind(this, thisColor, 'end')} />
                                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={deleteListItem.bind(this, item.linearColor, index)} />
                                                    </Col>
                                                )}
                                            </Row>
                                        </Form.Item>
                                        <Form.Item label="阴影颜色">
                                            <ColorSelect color={item.areaStyle.shadowColor} setColor={setColor.bind(this, item.areaStyle, 'shadowColor')} />
                                        </Form.Item>
                                        <Form.Item label="阴影大小">
                                            <Input value={item.areaStyle.shadowBlur} onChange={changeDetailData.bind(this, 1, item.areaStyle, 'shadowBlur')} />
                                        </Form.Item>
                                        <Form.Item label="阴影X偏移">
                                            <Input value={item.areaStyle.shadowOffsetX} onChange={changeDetailData.bind(this, 1, item.areaStyle, 'shadowOffsetX')} />
                                        </Form.Item>
                                        <Form.Item label="阴影Y偏移">
                                            <Input value={item.areaStyle.shadowOffsetY} onChange={changeDetailData.bind(this, 1, item.areaStyle, 'shadowOffsetY')} />
                                        </Form.Item>
                                        <Form.Item label="透明度">
                                            <Input value={item.areaStyle.opacity} onChange={changeDetailData.bind(this, 1, item.areaStyle, 'opacity')} />
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                            </Form>
                        )}
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
