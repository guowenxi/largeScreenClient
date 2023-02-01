import React from 'react';
import {Form, Input, Collapse, Radio, Button, Icon} from 'antd';
import {changeDetailData, iconClick, selectIcon, selectIconCancel, selectIconOk, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import {fileUrl} from "../../config";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;

export default class AntdSelectEdit extends React.Component {
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
                        <Form.Item label="所有项名">
                            <Input value={style.allSelectName} onChange={changeDetailData.bind(this, 1, style, 'allSelectName')} />
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
