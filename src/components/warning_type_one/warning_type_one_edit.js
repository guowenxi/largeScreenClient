import React from 'react';
import {Form, Input, Collapse, Switch, Radio} from 'antd';
import {
    changeDetailData
} from "../../common/editUtil";
const { Panel } = Collapse;
export default class WarningTypeOneEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const { style } = this.props.data;
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础设置">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="区域键名" >
                            <Input value={style.partKey} onChange={changeDetailData.bind(this, 1, style, 'partKey')} />
                        </Form.Item>
                        <Form.Item label="时间键名" >
                            <Input value={style.timeKey} onChange={changeDetailData.bind(this, 1, style, 'timeKey')} />
                        </Form.Item>
                        <Form.Item label="内容键名" >
                            <Input value={style.contentKey} onChange={changeDetailData.bind(this, 1, style, 'contentKey')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="数据刷新带参">
                        <Form.Item label="携带最新id">
                            <Switch checked={style.carryId} onChange={changeDetailData.bind(this, 2, style, 'carryId')}/>
                        </Form.Item>
                        <Form.Item label="数据键名">
                            <Input checked={style.dataKey} onChange={changeDetailData.bind(this, 1, style, 'dataKey')}/>
                        </Form.Item>
                        <Form.Item label="传参键名">
                            <Input checked={style.sendKey} onChange={changeDetailData.bind(this, 1, style, 'sendKey')}/>
                        </Form.Item>
                        <Form.Item label="数据排序">
                            <Radio.Group value={style.orderBy} onChange={changeDetailData.bind(this, 1, style, 'orderBy')}>
                                <Radio value={1}>正序</Radio>
                                <Radio value={2}>倒叙</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
