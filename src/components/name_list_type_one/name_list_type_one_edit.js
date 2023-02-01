import React from 'react';
import {Form, Input, Collapse} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {changeDetailData, setColor} from "../../common/editUtil";

const { Panel } = Collapse;

export default class NameNumTypeSixEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible:false};
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
                    <Panel header="基础样式" key="1">
                        <Form.Item label="字色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="内容键名">
                            <Input value={style.nameKey} onChange={changeDetailData.bind(this, 1, style, 'nameKey')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
