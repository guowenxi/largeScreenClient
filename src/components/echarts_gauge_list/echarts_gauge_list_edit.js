import React from 'react';
import {Form, Collapse, Input, InputNumber, Switch, Tooltip} from 'antd';
import {changeDetailData, getListLayoutEdit} from "../../common/editUtil";

const { Panel } = Collapse;

export default class EchartsGaugeListEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getListLayoutEdit = getListLayoutEdit.bind(this);
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
                    <Panel header="基础样式设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        {this.getListLayoutEdit(style)}
                    </Panel>
                    <Panel header="自动滚动" key="3">
                        <Form.Item label="是否开启">
                            <Switch checked={style.autoMove}
                                    onChange={changeDetailData.bind(this, 2, style, 'autoMove')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="自动滚动时间间隔，单位毫秒。">
                                    时间间隔*
                                </Tooltip>
                            }
                        >
                            <Input value={style.interval} onChange={changeDetailData.bind(this, 1, style, 'interval')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="其他设置" key="2">
                        <Form.Item label="小数位数">
                            <InputNumber value={style.fixNum} onChange={changeDetailData.bind(this, 2, style, 'fixNum')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
