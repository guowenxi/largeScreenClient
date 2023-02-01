import React from 'react';
import {Form, Input, Collapse} from 'antd';
import {changeDetailData, getInteractEdit} from "../../common/editUtil";

const { Panel } = Collapse;

export default class IframeYueqingMapEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getInteractEdit = getInteractEdit.bind(this);
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
                        <Form.Item label="内容链接">
                            <Input value={style.src} onChange={changeDetailData.bind(this, 1, style, 'src')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="筛选框位置" key="2">
                        <Form.Item label="高">
                            <Input value={style.selectHeight} onChange={changeDetailData.bind(this, 1, style, 'selectHeight')} />
                        </Form.Item>
                        <Form.Item label="左">
                            <Input value={style.selectLeft} onChange={changeDetailData.bind(this, 1, style, 'selectLeft')} />
                        </Form.Item>
                        <Form.Item label="右">
                            <Input value={style.selectRight} onChange={changeDetailData.bind(this, 1, style, 'selectRight')} />
                        </Form.Item>
                        <Form.Item label="上">
                            <Input value={style.selectTop} onChange={changeDetailData.bind(this, 1, style, 'selectTop')} />
                        </Form.Item>
                        <Form.Item label="下">
                            <Input value={style.selectBottom} onChange={changeDetailData.bind(this, 1, style, 'selectBottom')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
