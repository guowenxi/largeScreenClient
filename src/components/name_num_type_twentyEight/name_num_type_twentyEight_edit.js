import React from 'react';
import {Form, Input, Collapse, Tooltip, Icon, Row, Col} from 'antd';
import { addListItem, changeDetailData, deleteListItem, setColor } from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
const { Panel } = Collapse;
export default class NameNumTypeTwentyEightEdit extends React.Component {
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
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="最大格数">
                            <Input value={style.maxPartNum} onChange={changeDetailData.bind(this, 1, style, 'maxPartNum')} />
                        </Form.Item>
                        <Form.Item label={
                            <span>
                                    <Tooltip title="点击添加">
                                        <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={addListItem.bind(this, style, 'colorList', '#0ff')} />
                                    </Tooltip>
                                    颜色
                                </span>
                        }>
                            <Row>
                                {style.colorList && style.colorList.map((thisColor, index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={setColor.bind(this, style.colorList, index)} />
                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={deleteListItem.bind(this, style.colorList, index)} />
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
