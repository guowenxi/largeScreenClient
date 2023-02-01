import React from 'react';
import {Form, Input, Collapse, Switch, Radio, Tooltip} from 'antd';
import {changeDetailData} from "../../common/editUtil";

const { Panel } = Collapse;

export default class ProgramWindowEdit extends React.Component {
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
            <Collapse >
                <Panel header="内容配置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="内容链接">
                            <Input value={style.src} onChange={changeDetailData.bind(this, 1, style, 'src')} />
                        </Form.Item>
                        <Form.Item label="是否带token">
                            <Switch checked={style.token} onChange={changeDetailData.bind(this, 2, style, 'token')}/>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='token携带方式。方式一为：url?token=xxx，方式2为：url/xxx'>
                                    携带方式*
                                </Tooltip>
                            }
                        >
                            <Radio.Group value={style.tokenType} onChange={changeDetailData.bind(this, 1, style, 'tokenType')}>
                                <Radio value={1}>?</Radio>
                                <Radio value={2}>/</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="是否带websocket">
                            <Switch checked={style.websocket} onChange={changeDetailData.bind(this, 2, style, 'websocket')}/>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
