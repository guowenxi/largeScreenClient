import React from 'react';
import { Form, Input, InputNumber, Collapse, Tooltip, Tag, Button, Icon, Slider, Radio } from 'antd';
import ColorSelect from "../../common/colorSelect";
import {
    changeDetailData, setColor, addListItem, iconClick, selectIcon, selectIconOk, selectIconCancel, deleteListItem
} from "../../common/editUtil";
import { getItemStyleEdit, getColorList } from "../../common/nameNumEditUtil";

import { fileUrl } from "../../config";
import FileSelect from "../../common/fileSelect";
const { Panel } = Collapse;

export default class NumSplitEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getItemStyleEdit = getItemStyleEdit.bind(this);
        this.getColorList = getColorList.bind(this);
        this.colorItem = { color: '#000', percent: 100 };
        this.iconItem = { num: 1, icon: '' };
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    changeDetailData(item, key, event) {
        this.props.saveNowDataToHistory();
        item[key] = event.target.value;
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    getIconSet(content,key, show) {
        return (
            <Collapse style={{ marginBottom: '20px', display: show ? 'block' : 'none' }}>
                <Panel header="图标列表" key="3">
                    {content[key] && content[key].map((item, index) =>
                        <div key={index}>
                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, content[key], index)}>{'项' + (index + 1)}</Tag>
                            <Form.Item label="值">
                                <Input value={item.num} onChange={changeDetailData.bind(this, 1, item, 'num')} />
                            </Form.Item>
                            <Form.Item label="图标" >
                                {
                                    item.icon ? (
                                        <img alt="" onClick={selectIcon.bind(this, item, 'icon')} src={fileUrl + '/download/' + item.icon} style={{maxHeight:'5vh'}}/>
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
                            onClick={addListItem.bind(this, content, key, this.iconItem)}>
                            <Icon type="plus" /> 添加图标设置
                        </Button>
                    </Form.Item>
                </Panel>
            </Collapse>
        );
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        const { icon } = style;
        return (
            <div>
                <Form {...formItemLayout}>
                    <Collapse>
                        <Panel header="内容设置" key="1">
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
                            <Form.Item label="内边距">
                                <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                            </Form.Item>
                            <Form.Item label="外边距">
                                <Input value={style.margin} onChange={changeDetailData.bind(this, 1, style, 'margin')} />
                            </Form.Item>
                            <Form.Item label="键名">
                                <Input value={style.key} onChange={changeDetailData.bind(this, 1, style, 'key')} />
                            </Form.Item>
                            <Form.Item label="字号">
                                <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                            </Form.Item>
                            <Form.Item label="字色">
                                <ColorSelect color={style.color} setColor={setColor.bind(this, style, 'color')} />
                            </Form.Item>
                            <Form.Item label="选择位数">
                                <InputNumber value={style.numLength} onChange={changeDetailData.bind(this, 2, style, 'numLength')} />
                            </Form.Item>
                            <Form.Item label="标点颜色">
                                <ColorSelect color={style.symbolColor} setColor={setColor.bind(this, style, 'symbolColor')} />
                            </Form.Item>

                        </Panel>
                        <Panel header="数字项背景色设置" key="3">
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
                        <Panel header="数字项背景图设置" key="4">
                            <Form.Item label="是否显示">
                                <Radio.Group value={style.showBackgroundPic}
                                             onChange={this.changeDetailData.bind(this, style, 'showBackgroundPic')}>
                                    <Radio value={true}>展示</Radio>
                                    <Radio value={false}>隐藏</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="类型">
                                <Radio.Group value={style.bgImgType}
                                             onChange={this.changeDetailData.bind(this, style, 'bgImgType')}>
                                    <Radio value={1}>固定背景图</Radio>
                                    <Radio value={2}>不同值不同背景图</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="图标"  style={{display: style.bgImgType !== 2 ? 'block' : 'none'}}>
                                {
                                    style.backgroundPic ? (
                                        <img alt="" onClick={selectIcon.bind(this, style, 'backgroundPic')} src={fileUrl + '/download/' + style.backgroundPic} style={{maxHeight:'5vh'}} />
                                    ) : (
                                        <Button type="dashed" onClick={selectIcon.bind(this, style, 'backgroundPic')} >
                                            <Icon type="plus" /> 选择图标
                                        </Button>
                                    )
                                }
                            </Form.Item>
                            <Form.Item label="依据字段" style={{ display: style.bgImgType === 2 ? 'block' : 'none' }}>
                                <Input value={style.bgImgKey} onChange={changeDetailData.bind(this, 1, style, 'bgImgKey')} />
                            </Form.Item>
                            {this.getIconSet(style,'bgImgList', style.bgImgType === 2)}
                        </Panel>
                        <Panel header="列图标设置" key="2">
                            <Form.Item {...formItemLayout} label="图标展示">
                                <Radio.Group value={style.iconShow}
                                    onChange={this.changeDetailData.bind(this, style, 'iconShow')}>
                                    <Radio value={true}>展示</Radio>
                                    <Radio value={false}>隐藏</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="依据字段" style={{ display: style.iconShow ? 'block' : 'none' }}>
                                <Input value={icon.iconKey} onChange={changeDetailData.bind(this, 1, icon, 'iconKey')} />
                            </Form.Item>
                            {this.getIconSet(icon,'iconList', style.iconShow)}
                            <Form.Item label="图片宽度" style={{ display: style.iconShow ? 'block' : 'none' }}>
                                <Input value={icon.width} onChange={changeDetailData.bind(this, 1, icon, 'width')} />
                            </Form.Item>
                            <Form.Item label="图片高度" style={{ display: style.iconShow ? 'block' : 'none' }}>
                                <Input value={icon.height} onChange={changeDetailData.bind(this, 1, icon, 'height')} />
                            </Form.Item>
                            <Form.Item label="左" style={{ display: style.iconShow ? 'block' : 'none' }}>
                                <Input value={icon.left} onChange={changeDetailData.bind(this, 1, icon, 'left')} />
                            </Form.Item>
                            <Form.Item label="上" style={{ display: style.iconShow ? 'block' : 'none' }}>
                                <Input value={icon.top} onChange={changeDetailData.bind(this, 1, icon, 'top')} />
                            </Form.Item>
                            <Form.Item label="图标距离" style={{ display: style.iconShow ? 'block' : 'none' }}>
                                <Input value={icon.marginRight} onChange={changeDetailData.bind(this, 1, icon, 'marginRight')} />
                            </Form.Item>
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
