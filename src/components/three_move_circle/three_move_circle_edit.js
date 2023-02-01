import React from 'react';
import {Form, Input, Collapse, InputNumber, Tooltip, Switch, Radio, Button, Icon} from 'antd';
import {addListItem, changeDetailData, getInteractEdit} from "../../common/editUtil";
import {lightEdit} from "../../common/threeEditUtil";

const { Panel } = Collapse;

export default class ThreeMoveCircleEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.lightEdit = lightEdit.bind(this);
        this.getInteractEdit = getInteractEdit.bind(this);
        // this.colorItem = {start:''};
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
                        <Form.Item label="数值键名">
                            <Input value={style.key} onChange={changeDetailData.bind(this, 1, style, 'key')} />
                        </Form.Item>
                        <Form.Item label="宽">
                            <InputNumber value={style.width} onChange={changeDetailData.bind(this, 2, style, 'width')} />
                        </Form.Item>
                        <Form.Item label="高">
                            <InputNumber value={style.height} onChange={changeDetailData.bind(this, 2, style, 'height')} />
                        </Form.Item>
                        <Form.Item label="层空隙">
                            <InputNumber value={style.gap} onChange={changeDetailData.bind(this, 2, style, 'gap')} />
                        </Form.Item>
                        <Form.Item label="竖向偏移">
                            <InputNumber value={style.positionY} onChange={changeDetailData.bind(this, 2, style, 'positionY')} />
                        </Form.Item>
                        <Form.Item label="动画">
                            <Switch checked={style.animateOn} onChange={changeDetailData.bind(this, 2, style, 'animateOn')}/>
                        </Form.Item>
                        <Form.Item label="画布宽">
                            <InputNumber checked={style.canvasWidth} onChange={changeDetailData.bind(this, 2, style, 'canvasWidth')}/>
                        </Form.Item>
                    </Panel>
                    <Panel header="渲染区域设置" key="2">
                        <Form.Item
                            label={
                                <Tooltip title="三维场景显示范围控制系数，系数越大，显示的范围越大">
                                    S*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.s} onChange={changeDetailData.bind(this, 2, style, 's')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="相机位置" key="3">
                        <Form.Item label="相机类型">
                            <Radio.Group value={style.cameraType} onChange={changeDetailData.bind(this, 1, style, 'cameraType')}>
                                <Radio value={1}>正交相机</Radio>
                                <Radio value={2}>透视相机</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="x">
                            <InputNumber value={style.cameraX} onChange={changeDetailData.bind(this, 2, style, 'cameraX')} />
                        </Form.Item>
                        <Form.Item label="y">
                            <InputNumber value={style.cameraY} onChange={changeDetailData.bind(this, 2, style, 'cameraY')} />
                        </Form.Item>
                        <Form.Item label="z">
                            <InputNumber value={style.cameraZ} onChange={changeDetailData.bind(this, 2, style, 'cameraZ')} />
                        </Form.Item>
                    </Panel>
                    {this.lightEdit('光源设置',4)}
                    <Panel header="圆圈点击交互" key="6">
                        {this.getInteractEdit(style.iconClickInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'iconClickInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
