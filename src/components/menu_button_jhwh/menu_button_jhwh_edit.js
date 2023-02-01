import React from 'react';
import {Form, Input, Collapse, Button, Icon} from 'antd';
import {addListItem, changeDetailData, getInteractEdit} from "../../common/editUtil";

const { Panel } = Collapse;

export default class MenuButtonJhwhEdit extends React.Component {
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
                    <Panel header="基层样式设置" key="1">
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="一级菜单交互内容" key="2">
                        <Collapse >
                            <Panel header="数据" key="0">
                                {this.getInteractEdit(style.dataInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'dataInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="监控" key="1">
                                {this.getInteractEdit(style.cameraInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'cameraInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="仓储" key="2">
                                {this.getInteractEdit(style.warehouseInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'warehouseInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="安全" key="3">
                                {this.getInteractEdit(style.safeInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'safeInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="双预防" key="17">
                                {this.getInteractEdit(style.preventionInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'preventionInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="应急" key="15">
                                {this.getInteractEdit(style.emergencyInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'emergencyInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="模拟演练" key="8">
                                {this.getInteractEdit(style.simulateEmergencyInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'simulateEmergencyInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="设备点位" key="4">
                                {this.getInteractEdit(style.equipmentInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'equipmentInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="历史轨迹" key="5">
                                {this.getInteractEdit(style.historyInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'historyInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="作业票" key="9">
                                {this.getInteractEdit(style.paperInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'paperInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="人员" key="10">
                                {this.getInteractEdit(style.peopleInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'peopleInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="访客" key="11">
                                {this.getInteractEdit(style.visitorInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'visitorInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="车辆" key="12">
                                {this.getInteractEdit(style.carInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'carInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Panel>
                    <Panel header="二级菜单交互内容" key="3">
                        <Collapse >
                            <Panel header="设备" key="1">
                                {this.getInteractEdit(style.menuTwoInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'menuTwoInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="返回" key="2">
                                {this.getInteractEdit(style.backInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'backInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Panel>
                    <Panel header="图标显示隐藏交互" key="4">
                        {this.getInteractEdit(style.changeIconShowInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'changeIconShowInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="关闭轨迹" key="5">
                        {this.getInteractEdit(style.closeHistoryInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'closeHistoryInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="关闭逃生路线" key="6">
                        {this.getInteractEdit(style.closeEscapeRouteInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'closeEscapeRouteInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="模式切换" key="7">
                        {this.getInteractEdit(style.changeModeInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'changeModeInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="仓库查看模式切换" key="8">
                        {this.getInteractEdit(style.changeWarehouseSelectInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'changeWarehouseSelectInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
