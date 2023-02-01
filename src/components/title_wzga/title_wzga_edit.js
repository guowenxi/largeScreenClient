import React from 'react';
import { Form, Input, Collapse } from 'antd';
import { changeDetailData, setColor } from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;
export default class TitleWZGA extends React.Component {
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
                    <Panel header="基础设置" key="1">
                        <Form.Item label="标题" >
                            <Input value={style.name} onChange={changeDetailData.bind(this, 1, style, 'name')} />
                        </Form.Item>
                        <Form.Item label="字体大小" >
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={style.color} setColor={setColor.bind(this, style, 'color')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
