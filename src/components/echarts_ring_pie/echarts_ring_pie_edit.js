import React from 'react';
import { Form, Input, Collapse, Radio, Tooltip, Icon, Row, Col, Slider, Tag, Button, Switch, InputNumber } from 'antd';
import ColorSelect from "../../common/colorSelect";
// import InputNumber from "../../common/inputNumberEx";

const formItemLayout24 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const { Panel } = Collapse;
const { TextArea } = Input;

export default class EchartsRingPieList extends React.Component {
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

    //删除列表内某项
    deleteColumn(list, index) {
        this.props.saveNowDataToHistory();
        list.splice(index, 1);
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    // 添加列
    addColumn(list) {
        this.props.saveNowDataToHistory();
        list.push({ type: 'pie', color: ['rgb(169,58,55)'], labelLine: { lineStyle: {} }, label: {}, itemStyle: {}, linearColor: [] });
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    render() {
        const { style } = this.props.data;
        const { legend } = style;
        return (
            <Collapse >
                <Panel header="图例" key="7">
                    <Form {...formItemLayout24}>
                        <Form.Item label="是否显示">
                            <Switch checked={legend.show} onChange={this.changeDetailData.bind(this, 2, legend, 'show')} />
                        </Form.Item>
                        <Form.Item label="图例类型">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'styleType')} value={legend.styleType}>
                                <Radio value={1}>echarts</Radio>
                                <Radio value={2}>自定义</Radio>
                            </Radio.Group>
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
                        <Form.Item label="布局朝向" style={{ display: legend.styleType === 2 ? 'block' : 'none' }}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'flexDirection')} value={legend.flexDirection}>
                                <Radio value={'row'}>横向</Radio>
                                <Radio value={'column'}>竖向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="布局朝向" style={{ display: legend.styleType === 1 ? 'block' : 'none' }}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'orient')} value={legend.orient}>
                                <Radio value={'horizontal'}>横向</Radio>
                                <Radio value={'vertical'}>竖向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="水平对齐" style={{ display: legend.styleType === 2 ? 'block' : 'none' }}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'align')} value={legend.align}>
                                <Radio value={'row'}>左对齐</Radio>
                                <Radio value={'row-reverse'}>右对齐</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="垂直对齐" style={{ display: legend.styleType === 2 ? 'block' : 'none' }}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'verticalAlign')} value={legend.verticalAlign}>
                                <Radio value={'flex-start'}>上对齐</Radio>
                                <Radio value={'center'}>中对齐</Radio>
                                <Radio value={'flex-end'}>下对齐</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="文本对齐" style={{ display: legend.styleType === 1 ? 'block' : 'none' }}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'align')} value={legend.align}>
                                <Radio value={'auto'}>自动</Radio>
                                <Radio value={'left'}>左对齐</Radio>
                                <Radio value={'right'}>右对齐</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="内边距">
                            <InputNumber value={legend.padding} onChange={this.changeDetailData.bind(this, 2, legend, 'padding')} />
                        </Form.Item>
                        <Form.Item style={{ display: legend.styleType === 1 ? 'block' : 'none' }}
                            label={
                                <Tooltip title="类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'。可以通过 'image://url' 设置为图片，其中 URL 为图片的链接，或者 dataURI。可以通过 'path://' 将图标设置为任意的矢量路径。">
                                    图形*
                                </Tooltip>
                            }
                        >
                            <Input value={legend.icon} onChange={this.changeDetailData.bind(this, 1, legend, 'icon')} />
                        </Form.Item>
                        <Form.Item label="图形类型" style={{ display: legend.styleType === 2 ? 'block' : 'none' }}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'icon')} value={legend.icon}>
                                <Radio value={'rect'}>方形</Radio>
                                <Radio value={'circle'}>圆形</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="项间隔" style={{ display: legend.styleType === 1 ? 'block' : 'none' }}>
                            <Input value={legend.itemGap} onChange={this.changeDetailData.bind(this, 1, legend, 'itemGap')} />
                        </Form.Item>
                        <Form.Item label="列数" style={{ display: legend.styleType === 2 ? 'block' : 'none' }}>
                            <InputNumber value={legend.columnNum} min={1}
                                onChange={this.changeDetailData.bind(this, 2, legend, 'columnNum')} />
                        </Form.Item>
                        <Form.Item label="列间距" style={{ display: legend.styleType === 2 ? 'block' : 'none' }}>
                            <InputNumber value={legend.columnGap} min={0} onChange={this.changeDetailData.bind(this, 2, legend, 'columnGap')} />
                        </Form.Item>
                        <Form.Item label="图形宽度">
                            <Input value={legend.itemWidth} onChange={this.changeDetailData.bind(this, 1, legend, 'itemWidth')} />
                        </Form.Item>
                        <Form.Item label="图形高度">
                            <Input value={legend.itemHeight} onChange={this.changeDetailData.bind(this, 1, legend, 'itemHeight')} />
                        </Form.Item>
                        <Form.Item label="图形上侧距离">
                            <Input value={legend.imgTop} onChange={this.changeDetailData.bind(this, 1, legend, 'imgTop')} />
                        </Form.Item>
                        <Form.Item label="图形字间距" style={{ display: legend.styleType === 2 ? 'block' : 'none' }}>
                            <Input value={legend.distance} onChange={this.changeDetailData.bind(this, 1, legend, 'distance')} />
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={legend.textStyle.color} setColor={this.setColor.bind(this, legend.textStyle, 'color')} />
                        </Form.Item>
                        <Form.Item label="文字大小">
                            <Input value={legend.textStyle.fontSize} onChange={this.changeDetailData.bind(this, 1, legend.textStyle, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="文字行高" style={{ display: legend.styleType === 1 ? 'block' : 'none' }}>
                            <Input value={legend.textStyle.lineHeight} onChange={this.changeDetailData.bind(this, 1, legend.textStyle, 'lineHeight')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="刻度标签内容格式器。内容为函数代码。">
                                    格式器*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={legend.formatter}
                                onChange={this.changeDetailData.bind(this, 1, legend, 'formatter')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="自定义富文本样式。内容格式为json字串。">
                                    文本样式*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={legend.rich}
                                onChange={this.changeDetailData.bind(this, 1, legend, 'rich')} />
                        </Form.Item>
                        <Form.Item label="数量显示" style={{ display: legend.styleType === 2 ? 'block' : 'none' }}>
                            <Switch checked={legend.showNum} onChange={this.changeDetailData.bind(this, 2, legend, 'showNum')} />
                        </Form.Item>
                        <Form.Item label="布局朝向" style={{ display: legend.styleType === 2 && legend.showNum ? 'block' : 'none' }}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'numDirection')} value={legend.numDirection}>
                                <Radio value={'row'}>横向</Radio>
                                <Radio value={'column'}>竖向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="数量字宽" style={{ display: legend.styleType === 2 && legend.showNum ? 'block' : 'none' }}>
                            <Input value={legend.numWidth} onChange={this.changeDetailData.bind(this, 1, legend, 'numWidth')} />
                        </Form.Item>
                        <Form.Item label="占比字号" style={{ display: legend.styleType === 2 && legend.showNum ? 'block' : 'none' }}>
                            <Input value={legend.numSize} onChange={this.changeDetailData.bind(this, 1, legend, 'numSize')} />
                        </Form.Item>
                        <Form.Item label="占比字色" style={{ display: legend.styleType === 2 && legend.showNum ? 'block' : 'none' }}>
                            <ColorSelect color={legend.numColor} setColor={this.setColor.bind(this, legend, 'numColor')} />
                        </Form.Item>
                        <Form.Item label="占比显示" style={{ display: legend.styleType === 2 ? 'block' : 'none' }}>
                            <Switch checked={legend.percentage} onChange={this.changeDetailData.bind(this, 2, legend, 'percentage')} />
                        </Form.Item>
                        <Form.Item label="小数位数" style={{ display: legend.styleType === 2 ? 'block' : 'none' }}>
                            <Input value={legend.fixNum} onChange={this.changeDetailData.bind(this, 1, legend, 'fixNum')} />
                        </Form.Item>
                        <Form.Item label="占比字宽" style={{ display: legend.styleType === 2 && legend.percentage ? 'block' : 'none' }}>
                            <Input value={legend.percentageWidth} onChange={this.changeDetailData.bind(this, 1, legend, 'percentageWidth')} />
                        </Form.Item>
                        <Form.Item label="占比字号" style={{ display: legend.styleType === 2 && legend.percentage ? 'block' : 'none' }}>
                            <Input value={legend.percentageSize} onChange={this.changeDetailData.bind(this, 1, legend, 'percentageSize')} />
                        </Form.Item>
                        <Form.Item label="占比字色" style={{ display: legend.styleType === 2 && legend.percentage ? 'block' : 'none' }}>
                            <ColorSelect color={legend.percentageColor} setColor={this.setColor.bind(this, legend, 'percentageColor')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="图表样式" key="6">
                    <Form.Item label="最大值设置" >
                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, style, 'maxType')} value={style.maxType}>
                            <Radio value={1}>默认</Radio>
                            <Radio value={2}>总数</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {this.props.data.style.series.map((item, index) =>
                        <Form {...formItemLayout24} key={index}>
                            <Tag closable={style.series.length > 1} visible={true}
                                onClose={this.deleteColumn.bind(this, style.series, index)}>
                                {'项' + (index + 1)}</Tag>
                            <Form.Item label="排布方向">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'clockwise')} value={item.clockwise}>
                                    <Radio value={true}>顺时针</Radio>
                                    <Radio value={false}>逆时针</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="位置左距离">
                                <Input value={item.centerX} onChange={this.changeDetailData.bind(this, 1, item, 'centerX')} />
                            </Form.Item>
                            <Form.Item label="位置上距离">
                                <Input value={item.centerY} onChange={this.changeDetailData.bind(this, 1, item, 'centerY')} />
                            </Form.Item>
                            <Form.Item label="内半径">
                                <Input value={item.radiusIn} onChange={this.changeDetailData.bind(this, 1, item, 'radiusIn')} />
                            </Form.Item>
                            <Form.Item label="外半径">
                                <Input value={item.radiusOut} onChange={this.changeDetailData.bind(this, 1, item, 'radiusOut')} />
                            </Form.Item>
                            <Form.Item label="起始角度">
                                <Slider
                                    min={0}
                                    max={360}
                                    onChange={this.changeDetailData.bind(this, 2, item, 'startAngle')}
                                    value={item.startAngle}
                                    step={1}
                                />
                            </Form.Item>
                            <Form.Item label="最小角度">
                                <Slider
                                    min={0}
                                    max={360}
                                    onChange={this.changeDetailData.bind(this, 2, item, 'minAngle')}
                                    value={item.minAngle}
                                    step={1}
                                />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="小于这个角度的扇区，不显示标签。">
                                        隐藏角度*
                                    </Tooltip>
                                }
                            >
                                <Slider
                                    min={0}
                                    max={360}
                                    onChange={this.changeDetailData.bind(this, 2, item, 'minShowLabelAngle')}
                                    value={item.minShowLabelAngle}
                                    step={1}
                                />
                            </Form.Item>
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
                            <Form.Item label="阴影颜色" >
                                <ColorSelect color={item.shadowColor} setColor={this.setColor.bind(this, item, 'shadowColor')} />
                            </Form.Item>
                        </Form>
                    )}
                    <Form.Item label="">
                        <Button type="dashed" onClick={this.addColumn.bind(this, style.series)}>
                            <Icon type="plus" /> 添加列
                            </Button>
                    </Form.Item>
                </Panel>
            </Collapse>
        );
    }
}
