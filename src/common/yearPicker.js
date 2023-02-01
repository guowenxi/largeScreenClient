import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/zh_CN";

class YearPicker extends React.Component {
    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || {})
            };
        }
        return null;
    }
    constructor(props) {
        super(props);
        // console.log('年份选择', value, props);
        this.state = {
            open: false
        };
    }
    triggerChange = (date,changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(date,changedValue);
        }
    };
    changeRender = v => {
        // console.log("changeRender_v.m", v);
        this.setState(
            {
                open: false
            },
            () => this.triggerChange(v,moment(v).format('YYYY'))
        );
    };

    clearValue = () => {
        this.triggerChange();
    };

    setOpenState = () => {
        this.setState({
            open: !this.state.open
        });
    };

    componentDidMount = () => {
    };

    render() {
        const { open } = this.state;
        const { value, style } = this.props;
        return (
            <DatePicker
                mode="year"
                format="YYYY"
                dropdownClassName={this.props.dropdownClassName}
                placeholder={this.props.placeholder}
                value={value ? moment(value) : null}
                onPanelChange={this.changeRender}
                onOpenChange={this.setOpenState}
                onChange={this.clearValue} //点击清除按钮的回调
                open={open}
                style={{ ...style }}
                size={this.props.size}
                locale={locale}
                defaultPickerValue={this.props.defaultPickerValue}
            />
        );
    }
}

export default YearPicker;