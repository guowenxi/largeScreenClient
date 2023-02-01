import React from "react";
import cssStyle from "./event_emergency.module.css";

import EventEmergencyResponse from "./event_emergency_response";

import "./map_window.css";

export default class EventEmergency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false};
        this.refDom = React.createRef();
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

    showEmergencyResponse(){
        this.setState({showEdit:true});
    }

    hideEmergencyResponse(type){
        this.setState({showEdit:false});
        if(type){
            this.props.hideWindow(true);
        }
    }

    render() {
        const {attributes} = this.props;
        return (
            <div ref={this.refDom} className={cssStyle.box} style={this.props.style}>
                <div className={cssStyle.line}>
                    <div className={cssStyle.title}>事件名称：</div>
                    <div className={cssStyle.content}>{attributes.title}</div>
                </div>
                <div className={cssStyle.line}>
                    <div className={cssStyle.title}>事发时间：</div>
                    <div className={cssStyle.content}>{attributes.incidentTime}</div>
                </div>
                <div className={cssStyle.line}>
                    <div className={cssStyle.title}>事发地点：</div>
                    <div className={cssStyle.content}>{attributes.incidentAddress}</div>
                </div>
                <div className={cssStyle.line}>
                    <div className={cssStyle.title}>参与人数：</div>
                    <div className={cssStyle.content}>{attributes.joinNum}</div>
                </div>
                <div className={cssStyle.button} onClick={this.showEmergencyResponse.bind(this)}>一键响应</div>
                {this.state.showEdit && <EventEmergencyResponse attributes={attributes} mapId={this.props.mapId} token={this.props.token} hideEmergencyResponse={this.hideEmergencyResponse.bind(this)}/>}
            </div>
        );
    }
}