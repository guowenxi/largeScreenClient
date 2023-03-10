import React from 'react';
import { Form, Input, InputNumber, Collapse, Switch, Radio, Tooltip, Icon, Row, Col, Slider, Button, Tag } from 'antd';
import ColorSelect from "../../common/colorSelect";
import {addListItem, changeDetailData, deleteListItem, setColor} from "../../common/editUtil";

const formItemLayout24 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const { Panel } = Collapse;
const { TextArea } = Input;

export default class EchartsLineEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.seriesItem = {
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            symbol: 'emptyCircle',
            symbolSize: '1vh',
            showAllSymbol: true,
            step: false,
            smooth: 0,
            itemStyle: {
                opacity: true,
                color: ['#0ff'],
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 0,
                borderType: 'solid',
                barBorderRadius: 0,
            },
            lineStyle: {
                opacity: true,
                colorType: 1,
                color: ['#0ff'],
                width: '2',
                type: 'solid'
            },
            areaStyle: {
                opacity: true,
                colorType: 1,
                color: ['#0ff'],
                linearColor: [{
                    start: 'red',
                    end: 'blue'
                }],
            },
            label: {
                show: true,
                color: '#fff',
                positionType: 'inside',
                position: '',
                distance: '5',
                rotate: 0,
                fontSize: '12',
                align: 'center',
                verticalAlign: 'middle',
            },

            barWidth: '30%',
            barMaxWidth: '100%',
            barMinWidth: '1%',
            barGap: '-50%',
            colorType: 1,
            color: ['#0ff'],
            linearColor: [{
                start: 'red',
                end: 'blue'
            }],
        };
        this.yAxis = {"axisLabel":{"rotate":0,"verticalAlign":"middle","margin":8,"color":"rgba(255,255,255,1)","show":true,"interval":0,"fontSize":"12","inside":false,"align":"right"},"inverse":false,"gridIndex":0,"axisLine":{"lineStyle":{"color":"rgba(0,255,255,0.7)","width":1,"type":"solid"},"show":true},"show":true,"axisTick":{"lineStyle":{"color":"rgba(255,255,255,0.4)","width":1,"type":"solid"},"show":false,"length":5,"interval":0,"inside":false,"alignWithLabel":false},"splitLine":{"lineStyle":{"color":"rgba(0,255,255,0.2)","width":1,"type":"dashed"},"show":true,"interval":0},"scale":false,"position":"left","boundaryGap":true};
        this.xAxis = {"axisLabel":{"rotate":0,"verticalAlign":"top","margin":8,"color":"rgba(255,255,255,1)","show":true,"interval":0,"fontSize":"12","inside":false,"align":"center"},"inverse":false,"gridIndex":0,"axisLine":{"lineStyle":{"color":"rgba(0,255,255,0.7)","width":1,"type":"solid"},"show":true},"show":true,"axisTick":{"lineStyle":{"color":"#333","width":1,"type":"solid"},"show":false,"length":5,"interval":0,"inside":false,"alignWithLabel":false},"splitLine":{"lineStyle":{"color":"#333","width":1,"type":"solid"},"show":false,"interval":0},"scale":false,"position":"bottom","boundaryGap":false};
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

    //????????????
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

    getBarColorEdit(item){
        return (
            <React.Fragment>
                <Form.Item label="????????????">
                    <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'colorType')} value={item.colorType}>
                        <Radio value={1}>?????????</Radio>
                        <Radio value={2}>?????????</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item style={{ display: item.colorType === 2 ? 'none' : '' }} label={
                    <span>
                        <Tooltip title="????????????">
                            <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.color, 1)} />
                        </Tooltip>
                                    ??????
                                </span>
                }>
                    <Row>
                        {item.color.map((thisColor, index) =>
                            <Col key={index}>
                                <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.color, index)} />
                                <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={this.deleteColor.bind(this, item.color, index)} />
                            </Col>
                        )}
                    </Row>
                </Form.Item>
                <Form.Item style={{ display: item.colorType !== 2 ? 'none' : '' }} label={
                    <span>
                        <Tooltip title="????????????">
                            <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.linearColor, 2)} />
                        </Tooltip>
                        <Tooltip title="??????????????????????????????????????????????????????????????????????????????????????????">
                            ??????*
                                    </Tooltip>
                    </span>
                }>
                    <Row>
                        {item.linearColor.map((thisColor, index) =>
                            <Col key={index}>
                                <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={this.setColor.bind(this, thisColor, 'start')} />
                                <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={this.setColor.bind(this, thisColor, 'end')} />
                                <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={this.deleteColor.bind(this, item.linearColor, index)} />
                            </Col>
                        )}
                    </Row>
                </Form.Item>
            </React.Fragment>
        );
    }

    getZoomEdit(item){
        if (item.dataZoomStyle == null) {
            item.dataZoomStyle = {
                handleStyle: {
                    colorType:1,
                    color: ['#fff'],
                    linearColor: [{
                        start: 'red',
                        end: 'blue'
                    }]
                },
                lineStyle: {
                    colorType:1,
                    color: ['#0ff'],
                    linearColor: [{
                        start: 'red',
                        end: 'blue'
                    }]
                },
                areaStyle: {
                    colorType:1,
                    color: ['#0ff'],
                    linearColor: [{
                        start: 'red',
                        end: 'blue'
                    }]
                }
            };
        }
        return (
            <Panel header="???????????????" key="5">
                <Form.Item label="????????????">
                    <Switch checked={item.dataZoom} onChange={changeDetailData.bind(this, 2, item, 'dataZoom')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <InputNumber value={item.endValue} onChange={changeDetailData.bind(this, 2, item, 'endValue')} />
                </Form.Item>
                <Form.Item label="???????????????">
                    <InputNumber value={item.rollWidth} onChange={changeDetailData.bind(this, 2, item, 'rollWidth')} />
                </Form.Item>
                <Form.Item label="???????????????">
                    <InputNumber value={item.rollHeight} onChange={changeDetailData.bind(this, 2, item, 'rollHeight')} />
                </Form.Item>
                <Form.Item label="?????????">
                    <Input value={item.rollLeft} onChange={this.changeDetailData.bind(this, 1, item, 'rollLeft')} />
                </Form.Item>
                <Form.Item label="?????????">
                    <Input value={item.rollRight} onChange={this.changeDetailData.bind(this, 1, item, 'rollRight')} />
                </Form.Item>
                <Form.Item label="?????????">
                    <Input value={item.rollUp} onChange={this.changeDetailData.bind(this, 1, item, 'rollUp')} />
                </Form.Item>
                <Form.Item label="?????????">
                    <Input value={item.rollBottom} onChange={this.changeDetailData.bind(this, 1, item, 'rollBottom')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <ColorSelect color={item.rollBorderColor} setColor={this.setColor.bind(this, item, 'rollBorderColor')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <ColorSelect color={item.rollFillerColor} setColor={this.setColor.bind(this, item, 'rollFillerColor')} />
                </Form.Item>
                <Form.Item label="???????????????">
                    <ColorSelect color={item.rollBackgroundColor} setColor={this.setColor.bind(this, item, 'rollBackgroundColor')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <Switch checked={item.showDataShadow}
                            onChange={this.changeDetailData.bind(this, 2, item, 'showDataShadow')} />
                </Form.Item>
                <Collapse>
                    <Panel header="???????????????" key="1">
                        <Form.Item label="???????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.dataZoomStyle.lineStyle, 'colorType')} value={item.dataZoomStyle.lineStyle.colorType}>
                                <Radio value={1}>?????????</Radio>
                                <Radio value={2}>?????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label={
                            <span>
                                            ??????
                                </span>
                        } style={{ display: item.dataZoomStyle.lineStyle.colorType === 1 ? '' : 'none' }}>
                            <Row>
                                {item.dataZoomStyle.lineStyle.color.map((thisColor, index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.dataZoomStyle.lineStyle.color, index)} />
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>
                        <Form.Item label={
                            <span>
                                            <Tooltip title="??????????????????????????????????????????????????????????????????????????????????????????">
                                                ??????*
                                    </Tooltip>
                                        </span>
                        } style={{ display: item.dataZoomStyle.lineStyle.colorType === 2 ? '' : 'none' }}>
                            <Row>
                                {item.dataZoomStyle.lineStyle.linearColor.map((thisColor, index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={this.setColor.bind(this, thisColor, 'start')} />
                                        <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={this.setColor.bind(this, thisColor, 'end')} />
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>
                        <Form.Item label="???????????????">
                            <InputNumber value={item.rollWidth} onChange={changeDetailData.bind(this, 2, item, 'rollWidth')} />
                        </Form.Item>
                        <Form.Item label="?????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'rollLineStyle')} value={item.rollLineStyle}>
                                <Radio value={'solid'}>??????</Radio>
                                <Radio value={'dashed'}>??????1</Radio>
                                <Radio value={'dotted'}>??????2</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="????????????">
                            <InputNumber value={item.rollOpacity} onChange={changeDetailData.bind(this, 2, item, 'rollOpacity')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="??????????????????" key="2">
                        <Form.Item label="???????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.dataZoomStyle.areaStyle, 'colorType')} value={item.dataZoomStyle.areaStyle.colorType}>
                                <Radio value={1}>?????????</Radio>
                                <Radio value={2}>?????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label={
                            <span>
                                            ??????
                                </span>
                        } style={{ display: item.dataZoomStyle.areaStyle.colorType === 1 ? '' : 'none' }}>
                            <Row>
                                {item.dataZoomStyle.areaStyle.color.map((thisColor, index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.dataZoomStyle.areaStyle.color, index)} />
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>
                        <Form.Item label={
                            <span>
                                            <Tooltip title="??????????????????????????????????????????????????????????????????????????????????????????">
                                                ??????*
                                    </Tooltip>
                                        </span>
                        } style={{ display: item.dataZoomStyle.areaStyle.colorType === 2 ? '' : 'none' }}>
                            <Row>
                                {item.dataZoomStyle.areaStyle.linearColor.map((thisColor, index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={this.setColor.bind(this, thisColor, 'start')} />
                                        <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={this.setColor.bind(this, thisColor, 'end')} />
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>
                        <Form.Item label="???????????????">
                            <InputNumber value={item.rollFillerOpacity} onChange={changeDetailData.bind(this, 2, item, 'rollFillerOpacity')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="????????????" key="3">
                        <Form.Item label="????????????">
                            <Switch checked={item.showDetail}
                                    onChange={this.changeDetailData.bind(this, 2, item, 'showDetail')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <ColorSelect color={item.rollTextColor} setColor={this.setColor.bind(this, item, 'rollTextColor')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Input value={item.rollFontSize} onChange={this.changeDetailData.bind(this, 1, item, 'rollFontSize')} />
                        </Form.Item>
                        <Form.Item label="??????????????????">
                            <ColorSelect color={item.rollTextBorderColor} setColor={this.setColor.bind(this, item, 'rollTextBorderColor')} />
                        </Form.Item>
                        <Form.Item label="??????????????????">
                            <Input value={item.rollTextBorderWidth} onChange={this.changeDetailData.bind(this, 1, item, 'rollTextBorderWidth')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="????????????" key="4">
                        <Form.Item label="????????????">
                            <Input value={item.handleSize} onChange={this.changeDetailData.bind(this, 1, item, 'handleSize')} />
                        </Form.Item>
                        <Form.Item label="???????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.dataZoomStyle.handleStyle, 'colorType')} value={item.dataZoomStyle.handleStyle.colorType}>
                                <Radio value={1}>?????????</Radio>
                                <Radio value={2}>?????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label={
                            <span>
                                            ??????
                                        </span>
                        } style={{ display: item.dataZoomStyle.handleStyle.colorType === 1 ? '' : 'none' }}>
                            <Row>
                                {item.dataZoomStyle.handleStyle.color.map((thisColor, index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.dataZoomStyle.handleStyle.color, index)} />
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>
                        <Form.Item label={
                            <span>
                                            <Tooltip title="??????????????????????????????????????????????????????????????????????????????????????????">
                                                ??????*
                                </Tooltip>
                                        </span>
                        } style={{ display: item.dataZoomStyle.handleStyle.colorType === 2 ? '' : 'none' }}>
                            <Row>
                                {item.dataZoomStyle.handleStyle.linearColor.map((thisColor, index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={this.setColor.bind(this, thisColor, 'start')} />
                                        <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={this.setColor.bind(this, thisColor, 'end')} />
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>
                        <Form.Item label="????????????">
                            <ColorSelect color={item.handleBorderColor} setColor={this.setColor.bind(this, item, 'handleBorderColor')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <InputNumber value={item.handleBorderWidth} onChange={changeDetailData.bind(this, 2, item, 'handleBorderWidth')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'handleBorderType')} value={item.handleBorderType}>
                                <Radio value={'solid'}>??????</Radio>
                                <Radio value={'dashed'}>??????1</Radio>
                                <Radio value={'dotted'}>??????2</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Panel>
        );
    }

    //????????????
    getAxisEdit(axis, axisType) {
        return axis.map((item, index) =>
            <Form {...formItemLayout24} key={index}>
                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, axis, index)}>{'??????' + (index + 1)}</Tag>
                <Form.Item label="????????????">
                    <Switch checked={item.show} onChange={this.changeDetailData.bind(this, 2, item, 'show')} />
                </Form.Item>
                <Form.Item label="????????????" >
                    <InputNumber value={item.z} onChange={changeDetailData.bind(this, 2, item, 'z')} />
                </Form.Item>
                <Form.Item label="??????">
                    <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'position')} value={item.position}>
                        <Radio value={'top'} style={{ display: axisType !== 'x' ? 'none' : '' }}>??????</Radio>
                        <Radio value={'bottom'} style={{ display: axisType !== 'x' ? 'none' : '' }}>??????</Radio>
                        <Radio value={'left'} style={{ display: axisType !== 'y' ? 'none' : '' }}>??????</Radio>
                        <Radio value={'right'} style={{ display: axisType !== 'y' ? 'none' : '' }}>??????</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="????????????">
                    <Switch checked={item.inverse} onChange={this.changeDetailData.bind(this, 2, item, 'inverse')} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title="???true????????????????????????????????????????????????????????????????????????????????????????????????(band)?????????">
                            ????????????*
                        </Tooltip>
                    }
                >
                    <Switch checked={item.boundaryGap} onChange={this.changeDetailData.bind(this, 2, item, 'boundaryGap')} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title="?????????????????????type: 'value'??????????????????????????? 0 ????????????????????? true ?????????????????????????????????????????????">
                            scale*
                        </Tooltip>
                    }
                >
                    <Switch checked={item.scale} onChange={this.changeDetailData.bind(this, 2, item, 'scale')} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title="??????????????????????????????????????????????????????????????????????????????type: 'value' ??? 'time'????????????">
                            ????????????*
                        </Tooltip>
                    }
                >
                    <InputNumber value={item.minInterval} onChange={this.changeDetailData.bind(this, 2, item, 'minInterval')} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title="???????????????????????????">
                            ?????????*
                        </Tooltip>
                    }
                >
                    <InputNumber value={item.max} onChange={this.changeDetailData.bind(this, 2, item, 'max')} />
                </Form.Item>
                <Form.Item
                    label={
                        <Tooltip title="???????????????????????????">
                            ?????????*
                        </Tooltip>
                    }
                >
                    <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'minType')} value={item.minType}>
                        <Radio value={1}>
                            ?????????<InputNumber value={item.minNum} onChange={this.changeDetailData.bind(this, 2, item, 'minNum')} />
                        </Radio>
                        <Radio value={2}>
                            ??????????????????<InputNumber value={item.minSubNum} style={{width:'60px'}} onChange={this.changeDetailData.bind(this, 2, item, 'minSubNum')} />
                        </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='????????????' >
                    <InputNumber value={item.offset} onChange={this.changeDetailData.bind(this, 2, item, 'offset')} />
                </Form.Item>
                <Collapse >
                    {this.getZoomEdit(item)}
                    <Panel header="???????????????" key="1">
                        <Form.Item label="??????">
                            <Switch checked={item.axisLine.show}
                                onChange={this.changeDetailData.bind(this, 2, item.axisLine, 'show')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <ColorSelect color={item.axisLine.lineStyle.color} setColor={this.setColor.bind(this, item.axisLine.lineStyle, 'color')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <InputNumber value={item.axisLine.lineStyle.width} min={0}
                                onChange={this.changeDetailData.bind(this, 2, item.axisLine.lineStyle, 'width')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.axisLine.lineStyle, 'type')} value={item.axisLine.lineStyle.type}>
                                <Radio value={'solid'}>??????</Radio>
                                <Radio value={'dashed'}>??????1</Radio>
                                <Radio value={'dotted'}>??????2</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="???????????????" key="2">
                        <Form.Item label="??????">
                            <Switch checked={item.axisTick.show}
                                onChange={this.changeDetailData.bind(this, 2, item.axisTick, 'show')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??????????????? boundaryGap ??? true ?????????????????????????????????????????????????????????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <Switch checked={item.axisTick.alignWithLabel}
                                onChange={this.changeDetailData.bind(this, 2, item.axisTick, 'alignWithLabel')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="???????????????????????????????????????????????????????????????????????? 0 ?????????????????????????????????????????? 1???????????????????????????????????????????????????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={item.axisTick.interval} min={0}
                                onChange={this.changeDetailData.bind(this, 2, item.axisTick, 'interval')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="?????????????????????????????????????????????">
                                    ??????*
                                </Tooltip>
                            }
                        >
                            <Switch checked={item.axisTick.inside}
                                onChange={this.changeDetailData.bind(this, 2, item.axisTick, 'inside')} />
                        </Form.Item>
                        <Form.Item label='??????' >
                            <InputNumber value={item.axisTick.length} min={0}
                                onChange={this.changeDetailData.bind(this, 2, item.axisTick, 'length')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <ColorSelect color={item.axisTick.lineStyle.color} setColor={this.setColor.bind(this, item.axisTick.lineStyle, 'color')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <InputNumber value={item.axisTick.lineStyle.width} min={0}
                                onChange={this.changeDetailData.bind(this, 2, item.axisTick.lineStyle, 'width')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.axisTick.lineStyle, 'type')} value={item.axisTick.lineStyle.type}>
                                <Radio value={'solid'}>??????</Radio>
                                <Radio value={'dashed'}>??????1</Radio>
                                <Radio value={'dotted'}>??????2</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="?????????" key="3">
                        <Form.Item label="??????">
                            <Switch checked={item.splitLine.show}
                                onChange={this.changeDetailData.bind(this, 2, item.splitLine, 'show')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="???????????????????????????????????????????????????????????????????????? 0 ?????????????????????????????????????????? 1???????????????????????????????????????????????????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={item.splitLine.interval} min={0}
                                onChange={this.changeDetailData.bind(this, 2, item.splitLine, 'interval')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <ColorSelect color={item.splitLine.lineStyle.color} setColor={this.setColor.bind(this, item.splitLine.lineStyle, 'color')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <InputNumber value={item.splitLine.lineStyle.width} min={0}
                                onChange={this.changeDetailData.bind(this, 2, item.splitLine.lineStyle, 'width')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.splitLine.lineStyle, 'type')} value={item.splitLine.lineStyle.type}>
                                <Radio value={'solid'}>??????</Radio>
                                <Radio value={'dashed'}>??????1</Radio>
                                <Radio value={'dotted'}>??????2</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="????????????" key="4">
                        <Form.Item label="??????">
                            <Switch checked={item.axisLabel.show}
                                onChange={this.changeDetailData.bind(this, 2, item.axisLabel, 'show')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="???????????????????????????????????????????????????????????????????????? 0 ?????????????????????????????????????????? 1???????????????????????????????????????????????????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={item.axisLabel.interval} min={0}
                                onChange={this.changeDetailData.bind(this, 2, item.axisLabel, 'interval')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??????????????????????????????????????????">
                                    ??????*
                                </Tooltip>
                            }
                        >
                            <Switch checked={item.axisLabel.inside}
                                onChange={this.changeDetailData.bind(this, 2, item.axisLabel, 'inside')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? -90 ?????? 90 ??????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={item.axisLabel.rotate} min={-90} max={90}
                                onChange={this.changeDetailData.bind(this, 2, item.axisLabel, 'rotate')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="???????????????????????????????????????">
                                    ??????*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={item.axisLabel.margin}
                                onChange={this.changeDetailData.bind(this, 2, item.axisLabel, 'margin')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <ColorSelect color={item.axisLabel.color} setColor={this.setColor.bind(this, item.axisLabel, 'color')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Input value={item.axisLabel.fontSize} onChange={this.changeDetailData.bind(this, 1, item.axisLabel, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <Input value={item.axisLabel.lineHeight} onChange={this.changeDetailData.bind(this, 1, item.axisLabel, 'lineHeight')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.axisLabel, 'align')} value={item.axisLabel.align}>
                                <Radio value={'left'}>?????????</Radio>
                                <Radio value={'center'}>?????????</Radio>
                                <Radio value={'right'}>?????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.axisLabel, 'verticalAlign')} value={item.axisLabel.verticalAlign}>
                                <Radio value={'top'}>?????????</Radio>
                                <Radio value={'middle'}>?????????</Radio>
                                <Radio value={'bottom'}>?????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??????????????????????????????????????????????????????">
                                    ?????????*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={item.axisLabel.formatter}
                                onChange={this.changeDetailData.bind(this, 1, item.axisLabel, 'formatter')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??????????????????????????????????????????json?????????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={item.axisLabel.rich}
                                onChange={this.changeDetailData.bind(this, 1, item.axisLabel, 'rich')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        )
    }

    getLineEdit(item) {
        return (
            <Form {...formItemLayout24}>
                <Form.Item label="x?????????" >
                    <InputNumber min={0} value={item.xAxisIndex} onChange={changeDetailData.bind(this, 2, item, 'xAxisIndex')} />
                </Form.Item>
                <Form.Item label="y?????????" >
                    <InputNumber min={0} value={item.yAxisIndex} onChange={changeDetailData.bind(this, 2, item, 'yAxisIndex')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <Switch checked={item.step}
                        onChange={this.changeDetailData.bind(this, 2, item, 'step')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <Switch checked={item.showEffect}
                        onChange={this.changeDetailData.bind(this, 2, item, 'showEffect')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <Slider
                        min={0}
                        max={1}
                        onChange={this.changeDetailData.bind(this, 2, item, 'smooth')}
                        value={item.smooth}
                        step={0.01}
                    />
                </Form.Item>
                <Collapse >
                    <Panel header="????????????" key="4">
                        <Form.Item label="????????????">
                            <Switch checked={item.itemStyle.opacity}
                                onChange={this.changeDetailData.bind(this, 2, item.itemStyle, 'opacity')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="???????????? 'emptyCircle', 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'??????????????? 'image://url' ???????????????????????? URL ??????????????????????????? dataURI??????????????? 'path://' ??????????????????????????????????????????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <Input value={item.symbol} onChange={this.changeDetailData.bind(this, 1, item, 'symbol')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group value={item.symbolColorType} onChange={changeDetailData.bind(this, 1, item, 'symbolColorType')}>
                                <Radio value={1}>?????????</Radio>
                                <Radio value={2}>?????????????????????</Radio>
                                <Radio value={3}>??????????????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {item.symbolColorType !== 3 && (
                            <Form.Item label={
                                <span>
                                <Tooltip title="????????????">
                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.itemStyle.color, 1)} />
                                </Tooltip>
                                            ????????????
                                        </span>
                            }>
                                <Row>
                                    {item.itemStyle.color.map((thisColor, index) =>
                                        <Col key={index}>
                                            <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.itemStyle.color, index)} />
                                            <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={this.deleteColor.bind(this, item.itemStyle.color, index)} />
                                        </Col>
                                    )}
                                </Row>
                            </Form.Item>
                        )}
                        {item.symbolColorType === 3 && (
                            <Collapse style={{ marginBottom: '20px' }}>
                                <Panel header="????????????" key="1">
                                    {item.symbolColorList && item.symbolColorList.map((color, index) =>
                                        <div key={index}>
                                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item.symbolColorList, index)}>{'??????' + (index + 1)}</Tag>
                                            <Form.Item label="????????????" >
                                                <InputNumber value={color.more} onChange={changeDetailData.bind(this, 2, color, 'more')} />
                                            </Form.Item>
                                            <Form.Item label="??????" >
                                                <InputNumber value={color.less} onChange={changeDetailData.bind(this, 2, color, 'less')} />
                                            </Form.Item>
                                            <Form.Item label="??????">
                                                <ColorSelect color={color.color} setColor={setColor.bind(this, color, 'color')} />
                                            </Form.Item>
                                        </div>
                                    )}
                                    <Form.Item label="">
                                        <Button type="dashed"
                                                onClick={addListItem.bind(this, item, 'symbolColorList', {})}>
                                            <Icon type="plus" /> ??????????????????
                                        </Button>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        )}
                        <Form.Item label="????????????">
                            <Input value={item.symbolSize} onChange={this.changeDetailData.bind(this, 1, item, 'symbolSize')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'showAllSymbol')} value={item.showAllSymbol}>
                                <Radio value={true}>????????????</Radio>
                                <Radio value={false}>?????????????????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="?????????" key="2">
                        <Form.Item label="????????????">
                            <Switch checked={item.lineStyle.opacity}
                                onChange={this.changeDetailData.bind(this, 2, item.lineStyle, 'opacity')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.lineStyle, 'colorType')} value={item.lineStyle.colorType}>
                                <Radio value={1}>?????????</Radio>
                                <Radio value={2}>??????????????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {item.lineStyle.colorType !== 2 && (
                            <Form.Item label={
                                <span>
                                <Tooltip title="????????????">
                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.lineStyle.color, 1)} />
                                </Tooltip>
                                            ??????
                                        </span>
                            }>
                                <Row>
                                    {item.lineStyle.color.map((thisColor, index) =>
                                        <Col key={index}>
                                            <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.lineStyle.color, index)} />
                                            <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={this.deleteColor.bind(this, item.lineStyle.color, index)} />
                                        </Col>
                                    )}
                                </Row>
                            </Form.Item>
                        )}
                        {item.lineStyle.colorType === 2 && (
                            <Collapse style={{ marginBottom: '20px' }}>
                                <Panel header="????????????" key="1">
                                    {item.lineStyle.colorList && item.lineStyle.colorList.map((color, index) =>
                                        <div key={index}>
                                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item.lineStyle.colorList, index)}>{'??????' + (index + 1)}</Tag>
                                            <Form.Item label="????????????" >
                                                <InputNumber value={color.more} onChange={changeDetailData.bind(this, 2, color, 'more')} />
                                            </Form.Item>
                                            <Form.Item label="??????" >
                                                <InputNumber value={color.less} onChange={changeDetailData.bind(this, 2, color, 'less')} />
                                            </Form.Item>
                                            <Form.Item label="??????">
                                                <ColorSelect color={color.color} setColor={setColor.bind(this, color, 'color')} />
                                            </Form.Item>
                                        </div>
                                    )}
                                    <Form.Item label="">
                                        <Button type="dashed"
                                                onClick={addListItem.bind(this, item.lineStyle, 'colorList', {})}>
                                            <Icon type="plus" /> ??????????????????
                                        </Button>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        )}
                        <Form.Item label="??????">
                            <Input value={item.lineStyle.width} onChange={this.changeDetailData.bind(this, 1, item.lineStyle, 'width')} />
                        </Form.Item>
                        <Form.Item label="?????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.lineStyle, 'type')} value={item.lineStyle.type}>
                                <Radio value={'solid'}>??????</Radio>
                                <Radio value={'dashed'}>??????1</Radio>
                                <Radio value={'dotted'}>??????2</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Panel>
                    <Panel header="??????????????????" key="3">
                        <Form.Item label="????????????">
                            <Switch checked={item.areaStyle.opacity}
                                onChange={this.changeDetailData.bind(this, 2, item.areaStyle, 'opacity')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.areaStyle, 'origin')} value={item.areaStyle.origin}>
                                <Radio value={"auto"}>??????</Radio>
                                <Radio value={"start"}>???????????????</Radio>
                                <Radio value={"end"}>???????????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.areaStyle, 'colorType')} value={item.areaStyle.colorType}>
                                <Radio value={1}>?????????</Radio>
                                <Radio value={2}>?????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item style={{ display: item.areaStyle.colorType === 2 ? 'none' : '' }} label={
                            <span>
                                <Tooltip title="????????????">
                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.areaStyle.color, 1)} />
                                </Tooltip>
                                            ??????
                                        </span>
                        }>
                            <Row>
                                {item.areaStyle.color.map((thisColor, index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor} setColor={this.setColor.bind(this, item.areaStyle.color, index)} />
                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={this.deleteColor.bind(this, item.areaStyle.color, index)} />
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>
                        <Form.Item style={{ display: item.areaStyle.colorType !== 2 ? 'none' : '' }} label={
                            <span>
                                <Tooltip title="????????????">
                                    <Icon type="plus" style={{ cursor: 'pointer', marginRight: '0.5vh' }} onClick={this.addColor.bind(this, item.areaStyle.linearColor, 2)} />
                                </Tooltip>
                                <Tooltip title="?????????????????????">
                                    ??????*
                                            </Tooltip>
                            </span>
                        }>
                            <Row>
                                {item.areaStyle.linearColor.map((thisColor, index) =>
                                    <Col key={index}>
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.start} setColor={this.setColor.bind(this, thisColor, 'start')} />
                                        <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                        <ColorSelect style={{ marginTop: '5px' }} color={thisColor.end} setColor={this.setColor.bind(this, thisColor, 'end')} />
                                        <Icon type="close" style={{ position: 'absolute', top: '12px', marginLeft: '0.5vh', cursor: 'pointer' }} onClick={this.deleteColor.bind(this, item.areaStyle.linearColor, index)} />
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>
                    </Panel>
                    <Panel header="????????????" key="1">
                        <Form.Item label="??????">
                            <Switch checked={item.label.show}
                                onChange={this.changeDetailData.bind(this, 2, item.label, 'show')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <ColorSelect color={item.label.color} setColor={this.setColor.bind(this, item.label, 'color')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??????????????????[x, y]??????????????????????????????????????????????????????">
                                    ??????*
                                </Tooltip>
                            }
                        >
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.label, 'positionType')} value={item.label.positionType}>
                                <Radio value={'top'}>??????</Radio>
                                <Radio value={'left'}>??????</Radio>
                                <Radio value={'right'}>??????</Radio>
                                <Radio value={'bottom'}>??????</Radio>
                                <Radio value={'inside'}>??????</Radio>
                                <Radio value={'insideLeft'}>????????????</Radio>
                                <Radio value={'insideRight'}>????????????</Radio>
                                <Radio value={'insideTop'}>????????????</Radio>
                                <Radio value={'insideBottom'}>????????????</Radio>
                                <Radio value={'insideTopLeft'}>????????????</Radio>
                                <Radio value={'insideBottomLeft'}>????????????</Radio>
                                <Radio value={'insideTopRight'}>????????????</Radio>
                                <Radio value={'insideBottomRight'}>????????????</Radio>
                                <Radio value={'other'}>
                                    <Input value={item.label.position} onChange={this.changeDetailData.bind(this, 1, item.label, 'position')} />
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="???????????????????????????">
                                    ??????*
                                </Tooltip>
                            }
                        >
                            <Input value={item.label.distance} onChange={this.changeDetailData.bind(this, 1, item.label, 'distance')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??? -90 ?????? 90 ???????????????????????????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={item.label.rotate} onChange={this.changeDetailData.bind(this, 2, item.label, 'rotate')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="?????????[30, 40] ?????????????????????????????? 30?????????????????? 40???">
                                    ??????*
                                </Tooltip>
                            }
                        >
                            <Input value={item.label.offset} onChange={this.changeDetailData.bind(this, 1, item.label, 'offset')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Input value={item.label.fontSize} onChange={this.changeDetailData.bind(this, 1, item.label, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.label, 'align')} value={item.label.align}>
                                <Radio value={'left'}>?????????</Radio>
                                <Radio value={'center'}>?????????</Radio>
                                <Radio value={'right'}>?????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.label, 'verticalAlign')} value={item.label.verticalAlign}>
                                <Radio value={'top'}>?????????</Radio>
                                <Radio value={'middle'}>?????????</Radio>
                                <Radio value={'bottom'}>?????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??????????????????????????????????????????????????????">
                                    ?????????*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={item.label.formatter}
                                      onChange={this.changeDetailData.bind(this, 1, item.label, 'formatter')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??????????????????????????????????????????json?????????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={item.label.rich}
                                      onChange={this.changeDetailData.bind(this, 1, item.label, 'rich')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }

    getBarEdit(item) {
        return (
            <Form {...formItemLayout24}>
                <Form.Item label="x?????????" >
                    <InputNumber min={0} value={item.xAxisIndex} onChange={changeDetailData.bind(this, 2, item, 'xAxisIndex')} />
                </Form.Item>
                <Form.Item label="y?????????" >
                    <InputNumber min={0} value={item.yAxisIndex} onChange={changeDetailData.bind(this, 2, item, 'yAxisIndex')} />
                </Form.Item>
                <Form.Item style={{ display: item.type !== 'pictorialBar' ? 'none' : '' }}
                    label={
                        <Tooltip title="???????????? 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'??????????????? 'image://url' ???????????????????????? URL ??????????????????????????? dataURI??????????????? 'path://' ??????????????????????????????????????????">
                            ??????*
                               </Tooltip>
                    }
                >
                    <Input value={item.symbol} onChange={this.changeDetailData.bind(this, 1, item, 'symbol')} />
                </Form.Item>
                <Form.Item style={{ display: item.type !== 'pictorialBar' ? 'none' : '' }}
                    label={
                        <Tooltip title="?????? [20, 10] ??????????????????20?????????10??????????????????????????? 10 ?????????????????????????????? [10, 10]??????????????????????????????????????? '120%'???['55%', 23]???">
                            ????????????*
                               </Tooltip>
                    }
                >
                    <Input value={item.symbolSize} onChange={this.changeDetailData.bind(this, 1, item, 'symbolSize')} />
                </Form.Item>
                <Form.Item style={{ display: item.type !== 'pictorialBar' ? 'none' : '' }}
                    label={
                        <Tooltip title="false/null/undefined???????????????true????????????????????????????????????????????????????????????????????????????????????????????????????????? data ???????????????a number????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????'fixed'????????????????????????????????????????????????????????????????????????????????????????????????????????? symbolBoundingData ????????????????????? data ??????????????????????????????????????????????????????">
                            ????????????*
                               </Tooltip>
                    }
                >
                    <Input value={item.symbolRepeat} onChange={this.changeDetailData.bind(this, 1, item, 'symbolRepeat')} />
                </Form.Item>
                <Form.Item style={{ display: item.type !== 'pictorialBar' ? 'none' : '' }}
                           label={
                               <Tooltip title="false/null/undefined????????????????????????????????????true?????????????????????????????????????????????????????????">
                                   ????????????*
                               </Tooltip>
                           }
                >
                    <Switch checked={item.symbolClip} onChange={changeDetailData.bind(this, 2, item, 'symbolClip')} />
                </Form.Item>
                <Form.Item label="??????">
                    <Input value={item.barWidth} onChange={this.changeDetailData.bind(this, 1, item, 'barWidth')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <Input value={item.barMaxWidth} onChange={this.changeDetailData.bind(this, 1, item, 'barMaxWidth')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <Input value={item.barMinWidth} onChange={this.changeDetailData.bind(this, 1, item, 'barMinWidth')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <Input value={item.barGap} onChange={this.changeDetailData.bind(this, 1, item, 'barGap')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <Switch checked={item.stack}
                            onChange={this.changeDetailData.bind(this, 2, item, 'stack')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'seriesColorType')} value={item.seriesColorType}>
                        <Radio value={1}>?????????</Radio>
                        <Radio value={2}>?????????????????????</Radio>
                        <Radio value={3}>??????????????????</Radio>
                    </Radio.Group>
                </Form.Item>
                {item.seriesColorType !== 3 && this.getBarColorEdit(item)}
                {item.seriesColorType === 3 && (
                    <Collapse style={{ marginBottom: '20px' }}>
                        <Panel header="????????????" key="1">
                            {item.barColorList && item.barColorList.map((color, index) =>
                                <div key={index}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, item.barColorList, index)}>{'??????' + (index + 1)}</Tag>
                                    <Form.Item label="????????????" >
                                        <InputNumber value={color.more} onChange={changeDetailData.bind(this, 2, color, 'more')} />
                                    </Form.Item>
                                    <Form.Item label="??????" >
                                        <InputNumber value={color.less} onChange={changeDetailData.bind(this, 2, color, 'less')} />
                                    </Form.Item>
                                    <Form.Item label="????????????">
                                        <Radio.Group onChange={this.changeDetailData.bind(this, 1, color, 'colorType')} value={color.colorType}>
                                            <Radio value={1}>?????????</Radio>
                                            <Radio value={2}>?????????</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    {color.colorType === 1 && (
                                        <Form.Item label="??????">
                                            <ColorSelect color={color.color} setColor={setColor.bind(this, color, 'color')} />
                                        </Form.Item>
                                    )}
                                    {color.colorType === 2 && (
                                        <Form.Item label={
                                            <Tooltip title="??????????????????????????????????????????????????????????????????????????????????????????">??????* </Tooltip>
                                        }>
                                            <Row>
                                                <Col >
                                                    <ColorSelect style={{ marginTop: '5px' }} color={color.start} setColor={this.setColor.bind(this, color, 'start')} />
                                                    <Icon type="line" style={{ position: 'relative', top: '-10px', margin: '0 0.5vh' }} />
                                                    <ColorSelect style={{ marginTop: '5px' }} color={color.end} setColor={this.setColor.bind(this, color, 'end')} />
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    )}
                                </div>
                            )}
                            <Form.Item label="">
                                <Button type="dashed"
                                        onClick={addListItem.bind(this, item, 'barColorList', {})}>
                                    <Icon type="plus" /> ??????????????????
                                </Button>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                )}
                <Form.Item label="????????????">
                    <InputNumber value={item.itemStyle.borderWidth} onChange={this.changeDetailData.bind(this, 2, item.itemStyle, 'borderWidth')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <ColorSelect color={item.itemStyle.borderColor} setColor={this.setColor.bind(this, item.itemStyle, 'borderColor')} />
                </Form.Item>
                <Form.Item label="????????????">
                    <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.itemStyle, 'borderType')} value={item.itemStyle.borderType}>
                        <Radio value={'solid'}>??????</Radio>
                        <Radio value={'dashed'}>??????1</Radio>
                        <Radio value={'dotted'}>??????2</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label={
                    <Tooltip title="?????????0????????????????????????????????? 4 ??????????????????????????????????????????????????????????????????">
                        ????????????*
                    </Tooltip>
                }
                >
                    <Input value={item.itemStyle.barBorderRadius} onChange={this.changeDetailData.bind(this, 1, item.itemStyle, 'barBorderRadius')} />
                </Form.Item>
                <Collapse >
                    <Panel header="????????????" key="1">
                        <Form.Item label="??????">
                            <Switch checked={item.label.show}
                                onChange={this.changeDetailData.bind(this, 2, item.label, 'show')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <ColorSelect color={item.label.color} setColor={this.setColor.bind(this, item.label, 'color')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??????????????????[x, y]??????????????????????????????????????????????????????">
                                    ??????*
                                </Tooltip>
                            }
                        >
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.label, 'positionType')} value={item.label.positionType}>
                                <Radio value={'top'}>??????</Radio>
                                <Radio value={'left'}>??????</Radio>
                                <Radio value={'right'}>??????</Radio>
                                <Radio value={'bottom'}>??????</Radio>
                                <Radio value={'inside'}>??????</Radio>
                                <Radio value={'insideLeft'}>????????????</Radio>
                                <Radio value={'insideRight'}>????????????</Radio>
                                <Radio value={'insideTop'}>????????????</Radio>
                                <Radio value={'insideBottom'}>????????????</Radio>
                                <Radio value={'insideTopLeft'}>????????????</Radio>
                                <Radio value={'insideBottomLeft'}>????????????</Radio>
                                <Radio value={'insideTopRight'}>????????????</Radio>
                                <Radio value={'insideBottomRight'}>????????????</Radio>
                                <Radio value={'other'}>
                                    <Input value={item.label.position} onChange={this.changeDetailData.bind(this, 1, item.label, 'position')} />
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="???????????????????????????">
                                    ??????*
                                </Tooltip>
                            }
                        >
                            <Input value={item.label.distance} onChange={this.changeDetailData.bind(this, 1, item.label, 'distance')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??? -90 ?????? 90 ???????????????????????????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={item.label.rotate} onChange={this.changeDetailData.bind(this, 2, item.label, 'rotate')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="?????????[30, 40] ?????????????????????????????? 30?????????????????? 40???">
                                    ??????*
                                </Tooltip>
                            }
                        >
                            <Input value={item.label.offset} onChange={this.changeDetailData.bind(this, 1, item.label, 'offset')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Input value={item.label.fontSize} onChange={this.changeDetailData.bind(this, 1, item.label, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.label, 'align')} value={item.label.align}>
                                <Radio value={'left'}>?????????</Radio>
                                <Radio value={'center'}>?????????</Radio>
                                <Radio value={'right'}>?????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, item.label, 'verticalAlign')} value={item.label.verticalAlign}>
                                <Radio value={'top'}>?????????</Radio>
                                <Radio value={'middle'}>?????????</Radio>
                                <Radio value={'bottom'}>?????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??????????????????????????????????????????????????????">
                                    ?????????*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={item.label.formatter}
                                onChange={this.changeDetailData.bind(this, 1, item.label, 'formatter')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??????????????????????????????????????????json?????????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={item.label.rich}
                                onChange={this.changeDetailData.bind(this, 1, item.label, 'rich')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }

    render() {
        const { style } = this.props.data;
        if (style.tooltip == null) {
            style.tooltip = {};
        }
        if (style.tooltip.textStyle == null) {
            style.tooltip.textStyle = {};
        }
        const { legend, series, tooltip } = style;
        return (
            <Collapse >
                <Panel header="grid" key="1">
                    {this.props.data.style.grid.map((item, index) =>
                        <Form {...formItemLayout24} key={index}>
                            <Form.Item
                                label={
                                    <Tooltip title='?????????????????????????????????????????????????????????'>
                                        ????????????*
                                    </Tooltip>
                                }
                            >
                                <InputNumber value={style.maxShowNum} onChange={changeDetailData.bind(this, 2, style, 'maxShowNum')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="grid ?????????????????????????????????????????????">
                                        contain*
                                    </Tooltip>
                                }
                            >
                                <Switch checked={item.containLabel} onChange={this.changeDetailData.bind(this, 2, item, 'containLabel')} />
                            </Form.Item>
                            <Form.Item label="?????????">
                                <Input value={item.left}
                                    onChange={this.changeDetailData.bind(this, 1, item, 'left')} />
                            </Form.Item>
                            <Form.Item label="?????????">
                                <Input value={item.top}
                                    onChange={this.changeDetailData.bind(this, 1, item, 'top')} />
                            </Form.Item>
                            <Form.Item label="?????????">
                                <Input value={item.right}
                                    onChange={this.changeDetailData.bind(this, 1, item, 'right')} />
                            </Form.Item>
                            <Form.Item label="?????????">
                                <Input value={item.bottom}
                                    onChange={this.changeDetailData.bind(this, 1, item, 'bottom')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="auto????????????">
                                        ???*
                                    </Tooltip>
                                }
                            >
                                <Input value={item.width}
                                    onChange={this.changeDetailData.bind(this, 1, item, 'width')} />
                            </Form.Item>
                            <Form.Item
                                label={
                                    <Tooltip title="auto????????????">
                                        ???*
                                    </Tooltip>
                                }
                            >
                                <Input value={item.height}
                                    onChange={this.changeDetailData.bind(this, 1, item, 'height')} />
                            </Form.Item>
                        </Form>
                    )}
                </Panel>
                <Panel header="??????" key="7">
                    <Form {...formItemLayout24}>
                        <Form.Item label="????????????">
                            <Switch checked={legend.show} onChange={this.changeDetailData.bind(this, 2, legend, 'show')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'selectedMode')} value={legend.selectedMode}>
                                <Radio value={true}>??????</Radio>
                                <Radio value={false}>??????</Radio>
                                <Radio value={'single'}>??????</Radio>
                                <Radio value={'multiple'}>??????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="????????????????????????????????????????????????json???????????????[1,3]???????????????????????????????????????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <Input value={legend.defaultSelected} onChange={this.changeDetailData.bind(this, 1, legend, 'defaultSelected')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Input value={legend.left} onChange={this.changeDetailData.bind(this, 1, legend, 'left')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Input value={legend.right} onChange={this.changeDetailData.bind(this, 1, legend, 'right')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Input value={legend.top} onChange={this.changeDetailData.bind(this, 1, legend, 'top')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Input value={legend.bottom} onChange={this.changeDetailData.bind(this, 1, legend, 'bottom')} />
                        </Form.Item>
                        <Form.Item label="???">
                            <Input value={legend.width} onChange={this.changeDetailData.bind(this, 1, legend, 'width')} />
                        </Form.Item>
                        <Form.Item label="???">
                            <Input value={legend.height} onChange={this.changeDetailData.bind(this, 1, legend, 'height')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'orient')} value={legend.orient}>
                                <Radio value={'horizontal'}>??????</Radio>
                                <Radio value={'vertical'}>??????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Radio.Group onChange={this.changeDetailData.bind(this, 1, legend, 'align')} value={legend.align}>
                                <Radio value={'auto'}>??????</Radio>
                                <Radio value={'left'}>?????????</Radio>
                                <Radio value={'right'}>?????????</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="?????????">
                            <InputNumber value={legend.padding} onChange={this.changeDetailData.bind(this, 2, legend, 'padding')} />
                        </Form.Item>
                        <Form.Item label="?????????">
                            <Input value={legend.itemGap} onChange={this.changeDetailData.bind(this, 1, legend, 'itemGap')} />
                        </Form.Item>
                        <Form.Item style={{ display: legend.symbolType === 2 ? 'none' : '' }}
                            label={
                                <Tooltip title="???????????? 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'??????????????? 'image://url' ???????????????????????? URL ??????????????????????????? dataURI??????????????? 'path://' ??????????????????????????????????????????">
                                    ??????*
                                </Tooltip>
                            }
                        >
                            <Input value={legend.icon} onChange={this.changeDetailData.bind(this, 1, legend, 'icon')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Input value={legend.itemWidth} onChange={this.changeDetailData.bind(this, 1, legend, 'itemWidth')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Input value={legend.itemHeight} onChange={this.changeDetailData.bind(this, 1, legend, 'itemHeight')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <ColorSelect color={legend.textStyle.color} setColor={this.setColor.bind(this, legend.textStyle, 'color')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Input value={legend.textStyle.fontSize} onChange={this.changeDetailData.bind(this, 1, legend.textStyle, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Input value={legend.textStyle.lineHeight} onChange={this.changeDetailData.bind(this, 1, legend.textStyle, 'lineHeight')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??????????????????????????????????????????????????????">
                                    ?????????*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={style.legend.formatter}
                                onChange={changeDetailData.bind(this, 1, style.legend, 'formatter')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="??????????????????????????????????????????json?????????">
                                    ????????????*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={style.legend.textStyle.rich}
                                onChange={changeDetailData.bind(this, 1, style.legend.textStyle, 'rich')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="?????????" key="4">
                    <Form {...formItemLayout24}>
                        <Form.Item label="????????????">
                            <Switch checked={tooltip.show} onChange={this.changeDetailData.bind(this, 2, tooltip, 'show')} />
                        </Form.Item>
                        <Form.Item label="?????????????????????">
                            <Switch checked={tooltip.confine} onChange={this.changeDetailData.bind(this, 2, tooltip, 'confine')} />
                        </Form.Item>
                        <Form.Item label="??????">
                            <Input value={tooltip.textStyle.fontSize} onChange={this.changeDetailData.bind(this, 1, tooltip.textStyle, 'fontSize')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title="???????????????????????????????????????????????????">
                                    ?????????*
                                </Tooltip>
                            }
                        >
                            <TextArea rows={5} value={tooltip.formatter}
                                      onChange={this.changeDetailData.bind(this, 1, tooltip, 'formatter')} />
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="x???" key="2">
                    {this.getAxisEdit(this.props.data.style.xAxis, 'x')}
                    <Form.Item label="" style={{margin:'1vh'}}>
                        <Button type="dashed"
                                onClick={addListItem.bind(this, this.props.data.style, 'xAxis', this.xAxis)}>
                            <Icon type="plus" /> ????????????
                        </Button>
                    </Form.Item>
                </Panel>
                <Panel header="y???" key="3">
                    {this.getAxisEdit(this.props.data.style.yAxis, 'y')}
                    <Form.Item label="" style={{margin:'1vh'}}>
                        <Button type="dashed"
                                onClick={addListItem.bind(this, this.props.data.style, 'yAxis', this.yAxis)}>
                            <Icon type="plus" /> ????????????
                        </Button>
                    </Form.Item>
                </Panel>
                <Panel header="????????????" key="6">
                    {series.map((item, index) => {
                        return (
                            <div key={index}>
                                <Tag closable={series.length > 1} visible={true} onClose={deleteListItem.bind(this, series, index)}>
                                    {'??????' + (index + 1)}
                                </Tag>
                                <Form.Item label="????????????" {...formItemLayout24}>
                                    <Radio.Group onChange={this.changeDetailData.bind(this, 1, item, 'type')} value={item.type}>
                                        <Radio value={'line'}>?????????</Radio>
                                        <Radio value={'bar'}>???????????????</Radio>
                                        <Radio value={'pictorialBar'}>???????????????</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                {item.type === 'line' ? this.getLineEdit(item) : this.getBarEdit(item)}
                            </div>
                        );
                    })}
                    <Form.Item label="">
                        <Button type="dashed"
                            onClick={addListItem.bind(this, this.props.data.style, 'series', this.seriesItem)}>
                            <Icon type="plus" /> ????????????
                        </Button>
                    </Form.Item>
                </Panel>
                <Panel header="????????????" key="8">
                    <Form {...formItemLayout24}>
                        <Form.Item label="????????????">
                            <Switch checked={style.autoMove} onChange={changeDetailData.bind(this, 2, style, 'autoMove')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <InputNumber value={style.autoMoveTime} onChange={changeDetailData.bind(this, 2, style, 'autoMoveTime')} />
                        </Form.Item>
                        <Form.Item label="?????????????????????">
                            <Switch checked={style.freshNotClear} onChange={changeDetailData.bind(this, 2, style, 'freshNotClear')} />
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
