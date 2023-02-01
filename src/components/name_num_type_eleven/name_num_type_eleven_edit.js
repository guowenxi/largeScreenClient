import React from 'react';
import {Form, Input, InputNumber, Collapse, Tooltip, Tag, Radio, Button, Icon, Slider, Switch, Select} from 'antd';
import {
    addListItem,
    changeDetailData, deleteListItem, setColor,
} from "../../common/editUtil";
import {getColorSet,getItemStyleEdit,getColorList,getBaseEdit} from "../../common/nameNumEditUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class NameNumTypeElevenEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible:false};
        this.item = {
            key:"name",
            fontSize:1,
            fontColorType:1,//1为固定色,2为根据某字段不同值不同色,3为根据序号不同值不同色
            fontColor:"#fff",
            fontColorKey:"type",
            fontColorList:[{num:1,color:'rgb(61,219,88)'},{num:2,color:'rgb(1,160,249)'},{num:3,color:'rgb(214,55,25)'}],
        };
        this.colorItemOne = {num:1,color:'rgb(61,219,88)'};
        this.colorItemTwo = {bottom:1,top:2,color:'rgb(61,219,88)'};
        this.getColorSet = getColorSet.bind(this);
        this.getItemStyleEdit = getItemStyleEdit.bind(this);
        this.getColorList = getColorList.bind(this);
        this.getBaseEdit = getBaseEdit.bind(this);
        this.colorItem = {color:'#000',percent:100};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    getListItemBoxEdit(item,type){
        return item && item.map((one,index) =>
            <div key={index}>
                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item, index)}>{(type === 1 ? '标题':'数值') + (index + 1)}</Tag>
                {this.getItemStyleEdit(one,false)}
            </div>
        );
    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        if(style.item){

        }
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header={"列表基础设置"} key="1">
                        {this.getBaseEdit(style)}
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
                        <Form.Item label="内容宽">
                            <Input value={style.contentWidth} onChange={changeDetailData.bind(this, 1, style, 'contentWidth')} />
                        </Form.Item>
                        <Form.Item label="内容高">
                            <Input value={style.contentHeight} onChange={changeDetailData.bind(this, 1, style, 'contentHeight')} />
                        </Form.Item>
                        <Form.Item label="内容背景">
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
                        <Collapse style={{marginBottom:'1vh'}}>
                            <Panel header={"图标设置"} key="1">
                                <Form.Item label="是否显示" >
                                    <Switch checked={style.nameIconShow}
                                            onChange={changeDetailData.bind(this, 2, style, 'nameIconShow')}/>
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
                        {this.getListItemBoxEdit(style.nameList,1)}
                        <Form.Item label="">
                            <Button type="dashed"
                                    onClick={addListItem.bind(this,style,'nameList',this.item)}>
                                <Icon type="plus"/> 添加标题
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header={"列表标题分隔符设置"} key="3">
                        {this.getItemStyleEdit(style.nameSplit,true)}
                    </Panel>
                    <Panel header={"列表内容设置"} key="4">
                        {style.contentList && style.contentList.map((content,index) =>
                            <div key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.contentList, index)}>
                                    {'内容' + (index + 1)}
                                </Tag>
                                <Form.Item label="名称键名">
                                    <Input value={content.nameKey} onChange={changeDetailData.bind(this, 1, content, 'nameKey')} />
                                </Form.Item>
                                <Form.Item label="名称宽">
                                    <Input value={content.nameWidth} onChange={changeDetailData.bind(this, 1, content, 'nameWidth')} />
                                </Form.Item>
                                <Form.Item label="名称高">
                                    <Input value={content.nameHeight} onChange={changeDetailData.bind(this, 1, content, 'nameHeight')} />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Tooltip title='单位em。'>
                                            名称字号*
                                        </Tooltip>
                                    }
                                >
                                    <InputNumber value={content.nameSize} onChange={changeDetailData.bind(this, 2, content, 'nameSize')} />
                                </Form.Item>
                                <Form.Item label="名称字色" >
                                    <ColorSelect color={content.nameColor} setColor={setColor.bind(this, content, 'nameColor')} />
                                </Form.Item>
                                <Form.Item label="数值键名">
                                    <Input value={content.numKey} onChange={changeDetailData.bind(this, 1, content, 'numKey')} />
                                </Form.Item>
                                <Form.Item label="数值宽">
                                    <Input value={content.numWidth} onChange={changeDetailData.bind(this, 1, content, 'numWidth')} />
                                </Form.Item>
                                <Form.Item label="数值高">
                                    <Input value={content.numHeight} onChange={changeDetailData.bind(this, 1, content, 'numHeight')} />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Tooltip title='单位em。'>
                                            数值字号*
                                        </Tooltip>
                                    }
                                >
                                    <InputNumber value={content.numSize} onChange={changeDetailData.bind(this, 2, content, 'numSize')} />
                                </Form.Item>
                                <Form.Item label="数值字色" >
                                    <ColorSelect color={content.numColor} setColor={setColor.bind(this, content, 'numColor')} />
                                </Form.Item>
                                <Form.Item label="排列方向">
                                    <Radio.Group value={content.flexDirection} onChange={changeDetailData.bind(this, 1, content, 'flexDirection')}>
                                        <Radio value={'row'}>从左到右</Radio>
                                        <Radio value={'column'}>从上到下</Radio>
                                        <Radio value={'row-reverse'}>从右到左</Radio>
                                        <Radio value={'column-reverse'}>从下到上</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed"
                                    onClick={addListItem.bind(this,style,'contentList',{})}>
                                <Icon type="plus"/> 添加内容项
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header={"项背景色"} key="7">
                        <Form.Item label="渐变角度">
                            <Slider defaultValue={180} max={180} min={0} value={style.angle} onChange={changeDetailData.bind(this, 2, style, 'angle')}/>
                        </Form.Item>
                        {this.getColorList(style.boxColor)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'boxColor',this.colorItem)}>
                                <Icon type="plus"/> 添加颜色
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
                                <Slider defaultValue={180} max={180} min={0} value={style.lineAngle} onChange={changeDetailData.bind(this, 2, style, 'lineAngle')}/>
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
                            <Button type="dashed" onClick={addListItem.bind(this,style,'lineColor',this.colorItem)}>
                                <Icon type="plus"/> 添加颜色
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header={"提示内容"} key="9">
                        <Form.Item label="内容模板">
                            <Select value={style.tipType} onChange={changeDetailData.bind(this, 2, style, 'tipType')}>
                                <Select.Option value={'center_list'}>各中心列表</Select.Option>
                            </Select>
                        </Form.Item>
                    </Panel>
                    <Panel header={"特殊项设置"} key="10">
                        <Form.Item
                            label={
                                <Tooltip title='灰色无响应项序号列表，序号从0开始。如：[0,3,6]'>
                                    特殊项*
                                </Tooltip>
                            }
                        >
                            <Input value={style.specialItem} onChange={changeDetailData.bind(this, 1, style, 'specialItem')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
