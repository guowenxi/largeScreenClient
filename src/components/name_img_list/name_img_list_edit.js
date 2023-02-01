import React from 'react';
import {Form, Input, InputNumber, Collapse, Switch, Button, Icon} from 'antd';
import {changeDetailData, iconClick, selectIcon, selectIconCancel, selectIconOk, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import {fileUrl} from "../../config";
import cssStyle from "../name_num_type_seven/name_num_type_seven.module.css";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;

export default class NameImgListEdit extends React.Component {
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
            <Collapse >
                <Panel header="样式设置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <Input value={style.lineHeight} onChange={changeDetailData.bind(this, 1, style, 'lineHeight')} />
                        </Form.Item>
                        <Form.Item label="文字左">
                            <Input value={style.textLeft} onChange={changeDetailData.bind(this, 1, style, 'textLeft')} />
                        </Form.Item>
                        <Form.Item label="文字上">
                            <Input value={style.textTop} onChange={changeDetailData.bind(this, 1, style, 'textTop')} />
                        </Form.Item>
                        <Form.Item label="名称键名">
                            <Input value={style.key} onChange={changeDetailData.bind(this, 1, style, 'key')} />
                        </Form.Item>
                        <Form.Item label="图标" >
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
                        <Form.Item label="图片宽度">
                            <Input value={style.imgWidth} onChange={changeDetailData.bind(this, 1, style, 'imgWidth')} />
                        </Form.Item>
                        <Form.Item label="图片高度">
                            <Input value={style.imgHeight} onChange={changeDetailData.bind(this, 1, style, 'imgHeight')} />
                        </Form.Item>
                        <Form.Item label="图片左">
                            <Input value={style.left} onChange={changeDetailData.bind(this, 1, style, 'left')} />
                        </Form.Item>
                        <Form.Item label="图片上">
                            <Input value={style.top} onChange={changeDetailData.bind(this, 1, style, 'top')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="分页设置" key="2">
                    <Form {...formItemLayout24} >
                        <Form.Item label="含分页">
                            <Switch checked={style.hasPage} onChange={changeDetailData.bind(this, 2, style, 'hasPage')}/>
                        </Form.Item>
                        <Form.Item label="每页条数">
                            <InputNumber value={style.pageSize} onChange={changeDetailData.bind(this, 2, style, 'pageSize')} />
                        </Form.Item>
                        <Form.Item label="分页高度">
                            <Input value={style.pageHeight} onChange={changeDetailData.bind(this, 1, style, 'pageHeight')} />
                        </Form.Item>
                    </Form>
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
        );
    }
}
