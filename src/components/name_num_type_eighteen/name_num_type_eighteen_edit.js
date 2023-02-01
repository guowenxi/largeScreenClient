import React from 'react';
import { Form, Input, InputNumber, Collapse, Tooltip, Icon, Radio, Slider, Button, Tag } from 'antd';
import ColorSelect from "../../common/colorSelect";
import { changeDetailData, setColor, selectIconOk, selectIconCancel, iconClick, getTypeImageEdit, addListItem, deleteListItem } from "../../common/editUtil";
import FileSelect from "../../common/fileSelect";
import { getColorList } from "../../common/nameNumEditUtil";

const { Panel } = Collapse;
export default class NameNumTypeEighteenEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.itemData = {
            id: "",
            img: ''
        };
        this.getTypeImageEdit = getTypeImageEdit.bind(this);
        this.getColorList = getColorList.bind(this);
    }

    deleteColor(item, index) {
        this.props.saveNowDataToHistory();
        item.splice(index, 1);
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);

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
                    <Panel header="基础设置" key="1">
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
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="内容设置" key="3">
                        {style.contentList && style.contentList.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.contentList, index)}>
                                        {'项' + (index + 1)}
                                    </Tag>
                                    <Form.Item label="行宽度">
                                        <Input value={item.width} onChange={changeDetailData.bind(this, 1, item, 'width')} />
                                    </Form.Item>
                                    <Collapse>
                                        <Panel header="图标设置" key="1">
                                            <Form.Item label="图标大小">
                                                <Input value={item.imgWidth} onChange={changeDetailData.bind(this, 1, item, 'imgWidth')} />
                                            </Form.Item>
                                            <Form.Item label="依据字段" >
                                                <Input value={item.titleImgKey} onChange={changeDetailData.bind(this, 1, item, 'titleImgKey')} />
                                            </Form.Item>
                                            {this.getTypeImageEdit(item, 'titleImg')}
                                        </Panel>
                                        <Panel header="柱图设置" key="2">
                                            <Form.Item label="宽度">
                                                <Input value={item.chartWidth} onChange={changeDetailData.bind(this, 1, item, 'chartWidth')} />
                                            </Form.Item>
                                            <Collapse style={{ marginBottom: '1vh' }}>
                                                <Panel header="项背景设置" key="1">
                                                    <Form.Item label="渐变角度">
                                                        <Slider defaultValue={180} max={180} min={0} value={item.angle} onChange={changeDetailData.bind(this, 2, item, 'angle')} />
                                                    </Form.Item>
                                                    {this.getColorList(item.boxColor)}
                                                    <Form.Item label="">
                                                        <Button type="dashed" onClick={addListItem.bind(this, item, 'boxColor', {})}>
                                                            <Icon type="plus" /> 添加颜色
                                            </Button>
                                                    </Form.Item>
                                                </Panel>
                                            </Collapse>
                                        </Panel>
                                        <Panel header="文字设置" key="3">
                                            <Form.Item
                                                label={
                                                    <Tooltip title='默认为num'>
                                                        文字键名*
                                                    </Tooltip>
                                                }>
                                                <Input value={item.numKey} onChange={changeDetailData.bind(this, 1, item, 'numKey')} />
                                            </Form.Item>
                                            <Form.Item label={<Tooltip title='单位em。'>字体大小*</Tooltip>}>
                                                <InputNumber value={item.textFont} onChange={changeDetailData.bind(this, 2, item, 'textFont')} />
                                            </Form.Item>
                                            <Form.Item label="文字颜色">
                                                <ColorSelect color={item.textColor} setColor={setColor.bind(this, item, 'textColor')} />
                                            </Form.Item>
                                            <Form.Item label={"宽度"}>
                                                <Input value={item.textWidth} onChange={changeDetailData.bind(this, 1, item, 'textWidth')} />
                                            </Form.Item>
                                            <Form.Item label="位置" >
                                                <Radio.Group value={item.textPosition} onChange={changeDetailData.bind(this, 1, item, 'textPosition')}>
                                                    <Radio value={'flex-start'}>居左</Radio>
                                                    <Radio value={'center'}>居中</Radio>
                                                    <Radio value={'flex-end'}>居右</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item label="文字内边距">
                                                <Input value={item.textPadding} onChange={changeDetailData.bind(this, 1, item, 'textPadding')} />
                                            </Form.Item>
                                        </Panel>
                                    </Collapse>
                                </div>
                            )
                        })}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'contentList', {})}>
                                <Icon type="plus" /> 添加内容设置
                            </Button>
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
