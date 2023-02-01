import React from 'react';
import {Form, Input, InputNumber, Collapse, Tooltip, Radio} from 'antd';
import {changeDetailData, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class BoxTypeFiveEdit extends React.Component {
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
                        <Form.Item label={<Tooltip title='单位em。'>标题宽*</Tooltip>}>
                            <InputNumber value={style.headWidth} onChange={changeDetailData.bind(this, 2, style, 'headWidth')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>标题高*</Tooltip>}>
                            <InputNumber value={style.headHeight} onChange={changeDetailData.bind(this, 2, style, 'headHeight')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='标题距离框盒左边距，单位em。'>左边距*</Tooltip>}>
                            <InputNumber value={style.headLeft} onChange={changeDetailData.bind(this, 2, style, 'headLeft')} />
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
                        <Form.Item label="背景透明度">
                            <InputNumber value={style.fillOpacity} onChange={changeDetailData.bind(this, 2, style, 'fillOpacity')} />
                        </Form.Item>
                        <Form.Item label="背景色调" >
                            <Radio.Group value={style.fill} onChange={changeDetailData.bind(this, 1, style, 'fill')}>
                                <Radio.Button value={2}>蓝</Radio.Button>
                                <Radio.Button value={5}>黑</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
