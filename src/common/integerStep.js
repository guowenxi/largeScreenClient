import React from 'react';
import { Row, Col, InputNumber, Slider } from 'antd';


export default class IntegerStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const { inputValue } = this.props;
        return (
            <Row className={this.props.className}>
                <Col span={20}>
                    <Slider
                        step={this.props.step}
                        min={this.props.min}
                        max={this.props.max}
                        onChange={this.props.onChange}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                    />
                </Col>
                <Col span={4}>
                    <InputNumber
                        min={this.props.min}
                        max={this.props.max}
                        style={{ marginLeft: 16 }}
                        value={inputValue}
                        onChange={this.props.onChange}
                    />
                </Col>
            </Row>
        );
    }
}