import React from 'react';
import { Form, Collapse, Input, Switch } from 'antd';
import { changeDetailData } from "../../common/editUtil";
import { getColorList } from "../../common/nameNumEditUtil";

const { Panel } = Collapse;

export default class GalleryEdit extends React.Component {
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
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse>
                    <Panel header="展示设置" key="1">
                        <Form.Item label="图片键名">
                            <Input value={style.imgKey} onChange={changeDetailData.bind(this, 1, style, 'imgKey')} />
                        </Form.Item>
                        <Form.Item label="开启倒影">
                            <Switch checked={style.openReflect}
                                onChange={changeDetailData.bind(this, 2, style, 'openReflect')} />
                        </Form.Item>
                        <Form.Item label="间隔时间">
                            <Input value={style.interval} onChange={changeDetailData.bind(this, 1, style, 'interval')} />
                        </Form.Item>
                        <Form.Item label="显示分页">
                            <Switch checked={style.showPaginition}
                                onChange={changeDetailData.bind(this, 2, style, 'showPaginition')} />
                        </Form.Item>
                    </Panel>
                </Collapse>
            </Form>
        );
    }
}
