import React from 'react';
import {Form, Collapse, Input, Switch} from 'antd';
import {changeDetailData, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class EmergencyResponseDoingEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.colorItem = {color:'#000',percent:100};
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
                    <Panel header="样式设置" key="1">
                        <Form.Item label="背景色">
                            <ColorSelect color={style.bgColor} setColor={setColor.bind(this, style, 'bgColor')}/>
                        </Form.Item>
                        <Form.Item label="内边距">
                            <Switch checked={style.padding}
                                    onChange={changeDetailData.bind(this, 2, style, 'padding')}/>
                        </Form.Item>
                        <Form.Item label="关闭按钮">
                            <Switch checked={style.close}
                                    onChange={changeDetailData.bind(this, 2, style, 'close')}/>
                        </Form.Item>
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="其他设置" key="2">
                        <Form.Item label="响应请求接口地址">
                            <Input value={style.reportUrl} onChange={changeDetailData.bind(this, 1, style, 'reportUrl')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
