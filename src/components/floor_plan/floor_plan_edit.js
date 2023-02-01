import React from 'react';
import {Form, Input, Collapse, Tooltip} from 'antd';
import {changeDetailData} from "../../common/editUtil";
import {getSourceEdit} from "../../common/editUtil";

const { Panel } = Collapse;

export default class FloorPlanEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getSourceEdit = getSourceEdit.bind(this);
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
                    <Panel header="基础配置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="物品类型1数据" key="2">
                        <Form.Item label={<Tooltip title='选择物品类型1时物品类型2接口筛选条件的key。'>传输键名*</Tooltip>} >
                            <Input value={style.goodsTypeKey} onChange={changeDetailData.bind(this, 1, style, 'goodsTypeKey')} />
                        </Form.Item>
                        {this.getSourceEdit(style,'goodsTypeSource')}
                    </Panel>
                    <Panel header="物品类型2数据" key="3">
                        <Form.Item label={<Tooltip title='选择物品类型2时物品列表接口筛选条件的key。'>传输键名*</Tooltip>} >
                            <Input value={style.goodsTypeTwoKey} onChange={changeDetailData.bind(this, 1, style, 'goodsTypeTwoKey')} />
                        </Form.Item>
                        {this.getSourceEdit(style,'goodsTypeTwoSource')}
                    </Panel>
                    <Panel header="物品列表数据" key="4">
                        {this.getSourceEdit(style,'goodsListSource')}
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
