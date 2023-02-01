import {
    Button,
    Collapse,
    Form,
    Icon,
    Input,
    InputNumber,
    Radio,
    Tag,
    Tooltip,
    Slider,
    Tabs,
    Switch,
    Select, Row, Col
} from "antd";
import {
    addListItem,
    addListItemWithoutKey,
    changeDetailData,
    deleteListItem, getTypeImageEdit, iconClick,
    selectIcon, selectIconCancel,
    selectIconOk,
    setColor
} from "./editUtil";
import ColorSelect from "./colorSelect";
import React from "react";
import {fileUrl} from "../config";
import FileSelect from "./fileSelect";
const { TabPane } = Tabs;
const { Panel } = Collapse;


export function getColorSet(list, type, display) {
    return type > 0 && (
        <Collapse style={{ display, marginBottom: '20px' }}>
            <Panel header="颜色列表" key="1">
                {list.map((item, index) =>
                    <div key={index}>
                        <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, list, index)}>{'列' + (index + 1)}</Tag>
                        {type === 1 &&
                            <Form.Item label="值" >
                                <Input value={item.num} onChange={changeDetailData.bind(this, 1, item, 'num')} />
                            </Form.Item>
                        }
                        {type === 2 &&
                            <Form.Item label="大于等于" >
                                <InputNumber min={1} value={item.bottom} onChange={changeDetailData.bind(this, 2, item, 'bottom')} />
                            </Form.Item>
                        }
                        {type === 2 &&
                            <Form.Item label="小与" >
                                <InputNumber min={1} value={item.top} onChange={changeDetailData.bind(this, 2, item, 'top')} />
                            </Form.Item>
                        }
                        <Form.Item label="颜色">
                            <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                        </Form.Item>
                    </div>
                )}
                <Form.Item label="">
                    <Button type="dashed"
                        onClick={addListItemWithoutKey.bind(this, list, {})}>
                        <Icon type="plus" /> 添加颜色设置
                    </Button>
                </Form.Item>
            </Panel>
        </Collapse>
    );
}

export function getItemStyleEdit(item, isSplit) {
    return (
        <div >
            <Form.Item label={isSplit ? "分隔符" : "键名"}>
                <Input value={item.key} onChange={changeDetailData.bind(this, 1, item, 'key')} />
            </Form.Item>
            <Form.Item label={<Tooltip title='默认为em。'>字号单位*</Tooltip>} >
                <Radio.Group value={item.fontSizeUnit} onChange={changeDetailData.bind(this, 1, item, 'fontSizeUnit')}>
                    <Radio.Button value={1}>em</Radio.Button>
                    <Radio.Button value={2}>自定义</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label='字号'>
                <Input value={item.fontSize} onChange={changeDetailData.bind(this, 1, item, 'fontSize')} />
            </Form.Item>
            <Form.Item label="字号粗细">
                <Radio.Group size="small" value={item.fontWeight}
                    onChange={changeDetailData.bind(this, 1, item, 'fontWeight')}>
                    <Radio.Button value="bold">更粗</Radio.Button>
                    <Radio.Button value="normal">正常</Radio.Button>
                    <Radio.Button value="lighter">更细</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="行高">
                <InputNumber value={item.lineHeight} onChange={changeDetailData.bind(this, 2, item, 'lineHeight')} />
            </Form.Item>
            <Form.Item label="内边距">
                <Input value={item.padding} onChange={changeDetailData.bind(this, 1, item, 'padding')} />
            </Form.Item>
            <Form.Item label="字色类型">
                <Radio.Group value={item.fontColorType} onChange={changeDetailData.bind(this, 1, item, 'fontColorType')}>
                    <Radio value={1}>统一色</Radio>
                    <Radio value={2}>根据字段不同值不同色</Radio>
                    <Radio value={3}>根据序号不同值不同色</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="字色" style={{ display: item.fontColorType !== 1 ? 'none' : '' }}>
                <ColorSelect color={item.fontColor} setColor={setColor.bind(this, item, 'fontColor')} />
            </Form.Item>
            <Form.Item label="依据字段" style={{ display: item.fontColorType !== 2 ? 'none' : '' }}>
                <Input value={item.fontColorKey} onChange={changeDetailData.bind(this, 1, item, 'fontColorKey')} />
            </Form.Item>
            {this.getColorSet(item.fontColorList, (item.fontColorType - 1), item.fontColorType === 1 ? 'none' : '')}
        </div>
    );
}

export function getColorList(colorList) {
    return colorList && colorList.map((item, index) => {
        return (
            <div key={index}>
                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, colorList, index)}>
                    {'颜色' + (index + 1)}
                </Tag>
                <Form.Item label="颜色">
                    <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title='颜色位置，单位为%。最小为0，最大为100。'>
                            位置*
                        </Tooltip>
                    }
                >
                    <InputNumber value={item.percent} min={0} max={100} onChange={changeDetailData.bind(this, 2, item, 'percent')} />
                </Form.Item>
            </div>
        )
    });
}

export function getColorListMultiple(style,colorList,subColorList) {
    var colorItem = { color: '#000', percent: 100 };
    // callback(key){
    //     debugger
    // }
    return <Tabs defaultActiveKey="1" type="editable-card" onEdit={(targetKey, action)=>{
        debugger
        if(action === 'add'){
            addListItem.bind(
                this,
                style,
                "colors",
                this.colorItem
              )()
        }else{
            deleteListItem.bind(this, colorList, targetKey)()
        }
    }}>
        {
            colorList && colorList.map((item, index) => {
                return (
                    <TabPane key={index} tab={`颜色${index}`} closable='false'>
                        <Form.Item label="渐变角度">
                            <Slider
                            defaultValue={360}
                            max={360}
                            min={0}
                            value={item.angle}
                            onChange={changeDetailData.bind(this, 2, item, "angle")}
                            />
                        </Form.Item>
                        {
                            item.colorList && item.colorList.map((_item, _idx) => {
                            return (
                                <div key={_item}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item[subColorList], _idx)}>
                                        {'颜色' + (_idx + 1)}
                                    </Tag>
                                    <Form.Item label="颜色">
                                        <ColorSelect color={_item.color} setColor={setColor.bind(this, _item, 'color')} />
                                    </Form.Item>
                                </div>
                            )
                        })
                        }
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, item, subColorList, colorItem)}>
                                <Icon type="plus" /> 添加颜色
                            </Button>
                        </Form.Item>
                    </TabPane>
                )
            })
        }
    </Tabs>

}


export function getBaseEdit(style) {
    return (
        <div>
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
                    <Radio value={'row'}>从左往右</Radio>
                    <Radio value={'row-reverse'}>从右往左</Radio>
                    <Radio value={'column'}>从上往下</Radio>
                    <Radio value={'column-reverse'}>从下往上</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="字体大小">
                <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
            </Form.Item>
            <Form.Item label="背景色">
                <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
            </Form.Item>
        </div>
    );
}

function getGradientColorEdit(item,gradientTypeKey,gradientAngleKey,colorListKey){
    return (
        <React.Fragment>
            <Form.Item label="渐变类型" >
                <Radio.Group value={item[gradientTypeKey]} onChange={changeDetailData.bind(this, 1, item, gradientTypeKey)}>
                    <Radio.Button value="radial">径向</Radio.Button>
                    <Radio.Button value="linear">线性</Radio.Button>
                </Radio.Group>
            </Form.Item>
            {item[gradientTypeKey] === 'linear' && (
                <Form.Item label="渐变角度">
                    <Slider defaultValue={180} max={180} min={0} value={item[gradientAngleKey]} onChange={changeDetailData.bind(this, 2, item, gradientAngleKey)}/>
                </Form.Item>
            )}
            {this.getColorList(item[colorListKey])}
            <Form.Item label="">
                <Button type="dashed" onClick={addListItem.bind(this,item,colorListKey,{})}>
                    <Icon type="plus"/> 添加颜色
                </Button>
            </Form.Item>
        </React.Fragment>
    );
}

function getItemBgEdit(item){
    return (
        <React.Fragment>
            <Form.Item label={<Tooltip title='默认为百分比%。'>单位类型*</Tooltip>} >
                <Radio.Group value={item.unitTypeBg} onChange={changeDetailData.bind(this, 1, item, 'unitTypeBg')}>
                    <Radio.Button value={1}>百分比</Radio.Button>
                    <Radio.Button value={2}>自定义</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label='宽' >
                <Input value={item.widthBg} onChange={changeDetailData.bind(this, 1, item, 'widthBg')} />
            </Form.Item>
            <Form.Item label='高'>
                <Input value={item.heightBg} onChange={changeDetailData.bind(this, 1, item, 'heightBg')} />
            </Form.Item>
            <Form.Item label='左'>
                <Input value={item.leftBg} onChange={changeDetailData.bind(this, 1, item, 'leftBg')} />
            </Form.Item>
            <Form.Item label='上'>
                <Input value={item.topBg} onChange={changeDetailData.bind(this, 1, item, 'topBg')} />
            </Form.Item>
            <Form.Item label="背景类型">
                <Select value={item.bgType} onChange={changeDetailData.bind(this, 2, item, 'bgType')}>
                    <Select.Option value={1}>图片</Select.Option>
                    <Select.Option value={2}>单一颜色</Select.Option>
                    <Select.Option value={3}>渐变颜色</Select.Option>
                    <Select.Option value={4}>svg背景框1</Select.Option>
                    <Select.Option value={5}>svg背景框2</Select.Option>
                    <Select.Option value={6}>svg背景框3</Select.Option>
                    <Select.Option value={7}>svg背景框4</Select.Option>
                    <Select.Option value={8}>svg背景框5</Select.Option>
                    <Select.Option value={9}>svg背景框6</Select.Option>
                    <Select.Option value={10}>svg转动圆圈</Select.Option>
                    <Select.Option value={11}>svg转动圆圈4</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="透明度">
                <InputNumber value={item.opacity} min={0} max={1} step={0.1} onChange={changeDetailData.bind(this, 2, item, 'opacity')} />
            </Form.Item>
            {item.bgType === 1 && (
                <Form.Item label="图标" >
                    {
                        item.img ? (
                            <img alt="选择图标" onClick={selectIcon.bind(this, item, 'img')} src={fileUrl + '/download/' + item.img} style={{height:'4vh'}} />
                        ) : (
                            <Button type="dashed" onClick={selectIcon.bind(this, item, 'img')} >
                                <Icon type="plus" /> 选择图标
                            </Button>
                        )
                    }
                </Form.Item>
            )}
            {item.bgType === 2 && (
                <Form.Item label="背景色">
                    <ColorSelect color={item.bgColor} setColor={setColor.bind(this, item, 'bgColor')} />
                </Form.Item>
            )}
            {item.bgType === 3 && this.getGradientColorEdit(item,'gradientType','gradientAngle','bgColorList')}
        </React.Fragment>
    );
}

function getContentPositionEdit(content){
    return (
        <React.Fragment>
            <Form.Item label={<Tooltip title='默认为百分比%。'>单位类型*</Tooltip>} >
                <Radio.Group value={content.unitType} onChange={changeDetailData.bind(this, 1, content, 'unitType')}>
                    <Radio.Button value={1}>百分比</Radio.Button>
                    <Radio.Button value={2}>自定义</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label='项占宽' >
                <Input value={content.width} onChange={changeDetailData.bind(this, 1, content, 'width')} />
            </Form.Item>
            <Form.Item label='项占高' >
                <Input value={content.height} onChange={changeDetailData.bind(this, 1, content, 'height')} />
            </Form.Item>
            <Form.Item label="超出隐藏">
                <Switch checked={content.overflowHidden} onChange={changeDetailData.bind(this, 2, content, 'overflowHidden')}/>
            </Form.Item>
            <Form.Item label={<Tooltip title='有设置项占宽时生效。'>水平位置*</Tooltip>} >
                <Radio.Group value={content.justifyContent} onChange={changeDetailData.bind(this, 1, content, 'justifyContent')}>
                    <Radio value="flex-start">居左</Radio>
                    <Radio value="center">居中</Radio>
                    <Radio value="flex-end">居右</Radio>
                    <Radio value="space-between">两边</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label={<Tooltip title='有设置项占高时生效。'>垂直位置*</Tooltip>} >
                <Radio.Group value={content.alignItems} onChange={changeDetailData.bind(this, 1, content, 'alignItems')}>
                    <Radio value="flex-start">居上</Radio>
                    <Radio value="center">居中</Radio>
                    <Radio value="flex-end">居下</Radio>
                </Radio.Group>
            </Form.Item>
        </React.Fragment>
    );
}

function getNumThemeOneEdit(content){
    if(content.numStyle == null){
        content.numStyle = {};
    }
    return (
        <Collapse style={{marginBottom:'1vh'}}>
            <Panel header="数字字块大小设置" key="1">
                <Form.Item label={<Tooltip title='单位em。'>宽*</Tooltip>} >
                    <InputNumber value={content.numStyle.width} onChange={changeDetailData.bind(this, 2, content.numStyle, 'width')} />
                </Form.Item>
                <Form.Item label={<Tooltip title='单位em。'>高*</Tooltip>}>
                    <InputNumber value={content.numStyle.height} onChange={changeDetailData.bind(this, 2, content.numStyle, 'height')} />
                </Form.Item>
                <Form.Item label="内边距">
                    <Input value={content.numStyle.padding} onChange={changeDetailData.bind(this, 1, content.numStyle, 'padding')} />
                </Form.Item>
            </Panel>
            <Panel header="数字字块背景设置" key="2">
                {this.getItemBgEdit(content.numStyle)}
            </Panel>
        </Collapse>
    );
}

function getFontStyleEdit(content,contentType){
    if(this.getNumThemeOneEdit == null){
        this.getNumThemeOneEdit = getNumThemeOneEdit.bind(this);
    }
    if(this.getColorList == null){
        this.getColorList = getColorList.bind(this);
    }
    return (
        <React.Fragment>
            <Form.Item label="字色类型">
                <Radio.Group value={content.fontColorType} onChange={changeDetailData.bind(this, 1, content, 'fontColorType')}>
                    <Radio.Button value={1}>单一色（默认）</Radio.Button>
                    <Radio.Button value={2}>渐变色</Radio.Button>
                </Radio.Group>
            </Form.Item>
            {content.fontColorType === 2 ? (
                <Collapse >
                    <Panel header="具体颜色列表设置" key="1">
                        <Form.Item label="渐变角度">
                            <Slider defaultValue={90} max={90} min={0} value={content.fontFillColorAngle} onChange={changeDetailData.bind(this, 2, content, 'fontFillColorAngle')} />
                        </Form.Item>
                        {this.getColorList(content.fontFillColor)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, content, 'fontFillColor', {})}>
                                <Icon type="plus" /> 添加颜色
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            ):(
                <Form.Item label="字色">
                    <ColorSelect color={content.fontColor} setColor={setColor.bind(this, content, 'fontColor')} />
                </Form.Item>
            )}
            <Form.Item label={<Tooltip title='默认为em。'>字号单位*</Tooltip>} >
                <Radio.Group value={content.fontSizeUnit} onChange={changeDetailData.bind(this, 1, content, 'fontSizeUnit')}>
                    <Radio.Button value={1}>em</Radio.Button>
                    <Radio.Button value={2}>自定义</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label='字号'>
                <Input value={content.fontSize} onChange={changeDetailData.bind(this, 1, content, 'fontSize')}/>
            </Form.Item>
            <Form.Item label='字间距'>
                <Input value={content.letterSpacing} onChange={changeDetailData.bind(this, 1, content, 'letterSpacing')}/>
            </Form.Item>
            <Form.Item label={<Tooltip title='单位em。'>行高*</Tooltip>}>
                <InputNumber value={content.lineHeight} onChange={changeDetailData.bind(this, 2, content, 'lineHeight')}/>
            </Form.Item>
            <Form.Item label="斜体" >
                <Switch checked={content.isOblique} onChange={changeDetailData.bind(this, 2, content, 'isOblique')}/>
            </Form.Item>
            <Form.Item label="内边距" >
                <Input value={content.padding} onChange={changeDetailData.bind(this, 1, content, 'padding')} />
            </Form.Item>
            <Form.Item label="超出隐藏">
                <Switch checked={content.tooltip} onChange={changeDetailData.bind(this, 2, content, 'tooltip')}/>
            </Form.Item>
            {!content.tooltip && (
                <Form.Item label={<Tooltip title='超过最大字数将缩小字号。'>最大字数*</Tooltip>}>
                    <InputNumber value={content.maxFontNum} onChange={changeDetailData.bind(this, 2, content, 'maxFontNum')}/>
                </Form.Item>
            )}
            <Form.Item label="字体粗细" >
                <Radio.Group value={content.fontWeight} onChange={changeDetailData.bind(this, 1, content, 'fontWeight')}>
                    <Radio.Button value={'lighter'}>细</Radio.Button>
                    <Radio.Button value={'normal'}>正常</Radio.Button>
                    <Radio.Button value={'bold'}>粗</Radio.Button>
                </Radio.Group>
            </Form.Item>
            {contentType === 4 && (
                <React.Fragment>
                    <Form.Item
                        label={
                            <Tooltip title='控制数字超过三位数时,千分位符是否显示。'>
                                千分位符*
                            </Tooltip>
                        }
                    >
                        <Switch checked={content.numSplitShow} onChange={changeDetailData.bind(this, 2, content, 'numSplitShow')} />
                    </Form.Item>
                    <Form.Item label="小数位数">
                        <InputNumber value={content.numFixed} min={0} max={100} onChange={changeDetailData.bind(this, 2, content, 'numFixed')} />
                    </Form.Item>
                    <Form.Item label={<Tooltip title='若设定该值后，实际数字字数少于设定字数时将在数字前面填充0'>数字字数*</Tooltip>} >
                        <InputNumber value={content.numLength} onChange={changeDetailData.bind(this, 2, content, 'numLength')} />
                    </Form.Item>
                    <Form.Item label="数字样式">
                        <Radio.Group value={content.numTheme} onChange={changeDetailData.bind(this, 1, content, 'numTheme')}>
                            <Radio.Button value={1}>默认</Radio.Button>
                            <Radio.Button value={2}>主题一</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {content.numTheme === 2 && this.getNumThemeOneEdit(content)}
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

function getSpecialEdit(content,styleType,listKey,dependKey,calculateKey,detailFun,contentType){
    return (
        <React.Fragment >
            {styleType === 2 && (
                <Form.Item label="依据键名" >
                    <Input value={content[dependKey]} onChange={changeDetailData.bind(this, 1, content, dependKey)} />
                </Form.Item>
            )}
            <Form.Item label="匹配方式">
                <Radio.Group onChange={changeDetailData.bind(this, 1, content, calculateKey)} value={content[calculateKey]}>
                    <Radio value={1}>相等</Radio>
                    <Radio value={2}>区间</Radio>
                    <Radio value={3}>奇偶不同</Radio>
                </Radio.Group>
            </Form.Item>
            <Collapse style={{marginBottom:'1vh'}}>
                <Panel header="具体配置设置" key="1">
                    {content[listKey] && content[listKey].map((item,index) =>{
                        let valueEdit;
                        if(content[calculateKey] === 1){
                            valueEdit = (
                                <Form.Item label="值" >
                                    <Input value={item.value} onChange={changeDetailData.bind(this, 1, item, 'value')} />
                                </Form.Item>
                            );
                        }else if(content[calculateKey] === 2){
                            valueEdit = (
                                <React.Fragment >
                                    <Form.Item label="大于等于">
                                        <InputNumber value={item.more} onChange={changeDetailData.bind(this, 2, item, 'more')} />
                                    </Form.Item>
                                    <Form.Item label="小于">
                                        <InputNumber value={item.less} onChange={changeDetailData.bind(this, 2, item, 'less')} />
                                    </Form.Item>
                                </React.Fragment>
                            );
                        }else{
                            valueEdit = (
                                <Form.Item label="奇偶数">
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, item, 'valueType')} value={item.valueType}>
                                        <Radio value={1}>奇数</Radio>
                                        <Radio value={0}>偶数</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            );
                        }
                        return (
                            <React.Fragment key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, content[listKey], index)}>{'具体设置' + (index + 1)}</Tag>
                                {valueEdit}
                                {detailFun(item,contentType)}
                            </React.Fragment>
                        );
                    })}
                    <Form.Item label="" style={{margin:'1vh'}}>
                        <Button type="dashed"
                                onClick={addListItem.bind(this, content, listKey, {})}>
                            <Icon type="plus" /> 添加具体设置
                        </Button>
                    </Form.Item>
                </Panel>
            </Collapse>
        </React.Fragment>
    );
}

function getPositionEdit(item){
    return (
        <React.Fragment >
            <Form.Item label={<Tooltip title='默认为百分比%。'>单位类型*</Tooltip>} >
                <Radio.Group value={item.unitType} onChange={changeDetailData.bind(this, 1, item, 'unitType')}>
                    <Radio.Button value={1}>百分比</Radio.Button>
                    <Radio.Button value={2}>自定义</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="超出隐藏">
                <Switch checked={item.overflowHidden} onChange={changeDetailData.bind(this, 2, item, 'overflowHidden')}/>
            </Form.Item>
            <Form.Item label='宽' >
                <Input value={item.width} onChange={changeDetailData.bind(this, 1, item, 'width')} />
            </Form.Item>
            <Form.Item label='高'>
                <Input value={item.height} onChange={changeDetailData.bind(this, 1, item, 'height')} />
            </Form.Item>
            <Form.Item label='左'>
                <Input value={item.left} onChange={changeDetailData.bind(this, 1, item, 'left')} />
            </Form.Item>
            <Form.Item label='上'>
                <Input value={item.top} onChange={changeDetailData.bind(this, 1, item, 'top')} />
            </Form.Item>
        </React.Fragment>
    );
}

function getSpecialBoxEdit(item,styleTypeKey,listKey,dependKey,calculateKey,detailFun,text,contentType){
    return (
        <React.Fragment >
            <Form.Item label={text+"类型"} >
                <Radio.Group value={item[styleTypeKey]} onChange={changeDetailData.bind(this, 1, item, styleTypeKey)} defaultValue={1}>
                    <Radio value={1}>固定{text}</Radio>
                    <Radio value={2}>不同值不同{text}</Radio>
                    <Radio value={3}>不同序号不同{text}</Radio>
                </Radio.Group>
            </Form.Item>
            {item[styleTypeKey] === 1 && detailFun(item,contentType)}
            {(item[styleTypeKey] === 2 || item[styleTypeKey] === 3) && this.getSpecialEdit(item,item[styleTypeKey],listKey,dependKey,calculateKey,detailFun,contentType)}
        </React.Fragment>
    );
}

function getBorderEdit(item){
    return (
        <React.Fragment >
            <Form.Item label="边框线宽" >
                <Input value={item.borderWidth} onChange={changeDetailData.bind(this, 1, item, 'borderWidth')} />
            </Form.Item>
            <Form.Item label="边框颜色" >
                <ColorSelect color={item.borderColor} setColor={setColor.bind(this, item, 'borderColor')} />
            </Form.Item>
            <Form.Item label="边框圆角" >
                <Input value={item.borderRadius} onChange={changeDetailData.bind(this, 1, item, 'borderRadius')} />
            </Form.Item>
            <Form.Item label="边框类型" >
                <Radio.Group value={item.borderStyle} onChange={changeDetailData.bind(this, 1, item, 'borderStyle')}>
                    <Radio value="solid">实线</Radio>
                    <Radio value="dashed">虚线1</Radio>
                    <Radio value="dotted">虚线2</Radio>
                </Radio.Group>
            </Form.Item>
        </React.Fragment>
    );
}
function getTextShadowEdit(item){
    return (
        <React.Fragment >
            <Form.Item label="水平偏移" >
                <Input value={item.hShadow} onChange={changeDetailData.bind(this, 1, item, 'hShadow')} />
            </Form.Item>
            <Form.Item label="垂直偏移" >
                <Input value={item.vShadow} onChange={changeDetailData.bind(this, 1, item, 'vShadow')} />
            </Form.Item>
            <Form.Item label="模糊距离" >
                <Input value={item.blur} onChange={changeDetailData.bind(this, 1, item, 'blur')} />
            </Form.Item>
            <Form.Item label="阴影颜色" >
                <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
            </Form.Item>
        </React.Fragment>
    );
}

function getSelectedEdit(content,selectedKey,callBack){
    if(content[selectedKey] == null){
        content[selectedKey] = {};
    }
    return (
        <Collapse style={{marginBottom:'1vh'}}>
            <Panel header="选中样式" key="1">
                {callBack(content[selectedKey])}
            </Panel>
        </Collapse>
    );
}

export function getRingStyleEdit(content){
    if(this.getColorList == null){
        this.getColorList = getColorList.bind(this);
    }
    return (
        <Collapse >
            <Panel header="圆环填充色设置" key="1">
                <Form.Item label="渐变角度">
                    <Slider defaultValue={90} max={90} min={0} value={content.angle} onChange={changeDetailData.bind(this, 2, content, 'angle')} />
                </Form.Item>
                {this.getColorList(content.fillColor)}
                <Form.Item label="">
                    <Button type="dashed" onClick={addListItem.bind(this, content, 'fillColor', {})}>
                        <Icon type="plus" /> 添加颜色
                    </Button>
                </Form.Item>
            </Panel>
            <Panel header="其他样式设置" key="2">
                <Form.Item label="内半径">
                    <Slider defaultValue={60} max={100} min={0} value={content.minRadius} onChange={changeDetailData.bind(this, 2, content, 'minRadius')} />
                </Form.Item>
                <Form.Item label="外半径">
                    <Slider defaultValue={80} max={100} min={0} value={content.maxRadius} onChange={changeDetailData.bind(this, 2, content, 'maxRadius')} />
                </Form.Item>
                <Form.Item label="环背景色">
                    <ColorSelect color={content.bgColor} setColor={setColor.bind(this, content, 'bgColor')} />
                </Form.Item>
                <Form.Item label="环阴影">
                    <ColorSelect color={content.shadowColor} setColor={setColor.bind(this, content, 'shadowColor')} />
                </Form.Item>
                <Form.Item label="线宽">
                    <InputNumber value={content.lineWidth} onChange={changeDetailData.bind(this, 2, content, 'lineWidth')}/>
                </Form.Item>
                <Form.Item label="线颜色">
                    <ColorSelect color={content.lineColor} setColor={setColor.bind(this, content, 'lineColor')} />
                </Form.Item>
            </Panel>
        </Collapse>
    );
}

function getBarStyleEdit(content){
    return (
        <React.Fragment >
            <Form.Item label="柱类型" >
                <Radio.Group value={content.barType} onChange={changeDetailData.bind(this, 1, content, 'barType')}>
                    <Radio.Button value={1}>颜色</Radio.Button>
                    <Radio.Button value={2}>图片</Radio.Button>
                    <Radio.Button value={3}>样式一</Radio.Button>
                    <Radio.Button value={4}>样式二</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="柱背景值" >
                <Radio.Group value={content.barMaxNumType} onChange={changeDetailData.bind(this, 1, content, 'barMaxNumType')}>
                    <Radio value={1}><InputNumber value={content.maxNumTimes} onChange={changeDetailData.bind(this, 2, content, 'maxNumTimes')} />倍最大值</Radio>
                    <Radio value={2}><InputNumber value={content.maxNum} onChange={changeDetailData.bind(this, 2, content, 'maxNum')} /></Radio>
                </Radio.Group>
            </Form.Item>
            {content.barType === 4 && (
                <React.Fragment >
                    <Form.Item label="左边配色" >
                        <Row>
                            <Col >
                                <ColorSelect color={content.leftStartColor} setColor={setColor.bind(this, content, 'leftStartColor')} />
                                <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                <ColorSelect color={content.leftEndColor} setColor={setColor.bind(this, content, 'leftEndColor')} />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="右边配色" >
                        <Row>
                            <Col >
                                <ColorSelect color={content.rightStartColor} setColor={setColor.bind(this, content, 'rightStartColor')} />
                                <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                <ColorSelect color={content.rightEndColor} setColor={setColor.bind(this, content, 'rightEndColor')} />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="上方配色" >
                        <Row>
                            <Col >
                                <ColorSelect color={content.topStartColor} setColor={setColor.bind(this, content, 'topStartColor')} />
                                <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                <ColorSelect color={content.topEndColor} setColor={setColor.bind(this, content, 'topEndColor')} />
                            </Col>
                        </Row>
                    </Form.Item>
                </React.Fragment>
            )}
            {(content.barType === 1 || content.barType === 2) && (
                <React.Fragment >
                    <Form.Item label="柱方向" >
                        <Radio.Group value={content.barDirection} onChange={changeDetailData.bind(this, 1, content, 'barDirection')}>
                            <Radio.Button value={1}>横向</Radio.Button>
                            <Radio.Button value={2}>纵向</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="柱起点" >
                        <Radio.Group value={content.barStart} onChange={changeDetailData.bind(this, 1, content, 'barStart')}>
                            <Radio.Button value={1}>{content.barDirection === 1 ? '左':'上'}</Radio.Button>
                            <Radio.Button value={2}>{content.barDirection === 1 ? '右':'下'}</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </React.Fragment>
            )}
            {content.barType === 1 && (
                <Collapse style={{marginBottom:'1vh'}}>
                    <Panel header="柱图颜色设置" key="1">
                        <Form.Item label="颜色类型" >
                            <Radio.Group value={content.barColorType} onChange={changeDetailData.bind(this, 1, content, 'barColorType')}>
                                <Radio.Button value={1}>单一色</Radio.Button>
                                <Radio.Button value={2}>渐变色</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {content.barColorType === 1 && (
                            <Form.Item label="颜色">
                                <ColorSelect color={content.barColor} setColor={setColor.bind(this, content, 'barColor')} />
                            </Form.Item>
                        )}
                        {content.barColorType === 2 && this.getGradientColorEdit(content,'barGradientType','barGradientAngle','barColorList')}
                    </Panel>
                    <Panel header="柱背景颜色设置" key="2">
                        <Form.Item label="颜色类型" >
                            <Radio.Group value={content.barBgColorType} onChange={changeDetailData.bind(this, 1, content, 'barBgColorType')}>
                                <Radio.Button value={1}>单一色</Radio.Button>
                                <Radio.Button value={2}>渐变色</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {content.barBgColorType === 1 && (
                            <Form.Item label="颜色">
                                <ColorSelect color={content.barBgColor} setColor={setColor.bind(this, content, 'barBgColor')} />
                            </Form.Item>
                        )}
                        {content.barBgColorType === 2 && this.getGradientColorEdit(content,'barBgGradientType','barBgGradientAngle','barBgColorList')}
                    </Panel>
                    <Panel header="其他设置" key="3">
                        <Form.Item label="圆角" >
                            <Input value={content.barRadius} onChange={changeDetailData.bind(this, 1, content, 'barRadius')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            )}
            {content.barType === 2 && (
                <React.Fragment >
                    <Form.Item label="柱内容" >
                        {
                            content.barImg ? (
                                <img alt="选择图片" onClick={selectIcon.bind(this, content, 'barImg')} src={fileUrl + '/download/' + content.barImg} style={{height:'4vh'}} />
                            ) : (
                                <Button type="dashed" onClick={selectIcon.bind(this, content, 'barImg')} >
                                    <Icon type="plus" /> 选择图片
                                </Button>
                            )
                        }
                    </Form.Item>
                    <Form.Item label="柱背景" >
                        {
                            content.barBgImg ? (
                                <img alt="选择图片" onClick={selectIcon.bind(this, content, 'barBgImg')} src={fileUrl + '/download/' + content.barBgImg} style={{height:'4vh'}} />
                            ) : (
                                <Button type="dashed" onClick={selectIcon.bind(this, content, 'barBgImg')} >
                                    <Icon type="plus" /> 选择图片
                                </Button>
                            )
                        }
                    </Form.Item>
                </React.Fragment>
            )}
            {content.barType === 3 && (
                <React.Fragment >
                    <Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>}>
                        <InputNumber value={content.numSize} onChange={changeDetailData.bind(this, 2, content, 'numSize')}/>
                    </Form.Item>
                    <Form.Item label="字色">
                        <ColorSelect color={content.numColor} setColor={setColor.bind(this, content, 'numColor')} />
                    </Form.Item>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}



function getAlignTypeEdit(item){
    return (
        <React.Fragment>
            <Form.Item label="排列方向" >
                <Radio.Group value={item.flexDirection} onChange={changeDetailData.bind(this, 1, item, 'flexDirection')}>
                    <Radio value={'row'}>从左往右</Radio>
                    <Radio value={'row-reverse'}>从右往左</Radio>
                    <Radio value={'column'}>从上往下</Radio>
                    <Radio value={'column-reverse'}>从下往上</Radio>
                </Radio.Group>
            </Form.Item>
            {item.flexDirection !== 'column' && item.flexDirection !== 'column-reverse' ? (
                <React.Fragment>
                    <Form.Item label="水平位置" >
                        <Radio.Group value={item.justifyContent} onChange={changeDetailData.bind(this, 1, item, 'justifyContent')}>
                            <Radio value="flex-start">居左</Radio>
                            <Radio value="center">居中</Radio>
                            <Radio value="flex-end">居右</Radio>
                            <Radio value="space-between">两边</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="垂直位置" >
                        <Radio.Group value={item.alignItems} onChange={changeDetailData.bind(this, 1, item, 'alignItems')}>
                            <Radio value="flex-start">居上</Radio>
                            <Radio value="center">居中</Radio>
                            <Radio value="flex-end">居下</Radio>
                        </Radio.Group>
                    </Form.Item>
                </React.Fragment>
            ):(
                <React.Fragment>
                    <Form.Item label="水平位置" >
                        <Radio.Group value={item.alignItems} onChange={changeDetailData.bind(this, 1, item, 'alignItems')}>
                            <Radio value="flex-start">居左</Radio>
                            <Radio value="center">居中</Radio>
                            <Radio value="flex-end">居右</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="垂直位置" >
                        <Radio.Group value={item.justifyContent} onChange={changeDetailData.bind(this, 1, item, 'justifyContent')}>
                            <Radio value="flex-start">居上</Radio>
                            <Radio value="center">居中</Radio>
                            <Radio value="flex-end">居下</Radio>
                            <Radio value="space-between">两边</Radio>
                        </Radio.Group>
                    </Form.Item>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

export function getContentEdit(style,contentKey){
    if(!this.hasInitFun){
        this.getPositionEdit = getPositionEdit.bind(this);
        this.getBorderEdit = getBorderEdit.bind(this);
        this.getTextShadowEdit = getTextShadowEdit.bind(this);
        this.getColorList = getColorList.bind(this);
        this.getItemBgEdit = getItemBgEdit.bind(this);
        this.getTypeImageEdit = getTypeImageEdit.bind(this);
        this.getContentPositionEdit = getContentPositionEdit.bind(this);
        this.getFontStyleEdit = getFontStyleEdit.bind(this);
        this.getSpecialEdit = getSpecialEdit.bind(this);
        this.getSpecialBoxEdit = getSpecialBoxEdit.bind(this);
        this.getSelectedEdit = getSelectedEdit.bind(this);
        this.getGradientColorEdit = getGradientColorEdit.bind(this);
        this.getBarStyleEdit = getBarStyleEdit.bind(this);
        this.getAlignTypeEdit = getAlignTypeEdit.bind(this);
        this.getRingStyleEdit = getRingStyleEdit.bind(this);
        this.hasInitFun = true;
    }
    return (
        <Collapse >
            {style[contentKey] && style[contentKey].map((item,index) => {
                return (
                    <Panel header={<div>{'内容' + (index + 1)}<Icon type="close" onClick={deleteListItem.bind(this, style[contentKey], index)}/></div>} key={index}>
                        <Form.Item label={<Tooltip title='默认为em。'>字号单位*</Tooltip>} >
                            <Radio.Group value={item.fontSizeUnit} onChange={changeDetailData.bind(this, 1, item, 'fontSizeUnit')}>
                                <Radio.Button value={1}>em</Radio.Button>
                                <Radio.Button value={2}>自定义</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='字号'>
                            <Input value={item.fontSize} onChange={changeDetailData.bind(this, 1, item, 'fontSize')}/>
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                        </Form.Item>
                        <Form.Item label="响应交互">
                            <Switch checked={item.hasInteract} onChange={changeDetailData.bind(this, 2, item, 'hasInteract')}/>
                        </Form.Item>
                        <Collapse style={{marginBottom:'1vh'}}>
                            <Panel header="内容大小位置" key="4">
                                <Form.Item label='单位方式'>
                                    <Radio.Group value={item.itemBoxPosition} onChange={changeDetailData.bind(this, 1, item, 'itemBoxPosition')}>
                                        <Radio value={'absolute'}>绝对定位(默认)</Radio>
                                        <Radio value={'relative'}>相对定位</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                {this.getSpecialBoxEdit(item,'positionType','positionList','keyPosition','positionCalculateType',this.getPositionEdit,'位置')}
                                {this.getSelectedEdit(item,'selectedPosition',(editContent)=>{return this.getSpecialBoxEdit(editContent,'positionType','positionList','keyPosition','positionCalculateType',this.getPositionEdit,'位置')})}
                            </Panel>
                            <Panel header="背景设置" key="1">
                                {this.getSpecialBoxEdit(item,'backgroundType','backgroundList','keyBackground','backgroundCalculateType',this.getItemBgEdit,'背景')}
                                {this.getSelectedEdit(item,'selectedBackground',(editContent)=>{return this.getSpecialBoxEdit(editContent,'backgroundType','backgroundList','keyBackground','backgroundCalculateType',this.getItemBgEdit,'背景')})}
                            </Panel>
                            <Panel header="边框设置" key="2">
                                {this.getSpecialBoxEdit(item,'borderType','borderList','keyBorder','borderCalculateType',this.getBorderEdit,'边框')}
                                {this.getSelectedEdit(item,'selectedBorder',(editContent)=>{return this.getSpecialBoxEdit(editContent,'borderType','borderList','keyBorder','borderCalculateType',this.getBorderEdit,'边框')})}
                                {/*{this.getBorderEdit(item)}*/}
                                {/*{this.getSelectedEdit(item,'selectedBorder',(editContent)=>{return this.getBorderEdit(editContent)})}*/}
                            </Panel>
                            <Panel header="具体项设置" key="3">
                                <Collapse style={{marginBottom:'1vh'}}>
                                    <Panel header="排列方式设置" key="-1">
                                        {this.getSpecialBoxEdit(item,'alignType','alignList','keyAlign','alignCalculateType',this.getAlignTypeEdit,'排列方式')}
                                        {this.getSelectedEdit(item,'selectedAlign',(editContent)=>{return this.getSpecialBoxEdit(editContent,'alignType','alignList','keyAlign','alignCalculateType',this.getAlignTypeEdit,'排列方式')})}
                                    </Panel>
                                    {item.content && item.content.map((content,contentIndex) =>
                                        <Panel header={<div>{'项' + (contentIndex + 1)}<Icon type="close" onClick={deleteListItem.bind(this, item.content, contentIndex)}/></div>} key={contentIndex}>
                                            <Collapse style={{marginBottom:'1vh'}}>
                                                <Panel header="位置设置" key="1">
                                                    {this.getSpecialBoxEdit(content,'positionType','positionList','keyPosition','positionCalculateType',this.getContentPositionEdit,'位置')}
                                                    {this.getSelectedEdit(content,'selectedPosition',(editContent)=>{return this.getSpecialBoxEdit(editContent,'positionType','positionList','keyPosition','positionCalculateType',this.getContentPositionEdit,'位置')})}
                                                </Panel>
                                                <Panel header="项背景设置" key="2">
                                                    {this.getSpecialBoxEdit(content,'backgroundType','backgroundList','keyBackground','backgroundCalculateType',this.getItemBgEdit,'背景')}
                                                    {this.getSelectedEdit(content,'selectedBackground',(editContent)=>{return this.getSpecialBoxEdit(editContent,'backgroundType','backgroundList','keyBackground','backgroundCalculateType',this.getItemBgEdit,'背景')})}
                                                </Panel>
                                                <Panel header="项边框设置" key="3">
                                                    {this.getSpecialBoxEdit(content,'borderType','borderList','keyBorder','borderCalculateType',this.getBorderEdit,'边框')}
                                                    {this.getSelectedEdit(content,'selectedBorder',(editContent)=>{return this.getSpecialBoxEdit(editContent,'borderType','borderList','keyBorder','borderCalculateType',this.getBorderEdit,'边框')})}
                                                </Panel>
                                                <Panel header="字阴影设置" key="4">
                                                    {this.getSpecialBoxEdit(content,'textShadowType','textShadowList','keyTextShadow','textShadowCalculateType',this.getTextShadowEdit,'字阴影')}
                                                    {this.getSelectedEdit(content,'selectedTextShadow',(editContent)=>{return this.getSpecialBoxEdit(editContent,'textShadowType','textShadowList','keyTextShadow','textShadowCalculateType',this.getTextShadowEdit,'字阴影')})}
                                                </Panel>
                                                <Panel header="项单独交互" key="5">
                                                    {this.getInteractEdit(content.clickInteract)}
                                                    <Form.Item label="">
                                                        <Button type="dashed" onClick={addListItem.bind(this, content, 'clickInteract', {})}>
                                                            <Icon type="plus" /> 添加交互内容
                                                        </Button>
                                                    </Form.Item>
                                                </Panel>
                                            </Collapse>
                                            <Form.Item label="内容类型" >
                                                <Select value={content.type} onChange={changeDetailData.bind(this, 2, content, 'type')}>
                                                    <Select.Option value={1}>文字</Select.Option>
                                                    <Select.Option value={4}>数字</Select.Option>
                                                    <Select.Option value={5}>序号</Select.Option>
                                                    <Select.Option value={9}>序号(个位数带0)</Select.Option>
                                                    <Select.Option value={2}>固定字串</Select.Option>
                                                    <Select.Option value={3}>图片</Select.Option>
                                                    <Select.Option value={6}>柱图</Select.Option>
                                                    <Select.Option value={7}>圆环图</Select.Option>
                                                    <Select.Option value={8}>图片(数据来源)</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="字体" >
                                                <Select value={content.fontFamily} onChange={changeDetailData.bind(this, 2, content, 'fontFamily')}>
                                                    <Select.Option value=''>默认</Select.Option>
                                                    <Select.Option value='Impact'>Impact</Select.Option>
                                                    <Select.Option value='LESLIE'>LESLIE</Select.Option>
                                                    <Select.Option value='MFBanHei'>MFBanHei</Select.Option>
                                                    <Select.Option value='MFLiHei'>MFLiHei</Select.Option>
                                                    <Select.Option value='IRON_MAN_OF_WAR'>IRON MAN OF WAR</Select.Option>
                                                    <Select.Option value='TRENDS'>TRENDS</Select.Option>
                                                    <Select.Option value='QUARTZEF'>QUARTZEF</Select.Option>
                                                    <Select.Option value='DINPRO-REGULAR'>DINPRO-REGULAR</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="内边距" >
                                                <Input value={content.padding} onChange={changeDetailData.bind(this, 1, content, 'padding')} />
                                            </Form.Item>
                                            <Form.Item label="外边距" >
                                                <Input value={content.margin} onChange={changeDetailData.bind(this, 1, content, 'margin')} />
                                            </Form.Item>
                                            {content.type === 1 && (
                                                <Form.Item label="数据来源" >
                                                    <Radio.Group value={content.dataSource} onChange={changeDetailData.bind(this, 1, content, 'dataSource')}>
                                                        <Radio value={1}>请求结果(默认</Radio>
                                                        <Radio value={2}>请求条件</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                            )}
                                            {content.type !== 3 && content.type !== 6 && content.type !== 7 && (
                                                <React.Fragment>
                                                    <Form.Item label="键名" style={{display:(content.type !== 1 && content.type !== 4 && content.type !== 8) ? 'none':''}}>
                                                        <Input value={content.key} onChange={changeDetailData.bind(this, 1, content, 'key')} />
                                                    </Form.Item>
                                                    <Form.Item label="项内容" style={{display:content.type !== 2 ? 'none':''}}>
                                                        <Input value={content.text} onChange={changeDetailData.bind(this, 1, content, 'text')} />
                                                    </Form.Item>
                                                    <Collapse style={{marginBottom:'1vh',display:(content.type !== 1 && content.type !== 4 && content.type !== 2&& content.type !== 5&& content.type !== 9) ? 'none':''}}>
                                                        <Panel header="字样式设置" key="1">
                                                            {this.getSpecialBoxEdit(content,'fontType','fontList','keyFont','fontCalculateType',this.getFontStyleEdit,'样式',content.type)}
                                                            {this.getSelectedEdit(content,'selectedFont',(editContent)=>{return this.getSpecialBoxEdit(editContent,'fontType','fontList','keyFont','fontCalculateType',this.getFontStyleEdit,'样式',content.type)})}
                                                        </Panel>
                                                    </Collapse>
                                                </React.Fragment>
                                            )}
                                            {content.type === 3 && (
                                                <React.Fragment>
                                                    <Form.Item label={<Tooltip title='单位em。'>宽*</Tooltip>}>
                                                        <InputNumber value={content.imageWidth} onChange={changeDetailData.bind(this, 2, content, 'imageWidth')}/>
                                                    </Form.Item>
                                                    <Form.Item label={<Tooltip title='单位em。'>高*</Tooltip>}>
                                                        <InputNumber value={content.imageHeight} onChange={changeDetailData.bind(this, 2, content, 'imageHeight')}/>
                                                    </Form.Item>
                                                    <Form.Item label="图片类型" >
                                                        <Radio.Group value={content.imageType} onChange={changeDetailData.bind(this, 1, content, 'imageType')}>
                                                            <Radio value={1}>固定图片</Radio>
                                                            <Radio value={2}>不同值不同图片</Radio>
                                                            <Radio value={3}>不同序号不同图片</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                    {content.imageType === 1 && (
                                                        <Form.Item label="图片" >
                                                            {
                                                                content.img ? (
                                                                    <img alt="选择图片" onClick={selectIcon.bind(this, content, 'img')} src={fileUrl + '/download/' + content.img} style={{height:'4vh'}} />
                                                                ) : (
                                                                    <Button type="dashed" onClick={selectIcon.bind(this, content, 'img')} >
                                                                        <Icon type="plus" /> 选择图片
                                                                    </Button>
                                                                )
                                                            }
                                                        </Form.Item>
                                                    )}
                                                    {content.imageType === 2 && (
                                                        <Form.Item label="依据字段">
                                                            <Input value={content.key} onChange={changeDetailData.bind(this, 1, content, 'key')} />
                                                        </Form.Item>
                                                    )}
                                                    {(content.imageType === 2 || content.imageType === 3) && this.getTypeImageEdit(content,'imageList','imageListCalculateType') }
                                                </React.Fragment>
                                            )}
                                            {content.type === 6 && (
                                                <React.Fragment>
                                                    <Form.Item label="值键名" >
                                                        <Input value={content.barNumKey} onChange={changeDetailData.bind(this, 1, content, 'barNumKey')} />
                                                    </Form.Item>
                                                    <Form.Item label="值显示" >
                                                        <Switch checked={content.numShow} onChange={changeDetailData.bind(this, 2, content, 'numShow')}/>
                                                    </Form.Item>
                                                    <Form.Item label="值颜色" >
                                                        <ColorSelect color={content.numColor} setColor={setColor.bind(this, content, 'numColor')} />
                                                    </Form.Item>
                                                    <Form.Item label={<Tooltip title='单位em。'>值字号*</Tooltip>}>
                                                        <InputNumber color={content.numSize} setColor={changeDetailData.bind(this, 2, content, 'numSize')} />
                                                    </Form.Item>
                                                    {this.getSpecialBoxEdit(content,'barStyleType','barStyleList','keyBarStyle','barStyleCalculateType',this.getBarStyleEdit,'柱样式')}
                                                </React.Fragment>
                                            )}
                                            {content.type === 7 && (
                                                <React.Fragment>
                                                    <Form.Item label="值键名" >
                                                        <Input value={content.ringNumKey} onChange={changeDetailData.bind(this, 1, content, 'ringNumKey')} />
                                                    </Form.Item>
                                                    {this.getSpecialBoxEdit(content,'ringStyleType','ringStyleList','keyRingStyle','ringStyleCalculateType',this.getRingStyleEdit,'圆环样式')}
                                                </React.Fragment>
                                            )}
                                            {content.type === 8 && (
                                                <React.Fragment>
                                                    <Form.Item label={<Tooltip title='单位%。'>宽*</Tooltip>}>
                                                        <InputNumber value={content.imageUrlWidth} onChange={changeDetailData.bind(this, 2, content, 'imageUrlWidth')}/>
                                                    </Form.Item>
                                                    <Form.Item label={<Tooltip title='单位%。'>高*</Tooltip>}>
                                                        <InputNumber value={content.imageUrlHeight} onChange={changeDetailData.bind(this, 2, content, 'imageUrlHeight')}/>
                                                    </Form.Item>
                                                </React.Fragment>
                                            )}
                                            <Form.Item label="响应交互">
                                                <Switch checked={content.hasInteract} onChange={changeDetailData.bind(this, 2, content, 'hasInteract')}/>
                                            </Form.Item>
                                        </Panel>
                                    )}
                                </Collapse>
                                <Form.Item label="" style={{margin:'1vh'}}>
                                    <Button type="dashed"
                                            onClick={addListItem.bind(this, item, 'content', {})}>
                                        <Icon type="plus" /> 添加项
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="内容单独交互" key="5">
                                {this.getInteractEdit(item.clickInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, item, 'clickInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Panel>
                );
            })}
            <Form.Item label="" style={{margin:'1vh',border:'none'}}>
                <Button type="dashed"
                        onClick={addListItem.bind(this, style, 'content', {})}>
                    <Icon type="plus" /> 添加内容
                </Button>
            </Form.Item>
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
        </Collapse>
    );
}

// export function getShowBoxEdit(){
//
// }