import React from 'react';
import { Form, Input, InputNumber, Collapse, Tag, Button, Icon, Switch, Tooltip, Radio, Slider } from 'antd';
import ColorSelect from "../../common/colorSelect";
import { addListItem, getLayerChangeEdit, changeDetailData, deleteListItem, setColor, selectIcon, selectIconOk, selectIconCancel, iconClick } from "../../common/editUtil";
import { getColorList } from "../../common/nameNumEditUtil";
import { fileUrl } from "../../config";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;

export default class NameNumTypeFourEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.itemData = { "name": "", "value": 1 };
        this.getLayerChangeEdit = getLayerChangeEdit.bind(this);
        this.getColorList = getColorList.bind(this);
        this.colorItem = { color: '#000', percent: 100 };
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
                    <Panel header="具体项设置" key="2">
                        <Form.Item label="默认选中项">
                            <Input value={style.selectedIndex} onChange={changeDetailData.bind(this, 1, style, 'selectedIndex')} />
                        </Form.Item>
                        <Form.Item label="排列方向">
                            <Radio.Group value={style.flexDirection} onChange={changeDetailData.bind(this, 1, style, 'flexDirection')}>
                                <Radio value={'row'}>水平方向</Radio>
                                <Radio value={'column'}>垂直方向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.menuList.map((item, index) => {
                            if (item.showList == null) {
                                item.showList = [];
                            }
                            if (item.hideList == null) {
                                item.hideList = [];
                            }
                            return (
                                <div key={index}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.menuList, index)}>
                                        {'项' + (index + 1)}
                                    </Tag>
                                    <Form.Item label="名称">
                                        <Input value={item.name} onChange={changeDetailData.bind(this, 1, item, 'name')} />
                                    </Form.Item>
                                    <Form.Item label="值">
                                        <Input value={item.value} onChange={changeDetailData.bind(this, 1, item, 'value')} />
                                    </Form.Item>
                                    <Form.Item label="图标显示">
                                        <Radio.Group value={item.showImg} onChange={changeDetailData.bind(this, 1, item, 'showImg')}>
                                            <Radio value={1}>显示</Radio>
                                            <Radio value={2}>隐藏</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="标题图标" style={{
                                        display: item.showImg === 1 ? 'block' : 'none',
                                        marginBottom: '0px'
                                    }}>
                                        {
                                            item.beforeImg ? (
                                                <img src={fileUrl + '/download/' + item.beforeImg} alt=""
                                                    style={{ width: '104px', height: '104px' }}
                                                    onClick={selectIcon.bind(this, item, 'beforeImg')} />
                                            ) : (
                                                    <Button type="dashed"
                                                        onClick={selectIcon.bind(this, item, 'beforeImg')}>
                                                        <Icon type="plus" /> 选择图标
                                                    </Button>
                                                )
                                        }
                                    </Form.Item>
                                    <Form.Item label="被选中标题图标" style={{
                                        display: item.showImg === 1 ? 'block' : 'none',
                                        marginBottom: '0px'
                                    }}>
                                        {
                                            item.afterImg ? (
                                                <img src={fileUrl + '/download/' + item.afterImg} alt=""
                                                    style={{ width: '104px', height: '104px' }}
                                                    onClick={selectIcon.bind(this, item, 'afterImg')} />
                                            ) : (
                                                    <Button type="dashed"
                                                        onClick={selectIcon.bind(this, item, 'afterImg')}>
                                                        <Icon type="plus" /> 选择图标
                                                    </Button>
                                                )
                                        }
                                    </Form.Item>
                                    <Form.Item label="图片宽度" style={{ display: item.showImg === 1 ? 'block' : 'none', }}>
                                        <Input value={style.imgWidth} onChange={changeDetailData.bind(this, 1, style, 'imgWidth')} />
                                    </Form.Item>
                                    <Form.Item label="图片高度" style={{ display: item.showImg === 1 ? 'block' : 'none', }}>
                                        <Input value={style.imgHeight} onChange={changeDetailData.bind(this, 1, style, 'imgHeight')} />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title={"地图内需要显示的图层,格式为图层序号组成的json数组。如：[1,3]"}>
                                                地图显示
                                            </Tooltip>
                                        }
                                    >
                                        <Input value={item.mapShow} onChange={changeDetailData.bind(this, 1, item, 'mapShow')} />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title={"地图内需要隐藏的图层,格式为图层序号组成的json数组。如：[1,3]\""}>
                                                地图隐藏
                                            </Tooltip>
                                        }
                                    >
                                        <Input value={item.mapHide} onChange={changeDetailData.bind(this, 1, item, 'mapHide')} />
                                    </Form.Item>
                                    {this.getLayerChangeEdit(item, 'showList', 1)}
                                    {this.getLayerChangeEdit(item, 'hideList', 2)}
                                    <Form.Item label="响应禁用">
                                        <Switch checked={item.clickInteraction}
                                            onChange={changeDetailData.bind(this, 2, item, 'clickInteraction')} />
                                    </Form.Item>
                                </div>
                            )
                        })}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'menuList', this.itemData)}>
                                <Icon type="plus" /> 添加项设置
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="样式设置" key="3">
                        <Form.Item label="框内排列方向">
                            <Radio.Group value={style.inFlexDirection} onChange={changeDetailData.bind(this, 1, style, 'inFlexDirection')}>
                                <Radio value={'row'}>水平方向</Radio>
                                <Radio value={'column'}>垂直方向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="盒内边距">
                            <Input value={style.boxPadding} onChange={changeDetailData.bind(this, 1, style, 'boxPadding')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="选中字色">
                            <ColorSelect color={style.selectedColor} setColor={setColor.bind(this, style, 'selectedColor')} />
                        </Form.Item>
                        <Form.Item label="项最小宽">
                            <InputNumber value={style.minWidth} onChange={changeDetailData.bind(this, 2, style, 'minWidth')} />
                        </Form.Item>
                        <Form.Item label="项内边距">
                            <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                        </Form.Item>
                        <Form.Item label="文字内边距">
                            <Input value={style.textPadding} onChange={changeDetailData.bind(this, 1, style, 'textPadding')} />
                        </Form.Item>
                        <Form.Item label="下划线">
                            <Switch checked={style.showUnderLine}
                                onChange={changeDetailData.bind(this, 2, style, 'showUnderLine')} />
                        </Form.Item>
                        <Form.Item label="下划线形式" style={{ display: style.showUnderLine ? 'block' : 'none' }}>
                            <Radio.Group value={style.allLine} onChange={changeDetailData.bind(this, 1, style, 'allLine')}>
                                <Radio value={1}>全部下划线</Radio>
                                <Radio value={2}>选中下划线</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="下划线格式" style={{ display: style.showUnderLine ? 'block' : 'none' }}>
                            <Radio.Group value={style.lineStyle} onChange={changeDetailData.bind(this, 1, style, 'lineStyle')}>
                                <Radio value={1}>格式一</Radio>
                                <Radio value={2}>格式二</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Collapse style={{ display: style.lineStyle === 2 ? 'block' : 'none' }}>
                            <Panel key="1" header="下划线设置">
                                <Form.Item label="宽度">
                                    <Input value={style.underlineWidth} onChange={changeDetailData.bind(this, 1, style, 'underlineWidth')} />
                                </Form.Item>
                                <Form.Item label="高度">
                                    <Input value={style.underlineHeight} onChange={changeDetailData.bind(this, 1, style, 'underlineHeight')} />
                                </Form.Item>
                                <Form.Item label="圆角">
                                    <Input value={style.underlineRadius} onChange={changeDetailData.bind(this, 1, style, 'underlineRadius')} />
                                </Form.Item>
                                <Form.Item label="颜色类型" >
                                    <Radio.Group value={style.underlineType} onChange={changeDetailData.bind(this, 1, style, 'underlineType')}>
                                        <Radio.Button value={1}>单一色</Radio.Button>
                                        <Radio.Button value={2}>渐变色</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                {style.underlineType !== 2 && (
                                    <Form.Item label="内容背景">
                                        <ColorSelect color={style.underlineBackground} setColor={setColor.bind(this, style, 'underlineBackground')} />
                                    </Form.Item>
                                )}
                                {style.underlineType === 2 && (
                                    <div>
                                        <Form.Item label="渐变角度">
                                            <Slider defaultValue={180} max={180} min={0} value={style.underlineAngle} onChange={changeDetailData.bind(this, 2, style, 'underlineAngle')} />
                                        </Form.Item>
                                        {this.getColorList(style.underlineBoxColor)}
                                        <Form.Item label="">
                                            <Button type="dashed" onClick={addListItem.bind(this, style, 'underlineBoxColor', this.colorItem)}>
                                                <Icon type="plus" /> 添加颜色
                                    </Button>
                                        </Form.Item>
                                    </div>
                                )}
                            </Panel>
                        </Collapse>
                    </Panel>
                    <Panel header="项边框设置" key="6">
                        <Form.Item label="边框宽度">
                            <Input value={style.borderWidth} onChange={changeDetailData.bind(this, 1, style, 'borderWidth')} />
                        </Form.Item>
                        <Form.Item label="边框颜色">
                            <ColorSelect color={style.borderColor} setColor={setColor.bind(this, style, 'borderColor')} />
                        </Form.Item>
                        <Form.Item label="边框圆角">
                            <Input value={style.borderRadius} onChange={changeDetailData.bind(this, 1, style, 'borderRadius')} />
                        </Form.Item>
                        <Form.Item label="边框样式" >
                            <Radio.Group value={style.borderStyle} onChange={changeDetailData.bind(this, 1, style, 'borderStyle')}>
                                <Radio.Button value='solid'>实线</Radio.Button>
                                <Radio.Button value='dashed'>虚线</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="背景设置" key="4">
                        <Form.Item label="全背景">
                            <ColorSelect color={style.allBackgroundColor} setColor={setColor.bind(this, style, 'allBackgroundColor')} />
                        </Form.Item>
                        <Form.Item label="背景圆角">
                            <Input value={style.bgRadius} onChange={changeDetailData.bind(this, 1, style, 'bgRadius')} />
                        </Form.Item>
                        <Form.Item label="外框阴影颜色">
                            <ColorSelect color={style.outShadowColor} setColor={setColor.bind(this, style, 'outShadowColor')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='外框阴影水平偏移距离'>
                                    水平偏移*
                                </Tooltip>
                            }
                        >
                            <Input value={style.outShadowLeft} onChange={changeDetailData.bind(this, 1, style, 'outShadowLeft')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='外框阴影垂直偏移距离'>
                                    垂直偏移*
                                </Tooltip>
                            }
                        >
                            <Input value={style.outShadowTop} onChange={changeDetailData.bind(this, 1, style, 'outShadowTop')} />
                        </Form.Item>
                        <Form.Item label="外框模糊距离" >
                            <Input value={style.outBlur} onChange={changeDetailData.bind(this, 1, style, 'outBlur')} />
                        </Form.Item>
                        <Form.Item label="外框阴影大小" >
                            <Input value={style.outSpread} onChange={changeDetailData.bind(this, 1, style, 'outSpread')} />
                        </Form.Item>
                        <Form.Item label="类型" >
                            <Radio.Group value={style.backgroundColorType} onChange={changeDetailData.bind(this, 1, style, 'backgroundColorType')}>
                                <Radio.Button value={1}>单一色</Radio.Button>
                                <Radio.Button value={2}>渐变色</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {style.backgroundColorType !== 2 && (
                            <Form.Item label="内容背景">
                                <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                            </Form.Item>
                        )}
                        {style.backgroundColorType === 2 && (
                            <div>
                                <Form.Item label="渐变角度">
                                    <Slider defaultValue={180} max={180} min={0} value={style.angle} onChange={changeDetailData.bind(this, 2, style, 'angle')} />
                                </Form.Item>
                                {this.getColorList(style.boxColor)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'boxColor', this.colorItem)}>
                                        <Icon type="plus" /> 添加颜色
                                    </Button>
                                </Form.Item>
                            </div>
                        )}
                    </Panel>
                    <Panel header="选中背景设置" key="5">
                        <Form.Item label="类型" >
                            <Radio.Group value={style.selectedBackgroundColorType} onChange={changeDetailData.bind(this, 1, style, 'selectedBackgroundColorType')}>
                                <Radio.Button value={1}>单一色</Radio.Button>
                                <Radio.Button value={2}>渐变色</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="被选中高度">
                            <Input value={style.height} onChange={changeDetailData.bind(this, 1, style, 'height')} />
                        </Form.Item>
                        <Form.Item label="边框宽度">
                            <Input value={style.selectBorderWidth} onChange={changeDetailData.bind(this, 1, style, 'selectBorderWidth')} />
                        </Form.Item>
                        <Form.Item label="边框颜色">
                            <ColorSelect color={style.selectBorderColor} setColor={setColor.bind(this, style, 'selectBorderColor')} />
                        </Form.Item>
                        <Form.Item label="边框样式" >
                            <Radio.Group value={style.selectBorderStyle} onChange={changeDetailData.bind(this, 1, style, 'selectBorderStyle')}>
                                <Radio.Button value='solid'>实线</Radio.Button>
                                <Radio.Button value='dashed'>虚线</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="类型" >
                            <Radio.Group value={style.svgType} onChange={changeDetailData.bind(this, 1, style, 'svgType')}>
                                <Radio.Button value={1}>svg类型一</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {style.selectedBackgroundColorType !== 2 && (
                            <Form.Item label="背景">
                                <ColorSelect color={style.selectedBackgroundColor} setColor={setColor.bind(this, style, 'selectedBackgroundColor')} />
                            </Form.Item>
                        )}
                        {style.selectedBackgroundColorType === 2 && (
                            <div>
                                <Form.Item label="渐变角度">
                                    <Slider defaultValue={180} max={180} min={0} value={style.selectedAngle} onChange={changeDetailData.bind(this, 2, style, 'selectedAngle')} />
                                </Form.Item>
                                {this.getColorList(style.selectedBoxColor)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'selectedBoxColor', this.colorItem)}>
                                        <Icon type="plus" /> 添加颜色
                                    </Button>
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item label="背景图片" >
                            {
                                style.backgroundImg ? (
                                    <img src={fileUrl + '/download/' + style.backgroundImg} alt=""
                                        style={{ width: '104px', height: '104px' }}
                                        onClick={selectIcon.bind(this, style, 'backgroundImg')} />
                                ) : (
                                        <Button type="dashed"
                                            onClick={selectIcon.bind(this, style, 'backgroundImg')}>
                                            <Icon type="plus" /> 选择图标
                                        </Button>
                                    )
                            }
                        </Form.Item>
                        <Form.Item label="被选中图片" >
                            {
                                style.indexBackgroundImg ? (
                                    <img src={fileUrl + '/download/' + style.indexBackgroundImg} alt=""
                                        style={{ width: '104px', height: '104px' }}
                                        onClick={selectIcon.bind(this, style, 'indexBackgroundImg')} />
                                ) : (
                                        <Button type="dashed"
                                            onClick={selectIcon.bind(this, style, 'indexBackgroundImg')}>
                                            <Icon type="plus" /> 选择图标
                                        </Button>
                                    )
                            }
                        </Form.Item>
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
