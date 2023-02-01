import React from 'react';
import { Form, Input, Button, Radio, Icon, Collapse, Tag,Switch } from 'antd';
import ColorSelect from "../../common/colorSelect";
import FileSelect from "../../common/fileSelect";
import { fileUrl } from "../../config";
import { changeDetailData, setColor } from "../../common/editUtil";

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const { Panel } = Collapse;

export default class TitleMultilevelEdit extends React.Component {
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
        let thisData = { ...this.props.data };
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
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    //修改颜色
    setColor(type, data) {
        this.props.saveNowDataToHistory();
        let thisData = { ...this.props.data };
        const rgb = data.rgb;
        thisData.style[type] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        this.props.updateData(thisData);
    }

    setDetailColor(item, key, data) {
        this.props.saveNowDataToHistory();
        const rgb = data.rgb;
        item[key] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    // 添加标题
    addColumn(list) {
        this.props.saveNowDataToHistory();
        list.push({});
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    // 删除标题
    deleteColumn(list, index) {
        this.props.saveNowDataToHistory();
        list.splice(index, 1);
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    //选择图标素材弹框
    selectIcon(item, index, key) {
        this.editItem = item;
        this.editIndex = index;
        this.editKey = key;
        this.setState({ visible: true });
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
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
        this.setState({ visible: false });
    }

    //取消选择
    handleCancel() {
        this.setState({ visible: false });
    }

    render() {
        const { style } = this.props.data;
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <Form {...formItemLayout24} >
                <Collapse>
                    <Panel header="内容设置" key="1">
                        {style&& style.map((item, index) =>
                            <div key={index} style={{ marginBottom: '24px' }}>
                                <Tag closable={style.length > 1} visible={true}
                                    onClose={this.deleteColumn.bind(this, style, index)}>
                                    {'标题' + (index + 1)}</Tag>
                                <Form.Item {...formItemLayout} label="内容">
                                    <Input value={item.title}
                                        onChange={this.changeDetailData.bind(this, item, 'title')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="项高">
                                    <Input value={item.lineHeight}
                                        onChange={this.changeDetailData.bind(this, item, 'lineHeight')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="字号大小">
                                    <Input value={item.fontSize}
                                        onChange={this.changeDetailData.bind(this, item, 'fontSize')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="字号粗细">
                                    <Radio.Group size="small" value={item.fontWeight}
                                        onChange={this.changeDetailData.bind(this, item, 'fontWeight')}>
                                        <Radio.Button value="bold">更粗</Radio.Button>
                                        <Radio.Button value="normal">正常</Radio.Button>
                                        <Radio.Button value="lighter">更细</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="文字颜色">
                                    <ColorSelect color={item.color}
                                        setColor={this.setDetailColor.bind(this, item, 'color')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="背景">
                                    <Radio.Group size="small" value={item.backgroundType}
                                        onChange={this.changeDetailData.bind(this, item, 'backgroundType')}>
                                        <Radio value={1}>颜色</Radio>
                                        <Radio value={2}>图片</Radio>
                                        <Radio value={3}>svg类型一</Radio>
                                        <Radio value={4}>svg类型二</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                {item.backgroundType===1&&<Form.Item {...formItemLayout} label="背景颜色">
                                    <ColorSelect color={item.backgroundColor}
                                        setColor={this.setDetailColor.bind(this, item, 'backgroundColor')} />
                                </Form.Item>}
                                {item.backgroundType===2&&<Form.Item {...formItemLayout} label="标题图标">
                                    {
                                        item.backgroundImg ? (
                                            <img src={fileUrl + '/download/' + item.backgroundImg} alt=""
                                                style={{ width: '104px', height: '104px' }}
                                                onClick={this.selectIcon.bind(this, item, null, 'backgroundImg')} />
                                        ) : (
                                                <Button type="dashed"
                                                    onClick={this.selectIcon.bind(this, item, null, 'backgroundImg')}>
                                                    <Icon type="plus" /> 选择图标
                                                </Button>
                                            )
                                    }
                                </Form.Item>}
                                <Form.Item {...formItemLayout} label="文字内边距" >
                                    <Input value={item.textPadding}
                                           onChange={this.changeDetailData.bind(this, item, 'textPadding')} />
                                </Form.Item>
                                <Form.Item label="下划线">
                                    <Switch checked={item.showLine}
                                        onChange={changeDetailData.bind(this, 2, item, 'showLine')} />
                                </Form.Item>
                                <Form.Item label="下划线格式" style={{ display: item.showLine ? 'block' : 'none' }}>
                                    <Radio.Group value={item.lineStyle} onChange={changeDetailData.bind(this, 1, item, 'lineStyle')}>
                                        <Radio value={1}>格式一</Radio>
                                        <Radio value={2}>格式二</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="文字框宽度" style={{ display: item.showLine&&item.lineStyle===1? 'block' : 'none' }}>
                                    <Input value={item.textWidth}
                                        onChange={this.changeDetailData.bind(this, item, 'textWidth')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="下划线宽度" style={{ display: item.showLine&&item.lineStyle===1 ? 'block' : 'none' }}>
                                    <Input value={item.lineWidth}
                                        onChange={this.changeDetailData.bind(this, item, 'lineWidth')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="下划线颜色" style={{ display: item.showLine&&item.lineStyle===1 ? 'block' : 'none' }}>
                                    <ColorSelect color={item.lineColor}
                                        setColor={this.setDetailColor.bind(this, item, 'lineColor')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="图标展示">
                                    <Radio.Group value={item.showTitleImg}
                                        onChange={this.changeDetailData.bind(this, item, 'showTitleImg')}>
                                        <Radio value={true}>展示</Radio>
                                        <Radio value={false}>隐藏</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="图标缩进" style={{
                                    display: item.showTitleImg ? 'block' : 'none'
                                }}>
                                    <Input value={item.imgMargin}
                                        onChange={this.changeDetailData.bind(this, item, 'imgMargin')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="图标宽" style={{ display: item.showTitleImg ? 'block' : 'none' }}>
                                    <Input value={item.imgWidth}
                                        onChange={this.changeDetailData.bind(this, item, 'imgWidth')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="图标高" style={{ display: item.showTitleImg ? 'block' : 'none' }}>
                                    <Input value={item.imgHeight}
                                        onChange={this.changeDetailData.bind(this, item, 'imgHeight')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="标题图标" style={{
                                    display: item.showTitleImg ? 'block' : 'none',
                                    marginBottom: '0px'
                                }}>
                                    {
                                        item.titleImg ? (
                                            <img src={fileUrl + '/download/' + item.titleImg} alt=""
                                                style={{ width: '104px', height: '104px' }}
                                                onClick={this.selectIcon.bind(this, item, null, 'titleImg')} />
                                        ) : (
                                                <Button type="dashed"
                                                    onClick={this.selectIcon.bind(this, item, null, 'titleImg')}>
                                                    <Icon type="plus" /> 选择图标
                                                </Button>
                                            )
                                    }
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="图标移动" style={{ display: item.showTitleImg ? 'block' : 'none' }}>
                                    <Radio.Group value={item.moveImg}
                                        onChange={this.changeDetailData.bind(this, item, 'moveImg')}>
                                        <Radio value={true}>是</Radio>
                                        <Radio value={false}>否</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="左" style={{ display: item.moveImg ? 'block' : 'none' }}>
                                    <Input value={item.imgLeft}
                                        onChange={this.changeDetailData.bind(this, item, 'imgLeft')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="上" style={{ display: item.moveImg ? 'block' : 'none' }}>
                                    <Input value={item.imgTop}
                                        onChange={this.changeDetailData.bind(this, item, 'imgTop')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="按钮名称">
                                    <Input value={item.buttonName} onChange={changeDetailData.bind(this, 1, item, 'buttonName')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="按钮字号">
                                    <Input value={item.buttonSize} onChange={changeDetailData.bind(this, 1, item, 'buttonSize')} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label="按钮字色">
                                    <ColorSelect color={item.buttonColor} setColor={setColor.bind(this, item, 'buttonColor')} />
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item {...formItemLayout} label="">
                            <Button type="dashed" onClick={this.addColumn.bind(this, style)}>
                                <Icon type="plus" /> 添加标题
                            </Button>
                        </Form.Item>
                    </Panel>
                    {/* <Panel header='背景图设置' key='2'>
                        <Form.Item {...formItemLayout} label="图标展示">
                            <Radio.Group value={style.showBackgroundPic}
                                onChange={this.changeDetailData.bind(this, style, 'showBackgroundPic')}>
                                <Radio value={true}>展示</Radio>
                                <Radio value={false}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="标题图标" style={{
                            display: style.showBackgroundPic ? 'block' : 'none'
                        }}>
                            {
                                style.backgroundPic ? (
                                    <img src={fileUrl + '/download/' + style.backgroundPic} alt=""
                                        onClick={this.selectIcon.bind(this, style, null, 'backgroundPic')} />
                                ) : (
                                        <Button type="dashed"
                                            onClick={this.selectIcon.bind(this, style, null, 'backgroundPic')}>
                                            <Icon type="plus" /> 选择图标
                                        </Button>
                                    )
                            }
                        </Form.Item>
                    </Panel> */}
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
