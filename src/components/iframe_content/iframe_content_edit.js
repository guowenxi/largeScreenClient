import React from 'react';
import {Form, Input, InputNumber, Collapse, Switch, Radio, Tooltip, Button, Icon} from 'antd';
import {
    addListItem,
    changeDetailData, getInteractEdit,
    iconClick,
    selectIcon,
    selectIconCancel,
    selectIconOk
} from "../../common/editUtil";
import {fileUrl} from "../../config";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;

export default class IframeContentEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getInteractEdit = getInteractEdit.bind(this);
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
                    <Panel header="登录配置" key="4">
                        <Form.Item label="是否需要">
                            <Switch checked={style.needLogin} onChange={changeDetailData.bind(this, 2, style, 'needLogin')}/>
                        </Form.Item>
                        <Form.Item label="登录接口">
                            <Input value={style.loginUrl} onChange={changeDetailData.bind(this, 1, style, 'loginUrl')} />
                        </Form.Item>
                        <Form.Item label="账号键名">
                            <Input value={style.userNameKey} onChange={changeDetailData.bind(this, 1, style, 'userNameKey')} />
                        </Form.Item>
                        <Form.Item label="密码键名">
                            <Input value={style.passwordKey} onChange={changeDetailData.bind(this, 1, style, 'passwordKey')} />
                        </Form.Item>
                        <Form.Item label="账号">
                            <Input value={style.userName} onChange={changeDetailData.bind(this, 1, style, 'userName')} />
                        </Form.Item>
                        <Form.Item label="密码">
                            <Input value={style.password} onChange={changeDetailData.bind(this, 1, style, 'password')} />
                        </Form.Item>
                        <Form.Item label="数据键名">
                            <Input value={style.tokenDataKey} onChange={changeDetailData.bind(this, 1, style, 'tokenDataKey')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="基础配置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="隐藏时加载">
                            <Switch checked={style.hideLoad} onChange={changeDetailData.bind(this, 2, style, 'hideLoad')}/>
                        </Form.Item>
                        <Form.Item label="内容链接">
                            <Input value={style.src} onChange={changeDetailData.bind(this, 1, style, 'src')} />
                        </Form.Item>
                        <Form.Item label="是否带token">
                            <Switch checked={style.token} onChange={changeDetailData.bind(this, 2, style, 'token')}/>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='token携带方式。方式一为：url?token=xxx，方式2为：url/xxx'>
                                    携带方式*
                                </Tooltip>
                            }
                        >
                            <Radio.Group value={style.tokenType} onChange={changeDetailData.bind(this, 1, style, 'tokenType')}>
                                <Radio value={1}>?</Radio>
                                <Radio value={2}>/</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.token && style.tokenType === 1 && (
                            <Form.Item label="token键名">
                                <Input value={style.tokenKey} onChange={changeDetailData.bind(this, 1, style, 'tokenKey')} />
                            </Form.Item>
                        )}
                        <Form.Item label="清空统计">
                            <Switch checked={style.clearParams} onChange={changeDetailData.bind(this, 2, style, 'clearParams')}/>
                        </Form.Item>
                    </Panel>
                    <Panel header="返回/关闭按钮配置" key="2">
                        <Form.Item label="是否显示">
                            <Switch checked={style.iconShow} onChange={changeDetailData.bind(this, 2, style, 'iconShow')}/>
                        </Form.Item>
                        <Form.Item label="按钮图标" >
                            {
                                style.icon ? (
                                    <img alt="选择图标" onClick={selectIcon.bind(this, style, 'icon')} src={fileUrl + '/download/' + style.icon} style={{height:'4vh'}} />
                                ) : (
                                    <Button type="dashed" onClick={selectIcon.bind(this, style, 'icon')} >
                                        <Icon type="plus" /> 选择图标
                                    </Button>
                                )
                            }
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>宽*</Tooltip>} >
                            <InputNumber value={style.iconWidth} onChange={changeDetailData.bind(this, 2, style, 'iconWidth')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>高*</Tooltip>} >
                            <InputNumber value={style.iconHeight} onChange={changeDetailData.bind(this, 2, style, 'iconHeight')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>左*</Tooltip>} >
                            <InputNumber value={style.iconLeft} onChange={changeDetailData.bind(this, 2, style, 'iconLeft')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>右*</Tooltip>} >
                            <InputNumber value={style.iconRight} onChange={changeDetailData.bind(this, 2, style, 'iconRight')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>上*</Tooltip>} >
                            <InputNumber value={style.iconTop} onChange={changeDetailData.bind(this, 2, style, 'iconTop')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>下*</Tooltip>} >
                            <InputNumber value={style.iconBottom} onChange={changeDetailData.bind(this, 2, style, 'iconBottom')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="按钮点击交互" key="3">
                        {this.getInteractEdit(style.iconInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'iconInteract', {})}>
                                <Icon type="plus" /> 添加交互内容
                            </Button>
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
