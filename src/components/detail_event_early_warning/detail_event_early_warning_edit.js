import React from 'react';
import {Form, Collapse, Input} from 'antd';
import {changeDetailData} from "../../common/editUtil";
import {getDetailEdit} from "../../common/detailUtil";

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const {Panel} = Collapse;

export default class DetailEventEarlyWarningEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getDetailEdit = getDetailEdit.bind(this);
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    render() {
        const {style} = this.props.data;
        return (
            <Form {...formItemLayout}>
                {this.getDetailEdit(style)}
                <Collapse>
                    <Panel header="其它配置" key="5">
                        <Form.Item label="转为重点接口">
                            <Input value={style.turnToEmphaseUrl} onChange={changeDetailData.bind(this, 1, style, 'turnToEmphaseUrl')} />
                        </Form.Item>
                        <Form.Item label="排除预警接口">
                            <Input value={style.excludeUrl} onChange={changeDetailData.bind(this, 1, style, 'excludeUrl')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
