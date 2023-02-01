import React from 'react';
import {Form, Input, Collapse} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {changeDetailData, setColor} from "../../common/editUtil";

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const {Panel} = Collapse;

export default class OrderListEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    getItemSet(item){
        return (
            <div>
                <Form.Item  label="键名">
                    <Input value={item.key} onChange={changeDetailData.bind(this, 1, item, 'key')} />
                </Form.Item>
                <Form.Item  label="字号">
                    <Input value={item.size} onChange={changeDetailData.bind(this, 1, item, 'size')} />
                </Form.Item>
                <Form.Item  label="行高">
                    <Input value={item.lineHeight} onChange={changeDetailData.bind(this, 1, item, 'lineHeight')} />
                </Form.Item>
                <Form.Item  label="字色">
                    <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')}/>
                </Form.Item>
            </div>
        );
    }

    render() {
        const {style} = this.props.data;
        if(style.title == null){
            style.title = {};
        }
        if(style.content == null){
            style.content = {};
        }
        const {title,content} = style;
        return (
            <Form {...formItemLayout}>
                <Collapse>
                    <Panel header="基础样式设置" key="1">
                        <Form.Item label="背景色">
                            <ColorSelect color={style.bgColor} setColor={setColor.bind(this, style, 'bgColor')}/>
                        </Form.Item>
                        <Form.Item label="内容背景">
                            <ColorSelect color={style.bgColorContent} setColor={setColor.bind(this, style, 'bgColorContent')}/>
                        </Form.Item>
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="标题" key="2">
                        {this.getItemSet(title)}
                    </Panel>
                    <Panel header="内容" key="3">
                        {this.getItemSet(content)}
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
