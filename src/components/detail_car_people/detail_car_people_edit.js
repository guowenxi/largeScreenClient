import React from 'react';
import { Form, Collapse, Input, Select, Radio, Button, Icon } from 'antd';
import ColorSelect from "../../common/colorSelect";
import { changeDetailData, setColor, selectIcon, selectIconOk, selectIconCancel, iconClick } from "../../common/editUtil";
import { fileUrl } from "../../config";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;
export default class NameNumTypeFourEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    changeDetailData(type, item, key, part, event) {
        this.props.saveNowDataToHistory();
        item[key] = type === 1 ? event.target.value : event;
        let thisData = { ...this.props.data };
        if (part != null) {
            const now = new Date().getTime();
            part.updateTime = now;
            thisData.updateTime = now;
        }
        this.props.updateData(thisData);
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
                        <Form.Item label="标题颜色">
                            <ColorSelect color={style.titleColor} setColor={setColor.bind(this, style, 'titleColor')} />
                        </Form.Item>
                        <Form.Item label="内容颜色">
                            <ColorSelect color={style.contentColor} setColor={setColor.bind(this, style, 'contentColor')} />
                        </Form.Item>
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="文字内边距">
                            <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                        </Form.Item>
                        <Form.Item label="弹窗模板">
                            <Select value={style.windowType} onChange={this.changeDetailData.bind(this, 2, style, 'windowType', null)}>
                                <Select.Option value={'detail_car'}>车辆详情</Select.Option>
                                <Select.Option value={'detail_people'}>人员详情</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="图片框样式">
                            <Radio.Group value={style.boxStyle} onChange={changeDetailData.bind(this, 1, style, 'boxStyle')}>
                                <Radio value={1}>线状</Radio>
                                <Radio value={2}>图片</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.boxStyle === 1 && <Form.Item label="边框线宽" >
                            <Input value={style.borderWidth} onChange={changeDetailData.bind(this, 1, style, 'borderWidth')} />
                        </Form.Item>}
                        {style.boxStyle === 1 && <Form.Item label="边框颜色" >
                            <ColorSelect color={style.borderColor} setColor={setColor.bind(this, style, 'borderColor')} />
                        </Form.Item>}
                        {style.boxStyle === 1 && <Form.Item label="边框圆角" >
                            <Input value={style.borderRadius} onChange={changeDetailData.bind(this, 1, style, 'borderRadius')} />
                        </Form.Item>}
                        {style.boxStyle === 1 && <Form.Item label="边框类型" >
                            <Radio.Group value={style.borderStyle} onChange={changeDetailData.bind(this, 1, style, 'borderStyle')}>
                                <Radio value="solid">实线</Radio>
                                <Radio value="dashed">虚线1</Radio>
                                <Radio value="dotted">虚线2</Radio>
                            </Radio.Group>
                        </Form.Item>}
                        {style.boxStyle === 2 && <Form.Item label="图片" >
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
                        </Form.Item>}
                        {style.boxStyle === 2 && <Form.Item label="图片内边距" >
                            <Input value={style.imgPadding} onChange={changeDetailData.bind(this, 1, style, 'imgPadding')} />
                        </Form.Item>}
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
