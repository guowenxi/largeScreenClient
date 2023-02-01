import React from 'react';
import {Form, Collapse, Input} from 'antd';
import {changeDetailData} from "../../common/editUtil";

const { Panel } = Collapse;

export default class SvgMapLinanEdit extends React.Component {
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
                    <Panel header="其他设置" key="2">
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')}/>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
