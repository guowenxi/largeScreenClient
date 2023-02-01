import React from 'react';
import {Form, Input, Collapse, Switch} from 'antd';
import {changeDetailData, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class CameraCangnanEdit extends React.Component {
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
                <Panel header="基础配置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="服务器地址">
                            <Input value={style.loginIp} onChange={changeDetailData.bind(this, 1, style, 'loginIp')}/>
                        </Form.Item>
                        <Form.Item label="服务器端口">
                            <Input value={style.loginPort} onChange={changeDetailData.bind(this, 1, style, 'loginPort')}/>
                        </Form.Item>
                        <Form.Item label="用户名">
                            <Input value={style.userName} onChange={changeDetailData.bind(this, 1, style, 'userName')}/>
                        </Form.Item>
                        <Form.Item label="密码">
                            <Input value={style.userPassword} onChange={changeDetailData.bind(this, 1, style, 'userPassword')}/>
                        </Form.Item>
                        <Form.Item label="默认监控">
                            <Input value={style.defaultCamera} onChange={changeDetailData.bind(this, 1, style, 'defaultCamera')}/>
                        </Form.Item>
                        <Form.Item label="加载列表">
                            <Switch checked={style.loadData} onChange={changeDetailData.bind(this, 2, style, 'loadData')}/>
                        </Form.Item>
                        <Form.Item label="保存接口">
                            <Input value={style.reportUrl} onChange={changeDetailData.bind(this, 1, style, 'reportUrl')}/>
                        </Form.Item>
                        <Form.Item label="头部高度">
                            <Input value={style.headHeight} onChange={changeDetailData.bind(this, 1, style, 'headHeight')}/>
                        </Form.Item>
                        <Form.Item label="背景色">
                            <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item label="关闭按钮">
                            <Switch checked={style.hasClose} onChange={changeDetailData.bind(this, 2, style, 'hasClose')}/>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
