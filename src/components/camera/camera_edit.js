import React from 'react';
import {Form, Input, InputNumber, Collapse} from 'antd';
import {changeDetailData, getInteractEdit} from "../../common/editUtil";

const { Panel } = Collapse;

export default class CameraEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getInteractEdit = getInteractEdit.bind(this);
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
                <Collapse >
                    <Panel header="基础配置" key="1">
                        <Form.Item label="页面地址">
                            <Input value={style.url} onChange={changeDetailData.bind(this, 1, style, 'url')} />
                        </Form.Item>
                        <Form.Item label="通讯id">
                            <Input value={style.webSocketId} onChange={changeDetailData.bind(this, 1, style, 'webSocketId')} />
                        </Form.Item>
                        <Form.Item label="弹窗序号">
                            <InputNumber value={style.winIndex} onChange={changeDetailData.bind(this, 2, style, 'winIndex')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
