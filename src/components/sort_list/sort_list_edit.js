import React from 'react';
import {Form, Input, Collapse, Tooltip} from 'antd';
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
                <Form.Item  label="默认字色">
                    <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')}/>
                </Form.Item>
                <Form.Item  label="选中字色">
                    <ColorSelect color={item.colorSelect} setColor={setColor.bind(this, item, 'colorSelect')}/>
                </Form.Item>
            </div>
        );
    }

    render() {
        const {style} = this.props.data;
        if(style.one == null){
            style.one = {};
        }
        if(style.two == null){
            style.two = {};
        }
        const {one,two} = style;
        return (
            <Form {...formItemLayout}>
                <Collapse>
                    <Panel header="基础样式设置" key="1">
                        <Form.Item  label="背景色">
                            <ColorSelect color={style.bgColor} setColor={setColor.bind(this, style, 'bgColor')}/>
                        </Form.Item>
                        <Form.Item  label="行背景色">
                            <ColorSelect color={style.lineBgColor} setColor={setColor.bind(this, style, 'lineBgColor')}/>
                        </Form.Item>
                        <Form.Item  label="选中背景色">
                            <ColorSelect color={style.bgColorSelect} setColor={setColor.bind(this, style, 'bgColorSelect')}/>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="默认为0。支持传入数组分别指定 4 个内边距（顺时针上，右，下，左）。">
                                    内边距*
                                </Tooltip>
                            }
                        >
                            <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="内容项1设置" key="2">
                        {this.getItemSet(one)}
                    </Panel>
                    <Panel header="内容项2设置" key="3">
                        {this.getItemSet(two)}
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
