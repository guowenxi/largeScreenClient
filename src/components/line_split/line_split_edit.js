import React from 'react';
import { Form, Input, Collapse, Button, Icon, Radio } from 'antd';
import { addListItem, changeDetailData } from "../../common/editUtil";
import { getColorList } from "../../common/nameNumEditUtil";

const { Panel } = Collapse;

export default class LineSplitEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.colorItem = { color: '#000', percent: 0 };
        this.getColorList = getColorList.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="样式设置" key="1">
                        <Form.Item label="线宽">
                            <Input value={style.splitWidth} onChange={changeDetailData.bind(this, 1, style, 'splitWidth')} />
                        </Form.Item>
                        <Form.Item label="线类型">
                            <Radio.Group value={style.lineType} onChange={changeDetailData.bind(this, 1, style, 'lineType')}>
                                <Radio value={'row'}>水平方向</Radio>
                                <Radio value={'column'}>垂直方向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="颜色类型">
                            <Radio.Group value={style.colorType} onChange={changeDetailData.bind(this, 1, style, 'colorType')}>
                                <Radio value={1}>线向渐变</Radio>
                                <Radio value={2}>径向渐变</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {this.getColorList(style.colorList)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'colorList', this.colorItem)}>
                                <Icon type="plus" /> 添加颜色
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
