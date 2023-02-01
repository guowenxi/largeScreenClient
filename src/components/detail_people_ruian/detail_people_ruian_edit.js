import React from 'react';
import {Form, Collapse, Input} from 'antd';
import { changeDetailData} from "../../common/editUtil";
import {getColorList} from "../../common/nameNumEditUtil";
import {getDetailEdit} from "../../common/detailUtil";

const { Panel } = Collapse;

export default class DetailPeopleRuianEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorList = getColorList.bind(this);
        this.getDetailEdit = getDetailEdit.bind(this);
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
                    <Panel header="内容设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="查看记录">
                            <Input value={style.saveRecordUrl} onChange={changeDetailData.bind(this, 1, style, 'saveRecordUrl')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
