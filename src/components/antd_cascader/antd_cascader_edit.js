import React from 'react';
import {Form, Input, Collapse, Radio, Button, Icon, Tooltip} from 'antd';
import {changeDetailData, iconClick, selectIcon, selectIconCancel, selectIconOk, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import {fileUrl} from "../../config";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;
const { TextArea } = Input;

export default class AntdCascaderEdit extends React.Component {
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
                    <Panel header="基础配置" key="1">
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="提示文本">
                            <Input value={style.placeholder} onChange={changeDetailData.bind(this, 1, style, 'placeholder')} />
                        </Form.Item>
                        <Form.Item label="id键名">
                            <Input value={style.idKey} onChange={changeDetailData.bind(this, 1, style, 'idKey')} />
                        </Form.Item>
                        <Form.Item label="名称键名">
                            <Input value={style.nameKey} onChange={changeDetailData.bind(this, 1, style, 'nameKey')} />
                        </Form.Item>
                        <Form.Item label="子集键名">
                            <Input value={style.childKey} onChange={changeDetailData.bind(this, 1, style, 'childKey')} />
                        </Form.Item>
                        <Form.Item label="样式" >
                            <Radio.Group value={style.theme} onChange={changeDetailData.bind(this, 1, style, 'theme')}>
                                <Radio value={0}>样式一</Radio>
                            </Radio.Group>
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
                        <Form.Item
                            label={
                                <Tooltip title="是否开启清除按钮。内容为函数代码。">
                                    清除按钮*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={style.allowClearFun}
                                      onChange={changeDetailData.bind(this, 1, style, 'allowClearFun')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="默认选中项。内容为函数代码。">
                                    默认选中*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={style.defaultValueFun}
                                      onChange={changeDetailData.bind(this, 1, style, 'defaultValueFun')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="是否可选中父级。内容为函数代码。">
                                    父级可选*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={style.changeOnSelectFun}
                                      onChange={changeDetailData.bind(this, 1, style, 'changeOnSelectFun')} />
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
