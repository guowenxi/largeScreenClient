import React from 'react';
import {Form, Input, Collapse} from 'antd';

const { Panel } = Collapse;

export default class CameraWitnessEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    changeDetailData(type, item, key, event){
        this.props.saveNowDataToHistory();
        let editData = type === 1 ? event.target.value : event;
        item[key] = editData;
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        return (
            <Collapse >
                <Panel header="基本信息" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="服务器地址">
                            <Input value={style.loginIp} onChange={this.changeDetailData.bind(this, 1, style, 'loginIp')}/>
                        </Form.Item>
                        <Form.Item label="服务器端口">
                            <Input value={style.loginPort} onChange={this.changeDetailData.bind(this, 1, style, 'loginPort')}/>
                        </Form.Item>
                        <Form.Item label="用户名">
                            <Input value={style.userName} onChange={this.changeDetailData.bind(this, 1, style, 'userName')}/>
                        </Form.Item>
                        <Form.Item label="密码">
                            <Input value={style.userPassword} onChange={this.changeDetailData.bind(this, 1, style, 'userPassword')}/>
                        </Form.Item>
                        <Form.Item label="截图路径">
                            <Input value={style.picPath} onChange={this.changeDetailData.bind(this, 1, style, 'picPath')}/>
                        </Form.Item>
                        <Form.Item label="录像路径">
                            <Input value={style.recPath} onChange={this.changeDetailData.bind(this, 1, style, 'recPath')}/>
                        </Form.Item>
                        <Form.Item label="默认监控">
                            <Input value={style.defaultCamera} onChange={this.changeDetailData.bind(this, 1, style, 'defaultCamera')}/>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
