import React from 'react';
import { Form, Input, Collapse, Button, Icon, Radio, Switch } from 'antd';
import { changeDetailData, setColor, selectIcon, selectIconOk, selectIconCancel, iconClick, getInteractEdit } from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import { fileUrl } from "../../config";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;

export default class TreeListEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getInteractEdit = getInteractEdit.bind(this);
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
                    <Panel header="基础样式设置" key="1">
                        <Form.Item label="字号" >
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="主标题" key="5">
                        <Collapse>
                            <Panel header="父级设置" key="3">
                                <Form.Item label="父级字段" >
                                    <Input value={style.fatherKey} onChange={changeDetailData.bind(this, 1, style, 'fatherKey')} />
                                </Form.Item>
                                <Form.Item label="背景">
                                    <ColorSelect color={style.fatherColor} setColor={setColor.bind(this, style, 'fatherColor')} />
                                </Form.Item>
                                <Form.Item label="选中背景">
                                    <ColorSelect color={style.fatherSelectColor} setColor={setColor.bind(this, style, 'fatherSelectColor')} />
                                </Form.Item>
                                <Form.Item label="字色">
                                    <ColorSelect color={style.fatherTextColor} setColor={setColor.bind(this, style, 'fatherTextColor')} />
                                </Form.Item>
                                <Form.Item label="选中字色">
                                    <ColorSelect color={style.fatherSelectTextColor} setColor={setColor.bind(this, style, 'fatherSelectTextColor')} />
                                </Form.Item>
                            </Panel>
                            <Panel header="子级设置" key="4">
                                <Form.Item label="子级字段" >
                                    <Input value={style.childKey} onChange={changeDetailData.bind(this, 1, style, 'childKey')} />
                                </Form.Item>
                                <Form.Item label="背景">
                                    <ColorSelect color={style.childColor} setColor={setColor.bind(this, style, 'childColor')} />
                                </Form.Item>
                                <Form.Item label="选中背景">
                                    <ColorSelect color={style.childSelectColor} setColor={setColor.bind(this, style, 'childSelectColor')} />
                                </Form.Item>
                                <Form.Item label="字色">
                                    <ColorSelect color={style.childTextColor} setColor={setColor.bind(this, style, 'childTextColor')} />
                                </Form.Item>
                                <Form.Item label="选中字色">
                                    <ColorSelect color={style.childSelectTextColor} setColor={setColor.bind(this, style, 'childSelectTextColor')} />
                                </Form.Item>
                                <Form.Item label="内边距" >
                                    <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                                </Form.Item>
                                <Form.Item label="下划线">
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, style, 'underlineShow')} value={style.underlineShow}>
                                        <Radio value={1}>开启</Radio>
                                        <Radio value={2}>隐藏</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Panel>
                    <Panel header="图标设置" key="2">
                        <Form.Item label="打开图标" >
                            {
                                style.openImg ? (
                                    <img alt="" onClick={selectIcon.bind(this, style, 'openImg')} src={fileUrl + '/download/' + style.openImg} />
                                ) : (
                                        <Button type="dashed" onClick={selectIcon.bind(this, style, 'openImg')} >
                                            <Icon type="plus" /> 选择图标
                                        </Button>
                                    )
                            }
                        </Form.Item>
                        <Form.Item label="关闭图标" >
                            {
                                style.closeImg ? (
                                    <img alt="" onClick={selectIcon.bind(this, style, 'closeImg')} src={fileUrl + '/download/' + style.closeImg} />
                                ) : (
                                        <Button type="dashed" onClick={selectIcon.bind(this, style, 'closeImg')} >
                                            <Icon type="plus" /> 选择图标
                                        </Button>
                                    )
                            }
                        </Form.Item>
                        <Form.Item label="图标缩进" >
                            <Input value={style.marginRight} onChange={changeDetailData.bind(this, 1, style, 'marginRight')} />
                        </Form.Item>
                        <Form.Item label="右侧图标开启">
                            <Radio.Group onChange={changeDetailData.bind(this, 1, style, 'show')} value={style.show}>
                                <Radio value={1}>开启</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="打开图标" style={{ display: style.show === 1 ? 'block' : 'none' }}>
                            {
                                style.rightImg ? (
                                    <img alt="" onClick={selectIcon.bind(this, style, 'rightImg')} src={fileUrl + '/download/' + style.rightImg} />
                                ) : (
                                        <Button type="dashed" onClick={selectIcon.bind(this, style, 'rightImg')} >
                                            <Icon type="plus" /> 选择图标
                                        </Button>
                                    )
                            }
                        </Form.Item>
                        <Form.Item label="图片宽度" style={{ display: style.show === 1 ? 'block' : 'none' }}>
                            <Input value={style.imgRightWidth} onChange={changeDetailData.bind(this, 1, style, 'imgRightWidth')} />
                        </Form.Item>
                        <Form.Item label="图片高度" style={{ display: style.show === 1 ? 'block' : 'none' }}>
                            <Input value={style.imgRightHeight} onChange={changeDetailData.bind(this, 1, style, 'imgRightHeight')} />
                        </Form.Item>
                        <Form.Item label="左" style={{ display: style.show === 1 ? 'block' : 'none' }}>
                            <Input value={style.left} onChange={changeDetailData.bind(this, 1, style, 'left')} />
                        </Form.Item>
                        <Form.Item label="上" style={{ display: style.show === 1 ? 'block' : 'none' }}>
                            <Input value={style.top} onChange={changeDetailData.bind(this, 1, style, 'top')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="副标题设置" key="3">
                        <Form.Item label="副标题显示">
                            <Radio.Group onChange={changeDetailData.bind(this, 1, style, 'subShow')} value={style.subShow}>
                                <Radio value={1}>显示</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Collapse>
                            <Panel header="父级设置">
                                <Form.Item label="副标题字段" >
                                    <Input value={style.subFatherKey} onChange={changeDetailData.bind(this, 1, style, 'subFatherKey')} />
                                </Form.Item>
                                <Form.Item label="内边距">
                                    <Input value={style.subFatherPadding} onChange={changeDetailData.bind(this, 1, style, 'subFatherPadding')} />
                                </Form.Item>
                            </Panel>
                            <Panel header="子级设置">
                                <Form.Item label="副标题字段" >
                                    <Input value={style.subChildKey} onChange={changeDetailData.bind(this, 1, style, 'subChildKey')} />
                                </Form.Item>
                                <Form.Item label="内边距">
                                    <Input value={style.subChildPadding} onChange={changeDetailData.bind(this, 1, style, 'subChildPadding')} />
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Panel>
                    <Panel header="其他设置" key="4">
                        <Form.Item label="选中方式" >
                            <Radio.Group value={style.clickType} onChange={changeDetailData.bind(this, 1, style, 'clickType')}>
                                <Radio.Button value={1}>单击</Radio.Button>
                                <Radio.Button value={2}>双击</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="默认选中" >
                            <Switch checked={style.defaultSelected} onChange={changeDetailData.bind(this, 2, style, 'defaultSelected')} />
                        </Form.Item>
                        <Form.Item label="选中项">
                            <Input value={style.selectedItem} onChange={changeDetailData.bind(this, 1, style, 'selectedItem')} />
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
