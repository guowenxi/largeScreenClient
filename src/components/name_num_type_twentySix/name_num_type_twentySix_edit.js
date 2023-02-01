import React from 'react';
import { Form, Input, Collapse, Radio, Tooltip, InputNumber, Switch } from 'antd';
import {
    changeDetailData,
    setColor
} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
const { Panel } = Collapse;
const { TextArea } = Input;
export default class NameNumTypeTwentySixEdit extends React.Component {
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
                    <Panel header="基础设置">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="标题设置">
                        <Form.Item label="字号">
                        <InputNumber value={style.titleFontSize} onChange={changeDetailData.bind(this, 2, style, 'titleFontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色" >
                            <ColorSelect color={style.titleColor} setColor={setColor.bind(this, style, 'titleColor')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.titleLineHeight} onChange={changeDetailData.bind(this, 2, style, 'titleLineHeight')} />
                        </Form.Item>
                        <Form.Item label="键名" >
                            <Input value={style.titleKey} onChange={changeDetailData.bind(this, 1, style, 'titleKey')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="内容设置">
                        <Form.Item label="文字内容">
                            <TextArea value={style.text} onChange={changeDetailData.bind(this, 1, style, 'text')} />
                        </Form.Item>
                        <Form.Item label="数据键名">
                            <Input value={style.contentKey} onChange={changeDetailData.bind(this, 1, style, 'contentKey')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <InputNumber value={style.contentFontSize} onChange={changeDetailData.bind(this, 2, style, 'contentFontSize')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.contentLineHeight} onChange={changeDetailData.bind(this, 2, style, 'contentLineHeight')} />
                        </Form.Item>
                        <Form.Item label="字色" >
                            <ColorSelect color={style.contentFontColor} setColor={setColor.bind(this, style, 'contentFontColor')} />
                        </Form.Item>
                        <Form.Item label="水平对齐">
                            <Radio.Group size="small" value={style.contentJustifyContent}
                                onChange={changeDetailData.bind(this, 1, style, 'contentJustifyContent')}>
                                <Radio.Button value="flex-start">居左</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居右</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="垂直对齐">
                            <Radio.Group size="small" value={style.contentAlignItems}
                                onChange={changeDetailData.bind(this, 1, style, 'contentAlignItems')}>
                                <Radio.Button value="flex-start">居上</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居下</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="自动滚动" key="6">
                        <Form.Item label="是否开启">
                            <Switch checked={style.autoMove}
                                onChange={changeDetailData.bind(this, 2, style, 'autoMove')} />
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
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
