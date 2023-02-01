/* eslint-disable no-unused-vars */
import React from 'react';
import { Form, Collapse, Tooltip, Input, Switch, InputNumber, Select } from 'antd';

import ColorSelect from "../../common/colorSelect";
// eslint-disable-next-line no-unused-vars
import { changeDetailData } from "../../common/editUtil";

const { Panel } = Collapse;
export default class EchartsDiagramTwoEdit extends React.Component {
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
    render() {
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        return (
            <Collapse >
                <Panel header="节点设置" key={1}>
                    <Form {...formItemLayout24}>
                        <Form.Item label="根节点大小">
                            <Input value={style.rootSymbolSize} onChange={this.changeDetailData.bind(this, 1, style, 'rootSymbolSize')} />
                        </Form.Item>
                        <Form.Item label="分支节点大小">
                            <Input value={style.branchSymbolSize} onChange={this.changeDetailData.bind(this, 1, style, 'branchSymbolSize')} />
                        </Form.Item>
                        <Collapse>
                            <Panel header="标签样式">
                                <Form.Item label="是否显示">
                                    <Switch checked={style.nodeShowLabel} onChange={this.changeDetailData.bind(this, 2, style, 'nodeShowLabel')} />
                                </Form.Item>
                                <Form.Item label="颜色">
                                    <ColorSelect color={style.nodeLabelColor} setColor={this.setColor.bind(this, style, 'nodeLabelColor')} />
                                </Form.Item>
                                <Form.Item label="字体大小">
                                    <Input
                                        value={style.nodeLabelFontSize}
                                        onChange={this.changeDetailData.bind(this, 1, style, 'nodeLabelFontSize')}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Tooltip
                                            title="值可以是top/left/right/bottom/inside/insideLeft/insideRight/insideTop/insideBottom/insideTopLeft/insideBottomLeft/insideTopRight/insideBottomRight"
                                        >位置*</Tooltip>
                                    }
                                >
                                    <Input value={style.nodeLabelPosition} onChange={this.changeDetailData.bind(this, 1, style, 'nodeLabelPosition')} />
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Form>
                </Panel>
                <Panel header="连接线设置" key={2}>
                    <Form {...formItemLayout24} >
                        <Collapse>
                            <Panel header="线样式">
                                <Form.Item label="颜色">
                                    <ColorSelect color={style.lineColor} setColor={this.setColor.bind(this, style, 'lineColor')} />
                                </Form.Item>
                                <Form.Item label="线宽">
                                    <InputNumber
                                        value={style.lineWidth}
                                        onChange={this.changeDetailData.bind(this, 2, style, 'lineWidth')}
                                    />
                                </Form.Item>
                                <Form.Item label="类型">
                                    <Select value={style.lineType} onChange={this.changeDetailData.bind(this, 2, style, 'lineType')}>
                                        <Select.Option value="solid">实线</Select.Option>
                                        <Select.Option value="dashed">虚线</Select.Option>
                                        <Select.Option value="dotted">点线</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label={<Tooltip title="线的弯曲程度，支持从 0 到 1 的值，值越大曲度越大">曲度*</Tooltip>}>
                                    <InputNumber
                                        value={style.lineCurveness}
                                        onChange={this.changeDetailData.bind(this, 2, style, 'lineCurveness')}
                                    />
                                </Form.Item>
                            </Panel>
                            <Panel header="标签样式">
                                <Form.Item label="是否显示">
                                    <Switch checked={style.lineShowLabel} onChange={this.changeDetailData.bind(this, 2, style, 'lineShowLabel')} />
                                </Form.Item>
                                <Form.Item label="颜色">
                                    <ColorSelect color={style.lineLabelColor} setColor={this.setColor.bind(this, style, 'lineLabelColor')} />
                                </Form.Item>
                                <Form.Item label="字体大小">
                                    <Input
                                        value={style.lineLabelFontSize}
                                        onChange={this.changeDetailData.bind(this, 1, style, 'lineLabelFontSize')}
                                    />
                                </Form.Item>
                                <Form.Item label="位置">
                                    <Select value={style.lineLabelPosition} onChange={this.changeDetailData.bind(this, 2, style, 'lineLabelPosition')}>
                                        <Select.Option value="start">起始位置</Select.Option>
                                        <Select.Option value="middle">中点位置</Select.Option>
                                        <Select.Option value="end">结束位置</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Panel>
                        </Collapse>
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
