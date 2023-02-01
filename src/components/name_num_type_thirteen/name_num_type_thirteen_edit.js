import React from 'react';
import { Form, Input, InputNumber, Collapse, Tooltip, Tag, Radio, Button, Icon, Slider, Switch } from 'antd';
import ColorSelect from "../../common/colorSelect";
import { changeDetailData, setColor, selectIcon, selectIconOk, selectIconCancel, iconClick, addListItemWithoutKey, deleteListItem, addListItem } from "../../common/editUtil";
import { getColorSet, getItemStyleEdit, getColorList } from "../../common/nameNumEditUtil";
import { fileUrl } from "../../config";
import FileSelect from "../../common/fileSelect";
import cssStyle from "./name_num_type_thirteen.module.css";


const { Panel } = Collapse;

export default class NameNumTypeSixEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false };
        this.iconItem = { num: 1, icon: '' };
        this.item = {
            key: "name",
            fontSize: 1,
            fontColorType: 1,//1为固定色,2为根据某字段不同值不同色,3为根据序号不同值不同色
            fontColor: "#fff",
            fontColorKey: "type",
            fontColorList: [{ num: 1, color: 'rgb(61,219,88)' }, { num: 2, color: 'rgb(1,160,249)' }, { num: 3, color: 'rgb(214,55,25)' }],
        };
        this.colorItemOne = { num: 1, color: 'rgb(61,219,88)' };
        this.colorItemTwo = { bottom: 1, top: 2, color: 'rgb(61,219,88)' };
        this.getColorSet = getColorSet.bind(this);
        this.getItemStyleEdit = getItemStyleEdit.bind(this);
        this.getColorList = getColorList.bind(this);
        this.colorItem = { color: '#000', percent: 100 };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    getListItemBoxEdit(item, type) {
        return item && item.map((one, index) =>
            <div key={index}>
                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item, index)}>{(type === 1 ? '标题' : '数值') + (index + 1)}</Tag>
                {this.getItemStyleEdit(one, false)}
            </div>
        );
    }

    getIconSet(list, display) {
        return (
            <Collapse style={{ display, marginBottom: '20px' }}>
                <Panel header="图标列表" key="1">
                    {list.map((item, index) =>
                        <div key={index}>
                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, list, index)}>{'列' + (index + 1)}</Tag>
                            <Form.Item label="值">
                                <Input value={item.num} onChange={changeDetailData.bind(this, 1, item, 'num')} />
                            </Form.Item>
                            <Form.Item label="图标" >
                                {
                                    item.icon ? (
                                        <img alt="" onClick={selectIcon.bind(this, item, 'icon')} src={fileUrl + '/download/' + item.icon} className={cssStyle.iconEdit} />
                                    ) : (
                                            <Button type="dashed" onClick={selectIcon.bind(this, item, 'icon')} >
                                                <Icon type="plus" /> 选择图标
                                            </Button>
                                        )
                                }
                            </Form.Item>
                        </div>
                    )}
                    <Form.Item label="">
                        <Button type="dashed"
                            onClick={addListItemWithoutKey.bind(this, list, this.iconItem)}>
                            <Icon type="plus" /> 添加图标设置
                        </Button>
                    </Form.Item>
                </Panel>
            </Collapse>
        );
    }


    getSubSet(style, sub) {
        return (
            <Collapse >
                <Panel header={"列表基础设置"} key="1">
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
                    <Form.Item label="背景色">
                        <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                    </Form.Item>
                    <Form.Item label="宽">
                        <Input value={sub.width} onChange={changeDetailData.bind(this, 1, sub, 'width')} />
                    </Form.Item>
                    <Form.Item label="高">
                        <Input value={sub.height} onChange={changeDetailData.bind(this, 1, sub, 'height')} />
                    </Form.Item>
                    <Form.Item label="左">
                        <Input value={sub.left} onChange={changeDetailData.bind(this, 1, sub, 'left')} />
                    </Form.Item>
                    <Form.Item label="上">
                        <Input value={sub.top} onChange={changeDetailData.bind(this, 1, sub, 'top')} />
                    </Form.Item>
                </Panel>
                <Panel header={"列表项内容样式设置"} key="6">
                    <Form.Item label="标题宽">
                        <Input value={style.nameWidth} onChange={changeDetailData.bind(this, 1, style, 'nameWidth')} />
                    </Form.Item>
                    <Form.Item label="标题高">
                        <Input value={style.nameHeight} onChange={changeDetailData.bind(this, 1, style, 'nameHeight')} />
                    </Form.Item>
                    <Form.Item label="标题背景">
                        <ColorSelect color={style.nameBackgroundColor} setColor={setColor.bind(this, style, 'nameBackgroundColor')} />
                    </Form.Item>
                    <Form.Item label="数值宽">
                        <Input value={style.numWidth} onChange={changeDetailData.bind(this, 1, style, 'numWidth')} />
                    </Form.Item>
                    <Form.Item label="数值高">
                        <Input value={style.numHeight} onChange={changeDetailData.bind(this, 1, style, 'numHeight')} />
                    </Form.Item>
                    <Form.Item label="数值背景">
                        <ColorSelect color={style.numBackgroundColor} setColor={setColor.bind(this, style, 'numBackgroundColor')} />
                    </Form.Item>
                    <Form.Item label="边框线宽" >
                        <Input value={style.borderWidth} onChange={changeDetailData.bind(this, 1, style, 'borderWidth')} />
                    </Form.Item>
                    <Form.Item label="边框颜色" >
                        <ColorSelect color={style.borderColor} setColor={setColor.bind(this, style, 'borderColor')} />
                    </Form.Item>
                    <Form.Item label="边框类型" >
                        <Radio.Group value={style.borderStyle} onChange={changeDetailData.bind(this, 1, style, 'borderStyle')}>
                            <Radio value="solid">实线</Radio>
                            <Radio value="dashed">虚线1</Radio>
                            <Radio value="dotted">虚线2</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="排列方向">
                        <Radio.Group value={style.itemFlexDirection} onChange={changeDetailData.bind(this, 1, style, 'itemFlexDirection')}>
                            <Radio value={'row'}>从左到右</Radio>
                            <Radio value={'column'}>从上到下</Radio>
                            <Radio value={'row-reverse'}>从右到左</Radio>
                            <Radio value={'column-reverse'}>从下到上</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title='单位em。'>
                                内边距*
                                </Tooltip>
                        }
                    >
                        <InputNumber value={style.padding} onChange={changeDetailData.bind(this, 2, style, 'padding')} />
                    </Form.Item>
                </Panel>
                <Panel header={"列表标题设置"} key="2">
                    <Form.Item label="水平位置" >
                        <Radio.Group value={style.nameJustifyContent} onChange={changeDetailData.bind(this, 1, style, 'nameJustifyContent')}>
                            <Radio.Button value="flex-start">居左</Radio.Button>
                            <Radio.Button value="center">居中</Radio.Button>
                            <Radio.Button value="flex-end">居右</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="垂直位置" >
                        <Radio.Group value={style.nameAlignItems} onChange={changeDetailData.bind(this, 1, style, 'nameAlignItems')}>
                            <Radio.Button value="flex-start">居上</Radio.Button>
                            <Radio.Button value="center">居中</Radio.Button>
                            <Radio.Button value="flex-end">居下</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Collapse style={{ marginBottom: '1vh' }}>
                        <Panel header={"图标设置"} key="1">
                            <Form.Item label="是否显示" >
                                <Switch checked={style.nameIconShow}
                                    onChange={changeDetailData.bind(this, 2, style, 'nameIconShow')} />
                            </Form.Item>
                            <Form.Item label="大小">
                                <InputNumber value={style.nameIconSize} onChange={changeDetailData.bind(this, 2, style, 'nameIconSize')} />
                            </Form.Item>
                            <Form.Item label="空隙">
                                <InputNumber value={style.nameIconGap} onChange={changeDetailData.bind(this, 2, style, 'nameIconGap')} />
                            </Form.Item>
                            <Form.Item label="图标样式">
                                <Radio.Group value={style.nameIconType} onChange={changeDetailData.bind(this, 1, style, 'nameIconType')}>
                                    <Radio value={0}>样式一</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                    {this.getListItemBoxEdit(style.nameList, 1)}
                    <Form.Item label="">
                        <Button type="dashed"
                            onClick={addListItem.bind(this, style, 'nameList', this.item)}>
                            <Icon type="plus" /> 添加标题
                            </Button>
                    </Form.Item>
                </Panel>
                <Panel header={"列表标题分隔符设置"} key="3">
                    {this.getItemStyleEdit(style.nameSplit, true)}
                </Panel>
                <Panel header={"列表数值设置"} key="4">
                    <Form.Item label="水平位置" >
                        <Radio.Group value={style.numJustifyContent} onChange={changeDetailData.bind(this, 1, style, 'numJustifyContent')}>
                            <Radio.Button value="flex-start">居左</Radio.Button>
                            <Radio.Button value="center">居中</Radio.Button>
                            <Radio.Button value="flex-end">居右</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="垂直位置" >
                        <Radio.Group value={style.numAlignItems} onChange={changeDetailData.bind(this, 1, style, 'numAlignItems')}>
                            <Radio.Button value="flex-start">居上</Radio.Button>
                            <Radio.Button value="center">居中</Radio.Button>
                            <Radio.Button value="flex-end">居下</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title='控制数字超过三位数时,分隔符是否显示。'>
                                分隔符*
                                </Tooltip>
                        }
                    >
                        <Switch checked={style.numSplitShow}
                            onChange={changeDetailData.bind(this, 2, style, 'numSplitShow')} />
                    </Form.Item>
                    {this.getListItemBoxEdit(style.numList, 2)}
                    <Form.Item label="">
                        <Button type="dashed"
                            onClick={addListItem.bind(this, style, 'numList', this.item)}>
                            <Icon type="plus" /> 添加数值
                            </Button>
                    </Form.Item>
                </Panel>
                <Panel header={"列表数值分隔符设置"} key="5">
                    {this.getItemStyleEdit(style.numSplit, true)}
                </Panel>
                <Panel header={"项背景色"} key="7">
                    <Form.Item label="渐变角度">
                        <Slider defaultValue={180} max={180} min={0} value={style.angle} onChange={changeDetailData.bind(this, 2, style, 'angle')} />
                    </Form.Item>
                    {this.getColorList(style.boxColor)}
                    <Form.Item label="">
                        <Button type="dashed" onClick={addListItem.bind(this, style, 'boxColor', this.colorItem)}>
                            <Icon type="plus" /> 添加颜色
                            </Button>
                    </Form.Item>
                </Panel>
                <Panel header={"分割线"} key="8">
                    <Form.Item label="线宽">
                        <Input value={style.lineWidth} onChange={changeDetailData.bind(this, 1, style, 'lineWidth')} />
                    </Form.Item>
                    <Form.Item label="渐变类型" >
                        <Radio.Group value={style.lineGradientType} onChange={changeDetailData.bind(this, 1, style, 'lineGradientType')}>
                            <Radio.Button value="radial">径向</Radio.Button>
                            <Radio.Button value="linear">线性</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {style.lineGradientType === 'linear' && (
                        <Form.Item label="渐变角度">
                            <Slider defaultValue={180} max={180} min={0} value={style.lineAngle} onChange={changeDetailData.bind(this, 2, style, 'lineAngle')} />
                        </Form.Item>
                    )}
                    <Form.Item label="头部线长">
                        <InputNumber value={style.startLineLong} onChange={changeDetailData.bind(this, 2, style, 'startLineLong')} />
                    </Form.Item>
                    <Form.Item label="项间线长">
                        <InputNumber value={style.splitLineLong} onChange={changeDetailData.bind(this, 2, style, 'splitLineLong')} />
                    </Form.Item>
                    <Form.Item label="尾部线长">
                        <InputNumber value={style.endLineLong} onChange={changeDetailData.bind(this, 2, style, 'endLineLong')} />
                    </Form.Item>
                    {this.getColorList(style.lineColor)}
                    <Form.Item label="">
                        <Button type="dashed" onClick={addListItem.bind(this, style, 'lineColor', this.colorItem)}>
                            <Icon type="plus" /> 添加颜色
                            </Button>
                    </Form.Item>
                </Panel>
            </Collapse>
        )
    }


    render() {
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        const { icon, title, outRow, sub } = style;
        return (
            <div>
                <Form {...formItemLayout24} >
                    <Collapse>
                        <Panel header={"列表基础设置"} key="1">
                            <Form.Item label="列数">
                                <InputNumber value={outRow.columnNum} onChange={changeDetailData.bind(this, 2, outRow, 'columnNum')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='列之间的空隙，单位为%（组件宽度的百分比）。'>
                                        列空隙*
                                </Tooltip>
                                }
                            >
                                <InputNumber value={outRow.columnGap} onChange={changeDetailData.bind(this, 2, outRow, 'columnGap')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='行之间的空隙，单位为%（组件高度的百分比）。'>
                                        行空隙*
                                </Tooltip>
                                }
                            >
                                <InputNumber value={outRow.rowGap} onChange={changeDetailData.bind(this, 2, outRow, 'rowGap')} />
                            </Form.Item>
                            <Form.Item label="排列方向">
                                <Radio.Group value={outRow.flexDirection} onChange={changeDetailData.bind(this, 1, outRow, 'flexDirection')}>
                                    <Radio value={'row'}>水平方向</Radio>
                                    <Radio value={'column'}>垂直方向</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="背景色">
                                <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                            </Form.Item>
                            <Form.Item label="列表背景色">
                                <ColorSelect color={outRow.allBackgroundColor} setColor={setColor.bind(this, outRow, 'allBackgroundColor')} />
                            </Form.Item>
                            <Form.Item label="是否有空行">
                                <Switch checked={style.emptyShow}
                                    onChange={changeDetailData.bind(this, 2, style, 'emptyShow')} />
                            </Form.Item>
                            <Form.Item label="首行数量" style={{display:style.emptyShow===false?"none":""}}>
                                <InputNumber value={style.startEmptyNumber} onChange={changeDetailData.bind(this, 2, style, 'startEmptyNumber')} />
                            </Form.Item>
                            <Form.Item label="尾行数量" style={{display:style.emptyShow===false?"none":""}}>
                                <InputNumber value={style.endEmptyNumber} onChange={changeDetailData.bind(this, 2, style, 'endEmptyNumber')} />
                            </Form.Item>
                            <Form.Item label="文字大小">
                                <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                            </Form.Item>
                        </Panel>
                        <Panel header="图片设置" key="2">
                            <Form.Item label="图标依据字段">
                                <Input value={icon.iconKey} onChange={changeDetailData.bind(this, 1, icon, 'iconKey')} />
                            </Form.Item>
                            {this.getIconSet(icon.iconList)}
                            <Form.Item label="图片宽度">
                                <Input value={icon.width} onChange={changeDetailData.bind(this, 1, icon, 'width')} />
                            </Form.Item>
                            <Form.Item label="图片高度">
                                <Input value={icon.height} onChange={changeDetailData.bind(this, 1, icon, 'height')} />
                            </Form.Item>
                            <Form.Item label="左">
                                <Input value={icon.left} onChange={changeDetailData.bind(this, 1, icon, 'left')} />
                            </Form.Item>
                            <Form.Item label="上">
                                <Input value={icon.top} onChange={changeDetailData.bind(this, 1, icon, 'top')} />
                            </Form.Item>
                        </Panel>
                        <Panel header="标题设置" key="3">
                            <Form.Item label="水平位置" >
                                <Radio.Group value={title.titleJustifyContent} onChange={changeDetailData.bind(this, 1, title, 'titleJustifyContent')}>
                                    <Radio.Button value="flex-start">居左</Radio.Button>
                                    <Radio.Button value="center">居中</Radio.Button>
                                    <Radio.Button value="flex-end">居右</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="垂直位置" >
                                <Radio.Group value={title.titleAlignItems} onChange={changeDetailData.bind(this, 1, title, 'titleAlignItems')}>
                                    <Radio.Button value="flex-start">居上</Radio.Button>
                                    <Radio.Button value="center">居中</Radio.Button>
                                    <Radio.Button value="flex-end">居下</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='单位em。'>
                                        字号*
                                    </Tooltip>
                                }
                            >
                                <InputNumber value={title.fontSize} onChange={changeDetailData.bind(this, 2, title, 'fontSize')} />
                            </Form.Item>
                            <Form.Item label="文字颜色" >
                                <ColorSelect color={title.fontColor} setColor={setColor.bind(this, title, 'fontColor')} />
                            </Form.Item>
                            <Form.Item label="文字框宽度">
                                <Input value={title.width} onChange={changeDetailData.bind(this, 1, title, 'width')} />
                            </Form.Item>
                            <Form.Item label="文字框高度">
                                <Input value={title.height} onChange={changeDetailData.bind(this, 1, title, 'height')} />
                            </Form.Item>
                            <Form.Item label="左">
                                <Input value={title.left} onChange={changeDetailData.bind(this, 1, title, 'left')} />
                            </Form.Item>
                            <Form.Item label="上">
                                <Input value={title.top} onChange={changeDetailData.bind(this, 1, title, 'top')} />
                            </Form.Item>
                        </Panel>
                        <Panel header="内容设置" key="5">
                            {this.getSubSet(style, sub)}
                        </Panel>
                    </Collapse>
                </Form>
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
            </div>
        );
    }
}
