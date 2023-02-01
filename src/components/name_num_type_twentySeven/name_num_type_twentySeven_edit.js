import React from 'react';
import { Form, Input, Collapse, Radio, Tooltip, InputNumber, Switch } from 'antd';
import {
    changeDetailData,
    setColor
} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
const { Panel } = Collapse;
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
                        <Form.Item label={<Tooltip title="默认自定义">字号单位*</Tooltip>}>
                            <Radio.Group value={style.titleFontSizeType} onChange={changeDetailData.bind(this, 1, style, 'titleFontSizeType')}>
                                <Radio.Button value="em">em</Radio.Button>
                                <Radio.Button value="custom">自定义</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字号">
                            {style.titleFontSizeType === 'em' ?
                                <InputNumber value={style.titleFontSize} onChange={changeDetailData.bind(this, 2, style, 'titleFontSize')} /> :
                                <Input value={style.titleFontSize} onChange={changeDetailData.bind(this, 1, style, 'titleFontSize')} />
                            }
                        </Form.Item>
                        <Form.Item label="文字颜色" >
                            <ColorSelect color={style.titleColor} setColor={setColor.bind(this, style, 'titleColor')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.titleLineHeight} onChange={changeDetailData.bind(this, 2, style, 'titleLineHeight')} />
                        </Form.Item>
                        <Form.Item label="背景颜色">
                            <ColorSelect color={style.titleBackgroundColor} setColor={setColor.bind(this, style, 'titleBackgroundColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="子级列表设置">
                    <Form.Item label={<Tooltip title="默认自定义">字号单位*</Tooltip>}>
                            <Radio.Group value={style.listFontSizeType} onChange={changeDetailData.bind(this, 1, style, 'listFontSizeType')}>
                                <Radio.Button value="em">em</Radio.Button>
                                <Radio.Button value="custom">自定义</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字号">
                            {style.listFontSizeType === 'em' ?
                                <InputNumber value={style.listFontSize} onChange={changeDetailData.bind(this, 2, style, 'listFontSize')} /> :
                                <Input value={style.listFontSize} onChange={changeDetailData.bind(this, 1, style, 'listFontSize')} />
                            }
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.listLineHeight} onChange={changeDetailData.bind(this, 2, style, 'listLineHeight')} />
                        </Form.Item>
                        <Form.Item label="字色" >
                            <ColorSelect color={style.listColor} setColor={setColor.bind(this, style, 'listColor')} />
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
