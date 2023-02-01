import React from 'react';
import {Form, Collapse, Radio, Input} from 'antd';
import {changeDetailData} from "../../common/editUtil";

const { Panel } = Collapse;

export default class AntdTimeSearchEdit extends React.Component {
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
            <Form {...formItemLayout24} >
                <Collapse className='editBox'>
                    <Panel header="内容设置" key="1">
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="样式" >
                            <Radio.Group value={style.theme} onChange={changeDetailData.bind(this, 1, style, 'theme')}>
                                <Radio.Button value={0}>样式一</Radio.Button>
                                <Radio.Button value={1}>样式二</Radio.Button>
                                <Radio.Button value={2}>样式三</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="开始提示语">
                            <Input value={style.startPlaceholder} onChange={changeDetailData.bind(this, 1, style, 'startPlaceholder')} />
                        </Form.Item>
                        <Form.Item label="结束提示语">
                            <Input value={style.endPlaceholder} onChange={changeDetailData.bind(this, 1, style, 'endPlaceholder')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
