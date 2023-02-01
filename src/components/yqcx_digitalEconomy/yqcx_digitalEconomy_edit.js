import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Form, Collapse, Input, Radio, InputNumber, Tooltip, Slider, Tag, Icon, Button, Switch } from 'antd';


import ColorSelect from "../../common/colorSelect";
import {
    changeDetailData,
    setColor,
} from "../../common/editUtil";



const { Panel } = Collapse;
export default class LineTypeOneEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.changeDetailData = changeDetailData.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    handleChangeStyle = (type, item, key, e) => {
        this.changeDetailData(type, item, key, e);
    };
    addColor(item) {
        this.props.saveNowDataToHistory();
        item.push({ color: 'rgb(4, 152, 220)', stop: '', });
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }
    deleteColor(item, index) {
        this.props.saveNowDataToHistory();
        if (item.length <= 2) {
            return;
        }
        item.splice(index, 1);
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }
    render() {
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        const titleBgColor = style[`titleBgColor${style.titleBgColorType}`];
        return (
            <Collapse >
                <Panel header="基础样式设置" key="1">
                    <Form {...formItemLayout24} >
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
                        <Form.Item label="背景颜色">
                            <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="标题设置" key="2">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字号">
                            <Input value={style.titleFontSize} onChange={changeDetailData.bind(this, 1, style, 'titleFontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色" >
                            <ColorSelect color={style.titleColor} setColor={setColor.bind(this, style, 'titleColor')} />
                        </Form.Item>
                        <Form.Item label="字重">
                            <Radio.Group value={style.titleFontWeight} onChange={changeDetailData.bind(this, 1, style, 'titleFontWeight')}>
                                <Radio.Button value={200}>细</Radio.Button>
                                <Radio.Button value={400}>普通</Radio.Button>
                                <Radio.Button value={600}>粗</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="高度" >
                            <Input value={style.titleHeight} onChange={changeDetailData.bind(this, 1, style, 'titleHeight')} />
                        </Form.Item>
                        <Form.Item label="键名" >
                            <Input value={style.titleKey} onChange={changeDetailData.bind(this, 1, style, 'titleKey')} />
                        </Form.Item>
                        <Collapse>
                            <Panel header="背景颜色">
                                <Form.Item label="颜色类型" >
                                    <Radio.Group value={style.titleBgColorType} onChange={changeDetailData.bind(this, 1, style, 'titleBgColorType')}>
                                        <Radio value={1}>单一色</Radio>
                                        <Radio value={2}>渐变色</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                {
                                    style.titleBgColorType === 1 ?
                                        <Form.Item label="颜色">
                                            <ColorSelect color={titleBgColor} setColor={setColor.bind(this, style, 'titleBgColor1')} />
                                        </Form.Item> :
                                        <>
                                            <Form.Item label="渐变类型">
                                                <Radio.Group value={style.gradientType} onChange={changeDetailData.bind(this, 1, style, 'gradientType')}>
                                                    <Radio.Button value={1}>线性渐变</Radio.Button>
                                                    <Radio.Button value={2}>径向渐变</Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>
                                            {
                                                style.gradientType === 1 &&
                                                <Form.Item label="渐变角度">
                                                    <Slider min={0} max={180} value={style.gradientDeg} onChange={changeDetailData.bind(this, 2, style, 'gradientDeg')} />
                                                </Form.Item>
                                            }
                                            {titleBgColor.map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <Tag>
                                                            <Tooltip title="背景是渐变色，至少有两种颜色">
                                                                颜色{index + 1}
                                                                <Icon type="close" onClick={this.deleteColor.bind(this, titleBgColor, index)} />
                                                            </Tooltip>
                                                        </Tag>
                                                        <Form.Item label="颜色">
                                                            <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                                                        </Form.Item>
                                                        <Form.Item label="开始位置">
                                                            <InputNumber value={item.stop} onChange={changeDetailData.bind(this, 2, item, 'stop')} />
                                                        </Form.Item>
                                                    </div>
                                                )
                                            })}
                                            <Button type="dashed" onClick={() => this.addColor(titleBgColor)}>
                                                <Icon type="plus" />添加颜色
                                            </Button>
                                        </>
                                }
                            </Panel>
                        </Collapse>
                    </Form>
                </Panel>
                <Panel header="副标题设置" key="3">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字号">
                            <Input value={style.subTitleFontSize} onChange={changeDetailData.bind(this, 1, style, 'subTitleFontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色" >
                            <ColorSelect color={style.subTitleColor} setColor={setColor.bind(this, style, 'subTitleColor')} />
                        </Form.Item>
                        <Form.Item label="字重">
                            <Radio.Group value={style.subTitleFontWeight} onChange={changeDetailData.bind(this, 1, style, 'subTitleFontWeight')}>
                                <Radio.Button value={200}>细</Radio.Button>
                                <Radio.Button value={400}>普通</Radio.Button>
                                <Radio.Button value={600}>粗</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="键名" >
                            <Input value={style.subTitleKey} onChange={changeDetailData.bind(this, 1, style, 'subTitleKey')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="图片列表设置" key="4">
                    <Form {...formItemLayout24}>
                        <Form.Item label="列表键名">
                            <Input value={style.imgListKey} onChange={changeDetailData.bind(this, 1, style, 'imgListKey')} />
                        </Form.Item>
                        <Form.Item label="宽度">
                            <Input value={style.imgListWidth} onChange={changeDetailData.bind(this, 1, style, 'imgListWidth')} />
                        </Form.Item>
                        <Form.Item label="高度">
                            <Input value={style.imgListHeight} onChange={changeDetailData.bind(this, 1, style, 'imgListHeight')} />
                        </Form.Item>
                        <Collapse>
                            <Panel header="自动滚动设置" key="1">
                                <Form {...formItemLayout24}>
                                    <Form.Item label="是否开启">
                                        <Switch checked={style.imgListAutoMove}
                                            onChange={changeDetailData.bind(this, 2, style, 'imgListAutoMove')} />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title="自动滚动时间间隔，单位毫秒。">
                                                时间间隔*
                                            </Tooltip>
                                        }
                                    >
                                        <Input value={style.imgListInterval} onChange={changeDetailData.bind(this, 1, style, 'imgListInterval')} />
                                    </Form.Item>
                                </Form>
                            </Panel>
                        </Collapse>
                    </Form>
                </Panel>
                <Panel header="内容设置" key="5">
                    <Form {...formItemLayout24}>
                        <Form.Item label="字号">
                            <Input value={style.contentFontSize} onChange={changeDetailData.bind(this, 1, style, 'contentFontSize')} />
                        </Form.Item>
                        <Form.Item label="文字颜色" >
                            <ColorSelect color={style.subTitleColor} setColor={setColor.bind(this, style, 'contentColor')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <InputNumber value={style.contentLineHeight} onChange={changeDetailData.bind(this, 2, style, 'contentLineHeight')} />
                        </Form.Item>
                        <Form.Item label="键名">
                            <Input value={style.contentKey} onChange={changeDetailData.bind(this, 1, style, 'contentKey')} />
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
