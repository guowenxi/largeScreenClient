import React from 'react';
import { Form, Input, Collapse,Radio } from 'antd';
import {
    changeDetailData, setColor
} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";


const { Panel } = Collapse;
export default class NameNumTypeFifteenEdit extends React.Component {
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
                    <Panel header="基础设置" key="3">
                    <Form.Item label="字体设置">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="数值设置" key="1">
                        <Form.Item label="数字大小">
                            <Input value={style.numFontSize} onChange={changeDetailData.bind(this, 1, style, 'numFontSize')} />
                        </Form.Item>
                        <Form.Item label="数字颜色" >
                            <ColorSelect color={style.numColor} setColor={setColor.bind(this, style, 'numColor')} />
                        </Form.Item>
                        <Form.Item label="字体粗细">
                            <Radio.Group size="small" value={style.numWeight}
                                onChange={changeDetailData.bind(this, 1,style, 'numWeight')}>
                                <Radio.Button value="bold">更粗</Radio.Button>
                                <Radio.Button value="normal">正常</Radio.Button>
                                <Radio.Button value="lighter">更细</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="单位">
                            <Input value={style.company} onChange={changeDetailData.bind(this, 1, style, 'company')} />
                        </Form.Item>
                        <Form.Item label="单位大小">
                            <Input value={style.comFontSize} onChange={changeDetailData.bind(this, 1, style, 'comFontSize')} />
                        </Form.Item>
                        <Form.Item label="单位颜色">
                            <ColorSelect color={style.comColor} setColor={setColor.bind(this, style, 'comColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="标题设置" key="2">
                        <Form.Item label="标题大小">
                            <Input value={style.titleFontSize} onChange={changeDetailData.bind(this, 1, style, 'titleFontSize')} />
                        </Form.Item>
                        <Form.Item label="标题颜色" >
                            <ColorSelect color={style.titleColor} setColor={setColor.bind(this, style, 'titleColor')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
