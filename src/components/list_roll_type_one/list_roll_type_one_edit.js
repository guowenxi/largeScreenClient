import React from 'react';
import {Form, Input, Collapse, Radio, Tooltip} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {changeDetailData, setColor} from "../../common/editUtil";

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const {Panel} = Collapse;

export default class TitleWarningEdit extends React.Component {
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
                    <Panel header="内容设置" key="1">
                        <Form.Item label="内容类型">
                            <Radio.Group value={style.contentType} onChange={changeDetailData.bind(this, 1, style, 'contentType')}>
                                <Radio value={'contentOne'}>内容一</Radio>
                                <Radio value={'contentTwo'}>内容二</Radio>
                                <Radio value={'contentThree'}>内容三</Radio>
                                <Radio value={'contentFour'}>内容四</Radio>
                                <Radio value={'contentFive'}>内容五</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="滚动方向">
                            <Radio.Group value={style.direction} onChange={changeDetailData.bind(this, 1, style, 'direction')}>
                                <Radio value={1}>纵向</Radio>
                                <Radio value={2}>横向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="自动滚动时间间隔，单位毫秒。">
                                    时间间隔*
                                </Tooltip>
                            }
                        >
                            <Input value={style.interval} onChange={changeDetailData.bind(this, 1, style, 'interval')} />
                        </Form.Item>
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.color} setColor={setColor.bind(this, style, 'color')} />
                        </Form.Item>
                        {style.contentType === 'contentOne' && (
                            <Form.Item label="详情占宽">
                                <Input value={style.contentWidth} onChange={changeDetailData.bind(this, 1, style, 'contentWidth')} />
                            </Form.Item>
                        )}
                        <Form.Item label="展示样式">
                            <Radio.Group value={style.theme} onChange={changeDetailData.bind(this, 1, style, 'theme')}>
                                <Radio value={1}>默认</Radio>
                                <Radio value={2}>样式一</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.theme === 2 && (
                            <React.Fragment>
                                <Form.Item label="背景颜色" >
                                    <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                                </Form.Item>
                                <Form.Item label="圆角" >
                                    <Input value={style.borderRadius} onChange={changeDetailData.bind(this, 1, style, 'borderRadius')} />
                                </Form.Item>
                                <Form.Item label="默认颜色" >
                                    <ColorSelect color={style.defaultColor} setColor={setColor.bind(this, style, 'defaultColor')} />
                                </Form.Item>
                                <Form.Item label="选中颜色" >
                                    <ColorSelect color={style.selectedColor} setColor={setColor.bind(this, style, 'selectedColor')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
