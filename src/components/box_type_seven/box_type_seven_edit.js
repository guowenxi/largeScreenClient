import React from 'react';
import { Form, Input, Collapse, Button, Icon } from 'antd';
import {
    changeDetailData, addListItem, getInteractEdit
} from "../../common/editUtil";
const { Panel } = Collapse;
export default class BoxTypeSevenEdit extends React.Component {
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
                        <Form.Item label="展开名称">
                            <Input value={style.openName} onChange={changeDetailData.bind(this, 1, style, 'openName')} />
                        </Form.Item>
                        <Form.Item label="收起名称">
                            <Input value={style.closeName} onChange={changeDetailData.bind(this, 1, style, 'closeName')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="展开交互" key="1">
                        {this.getInteractEdit(style.interactShow)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'interactShow', {})}>
                                <Icon type="plus" /> 添加交互内容
                                    </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="收起交互" key="2">
                        {this.getInteractEdit(style.interactHide)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'interactHide', {})}>
                                <Icon type="plus" /> 添加交互内容
                                    </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
