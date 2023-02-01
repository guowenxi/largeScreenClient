import React from 'react';
import { Form, Collapse, Tooltip, InputNumber, Icon, Row, Col, Radio, Input, Switch } from 'antd';
import { addListItem, changeDetailData, deleteListItem, setColor } from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class HightChartsEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                    <Panel header="饼图设置" key="1">
                        <Collapse >
                            <Panel header="大小位置设置" key="1">
                                <Form.Item label={<Tooltip title='单位%。'>宽*</Tooltip>} >
                                    <InputNumber value={style.pieWidth} onChange={changeDetailData.bind(this, 2, style, 'pieWidth')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位%。'>高*</Tooltip>} >
                                    <InputNumber value={style.pieHeight} onChange={changeDetailData.bind(this, 2, style, 'pieHeight')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位%。'>左*</Tooltip>} >
                                    <InputNumber value={style.pieLeft} onChange={changeDetailData.bind(this, 2, style, 'pieLeft')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位%。'>上*</Tooltip>} >
                                    <InputNumber value={style.pieTop} onChange={changeDetailData.bind(this, 2, style, 'pieTop')} />
                                </Form.Item>
                            </Panel>
                            <Panel header="其他设置" key="2">
                                <Form.Item label={
                                    <span>
                                        <Tooltip title="点击添加">
                                            <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={addListItem.bind(this, style, 'colorList', '#000')} />
                                        </Tooltip>
                                    内容颜色
                                </span>
                                }>
                                    <Row>
                                        {style.colorList && style.colorList.map((thisColor, index) =>
                                            <Col key={index}>
                                                <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={setColor.bind(this, style.colorList, index)} />
                                                <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={deleteListItem.bind(this, style.colorList, index)} />
                                            </Col>
                                        )}
                                    </Row>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Panel>
                    <Panel header="图例设置" key="2">
                        <Collapse >
                            <Panel header="大小位置设置" key="1">
                                <Form.Item label="显示">
                                    <Radio.Group value={style.legendShow} onChange={changeDetailData.bind(this, 1, style, 'legendShow')}>
                                        <Radio value={1}>是</Radio>
                                        <Radio value={2}>否</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位%。'>宽*</Tooltip>} >
                                    <InputNumber value={style.legendWidth} onChange={changeDetailData.bind(this, 2, style, 'legendWidth')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位%。'>高*</Tooltip>} >
                                    <InputNumber value={style.legendHeight} onChange={changeDetailData.bind(this, 2, style, 'legendHeight')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位%。'>左*</Tooltip>} >
                                    <InputNumber value={style.legendLeft} onChange={changeDetailData.bind(this, 2, style, 'legendLeft')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位%。'>上*</Tooltip>} >
                                    <InputNumber value={style.legendTop} onChange={changeDetailData.bind(this, 2, style, 'legendTop')} />
                                </Form.Item>
                            </Panel>
                            <Panel header="排列设置" key="2">
                                <Form.Item label="列数">
                                    <InputNumber value={style.columnNum} onChange={changeDetailData.bind(this, 2, style, 'columnNum')} />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Tooltip title='列之间的空隙，单位为%（组件宽度的百分比）。'>
                                            列空隙*
                                        </Tooltip>
                                    }
                                >
                                    <InputNumber value={style.columnGap} onChange={changeDetailData.bind(this, 2, style, 'columnGap')} />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Tooltip title='行之间的空隙，单位为%（组件高度的百分比）。'>
                                            行空隙*
                                        </Tooltip>
                                    }
                                >
                                    <InputNumber value={style.rowGap} onChange={changeDetailData.bind(this, 2, style, 'rowGap')} />
                                </Form.Item>
                                <Form.Item label="排列方向">
                                    <Radio.Group value={style.flexDirection} onChange={changeDetailData.bind(this, 1, style, 'flexDirection')}>
                                        <Radio value={'row'}>水平方向</Radio>
                                        <Radio value={'column'}>垂直方向</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Panel>
                            <Panel header="名称设置" key="3">
                                <Form.Item label="占宽">
                                    <Input value={style.nameWidth} onChange={changeDetailData.bind(this, 1, style, 'nameWidth')} />
                                </Form.Item>
                                <Form.Item label="字号">
                                    <Input value={style.fontSizeName} onChange={changeDetailData.bind(this, 1, style, 'fontSizeName')} />
                                </Form.Item>
                                <Form.Item label="字色">
                                    <ColorSelect color={style.colorName} setColor={setColor.bind(this, style, 'colorName')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位em。'>字缩进*</Tooltip>}>
                                    <InputNumber value={style.textIndent} onChange={changeDetailData.bind(this, 2, style, 'textIndent')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='超过最大字数将缩小字号。'>最大字数*</Tooltip>}>
                                    <InputNumber value={style.maxFontNum} onChange={changeDetailData.bind(this, 2, style, 'maxFontNum')} />
                                </Form.Item>
                            </Panel>
                            <Panel header="值设置" key="4">
                                <Form.Item label="占宽">
                                    <Input value={style.numWidth} onChange={changeDetailData.bind(this, 1, style, 'numWidth')} />
                                </Form.Item>
                                <Form.Item label="字号">
                                    <Input value={style.fontSizeNum} onChange={changeDetailData.bind(this, 1, style, 'fontSizeNum')} />
                                </Form.Item>
                                <Form.Item label="字色">
                                    <ColorSelect color={style.colorNum} setColor={setColor.bind(this, style, 'colorNum')} />
                                </Form.Item>
                                <Form.Item label="对齐方式">
                                    <Radio.Group size="small" value={style.numAlign} onChange={changeDetailData.bind(this, 1, style, 'numAlign')}>
                                        <Radio.Button value="left">居左</Radio.Button>
                                        <Radio.Button value="center">居中</Radio.Button>
                                        <Radio.Button value="right">居右</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Panel>
                            <Panel header="百分比设置" key="5">
                                <Form.Item label="是否显示">
                                    <Switch checked={style.perShow} onChange={changeDetailData.bind(this, 2, style, 'perShow')} />
                                </Form.Item>
                                <Form.Item label="占宽">
                                    <Input value={style.perWidth} onChange={changeDetailData.bind(this, 1, style, 'perWidth')} />
                                </Form.Item>
                                <Form.Item label="小数位数">
                                    <Input value={style.fitNum} onChange={changeDetailData.bind(this, 1, style, 'fitNum')} />
                                </Form.Item>
                                <Form.Item label="字号">
                                    <Input value={style.fontSizePer} onChange={changeDetailData.bind(this, 1, style, 'fontSizePer')} />
                                </Form.Item>
                                <Form.Item label="字色">
                                    <ColorSelect color={style.colorPer} setColor={setColor.bind(this, style, 'colorPer')} />
                                </Form.Item>
                                <Form.Item label="对齐方式">
                                    <Radio.Group size="small" value={style.perAlign} onChange={changeDetailData.bind(this, 1, style, 'perAlign')}>
                                        <Radio.Button value="left">居左</Radio.Button>
                                        <Radio.Button value="center">居中</Radio.Button>
                                        <Radio.Button value="right">居右</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
