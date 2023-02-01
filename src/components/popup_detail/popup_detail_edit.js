import React from 'react';
import {Form, Input, Collapse, InputNumber, Tooltip} from 'antd';
import {changeDetailData, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class PopupDetailEdit extends React.Component {
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
            <Collapse >
                <Panel header="基础样式" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="详情链接">
                            <Input value={style.src} onChange={changeDetailData.bind(this, 1, style, 'src')} />
                        </Form.Item>
                        <Form.Item label="按钮颜色">
                            <ColorSelect color={style.color} setColor={setColor.bind(this, style, 'color')} />
                        </Form.Item>
                        <Form.Item label="按钮大小">
                            <Input value={style.size} onChange={changeDetailData.bind(this, 1, style, 'size')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='关闭按钮距边界空隙，单位为em，默认为1。'>
                                    按钮空隙*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.gap} min={0} max={100} onChange={changeDetailData.bind(this, 2, style, 'gap')} />
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
