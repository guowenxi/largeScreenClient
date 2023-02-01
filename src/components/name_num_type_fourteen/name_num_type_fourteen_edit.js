import React from 'react';
import {Form, Input, InputNumber, Collapse, Tag, Button, Icon, Switch} from 'antd';
import {
    addListItem,
    changeDetailData,
    deleteListItem, iconClick,
    selectIcon,
    selectIconCancel,
    selectIconOk
} from "../../common/editUtil";
import {fileUrl} from "../../config";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;
export default class NameNumTypeFourEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible:false};
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
                    <Panel header="基础内容设置" key="1">
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="键名">
                            <Input value={style.key} onChange={changeDetailData.bind(this, 1, style, 'key')} />
                        </Form.Item>
                        <Form.Item label="隐藏背景">
                            <Switch checked={style.hideBg} onChange={changeDetailData.bind(this, 2, style, 'hideBg')}/>
                        </Form.Item>
                    </Panel>
                    <Panel header="块样式设置" key="2">
                        <Form.Item label="移动动画">
                            <Switch checked={style.move} onChange={changeDetailData.bind(this, 2, style, 'move')}/>
                        </Form.Item>
                        <Form.Item label="宽">
                            <Input value={style.partWidth} onChange={changeDetailData.bind(this, 1, style, 'partWidth')} />
                        </Form.Item>
                        <Form.Item label="高">
                            <Input value={style.partHeight} onChange={changeDetailData.bind(this, 1, style, 'partHeight')} />
                        </Form.Item>
                        {style.partList && style.partList.map((part,index)=>
                            <React.Fragment key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.partList, index)}>{'块' + (index + 1)}</Tag>
                                <Form.Item label="缩放级别">
                                    <InputNumber value={part.scale} onChange={changeDetailData.bind(this, 2, part, 'scale')} />
                                </Form.Item>
                                <Form.Item label="左">
                                    <Input value={part.left} onChange={changeDetailData.bind(this, 1, part, 'left')} />
                                </Form.Item>
                                <Form.Item label="上">
                                    <Input value={part.top} onChange={changeDetailData.bind(this, 1, part, 'top')} />
                                </Form.Item>
                                <Form.Item label="背景图" >
                                    {
                                        part.img ? (
                                            <img alt="背景图" onClick={selectIcon.bind(this, part, 'img')} src={fileUrl + '/download/' + part.img} style={{height:'4vh'}} />
                                        ) : (
                                            <Button type="dashed" onClick={selectIcon.bind(this, part, 'img')} >
                                                <Icon type="plus" /> 选择背景图
                                            </Button>
                                        )
                                    }
                                </Form.Item>
                            </React.Fragment>
                        )}
                        <Form.Item label="" style={{margin:'1vh'}}>
                            <Button type="dashed"
                                    onClick={addListItem.bind(this, style, 'partList', {})}>
                                <Icon type="plus" /> 添加块
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
