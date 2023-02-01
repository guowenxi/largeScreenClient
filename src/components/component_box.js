import React from 'react';
import Emitter from '../common/eventBus';

import style from '../common/css/common.module.css';
import {Motion, spring} from "react-motion";

export default class ComponentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.receiveMessage != null){
            this.createEmitter();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        //删除事件监听
        const moduleId = this.props.thisData.moduleId;
        if(this.event && Emitter._events[moduleId]){
            const needRemove = Emitter._events[moduleId];
            if(needRemove[0]){
                needRemove.forEach((item)=>{
                    Emitter.removeListener(moduleId,item);
                })
            }else{
                Emitter.removeListener(moduleId,Emitter._events[moduleId]);
            }
        }
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.getDataTime !== this.props.thisData.getDataTime && this.props.reGetData != null){
            //组件数据源变更时刷新数据
            this.props.reGetData();
        }
    }

    //创建事件监听
    createEmitter(){
        const moduleId = this.props.thisData.moduleId;
        if(this.event){
            Emitter.removeListener(moduleId,Emitter._events[moduleId]);
        }
        this.event = Emitter.on(moduleId,(data) => {this.props.receiveMessage(data)});
    }

    render() {
        const {position} = this.props.thisData;
        return (
            <Motion style={{opacity: spring(this.props.thisData.showStatus ? 1 : 0)}} >
                {({opacity}) => {
                    const partStyle = {opacity:opacity,display:opacity === 0 && this.props.thisData.style.hideNotLoad ? 'none':''};
                    if(opacity === 0){
                        partStyle.zIndex = -1;
                    }else if(this.props.style && this.props.style.zIndex!= null){
                        partStyle.zIndex = this.props.style.zIndex;
                    }else{
                        partStyle.zIndex = position.zIndex
                    }
                    if(!this.props.style || !this.props.style.pointerEvents){
                        partStyle.pointerEvents = this.props.thisData.showStatus?'auto':'none';
                    }
                    return (
                        <div id={this.props.thisData.id} className={`${style.componentBox} ${this.props.className} ${position.rotateY ? style.componentBox3D:''}`} style={{...this.props.style,...partStyle}}>
                            {position.rotateY ? (
                                <div className={style.componentContentBox} style={{transform:position.rotateType === 2 ? `skewY(${position.rotateY}deg)`:`rotateY(${position.rotateY}deg)`,transformOrigin:`${position.transformOriginX ? position.transformOriginX:0} 0%`}}>
                                    {this.props.children}
                                </div>
                            ) : this.props.children}
                        </div>
                    );
                }}
            </Motion>
        );
    }
}
