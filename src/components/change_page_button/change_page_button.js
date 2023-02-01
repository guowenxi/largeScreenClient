import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./change_page_button.module.css";
import {Motion, spring} from "react-motion";
import iconOne from "./images/back.svg";
import {createHashHistory} from "history";

export default class ChangePageButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false, opacity:0};
        this.iconList = [iconOne];
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

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "showComponent":
                //显示当前组件
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    //页面跳转
    goToPage(pageId){
        if(pageId){
            createHashHistory().push('/show/' + pageId +'/'+ this.props.token);
        }
    }

    render() {
        const {style} = this.props.thisData;
        const iconType = style.iconType ? style.iconType : 0;
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <img alt='' className={cssStyle.button} style={{opacity}} src={this.iconList[iconType]} onClick={this.goToPage.bind(this,style.pageId)}/>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}