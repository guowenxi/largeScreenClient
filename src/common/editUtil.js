import {Switch, Button, Col, Collapse, Form, Icon, Input, InputNumber, Radio, Row, Select, Tag, Tooltip} from "antd";
import React from "react";
import {fileUrl} from "../config";
const { Panel } = Collapse;
const {TextArea} = Input;

export function changeDate(item, key, date, dateString){
    this.props.saveNowDataToHistory();
    item[key] = dateString;
    let thisData = {...this.props.data};
    this.props.updateData(thisData);
}
export function changeDateWithTime(item, key, part, date, dateString){
    this.props.saveNowDataToHistory();
    item[key] = dateString;
    let thisData = {...this.props.data};
    this.state[key] = date;
    if(part != null){
        const now = new Date().getTime();
        part.updateTime = now;
        thisData.updateTime = now;
    }
    this.props.updateData(thisData);
}
export function changeDetailData(type, item, key, event){
    this.props.saveNowDataToHistory();
    item[key] = type === 1 ? event.target.value : event;
    let thisData = {...this.props.data};
    this.props.updateData(thisData);
}
export function changeDetailDataWithTime(type, item, key, part, event){
    this.props.saveNowDataToHistory();
    item[key] = type === 1 ? event.target.value : event;
    let thisData = {...this.props.data};
    if(part != null){
        const now = new Date().getTime();
        part.updateTime = now;
        thisData.updateTime = now;
    }
    this.props.updateData(thisData);
}
export function changeDetailDataWithFunction(type, item, key, func, event){
    this.props.saveNowDataToHistory();
    item[key] = type === 1 ? event.target.value : event;
    let thisData = {...this.props.data};
    this.props.updateData(thisData);
    func();
}
export function setColor(item, key, data) {
    this.props.saveNowDataToHistory();
    const rgb = data.rgb;
    item[key] = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+rgb.a+')';
    let thisData = {...this.props.data};
    this.props.updateData(thisData);
}
export function setColorWithTime(item, key, part, data) {
    this.props.saveNowDataToHistory();
    const rgb = data.rgb;
    item[key] = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+rgb.a+')';
    let thisData = {...this.props.data};
    if(part != null){
        const now = new Date().getTime();
        part.updateTime = now;
        thisData.updateTime = now;
    }
    this.props.updateData(thisData);
}
export function deleteListItem(list,index,e){
    e.stopPropagation();
    this.props.saveNowDataToHistory();
    list.splice(index,1);
    let thisData = {...this.props.data};
    this.props.updateData(thisData);
}
export function deleteListItemWithTime(list,index,part){
    this.props.saveNowDataToHistory();
    list.splice(index,1);
    let thisData = {...this.props.data};
    if(part != null){
        const now = new Date().getTime();
        part.updateTime = now;
        thisData.updateTime = now;
    }
    this.props.updateData(thisData);
}
export function addListItem(view,key,item,part){
    this.props.saveNowDataToHistory();
    if(view[key] == null){
        view[key] = [];
    }
    if(typeof(item) === "object"){
        view[key].push(JSON.parse(JSON.stringify(item)));
    }else{
        view[key].push(item);
    }
    let thisData = {...this.props.data};
    if(part != null){
        const now = new Date().getTime();
        part.updateTime = now;
        thisData.updateTime = now;
    }
    this.props.updateData(thisData);
}
export function addListItemWithoutKey(list,item){
    this.props.saveNowDataToHistory();
    if(typeof(item) === "object"){
        list.push(JSON.parse(JSON.stringify(item)));
    }else{
        list.push(item);
    }
    let thisData = {...this.props.data};
    this.props.updateData(thisData);
}
export function selectIcon(item,key){
    this.editPart = item;
    this.editKey = key;
    this.setState({visible:true});
}
export function iconClick(id){
    this.temporaryIcon = id;
}
export function selectIconOk(item,key){
    this.props.saveNowDataToHistory();
    this.editPart[this.editKey] = this.temporaryIcon;
    this.setState({visible:false});
    let thisData = {...this.props.data};
    this.props.updateData(thisData);
}
export function selectIconCancel(){
    this.setState({visible:false});
}
export function getLayerChangeEdit(editItem,key,type){
    return (
        <div>
            <Form.Item
                label={
                    <span>
                        <Tooltip title="点击添加">
                            <Icon type="plus" style={{cursor:'pointer',marginRight:'0.5vh'}} onClick={addListItem.bind(this,editItem,key,'')}/>
                        </Tooltip>
                        <Tooltip title={"页面内需要"+(type === 1 ? "显示":"隐藏")+"的图层"}>
                            {type === 1 ? "显示":"隐藏"}*
                        </Tooltip>
                    </span>
                }
            >
                {
                    editItem[key] == null ? '' : (
                        editItem[key].map((item,index) =>
                            <Row key={index} gutter={[20, 24]}>
                                <Col span={18} >
                                    <Select value={item}
                                            onChange={changeDetailData.bind(this, 2, editItem[key], index)}>
                                        {this.props.layerList.map((layer) =>
                                            <Select.Option value={layer.id} key={layer.id}>{layer.name}</Select.Option>
                                        )}
                                    </Select>
                                </Col>
                                <Col span={4} >
                                    <Icon type="close" onClick={deleteListItem.bind(this,editItem[key],index)}/>
                                </Col>
                            </Row>
                        )
                    )
                }
            </Form.Item>
        </div>
    );
}
export function getItemInteractEdit(style){
    if(style.itemInteract == null){
        style.itemInteract = [];
    }
    this.getInteractEdit = getInteractEdit.bind(this);
    return (
        <div >
            <Collapse >
                {style.itemInteract.map((item,index) =>
                    <Panel
                        header={
                            <div>
                                {'项'+(index+1)+'交互内容'}
                                <Icon type="close" style={{marginLeft:'2em',color:'red'}} onClick={deleteListItem.bind(this, style.itemInteract, index)}/>
                            </div>
                        }
                        key={index}
                    >
                        {this.getInteractEdit(item)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style.itemInteract,index,{})}>
                                <Icon type="plus"/> 添加交互内容
                            </Button>
                        </Form.Item>
                    </Panel>
                )}
            </Collapse>
            <Form.Item label="">
                <Button type="dashed" onClick={addListItem.bind(this,style,'itemInteract',[])}>
                    <Icon type="plus"/> 添加项设置
                </Button>
            </Form.Item>
        </div>
    );
}
export function getInteractEdit(interactList){
    if(this.getInteractDetailEdit == null){
        this.getInteractDetailEdit = getInteractDetailEdit.bind(this);
    }
    return interactList && interactList.map((interact,index) =>
        <div key={index}>
            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interactList, index)}>{'交互' + (index + 1)}</Tag>
            <Form.Item label="响应类型">
                <Select value={interact.actionType} onChange={changeDetailData.bind(this, 2, interact, 'actionType')}>
                    <Select.Option value={1}>固定一种交互方式</Select.Option>
                    <Select.Option value={2}>根据某字段不同值不同交互方式</Select.Option>
                </Select>
            </Form.Item>
            {interact.actionType !== 2 && this.getInteractDetailEdit(interact)}
            {interact.actionType === 2 && (
                <div>
                    <Form.Item label="依据字段">
                        <Input value={interact.baseKey}
                               onChange={changeDetailData.bind(this, 1, interact, 'baseKey')}/>
                    </Form.Item>
                    <Form.Item label="字段类型">
                        <Radio.Group value={interact.baseKeyType} onChange={changeDetailData.bind(this, 1, interact, 'baseKeyType')}>
                            <Radio value={1}>请求结果</Radio>
                            <Radio value={2}>请求条件</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Collapse>
                        <Panel header="依据内容设置" key="1">
                            {interact.baseList && interact.baseList.map((baseItem,baseIndex) =>
                                <div key={baseIndex}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.baseList, baseIndex)}>{'方式' + (baseIndex + 1)}</Tag>
                                    <Form.Item label="值">
                                        <Radio.Group onChange={changeDetailData.bind(this, 1, baseItem, 'valueType')} value={baseItem.valueType}>
                                            <Radio value={'1'}>空</Radio>
                                            <Radio value={'2'}>非空</Radio>
                                            <Radio value={'other'}>
                                                <Input value={baseItem.value} onChange={changeDetailData.bind(this, 1, baseItem, 'value')}/>
                                            </Radio>
                                            <Radio value={'otherAll'}>其他</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    {this.getInteractDetailEdit(baseItem)}
                                </div>
                            )}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this,interact,'baseList',{})} >
                                    <Icon type="plus" /> 添加依据内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                </div>
            )}
        </div>
    )
}

export function getInteractDetailEdit(interact){
    this.getLayerChangeEdit = getLayerChangeEdit.bind(this);
    if(this.getCommonInteractEdit == null){
        this.getCommonInteractEdit = getInteractEdit.bind(this);
    }
    return (
        <div>
            <Form.Item label="交互内容">
                <Select value={interact.type} onChange={changeDetailData.bind(this, 2, interact, 'type')} >
                    <Select.Option value={0}>隐藏自身</Select.Option>
                    <Select.Option value={1}>修改条件</Select.Option>
                    <Select.Option value={2}>删除条件</Select.Option>
                    <Select.Option value={3}>显示组件</Select.Option>
                    <Select.Option value={4}>指定数据传输</Select.Option>
                    <Select.Option value={18}>结果数据传输</Select.Option>
                    <Select.Option value={5}>数据刷新</Select.Option>
                    <Select.Option value={6}>地图图层切换</Select.Option>
                    <Select.Option value={7}>页面跳转</Select.Option>
                    <Select.Option value={8}>页面图层切换</Select.Option>
                    <Select.Option value={9}>隐藏组件</Select.Option>
                    <Select.Option value={10}>切换选中</Select.Option>
                    <Select.Option value={12}>取消选中</Select.Option>
                    <Select.Option value={11}>消息传输</Select.Option>
                    <Select.Option value={13}>页面弹窗</Select.Option>
                    <Select.Option value={14}>地图内弹窗</Select.Option>
                    <Select.Option value={15}>发送请求</Select.Option>
                    <Select.Option value={16}>清空数据</Select.Option>
                    <Select.Option value={17}>切换刷新模式</Select.Option>
                    <Select.Option value={19}>还原默认</Select.Option>
                    <Select.Option value={20}>文本弹窗提示</Select.Option>
                    <Select.Option value={21}>退出登录</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="交互对象" style={{display: [0,7,8,15,21].indexOf(interact.type) >= 0 ? 'none' : ''}}>
                <Select value={interact.receiveId && interact.receiveId.toString()} onChange={changeDetailData.bind(this, 2, interact, 'receiveId')} >
                    {this.props.componentList.map((component) => {
                        if (component.id === this.props.data.id) {
                            return '';
                        } else {
                            return <Select.Option value={component.id.toString()} key={component.id}>{component.nickName}</Select.Option>;
                        }
                    })}
                </Select>
            </Form.Item>
            {interact.type === 10 && (
                <React.Fragment>
                    <Form.Item label="切换响应">
                        <Select value={interact.isInteract} onChange={changeDetailData.bind(this, 2, interact, 'isInteract')}>
                            <Select.Option value={1}>进行交互（默认）</Select.Option>
                            <Select.Option value={2}>不进行交互</Select.Option>
                        </Select>
                    </Form.Item>
                </React.Fragment>
            )}
            {interact.type === 1 && (
                <React.Fragment>
                    <Form.Item label="数据刷新">
                        <Select value={interact.reGetData} onChange={changeDetailData.bind(this, 2, interact, 'reGetData')}>
                            <Select.Option value={1}>刷新数据（默认）</Select.Option>
                            <Select.Option value={2}>仅修改条件不刷新</Select.Option>
                        </Select>
                    </Form.Item>
                </React.Fragment>
            )}
            {interact.type === 17 && (
                <React.Fragment>
                    <Form.Item label="切换响应">
                        <Select value={interact.freshMode} onChange={changeDetailData.bind(this, 2, interact, 'freshMode')}>
                            <Select.Option value={'fresh'}>刷新</Select.Option>
                            <Select.Option value={'notFresh'}>不刷新</Select.Option>
                        </Select>
                    </Form.Item>
                </React.Fragment>
            )}
            {interact.type === 15 && (
                <React.Fragment>
                    <Form.Item label="请求类型">
                        <Select value={interact.requestType} onChange={changeDetailData.bind(this, 2, interact, 'requestType')}>
                            <Select.Option value={1}>get</Select.Option>
                            <Select.Option value={2}>post</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="请求地址">
                        <Input value={interact.requestUrl} onChange={changeDetailData.bind(this, 1, interact, 'requestUrl')} />
                    </Form.Item>
                    <Form.Item label="成功提示">
                        <Input value={interact.successMessage} onChange={changeDetailData.bind(this, 1, interact, 'successMessage')} />
                    </Form.Item>
                </React.Fragment>
            )}
            {interact.type === 14 && (
                <React.Fragment>
                    <Form.Item label="弹窗主题">
                        <Select value={interact.windowTheme} onChange={this.changeDetailData.bind(this, 2, interact, 'windowTheme', null)}>
                            <Select.Option value={0}>主题一</Select.Option>
                            <Select.Option value={1}>主题二</Select.Option>
                            <Select.Option value={2}>主题三</Select.Option>
                            <Select.Option value={3}>主题四</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="弹窗模板">
                        <Select value={interact.windowType} onChange={this.changeDetailData.bind(this, 2, interact, 'windowType', null)}>
                            <Select.Option value={'grid_one'}>网格详情一</Select.Option>
                            <Select.Option value={'grid_two'}>网格详情二</Select.Option>
                            <Select.Option value={'grid_three'}>网格详情三(杭州关爱e家</Select.Option>
                            <Select.Option value={'grid_four'}>网格详情四(芦岙</Select.Option>
                            <Select.Option value={'sanitation_worker'}>环卫工</Select.Option>
                            <Select.Option value={'village'}>村社详情</Select.Option>
                            <Select.Option value={'area_building'}>楼盘统计(杭州房产</Select.Option>
                            <Select.Option value={'alert_details'}>预警详情(玉环</Select.Option>
                            <Select.Option value={'index_details'}>指数详情(玉环</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="请求地址">
                        <Input value={interact.dataUrl} onChange={changeDetailData.bind(this, 1, interact, 'dataUrl')} />
                    </Form.Item>
                    {interact.windowType === 'grid_two' && (
                        <Form.Item label="图片服务">
                            <Input value={interact.fileUrl} onChange={changeDetailData.bind(this, 1, interact, 'fileUrl')} />
                        </Form.Item>
                    )}
                    {'grid_three'.indexOf(interact.windowType) >= 0 && (
                        <Collapse>
                            <Panel header="查看站点响应交互" key="1">
                                {this.getCommonInteractEdit(interact.interactShowHome)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, interact, 'interactShowHome', {})}>
                                        <Icon type="plus" /> 添加小弹框内交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="查看地图响应交互" key="2">
                                {this.getCommonInteractEdit(interact.interactShowMap)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, interact, 'interactShowMap', {})}>
                                        <Icon type="plus" /> 添加小弹框内交互内容
                                    </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    )}
                </React.Fragment>
            )}
            {interact.type === 13 && (
                <Collapse>
                    <Panel header="弹窗设置" key="1">
                        <Form.Item label="地址键名" >
                            <Input value={interact.urlKey} onChange={changeDetailData.bind(this, 1, interact, 'urlKey')} />
                        </Form.Item>
                        <Form.Item label="标题键名" >
                            <Input value={interact.titleKey} onChange={changeDetailData.bind(this, 1, interact, 'titleKey')} />
                        </Form.Item>
                        <Form.Item label="宽" >
                            <InputNumber value={interact.windowWidth} onChange={changeDetailData.bind(this, 1, interact, 'windowWidth')} />
                        </Form.Item>
                        <Form.Item label="高" >
                            <InputNumber value={interact.windowHeight} onChange={changeDetailData.bind(this, 1, interact, 'windowHeight')} />
                        </Form.Item>
                        <Form.Item label="左" >
                            <InputNumber value={interact.windowLeft} onChange={changeDetailData.bind(this, 1, interact, 'windowLeft')} />
                        </Form.Item>
                        <Form.Item label="上" >
                            <InputNumber value={interact.windowTop} onChange={changeDetailData.bind(this, 1, interact, 'windowTop')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            )}
            {[1,3,10].indexOf(interact.type) >= 0 && (
                <div>
                    <Form.Item label="传输内容" >
                        <Select value={interact.dataType}
                                onChange={changeDetailData.bind(this, 2, interact, 'dataType')}>
                            <Select.Option value={1}>id</Select.Option>
                            <Select.Option value={2}>名称</Select.Option>
                            <Select.Option value={3}>其他</Select.Option>
                        </Select>
                    </Form.Item>
                    {interact.dataType === 3 && (
                        <Form.Item label="内容键名" >
                            <Input value={interact.dataKeyName}
                                   onChange={changeDetailData.bind(this, 1, interact, 'dataKeyName')}/>
                        </Form.Item>
                    )}
                    <Form.Item label="传输键名" >
                        <Input value={interact.keyName}
                               onChange={changeDetailData.bind(this, 1, interact, 'keyName')}/>
                    </Form.Item>
                    <Form.Item label="数据格式" >
                        <Radio.Group value={interact.dataStyle} onChange={changeDetailData.bind(this, 1, interact, 'dataStyle')}>
                            <Radio.Button value={1}>默认</Radio.Button>
                            <Radio.Button value={2}>数组</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Collapse>
                        <Panel header="多传输内容字段设置" key="1">
                            {interact.message && interact.message.map((messageItem,messageIndex) =>
                                <div key={messageIndex}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.message, messageIndex)}>{'列' + (messageIndex + 1)}</Tag>
                                    <Form.Item  label="内容来源">
                                        <Radio.Group value={messageItem.dataSource} onChange={changeDetailData.bind(this, 1, messageItem, 'dataSource')}>
                                            <Radio.Button value={1}>请求结果</Radio.Button>
                                            <Radio.Button value={2}>请求条件</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="数据键名" >
                                        <Input value={messageItem.dataKey} onChange={changeDetailData.bind(this, 1, messageItem, 'dataKey')} />
                                    </Form.Item>
                                    <Form.Item label="传输键名" >
                                        <Input value={messageItem.messageKey} onChange={changeDetailData.bind(this, 1, messageItem, 'messageKey')} />
                                    </Form.Item>
                                    <Form.Item  label="数据格式">
                                        <Radio.Group value={messageItem.dataStyle} onChange={changeDetailData.bind(this, 1, messageItem, 'dataStyle')}>
                                            <Radio.Button value={1}>默认</Radio.Button>
                                            <Radio.Button value={2}>数组</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            )}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this,interact,'message',{})}>
                                    <Icon type="plus"/> 添加传输内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                </div>
            )}
            {[4,7,11,15].indexOf(interact.type) >= 0 && (
                <Collapse>
                    <Panel header="传输内容字段设置" key="1">
                        {interact.message && interact.message.map((messageItem,messageIndex) =>
                            <div key={messageIndex}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.message, messageIndex)}>{'列' + (messageIndex + 1)}</Tag>
                                <Form.Item  label="内容来源">
                                    <Radio.Group value={messageItem.dataSource} onChange={changeDetailData.bind(this, 1, messageItem, 'dataSource')}>
                                        <Radio.Button value={1}>请求结果</Radio.Button>
                                        <Radio.Button value={2}>请求条件</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="数据键名" >
                                    <Input value={messageItem.dataKey} onChange={changeDetailData.bind(this, 1, messageItem, 'dataKey')} />
                                </Form.Item>
                                <Form.Item label="传输键名" >
                                    <Input value={messageItem.messageKey} onChange={changeDetailData.bind(this, 1, messageItem, 'messageKey')} />
                                </Form.Item>
                                <Form.Item  label="数据格式">
                                    <Radio.Group value={messageItem.dataStyle} onChange={changeDetailData.bind(this, 1, messageItem, 'dataStyle')}>
                                        <Radio.Button value={1}>默认</Radio.Button>
                                        <Radio.Button value={2}>数组</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,interact,'message',{})}>
                                <Icon type="plus"/> 添加传输内容
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            )}
            {interact.type === 21 && (
                <Form.Item label="退出接口">
                    <Input value={interact.logoutUrl} onChange={changeDetailData.bind(this, 1, interact, 'logoutUrl')} />
                </Form.Item>
            )}
            {(interact.type === 7 || interact.type === 21) && (
                <Collapse>
                    <Panel header="跳转页面设置" key="1">
                        <Form.Item label="跳转方式">
                            <Select value={interact.goToType} onChange={changeDetailData.bind(this, 2, interact, 'goToType')}>
                                <Select.Option value={1}>直接跳转</Select.Option>
                                <Select.Option value={2}>程序弹框</Select.Option>
                                <Select.Option value={3}>浏览器新窗口</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="不带参数">
                            <Switch checked={interact.notWithMessage}
                                    onChange={changeDetailData.bind(this, 2, interact, 'notWithMessage')} />
                        </Form.Item>
                        {interact.goToType === 3 && (
                            <Collapse>
                                <Panel header="弹窗设置" key="1">
                                    {/*<Form.Item label="标题键名" >*/}
                                    {/*    <Input value={interact.titleKey} onChange={changeDetailData.bind(this, 1, interact, 'titleKey')} />*/}
                                    {/*</Form.Item>*/}
                                    <Form.Item label="设置大小">
                                        <Switch checked={interact.pageSizeSet} onChange={changeDetailData.bind(this, 2, interact, 'pageSizeSet')}/>
                                    </Form.Item>
                                    <Form.Item label="宽" >
                                        <InputNumber value={interact.windowWidth} onChange={changeDetailData.bind(this, 2, interact, 'windowWidth')} />
                                    </Form.Item>
                                    <Form.Item label="高" >
                                        <InputNumber value={interact.windowHeight} onChange={changeDetailData.bind(this, 2, interact, 'windowHeight')} />
                                    </Form.Item>
                                    <Form.Item label="左" >
                                        <InputNumber value={interact.windowLeft} onChange={changeDetailData.bind(this, 2, interact, 'windowLeft')} />
                                    </Form.Item>
                                    <Form.Item label="上" >
                                        <InputNumber value={interact.windowTop} onChange={changeDetailData.bind(this, 2, interact, 'windowTop')} />
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        )}
                        {!interact.notWithMessage && (
                            <Form.Item label="token传参方式">
                                <Select value={interact.tokenType} onChange={changeDetailData.bind(this, 2, interact, 'tokenType')}>
                                    <Select.Option value={1}>默认</Select.Option>
                                    <Select.Option value={2}>{"替换{token}字符串位置"}</Select.Option>
                                </Select>
                            </Form.Item>
                        )}
                        <Form.Item label="区划id">
                            <Input value={interact.areaIdKey} onChange={changeDetailData.bind(this, 1, interact, 'areaIdKey')} />
                        </Form.Item>
                        <Form.Item label="响应类型">
                            <Select value={interact.pageActionType} onChange={changeDetailData.bind(this, 2, interact, 'pageActionType')}>
                                <Select.Option value={1}>固定页面</Select.Option>
                                <Select.Option value={2}>根据某字段不同值跳转不同页面</Select.Option>
                            </Select>
                        </Form.Item>
                        {interact.pageActionType === 2 && (
                            <React.Fragment>
                                <Form.Item label="依据字段" >
                                    <Input value={interact.pageKey} onChange={changeDetailData.bind(this, 1, interact, 'pageKey')} />
                                </Form.Item>
                                {interact.pageList && interact.pageList.map((page,pageIndex) =>
                                    <div key={pageIndex}>
                                        <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.pageList, pageIndex)}>{'项' + (pageIndex + 1)}</Tag>
                                        <Form.Item label="数据值" >
                                            <Input value={page.data} onChange={changeDetailData.bind(this, 1, page, 'data')} />
                                        </Form.Item>
                                        <Form.Item label="页面地址" >
                                            <Input value={page.pageId} onChange={changeDetailData.bind(this, 1, page, 'pageId')} />
                                        </Form.Item>
                                        <Collapse>
                                            <Panel header="弹窗设置" key="1">
                                                <Form.Item label="设置大小">
                                                    <Switch checked={page.pageSizeSet} onChange={changeDetailData.bind(this, 2, page, 'pageSizeSet')}/>
                                                </Form.Item>
                                                <Form.Item label="宽" >
                                                    <InputNumber value={page.windowWidth} onChange={changeDetailData.bind(this, 2, page, 'windowWidth')} />
                                                </Form.Item>
                                                <Form.Item label="高" >
                                                    <InputNumber value={page.windowHeight} onChange={changeDetailData.bind(this, 2, page, 'windowHeight')} />
                                                </Form.Item>
                                                <Form.Item label="左" >
                                                    <InputNumber value={page.windowLeft} onChange={changeDetailData.bind(this, 2, page, 'windowLeft')} />
                                                </Form.Item>
                                                <Form.Item label="上" >
                                                    <InputNumber value={page.windowTop} onChange={changeDetailData.bind(this, 2, page, 'windowTop')} />
                                                </Form.Item>
                                            </Panel>
                                        </Collapse>

                                    </div>
                                )}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this,interact,'pageList',{})}>
                                        <Icon type="plus"/> 添加页面跳转设置
                                    </Button>
                                </Form.Item>
                            </React.Fragment>
                        )}
                        {interact.pageActionType === 1 && (
                            <React.Fragment>
                                <Form.Item label="页面地址" >
                                    <Input value={interact.pageId} onChange={changeDetailData.bind(this, 1, interact, 'pageId')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                    </Panel>
                </Collapse>
            )}
            {interact.type === 8 && (
                <div>
                    {this.getLayerChangeEdit(interact,'showList',1)}
                    {this.getLayerChangeEdit(interact,'hideList',2)}
                </div>
            )}
            <Form.Item
                label={
                    <Tooltip title="格式为json字串。">
                        附带数据*
                    </Tooltip>
                }
            >
                <Input value={interact.remark}
                       onChange={changeDetailData.bind(this, 1, interact, 'remark')}/>
            </Form.Item>
        </div>
    );
}

export function getTypeImageEdit(data,listKey,calculateTypeKey,headText){
    return (
        <Collapse>
            <Panel header={headText ? headText:'具体图片内容设置'} key="1">
                <Form.Item label="匹配方式">
                    <Radio.Group onChange={changeDetailData.bind(this, 1, data, calculateTypeKey)} value={data[calculateTypeKey]}>
                        <Radio value={1}>相等</Radio>
                        <Radio value={2}>区间</Radio>
                    </Radio.Group>
                </Form.Item>
                {data[listKey] && data[listKey].map((image,imageIndex) =>
                    <div key={imageIndex}>
                        <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, data[listKey], imageIndex)}>
                            {'设置' + (imageIndex + 1)}
                        </Tag>
                        {data[calculateTypeKey] === 1 && (
                            <Form.Item label="值">
                                <Input value={image.value} onChange={changeDetailData.bind(this, 1, image, 'value')} />
                            </Form.Item>
                        )}
                        {data[calculateTypeKey] === 2 && (
                            <React.Fragment>
                                <Form.Item label="大于等于">
                                    <InputNumber value={image.more} onChange={changeDetailData.bind(this, 2, image, 'more')} />
                                </Form.Item>
                                <Form.Item label="小于">
                                    <InputNumber value={image.less} onChange={changeDetailData.bind(this, 2, image, 'less')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        <Form.Item label="图片">
                            {
                                image.url ? (
                                    <img alt="" onClick={selectIcon.bind(this, image, 'url')} src={fileUrl + '/download/' + image.url} style={{width:'100%',height:'10vh'}} />
                                ) : (
                                    <Button type="dashed" onClick={selectIcon.bind(this, image, 'url')} >
                                        <Icon type="plus" /> 选择图片
                                    </Button>
                                )
                            }
                        </Form.Item>
                    </div>
                )}
                <Form.Item label="">
                    <Button type="dashed" onClick={addListItem.bind(this,data,listKey,{})}>
                        <Icon type="plus"/> 添加内容设置
                    </Button>
                </Form.Item>
            </Panel>
        </Collapse>
    );
}
export function getSourceEdit(sourceFrom,key){
    if(sourceFrom[key] == null){
        sourceFrom[key] = {};
    }
    const dataSources = sourceFrom[key];
    return (
        <React.Fragment>
            <Form.Item label="来源类型">
                <Radio.Group value={dataSources.dataType} onChange={changeDetailDataWithTime.bind(this, 1, dataSources, 'dataType',dataSources)}>
                    <Radio.Button value={1}>示例</Radio.Button>
                    <Radio.Button value={2}>接口</Radio.Button>
                </Radio.Group>
            </Form.Item>
            {dataSources.dataType === 1 && (
                <Form.Item label="内容">
                    <TextArea rows={10} value={dataSources.defaultData} onChange={changeDetailDataWithTime.bind(this, 1, dataSources, 'defaultData', dataSources)} />
                </Form.Item>
            )}
            {dataSources.dataType === 2 && (
                <React.Fragment>
                    <Form.Item label="地址">
                        <Input value={dataSources.dataUrl} onChange={changeDetailDataWithTime.bind(this, 1, dataSources, 'dataUrl', dataSources)} />
                    </Form.Item>
                    <Form.Item label="参数">
                        <Input value={dataSources.dataParams} onChange={changeDetailDataWithTime.bind(this, 1, dataSources, 'dataParams', dataSources)} />
                    </Form.Item>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

export function getFlexStyleEdit(style){
    return (
        <React.Fragment>
            <Form.Item label="排列方向">
                <Radio.Group value={style.flexDirection} onChange={changeDetailData.bind(this, 1, style, 'flexDirection')}>
                    <Radio value={'row'}>水平方向</Radio>
                    <Radio value={'column'}>垂直方向</Radio>
                </Radio.Group>
            </Form.Item>
            {style.flexDirection !== 'column' ? (
                <React.Fragment>
                    <Form.Item label="水平位置" >
                        <Radio.Group value={style.justifyContent} onChange={changeDetailData.bind(this, 1, style, 'justifyContent')}>
                            <Radio value="flex-start">居左</Radio>
                            <Radio value="center">居中</Radio>
                            <Radio value="flex-end">居右</Radio>
                            <Radio value="space-between">两边</Radio>
                            <Radio value="space-around">空隙相等</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="垂直位置" >
                        <Radio.Group value={style.alignItems} onChange={changeDetailData.bind(this, 1, style, 'alignItems')}>
                            <Radio value="flex-start">居上</Radio>
                            <Radio value="center">居中</Radio>
                            <Radio value="flex-end">居下</Radio>
                        </Radio.Group>
                    </Form.Item>
                </React.Fragment>
            ):(
                <React.Fragment>
                    <Form.Item label="水平位置" >
                        <Radio.Group value={style.alignItems} onChange={changeDetailData.bind(this, 1, style, 'alignItems')}>
                            <Radio value="flex-start">居左</Radio>
                            <Radio value="center">居中</Radio>
                            <Radio value="flex-end">居右</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="垂直位置" >
                        <Radio.Group value={style.justifyContent} onChange={changeDetailData.bind(this, 1, style, 'justifyContent')}>
                            <Radio value="flex-start">居上</Radio>
                            <Radio value="center">居中</Radio>
                            <Radio value="flex-end">居下</Radio>
                            <Radio value="space-between">两边</Radio>
                            <Radio value="space-around">空隙相等</Radio>
                        </Radio.Group>
                    </Form.Item>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

export function getListLayoutEdit(style){
    if(this.getFlexStyleEdit == null){
        this.getFlexStyleEdit = getFlexStyleEdit.bind(this);
    }
    return (
        <React.Fragment>
            <Form.Item label="排列方式" >
                <Radio.Group value={style.itemPositionType} onChange={changeDetailData.bind(this, 1, style, 'itemPositionType')} defaultValue={1}>
                    <Radio value={1}>方式一</Radio>
                    <Radio value={2}>方式二</Radio>
                    <Radio value={3}>方式三</Radio>
                </Radio.Group>
            </Form.Item>
            {style.itemPositionType === 1 && (
                <React.Fragment>
                    <Form.Item label="列数">
                        <InputNumber value={style.columnNum} onChange={changeDetailData.bind(this, 2, style, 'columnNum')} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title='不设置或设置为0时自动计算行数充满容器。'>
                                行数*
                            </Tooltip>
                        }
                    >
                        <InputNumber value={style.rowNum} onChange={changeDetailData.bind(this, 2, style, 'rowNum')} />
                    </Form.Item>
                    <Form.Item label="滚轮方向" >
                        <Radio.Group value={style.scrollType} onChange={changeDetailData.bind(this, 1, style, 'scrollType')}>
                            <Radio value={'row'}>水平方向</Radio>
                            <Radio value={'column'}>垂直方向</Radio>
                        </Radio.Group>
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
                    <Form.Item label="排列方向">
                        <Radio.Group value={style.flexDirection} onChange={changeDetailData.bind(this, 1, style, 'flexDirection')}>
                            <Radio value={'row'}>水平方向</Radio>
                            <Radio value={'column'}>垂直方向</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title='排列项前空位数。'>
                                项前占位*
                            </Tooltip>
                        }
                    >
                        <InputNumber value={style.blankNum} onChange={changeDetailData.bind(this, 2, style, 'blankNum')} />
                    </Form.Item>
                </React.Fragment>
            )}
            {style.itemPositionType === 2 && (
                <React.Fragment>
                    <Form.Item label='展示块宽' >
                        <Input value={style.width} onChange={changeDetailData.bind(this, 1, style, 'width')} />
                    </Form.Item>
                    <Form.Item label='展示块高'>
                        <Input value={style.height} onChange={changeDetailData.bind(this, 1, style, 'height')} />
                    </Form.Item>
                    {style.positionList && style.positionList.map((item,index) =>
                        <React.Fragment key={index}>
                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.positionList, index)}>{'展示块' + (index + 1)}</Tag>
                            <Form.Item label='宽' >
                                <Input value={item.width} onChange={changeDetailData.bind(this, 1, item, 'width')} />
                            </Form.Item>
                            <Form.Item label='高'>
                                <Input value={item.height} onChange={changeDetailData.bind(this, 1, item, 'height')} />
                            </Form.Item>
                            <Form.Item label='左' >
                                <Input value={item.left} onChange={changeDetailData.bind(this, 1, item, 'left')} />
                            </Form.Item>
                            <Form.Item label='上'>
                                <Input value={item.top} onChange={changeDetailData.bind(this, 1, item, 'top')} />
                            </Form.Item>
                        </React.Fragment>
                    )}
                    <Form.Item label="" style={{margin:'1vh'}}>
                        <Button type="dashed"
                                onClick={addListItem.bind(this, style, 'positionList', {})}>
                            <Icon type="plus" /> 添加展示块位置
                        </Button>
                    </Form.Item>
                </React.Fragment>
            )}
            {style.itemPositionType === 3 && (
                <React.Fragment>
                    <Form.Item label='展示块宽' >
                        <Input value={style.width} onChange={changeDetailData.bind(this, 1, style, 'width')} />
                    </Form.Item>
                    <Form.Item label='展示块高'>
                        <Input value={style.height} onChange={changeDetailData.bind(this, 1, style, 'height')} />
                    </Form.Item>
                    {/*<Form.Item label="换行">*/}
                    {/*    <Switch checked={style.autoSelect}*/}
                    {/*            onChange={changeDetailData.bind(this, 2, style, 'autoSelect')} />*/}
                    {/*</Form.Item>*/}
                    {this.getFlexStyleEdit(style)}
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

export default {
    "changeDate" : changeDate,
    "changeDateWithTime" : changeDateWithTime,
    "changeDetailData" : changeDetailData,
    "changeDetailDataWithTime" : changeDetailDataWithTime,
    "changeDetailDataWithFunction" : changeDetailDataWithFunction,
    "setColor" : setColor,
    "setColorWithTime" : setColorWithTime,
    "deleteListItem" : deleteListItem,
    "deleteListItemWithTime" : deleteListItemWithTime,
    "addListItem" : addListItem,
    "addListItemWithoutKey" : addListItemWithoutKey,
    "selectIcon" : selectIcon,
    "iconClick" : iconClick,
    "selectIconOk" : selectIconOk,
    "selectIconCancel" : selectIconCancel,
    "getLayerChangeEdit" : getLayerChangeEdit
}