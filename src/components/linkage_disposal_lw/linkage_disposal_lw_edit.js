import React from 'react';
import {Form, Collapse, Input} from 'antd';
import {changeDetailData} from "../../common/editUtil";

const { Panel } = Collapse;

export default class LinkageDisposalEdit extends React.Component {
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
                    <Panel header="基础样式设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="街道id">
                            <Input value={style.roadId} onChange={changeDetailData.bind(this, 1, style, 'roadId')} />
                        </Form.Item>
                        <Form.Item label="服务地址">
                            <Input value={style.emergencyUrl} onChange={changeDetailData.bind(this, 1, style, 'emergencyUrl')} />
                        </Form.Item>
                        <Form.Item label="文件地址">
                            <Input value={style.emergencyFileUrl} onChange={changeDetailData.bind(this, 1, style, 'emergencyFileUrl')} />
                        </Form.Item>
                        <Form.Item label="会议地址">
                            <Input value={style.meetingUrl} onChange={changeDetailData.bind(this, 1, style, 'meetingUrl')} />
                        </Form.Item>
                        <Form.Item label="钉钉调起前缀">
                            <Input value={style.dingtalkUrl} onChange={changeDetailData.bind(this, 1, style, 'dingtalkUrl')} />
                        </Form.Item>
                        <Form.Item label="列表刷新间隔">
                            <Input value={style.listTime} onChange={changeDetailData.bind(this, 1, style, 'listTime')} />
                        </Form.Item>
                        <Form.Item label="详情刷新间隔">
                            <Input value={style.detailTime} onChange={changeDetailData.bind(this, 1, style, 'detailTime')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
