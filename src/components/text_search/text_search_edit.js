import React from 'react';
import {Form, Input, Collapse, Switch, InputNumber, Tooltip, Select, Button, Icon} from 'antd';
import {changeDetailData, iconClick, selectIcon, selectIconCancel, selectIconOk, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import {fileUrl} from "../../config";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;

export default class TextSearchEdit extends React.Component {
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
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="输入框配置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="背景色">
                            <ColorSelect color={style.fontBgColor} setColor={setColor.bind(this, style, 'fontBgColor')} />
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
                        <Form.Item label="边框颜色">
                            <ColorSelect color={style.borderColor} setColor={setColor.bind(this, style, 'borderColor')} />
                        </Form.Item>
                        <Form.Item label="提示文本">
                            <Input value={style.placeholder} onChange={changeDetailData.bind(this, 1, style, 'placeholder')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="按钮设置" key="2">
                        <Form.Item label="按钮显示">
                            <Switch checked={style.buttonShow} onChange={changeDetailData.bind(this, 2, style, 'buttonShow')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>按钮宽*</Tooltip>} >
                            <InputNumber value={style.buttonWidth} onChange={changeDetailData.bind(this, 2, style, 'buttonWidth')} />
                        </Form.Item>
                        <Form.Item label="默认背景">
                            <ColorSelect color={style.buttonBgColor} setColor={setColor.bind(this, style, 'buttonBgColor')} />
                        </Form.Item>
                        <Form.Item label="点击背景">
                            <ColorSelect color={style.mouseDownBgColor} setColor={setColor.bind(this, style, 'mouseDownBgColor')} />
                        </Form.Item>
                        <Form.Item label="显示交互">
                            <Switch checked={style.showAction} onChange={changeDetailData.bind(this, 2, style, 'showAction')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="搜索设置" key="3">
                        <Form.Item label="是否开启">
                            <Switch checked={style.searchOpen} onChange={changeDetailData.bind(this, 2, style, 'searchOpen')} />
                        </Form.Item>
                        <Form.Item label="下拉框样式">
                            <Select value={style.dropDownStyle} onChange={changeDetailData.bind(this, 2, style, 'dropDownStyle')}>
                                <Select.Option value={'text_search_drop_down_one'} >样式一</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="条件键名">
                            <Input value={style.keyName} onChange={changeDetailData.bind(this, 1, style, 'keyName')} />
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
