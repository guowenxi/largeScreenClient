import React from 'react';
import {Form, Input, Collapse, Button, Tag, Icon, Switch} from 'antd';
import FileSelect from "../../common/fileSelect";
import {addListItem, changeDetailData, getInteractEdit, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const {Panel} = Collapse;

export default class OrderListEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getInteractEdit = getInteractEdit.bind(this);
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

    changeDetailData(type, item, key, event) {
        this.props.saveNowDataToHistory();
        item[key] = type === 1 ? event.target.value : event;
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

    //选择图标素材弹框
    selectIcon(item, index, key) {
        this.editItem = item;
        this.editIndex = index;
        this.editKey = key;
        this.setState({visible: true});
    }

    // 添加列
    addColumn(list) {
        this.props.saveNowDataToHistory();
        list.push({});
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    //删除列表内某项
    deleteColumn(list, index) {
        this.props.saveNowDataToHistory();
        list.splice(index, 1);
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    //暂存选中的图标素材
    imgSelect(id) {
        this.selectedImg = id;
    }

    //确定选中图标素材
    handleOk() {
        this.props.saveNowDataToHistory();
        this.editItem[this.editIndex][this.editKey] = this.selectedImg;
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
        this.setState({visible: false});
    }

    //取消选择
    handleCancel() {
        this.setState({visible: false});
    }

    render() {
        const {style} = this.props.data;
        return (
            <Form {...formItemLayout}>
                <Collapse>
                    <Panel header="选项设置" key="1">
                        <Form.Item label="是否显示">
                            <Switch checked={style.hasSearch} onChange={changeDetailData.bind(this, 2, style, 'hasSearch')}/>
                        </Form.Item>
                        {style.hasSearch && style.typeList.map((item, index) =>
                            <div key={index} style={{marginBottom: '24px'}}>
                                <Tag closable={style.typeList.length > 1} visible={true}
                                     onClose={this.deleteColumn.bind(this, style.typeList, index)}>
                                    {'搜索项' + (index + 1)}</Tag>
                                <Form.Item label="展示名">
                                    <Input value={item.name}
                                           onChange={this.changeDetailData.bind(this, 1, item, 'name')}/>
                                </Form.Item>
                                <Form.Item label="筛选值">
                                    <Input value={item.value}
                                           onChange={this.changeDetailData.bind(this, 1, item, 'value')}/>
                                </Form.Item>
                                <Form.Item label="筛选字段">
                                    <Input value={item.key}
                                           onChange={this.changeDetailData.bind(this, 1, item, 'key')}/>
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item label="" style={{display:!style.hasSearch ? 'none':''}}>
                            <Button type="dashed" onClick={this.addColumn.bind(this, style.typeList)}>
                                <Icon type="plus"/> 添加列
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="更多设置" key="2">
                        <Form.Item label="是否显示">
                            <Switch checked={style.hasMore} onChange={changeDetailData.bind(this, 2, style, 'hasMore')}/>
                        </Form.Item>
                        {this.getInteractEdit(style.moreInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'moreInteract',{})}>
                                <Icon type="plus"/> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="其他设置" key="3">
                        <Form.Item label="标题">
                            <Input value={style.title}
                                   onChange={this.changeDetailData.bind(this, 1, style, 'title')}/>
                        </Form.Item>
                        <Form.Item label="字色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="内容键名">
                            <Input value={style.nameKey} onChange={changeDetailData.bind(this, 1, style, 'nameKey')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
                <FileSelect
                    title="图标选择"
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    imgSelect={this.imgSelect.bind(this)} token={this.props.token}
                    width={650}
                />
            </Form>
        );
    }
}
