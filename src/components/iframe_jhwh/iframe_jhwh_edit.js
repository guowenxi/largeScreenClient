import React from 'react';
import {Form, Input, Collapse, Button, Icon} from 'antd';
import {addListItem, changeDetailData, getInteractEdit} from "../../common/editUtil";

const { Panel } = Collapse;

export default class IframeJhwhEdit extends React.Component {
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
                    <Panel header="人员点击交互" key="2">
                        {this.getInteractEdit(style.peopleInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'peopleInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="访客点击交互" key="3">
                        {this.getInteractEdit(style.visitorInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'visitorInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="车辆点击交互" key="4">
                        {this.getInteractEdit(style.carInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'carInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="应急/演练/作业票页监控点击交互" key="5">
                        {this.getInteractEdit(style.cameraInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'cameraInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="首页监控点击交互" key="9">
                        {this.getInteractEdit(style.cameraInteractTwo)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'cameraInteractTwo', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="模拟监控点击交互" key="11">
                        {this.getInteractEdit(style.cameraInteractThree)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'cameraInteractThree', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="应急启动交互" key="6">
                        {this.getInteractEdit(style.newEmergencyInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'newEmergencyInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="已启动应急点击交互" key="7">
                        {this.getInteractEdit(style.showEmergencyInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'showEmergencyInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="作业票点击交互" key="8">
                        {this.getInteractEdit(style.paperInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'paperInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="设备详情点击交互" key="10">
                        {this.getInteractEdit(style.equipmentInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'equipmentInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="仓库片区详情点击交互" key="12">
                        {this.getInteractEdit(style.warehouseInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'warehouseInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="仓库建筑点击交互" key="13">
                        {this.getInteractEdit(style.warehouseDetailInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'warehouseDetailInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="关闭仓库交互" key="14">
                        {this.getInteractEdit(style.closeWarehouseInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'closeWarehouseInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
