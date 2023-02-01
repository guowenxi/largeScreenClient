import React from 'react';
import {Form, Input, Collapse, Switch} from 'antd';

const formItemLayout24 = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const { Panel } = Collapse;

export default class AntvPieEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    changeDetailData(type, item, key, event){
        this.props.saveNowDataToHistory();
        let editData = type === 1 ? event.target.value : event;
        item[key] = editData;
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    //修改颜色
    setColor(item, key, data) {
        this.props.saveNowDataToHistory();
        const rgb = data.rgb;
        item[key] = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+rgb.a+')';
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    addColor(item,type){
        this.props.saveNowDataToHistory();
        if(type === 1){
            item.push('#0ff');
        }else{
            item.push({
                start:'red',
                end:'blue'
            });
        }
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    deleteColor(item,index){
        this.props.saveNowDataToHistory();
        item.splice(index,1);
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    render() {
        const {style} = this.props.data;
        const {label} = style;
        const {tooltip} = style;
        return (
            <Collapse >
                <Panel header="文本" key="3">
                    <Form {...formItemLayout24}>
                        <Form.Item label="偏移量">
                            <Input value={label.offset} onChange={this.changeDetailData.bind(this, 1, label, 'offset')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="标注" key="4">
                    <Form {...formItemLayout24}>
                        <Form.Item label="是否显示">
                            <Switch checked={tooltip.show} onChange={this.changeDetailData.bind(this, 2, tooltip, 'show')}/>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
