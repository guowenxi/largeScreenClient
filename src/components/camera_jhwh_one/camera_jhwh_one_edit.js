import React from 'react';
import {Collapse, Form, Input} from 'antd';
import {changeDetailData} from "../../common/editUtil";

const { Panel } = Collapse;

export default class CameraJhwhOneEdit extends React.Component {
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
                <Collapse >
                    <Panel header="基础配置" key="1">
                        <Form.Item label="iframe地址">
                            <Input value={style.iframeUrl} onChange={changeDetailData.bind(this, 1, style, 'iframeUrl')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
