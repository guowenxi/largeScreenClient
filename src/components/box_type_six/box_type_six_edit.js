import React from 'react';
import { Form, Input, Collapse,Radio } from 'antd';
import { changeDetailData, setColor } from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;
export default class BoxTypeSixEdit extends React.Component {
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
                        <Form.Item label="标题高">
                            <Input value={style.headHeight} onChange={changeDetailData.bind(this, 1, style, 'headHeight')} />
                        </Form.Item>
                        <Form.Item label="标题内容">
                            <Input value={style.headContent} onChange={changeDetailData.bind(this, 1, style, 'headContent')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="图标">
                            <Radio.Group value={style.show} onChange={changeDetailData.bind(this, 1, style, 'show')}>
                                <Radio value={1}>显示</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="主题">
                            <Radio.Group value={style.theme} onChange={changeDetailData.bind(this, 1, style, 'theme')}>
                                <Radio value={1}>主题一</Radio>
                                <Radio value={2}>主题二</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
