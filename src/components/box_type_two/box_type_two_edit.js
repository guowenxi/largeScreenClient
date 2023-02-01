import React from 'react';
import { Form, Input, Collapse, Radio, Button, Icon, Slider, Switch, Tooltip } from 'antd';
import { addListItem, changeDetailData, setColor, selectIcon, selectIconOk, selectIconCancel, iconClick } from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import { getColorList } from "../../common/nameNumEditUtil";
import { fileUrl } from "../../config";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;

export default class BoxTypeTwoEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorList = getColorList.bind(this);
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
                    <Panel header="基础配置" key="1">
                        <Form.Item label="背景色" >
                            <Radio.Group value={style.type} onChange={changeDetailData.bind(this, 1, style, 'type')}>
                                <Radio value={1}>图片</Radio>
                                <Radio value={2}>背景色</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="背景图" style={{display:style.type === 1 ? '':'none'}}>
                            {
                                style.backgroundImage ? (
                                    <img alt="" onClick={selectIcon.bind(this,style,'backgroundImage')} src={fileUrl + '/download/' + style.backgroundImage} style={{ width: '104px', height: '104px' }}/>
                                ) : (
                                    <Button type="dashed" onClick={selectIcon.bind(this,style,'backgroundImage')} >
                                        <Icon type="plus" /> 选择图片
                                    </Button>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="背景色" style={{display:style.type===2?'':'none'}} >
                            <Radio.Group value={style.backgroundType} onChange={changeDetailData.bind(this, 1, style, 'backgroundType')}>
                                <Radio value={1}>单一色</Radio>
                                <Radio value={2}>渐变色</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="背景颜色" style={{ display: style.backgroundType === 1 ? 'block' : 'none' }}>
                            <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                        <Collapse style={{ marginBottom: '1vh', display: style.backgroundType === 2 ? 'block' : 'none' }}>
                            <Panel header="项背景设置" key="1">
                                <Form.Item label="渐变角度">
                                    <Slider defaultValue={180} max={180} min={0} value={style.angle} onChange={changeDetailData.bind(this, 2, style, 'angle')} />
                                </Form.Item>
                                {this.getColorList(style.boxColor)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'boxColor', {})}>
                                        <Icon type="plus" /> 添加颜色
                                            </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                        <Form.Item label="阴影颜色" style={{ marginTop: '1vh' }}>
                            <ColorSelect color={style.shadowColor} setColor={setColor.bind(this, style, 'shadowColor')} />
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
                    </Panel>
                </Collapse>
                <Collapse>
                    <Panel header="边框设置">
                        <Form.Item label="是否显示">
                            <Switch checked={style.show}
                                onChange={changeDetailData.bind(this, 2, style, 'show')} />
                        </Form.Item>
                        <Form.Item label="边框宽度" >
                            <Input value={style.littleBorderWidth} onChange={changeDetailData.bind(this, 1, style, 'littleBorderWidth')} />
                        </Form.Item>
                        <Form.Item label="边框颜色" >
                            <ColorSelect color={style.littleBorderColor} setColor={setColor.bind(this, style, 'littleBorderColor')} />
                        </Form.Item>
                        <Form.Item label="边框长度" >
                            <Input value={style.littleWidthHeight} onChange={changeDetailData.bind(this, 1, style, 'littleWidthHeight')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
                <Collapse>
                    <Panel header="关闭按钮设置" key="2">
                        <Form.Item label="是否显示" >
                            <Radio.Group value={style.iconShow} onChange={changeDetailData.bind(this, 1, style, 'iconShow')}>
                                <Radio value={1}>显示</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.iconShow === 1 && <Form.Item label="是否显示" >
                            <Radio.Group value={style.iconSelect} onChange={changeDetailData.bind(this, 1, style, 'iconSelect')}>
                                <Radio value={1}>默认</Radio>
                                <Radio value={2}>选择图标</Radio>
                            </Radio.Group>
                        </Form.Item>}
                        {style.iconSelect === 2 && <Form.Item label="标题图标" >
                            {
                                style.closeImg ? (
                                    <img src={fileUrl + '/download/' + style.closeImg} alt=""
                                        style={{ width: '104px', height: '104px' }}
                                        onClick={selectIcon.bind(this, style, 'closeImg')} />
                                ) : (
                                    <Button type="dashed"
                                        onClick={selectIcon.bind(this, style, 'closeImg')}>
                                        <Icon type="plus" /> 选择图标
                                    </Button>
                                )
                            }
                        </Form.Item>}
                        <Form.Item label="按钮颜色" style={{ display: style.iconType !== 0 ? 'none' : '' }}>
                            <ColorSelect color={style.iconColor} setColor={setColor.bind(this, style, 'iconColor')} />
                        </Form.Item>
                        <Form.Item label="按钮大小">
                            <Input value={style.iconSize} onChange={changeDetailData.bind(this, 1, style, 'iconSize')} />
                        </Form.Item>
                        <Form.Item label="上">
                            <Input value={style.iconTop} onChange={changeDetailData.bind(this, 1, style, 'iconTop')} />
                        </Form.Item>
                        <Form.Item label="右">
                            <Input value={style.iconRight} onChange={changeDetailData.bind(this, 1, style, 'iconRight')} />
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
