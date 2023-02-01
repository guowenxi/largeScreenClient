import React from 'react';
import {Form, Collapse, Input} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {changeDetailData, setColor} from "../../common/editUtil";

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const {Panel} = Collapse;

export default class DetailPeopleEarlyWarningEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    render() {
        const {style} = this.props.data;
        return (
            <Form {...formItemLayout}>
                <Collapse>
                    <Panel header="基础样式设置" key="1">
                        <Form.Item  label="背景色">
                            <ColorSelect color={style.bgColor} setColor={setColor.bind(this, style, 'bgColor')}/>
                        </Form.Item>
                        <Form.Item  label="内边距">
                            <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="关闭按钮设置" key="2">
                        <Form.Item label="按钮颜色">
                            <ColorSelect color={style.iconColor} setColor={setColor.bind(this, style, 'iconColor')} />
                        </Form.Item>
                        <Form.Item label="按钮大小">
                            <Input value={style.iconSize} onChange={changeDetailData.bind(this, 1, style, 'iconSize')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
