import React from 'react';
import {Form, Input, Collapse, Button, Icon} from 'antd';
import {addListItem, changeDetailData} from "../../common/editUtil";
import {getContentEdit} from "../../common/nameNumEditUtil";

const { Panel } = Collapse;

export default class NameNumTypeFourteenEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible:false};
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
                    <Panel header="基础设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="顶部内容设置" key="2">
                        {this.getContentEdit(style,'head')}
                        <Form.Item label="">
                            <Button type="dashed"
                                    onClick={addListItem.bind(this, style, 'head', {})}>
                                <Icon type="plus" /> 添加内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="中心内容设置" key="3">
                        {this.getContentEdit(style,'center')}
                        <Form.Item label="">
                            <Button type="dashed"
                                    onClick={addListItem.bind(this, style, 'center', {})}>
                                <Icon type="plus" /> 添加内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="两边列表内容设置" key="4">
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
