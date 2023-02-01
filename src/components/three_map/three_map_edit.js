import React from 'react';
import {Form, Collapse, InputNumber, Tooltip} from 'antd';
import {changeDetailData} from "../../common/editUtil";
import {lightEdit} from "../../common/threeEditUtil";

const { Panel } = Collapse;

export default class ThreeMapEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.lightEdit = lightEdit.bind(this);
        // this.colorItem = {start:''};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const formItemLayout24 = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="样式设置" key="1">
                    </Panel>
                    <Panel header="渲染区域设置" key="2">
                        <Form.Item
                            label={
                                <Tooltip title="三维场景显示范围控制系数，系数越大，显示的范围越大">
                                    S*
                                </Tooltip>
                            }
                        >
                            <InputNumber value={style.s} onChange={changeDetailData.bind(this, 2, style, 's')} />
                        </Form.Item>
                    </Panel>
                    <Panel header="相机位置" key="3">
                        <Form.Item label="x">
                            <InputNumber value={style.cameraX} onChange={changeDetailData.bind(this, 2, style, 'cameraX')} />
                        </Form.Item>
                        <Form.Item label="y">
                            <InputNumber value={style.cameraY} onChange={changeDetailData.bind(this, 2, style, 'cameraY')} />
                        </Form.Item>
                        <Form.Item label="z">
                            <InputNumber value={style.cameraZ} onChange={changeDetailData.bind(this, 2, style, 'cameraZ')} />
                        </Form.Item>
                    </Panel>
                    {this.lightEdit('光源设置',4)}
                    {/*<Panel header="其他设置" key="5">*/}
                    {/*    <Form.Item label="数据键名">*/}
                    {/*        <Input value={style.key} onChange={changeDetailData.bind(this, 1, style, 'key')} />*/}
                    {/*    </Form.Item>*/}
                    {/*</Panel>*/}
                </Collapse>
            </Form>
        );
    }
}
