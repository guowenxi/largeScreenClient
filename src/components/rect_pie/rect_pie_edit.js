import React from 'react';
import {Form, Collapse, Input, InputNumber} from 'antd';
import {changeDetailData} from "../../common/editUtil";
import {getColorList} from "../../common/nameNumEditUtil";

const {Panel} = Collapse;

export default class RectPieEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorList = getColorList.bind(this);
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
        const {style} = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse>
                    <Panel header="展示内容类型设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')}/>
                        </Form.Item>
                        <Form.Item label="数据键名">
                            <Input value={style.numKey} onChange={changeDetailData.bind(this, 1, style, 'numKey')}/>
                        </Form.Item>
                        <Form.Item label="圆角大小">
                            <InputNumber value={style.radius} onChange={changeDetailData.bind(this, 2, style, 'radius')}/>
                        </Form.Item>
                        <Form.Item label="线宽">
                            <InputNumber value={style.lineWidth} onChange={changeDetailData.bind(this, 2, style, 'lineWidth')}/>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
