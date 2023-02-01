import React from 'react';
import { Form, Input, Collapse, Radio, Tooltip, InputNumber, Switch } from 'antd';
import {
    changeDetailData,
    setColor
} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
const { Panel } = Collapse;
export default class NameNumTypeTwentyFiveEdit extends React.Component {
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
                    <Panel header="基础设置">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="列数">
                            <InputNumber value={style.columnNum} onChange={changeDetailData.bind(this, 2, style, 'columnNum')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='列之间的空隙，单位为%（组件宽度的百分比）。'>
                                    列空隙*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.columnGap} onChange={changeDetailData.bind(this, 2, style, 'columnGap')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='行之间的空隙，单位为%（组件高度的百分比）。'>
                                    行空隙*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.rowGap} onChange={changeDetailData.bind(this, 2, style, 'rowGap')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="标题设置">
                        <Form.Item label="字号">
                            <Input value={style.titleFontSize} onChange={changeDetailData.bind(this, 1, style, 'titleFontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色" >
                            <ColorSelect color={style.titleColor} setColor={setColor.bind(this, style, 'titleColor')} />
                        </Form.Item>
                        <Form.Item label="键名" >
                            <Input value={style.titleKey} onChange={changeDetailData.bind(this, 1, style, 'titleKey')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="名称设置">
                        <Form.Item label="键名" >
                            <Input value={style.nameKey} onChange={changeDetailData.bind(this, 1, style, 'nameKey')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.nameFontSize} onChange={changeDetailData.bind(this, 1, style, 'nameFontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色" >
                            <ColorSelect color={style.nameColor} setColor={setColor.bind(this, style, 'nameColor')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.nameLineHeight} onChange={changeDetailData.bind(this, 2, style, 'nameLineHeight')} />
                        </Form.Item>
                        <Form.Item label="水平对齐">
                            <Radio.Group size="small" value={style.nameJustifyContent}
                                onChange={changeDetailData.bind(this, 1, style, 'nameJustifyContent')}>
                                <Radio.Button value="flex-start">居左</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居右</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="垂直对齐">
                            <Radio.Group size="small" value={style.nameAlignItems}
                                onChange={changeDetailData.bind(this, 1, style, 'nameAlignItems')}>
                                <Radio.Button value="flex-start">居上</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居下</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="父级设置">
                        <Form.Item label="键名" >
                            <Input value={style.groupKey} onChange={changeDetailData.bind(this, 1, style, 'groupKey')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="前缀设置">
                        <Form.Item label="键名" >
                            <Input value={style.fatherKey} onChange={changeDetailData.bind(this, 1, style, 'fatherKey')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.fatherFontSize} onChange={changeDetailData.bind(this, 1, style, 'fatherFontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色" >
                            <ColorSelect color={style.fatherColor} setColor={setColor.bind(this, style, 'fatherColor')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.fatherLineHeight} onChange={changeDetailData.bind(this, 2, style, 'fatherLineHeight')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="后缀设置">
                        <Form.Item label="键名" >
                            <Input value={style.childKey} onChange={changeDetailData.bind(this, 1, style, 'childKey')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.childFontSize} onChange={changeDetailData.bind(this, 1, style, 'childFontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色" >
                            <ColorSelect color={style.childColor} setColor={setColor.bind(this, style, 'childColor')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.childLineHeight} onChange={changeDetailData.bind(this, 2, style, 'childLineHeight')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="自动滚动" key="6">
                        <Form.Item label="是否开启">
                            <Switch checked={style.autoMove}
                                onChange={changeDetailData.bind(this, 2, style, 'autoMove')} />
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
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
