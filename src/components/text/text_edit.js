import React from 'react';
import {Form, Input, Collapse, Radio, InputNumber, Select, Switch} from 'antd';
import {
    changeDetailData,
    setColor,
    getInteractEdit
} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
const { Panel } = Collapse;
const { TextArea } = Input;
export default class TextEdit extends React.Component {
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
                    <Panel header="基础设置" key="1">
                        <Form.Item label="内容类型">
                            <Radio.Group size="small" value={style.contentType}
                                         onChange={changeDetailData.bind(this, 1,style, 'contentType')}>
                                <Radio.Button value={1}>纯文本</Radio.Button>
                                <Radio.Button value={2}>富文本</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="格式化">
                            <Switch checked={style.format} onChange={changeDetailData.bind(this, 2, style, 'format')}/>
                        </Form.Item>
                        <Form.Item label="文字内容">
                            <TextArea value={style.text} onChange={changeDetailData.bind(this, 1, style, 'text')} />
                        </Form.Item>
                        <Form.Item label="数据键名">
                            <Input value={style.key} onChange={changeDetailData.bind(this, 1, style, 'key')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字体" >
                            <Select value={style.fontFamily} onChange={changeDetailData.bind(this, 2, style, 'fontFamily')}>
                                <Select.Option value=''>默认</Select.Option>
                                <Select.Option value='Impact'>Impact</Select.Option>
                                <Select.Option value='LESLIE'>LESLIE</Select.Option>
                                <Select.Option value='MFBanHei'>MFBanHei</Select.Option>
                                <Select.Option value='MFLiHei'>MFLiHei</Select.Option>
                                <Select.Option value='IRON_MAN_OF_WAR'>IRON MAN OF WAR</Select.Option>
                                <Select.Option value='TRENDS'>TRENDS</Select.Option>
                                <Select.Option value='QUARTZEF'>QUARTZEF</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.lineHeight} onChange={changeDetailData.bind(this, 2, style, 'lineHeight')} />
                        </Form.Item>
                        <Form.Item label='字间距'>
                            <Input value={style.letterSpacing} onChange={changeDetailData.bind(this, 1, style, 'letterSpacing')}/>
                        </Form.Item>
                        <Form.Item label="字色" >
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="水平对齐">
                            <Radio.Group size="small" value={style.justifyContent}
                                onChange={changeDetailData.bind(this, 1,style, 'justifyContent')}>
                                <Radio.Button value="flex-start">居左</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居右</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="垂直对齐">
                            <Radio.Group size="small" value={style.alignItems}
                                onChange={changeDetailData.bind(this, 1,style, 'alignItems')}>
                                <Radio.Button value="flex-start">居上</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居下</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}