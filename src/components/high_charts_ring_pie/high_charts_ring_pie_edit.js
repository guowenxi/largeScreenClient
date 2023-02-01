import React from 'react';
import { Form, Collapse, Input } from 'antd';
import ColorSelect from "../../common/colorSelect";

import { getColorListMultiple } from "../../common/nameNumEditUtil";

const { Panel } = Collapse;

export default class HighChartsRingEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.colorItem = { angle: "", colorList: [] };
        this.getColorListMultiple = getColorListMultiple.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    //修改颜色
    setColor(item, key, data) {
        this.props.saveNowDataToHistory();
        const rgb = data.rgb;
        item[key] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
        // debugger
    }
    // 修改字体大小
    changeDetailData(type, item, key, event) {
        this.props.saveNowDataToHistory();
        let editData = type === 1 ? event.target.value : event;
        item[key] = editData;
        let thisData = { ...this.props.data };
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
                    <Panel header="标注" key="1">
                        <Form.Item label="字色-数量">
                            <ColorSelect color={style.fontColor} setColor={this.setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="字色-名称">
                            <ColorSelect color={style.fontColor2} setColor={this.setColor.bind(this, style, 'fontColor2')} />
                        </Form.Item>
                        <Form.Item label="字大小-数量">
                            <Input value={style.fontSize} onChange={this.changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字大小-名称">
                            <Input value={style.fontSize2} onChange={this.changeDetailData.bind(this, 1, style, 'fontSize2')} />
                        </Form.Item>
                    </Panel>

                    <Panel header="颜色设置" key="2">
                        {this.getColorListMultiple(style, style.colors, "colorList")}
                    </Panel>
                </Collapse>
            </Form>

        )
    }
}
