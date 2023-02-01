import React from 'react';
import ColorSelect from "../../common/colorSelect";
import { Form, Input, InputNumber, Collapse } from 'antd';
import {
    changeDetailData, setColor,
} from "../../common/editUtil";

const formItemLayout24 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const { Panel } = Collapse;

export default class barTypeTwoEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    //修改位置大小样式
    changeViewData(type, keyOne, keyTwo, event) {
        this.props.saveNowDataToHistory();
        let thisData = { ...this.props.data };
        if (type === 1) {
            thisData[keyOne] = event.target.value;
        } else if (type === 2) {
            thisData[keyOne][keyTwo] = event.target.value;
        }
        this.props.updateData(thisData);
    }

    //修改颜色
    setColor(type, data) {
        this.props.saveNowDataToHistory();
        let thisData = { ...this.props.data };
        const rgb = data.rgb;
        thisData.style[type] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        this.props.updateData(thisData);
    }

    render() {
        const { style } = this.props.data;
        if (style.item) {

        }
        return (
            <Form  {...formItemLayout24}>
                <Collapse>
                    <Panel header="样式设置" key="2">
                        <Form.Item  label="列数">
                            <InputNumber value={style.columnNum}
                                onChange={changeDetailData.bind(this, 2, style, 'columnNum')} />
                        </Form.Item>
                        <Form.Item label="列空隙">
                            <InputNumber value={style.columnGap}
                                onChange={changeDetailData.bind(this, 2, style, 'columnGap')} />
                        </Form.Item>
                        <Form.Item label="行空隙">
                            <InputNumber value={style.rowGap}
                                onChange={changeDetailData.bind(this, 2, style, 'rowGap')} />
                        </Form.Item>
                        <Form.Item label="背景色">
                            <ColorSelect color={style.littleItemBackground} setColor={setColor.bind(this, style, 'littleItemBackground')} />
                        </Form.Item>
                        <Form.Item label="第一条背景色">
                            <ColorSelect color={style.firstColor} setColor={setColor.bind(this, style, 'firstColor')} />
                        </Form.Item>
                        <Form.Item label="第二条背景色">
                            <ColorSelect color={style.secondColor} setColor={setColor.bind(this, style, 'secondColor')} />
                        </Form.Item>
                        <Form.Item label="第三条背景色">
                            <ColorSelect color={style.thirdColor} setColor={setColor.bind(this, style, 'thirdColor')} />
                        </Form.Item>
                        <Form.Item label="第四条背景色">
                            <ColorSelect color={style.fourthColor} setColor={setColor.bind(this, style, 'fourthColor')} />
                        </Form.Item>
                        <Form.Item label="宽度">
                            <InputNumber value={style.lineWidth}
                                onChange={changeDetailData.bind(this, 2, style, 'lineWidth')} />
                        </Form.Item>
                        <Form.Item label="文字大小">
                            <Input value={style.nameFontSize}
                                onChange={changeDetailData.bind(this, 1, style, 'nameFontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={style.littleNameFontColor} setColor={setColor.bind(this, style, 'littleNameFontColor')} />
                        </Form.Item>
                        <Form.Item label="数字大小">
                            <Input value={style.numFontSize}
                                onChange={changeDetailData.bind(this, 1, style, 'numFontSize')} />
                        </Form.Item>
                        <Form.Item label="数字颜色">
                            <ColorSelect color={style.numFontColor} setColor={setColor.bind(this, style, 'numFontColor')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
