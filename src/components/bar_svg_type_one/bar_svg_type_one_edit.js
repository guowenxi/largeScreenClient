import React from 'react';
import {Form, Collapse, Input, Tag, Button, Icon} from 'antd';
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

export default class BarSvgTypeOneEdit extends React.Component {
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
                    <Panel header="其他设置" key="1">
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')}/>
                        </Form.Item>
                        <Form.Item label="名称键名">
                            <Input value={style.nameKey} onChange={changeDetailData.bind(this, 1, style, 'nameKey')}/>
                        </Form.Item>
                        <Form.Item label="值键名">
                            <Input value={style.numKey} onChange={changeDetailData.bind(this, 1, style, 'numKey')}/>
                        </Form.Item>
                    </Panel>
                    <Panel header="图标设置" key="2">
                        <Form.Item label="依据字段">
                            <Input value={style.typeKey} onChange={changeDetailData.bind(this, 1, style, 'typeKey')}/>
                        </Form.Item>
                        {style.imageList && style.imageList.map((image,imageIndex) =>
                            <div key={imageIndex}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.imageList, imageIndex)}>
                                    {'图标' + (imageIndex + 1)}
                                </Tag>
                                <Form.Item label="值">
                                    <Input value={image.value} onChange={changeDetailData.bind(this, 1, image, 'value')} />
                                </Form.Item>
                                <Form.Item label="图标">
                                    {
                                        image.url ? (
                                            <img alt="" onClick={selectIcon.bind(this, image, 'url')} src={fileUrl + '/download/' + image.url} style={{width:'100%',height:'10vh'}} />
                                        ) : (
                                            <Button type="dashed" onClick={selectIcon.bind(this, image, 'url')} >
                                                <Icon type="plus" /> 选择图片
                                            </Button>
                                        )
                                    }
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'imageList',{})}>
                                <Icon type="plus"/> 添加内容设置
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
