import React from 'react';
import {Form, Input, Collapse, Radio, Button, Tag, Icon, Slider} from 'antd';
import ColorSelect from "../../common/colorSelect";
import FileSelect from "../../common/fileSelect";
import {fileUrl} from "../../config";
import {addListItem, changeDetailData} from "../../common/editUtil";
import {getColorList} from "../../common/nameNumEditUtil";

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const {Panel} = Collapse;

export default class TitleWarningEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorList = getColorList.bind(this);
    }

    componentWillUnmount() {
    }

    componentDidMount() {
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
    setColor(key, data) {
        this.props.saveNowDataToHistory();
        let thisData = {...this.props.data};
        const rgb = data.rgb;
        thisData.style[key] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
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

    //暂存选中的图标素材
    imgSelect(id) {
        this.selectedImg = id;
    }

    //确定选中图标素材
    handleOk() {
        this.props.saveNowDataToHistory();
        if (this.editIndex != null) {
            this.editItem[this.editIndex][this.editKey] = this.selectedImg;
        } else {
            this.editItem[this.editKey] = this.selectedImg;
        }
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
            <div>
                <Collapse>
                    <Panel header="样式设置" key="1">
                        <Form {...formItemLayout}>
                            <Form.Item label="警示图标">
                                {
                                    style.coverImg ? (
                                        <img src={fileUrl + '/download/' + style.coverImg} alt=""
                                             style={{width: '104px', height: '104px'}}
                                             onClick={this.selectIcon.bind(this, style, null, 'coverImg')}/>
                                    ) : (
                                        <Button type="dashed"
                                                onClick={this.selectIcon.bind(this, style, null, 'coverImg')}>
                                            <Icon type="plus"/> 选择图标
                                        </Button>
                                    )
                                }
                            </Form.Item>
                            <Form.Item label="图标宽">
                                <Input value={style.coverWidth} onChange={changeDetailData.bind(this, 1, style, 'coverWidth')} />
                            </Form.Item>
                            <Form.Item label="图标高">
                                <Input value={style.coverHeight} onChange={changeDetailData.bind(this, 1, style, 'coverHeight')} />
                            </Form.Item>
                            <Form.Item label="字体大小">
                                <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                            </Form.Item>
                        </Form>
                    </Panel>
                    <Panel header="内容设置" key="2">
                        {style.list.map((item, index) =>
                            <div key={index} style={{marginBottom: '24px'}}>
                                <Tag closable={style.list.length > 1} visible={true}
                                     onClose={this.deleteColumn.bind(this, style.list, index)}>
                                    {'字段' + (index + 1)}</Tag>
                                <Form.Item {...formItemLayout} label="最大宽度">
                                    <Input value={item.maxWidth} onChange={this.changeDetailData.bind(this, item, 'maxWidth')}/>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="值类型">
                                    <Radio.Group value={item.type} onChange={this.changeDetailData.bind(this, item, 'type')}>
                                        <Radio value={1}>文字</Radio>
                                        <Radio value={2}>键名</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="值或符号">
                                    <Input value={item.key} onChange={this.changeDetailData.bind(this, item, 'key')}/>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="字体颜色">
                                    <ColorSelect color={item.color}
                                                 setColor={this.setDetailColor.bind(this, item, 'color')}/>
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item {...formItemLayout} label="">
                            <Button type="dashed" onClick={this.addColumn.bind(this, style.list)}>
                                <Icon type="plus"/> 添加内容
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="背景设置" key="3">
                        <Form.Item label="渐变角度">
                            <Slider defaultValue={180} max={180} min={0} value={style.angle} onChange={changeDetailData.bind(this, 2, style, 'angle')} />
                        </Form.Item>
                        {this.getColorList(style.boxColor)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this, style, 'boxColor', {})}>
                                <Icon type="plus" /> 添加颜色
                            </Button>
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
            </div>
        );
    }
}
