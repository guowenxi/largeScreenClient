import React from 'react';
import {Form, Input, Collapse, Tooltip} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {
    changeDetailData,
    setColor, getItemInteractEdit
} from "../../common/editUtil";

const { Panel } = Collapse;

export default class NameNumTypeTwoEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.columnsItem = {align:'left',title:'',dataIndex:'',sorter:false,width:'',filterOpen:false,filterType:1,filterUrl:'',filtersJson:'',filterMultiple:true,colorType:1,calculateType:1,calculateList:[]};
        this.calculateItem = {value:'',more:0,less:100,color:'#fff'};
        this.getItemInteractEdit = getItemInteractEdit.bind(this);
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
                <Panel header="头部标题样式" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字号">
                            <Input value={style.topTitleSize} onChange={changeDetailData.bind(this, 1, style, 'topTitleSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.topTitleColor} setColor={setColor.bind(this, style, 'topTitleColor')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="突出值样式" key="2">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字号">
                            <Input value={style.bigNumSize} onChange={changeDetailData.bind(this, 1, style, 'bigNumSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.bigNumColor} setColor={setColor.bind(this, style, 'bigNumColor')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="内容标题样式" key="3">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字号">
                            <Input value={style.itemTitleSize} onChange={changeDetailData.bind(this, 1, style, 'itemTitleSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.itemTitleColor} setColor={setColor.bind(this, style, 'itemTitleColor')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="内容值样式" key="4">
                    <Form {...formItemLayout24} >
                        <Form.Item label="字号">
                            <Input value={style.smallNumSize} onChange={changeDetailData.bind(this, 1, style, 'smallNumSize')} />
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.smallNumColor} setColor={setColor.bind(this, style, 'smallNumColor')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="数据键名设置" key="5">
                    <Form {...formItemLayout24} >
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
                    </Form>
                </Panel>
                <Panel header="各项交互内容设置" key="6">
                    <Form {...formItemLayout24} >
                        {this.getItemInteractEdit(style)}
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
