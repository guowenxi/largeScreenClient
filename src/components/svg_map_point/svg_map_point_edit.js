import React from 'react';
import { Form, Collapse, Input, Button, Icon, Tag, InputNumber, Radio, Switch, Tooltip, Select } from 'antd';
import {
    addListItem,
    changeDetailData,
    deleteListItem, iconClick,
    selectIcon,
    selectIconCancel,
    selectIconOk, setColor
} from "../../common/editUtil";
import { fileUrl } from "../../config";
import FileSelect from "../../common/fileSelect";
import ColorSelect from "../../common/colorSelect";
import { getColorSet } from "../../common/nameNumEditUtil";

const { Panel } = Collapse;

export default class SvgMapPointEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorSet = getColorSet.bind(this);
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
        if (style.legend == null) {

        }
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="地图经纬度范围设置" key="1">
                        <Form.Item label="最小经度">
                            <InputNumber value={style.minX} onChange={changeDetailData.bind(this, 2, style, 'minX')} />
                        </Form.Item>
                        <Form.Item label="最大经度">
                            <InputNumber value={style.maxX} onChange={changeDetailData.bind(this, 2, style, 'maxX')} />
                        </Form.Item>
                        <Form.Item label="最小纬度">
                            <InputNumber value={style.minY} onChange={changeDetailData.bind(this, 2, style, 'minY')} />
                        </Form.Item>
                        <Form.Item label="最大纬度">
                            <InputNumber value={style.maxY} onChange={changeDetailData.bind(this, 2, style, 'maxY')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="图标设置" key="3">
                        <Form.Item label="图标类型">
                            <Radio.Group value={style.iconType} onChange={changeDetailData.bind(this, 1, style, 'iconType')}>
                                <Radio value={1}>类型一</Radio>
                                <Radio value={2}>类型二</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.iconType === 1 && (
                            <React.Fragment>
                                <Form.Item label="图标宽">
                                    <Input value={style.iconWidth} onChange={changeDetailData.bind(this, 1, style, 'iconWidth')} />
                                </Form.Item>
                                <Form.Item label="图标高">
                                    <Input value={style.iconHeight} onChange={changeDetailData.bind(this, 1, style, 'iconHeight')} />
                                </Form.Item>
                                <Form.Item label="内边距">
                                    <Input value={style.iconPadding} onChange={changeDetailData.bind(this, 1, style, 'iconPadding')} />
                                </Form.Item>
                                <Form.Item label="圆角">
                                    <Input value={style.iconRadius} onChange={changeDetailData.bind(this, 1, style, 'iconRadius')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        {style.iconType === 2 && (
                            <Form.Item label="图标大小">
                                <Input value={style.iconSize} onChange={changeDetailData.bind(this, 1, style, 'iconSize')} />
                            </Form.Item>
                        )}
                        <Form.Item label="依据字段">
                            <Input value={style.typeKey} onChange={changeDetailData.bind(this, 1, style, 'typeKey')} />
                        </Form.Item>
                        {style.iconList && style.iconList.map((item, index) =>
                            <div key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.iconList, index)}>
                                    {'图标' + (index + 1)}
                                </Tag>
                                <Form.Item label="值">
                                    <Input value={item.value} onChange={changeDetailData.bind(this, 1, item, 'value')} />
                                </Form.Item>
                                <Form.Item label="名称">
                                    <Input value={item.name} onChange={changeDetailData.bind(this, 1, item, 'name')} />
                                </Form.Item>
                                {style.iconType === 1 && (
                                    <Form.Item label="图标" >
                                        {
                                            item.img ? (
                                                <img alt="选择图标" onClick={selectIcon.bind(this, item, 'img')} src={fileUrl + '/download/' + item.img} style={{ height: '4vh' }} />
                                            ) : (
                                                <Button type="dashed" onClick={selectIcon.bind(this, item, 'img')} >
                                                    <Icon type="plus" /> 选择图标
                                                </Button>
                                            )
                                        }
                                    </Form.Item>
                                )}
                                {style.iconType === 2 && (
                                    <Form.Item label="颜色">
                                        <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                                    </Form.Item>
                                )}
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'iconList', {})}>
                                <Icon type="plus" /> 添加图标设置
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="图标背景色设置" key="2">
                        <Form.Item label="背景类型">
                            <Radio.Group value={style.iconBgType} onChange={changeDetailData.bind(this, 1, style, 'iconBgType')}>
                                <Radio value={1}>单一色</Radio>
                                <Radio value={2}>不同值不同色</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.iconBgType === 2 && (
                            <React.Fragment >
                                <Form.Item label="依据键名">
                                    <Input value={style.dependKey} onChange={changeDetailData.bind(this, 1, style, 'dependKey')} />
                                </Form.Item>
                                <Form.Item label="匹配方式">
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, style, 'subType')} value={style.subType}>
                                        <Radio value={1}>相等</Radio>
                                        <Radio value={2}>区间</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Collapse style={{ marginBottom: '20px' }}>
                                    <Panel header="具体颜色配置" key="1">
                                        {style.iconBgList && style.iconBgList.map((item, index) =>
                                            <React.Fragment key={index}>
                                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.iconBgList, index)}>{'颜色' + (index + 1)}</Tag>
                                                {style.subType === 1 &&
                                                    <Form.Item label="值" >
                                                        <Input value={item.num} onChange={changeDetailData.bind(this, 1, item, 'num')} />
                                                    </Form.Item>
                                                }
                                                {style.subType === 2 &&
                                                    <Form.Item label="大于等于" >
                                                        <InputNumber min={1} value={item.more} onChange={changeDetailData.bind(this, 2, item, 'more')} />
                                                    </Form.Item>
                                                }
                                                {style.subType === 2 &&
                                                    <Form.Item label="小与" >
                                                        <InputNumber min={1} value={item.less} onChange={changeDetailData.bind(this, 2, item, 'less')} />
                                                    </Form.Item>
                                                }
                                                <Form.Item label="颜色">
                                                    <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                                                </Form.Item>
                                            </React.Fragment>
                                        )}
                                        <Form.Item label="">
                                            <Button type="dashed" onClick={addListItem.bind(this, style, 'iconBgList', {})}>
                                                <Icon type="plus" /> 添加颜色
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                            </React.Fragment>
                        )}
                        {style.iconBgType === 1 && (
                            <Form.Item label="颜色">
                                <ColorSelect color={style.iconBgColor} setColor={setColor.bind(this, style, 'iconBgColor')} />
                            </Form.Item>
                        )}
                    </Panel>
                    <Panel header="选中图标设置" key="6">
                        <Form.Item label="点击开启">
                            <Radio.Group value={style.selectchange} onChange={changeDetailData.bind(this, 1, style, 'selectchange')}>
                                <Radio value={1}>开启</Radio>
                                <Radio value={2}>关闭</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="图标类型">
                            <Radio.Group value={style.selectIconType} onChange={changeDetailData.bind(this, 1, style, 'selectIconType')}>
                                <Radio value={1}>类型一</Radio>
                                <Radio value={2}>类型二</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.selectIconType === 1 && (
                            <React.Fragment>
                                <Form.Item label="图标宽">
                                    <Input value={style.selectIconWidth} onChange={changeDetailData.bind(this, 1, style, 'selectIconWidth')} />
                                </Form.Item>
                                <Form.Item label="图标高">
                                    <Input value={style.selectIconHeight} onChange={changeDetailData.bind(this, 1, style, 'selectIconHeight')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        {style.selectIconType === 2 && (
                            <Form.Item label="图标大小">
                                <Input value={style.selectIconSize} onChange={changeDetailData.bind(this, 1, style, 'selectIconSize')} />
                            </Form.Item>
                        )}
                        <Form.Item label="依据字段">
                            <Input value={style.selectTypeKey} onChange={changeDetailData.bind(this, 1, style, 'selectTypeKey')} />
                        </Form.Item>
                        {style.selectIconList && style.selectIconList.map((item, index) =>
                            <div key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.selectIconList, index)}>
                                    {'图标' + (index + 1)}
                                </Tag>
                                <Form.Item label="值">
                                    <Input value={item.value} onChange={changeDetailData.bind(this, 1, item, 'value')} />
                                </Form.Item>
                                <Form.Item label="名称">
                                    <Input value={item.name} onChange={changeDetailData.bind(this, 1, item, 'name')} />
                                </Form.Item>
                                {style.selectIconType === 1 && (
                                    <Form.Item label="图标" >
                                        {
                                            item.img ? (
                                                <img alt="选择图标" onClick={selectIcon.bind(this, item, 'img')} src={fileUrl + '/download/' + item.img} style={{ height: '4vh' }} />
                                            ) : (
                                                <Button type="dashed" onClick={selectIcon.bind(this, item, 'img')} >
                                                    <Icon type="plus" /> 选择图标
                                                </Button>
                                            )
                                        }
                                    </Form.Item>
                                )}
                                {style.selectIconType === 2 && (
                                    <Form.Item label="颜色">
                                        <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                                    </Form.Item>
                                )}
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'selectIconList', {})}>
                                <Icon type="plus" /> 添加图标设置
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="地图设置" key="4">
                        <Form.Item label="区域">
                            <Select value={style.area} onChange={changeDetailData.bind(this, 2, style, 'area')}>
                                <Select.Option value={'shangcheng'} >上城区</Select.Option>
                                <Select.Option value={'datong'} >大同</Select.Option>
                                <Select.Option value={'longwan'} >龙湾</Select.Option>
                                <Select.Option value={'longwanTwo'} >龙湾-白</Select.Option>
                                <Select.Option value={'nanxing'} >南星</Select.Option>
                                <Select.Option value={'linan'} >临安</Select.Option>
                                <Select.Option value={'yueqing'} >乐清</Select.Option>
                                <Select.Option value={'wenzhou'} >温州</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="宽">
                            <Input value={style.width} onChange={changeDetailData.bind(this, 1, style, 'width')} />
                        </Form.Item>
                        <Form.Item label="高">
                            <Input value={style.height} onChange={changeDetailData.bind(this, 1, style, 'height')} />
                        </Form.Item>
                        <Form.Item label="上">
                            <Input value={style.top} onChange={changeDetailData.bind(this, 1, style, 'top')} />
                        </Form.Item>
                        <Form.Item label="左">
                            <Input value={style.left} onChange={changeDetailData.bind(this, 1, style, 'left')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="打点区域设置" key="7">
                        <Form.Item label="宽">
                            <Input value={style.pointWidth} onChange={changeDetailData.bind(this, 1, style, 'pointWidth')} />
                        </Form.Item>
                        <Form.Item label="高">
                            <Input value={style.pointHeight} onChange={changeDetailData.bind(this, 1, style, 'pointHeight')} />
                        </Form.Item>
                        <Form.Item label="上">
                            <Input value={style.pointTop} onChange={changeDetailData.bind(this, 1, style, 'pointTop')} />
                        </Form.Item>
                        <Form.Item label="左">
                            <Input value={style.pointLeft} onChange={changeDetailData.bind(this, 1, style, 'pointLeft')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="图例设置" key="5">
                        <Form.Item label="是否显示" >
                            <Switch checked={style.legendShow} onChange={changeDetailData.bind(this, 2, style, 'legendShow')} />
                        </Form.Item>
                        <Form.Item label="图例框样式">
                            <Radio.Group value={style.legendBox} onChange={changeDetailData.bind(this, 1, style, 'legendBox')}>
                                <Radio value={1}>默认</Radio>
                                <Radio value={2}>样式一</Radio>
                                <Radio value={3}>样式三</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字号" >
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Collapse >
                            <Panel header="大小位置设置" key="1">
                                <Form.Item label="宽">
                                    <Input value={style.widthLegend} onChange={changeDetailData.bind(this, 1, style, 'widthLegend')} />
                                </Form.Item>
                                <Form.Item label="高">
                                    <Input value={style.heightLegend} onChange={changeDetailData.bind(this, 1, style, 'heightLegend')} />
                                </Form.Item>
                                <Form.Item label="上">
                                    <Input value={style.topLegend} onChange={changeDetailData.bind(this, 1, style, 'topLegend')} />
                                </Form.Item>
                                <Form.Item label="下">
                                    <Input value={style.bottomLegend} onChange={changeDetailData.bind(this, 1, style, 'bottomLegend')} />
                                </Form.Item>
                                <Form.Item label="左">
                                    <Input value={style.leftLegend} onChange={changeDetailData.bind(this, 1, style, 'leftLegend')} />
                                </Form.Item>
                                <Form.Item label="右">
                                    <Input value={style.rightLegend} onChange={changeDetailData.bind(this, 1, style, 'rightLegend')} />
                                </Form.Item>
                            </Panel>
                            <Panel header="标题设置" key="2">
                                <Form.Item label="标题内容">
                                    <Input value={style.title} onChange={changeDetailData.bind(this, 1, style, 'title')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>}>
                                    <InputNumber value={style.titleFontSize} onChange={changeDetailData.bind(this, 2, style, 'titleFontSize')} />
                                </Form.Item>
                                <Form.Item label="字色">
                                    <ColorSelect color={style.titleColor} setColor={setColor.bind(this, style, 'titleColor')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位em。'>标题高*</Tooltip>}>
                                    <InputNumber value={style.titleHeight} onChange={changeDetailData.bind(this, 2, style, 'titleHeight')} />
                                </Form.Item>
                            </Panel>
                            <Panel header="内容设置" key="3">
                                <Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>}>
                                    <InputNumber value={style.contentFontSize} onChange={changeDetailData.bind(this, 2, style, 'contentFontSize')} />
                                </Form.Item>
                                <Form.Item label="字色">
                                    <ColorSelect color={style.contentColor} setColor={setColor.bind(this, style, 'contentColor')} />
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Panel>
                </Collapse>
                <FileSelect
                    title="图标选择"
                    visible={this.state.visible}
                    onOk={selectIconOk.bind(this)}
                    onCancel={selectIconCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    imgSelect={iconClick.bind(this)} token={this.props.token}
                    width={650}
                />
            </Form>
        );
    }
}
