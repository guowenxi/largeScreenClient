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
                        <Tooltip title="????????????">
                            <Icon type="plus" style={{cursor:'pointer',marginRight:'0.5vh'}} onClick={addListItem.bind(this,editItem,key,'')}/>
                        </Tooltip>
                        <Tooltip title={"???????????????"+(type === 1 ? "??????":"??????")+"?????????"}>
                            {type === 1 ? "??????":"??????"}*
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
                                {'???'+(index+1)+'????????????'}
                                <Icon type="close" style={{marginLeft:'2em',color:'red'}} onClick={deleteListItem.bind(this, style.itemInteract, index)}/>
                            </div>
                        }
                        key={index}
                    >
                        {this.getInteractEdit(item)}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,style.itemInteract,index,{})}>
                                <Icon type="plus"/> ??????????????????
                            </Button>
                        </Form.Item>
                    </Panel>
                )}
            </Collapse>
            <Form.Item label="">
                <Button type="dashed" onClick={addListItem.bind(this,style,'itemInteract',[])}>
                    <Icon type="plus"/> ???????????????
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
            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interactList, index)}>{'??????' + (index + 1)}</Tag>
            <Form.Item label="????????????">
                <Select value={interact.actionType} onChange={changeDetailData.bind(this, 2, interact, 'actionType')}>
                    <Select.Option value={1}>????????????????????????</Select.Option>
                    <Select.Option value={2}>??????????????????????????????????????????</Select.Option>
                </Select>
            </Form.Item>
            {interact.actionType !== 2 && this.getInteractDetailEdit(interact)}
            {interact.actionType === 2 && (
                <div>
                    <Form.Item label="????????????">
                        <Input value={interact.baseKey}
                               onChange={changeDetailData.bind(this, 1, interact, 'baseKey')}/>
                    </Form.Item>
                    <Form.Item label="????????????">
                        <Radio.Group value={interact.baseKeyType} onChange={changeDetailData.bind(this, 1, interact, 'baseKeyType')}>
                            <Radio value={1}>????????????</Radio>
                            <Radio value={2}>????????????</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Collapse>
                        <Panel header="??????????????????" key="1">
                            {interact.baseList && interact.baseList.map((baseItem,baseIndex) =>
                                <div key={baseIndex}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.baseList, baseIndex)}>{'??????' + (baseIndex + 1)}</Tag>
                                    <Form.Item label="???">
                                        <Radio.Group onChange={changeDetailData.bind(this, 1, baseItem, 'valueType')} value={baseItem.valueType}>
                                            <Radio value={'1'}>???</Radio>
                                            <Radio value={'2'}>??????</Radio>
                                            <Radio value={'other'}>
                                                <Input value={baseItem.value} onChange={changeDetailData.bind(this, 1, baseItem, 'value')}/>
                                            </Radio>
                                            <Radio value={'otherAll'}>??????</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    {this.getInteractDetailEdit(baseItem)}
                                </div>
                            )}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this,interact,'baseList',{})} >
                                    <Icon type="plus" /> ??????????????????
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
            <Form.Item label="????????????">
                <Select value={interact.type} onChange={changeDetailData.bind(this, 2, interact, 'type')} >
                    <Select.Option value={0}>????????????</Select.Option>
                    <Select.Option value={1}>????????????</Select.Option>
                    <Select.Option value={2}>????????????</Select.Option>
                    <Select.Option value={3}>????????????</Select.Option>
                    <Select.Option value={4}>??????????????????</Select.Option>
                    <Select.Option value={18}>??????????????????</Select.Option>
                    <Select.Option value={5}>????????????</Select.Option>
                    <Select.Option value={6}>??????????????????</Select.Option>
                    <Select.Option value={7}>????????????</Select.Option>
                    <Select.Option value={8}>??????????????????</Select.Option>
                    <Select.Option value={9}>????????????</Select.Option>
                    <Select.Option value={10}>????????????</Select.Option>
                    <Select.Option value={12}>????????????</Select.Option>
                    <Select.Option value={11}>????????????</Select.Option>
                    <Select.Option value={13}>????????????</Select.Option>
                    <Select.Option value={14}>???????????????</Select.Option>
                    <Select.Option value={15}>????????????</Select.Option>
                    <Select.Option value={16}>????????????</Select.Option>
                    <Select.Option value={17}>??????????????????</Select.Option>
                    <Select.Option value={19}>????????????</Select.Option>
                    <Select.Option value={20}>??????????????????</Select.Option>
                    <Select.Option value={21}>????????????</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="????????????" style={{display: [0,7,8,15,21].indexOf(interact.type) >= 0 ? 'none' : ''}}>
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
                    <Form.Item label="????????????">
                        <Select value={interact.isInteract} onChange={changeDetailData.bind(this, 2, interact, 'isInteract')}>
                            <Select.Option value={1}>????????????????????????</Select.Option>
                            <Select.Option value={2}>???????????????</Select.Option>
                        </Select>
                    </Form.Item>
                </React.Fragment>
            )}
            {interact.type === 1 && (
                <React.Fragment>
                    <Form.Item label="????????????">
                        <Select value={interact.reGetData} onChange={changeDetailData.bind(this, 2, interact, 'reGetData')}>
                            <Select.Option value={1}>????????????????????????</Select.Option>
                            <Select.Option value={2}>????????????????????????</Select.Option>
                        </Select>
                    </Form.Item>
                </React.Fragment>
            )}
            {interact.type === 17 && (
                <React.Fragment>
                    <Form.Item label="????????????">
                        <Select value={interact.freshMode} onChange={changeDetailData.bind(this, 2, interact, 'freshMode')}>
                            <Select.Option value={'fresh'}>??????</Select.Option>
                            <Select.Option value={'notFresh'}>?????????</Select.Option>
                        </Select>
                    </Form.Item>
                </React.Fragment>
            )}
            {interact.type === 15 && (
                <React.Fragment>
                    <Form.Item label="????????????">
                        <Select value={interact.requestType} onChange={changeDetailData.bind(this, 2, interact, 'requestType')}>
                            <Select.Option value={1}>get</Select.Option>
                            <Select.Option value={2}>post</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="????????????">
                        <Input value={interact.requestUrl} onChange={changeDetailData.bind(this, 1, interact, 'requestUrl')} />
                    </Form.Item>
                    <Form.Item label="????????????">
                        <Input value={interact.successMessage} onChange={changeDetailData.bind(this, 1, interact, 'successMessage')} />
                    </Form.Item>
                </React.Fragment>
            )}
            {interact.type === 14 && (
                <React.Fragment>
                    <Form.Item label="????????????">
                        <Select value={interact.windowTheme} onChange={this.changeDetailData.bind(this, 2, interact, 'windowTheme', null)}>
                            <Select.Option value={0}>?????????</Select.Option>
                            <Select.Option value={1}>?????????</Select.Option>
                            <Select.Option value={2}>?????????</Select.Option>
                            <Select.Option value={3}>?????????</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="????????????">
                        <Select value={interact.windowType} onChange={this.changeDetailData.bind(this, 2, interact, 'windowType', null)}>
                            <Select.Option value={'grid_one'}>???????????????</Select.Option>
                            <Select.Option value={'grid_two'}>???????????????</Select.Option>
                            <Select.Option value={'grid_three'}>???????????????(????????????e???</Select.Option>
                            <Select.Option value={'grid_four'}>???????????????(??????</Select.Option>
                            <Select.Option value={'sanitation_worker'}>?????????</Select.Option>
                            <Select.Option value={'village'}>????????????</Select.Option>
                            <Select.Option value={'area_building'}>????????????(????????????</Select.Option>
                            <Select.Option value={'alert_details'}>????????????(??????</Select.Option>
                            <Select.Option value={'index_details'}>????????????(??????</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="????????????">
                        <Input value={interact.dataUrl} onChange={changeDetailData.bind(this, 1, interact, 'dataUrl')} />
                    </Form.Item>
                    {interact.windowType === 'grid_two' && (
                        <Form.Item label="????????????">
                            <Input value={interact.fileUrl} onChange={changeDetailData.bind(this, 1, interact, 'fileUrl')} />
                        </Form.Item>
                    )}
                    {'grid_three'.indexOf(interact.windowType) >= 0 && (
                        <Collapse>
                            <Panel header="????????????????????????" key="1">
                                {this.getCommonInteractEdit(interact.interactShowHome)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, interact, 'interactShowHome', {})}>
                                        <Icon type="plus" /> ??????????????????????????????
                                    </Button>
                                </Form.Item>
                            </Panel>
                            <Panel header="????????????????????????" key="2">
                                {this.getCommonInteractEdit(interact.interactShowMap)}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this, interact, 'interactShowMap', {})}>
                                        <Icon type="plus" /> ??????????????????????????????
                                    </Button>
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    )}
                </React.Fragment>
            )}
            {interact.type === 13 && (
                <Collapse>
                    <Panel header="????????????" key="1">
                        <Form.Item label="????????????" >
                            <Input value={interact.urlKey} onChange={changeDetailData.bind(this, 1, interact, 'urlKey')} />
                        </Form.Item>
                        <Form.Item label="????????????" >
                            <Input value={interact.titleKey} onChange={changeDetailData.bind(this, 1, interact, 'titleKey')} />
                        </Form.Item>
                        <Form.Item label="???" >
                            <InputNumber value={interact.windowWidth} onChange={changeDetailData.bind(this, 1, interact, 'windowWidth')} />
                        </Form.Item>
                        <Form.Item label="???" >
                            <InputNumber value={interact.windowHeight} onChange={changeDetailData.bind(this, 1, interact, 'windowHeight')} />
                        </Form.Item>
                        <Form.Item label="???" >
                            <InputNumber value={interact.windowLeft} onChange={changeDetailData.bind(this, 1, interact, 'windowLeft')} />
                        </Form.Item>
                        <Form.Item label="???" >
                            <InputNumber value={interact.windowTop} onChange={changeDetailData.bind(this, 1, interact, 'windowTop')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            )}
            {[1,3,10].indexOf(interact.type) >= 0 && (
                <div>
                    <Form.Item label="????????????" >
                        <Select value={interact.dataType}
                                onChange={changeDetailData.bind(this, 2, interact, 'dataType')}>
                            <Select.Option value={1}>id</Select.Option>
                            <Select.Option value={2}>??????</Select.Option>
                            <Select.Option value={3}>??????</Select.Option>
                        </Select>
                    </Form.Item>
                    {interact.dataType === 3 && (
                        <Form.Item label="????????????" >
                            <Input value={interact.dataKeyName}
                                   onChange={changeDetailData.bind(this, 1, interact, 'dataKeyName')}/>
                        </Form.Item>
                    )}
                    <Form.Item label="????????????" >
                        <Input value={interact.keyName}
                               onChange={changeDetailData.bind(this, 1, interact, 'keyName')}/>
                    </Form.Item>
                    <Form.Item label="????????????" >
                        <Radio.Group value={interact.dataStyle} onChange={changeDetailData.bind(this, 1, interact, 'dataStyle')}>
                            <Radio.Button value={1}>??????</Radio.Button>
                            <Radio.Button value={2}>??????</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Collapse>
                        <Panel header="???????????????????????????" key="1">
                            {interact.message && interact.message.map((messageItem,messageIndex) =>
                                <div key={messageIndex}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.message, messageIndex)}>{'???' + (messageIndex + 1)}</Tag>
                                    <Form.Item  label="????????????">
                                        <Radio.Group value={messageItem.dataSource} onChange={changeDetailData.bind(this, 1, messageItem, 'dataSource')}>
                                            <Radio.Button value={1}>????????????</Radio.Button>
                                            <Radio.Button value={2}>????????????</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label="????????????" >
                                        <Input value={messageItem.dataKey} onChange={changeDetailData.bind(this, 1, messageItem, 'dataKey')} />
                                    </Form.Item>
                                    <Form.Item label="????????????" >
                                        <Input value={messageItem.messageKey} onChange={changeDetailData.bind(this, 1, messageItem, 'messageKey')} />
                                    </Form.Item>
                                    <Form.Item  label="????????????">
                                        <Radio.Group value={messageItem.dataStyle} onChange={changeDetailData.bind(this, 1, messageItem, 'dataStyle')}>
                                            <Radio.Button value={1}>??????</Radio.Button>
                                            <Radio.Button value={2}>??????</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            )}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this,interact,'message',{})}>
                                    <Icon type="plus"/> ??????????????????
                                </Button>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                </div>
            )}
            {[4,7,11,15].indexOf(interact.type) >= 0 && (
                <Collapse>
                    <Panel header="????????????????????????" key="1">
                        {interact.message && interact.message.map((messageItem,messageIndex) =>
                            <div key={messageIndex}>
                                <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.message, messageIndex)}>{'???' + (messageIndex + 1)}</Tag>
                                <Form.Item  label="????????????">
                                    <Radio.Group value={messageItem.dataSource} onChange={changeDetailData.bind(this, 1, messageItem, 'dataSource')}>
                                        <Radio.Button value={1}>????????????</Radio.Button>
                                        <Radio.Button value={2}>????????????</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="????????????" >
                                    <Input value={messageItem.dataKey} onChange={changeDetailData.bind(this, 1, messageItem, 'dataKey')} />
                                </Form.Item>
                                <Form.Item label="????????????" >
                                    <Input value={messageItem.messageKey} onChange={changeDetailData.bind(this, 1, messageItem, 'messageKey')} />
                                </Form.Item>
                                <Form.Item  label="????????????">
                                    <Radio.Group value={messageItem.dataStyle} onChange={changeDetailData.bind(this, 1, messageItem, 'dataStyle')}>
                                        <Radio.Button value={1}>??????</Radio.Button>
                                        <Radio.Button value={2}>??????</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item label="">
                            <Button type="dashed" onClick={addListItem.bind(this,interact,'message',{})}>
                                <Icon type="plus"/> ??????????????????
                            </Button>
                        </Form.Item>
                    </Panel>
                </Collapse>
            )}
            {interact.type === 21 && (
                <Form.Item label="????????????">
                    <Input value={interact.logoutUrl} onChange={changeDetailData.bind(this, 1, interact, 'logoutUrl')} />
                </Form.Item>
            )}
            {(interact.type === 7 || interact.type === 21) && (
                <Collapse>
                    <Panel header="??????????????????" key="1">
                        <Form.Item label="????????????">
                            <Select value={interact.goToType} onChange={changeDetailData.bind(this, 2, interact, 'goToType')}>
                                <Select.Option value={1}>????????????</Select.Option>
                                <Select.Option value={2}>????????????</Select.Option>
                                <Select.Option value={3}>??????????????????</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Switch checked={interact.notWithMessage}
                                    onChange={changeDetailData.bind(this, 2, interact, 'notWithMessage')} />
                        </Form.Item>
                        {interact.goToType === 3 && (
                            <Collapse>
                                <Panel header="????????????" key="1">
                                    {/*<Form.Item label="????????????" >*/}
                                    {/*    <Input value={interact.titleKey} onChange={changeDetailData.bind(this, 1, interact, 'titleKey')} />*/}
                                    {/*</Form.Item>*/}
                                    <Form.Item label="????????????">
                                        <Switch checked={interact.pageSizeSet} onChange={changeDetailData.bind(this, 2, interact, 'pageSizeSet')}/>
                                    </Form.Item>
                                    <Form.Item label="???" >
                                        <InputNumber value={interact.windowWidth} onChange={changeDetailData.bind(this, 2, interact, 'windowWidth')} />
                                    </Form.Item>
                                    <Form.Item label="???" >
                                        <InputNumber value={interact.windowHeight} onChange={changeDetailData.bind(this, 2, interact, 'windowHeight')} />
                                    </Form.Item>
                                    <Form.Item label="???" >
                                        <InputNumber value={interact.windowLeft} onChange={changeDetailData.bind(this, 2, interact, 'windowLeft')} />
                                    </Form.Item>
                                    <Form.Item label="???" >
                                        <InputNumber value={interact.windowTop} onChange={changeDetailData.bind(this, 2, interact, 'windowTop')} />
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        )}
                        {!interact.notWithMessage && (
                            <Form.Item label="token????????????">
                                <Select value={interact.tokenType} onChange={changeDetailData.bind(this, 2, interact, 'tokenType')}>
                                    <Select.Option value={1}>??????</Select.Option>
                                    <Select.Option value={2}>{"??????{token}???????????????"}</Select.Option>
                                </Select>
                            </Form.Item>
                        )}
                        <Form.Item label="??????id">
                            <Input value={interact.areaIdKey} onChange={changeDetailData.bind(this, 1, interact, 'areaIdKey')} />
                        </Form.Item>
                        <Form.Item label="????????????">
                            <Select value={interact.pageActionType} onChange={changeDetailData.bind(this, 2, interact, 'pageActionType')}>
                                <Select.Option value={1}>????????????</Select.Option>
                                <Select.Option value={2}>??????????????????????????????????????????</Select.Option>
                            </Select>
                        </Form.Item>
                        {interact.pageActionType === 2 && (
                            <React.Fragment>
                                <Form.Item label="????????????" >
                                    <Input value={interact.pageKey} onChange={changeDetailData.bind(this, 1, interact, 'pageKey')} />
                                </Form.Item>
                                {interact.pageList && interact.pageList.map((page,pageIndex) =>
                                    <div key={pageIndex}>
                                        <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, interact.pageList, pageIndex)}>{'???' + (pageIndex + 1)}</Tag>
                                        <Form.Item label="?????????" >
                                            <Input value={page.data} onChange={changeDetailData.bind(this, 1, page, 'data')} />
                                        </Form.Item>
                                        <Form.Item label="????????????" >
                                            <Input value={page.pageId} onChange={changeDetailData.bind(this, 1, page, 'pageId')} />
                                        </Form.Item>
                                        <Collapse>
                                            <Panel header="????????????" key="1">
                                                <Form.Item label="????????????">
                                                    <Switch checked={page.pageSizeSet} onChange={changeDetailData.bind(this, 2, page, 'pageSizeSet')}/>
                                                </Form.Item>
                                                <Form.Item label="???" >
                                                    <InputNumber value={page.windowWidth} onChange={changeDetailData.bind(this, 2, page, 'windowWidth')} />
                                                </Form.Item>
                                                <Form.Item label="???" >
                                                    <InputNumber value={page.windowHeight} onChange={changeDetailData.bind(this, 2, page, 'windowHeight')} />
                                                </Form.Item>
                                                <Form.Item label="???" >
                                                    <InputNumber value={page.windowLeft} onChange={changeDetailData.bind(this, 2, page, 'windowLeft')} />
                                                </Form.Item>
                                                <Form.Item label="???" >
                                                    <InputNumber value={page.windowTop} onChange={changeDetailData.bind(this, 2, page, 'windowTop')} />
                                                </Form.Item>
                                            </Panel>
                                        </Collapse>

                                    </div>
                                )}
                                <Form.Item label="">
                                    <Button type="dashed" onClick={addListItem.bind(this,interact,'pageList',{})}>
                                        <Icon type="plus"/> ????????????????????????
                                    </Button>
                                </Form.Item>
                            </React.Fragment>
                        )}
                        {interact.pageActionType === 1 && (
                            <React.Fragment>
                                <Form.Item label="????????????" >
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
                    <Tooltip title="?????????json?????????">
                        ????????????*
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
            <Panel header={headText ? headText:'????????????????????????'} key="1">
                <Form.Item label="????????????">
                    <Radio.Group onChange={changeDetailData.bind(this, 1, data, calculateTypeKey)} value={data[calculateTypeKey]}>
                        <Radio value={1}>??????</Radio>
                        <Radio value={2}>??????</Radio>
                    </Radio.Group>
                </Form.Item>
                {data[listKey] && data[listKey].map((image,imageIndex) =>
                    <div key={imageIndex}>
                        <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, data[listKey], imageIndex)}>
                            {'??????' + (imageIndex + 1)}
                        </Tag>
                        {data[calculateTypeKey] === 1 && (
                            <Form.Item label="???">
                                <Input value={image.value} onChange={changeDetailData.bind(this, 1, image, 'value')} />
                            </Form.Item>
                        )}
                        {data[calculateTypeKey] === 2 && (
                            <React.Fragment>
                                <Form.Item label="????????????">
                                    <InputNumber value={image.more} onChange={changeDetailData.bind(this, 2, image, 'more')} />
                                </Form.Item>
                                <Form.Item label="??????">
                                    <InputNumber value={image.less} onChange={changeDetailData.bind(this, 2, image, 'less')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        <Form.Item label="??????">
                            {
                                image.url ? (
                                    <img alt="" onClick={selectIcon.bind(this, image, 'url')} src={fileUrl + '/download/' + image.url} style={{width:'100%',height:'10vh'}} />
                                ) : (
                                    <Button type="dashed" onClick={selectIcon.bind(this, image, 'url')} >
                                        <Icon type="plus" /> ????????????
                                    </Button>
                                )
                            }
                        </Form.Item>
                    </div>
                )}
                <Form.Item label="">
                    <Button type="dashed" onClick={addListItem.bind(this,data,listKey,{})}>
                        <Icon type="plus"/> ??????????????????
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
            <Form.Item label="????????????">
                <Radio.Group value={dataSources.dataType} onChange={changeDetailDataWithTime.bind(this, 1, dataSources, 'dataType',dataSources)}>
                    <Radio.Button value={1}>??????</Radio.Button>
                    <Radio.Button value={2}>??????</Radio.Button>
                </Radio.Group>
            </Form.Item>
            {dataSources.dataType === 1 && (
                <Form.Item label="??????">
                    <TextArea rows={10} value={dataSources.defaultData} onChange={changeDetailDataWithTime.bind(this, 1, dataSources, 'defaultData', dataSources)} />
                </Form.Item>
            )}
            {dataSources.dataType === 2 && (
                <React.Fragment>
                    <Form.Item label="??????">
                        <Input value={dataSources.dataUrl} onChange={changeDetailDataWithTime.bind(this, 1, dataSources, 'dataUrl', dataSources)} />
                    </Form.Item>
                    <Form.Item label="??????">
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
            <Form.Item label="????????????">
                <Radio.Group value={style.flexDirection} onChange={changeDetailData.bind(this, 1, style, 'flexDirection')}>
                    <Radio value={'row'}>????????????</Radio>
                    <Radio value={'column'}>????????????</Radio>
                </Radio.Group>
            </Form.Item>
            {style.flexDirection !== 'column' ? (
                <React.Fragment>
                    <Form.Item label="????????????" >
                        <Radio.Group value={style.justifyContent} onChange={changeDetailData.bind(this, 1, style, 'justifyContent')}>
                            <Radio value="flex-start">??????</Radio>
                            <Radio value="center">??????</Radio>
                            <Radio value="flex-end">??????</Radio>
                            <Radio value="space-between">??????</Radio>
                            <Radio value="space-around">????????????</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="????????????" >
                        <Radio.Group value={style.alignItems} onChange={changeDetailData.bind(this, 1, style, 'alignItems')}>
                            <Radio value="flex-start">??????</Radio>
                            <Radio value="center">??????</Radio>
                            <Radio value="flex-end">??????</Radio>
                        </Radio.Group>
                    </Form.Item>
                </React.Fragment>
            ):(
                <React.Fragment>
                    <Form.Item label="????????????" >
                        <Radio.Group value={style.alignItems} onChange={changeDetailData.bind(this, 1, style, 'alignItems')}>
                            <Radio value="flex-start">??????</Radio>
                            <Radio value="center">??????</Radio>
                            <Radio value="flex-end">??????</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="????????????" >
                        <Radio.Group value={style.justifyContent} onChange={changeDetailData.bind(this, 1, style, 'justifyContent')}>
                            <Radio value="flex-start">??????</Radio>
                            <Radio value="center">??????</Radio>
                            <Radio value="flex-end">??????</Radio>
                            <Radio value="space-between">??????</Radio>
                            <Radio value="space-around">????????????</Radio>
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
            <Form.Item label="????????????" >
                <Radio.Group value={style.itemPositionType} onChange={changeDetailData.bind(this, 1, style, 'itemPositionType')} defaultValue={1}>
                    <Radio value={1}>?????????</Radio>
                    <Radio value={2}>?????????</Radio>
                    <Radio value={3}>?????????</Radio>
                </Radio.Group>
            </Form.Item>
            {style.itemPositionType === 1 && (
                <React.Fragment>
                    <Form.Item label="??????">
                        <InputNumber value={style.columnNum} onChange={changeDetailData.bind(this, 2, style, 'columnNum')} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title='?????????????????????0????????????????????????????????????'>
                                ??????*
                            </Tooltip>
                        }
                    >
                        <InputNumber value={style.rowNum} onChange={changeDetailData.bind(this, 2, style, 'rowNum')} />
                    </Form.Item>
                    <Form.Item label="????????????" >
                        <Radio.Group value={style.scrollType} onChange={changeDetailData.bind(this, 1, style, 'scrollType')}>
                            <Radio value={'row'}>????????????</Radio>
                            <Radio value={'column'}>????????????</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title='??????????????????????????????%?????????????????????????????????'>
                                ?????????*
                            </Tooltip>
                        }
                    >
                        <InputNumber value={style.columnGap} onChange={changeDetailData.bind(this, 2, style, 'columnGap')} />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title='??????????????????????????????%?????????????????????????????????'>
                                ?????????*
                            </Tooltip>
                        }
                    >
                        <InputNumber value={style.rowGap} onChange={changeDetailData.bind(this, 2, style, 'rowGap')} />
                    </Form.Item>
                    <Form.Item label="????????????">
                        <Radio.Group value={style.flexDirection} onChange={changeDetailData.bind(this, 1, style, 'flexDirection')}>
                            <Radio value={'row'}>????????????</Radio>
                            <Radio value={'column'}>????????????</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label={
                            <Tooltip title='????????????????????????'>
                                ????????????*
                            </Tooltip>
                        }
                    >
                        <InputNumber value={style.blankNum} onChange={changeDetailData.bind(this, 2, style, 'blankNum')} />
                    </Form.Item>
                </React.Fragment>
            )}
            {style.itemPositionType === 2 && (
                <React.Fragment>
                    <Form.Item label='????????????' >
                        <Input value={style.width} onChange={changeDetailData.bind(this, 1, style, 'width')} />
                    </Form.Item>
                    <Form.Item label='????????????'>
                        <Input value={style.height} onChange={changeDetailData.bind(this, 1, style, 'height')} />
                    </Form.Item>
                    {style.positionList && style.positionList.map((item,index) =>
                        <React.Fragment key={index}>
                            <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.positionList, index)}>{'?????????' + (index + 1)}</Tag>
                            <Form.Item label='???' >
                                <Input value={item.width} onChange={changeDetailData.bind(this, 1, item, 'width')} />
                            </Form.Item>
                            <Form.Item label='???'>
                                <Input value={item.height} onChange={changeDetailData.bind(this, 1, item, 'height')} />
                            </Form.Item>
                            <Form.Item label='???' >
                                <Input value={item.left} onChange={changeDetailData.bind(this, 1, item, 'left')} />
                            </Form.Item>
                            <Form.Item label='???'>
                                <Input value={item.top} onChange={changeDetailData.bind(this, 1, item, 'top')} />
                            </Form.Item>
                        </React.Fragment>
                    )}
                    <Form.Item label="" style={{margin:'1vh'}}>
                        <Button type="dashed"
                                onClick={addListItem.bind(this, style, 'positionList', {})}>
                            <Icon type="plus" /> ?????????????????????
                        </Button>
                    </Form.Item>
                </React.Fragment>
            )}
            {style.itemPositionType === 3 && (
                <React.Fragment>
                    <Form.Item label='????????????' >
                        <Input value={style.width} onChange={changeDetailData.bind(this, 1, style, 'width')} />
                    </Form.Item>
                    <Form.Item label='????????????'>
                        <Input value={style.height} onChange={changeDetailData.bind(this, 1, style, 'height')} />
                    </Form.Item>
                    {/*<Form.Item label="??????">*/}
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