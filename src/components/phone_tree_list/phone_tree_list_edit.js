import React from 'react';
import {Form, Input, Collapse, Switch, Tooltip, Tag, Button, Icon} from 'antd';
import ColorSelect from "../../common/colorSelect";

const { Panel } = Collapse;

export default class PhoneTreeListEdit extends React.Component {
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

    //删除列表内某项
    deleteList(list,index){
        this.props.saveNowDataToHistory();
        list.splice(index,1);
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    addListItem(list){
        this.props.saveNowDataToHistory();
        list.push({width: '20%',height: '25%',left: '80%',top:'0'});
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        return (
            <Collapse >
                <Panel header="基本信息" key="3">
                    <Form {...formItemLayout24} >
                        <Form.Item label="机器ip">
                            <Input value={style.callIp} onChange={this.changeDetailData.bind(this, 1, style, 'callIp')}/>
                        </Form.Item>
                        <Form.Item label="端口">
                            <Input value={style.callPart} onChange={this.changeDetailData.bind(this, 1, style, 'callPart')}/>
                        </Form.Item>
                        <Form.Item label="服务器地址">
                            <Input value={style.callHostInfo} onChange={this.changeDetailData.bind(this, 1, style, 'callHostInfo')}/>
                        </Form.Item>
                        <Form.Item label="服务器端口">
                            <Input value={style.callHostport} onChange={this.changeDetailData.bind(this, 1, style, 'callHostport')}/>
                        </Form.Item>
                        <Form.Item label="用户名">
                            <Input value={style.callUserName} onChange={this.changeDetailData.bind(this, 1, style, 'callUserName')}/>
                        </Form.Item>
                        <Form.Item label="密码">
                            <Input value={style.callPassword} onChange={this.changeDetailData.bind(this, 1, style, 'callPassword')}/>
                        </Form.Item>
                        <Form.Item label="排除id">
                            <Input value={style.exclusionId} onChange={this.changeDetailData.bind(this, 1, style, 'exclusionId')}/>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="树结构样式" key="1">
                    <Form {...formItemLayout24} >
                        <Form.Item label="背景色">
                            <ColorSelect color={style.backgroundColor} setColor={this.setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item label="行背景色">
                            <ColorSelect color={style.lineBackgroundColor} setColor={this.setColor.bind(this, style, 'lineBackgroundColor')} />
                        </Form.Item>
                        <Form.Item label="行高">
                            <Input value={style.lineHeight} onChange={this.changeDetailData.bind(this, 1, style, 'lineHeight')}/>
                        </Form.Item>
                        <Form.Item label="行空隙">
                            <Input value={style.lineGap} onChange={this.changeDetailData.bind(this, 1, style, 'lineGap')}/>
                        </Form.Item>
                        <Form.Item label="字体大小">
                            <Input value={style.fontSize} onChange={this.changeDetailData.bind(this, 1, style, 'fontSize')}/>
                        </Form.Item>
                        <Form.Item label="字体颜色">
                            <ColorSelect color={style.fontColor} setColor={this.setColor.bind(this, style, 'fontColor')} />
                        </Form.Item>
                        <Form.Item label="子集缩进">
                            <Input value={style.indentation} onChange={this.changeDetailData.bind(this, 1, style, 'indentation')}/>
                        </Form.Item>
                        <Form.Item label="图标大小">
                            <Input value={style.iconSize} onChange={this.changeDetailData.bind(this, 1, style, 'iconSize')}/>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="视频窗口列表" key="2">
                    <Form {...formItemLayout24} >
                        <Form.Item
                            label={
                                <Tooltip title='用于列表样式编辑时显示实时查看效果，无实际意义。'>
                                    是否显示*
                                </Tooltip>
                            }
                        >
                            <Switch checked={style.videoShow}
                                    onChange={this.changeDetailData.bind(this, 2, style, 'videoShow')}/>
                        </Form.Item>
                        <Form.Item label="背景色">
                            <ColorSelect color={style.videoBackgroundColor} setColor={this.setColor.bind(this, style, 'videoBackgroundColor')} />
                        </Form.Item>
                        <Form.Item label="字体大小">
                            <Input value={style.videoFontSize} onChange={this.changeDetailData.bind(this, 1, style, 'videoFontSize')}/>
                        </Form.Item>
                        <Form.Item label="字体颜色">
                            <ColorSelect color={style.videoFontColor} setColor={this.setColor.bind(this, style, 'videoFontColor')} />
                        </Form.Item>
                        <Collapse >
                            <Panel header="视频窗口位置" key="1">
                                {style.videoList.map((video,videoIndex) =>
                                    <div key={videoIndex}>
                                        <Tag closable={true} visible={true} onClose={this.deleteList.bind(this,style.videoList,videoIndex)}>{'视频窗口位置' + (videoIndex + 1)}</Tag>
                                        <Form.Item label="宽">
                                            <Input value={video.width} onChange={this.changeDetailData.bind(this, 1, video, 'width')}/>
                                        </Form.Item>
                                        <Form.Item label="高">
                                            <Input value={video.height} onChange={this.changeDetailData.bind(this, 1, video, 'height')}/>
                                        </Form.Item>
                                        <Form.Item label="左">
                                            <Input value={video.left} onChange={this.changeDetailData.bind(this, 1, video, 'left')}/>
                                        </Form.Item>
                                        <Form.Item label="上">
                                            <Input value={video.top} onChange={this.changeDetailData.bind(this, 1, video, 'top')}/>
                                        </Form.Item>
                                    </div>
                                )}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={this.addListItem.bind(this,style.videoList)} >
                                        <Icon type="plus" /> 添加视频窗口
                                    </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    </Form>
                </Panel>
            </Collapse>
        );
    }
}
