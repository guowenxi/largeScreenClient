import React from 'react';
import {Form, Collapse, Button, Icon, Tooltip, Input, Switch, Radio} from 'antd';
import {changeDetailData, iconClick, selectIcon, selectIconCancel, selectIconOk, setColor} from "../../common/editUtil";
import {fileUrl} from "../../config";
import cssStyle from "../name_num_type_seven/name_num_type_seven.module.css";
import FileSelect from "../../common/fileSelect";
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class ImageEdit extends React.Component {
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
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础配置" key="1">
                        <Form.Item label="是否拉伸">
                            <Radio.Group onChange={changeDetailData.bind(this, 1, style, 'sizeType')} value={style.sizeType}>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.sizeType === 2 && (
                            <React.Fragment>
                                <Form.Item label="水平位置">
                                    <Radio.Group value={style.justifyContent} onChange={changeDetailData.bind(this, 1, style, 'justifyContent')}>
                                        <Radio value="flex-start">居左</Radio>
                                        <Radio value="center">居中</Radio>
                                        <Radio value="flex-end">居右</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="垂直位置">
                                    <Radio.Group value={style.alignItems} onChange={changeDetailData.bind(this, 1, style, 'alignItems')}>
                                        <Radio value="flex-start">居上</Radio>
                                        <Radio value="center">居中</Radio>
                                        <Radio value="flex-end">居下</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </React.Fragment>
                        )}
                        <Form.Item label="图片" >
                            {
                                style.icon ? (
                                    <img alt="" onClick={selectIcon.bind(this,style,'icon')} src={fileUrl + '/download/' + style.icon} className={cssStyle.iconEdit}/>
                                ) : (
                                    <Button type="dashed" onClick={selectIcon.bind(this,style,'icon')} >
                                        <Icon type="plus" /> 选择图标
                                    </Button>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="背景颜色">
                            <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item label="阴影颜色">
                            <ColorSelect color={style.shadowColor} setColor={setColor.bind(this, style, 'shadowColor')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='阴影水平偏移距离'>
                                    水平偏移*
                                </Tooltip>
                            }
                        >
                            <Input value={style.shadowLeft} onChange={changeDetailData.bind(this, 1, style, 'shadowLeft')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='阴影垂直偏移距离'>
                                    垂直偏移*
                                </Tooltip>
                            }
                        >
                            <Input value={style.shadowTop} onChange={changeDetailData.bind(this, 1, style, 'shadowTop')} />
                        </Form.Item>
                        <Form.Item label="模糊距离" >
                            <Input value={style.blur} onChange={changeDetailData.bind(this, 1, style, 'blur')} />
                        </Form.Item>
                        <Form.Item label="阴影大小" >
                            <Input value={style.spread} onChange={changeDetailData.bind(this, 1, style, 'spread')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="响应设置" key="2">
                        <Form.Item label="缩放响应">
                            <Switch checked={style.scaleAction} onChange={changeDetailData.bind(this, 2, style, 'scaleAction')} />
                        </Form.Item>
                        <Form.Item label="拖动响应">
                            <Switch checked={style.moveAction} onChange={changeDetailData.bind(this, 2, style, 'moveAction')} />
                        </Form.Item>
                        <Form.Item label="忽略响应">
                            <Switch checked={style.ignoreClick} onChange={changeDetailData.bind(this, 2, style, 'ignoreClick')} />
                        </Form.Item>
                    </Panel>
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
                </Collapse>
            </Form>
        );
    }
}
