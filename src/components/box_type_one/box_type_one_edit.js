import React from 'react';
import {Form, Input, Collapse, Tooltip} from 'antd';
import {changeDetailData, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class BoxTypeOneEdit extends React.Component {
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
                <Panel header="基础配置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="背景颜色">
                            <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item label="阴影颜色">
                            <ColorSelect color={style.shadowColor} setColor={setColor.bind(this, style, 'shadowColor')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='阴影水平偏移距离'>
                                    水平偏移*
                                </Tooltip>
                            }
                        >
                            <Input value={style.shadowLeft} onChange={changeDetailData.bind(this, 1, style, 'shadowLeft')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='阴影垂直偏移距离'>
                                    垂直偏移*
                                </Tooltip>
                            }
                        >
                            <Input value={style.shadowTop} onChange={changeDetailData.bind(this, 1, style, 'shadowTop')} />
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
