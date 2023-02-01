import React from 'react';
import { Form, Input, Collapse, Tooltip, InputNumber } from 'antd';


import ColorSelect from "../../common/colorSelect";
import {
    changeDetailData,
    setColor,
} from "../../common/editUtil";



const { Panel } = Collapse;

export default class LineTypeOneEdit extends React.Component {
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
        const max = JSON.parse(this.props.data.dataSources.defaultData).length;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础样式设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字色" >
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title="单位为%">滑块的宽*</Tooltip>}>
                            <Input value={style.sliderWidth} onChange={changeDetailData.bind(this, 1, style, 'sliderWidth')} />
                        </Form.Item>
                        <Form.Item label="滑块颜色" >
                            <ColorSelect color={style.sliderColor} setColor={setColor.bind(this, style, 'sliderColor')} />
                        </Form.Item>
                        <Form.Item label="轴颜色" >
                            <ColorSelect color={style.axisColor} setColor={setColor.bind(this, style, 'axisColor')} />
                        </Form.Item>
                        <Form.Item label="按钮颜色" >
                            <ColorSelect color={style.btnColor} setColor={setColor.bind(this, style, 'btnColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="其他设置" key="2">
                        <Form.Item label={<Tooltip title={`最小为1，最大为${max}`}>默认选中*</Tooltip>}>
                            <InputNumber min={1} max={max} value={style.defaultIndex} onChange={changeDetailData.bind(this, 2, style, 'defaultIndex')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title="单位为ms">时间间隔*</Tooltip>}>
                            <Input value={style.time} onChange={changeDetailData.bind(this, 1, style, 'time')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
