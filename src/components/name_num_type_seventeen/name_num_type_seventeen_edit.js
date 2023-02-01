import React from 'react';
import {Form, Collapse, Input, InputNumber, Tooltip, Tag, Button, Icon, Slider} from 'antd';
import {
    addListItem,
    changeDetailData, deleteListItem, setColor
} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import {getColorList} from "../../common/nameNumEditUtil";

const { Panel } = Collapse;
export default class NameNumTypeSeventeenEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorList = getColorList.bind(this);
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
                    <Panel header="基础设置" key="1">
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
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
                    </Panel>
                    <Panel header="标题设置" key="2">
                        <Form.Item label="键名">
                            <Input value={style.titleKey} onChange={changeDetailData.bind(this, 1, style, 'titleKey')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>} >
                            <InputNumber value={style.titleSize} onChange={changeDetailData.bind(this, 2, style, 'titleSize')} />
                        </Form.Item>
                        <Form.Item label="字体颜色">
                            <ColorSelect color={style.titleColor} setColor={setColor.bind(this, style, 'titleColor')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>宽度*</Tooltip>} >
                            <InputNumber value={style.titleWidth} onChange={changeDetailData.bind(this, 2, style, 'titleWidth')} />
                        </Form.Item>
                        <Form.Item label="下划线宽度">
                            <Input value={style.underLineWidth} onChange={changeDetailData.bind(this, 1, style, 'underLineWidth')} />
                        </Form.Item>
                        <Form.Item label="下划线颜色">
                            <ColorSelect color={style.underLineColor} setColor={setColor.bind(this, style, 'underLineColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="总数设置" key="3">
                        <Form.Item label="键名">
                            <Input value={style.countKey} onChange={changeDetailData.bind(this, 1, style, 'countKey')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>} >
                            <InputNumber value={style.numSize} onChange={changeDetailData.bind(this, 2, style, 'numSize')} />
                        </Form.Item>
                        <Form.Item label="字体颜色">
                            <ColorSelect color={style.numColor} setColor={setColor.bind(this, style, 'numColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="内容列表设置" key="4">
                        <Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>} >
                            <InputNumber value={style.contentSize} onChange={changeDetailData.bind(this, 2, style, 'contentSize')} />
                        </Form.Item>
                        <Form.Item label="字体颜色">
                            <ColorSelect color={style.contentColor} setColor={setColor.bind(this, style, 'contentColor')} />
                        </Form.Item>
                        {style.contentList && style.contentList.map((item,index) =>
                            <div key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.contentList, index)}>
                                    {'项' + (index + 1)}
                                </Tag>
                                <Form.Item label="键名">
                                    <Input value={item.key} onChange={changeDetailData.bind(this, 1, item, 'key')} />
                                </Form.Item>
                                <Collapse style={{marginBottom:'1vh'}}>
                                    <Panel header="项背景设置" key="1">
                                        <Form.Item label="渐变角度">
                                            <Slider defaultValue={180} max={180} min={0} value={item.angle} onChange={changeDetailData.bind(this, 2, item, 'angle')} />
                                        </Form.Item>
                                        {this.getColorList(item.boxColor)}
                                        <Form.Item label="">
                                            <Button type="dashed" onClick={addListItem.bind(this, item, 'boxColor', {})}>
                                                <Icon type="plus" /> 添加颜色
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'contentList',{})}>
                                <Icon type="plus"/> 添加内容设置
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
