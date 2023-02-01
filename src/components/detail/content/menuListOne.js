import React from "react";
import cssStyle from "./menuListOne.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {interactData} from "../../../common/util";

export default class MenuListOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selected:[],isInitData:false,showChild:-1};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps,) {
        if (prevProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            this.initData();
        }
    }

    initData(){
        const { detail } = this.props;
        if(detail && Array.isArray(detail) && detail.length > 0 && !this.state.isInitData){
            let selected = [];
            detail.forEach((item)=>{
                selected.push(item.id);
            });
            this.setState({selected,isInitData:true});
        }
    }

    changSelect(id){
        let {selected} = this.state;
        const index = selected.indexOf(id);
        if(index < 0){
            selected.push(id);
        }else {
            selected.splice(index,1);
        }
        this.setState({selected});
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {id:selected.join(',')});
    }

    changeChildShow(index){
        this.setState({showChild:index});
    }

    getChildContent(item){
        return item.children.map((child,childIndex)=>
            <div key={childIndex} className={cssStyle.childName} onClick={this.childClick.bind(this,child)}>{child.name}</div>
        );
    }

    childClick(item,e){
        e.stopPropagation();
        const { childInteract } = this.props.thisData.style;
        this.interactData(childInteract, item);
    }

    render() {
        const { detail } = this.props;
        const { selected,showChild } = this.state;
        return (
            <div
                className={cssStyle.box} style={this.props.style}
                onMouseLeave={this.changeChildShow.bind(this,-1)}
            >
                {detail && Array.isArray(detail) && detail.map((item,index)=>
                    <div
                        className={cssStyle.menuItemBox}
                        key={index}
                        onMouseEnter={this.changeChildShow.bind(this,index)}
                    >
                        <img alt={''} src={`./images/luao/menu/${selected.indexOf(item.id) >= 0 ? (index+1):(index+1)+'-'+(index+1)}.png`} />
                        <div className={selected.indexOf(item.id) >= 0 ? cssStyle.selectedName:cssStyle.name}>{item.name}</div>
                        <div className={cssStyle.clickBox} onClick={this.changSelect.bind(this,item.id)}/>
                        <div className={`${cssStyle.childBox} ${item.children.length > 5 ? cssStyle.childBoxEx:''}`} style={showChild !== index || selected.indexOf(item.id) < 0 ? {display:'none'}:{}}>
                            {item.children.length > 5 ? (
                                <Scrollbars className='blueScrollbars'>
                                    {this.getChildContent(item)}
                                </Scrollbars>
                            ):this.getChildContent(item)}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}