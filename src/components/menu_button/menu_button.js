import React from "react";
import ComponentBox from "../component_box";
import {Icon} from 'antd';
import {Motion, spring, StaggeredMotion} from "react-motion";
import { createHashHistory } from 'history';
import Rect from "./rect";
import {dataViewUrl} from "../../config";

import cssStyle from "./menu_button.module.css";
import Emitter from "../../common/eventBus";

export default class MenuButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,selected:"总览",showSelect:false,subSelected:0};
        // eslint-disable-next-line no-restricted-globals
        this.href = location.href;
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
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    //切换选择菜单显示隐藏
    changeShow(){
        this.setState({showSelect:!this.state.showSelect});
    }

    //主菜单点击切换页面
    goToPage(menu){
        if(!menu.selected && menu.pageId){
            const {style} = this.props.thisData;
            if(menu.changeType === 3 || (menu.changeType === 2 && style.websocketId)){
                let url;
                if(menu.contentType === 'other'){
                    url = menu.pageId;
                }else{
                    url = (dataViewUrl.indexOf('http') >= 0 ? '':window.location.origin) + dataViewUrl + '#/show/' + menu.pageId +'/'+ this.props.token
                }
                if(menu.changeType === 3){
                    window.open(url);
                }else if(style.websocketId){
                    const sendData = {
                        "sceneId": "",
                        "height": 100,
                        "isIE": menu.coreType == null ? 1 : menu.coreType,
                        "exeName": "0",
                        "layoutType": "url",
                        "url": url,
                        "remark": 0,
                        "leftNum": 0,
                        "topNum": 0,
                        "width": 100
                    };
                    if(global.bodyWebsocket){
                        const {style} = this.props.thisData;
                        global.bodyWebsocket.send(JSON.stringify([{"parameter":JSON.stringify([sendData]),"targetId":style.websocketId + "_All_"}]));
                    }
                }
            }else{
                if(menu.contentType === 'other'){
                    window.location.href = menu.pageId;
                }else{
                    createHashHistory().push('/show/' + menu.pageId +'/'+ this.props.token);
                }
            }
        }
    }

    //副菜单点击切换图层显示
    subClick(item,index){
        Emitter.emit('app_box', {
            type: 'changeLayerShowStatus',
            data: {showList: item.showList, hideList: item.hideList}
        });
        this.setState({subSelected:index});
    }

    getSubDom(menuItem,position,fontSize){
        if(menuItem.hasSub && menuItem.subList){
            const subLength = menuItem.subList.length;
            const {subSelected} = this.state;
            return (
                <div className={cssStyle.subBox}>
                    {
                        menuItem.subList.map((subItem,subIndex) => {
                            return (
                                <div className={`${cssStyle.subItem} ${subSelected === subIndex ? cssStyle.selectedItem : cssStyle.defaultItem}`} key={subIndex}
                                     style={{height:'calc(90% / '+subLength+')',left:(-0.4*subIndex)+'em'}}
                                     onClick={this.subClick.bind(this,subItem,subIndex)}
                                >
                                    <Rect id={"selectedSub"+this.props.thisData.id+subIndex} tilt={fontSize*(0.8/subLength)} key={position.height+fontSize+subLength} className={cssStyle.background}/>
                                    <div className={cssStyle.subFontBox}>
                                        {subIndex+1}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            );
        }else{
            return null;
        }
    }

    render() {
        const {style,position} = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize,'num');
        let defaultStyle = [];
        let selectedMenu = {};
        style.menuList.forEach((menu) => {
            if(menu.pageId && this.href.indexOf(menu.pageId) >= 0){
                menu.selected = true;
                selectedMenu = menu;
            }else{
                menu.selected = false;
            }
            defaultStyle.push({opacity : 0});
        });
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{fontSize:fontSize+'px',color:style.fontColor,opacity}}>
                            {!style.hideHead && (
                                <div className={cssStyle.selectedBox}>
                                    <div className={cssStyle.split}/>
                                    <div className={cssStyle.menuItem}>
                                        <div className={cssStyle.menuItem}>
                                            <Rect id={"selected"+this.props.thisData.id} tilt={fontSize*0.8} key={position.height+fontSize+selectedMenu.name} className={cssStyle.background}/>
                                            <div className={cssStyle.fontBox}>
                                                {selectedMenu.name && selectedMenu.name.split("").map((item,index) =>
                                                    <span key={index} >{item}</span>
                                                )}
                                            </div>
                                        </div>
                                        {this.getSubDom(selectedMenu,position,fontSize)}
                                    </div>
                                    <Icon type={this.state.showSelect ? 'left-circle':'right-circle'} theme="filled" style={{fontSize:(fontSize*1.2)+'px'}} className={cssStyle.arrow} onClick={this.changeShow.bind(this)}/>
                                </div>
                            )}
                            <StaggeredMotion
                                key={defaultStyle.length}
                                defaultStyles={defaultStyle}
                                styles={prevStyles => prevStyles.map((item, i) => {
                                    if(this.state.showSelect || style.showList){
                                        return i === 0
                                            ? {opacity: 1}
                                            : {
                                                opacity: spring(prevStyles[i - 1].opacity)
                                            };
                                    }else{
                                        return i === style.menuList.length - 1
                                            ? {opacity: 0}
                                            : {
                                                opacity: spring(prevStyles[i + 1].opacity)
                                            };
                                    }
                                })}>
                                {interpolatingStyles =>
                                    <div className={cssStyle.menuList} >
                                        {interpolatingStyles.map((item, index) => {
                                            const menu = style.menuList[index];
                                            return (
                                                <div style={{opacity: item.opacity,zIndex:item.opacity===0?'-1':''}} key={index} className={cssStyle.menuItem}>
                                                    <div className={`${cssStyle.menuItem} ${menu.selected ? cssStyle.selectedItem : cssStyle.defaultItem} ${menu.styleType === 1 && cssStyle.noOpacity}`} onClick={this.goToPage.bind(this,menu)}>
                                                        <Rect id={"selected"+this.props.thisData.id+index} tilt={fontSize*0.8} key={position.height+fontSize+menu.name} className={cssStyle.background}/>
                                                        <div className={cssStyle.fontBox}>
                                                            {menu.name.split("").map((item,index) =>
                                                                <span key={index} >{item}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </StaggeredMotion>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}