import React from 'react';
import {Form, Collapse, Input, Button, Icon, Tag, InputNumber, Tooltip, Radio} from 'antd';
import {addListItem, changeDetailData, deleteListItem, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class SvgMapEdit extends React.Component {
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
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="svg设置" key="1">
                        <Form.Item label="图形类型">
                            <Radio.Group value={style.svgType} onChange={changeDetailData.bind(this, 1, style, 'svgType')}>
                                <Radio.Button value="path">path</Radio.Button>
                                <Radio.Button value="polygon">polygon</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="盒宽">
                            <Input value={style.svgWidth}
                                   onChange={changeDetailData.bind(this, 1, style, 'svgWidth')}/>
                        </Form.Item>
                        <Form.Item label="盒高">
                            <Input value={style.svgHeight}
                                   onChange={changeDetailData.bind(this, 1, style, 'svgHeight')}/>
                        </Form.Item>
                    </Panel>
                    <Panel header="地图基础设置" key="1">
                        <Form.Item label={<Tooltip title='单位%。'>宽*</Tooltip>} >
                            <InputNumber value={style.mapWidth}
                                   onChange={changeDetailData.bind(this, 2, style, 'mapWidth')}/>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位%。'>高*</Tooltip>} >
                            <InputNumber value={style.mapHeight}
                                   onChange={changeDetailData.bind(this, 2, style, 'mapHeight')}/>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位%。'>左*</Tooltip>} >
                            <InputNumber value={style.mapLeft}
                                   onChange={changeDetailData.bind(this, 2, style, 'mapLeft')}/>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位%。'>上*</Tooltip>} >
                            <InputNumber value={style.mapTop}
                                   onChange={changeDetailData.bind(this, 2, style, 'mapTop')}/>
                        </Form.Item>
                    </Panel>
                    <Panel header="颜色设置" key="2">
                        <Form.Item label="匹配字段">
                            <Input value={style.matchkey}
                                   onChange={changeDetailData.bind(this, 1, style, 'matchkey')}/>
                        </Form.Item>
                        <Form.Item label="颜色依据">
                            <Input value={style.baseKey}
                                   onChange={changeDetailData.bind(this, 1, style, 'baseKey')}/>
                        </Form.Item>
                        {style.colorList && style.colorList.map((color,index) =>
                            <div key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.colorList, index)}>
                                    {'颜色' + (index + 1)}
                                </Tag>
                                <Form.Item label="大于等于" >
                                    <InputNumber min={0} value={color.bottom} onChange={changeDetailData.bind(this, 2, color, 'bottom')} />
                                </Form.Item>
                                <Form.Item label="小与" >
                                    <InputNumber min={0} value={color.top} onChange={changeDetailData.bind(this, 2, color, 'top')} />
                                </Form.Item>
                                <Form.Item label="颜色">
                                    <ColorSelect color={color.color} setColor={setColor.bind(this, color, 'color')} />
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'colorList',{})}>
                                <Icon type="plus"/> 添加演颜色分类
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="图例设置" key="3">
                        <Form.Item label={<Tooltip title='单位%。'>宽*</Tooltip>} >
                            <InputNumber value={style.legendWidth}
                                   onChange={changeDetailData.bind(this, 2, style, 'legendWidth')}/>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位%。'>高*</Tooltip>} >
                            <InputNumber value={style.legendHeight}
                                   onChange={changeDetailData.bind(this, 2, style, 'legendHeight')}/>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位%。'>左*</Tooltip>} >
                            <InputNumber value={style.legendLeft}
                                   onChange={changeDetailData.bind(this, 2, style, 'legendLeft')}/>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位%。'>上*</Tooltip>} >
                            <InputNumber value={style.legendTop}
                                   onChange={changeDetailData.bind(this, 2, style, 'legendTop')}/>
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.fontSize}
                                   onChange={changeDetailData.bind(this, 1, style, 'fontSize')}/>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>字行高*</Tooltip>} >
                            <InputNumber value={style.lineHeight}
                                   onChange={changeDetailData.bind(this, 2, style, 'lineHeight')}/>
                        </Form.Item>
                        <Form.Item label="图形高度">
                            <Input value={style.barHeight}
                                   onChange={changeDetailData.bind(this, 1, style, 'barHeight')}/>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位%。'>图形间距*</Tooltip>} >
                            <InputNumber value={style.barGap}
                                   onChange={changeDetailData.bind(this, 2, style, 'barGap')}/>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
