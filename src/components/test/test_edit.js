import React from 'react';
import { Form, Input, Collapse } from 'antd';
import { changeDetailData, setColor } from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class NameNumTypeFourEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const { style } = this.props.data;
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础设置" key="1">
                        <Form.Item label="文字字号">
                            <Input value={style.textFontSize} onChange={changeDetailData.bind(this, 1, style, 'textFontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={style.textColor} setColor={setColor.bind(this, style, 'textColor')} />
                        </Form.Item>
                        <Form.Item label="数字字号">
                            <Input value={style.numFontSize} onChange={changeDetailData.bind(this, 1, style, 'numFontSize')} />
                        </Form.Item>
                        <Form.Item label="数字颜色">
                            <ColorSelect color={style.numColor} setColor={setColor.bind(this, style, 'numColor')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
