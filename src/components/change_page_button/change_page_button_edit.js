import React from 'react';
import {Form, Input, Collapse, Radio} from 'antd';
import {changeDetailData} from "../../common/editUtil";

const { Panel } = Collapse;

export default class ChangePageButtonEdit extends React.Component {
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
                    <Panel header="内容设置" key="1">
                        <Form.Item label="页面id">
                            <Input value={style.pageId} onChange={changeDetailData.bind(this, 1, style, 'pageId')} />
                        </Form.Item>
                        <Form.Item label="按钮样式">
                            <Radio.Group value={style.iconType} onChange={changeDetailData.bind(this, 1, style, 'iconType')}>
                                <Radio value={0}>样式一</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
