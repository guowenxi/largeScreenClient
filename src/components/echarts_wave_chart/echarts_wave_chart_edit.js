import React from 'react';
import { Form, Collapse, Icon, Tooltip, Radio, Input, Switch, InputNumber } from 'antd';

import ColorSelect from "../../common/colorSelect";
// eslint-disable-next-line no-unused-vars
import { changeDetailData } from "../../common/editUtil";

const { Panel } = Collapse;
const { TextArea } = Input;
export default class HightChartsEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeDetailData = changeDetailData;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    // 删除颜色
    deleteColor(item, index) {
        this.props.saveNowDataToHistory();
        item.splice(index, 1);
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }
    // 添加color
    addColor(item, colorType) {
        this.props.saveNowDataToHistory();
        if (colorType === 'monochrome') {
            item.push('#87ceeb');
        } else {
            item.push([{
                offset: 0, color: 'red',
            }, {
                offset: 1, color: 'blue',
            }]);
        }
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }
    //修改颜色
    setColor(item, key, data) {
        this.props.saveNowDataToHistory();
        const rgb = data.rgb;
        item[key] = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ")";
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }
    render() {
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        return (
            <Collapse >
                <Panel header="基础配置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="半径" >
                            <Input value={style.radius} onChange={this.changeDetailData.bind(this, 1, style, 'radius')} />
                        </Form.Item>
                        <Form.Item label="颜色类型">
                            <Radio.Group value={style.colorType} onChange={this.changeDetailData.bind(this, 1, style, 'colorType')}>
                                <Radio.Button value="monochrome">单一色</Radio.Button>
                                <Radio.Button value="gradient">渐变色</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {style.colorType === 'gradient' &&<Form.Item label="渐变方向">
                            <Radio.Group value={style.gradientDirection}  onChange={this.changeDetailData.bind(this, 1, style, 'gradientDirection')}>
                                <Radio.Button value="portrait">纵向</Radio.Button>
                                <Radio.Button value="transverse">横向</Radio.Button>
                            </Radio.Group>
                        </Form.Item>}
                        <Form.Item label={
                            <span>
                                <Tooltip title="点击添加">
                                    颜色*
                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }}
                                        onClick={
                                            this.addColor.bind(this, style.colorType === 'monochrome' ? style.monochromeColors : style.gradientColors, style.colorType)
                                        }
                                    />
                                </Tooltip>
                            </span>
                        }>
                            {
                                style.colorType === 'monochrome' ? style.monochromeColors.map((item, index) => {
                                    return (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <ColorSelect
                                                style={{ marginTop: "5px" }}
                                                color={item}
                                                setColor={this.setColor.bind(this, style.colors, index)}
                                            />
                                            <Icon type="close"
                                                style={{ position: "absolute", top: "12px", marginLeft: "0.5vh", cursor: "pointer", }}
                                                onClick={() => this.deleteColor(style.monochromeColors, index)}
                                            />
                                        </div>
                                    )
                                }) : style.gradientColors.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <div style={{ position: 'relative' }}>
                                                {
                                                    item.map((colorItem, colorIndex) => {
                                                        return (
                                                            <ColorSelect
                                                                style={{ marginTop: "5px" }}
                                                                color={colorItem.color}
                                                                key={colorIndex}
                                                                setColor={this.setColor.bind(this, colorItem, 'color')}
                                                            />
                                                        )
                                                    })
                                                }
                                                <Icon type="close"
                                                    style={{ position: "absolute", top: "12px", marginLeft: "0.5vh", cursor: "pointer", }}
                                                    onClick={() => this.deleteColor(style.gradientColors, index)}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="值可以是circle，rect，roundRect，triangle，diamond，pin，arrow，也可以是矢量路径，如'path://'">形状*</Tooltip>
                            }
                        >
                            <Input value={style.shape} onChange={this.changeDetailData.bind(this, 1, style, 'shape')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="动画设置" key="2">
                    <Form {...formItemLayout24} >
                        <Form.Item label="是否开启">
                            <Switch checked={style.waveAnimation} onChange={this.changeDetailData.bind(this, 2, style, 'waveAnimation')} />
                        </Form.Item>
                        <Form.Item label="运动方向">
                            <Radio.Group value={style.direction} onChange={this.changeDetailData.bind(this, 1, style, 'direction')}>
                                <Radio value="left">向左</Radio>
                                <Radio value="right">向右</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label={<Tooltip title="单位为ms">动画时长*</Tooltip>}>
                            <InputNumber value={style.period} onChange={this.changeDetailData.bind(this, 2, style, 'period')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="轮廓设置" key="3">
                    <Form {...formItemLayout24} >
                        <Form.Item label="是否显示">
                            <Switch checked={style.showOutLine} onChange={this.changeDetailData.bind(this, 2, style, 'showOutLine')} />
                        </Form.Item>
                        <Form.Item label="轮廓宽度">
                            <InputNumber value={style.borderWidth} onChange={this.changeDetailData.bind(this, 2, style, 'borderWidth')} />
                        </Form.Item>
                        <Form.Item label="轮廓颜色">
                            <ColorSelect color={style.borderColor} setColor={this.setColor.bind(this, style, 'borderColor')} />
                        </Form.Item>
                        <Form.Item label="与内容的距离">
                            <InputNumber value={style.borderDistance} onChange={this.changeDetailData.bind(this, 2, style, 'borderDistance')} />
                        </Form.Item>
                        <Form.Item label="阴影模糊距离">
                            <InputNumber value={style.shadowBlur} onChange={this.changeDetailData.bind(this, 2, style, 'shadowBlur')} />
                        </Form.Item>
                        <Form.Item label="阴影颜色">
                            <ColorSelect color={style.shadowColor} setColor={this.setColor.bind(this, style, 'shadowColor')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="背景设置" key="4">
                    <Form {...formItemLayout24} >
                        <Form.Item label="背景颜色">
                            <ColorSelect color={style.backgroundColor} setColor={this.setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="标签设置" key="5">
                    <Form {...formItemLayout24} >
                        <Form.Item label="是否显示">
                            <Switch checked={style.showLabel} onChange={this.changeDetailData.bind(this, 2, style, 'showLabel')} />
                        </Form.Item>
                        <Form.Item label="文字大小">
                            <InputNumber value={style.labelFontSize} onChange={this.changeDetailData.bind(this, 2, style, 'labelFontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={style.labelColor} setColor={this.setColor.bind(this, style, 'labelColor')} />
                        </Form.Item>
                        <Form.Item label="左边距">
                            <Input value={style.labelPosition[0]} onChange={this.changeDetailData.bind(this, 1, style.labelPosition, 0)} />
                        </Form.Item>
                        <Form.Item label="上边距">
                            <Input value={style.labelPosition[1]} onChange={this.changeDetailData.bind(this, 1, style.labelPosition, 1)} />
                        </Form.Item>
                        <Form.Item label="格式化">
                            <TextArea rows={5} value={style.formatter} onChange={this.changeDetailData.bind(this, 1, style, 'formatter')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="自定义富文本样式。内容格式为json字串。">
                                    文本样式*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={style.rich}
                                      onChange={this.changeDetailData.bind(this, 1, style, 'rich')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="其他设置" key="6">
                    <Form {...formItemLayout24} >
                        <Form.Item label="显示提示框">
                            <Switch checked={style.showTooltip} onChange={this.changeDetailData.bind(this, 2, style, 'showTooltip')} />
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
