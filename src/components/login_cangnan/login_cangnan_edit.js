import React from 'react';
import {Form, Input, Collapse, Select, Tag, Button, Icon, Radio, Tooltip} from 'antd';
import {addListItem, changeDetailData, deleteListItem} from "../../common/editUtil";

const { Panel } = Collapse;

export default class LoginCangnanEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.colorItem = {color:'#000',percent:100};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    getGotoEdit(style){
        return (
            <React.Fragment >
                <Form.Item label="依据键名" >
                    <Input value={style.key} onChange={changeDetailData.bind(this, 1, style, 'key')} />
                </Form.Item>
                <Collapse style={{marginBottom:'1vh'}}>
                    <Panel header="具体跳转设置" key="1">
                        {style.pageList && style.pageList.map((item,index) =>
                            <React.Fragment key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.pageList, index)}>{'具体设置' + (index + 1)}</Tag>
                                <Form.Item label="值" >
                                    <Radio.Group onChange={changeDetailData.bind(this, 1, item, 'valueType')} value={item.valueType}>
                                        <Radio value={'1'}>空</Radio>
                                        <Radio value={'2'}>非空</Radio>
                                        <Radio value={'equal'}>
                                            等于<Input value={item.value} onChange={changeDetailData.bind(this, 1, item, 'value')}/>
                                        </Radio>
                                        <Radio value={'notEqual'}>
                                            不等于<Input value={item.value} onChange={changeDetailData.bind(this, 1, item, 'value')}/>
                                        </Radio>
                                        <Radio value={'like'}>
                                            包含<Input value={item.value} onChange={changeDetailData.bind(this, 1, item, 'value')}/>
                                        </Radio>
                                        <Radio value={'others'}>其他</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="跳转页面">
                                    <Input value={item.pageId} onChange={changeDetailData.bind(this, 1, item, 'pageId')} />
                                </Form.Item>
                                <Form.Item label={"携带token"} >
                                    <Radio.Group value={item.withToken} onChange={changeDetailData.bind(this, 1, item, 'withToken')} defaultValue={1}>
                                        <Radio value={1}>携带(默认)</Radio>
                                        <Radio value={2}>不携带</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </React.Fragment>
                        )}
                        <Form.Item label="" style={{margin:'1vh'}}>
                            <Button type="dashed"
                                    onClick={addListItem.bind(this, style, 'pageList', {})}>
                                <Icon type="plus" /> 添加具体设置
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </React.Fragment>
        );
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
                    <Panel header="内容设置" key="1">
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')}/>
                        </Form.Item>
                        <Form.Item label="页面内容">
                            <Select value={style.areaName} onChange={changeDetailData.bind(this, 2, style, 'areaName')}>
                                <Select.Option value={'cangnan'} >苍南</Select.Option>
                                <Select.Option value={'longgang'} >龙港</Select.Option>
                                <Select.Option value={'yongjia'} >永嘉</Select.Option>
                                <Select.Option value={'ruian'} >瑞安</Select.Option>
                                <Select.Option value={'lucheng'} >鹿城</Select.Option>
                                <Select.Option value={'yueqing'} >乐清</Select.Option>
                                <Select.Option value={'wzjb'} >温州警保</Select.Option>
                                <Select.Option value={'wencheng'}>文成</Select.Option>
                                <Select.Option value={'longwan'}>龙湾</Select.Option>
                                <Select.Option value={'tzmzx'}>民转刑</Select.Option>
                            </Select>
                        </Form.Item>
                        {style.areaName === 'tzmzx' && (
                            <React.Fragment>
                                <Form.Item label="背景图">
                                    <Select value={style.bgImg} onChange={changeDetailData.bind(this, 2, style, 'bgImg')}>
                                        <Select.Option value={1} >默认</Select.Option>
                                        <Select.Option value={2} >防疫</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="标题名称">
                                    <Input value={style.titleText} onChange={changeDetailData.bind(this, 1, style, 'titleText')}/>
                                </Form.Item>
                                <Form.Item label="标题字号">
                                    <Input value={style.titleSize} onChange={changeDetailData.bind(this, 1, style, 'titleSize')}/>
                                </Form.Item>
                            </React.Fragment>
                        )}
                        <Form.Item label="用户键名">
                            <Input value={style.userName} onChange={changeDetailData.bind(this, 1, style, 'userName')} />
                        </Form.Item>
                        <Form.Item label="密码键名">
                            <Input value={style.password} onChange={changeDetailData.bind(this, 1, style, 'password')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title="当用户输入框未输入时显示此文本">用户框占位符*</Tooltip>}>
                            <Input value={style.namePlaceholder} onChange={changeDetailData.bind(this, 1, style, 'namePlaceholder')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title="当密码输入框未输入时显示此文本">密码框占位符*</Tooltip>}>
                            <Input value={style.passwordPlaceholder} onChange={changeDetailData.bind(this, 1, style, 'passwordPlaceholder')} />
                        </Form.Item>
                        <Form.Item label="登录接口">
                            <Input value={style.reportUrl} onChange={changeDetailData.bind(this, 1, style, 'reportUrl')} />
                        </Form.Item>
                        <Form.Item label={"跳转类型"} >
                            <Radio.Group value={style.gotoType} onChange={changeDetailData.bind(this, 1, style, 'gotoType')} defaultValue={1}>
                                <Radio value={1}>固定跳转页</Radio>
                                <Radio value={2}>不同值不同跳转页</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.gotoType !== 2 ? (
                            <>
                                <Form.Item label="跳转页面">
                                    <Input value={style.pageId} onChange={changeDetailData.bind(this, 1, style, 'pageId')} />
                                </Form.Item>
                                <Form.Item label={"携带token"} >
                                    <Radio.Group value={style.withToken} onChange={changeDetailData.bind(this, 1, style, 'withToken')} defaultValue={1}>
                                        <Radio value={1}>携带(默认)</Radio>
                                        <Radio value={2}>不携带</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </>
                        ):this.getGotoEdit(style)}
                    </Panel>
                    <Panel header="加密设置" key="2">
                        <Form.Item label={"跳转类型"} >
                            <Radio.Group value={style.encryption} onChange={changeDetailData.bind(this, 1, style, 'encryption')} >
                                <Radio value={0}>不加密(默认)</Radio>
                                <Radio value={1}>AES</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.encryption === 1 && (
                            <React.Fragment>
                                <Form.Item label="key">
                                    <Input value={style.aesKey} onChange={changeDetailData.bind(this, 1, style, 'aesKey')} />
                                </Form.Item>
                                <Form.Item label="iv">
                                    <Input value={style.aesIv} onChange={changeDetailData.bind(this, 1, style, 'aesIv')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                    </Panel>
                    {style.areaName === 'tzmzx' && (
                        <Panel header="浙政钉扫码" key="3">
                            <Form.Item label="应用标识">
                                <Input value={style.clientId} onChange={changeDetailData.bind(this, 1, style, 'clientId')} />
                            </Form.Item>
                            <Form.Item label="回调地址">
                                <Input value={style.redirectUri} onChange={changeDetailData.bind(this, 1, style, 'redirectUri')} />
                            </Form.Item>
                            <Form.Item label="corpid">
                                <Input value={style.corpid} onChange={changeDetailData.bind(this, 1, style, 'corpid')} />
                            </Form.Item>
                            {/*<Form.Item label="dingId">*/}
                            {/*    <Input value={style.dingId} onChange={changeDetailData.bind(this, 1, style, 'dingId')} />*/}
                            {/*</Form.Item>*/}
                        </Panel>
                    )}
                </Collapse>
            </Form>
        );
    }
}
