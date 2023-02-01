import React from 'react';
import {Form, Input, Collapse, Radio, Button, Tag, Icon, Select, Tooltip, Row, Col, InputNumber, Switch} from 'antd';
import ColorSelect from "../../common/colorSelect";
import FileSelect from "../../common/fileSelect";
import {addListItem, changeDetailData, deleteListItem, setColor} from "../../common/editUtil";
import {fileUrl} from "../../config";

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const {Panel} = Collapse;

export default class NumImgListEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.layerIdItem = '';
        this.colorItemOne = {num:1,color:'rgb(61,219,88)'};
        this.colorItemTwo = {bottom:1,top:2,color:'rgb(61,219,88)'};
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    //修改位置大小样式
    changeViewData(type, keyOne, keyTwo, event) {
        this.props.saveNowDataToHistory();
        let thisData = {...this.props.data};
        if (type === 1) {
            thisData[keyOne] = event.target.value;
        } else if (type === 2) {
            thisData[keyOne][keyTwo] = event.target.value;
        }
        this.props.updateData(thisData);
    }

    changeDetailData(type, item, key, event) {
        this.props.saveNowDataToHistory();
        item[key] = type === 1 ? event.target.value : event;
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    //修改颜色
    setColor(type, data) {
        this.props.saveNowDataToHistory();
        let thisData = {...this.props.data};
        const rgb = data.rgb;
        thisData.style[type] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        this.props.updateData(thisData);
    }

    setDetailColor(item, key, data) {
        this.props.saveNowDataToHistory();
        const rgb = data.rgb;
        item[key] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    // 添加列
    addColumn(list) {
        this.props.saveNowDataToHistory();
        list.push({interact:[]});
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    //删除列表内某项
    deleteColumn(list, index) {
        this.props.saveNowDataToHistory();
        list.splice(index, 1);
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    //选择图标素材弹框
    selectIcon(item, index, key) {
        this.editItem = item;
        this.editIndex = index;
        this.editKey = key;
        this.setState({visible: true});
    }

    //暂存选中的图标素材
    imgSelect(id) {
        this.selectedImg = id;
    }

    //确定选中图标素材
    handleOk() {
        this.props.saveNowDataToHistory();
        this.editItem[this.editIndex][this.editKey] = this.selectedImg;
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
        this.setState({visible: false});
    }

    //取消选择
    handleCancel() {
        this.setState({visible: false});
    }

    //删除列表内某项
    deleteList(list, index) {
        this.props.saveNowDataToHistory();
        list.splice(index, 1);
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    addListItem(list) {
        this.props.saveNowDataToHistory();
        list.push({dataType: 1, receiveId: '', dataUrl: '', keyName: '', showList:[], hideList:[]});
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    getColorSet(item,key,type,display){
        if(type > 0){
            if(item[key] == null){
                item[key] = [];
            }
            return (
                <Collapse style={{display,marginBottom: '20px'}}>
                    <Panel header="颜色列表" key="1">
                        {item[key].map((item,index) =>
                            <div key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item[key], index)}>{'列' + (index + 1)}</Tag>
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
                            <Button type="dashed" onClick={addListItem.bind(this,item,key,type === 1 ? this.colorItemOne:this.colorItemTwo)}>
                                <Icon type="plus"/> 添加颜色设置
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            );
        }

    }

    render() {
        const {style} = this.props.data;
        if(style.nameSplit == null){
            style.nameSplit = {};
        }
        if(style.numSplit == null){
            style.numSplit = {};
        }
        const {list,nameSplit,numSplit} = style;
        return (
            <div>
                <Collapse>
                    <Panel header="基础样式设置" key="1">
                        <Form.Item {...formItemLayout} label="数据格式">
                            <Select value={style.dataStyle}
                                    onChange={this.changeDetailData.bind(this, 2, style, 'dataStyle')}>
                                <Select.Option value={1}>格式一</Select.Option>
                                <Select.Option value={2}>格式二</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="列数">
                            <InputNumber value={style.columnNum} min={0} max={100} onChange={changeDetailData.bind(this, 2, style, 'columnNum')} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label={
                                <Tooltip title='单位为%（组件宽的百分比）。'>
                                    列间距
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.columnGap} min={0} max={100} onChange={changeDetailData.bind(this, 2, style, 'columnGap')} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label={
                                <Tooltip title='单位为%（组件高的百分比）。'>
                                    行间距
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.rowGap} min={0} max={100} onChange={changeDetailData.bind(this, 2, style, 'rowGap')} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label={
                                <Tooltip title='控制数字超过三位数时,千分位符是否显示。'>
                                    千分位符*
                                </Tooltip>
                            }
                        >
                            <Switch checked={style.numSplitShow}
                                    onChange={changeDetailData.bind(this, 2, style, 'numSplitShow')} />
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="小数位数">
                            <InputNumber value={style.numFixed} min={0} max={100} onChange={changeDetailData.bind(this, 2, style, 'numFixed')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="阴影设置" key="6">
                        <Form {...formItemLayout}>
                            <Form.Item label="阴影颜色">
                                <ColorSelect color={style.shadowColor} setColor={this.setColor.bind(this, 'shadowColor')}/>
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='阴影水平偏移距离'>
                                        水平偏移*
                                    </Tooltip>
                                }
                            >
                                <Input value={style.shadowLeft} onChange={changeDetailData.bind(this, 1, style, 'shadowLeft')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='阴影垂直偏移距离'>
                                        垂直偏移*
                                    </Tooltip>
                                }
                            >
                                <Input value={style.shadowTop} onChange={changeDetailData.bind(this, 1, style, 'shadowTop')} />
                            </Form.Item>
                            <Form.Item label="模糊距离" >
                                <Input value={style.blur} onChange={changeDetailData.bind(this, 1, style, 'blur')} />
                            </Form.Item>
                            <Form.Item label="阴影大小" >
                                <Input value={style.spread} onChange={changeDetailData.bind(this, 1, style, 'spread')} />
                            </Form.Item>
                        </Form>
                    </Panel>
                    <Panel header="标题设置" key="2">
                        <Form {...formItemLayout}>
                            <Collapse>
                                <Panel header="大小位置" key="4">
                                    <Form.Item
                                        label={
                                            <Tooltip title='字块宽度，单位为%（组件宽的百分比）。'>宽*</Tooltip>
                                        }
                                    >
                                        <InputNumber value={style.textWidth} onChange={changeDetailData.bind(this, 2, style, 'textWidth')} />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title='字块高度，单位为%（组件高的百分比）。'>高*</Tooltip>
                                        }
                                    >
                                        <InputNumber value={style.textHeight} onChange={changeDetailData.bind(this, 2, style, 'textHeight')} />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title='字块距离组件左边界距离，单位为%（组件宽的百分比）。'>左*</Tooltip>
                                        }
                                    >
                                        <InputNumber value={style.textLeft} onChange={changeDetailData.bind(this, 2, style, 'textLeft')} />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title='字块距离组件上边界距离，单位为%（组件高的百分比）。'>上*</Tooltip>
                                        }
                                    >
                                        <InputNumber value={style.textTop} onChange={changeDetailData.bind(this, 2, style, 'textTop')} />
                                    </Form.Item>
                                    <Form.Item label="水平位置" >
                                        <Radio.Group value={style.justifyContent} onChange={changeDetailData.bind(this, 1, style, 'justifyContent')}>
                                            <Radio.Button value="flex-start">居左</Radio.Button>
                                            <Radio.Button value="center">居中</Radio.Button>
                                            <Radio.Button value="flex-end">居右</Radio.Button>
                                            <Radio.Button value="space-between">两边</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="垂直位置" >
                                        <Radio.Group value={style.alignItems} onChange={changeDetailData.bind(this, 1, style, 'alignItems')}>
                                            <Radio.Button value="flex-start">居上</Radio.Button>
                                            <Radio.Button value="center">居中</Radio.Button>
                                            <Radio.Button value="flex-end">居下</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Panel>
                                <Panel header="主标题" key="1">
                                    <Form.Item label="键名">
                                        <Input value={list[0].nameKey} onChange={changeDetailData.bind(this, 1, list[0], 'nameKey')}/>
                                    </Form.Item>
                                    <Form.Item label="默认颜色">
                                        <ColorSelect color={list[0].normalColor} setColor={setColor.bind(this, list[0], 'normalColor')}/>
                                    </Form.Item>
                                    <Form.Item label="选中颜色">
                                        <ColorSelect color={list[0].selectedColor} setColor={setColor.bind(this, list[0], 'selectedColor')}/>
                                    </Form.Item>
                                    <Form.Item label="字体大小">
                                        <Input value={list[0].headerFontSize} onChange={changeDetailData.bind(this, 1, list[0], 'headerFontSize')}/>
                                    </Form.Item>
                                    <Form.Item label="字号粗细">
                                        <Radio.Group size="small" value={list[0].headerFontWeight}
                                                     onChange={changeDetailData.bind(this, 1, list[0], 'headerFontWeight')}>
                                            <Radio.Button value="bold">更粗</Radio.Button>
                                            <Radio.Button value="normal">正常</Radio.Button>
                                            <Radio.Button value="lighter">更细</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="行高">
                                        <Input value={list[0].headerLineHeight} onChange={changeDetailData.bind(this, 1, list[0], 'headerLineHeight')}/>
                                    </Form.Item>
                                    <Form.Item label="右间距">
                                        <Input value={list[0].mainMarginRight} onChange={changeDetailData.bind(this, 1, list[0], 'mainMarginRight')}/>
                                    </Form.Item>
                                </Panel>
                                <Panel header="分隔字符" key="2">
                                    <Form.Item label="字符内容">
                                        <Input value={nameSplit.text} onChange={changeDetailData.bind(this, 1, nameSplit, 'text')}/>
                                    </Form.Item>
                                    <Form.Item label="默认颜色">
                                        <ColorSelect color={nameSplit.color} setColor={setColor.bind(this, nameSplit, 'color')}/>
                                    </Form.Item>
                                    <Form.Item label="选中颜色">
                                        <ColorSelect color={nameSplit.selectedColor} setColor={setColor.bind(this, nameSplit, 'selectedColor')}/>
                                    </Form.Item>
                                    <Form.Item label="字体大小">
                                        <Input value={nameSplit.fontSize} onChange={changeDetailData.bind(this, 1, nameSplit, 'fontSize')}/>
                                    </Form.Item>
                                    <Form.Item label="字号粗细">
                                        <Radio.Group size="small" value={nameSplit.fontWeight}
                                                     onChange={changeDetailData.bind(this, 1, nameSplit, 'fontWeight')}>
                                            <Radio.Button value="bold">更粗</Radio.Button>
                                            <Radio.Button value="normal">正常</Radio.Button>
                                            <Radio.Button value="lighter">更细</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Panel>
                                <Panel header="副标题" key="3">
                                    <Form.Item label="键名">
                                        <Input value={list[1].nameKey} onChange={changeDetailData.bind(this, 1, list[1], 'nameKey')}/>
                                    </Form.Item>
                                    <Form.Item label="默认颜色">
                                        <ColorSelect color={list[1].normalColor} setColor={setColor.bind(this, list[1], 'normalColor')}/>
                                    </Form.Item>
                                    <Form.Item label="选中颜色">
                                        <ColorSelect color={list[1].selectedColor} setColor={setColor.bind(this, list[1], 'selectedColor')}/>
                                    </Form.Item>
                                    <Form.Item label="字体大小">
                                        <Input value={list[1].headerFontSize} onChange={changeDetailData.bind(this, 1, list[1], 'headerFontSize')}/>
                                    </Form.Item>
                                    <Form.Item label="行高">
                                        <Input value={list[1].headerLineHeight} onChange={changeDetailData.bind(this, 1, list[1], 'headerLineHeight')}/>
                                    </Form.Item>
                                    <Form.Item label="字号粗细">
                                        <Radio.Group size="small" value={list[1].headerFontWeight}
                                                     onChange={changeDetailData.bind(this, 1, list[1], 'headerFontWeight')}>
                                            <Radio.Button value="bold">更粗</Radio.Button>
                                            <Radio.Button value="normal">正常</Radio.Button>
                                            <Radio.Button value="lighter">更细</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        </Form>
                    </Panel>
                    <Panel header="数字设置" key="3">
                        <Form {...formItemLayout}>
                            <Collapse>
                                <Panel header="大小位置" key="4">
                                    <Form.Item
                                        label={
                                            <Tooltip title='字块宽度，单位为%（组件宽的百分比）。'>宽*</Tooltip>
                                        }
                                    >
                                        <InputNumber value={style.numWidth} onChange={changeDetailData.bind(this, 2, style, 'numWidth')} />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title='字块高度，单位为%（组件高的百分比）。'>高*</Tooltip>
                                        }
                                    >
                                        <InputNumber value={style.numHeight} onChange={changeDetailData.bind(this, 2, style, 'numHeight')} />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title='字块距离组件左边界距离，单位为%（组件宽的百分比）。'>左*</Tooltip>
                                        }
                                    >
                                        <InputNumber value={style.numLeft} onChange={changeDetailData.bind(this, 2, style, 'numLeft')} />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title='字块距离组件上边界距离，单位为%（组件高的百分比）。'>上*</Tooltip>
                                        }
                                    >
                                        <InputNumber value={style.numTop} onChange={changeDetailData.bind(this, 2, style, 'numTop')} />
                                    </Form.Item>
                                    <Form.Item label="水平位置" >
                                        <Radio.Group value={style.numJustifyContent} onChange={changeDetailData.bind(this, 1, style, 'numJustifyContent')}>
                                            <Radio.Button value="flex-start">居左</Radio.Button>
                                            <Radio.Button value="center">居中</Radio.Button>
                                            <Radio.Button value="flex-end">居右</Radio.Button>
                                            <Radio.Button value="space-between">两边</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="垂直位置" >
                                        <Radio.Group value={style.numAlignItems} onChange={changeDetailData.bind(this, 1, style, 'numAlignItems')}>
                                            <Radio.Button value="flex-start">居上</Radio.Button>
                                            <Radio.Button value="center">居中</Radio.Button>
                                            <Radio.Button value="flex-end">居下</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Panel>
                                <Panel header="主项" key="1">
                                    <Form.Item label="键名">
                                        <Input value={list[0].numKey} onChange={changeDetailData.bind(this, 1, list[0], 'numKey')}/>
                                    </Form.Item>

                                    <Form.Item label="字色类型">
                                        <Radio.Group value={list[0].numColorType} onChange={changeDetailData.bind(this, 1, list[0], 'numColorType')}>
                                            <Radio value={1}>统一色</Radio>
                                            <Radio value={3}>根据序号不同取不同色</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="字色" style={{display:list[0].numColorType !== 1 ? 'none':''}}>
                                        <ColorSelect color={list[0].normalNumColor} setColor={setColor.bind(this, list[0], 'normalNumColor')}/>
                                    </Form.Item>
                                    {list[0].numColorType === 3 && this.getColorSet(list[0],'normalNumColorList',2,'')}

                                    <Form.Item label="默认颜色">
                                        <ColorSelect color={list[0].normalNumColor} setColor={setColor.bind(this, list[0], 'normalNumColor')}/>
                                    </Form.Item>
                                    <Form.Item label="选中颜色">
                                        <ColorSelect color={list[0].selectedNumColor} setColor={setColor.bind(this, list[0], 'selectedNumColor')}/>
                                    </Form.Item>
                                    <Form.Item label="字体大小">
                                        <Input value={list[0].numFontSize} onChange={changeDetailData.bind(this, 1, list[0], 'numFontSize')}/>
                                    </Form.Item>
                                    <Form.Item label="行高">
                                        <Input value={list[0].numLineHeight} onChange={changeDetailData.bind(this, 1, list[0], 'numLineHeight')}/>
                                    </Form.Item>
                                    <Form.Item label="字号粗细">
                                        <Radio.Group size="small" value={list[0].numFontWeight}
                                                     onChange={changeDetailData.bind(this, 1, list[0], 'numFontWeight')}>
                                            <Radio.Button value="bold">更粗</Radio.Button>
                                            <Radio.Button value="normal">正常</Radio.Button>
                                            <Radio.Button value="lighter">更细</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Panel>
                                <Panel header="分隔字符" key="2">
                                    <Form.Item label="字符内容">
                                        <Input value={numSplit.text} onChange={changeDetailData.bind(this, 1, numSplit, 'text')}/>
                                    </Form.Item>
                                    <Form.Item label="默认颜色">
                                        <ColorSelect color={numSplit.color} setColor={setColor.bind(this, numSplit, 'color')}/>
                                    </Form.Item>
                                    <Form.Item label="选中颜色">
                                        <ColorSelect color={numSplit.selectedColor} setColor={setColor.bind(this, numSplit, 'selectedColor')}/>
                                    </Form.Item>
                                    <Form.Item label="字体大小">
                                        <Input value={numSplit.fontSize} onChange={changeDetailData.bind(this, 1, numSplit, 'fontSize')}/>
                                    </Form.Item>
                                    <Form.Item label="字号粗细">
                                        <Radio.Group size="small" value={numSplit.fontWeight}
                                                     onChange={changeDetailData.bind(this, 1, numSplit, 'fontWeight')}>
                                            <Radio.Button value="bold">更粗</Radio.Button>
                                            <Radio.Button value="normal">正常</Radio.Button>
                                            <Radio.Button value="lighter">更细</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Panel>
                                <Panel header="副项" key="3">
                                    <Form.Item label="键名">
                                        <Input value={list[1].numKey} onChange={changeDetailData.bind(this, 1, list[1], 'numKey')}/>
                                    </Form.Item>
                                    <Form.Item label="字色类型">
                                        <Radio.Group value={list[1].numColorType} onChange={changeDetailData.bind(this, 1, list[1], 'numColorType')}>
                                            <Radio value={1}>统一色</Radio>
                                            <Radio value={3}>根据序号不同取不同色</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="字色" style={{display:list[1].numColorType !== 1 ? 'none':''}}>
                                        <ColorSelect color={list[1].normalNumColor} setColor={setColor.bind(this, list[1], 'normalNumColor')}/>
                                    </Form.Item>
                                    {list[1].numColorType === 3 && this.getColorSet(list[1],'normalNumColorList',2,'')}
                                    <Form.Item label="默认颜色">
                                        <ColorSelect color={list[1].normalNumColor} setColor={setColor.bind(this, list[1], 'normalNumColor')}/>
                                    </Form.Item>
                                    <Form.Item label="选中颜色">
                                        <ColorSelect color={list[1].selectedNumColor} setColor={setColor.bind(this, list[1], 'selectedNumColor')}/>
                                    </Form.Item>
                                    <Form.Item label="字体大小">
                                        <Input value={list[1].numFontSize} onChange={changeDetailData.bind(this, 1, list[1], 'numFontSize')}/>
                                    </Form.Item>
                                    <Form.Item label="行高">
                                        <Input value={list[1].numLineHeight} onChange={changeDetailData.bind(this, 1, list[1], 'numLineHeight')}/>
                                    </Form.Item>
                                    <Form.Item label="字号粗细">
                                        <Radio.Group size="small" value={list[1].numFontWeight}
                                                     onChange={changeDetailData.bind(this, 1, list[1], 'numFontWeight')}>
                                            <Radio.Button value="bold">更粗</Radio.Button>
                                            <Radio.Button value="normal">正常</Radio.Button>
                                            <Radio.Button value="lighter">更细</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        </Form>
                    </Panel>
                    <Panel header="图标设置" key="5">
                        <Form {...formItemLayout}>
                            <Form.Item
                                label={
                                    <Tooltip title='单位为%（组件宽的百分比）。'>
                                        宽度*
                                    </Tooltip>
                                }
                            >
                                <InputNumber value={style.coverImgWidth} min={0} max={100} onChange={changeDetailData.bind(this, 2, style, 'coverImgWidth')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='单位为%（组件高的百分比）。'>
                                        高度*
                                    </Tooltip>
                                }
                            >
                                <InputNumber value={style.coverImgHeight} min={0} max={100} onChange={changeDetailData.bind(this, 2, style, 'coverImgHeight')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='单位为%（组件高的百分比）。'>
                                        上边距*
                                    </Tooltip>
                                }
                            >
                                <InputNumber value={style.coverImgTop} min={0} max={100} onChange={changeDetailData.bind(this, 2, style, 'coverImgTop')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='单位为%（组件宽的百分比）。'>
                                        左边距*
                                    </Tooltip>
                                }
                            >
                                <InputNumber value={style.coverImgLeft} min={0} max={100} onChange={changeDetailData.bind(this, 2, style, 'coverImgLeft')} />
                            </Form.Item>
                        </Form>
                    </Panel>
                    <Panel header="选项设置" key="4">
                        {style.coverImgList.map((item, index) =>
                            <div key={index} style={{marginBottom: '24px'}}>
                                <Tag closable={style.coverImgList.length > 1} visible={true}
                                     onClose={this.deleteColumn.bind(this, style.coverImgList, index)}>
                                    {'项' + (index + 1)}</Tag>
                                <Form.Item {...formItemLayout} label="类型值" style={{marginBottom: '0px'}}>
                                    <Input value={item.id} onChange={this.changeDetailData.bind(this, 1, item, 'id')}/>
                                </Form.Item>
                                <Collapse>
                                    <Panel header="默认样式" key="2">
                                        <Form {...formItemLayout}>
                                            <Form.Item label="图标" style={{marginBottom: '0px'}}>
                                                {
                                                    item.normalImg ? (
                                                        <img src={fileUrl + '/download/' + item.normalImg} alt=""
                                                             style={{width: '104px', height: '104px'}}
                                                             onClick={this.selectIcon.bind(this, style.coverImgList, index, 'normalImg')}/>
                                                    ) : (
                                                        <Button type="dashed"
                                                                onClick={this.selectIcon.bind(this, style.coverImgList, index, 'normalImg')}>
                                                            <Icon type="plus"/> 选择图标
                                                        </Button>
                                                    )
                                                }
                                            </Form.Item>
                                            <Form.Item label="背景">
                                                <ColorSelect color={item.itemBgColor}
                                                             setColor={this.setDetailColor.bind(this, item, 'itemBgColor')}/>
                                            </Form.Item>
                                            <Form.Item label="边角弧度" >
                                                <Input value={item.borderRadius} onChange={changeDetailData.bind(this, 1, item, 'borderRadius')} />
                                            </Form.Item>
                                            <Form.Item label="边框线宽" >
                                                <Input value={item.borderWidth} onChange={changeDetailData.bind(this, 1, item, 'borderWidth')} />
                                            </Form.Item>
                                            <Form.Item label="边框颜色" >
                                                <ColorSelect color={item.borderColor} setColor={setColor.bind(this, item, 'borderColor')} />
                                            </Form.Item>
                                            <Form.Item label="边框类型" >
                                                <Radio.Group value={item.borderStyle} onChange={changeDetailData.bind(this, 1, item, 'borderStyle')}>
                                                    <Radio value="solid">实线</Radio>
                                                    <Radio value="dashed">虚线1</Radio>
                                                    <Radio value="dotted">虚线2</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item label="左" >
                                                <Input value={item.liLeft} onChange={changeDetailData.bind(this, 1, item, 'liLeft')} />
                                            </Form.Item>
                                            <Form.Item label="上" >
                                                <Input value={item.liTop} onChange={changeDetailData.bind(this, 1, item, 'liTop')} />
                                            </Form.Item>
                                        </Form>
                                    </Panel>
                                    <Panel header="选中样式" key="3">
                                        <Form {...formItemLayout}>
                                            <Form.Item label="图标">
                                                {
                                                    item.selectedImg ? (
                                                        <img src={fileUrl + '/download/' + item.selectedImg} alt=""
                                                             style={{width: '104px', height: '104px'}}
                                                             onClick={this.selectIcon.bind(this, style.coverImgList, index, 'selectedImg')}/>
                                                    ) : (
                                                        <Button type="dashed"
                                                                onClick={this.selectIcon.bind(this, style.coverImgList, index, 'selectedImg')}>
                                                            <Icon type="plus"/> 选择图标
                                                        </Button>
                                                    )
                                                }
                                            </Form.Item>
                                            <Form.Item label="背景">
                                                <ColorSelect color={item.selectedBgColor}
                                                             setColor={this.setDetailColor.bind(this, item, 'selectedBgColor')}/>
                                            </Form.Item>
                                            <Form.Item label="边角弧度" >
                                                <Input value={item.selectedBorderRadius} onChange={changeDetailData.bind(this, 1, item, 'selectedBorderRadius')} />
                                            </Form.Item>
                                            <Form.Item label="边框线宽" >
                                                <Input value={item.selectedBorderWidth} onChange={changeDetailData.bind(this, 1, item, 'selectedBorderWidth')} />
                                            </Form.Item>
                                            <Form.Item label="边框颜色" >
                                                <ColorSelect color={item.selectedBorderColor} setColor={setColor.bind(this, item, 'selectedBorderColor')} />
                                            </Form.Item>
                                            <Form.Item label="边框类型" >
                                                <Radio.Group value={item.selectedBorderStyle} onChange={changeDetailData.bind(this, 1, item, 'selectedBorderStyle')}>
                                                    <Radio value="solid">实线</Radio>
                                                    <Radio value="dashed">虚线1</Radio>
                                                    <Radio value="dotted">虚线2</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Form>
                                    </Panel>
                                    <Panel header="交互" key="1">
                                        {item.interact.map((interact, interactIndex) =>
                                            <Form {...formItemLayout} key={interactIndex}
                                                  style={{marginBottom: '20px'}}>
                                                <Tag closable={true} visible={true}
                                                     onClose={this.deleteList.bind(this, item.interact, interactIndex)}>
                                                    {'交互内容' + (interactIndex + 1)}</Tag>
                                                <Form.Item label="交互方式">
                                                    <Select value={interact.type}
                                                            onChange={this.changeDetailData.bind(this, 2, interact, 'type')}>
                                                        <Select.Option value={1}>修改条件</Select.Option>
                                                        <Select.Option value={2}>图层显隐控制</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item label="交互对象"
                                                           style={{display: interact.type === 1 ? 'block' : 'none'}}>
                                                    <Select value={interact.receiveId}
                                                            onChange={this.changeDetailData.bind(this, 2, interact, 'receiveId')}>
                                                        {this.props.componentList.map((component) => {
                                                            if (component.id === this.props.data.id) {
                                                                return '';
                                                            } else {
                                                                return <Select.Option value={component.id}
                                                                                      key={component.id}>{component.nickName}</Select.Option>;
                                                            }
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item label="内容键名" style={{display:interact.type === 1 ? 'block':'none'}}>
                                                    <Input value={interact.dataKeyName}
                                                           onChange={this.changeDetailData.bind(this, 1, interact, 'dataKeyName')}/>
                                                </Form.Item>
                                                <Form.Item label="传输键名" style={{display:interact.type === 1 ? 'block':'none'}}>
                                                    <Input value={interact.messageKey}
                                                           onChange={this.changeDetailData.bind(this, 1, interact, 'messageKey')}/>
                                                </Form.Item>
                                                <Form.Item
                                                    style={{display:interact.type !== 2 ? 'none':''}}
                                                    label={
                                                        <span>
                                                            <Tooltip title="点击添加">
                                                                <Icon type="plus" style={{cursor:'pointer',marginRight:'0.5vh'}} onClick={addListItem.bind(this,interact,'showList',this.layerIdItem)}/>
                                                            </Tooltip>
                                                            <Tooltip title="点击后需要显示的图层">
                                                                显示*
                                                            </Tooltip>
                                                        </span>
                                                    }
                                                >
                                                    {
                                                        interact.showList == null ? '' : (
                                                            interact.showList.map((item,showIndex) =>
                                                                <Row key={showIndex} gutter={[20, 24]}>
                                                                    <Col span={18} >
                                                                        <Select value={item}
                                                                                onChange={this.changeDetailData.bind(this, 2, interact.showList, showIndex)}>
                                                                            {this.props.layerList.map((layer) =>
                                                                                <Select.Option value={layer.id} key={layer.id}>{layer.name}</Select.Option>
                                                                            )}
                                                                        </Select>
                                                                    </Col>
                                                                    <Col span={4} >
                                                                        <Icon type="close" />
                                                                    </Col>
                                                                </Row>
                                                            )
                                                        )
                                                    }
                                                </Form.Item>
                                                <Form.Item
                                                    style={{display:interact.type !== 2 ? 'none':''}}
                                                    label={
                                                        <span>
                                                            <Tooltip title="点击添加">
                                                                <Icon type="plus" style={{cursor:'pointer',marginRight:'0.5vh'}} onClick={addListItem.bind(this,interact,'hideList',this.layerIdItem)}/>
                                                            </Tooltip>
                                                            <Tooltip title="点击后需要隐藏的图层">
                                                                隐藏*
                                                            </Tooltip>
                                                        </span>
                                                    }
                                                >
                                                    {
                                                        interact.hideList == null ? '' : (
                                                            interact.hideList.map((item,showIndex) =>
                                                                <Row key={showIndex} gutter={[20, 24]}>
                                                                    <Col span={18} >
                                                                        <Select value={item}
                                                                                onChange={this.changeDetailData.bind(this, 2, interact.hideList, showIndex)}>
                                                                            {this.props.layerList.map((layer) =>
                                                                                <Select.Option value={layer.id} key={layer.id}>{layer.name}</Select.Option>
                                                                            )}
                                                                        </Select>
                                                                    </Col>
                                                                    <Col span={4} >
                                                                        <Icon type="close" onClick={deleteListItem.bind(this, interact.hideList, showIndex)}/>
                                                                    </Col>
                                                                </Row>
                                                            )
                                                        )
                                                    }
                                                </Form.Item>
                                                <Form.Item label={<Tooltip title="格式为json字串">附带数据*</Tooltip>}>
                                                    <Input value={interact.remark}
                                                           onChange={this.changeDetailData.bind(this, 1, interact, 'remark')}/>
                                                </Form.Item>
                                            </Form>
                                        )}
                                        <Form.Item {...formItemLayout} label="">
                                            <Button type="dashed"
                                                    onClick={this.addListItem.bind(this, item.interact)}>
                                                <Icon type="plus"/> 添加交互内容
                                            </Button>
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                            </div>
                        )}
                        <Form.Item {...formItemLayout} label="">
                            <Button type="dashed" onClick={this.addColumn.bind(this, style.coverImgList)}>
                                <Icon type="plus"/> 添加列
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
                <FileSelect
                    title="图标选择"
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    imgSelect={this.imgSelect.bind(this)} token={this.props.token}
                    width={650}
                />
            </div>
        );
    }
}
