import React from 'react';
import {Form, Input, InputNumber, Collapse, Tooltip, Tag, Button, Icon} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {changeDetailData, setColor} from "../../common/editUtil";
import {getColorSet, getItemStyleEdit} from "../../common/nameNumEditUtil";
import {fileUrl} from "../../config";
import FileSelect from "../../common/fileSelect";

const {Panel} = Collapse;

export default class NameNumWithChartEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorSet = getColorSet.bind(this);
        this.getItemStyleEdit = getItemStyleEdit.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    // 添加列
    addColumn(list) {
        this.props.saveNowDataToHistory();
        // list.push({});
        list.push("");
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
        // this.editItem[this.editIndex][this.editKey] = this.selectedImg;
        this.editItem[this.editIndex] = this.selectedImg;
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
        this.setState({visible: false});
    }

    //取消选择
    handleCancel() {
        this.setState({visible: false});
    }

    //删除列表内某项
    deleteList(list, index) {
        this.props.saveNowDataToHistory();
        list.splice(index, 1);
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const {style} = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse>
                    <Panel header="基本样式" key="1">
                        <Form.Item label="标题文本">
                            <Input value={style.titleText}
                                   onChange={changeDetailData.bind(this, 1, style, 'titleText')}/>
                        </Form.Item>
                        <Form.Item label="计数单位">
                            <Input value={style.unit} onChange={changeDetailData.bind(this, 1, style, 'unit')}/>
                        </Form.Item>
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')}/>
                        </Form.Item>
                        <Form.Item label="字体颜色">
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')}/>
                        </Form.Item>
                        <Form.Item label="列数">
                            <InputNumber value={style.columnNum} min={0} max={100}
                                         onChange={changeDetailData.bind(this, 2, style, 'columnNum')}/>
                        </Form.Item>
                        <Form.Item label={
                            <Tooltip title='单位为%（组件宽的百分比）。'>
                                列间距
                            </Tooltip>
                        }>
                            <InputNumber value={style.columnGap} min={0} max={100}
                                         onChange={changeDetailData.bind(this, 2, style, 'columnGap')}/>
                        </Form.Item>
                    </Panel>
                    <Panel header="图标设置" key="2">
                        <Form.Item label="图标大小">
                            <Input value={style.iconSize} onChange={changeDetailData.bind(this, 1, style, 'iconSize')}/>
                        </Form.Item>
                        {style.icon.map((item, index) =>
                            <div key={index} style={{marginBottom: '24px'}}>
                                <Tag closable={style.icon.length > 1} visible={true}
                                     onClose={this.deleteColumn.bind(this, style.icon, index)}>
                                    {'项' + (index + 1)}</Tag>
                                <Form.Item label="图标" style={{marginBottom: '0px'}}>
                                    {
                                        item ? (
                                            <img src={fileUrl + '/download/' + item} alt=""
                                                 style={{width: '104px', height: '104px'}}
                                                 onClick={this.selectIcon.bind(this, style.icon, index, 'icon')}/>
                                        ) : (
                                            <Button type="dashed"
                                                    onClick={this.selectIcon.bind(this, style.icon, index, 'icon')}>
                                                <Icon type="plus"/> 选择图标
                                            </Button>
                                        )
                                    }
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item {...formItemLayout24} label="">
                            <Button type="dashed" onClick={this.addColumn.bind(this, style.icon)}>
                                <Icon type="plus"/> 添加列
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
            </Form>
        );
    }
}
