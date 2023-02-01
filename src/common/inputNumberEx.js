import React from 'react';
import {InputNumber} from 'antd';


export default class InputNumberEx extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    change(value){
        const result = `${value}`.replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        this.props.onChange(result);
    }

    render() {
        return (
            <InputNumber value={this.props.value} max={this.props.max} min={this.props.min} onChange={this.change.bind(this)} formatter={value => `${value}`.replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".")}/>
        );
    }
}
