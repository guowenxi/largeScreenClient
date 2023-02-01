import React from 'react';
import { Form, Input, Collapse, Tag, Button, Radio, Icon } from 'antd';
import ColorSelect from "../../common/colorSelect";
import { addListItem, changeDetailData, deleteListItem, setColor } from "../../common/editUtil";

const { Panel } = Collapse;
export default class TableBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.itemData = { "title": "" };
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
                    <Panel header="基础设置" key="1">
                        <Form.Item label="字体大小" >
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="标题设置" key="2">
                        <Form.Item label="列标题颜色">
                            <ColorSelect color={style.columnColor} setColor={setColor.bind(this, style, 'columnColor')} />
                        </Form.Item>
                        <Form.Item label="字体粗细">
                            <Radio.Group size="small" value={style.columnWeight}
                                onChange={changeDetailData.bind(this, 1,style, 'columnWeight')}>
                                <Radio.Button value="bold">更粗</Radio.Button>
                                <Radio.Button value="normal">正常</Radio.Button>
                                <Radio.Button value="lighter">更细</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="行标题颜色">
                            <ColorSelect color={style.rowColor} setColor={setColor.bind(this, style, 'rowColor')} />
                        </Form.Item>
                        <Form.Item label="字体粗细">
                            <Radio.Group size="small" value={style.rowWeight}
                                onChange={changeDetailData.bind(this,1 ,style, 'rowWeight')}>
                                <Radio.Button value="bold">更粗</Radio.Button>
                                <Radio.Button value="normal">正常</Radio.Button>
                                <Radio.Button value="lighter">更细</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="行标题宽度" >
                            <Input value={style.rowWidth} onChange={changeDetailData.bind(this, 1, style, 'rowWidth')} />
                        </Form.Item>
                        {style.rowTitleList.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.rowTitleList, index)}>
                                        {'行' + (index + 1)}
                                    </Tag>
                                    <Form.Item label="行名称">
                                        <Input value={item.title} onChange={changeDetailData.bind(this, 1, item, 'title')} />
                                    </Form.Item>
                                </div>
                            )
                        })}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'rowTitleList', this.itemData)}>
                                <Icon type="plus" /> 添加行
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="内容设置" key="3">
                        <Form.Item label="字体大小" >
                            <Input value={style.itemFontSize} onChange={changeDetailData.bind(this, 1, style, 'itemFontSize')} />
                        </Form.Item>
                        <Form.Item label="字体粗细">
                            <Radio.Group size="small" value={style.itemFontWeight}
                                onChange={changeDetailData.bind(this,1, style, 'itemFontWeight')}>
                                <Radio.Button value="bold">更粗</Radio.Button>
                                <Radio.Button value="normal">正常</Radio.Button>
                                <Radio.Button value="lighter">更细</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字体颜色">
                            <ColorSelect color={style.itemColor} setColor={setColor.bind(this, style, 'itemColor')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
