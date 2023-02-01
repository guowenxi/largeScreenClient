import React from 'react';
import {Form, Input, InputNumber, Collapse, Tooltip, Radio, Button, Icon, Row, Col} from 'antd';
import {changeDetailData, setColor} from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import {fileUrl} from "../../config";
import cssStyle from "./title_with_bg.module.css";
import FileSelect from "../../common/fileSelect";

const { Panel } = Collapse;

export default class TitleWithGgEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible:false};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    //选择图标素材弹框
    selectIcon(item,key){
        this.editPart = item;
        this.editKey = key;
        this.setState({visible:true});
    }

    //暂存选中的图标素材
    imgSelect(id){
        this.selectedImg = id;
    }

    //确定选中图标素材
    handleOk(){
        this.props.saveNowDataToHistory();
        this.editPart[this.editKey] = this.selectedImg;
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
        this.setState({visible:false});
    }

    //取消选择
    handleCancel(){
        this.setState({visible:false});
    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        return (
            <Collapse >
                <Panel header="背景配置" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="颜色类型">
                            <Radio.Group onChange={changeDetailData.bind(this, 1, style, 'colorType')} value={style.colorType}>
                                <Radio value={1}>单一色</Radio>
                                <Radio value={2}>渐变色</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item style={{display:style.colorType === 2 ? 'none':''}} label="背景颜色">
                            <ColorSelect color={style.backgroundColor} setColor={setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item style={{display:style.colorType !== 2 ? 'none':''}}  label="背景颜色">
                            <Row>
                                <Col >
                                    <ColorSelect style={{marginTop:'5px'}} color={style.startColor} setColor={setColor.bind(this, style, 'startColor')} />
                                    <Icon type="line" style={{position: 'relative',top: '-10px',margin: '0 0.5vh'}} />
                                    <ColorSelect style={{marginTop:'5px'}} color={style.endColor} setColor={setColor.bind(this, style, 'endColor')} />
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item label="背景类型">
                            <Radio.Group value={style.bgType} onChange={changeDetailData.bind(this, 1, style, 'bgType')}>
                                <Radio value={1}>图片</Radio>
                                <Radio value={2}>svg背景1</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="背景图" style={{display:style.bgType !== 1 ? 'none':''}}>
                            {
                                style.backgroundImage ? (
                                    <img alt="" onClick={this.selectIcon.bind(this,style,'backgroundImage')} src={fileUrl + '/download/' + style.backgroundImage} className={cssStyle.icon}/>
                                ) : (
                                    <Button type="dashed" onClick={this.selectIcon.bind(this,style,'backgroundImage')} >
                                        <Icon type="plus" /> 选择图片
                                    </Button>
                                )
                            }
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="字块配置" key="2">
                    <Form {...formItemLayout24} >
                        <Form.Item label="标题内容" >
                            <Input value={style.title} onChange={changeDetailData.bind(this, 1, style, 'title')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='字块宽度，单位为%。'>
                                    宽*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.width} onChange={changeDetailData.bind(this, 2, style, 'width')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='字块高度，单位为%。'>
                                    高*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.height} onChange={changeDetailData.bind(this, 2, style, 'height')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='字块离组件左边界的距离，单位为%。'>
                                    左*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.left} onChange={changeDetailData.bind(this, 2, style, 'left')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='字块离组件上边界的距离，单位为%。'>
                                    上*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.top} onChange={changeDetailData.bind(this, 2, style, 'top')} />
                        </Form.Item>
                        <Form.Item label="字体大小" >
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="字体" >
                            <Input value={style.fontFamily} onChange={changeDetailData.bind(this, 1, style, 'fontFamily')} />
                        </Form.Item>
                        <Form.Item label="字体粗细" >
                            <Radio.Group value={style.fontWeight} onChange={changeDetailData.bind(this, 1, style, 'fontWeight')}>
                                <Radio.Button value="bold">粗</Radio.Button>
                                <Radio.Button value="normal">常规</Radio.Button>
                                <Radio.Button value="lighter">细</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字体颜色" >
                            <ColorSelect color={style.fontColor} setColor={setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="水平位置" >
                            <Radio.Group value={style.justifyContent} onChange={changeDetailData.bind(this, 1, style, 'justifyContent')}>
                                <Radio.Button value="flex-start">居左</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居右</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="垂直位置" >
                            <Radio.Group value={style.alignItems} onChange={changeDetailData.bind(this, 1, style, 'alignItems')}>
                                <Radio.Button value="flex-start">居上</Radio.Button>
                                <Radio.Button value="center">居中</Radio.Button>
                                <Radio.Button value="flex-end">居下</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Panel>
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
            </Collapse>
        );
    }
}
