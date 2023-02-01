import React from 'react';
import { Form, Input, Collapse, Tooltip, InputNumber, Radio, Tag, Icon, Slider, Button, } from 'antd';


import ColorSelect from "../../common/colorSelect";
import {
    changeDetailData,
    setColor,
} from "../../common/editUtil";



const { Panel } = Collapse;
export default class LineTypeOneEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeDetailData = changeDetailData.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    addColor(item) {
        this.props.saveNowDataToHistory();
        item.push({ color: 'rgb(4, 152, 220)', stop: '', });
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }
    deleteColor(item, index) {
        this.props.saveNowDataToHistory();
        if (item.length <= 2) {
            return;
        }
        item.splice(index, 1);
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }
    handleChangeStyle = (type, item, key, e) => {
        this.changeDetailData(type, item, key, e);
    };
    render() {
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        const { leftLabel, rightLabel, rowGap, rowNum, bgColorType, max, backgroundHeight, time } = style;
        const backgroundColor = style[`backgroundColor${bgColorType}`];
        return (
            <Collapse >
                <Panel header="基础样式设置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="行数">
                            <InputNumber min={0} value={rowNum} onChange={value => this.handleChangeStyle(2, style, 'rowNum', value)} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title="行与行之间的间隔，单位为%，相对于整个组件的高度">行间距*</Tooltip>}>
                            <InputNumber min={0} value={rowGap} onChange={value => this.handleChangeStyle(2, style, 'rowGap', value)} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title="中间色块的宽度占比=对应的num/最大值，不设置时最大值默认是最大的num">最大值*</Tooltip>}>
                            <InputNumber value={max} onChange={value => this.handleChangeStyle(2, style, 'max', value)} />
                        </Form.Item>
                    </Form>
                    <Collapse>
                        <Panel header="左侧标签块的样式">
                            <Form {...formItemLayout24} >
                                <Form.Item label="字号">
                                    <Input value={leftLabel.fontSize} onChange={e => this.handleChangeStyle(1, leftLabel, 'fontSize', e)} />
                                </Form.Item>
                                <Form.Item label="字色" >
                                    <ColorSelect color={leftLabel.fontColor} setColor={setColor.bind(this, leftLabel, 'fontColor')} />
                                </Form.Item>
                                <Form.Item label="选中字色" >
                                    <ColorSelect color={leftLabel.selectedFontColor} setColor={setColor.bind(this, leftLabel, 'selectedFontColor')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title="对中间的距离，单位为%，相对于每一行的宽度">右边距*</Tooltip>}>
                                    <InputNumber value={leftLabel.toCenterDistance} onChange={value => this.handleChangeStyle(2, leftLabel, 'toCenterDistance', value)} min={0} />
                                </Form.Item>
                            </Form>
                        </Panel>
                        <Panel header="右侧标签块的样式">
                            <Form {...formItemLayout24} >
                                <Form.Item label="字号">
                                    <Input value={rightLabel.fontSize} onChange={e => this.handleChangeStyle(1, rightLabel, 'fontSize', e)} />
                                </Form.Item>
                                <Form.Item label="字色" >
                                    <ColorSelect color={rightLabel.fontColor} setColor={setColor.bind(this, rightLabel, 'fontColor')} />
                                </Form.Item>
                                <Form.Item label="选中字色" >
                                    <ColorSelect color={rightLabel.selectedFontColor} setColor={setColor.bind(this, rightLabel, 'selectedFontColor')} />
                                </Form.Item>
                                <Form.Item label="字重" >
                                    <Radio.Group value={rightLabel.fontWeight} onChange={e => this.handleChangeStyle(1, rightLabel, 'fontWeight', e)}>
                                        <Radio.Button value={200}>细</Radio.Button>
                                        <Radio.Button value={400}>普通</Radio.Button>
                                        <Radio.Button value={600}>粗</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label={<Tooltip title="对中间的距离，单位为%，相对于每一行的宽度">左边距*</Tooltip>}>
                                    <InputNumber min={0} value={rightLabel.toCenterDistance} onChange={value => this.handleChangeStyle(2, rightLabel, 'toCenterDistance', value)} />
                                </Form.Item>
                            </Form>
                        </Panel>
                        <Panel header="中间颜色块的样式">
                            <Collapse>
                                <Panel header="背景">
                                    <Form {...formItemLayout24} >
                                        <Form.Item label="颜色类型">
                                            <Radio.Group value={bgColorType} onChange={e => this.handleChangeStyle(1, style, 'bgColorType', e)}>
                                                <Radio value={1}>单一色</Radio>
                                                <Radio value={2}>渐变色</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {
                                            bgColorType === 1 ?
                                                <Form.Item label="颜色">
                                                    <ColorSelect color={backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor1')} />
                                                </Form.Item> :
                                                <>
                                                    <Form.Item label="渐变类型">
                                                        <Radio.Group value={style.gradientType} onChange={e => this.handleChangeStyle(1, style, 'gradientType', e)}>
                                                            <Radio.Button value={1}>线性渐变</Radio.Button>
                                                            <Radio.Button value={2}>径向渐变</Radio.Button>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                    {
                                                        style.gradientType === 1 &&
                                                        <Form.Item label="渐变角度">
                                                            <Slider min={0} max={180} value={style.gradientDeg} onChange={value => this.handleChangeStyle(2, style, 'gradientDeg', value)} />
                                                        </Form.Item>
                                                    }
                                                    {backgroundColor.map((item, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <Tag>
                                                                    <Tooltip title="背景是渐变色，至少有两种颜色">
                                                                        颜色{index + 1}
                                                                        <Icon type="close" onClick={this.deleteColor.bind(this, backgroundColor, index)} />
                                                                    </Tooltip>
                                                                </Tag>
                                                                <Form.Item label="颜色">
                                                                    <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                                                                </Form.Item>
                                                                <Form.Item label="开始位置">
                                                                    <InputNumber value={item.stop} onChange={value => this.handleChangeStyle(2, item, 'stop', value)} />
                                                                </Form.Item>
                                                            </div>
                                                        )
                                                    })}
                                                    <Button type="dashed" onClick={() => this.addColor(backgroundColor)}>
                                                        <Icon type="plus" />添加颜色
                                                    </Button>
                                                </>
                                        }
                                        <Form.Item label={<Tooltip title="中间色块的高度，单位是%，相对于每一行的高度">高度*</Tooltip>}>
                                            <InputNumber min={0} value={backgroundHeight} onChange={value => this.handleChangeStyle(2, style, 'backgroundHeight', value)} />
                                        </Form.Item>
                                    </Form>
                                </Panel>
                            </Collapse>
                        </Panel>
                    </Collapse>
                </Panel>
                <Panel header="其他设置" key="2">
                    <Form {...formItemLayout24}>
                        <Form.Item label="时间间隔">
                            <InputNumber value={time} onChange={value => this.handleChangeStyle(2, style, 'time', value)} />
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
