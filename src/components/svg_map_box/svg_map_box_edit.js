import React from 'react';
import {Form, Collapse, Select} from 'antd';
import {changeDetailData} from "../../common/editUtil";
import {getColorList} from "../../common/nameNumEditUtil";
import SvgMapTypeOneEdit from "./svg_map_type_one/svg_map_type_one_edit";

const {Panel} = Collapse;

export default class SvgMapBoxEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorList = getColorList.bind(this);
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
        const {style} = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse>
                    <Panel header="展示内容类型设置" key="1">
                        <Form.Item label="展示类型">
                            <Select value={style.mapType} onChange={changeDetailData.bind(this, 2, style, 'mapType')}>
                                <Select.Option value={'svg_map_type_one'}>类型一</Select.Option>
                            </Select>
                        </Form.Item>
                    </Panel>
                </Collapse>
                {style.mapType === 'svg_map_type_one' && <SvgMapTypeOneEdit layerList={this.props.layerList} componentList={this.props.componentList} token={this.props.token} data={this.props.data} saveNowDataToHistory={this.props.saveNowDataToHistory.bind(this)} updateData={this.props.updateData.bind(this)}/>}
            </Form>
        );
    }
}
