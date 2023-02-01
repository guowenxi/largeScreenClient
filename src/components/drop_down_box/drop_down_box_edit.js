import React from 'react';
import { Form, Input, Collapse, Button, Icon, Tooltip, InputNumber, Radio, Switch } from 'antd';
import { changeDetailData, setColor, selectIcon, selectIconOk, selectIconCancel, iconClick } from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import { fileUrl } from "../../config";
import FileSelect from "../../common/fileSelect";
const { Panel } = Collapse;

export default class DropDownBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                    <Panel header="基础样式设置" key={1}>
                        <Form.Item label="样式类型" {...formItemLayout24}>
                            <Radio.Group value={style.theme} onChange={changeDetailData.bind(this, 1, style, 'theme')}>
                                <Radio.Button value={0}>样式一(默认)</Radio.Button>
                                <Radio.Button value={1}>样式二</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="选择模式" {...formItemLayout24}>
                            <Radio.Group value={style.selectMode} onChange={changeDetailData.bind(this, 1, style, 'selectMode')}>
                                <Radio.Button value={1}>单选</Radio.Button>
                                <Radio.Button value={2}>多选</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字号" >
                            <Input value={style.allFontSize} onChange={changeDetailData.bind(this, 1, style, 'allFontSize')} />
                        </Form.Item>
                        <Form.Item label="背景色">
                            <ColorSelect color={style.color} setColor={setColor.bind(this, style, 'color')} />
                        </Form.Item>
                        <Form.Item label="背景图">
                            {
                                style.backgroundImg ? (
                                    <img src={fileUrl + '/download/' + style.backgroundImg} alt=""
                                         style={{ width: '104px', height: '104px' }}
                                         onClick={selectIcon.bind(this, style, 'backgroundImg')} />
                                ) : (
                                    <Button type="dashed"
                                            onClick={selectIcon.bind(this, style, 'backgroundImg')}>
                                        <Icon type="plus" /> 选择图标
                                    </Button>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="边框宽度" >
                            <Input value={style.borderWidth} onChange={changeDetailData.bind(this, 1, style, 'borderWidth')} />
                        </Form.Item>
                        <Form.Item label="边框颜色">
                            <ColorSelect color={style.borderColor} setColor={setColor.bind(this, style, 'borderColor')} />
                        </Form.Item>
                        <Form.Item label="边框圆角" >
                            <Input value={style.borderRadius} onChange={changeDetailData.bind(this, 1, style, 'borderRadius')} />
                        </Form.Item>
                        <Form.Item label="项内边距" >
                            <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='自动轮播时间间隔，不设置或设为0时不轮播%。（单位毫秒）'>轮播间隔*</Tooltip>} >
                            <InputNumber value={style.autoTime} min={0} onChange={changeDetailData.bind(this, 2, style, 'autoTime')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='选择操作后自动轮播启动延时时间。（单位毫秒）'>操作延时*</Tooltip>} >
                            <InputNumber value={style.delayTime} min={0} onChange={changeDetailData.bind(this, 2, style, 'delayTime')} />
                        </Form.Item>
                        <Form.Item label="值键名" >
                            <Input value={style.idKey} onChange={changeDetailData.bind(this, 1, style, 'idKey')} />
                        </Form.Item>
                        <Form.Item label="名称键名" >
                            <Input value={style.nameKey} onChange={changeDetailData.bind(this, 1, style, 'nameKey')} />
                        </Form.Item>
                        <Form.Item label="全部项名" >
                            <Input value={style.allName} onChange={changeDetailData.bind(this, 1, style, 'allName')} />
                        </Form.Item>
                        <Form.Item label="全部项名发送">
                            <Switch checked={style.allNameSend}
                                    onChange={changeDetailData.bind(this, 2, style, 'allNameSend')} />
                        </Form.Item>
                        <Form.Item label="置空提示语" >
                            <Input value={style.placeholder} onChange={changeDetailData.bind(this, 1, style, 'placeholder')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="选择框样式设置" key={2}>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="箭头图标" >
                            <Radio.Group value={style.imgType} onChange={changeDetailData.bind(this, 1, style, 'imgType')}>
                                <Radio value={1}>上传图片(默认</Radio>
                                <Radio value={2}>图标一</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {(style.imgType === 1 || style.imgType == null) ? (
                            <React.Fragment>
                                <Form.Item label="未下拉图标" >
                                    {
                                        style.beforeImg ? (
                                            <img src={fileUrl + '/download/' + style.beforeImg} alt=""
                                                 style={{ width: '104px', height: '104px' }}
                                                 onClick={selectIcon.bind(this, style, 'beforeImg')} />
                                        ) : (
                                            <Button type="dashed"
                                                    onClick={selectIcon.bind(this, style, 'beforeImg')}>
                                                <Icon type="plus" /> 选择图标
                                            </Button>
                                        )
                                    }
                                </Form.Item>
                                <Form.Item label="下拉图标" >
                                    {
                                        style.afterImg ? (
                                            <img src={fileUrl + '/download/' + style.afterImg} alt=""
                                                 style={{ width: '104px', height: '104px' }}
                                                 onClick={selectIcon.bind(this, style, 'afterImg')} />
                                        ) : (
                                            <Button type="dashed"
                                                    onClick={selectIcon.bind(this, style, 'afterImg')}>
                                                <Icon type="plus" /> 选择图标
                                            </Button>
                                        )
                                    }
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位em。'>图片宽度*</Tooltip>} >
                                    <InputNumber value={style.imgWidth} onChange={changeDetailData.bind(this, 2, style, 'imgWidth')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位em。'>图片高度*</Tooltip>} >
                                    <InputNumber value={style.imgHeight} onChange={changeDetailData.bind(this, 2, style, 'imgHeight')} />
                                </Form.Item>
                            </React.Fragment>
                        ):(
                            <React.Fragment>
                                <Form.Item label={<Tooltip title='单位em。'>图标大小*</Tooltip>} >
                                    <InputNumber value={style.imgSize} onChange={changeDetailData.bind(this, 2, style, 'imgSize')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        <Form.Item label={<Tooltip title='单位em。'>框高*</Tooltip>} >
                            <InputNumber value={style.height} onChange={changeDetailData.bind(this, 2, style, 'height')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="下拉框样式设置" key={3}>
                        <Form.Item label="字色">
                            <ColorSelect color={style.dropColor} setColor={setColor.bind(this, style, 'dropColor')} />
                        </Form.Item>
                        <Form.Item label="背景颜色" >
                            <ColorSelect color={style.dropBackgroundColor} setColor={setColor.bind(this, style, 'dropBackgroundColor')} />
                        </Form.Item>
                        <Form.Item label="边框宽度" >
                            <Input value={style.dropBorderWidth} onChange={changeDetailData.bind(this, 1, style, 'dropBorderWidth')} />
                        </Form.Item>
                        <Form.Item label="边框颜色" >
                            <ColorSelect color={style.dropBorderColor} setColor={setColor.bind(this, style, 'dropBorderColor')} />
                        </Form.Item>
                        <Form.Item label="边框圆角" >
                            <Input value={style.dropBorderRadius} onChange={changeDetailData.bind(this, 1, style, 'dropBorderRadius')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>框高*</Tooltip>} >
                            <InputNumber value={style.boxHeight} onChange={changeDetailData.bind(this, 2, style, 'boxHeight')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>行高*</Tooltip>} >
                            <InputNumber value={style.lineHeight} onChange={changeDetailData.bind(this, 2, style, 'lineHeight')} />
                        </Form.Item>
                        <Form.Item label="悬浮背景" >
                            <ColorSelect color={style.hoverBgColor} setColor={setColor.bind(this, style, 'hoverBgColor')} />
                        </Form.Item>
                        <Form.Item label="悬浮字色" >
                            <ColorSelect color={style.hoverFontColor} setColor={setColor.bind(this, style, 'hoverFontColor')} />
                        </Form.Item>
                        <Form.Item label="选中背景" >
                            <ColorSelect color={style.selectedBgColor} setColor={setColor.bind(this, style, 'selectedBgColor')} />
                        </Form.Item>
                        <Form.Item label="选中字色" >
                            <ColorSelect color={style.selectedFontColor} setColor={setColor.bind(this, style, 'selectedFontColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="交互设置" key={4}>
                        <Form.Item label="显示自动点击">
                            <Switch checked={style.showAutoClick}
                                    onChange={changeDetailData.bind(this, 2, style, 'showAutoClick')} />
                        </Form.Item>
                        <Form.Item label="选择模式">
                            <Radio.Group value={style.selectMode} onChange={changeDetailData.bind(this, 1, style, 'selectMode')}>
                                <Radio.Button value={1}>单选</Radio.Button>
                                <Radio.Button value={2}>多选</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {style.selectMode === 2 && (
                            <Form.Item label="传输格式">
                                <Radio.Group value={style.sendDataFormat} onChange={changeDetailData.bind(this, 1, style, 'sendDataFormat')}>
                                    <Radio.Button value={1}>逗号分隔</Radio.Button>
                                    <Radio.Button value={2}>数组json</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        )}
                        <Form.Item label="固定文本" >
                            <Input value={style.fixedText} onChange={changeDetailData.bind(this, 1, style, 'fixedText')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="默认选中设置" key="5">
                        <Form.Item label="依据键名">
                            <Input value={style.defaultSelectKey} onChange={changeDetailData.bind(this, 1, style, 'defaultSelectKey')} />
                        </Form.Item>
                        <Form.Item label="默认选中值">
                            <Input value={style.defaultSelect} onChange={changeDetailData.bind(this, 1, style, 'defaultSelect')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="其他设置" key="6">
                        <Form.Item label="取消选中不交互">
                            <Switch checked={style.cancelSelectNotInteract} onChange={changeDetailData.bind(this, 2, style, 'cancelSelectNotInteract')} />
                        </Form.Item>
                        <Form.Item label="取消默认选中">
                            <Switch checked={style.cancelDefaultSelect} onChange={changeDetailData.bind(this, 2, style, 'cancelDefaultSelect')} />
                        </Form.Item>
                        <Form.Item label="取消选中清空选项">
                            <Switch checked={style.clearOption} onChange={changeDetailData.bind(this, 2, style, 'clearOption')} />
                        </Form.Item>
                        <Form.Item label="下拉响应区域">
                            <Radio.Group value={style.clickArea} onChange={changeDetailData.bind(this, 1, style, 'clickArea')}>
                                <Radio.Button value={1}>默认</Radio.Button>
                                <Radio.Button value={2}>只响应箭头</Radio.Button>
                            </Radio.Group>
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
