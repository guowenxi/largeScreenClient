import React from 'react';
import {Form, Collapse} from 'antd';

const { Panel } = Collapse;

export default class HightChartsEdit extends React.Component {
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
        return (
            <Collapse >
                <Panel header="基础配置" key="1">
                    <Form {...formItemLayout24} >
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
