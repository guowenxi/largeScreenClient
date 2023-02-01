import React from 'react';
import { Form, Input, Collapse } from 'antd';
import { changeDetailData } from "../../common/editUtil";

const { Panel } = Collapse;

export default class DetailTypeOneEdit extends React.Component {
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
                    <Panel header="基础样式设置">
                        <Form.Item label="字号" >
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="文件路径" >
                            <Input value={style.fileUrl} onChange={changeDetailData.bind(this, 1, style, 'fileUrl')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
