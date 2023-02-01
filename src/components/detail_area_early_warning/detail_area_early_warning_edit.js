import React from 'react';
import {Form} from 'antd';
import {getDetailEdit} from "../../common/detailUtil";

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

export default class DetailAreaEarlyWarningEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getDetailEdit = getDetailEdit.bind(this);
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    render() {
        const {style} = this.props.data;
        return (
            <Form {...formItemLayout}>
                {this.getDetailEdit(style)}
            </Form>
        );
    }
}
