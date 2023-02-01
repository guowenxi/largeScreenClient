import React from 'react';
import { Form, Input, InputNumber, Collapse,Tooltip } from 'antd';
import ColorSelect from "../../common/colorSelect";
import {
    changeDetailData,
    setColor,
    getTypeImageEdit,
    selectIconOk,
    selectIconCancel,
    iconClick
} from "../../common/editUtil";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;
export default class ScrollTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getTypeImageEdit = getTypeImageEdit.bind(this);
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
                    <Panel header="总样式设置" key="1">
                        <Form.Item label="字体大小" >
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>行间距*</Tooltip>} >
                            <InputNumber value={style.gap} onChange={changeDetailData.bind(this, 2, style, 'gap')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="标题设置" key="2">
                        <Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>} >
                            <InputNumber value={style.titleFont} onChange={changeDetailData.bind(this, 2, style, 'titleFont')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>宽*</Tooltip>} >
                            <InputNumber value={style.titleWidth} onChange={changeDetailData.bind(this, 2, style, 'titleWidth')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>高*</Tooltip>} >
                            <InputNumber value={style.titleHeight} onChange={changeDetailData.bind(this, 2, style, 'titleHeight')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>右边距*</Tooltip>} >
                            <InputNumber value={style.marginRight} onChange={changeDetailData.bind(this, 2, style, 'marginRight')} />
                        </Form.Item>
                        <Form.Item label="标题颜色">
                            <ColorSelect color={style.titleColor} setColor={setColor.bind(this, style, 'titleColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="标题背景图设置" key="3">
                        <Form.Item label="依据字段" >
                            <Input value={style.titleImgKey} onChange={changeDetailData.bind(this, 1, style, 'titleImgKey')} />
                        </Form.Item>
                        {this.getTypeImageEdit(style,'titleImg')}
                    </Panel>
                    <Panel header="内容设置" key="4">
                        <Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>} >
                            <InputNumber value={style.contentFont} onChange={changeDetailData.bind(this, 2, style, 'contentFont')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>行高*</Tooltip>} >
                            <InputNumber value={style.contentLineHeight} onChange={changeDetailData.bind(this, 2, style, 'contentLineHeight')} />
                        </Form.Item>
                        <Form.Item label="内容颜色">
                            <ColorSelect color={style.contentColor} setColor={setColor.bind(this, style, 'contentColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="数据键名设置" key="5">
                        <Form {...formItemLayout24} >
                            <Form.Item
                                label={
                                    <Tooltip title='默认为title'>
                                        标题键名*
                                </Tooltip>
                                }
                            >
                                <Input value={style.titleKey} onChange={changeDetailData.bind(this, 1, style, 'titleKey')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='默认为content'>
                                        值键名*
                                </Tooltip>
                                }
                            >
                                <Input value={style.numKey} onChange={changeDetailData.bind(this, 1, style, 'numKey')} />
                            </Form.Item>
                        </Form>
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
