import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import {Form, Collapse, DatePicker, Radio, Switch, Tooltip, Input} from 'antd';
import {changeDetailData, changeDetailDataWithTime, changeDateWithTime} from "../../common/editUtil";
import YearPicker from "../../common/yearPicker";

const { Panel } = Collapse;
moment.locale('zh-cn');

export default class AntdTimeSearchEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {defaultDate:moment(new Date())};
        this.textNow = ['','本年','本月','本日','本周','本季'];
        this.textLast = ['','去年','上月','昨日','上周','上季'];
    }

    componentDidMount() {
        const { style } = this.props.data;
        if(style.defaultDate){
            this.setState({defaultDate:moment(style.defaultDate, 'YYYY-MM-DD')});
        }
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
            <Collapse className='editBox'>
                <Panel header="时间初始化设置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="样式" >
                            <Radio.Group value={style.theme} onChange={changeDetailData.bind(this, 1, style, 'theme')}>
                                <Radio.Button value={0}>样式一</Radio.Button>
                                <Radio.Button value={1}>样式二</Radio.Button>
                                <Radio.Button value={2}>样式三</Radio.Button>
                                <Radio.Button value={4}>样式五</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="框大小" >
                            <Radio.Group value={style.size} onChange={changeDetailData.bind(this, 1, style, 'size')}>
                                <Radio.Button value="large">大</Radio.Button>
                                <Radio.Button value="default">中</Radio.Button>
                                <Radio.Button value="small">小</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="显示格式" >
                            <Radio.Group value={style.formatType} onChange={changeDetailData.bind(this, 1, style, 'formatType')}>
                                <Radio.Button value={1}>xxxx年xx月xx日</Radio.Button>
                                <Radio.Button value={2}>xxxx/xx/xx</Radio.Button>
                                <Radio.Button value={3}>xxxx-xx-xx</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="选择类型" >
                            <Radio.Group value={style.timeType} onChange={changeDetailDataWithTime.bind(this, 1, style, 'timeType', style)}>
                                <Radio.Button value={1}>选择年</Radio.Button>
                                <Radio.Button value={2}>选择月</Radio.Button>
                                <Radio.Button value={3}>选择日</Radio.Button>
                                <Radio.Button value={4}>选择周</Radio.Button>
                                <Radio.Button value={5}>选择季</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="是否初始化" >
                            <Switch checked={style.hasDefault} onChange={changeDetailData.bind(this, 2, style, 'hasDefault')}/>
                        </Form.Item>
                        <Form.Item label="初始化时间" >
                            <Radio.Group onChange={changeDetailDataWithTime.bind(this, 1, style, 'defaultType', style)} value={style.defaultType}>
                                <Radio value={'now'}>{this.textNow[style.timeType]}</Radio>
                                <Radio value={'last'}>{this.textLast[style.timeType]}</Radio>
                                <Radio value={'other'}>
                                    {style.timeType === 1 && <YearPicker value={this.state.defaultDate} onChange={changeDateWithTime.bind(this,style,'defaultDate',style)} locale={locale} />}
                                    {(style.timeType === 2 || style.timeType === 5) && <DatePicker.MonthPicker value={this.state.defaultDate} onChange={changeDateWithTime.bind(this,style,'defaultDate',style)} locale={locale} />}
                                    {style.timeType === 3 && <DatePicker value={this.state.defaultDate} onChange={changeDateWithTime.bind(this,style,'defaultDate',style)} locale={locale} />}
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="其他设置" key="2">
                    <Form {...formItemLayout24} >
                        <Form.Item label={<Tooltip title='时间初始化时是否发送交互事件。'>初始交互*</Tooltip>} >
                            <Switch checked={style.firstSend} onChange={changeDetailData.bind(this, 2, style, 'firstSend')}/>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='交互事件是否携带日期区间数据。'>日期区间*</Tooltip>} >
                            <Switch checked={style.dateArea} onChange={changeDetailData.bind(this, 2, style, 'dateArea')}/>
                        </Form.Item>
                        <Form.Item label="数据格式">
                            <Input value={style.format} onChange={changeDetailData.bind(this, 1, style, 'format')} />
                        </Form.Item>
                        {/*<Form.Item label="数据类型" >*/}
                        {/*    <Radio.Group value={style.dataType} onChange={changeDetailDataWithTime.bind(this, 1, style, 'dataType', style)}>*/}
                        {/*        <Radio.Button value={1}>所选时间字串</Radio.Button>*/}
                        {/*        <Radio.Button value={2}>所选时间区间</Radio.Button>*/}
                        {/*    </Radio.Group>*/}
                        {/*    {style.dataType === 2 && (*/}
                        {/*        <React.Fragment>*/}
                        {/*            <Form.Item label="开始键名" >*/}
                        {/*                <Input value={style.startKey} onChange={changeDetailData.bind(this, 1, style, 'startKey')} />*/}
                        {/*            </Form.Item>*/}
                        {/*            <Form.Item label="结束键名" >*/}
                        {/*                <Input value={style.endKey} onChange={changeDetailData.bind(this, 1, style, 'endKey')} />*/}
                        {/*            </Form.Item>*/}
                        {/*        </React.Fragment>*/}
                        {/*    )}*/}
                        {/*</Form.Item>*/}
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
