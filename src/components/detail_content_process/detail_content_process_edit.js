import React from 'react';
import { Form, Collapse, Input,InputNumber } from 'antd';
import ColorSelect from "../../common/colorSelect";
import { changeDetailData, setColor } from "../../common/editUtil";

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const { Panel } = Collapse;

export default class DetailContentEventEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.layerIdItem = '';
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    render() {
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout}>
                <Collapse>
                    <Panel header="基础内容设置" key="1">
                        <Form.Item label="背景色">
                            <ColorSelect color={style.bgColor} setColor={setColor.bind(this, style, 'bgColor')} />
                        </Form.Item>
                        <Form.Item label="列表接口">
                            <Input value={style.listUrl} onChange={changeDetailData.bind(this, 1, style, 'listUrl')} />
                        </Form.Item>
                        <Form.Item label="详情接口">
                            <Input value={style.detailUrl} onChange={changeDetailData.bind(this, 1, style, 'detailUrl')} />
                        </Form.Item>
                        <Form.Item label="下拉框宽度">
                            <Input value={style.width} onChange={changeDetailData.bind(this, 1, style, 'width')} />
                        </Form.Item>
                        <Form.Item label="下拉框高度">
                            <Input value={style.height} onChange={changeDetailData.bind(this, 1, style, 'height')} />
                        </Form.Item>
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="弹框设置" key="2">
                        <Form.Item label="按钮字号">
                            <Input value={style.selectFontSize} onChange={changeDetailData.bind(this, 1, style, 'selectFontSize')} />
                        </Form.Item>
                        <Form.Item label="弹框宽度">
                            <Input value={style.boxWidth} onChange={changeDetailData.bind(this, 1, style, 'boxWidth')} />
                        </Form.Item>
                        <Form.Item label="弹框高度">
                            <Input value={style.boxHeight} onChange={changeDetailData.bind(this, 1, style, 'boxHeight')} />
                        </Form.Item>
                        <Form.Item label="弹框左">
                            <Input value={style.boxLeft} onChange={changeDetailData.bind(this, 1, style, 'boxLeft')} />
                        </Form.Item>
                        <Form.Item label="弹框上">
                            <Input value={style.boxTop} onChange={changeDetailData.bind(this, 1, style, 'boxTop')} />
                        </Form.Item>
                        <Form.Item label="三角左">
                            <Input value={style.triangleLeft} onChange={changeDetailData.bind(this, 1, style, 'triangleLeft')} />
                        </Form.Item>
                        <Form.Item label="三角上">
                            <Input value={style.triangleTop} onChange={changeDetailData.bind(this, 1, style, 'triangleTop')} />
                        </Form.Item>
                        <Form.Item label="三角颜色">
                            <ColorSelect color={style.triangleColor} setColor={setColor.bind(this, style, 'triangleColor')} />
                        </Form.Item>
                        <Form.Item label="内容框背景色">
                            <ColorSelect color={style.contentColor} setColor={setColor.bind(this, style, 'contentColor')} />
                        </Form.Item>
                        <Form.Item label="内容框宽度">
                            <Input value={style.contentWidth} onChange={changeDetailData.bind(this, 1, style, 'contentWidth')} />
                        </Form.Item>
                        <Form.Item label="内容框高度">
                            <Input value={style.contentHeight} onChange={changeDetailData.bind(this, 1, style, 'contentHeight')} />
                        </Form.Item>
                        <Form.Item label="内容框边框宽度">
                            <Input value={style.contentBorderWidth} onChange={changeDetailData.bind(this, 1, style, 'contentBorderWidth')} />
                        </Form.Item>
                        <Form.Item label="内容框边框颜色">
                            <ColorSelect color={style.contentBorderColor} setColor={setColor.bind(this, style, 'contentBorderColor')} />
                        </Form.Item>
                        <Form.Item label="标题左">
                            <Input value={style.titleLeft} onChange={changeDetailData.bind(this, 1, style, 'titleLeft')} />
                        </Form.Item>
                        <Form.Item label="标题上">
                            <Input value={style.titleTop} onChange={changeDetailData.bind(this, 1, style, 'titleTop')} />
                        </Form.Item>
                        <Form.Item label="标题字号">
                            <InputNumber value={style.titleFontSize} onChange={changeDetailData.bind(this, 2, style, 'titleFontSize')} />
                        </Form.Item>
                        <Form.Item label="标题颜色">
                        <ColorSelect color={style.titleColor} setColor={setColor.bind(this, style, 'titleColor')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
