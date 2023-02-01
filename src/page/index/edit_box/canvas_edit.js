import React from 'react';
import {Form, Input, Icon, Modal, Collapse, Button, Switch, Tag, Radio} from 'antd';
import ColorSelect from "../../../common/colorSelect";
import {fileUrl} from '../../../config';

import {
    changeDetailData,
    changeDetailDataWithFunction,
    iconClick,
    selectIcon,
    selectIconCancel,
    selectIconOk
} from "../../../common/editUtil";
import FileSelect from "../../../common/fileSelect";

const formItemLayout24 = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};
const { Panel } = Collapse;

export default class CanvasEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading:false,visible:false};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    changeViewData(key, event) {
        this.props.saveNowDataToHistory();
        let thisData = {...this.props.data};
        thisData[key] = event.target.value;
        this.props.updateData(thisData);
    }

    setColor(type, data) {
        this.props.saveNowDataToHistory();
        let thisData = {...this.props.data};
        const rgb = data.rgb;
        thisData[type] = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+rgb.a+')';
        this.props.updateData(thisData);
    }

    handleChange(info){
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            const result = info.file.response;
            if(result.success){
                this.props.saveNowDataToHistory();
                let thisData = {...this.props.data};
                thisData.backgroundImage = result.data[0];
                this.props.updateData(thisData);
            }else{
                Modal.error({
                    content: '上传失败！',
                });
            }
        }
    }

    addListItem(list){
        this.props.saveNowDataToHistory();
        const now = new Date().getTime();
        list.push({show:true,id:now,name:now});
        const { data } = this.props;
        this.props.updateData(data);
    }

    //删除列表内某项
    deleteList(list,index){
        this.props.saveNowDataToHistory();
        list.splice(index,1);
        const { data } = this.props;
        this.props.updateData(data);
    }

    changeDetailData(type, item, key, event){
        this.props.saveNowDataToHistory();
        item[key] = type === 1 ? event.target.value : event;
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    getShowEdit(layer){
        return (
            <React.Fragment >
                <Collapse style={{marginBottom:'1vh'}}>
                    <Panel header="具体设置" key="1">
                        <Form.Item label="数据来源" >
                            <Input value={layer.url} onChange={changeDetailData.bind(this, 1, layer, 'url')} />
                        </Form.Item>
                        <Form.Item label="依据键名" >
                            <Input value={layer.key} onChange={changeDetailData.bind(this, 1, layer, 'key')} />
                        </Form.Item>
                        <Form.Item label="依据值" >
                            <Input value={layer.value} onChange={changeDetailData.bind(this, 1, layer, 'value')} />
                        </Form.Item>
                        <Form.Item label="是否显示">
                            <Switch checked={layer.show} onChange={changeDetailDataWithFunction.bind(this, 2, layer, 'show', this.props.changeComponentsShowStatus)}/>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </React.Fragment>
        )
    }

    render() {
        const {data} = this.props;
        const { backgroundImage } = data;
        return (
            <div>
                <Form {...formItemLayout24}>
                    <Collapse defaultActiveKey={['1']} >
                        <Panel header="基础设置" key="1">
                            <Form.Item label="页面名称">
                                <Input value={this.props.data.name}
                                       onChange={this.changeViewData.bind(this, 'name')}/>
                            </Form.Item>
                            <Form.Item label="宽">
                                <Input value={this.props.data.width}
                                       onChange={this.changeViewData.bind(this, 'width')}/>
                            </Form.Item>
                            <Form.Item label="高">
                                <Input value={this.props.data.height}
                                       onChange={this.changeViewData.bind(this, 'height')}/>
                            </Form.Item>
                            <Form.Item label="自适应方式">
                                <Radio.Group value={this.props.data.fitType} onChange={this.changeViewData.bind(this, 'fitType')}>
                                    <Radio value={1}>非等比</Radio>
                                    <Radio value={2}>等比</Radio>
                                    <Radio value={3}>不缩放</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="背景色">
                                <ColorSelect color={this.props.data.backgroundColor} setColor={this.setColor.bind(this, 'backgroundColor')} />
                            </Form.Item>
                            <Form.Item label="背景图">
                                {
                                    backgroundImage ? (
                                        <img alt="" onClick={selectIcon.bind(this, data, 'backgroundImage')} src={fileUrl + '/download/' + data.backgroundImage} style={{width:'100%',height:'10vh'}} />
                                    ) : (
                                        <Button type="dashed" onClick={selectIcon.bind(this, data, 'backgroundImage')} >
                                            <Icon type="plus" /> 选择图片
                                        </Button>
                                    )
                                }
                            </Form.Item>
                        </Panel>
                        <Panel header="图层" key="2">
                            {this.props.data.layer ? (
                                this.props.data.layer.map((layer,index) =>
                                    <div key={index}>
                                        <Tag closable={true} visible={true} onClose={this.deleteList.bind(this,this.props.data.layer,index)}>{'图层' + (index + 1)}</Tag>
                                        <Form.Item label="图层名称">
                                            <Input value={layer.name}
                                                   onChange={this.changeDetailData.bind(this, 1, layer, 'name')}/>
                                        </Form.Item>
                                        <Form.Item label={"显示类型"} >
                                            <Radio.Group value={layer.showType} onChange={changeDetailData.bind(this, 1, layer, 'showType')} defaultValue={1}>
                                                <Radio value={1}>固定是否显示</Radio>
                                                <Radio value={2}>依据不同值不同显示状态</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {layer.showType !== 2 ? (
                                            <Form.Item label="是否显示">
                                                <Switch checked={layer.show} onChange={changeDetailDataWithFunction.bind(this, 2, layer, 'show', this.props.changeComponentsShowStatus)}/>
                                            </Form.Item>
                                        ):this.getShowEdit(layer)}
                                    </div>
                                )
                            ) : null}
                            <Form.Item label="">
                                <Button type="dashed" onClick={this.addListItem.bind(this,this.props.data.layer)} >
                                    <Icon type="plus" /> 添加图层
                                </Button>
                            </Form.Item>
                        </Panel>
                        <Panel header="用户校验" key="3">
                            <Form.Item label="token获取">
                                <Radio.Group value={this.props.data.tokenType} onChange={changeDetailData.bind(this, 1, this.props.data, 'tokenType')} defaultValue={1}>
                                    <Radio value={1}>地址栏获取</Radio>
                                    <Radio value={2}>session获取</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="校验地址">
                                <Input value={this.props.data.checkUrl} onChange={this.changeViewData.bind(this, 'checkUrl')}/>
                            </Form.Item>
                            <Form.Item label="登录页">
                                <Input value={this.props.data.loginPage} onChange={this.changeViewData.bind(this, 'loginPage')}/>
                            </Form.Item>
                        </Panel>
                        <Panel header="其他设置" key="4">
                            <Form.Item label="布局数据">
                                <Input value={this.props.data.layoutUrl} onChange={this.changeViewData.bind(this, 'layoutUrl')}/>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                </Form>
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
            </div>
        );
    }
}
