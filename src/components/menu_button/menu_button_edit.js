import React from 'react';
import {Form, Input, Collapse, Tag, Button, Icon, Switch, Tooltip, Row, Col, Select, Radio} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {
    addListItem,
    changeDetailData, deleteListItem,
    setColor,
} from "../../common/editUtil";

const { Panel } = Collapse;

export default class MenuButtonEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.itemData = {name:'',pageId:'',subList:[]};
        this.itemSubData = {showList:[],hideList:[]};
        this.layerIdItem = '';
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
                    <Panel header="基层样式设置" key="1">
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字体颜色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="头部隐藏">
                            <Switch checked={style.hideHead} onChange={changeDetailData.bind(this, 2, style, 'hideHead')}/>
                        </Form.Item>
                        <Form.Item label="选择常显">
                            <Switch checked={style.showList} onChange={changeDetailData.bind(this, 2, style, 'showList')}/>
                        </Form.Item>
                    </Panel>
                    <Panel header="具体项设置" key="2">
                        {style.menuList.map((item,index) => {
                            if(item.hasSub && item.subList == null){
                                item.subList = [{showList:[],hideList:[]}];
                            }
                            return (
                                <div key={index}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.menuList, index)}>
                                        {'项' + (index + 1)}
                                    </Tag>
                                    <Form.Item label="常亮" >
                                        <Radio.Group value={item.styleType} onChange={changeDetailData.bind(this, 1, item, 'styleType')}>
                                            <Radio value={1}>一直常亮</Radio>
                                            <Radio value={2}>选中常亮</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="名称">
                                        <Input value={item.name} onChange={changeDetailData.bind(this, 1, item, 'name')} />
                                    </Form.Item>
                                    <Form.Item label="页面类型" >
                                        <Radio.Group value={item.contentType} onChange={changeDetailData.bind(this, 1, item, 'contentType')}>
                                            <Radio.Button value="system">本系统</Radio.Button>
                                            <Radio.Button value="other">其他系统</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label={item.contentType === 'other' ? '页面地址':'页面id'}>
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
                                        <Switch checked={item.hasSub} onChange={changeDetailData.bind(this, 2, item, 'hasSub')}/>
                                    </Form.Item>
                                    {item.hasSub && (
                                        <Collapse >
                                            <Panel header="副项设置" key="1">
                                                {item.subList.map((subItem,subIndex) => {
                                                    return (
                                                        <div key={subIndex}>
                                                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item.subList, subIndex)}>
                                                                {'副项' + (subIndex + 1)}
                                                            </Tag>
                                                            <Form.Item
                                                                label={
                                                                    <span>
                                                                        <Tooltip title="点击添加">
                                                                            <Icon type="plus" style={{cursor:'pointer',marginRight:'0.5vh'}} onClick={addListItem.bind(this,subItem,'showList',this.layerIdItem)}/>
                                                                        </Tooltip>
                                                                        <Tooltip title="点击后需要显示的图层">
                                                                            显示*
                                                                        </Tooltip>
                                                                    </span>
                                                                }
                                                            >
                                                                {
                                                                    subItem.showList == null ? '' : (
                                                                        subItem.showList.map((item,showIndex) =>
                                                                            <Row key={showIndex} gutter={[20, 24]}>
                                                                                <Col span={18} >
                                                                                    <Select value={item}
                                                                                            onChange={changeDetailData.bind(this, 2, subItem.showList, showIndex)}>
                                                                                        {this.props.layerList.map((layer) =>
                                                                                            <Select.Option value={layer.id} key={layer.id}>{layer.name}</Select.Option>
                                                                                        )}
                                                                                    </Select>
                                                                                </Col>
                                                                                <Col span={4} >
                                                                                    <Icon type="close" />
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    )
                                                                }
                                                            </Form.Item>
                                                            <Form.Item
                                                                label={
                                                                    <span>
                                                                        <Tooltip title="点击添加">
                                                                            <Icon type="plus" style={{cursor:'pointer',marginRight:'0.5vh'}} onClick={addListItem.bind(this,subItem,'hideList',this.layerIdItem)}/>
                                                                        </Tooltip>
                                                                        <Tooltip title="点击后需要隐藏的图层">
                                                                            隐藏*
                                                                        </Tooltip>
                                                                    </span>
                                                                }
                                                            >
                                                                {
                                                                    subItem.hideList == null ? '' : (
                                                                        subItem.hideList.map((item,showIndex) =>
                                                                            <Row key={showIndex} gutter={[20, 24]}>
                                                                                <Col span={18} >
                                                                                    <Select value={item}
                                                                                            onChange={changeDetailData.bind(this, 2, subItem.hideList, showIndex)}>
                                                                                        {this.props.layerList.map((layer) =>
                                                                                            <Select.Option value={layer.id} key={layer.id}>{layer.name}</Select.Option>
                                                                                        )}
                                                                                    </Select>
                                                                                </Col>
                                                                                <Col span={4} >
                                                                                    <Icon type="close" onClick={deleteListItem.bind(this, subItem.hideList, showIndex)}/>
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    )
                                                                }
                                                            </Form.Item>
                                                        </div>
                                                    )
                                                })}
                                                <Form.Item label="">
                                                    <Button type="dashed" onClick={addListItem.bind(this,item,'subList',this.itemSubData)}>
                                                        <Icon type="plus"/> 添加副项
                                                    </Button>
                                                </Form.Item>
                                            </Panel>
                                        </Collapse>
                                    )}
                                </div>
                            )
                        })}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'menuList',this.itemData)}>
                                <Icon type="plus"/> 添加项设置
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="其他设置" key="3">
                        <Form.Item label="websocketId">
                            <Input value={style.websocketId} onChange={changeDetailData.bind(this, 1, style, 'websocketId')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
