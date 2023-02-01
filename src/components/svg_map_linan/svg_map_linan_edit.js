import React from 'react';
import {Form, Collapse, Input, Button, Icon, Tag, InputNumber, Radio, Select} from 'antd';
import {addListItem, changeDetailData, deleteListItem} from "../../common/editUtil";

const { Panel } = Collapse;

export default class SvgMapLinanEdit extends React.Component {
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
                    <Panel header="圆环大小设置" key="1">
                        <Form.Item label="依据字段">
                            <Input value={style.baseKey}
                                   onChange={changeDetailData.bind(this, 1, style, 'baseKey')}/>
                        </Form.Item>
                        {style.circleSizeList && style.circleSizeList.map((circleSize,index) =>
                            <div key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.circleSizeList, index)}>
                                    {'尺寸' + (index + 1)}
                                </Tag>
                                <Form.Item label="大于等于" >
                                    <InputNumber min={1} value={circleSize.bottom} onChange={changeDetailData.bind(this, 2, circleSize, 'bottom')} />
                                </Form.Item>
                                <Form.Item label="小与" >
                                    <InputNumber min={1} value={circleSize.top} onChange={changeDetailData.bind(this, 2, circleSize, 'top')} />
                                </Form.Item>
                                {/*<Form.Item label="图标大小">*/}
                                {/*    <Input value={circleSize.size} onChange={changeDetailData.bind(this, 1, circleSize, 'size')} />*/}
                                {/*</Form.Item>*/}
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'circleSizeList',{})}>
                                <Icon type="plus"/> 添加尺寸分类
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="其他设置" key="2">
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')}/>
                        </Form.Item>
                        <Form.Item label="图形类型">
                            <Radio.Group value={style.svgType} onChange={changeDetailData.bind(this, 1, style, 'svgType')}>
                                <Radio.Button value="path">path</Radio.Button>
                                <Radio.Button value="polygon">polygon</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="底图地区">
                            <Select value={style.areaName} onChange={changeDetailData.bind(this, 2, style, 'areaName')}>
                                <Select.Option value={'linan'} >临安</Select.Option>
                                <Select.Option value={'jiande'} >建德</Select.Option>
                            </Select>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
