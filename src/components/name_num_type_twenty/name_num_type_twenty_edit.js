import React from 'react';
import {Form, Input, InputNumber, Collapse, Tooltip, Icon, Button, Tag, Radio} from 'antd';
import { addListItem, changeDetailData, deleteListItem, setColor, selectIcon, selectIconOk, selectIconCancel, iconClick } from "../../common/editUtil";
import ColorSelect from "../../common/colorSelect";
import FileSelect from "../../common/fileSelect";
import { fileUrl } from "../../config";
const { Panel } = Collapse;
export default class NameNumTypeTwentyEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="基础设置" key="1">
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="列数">
                            <InputNumber value={style.columnNum} onChange={changeDetailData.bind(this, 2, style, 'columnNum')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='列之间的空隙，单位为%（组件宽度的百分比）。'>
                                    列空隙*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.columnGap} onChange={changeDetailData.bind(this, 2, style, 'columnGap')} />
                        </Form.Item>
                        <Form.Item
                            label={
                                <Tooltip title='行之间的空隙，单位为%（组件高度的百分比）。'>
                                    行空隙*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.rowGap} onChange={changeDetailData.bind(this, 2, style, 'rowGap')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="圆环设置" key="2">
                        <Form.Item label="外环半径" >
                            <Input value={style.outRadius} onChange={changeDetailData.bind(this, 1, style, 'outRadius')} />
                        </Form.Item>
                        <Form.Item label="外环宽度" >
                            <Input value={style.MaxRadius} onChange={changeDetailData.bind(this, 1, style, 'MaxRadius')} />
                        </Form.Item>
                        <Form.Item label="外环颜色" >
                            <ColorSelect color={style.outColor} setColor={setColor.bind(this, style, 'outColor')} />
                        </Form.Item>
                        <Form.Item label="内环半径" >
                            <Input value={style.InRadius} onChange={changeDetailData.bind(this, 1, style, 'InRadius')} />
                        </Form.Item>
                        <Form.Item label="内环宽度" >
                            <Input value={style.MinRadius} onChange={changeDetailData.bind(this, 1, style, 'MinRadius')} />
                        </Form.Item>
                        <Form.Item label="内环颜色" >
                            <ColorSelect color={style.inColor} setColor={setColor.bind(this, style, 'inColor')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="值设置" key="3">
                        <Form.Item label="键名" >
                            <Input value={style.numKey} onChange={changeDetailData.bind(this, 1, style, 'numKey')} />
                        </Form.Item>
                        <Form.Item label="文字颜色" >
                            <ColorSelect color={style.textColor} setColor={setColor.bind(this, style, 'textColor')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>行高*</Tooltip>}>
                            <InputNumber value={style.lineHeight} onChange={changeDetailData.bind(this, 2, style, 'lineHeight')} />
                        </Form.Item>
                        <Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>} >
                            <InputNumber value={style.numFontSize} onChange={changeDetailData.bind(this, 2, style, 'numFontSize')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="标题设置" key="4">
                        <Form.Item label="类型" >
                            <Radio.Group value={style.titleType} onChange={changeDetailData.bind(this, 1, style, 'titleType')}>
                                <Radio.Button value={1}>文字</Radio.Button>
                                <Radio.Button value={2}>图片</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {style.titleType === 2 && (
                            <React.Fragment>
                                <Form.Item label="图片宽度" >
                                    <Input value={style.imgWidth} onChange={changeDetailData.bind(this, 1, style, 'imgWidth')} />
                                </Form.Item>
                                <Form.Item label="图片高度" >
                                    <Input value={style.imgHeight} onChange={changeDetailData.bind(this, 1, style, 'imgHeight')} />
                                </Form.Item>
                                <Form.Item label="左" >
                                    <Input value={style.left} onChange={changeDetailData.bind(this, 1, style, 'left')} />
                                </Form.Item>
                                <Form.Item label="上" >
                                    <Input value={style.top} onChange={changeDetailData.bind(this, 1, style, 'top')} />
                                </Form.Item>
                                {
                                    style.coverImgList.map((item, index) =>
                                        <div key={index} style={{ marginBottom: '24px' }}>
                                            <Tag closable={style.coverImgList.length > 1} visible={true}
                                                 onClose={deleteListItem.bind(this, style.coverImgList, index)}>
                                                {'项' + (index + 1)}</Tag>
                                            <Form.Item label="类型值" style={{ marginBottom: '0px' }}>
                                                <Input value={item.id} onChange={changeDetailData.bind(this, 1, item, 'id')} />
                                            </Form.Item>
                                            <Form.Item label="图片" >
                                                {
                                                    item.normalImg ? (
                                                        <img src={fileUrl + '/download/' + item.normalImg} alt=""
                                                             style={{ width: '104px', height: '104px' }}
                                                             onClick={selectIcon.bind(this, item, 'normalImg')} />
                                                    ) : (
                                                        <Button type="dashed"
                                                                onClick={selectIcon.bind(this, item, 'normalImg')}>
                                                            <Icon type="plus" /> 选择图标
                                                        </Button>
                                                    )
                                                }
                                            </Form.Item>
                                        </div>
                                    )
                                }
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, style, 'coverImgList', {})}>
                                        <Icon type="plus" /> 添加内容设置
                                    </Button>
                                </Form.Item>
                            </React.Fragment>
                        )}
                        {style.titleType === 1 && (
                            <React.Fragment>
                                <Form.Item label="键名" >
                                    <Input value={style.nameKey} onChange={changeDetailData.bind(this, 1, style, 'nameKey')} />
                                </Form.Item>
                                <Form.Item label="文字颜色" >
                                    <ColorSelect color={style.nameColor} setColor={setColor.bind(this, style, 'nameColor')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位em。'>行高*</Tooltip>}>
                                    <InputNumber value={style.lineHeightName} onChange={changeDetailData.bind(this, 2, style, 'lineHeightName')} />
                                </Form.Item>
                                <Form.Item label={<Tooltip title='单位em。'>字号*</Tooltip>} >
                                    <InputNumber value={style.nameFontSize} onChange={changeDetailData.bind(this, 2, style, 'nameFontSize')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                    </Panel>
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
