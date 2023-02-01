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
import cssStyle from "./name_num_type_six.module.css";
import {getColorSet} from "../../common/nameNumEditUtil";

const { Panel } = Collapse;

export default class NameNumTypeSixEdit extends React.Component {
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
                <Form.Item label="标题键名">
                    <Input value={item.titleKey} onChange={changeDetailData.bind(this, 1, item, 'titleKey')} />
                </Form.Item>
                <Form.Item label="标题字号">
                    <Input value={item.titleFontSize} onChange={changeDetailData.bind(this, 1, item, 'titleFontSize')} />
                </Form.Item>
                <Form.Item label="标题字色">
                    <ColorSelect color={item.titleFontColor} setColor={setColor.bind(this, item, 'titleFontColor')} />
                </Form.Item>

                <Form.Item label="值键名">
                    <Input value={item.numKey} onChange={changeDetailData.bind(this, 1, item, 'numKey')} />
                </Form.Item>
                <Form.Item label="值字号">
                    <Input value={item.numFontSize} onChange={changeDetailData.bind(this, 1, item, 'numFontSize')} />
                </Form.Item>
                <Form.Item label="值字色类型">
                    <Radio.Group value={item.numFontColorType} onChange={changeDetailData.bind(this, 1, item, 'numFontColorType')}>
                        <Radio value={1}>统一色</Radio>
                        <Radio value={2}>根据字段不同值不同色</Radio>
                        <Radio value={3}>根据是否选中不同色</Radio>
                    </Radio.Group>
                </Form.Item>
                {item.numFontColorType !== 2 && (
                    <Form.Item label="默认字色" >
                        <ColorSelect color={item.numFontColor} setColor={setColor.bind(this, item, 'numFontColor')} />
                    </Form.Item>
                )}
                {item.numFontColorType === 2 && (
                    <Form.Item label="依据字段" style={{display:item.numFontColorType !== 2 ? 'none':''}}>
                        <Input value={item.numFontColorKey} onChange={changeDetailData.bind(this, 1, item, 'numFontColorKey')} />
                    </Form.Item>
                )}
                {item.numFontColorType === 2 && this.getColorSet(item.numFontColorList,1,item.numFontColorType !== 2 ? 'none':'')}
                {item.numFontColorType === 3 && (
                    <Form.Item label="选中字色" >
                        <ColorSelect color={item.numFontColorSelected} setColor={setColor.bind(this, item, 'numFontColorSelected')} />
                    </Form.Item>
                )}
            </div>
        );
    }

    getSplitEdit(){

    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        const {main,subOne,subTwo,split} = style;
        if(style.specialSelected == null){
            style.specialSelected = true;
        }
        if(style.showIndex == null){
            style.showIndex = true;
        }
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础样式" key="1">
                        <Form.Item label="背景色">
                            <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item label="内边距">
                            <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                        </Form.Item>
                        <Form.Item label="突出选中">
                            <Switch checked={style.specialSelected} onChange={changeDetailData.bind(this, 2, style, 'specialSelected')}/>
                        </Form.Item>
                        {style.specialSelected && (
                            <div>
                                <Form.Item label="选中项背景">
                                    <ColorSelect color={style.backgroundColorSelected} setColor={setColor.bind(this, style, 'backgroundColorSelected')} />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Tooltip title='单位为%（为组件宽度的百分比）。'>
                                            选中项宽*
                                        </Tooltip>
                                    }
                                >
                                    <InputNumber value={style.selectedWidth} onChange={changeDetailData.bind(this, 2, style, 'selectedWidth')} />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <Tooltip title='单位为%（为组件高度的百分比）。'>
                                            选中项高*
                                        </Tooltip>
                                    }
                                >
                                    <InputNumber value={style.selectedHeight} onChange={changeDetailData.bind(this, 2, style, 'selectedHeight')} />
                                </Form.Item>
                                <Form.Item label="含副项">
                                    <Switch checked={style.hasSub} onChange={changeDetailData.bind(this, 2, style, 'hasSub')}/>
                                </Form.Item>
                            </div>
                        )}
                    </Panel>
                    <Panel header="序号设置" key="2">
                        <Form.Item label="显示序号">
                            <Switch checked={style.showIndex} onChange={changeDetailData.bind(this, 2, style, 'showIndex')}/>
                        </Form.Item>
                        <Form.Item label="含总数">
                            <Switch checked={style.hasCount} onChange={changeDetailData.bind(this, 2, style, 'hasCount')}/>
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.indexFontSize} onChange={changeDetailData.bind(this, 1, style, 'indexFontSize')} />
                        </Form.Item>
                        <Form.Item label="字色类型">
                            <Radio.Group value={style.indexColorType} onChange={changeDetailData.bind(this, 1, style, 'indexColorType')}>
                                <Radio value={1}>统一色</Radio>
                                <Radio value={2}>根据序号不同取不同色</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字色" style={{display:style.indexColorType !== 1 ? 'none':''}}>
                            <ColorSelect color={style.indexColor} setColor={setColor.bind(this, style, 'indexColor')} />
                        </Form.Item>
                        {this.getColorSet(style.indexColorList,2,style.indexColorType !== 2 ? 'none':'')}
                    </Panel>
                    <Panel header="主项设置" key="3">
                        {this.getStyleEdit(main)}

                        <Form.Item label="图标依据字段">
                            <Input value={main.iconKey} onChange={changeDetailData.bind(this, 1, main, 'iconKey')} />
                        </Form.Item>
                        {this.getIconSet(main.iconList)}


                        <Form.Item label="边框线宽" >
                            <Input value={main.numBorderWidth} onChange={changeDetailData.bind(this, 1, main, 'numBorderWidth')} />
                        </Form.Item>
                        <Form.Item label="边框弧度" >
                            <Input value={main.numBorderRadius} onChange={changeDetailData.bind(this, 1, main, 'numBorderRadius')} />
                        </Form.Item>
                        <Form.Item label="边框颜色" >
                            <ColorSelect color={main.numBorderColor} setColor={setColor.bind(this, main, 'numBorderColor')} />
                        </Form.Item>
                    </Panel>
                    {style.hasSub && (
                        <Panel header="副项设置" key="4">
                            <Collapse >
                                <Panel header="项1" key="1">
                                    {this.getStyleEdit(subOne)}
                                </Panel>
                                <Panel header="项2" key="2">
                                    {this.getStyleEdit(subTwo)}
                                </Panel>
                            </Collapse>
                        </Panel>
                    )}
                    {style.hasSub && (
                        <Panel header="分隔符设置" key="5">
                            <Collapse >
                                <Panel header="标题分隔符" key="1">
                                    <Form.Item label="分隔符号">
                                        <Input value={split.titleKey} onChange={changeDetailData.bind(this, 1, split, 'titleKey')} />
                                    </Form.Item>
                                    <Form.Item label="字号">
                                        <Input value={split.titleFontSize} onChange={changeDetailData.bind(this, 1, split, 'titleFontSize')} />
                                    </Form.Item>
                                    <Form.Item label="字色">
                                        <ColorSelect color={split.titleFontColor} setColor={setColor.bind(this, split, 'titleFontColor')} />
                                    </Form.Item>
                                </Panel>
                                <Panel header="值分隔符" key="2">
                                    <Form.Item label="分隔符号">
                                        <Input value={split.numKey} onChange={changeDetailData.bind(this, 1, split, 'numKey')} />
                                    </Form.Item>
                                    <Form.Item label="字号">
                                        <Input value={split.numFontSize} onChange={changeDetailData.bind(this, 1, split, 'numFontSize')} />
                                    </Form.Item>
                                    <Form.Item label="字色类型">
                                        <Radio.Group value={split.numFontColorType} onChange={changeDetailData.bind(this, 1, split, 'numFontColorType')}>
                                            <Radio value={1}>统一色</Radio>
                                            <Radio value={2}>根据字段不同值不同色</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="字色" style={{display:split.numFontColor !== 1 ? 'none':''}}>
                                        <ColorSelect color={split.numFontColor} setColor={setColor.bind(this, split, 'numFontColor')} />
                                    </Form.Item>
                                    <Form.Item label="依据字段" style={{display:split.numFontColorKey !== 2 ? 'none':''}}>
                                        <Input value={split.numFontColorKey} onChange={changeDetailData.bind(this, 1, split, 'numFontColorKey')} />
                                    </Form.Item>
                                    {this.getColorSet(split.numFontColorList,1,split.numFontColorList !== 2 ? 'none':'')}
                                </Panel>
                            </Collapse>
                        </Panel>
                    )}
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
