import React from 'react';
import { Form, Input, Collapse, Slider, Button, Icon, Radio } from 'antd';
import { addListItem, changeDetailData,setColor } from "../../common/editUtil";
import { getColorList } from "../../common/nameNumEditUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class BoxTypeThreeEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.colorItem = { color: '#000', percent: 100 };
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
                    <Panel header="背景设置" key="1">
                        <Form.Item label="线宽">
                            <Input value={style.borderWidth} onChange={changeDetailData.bind(this, 1, style, 'borderWidth')} />
                        </Form.Item>
                        <Form.Item label="圆角弧度">
                            <Input value={style.borderRadius} onChange={changeDetailData.bind(this, 1, style, 'borderRadius')} />
                        </Form.Item>
                        <Form.Item label="边框颜色">
                            <ColorSelect color={style.borderColor} setColor={setColor.bind(this, style, 'borderColor')} />
                        </Form.Item>
                        <Form.Item label="渐变角度">
                            <Slider defaultValue={180} max={180} min={0} value={style.angle} onChange={changeDetailData.bind(this, 2, style, 'angle')} />
                        </Form.Item>
                        {this.getColorList(style.boxColor)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'boxColor', this.colorItem)}>
                                <Icon type="plus" /> 添加颜色
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="底部标志设置" key="2">
                        <Form.Item label="线条位置">
                            <Radio.Group value={style.linePosition} onChange={changeDetailData.bind(this, 1, style, 'linePosition')}>
                                <Radio value={'top'}>上面</Radio>
                                <Radio value={'bottom'}>下面</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="标志高度">
                            <Input value={style.lineHeight} onChange={changeDetailData.bind(this, 1, style, 'lineHeight')} />
                        </Form.Item>
                        {this.getColorList(style.lineColor)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'lineColor', this.colorItem)}>
                                <Icon type="plus" /> 添加颜色
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
