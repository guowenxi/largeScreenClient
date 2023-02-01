import React from 'react';
import {Form, Collapse, Input, Select, Tooltip, InputNumber} from 'antd';
import {changeDetailData} from "../../common/editUtil";

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
                    <Panel header="其他设置" key="2">
                        <Form.Item label="详情接口">
                            <Input value={style.detailUrl} onChange={changeDetailData.bind(this, 1, style, 'detailUrl')}/>
                        </Form.Item>
                        <Form.Item label="详情内容">
                            <Select value={style.detailType} onChange={changeDetailData.bind(this, 2, style, 'detailType')}>
                                <Select.Option value={1} >内容一</Select.Option>
                                <Select.Option value={2} >内容二</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')}/>
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
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
