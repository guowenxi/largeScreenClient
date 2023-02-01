import React from 'react';
import {Form} from 'antd';
import {getColorList,getRingStyleEdit} from "../../common/nameNumEditUtil";

export default class SvgMapPointEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorList = getColorList.bind(this);
        this.getRingStyleEdit = getRingStyleEdit.bind(this);
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
                {this.getRingStyleEdit(style)}
            </Form>
        );
    }
}
