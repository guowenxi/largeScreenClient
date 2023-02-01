import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Form, Collapse, Input, Radio, InputNumber, Tooltip, Slider, Tag, Icon, Button, Switch } from 'antd';


import ColorSelect from "../../common/colorSelect";
import {
    changeDetailData,
    setColor,
} from "../../common/editUtil";



const { Panel } = Collapse;
export default class LineTypeOneEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeDetailData = changeDetailData.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    handleChangeStyle = (type, item, key, e) => {
        this.changeDetailData(type, item, key, e);
    };
    addColor(item) {
        this.props.saveNowDataToHistory();
        item.push({ color: 'rgb(4, 152, 220)', stop: '', });
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }
    deleteColor(item, index) {
        this.props.saveNowDataToHistory();
        if (item.length <= 2) {
            return;
        }
        item.splice(index, 1);
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
            <Collapse >
                <Panel header="基础样式设置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="数字样式设置" key="2">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字号">
                            <Input value={style.numberFontSize} onChange={changeDetailData.bind(this, 1, style, 'numberFontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.numberColor} setColor={setColor.bind(this, style, 'numberColor')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="文字样式设置" key="3">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字号">
                            <Input value={style.wordFontSize} onChange={changeDetailData.bind(this, 1, style, 'wordFontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.wordColor} setColor={setColor.bind(this, style, 'wordColor')} />
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
