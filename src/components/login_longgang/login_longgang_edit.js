import React from 'react';
import {Form, Input, Collapse} from 'antd';
import {changeDetailData} from "../../common/editUtil";

const { Panel } = Collapse;

export default class LoginLonggangEdit extends React.Component {
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
                    <Panel header="背景设置" key="1">
                        <Form.Item label="用户键名">
                            <Input value={style.userName} onChange={changeDetailData.bind(this, 1, style, 'userName')} />
                        </Form.Item>
                        <Form.Item label="密码键名">
                            <Input value={style.password} onChange={changeDetailData.bind(this, 1, style, 'password')} />
                        </Form.Item>
                        <Form.Item label="登录接口">
                            <Input value={style.reportUrl} onChange={changeDetailData.bind(this, 1, style, 'reportUrl')} />
                        </Form.Item>
                        <Form.Item label="跳转页面">
                            <Input value={style.pageId} onChange={changeDetailData.bind(this, 1, style, 'pageId')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
