import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { Form, Input, InputNumber, Collapse, DatePicker, Radio, Tooltip, Switch,Select } from 'antd';
import { changeDetailData, changeDetailDataWithTime, changeDateWithTime } from "../../common/editUtil";

const { Panel } = Collapse;
moment.locale('zh-cn');
export default class Search extends React.Component {
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
                    <Panel header="内容">
                        <Form.Item label="字号" key="3">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="详情内容">
                            <Select value={style.contentName} onChange={changeDetailData.bind(this, 2, style, 'contentName')}>
                                <Select.Option value={'timePeopleCascader'} >人员时间</Select.Option>
                            </Select>
                        </Form.Item>
                    </Panel>
                    <Panel header="次级联表设置" key="4">
                        <Form.Item label="标签名" >
                            <Input value={style.labelKey} onChange={changeDetailData.bind(this, 1, style, 'labelKey')} />
                        </Form.Item>
                        <Form.Item label="值名" >
                            <Input value={style.valueKey} onChange={changeDetailData.bind(this, 1, style, 'valueKey')} />
                        </Form.Item>
                        <Form.Item label="子级名" >
                            <Input value={style.childKey} onChange={changeDetailData.bind(this, 1, style, 'childKey')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="模糊搜索设置" key="5">
                        <Form.Item label="请求地址" >
                            <Input value={style.searchUrl} onChange={changeDetailData.bind(this, 1, style, 'searchUrl')} />
                        </Form.Item>
                        <Form.Item label="键名" >
                            <Input value={style.searchKey} onChange={changeDetailData.bind(this, 1, style, 'searchKey')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="时间初始化设置" key="1">
                        <Form.Item label="是否初始化" >
                            <Switch checked={style.hasDefault} onChange={changeDetailData.bind(this, 2, style, 'hasDefault')} />
                        </Form.Item>
                        <Form.Item label="时间类型" >
                            <Radio.Group value={style.timeType} onChange={changeDetailDataWithTime.bind(this, 1, style, 'timeType', style)}>
                                <Radio.Button value={1}>相对</Radio.Button>
                                <Radio.Button value={2}>固定</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
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
                            style={{ display: style.timeType === 1 ? '' : 'none' }}
                        >
                            <InputNumber value={style.sub} onChange={changeDetailDataWithTime.bind(this, 2, style, 'sub', style)} />
                        </Form.Item>
                        <Form.Item label="开始时间" style={{ display: style.timeType === 2 ? '' : 'none' }}>
                            <DatePicker onChange={changeDateWithTime.bind(this, style, 'startDate', style)} locale={locale} defaultValue={moment(style.startDate, 'YYYY-MM-DD')} />
                        </Form.Item>
                    </Panel>
                    <Panel
                        header={
                            <Tooltip title='设置筛选时传输的开始时间、结束时间、选择内容的键名'>
                                交互设置*
                        </Tooltip>
                        }
                        key="2"
                    >
                        <Form.Item label="开始时间" >
                            <Input value={style.startKey} onChange={changeDetailData.bind(this, 1, style, 'startKey')} />
                        </Form.Item>
                        <Form.Item label="结束时间" >
                            <Input value={style.endKey} onChange={changeDetailData.bind(this, 1, style, 'endKey')} />
                        </Form.Item>
                        <Form.Item label="搜索内容" >
                            <Input value={style.contentKey} onChange={changeDetailData.bind(this, 1, style, 'contentKey')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='时间初始化时是否发送交互事件。'>初始交互*</Tooltip>} >
                            <Switch checked={style.firstSend} onChange={changeDetailData.bind(this, 2, style, 'firstSend')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
