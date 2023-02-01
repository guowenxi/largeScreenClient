import React from 'react';
import {Form, Input, Collapse} from 'antd';
import {changeDetailData, getInteractEdit} from "../../common/editUtil";

const { Panel } = Collapse;

export default class IframeYueqingMapTwoEdit extends React.Component {
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
                        <Form.Item label="内容链接">
                            <Input value={style.src} onChange={changeDetailData.bind(this, 1, style, 'src')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
