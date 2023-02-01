import React from 'react';
import {Form, Input, Button, Icon, Collapse, Tag} from 'antd';

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const {Panel} = Collapse;

export default class NavigationPageEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    //修改位置大小样式
    changeViewData(type, keyOne, keyTwo, event) {
        this.props.saveNowDataToHistory();
        let thisData = {...this.props.data};
        if (type === 1) {
            thisData[keyOne] = event.target.value;
        } else if (type === 2) {
            thisData[keyOne][keyTwo] = event.target.value;
        }
        this.props.updateData(thisData);
    }

    changeDetailData(item, key, event) {
        this.props.saveNowDataToHistory();
        item[key] = event.target.value;
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    //修改颜色
    setColor(type, data) {
        this.props.saveNowDataToHistory();
        let thisData = {...this.props.data};
        const rgb = data.rgb;
        thisData.style[type] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        this.props.updateData(thisData);
    }

    setDetailColor(item, key, data) {
        this.props.saveNowDataToHistory();
        const rgb = data.rgb;
        item[key] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    // 添加标题
    addColumn(list) {
        this.props.saveNowDataToHistory();
        list.push({});
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    // 删除标题
    deleteColumn(list, index) {
        this.props.saveNowDataToHistory();
        list.splice(index, 1);
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    render() {
        const {style} = this.props.data;
        return (
            <Collapse>
                <Panel header="内容设置" key="1">
                    {style.stateList.map((item, index) =>
                        <div key={index} style={{marginBottom: '24px'}}>
                            <Tag closable={style.stateList.length > 1} visible={true}
                                 onClose={this.deleteColumn.bind(this, style.stateList, index)}>
                                {'导航' + (index + 1)}</Tag>
                            <Form.Item {...formItemLayout} label="跳转地址">
                                <Input value={item.url} onChange={this.changeDetailData.bind(this, item, 'url')}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="展示文字">
                                <Input value={item.text} onChange={this.changeDetailData.bind(this, item, 'text')}/>
                            </Form.Item>
                        </div>
                    )}
                    <Form.Item {...formItemLayout} label="">
                        <Button type="dashed" onClick={this.addColumn.bind(this, style.stateList)}>
                            <Icon type="plus"/> 添加导航
                        </Button>
                    </Form.Item>
                </Panel>
            </Collapse>
        );
    }
}
