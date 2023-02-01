/* eslint-disable no-unused-vars */
import React from 'react';
import { Form, Collapse, Icon, Tooltip, Radio, Input, Switch, InputNumber, Tag, Button, Select, Slider } from 'antd';

import ColorSelect from "../../common/colorSelect";
// eslint-disable-next-line no-unused-vars
import { changeDetailData } from "../../common/editUtil";

const { Panel } = Collapse;
const { TextArea } = Input;
export default class EchartsDiagramOneEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeDetailData = changeDetailData;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    //修改颜色
    setColor(item, key, data) {
        this.props.saveNowDataToHistory();
        const rgb = data.rgb;
        item[key] = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ")";
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }
    handleClickAdd(type) {
        this.props.saveNowDataToHistory();
        const { nodeList, lineList } = this.props.data.style;
        if (type === 'node') {
            nodeList.push({ x: 0, y: 0 });
        } else if (type === 'line') {
            lineList.push({ lineStyle: { color: '#fff', type: 'solid', width: 1 } });
        }
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }
    handleClickDelete(type, index) {
        this.props.saveNowDataToHistory();
        const { nodeList, lineList } = this.props.data.style;
        if (type === 'node') {
            nodeList.splice(index, 1);
        } else if (type === 'line') {
            lineList.splice(index, 1);
        }
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }
    render() {
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        const { nodeList, lineList, layout } = style;
        return (
            <Collapse >
                <Panel header="基本配置" key={0}>
                    <Form {...formItemLayout24}>
                        <Form.Item label="布局">
                            <Select value={layout} onChange={this.changeDetailData.bind(this, 2, style, 'layout')}>
                                <Select.Option value="none">不采用布局</Select.Option>
                                <Select.Option value="circular">环形布局</Select.Option>
                                <Select.Option value="force">力引导布局</Select.Option>
                            </Select>
                        </Form.Item>
                        <Collapse>
                            <Panel header="公共线样式">
                                <Form.Item label={<Tooltip title="一般常用的设置：circle、arrow、none">头部形状*</Tooltip>}>
                                    <Input value={style.headerType} onChange={this.changeDetailData.bind(this, 1, style, 'headerType')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title="一般常用的设置：circle、arrow、none">尾部形状*</Tooltip>}>
                                    <Input value={style.footerType} onChange={this.changeDetailData.bind(this, 1, style, 'footerType')} />
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Form>
                </Panel>
                <Panel header="节点设置" key={1}>
                    <Form {...formItemLayout24} >
                        {
                            nodeList.length > 0 &&
                            nodeList.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <Tag style={{ margin: '0.5em 0' }}>
                                            节点{index + 1}
                                            <Icon type="close" onClick={this.handleClickDelete.bind(this, 'node', index)} />
                                        </Tag>
                                        <Form.Item label="x">
                                            <InputNumber value={item.x} onChange={this.changeDetailData.bind(this, 2, item, 'x')} />
                                        </Form.Item>
                                        <Form.Item label="y">
                                            <InputNumber value={item.y} onChange={this.changeDetailData.bind(this, 2, item, 'y')} />
                                        </Form.Item>
                                        <Form.Item label="外观类型">
                                            <Radio.Group value={item.appearance} onChange={this.changeDetailData.bind(this, 1, item, 'appearance')}>
                                                <Radio value="shape">形状</Radio>
                                                <Radio value="image">图片</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {
                                            item.appearance === 'shape' &&
                                            <Form.Item label={
                                                <Tooltip
                                                    title="'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'"
                                                >形状*</Tooltip>
                                            }
                                            >
                                                <Input value={item.shape} onChange={this.changeDetailData.bind(this, 1, item, 'shape')} />
                                            </Form.Item>
                                        }
                                        {
                                            item.appearance === 'image' &&
                                            <>
                                                <Form.Item label="数据来源">
                                                    <Radio.Group
                                                        value={item.imageDataSource}
                                                        onChange={this.changeDetailData.bind(this, 1, item, 'imageDataSource')}
                                                    >
                                                        <Radio value="custom">自定义</Radio>
                                                        <Radio value="interfaceData">接口数据</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                                {
                                                    item.imageDataSource === 'custom' &&
                                                    <Form.Item label={<Tooltip title="矢量路径'path://'，以及图片'image://url'">图片*</Tooltip>} >
                                                        <Input value={item.image} onChange={this.changeDetailData.bind(this, 1, item, 'image')} />
                                                    </Form.Item>
                                                }
                                            </>
                                        }
                                        <Form.Item label="大小">
                                            <Input value={item.symbolSize} onChange={this.changeDetailData.bind(this, 1, item, 'symbolSize')} />
                                        </Form.Item>
                                        <Form.Item label="背景颜色">
                                            <ColorSelect color={item.backgroundColor} setColor={this.setColor.bind(this, item, 'backgroundColor')} />
                                        </Form.Item>
                                        <Collapse>
                                            <Panel header="边框样式">
                                                <Form.Item label="边框宽度">
                                                    <InputNumber
                                                        value={item.borderWidth}
                                                        onChange={this.changeDetailData.bind(this, 2, item, 'borderWidth')}
                                                    />
                                                </Form.Item>
                                                <Form.Item label="边框颜色">
                                                    <ColorSelect color={item.borderColor} setColor={this.setColor.bind(this, item, 'borderColor')} />
                                                </Form.Item>
                                                <Form.Item label="边框类型">
                                                    <Select value={item.borderType} onChange={this.changeDetailData.bind(this, 2, item, 'borderType')}>
                                                        <Select.Option value="solid">实线</Select.Option>
                                                        <Select.Option value="dashed">虚线</Select.Option>
                                                        <Select.Option value="dotted">点线</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Panel>
                                            <Panel header="阴影样式">
                                                <Form.Item label="模糊距离">
                                                    <InputNumber
                                                        value={item.shadowBlur}
                                                        onChange={this.changeDetailData.bind(this, 2, item, 'shadowBlur')}
                                                    />
                                                </Form.Item>
                                                <Form.Item label="阴影颜色">
                                                    <ColorSelect color={item.shadowColor} setColor={this.setColor.bind(this, item, 'shadowColor')} />
                                                </Form.Item>
                                                <Form.Item label="水平偏移">
                                                    <InputNumber
                                                        value={item.shadowOffsetX}
                                                        onChange={this.changeDetailData.bind(this, 2, item, 'shadowOffsetX')}
                                                    />
                                                </Form.Item>
                                                <Form.Item label="垂直偏移">
                                                    <InputNumber
                                                        value={item.shadowOffsetY}
                                                        onChange={this.changeDetailData.bind(this, 2, item, 'shadowOffsetY')}
                                                    />
                                                </Form.Item>
                                            </Panel>
                                            <Panel header="标签样式">
                                                <Form.Item label="是否显示">
                                                    <Switch checked={item.showLabel} onChange={this.changeDetailData.bind(this, 2, item, 'showLabel')} />
                                                </Form.Item>
                                                <Form.Item label="颜色">
                                                    <ColorSelect color={item.labelColor} setColor={this.setColor.bind(this, item, 'labelColor')} />
                                                </Form.Item>
                                                <Form.Item label="字体大小">
                                                    <Input
                                                        value={item.labelFontSize}
                                                        onChange={this.changeDetailData.bind(this, 1, item, 'labelFontSize')}
                                                    />
                                                </Form.Item>
                                                <Form.Item label="左">
                                                    <Input value={item.labelLeft} onChange={this.changeDetailData.bind(this, 1, item, 'labelLeft')} />
                                                </Form.Item>
                                                <Form.Item label="上">
                                                    <Input value={item.labelTop} onChange={this.changeDetailData.bind(this, 1, item, 'labelTop')} />
                                                </Form.Item>
                                                <Form.Item label="旋转角度">
                                                    <Slider
                                                        value={item.labelRotate}
                                                        onChange={this.changeDetailData.bind(this, 2, item, 'labelRotate')}
                                                        max={90}
                                                        min={-90}
                                                    />
                                                </Form.Item>
                                            </Panel>
                                        </Collapse>
                                    </React.Fragment>
                                )
                            })
                        }
                        <Button type="dashed" onClick={this.handleClickAdd.bind(this, 'node')} style={{ marginTop: '0.5em' }}>添加节点</Button>
                    </Form>
                </Panel>
                <Panel header="连接线设置" key={2}>
                    <Form {...formItemLayout24}>
                        {
                            lineList.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <Tag style={{ margin: '0.5em 0' }}>
                                            线{index + 1}
                                            <Icon type="close" onClick={this.handleClickDelete.bind(this, 'line', index)} />
                                        </Tag>
                                        <Collapse>
                                            <Panel header="线样式">
                                                <Form.Item label="颜色">
                                                    <ColorSelect color={item.color} setColor={this.setColor.bind(this, item, 'color')} />
                                                </Form.Item>
                                                <Form.Item label="线宽">
                                                    <InputNumber
                                                        value={item.width}
                                                        onChange={this.changeDetailData.bind(this, 2, item, 'width')}
                                                    />
                                                </Form.Item>
                                                <Form.Item label="类型">
                                                    <Select value={item.type} onChange={this.changeDetailData.bind(this, 2, item, 'type')}>
                                                        <Select.Option value="solid">实线</Select.Option>
                                                        <Select.Option value="dashed">虚线</Select.Option>
                                                        <Select.Option value="dotted">点线</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item label={<Tooltip title="线的弯曲程度，支持从 0 到 1 的值，值越大曲度越大">曲度*</Tooltip>}>
                                                    <InputNumber
                                                        value={style.curveness}
                                                        onChange={this.changeDetailData.bind(this, 2, item, 'curveness')}
                                                    />
                                                </Form.Item>
                                            </Panel>
                                            <Panel header="标签样式">
                                                <Form.Item label="是否显示">
                                                    <Switch checked={item.showLabel} onChange={this.changeDetailData.bind(this, 2, item, 'showLabel')} />
                                                </Form.Item>
                                                <Form.Item label="颜色">
                                                    <ColorSelect color={item.labelColor} setColor={this.setColor.bind(this, item, 'labelColor')} />
                                                </Form.Item>
                                                <Form.Item label="字体大小">
                                                    <Input
                                                        value={item.labelFontSize}
                                                        onChange={this.changeDetailData.bind(this, 1, item, 'labelFontSize')}
                                                    />
                                                </Form.Item>
                                                <Form.Item label="位置">
                                                    <Input
                                                        value={item.labelPosition}
                                                        onChange={this.changeDetailData.bind(this, 1, item, 'labelPosition')}
                                                    />
                                                </Form.Item>
                                                <Form.Item label="旋转角度">
                                                    <Slider
                                                        value={item.labelRotate}
                                                        onChange={this.changeDetailData.bind(this, 2, item, 'labelRotate')}
                                                        max={90}
                                                        min={-90}
                                                    />
                                                </Form.Item>
                                                <Form.Item label="格式化">
                                                    <TextArea
                                                        value={item.labelFormatter}
                                                        onChange={this.changeDetailData.bind(this, 1, item, 'labelFormatter')}
                                                    />
                                                </Form.Item>
                                            </Panel>
                                        </Collapse>
                                    </React.Fragment>
                                )
                            })
                        }
                        <Button type="dashed" onClick={this.handleClickAdd.bind(this, 'line')} style={{ marginTop: '0.5em' }}>添加线</Button>
                    </Form>
                </Panel>
                <Panel header="提示框设置" key={3}>
                    <Form {...formItemLayout24}>
                        <Form.Item label="是否显示">
                            <Switch checked={style.showTooltip} onChange={this.changeDetailData.bind(this, 2, style, 'showTooltip')} />
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
