import React from 'react';
import { Form, Collapse, Input, InputNumber, Tooltip, Radio } from 'antd';
import {
    changeDetailData
} from "../../common/editUtil";

const { Panel } = Collapse;
export default class NameNumTypeTwentyOneEdit extends React.Component {
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
                        <Form.Item label="排列方向">
                            <Radio.Group value={style.flexDirection} onChange={changeDetailData.bind(this, 1, style, 'flexDirection')}>
                                <Radio value={'row'}>水平方向</Radio>
                                <Radio value={'column'}>垂直方向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="图例">
                            <Radio.Group value={style.legend} onChange={changeDetailData.bind(this, 1, style, 'legend')}>
                                <Radio value={1}>显示</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
