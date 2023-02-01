import React from 'react';
import ColorSelect from "../../common/colorSelect";
import {Collapse, Form, Input} from 'antd';

const formItemLayout24 = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const { Panel } = Collapse;

export default class BarTypeOneEdit extends React.Component {
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
        let thisData = {...this.props.data};
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
        let thisData = {...this.props.data};
        const rgb = data.rgb;
        thisData.style[type] = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+rgb.a+')';
        this.props.updateData(thisData);
    }

    render() {
        return (
            <Collapse>
                <Panel header="样式设置" key="2">
                    <Form.Item {...formItemLayout24} label="列数">
                        <Input value={this.props.data.style.columnNum}
                               onChange={this.changeViewData.bind(this, 2, 'style', 'columnNum')}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout24} label="列空隙">
                        <Input value={this.props.data.style.columnGap}
                               onChange={this.changeViewData.bind(this, 2, 'style', 'columnGap')}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout24} label="行空隙">
                        <Input value={this.props.data.style.rowGap}
                               onChange={this.changeViewData.bind(this, 2, 'style', 'rowGap')}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout24} label="背景边框">
                        <Input value={this.props.data.style.border}
                               onChange={this.changeViewData.bind(this, 2, 'style', 'border')}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout24} label="边框颜色">
                        <ColorSelect color={this.props.data.style.borderColor} setColor={this.setColor.bind(this, 'borderColor')} />
                    </Form.Item>
                    <Form.Item {...formItemLayout24} label="背景色">
                        <ColorSelect color={this.props.data.style.itemBackground} setColor={this.setColor.bind(this, 'itemBackground')} />
                    </Form.Item>
                    <Form.Item {...formItemLayout24} label="柱颜色">
                        <ColorSelect color={this.props.data.style.barColor} setColor={this.setColor.bind(this, 'barColor')} />
                    </Form.Item>
                    <Form.Item {...formItemLayout24} label="文字大小">
                        <Input value={this.props.data.style.nameFontSize}
                               onChange={this.changeViewData.bind(this, 2, 'style', 'nameFontSize')}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout24} label="文字颜色">
                        <ColorSelect color={this.props.data.style.nameFontColor} setColor={this.setColor.bind(this, 'nameFontColor')} />
                    </Form.Item>
                    <Form.Item {...formItemLayout24} label="数字大小">
                        <Input value={this.props.data.style.numFontSize}
                               onChange={this.changeViewData.bind(this, 2, 'style', 'numFontSize')}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout24} label="数字颜色">
                        <ColorSelect color={this.props.data.style.numFontColor} setColor={this.setColor.bind(this, 'numFontColor')} />
                    </Form.Item>
                </Panel>
            </Collapse>
        );
    }
}
