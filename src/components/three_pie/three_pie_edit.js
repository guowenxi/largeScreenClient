import React from 'react';
import {Form, Input, Collapse, InputNumber, Tooltip, Icon, Row, Col, Switch} from 'antd';
import {addListItem, changeDetailData, deleteListItem, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import {lightEdit} from "../../common/threeEditUtil";

const { Panel } = Collapse;

export default class ThreePieEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.lightEdit = lightEdit.bind(this);
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
                        <Form.Item  label={
                            <span>
                                <Tooltip title="点击添加">
                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={addListItem.bind(this, style, 'colorList', {})} />
                                </Tooltip>
                                <Tooltip title="图标样式为纵向时颜色从上往下渐变。为横向时颜色从左往右渐变。">
                                    颜色*
                                </Tooltip>
                            </span>
                        }>
                            <Row>
                                {style.colorList && style.colorList.map((thisColor, index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={setColor.bind(this, thisColor, 'start')} />
                                        <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={setColor.bind(this, thisColor, 'end')} />
                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={deleteListItem.bind(this, style.colorList, index)} />
                                    </Col>
                                )}
                            </Row>
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
                </Collapse>
            </Form>
        );
    }
}
