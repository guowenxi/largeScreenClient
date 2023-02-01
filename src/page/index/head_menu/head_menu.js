import React from 'react';
import Emitter from '../../../common/eventBus';
import {Components} from "./config"
import {dataViewUrl} from '../../../config';

export default class HeadMenu extends React.Component {
    constructor(props) {
        super(props);
        // 通过config.js配置组件列表。默认不选中菜单类型，组件类型选择首个。
        this.state = {data: Components, menuSelectedIndex: -1, componentTypeSelectedIndex: 0};
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    // 选择菜单类型（如图表、特殊……）
    menuClick(index) {
        if (this.state.menuSelectedIndex === index) {
            this.setState({menuSelectedIndex: -1});
        } else {
            this.setState({menuSelectedIndex: index, componentTypeSelectedIndex: 0});
        }
    }

    // 选择组件类型列表（如柱图、折线图……）
    getMenuList() {
        if (this.state.menuSelectedIndex >= 0) {
            return this.state.data[this.state.menuSelectedIndex].menuList.map((item, index) =>
                <div className={`component-type-item ${index === this.state.componentTypeSelectedIndex ? 'component-type-active' : ''}`}
                     key={index} onClick={this.changeComponentList.bind(this,index)}>{item.name}</div>
            );
        } else {
            return '';
        }
    }

    // 选择组件列表（如柱图1、柱图2……）
    getComponentList() {
        if (this.state.menuSelectedIndex >= 0 && this.state.componentTypeSelectedIndex >= 0 && this.state.data[this.state.menuSelectedIndex].menuList[this.state.componentTypeSelectedIndex]) {
            return this.state.data[this.state.menuSelectedIndex].menuList[this.state.componentTypeSelectedIndex].components.map((item, index) =>
                <div className='component-item' key={index}
                     onClick={this.componentSelect.bind(this, item)}>{item.name}</div>
            );
        } else {
            return '';
        }
    }

    //
    changeComponentList(index){
        this.setState({componentTypeSelectedIndex:index});
    }

    // 选择组件并发消息给App.js进行展示配置
    componentSelect(item) {
        Emitter.emit("app_box", {type: 'addView', moduleName: item.moduleName});
        this.setState({menuSelectedIndex: -1});
    }

    previewPage(){
        window.open(dataViewUrl+'#/show/'+this.props.pageId+'/'+this.props.token);
    }

    render() {
        const menuListBoxStyle = {
            display: this.state.menuSelectedIndex >= 0 ? 'block' : 'none',
            left: this.state.menuSelectedIndex * 10 + 'vh'
        };
        return (
            <div className={this.props.className}>
                {this.state.data.map((item, index) =>
                    <div key={index} className='head-menu-item'
                         style={{backgroundColor: this.state.menuSelectedIndex === index ? '#333' : ''}}
                         onClick={this.menuClick.bind(this, index)}>{item.name}</div>
                )}
                <div className='menu-list-box' style={menuListBoxStyle}>
                    <div className='component-type-box'>{this.getMenuList()}</div>
                    <div className='component-list-box'>{this.getComponentList()}</div>
                </div>
                <div className='preview' onClick={this.previewPage.bind(this)}>预览</div>
            </div>
        );
    }
}
