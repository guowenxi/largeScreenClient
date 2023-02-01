import React from "react";
import cssStyle from "./controlOne.module.css";
import homeIcon from "../images/home.png";
import nextIcon from "../images/next.png";
import backIcon from "../images/back.png";

export default class controlOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pageIndex: 1};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    changePage(type) {
        const {pageIndex} = this.state;
        if (global.bodyWebsocket) {
            if (type === 1) {
                if (pageIndex === 2) {
                    global.bodyWebsocket.send(JSON.stringify([{
                        "parameter": JSON.stringify({
                            "moduleId": "1632290770605",
                            "type": "changeSelected",
                            "data": {"name": "HOME"}
                        }), "targetId": "b970f1865e4a4d5093f49416e7a4b8d2_All_"
                    }]));
                    this.setState({pageIndex:1});
                }else if(pageIndex === 3){
                    global.bodyWebsocket.send(JSON.stringify([{
                        "parameter": JSON.stringify({
                            "moduleId": "1632293953598",
                            "type": "changeSelected",
                            "data": {"name": "HOME"}
                        }), "targetId": "b970f1865e4a4d5093f49416e7a4b8d2_All_"
                    }]));
                    this.setState({pageIndex:1});
                }else if(pageIndex === 4){
                    global.bodyWebsocket.send(JSON.stringify([{
                        "parameter": JSON.stringify({
                            "moduleId": "1632294651454",
                            "type": "changeSelected",
                            "data": {"name": "HOME"}
                        }), "targetId": "b970f1865e4a4d5093f49416e7a4b8d2_All_"
                    }]));
                    this.setState({pageIndex:1});
                }
            }else if(type === 2){
                if (pageIndex === 2) {
                    global.bodyWebsocket.send(JSON.stringify([{
                        "parameter": JSON.stringify({
                            "moduleId": "1632290770605",
                            "type": "changeSelected",
                            "data": {"name": "HOME"}
                        }), "targetId": "b970f1865e4a4d5093f49416e7a4b8d2_All_"
                    }]));
                    this.setState({pageIndex:1});
                }else if(pageIndex === 3){
                    global.bodyWebsocket.send(JSON.stringify([{
                        "parameter": JSON.stringify({
                            "moduleId": "1632293953598",
                            "type": "changeSelected",
                            "data": {"name": "BACK"}
                        }), "targetId": "b970f1865e4a4d5093f49416e7a4b8d2_All_"
                    }]));
                    this.setState({pageIndex:2});
                }else if(pageIndex === 4){
                    global.bodyWebsocket.send(JSON.stringify([{
                        "parameter": JSON.stringify({
                            "moduleId": "1632294651454",
                            "type": "changeSelected",
                            "data": {"name": "BACK"}
                        }), "targetId": "b970f1865e4a4d5093f49416e7a4b8d2_All_"
                    }]));
                    this.setState({pageIndex:3});
                }
            }else{
                if (pageIndex === 2) {
                    global.bodyWebsocket.send(JSON.stringify([{
                        "parameter": JSON.stringify({
                            "moduleId": "1632290770605",
                            "type": "changeSelected",
                            "data": {"name": "NEXT"}
                        }), "targetId": "b970f1865e4a4d5093f49416e7a4b8d2_All_"
                    }]));
                    this.setState({pageIndex:3});
                }else if(pageIndex === 3){
                    global.bodyWebsocket.send(JSON.stringify([{
                        "parameter": JSON.stringify({
                            "moduleId": "1632293953598",
                            "type": "changeSelected",
                            "data": {"name": "NEXT"}
                        }), "targetId": "b970f1865e4a4d5093f49416e7a4b8d2_All_"
                    }]));
                    this.setState({pageIndex:4});
                }else if(pageIndex === 1){
                    global.bodyWebsocket.send(JSON.stringify([{
                        "parameter": JSON.stringify({
                            "moduleId": "1632359879442",
                            "type": "changeSelected",
                            "data": {"name": 1}
                        }), "targetId": "b970f1865e4a4d5093f49416e7a4b8d2_All_"
                    }]));
                    this.setState({pageIndex:2});
                }
            }
        }
    }

    render() {
        const {pageIndex} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <img alt={''} src={homeIcon} onClick={this.changePage.bind(this, 1)} className={pageIndex===1?cssStyle.readOnly:''}/>
                <img alt={''} src={backIcon} onClick={this.changePage.bind(this, 2)} className={pageIndex===1?cssStyle.readOnly:''}/>
                <img alt={''} src={nextIcon} onClick={this.changePage.bind(this, 3)} className={pageIndex===4?cssStyle.readOnly:''}/>
            </div>
        );
    }
}