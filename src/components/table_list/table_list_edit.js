import React from 'react';
import { Form, Input, Collapse, Tag, Button, Radio, Icon, Tooltip, Switch, Slider, InputNumber, Select } from 'antd';
import ColorSelect from "../../common/colorSelect";
import {
    addListItem,
    changeDetailData,
    deleteListItem, iconClick,
    selectIconCancel,
    selectIconOk,
    selectIcon,
    setColor,
    getTypeImageEdit, changeDetailDataWithTime, getInteractEdit
} from "../../common/editUtil";
import { getColorList } from "../../common/nameNumEditUtil";
import FileSelect from "../../common/fileSelect";


import { fileUrl } from "../../config";
import cssStyle from "../name_num_type_seven/name_num_type_seven.module.css";

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const { Panel } = Collapse;
const { TextArea } = Input;

export default class TableListEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.calculateItem = { value: '', more: 0, less: 100, color: '#fff', spicaleSize: '1em' };
        this.getColorList = getColorList.bind(this);
        this.getTypeImageEdit = getTypeImageEdit.bind(this);
        this.getInteractEdit = getInteractEdit.bind(this);
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    //修改位置大小样式
    changeViewData(type, keyOne, keyTwo, event) {
        this.props.saveNowDataToHistory();
        let thisData = { ...this.props.data };
        if (type === 1) {
            thisData[keyOne] = event.target.value;
        } else if (type === 2) {
            thisData[keyOne][keyTwo] = event.target.value;
        }
        this.props.updateData(thisData);
    }

    changeDetailData(item, key, event) {
        this.props.saveNowDataToHistory();
        item[key] = event.target.value;
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    //修改颜色
    setColor(type, data) {
        this.props.saveNowDataToHistory();
        let thisData = { ...this.props.data };
        const rgb = data.rgb;
        thisData.style[type] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        this.props.updateData(thisData);
    }

    setDetailColor(item, key, data) {
        this.props.saveNowDataToHistory();
        const rgb = data.rgb;
        item[key] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    // 添加列
    addColumn(list) {
        this.props.saveNowDataToHistory();
        list.push({});
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    // 删除列
    deleteColumn(list, index) {
        this.props.saveNowDataToHistory();
        list.splice(index, 1);
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    //列特殊颜色设置内容
    getCalculateList(column) {
        if (column.calculateList == null) {
            column.calculateList = [];
        }
        return (
            column.calculateList.map((calculate, calculateIndex) => {
                return (
                    <div key={calculateIndex}>
                        <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, column.calculateList, calculateIndex)}>
                            {'条件' + (calculateIndex + 1)}
                        </Tag>
                        {column.calculateType === 1 && (
                            <Form.Item label="值">
                                <Input value={calculate.value} onChange={changeDetailData.bind(this, 1, calculate, 'value')} />
                            </Form.Item>
                        )}
                        {column.calculateType === 2 && (
                            <Form.Item label="大于等于">
                                <Input value={calculate.more} onChange={changeDetailData.bind(this, 1, calculate, 'more')} />
                            </Form.Item>
                        )}
                        {column.calculateType === 2 && (
                            <Form.Item label="小于">
                                <Input value={calculate.less} onChange={changeDetailData.bind(this, 1, calculate, 'less')} />
                            </Form.Item>
                        )}
                        <Form.Item label="字号">
                            <Input value={calculate.spicaleSize} onChange={changeDetailData.bind(this, 1, calculate, 'spicaleSize')} />
                        </Form.Item>
                        <Form.Item label="颜色">
                            <ColorSelect color={calculate.color} setColor={setColor.bind(this, calculate, 'color')} />
                        </Form.Item>
                    </div>
                )
            })
        )
    }

    getDataContentEdit(item) {
        return (
            <React.Fragment >
                <Form.Item label="键名">
                    <Input value={item.keyName}
                        onChange={this.changeDetailData.bind(this, item, 'keyName')} />
                </Form.Item>
                <Form.Item label="标题对齐">
                    <Radio.Group size="small" value={item.justifyContent}
                        onChange={this.changeDetailData.bind(this, item, 'justifyContent')}>
                        <Radio.Button value="flex-start">居左</Radio.Button>
                        <Radio.Button value="center">居中</Radio.Button>
                        <Radio.Button value="flex-end">居右</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="内容对齐">
                    <Radio.Group size="small" value={item.textAlign}
                        onChange={this.changeDetailData.bind(this, item, 'textAlign')}>
                        <Radio.Button value="left">居左</Radio.Button>
                        <Radio.Button value="center">居中</Radio.Button>
                        <Radio.Button value="right">居右</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="内容类型">
                    <Radio.Group onChange={changeDetailData.bind(this, 1, item, 'contentType')} value={item.contentType}>
                        <Radio value={1}>文字</Radio>
                        <Radio value={2}>图片</Radio>
                        <Radio value={3}>文字内容图片背景</Radio>
                    </Radio.Group>
                </Form.Item>
                {item.contentType === 2 && (
                    <Form.Item label="空提示语">
                        <Radio.Group onChange={changeDetailData.bind(this, 1, item, 'noSubShowType')} value={item.noSubShowType}>
                            <Radio value={1}>值</Radio>
                            <Radio value={2}>
                                字串<Input value={item.noSubShowText}onChange={this.changeDetailData.bind(this, item, 'noSubShowText')} />
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                )}
                {item.contentType !== 2 && (
                    <div>
                        <Form.Item
                            label={
                                <Tooltip title="列内容格式器。内容为函数代码。">
                                    格式器*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={item.formatter}
                                onChange={this.changeDetailData.bind(this, item, 'formatter')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='固定为内容设置内字体颜色，特殊为根据规则展示不同颜色。'>
                                    字色类型*
                                </Tooltip>
                            }
                        >
                            <Radio.Group size="small" value={item.colorType}
                                onChange={this.changeDetailData.bind(this, item, 'colorType')}>
                                <Radio.Button value={1}>固定</Radio.Button>
                                <Radio.Button value={2}>特殊</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字色" style={{ display: item.colorType === 2 ? 'none' : '' }}>
                            <ColorSelect color={item.fontColor} setColor={setColor.bind(this, item, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="计算方式" style={{ display: item.colorType !== 2 ? 'none' : '' }}>
                            <Radio.Group size="small" value={item.calculateType}
                                onChange={this.changeDetailData.bind(this, item, 'calculateType')}>
                                <Radio.Button value={1}>相等</Radio.Button>
                                <Radio.Button value={2}>区间</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Collapse style={{ display: item.colorType !== 2 ? 'none' : '' }}>
                            <Panel header="具体字色条件设置" key="1">
                                <Form.Item label="依据字段">
                                    <Input value={item.colorKeyName}
                                        onChange={this.changeDetailData.bind(this, item, 'colorKeyName')} />
                                </Form.Item>
                                {this.getCalculateList(item)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, item, 'calculateList', this.calculateItem)}>
                                        <Icon type="plus" /> 添加条件
                                    </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                        <Form.Item label="文字换行">
                            <Radio.Group onChange={changeDetailData.bind(this, 1, item, 'textWrap')} value={item.textWrap}>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="附加图片显示">
                            <Radio.Group onChange={changeDetailData.bind(this, 1, item, 'showAdditionalImg')} value={item.showAdditionalImg}>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Collapse style={{ display: item.showAdditionalImg === 1 ? 'block' : 'none' }}>
                            <Panel header="图标设置" key="1">
                                <Form.Item label="图片宽">
                                    <InputNumber value={item.imgWidth} onChange={changeDetailData.bind(this, 2, item, 'imgWidth')} />
                                </Form.Item>
                                <Form.Item label="图片高">
                                    <InputNumber value={item.imgHeight} onChange={changeDetailData.bind(this, 2, item, 'imgHeight')} />
                                </Form.Item>
                                <Form.Item label="依据字段" >
                                    <Input value={item.titleImgKey} onChange={changeDetailData.bind(this, 1, item, 'titleImgKey')} />
                                </Form.Item>
                                {this.getTypeImageEdit(item, 'titleImg', 'titleImgCalculateType')}
                            </Panel>
                        </Collapse>
                    </div>
                )}
                {item.contentType === 3 && (
                    <React.Fragment>
                        <Form.Item label={<Tooltip title='单位em。'>背景宽*</Tooltip>} >
                            <InputNumber value={item.imageBgWidth} onChange={changeDetailData.bind(this, 2, item, 'imageBgWidth')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>背景高*</Tooltip>} >
                            <InputNumber value={item.imageBgHeight} onChange={changeDetailData.bind(this, 2, item, 'imageBgHeight')} />
                        </Form.Item>
                    </React.Fragment>
                )}
                {(item.contentType === 2 || item.contentType === 3) && this.getTypeImageEdit(item, 'imageList', 'imageCalculateType', '具体背景图设置')}
                <Form.Item label="响应方式">
                    <Radio.Group value={item.actionType} onChange={this.changeDetailData.bind(this, item, 'actionType')}>
                        <Radio value={1}>默认</Radio>
                        <Radio value={2}>单独响应</Radio>
                    </Radio.Group>
                </Form.Item>
                {item.actionType === 2 && (
                    <Collapse >
                        <Panel header="点击交互" key="1">
                            {this.getInteractEdit(item.interact)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, item, 'interact', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                )}
            </React.Fragment>
        );
    }

    getOperationEdit(item) {
        return (
            <React.Fragment >
                <Form.Item label="操作内容">
                    <Select value={item.operationType} onChange={changeDetailDataWithTime.bind(this, 2, item, 'operationType', item)}>
                        <Select.Option value={'operation'} >通用操作</Select.Option>
                        <Select.Option value={'linanAssigned'} >临安-交办</Select.Option>
                        <Select.Option value={'wzmzxShowImg'} >温州民转刑查看图像</Select.Option>
                        <Select.Option value={'operationYqshzl'} >乐清社会治理</Select.Option>
                    </Select>
                </Form.Item>
                {item.operationType === 'operation' && (
                    <React.Fragment >
                        <Form.Item label="按钮内容">
                            <Input value={item.operationText} onChange={changeDetailData.bind(this, 1, item, 'operationText')} />
                        </Form.Item>
                        <Collapse >
                            <Panel header="交互设置" key="2">
                                {this.getInteractEdit(item.operationInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, item, 'operationInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </React.Fragment>
                )}
                {item.operationType === 'operationYqshzl' && (
                    <React.Fragment >
                        <Collapse >
                            <Panel header="流转交互设置" key="2">
                                {this.getInteractEdit(item.turnToInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, item, 'turnToInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="交办交互设置" key="3">
                                {this.getInteractEdit(item.assignInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, item, 'assignInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="督办交互设置" key="5">
                                {this.getInteractEdit(item.overseeInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, item, 'overseeInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </React.Fragment>
                )}
                {item.operationType === 'linanAssigned' && (
                    <React.Fragment >
                        <Form.Item label="请求地址">
                            <Input value={item.operationUrl} onChange={changeDetailData.bind(this, 1, item, 'operationUrl')} />
                        </Form.Item>
                    </React.Fragment>
                )}
                {item.operationType === 'wzmzxShowImg' && (
                    <React.Fragment >
                        <Form.Item label="图片键名">
                            <Input value={item.imageKey} onChange={changeDetailData.bind(this, 1, item, 'imageKey')} />
                        </Form.Item>
                    </React.Fragment>
                )}
            </React.Fragment>
        )
    }

    render() {
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout}>
                <Collapse>
                    <Panel header="列键设置" key="1">
                        <Form.Item label="序号显示">
                            <Switch checked={style.indexShow}
                                onChange={changeDetailData.bind(this, 2, style, 'indexShow')} />
                        </Form.Item>
                        <Form.Item label="序号名称" style={{ display: style.indexShow ? '' : 'none' }}>
                            <Input value={style.name}
                                onChange={this.changeDetailData.bind(this, style, 'name')} />
                        </Form.Item>
                        <Form.Item label="序号列宽" style={{ display: style.indexShow ? '' : 'none' }}>
                            <Input value={style.indexWidth}
                                onChange={this.changeDetailData.bind(this, style, 'indexWidth')} />
                        </Form.Item>
                        <Form.Item label="累计序号">
                            <Switch checked={style.indexCumulative}
                                    onChange={changeDetailData.bind(this, 2, style, 'indexCumulative')} />
                        </Form.Item>
                        <Form.Item label="对齐方式">
                            <Radio.Group size="small" value={style.indexAlign}
                                onChange={this.changeDetailData.bind(this, style, 'indexAlign')}>
                                <Radio.Button value="left">居左</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="right">居右</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="序号颜色">
                            <ColorSelect color={style.indexColor} setColor={setColor.bind(this, style, 'indexColor')} />
                        </Form.Item>
                        {style.column.map((item, index) =>
                            <div key={index} style={{ marginBottom: '24px' }}>
                                <Tag closable={style.column.length > 1} visible={true}
                                    onClose={this.deleteColumn.bind(this, style.column, index)}>
                                    {'列' + (index + 1)}</Tag>
                                <Form.Item label="展示名">
                                    <Input value={item.showName}
                                        onChange={this.changeDetailData.bind(this, item, 'showName')} />
                                </Form.Item>
                                <Form.Item label="内容类型">
                                    <Radio.Group value={item.contentShowType} onChange={changeDetailDataWithTime.bind(this, 1, item, 'contentShowType', item)}>
                                        <Radio value={'data'}>数据</Radio>
                                        <Radio value={'operation'}>操作</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="列宽">
                                    <Input value={item.columnWidth}
                                        onChange={this.changeDetailData.bind(this, item, 'columnWidth')} />
                                </Form.Item>
                                {item.contentShowType === 'operation' ? this.getOperationEdit(item) : this.getDataContentEdit(item)}
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={this.addColumn.bind(this, style.column)}>
                                <Icon type="plus" /> 添加列
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="样式设置" key="2">
                        <Form.Item label="背景色">
                            <ColorSelect color={this.props.data.style.backgroundColor}
                                setColor={this.setColor.bind(this, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item label="边框线宽" >
                            <Input value={style.borderWidthBox} onChange={changeDetailData.bind(this, 1, style, 'borderWidthBox')} />
                        </Form.Item>
                        <Form.Item label="边框颜色" >
                            <ColorSelect color={style.borderColorBox} setColor={setColor.bind(this, style, 'borderColorBox')} />
                        </Form.Item>
                        <Form.Item label="边框圆角" >
                            <Input value={style.borderRadiusBox} onChange={changeDetailData.bind(this, 1, style, 'borderRadiusBox')} />
                        </Form.Item>
                        <Form.Item label="边框类型" >
                            <Radio.Group value={style.borderStyleBox} onChange={changeDetailData.bind(this, 1, style, 'borderStyleBox')}>
                                <Radio value="solid">实线</Radio>
                                <Radio value="dashed">虚线1</Radio>
                                <Radio value="dotted">虚线2</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="标题" key="3">
                        <Form.Item label="是否展示">
                            <Radio.Group value={this.props.data.style.titleShow}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'titleShow')}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="行高">
                            <Input value={this.props.data.style.titleHeight}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'titleHeight')} />
                        </Form.Item>
                        <Form.Item label="字号大小">
                            <Input value={this.props.data.style.titleFontSize}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'titleFontSize')} />
                        </Form.Item>
                        <Form.Item label="字号粗细">
                            <Radio.Group size="small" value={this.props.data.style.titleFontWeight}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'titleFontWeight')}>
                                <Radio.Button value="bold">更粗</Radio.Button>
                                <Radio.Button value="normal">正常</Radio.Button>
                                <Radio.Button value="lighter">更细</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={this.props.data.style.titleColor}
                                setColor={this.setColor.bind(this, 'titleColor')} />
                        </Form.Item>
                        <Form.Item label="背景色">
                            <ColorSelect color={this.props.data.style.titleBg}
                                setColor={this.setColor.bind(this, 'titleBg')} />
                        </Form.Item>
                        <Form.Item label="边角弧度" >
                            <Input value={style.borderRadius} onChange={changeDetailData.bind(this, 1, style, 'borderRadius')} />
                        </Form.Item>
                        <Form.Item label="边框线宽" >
                            <Input value={style.borderWidth} onChange={changeDetailData.bind(this, 1, style, 'borderWidth')} />
                        </Form.Item>
                        <Form.Item label="边框颜色" >
                            <ColorSelect color={style.borderColor} setColor={setColor.bind(this, style, 'borderColor')} />
                        </Form.Item>
                        <Form.Item label="边框类型" >
                            <Radio.Group value={style.borderStyle} onChange={changeDetailData.bind(this, 1, style, 'borderStyle')}>
                                <Radio.Button value="solid">实线</Radio.Button>
                                <Radio.Button value="dashed">虚线1</Radio.Button>
                                <Radio.Button value="dotted">虚线2</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="子项边框线宽" >
                            <Input value={style.itemBorderWidth} onChange={changeDetailData.bind(this, 1, style, 'itemBorderWidth')} />
                        </Form.Item>
                        <Form.Item label="子项边框颜色" >
                            <ColorSelect color={style.itemBorderColor} setColor={setColor.bind(this, style, 'itemBorderColor')} />
                        </Form.Item>
                        <Form.Item label="子项边框类型" >
                            <Radio.Group value={style.itemBorderStyle} onChange={changeDetailData.bind(this, 1, style, 'itemBorderStyle')}>
                                <Radio.Button value="solid">实线</Radio.Button>
                                <Radio.Button value="dashed">虚线1</Radio.Button>
                                <Radio.Button value="dotted">虚线2</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="内容" key="4">
                        {/*<Form.Item label="行数">*/}
                        {/*    <Input value={this.props.data.style.rowNum}*/}
                        {/*           onChange={this.changeViewData.bind(this, 2, 'style', 'rowNum')}/>*/}
                        {/*</Form.Item>*/}
                        <Form.Item label="滚动条样式">
                            <Select value={style.scrollbarsTheme} onChange={changeDetailData.bind(this, 2, style, 'scrollbarsTheme')}>
                                <Select.Option value={''}>默认</Select.Option>
                                <Select.Option value={'blueScrollbars'}>蓝色</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="超出换行">
                            <Switch checked={style.beyondNewLine}
                                    onChange={changeDetailData.bind(this, 2, style, 'beyondNewLine')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <Input value={this.props.data.style.lineHeight}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'lineHeight')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>字高*</Tooltip>} >
                            <InputNumber value={style.fontHeight} onChange={changeDetailData.bind(this, 2, style, 'fontHeight')} />
                        </Form.Item>
                        <Form.Item label="行外边距">
                            <Input value={this.props.data.style.lineMargin}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'lineMargin')} />
                        </Form.Item>
                        <Form.Item label="字号大小">
                            <Input value={this.props.data.style.contentFontSize}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'contentFontSize')} />
                        </Form.Item>
                        <Form.Item label="字号粗细">
                            <Radio.Group size="small" value={this.props.data.style.contentFontWeight}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'contentFontWeight')}>
                                <Radio.Button value="bold">更粗</Radio.Button>
                                <Radio.Button value="normal">正常</Radio.Button>
                                <Radio.Button value="lighter">更细</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={this.props.data.style.contentColor}
                                setColor={this.setColor.bind(this, 'contentColor')} />
                        </Form.Item>
                        <Form.Item label="背景色">
                            <ColorSelect color={this.props.data.style.contentBg}
                                setColor={this.setColor.bind(this, 'contentBg')} />
                        </Form.Item>
                        <Form.Item label="偶数行背景色">
                            <ColorSelect color={this.props.data.style.oddBackground}
                                setColor={this.setColor.bind(this, 'oddBackground')} />
                        </Form.Item>
                        <Form.Item label="奇数行背景色">
                            <ColorSelect color={this.props.data.style.numberBackground}
                                setColor={this.setColor.bind(this, 'numberBackground')} />
                        </Form.Item>
                        <Form.Item label="选中背景类型">
                            <Radio.Group value={this.props.data.style.selectContentHoverBgType}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'selectContentHoverBgType')}>
                                <Radio value={1}>单一色</Radio>
                                <Radio value={2}>渐变色</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="背景色" style={{ display: style.selectContentHoverBgType === 1 ? '' : 'none' }}>
                            <ColorSelect color={this.props.data.style.selectContentHoverBg}
                                setColor={this.setColor.bind(this, 'selectContentHoverBg')} />
                        </Form.Item>
                        {style.selectContentHoverBgType === 2 && <React.Fragment>
                            <Form.Item label="渐变类型" >
                                <Radio.Group value={style.selectBackgroundGradientType} onChange={changeDetailData.bind(this, 1, style, 'selectBackgroundGradientType')}>
                                    <Radio.Button value="radial">径向</Radio.Button>
                                    <Radio.Button value="linear">线性</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            {style.selectBackgroundGradientType === 'linear' && <Form.Item label="渐变角度" >
                                <Slider defaultValue={180} max={180} min={0} value={style.selectAngle} onChange={changeDetailData.bind(this, 2, style, 'selectAngle')} />
                            </Form.Item>}
                            {this.getColorList(style.selectBoxColor)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'selectBoxColor', {})}>
                                    <Icon type="plus" /> 添加颜色
                                </Button>
                            </Form.Item>
                        </React.Fragment>}
                        <Form.Item label="边框宽度">
                            <Input value={this.props.data.style.contentItemBorderWidth}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'contentItemBorderWidth')} />
                        </Form.Item>
                        <Form.Item label="边框颜色">
                            <ColorSelect color={this.props.data.style.contentItemBorderColor}
                                setColor={this.setColor.bind(this, 'contentItemBorderColor')} />
                        </Form.Item>
                        <Form.Item label="边框类型" >
                            <Radio.Group value={style.contentItemBorderStyle} onChange={changeDetailData.bind(this, 1, style, 'contentItemBorderStyle')}>
                                <Radio.Button value="solid">实线</Radio.Button>
                                <Radio.Button value="dashed">虚线1</Radio.Button>
                                <Radio.Button value="dotted">虚线2</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="选中边框宽度">
                            <Input value={this.props.data.style.selectBorderWidth}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'selectBorderWidth')} />
                        </Form.Item>
                        <Form.Item label="选中边框颜色">
                            <ColorSelect color={this.props.data.style.selectBorderColor}
                                setColor={this.setColor.bind(this, 'selectBorderColor')} />
                        </Form.Item>
                        <Form.Item label="项内边距" >
                            <Input value={style.itemPadding} onChange={changeDetailData.bind(this, 1, style, 'itemPadding')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="内容鼠标悬浮样式设置" key="7">
                        <Form.Item label="是否开启">
                            <Radio.Group value={this.props.data.style.contentHoverShow}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'contentHoverShow')}>
                                <Radio value={true}>是</Radio>
                                <Radio value={false}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={this.props.data.style.contentHoverColor}
                                setColor={this.setColor.bind(this, 'contentHoverColor')} />
                        </Form.Item>
                        <Form.Item label="背景类型">
                            <Radio.Group value={this.props.data.style.contentHoverBgType}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'contentHoverBgType')}>
                                <Radio value={1}>单一色</Radio>
                                <Radio value={2}>渐变色</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="背景色" style={{ display: style.contentHoverBgType === 1 ? '' : 'none' }}>
                            <ColorSelect color={this.props.data.style.contentHoverBg}
                                setColor={this.setColor.bind(this, 'contentHoverBg')} />
                        </Form.Item>
                        {style.contentHoverBgType === 2 && <React.Fragment>
                            <Form.Item label="渐变类型" >
                                <Radio.Group value={style.backgroundGradientType} onChange={changeDetailData.bind(this, 1, style, 'backgroundGradientType')}>
                                    <Radio.Button value="radial">径向</Radio.Button>
                                    <Radio.Button value="linear">线性</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            {style.backgroundGradientType === 'linear' && <Form.Item label="渐变角度" >
                                <Slider defaultValue={180} max={180} min={0} value={style.angle} onChange={changeDetailData.bind(this, 2, style, 'angle')} />
                            </Form.Item>}
                            {this.getColorList(style.boxColor)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'boxColor', {})}>
                                    <Icon type="plus" /> 添加颜色
                                </Button>
                            </Form.Item>
                        </React.Fragment>}
                    </Panel>
                    <Panel header="分页" key="5">
                        <Form.Item label="展示分页">
                            <Radio.Group value={this.props.data.style.paginationShow}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'paginationShow')}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={this.props.data.style.pageFontSize}
                                   onChange={this.changeViewData.bind(this, 2, 'style', 'pageFontSize')} />
                        </Form.Item>
                        <Form.Item label="简单分页">
                            <Switch checked={style.simplePage}
                                    onChange={changeDetailData.bind(this, 2, style, 'simplePage')} />
                        </Form.Item>
                        <Form.Item label="显示总数">
                            <Switch checked={style.showTotal}
                                    onChange={changeDetailData.bind(this, 2, style, 'showTotal')} />
                        </Form.Item>
                        <Form.Item label="样式类型">
                            <Select value={style.theme} onChange={changeDetailData.bind(this, 2, style, 'theme')}>
                                <Select.Option value={''}>默认</Select.Option>
                                <Select.Option value={'theme-one'}>类型一</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="初始页数">
                            <InputNumber value={style.pageNo} onChange={changeDetailData.bind(this, 2, style, 'pageNo')} />
                        </Form.Item>
                        <Form.Item label="一页条数">
                            <InputNumber value={style.pageSize} onChange={changeDetailData.bind(this, 2, style, 'pageSize')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>上空隙*</Tooltip>} >
                            <InputNumber value={style.pageTop} onChange={changeDetailData.bind(this, 2, style, 'pageTop')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <Input value={this.props.data.style.pageHeight}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'pageHeight')} />
                        </Form.Item>
                        <Form.Item label="位置">
                            <Radio.Group size="small" value={this.props.data.style.paginationAlign}
                                onChange={this.changeViewData.bind(this, 2, 'style', 'paginationAlign')}>
                                <Radio.Button value="left">居左</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="right">居右</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="分页文字色">
                            <ColorSelect color={this.props.data.style.paginationColor}
                                setColor={this.setColor.bind(this, 'paginationColor')} />
                        </Form.Item>
                        <Form.Item label="页码激活色">
                            <ColorSelect color={this.props.data.style.paginationActiveColor}
                                setColor={this.setColor.bind(this, 'paginationActiveColor')} />
                        </Form.Item>
                        <Form.Item label="分页背景色">
                            <ColorSelect color={this.props.data.style.paginationBg}
                                setColor={this.setColor.bind(this, 'paginationBg')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="自动滚动" key="6">
                        <Form.Item label="是否开启">
                            <Switch checked={style.autoMove}
                                onChange={changeDetailData.bind(this, 2, style, 'autoMove')} />
                        </Form.Item>
                        <Form.Item label="选中暂停">
                            <Switch checked={style.selectedStop}
                                onChange={changeDetailData.bind(this, 2, style, 'selectedStop')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="自动滚动时间间隔，单位毫秒。">
                                    时间间隔*
                                </Tooltip>
                            }
                        >
                            <Input value={style.interval} onChange={changeDetailData.bind(this, 1, style, 'interval')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="其他设置" key="8">
                        <Form.Item label="唯一主键" >
                            <Input value={style.primaryKey} onChange={changeDetailData.bind(this, 1, style, 'primaryKey')} />
                        </Form.Item>
                        <Form.Item label="列表键名" >
                            <Input value={style.listKey} onChange={changeDetailData.bind(this, 1, style, 'listKey')} />
                        </Form.Item>
                        <Form.Item label="总数键名" >
                            <Input value={style.countKey} onChange={changeDetailData.bind(this, 1, style, 'countKey')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='返回数据结果时自动点击第一条数据。'>
                                    自动点击*
                                </Tooltip>
                            }
                        >
                            <Switch checked={style.firstClick} onChange={changeDetailData.bind(this, 2, style, 'firstClick')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='返回数据结果为空时是否发送空数据。'>
                                    空响应*
                                </Tooltip>
                            }
                        >
                            <Switch checked={style.firstEmptyClick} onChange={changeDetailData.bind(this, 2, style, 'firstEmptyClick')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="行动画设置" key="9">
                        <Form.Item label="是否开启" >
                            <Switch checked={style.rowAnimateOpen} onChange={changeDetailData.bind(this, 2, style, 'rowAnimateOpen')} />
                        </Form.Item>
                        <Form.Item label="依据键名" >
                            <Input value={style.rowAnimateKey} onChange={changeDetailData.bind(this, 1, style, 'rowAnimateKey')} />
                        </Form.Item>
                        <Form.Item label="依据键值" >
                            <Input value={style.rowAnimateValue} onChange={changeDetailData.bind(this, 1, style, 'rowAnimateValue')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="空余位置显示图片设置" key="10">
                        <Form.Item label={<Tooltip title="当列表行数小于等于这个值时，空余位置显示图片">临界行数*</Tooltip>} >
                            <InputNumber value={style.criticalItemNumber} onChange={changeDetailData.bind(this, 2, style, 'criticalItemNumber')} />
                        </Form.Item>
                        {
                            style.icon ? (
                                <>
                                    <Form.Item label="图标">
                                        <img
                                            alt=""
                                            onClick={selectIcon.bind(this, style, 'icon')}
                                            src={fileUrl + '/download/' + style.icon} className={cssStyle.iconEdit}
                                        />
                                    </Form.Item>
                                    <Form.Item label="图标的宽">
                                        <Input value={style.iconWidth} onChange={changeDetailData.bind(this, 1, style, 'iconWidth')} />
                                    </Form.Item>
                                    <Form.Item label="图标的高">
                                        <Input value={style.iconHeight} onChange={changeDetailData.bind(this, 1, style, 'iconHeight')} />
                                    </Form.Item>
                                    <Form.Item label="图标左边距">
                                        <Input value={style.iconLeft} onChange={changeDetailData.bind(this, 1, style, 'iconLeft')} />
                                    </Form.Item>
                                    <Form.Item label="图标上边距">
                                        <Input value={style.iconTop} onChange={changeDetailData.bind(this, 1, style, 'iconTop')} />
                                    </Form.Item>
                                </>

                            ) : (
                                <Button type="dashed" onClick={selectIcon.bind(this, style, 'icon')} >
                                    <Icon type="plus" /> 选择图标
                                </Button>
                            )
                        }
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
