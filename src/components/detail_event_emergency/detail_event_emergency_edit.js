import React from 'react';
import {Form, Collapse, Input,Radio} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {changeDetailData, setColor} from "../../common/editUtil";

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const {Panel} = Collapse;

export default class DetailEventEmergencyEdit extends React.Component {
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
                        <Form.Item  label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item  label="背景色">
                            <ColorSelect color={style.bgColor} setColor={setColor.bind(this, style, 'bgColor')}/>
                        </Form.Item>
                        <Form.Item  label="内边距">
                            <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                        </Form.Item>
                        <Form.Item label="图例">
                            <Radio.Group value={style.contentType} onChange={changeDetailData.bind(this, 1, style, 'contentType')}>
                                <Radio value={'detailEventCangnan'}>类型一</Radio>
                                <Radio value={'detailEventYongjia'}>类型二</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
