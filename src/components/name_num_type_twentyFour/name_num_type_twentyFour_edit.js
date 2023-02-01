import React from 'react';
import { Form, Input, Collapse, Radio, Tooltip, Switch, InputNumber } from 'antd';
import {
    changeDetailData,
    setColor
} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;
export default class NameNumTypeTwentyFourEdit extends React.Component {
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
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
                <Collapse>
                    <Panel header="时间设置">
                        <Form.Item label="时间键名">
                            <Input value={style.time} onChange={changeDetailData.bind(this, 1, style, 'time')} />
                        </Form.Item>
                        <Form.Item label="时间字体">
                            <Input value={style.timeFontSize} onChange={changeDetailData.bind(this, 1, style, 'timeFontSize')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.timeLineHeight} onChange={changeDetailData.bind(this, 2, style, 'timeLineHeight')} />
                        </Form.Item>
                        <Form.Item label="字色" >
                            <ColorSelect color={style.timeFontColor} setColor={setColor.bind(this, style, 'timeFontColor')} />
                        </Form.Item>
                        <Form.Item label="水平对齐">
                            <Radio.Group size="small" value={style.timeJustifyContent}
                                onChange={changeDetailData.bind(this, 1,style, 'timeJustifyContent')}>
                                <Radio.Button value="flex-start">居左</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居右</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="垂直对齐">
                            <Radio.Group size="small" value={style.timeAlignItems}
                                onChange={changeDetailData.bind(this, 1,style, 'timeAlignItems')}>
                                <Radio.Button value="flex-start">居上</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居下</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
                <Collapse>
                    <Panel header="主标题设置">
                        <Form.Item label="主标题键名">
                            <Input value={style.title} onChange={changeDetailData.bind(this, 1, style, 'title')} />
                        </Form.Item>
                        <Form.Item label="主标题字体">
                            <Input value={style.titleFontSize} onChange={changeDetailData.bind(this, 1, style, 'titleFontSize')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.titleLineHeight} onChange={changeDetailData.bind(this, 2, style, 'titleLineHeight')} />
                        </Form.Item>
                        <Form.Item label="字色" >
                            <ColorSelect color={style.titleFontColor} setColor={setColor.bind(this, style, 'titleFontColor')} />
                        </Form.Item>
                        <Form.Item label="水平对齐">
                            <Radio.Group size="small" value={style.titleJustifyContent}
                                onChange={changeDetailData.bind(this, 1,style, 'titleJustifyContent')}>
                                <Radio.Button value="flex-start">居左</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居右</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="垂直对齐">
                            <Radio.Group size="small" value={style.titleAlignItems}
                                onChange={changeDetailData.bind(this, 1,style, 'titleAlignItems')}>
                                <Radio.Button value="flex-start">居上</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居下</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
                <Collapse>
                    <Panel header="副标题设置">
                        <Form.Item label="副标题键名">
                            <Input value={style.sub} onChange={changeDetailData.bind(this, 1, style, 'sub')} />
                        </Form.Item>
                        <Form.Item label="副标题字体">
                            <Input value={style.subFontSize} onChange={changeDetailData.bind(this, 1, style, 'subFontSize')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.subLineHeight} onChange={changeDetailData.bind(this, 2, style, 'subLineHeight')} />
                        </Form.Item>
                        <Form.Item label="字色" >
                            <ColorSelect color={style.subFontColor} setColor={setColor.bind(this, style, 'subFontColor')} />
                        </Form.Item>
                        <Form.Item label="水平对齐">
                            <Radio.Group size="small" value={style.subJustifyContent}
                                onChange={changeDetailData.bind(this, 1,style, 'subJustifyContent')}>
                                <Radio.Button value="flex-start">居左</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居右</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="垂直对齐">
                            <Radio.Group size="small" value={style.subAlignItems}
                                onChange={changeDetailData.bind(this, 1,style, 'subAlignItems')}>
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
