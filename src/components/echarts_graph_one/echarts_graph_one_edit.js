import React from 'react';
import {Form, Collapse, Input, InputNumber, Radio} from 'antd';
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
                        <Form.Item label="显示级别">
                            <InputNumber value={style.showLevel} onChange={changeDetailData.bind(this, 2, style, 'showLevel')} />
                        </Form.Item>
                        <Form.Item label="弹窗内" >
                            <Radio.Group value={style.contentType} onChange={changeDetailData.bind(this, 1, style, 'contentType')}>
                                <Radio.Button value={1}>内容一(默认</Radio.Button>
                                <Radio.Button value={2}>内容2</Radio.Button>
                                <Radio.Button value={3}>内容3</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
