import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {Form, Input, InputNumber, Collapse, DatePicker, Radio, Tooltip, Switch} from 'antd';
import {changeDetailData, changeDetailDataWithTime, changeDateWithTime, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;
moment.locale('zh-cn');

export default class AntdTimeSearchEdit extends React.Component {
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
            <Collapse >
                <Panel header="时间初始化设置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="样式" >
                            <Radio.Group value={style.theme} onChange={changeDetailData.bind(this, 1, style, 'theme')}>
                                <Radio value={0}>样式一(默认)</Radio>
                                <Radio value={1}>样式二</Radio>
                                <Radio value={2}>样式三</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="边框颜色">
                            <ColorSelect color={style.borderColor} setColor={setColor.bind(this, style, 'borderColor')} />
                        </Form.Item>
                        <Form.Item label="边框圆角">
                            <Input value={style.borderRadius} onChange={changeDetailData.bind(this, 1, style, 'borderRadius')} />
                        </Form.Item>
                        <Form.Item label="时分选择" >
                            <Switch checked={style.showTime} onChange={changeDetailData.bind(this, 2, style, 'showTime')}/>
                        </Form.Item>
                        <Form.Item label="是否初始化" >
                            <Switch checked={style.hasDefault} onChange={changeDetailData.bind(this, 2, style, 'hasDefault')}/>
                        </Form.Item>
                        <Form.Item label="框大小" >
                            <Radio.Group value={style.size} onChange={changeDetailData.bind(this, 1, style, 'size')}>
                                <Radio.Button value="large">大</Radio.Button>
                                <Radio.Button value="default">中</Radio.Button>
                                <Radio.Button value="small">小</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="时间类型" >
                            <Radio.Group value={style.timeType} onChange={changeDetailDataWithTime.bind(this, 1, style, 'timeType', style)}>
                                <Radio.Button value={1}>相对</Radio.Button>
                                <Radio.Button value={2}>固定</Radio.Button>
                                <Radio.Button value={3}>今日</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {style.timeType !== 3 && (
                            <>
                                <Form.Item label="结束时间" >
                                    <Radio.Group onChange={changeDetailDataWithTime.bind(this, 1, style, 'endType', style)} value={style.endType}>
                                        <Radio value={'today'}>今日</Radio>
                                        <Radio value={'now'}>本月月末</Radio>
                                        <Radio value={'other'}>
                                            前<InputNumber value={style.last} onChange={changeDetailDataWithTime.bind(this, 2, style, 'last', style)} />个月
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Tooltip title='默认开始时间与结束时间的间隔，单位为月'>
                                            时间间隔*
                                        </Tooltip>
                                    }
                                    style={{display:style.timeType === 1 ? '':'none'}}
                                >
                                    <InputNumber value={style.sub} onChange={changeDetailDataWithTime.bind(this, 2, style, 'sub', style)} />
                                </Form.Item>
                                <Form.Item label="开始时间" style={{display:style.timeType === 2 ? '':'none'}}>
                                    <DatePicker onChange={changeDateWithTime.bind(this,style,'startDate',style)} locale={locale} defaultValue={moment(style.startDate, 'YYYY-MM-DD')}/>
                                </Form.Item>
                            </>
                        )}
                    </Form>
                </Panel>
                <Panel
                    header={
                        <Tooltip title='设置筛选时传输的开始时间、结束时间、选择内容的键名'>
                            交互设置*
                        </Tooltip>
                    }
                    key="2"
                >
                    <Form {...formItemLayout24} >
                        <Form.Item label={<Tooltip title='不默认发送开始时间结束时间。'>不发送默认数据*</Tooltip>} >
                            <Switch checked={style.notSendDefault} onChange={changeDetailData.bind(this, 2, style, 'notSendDefault')}/>
                        </Form.Item>
                        <Form.Item label="开始时间" >
                            <Input value={style.startKey} onChange={changeDetailData.bind(this, 1, style, 'startKey')} />
                        </Form.Item>
                        <Form.Item label="结束时间" >
                            <Input value={style.endKey} onChange={changeDetailData.bind(this, 1, style, 'endKey')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='时间初始化时是否发送交互事件。'>初始交互*</Tooltip>} >
                            <Switch checked={style.firstSend} onChange={changeDetailData.bind(this, 2, style, 'firstSend')}/>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
