import React from 'react';
import {Form, Collapse, Input, InputNumber, Button, Icon} from 'antd';
import {addListItem, changeDetailData} from "../../common/editUtil";
import {getContentEdit} from "../../common/nameNumEditUtil";

const { Panel } = Collapse;

export default class ListRollTypeTwoEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getContentEdit = getContentEdit.bind(this);
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
                    <Panel header="样式设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="一行个数">
                            <InputNumber value={style.number} onChange={changeDetailData.bind(this, 2, style, 'number')} />
                        </Form.Item>
                        <Form.Item label="移动间隔">
                            <InputNumber value={style.timing} onChange={changeDetailData.bind(this, 2, style, 'timing')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="内容设置" key="2">
                        {this.getContentEdit(style,'content')}
                        <Form.Item label="">
                            <Button type="dashed"
                                    onClick={addListItem.bind(this, style, 'content', {})}>
                                <Icon type="plus" /> 添加内容
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
