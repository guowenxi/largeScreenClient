import React from 'react';
import {Form, Input, InputNumber, Collapse, Radio, Switch} from 'antd';
import ColorSelect from "../../common/colorSelect";
import { changeDetailData, setColor } from "../../common/editUtil";

const formItemLayout24 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const { Panel } = Collapse;

export default class wordCloudEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }


    render() {
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24}>
                <Collapse>
                    <Panel header="基础设置">
                        <Form.Item label="背景颜色">
                            <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item label="名称键名" >
                            <Input value={style.nameKey} onChange={changeDetailData.bind(this, 1, style, 'nameKey')} />
                        </Form.Item>
                        <Form.Item label="数字键名" >
                            <Input value={style.valueKey} onChange={changeDetailData.bind(this, 1, style, 'valueKey')} />
                        </Form.Item>
                        <Form.Item label="数字显示">
                            <Switch checked={style.showNum} onChange={changeDetailData.bind(this, 2, style, 'showNum')}/>
                        </Form.Item>
                        <Form.Item label="外框">
                            <Radio.Group onChange={changeDetailData.bind(this, 1, style, 'frameType')} value={style.frameType}>
                                <Radio value={1}>默认</Radio>
                                <Radio value={2}>类型一</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="最大字号">
                            <InputNumber value={style.maxSize} onChange={changeDetailData.bind(this, 2, style, 'maxSize')} />
                        </Form.Item>
                        <Form.Item label="最小字号">
                            <InputNumber value={style.minSize} onChange={changeDetailData.bind(this, 2, style, 'minSize')} />
                        </Form.Item>
                        <Form.Item label="最大角度">
                            <InputNumber value={style.maxRange} onChange={changeDetailData.bind(this, 2, style, 'maxRange')} />
                        </Form.Item>
                        <Form.Item label="最小角度">
                            <InputNumber value={style.minRange} onChange={changeDetailData.bind(this, 2, style, 'minRange')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
