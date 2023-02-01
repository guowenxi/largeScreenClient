import React from 'react';
import { Form, Collapse, Input } from 'antd';
import ColorSelect from "../../common/colorSelect";
import { changeDetailData, setColor } from "../../common/editUtil";

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const { Panel } = Collapse;

export default class DetailEventEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.layerIdItem = '';
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    render() {
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout}>
                <Collapse>
                    <Panel header="基础内容设置" key="1">
                        <Form.Item label="背景色">
                            <ColorSelect color={style.bgColor} setColor={setColor.bind(this, style, 'bgColor')} />
                        </Form.Item>
                        <Form.Item label="列表接口">
                            <Input value={style.listUrl} onChange={changeDetailData.bind(this, 1, style, 'listUrl')} />
                        </Form.Item>
                        <Form.Item label="详情接口">
                            <Input value={style.detailUrl} onChange={changeDetailData.bind(this, 1, style, 'detailUrl')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="选择栏设置" key="2">
                        <Form.Item label="右">
                            <Input value={style.right} onChange={changeDetailData.bind(this, 1, style, 'right')} />
                        </Form.Item>
                        <Form.Item label="上">
                            <Input value={style.top} onChange={changeDetailData.bind(this, 1, style, 'top')} />
                        </Form.Item>
                        <Form.Item label="间距">
                            <Input value={style.marginRight} onChange={changeDetailData.bind(this, 1, style, 'marginRight')} />
                        </Form.Item>
                        <Form.Item label="选中颜色">
                            <ColorSelect color={style.selectColor} setColor={setColor.bind(this, style, 'selectColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="下拉框设置" key="3">
                        <Form.Item label="下拉框颜色">
                            <ColorSelect color={style.dropBoxColor} setColor={setColor.bind(this, style, 'dropBoxColor')} />
                        </Form.Item>
                        <Form.Item label="三角颜色">
                            <ColorSelect color={style.triangleColor} setColor={setColor.bind(this, style, 'triangleColor')} />
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={style.dropTextColor} setColor={setColor.bind(this, style, 'dropTextColor')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
