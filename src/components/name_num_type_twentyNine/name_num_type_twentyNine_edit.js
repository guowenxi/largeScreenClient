/* eslint-disable no-unused-vars */
import React from 'react';
import {Form, Input, Collapse, Radio, Tooltip, InputNumber, Switch, Select} from 'antd';
import {
    changeDetailData,
    setColor
} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
const { Panel } = Collapse;
export default class NameNumTypeTwentyNineEdit extends React.Component {
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
                    <Panel header="基础设置">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="最大值键名">
                            <Input value={style.maxValueKey} onChange={changeDetailData.bind(this, 1, style, 'maxValueKey')} />
                        </Form.Item>
                        <Form.Item label="样式">
                            <Select value={style.theme} onChange={changeDetailData.bind(this, 2, style, 'theme')}>
                                <Select.Option value={0} >样式一（默认</Select.Option>
                                <Select.Option value={1} >样式二</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="通知接口">
                            <Input value={style.turnToUrl} onChange={changeDetailData.bind(this, 1, style, 'turnToUrl')} />
                        </Form.Item>
                        <Form.Item label="下载接口">
                            <Input value={style.downloadUrl} onChange={changeDetailData.bind(this, 1, style, 'downloadUrl')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
