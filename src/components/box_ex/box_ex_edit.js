import React from 'react';
import { Form, Collapse, Select, Input, Tooltip, InputNumber, Switch, Button, Icon, Radio, Slider, } from 'antd';
import { addListItem, changeDetailData, getInteractEdit, setColor } from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import { getColorList } from "../../common/nameNumEditUtil";

const { Panel } = Collapse;
export default class BoxExEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getInteractEdit = getInteractEdit.bind(this);
        this.getColorList = getColorList.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础设置">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.color} setColor={setColor.bind(this, style, 'color')} />
                        </Form.Item>
                        <Form.Item label="框样式">
                            <Select value={style.contentName} onChange={changeDetailData.bind(this, 2, style, 'contentName')}>
                                <Select.Option value={'svgTypeOne'} >样式一</Select.Option>
                                <Select.Option value={'svgTypeTwo'} >样式二</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>标题高*</Tooltip>}>
                            <InputNumber value={style.headHeight} onChange={changeDetailData.bind(this, 2, style, 'headHeight')} />
                        </Form.Item>
                        <Form.Item label="标题内容">
                            <Input value={style.head} onChange={changeDetailData.bind(this, 1, style, 'head')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="背景设置" key="2">
                        <Form.Item label="透明度" >
                            <InputNumber value={style.backgroundOpacity} onChange={changeDetailData.bind(this, 2, style, 'backgroundOpacity')} />
                        </Form.Item>
                        <Form.Item label="渐变类型" >
                            <Radio.Group value={style.backgroundGradientType} onChange={changeDetailData.bind(this, 1, style, 'backgroundGradientType')}>
                                <Radio.Button value="radial">径向</Radio.Button>
                                <Radio.Button value="linear">线性</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {style.backgroundGradientType === 'linear' && (
                            <Form.Item label="渐变角度">
                                <Slider defaultValue={180} max={180} min={0} value={style.backgroundAngle} onChange={changeDetailData.bind(this, 2, style, 'backgroundAngle')} />
                            </Form.Item>
                        )}
                        {this.getColorList(style.backgroundColor)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'backgroundColor', {})}>
                                <Icon type="plus" /> 添加颜色
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="展开设置" key="3">
                        <Form.Item label="按钮显示">
                            <Switch checked={style.buttonShow} onChange={changeDetailData.bind(this, 2, style, 'buttonShow')} />
                        </Form.Item>
                        <Form.Item label="放大倍数">
                            <InputNumber value={style.multiple} onChange={changeDetailData.bind(this, 2, style, 'multiple')} />
                        </Form.Item>
                        <Collapse >
                            <Panel header="展开交互" key="1">
                                {this.getInteractEdit(style.interactShow)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'interactShow', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="收起交互" key="2">
                                {this.getInteractEdit(style.interactHide)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'interactHide', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Panel>
                    <Panel header="样式二设置" key="4">
                        <Form.Item label={<Tooltip title="单位为%">左侧块宽*</Tooltip>}>
                            <InputNumber value={style.leftBoxWidth} onChange={changeDetailData.bind(this, 2, style, 'leftBoxWidth')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title="单位为%">右侧块宽*</Tooltip>}>
                            <InputNumber value={style.rightBoxWidth} onChange={changeDetailData.bind(this, 2, style, 'rightBoxWidth')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title="最大为1,最小为0">透明度*</Tooltip>}>
                            <InputNumber value={style.opacity} min={0} max={1} onChange={changeDetailData.bind(this, 2, style, 'opacity')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="其他设置" key="5">
                        <Form.Item label="是否响应点击">
                            <Switch checked={style.pointerEvents} onChange={changeDetailData.bind(this, 2, style, 'pointerEvents')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
