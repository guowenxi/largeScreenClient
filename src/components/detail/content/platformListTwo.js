import React from "react";
import {Icon} from "antd";
import cssStyle from './platformListTwo.module.css';
import {Scrollbars} from "react-custom-scrollbars";
import {interactData} from "../../../common/util";

export default class PlatformListTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {platFormList:[]};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.initList();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime){
            this.initList();
        }
    }

    initList(){
        const {detail} = this.props;
        if(detail && Array.isArray(detail)){
            let platFormList = [];
            detail.forEach((parentItem)=>{
                if(!parentItem.parentId){
                    parentItem.child = [];
                    parentItem.showChild = true;
                    detail.forEach((childItem)=>{
                        if(childItem.parentId === parentItem.id){
                            parentItem.child.push(childItem);
                        }
                    });
                    platFormList.push(parentItem);
                }
            });
            this.setState({platFormList});
        }
    }

    changeChildShow(item,e){
        e.stopPropagation();
        if(item.child.length > 0){
            item.showChild = !item.showChild;
        }
        this.setState({});
    }

    rowClick(item){
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }

    render() {
        const {platFormList} = this.state;
        return (
            <div style={this.props.style} className={`${cssStyle.box}`} >
                <div className={cssStyle.head}>
                    <div className={cssStyle.row}>
                        <div className={cssStyle.name}>数据来源</div>
                        <div className={cssStyle.number}>数量</div>
                    </div>
                </div>
                <div className={cssStyle.content}>
                    <Scrollbars className={'blueScrollbars'}>
                        {platFormList.map((item,index)=>
                            <React.Fragment key={index}>
                                <div className={`${cssStyle.row} ${item.child.length === 0 ? cssStyle.noChild :''}`} onClick={this.rowClick.bind(this,item)}>
                                    <div className={cssStyle.name}>
                                        <Icon type={item.showChild && item.child.length > 0 ? 'caret-down':'caret-right'} className={cssStyle.icon} onClick={this.changeChildShow.bind(this,item)} />
                                        {item.name}
                                    </div>
                                    <div className={cssStyle.number}>{item.number}</div>
                                </div>
                                {item.child && item.showChild && item.child.map((child,childIndex)=>
                                    <div className={`${cssStyle.row} ${cssStyle.childRow}`} key={childIndex} onClick={this.rowClick.bind(this,child)}>
                                        <div className={cssStyle.childName}>{child.name}</div>
                                        <div className={cssStyle.number}>{child.number}</div>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </Scrollbars>
                </div>
            </div>
        );
    }
}