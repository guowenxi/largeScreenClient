import React from 'react';
import {Collapse, Input, Form, Radio} from 'antd';
import {changeDetailData} from "../../common/editUtil";

const { Panel } = Collapse;
const { TextArea } = Input;

export default class CameraVideoEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse>
                    <Panel header="基础样式设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="默认尺寸">
                            <Radio.Group value={style.defaultSize} onChange={changeDetailData.bind(this, 1, style, 'defaultSize')} defaultValue={1}>
                                <Radio value={1}>1x1</Radio>
                                <Radio value={2}>1x2</Radio>
                                <Radio value={4}>2x2</Radio>
                                <Radio value={9}>3x3</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="默认监控">
                            <TextArea rows={5} value={style.defaultCamera}
                                      onChange={changeDetailData.bind(this, 1, style, 'defaultCamera')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
