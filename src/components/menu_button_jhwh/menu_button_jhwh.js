import React from "react";
import ComponentBox from "../component_box";
import {Motion, spring} from "react-motion";

import cssStyle from "./menu_button_jhwh.module.css";
import {getCompatibleSize, interactData} from "../../common/util";

import dataIcon from "./image/data.png";
import cameraIcon from "./image/camera.png";
import warehouseIcon from "./image/warehouse.png";
import safeIcon from "./image/safe.png";
import equipmentIcon from "./image/equipment.png";
import historyIcon from "./image/history.png";
import warningIcon from "./image/warning.png";
// import floorIcon from "./image/floor.png";
import exitIcon from "./image/exit.png";
import emergencyIcon from "./image/emergency.png";
import paperIcon from "./image/paper.png";
import peopleIcon from "./image/people.png";
import visitorIcon from "./image/visitor.png";
import carIcon from "./image/car.png";
import railIcon from "./image/rail.png";
import backIcon from "./image/back.png";
import showIcon from "./image/show.png";
import hideIcon from "./image/hide.png";
import cameraTwoIcon from "./image/cameraTwo.png";
import smokeDetectorIcon from "./image/smokeDetector.png";
import mephitisIcon from "./image/mephitis.png";
import gasIcon from "./image/gas.png";
import fireHydrantIcon from "./image/fireHydrant.png";
import extinguisherIcon from "./image/extinguisher.png";
import thermalImageryIcon from "./image/thermalImagery.png";
import pressureGageIcon from "./image/pressureGage.png";
import pipelineIcon from "./image/pipeline.png";
import buildingIcon from "./image/building.png";
// import floorTwoIcon from "./image/floorTwo.png";
import backTwoIcon from "./image/backTwo.png";
import preventionIcon from "./image/prevention.png";


export default class MenuButtonJhwh extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,showMenu:true,selectedOne:0,selectedListOne:['visitor','people','car','rail','building'],selectedTwo:0,showType:1};
        this.interactData = interactData.bind(this);
        this.keyParams = {};
        this.menuOneList = [{name:'??????',img:dataIcon,index:0},{name:'??????',img:cameraIcon,index:1},{name:'??????',img:warehouseIcon,index:2},
            {name:'??????',img:safeIcon,index:3},{name:'?????????',img:preventionIcon,index:17},{name:'??????',img:emergencyIcon,index:15},{name:'????????????',img:equipmentIcon,index:4,key:'outdoorEquipment'},{name:'????????????',img:pipelineIcon,index:16,key:'pipeline'},
            {name:'????????????',img:historyIcon,index:5},{name:'????????????',img:warningIcon,index:6,key:'warningLevel'},{name:'????????????',img:exitIcon,index:8},
            {name:'?????????',img:paperIcon,index:9,key:'paper'},{name:'??????',img:peopleIcon,index:10,key:'people'},{name:'??????',img:visitorIcon,index:11,key:'visitor'},
            {name:'??????',img:carIcon,index:12,key:'car'},{name:'????????????',img:railIcon,index:13,key:'rail'},{name:'??????',img:buildingIcon,index:18,key:'building'},{name:'??????',img:backIcon,index:14}];
        this.menuTwoList = [{name:'??????',img:cameraTwoIcon,index:0,key:'camera',id:49},{name:'??????',img:smokeDetectorIcon,index:1,key:'smokeDetector',id:43},{name:'????????????',img:mephitisIcon,index:2,key:'mephitis',id:41},
            {name:'????????????',img:gasIcon,index:3,key:'gas',id:42},{name:'?????????',img:fireHydrantIcon,index:4,key:'fireHydrant',id:44},{name:'?????????',img:extinguisherIcon,index:5,key:'extinguisher',id:45},
            {name:'?????????',img:thermalImageryIcon,index:6,key:'thermalImagery',id:47},{name:'???????????????',img:pressureGageIcon,index:7,key:'heatDetector',id:67},{name:'??????',img:backTwoIcon,index:10,key:''}];
    }

    //????????????????????????
    componentDidMount() {
        global.nowShowPage = 0;
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //???????????????????????????
    componentWillUnmount() {
    }

    //??????????????????
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //?????????????????????
                this.animateOn();
                break;
            case "showComponent":
                break;
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                if(data.data.warehouseId && this.state.showType === 2){
                    const {selectedTwo} = this.state;
                    // this.clickMenuTwo(this.menuTwoList[selectedTwo],selectedTwo);
                    //??????????????????????????????
                    const {selectedListOne} = this.state;
                    this.sendIconShowMessage(selectedListOne.concat([this.menuTwoList[selectedTwo].key]),{warehouseId:this.keyParams.warehouseId});
                    // this.sendIconShowMessage([this.menuTwoList[selectedTwo].key],{warehouseId:this.keyParams.warehouseId});
                }
                break;
            case "changeSelected":
                if(data.data.type === 'changePage'){
                    this.clickMenuOne(this.menuOneList[data.data.id],data.data.id);
                }else if(data.data.type === 'closeWarehouse'){
                    this.clickMenuTwo(null,10);
                }else if(data.data.type === 'clickAgain'){
                    const {selectedOne} = this.state;
                    this.clickMenuOne(this.menuOneList[selectedOne],selectedOne);
                }else if(data.data.type === 'newEmergency' || data.data.type === 'showEmergency'){
                    if(this.state.selectedOne !== 15){
                        this.clickMenuOne({name:'??????',index:15},15);
                    }
                }else{
                    this.setState({showType:2});
                    const { equipmentInteract } = this.props.thisData.style;
                    this.interactData(equipmentInteract);
                    if(data.data.id){
                        //????????????????????????????????????
                        for(let i = 0;i < this.menuTwoList.length;i ++){
                            if(this.menuTwoList[i].id === data.data.id){
                                this.clickMenuTwo(this.menuTwoList[i],i);
                                break;
                            }
                        }
                    }else if(data.data.warehouseId){
                        //??????????????????????????????????????????
                        this.clickMenuTwo(this.menuTwoList[0],0,data.data.warehouseId);
                    }
                }
                break;
            default:
                break;
        }
    }

    //??????????????????
    animateOn(){
        this.setState({opacity:1});
    }

    //????????????????????????
    changeMenuShow(){
        this.setState({showMenu:!this.state.showMenu});
    }

    //????????????
    clickMenu(menu,index){
        if(this.state.showType === 1){
            this.clickMenuOne(menu,index);
        }else{
            this.clickMenuTwo(menu,index);
        }
    }

    //????????????????????????
    clickMenuOne(menuD,index){
        // const {selectedListOne} = this.state;
        let menu;
        for(let i = 0;i < this.menuOneList.length;i ++){
            if(index === this.menuOneList[i].index){
                menu = this.menuOneList[i];
            }
        }
        switch (index) {
            case 0:
                //??????
                global.nowShowPage = index;
                this.changeMode(1);
                this.changeWarehouseSelect(false);
                this.closeHistory();
                this.closeEscapeRoute();
                this.changeIconShow();
                const { dataInteract } = this.props.thisData.style;
                this.interactData(dataInteract);
                this.setState({selectedOne:index});
                break;
            case 1:
                //??????
                this.closeHistory();
                this.closeEscapeRoute();
                const { cameraInteract } = this.props.thisData.style;
                this.interactData(cameraInteract);
                break;
            case 2:
                //??????
                global.nowShowPage = index;
                this.changeMode(1);
                this.changeWarehouseSelect(true);
                this.closeHistory();
                this.closeEscapeRoute();
                this.changeIconShow();
                // this.sendIconShowMessage([]);
                const { warehouseInteract } = this.props.thisData.style;
                this.interactData(warehouseInteract);
                this.setState({selectedOne:index});
                break;
            case 3:
                //??????
                this.closeHistory();
                this.closeEscapeRoute();
                const { safeInteract } = this.props.thisData.style;
                this.interactData(safeInteract);
                break;
            case 17:
                //?????????
                this.closeHistory();
                this.closeEscapeRoute();
                const { preventionInteract } = this.props.thisData.style;
                this.interactData(preventionInteract);
                break;
            // case 4:
                //????????????
                // if(this.state.selectedOne !== 0){
                //     return;
                // }
                // const {selectedTwo} = this.state;
                // this.clickMenuTwo(this.menuTwoList[selectedTwo],selectedTwo);
                // const { equipmentInteract } = this.props.thisData.style;
                // this.interactData(equipmentInteract);
                // this.setState({showType:2});
                // break;
            case 5:
                //????????????
                global.nowShowPage = index;
                this.changeMode(1);
                this.changeWarehouseSelect(false);
                this.closeHistory();
                this.closeEscapeRoute();
                this.sendIconShowMessage([]);
                const { historyInteract } = this.props.thisData.style;
                this.interactData(historyInteract);
                this.setState({selectedOne:index});
                break;
            case 8:
                //????????????
                global.nowShowPage = index;
                this.changeMode(2);
                this.changeWarehouseSelect(false);
                this.closeHistory();
                this.closeEscapeRoute();
                this.sendIconShowMessage([]);
                const { simulateEmergencyInteract } = this.props.thisData.style;
                this.interactData(simulateEmergencyInteract);
                this.setState({selectedOne:index});
                break;
            case 9://?????????
                global.nowShowPage = index;
                this.changeMode(1);
                this.changeWarehouseSelect(false);
                this.closeHistory();
                this.closeEscapeRoute();
                this.changeIconShow();
                // this.sendIconShowMessage(selectedListOne.concat(['paper']),null,true);
                const { paperInteract } = this.props.thisData.style;
                this.interactData(paperInteract);
                this.setState({selectedOne:index});
                break;
            case 4://????????????
            case 6://????????????
            case 13://????????????
            case 16://????????????
                if(this.state.selectedOne === 8){
                    return;
                }
                this.changeIconShow(menu.key);
                break;
            case 10://??????
            case 11://??????
            case 12://??????
                if(this.state.selectedOne === 8){
                    return;
                }
                this.changeIconShow(menu.key);
                break;
            case 18://??????
                this.changeIconShow(menu.key);
                break;
            case 14:
                //??????
                const {selectedOne} = this.state;
                // if([0,2].indexOf(selectedOne) >= 0){
                // }
                this.clickMenuOne(this.menuOneList[selectedOne],selectedOne);
                break;
            case 15:
                //??????
                global.nowShowPage = index;
                this.changeMode(1);
                this.changeWarehouseSelect(false);
                this.closeHistory();
                this.closeEscapeRoute();
                // this.sendIconShowMessage(['camera','warning']);
                this.changeIconShow();
                const { emergencyInteract } = this.props.thisData.style;
                this.interactData(emergencyInteract);
                this.setState({selectedOne:index});
                break;
            default:
        }
    }

    //????????????????????????
    changeIconShow(key){
        const {selectedListOne} = this.state;
        if(key){
            const selectedIndex = selectedListOne.indexOf(key);
            if(selectedIndex >= 0){
                selectedListOne.splice(selectedIndex,1);
            }else{
                selectedListOne.push(key);
            }
        }
        this.setState({selectedListOne});
        this.sendIconShowMessage(selectedListOne);
    }

    //??????????????????????????????
    sendIconShowMessage(list,params){
        let sendList = [];
        if(global.nowShowPage === 15){
            list.forEach((item)=>{
                if(item !== 'warningLevel'){
                    sendList.push(item);
                }
            })
        }else{
            sendList = list
        }
        if(sendList.indexOf('people') >= 0){
            if(sendList.indexOf('leader') < 0){
                sendList.push('leader');
            }
        }else{
            const leaderIndex = sendList.indexOf('leader');
            if(leaderIndex >= 0){
                sendList.splice(leaderIndex,1);
            }
        }
        if(global.nowShowPage === 9 && sendList.indexOf('paper') < 0){
            sendList = sendList.concat(['paper']);
        }
        const { changeIconShowInteract } = this.props.thisData.style;
        const sendData = {
            type : 'changeIconShow',
            data : sendList,
            ...params
        };
        this.interactData(changeIconShowInteract,sendData);
    }

    //????????????
    closeHistory(){
        const { closeHistoryInteract } = this.props.thisData.style;
        const sendData = {
            type : 'closeHistory'
        };
        this.interactData(closeHistoryInteract,sendData);
    }
    //??????????????????
    closeEscapeRoute(){
        const { closeEscapeRouteInteract } = this.props.thisData.style;
        const sendData = {
            type : 'closeEscapeRoute'
        };
        this.interactData(closeEscapeRouteInteract,sendData);
    }
    //????????????
    changeMode(data){
        const { changeModeInteract } = this.props.thisData.style;
        const sendData = {
            type : 'changeMode',
            data
        };
        this.interactData(changeModeInteract,sendData);
    }

    //????????????????????????
    changeWarehouseSelect(data){
        // const { changeWarehouseSelectInteract } = this.props.thisData.style;
        // const sendData = {
        //     type : 'warehouseSelect',
        //     data
        // };
        // this.interactData(changeWarehouseSelectInteract,sendData);
    }

    //????????????????????????
    clickMenuTwo(menu,index,warehouseId){
        if(index === 10){
            //????????????
            const { backInteract } = this.props.thisData.style;
            this.interactData(backInteract);
            this.setState({showType:1});
            const {selectedOne} = this.state;
            this.clickMenuOne(this.menuOneList[selectedOne],selectedOne);
        }else{
            //??????????????????
            const { menuTwoInteract } = this.props.thisData.style;
            this.interactData(menuTwoInteract, {...menu,warehouseId});
            this.setState({selectedTwo:index});
        }
    }

    getMenuList(menuList,selected,selectedList){
        let menuDom = [<div key={'line'} className={cssStyle.menuLine} />];
        menuList.forEach((menu,index)=>{
            menuDom.push(
                <div
                    key={'menu_'+index}
                    className={`${cssStyle.menuBox} ${selected === menu.index || (([0,2,9].indexOf(selected) >= 0||(selected === 15 && menu.index !== 6)) && selectedList.indexOf(menu.key) >= 0) ? cssStyle.selectedMenu:''}`}
                    onClick={this.clickMenu.bind(this,menu,menu.index)}
                >
                    <img src={menu.img} alt={''} />
                    <div>{menu.name}</div>
                </div>
            );
            menuDom.push(
                <div key={'line_'+index} className={cssStyle.menuLine} />
            );
        });
        return menuDom;
    }

    render() {
        const {style} = this.props.thisData;
        const {opacity,showMenu,selectedOne,selectedListOne,selectedTwo,showType} = this.state;
        const fontSize = getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(showMenu ? opacity:0),top:spring(showMenu ? 0 : 82)}}>
                    {({opacity,top}) =>
                        <div className={cssStyle.box} style={{fontSize:fontSize,top:top+'%'}}>
                            <div className={`${cssStyle.menuListBox} ${showType === 2 ? cssStyle.menuListTwoBox:''}`} style={{fontSize:fontSize,opacity}}>
                                {showType === 1 ? this.getMenuList(this.menuOneList,selectedOne,selectedListOne) : this.getMenuList(this.menuTwoList,selectedTwo,[])}
                            </div>
                            <img alt={''} src={showMenu ? hideIcon : showIcon} onClick={this.changeMenuShow.bind(this)} className={cssStyle.changeShowIcon} />
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}