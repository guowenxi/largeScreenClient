import React from 'react';
import {Form, Input, Collapse, Switch, InputNumber, Button, Icon} from 'antd';
import {addListItem, changeDetailData, getInteractEdit, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class BoxTypeFourEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getInteractEdit = getInteractEdit.bind(this);
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
                        <Form.Item label="标题高">
                            <Input value={style.headHeight} onChange={changeDetailData.bind(this, 1, style, 'headHeight')} />
                        </Form.Item>
                        <Form.Item label="标题内容">
                            <Input value={style.headContent} onChange={changeDetailData.bind(this, 1, style, 'headContent')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="展开设置" key="2">
                        <Form.Item label="按钮显示">
                            <Switch checked={style.buttonShow} onChange={changeDetailData.bind(this, 2, style, 'buttonShow')} />
                        </Form.Item>
                        <Form.Item label="放大倍数">
                            <InputNumber value={style.multiple} onChange={changeDetailData.bind(this, 2, style, 'multiple')} />
                        </Form.Item>
                        <Collapse >
                            <Panel header="展开交互" key="1">
                                {this.getInteractEdit(style.interactShow)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style,'interactShow',{})}>
                                        <Icon type="plus"/> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="收起交互" key="2">
                                {this.getInteractEdit(style.interactHide)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style,'interactHide',{})}>
                                        <Icon type="plus"/> 添加交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
