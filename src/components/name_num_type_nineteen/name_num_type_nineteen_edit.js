import React from 'react';
import { Form, Collapse, Input, Tooltip, Switch, Radio, Button, Icon, InputNumber } from 'antd';
import { addListItem, changeDetailData, getInteractEdit, getListLayoutEdit, setColor, iconClick, selectIconCancel, selectIconOk, selectIcon, } from "../../common/editUtil";
import { getContentEdit } from "../../common/nameNumEditUtil";
import ColorSelect from "../../common/colorSelect";
import FileSelect from "../../common/fileSelect";

import cssStyle from "../name_num_type_seven/name_num_type_seven.module.css";

import { fileUrl } from "../../config";

const { Panel } = Collapse;

export default class NameNumTypeNineteenEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getContentEdit = getContentEdit.bind(this);
        this.getListLayoutEdit = getListLayoutEdit.bind(this);
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
                        <Form.Item label="开启倒影">
                            <Switch checked={style.openReflect}
                                onChange={changeDetailData.bind(this, 2, style, 'openReflect')} />
                        </Form.Item>
                        <Form.Item label="渐显方式" >
                            <Radio.Group value={style.showAnType} onChange={changeDetailData.bind(this, 1, style, 'showAnType')}>
                                <Radio value={1}>逐个渐显(默认</Radio>
                                <Radio value={2}>整体渐显</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        {this.getListLayoutEdit(style)}
                    </Panel>
                    <Panel header="边框样式" key="4">
                        <Form.Item label="边框线宽" >
                            <Input value={style.borderWidth} onChange={changeDetailData.bind(this, 1, style, 'borderWidth')} />
                        </Form.Item>
                        <Form.Item label="边框颜色" >
                            <ColorSelect color={style.borderColor} setColor={setColor.bind(this, style, 'borderColor')} />
                        </Form.Item>
                        <Form.Item label="边框圆角" >
                            <Input value={style.borderRadius} onChange={changeDetailData.bind(this, 1, style, 'borderRadius')} />
                        </Form.Item>
                        <Form.Item label="边框类型" >
                            <Radio.Group value={style.borderStyle} onChange={changeDetailData.bind(this, 1, style, 'borderStyle')}>
                                <Radio value="solid">实线</Radio>
                                <Radio value="dashed">虚线1</Radio>
                                <Radio value="dotted">虚线2</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="其他设置" key="2">
                        <Form.Item label="默认选中方式">
                            <Radio.Group value={style.defaultSelectType} onChange={changeDetailData.bind(this, 1, style, 'defaultSelectType')} defaultValue={1}>
                                <Radio value={1}>默认选中序号</Radio>
                                <Radio value={2}>默认选中某值</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="依据键名">
                            <Input value={style.defaultSelectKey} onChange={changeDetailData.bind(this, 1, style, 'defaultSelectKey')} />
                        </Form.Item>
                        <Form.Item label={style.defaultSelectType === 2 ? "默认选中值" : "默认选中项"}>
                            <Input value={style.defaultSelect} onChange={changeDetailData.bind(this, 1, style, 'defaultSelect')} />
                        </Form.Item>
                        <Form.Item label="自动切换">
                            <Switch checked={style.autoSelect}
                                onChange={changeDetailData.bind(this, 2, style, 'autoSelect')} />
                        </Form.Item>
                        <Form.Item label="显示自动点击">
                            <Switch checked={style.showAutoClick}
                                onChange={changeDetailData.bind(this, 2, style, 'showAutoClick')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="自动切换时间间隔，单位毫秒。">
                                    切换间隔*
                                </Tooltip>
                            }
                        >
                            <Input value={style.intervalSelect} onChange={changeDetailData.bind(this, 1, style, 'intervalSelect')} />
                        </Form.Item>
                        <Form.Item label="数据变更保持选中">
                            <Switch checked={style.keepSelect}
                                onChange={changeDetailData.bind(this, 2, style, 'keepSelect')} />
                        </Form.Item>
                        <Form.Item label="显示时才响应交互">
                            <Switch checked={style.actionInteractWhenShow}
                                onChange={changeDetailData.bind(this, 2, style, 'actionInteractWhenShow')} />
                        </Form.Item>
                        <Form.Item label="呼吸动画">
                            <Switch checked={style.animateOne}
                                onChange={changeDetailData.bind(this, 2, style, 'animateOne')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="自动滚动" key="3">
                        <Form.Item label="是否开启">
                            <Switch checked={style.autoMove}
                                onChange={changeDetailData.bind(this, 2, style, 'autoMove')} />
                        </Form.Item>
                        <Form.Item label="滚动依据">
                            <Radio.Group value={style.moveDepend} onChange={changeDetailData.bind(this, 1, style, 'moveDepend')}>
                                <Radio value={1}>选中项</Radio>
                                <Radio value={2}>翻页</Radio>
                            </Radio.Group>
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
                        <Form.Item label="显示翻页">
                            <Switch checked={style.showPage}
                                onChange={changeDetailData.bind(this, 2, style, 'showPage')} />
                        </Form.Item>
                        <Form.Item label="翻页时选择">
                            <Switch checked={style.pageChangeSelect}
                                    onChange={changeDetailData.bind(this, 2, style, 'pageChangeSelect')} />
                        </Form.Item>
                        <Form.Item label="选择类型">
                            <Radio.Group value={style.pageStyle} onChange={changeDetailData.bind(this, 1, style, 'pageStyle')}>
                                <Radio value={1}>样式一（默认）</Radio>
                                <Radio value={2}>样式二</Radio>
                                <Radio value={3}>样式三</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="点击响应设置" key="5">
                        <Form.Item label="选择类型">
                            <Radio.Group value={style.selectType} onChange={changeDetailData.bind(this, 1, style, 'selectType')}>
                                <Radio value={1}>单选（默认）</Radio>
                                <Radio value={2}>多选</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.selectType === 2 && (
                            <Form.Item label="传参格式">
                                <Radio.Group value={style.sendDataFormat} onChange={changeDetailData.bind(this, 1, style, 'sendDataFormat')}>
                                    <Radio value={1}>逗号分隔（默认）</Radio>
                                    <Radio value={2}>json字串</Radio>
                                </Radio.Group>
                            </Form.Item>
                        )}
                        <Form.Item label="重复点击">
                            <Radio.Group value={style.repeatClick} onChange={changeDetailData.bind(this, 1, style, 'repeatClick')}>
                                <Radio value={1}>默认</Radio>
                                <Radio value={2}>取消选中</Radio>
                                <Radio value={3}>不响应</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.repeatClick === 2 && (
                            <React.Fragment>
                                {this.getInteractEdit(style.repeatInteract)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'repeatInteract', {})}>
                                        <Icon type="plus" /> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </React.Fragment>
                        )}
                    </Panel>
                    <Panel header="鼠标移入响应" key="6">
                        {this.getInteractEdit(style.mouseOverInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'mouseOverInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="鼠标移出响应" key="7">
                        {this.getInteractEdit(style.mouseOutInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'mouseOutInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="空数据样式设置" key="8">
                        <Form.Item label="提示文本">
                            <Input value={style.emptyTipText} onChange={changeDetailData.bind(this, 1, style, 'emptyTipText')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.emptyFontSize} onChange={changeDetailData.bind(this, 1, style, 'emptyFontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={style.emptyFontColor} setColor={setColor.bind(this, style, 'emptyFontColor')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.emptyLineHeight} onChange={changeDetailData.bind(this, 2, style, 'emptyLineHeight')} />
                        </Form.Item>
                        {
                            style.emptyIcon ? (
                                <>
                                    <Form.Item label="图标">
                                        <img
                                            alt=""
                                            onClick={selectIcon.bind(this, style, 'emptyIcon')}
                                            src={fileUrl + '/download/' + style.emptyIcon}
                                            className={cssStyle.iconEdit}
                                        />
                                    </Form.Item>
                                    <Form.Item label="图标的宽">
                                        <Input value={style.emptyIconWidth} onChange={changeDetailData.bind(this, 1, style, 'emptyIconWidth')} />
                                    </Form.Item>
                                    <Form.Item label="图标的高">
                                        <Input value={style.emptyIconHeight} onChange={changeDetailData.bind(this, 1, style, 'emptyIconHeight')} />
                                    </Form.Item>
                                    <Form.Item label="图标文字间距">
                                        <Input value={style.innerPadding} onChange={changeDetailData.bind(this, 1, style, 'innerPadding')} />
                                    </Form.Item>
                                </>

                            ) : (
                                <Button type="dashed" onClick={selectIcon.bind(this, style, 'emptyIcon')} >
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
                {this.getContentEdit(style, 'content')}
            </Form>
        );
    }
}
