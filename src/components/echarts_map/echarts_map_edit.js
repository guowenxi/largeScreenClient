import React from 'react';
import {Form, Collapse, Input, Radio} from 'antd';
import { changeDetailData } from "../../common/editUtil";

const { Panel } = Collapse;

export default class EchartsMapEdit extends React.Component {
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
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础样式设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="动画方向" >
                            <Radio.Group value={style.directionType} onChange={changeDetailData.bind(this, 1, style, 'directionType')}>
                                <Radio value={1}>向目标</Radio>
                                <Radio value={2}>从目标出发</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
