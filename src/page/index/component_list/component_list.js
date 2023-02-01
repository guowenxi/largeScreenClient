import React from 'react';
import {Motion, spring} from "react-motion";
import { Modal } from 'antd';

import style from './component_list.module.css';
import {Scrollbars} from "react-custom-scrollbars";
import {fileUrl} from "../../../config";
const { confirm } = Modal;

export default class ComponentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {left: 0, componentList: JSON.parse(JSON.stringify(props.componentList)), newTop:0, isPressed:false};
        this.oneHeight = window.innerHeight*0.1;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    //隐藏显示列表
    changeShow(){
        if(this.state.left === 0){
            this.setState({left:-10});
        }else{
            this.setState({left:0});
        }
    }

    drag(id,index,e){
        e.stopPropagation();
        this.lastPress = id;    //点击的组件id
        const lastPressIndex = index;    //点击时组件的顺序
        let oldIndex = index;
        let newIndex;
        const _this = this;
        //鼠标按下时位置
        const disY = e.pageY;
        //鼠标按下时组件y轴位置
        const view = document.getElementById(id+'_menu');
        const iTop = view.offsetTop;
        this.setState({isPressed:true,newTop:iTop}); //更新鼠标按下状态
        this.props.saveNowData();   //记录当前布局数据
        document.onmousemove = function (event){
            //鼠标新位置
            let newY = event.pageY;
            //top偏移量
            let iT = newY - disY;
            const newTop = iTop + iT > 0 ? iTop + iT : 0;
            newIndex = Math.round(newTop/_this.oneHeight);
            if(newIndex >= _this.props.componentList.length){
                newIndex = _this.props.componentList.length - 1;
            }
            if(oldIndex !== newIndex){
                _this.props.changeOrder(oldIndex,newIndex); //更新排序
                oldIndex = newIndex;
            }
            _this.setState({newTop:newTop});
        };
        document.onmouseup = function ()
        {
            _this.setState({isPressed:false}); //更新鼠标按下状态
            if(lastPressIndex !== newIndex){
                //保存旧数据到历史记录
                _this.props.saveHistory();
            }
            document.onmousemove = null;
            document.onmouseup = null;
        };
    }

    deleteConfirm(index,e){
        e.stopPropagation();
        confirm({
            title: '确定要删除该组件吗?',
            content: '',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                this.props.deleteComponent(index);
            },
            onCancel() {
            },
        });
    }

    render() {
        return (
                <Motion style={{left: spring(this.state.left)}} >
                    {({left}) =>
                        <div className={this.props.className} style={{left:left+'%'}}>
                            <Scrollbars>
                                {this.props.componentList.map((item,index) => {
                                    let top;
                                    if(item.id === this.lastPress && this.state.isPressed){
                                        top = this.state.newTop;
                                    }else{
                                        top = this.oneHeight*index;
                                    }
                                    return (
                                        <Motion key={item.id} style={{top:spring(top)}}>
                                            {({top}) =>
                                                <div id={item.id+'_menu'} className={style.itemBox} style={{top:top+'px'}} onClick={this.props.onPartClick.bind(this,index)}>
                                                    {item.coverImg ? <img alt='' src={fileUrl + '/download/' + item.coverImg} />:''}
                                                    <div className={`${style.dragItem} ${style.dragMove}`} onMouseDown={this.drag.bind(this,item.id,index)}>
                                                        <div className={this.props.selectedIndex === index ? style.selected : ''} />
                                                    </div>
                                                    <div className={style.deleteItem} onClick={this.deleteConfirm.bind(this,index)}>X</div>
                                                </div>
                                            }
                                        </Motion>
                                    );
                                })}
                            </Scrollbars>
                            <div className={style.changeItem} onClick={this.changeShow.bind(this)}>{this.state.left !== 0 ? '>>':'<<'}</div>
                            <div className={style.saveButton} onClick={this.props.saveListData}>保存</div>
                        </div>
                    }
                </Motion>
        );
    }
}
