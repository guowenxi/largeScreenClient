import React from 'react';
import {Form, Input, Collapse, Button, Icon} from 'antd';
import {addListItem, changeDetailData, getInteractEdit} from "../../common/editUtil";

const { Panel } = Collapse;

export default class NinghaiHeadEdit extends React.Component {
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
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="内容设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="服务地址">
                            <Input value={style.serviceAddress} onChange={changeDetailData.bind(this, 1, style, 'serviceAddress')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="总数点击交互" key="2">
                        {this.getInteractEdit(style.countInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'countInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="查看全部点击交互" key="3">
                        {this.getInteractEdit(style.allInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'allInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="标签管理点击交互" key="4">
                        {this.getInteractEdit(style.editInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'editInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="标签化体系点击交互" key="5">
                        {this.getInteractEdit(style.labelInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'labelInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="标签选择交互" key="6">
                        {this.getInteractEdit(style.labelSelect)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'labelSelect', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="取消标签选择交互" key="7">
                        {this.getInteractEdit(style.labelSelectCancel)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'labelSelectCancel', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="某标签详情交互" key="8">
                        {this.getInteractEdit(style.labelDetail)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'labelDetail', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="数源单位数量交互" key="9">
                        {this.getInteractEdit(style.sourceInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'sourceInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="平台数量交互" key="10">
                        {this.getInteractEdit(style.platformInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'platformInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
