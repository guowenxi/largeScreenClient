import React from "react";
import {Button, Collapse, Form, Icon, InputNumber, Radio, Tag} from "antd";
import {addListItem, changeDetailData, deleteListItem, setColor} from "./editUtil";
import ColorSelect from "./colorSelect";

const { Panel } = Collapse;

export function lightEdit(header,key){
    const { style } = this.props.data;
    return (
        <Panel header={header} key={key}>
            {style.lightList && style.lightList.map((lightStyle,index)=>
                <React.Fragment key={index}>
                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.lightList, index)}>{'光源' + (index + 1)}</Tag>
                    <Form.Item label="光源类型" >
                        <Radio.Group value={lightStyle.type} onChange={changeDetailData.bind(this, 1, lightStyle, 'type')}>
                            <Radio value={1}>点光源</Radio>
                            <Radio value={2}>环境光</Radio>
                            <Radio value={3}>方向光</Radio>
                            <Radio value={4}>聚光灯</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="光源颜色" >
                        <ColorSelect color={lightStyle.lightColor} setColor={setColor.bind(this, lightStyle, 'lightColor')} />
                    </Form.Item>
                    {lightStyle.type === 1 && (
                        <Form.Item label="光照距离" >
                            <InputNumber value={lightStyle.distance} onChange={changeDetailData.bind(this, 2, lightStyle, 'distance')} />
                        </Form.Item>
                    )}
                    {(lightStyle.type === 1 || lightStyle.type === 3 || lightStyle.type === 4) && (
                        <Collapse >
                            <Panel header="光源位置" key="1">
                                <Form.Item label="x" >
                                    <InputNumber value={lightStyle.x} onChange={changeDetailData.bind(this, 2, lightStyle, 'x')} />
                                </Form.Item>
                                <Form.Item label="y" >
                                    <InputNumber value={lightStyle.y} onChange={changeDetailData.bind(this, 2, lightStyle, 'y')} />
                                </Form.Item>
                                <Form.Item label="z" >
                                    <InputNumber value={lightStyle.z} onChange={changeDetailData.bind(this, 2, lightStyle, 'z')} />
                                </Form.Item>
                            </Panel>
                        </Collapse>
                    )}
                </React.Fragment>
            )}
            <Form.Item label="" style={{margin:'1vh'}}>
                <Button type="dashed"
                        onClick={addListItem.bind(this, style, 'lightList', {})}>
                    <Icon type="plus" /> 添加光源
                </Button>
            </Form.Item>
        </Panel>
    );
}