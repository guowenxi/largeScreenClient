import React from 'react';
import { Form, Input, Collapse, Radio, Select } from 'antd';
import { changeDetailData, setColor } from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class TimeWeatherEdit extends React.Component {
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
            <Collapse >
                <Panel header="基础配置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字颜色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="字大小" >
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="日期格式" >
                            <Radio.Group value={style.dateType} onChange={changeDetailData.bind(this, 1, style, 'dateType')}>
                                <Radio value={1}>xxxx-xx-xx</Radio>
                                <Radio value={2}>xxxx.xx.xx</Radio>
                                <Radio value={3}>xxxx/xx/xx</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="布局类型">
                            <Select value={style.contentType} onChange={changeDetailData.bind(this, 2, style, 'contentType')}>
                                <Select.Option value={'typeOne'} >类型一</Select.Option>
                                <Select.Option value={'typeTwo'} >类型二</Select.Option>
                                <Select.Option value={'typeThree'} >类型三</Select.Option>
                                <Select.Option value={'typeFour'} >类型四</Select.Option>
                                <Select.Option value={'typeFive'} >类型五</Select.Option>
                                <Select.Option value={'typeSix'} >类型六</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="内容设置" key="2">
                    <Form {...formItemLayout24}>
                        <Form.Item label="年份">
                            <Radio.Group value={style.selectYear} onChange={changeDetailData.bind(this, 1, style, 'selectYear')}>
                                <Radio value={1}>显示</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="日期">
                            <Radio.Group value={style.selectDate} onChange={changeDetailData.bind(this, 1, style, 'selectDate')}>
                                <Radio value={1}>显示</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="时间">
                            <Radio.Group value={style.selectTime} onChange={changeDetailData.bind(this, 1, style, 'selectTime')}>
                                <Radio value={1}>显示</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="温度">
                            <Radio.Group value={style.selectTemperature} onChange={changeDetailData.bind(this, 1, style, 'selectTemperature')}>
                                <Radio value={1}>显示</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="天气">
                            <Radio.Group value={style.selectWeather} onChange={changeDetailData.bind(this, 1, style, 'selectWeather')}>
                                <Radio value={1}>显示</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
