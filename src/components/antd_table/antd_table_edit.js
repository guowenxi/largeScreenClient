import React from 'react';
import {Form, Input, InputNumber, Collapse, Switch, Tooltip, Tag, Button, Icon, Radio, Select} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {
    changeDetailData,
    changeDetailDataWithTime,
    addListItem,
    deleteListItemWithTime,
    setColor,
    deleteListItem, getInteractEdit, selectIconOk, selectIconCancel, iconClick, selectIcon
} from "../../common/editUtil";
import FileSelect from "../../common/fileSelect";
import {fileUrl} from "../../config";

const { Panel } = Collapse;
const { TextArea } = Input;

export default class AntdTableEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.columnsItem = {align:'left',title:'',dataIndex:'',sorter:false,width:'',filterOpen:false,filterType:1,filterUrl:'',filtersJson:'',filterMultiple:true,colorType:1,calculateType:1,calculateList:[]};
        this.calculateItem = {value:'',more:0,less:100,color:'#fff'};
        this.getInteractEdit = getInteractEdit.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    //列特殊颜色设置内容
    getCalculateList(column){
        if(column.calculateList == null){
            column.calculateList = [];
        }
        return (
            column.calculateList.map((calculate,calculateIndex) => {
                return (
                    <div key={calculateIndex}>
                        <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, column.calculateList, calculateIndex)}>
                            {'条件' + (calculateIndex + 1)}
                        </Tag>
                        {column.calculateType === 1 && (
                            <Form.Item label="值">
                                <Input value={calculate.value} onChange={changeDetailData.bind(this, 1, calculate, 'value')}/>
                            </Form.Item>
                        )}
                        {column.calculateType === 2 && (
                            <Form.Item label="大于等于">
                                <Input value={calculate.more} onChange={changeDetailData.bind(this, 1, calculate, 'more')}/>
                            </Form.Item>
                        )}
                        {column.calculateType === 2 && (
                            <Form.Item label="小于">
                                <Input value={calculate.less} onChange={changeDetailData.bind(this, 1, calculate, 'less')}/>
                            </Form.Item>
                        )}
                        <Form.Item label="颜色">
                            <ColorSelect color={calculate.color} setColor={setColor.bind(this, calculate, 'color')} />
                        </Form.Item>
                    </div>
                )
            })
        )
    }

    getDataContentEdit(column){
        return (
            <React.Fragment >
                <Form.Item label="数据类型">
                    <Radio.Group value={column.dataType} onChange={changeDetailDataWithTime.bind(this, 1, column, 'dataType', column)}>
                        <Radio value={1}>纯文本(默认)</Radio>
                        <Radio value={2}>图片</Radio>
                        <Radio value={3}>图片带文字</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title="若需显示序号则填写index_num">
                            数据键名*
                        </Tooltip>
                    }
                >
                    <Input value={column.dataIndex} onChange={changeDetailDataWithTime.bind(this, 1, column, 'dataIndex', column)} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title="列内容格式器。内容为函数代码。">
                            格式器*
                        </Tooltip>
                    }
                >
                    <TextArea rows={5} value={column.formatter}
                              onChange={changeDetailDataWithTime.bind(this, 1, column, 'formatter', column)} />
                </Form.Item>
                <Form.Item label="对齐方式">
                    <Radio.Group value={column.align} onChange={changeDetailDataWithTime.bind(this, 1, column, 'align', column)}>
                        <Radio value={'left'}>居左</Radio>
                        <Radio value={'center'}>居中</Radio>
                        <Radio value={'right'}>居右</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="排序">
                    <Switch checked={column.sorter}
                            onChange={changeDetailDataWithTime.bind(this, 2, column, 'sorter', column)}/>
                </Form.Item>
                <Form.Item label="排序键名" style={{display: column.sorter ? 'block' : 'none'}}>
                    <Input value={column.orderKey} onChange={changeDetailDataWithTime.bind(this, 1, column, 'orderKey', column)} />
                </Form.Item>
                <Form.Item label="筛选">
                    <Switch checked={column.filterOpen}
                            onChange={changeDetailDataWithTime.bind(this, 2, column, 'filterOpen', column)}/>
                </Form.Item>
                <Form.Item label="是否多选" style={{display: column.filterOpen ? 'block' : 'none'}}>
                    <Switch checked={column.filterMultiple}
                            onChange={changeDetailDataWithTime.bind(this, 2, column, 'filterMultiple', column)}/>
                </Form.Item>
                <Form.Item label="筛选键名" style={{display: column.filterOpen ? 'block' : 'none'}}>
                    <Input value={column.selectKey} onChange={changeDetailDataWithTime.bind(this, 1, column, 'selectKey', column)} />
                </Form.Item>
                <Form.Item
                    style={{display: column.filterOpen ? 'block' : 'none'}}
                    label={
                        <Tooltip title='筛选内容数据来源类型'>
                            内容来源*
                        </Tooltip>
                    }
                >
                    <Radio.Group value={column.filterType} onChange={changeDetailDataWithTime.bind(this, 1, column, 'filterType', column)}>
                        <Radio value={1}>json字串</Radio>
                        <Radio value={2}>url请求</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    style={{display: column.filterType === 1 && column.filterOpen ? 'block' : 'none'}}
                    label={
                        <Tooltip title='数据样例：[{"text":"xxx",value:"1"},{"text":"yyy",value:"2"}]'>
                            筛选内容*
                        </Tooltip>
                    }
                >
                    <TextArea rows={4} value={column.filtersJson} onChange={changeDetailDataWithTime.bind(this, 1, column, 'filtersJson', column)} />
                </Form.Item>
                <Form.Item
                    style={{display: column.filterType === 2 && column.filterOpen ? 'block' : 'none'}}
                    label={
                        <Tooltip title='筛选内容数据请求地址，返回数据样例：[{"text":"xxx","value":"1"},{"text":"yyy","value":"2"}]'>
                            请求地址*
                        </Tooltip>
                    }
                >
                    <Input value={column.filterUrl} onChange={changeDetailDataWithTime.bind(this, 1, column, 'filterUrl', column)} />
                </Form.Item>
                <Form.Item label="名称键名" style={{display: column.filterType === 2 && column.filterOpen ? 'block' : 'none'}}>
                    <Input value={column.filterNameKey} onChange={changeDetailDataWithTime.bind(this, 1, column, 'filterNameKey', column)} />
                </Form.Item>
                <Form.Item label="值键名" style={{display: column.filterType === 2 && column.filterOpen ? 'block' : 'none'}}>
                    <Input value={column.filterValueKey} onChange={changeDetailDataWithTime.bind(this, 1, column, 'filterValueKey', column)} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title='固定为内容设置内字体颜色，特殊为根据规则展示不同颜色。'>
                            字色类型*
                        </Tooltip>
                    }
                >
                    <Radio.Group size="small" value={column.colorType}
                                 onChange={changeDetailData.bind(this, 1, column, 'colorType')}>
                        <Radio.Button value={1}>固定</Radio.Button>
                        <Radio.Button value={2}>特殊</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="计算方式" style={{display:column.colorType !== 2 ? 'none':''}}>
                    <Radio.Group size="small" value={column.calculateType}
                                 onChange={changeDetailData.bind(this, 1, column, 'calculateType')}>
                        <Radio.Button value={1}>相等</Radio.Button>
                        <Radio.Button value={2}>区间</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Collapse style={{marginBottom:'5px'}}>
                    <Panel header="具体字色条件设置" key="1" style={{display:column.colorType !== 2 ? 'none':''}}>
                        {this.getCalculateList(column)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,column,'calculateList',this.calculateItem)}>
                                <Icon type="plus"/> 添加条件
                            </Button>
                        </Form.Item>
                    </Panel>
                    <Panel header="图片设置" key="2" style={{display:column.dataType === 1 ? 'none':''}}>
                        <Form.Item label="依据字段">
                            <Input value={column.imgKey} onChange={changeDetailData.bind(this, 1, column, 'imgKey')}/>
                        </Form.Item>
                        <Form.Item label="计算方式" >
                            <Radio.Group size="small" value={column.imgCalculateType}
                                         onChange={changeDetailData.bind(this, 1, column, 'imgCalculateType')}>
                                <Radio.Button value={1}>相等</Radio.Button>
                                <Radio.Button value={2}>区间</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {column.imgList && column.imgList.map((imgItem,index)=>
                            <div key={index}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, column.imgList, index)}>
                                    {'图片' + (index + 1)}
                                </Tag>
                                {column.imgCalculateType === 1 && (
                                    <Form.Item label="值">
                                        <Input value={imgItem.value} onChange={changeDetailData.bind(this, 1, imgItem, 'value')}/>
                                    </Form.Item>
                                )}
                                {column.imgCalculateType === 2 && (
                                    <Form.Item label="大于等于">
                                        <Input value={imgItem.more} onChange={changeDetailData.bind(this, 1, imgItem, 'more')}/>
                                    </Form.Item>
                                )}
                                {column.imgCalculateType === 2 && (
                                    <Form.Item label="小于">
                                        <Input value={imgItem.less} onChange={changeDetailData.bind(this, 1, imgItem, 'less')}/>
                                    </Form.Item>
                                )}
                                <Form.Item label="图片">
                                    {
                                        imgItem.img ? (
                                            <img alt="选择图标" onClick={selectIcon.bind(this, imgItem, 'img')} src={fileUrl + '/download/' + imgItem.img} style={{height:'4vh'}} />
                                        ) : (
                                            <Button type="dashed" onClick={selectIcon.bind(this, imgItem, 'img')} >
                                                <Icon type="plus" /> 选择图标
                                            </Button>
                                        )
                                    }
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,column,'imgList',{})}>
                                <Icon type="plus"/> 添加条件
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </React.Fragment>
        );
    }

    getOperationEdit(column){
        return (
            <Form.Item label="操作内容">
                <Select value={column.operationType} onChange={changeDetailDataWithTime.bind(this, 2, column, 'operationType', column)}>
                    <Select.Option value={'ruian'} >瑞安-指挥调度</Select.Option>
                </Select>
            </Form.Item>
        )
    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        return (
            <Collapse >
                <Panel header="基础样式" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="上方载入" >
                            <Radio.Group value={style.formTop} onChange={changeDetailData.bind(this, 1, style, 'formTop')}>
                                <Radio.Button value={1}>是</Radio.Button>
                                <Radio.Button value={0}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="内容类型">
                            <Select value={style.contentType} onChange={changeDetailData.bind(this, 2, style, 'contentType')}>
                                <Select.Option value={1} >默认</Select.Option>
                                <Select.Option value={2} >方案一</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="配色方案">
                            <Select value={style.theme} onChange={changeDetailData.bind(this, 2, style, 'theme')}>
                                <Select.Option value={''} >默认</Select.Option>
                                <Select.Option value={'antd-theme-one'} >方案一</Select.Option>
                                <Select.Option value={'antd-theme-two'} >方案二</Select.Option>
                                <Select.Option value={'antd-theme-three'} >方案三</Select.Option>
                                <Select.Option value={'antd-theme-four'} >方案四</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="背景色">
                            <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item label="内边距">
                            <Input value={style.padding} onChange={changeDetailData.bind(this, 1, style, 'padding')} />
                        </Form.Item>
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="标题字号">
                            <Input value={style.headFontSize} onChange={changeDetailData.bind(this, 1, style, 'headFontSize')} />
                        </Form.Item>
                        <Form.Item label="内容字号">
                            <Input value={style.contentFontSize} onChange={changeDetailData.bind(this, 1, style, 'contentFontSize')} />
                        </Form.Item>
                        <Form.Item label="返回显示">
                            <Switch checked={style.hasBack} onChange={changeDetailData.bind(this, 2, style, 'hasBack')}/>
                        </Form.Item>
                        <Form.Item label="关闭隐藏">
                            <Switch checked={style.hideClose} onChange={changeDetailData.bind(this, 2, style, 'hideClose')}/>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='返回数据结果时自动点击第一条数据。'>
                                    自动点击*
                                </Tooltip>
                            }
                        >
                            <Switch checked={style.firstClick} onChange={changeDetailData.bind(this, 2, style, 'firstClick')}/>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="搜索框样式" key="7">
                    <Form {...formItemLayout24} >
                        <Form.Item label="隐藏搜索框">
                            <Switch checked={style.hideSearch}
                                    onChange={changeDetailData.bind(this, 2, style, 'hideSearch')}/>
                        </Form.Item>
                        <Form.Item label="高">
                            <Input value={style.searchHeight} onChange={changeDetailData.bind(this, 1, style, 'searchHeight')} />
                        </Form.Item>
                        <Form.Item label="宽">
                            <Input value={style.searchWidth} onChange={changeDetailData.bind(this, 1, style, 'searchWidth')} />
                        </Form.Item>
                        <Form.Item label="左">
                            <Input value={style.searchLeft} onChange={changeDetailData.bind(this, 1, style, 'searchLeft')} />
                        </Form.Item>
                        <Form.Item label="右">
                            <Input value={style.searchRight} onChange={changeDetailData.bind(this, 1, style, 'searchRight')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="边框样式" key="8">
                    <Form {...formItemLayout24} >
                        <Form.Item label="边框线宽" >
                            <Input value={style.borderWidth} onChange={changeDetailData.bind(this, 1, style, 'borderWidth')} />
                        </Form.Item>
                        <Form.Item label="边框颜色" >
                            <ColorSelect color={style.borderColor} setColor={setColor.bind(this, style, 'borderColor')} />
                        </Form.Item>
                        <Form.Item label="边框圆角" >
                            <Input value={style.borderRadius} onChange={changeDetailData.bind(this, 1, style, 'borderRadius')} />
                        </Form.Item>
                        <Form.Item label="边框类型" >
                            <Radio.Group value={style.borderStyle} onChange={changeDetailData.bind(this, 1, style, 'borderStyle')}>
                                <Radio value="solid">实线</Radio>
                                <Radio value="dashed">虚线1</Radio>
                                <Radio value="dotted">虚线2</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="行样式" key="2">
                    <Form {...formItemLayout24} >
                        <Form.Item
                            label={
                                <Tooltip title='数据唯一标识键名，如id。'>
                                    行标识*
                                </Tooltip>
                            }
                        >
                            <Input value={style.rowKey} min={0} max={100} onChange={changeDetailData.bind(this, 1, style, 'rowKey')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='详情键名'>
                                    详情键名*
                                </Tooltip>
                            }
                        >
                            <Input value={style.descriptionKey} min={0} max={100} onChange={changeDetailData.bind(this, 1, style, 'descriptionKey')} />
                        </Form.Item>
                        <Form.Item label="一页行数">
                            <InputNumber value={style.pageSize} onChange={changeDetailDataWithTime.bind(this, 2, style, 'pageSize', style)} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="列样式" key="3">
                    <Form {...formItemLayout24} >
                        {
                            style.columns == null ? '' : (
                                style.columns.map((column,columnIndex) =>
                                    <div key={columnIndex}>
                                        <Tag closable={true} visible={true} onClose={deleteListItemWithTime.bind(this, style.columns, columnIndex, column)}>{'列' + (columnIndex + 1)}</Tag>
                                        <Form.Item label="列名">
                                            <Input value={column.title} onChange={changeDetailDataWithTime.bind(this, 1, column, 'title', column)} />
                                        </Form.Item>
                                        <Form.Item label="内容类型">
                                            <Radio.Group value={column.contentType} onChange={changeDetailDataWithTime.bind(this, 1, column, 'contentType', column)}>
                                                <Radio value={'data'}>数据</Radio>
                                                <Radio value={'operation'}>操作</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item
                                            label={
                                                <Tooltip title='单位为%。'>
                                                    列宽*
                                                </Tooltip>
                                            }
                                        >
                                            <InputNumber value={column.width} min={0} max={100} onChange={changeDetailDataWithTime.bind(this, 2, column, 'width', column)} />
                                        </Form.Item>
                                        {column.contentType === 'operation' ? this.getOperationEdit(column):this.getDataContentEdit(column)}
                                    </div>
                                )
                            )
                        }
                        <Form.Item label="">
                            <Button type="dashed"
                                    onClick={addListItem.bind(this,style,'columns',this.columnsItem)}>
                                <Icon type="plus"/> 添加列
                            </Button>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="关闭时交互" key="4">
                    <Form {...formItemLayout24} >
                        {this.getInteractEdit(style.closeInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'closeInteract',{})}>
                                <Icon type="plus"/> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="返回时交互" key="5">
                    <Form {...formItemLayout24} >
                        {this.getInteractEdit(style.backInteract)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style,'backInteract',{})}>
                                <Icon type="plus"/> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="分页设置" key="9">
                    <Form {...formItemLayout24} >
                        <Form.Item label="隐藏条数切换">
                            <Switch checked={style.hideSizeChange} onChange={changeDetailData.bind(this, 2, style, 'hideSizeChange')}/>
                        </Form.Item>
                        <Form.Item label="隐藏页数跳转">
                            <Switch checked={style.hideQuickJumper} onChange={changeDetailData.bind(this, 2, style, 'hideQuickJumper')}/>
                        </Form.Item>
                        <Form.Item label="简单分页">
                            <Switch checked={style.simplePage} onChange={changeDetailData.bind(this, 2, style, 'simplePage')}/>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="其他设置" key="6">
                    <Form {...formItemLayout24} >
                        <Form.Item label="排序传参方式" >
                            <Radio.Group value={style.orderByType} onChange={changeDetailData.bind(this, 1, style, 'orderByType')}>
                                <Radio.Button value=''>默认</Radio.Button>
                                <Radio.Button value={1}>方式一</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="初始加载" >
                            <Radio.Group value={this.props.data.firstLoad} onChange={changeDetailData.bind(this, 1, this.props.data, 'firstLoad')}>
                                <Radio.Button value={1}>是</Radio.Button>
                                <Radio.Button value={0}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="搜索键名" >
                            <Input value={style.searchKey} onChange={changeDetailData.bind(this, 1, style, 'searchKey')} />
                        </Form.Item>
                        <Form.Item label="列表键名" >
                            <Input value={style.listKey} onChange={changeDetailData.bind(this, 1, style, 'listKey')} />
                        </Form.Item>
                        <Form.Item label="总数键名" >
                            <Input value={style.countKey} onChange={changeDetailData.bind(this, 1, style, 'countKey')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='筛选条件传输数据格式'>
                                    条件格式*
                                </Tooltip>
                            }
                        >
                            <Radio.Group size="small" value={style.filterFormat}
                                         onChange={changeDetailData.bind(this, 1, style, 'filterFormat')}>
                                <Radio value={1}>json数组字串</Radio>
                                <Radio value={2}>逗号分割符</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="关闭保留传参">
                            <Switch checked={style.keepParams}
                                    onChange={changeDetailData.bind(this, 2, style, 'keepParams')}/>
                        </Form.Item>
                        <Form.Item label="不进行初始化">
                            <Switch checked={style.notInit}
                                    onChange={changeDetailData.bind(this, 2, style, 'notInit')}/>
                        </Form.Item>
                        {/*<Form.Item label="隐藏分页">*/}
                        {/*    <Switch checked={style.hidePage}*/}
                        {/*            onChange={changeDetailData.bind(this, 2, style, 'hidePage')}/>*/}
                        {/*</Form.Item>*/}
                    </Form>
                </Panel>
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
            </Collapse>
        );
    }
}
