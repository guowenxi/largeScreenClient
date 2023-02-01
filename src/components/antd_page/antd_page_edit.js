import React from 'react';
import {Form, Input, Collapse, InputNumber, Radio} from 'antd';
import {changeDetailData} from "../../common/editUtil";

const { Panel } = Collapse;

export default class AntdCascaderEdit extends React.Component {
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
                <Collapse >
                    <Panel header="基础配置" key="1">
                        <Form.Item label="总数键名">
                            <Input value={style.totalKey} onChange={changeDetailData.bind(this, 1, style, 'totalKey')} />
                        </Form.Item>
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="初始页数">
                            <InputNumber value={style.pageNo} onChange={changeDetailData.bind(this, 2, style, 'pageNo')} />
                        </Form.Item>
                        <Form.Item label="一页条数">
                            <InputNumber value={style.pageSize} onChange={changeDetailData.bind(this, 2, style, 'pageSize')} />
                        </Form.Item>
                        <Form.Item label="水平位置" >
                            <Radio.Group value={style.justifyContent} onChange={changeDetailData.bind(this, 1, style, 'justifyContent')}>
                                <Radio.Button value="flex-start">居左</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居右</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="垂直位置" >
                            <Radio.Group value={style.alignItems} onChange={changeDetailData.bind(this, 1, style, 'alignItems')}>
                                <Radio.Button value="flex-start">居上</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居下</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
