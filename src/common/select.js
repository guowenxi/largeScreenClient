import React from "react";
import {Icon} from 'antd';
import cssStyle from "./css/select.module.css";
import {Motion, spring} from "react-motion";

export default class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show:false,listHeight:0};
        this.themeList = {
            themeOne : cssStyle.themeOne,
            themeTwo : cssStyle.themeTwo,
        };
    }

    getValue(){
        const {data,valueKey,nameKey,value,placeholder} = this.props;
        if(data && data.length > 0){
            for(let i = 0;i < data.length;i ++){
                if(data[i][valueKey] === value){
                    return data[i][nameKey];
                }
            }
        }
        return placeholder;
    }

    changeListShow(){
        const listHeight = this.state.show ? 0 : 12;
        this.setState({show:!this.state.show,listHeight});
    }

    selectItem(id){
        this.props.onChange(id);
        this.setState({show:false,listHeight:0});
    }

    render() {
        const {data,valueKey,nameKey,value} = this.props;
        return (
            <div style={this.props.style} className={`${this.props.className} ${this.themeList[this.props.theme]}`}>
                <div className={cssStyle.body} onClick={this.changeListShow.bind(this)}>
                    <div className={cssStyle.bodyName}>{this.getValue()}</div>
                    <Icon type="caret-down" className={`${cssStyle.icon} ${this.state.show ? cssStyle.upIcon:''}`}/>
                </div>
                <Motion style={{listHeight:spring(this.state.listHeight)}}>
                    {({listHeight}) =>
                        <div className={cssStyle.selectListBox} style={{maxHeight:listHeight+'em'}}>
                            {data && data.map((item,index) =>
                                <div key={index} className={`${cssStyle.selectItem} ${item[valueKey] === value ? cssStyle.selected:''}`} onClick={this.selectItem.bind(this,item[valueKey])}>{item[nameKey]}</div>
                            )}
                        </div>
                    }
                </Motion>
            </div>
        );
    }
}