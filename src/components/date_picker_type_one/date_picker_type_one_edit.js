import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {Form, Input, InputNumber, Collapse, DatePicker, Radio, Tooltip} from 'antd';
import {changeDetailData, changeDetailDataWithTime, changeDateWithTime} from "../../common/editUtil";

const { Panel } = Collapse;
moment.locale('zh-cn');

export default class BoxTypeTwoEdit extends React.Component {
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
                <Panel header="基础配置" key="1">
                    <Form {...formItemLayout24} >
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
                            style={{display:style.timeType === 1 ? '':'none'}}
                        >
                            <InputNumber value={style.sub} onChange={changeDetailDataWithTime.bind(this, 2, style, 'sub', style)} />
                        </Form.Item>
                        <Form.Item label="开始时间" style={{display:style.timeType === 2 ? '':'none'}}>
                            <DatePicker onChange={changeDateWithTime.bind(this,style,'startDate',style)} locale={locale} defaultValue={moment(style.startDate, 'YYYY-MM-DD')}/>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel
                    header={
                        <Tooltip title='设置时间选择时传输的开始时间与结束时间的键名'>
                            交互设置*
                        </Tooltip>
                    }
                    key="2"
                >
                    <Form {...formItemLayout24} >
                        <Form.Item label="开始时间" >
                            <Input value={style.startKey} onChange={changeDetailData.bind(this, 1, style, 'startKey')} />
                        </Form.Item>
                        <Form.Item label="结束时间" >
                            <Input value={style.endKey} onChange={changeDetailData.bind(this, 1, style, 'endKey')} />
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
