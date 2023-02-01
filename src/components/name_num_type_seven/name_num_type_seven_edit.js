import React from 'react';
import {Form, Input, InputNumber, Collapse, Tooltip, Tag, Radio, Button, Icon, Switch} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {
    addListItemWithoutKey, selectIcon,
    changeDetailData, deleteListItem,
    setColor, iconClick, selectIconOk, selectIconCancel,
} from "../../common/editUtil";
import FileSelect from "../../common/fileSelect";
import {fileUrl} from "../../config";
import cssStyle from "./name_num_type_seven.module.css";
import {getColorSet} from "../../common/nameNumEditUtil";

const { Panel } = Collapse;

export default class NameNumTypeSevenEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible:false};
        this.colorItemOne = {num:1,color:'rgb(61,219,88)'};
        this.colorItemTwo = {bottom:1,top:2,color:'rgb(61,219,88)'};
        this.iconItem = {num:1,icon:''};
        this.getColorSet = getColorSet.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }


    getIconSet(list,display){
        return (
            <Collapse style={{display,marginBottom: '20px'}}>
                <Panel header="图标列表" key="1">
                    {list.map((item,index) =>
                        <div key={index}>
                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, list, index)}>{'列' + (index + 1)}</Tag>
                            <Form.Item label="值">
                                <Input value={item.num} onChange={changeDetailData.bind(this, 1, item, 'num')} />
                            </Form.Item>
                            <Form.Item label="图标" >
                                {
                                    item.icon ? (
                                        <img alt="" onClick={selectIcon.bind(this,item,'icon')} src={fileUrl + '/download/' + item.icon} className={cssStyle.iconEdit}/>
                                    ) : (
                                        <Button type="dashed" onClick={selectIcon.bind(this,item,'icon')} >
                                            <Icon type="plus" /> 选择图标
                                        </Button>
                                    )
                                }
                            </Form.Item>
                        </div>
                    )}
                    <Form.Item label="">
                        <Button type="dashed"
                                onClick={addListItemWithoutKey.bind(this,list,this.iconItem)}>
                            <Icon type="plus"/> 添加图标设置
                        </Button>
                    </Form.Item>
                </Panel>
            </Collapse>
        );
    }

    getStyleEdit(item){
        return (
            <div>
                <Form.Item label="宽">
                    <Input value={item.width} onChange={changeDetailData.bind(this, 1, item, 'width')} />
                </Form.Item>
                <Form.Item label="键名">
                    <Input value={item.key} onChange={changeDetailData.bind(this, 1, item, 'key')} />
                </Form.Item>
                <Form.Item label="字号">
                    <Input value={item.fontSize} onChange={changeDetailData.bind(this, 1, item, 'fontSize')} />
                </Form.Item>
                <Form.Item label="字色类型">
                    <Radio.Group value={item.fontColorType} onChange={changeDetailData.bind(this, 1, item, 'fontColorType')}>
                        <Radio value={1}>统一色</Radio>
                        <Radio value={2}>根据字段不同值不同色</Radio>
                        <Radio value={3}>根据序号不同值不同色</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="字色" style={{display:item.fontColorType !== 1 ? 'none':''}}>
                    <ColorSelect color={item.fontColor} setColor={setColor.bind(this, item, 'fontColor')} />
                </Form.Item>
                <Form.Item label="依据字段" style={{display:item.fontColorType !== 2 ? 'none':''}}>
                    <Input value={item.fontColorKey} onChange={changeDetailData.bind(this, 1, item, 'fontColorKey')} />
                </Form.Item>
                {this.getColorSet(item.fontColorList,(item.fontColorType-1),item.fontColorType === 1 ? 'none':'')}
            </div>
        );
    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        const {index,name,num,sub,icon} = style;
        if(style.showIndex == null){
            style.showIndex = true;
        }
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础样式设置" key="1">
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
                        <Form.Item label="排列方向">
                            <Radio.Group value={style.flexDirection} onChange={changeDetailData.bind(this, 1, style, 'flexDirection')}>
                                <Radio value={'row'}>水平方向</Radio>
                                <Radio value={'column'}>垂直方向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="项背景" >
                            <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item label="项内边距">
                            <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="序号设置" key="2">
                        <Form.Item label="显示序号">
                            <Switch checked={style.showIndex} onChange={changeDetailData.bind(this, 2, style, 'showIndex')}/>
                        </Form.Item>
                        <Form.Item label="宽">
                            <Input value={index.width} onChange={changeDetailData.bind(this, 1, index, 'width')} />
                        </Form.Item>
                        <Form.Item label="高">
                            <Input value={index.height} onChange={changeDetailData.bind(this, 1, index, 'height')} />
                        </Form.Item>
                        <Form.Item label="背景色">
                            <ColorSelect color={index.backgroundColor} setColor={setColor.bind(this, index, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={index.fontSize} onChange={changeDetailData.bind(this, 1, index, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字色类型">
                            <Radio.Group value={index.fontColorType} onChange={changeDetailData.bind(this, 1, index, 'fontColorType')}>
                                <Radio value={1}>统一色</Radio>
                                <Radio value={3}>根据序号不同取不同色</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字色" style={{display:index.fontColorType !== 1 ? 'none':''}}>
                            <ColorSelect color={index.fontColor} setColor={setColor.bind(this, index, 'fontColor')} />
                        </Form.Item>
                        {this.getColorSet(index.fontColorList,2,index.fontColorType !== 3 ? 'none':'')}
                    </Panel>
                    <Panel header="名称设置" key="3">
                        {this.getStyleEdit(name)}
                    </Panel>
                    <Panel header="主值设置" key="4">
                        {this.getStyleEdit(num)}
                    </Panel>
                    <Panel header="副值设置" key="5">
                        {this.getStyleEdit(sub)}
                    </Panel>
                    <Panel header="图标设置" key="6">
                        <Form.Item label="图标依据字段">
                            <Input value={icon.iconKey} onChange={changeDetailData.bind(this, 1, icon, 'iconKey')} />
                        </Form.Item>
                        {this.getIconSet(icon.iconList)}
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
