import React from 'react';
import { Form, Collapse, Select, Tag, InputNumber, Button, Icon, Input, Switch, Tooltip } from 'antd';
import {
    addListItem,
    changeDetailData,
    deleteListItem,
    setColor,
    iconClick,
    selectIcon,
    selectIconCancel,
    selectIconOk,
    getInteractEdit
} from "../../../common/editUtil";
import { getColorList } from "../../../common/nameNumEditUtil";
import ColorSelect from "../../../common/colorSelect";
import FileSelect from "../../../common/fileSelect";
import { fileUrl } from "../../../config";
import {getClusterPointEdit} from "../../../common/mapEditUtil";

const { Panel } = Collapse;

export default class SvgMapTypeOneEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorList = getColorList.bind(this);
        this.getClusterPointEdit = getClusterPointEdit.bind(this);
        this.getInteractEdit = getInteractEdit.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const { style } = this.props.data;
        return (
            <Collapse>
                <Panel header="样式基础设置" key="1">
                    <Form.Item label="地图区域">
                        <Select value={style.area} onChange={changeDetailData.bind(this, 2, style, 'area')}>
                            <Select.Option value={'lucheng'}>鹿城</Select.Option>
                            <Select.Option value={'luchengCommunity'}>鹿城全社区</Select.Option>
                            <Select.Option value={'shuangyu'}>鹿城-双屿</Select.Option>
                            <Select.Option value={'luchengNew'}>鹿城新</Select.Option>
                            <Select.Option value={'shangcheng'}>上城</Select.Option>
                            <Select.Option value={'puxieNew'}>鹿城-蒲鞋市</Select.Option>
                            <Select.Option value={'ninghai'}>宁海</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="区块数据">
                        <Select value={style.pathContent} onChange={changeDetailData.bind(this, 2, style, 'pathContent')}>
                            <Select.Option value={'default'}>默认</Select.Option>
                            <Select.Option value={'luchengCommunity'}>鹿城全社区</Select.Option>
                            <Select.Option value={'shangcheng'}>上城</Select.Option>
                            <Select.Option value={'luchengNew'}>鹿城新</Select.Option>
                            <Select.Option value={'puxieNew'}>蒲鞋市新</Select.Option>
                            <Select.Option value={'ninghai'}>宁海</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="名称键名">
                        <Input value={style.nameKey} onChange={changeDetailData.bind(this, 1, style, 'nameKey')} />
                    </Form.Item>
                    <Form.Item label="字号">
                        <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                    </Form.Item>
                </Panel>
                <Panel header="颜色设置" key="2">
                    <Collapse>
                        <Panel header="区块颜色设置" key="1">
                            <Form.Item label="颜色类型">
                                <Select value={style.partColorType} onChange={changeDetailData.bind(this, 2, style, 'partColorType')}>
                                    <Select.Option value={1}>固定颜色</Select.Option>
                                    <Select.Option value={2}>不同值不同色</Select.Option>
                                </Select>
                            </Form.Item>
                            {style.partColorType === 1 && (
                                <React.Fragment>
                                    <Form.Item label="颜色">
                                        <ColorSelect color={style.partColor} setColor={setColor.bind(this, style, 'partColor')} />
                                    </Form.Item>
                                    <Form.Item label="图片" >
                                        {
                                            style.valueImg ? (
                                                <img src={fileUrl + '/download/' + style.valueImg} alt=""
                                                    style={{ width: '104px', height: '104px' }}
                                                    onClick={selectIcon.bind(this, style, 'valueImg')} />
                                            ) : (
                                                <Button type="dashed"
                                                    onClick={selectIcon.bind(this, style, 'valueImg')}>
                                                    <Icon type="plus" /> 选择图标
                                                </Button>
                                            )
                                        }
                                    </Form.Item>
                                </React.Fragment>
                            )}
                            {style.partColorType === 2 && (
                                <React.Fragment>
                                    <Form.Item label="依据字段">
                                        <Input value={style.subKey} onChange={changeDetailData.bind(this, 1, style, 'subKey')} />
                                    </Form.Item>
                                    <Form.Item label="匹配类型">
                                        <Select value={style.subType} onChange={changeDetailData.bind(this, 2, style, 'subType')}>
                                            <Select.Option value={1}>相等</Select.Option>
                                            <Select.Option value={2}>区间</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="图片显示">
                                        <Switch checked={style.imgShow} onChange={changeDetailData.bind(this, 2, style, 'imgShow')} />
                                    </Form.Item>
                                    {style.colorList && style.colorList.map((item, index) =>
                                        <React.Fragment key={index}>
                                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.colorList, index)}>
                                                {'样式' + (index + 1)}
                                            </Tag>
                                            {style.subType === 1 && (
                                                <Form.Item label="等于" >
                                                    <Input value={item.value} onChange={changeDetailData.bind(this, 1, item, 'value')} />
                                                </Form.Item>
                                            )}
                                            {style.subType === 2 && (
                                                <React.Fragment >
                                                    <Form.Item label="大于等于" >
                                                        <InputNumber value={item.more} onChange={changeDetailData.bind(this, 2, item, 'more')} />
                                                    </Form.Item>
                                                    <Form.Item label="小与" >
                                                        <InputNumber value={item.less} onChange={changeDetailData.bind(this, 2, item, 'less')} />
                                                    </Form.Item>
                                                </React.Fragment>
                                            )}
                                            <Form.Item label="区块颜色">
                                                <ColorSelect color={item.color} setColor={setColor.bind(this, item, 'color')} />
                                            </Form.Item>
                                            <Form.Item label="图片" >
                                                {
                                                    item.img ? (
                                                        <img src={fileUrl + '/download/' + item.img} alt=""
                                                            style={{ width: '104px', height: '104px' }}
                                                            onClick={selectIcon.bind(this, item, 'img')} />
                                                    ) : (
                                                        <Button type="dashed"
                                                            onClick={selectIcon.bind(this, item, 'img')}>
                                                            <Icon type="plus" /> 选择图标
                                                        </Button>
                                                    )
                                                }
                                            </Form.Item>
                                        </React.Fragment>
                                    )}
                                    <Form.Item label="">
                                        <Button type="dashed" onClick={addListItem.bind(this, style, 'colorList', {})}>
                                            <Icon type="plus" /> 添加样式分类
                                        </Button>
                                    </Form.Item>
                                </React.Fragment>
                            )}
                        </Panel>
                        <Panel header="线颜色设置" key="2">
                            <Form.Item label="线颜色显示">
                                <Switch checked={style.lineColorShow} onChange={changeDetailData.bind(this, 2, style, 'lineColorShow')} />
                            </Form.Item>
                            <Form.Item label="颜色类型">
                                <Select value={style.lineColorType} onChange={changeDetailData.bind(this, 2, style, 'lineColorType')}>
                                    <Select.Option value={1}>固定颜色</Select.Option>
                                    <Select.Option value={2}>不同值不同色</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="线宽">
                                <InputNumber value={style.lineWidth} onChange={changeDetailData.bind(this, 2, style, 'lineWidth')} />
                            </Form.Item>
                            {style.lineColorType === 1 && (
                                <Form.Item label="颜色">
                                    <ColorSelect color={style.lineColor} setColor={setColor.bind(this, style, 'lineColor')} />
                                </Form.Item>
                            )}
                            {style.lineColorType === 2 && (
                                <React.Fragment>
                                    <Form.Item label="依据字段">
                                        <Input value={style.lineSubKey} onChange={changeDetailData.bind(this, 1, style, 'lineSubKey')} />
                                    </Form.Item>
                                    <Form.Item label="匹配类型">
                                        <Select value={style.lineSubType} onChange={changeDetailData.bind(this, 2, style, 'lineSubType')}>
                                            <Select.Option value={1}>相等</Select.Option>
                                            <Select.Option value={2}>区间</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    {style.lineColorList && style.lineColorList.map((item, index) =>
                                        <React.Fragment key={index}>
                                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.lineColorList, index)}>
                                                {'样式' + (index + 1)}
                                            </Tag>
                                            {style.lineSubType === 1 && (
                                                <Form.Item label="等于" >
                                                    <Input value={item.lineValue} onChange={changeDetailData.bind(this, 1, item, 'lineValue')} />
                                                </Form.Item>
                                            )}
                                            {style.lineSubType === 2 && (
                                                <React.Fragment >
                                                    <Form.Item label="大于等于" >
                                                        <InputNumber value={item.lineMore} onChange={changeDetailData.bind(this, 2, item, 'lineMore')} />
                                                    </Form.Item>
                                                    <Form.Item label="小与" >
                                                        <InputNumber value={item.lineLess} onChange={changeDetailData.bind(this, 2, item, 'lineLess')} />
                                                    </Form.Item>
                                                </React.Fragment>
                                            )}
                                            <Form.Item label="区块颜色">
                                                <ColorSelect color={item.lineColor} setColor={setColor.bind(this, item, 'lineColor')} />
                                            </Form.Item>
                                        </React.Fragment>
                                    )}
                                    <Form.Item label="">
                                        <Button type="dashed" onClick={addListItem.bind(this, style, 'lineColorList', {})}>
                                            <Icon type="plus" /> 添加样式分类
                                        </Button>
                                    </Form.Item>
                                </React.Fragment>
                            )}
                        </Panel>
                    </Collapse>
                </Panel>
                <Panel header="打点设置" key="3">
                    {this.getClusterPointEdit(style)}
                </Panel>
                <Panel header="响应设置" key="4">
                    <Form.Item label="缩放响应">
                        <Switch checked={style.scaleAction} onChange={changeDetailData.bind(this, 2, style, 'scaleAction')} />
                    </Form.Item>
                    <Form.Item label="拖动响应">
                        <Switch checked={style.moveAction} onChange={changeDetailData.bind(this, 2, style, 'moveAction')} />
                    </Form.Item>
                </Panel>
                <Panel header="详情设置" key="5">
                    <Form.Item label="开启详情">
                        <Switch checked={style.detailShow} onChange={changeDetailData.bind(this, 2, style, 'detailShow')} />
                    </Form.Item>
                    <Form.Item label="详情地址">
                        <Input value={style.detailUrl} onChange={changeDetailData.bind(this, 1, style, 'detailUrl')} />
                    </Form.Item>
                    <Form.Item label="详情内容">
                        <Select value={style.detailType} onChange={changeDetailData.bind(this, 2, style, 'detailType')}>
                            <Select.Option value={1}>内容一</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="字体大小">
                        <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                    </Form.Item>
                    <Form.Item label={<Tooltip title='单位em。'>内容宽*</Tooltip>} >
                        <InputNumber value={style.winWidth} onChange={changeDetailData.bind(this, 2, style, 'winWidth')} />
                    </Form.Item>
                    <Form.Item label={<Tooltip title='单位em。'>内容高*</Tooltip>} >
                        <InputNumber value={style.winHeight} onChange={changeDetailData.bind(this, 2, style, 'winHeight')} />
                    </Form.Item>
                </Panel>
                <Panel header="聚合点点击响应" key="6">
                    {this.getInteractEdit(style.clusterInteract)}
                    <Form.Item label="">
                        <Button type="dashed" onClick={addListItem.bind(this, style, 'clusterInteract', {})}>
                            <Icon type="plus" /> 添加交互内容
                        </Button>
                    </Form.Item>
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
