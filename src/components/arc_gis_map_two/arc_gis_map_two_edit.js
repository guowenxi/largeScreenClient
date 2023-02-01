import React from 'react';
import { Form, Collapse, Input } from 'antd';
import { changeDetailData } from "../../common/editUtil";

const { Panel } = Collapse;

export default class ArcGisMapTwoEdit extends React.Component {
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
                        <Form.Item label="名称键名">
                            <Input value={style.nameKey} onChange={changeDetailData.bind(this, 1, style, 'nameKey')} />
                        </Form.Item>
                        <Form.Item label="数值键名">
                            <Input value={style.numKey} onChange={changeDetailData.bind(this, 1, style, 'numKey')} />
                        </Form.Item>
                        <Form.Item label="id键名">
                            <Input value={style.idKey} onChange={changeDetailData.bind(this, 1, style, 'idKey')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
