import React from "react";
import {Icon} from 'antd';
import ComponentBox from "../component_box";
import Emitter from "../../common/eventBus";

import cssStyle from "./popup_detail.module.css";
import {Motion, spring} from "react-motion";

export default class PopupDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false};
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "showComponent":
                //显示当前组件
                let {src} = this.props.thisData.style;
                if(src.indexOf('?') < 0){
                    src += '?';
                }else{
                }
                for(let key in data.data){
                    src += '&' + key + '=' + data.data[key];
                }
                this.setState({src,show:true});
                this.changeThisShow(true);
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
    }

    //当前组件显示隐藏
    changeThisShow(type){
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: {showStatus: type, id: this.props.thisData.id}
        });
        if(type === false){
            this.setState({show:false});
            //若为关闭则清空筛选数据
            setTimeout(() => {
                this.setState({src:''});
            },500)
        }
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.size);
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{top: spring(this.state.show ? 0 : 100)}} >
                    {({top}) => {
                        return (
                            <div className={cssStyle.detailBox} style={{top:-top+'%'}}>
                                <iframe title="navigation" className={cssStyle.iframeBox} src={this.state.src} style={{zIndex:this.props.editType ? 0 : ''}}/>
                                <Icon type="close" className={cssStyle.close} onClick={this.changeThisShow.bind(this,false)} style={{color:style.color,fontSize:fontSize,top:style.gap+'em',right:style.gap+'em'}}/>
                            </div>
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}