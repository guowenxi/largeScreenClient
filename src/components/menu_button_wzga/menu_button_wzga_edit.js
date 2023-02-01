import React from 'react';
import { Form, Input, InputNumber, Collapse, Radio, Button, Icon, Slider, Tag, Switch } from 'antd';
import { addListItem, changeDetailData, deleteListItem, setColor, selectIcon, selectIconOk, selectIconCancel, iconClick } from "../../common/editUtil";
import { getColorList } from "../../common/nameNumEditUtil";
import ColorSelect from "../../common/colorSelect";
import { fileUrl } from "../../config";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;
export default class MenuButtonWZGAEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorList = getColorList.bind(this);
        this.itemData = { name: '', pageId: '', subList: [] };
        this.itemSubData = { name: '', pageId: '' };
        this.colorItem = { color: '#000', percent: 100 };
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
        if (style.item) {

        }
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础设置" key="1">
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="项内边距">
                            <Input value={style.itemPadding} onChange={changeDetailData.bind(this, 1, style, 'itemPadding')} />
                        </Form.Item>
                        <Form.Item label="字体颜色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="选中字体颜色">
                            <ColorSelect color={style.selectFontColor} setColor={setColor.bind(this, style, 'selectFontColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="具体项设置" key="2">
                        <Form.Item label="当前页图片" >
                            {
                                style.backgroundImg ? (
                                    <img src={fileUrl + '/download/' + style.backgroundImg} alt=""
                                        style={{ width: '104px', height: '104px' }}
                                        onClick={selectIcon.bind(this, style, 'backgroundImg')} />
                                ) : (
                                        <Button type="dashed"
                                            onClick={selectIcon.bind(this, style, 'backgroundImg')}>
                                            <Icon type="plus" /> 选择图标
                                        </Button>
                                    )
                            }
                        </Form.Item>
                        <Form.Item label="其他页图片" >
                            {
                                style.indexBackgroundImg ? (
                                    <img src={fileUrl + '/download/' + style.indexBackgroundImg} alt=""
                                        style={{ width: '104px', height: '104px' }}
                                        onClick={selectIcon.bind(this, style, 'indexBackgroundImg')} />
                                ) : (
                                        <Button type="dashed"
                                            onClick={selectIcon.bind(this, style, 'indexBackgroundImg')}>
                                            <Icon type="plus" /> 选择图标
                                        </Button>
                                    )
                            }
                        </Form.Item>
                        <Form.Item label="内边距">
                            <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                        </Form.Item>
                        {style.menuList.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.menuList, index)}>
                                        {'项' + (index + 1)}
                                    </Tag>
                                    <Form.Item label="名称">
                                        <Input value={item.name} onChange={changeDetailData.bind(this, 1, item, 'name')} />
                                    </Form.Item>
                                    <Form.Item label="页面类型" >
                                        <Radio.Group value={item.contentType} onChange={changeDetailData.bind(this, 1, item, 'contentType')}>
                                            <Radio.Button value="system">本系统</Radio.Button>
                                            <Radio.Button value="other">其他系统</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label={item.contentType === 'other' ? '页面地址' : '页面id'}>
                                        <Input value={item.pageId} onChange={changeDetailData.bind(this, 1, item, 'pageId')} />
                                    </Form.Item>
                                    <Form.Item label="跳转方式" >
                                        <Radio.Group value={item.changeType} onChange={changeDetailData.bind(this, 1, item, 'changeType')}>
                                            <Radio.Button value={1}>页面跳转</Radio.Button>
                                            <Radio.Button value={2}>软件切换</Radio.Button>
                                            <Radio.Button value={3}>新窗口</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    {item.changeType === 2 && (
                                        <Form.Item label="内核类型" >
                                            <Radio.Group value={item.coreType} onChange={changeDetailData.bind(this, 1, item, 'coreType')}>
                                                <Radio.Button value={1}>ie内核</Radio.Button>
                                                <Radio.Button value={0}>谷歌内核</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                    )}
                                    <Form.Item label="含副项">
                                        <Switch checked={item.hasSub} onChange={changeDetailData.bind(this, 2, item, 'hasSub')} />
                                    </Form.Item>
                                    {item.hasSub && (
                                        <Collapse>
                                            <Panel header="副项设置" key="5">
                                                {item.subList.map((subItem, subIndex) => {
                                                    return (
                                                        <div key={subIndex}>
                                                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item.subList, subIndex)}>
                                                                {'副项' + (subIndex + 1)}
                                                            </Tag>
                                                            <Form.Item label="名称">
                                                                <Input value={subItem.name} onChange={changeDetailData.bind(this, 1, subItem, 'name')} />
                                                            </Form.Item>
                                                            <Form.Item label="页面类型" >
                                                                <Radio.Group value={subItem.contentType} onChange={changeDetailData.bind(this, 1, subItem, 'contentType')}>
                                                                    <Radio.Button value="system">本系统</Radio.Button>
                                                                    <Radio.Button value="other">其他系统</Radio.Button>
                                                                </Radio.Group>
                                                            </Form.Item>
                                                            <Form.Item label={subItem.contentType === 'other' ? '页面地址' : '页面id'}>
                                                                <Input value={subItem.pageId} onChange={changeDetailData.bind(this, 1, subItem, 'pageId')} />
                                                            </Form.Item>
                                                        </div>
                                                    )
                                                })}
                                                <Form.Item label="">
                                                    <Button type="dashed" onClick={addListItem.bind(this, item, 'subList', this.itemSubData)}>
                                                        <Icon type="plus" /> 添加副项
                                                    </Button>
                                                </Form.Item>
                                            </Panel>
                                        </Collapse>
                                    )}
                                </div>
                            )
                        })}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'menuList', this.itemData)}>
                                <Icon type="plus" /> 添加项设置
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header={"分割线"} key="8">
                        <Form.Item label="线宽">
                            <Input value={style.lineWidth} onChange={changeDetailData.bind(this, 1, style, 'lineWidth')} />
                        </Form.Item>
                        <Form.Item label="旋转角度">
                            <Slider
                                min={0}
                                max={360}
                                onChange={changeDetailData.bind(this, 2, style, 'rotate')}
                                value={style.rotate}
                                step={1}
                            />
                        </Form.Item>
                        <Form.Item label="渐变类型" >
                            <Radio.Group value={style.lineGradientType} onChange={changeDetailData.bind(this, 1, style, 'lineGradientType')}>
                                <Radio.Button value="radial">径向</Radio.Button>
                                <Radio.Button value="linear">线性</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {style.lineGradientType === 'linear' && (
                            <Form.Item label="渐变角度">
                                <Slider defaultValue={180} max={180} min={0} value={style.lineAngle} onChange={changeDetailData.bind(this, 2, style, 'lineAngle')} />
                            </Form.Item>
                        )}
                        <Form.Item label="项间线长">
                            <InputNumber value={style.splitLineLong} onChange={changeDetailData.bind(this, 2, style, 'splitLineLong')} />
                        </Form.Item>
                        {this.getColorList(style.lineColor)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'lineColor', this.colorItem)}>
                                <Icon type="plus" /> 添加颜色
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="下划线设置" key="9">
                        <Form.Item label="下划线" >
                            <Radio.Group value={style.underlineShow} onChange={changeDetailData.bind(this, 1, style, 'underlineShow')}>
                                <Radio value={1}>显示</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="类型" style={{ display: style.underlineShow === 1 ? 'block' : 'none' }}>
                            <Radio.Group value={style.underlineStyle} onChange={changeDetailData.bind(this, 1, style, 'underlineStyle')} >
                                <Radio value={1}>类型一</Radio>
                                <Radio value={2}>类型二</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Collapse style={{ marginBottom: '1vh' }}>
                            <Panel header="项背景设置" key="1">
                                <Form.Item label="渐变角度">
                                    <Slider defaultValue={180} max={180} min={0} value={style.angle} onChange={changeDetailData.bind(this, 2, style, 'angle')} />
                                </Form.Item>
                                {this.getColorList(style.boxColor)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'boxColor', {})}>
                                        <Icon type="plus" /> 添加颜色
                                            </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Panel>
                    <Panel header="其他设置" key="3">
                        <Form.Item label="websocketId">
                            <Input value={style.websocketId} onChange={changeDetailData.bind(this, 1, style, 'websocketId')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
                <FileSelect
                    title="图标选择"
                    visible={this.state.visible}
                    onOk={selectIconOk.bind(this)}
                    onCancel={selectIconCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    imgSelect={iconClick.bind(this)} token={this.props.token}
                    width={650}
                />
            </Form>
        );
    }
}
