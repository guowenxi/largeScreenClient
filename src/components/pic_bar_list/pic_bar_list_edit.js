import React from 'react';
import {Form, Input, Collapse, Tooltip, Radio, InputNumber} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {
    changeDetailData,
    setColor,
} from "../../common/editUtil";

const { Panel } = Collapse;
const { TextArea } = Input;

export default class PicBarListEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.columnsItem = {align:'left',title:'',dataIndex:'',sorter:false,width:'',filterOpen:false,filterType:1,filterUrl:'',filtersJson:'',filterMultiple:true,colorType:1,calculateType:1,calculateList:[]};
        this.calculateItem = {value:'',more:0,less:100,color:'#fff'};
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
                    <Panel header="样式基础设置" key="4">
                        <Form.Item label="列数">
                            <InputNumber value={style.columnNum} onChange={changeDetailData.bind(this, 2, style, 'columnNum')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='若不设置或设置为0将自动计算行数'>
                                    行数*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.rowNum} onChange={changeDetailData.bind(this, 2, style, 'rowNum')} />
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
                    <Panel header="名称设置" key="1">
                        <Form.Item label="占宽">
                            <Input value={style.nameWidth} onChange={changeDetailData.bind(this, 1, style, 'nameWidth')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.nameFontSize} onChange={changeDetailData.bind(this, 1, style, 'nameFontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.nameColor} setColor={setColor.bind(this, style, 'nameColor')} />
                        </Form.Item>
                        <Form.Item label="对齐方式">
                            <Radio.Group value={style.nameTextAlign} onChange={changeDetailData.bind(this, 1, style, 'nameTextAlign')}>
                                <Radio.Button value="left">居左</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="right">居右</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="刻度标签内容格式器。内容为函数代码。">
                                    格式器*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={style.formatter}
                                      onChange={changeDetailData.bind(this, 1, style, 'formatter')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="数值设置" key="2">
                        <Form.Item label="占宽">
                            <Input value={style.numWidth} onChange={changeDetailData.bind(this, 1, style, 'numWidth')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.numFontSize} onChange={changeDetailData.bind(this, 1, style, 'numFontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.numColor} setColor={setColor.bind(this, style, 'numColor')} />
                        </Form.Item>
                        <Form.Item label="对齐方式">
                            <Radio.Group value={style.numTextAlign} onChange={changeDetailData.bind(this, 1, style, 'numTextAlign')}>
                                <Radio.Button value="left">居左</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="right">居右</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="柱设置" key="3">
                        <Form.Item label="占宽">
                            <Input value={style.barWidth} onChange={changeDetailData.bind(this, 1, style, 'barWidth')} />
                        </Form.Item>
                        <Form.Item label="柱宽">
                            <Input value={style.barHeight} onChange={changeDetailData.bind(this, 1, style, 'barHeight')} />
                        </Form.Item>
                        <Form.Item label="柱类型">
                            <Radio.Group value={style.barType} onChange={changeDetailData.bind(this, 1, style, 'barType')}>
                                <Radio value={0}>类型1</Radio>
                                <Radio value={1}>类型2</Radio>
                                <Radio value={2}>类型3</Radio>
                                <Radio value={3}>类型4</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="背景类型">
                            <Radio.Group value={style.backgroundType} onChange={changeDetailData.bind(this, 1, style, 'backgroundType')}>
                                <Radio value={0}>类型1</Radio>
                                <Radio value={1}>类型2</Radio>
                                <Radio value={2}>类型3</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="其他设置" key="5">
                        <Form.Item label="数据格式">
                            <Radio.Group value={style.dataType} onChange={changeDetailData.bind(this, 1, style, 'dataType')}>
                                <Radio value={1}>图表数据格式</Radio>
                                <Radio value={2}>{'list<map>'}</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="名称键名">
                            <Input value={style.nameKey} onChange={changeDetailData.bind(this, 1, style, 'nameKey')} />
                        </Form.Item>
                        <Form.Item label="值键名">
                            <Input value={style.numKey} onChange={changeDetailData.bind(this, 1, style, 'numKey')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
