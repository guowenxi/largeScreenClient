import React from 'react';
import {Form, Input, InputNumber, Collapse, Switch, Radio, Tooltip, Icon, Row, Col, Slider, Select} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {changeDetailData} from "../../common/editUtil";
// import InputNumber from "../../common/inputNumberEx";

const formItemLayout24 = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const { Panel } = Collapse;
const { TextArea } = Input;

export default class EchartsPieEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    changeDetailData(type, item, key, event){
        this.props.saveNowDataToHistory();
        let editData = type === 1 ? event.target.value : event;
        item[key] = editData;
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    //修改颜色
    setColor(item, key, data) {
        this.props.saveNowDataToHistory();
        const rgb = data.rgb;
        item[key] = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+rgb.a+')';
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    addColor(item,type){
        this.props.saveNowDataToHistory();
        if(type === 1){
            item.push('#0ff');
        }else{
            item.push({
                start:'red',
                end:'blue'
            });
        }
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    deleteColor(item,index){
        this.props.saveNowDataToHistory();
        item.splice(index,1);
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    render() {
        const {style} = this.props.data;
        const {legend} = style;
        return (
            <Collapse >
                <Panel header="图例" key="7">
                    <Form {...formItemLayout24}>
                        <Form.Item label="是否显示">
                            <Switch checked={legend.show} onChange={this.changeDetailData.bind(this, 2, legend, 'show')}/>
                        </Form.Item>
                        <Form.Item label="图例类型">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'styleType')} value={legend.styleType}>
                                <Radio value={1}>echarts</Radio>
                                <Radio value={2}>自定义</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="左侧距离">
                            <Input value={legend.left} onChange={this.changeDetailData.bind(this, 1, legend, 'left')}/>
                        </Form.Item>
                        <Form.Item label="右侧距离">
                            <Input value={legend.right} onChange={this.changeDetailData.bind(this, 1, legend, 'right')}/>
                        </Form.Item>
                        <Form.Item label="上侧距离">
                            <Input value={legend.top} onChange={this.changeDetailData.bind(this, 1, legend, 'top')}/>
                        </Form.Item>
                        <Form.Item label="下侧距离">
                            <Input value={legend.bottom} onChange={this.changeDetailData.bind(this, 1, legend, 'bottom')}/>
                        </Form.Item>
                        <Form.Item label="宽">
                            <Input value={legend.width} onChange={this.changeDetailData.bind(this, 1, legend, 'width')}/>
                        </Form.Item>
                        <Form.Item label="高">
                            <Input value={legend.height} onChange={this.changeDetailData.bind(this, 1, legend, 'height')}/>
                        </Form.Item>
                        <Form.Item label="布局朝向" style={{display:legend.styleType === 2 ? 'block':'none'}}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'flexDirection')} value={legend.flexDirection}>
                                <Radio value={'row'}>横向</Radio>
                                <Radio value={'column'}>竖向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="布局朝向" style={{display:legend.styleType === 1 ? 'block':'none'}}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'orient')} value={legend.orient}>
                                <Radio value={'horizontal'}>横向</Radio>
                                <Radio value={'vertical'}>竖向</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="水平对齐" style={{display:legend.styleType === 2 ? 'block':'none'}}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'align')} value={legend.align}>
                                <Radio value={'row'}>左对齐</Radio>
                                <Radio value={'row-reverse'}>右对齐</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="垂直对齐" style={{display:legend.styleType === 2 ? 'block':'none'}}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'verticalAlign')} value={legend.verticalAlign}>
                                <Radio value={'flex-start'}>上对齐</Radio>
                                <Radio value={'center'}>中对齐</Radio>
                                <Radio value={'flex-end'}>下对齐</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="文本对齐" style={{display:legend.styleType === 1 ? 'block':'none'}}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'align')} value={legend.align}>
                                <Radio value={'auto'}>自动</Radio>
                                <Radio value={'left'}>左对齐</Radio>
                                <Radio value={'right'}>右对齐</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="内边距">
                            <InputNumber value={legend.padding} onChange={this.changeDetailData.bind(this, 2, legend, 'padding')}/>
                        </Form.Item>
                        <Form.Item style={{display:legend.styleType === 1 ? 'block':'none'}}
                            label={
                                <Tooltip title="类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'。可以通过 'image://url' 设置为图片，其中 URL 为图片的链接，或者 dataURI。可以通过 'path://' 将图标设置为任意的矢量路径。">
                                    图形*
                                </Tooltip>
                            }
                        >
                            <Input value={legend.icon} onChange={this.changeDetailData.bind(this, 1, legend, 'icon')}/>
                        </Form.Item>
                        <Form.Item label="图形类型" style={{display:legend.styleType === 2 ? 'block':'none'}}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'icon')} value={legend.icon}>
                                <Radio value={'rect'}>方形</Radio>
                                <Radio value={'circle'}>圆形</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="项间隔" style={{display:legend.styleType === 1 ? 'block':'none'}}>
                            <Input value={legend.itemGap} onChange={this.changeDetailData.bind(this, 1, legend, 'itemGap')}/>
                        </Form.Item>
                        <Form.Item label="列数" style={{display:legend.styleType === 2 ? 'block':'none'}}>
                            <InputNumber value={legend.columnNum} min={1}
                                   onChange={this.changeDetailData.bind(this, 2, legend, 'columnNum')}/>
                        </Form.Item>
                        <Form.Item label="列间距" style={{display:legend.styleType === 2 ? 'block':'none'}}>
                            <InputNumber value={legend.columnGap} min={0} onChange={this.changeDetailData.bind(this, 2, legend, 'columnGap')}/>
                        </Form.Item>
                        <Form.Item label="图形宽度">
                            <Input value={legend.itemWidth} onChange={this.changeDetailData.bind(this, 1, legend, 'itemWidth')}/>
                        </Form.Item>
                        <Form.Item label="图形高度">
                            <Input value={legend.itemHeight} onChange={this.changeDetailData.bind(this, 1, legend, 'itemHeight')}/>
                        </Form.Item>
                        <Form.Item label="图形字间距" style={{display:legend.styleType === 2 ? 'block':'none'}}>
                            <Input value={legend.distance} onChange={this.changeDetailData.bind(this, 1, legend, 'distance')}/>
                        </Form.Item>
                        <Form.Item label="文字颜色">
                            <ColorSelect color={legend.textStyle.color} setColor={this.setColor.bind(this, legend.textStyle, 'color')} />
                        </Form.Item>
                        <Form.Item label="文字大小">
                            <Input value={legend.textStyle.fontSize} onChange={this.changeDetailData.bind(this, 1, legend.textStyle, 'fontSize')}/>
                        </Form.Item>
                        <Form.Item label="文字行高" style={{display:legend.styleType === 1 ? 'block':'none'}}>
                            <Input value={legend.textStyle.lineHeight} onChange={this.changeDetailData.bind(this, 1, legend.textStyle, 'lineHeight')}/>
                        </Form.Item>
                        <Form.Item label="文字超出" style={{display:legend.styleType === 2 ? 'block':'none'}}>
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'nameOverShowType')} value={legend.nameOverShowType}>
                                <Radio value={1}>换行（默认</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="刻度标签内容格式器。内容为函数代码。">
                                    格式器*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={legend.formatter}
                                      onChange={this.changeDetailData.bind(this, 1, legend, 'formatter')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="自定义富文本样式。内容格式为json字串。">
                                    文本样式*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={legend.rich}
                                      onChange={this.changeDetailData.bind(this, 1, legend, 'rich')} />
                        </Form.Item>
                        <Form.Item label="数量显示" style={{display:legend.styleType === 2 ? 'block':'none'}}>
                            <Switch checked={legend.showNum} onChange={this.changeDetailData.bind(this, 2, legend, 'showNum')}/>
                        </Form.Item>
                        {legend.styleType === 2 && legend.showNum && (
                            <React.Fragment>
                                <Form.Item label="数量字宽" >
                                    <Input value={legend.numWidth} onChange={this.changeDetailData.bind(this, 1, legend, 'numWidth')}/>
                                </Form.Item>
                                <Form.Item label="数量字号" >
                                    <Input value={legend.numSize} onChange={this.changeDetailData.bind(this, 1, legend, 'numSize')}/>
                                </Form.Item>
                                <Form.Item label="数量字色" >
                                    <ColorSelect color={legend.numColor} setColor={this.setColor.bind(this, legend, 'numColor')} />
                                </Form.Item>
                                <Form.Item label="数量对齐" >
                                    <Radio.Group value={legend.numAlign} onChange={changeDetailData.bind(this, 1, legend, 'numAlign')}>
                                        <Radio value="left">居左</Radio>
                                        <Radio value="center">居中</Radio>
                                        <Radio value="right">居右</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </React.Fragment>
                        )}
                        <Form.Item label="占比显示" style={{display:legend.styleType === 2 ? 'block':'none'}}>
                            <Switch checked={legend.percentage} onChange={this.changeDetailData.bind(this, 2, legend, 'percentage')}/>
                        </Form.Item>
                        {legend.styleType === 2 && legend.percentage && (
                            <React.Fragment>
                                <Form.Item label="小数位数" >
                                    <Input value={legend.fixNum} onChange={this.changeDetailData.bind(this, 1, legend, 'fixNum')}/>
                                </Form.Item>
                                <Form.Item label="占比字宽" >
                                    <Input value={legend.percentageWidth} onChange={this.changeDetailData.bind(this, 1, legend, 'percentageWidth')}/>
                                </Form.Item>
                                <Form.Item label="占比字号" >
                                    <Input value={legend.percentageSize} onChange={this.changeDetailData.bind(this, 1, legend, 'percentageSize')}/>
                                </Form.Item>
                                <Form.Item label="占比字色" >
                                    <ColorSelect color={legend.percentageColor} setColor={this.setColor.bind(this, legend, 'percentageColor')} />
                                </Form.Item>
                                <Form.Item label="占比对齐" >
                                    <Radio.Group value={legend.percentageAlign} onChange={changeDetailData.bind(this, 1, legend, 'percentageAlign')}>
                                        <Radio value="left">居左</Radio>
                                        <Radio value="center">居中</Radio>
                                        <Radio value="right">居右</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </React.Fragment>
                        )}
                    </Form>
                </Panel>
                <Panel header="图表样式" key="6">
                    {this.props.data.style.series.map((item,index) =>
                        <Form {...formItemLayout24} key={index}>
                            <Form.Item label="排布方向">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'clockwise')} value={item.clockwise}>
                                    <Radio value={true}>顺时针</Radio>
                                    <Radio value={false}>逆时针</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="位置左距离">
                                <Input value={item.centerX} onChange={this.changeDetailData.bind(this, 1, item, 'centerX')} />
                            </Form.Item>
                            <Form.Item label="位置上距离">
                                <Input value={item.centerY} onChange={this.changeDetailData.bind(this, 1, item, 'centerY')} />
                            </Form.Item>
                            <Form.Item label="内半径">
                                <Input value={item.radiusIn} onChange={this.changeDetailData.bind(this, 1, item, 'radiusIn')} />
                            </Form.Item>
                            <Form.Item label="外半径">
                                <Input value={item.radiusOut} onChange={this.changeDetailData.bind(this, 1, item, 'radiusOut')} />
                            </Form.Item>
                            <Form.Item label="起始类型">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'startAngleType')} value={item.startAngleType}>
                                    <Radio value={1}>默认</Radio>
                                    <Radio value={2}>某项中心</Radio>
                                </Radio.Group>
                            </Form.Item>
                            {item.startAngleType === 2 && (
                                <Form.Item label="起始项">
                                    <InputNumber value={item.startIndex} onChange={this.changeDetailData.bind(this, 2, item, 'startIndex')} />
                                </Form.Item>
                            )}
                            <Form.Item label="起始角度">
                                <Slider
                                    min={0}
                                    max={360}
                                    onChange={this.changeDetailData.bind(this, 2, item, 'startAngle')}
                                    value={item.startAngle}
                                    step={1}
                                />
                            </Form.Item>
                            <Form.Item label="最小角度">
                                <Slider
                                    min={0}
                                    max={360}
                                    onChange={this.changeDetailData.bind(this, 2, item, 'minAngle')}
                                    value={item.minAngle}
                                    step={1}
                                />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="小于这个角度的扇区，不显示标签。">
                                        隐藏角度*
                                    </Tooltip>
                                }
                            >
                                <Slider
                                    min={0}
                                    max={360}
                                    onChange={this.changeDetailData.bind(this, 2, item, 'minShowLabelAngle')}
                                    value={item.minShowLabelAngle}
                                    step={1}
                                />
                            </Form.Item>
                            <Form.Item label="南丁格尔">
                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'roseType')} value={item.roseType}>
                                    <Radio value={false}>不使用南丁格尔图</Radio>
                                    <Radio value={'radius'}>不同圆心角</Radio>
                                    <Radio value={'area'}>相同圆心角</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label={
                                <span>
                                    <Tooltip title="点击添加">
                                        <Icon type="plus" style={{cursor:'pointer',marginRight:'0.5vh'}} onClick={this.addColor.bind(this,item.color,1)}/>
                                    </Tooltip>
                                    颜色
                                </span>
                            }>
                                <Row>
                                    {item.color.map((thisColor,index) =>
                                        <Col key={index}>
                                            <ColorSelect style={{marginTop:'5px'}} color={thisColor} setColor={this.setColor.bind(this, item.color, index)} />
                                            <Icon type="close" style={{position:'absolute',top:'12px',marginLeft:'0.5vh',cursor:'pointer'}} onClick={this.deleteColor.bind(this, item.color, index)}/>
                                        </Col>
                                    )}
                                </Row>
                            </Form.Item>
                            <Collapse >
                                <Panel header="图形样式" key="3">
                                    <Form.Item label="边框宽度">
                                        <Input value={item.itemStyle.borderWidth} onChange={this.changeDetailData.bind(this, 1, item.itemStyle, 'borderWidth')} />
                                    </Form.Item>
                                    <Form.Item label="边框类型">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.itemStyle, 'borderType')} value={item.itemStyle.borderType}>
                                            <Radio value={'solid'}>实线</Radio>
                                            <Radio value={'dashed'}>虚线1</Radio>
                                            <Radio value={'dotted'}>虚线2</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="边框颜色">
                                        <ColorSelect color={item.itemStyle.borderColor} setColor={this.setColor.bind(this, item.itemStyle, 'borderColor')} />
                                    </Form.Item>
                                    <Form.Item label="圆角半径">
                                        <Input value={item.itemStyle.borderRadius} onChange={this.changeDetailData.bind(this, 1, item.itemStyle, 'borderRadius')} />
                                    </Form.Item>
                                </Panel>
                                <Panel header="视觉引导线样式" key="2">
                                    <Form.Item label="是否显示">
                                        <Switch checked={item.labelLine.show}
                                                onChange={this.changeDetailData.bind(this, 2, item.labelLine, 'show')}/>
                                    </Form.Item>
                                    <Form.Item label="一段长度">
                                        <Input value={item.labelLine.length} onChange={this.changeDetailData.bind(this, 1, item.labelLine, 'length')} />
                                    </Form.Item>
                                    <Form.Item label="二段长度">
                                        <Input value={item.labelLine.length2} onChange={this.changeDetailData.bind(this, 1, item.labelLine, 'length2')} />
                                    </Form.Item>
                                    <Form.Item label="平滑程度">
                                        <Slider
                                            min={0}
                                            max={1}
                                            onChange={this.changeDetailData.bind(this, 2, item.labelLine, 'smooth')}
                                            value={item.labelLine.smooth}
                                            step={0.01}
                                        />
                                    </Form.Item>
                                    <Form.Item label="颜色">
                                        <ColorSelect color={item.labelLine.lineStyle.color} setColor={this.setColor.bind(this, item.labelLine.lineStyle, 'color')} />
                                    </Form.Item>
                                    <Form.Item label="线宽">
                                        <Input value={item.labelLine.lineStyle.width} onChange={this.changeDetailData.bind(this, 1, item.labelLine.lineStyle, 'width')} />
                                    </Form.Item>
                                    <Form.Item label="线类型">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.labelLine.lineStyle, 'type')} value={item.labelLine.lineStyle.type}>
                                            <Radio value={'solid'}>实线</Radio>
                                            <Radio value={'dashed'}>虚线1</Radio>
                                            <Radio value={'dotted'}>虚线2</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Panel>
                                <Panel header="文本标签" key="1">
                                    <Form.Item label="显示">
                                        <Switch checked={item.label.show}
                                                onChange={this.changeDetailData.bind(this, 2, item.label, 'show')}/>
                                    </Form.Item>
                                    <Form.Item label="颜色">
                                        <ColorSelect color={item.label.color} setColor={this.setColor.bind(this, item.label, 'color')} />
                                    </Form.Item>
                                    <Form.Item label="位置">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.label, 'position')} value={item.label.position}>
                                            <Radio value={'outside'}>外侧</Radio>
                                            <Radio value={'inside'}>内侧</Radio>
                                            <Radio value={'center'}>中心</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title="从 -90 度到 90 度。正值是逆时针。">
                                                标签旋转*
                                            </Tooltip>
                                        }
                                    >
                                        <InputNumber value={item.label.rotate} onChange={this.changeDetailData.bind(this, 2, item.label, 'rotate')}/>
                                    </Form.Item>
                                    <Form.Item label="字体大小">
                                        <Input value={item.label.fontSize} onChange={this.changeDetailData.bind(this, 1, item.label, 'fontSize')} />
                                    </Form.Item>
                                    <Form.Item label="水平对齐">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.label, 'align')} value={item.label.align}>
                                            <Radio value={'left'}>左对齐</Radio>
                                            <Radio value={'center'}>中对齐</Radio>
                                            <Radio value={'right'}>右对齐</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="垂直对齐">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.label, 'verticalAlign')} value={item.label.verticalAlign}>
                                            <Radio value={'top'}>上对齐</Radio>
                                            <Radio value={'middle'}>中对齐</Radio>
                                            <Radio value={'bottom'}>下对齐</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title="刻度标签内容格式器。内容为函数代码。">
                                                格式器*
                                            </Tooltip>
                                        }
                                    >
                                        <TextArea rows={5} value={item.label.formatter}
                                                  onChange={this.changeDetailData.bind(this, 1, item.label, 'formatter')} />
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <Tooltip title="自定义富文本样式。内容格式为json字串。">
                                                文本样式*
                                            </Tooltip>
                                        }
                                    >
                                        <TextArea rows={5} value={item.label.rich}
                                                  onChange={this.changeDetailData.bind(this, 1, item.label, 'rich')} />
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        </Form>
                    )}
                </Panel>
                <Panel header="标注" key="8">
                    <Form {...formItemLayout24}>
                        <Form.Item label="显示">
                            <Switch checked={style.titleShow} onChange={this.changeDetailData.bind(this, 2, style, 'titleShow')}/>
                        </Form.Item>
                        <Form.Item label="响应交互">
                            <Switch checked={style.actionInteract} onChange={this.changeDetailData.bind(this, 2, style, 'actionInteract')}/>
                        </Form.Item>
                        <Form.Item label="左">
                            <Input value={style.titleLeft} onChange={this.changeDetailData.bind(this, 1, style, 'titleLeft')}/>
                        </Form.Item>
                        <Form.Item label="上">
                            <Input value={style.titleTop} onChange={this.changeDetailData.bind(this, 1, style, 'titleTop')}/>
                        </Form.Item>
                        <Form.Item label="标题类型">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, style, 'titleType')} value={style.titleType}>
                                <Radio value={1}>固定字符</Radio>
                                <Radio value={2}>跟随选中轮播</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {style.titleType === 1 && (
                            <Form.Item label="标题内容">
                                <Input value={style.title} onChange={this.changeDetailData.bind(this, 1, style, 'title')}/>
                            </Form.Item>
                        )}
                        <Form.Item label="标题字号">
                            <Input value={style.titleSize} onChange={this.changeDetailData.bind(this, 1, style, 'titleSize')}/>
                        </Form.Item>
                        <Form.Item label="标题字色">
                            <ColorSelect color={style.titleColor} setColor={this.setColor.bind(this, style, 'titleColor')} />
                        </Form.Item>
                        <Form.Item label="标题行高">
                            <InputNumber value={style.titleHeight} onChange={this.changeDetailData.bind(this, 2, style, 'titleHeight')}/>
                        </Form.Item>
                        <Form.Item label="标题宽">
                            <Input value={style.titleWidth} onChange={this.changeDetailData.bind(this, 1, style, 'titleWidth')}/>
                        </Form.Item>
                        <Form.Item label="标题字体" >
                            <Select value={style.titleFontFamily} onChange={changeDetailData.bind(this, 2, style, 'titleFontFamily')}>
                                <Select.Option value=''>默认</Select.Option>
                                <Select.Option value='Impact'>Impact</Select.Option>
                                <Select.Option value='LESLIE'>LESLIE</Select.Option>
                                <Select.Option value='MFBanHei'>MFBanHei</Select.Option>
                                <Select.Option value='MFLiHei'>MFLiHei</Select.Option>
                                <Select.Option value='IRON_MAN_OF_WAR'>IRON MAN OF WAR</Select.Option>
                                <Select.Option value='TRENDS'>TRENDS</Select.Option>
                                <Select.Option value='QUARTZEF'>QUARTZEF</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="值内容">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, style, 'numType')} value={style.numType}>
                                <Radio value={'count'}>总数</Radio>
                                <Radio value={'part'}>某项</Radio>
                                <Radio value={'partCount'}>某些项和</Radio>
                                <Radio value={'selected'}>跟随选中轮播</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="项序号" style={{display:style.numType === 'part' ? 'block':'none'}}>
                            <Input value={style.numIndex} onChange={this.changeDetailData.bind(this, 1, style, 'numIndex')}/>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="内容为json格式字符串。">
                                    项序号*
                                </Tooltip>
                            }
                            style={{display:style.numType === 'partCount' ? 'block':'none'}}
                        >
                            <Input value={style.numIndex} onChange={this.changeDetailData.bind(this, 1, style, 'numIndex')}/>
                        </Form.Item>
                        <Form.Item label="占比显示" style={{display:style.numType === 'part' ? 'block':'none'}}>
                            <Switch checked={style.percentage} onChange={this.changeDetailData.bind(this, 2, style, 'percentage')}/>
                        </Form.Item>
                        <Form.Item label="值字号">
                            <Input value={style.numSize} onChange={this.changeDetailData.bind(this, 1, style, 'numSize')}/>
                        </Form.Item>
                        <Form.Item label="值字色">
                            <ColorSelect color={style.numColor} setColor={this.setColor.bind(this, style, 'numColor')} />
                        </Form.Item>
                        <Form.Item label="值行高">
                            <InputNumber value={style.numHeight} onChange={this.changeDetailData.bind(this, 2, style, 'numHeight')}/>
                        </Form.Item>
                        <Form.Item label="值字体" >
                            <Select value={style.numFontFamily} onChange={changeDetailData.bind(this, 2, style, 'numFontFamily')}>
                                <Select.Option value=''>默认</Select.Option>
                                <Select.Option value='Impact'>Impact</Select.Option>
                                <Select.Option value='LESLIE'>LESLIE</Select.Option>
                                <Select.Option value='MFBanHei'>MFBanHei</Select.Option>
                                <Select.Option value='MFLiHei'>MFLiHei</Select.Option>
                                <Select.Option value='IRON_MAN_OF_WAR'>IRON MAN OF WAR</Select.Option>
                                <Select.Option value='TRENDS'>TRENDS</Select.Option>
                                <Select.Option value='QUARTZEF'>QUARTZEF</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="轮播设置" key="9">
                    <Form {...formItemLayout24}>
                        <Form.Item label="是否开启">
                            <Switch checked={style.autoMove} onChange={this.changeDetailData.bind(this, 2, style, 'autoMove')}/>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="单位毫秒。">
                                    轮播间隔*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.interval} onChange={this.changeDetailData.bind(this, 2, style, 'interval')}/>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="选中设置" key="10">
                    <Form {...formItemLayout24}>
                        <Form.Item label="选中序号">
                            <InputNumber value={style.selectedIndex} onChange={this.changeDetailData.bind(this, 2, style, 'selectedIndex')}/>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="其他设置" key="11">
                    <Form {...formItemLayout24}>
                        <Form.Item label="旋转动画">
                            <Switch checked={style.animateOne}
                                    onChange={changeDetailData.bind(this, 2, style, 'animateOne')} />
                        </Form.Item>
                        <Form.Item label="隐藏悬浮提示框">
                            <Switch checked={style.hideTooltip}
                                    onChange={changeDetailData.bind(this, 2, style, 'hideTooltip')} />
                        </Form.Item>
                        <Form.Item label="悬浮窗位置" >
                            <Select value={style.tooltipPosition} onChange={changeDetailData.bind(this, 2, style, 'tooltipPosition')}>
                                <Select.Option value={null}>不设置</Select.Option>
                                <Select.Option value='left'>左</Select.Option>
                                <Select.Option value='top'>上</Select.Option>
                                <Select.Option value='right'>右</Select.Option>
                                <Select.Option value='bottom'>下</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="提示框内容格式器。内容为函数代码。">
                                    格式器*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={style.tooltipFormatter}
                                      onChange={this.changeDetailData.bind(this, 1, style, 'tooltipFormatter')} />
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
