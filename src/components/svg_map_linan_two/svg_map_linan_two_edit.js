import React from 'react';
import {Form, Collapse, Input, Select, Radio, Button, Icon, Tag, InputNumber} from 'antd';
import {addListItem, changeDetailData, deleteListItem, getInteractEdit, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import {getColorSet} from "../../common/nameNumEditUtil";

const { Panel } = Collapse;

export default class SvgMapLinanTwoEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getInteractEdit = getInteractEdit.bind(this);
        this.getColorSet = getColorSet.bind(this);
        this.getInteractEdit = getInteractEdit.bind(this);
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
        if(style.fontColorList == null){
            style.fontColorList = [];
        }
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="样式设置" key="1">
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="底图地区">
                            <Select value={style.areaName} onChange={changeDetailData.bind(this, 2, style, 'areaName')}>
                                <Select.Option value={'linan'} >临安</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="样式">
                            <Select value={style.theme} onChange={changeDetailData.bind(this, 2, style, 'theme')}>
                                <Select.Option value={1} >样式一（默认</Select.Option>
                                <Select.Option value={2} >样式二</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="切换间隔">
                            <Input value={style.time} onChange={changeDetailData.bind(this, 1, style, 'time')} />
                        </Form.Item>
                        <Form.Item label="详情内容">
                            <Select value={style.detailType} onChange={changeDetailData.bind(this, 2, style, 'detailType')}>
                                <Select.Option value={0} >无详情</Select.Option>
                                <Select.Option value={1} >类型一</Select.Option>
                                <Select.Option value={2} >类型二</Select.Option>
                                <Select.Option value={3} >类型三</Select.Option>
                            </Select>
                        </Form.Item>
                    </Panel>
                    <Panel header="切换交互" key="3">
                        {this.getInteractEdit(style.changeInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'changeInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    {(style.detailType === 2 || style.detailType === 3) && (
                        <Panel header="详情内总数点击交互" key="5">
                            {this.getInteractEdit(style.peopleInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'peopleInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {style.detailType === 2 && (
                        <Panel header="详情内预警点击交互" key="4">
                            {this.getInteractEdit(style.eventInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'eventInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    <Panel header="字色设置" key="2">
                        <Form.Item label="字色类型">
                            <Radio.Group value={style.fontColorType} onChange={changeDetailData.bind(this, 1, style, 'fontColorType')}>
                                <Radio value={1}>统一色</Radio>
                                <Radio value={2}>根据字段不同值不同色</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.fontColorType === 1 ? (
                            <Form.Item label="字色" >
                                <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                            </Form.Item>
                        ):(
                            <React.Fragment>
                                <Form.Item label="依据字段" >
                                    <Input value={style.fontColorKey} onChange={changeDetailData.bind(this, 1, style, 'fontColorKey')} />
                                </Form.Item>
                                <Form.Item label="计算方式" >
                                    <Radio.Group size="small" value={style.calculateType}
                                                 onChange={changeDetailData.bind(this, 1, style, 'calculateType')}>
                                        <Radio.Button value={1}>相等</Radio.Button>
                                        <Radio.Button value={2}>区间</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                {this.getColorSet(style.fontColorList,style.calculateType)}
                            </React.Fragment>
                        )}
                    </Panel>
                    <Panel header="区域展示设置" key="6">
                        <Form.Item label="数值键名">
                            <Input value={style.areaNumKey} onChange={changeDetailData.bind(this, 1, style, 'areaNumKey')}/>
                        </Form.Item>
                        {style.areaStyleList && style.areaStyleList.map((item,index) =>
                            <React.Fragment key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.areaStyleList, index)}>
                                    {'样式' + (index + 1)}
                                </Tag>
                                <Form.Item label="大于等于" >
                                    <InputNumber value={item.more} onChange={changeDetailData.bind(this, 2, item, 'more')} />
                                </Form.Item>
                                <Form.Item label="小与" >
                                    <InputNumber value={item.less} onChange={changeDetailData.bind(this, 2, item, 'less')} />
                                </Form.Item>
                                <Form.Item label="区域颜色">
                                    <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'areaStyleList',{})}>
                                <Icon type="plus"/> 添加样式分类
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
