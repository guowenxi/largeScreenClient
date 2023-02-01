import React from 'react';
import {Form, Collapse, Input, Radio} from 'antd';
import { changeDetailData } from "../../common/editUtil";

const { Panel } = Collapse;

export default class CameraFlvEdit extends React.Component {
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
                        <Form.Item label="初始尺寸" >
                            <Radio.Group value={style.size} onChange={changeDetailData.bind(this, 1, style, 'size')}>
                                <Radio value={'1x1'}>1x1</Radio>
                                <Radio value={'2x2'}>2x2</Radio>
                                <Radio value={'3x3'}>3x3</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
