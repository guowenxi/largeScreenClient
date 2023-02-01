import React from 'react';
import {Form, Input, Collapse, Tooltip, InputNumber} from 'antd';
import {changeDetailData, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
const { Panel } = Collapse;
export default class NameNumTypeTwentyEdit extends React.Component {
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
                    <Panel header="基础样式设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>圆环宽高*</Tooltip>} >
                            <InputNumber value={style.iconSize} onChange={changeDetailData.bind(this, 2, style, 'iconSize')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位毫秒。'>滚动间隔*</Tooltip>} >
                            <InputNumber value={style.moveTime} onChange={changeDetailData.bind(this, 2, style, 'moveTime')} />
                        </Form.Item>
                        <Form.Item label='显示个数' >
                            <InputNumber value={style.showNum} onChange={changeDetailData.bind(this, 2, style, 'showNum')} />
                        </Form.Item>
                        <Form.Item label='开始角度' >
                            <InputNumber value={style.startDeg} onChange={changeDetailData.bind(this, 2, style, 'startDeg')} />
                        </Form.Item>
                        <Form.Item label='角度间隔' >
                            <InputNumber value={style.oneDeg} onChange={changeDetailData.bind(this, 2, style, 'oneDeg')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="标题设置" key="2">
                        <Form.Item label="键名">
                            <Input value={style.titleKey} onChange={changeDetailData.bind(this, 1, style, 'titleKey')} />
                        </Form.Item>
                        {/*<Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>} >*/}
                        {/*    <InputNumber value={style.titleSize} onChange={changeDetailData.bind(this, 2, style, 'titleSize')} />*/}
                        {/*</Form.Item>*/}
                        <Form.Item label="字色" >
                            <ColorSelect color={style.titleColor} setColor={setColor.bind(this, style, 'titleColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="值设置" key="3">
                        <Form.Item label="键名">
                            <Input value={style.numKey} onChange={changeDetailData.bind(this, 1, style, 'numKey')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>} >
                            <InputNumber value={style.numSize} onChange={changeDetailData.bind(this, 2, style, 'numSize')} />
                        </Form.Item>
                        <Form.Item label="字色" >
                            <ColorSelect color={style.numColor} setColor={setColor.bind(this, style, 'numColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="编号设置" key="4">
                        <Form.Item label="标识字符">
                            <Input value={style.text} onChange={changeDetailData.bind(this, 1, style, 'text')} />
                        </Form.Item>
                        <Form.Item label="显示数量">
                            前<Input value={style.topNum} onChange={changeDetailData.bind(this, 1, style, 'topNum')} style={{width:'80px'}}/>个
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>} >
                            <InputNumber value={style.topSize} onChange={changeDetailData.bind(this, 2, style, 'topSize')} />
                        </Form.Item>
                        <Form.Item label="字色" >
                            <ColorSelect color={style.topColor} setColor={setColor.bind(this, style, 'topColor')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
