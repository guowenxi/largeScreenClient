import React from 'react';
import { Form, Input, InputNumber, Collapse, Switch, Tooltip, Icon, Slider, Tag, Button,Radio } from 'antd';
import ColorSelect from "../../common/colorSelect";
import { changeDetailData, selectIcon, selectIconOk, selectIconCancel, iconClick, addListItem, setColor } from "../../common/editUtil";
import { fileUrl } from "../../config";
import FileSelect from "../../common/fileSelect";
import { getColorList } from "../../common/nameNumEditUtil";

const formItemLayout24 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const { Panel } = Collapse;

export default class EchartsPieListEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorList = getColorList.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    changeDetailData(type, item, key, event) {
        this.props.saveNowDataToHistory();
        let editData = type === 1 ? event.target.value : event;
        item[key] = editData;
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    //修改颜色
    setColor(item, key, data) {
        this.props.saveNowDataToHistory();
        const rgb = data.rgb;
        item[key] = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    addColor(item, type) {
        this.props.saveNowDataToHistory();
        if (type === 1) {
            item.push('#0ff');
        } else {
            item.push({
                start: 'red',
                end: 'blue'
            });
        }
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    deleteColor(item, index) {
        this.props.saveNowDataToHistory();
        item.splice(index, 1);
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    //删除列表内某项
    deleteColumn(list, index) {
        this.props.saveNowDataToHistory();
        list.splice(index, 1);
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }

    // 添加列
    addColumn(list) {
        this.props.saveNowDataToHistory();
        list.push({ color: [], labelLine: { lineStyle: {} }, label: {}, itemStyle: {}, linearColor: [] });
        let thisData = { ...this.props.data };
        this.props.updateData(thisData);
    }



    render() {
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="列基础设置" key="9">
                        <Form {...formItemLayout24}>
                            <Form.Item label="列数">
                                <InputNumber value={style.columnNum} onChange={changeDetailData.bind(this, 2, style, 'columnNum')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='列之间的空隙，单位为%（组件宽度的百分比）。'>
                                        列空隙*
                                </Tooltip>
                                }
                            >
                                <InputNumber value={style.columnGap} onChange={changeDetailData.bind(this, 2, style, 'columnGap')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title='行之间的空隙，单位为%（组件高度的百分比）。'>
                                        行空隙*
                                </Tooltip>
                                }
                            >
                                <InputNumber value={style.rowGap} onChange={changeDetailData.bind(this, 2, style, 'rowGap')} />
                            </Form.Item>
                            <Form.Item label="阴影颜色">
                                <ColorSelect color={style.shadowColor} setColor={this.setColor.bind(this, style, 'shadowColor')} />
                            </Form.Item>
                            <Form.Item label="背景图">
                                {
                                    style.backgroundImg ? (
                                        <img src={fileUrl + '/download/' + style.backgroundImg} alt=""
                                            style={{ width: '104px', height: '104px' }}
                                            onClick={selectIcon.bind(this, style, 'backgroundImg')} />
                                    ) : (
                                            <Button type="dashed"
                                                onClick={selectIcon.bind(this, style, 'backgroundImg')}>
                                                <Icon type="plus" /> 选择图标
                                            </Button>
                                        )
                                }
                            </Form.Item>
                            <Form.Item label="最大值设置">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, style, 'numType')} value={style.numType}>
                                    <Radio value={1}>总数</Radio>
                                    <Radio value={2}>最大值</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Form>
                    </Panel>
                    <Panel header="图表样式" key="6">
                        {style.series.map((item, index) =>
                            <Form {...formItemLayout24} key={index}>
                                <Tag closable={style.series.length > 1} visible={true}
                                    onClose={this.deleteColumn.bind(this, style.series, index)}>
                                    {'项' + (index + 1)}</Tag>
                                <Collapse >
                                    <Panel header="圆环填充色设置" key="1">
                                        <Form.Item label="渐变角度">
                                            <Slider defaultValue={90} max={90} min={0} value={item.angle} onChange={changeDetailData.bind(this, 2, item, 'angle')} />
                                        </Form.Item>
                                        {this.getColorList(item.fillColor)}
                                        <Form.Item label="">
                                            <Button type="dashed" onClick={addListItem.bind(this, item, 'fillColor', {})}>
                                                <Icon type="plus" /> 添加颜色
                                        </Button>
                                        </Form.Item>
                                    </Panel>
                                    <Panel header="其他样式设置" key="2">
                                        <Form.Item label="内半径">
                                            <Slider defaultValue={60} max={100} min={0} value={item.minRadius} onChange={changeDetailData.bind(this, 2, item, 'minRadius')} />
                                        </Form.Item>
                                        <Form.Item label="外半径">
                                            <Slider defaultValue={80} max={100} min={0} value={item.maxRadius} onChange={changeDetailData.bind(this, 2, item, 'maxRadius')} />
                                        </Form.Item>
                                        <Form.Item label="环背景色">
                                            <ColorSelect color={item.bgColor} setColor={setColor.bind(this, item, 'bgColor')} />
                                        </Form.Item>
                                        <Form.Item label="环阴影">
                                            <ColorSelect color={item.shadowColor} setColor={setColor.bind(this, item, 'shadowColor')} />
                                        </Form.Item>
                                        <Form.Item label="线宽">
                                            <InputNumber value={item.lineWidth} onChange={changeDetailData.bind(this, 2, item, 'lineWidth')} />
                                        </Form.Item>
                                        <Form.Item label="线颜色">
                                            <ColorSelect color={item.lineColor} setColor={setColor.bind(this, item, 'lineColor')} />
                                        </Form.Item>
                                    </Panel>
                                </Collapse>
                                <Form.Item label="图标显示">
                                    <Switch checked={item.imgShow} onChange={this.changeDetailData.bind(this, 2, item, 'imgShow')} />
                                </Form.Item>
                                <Form.Item label="标题图标" style={{
                                    display: item.imgShow ? 'block' : 'none',
                                    marginBottom: '0px'
                                }}>
                                    {
                                        item.icon ? (
                                            <img src={fileUrl + '/download/' + item.icon} alt=""
                                                style={{ width: '104px', height: '104px' }}
                                                onClick={selectIcon.bind(this, item, 'icon')} />
                                        ) : (
                                                <Button type="dashed"
                                                    onClick={selectIcon.bind(this, item, 'icon')}>
                                                    <Icon type="plus" /> 选择图标
                                                </Button>
                                            )
                                    }
                                </Form.Item>
                                <Form.Item label="图标宽" style={{ display: item.imgShow ? 'block' : 'none' }}>
                                    <Input value={item.titleImgWidth} onChange={this.changeDetailData.bind(this, 1, item, 'titleImgWidth')} />
                                </Form.Item>
                            </Form>

                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={this.addColumn.bind(this, style.series)}>
                                <Icon type="plus" /> 添加列
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="数据设置" key="8">
                        <Form {...formItemLayout24}>
                            <Form.Item label="显示">
                                <Switch checked={style.numShow} onChange={this.changeDetailData.bind(this, 2, style, 'numShow')} />
                            </Form.Item>
                            <Form.Item label="标题字号">
                                <Input value={style.numSize} onChange={this.changeDetailData.bind(this, 1, style, 'numSize')} />
                            </Form.Item>
                            <Form.Item label="标题字色">
                                <ColorSelect color={style.numColor} setColor={this.setColor.bind(this, style, 'numColor')} />
                            </Form.Item>
                            <Form.Item label="左">
                                <Input value={style.numLeft} onChange={this.changeDetailData.bind(this, 1, style, 'numLeft')} />
                            </Form.Item>
                            <Form.Item label="上">
                                <Input value={style.numTop} onChange={this.changeDetailData.bind(this, 1, style, 'numTop')} />
                            </Form.Item>
                        </Form>
                    </Panel>
                    <Panel header="标题设置" key="10">
                        <Form {...formItemLayout24}>
                            <Form.Item label="显示">
                                <Switch checked={style.titleShow} onChange={this.changeDetailData.bind(this, 2, style, 'titleShow')} />
                            </Form.Item>
                            <Form.Item label="左">
                                <Input value={style.titleLeft} onChange={this.changeDetailData.bind(this, 1, style, 'titleLeft')} />
                            </Form.Item>
                            <Form.Item label="上">
                                <Input value={style.titleTop} onChange={this.changeDetailData.bind(this, 1, style, 'titleTop')} />
                            </Form.Item>
                            <Form.Item label="标题字号">
                                <Input value={style.titleSize} onChange={this.changeDetailData.bind(this, 1, style, 'titleSize')} />
                            </Form.Item>
                            <Form.Item label="标题字色">
                                <ColorSelect color={style.titleColor} setColor={this.setColor.bind(this, style, 'titleColor')} />
                            </Form.Item>
                            <Form.Item label="标题行高">
                                <InputNumber value={style.titleHeight} onChange={this.changeDetailData.bind(this, 2, style, 'titleHeight')} />
                            </Form.Item>
                        </Form>
                    </Panel>
                </Collapse>
                <FileSelect
                    title="图标选择"
                    visible={this.state.visible}
                    onOk={selectIconOk.bind(this)}
                    onCancel={selectIconCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    imgSelect={iconClick.bind(this)} token={this.props.token}
                    width={650}
                />
            </Form>
        );
    }
}
