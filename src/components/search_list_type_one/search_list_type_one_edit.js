import React from 'react';
// import ColorSelect from "../../common/colorSelect";
import {Collapse, Form, Input, InputNumber, Radio, Button, Icon, Tag, Upload, Modal, Tooltip} from 'antd';
import ColorSelect from "../../common/colorSelect";
import {fileUrl} from "../../config";

const formItemLayout24 = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const { Panel } = Collapse;
const { TextArea } = Input;

export default class SearchListTypeOneEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    //修改内容
    changeDetailData(type, item, key, timeFlag, event){
        this.props.saveNowDataToHistory();
        item[key] = type === 1 ? event.target.value : event;
        let thisData = {...this.props.data};
        if(timeFlag){
            const now = new Date().getTime();
            item.updateTime = now;
            thisData.updateTime = now;
        }
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

    addSearch(list,type){
        this.props.saveNowDataToHistory();
        if(type === 1){
            //新增搜索类型
            list.push({name:'类型名称',keyList:[{name:'条件名称',key:'eventType',url:'',dataType:1,data:[]}]});
        }else{
            //新增搜索条件
            list.push({name:'条件名称',key:'key',url:'',dataType:1,data:[]});
        }
        let thisData = {...this.props.data};
        this.props.updateData(thisData);
    }

    //文件上传组件状态更改响应函数
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
                thisData.style.backgroundImage = result.data[0];
                this.props.updateData(thisData);
            }else{
                Modal.error({
                    content: '上传失败！',
                });
            }
        }
    }

    render() {
        const {style} = this.props.data;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <Collapse>
                <Panel header="搜索样式设置" key="2">
                    <Form {...formItemLayout24}>
                        <Form.Item label="列数">
                            <InputNumber value={style.columnNum} min={1}
                                         onChange={this.changeDetailData.bind(this, 2, style, 'columnNum', false)}/>
                        </Form.Item>
                        <Form.Item label="列空隙">
                            <Input value={style.columnGap}
                                   onChange={this.changeDetailData.bind(this, 1, style, 'columnGap', false)}/>
                        </Form.Item>
                        <Form.Item label="行空隙">
                            <Input value={style.rowGap}
                                   onChange={this.changeDetailData.bind(this, 1, style, 'rowGap', false)}/>
                        </Form.Item>
                        <Form.Item label="背景色">
                            <ColorSelect color={style.backgroundColor} setColor={this.setColor.bind(this, style, 'backgroundColor')} />
                        </Form.Item>
                        <Form.Item label="背景图">
                            <Upload
                                name="files"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={fileUrl + '/upload'}
                                onChange={this.handleChange.bind(this)}
                            >
                                {style.backgroundImage ? <img src={fileUrl + '/download/' + style.backgroundImage} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="搜索条件设置" key="3">
                    {style.searchList.map((item,index) =>
                        <div key={index} style={{marginBottom:'24px'}}>
                            <Tag closable={style.searchList.length > 1} visible={true} onClose={this.deleteList.bind(this,style.searchList,index)}>{'搜索类型' + (index + 1)}</Tag>
                            <Form.Item label="类型名称" {...formItemLayout24}>
                                <Input value={item.name} onChange={this.changeDetailData.bind(this, 1, item, 'name', false)} />
                            </Form.Item>
                            <Collapse>
                                <Panel header="条件设置" key="2">
                                    {item.keyList.map((key,keyIndex) =>
                                        <Form {...formItemLayout24} key={keyIndex}>
                                            <Tag closable={style.searchList.length > 1} visible={true} onClose={this.deleteList.bind(this,item.keyList,keyIndex)}>{'条件' + (keyIndex + 1)}</Tag>
                                            <Form.Item label="条件名称">
                                                <Input value={key.name} onChange={this.changeDetailData.bind(this, 1, key, 'name', true)} />
                                            </Form.Item>
                                            <Form.Item label="条件键名">
                                                <Input value={key.key} onChange={this.changeDetailData.bind(this, 1, key, 'key', true)} />
                                            </Form.Item>
                                            <Form.Item label="数据类型">
                                                <Radio.Group onChange={this.changeDetailData.bind(this, 1, key, 'dataType', true)} value={key.dataType}>
                                                    <Radio value={1}>json字串</Radio>
                                                    <Radio value={2}>url请求数据</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item label="字串内容" style={{display: key.dataType === 1 ? 'block' : 'none'}}>
                                                <TextArea rows={5} value={key.data}
                                                          onChange={this.changeDetailData.bind(this, 1, key, 'data', true)} />
                                            </Form.Item>
                                            <Form.Item
                                                label={
                                                    <Tooltip title='数据请求地址。返回数据示例：[{"value":"1","label":"类型1"},{"value":"2","label":"类型2"}]'>
                                                        接口地址*
                                                    </Tooltip>
                                                }
                                                style={{display: key.dataType === 2 ? 'block' : 'none'}}
                                            >
                                                <Input value={key.url} onChange={this.changeDetailData.bind(this, 1, key, 'url', true)} />
                                            </Form.Item>
                                        </Form>
                                    )}
                                    <Form.Item {...formItemLayout24} label="">
                                        <Button type="dashed" onClick={this.addSearch.bind(this,item.keyList,2)} >
                                            <Icon type="plus" /> 添加条件
                                        </Button>
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        </div>
                    )}
                    <Form.Item {...formItemLayout24} label="">
                        <Button type="dashed" onClick={this.addSearch.bind(this,style.searchList,1)} >
                            <Icon type="plus" /> 添加内容
                        </Button>
                    </Form.Item>
                </Panel>
                <Panel header="列表样式设置" key="4">
                    <Form.Item {...formItemLayout24} label="背景色">
                        <ColorSelect color={style.listStyle.backgroundColor}
                                     setColor={this.setColor.bind(this, style.listStyle, 'backgroundColor')}/>
                    </Form.Item>
                    <Collapse>
                        <Panel header="标题" key="3">
                            <Form.Item {...formItemLayout24} label="是否展示">
                                <Radio.Group value={style.listStyle.titleShow}
                                             onChange={this.changeDetailData.bind(this, 1, style.listStyle, 'titleShow', false)}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="字号大小">
                                <Input value={style.listStyle.titleFontSize}
                                       onChange={this.changeDetailData.bind(this, 1, style.listStyle, 'titleFontSize', false)}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="字号粗细">
                                <Radio.Group size="small" value={style.listStyle.titleFontWeight}
                                             onChange={this.changeDetailData.bind(this, 1, style.listStyle, 'titleFontWeight', false)}>
                                    <Radio.Button value="bold">更粗</Radio.Button>
                                    <Radio.Button value="normal">正常</Radio.Button>
                                    <Radio.Button value="lighter">更细</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="文字颜色">
                                <ColorSelect color={style.listStyle.titleColor}
                                             setColor={this.setColor.bind(this, style.listStyle, 'titleColor')}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="背景色">
                                <ColorSelect color={style.listStyle.titleBg}
                                             setColor={this.setColor.bind(this, style.listStyle, 'titleBg')}/>
                            </Form.Item>
                        </Panel>
                        <Panel header="内容" key="4">
                            <Form.Item {...formItemLayout24} label="行数">
                                <Input value={style.listStyle.rowNum}
                                       onChange={this.changeDetailData.bind(this, 1, style.listStyle, 'rowNum', false)}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="字号大小">
                                <Input value={style.listStyle.contentFontSize}
                                       onChange={this.changeDetailData.bind(this, 1, style.listStyle, 'contentFontSize', false)}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="字号粗细">
                                <Radio.Group size="small" value={style.listStyle.contentFontWeight}
                                             onChange={this.changeDetailData.bind(this, 1, style.listStyle, 'contentFontWeight', false)}>
                                    <Radio.Button value="bold">更粗</Radio.Button>
                                    <Radio.Button value="normal">正常</Radio.Button>
                                    <Radio.Button value="lighter">更细</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="文字颜色">
                                <ColorSelect color={style.listStyle.contentColor}
                                             setColor={this.setColor.bind(this, style.listStyle, 'contentColor')}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="背景色">
                                <ColorSelect color={style.listStyle.contentBg}
                                             setColor={this.setColor.bind(this, style.listStyle, 'contentBg')}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="展示浮动">
                                <Radio.Group value={style.listStyle.contentHoverShow}
                                             onChange={this.changeDetailData.bind(this, 1, style.listStyle, 'contentHoverShow', false)}>
                                    <Radio value={true}>是</Radio>
                                    <Radio value={false}>否</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="浮动文字色">
                                <ColorSelect color={style.listStyle.contentHoverColor}
                                             setColor={this.setColor.bind(this, style.listStyle, 'contentHoverColor')}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="浮动背景色">
                                <ColorSelect color={style.listStyle.contentHoverBg}
                                             setColor={this.setColor.bind(this, style.listStyle, 'contentHoverBg')}/>
                            </Form.Item>
                        </Panel>
                        <Panel header="分页" key="5">
                            <Form.Item {...formItemLayout24} label="展示分页">
                                <Radio.Group value={style.listStyle.paginationShow}
                                             onChange={this.changeDetailData.bind(this, 1, style.listStyle, 'paginationShow', false)}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="位置">
                                <Radio.Group size="small" value={style.listStyle.paginationAlign}
                                             onChange={this.changeDetailData.bind(this, 1, style.listStyle, 'paginationAlign', false)}>
                                    <Radio.Button value="left">居左</Radio.Button>
                                    <Radio.Button value="center">居中</Radio.Button>
                                    <Radio.Button value="right">居右</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="分页文字色">
                                <ColorSelect color={style.listStyle.paginationColor}
                                             setColor={this.setColor.bind(this, style.listStyle, 'paginationColor')}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="页码激活色">
                                <ColorSelect color={style.listStyle.paginationActiveColor}
                                             setColor={this.setColor.bind(this, style.listStyle, 'paginationActiveColor')}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout24} label="分页背景色">
                                <ColorSelect color={style.listStyle.paginationBg}
                                             setColor={this.setColor.bind(this, style.listStyle, 'paginationBg')}/>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                </Panel>
            </Collapse>
        );
    }
}
