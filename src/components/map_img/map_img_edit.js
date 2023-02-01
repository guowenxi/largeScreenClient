import React from 'react';
import {Form, Collapse, Tooltip, Input, Select} from 'antd';
import {changeDetailData, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class MapImgYueqingEdit extends React.Component {
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
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        return (
            <Collapse >
                <Panel header="基础配置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item
                            label={
                                <Tooltip title='默认为name'>
                                    标题键名*
                                </Tooltip>
                            }
                        >
                            <Input value={style.titleKey} onChange={changeDetailData.bind(this, 1, style, 'titleKey')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='默认为num'>
                                    值键名*
                                </Tooltip>
                            }
                        >
                            <Input value={style.numKey} onChange={changeDetailData.bind(this, 1, style, 'numKey')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.color} setColor={setColor.bind(this, style, 'color')} />
                        </Form.Item>
                        <Form.Item label="地图">
                            <Select value={style.area} onChange={changeDetailData.bind(this, 2, style, 'area')}>
                                <Select.Option value={'lucheng'} >鹿城</Select.Option>
                                <Select.Option value={'ouhai'} >瓯海</Select.Option>
                                <Select.Option value={'ruian'} >瑞安</Select.Option>
                                <Select.Option value={'longgang'} >龙港</Select.Option>
                                <Select.Option value={'pingyang'} >平阳</Select.Option>
                                <Select.Option value={'wencheng'} >文成</Select.Option>
                                <Select.Option value={'longwan'} >龙湾</Select.Option>
                                <Select.Option value={'dongtou'} >洞头</Select.Option>
                                <Select.Option value={'yueqing'} >乐清</Select.Option>
                                <Select.Option value={'yongjia'} >永嘉</Select.Option>
                                <Select.Option value={'cangnan'} >苍南</Select.Option>
                                <Select.Option value={'taishun'} >泰顺</Select.Option>
                                <Select.Option value={'yueqingTwo'} >乐清二</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
