import React from 'react';
import { Form, Collapse, Input, Select, } from 'antd';


import ColorSelect from "../../common/colorSelect";
import {
    changeDetailData,
    setColor,
} from "../../common/editUtil";



const { Panel } = Collapse;
export default class LineTypeOneEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeDetailData = changeDetailData.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    handleChangeStyle = (type, item, key, e) => {
        this.changeDetailData(type, item, key, e);
    };
    render() {
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        return (
            <Collapse >
                <Panel header="基础样式设置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={e => this.handleChangeStyle(1, style, 'fontSize', e)} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="背景颜色">
                            <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="其他设置" key="2">
                    <Form {...formItemLayout24} >

                        <Form.Item label="滚动类型">
                            <Select value={style.scrollType} onChange={this.changeDetailData.bind(this, 2, style, 'scrollType')}>
                                <Select.Option value={1}>正常滚动</Select.Option>
                                <Select.Option value={2}>文字过长才滚动</Select.Option>
                                <Select.Option value={3}>不滚动</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
