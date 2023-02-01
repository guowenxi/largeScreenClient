import React from 'react';
import {Form, Input, InputNumber, Collapse, Tooltip, Tag, Radio, Button, Icon} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {
    addListItem, changeDetailDataWithTime,
    changeDetailData, deleteListItem,
    setColor,
} from "../../common/editUtil";
import {getColorSet,getItemStyleEdit} from "../../common/nameNumEditUtil";

const { Panel } = Collapse;
const { TextArea } = Input;

export default class NameNumTypeEightEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible:false};
        this.item = {
            key:"name",
            fontSize:"2vh",
            fontColorType:1,//1为固定色,2为根据某字段不同值不同色,3为根据序号不同值不同色
            fontColor:"#fff",
            fontColorKey:"type",
            fontColorList:[{num:1,color:'rgb(61,219,88)'},{num:2,color:'rgb(1,160,249)'},{num:3,color:'rgb(214,55,25)'}],
        };
        this.contentItem = {nameList:[],nameSplit:{},numList:[],numSplit:{}};
        this.colorItemOne = {num:1,color:'rgb(61,219,88)'};
        this.colorItemTwo = {bottom:1,top:2,color:'rgb(61,219,88)'};
        this.getColorSet = getColorSet.bind(this);
        this.getItemStyleEdit = getItemStyleEdit.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    getListItemBoxEdit(item,type){
        return item && item.map((one,index) =>
            <div key={index}>
                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item, index)}>{(type === 1 ? '标题':'数值') + (index + 1)}</Tag>
                {this.getItemStyleEdit(one,false)}
            </div>
        );
    }

    getListBoxEdit(listBoxStyle,index){
        return (
            <Collapse >
                <Panel header={"列表"+(index+1)+"数据来源设置"} key="7">
                    <Radio.Group value={listBoxStyle.dataType} onChange={changeDetailDataWithTime.bind(this, 1, listBoxStyle, 'dataType', listBoxStyle)}
                                 style={{marginBottom: '16px'}}>
                        <Radio value={1}>示例</Radio>
                        <Radio value={2}>接口</Radio>
                    </Radio.Group>
                    <TextArea rows={5} value={listBoxStyle.defaultData}
                              style={{display: listBoxStyle.dataType === 1 ? 'block' : 'none'}}
                              onChange={changeDetailDataWithTime.bind(this, 1, listBoxStyle, 'defaultData', listBoxStyle)} />
                    <div style={{display: listBoxStyle.dataType === 2 ? 'block' : 'none'}}>
                        <Form.Item label="地址">
                            <Input value={listBoxStyle.dataUrl}
                                   onChange={changeDetailDataWithTime.bind(this, 1, listBoxStyle, 'dataUrl', listBoxStyle)}/>
                        </Form.Item>
                        <Form.Item label="参数">
                            <Input value={listBoxStyle.dataParams}
                                   onChange={changeDetailDataWithTime.bind(this, 1, listBoxStyle, 'dataParams', listBoxStyle)}/>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='数据定时刷新时间间隔，单位毫秒。'>
                                    刷新间隔*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={listBoxStyle.freshTime}
                                   onChange={changeDetailData.bind(this, 2, listBoxStyle, 'freshTime')}/>
                        </Form.Item>
                    </div>
                </Panel>
                <Panel header={"列表"+(index+1)+"基础设置"} key="1">
                    <Form.Item label="宽">
                        <Input value={listBoxStyle.width} onChange={changeDetailData.bind(this, 1, listBoxStyle, 'width')} />
                    </Form.Item>
                    <Form.Item label="高">
                        <Input value={listBoxStyle.height} onChange={changeDetailData.bind(this, 1, listBoxStyle, 'height')} />
                    </Form.Item>
                    <Form.Item label="列数">
                        <InputNumber value={listBoxStyle.columnNum} onChange={changeDetailData.bind(this, 2, listBoxStyle, 'columnNum')} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title='列之间的空隙，单位为%（组件宽度的百分比）。'>
                                列空隙*
                            </Tooltip>
                        }
                    >
                        <InputNumber value={listBoxStyle.columnGap} onChange={changeDetailData.bind(this, 2, listBoxStyle, 'columnGap')} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title='行之间的空隙，单位为%（组件高度的百分比）。'>
                                行空隙*
                            </Tooltip>
                        }
                    >
                        <InputNumber value={listBoxStyle.rowGap} onChange={changeDetailData.bind(this, 2, listBoxStyle, 'rowGap')} />
                    </Form.Item>
                    <Form.Item label="排列方向">
                        <Radio.Group value={listBoxStyle.flexDirection} onChange={changeDetailData.bind(this, 1, listBoxStyle, 'flexDirection')}>
                            <Radio value={'row'}>水平方向</Radio>
                            <Radio value={'column'}>垂直方向</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Panel>
                <Panel header={"列表"+(index+1)+"项内容样式设置"} key="6">
                    <Form.Item label="标题宽">
                        <Input value={listBoxStyle.nameWidth} onChange={changeDetailData.bind(this, 1, listBoxStyle, 'nameWidth')} />
                    </Form.Item>
                    <Form.Item label="标题高">
                        <Input value={listBoxStyle.nameHeight} onChange={changeDetailData.bind(this, 1, listBoxStyle, 'nameHeight')} />
                    </Form.Item>
                    <Form.Item label="数值宽">
                        <Input value={listBoxStyle.numWidth} onChange={changeDetailData.bind(this, 1, listBoxStyle, 'numWidth')} />
                    </Form.Item>
                    <Form.Item label="数值高">
                        <Input value={listBoxStyle.numHeight} onChange={changeDetailData.bind(this, 1, listBoxStyle, 'numHeight')} />
                    </Form.Item>
                    <Form.Item label="排列方向">
                        <Radio.Group value={listBoxStyle.itemFlexDirection} onChange={changeDetailData.bind(this, 1, listBoxStyle, 'itemFlexDirection')}>
                            <Radio value={'row'}>从左到右</Radio>
                            <Radio value={'column'}>从上到下</Radio>
                            <Radio value={'row-reverse'}>从右到左</Radio>
                            <Radio value={'column-reverse'}>从下到上</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Panel>
                <Panel header={"列表"+(index+1)+"标题设置"} key="2">
                    <Form.Item label="水平位置" >
                        <Radio.Group value={listBoxStyle.nameJustifyContent} onChange={changeDetailData.bind(this, 1, listBoxStyle, 'nameJustifyContent')}>
                            <Radio.Button value="flex-start">居左</Radio.Button>
                            <Radio.Button value="center">居中</Radio.Button>
                            <Radio.Button value="flex-end">居右</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="垂直位置" >
                        <Radio.Group value={listBoxStyle.nameAlignItems} onChange={changeDetailData.bind(this, 1, listBoxStyle, 'nameAlignItems')}>
                            <Radio.Button value="flex-start">居上</Radio.Button>
                            <Radio.Button value="center">居中</Radio.Button>
                            <Radio.Button value="flex-end">居下</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {this.getListItemBoxEdit(listBoxStyle.nameList,1)}
                    <Form.Item label="">
                        <Button type="dashed"
                                onClick={addListItem.bind(this,listBoxStyle,'nameList',this.item)}>
                            <Icon type="plus"/> 添加标题
                        </Button>
                    </Form.Item>
                </Panel>
                <Panel header={"列表"+(index+1)+"标题分隔符设置"} key="3">
                    {this.getItemStyleEdit(listBoxStyle.nameSplit,true)}
                </Panel>
                <Panel header={"列表"+(index+1)+"数值设置"} key="4">
                    <Form.Item label="水平位置" >
                        <Radio.Group value={listBoxStyle.numJustifyContent} onChange={changeDetailData.bind(this, 1, listBoxStyle, 'numJustifyContent')}>
                            <Radio.Button value="flex-start">居左</Radio.Button>
                            <Radio.Button value="center">居中</Radio.Button>
                            <Radio.Button value="flex-end">居右</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="垂直位置" >
                        <Radio.Group value={listBoxStyle.numAlignItems} onChange={changeDetailData.bind(this, 1, listBoxStyle, 'numAlignItems')}>
                            <Radio.Button value="flex-start">居上</Radio.Button>
                            <Radio.Button value="center">居中</Radio.Button>
                            <Radio.Button value="flex-end">居下</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {this.getListItemBoxEdit(listBoxStyle.numList,1)}
                    <Form.Item label="">
                        <Button type="dashed"
                                onClick={addListItem.bind(this,listBoxStyle,'numList',this.item)}>
                            <Icon type="plus"/> 添加数值
                        </Button>
                    </Form.Item>
                </Panel>
                <Panel header={"列表"+(index+1)+"数值分隔符设置"} key="5">
                    {this.getItemStyleEdit(listBoxStyle.numSplit,true)}
                </Panel>
            </Collapse>
        );
    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        const {button,splitLine,content} = style;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础样式设置" key="1">
                        <Form.Item label="排列方向">
                            <Radio.Group value={style.flexDirection} onChange={changeDetailData.bind(this, 1, style, 'flexDirection')}>
                                <Radio value={'row'}>水平方向</Radio>
                                <Radio value={'column'}>垂直方向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="展开动画">
                            <Radio.Group value={style.flexDirection} onChange={changeDetailData.bind(this, 1, style, 'flexDirection')}>
                                <Radio value={1}>从左方出现</Radio>
                                <Radio value={2}>从右方出现</Radio>
                                <Radio value={3}>从上方出现</Radio>
                                <Radio value={4}>从下方出现</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="背景" >
                            <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item label="字号" >
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="展开图标设置" key="2">
                        <Form.Item label="左">
                            <Input value={button.left} onChange={changeDetailData.bind(this, 1, button, 'left')} />
                        </Form.Item>
                        <Form.Item label="上">
                            <Input value={button.top} onChange={changeDetailData.bind(this, 1, button, 'top')} />
                        </Form.Item>
                        <Form.Item label="右">
                            <Input value={button.right} onChange={changeDetailData.bind(this, 1, button, 'right')} />
                        </Form.Item>
                        <Form.Item label="下">
                            <Input value={button.bottom} onChange={changeDetailData.bind(this, 1, button, 'bottom')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='单位em。'>
                                    字号*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={button.fontSize} onChange={changeDetailData.bind(this, 2, button, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="颜色">
                            <ColorSelect color={button.fontColor} setColor={setColor.bind(this, button, 'fontColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="分隔线设置" key="3">
                        <Form.Item label="宽">
                            <Input value={splitLine.width} onChange={changeDetailData.bind(this, 1, splitLine, 'width')} />
                        </Form.Item>
                        <Form.Item label="高">
                            <Input value={splitLine.height} onChange={changeDetailData.bind(this, 1, splitLine, 'height')} />
                        </Form.Item>
                        <Form.Item label="颜色">
                            <ColorSelect color={splitLine.backgroundColor} setColor={setColor.bind(this, splitLine, 'backgroundColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="内容设置" key="4">
                        {content.map((item,index) =>
                            <div key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item, index)} style={{margin:'1vh 0'}}>{'内容列表' + (index + 1)}</Tag>
                                {this.getListBoxEdit(item,index)}
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed"
                                    onClick={addListItem.bind(this,style,'content',this.contentItem)}>
                                <Icon type="plus"/> 添加内容列表
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
