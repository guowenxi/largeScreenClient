/* eslint-disable no-unused-vars */
import React from 'react';
import { Form, Collapse, Icon, Tooltip, Radio, Input, Switch, InputNumber } from 'antd';

import ColorSelect from "../../common/colorSelect";
// eslint-disable-next-line no-unused-vars
import { changeDetailData } from "../../common/editUtil";

const { Panel } = Collapse;
const { TextArea } = Input;
export default class HightChartsEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeDetailData = changeDetailData;
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
            <Collapse >
                <Panel header="接口配置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="预警事件接口">
                            <Input value={style.warningEventUrl} onChange={this.changeDetailData.bind(this, 1, style, 'warningEventUrl')} />
                        </Form.Item>
                        <Form.Item label="省级事件接口">
                            <Input value={style.provinceEventUrl} onChange={this.changeDetailData.bind(this, 1, style, 'provinceEventUrl')} />
                        </Form.Item>
                        <Form.Item label="区级事件接口">
                            <Input value={style.districtEventUrl} onChange={this.changeDetailData.bind(this, 1, style, 'districtEventUrl')} />
                        </Form.Item>
                        <Form.Item label="发送接口">
                            <Input value={style.sendUrl} onChange={this.changeDetailData.bind(this, 1, style, 'sendUrl')} />
                        </Form.Item>
                        <Form.Item label="工作组接口">
                            <Input value={style.workGroupUrl} onChange={this.changeDetailData.bind(this, 1, style, 'workGroupUrl')} />
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
