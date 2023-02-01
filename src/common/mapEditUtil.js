import {Button, Collapse, Form, Icon, Input, InputNumber, Tag} from "antd";
import {addListItem, changeDetailData, deleteListItem} from "./editUtil";
import React from "react";

const { Panel } = Collapse;

export function getClusterPointEdit(style){
    return (
        <Collapse>
            <Panel header="地图经纬度范围" key="1">
                <Form.Item label="xMin">
                    <Input value={style.xMin} onChange={changeDetailData.bind(this, 1, style, 'xMin')} />
                </Form.Item>
                <Form.Item label="xMax">
                    <Input value={style.xMax} onChange={changeDetailData.bind(this, 1, style, 'xMax')} />
                </Form.Item>
                <Form.Item label="yMin">
                    <Input value={style.yMin} onChange={changeDetailData.bind(this, 1, style, 'yMin')} />
                </Form.Item>
                <Form.Item label="yMax">
                    <Input value={style.yMax} onChange={changeDetailData.bind(this, 1, style, 'yMax')} />
                </Form.Item>
            </Panel>
            <Panel header="点位数据设置" key="2">
                <Form.Item label="接口地址">
                    <Input value={style.pointUrl} onChange={changeDetailData.bind(this, 1, style, 'pointUrl')} />
                </Form.Item>
                <Form.Item label="接口条件">
                    <Input value={style.pointParams} onChange={changeDetailData.bind(this, 1, style, 'pointParams')} />
                </Form.Item>
            </Panel>
            <Panel header="打点区域设置" key="3">
                <Form.Item label="宽">
                    <InputNumber value={style.pointAreaWidth} onChange={changeDetailData.bind(this, 2, style, 'pointAreaWidth')} />
                </Form.Item>
                <Form.Item label="高">
                    <InputNumber value={style.pointAreaHeight} onChange={changeDetailData.bind(this, 2, style, 'pointAreaHeight')} />
                </Form.Item>
                <Form.Item label="左">
                    <InputNumber value={style.pointAreaLeft} onChange={changeDetailData.bind(this, 2, style, 'pointAreaLeft')} />
                </Form.Item>
                <Form.Item label="上">
                    <InputNumber value={style.pointAreaTop} onChange={changeDetailData.bind(this, 2, style, 'pointAreaTop')} />
                </Form.Item>
            </Panel>
            <Panel header="聚合图标大小设置" key="4">
                {style.pointSizeList && style.pointSizeList.map((item, index) =>
                    <React.Fragment key={index}>
                        <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.pointSizeList, index)}>
                            {'设置' + (index + 1)}
                        </Tag>
                        <Form.Item label="大于等于" >
                            <InputNumber value={item.more} onChange={changeDetailData.bind(this, 2, item, 'more')} />
                        </Form.Item>
                        <Form.Item label="小与" >
                            <InputNumber value={item.less} onChange={changeDetailData.bind(this, 2, item, 'less')} />
                        </Form.Item>
                        <Form.Item label="大小">
                            <InputNumber value={item.size} onChange={changeDetailData.bind(this, 2, item, 'size')} />
                        </Form.Item>
                    </React.Fragment>
                )}
                <Form.Item label="">
                    <Button type="dashed" onClick={addListItem.bind(this, style, 'pointSizeList', {})}>
                        <Icon type="plus" /> 添加设置分类
                    </Button>
                </Form.Item>
            </Panel>
        </Collapse>
    );
}