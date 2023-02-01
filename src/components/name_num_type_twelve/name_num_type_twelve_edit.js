import React from 'react';
import {Form, Input, InputNumber, Collapse, Tooltip, Tag, Radio, Button, Icon, Row, Col} from 'antd';
import {
    addListItem,
    changeDetailData, deleteListItem, setColor,
} from "../../common/editUtil";
import {getBaseEdit, getColorSet} from "../../common/nameNumEditUtil";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class NameNumTypeTwelveEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible:false};
        this.getBaseEdit = getBaseEdit.bind(this);
        this.getColorSet = getColorSet.bind(this);
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
                    <Panel header={"列表基础设置"} key="1">
                        {this.getBaseEdit(style)}
                    </Panel>
                    <Panel header={"列表项内容设置"} key="2">
                        <Form.Item label={<Tooltip title='单位em。'>项内边距*</Tooltip>} >
                            <InputNumber value={style.padding} onChange={changeDetailData.bind(this, 2, style, 'padding')} />
                        </Form.Item>
                        {style.contentList && style.contentList.map((item,index) =>
                            <div key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.contentList, index)}>{'内容' + (index + 1)}</Tag>
                                <Form.Item label="内容类型" >
                                    <Radio.Group value={item.contentType} onChange={changeDetailData.bind(this, 1, item, 'contentType')}>
                                        <Radio.Button value="icon">图标</Radio.Button>
                                        <Radio.Button value="text">文字</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="图标类型" style={{display: item.contentType !== 'icon' ? 'none':''}}>
                                    <Radio.Group value={item.iconType} onChange={changeDetailData.bind(this, 1, item, 'iconType')}>
                                        <Radio.Button value="rect1">三角1</Radio.Button>
                                        <Radio.Button value="rect2">三角2</Radio.Button>
                                        <Radio.Button value="circle">圆圈</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="内容键名" style={{display: item.contentType !== 'text' ? 'none':''}}>
                                    <Input value={item.key} onChange={changeDetailData.bind(this, 1, item, 'key')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位%。'>宽*</Tooltip>} >
                                    <InputNumber value={item.width} onChange={changeDetailData.bind(this, 2, item, 'width')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位%。'>高*</Tooltip>} >
                                    <InputNumber value={item.height} onChange={changeDetailData.bind(this, 2, item, 'height')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位%。'>左*</Tooltip>} >
                                    <InputNumber value={item.left} onChange={changeDetailData.bind(this, 2, item, 'left')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位%。'>上*</Tooltip>} >
                                    <InputNumber value={item.top} onChange={changeDetailData.bind(this, 2, item, 'top')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位em。'>{item.contentType !== 'icon' ? '字号':'图标大小'}*</Tooltip>} >
                                    <InputNumber value={item.fontSize} onChange={changeDetailData.bind(this, 2, item, 'fontSize')} />
                                </Form.Item>
                                <Form.Item label="圆线宽" style={{display: item.iconType !== 'circle' ? 'none':''}}>
                                    <InputNumber min={1} max={100} value={item.strokeWidth} onChange={changeDetailData.bind(this, 2, item, 'strokeWidth')} />
                                </Form.Item>
                                <Form.Item label="水平位置">
                                    <Radio.Group value={item.justifyContent} onChange={changeDetailData.bind(this, 1, item, 'justifyContent')}>
                                        <Radio.Button value="flex-start">居左</Radio.Button>
                                        <Radio.Button value="center">居中</Radio.Button>
                                        <Radio.Button value="flex-end">居右</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="垂直位置">
                                    <Radio.Group value={item.alignItems} onChange={changeDetailData.bind(this, 1, item, 'alignItems')}>
                                        <Radio.Button value="flex-start">居上</Radio.Button>
                                        <Radio.Button value="center">居中</Radio.Button>
                                        <Radio.Button value="flex-end">居下</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="颜色类型">
                                    <Radio.Group value={item.fontColorType} onChange={changeDetailData.bind(this, 1, item, 'fontColorType')}>
                                        <Radio value={1}>统一色</Radio>
                                        <Radio value={2}>根据字段不同值不同色</Radio>
                                        <Radio value={3}>根据序号不同值不同色</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label={item.contentType !== 'icon' ? '字色':'颜色'} style={{display:item.fontColorType !== 1 ? 'none':''}}>
                                    <ColorSelect color={item.fontColor} setColor={setColor.bind(this, item, 'fontColor')} />
                                </Form.Item>
                                <Form.Item label="依据字段" style={{display:item.fontColorType !== 2 ? 'none':''}}>
                                    <Input value={item.fontColorKey} onChange={changeDetailData.bind(this, 1, item, 'fontColorKey')} />
                                </Form.Item>
                                {this.getColorSet(item.fontColorList,(item.fontColorType-1),item.fontColorType === 1 ? 'none':'')}
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed"
                                    onClick={addListItem.bind(this,style,'contentList',{fontColorList:[]})}>
                                <Icon type="plus"/> 添加内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header={"图形边框设置"} key="3">
                        <Form.Item label={
                            <span>
                                <Tooltip title="点击添加">
                                    <Icon type="plus" style={{cursor:'pointer',marginRight:'0.5vh'}} onClick={addListItem.bind(this,style,'colorList','')}/>
                                </Tooltip>
                                颜色
                            </span>
                        }>
                            <Row>
                                {style.colorList && style.colorList.map((thisColor,index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{marginTop:'5px'}} color={thisColor} setColor={setColor.bind(this, style.colorList, index)} />
                                        <Icon type="close" style={{position:'absolute',top:'12px',marginLeft:'0.5vh',cursor:'pointer'}} onClick={deleteListItem.bind(this, style.colorList, index)}/>
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位px。'>边框线宽*</Tooltip>} >
                            <InputNumber value={style.borderWidth} onChange={changeDetailData.bind(this, 2, style, 'borderWidth')} />
                        </Form.Item>
                        <Form.Item label="线类型" >
                            <Radio.Group value={style.borderStyle} onChange={changeDetailData.bind(this, 1, style, 'borderStyle')}>
                                <Radio.Button value="solid">实线</Radio.Button>
                                <Radio.Button value="dashed">虚线1</Radio.Button>
                                <Radio.Button value="dotted">虚线2</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
