import React from 'react';
import {Form, Collapse, Input, Select, Tooltip, InputNumber, Button, Icon} from 'antd';
import {addListItem, changeDetailData, getInteractEdit} from "../../common/editUtil";

const { Panel } = Collapse;

export default class SvgMapLinanExEdit extends React.Component {
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
                    <Panel header="其他设置" key="2">
                        <Form.Item label="详情接口">
                            <Input value={style.detailUrl} onChange={changeDetailData.bind(this, 1, style, 'detailUrl')} />
                        </Form.Item>
                        <Form.Item label="详情内容">
                            <Select value={style.detailType} onChange={changeDetailData.bind(this, 2, style, 'detailType')}>
                                <Select.Option value={1} >内容一</Select.Option>
                                <Select.Option value={2} >内容二</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>图标宽*</Tooltip>} >
                            <InputNumber value={style.pointWidth} onChange={changeDetailData.bind(this, 2, style, 'pointWidth')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>图标高*</Tooltip>} >
                            <InputNumber value={style.pointHeight} onChange={changeDetailData.bind(this, 2, style, 'pointHeight')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>内容宽*</Tooltip>} >
                            <InputNumber value={style.winWidth} onChange={changeDetailData.bind(this, 2, style, 'winWidth')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>内容高*</Tooltip>} >
                            <InputNumber value={style.winHeight} onChange={changeDetailData.bind(this, 2, style, 'winHeight')} />
                        </Form.Item>
                        <Form.Item label="底图地区">
                            <Select value={style.areaName} onChange={changeDetailData.bind(this, 2, style, 'areaName')}>
                                <Select.Option value={'linan'} >临安</Select.Option>
                                <Select.Option value={'jiande'} >建德</Select.Option>
                                <Select.Option value={'longgang'} >龙港</Select.Option>
                                <Select.Option value={'shangcheng'} >上城</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="切换间隔">
                            <Input value={style.time} onChange={changeDetailData.bind(this, 1, style, 'time')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="内容" key="3">
                        <Form.Item label="内容样式">
                            <Select value={style.contentType} onChange={changeDetailData.bind(this, 2, style, 'contentType')}>
                                <Select.Option value={1} >样式一</Select.Option>
                                <Select.Option value={2} >样式二</Select.Option>
                            </Select>
                        </Form.Item>
                    </Panel>
                    <Panel header="全区响应交互" key="4">
                        {this.getInteractEdit(style.cityInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'cityInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="镇街响应交互" key="5">
                        {this.getInteractEdit(style.roadInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'roadInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
