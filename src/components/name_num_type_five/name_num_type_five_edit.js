import React from 'react';
import {Form, Input, InputNumber, Collapse, Tooltip, Tag, Radio, Button, Icon} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {
    addListItem,
    changeDetailData, deleteListItem, getItemInteractEdit,
    setColor,
} from "../../common/editUtil";

const { Panel } = Collapse;

export default class NameNumTypeFiveEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getItemInteractEdit = getItemInteractEdit.bind(this);
        this.itemData = {titleSize:'1.5vh',titleColor:'rgba(0,163,253)',numSize:'5vh',numColor:'rgba(249,162,22,1)',numBgColor:'rgba(249,162,22,0.2)',numBgLength:5,numType:2,unitSize:'3vh',unitColor:'#0ff',unit:'件'};
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
                    <Panel header="具体项样式设置" key="2">
                        {style.itemList.map((item,index) => {
                            return (
                                <div key={index}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.itemList, index)}>
                                        {'项' + (index + 1)}
                                    </Tag>
                                    <Form.Item label="标题字号">
                                        <Input value={item.titleSize} onChange={changeDetailData.bind(this, 1, item, 'titleSize')} />
                                    </Form.Item>
                                    <Form.Item label="标题字色">
                                        <ColorSelect color={item.titleColor} setColor={setColor.bind(this, item, 'titleColor')} />
                                    </Form.Item>
                                    <Form.Item label="数字字体">
                                        <Radio.Group value={item.numType} onChange={changeDetailData.bind(this, 1, item, 'numType')}>
                                            <Radio value={1}>普通字体</Radio>
                                            <Radio value={2}>液晶数字字体</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="数字字号">
                                        <Input value={item.numSize} onChange={changeDetailData.bind(this, 1, item, 'numSize')} />
                                    </Form.Item>
                                    <Form.Item label="数字字色">
                                        <ColorSelect color={item.numColor} setColor={setColor.bind(this, item, 'numColor')} />
                                    </Form.Item>
                                    <Form.Item label="背景字色" style={{display:item.numType === 1 ? 'none':''}}>
                                        <ColorSelect color={item.numBgColor} setColor={setColor.bind(this, item, 'numBgColor')} />
                                    </Form.Item>
                                    <Form.Item label="背景字数" style={{display:item.numType === 1 ? 'none':''}}>
                                        <InputNumber value={item.numBgLength} onChange={changeDetailData.bind(this, 2, item, 'numBgLength')} />
                                    </Form.Item>
                                    <Form.Item label="单位">
                                        <Input value={item.unit} onChange={changeDetailData.bind(this, 1, item, 'unit')} />
                                    </Form.Item>
                                    <Form.Item label="单位字号">
                                        <Input value={item.unitSize} onChange={changeDetailData.bind(this, 1, item, 'unitSize')} />
                                    </Form.Item>
                                    <Form.Item label="单位字色">
                                        <ColorSelect color={item.unitColor} setColor={setColor.bind(this, item, 'unitColor')} />
                                    </Form.Item>
                                </div>
                            )
                        })}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'itemList',this.itemData)}>
                                <Icon type="plus"/> 添加项设置
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="数据键名设置" key="3">
                        <Form.Item
                            label={
                                <Tooltip title='默认为name'>
                                    标题键名*
                                </Tooltip>
                            }
                        >
                            <Input value={style.titleKey} onChange={changeDetailData.bind(this, 1, style, 'titleKey')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='默认为num'>
                                    值键名*
                                </Tooltip>
                            }
                        >
                            <Input value={style.numKey} onChange={changeDetailData.bind(this, 1, style, 'numKey')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="各项交互内容设置" key="6">
                        {this.getItemInteractEdit(style)}
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
