import React from 'react';
import {Form, Input, Collapse, Tag, Button, Radio, Icon, Tooltip, InputNumber} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {
    addListItemWithoutKey,
    changeDetailData,
    deleteListItem, iconClick,
    selectIcon, selectIconCancel, selectIconOk
} from "../../common/editUtil";
import {fileUrl} from "../../config";
import cssStyle from "../name_num_type_seven/name_num_type_seven.module.css";
import FileSelect from "../../common/fileSelect";

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const {Panel} = Collapse;

export default class NameNumTypeNineEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.iconItem = {num: 1, icon: '', color: "#ffffff"};
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

    // 添加列
    addColumn(list) {
        this.props.saveNowDataToHistory();
        list.push({});
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    // 删除列
    deleteColumn(list, index) {
        this.props.saveNowDataToHistory();
        list.splice(index, 1);
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    getIconSet(list, display) {
        return (
            <Collapse style={{display, marginBottom: '20px'}}>
                <Panel header="图标列表" key="1">
                    {list.map((item, index) =>
                        <div key={index}>
                            <Tag closable={true} visible={true}
                                 onClose={deleteListItem.bind(this, list, index)}>{'列' + (index + 1)}</Tag>
                            <Form.Item label="图标">
                                {
                                    item.icon ? (
                                        <img alt="" onClick={selectIcon.bind(this, item, 'icon')}
                                             src={fileUrl + '/download/' + item.icon} className={cssStyle.iconEdit}/>
                                    ) : (
                                        <Button type="dashed" onClick={selectIcon.bind(this, item, 'icon')}>
                                            <Icon type="plus"/> 选择图标
                                        </Button>
                                    )
                                }
                            </Form.Item>
                            <Form.Item label="颜色">
                                <ColorSelect color={item.color}
                                             setColor={this.setDetailColor.bind(this, item, 'color')}/>
                            </Form.Item>
                        </div>
                    )}
                    <Form.Item label="">
                        <Button type="dashed"
                                onClick={addListItemWithoutKey.bind(this, list, this.iconItem)}>
                            <Icon type="plus"/> 添加图标设置
                        </Button>
                    </Form.Item>
                </Panel>
            </Collapse>
        );
    }

    render() {
        const {style} = this.props.data;
        const {icon} = style;
        return (
            <Form {...formItemLayout}>
                <Collapse>
                    <Panel header="基本设置" key="1">
                        <Form.Item label="列数">
                            <InputNumber value={style.columnNum}
                                         onChange={changeDetailData.bind(this, 2, style, 'columnNum')}/>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='列之间的空隙，单位为%（组件宽度的百分比）。'>列空隙*</Tooltip>}>
                            <InputNumber value={style.columnGap}
                                         onChange={changeDetailData.bind(this, 2, style, 'columnGap')}/>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='行之间的空隙，单位为%（组件高度的百分比）。'>行空隙*</Tooltip>}>
                            <InputNumber value={style.rowGap}
                                         onChange={changeDetailData.bind(this, 2, style, 'rowGap')}/>
                        </Form.Item>
                        <Form.Item label="背景颜色">
                            <ColorSelect color={this.props.data.style.backgroundColor}
                                         setColor={this.setColor.bind(this, 'backgroundColor')}/>
                        </Form.Item>
                        <Form.Item label="边框颜色">
                            <ColorSelect color={this.props.data.style.borderColor}
                                         setColor={this.setColor.bind(this, 'borderColor')}/>
                        </Form.Item>
                    </Panel>
                    <Panel header="标题" key="2">
                        <Form.Item label="上边距*">
                            <Input value={style.titleTop} onChange={changeDetailData.bind(this, 1, style, 'titleTop')} />
                        </Form.Item>
                        <Form.Item label="左边距*">
                            <Input value={style.titleLeft} onChange={changeDetailData.bind(this, 1, style, 'titleLeft')} />
                        </Form.Item>
                        <Form.Item label="字号大小">
                            <Input value={this.props.data.style.titleFontSize}
                                   onChange={this.changeViewData.bind(this, 2, 'style', 'titleFontSize')}/>
                        </Form.Item>
                    </Panel>
                    <Panel header="内容" key="3">
                        <Form.Item label="排列方向">
                            <Radio.Group value={style.flexDirection}
                                         onChange={changeDetailData.bind(this, 1, style, 'flexDirection')}>
                                <Radio value={'row'}>水平方向</Radio>
                                <Radio value={'column'}>垂直方向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label={
                            <Tooltip title='单位为%（组件宽的百分比）。'>
                                内容宽度
                            </Tooltip>
                        }>
                            <InputNumber value={style.contentWidth} min={0} max={100}
                                         onChange={changeDetailData.bind(this, 2, style, 'contentWidth')}/>
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位为%（组件高的百分比）。'>内容高度</Tooltip>}>
                            <InputNumber value={style.contentHeight} min={0} max={100}
                                         onChange={changeDetailData.bind(this, 2, style, 'contentHeight')}/>
                        </Form.Item>
                        <Form.Item label="上边距*">
                            <Input value={style.contentTop} onChange={changeDetailData.bind(this, 1, style, 'contentTop')} />
                        </Form.Item>
                        <Form.Item label="左边距*">
                            <Input value={style.contentLeft} onChange={changeDetailData.bind(this, 1, style, 'contentLeft')} />
                        </Form.Item>
                        <Form.Item label="字号大小">
                            <Input value={this.props.data.style.contentFontSize}
                                   onChange={this.changeViewData.bind(this, 2, 'style', 'contentFontSize')}/>
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={this.props.data.style.contentColor}
                                         setColor={this.setColor.bind(this, 'contentColor')}/>
                        </Form.Item>
                    </Panel>
                    <Panel header="图标" key="4">
                        <Form.Item label="上边距*">
                            <Input value={icon.top} onChange={changeDetailData.bind(this, 1, icon, 'top')} />
                        </Form.Item>
                        <Form.Item label="左边距*">
                            <Input value={icon.left} onChange={changeDetailData.bind(this, 1, icon, 'left')} />
                        </Form.Item>
                        <Form.Item label="图标宽度">
                            <Input value={icon.width} onChange={changeDetailData.bind(this, 1, icon, 'width')}/>
                        </Form.Item>
                        <Form.Item label="图标高度">
                            <Input value={icon.height} onChange={changeDetailData.bind(this, 1, icon, 'height')}/>
                        </Form.Item>
                        {this.getIconSet(style.icon.iconList)}
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
