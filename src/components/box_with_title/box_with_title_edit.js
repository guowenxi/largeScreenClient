import React from 'react';
import {Form, Input, Collapse, Radio} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {changeDetailData, setColor} from "../../common/editUtil";

const {Panel} = Collapse;

export default class BoxWithTitleEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout}>
                <Collapse>
                    <Panel header="标题设置" key="1">
                        <Form.Item label="标题内容">
                            <Input value={style.title} onChange={changeDetailData.bind(this, 1, style, 'title')} />
                        </Form.Item>
                        <Form.Item label="标题字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="标题字色">
                            <ColorSelect color={style.color} setColor={setColor.bind(this, style, 'color')} />
                        </Form.Item>
                        <Form.Item label="标题背景">
                            <ColorSelect color={style.titleBackground} setColor={setColor.bind(this, style, 'titleBackground')} />
                        </Form.Item>
                        <Form.Item label="右侧图形">
                            <Radio.Group value={style.iconType} onChange={changeDetailData.bind(this, 1, style, 'iconType')}>
                                <Radio value={null}>无</Radio>
                                <Radio value={1}>箭头</Radio>
                                <Radio value={2}>斜道</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="样式设置" key="2">
                        <Form.Item label="头部高">
                            <Input value={style.headHeight} onChange={changeDetailData.bind(this, 1, style, 'headHeight')} />
                        </Form.Item>
                        <Form.Item label="头部背景">
                            <ColorSelect color={style.headBackground} setColor={setColor.bind(this, style, 'headBackground')} />
                        </Form.Item>
                        <Form.Item label="内容背景">
                            <ColorSelect color={style.contentBackground} setColor={setColor.bind(this, style, 'contentBackground')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
